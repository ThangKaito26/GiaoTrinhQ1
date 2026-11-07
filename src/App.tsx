/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import {
  Bookmark,
  Search,
  Volume2,
  Loader2,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  BookOpen,
  LayoutGrid,
  List,
  ExternalLink,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  TextbookDataRaw,
  ExercisesDataRaw,
  VocabItem,
  ExerciseItem,
  BookmarkedWord,
  SavedExerciseAttempt,
  AIResult,
  DialogueLine,
  LessonExercisesRaw,
} from './types/textbook';
import {
  LESSON_SUPPLEMENTARY_DATA,
  SUPPLEMENTARY_EXERCISES_BY_LESSON,
  EXERCISE_PAGE_MAP,
} from './data/dialoguesAndGrammar';
import {
  normalizeBook2TextbookData,
  normalizeBook3TextbookData,
  expandLessonGroupedExercises,
} from './data/book2And3Data';
import { bookAudio, PlayTrackItem } from './utils/audioEngine';
import { InteractiveBookReader } from './components/InteractiveBookReader';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { DictionaryModal } from './components/DictionaryModal';
import { SmartPracticeDashboard } from './components/SmartPracticeDashboard';
import { VocabularyNotebook } from './components/VocabularyNotebook';
import { PinyinSectionView } from './components/PinyinSectionView';
import {
  WordVisualIllustration,
  detectWordCategory,
  buildHanziiDictUrl,
  handleHanziiLinkClick,
  extractVocabKeysFromHanzi,
  SUPPLEMENTARY_COMPOUND_VOCAB,
} from './utils/visualDictionary';

type ActiveWorkspaceTab =
  | 'ebook'
  | 'ai_practice'
  | 'dictionary_hub'
  | 'notebook';

export type BookId = 'q1' | 'q2' | 'q3';

const BOOKS_CONFIG: Record<
  BookId,
  {
    id: BookId;
    shortTitle: string;
    label: string;
    subtitle: string;
    textbookUrl: string;
    exercisesUrl: string;
    defaultLessonId: string;
  }
> = {
  q1: {
    id: 'q1',
    shortTitle: 'Quyển 1',
    label: 'Quyển 1',
    subtitle: '13 Bài học & Ngữ pháp Tổng hợp',
    textbookUrl: '/assets/aistudio/giao_trinh_tieng_trung_q1_13d0c89b.json',
    exercisesUrl: '/assets/aistudio/bai_tap_tieng_trung_q1_c99e6c3e.json',
    defaultLessonId: 'q1_b01',
  },
  q2: {
    id: 'q2',
    shortTitle: 'Quyển 2',
    label: 'Quyển 2',
    subtitle: 'Bài 13–23 & Ngữ pháp 2, 3',
    textbookUrl: '/assets/aistudio/giao_trinh_tieng_trung_q2_9478e204.json',
    exercisesUrl: '/assets/aistudio/bai_tap_tieng_trung_q2_794d6e50.json',
    defaultLessonId: 'q2_b13',
  },
  q3: {
    id: 'q3',
    shortTitle: 'Quyển 3',
    label: 'Quyển 3',
    subtitle: '13 Bài Công xưởng & 10 Chuyên ngành',
    textbookUrl: '/assets/aistudio/giao_trinh_tieng_trung_q3_02b0244c.json',
    exercisesUrl: '/assets/aistudio/bai_tap_tieng_trung_q3_534a5904.json',
    defaultLessonId: 'q3_b01',
  },
};

const STORAGE_SELECTED_BOOK_KEY = 'chinese_ebook_selected_book_v1';
const STORAGE_BOOKMARKS_KEY = 'q1_chinese_ebook_bookmarks_v1';
const STORAGE_ATTEMPTS_KEY = 'q1_chinese_ebook_attempts_v1';
const STORAGE_COMPLETED_LESSONS_KEY =
  'q1_chinese_ebook_completed_lessons_v1';

const DEFAULT_BOOKMARKS: Record<string, BookmarkedWord> = {
  你好: {
    key: '你好',
    hanzi: '你好',
    pinyin: 'Nǐ hǎo',
    meaning_vi: 'Xin chào, chào bạn',
    lessonId: 'bai_01',
    lessonTitle: 'XIN CHÀO！',
    page: 1,
    tag: 'da_luu',
    personalNote: 'Câu chào hỏi phổ biến nhất trong giao tiếp hàng ngày',
    createdAt: Date.now() - 3600000,
  },
  身体: {
    key: '身体',
    hanzi: '身体',
    pinyin: 'Shēn tǐ',
    meaning_vi: 'Cơ thể, sức khỏe',
    lessonId: 'bai_02',
    lessonTitle: 'SỨC KHỎE TÔI RẤT TỐT !',
    page: 5,
    tag: 'quan_trong',
    personalNote: 'Dùng để hỏi thăm sức khỏe: 你身体好吗？',
    createdAt: Date.now() - 2400000,
  },
  工作: {
    key: '工作',
    hanzi: '工作',
    pinyin: 'Gōng zuò',
    meaning_vi: 'Công việc, làm việc',
    lessonId: 'bai_03',
    lessonTitle: 'HÔM NAY CÔNG VIỆC BẠN MỆT KHÔNG?',
    page: 10,
    tag: 'can_on',
    personalNote: 'Vừa là danh từ (công việc) vừa là động từ (làm việc)',
    createdAt: Date.now() - 1200000,
  },
};

export default function App() {
  const [selectedBook, setSelectedBook] = useState<BookId>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SELECTED_BOOK_KEY);
      if (saved === 'q1' || saved === 'q2' || saved === 'q3') return saved;
    } catch {
      // ignore
    }
    return 'q1';
  });

  const activeBookMeta = BOOKS_CONFIG[selectedBook];

  const [textbookData, setTextbookData] = useState<TextbookDataRaw | null>(null);
  const [exercisesData, setExercisesData] = useState<ExercisesDataRaw | null>(
    null
  );
  const [loadingData, setLoadingData] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Navigation & Reader State
  const [activeTab, setActiveTab] = useState<ActiveWorkspaceTab>('ebook');
  const [showPinyinIntro, setShowPinyinIntro] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [dualPageMode, setDualPageMode] = useState<boolean>(true);
  const [showPinyin, setShowPinyin] = useState<boolean>(true);
  const [showViMeaning, setShowViMeaning] = useState<boolean>(false);
  const [mobileTocOpen, setMobileTocOpen] = useState<boolean>(false);
  const [selectedPracticeLessonId, setSelectedPracticeLessonId] =
    useState<string>(() => BOOKS_CONFIG[selectedBook].defaultLessonId);

  // Dictionary Modal & Hub State
  const [dictModalWord, setDictModalWord] = useState<{
    hanzi: string;
    contextSentence?: string;
    lessonTitle?: string;
  } | null>(null);
  const [dictHubQuery, setDictHubQuery] = useState<string>('');
  const [dictHubLessonFilter, setDictHubLessonFilter] = useState<string>('all');
  const [dictHubViewMode, setDictHubViewMode] = useState<
    'visual_grid' | 'compact_list'
  >('visual_grid');
  const [dictShowPinyin, setDictShowPinyin] = useState<boolean>(true);
  const [dictShowMeaning, setDictShowMeaning] = useState<boolean>(true);
  const [crossBookVocab, setCrossBookVocab] = useState<VocabItem[]>([]);

  // Audio Playback State
  const [currentTrack, setCurrentTrack] = useState<PlayTrackItem | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playlist, setPlaylist] = useState<PlayTrackItem[]>([]);
  const [playlistIndex, setPlaylistIndex] = useState<number>(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [voiceName, setVoiceName] = useState<string>('Kore');
  const [loopOne, setLoopOne] = useState<boolean>(false);
  const [autoAdvance, setAutoAdvance] = useState<boolean>(true);
  const [pageSoundEnabled, setPageSoundEnabled] = useState<boolean>(true);

  const playbackSessionRef = useRef<number>(0);

  // Bookmarked Words, Exercise Attempts & Completed Lessons (Persisted per browser in localStorage)
  const [bookmarks, setBookmarks] = useState<Record<string, BookmarkedWord>>(
    () => {
      try {
        const raw = localStorage.getItem(STORAGE_BOOKMARKS_KEY);
        if (raw) return JSON.parse(raw);
      } catch {
        // ignore
      }
      return DEFAULT_BOOKMARKS;
    }
  );

  const [attempts, setAttempts] = useState<
    Record<string, SavedExerciseAttempt>
  >(() => {
    try {
      const raw = localStorage.getItem(STORAGE_ATTEMPTS_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return {};
  });

  const [completedLessons, setCompletedLessons] = useState<
    Record<string, boolean>
  >(() => {
    try {
      const raw = localStorage.getItem(STORAGE_COMPLETED_LESSONS_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return {};
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_BOOKMARKS_KEY, JSON.stringify(bookmarks));
    } catch {
      // ignore
    }
  }, [bookmarks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ATTEMPTS_KEY, JSON.stringify(attempts));
    } catch {
      // ignore
    }
  }, [attempts]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_COMPLETED_LESSONS_KEY,
        JSON.stringify(completedLessons)
      );
    } catch {
      // ignore
    }
  }, [completedLessons]);

  const handleToggleLessonComplete = useCallback((sectionId: string) => {
    setCompletedLessons((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  }, []);

  const handleSelectBook = useCallback((nextBook: BookId) => {
    setShowPinyinIntro(false);
    setActiveTab('ebook');
    if (nextBook === selectedBook) return;
    playbackSessionRef.current++;
    bookAudio.stop();
    setIsPlaying(false);
    setSelectedBook(nextBook);
    setCurrentPage(1);
    setDictHubLessonFilter('all');
    setSelectedPracticeLessonId(BOOKS_CONFIG[nextBook].defaultLessonId);
    try {
      localStorage.setItem(STORAGE_SELECTED_BOOK_KEY, nextBook);
    } catch {
      // ignore
    }
  }, [selectedBook]);

  // Load Curriculum & Exercises JSON files for the selected book (Quyển 1, 2, or 3)
  useEffect(() => {
    let mounted = true;
    const loadAssets = async () => {
      setLoadingData(true);
      setLoadError(null);
      try {
        const cfg = BOOKS_CONFIG[selectedBook];
        const [tbRes, exRes] = await Promise.all([
          fetch(cfg.textbookUrl),
          fetch(cfg.exercisesUrl),
        ]);
        if (!tbRes.ok || !exRes.ok) {
          throw new Error('Không thể tải dữ liệu giáo trình');
        }
        const [rawTbJson, exJson] = await Promise.all([
          tbRes.json() as Promise<TextbookDataRaw>,
          exRes.json() as Promise<ExercisesDataRaw>,
        ]);
        const tbJson: TextbookDataRaw =
          selectedBook === 'q2'
            ? normalizeBook2TextbookData(rawTbJson, exJson, EXERCISE_PAGE_MAP)
            : selectedBook === 'q3'
            ? normalizeBook3TextbookData(rawTbJson, exJson, EXERCISE_PAGE_MAP)
            : { ...rawTbJson, total_pages: 98 };
        if (mounted) {
          setTextbookData(tbJson);
          setExercisesData(exJson);
        }
      } catch (err: unknown) {
        if (mounted) {
          setLoadError(
            err instanceof Error ? err.message : 'Lỗi tải dữ liệu giáo trình'
          );
        }
      } finally {
        if (mounted) {
          setLoadingData(false);
        }
      }
    };
    loadAssets();
    return () => {
      mounted = false;
    };
  }, [selectedBook]);

  // Preload all 3 books' vocabulary once so compound words (like 介绍 from Q1 when reading Q2/Q3) are always segmented and looked up as complete compound words
  useEffect(() => {
    let active = true;
    Promise.all(
      (['q1', 'q2', 'q3'] as BookId[]).map(async (bId) => {
        const cfg = BOOKS_CONFIG[bId];
        const res = await fetch(cfg.textbookUrl);
        if (!res.ok) return [] as VocabItem[];
        const data = (await res.json()) as TextbookDataRaw;
        return (data.sections || []).flatMap((sec) =>
          (sec.vocabulary || []).map((v) => ({
            ...v,
            lessonId: sec.id,
            lessonTitle: `${sec.title_vi} (${cfg.shortTitle})`,
          }))
        );
      })
    )
      .then((arrays) => {
        if (active) {
          setCrossBookVocab(arrays.flat());
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  // Flatten all vocabulary items in the active book
  const allVocab = useMemo<VocabItem[]>(() => {
    if (!textbookData) return [];
    return textbookData.sections.flatMap((sec) =>
      sec.vocabulary.map((v) => ({
        ...v,
        lessonId: sec.id,
        lessonTitle: sec.title_vi,
      }))
    );
  }, [textbookData]);

  // Unified vocabulary across active book + all 3 books + built-in compound dictionary
  const globalAllVocab = useMemo<VocabItem[]>(() => {
    return [...allVocab, ...crossBookVocab, ...SUPPLEMENTARY_COMPOUND_VOCAB];
  }, [allVocab, crossBookVocab]);

  const allDialogues = useMemo<DialogueLine[]>(() => {
    const list: DialogueLine[] = [];
    const seen = new Set<string>();
    const pushLine = (line: DialogueLine) => {
      const cleanH = line.hanzi.replace(/^\d+\.\s*/, '').trim();
      if (!cleanH || seen.has(cleanH)) return;
      seen.add(cleanH);
      list.push({
        ...line,
        hanzi: cleanH,
      });
    };

    for (const l of Object.values(LESSON_SUPPLEMENTARY_DATA)) {
      for (const d of l.dialogues) {
        for (const line of d.lines) {
          pushLine(line);
        }
      }
      for (const g of l.grammarCallouts) {
        g.examples.forEach((ex, idx) => {
          pushLine({
            id: `${g.id}_ex_${idx}`,
            page: g.page,
            hanzi: ex.hanzi,
            pinyin: ex.pinyin,
            meaningVi: ex.meaningVi,
          });
        });
      }
    }

    if (exercisesData) {
      for (const les of exercisesData.lessons) {
        const unrolled = expandLessonGroupedExercises(les.exercises);
        for (const ex of unrolled) {
          if (
            (ex.exercise_type === 'luyen_dich_hoi_thoai' ||
              ex.exercise_type === 'luyen_tap_mau_cau') &&
            ex.source_hanzi &&
            ex.sample_sentence_vietnamese
          ) {
            pushLine({
              id: ex.exercise_id,
              page: EXERCISE_PAGE_MAP[ex.exercise_id] || 1,
              hanzi: ex.source_hanzi,
              pinyin: ex.source_pinyin || '',
              meaningVi: ex.sample_sentence_vietnamese,
            });
          } else if (
            ex.exercise_type === 'dich_viet_trung' &&
            ex.answer_hanzi &&
            ex.prompt_vietnamese
          ) {
            pushLine({
              id: ex.exercise_id,
              page: EXERCISE_PAGE_MAP[ex.exercise_id] || 1,
              hanzi: ex.answer_hanzi.split('（=')[0].split('/')[0].trim(),
              pinyin: (ex.answer_pinyin || '').split('(=')[0].split('/')[0].trim(),
              meaningVi: ex.prompt_vietnamese,
            });
          } else if (
            (ex.exercise_type === 'dat_cau' ||
              ex.exercise_type === 'luyen_tap_ngu_phap') &&
            ex.answer_hanzi &&
            ex.sample_sentence_vietnamese
          ) {
            pushLine({
              id: ex.exercise_id,
              page: EXERCISE_PAGE_MAP[ex.exercise_id] || 1,
              hanzi: ex.answer_hanzi,
              pinyin: ex.answer_pinyin || '',
              meaningVi: ex.sample_sentence_vietnamese,
            });
          }
        }
      }
    }

    return list;
  }, [textbookData, exercisesData]);

  const { vocabSet, sortedVocabKeys } = useMemo(() => {
    const set = new Set<string>();
    for (const v of globalAllVocab) {
      for (const key of extractVocabKeysFromHanzi(v.hanzi)) {
        set.add(key);
      }
    }
    const sorted = Array.from(set).sort((a, b) => b.length - a.length);
    return { vocabSet: set, sortedVocabKeys: sorted };
  }, [globalAllVocab]);

  const exercisesByLessonId = useMemo<Record<string, ExerciseItem[]>>(() => {
    if (!exercisesData) return {};
    const map: Record<string, ExerciseItem[]> = {};
    for (const les of exercisesData.lessons) {
      map[les.lesson_id] = les.exercises;
    }
    return map;
  }, [exercisesData]);

  // Complete merged lessons list for SmartPracticeDashboard (in exact textbook order, with grouped dialogues/sentences unrolled into individual items)
  const enrichedLessonsExercises = useMemo<LessonExercisesRaw[]>(() => {
    if (!exercisesData) return [];
    return exercisesData.lessons.map((les) => {
      const unrolledBase = expandLessonGroupedExercises(les.exercises);
      const supp = SUPPLEMENTARY_EXERCISES_BY_LESSON[les.lesson_id] || [];
      if (supp.length === 0) {
        return {
          ...les,
          exercises: unrolledBase,
        };
      }
      const readingSupp = supp.filter(
        (e) => e.exercise_type === 'luyen_tap_doan_van'
      );
      const datCauSupp = supp.filter((e) => e.exercise_type === 'dat_cau');
      return {
        ...les,
        exercises: [...readingSupp, ...unrolledBase, ...datCauSupp],
      };
    });
  }, [exercisesData]);

  const currentSection = useMemo(() => {
    if (!textbookData) return null;
    return (
      textbookData.sections.find(
        (s) => currentPage >= s.page_start && currentPage <= s.page_end
      ) || textbookData.sections[0]
    );
  }, [textbookData, currentPage]);

  const completedCount = useMemo(() => {
    if (!textbookData) return 0;
    return textbookData.sections.filter((s) => completedLessons[s.id]).length;
  }, [textbookData, completedLessons]);

  // Audio Playback Orchestration
  const playTrackListFromIndex = useCallback(
    async (
      tracks: PlayTrackItem[],
      startIndex: number,
      rateOverride?: number,
      voiceOverride?: string
    ) => {
      if (tracks.length === 0 || startIndex < 0 || startIndex >= tracks.length) {
        setIsPlaying(false);
        return;
      }

      const sessionId = ++playbackSessionRef.current;
      setPlaylist(tracks);
      setPlaylistIndex(startIndex);
      const item = tracks[startIndex];
      setCurrentTrack(item);
      setIsPlaying(true);

      await bookAudio.speakText({
        text: item.hanzi,
        rate: rateOverride ?? playbackRate,
        voiceName: voiceOverride ?? voiceName,
        useNeuralTTS: true,
        onEnd: () => {
          if (playbackSessionRef.current !== sessionId) return;
          if (loopOne) {
            playTrackListFromIndex(
              tracks,
              startIndex,
              rateOverride,
              voiceOverride
            );
          } else if (autoAdvance && startIndex + 1 < tracks.length) {
            playTrackListFromIndex(
              tracks,
              startIndex + 1,
              rateOverride,
              voiceOverride
            );
          } else {
            setIsPlaying(false);
          }
        },
        onError: () => {
          if (playbackSessionRef.current !== sessionId) return;
          setIsPlaying(false);
        },
      });
    },
    [playbackRate, voiceName, loopOne, autoAdvance]
  );

  const handleStopAudio = useCallback(() => {
    playbackSessionRef.current++;
    bookAudio.stop();
    setIsPlaying(false);
  }, []);

  const handlePlaySingleItem = useCallback(
    (item: PlayTrackItem) => {
      playTrackListFromIndex([item], 0);
    },
    [playTrackListFromIndex]
  );

  const handleSpeakDirect = useCallback(
    (text: string, slow = false) => {
      const item: PlayTrackItem = {
        id: `direct_${text}`,
        hanzi: text,
        speaker: slow ? 'Phát âm chậm' : 'Phát âm chuẩn',
      };
      playTrackListFromIndex([item], 0, slow ? 0.65 : playbackRate);
    },
    [playTrackListFromIndex, playbackRate]
  );

  const handleChangeVoice = useCallback(
    (newVoice: string) => {
      setVoiceName(newVoice);
      const sampleTrack: PlayTrackItem = currentTrack || {
        id: 'voice_preview',
        hanzi: '你好！欢迎学习汉语教程第一册。',
        pinyin: 'Nǐ hǎo! Huānyíng xuéxí Hànyǔ jiàochéng dì yī cè.',
        meaningVi:
          'Xin chào! Chào mừng bạn học Giáo Trình Hán Ngữ Hoa Sen Quyển 1.',
        speaker: `Thử giọng (${newVoice})`,
      };
      playTrackListFromIndex(
        playlist.length > 0 ? playlist : [sampleTrack],
        playlist.length > 0 ? playlistIndex : 0,
        playbackRate,
        newVoice
      );
    },
    [currentTrack, playlist, playlistIndex, playbackRate, playTrackListFromIndex]
  );

  const handlePageChange = useCallback(
    (page: number, direction?: 'next' | 'prev') => {
      const maxPage = textbookData?.total_pages || 98;
      const clamped = Math.max(1, Math.min(maxPage, page));
      if (direction) {
        bookAudio.playPageFlipSound(pageSoundEnabled);
      }
      setCurrentPage(clamped);
    },
    [pageSoundEnabled, textbookData?.total_pages]
  );

  const handleToggleBookmark = useCallback(
    (
      word: {
        hanzi: string;
        pinyin: string;
        meaning_vi: string;
        page: number;
        lessonTitle: string;
      },
      customTag?: BookmarkedWord['tag'],
      customNote?: string
    ) => {
      setBookmarks((prev) => {
        const existing = prev[word.hanzi];
        if (customTag !== undefined || customNote !== undefined) {
          return {
            ...prev,
            [word.hanzi]: {
              key: word.hanzi,
              hanzi: word.hanzi,
              pinyin: word.pinyin,
              meaning_vi: word.meaning_vi,
              lessonId: '',
              lessonTitle: word.lessonTitle,
              page: word.page,
              tag: customTag || existing?.tag || 'da_luu',
              personalNote:
                customNote !== undefined
                  ? customNote
                  : existing?.personalNote || '',
              createdAt: existing?.createdAt || Date.now(),
            },
          };
        }
        if (existing) {
          const next = { ...prev };
          delete next[word.hanzi];
          return next;
        }
        return {
          ...prev,
          [word.hanzi]: {
            key: word.hanzi,
            hanzi: word.hanzi,
            pinyin: word.pinyin,
            meaning_vi: word.meaning_vi,
            lessonId: '',
            lessonTitle: word.lessonTitle,
            page: word.page,
            tag: 'da_luu',
            personalNote: '',
            createdAt: Date.now(),
          },
        };
      });
    },
    []
  );

  const handleSaveAttempt = useCallback(
    (exerciseId: string, userAnswer: string, aiResult?: AIResult) => {
      setAttempts((prev) => ({
        ...prev,
        [exerciseId]: {
          exerciseId,
          userAnswer,
          aiResult,
          updatedAt: Date.now(),
        },
      }));
    },
    []
  );

  const filteredHubVocab = useMemo(() => {
    const q = dictHubQuery.trim().toLowerCase();
    return allVocab.filter((v) => {
      const matchLesson =
        dictHubLessonFilter === 'all' || v.lessonId === dictHubLessonFilter;
      const matchQuery =
        !q ||
        v.hanzi.toLowerCase().includes(q) ||
        v.pinyin.toLowerCase().includes(q) ||
        v.meaning_vi.toLowerCase().includes(q);
      return matchLesson && matchQuery;
    });
  }, [allVocab, dictHubQuery, dictHubLessonFilter]);

  if (loadingData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F6F4EE] p-6">
        <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-6 py-4 shadow-xs">
          <Loader2 className="h-5 w-5 animate-spin text-amber-700" />
          <span className="text-sm font-semibold text-stone-800">
            Đang mở Giáo Trình Hán Ngữ Hoa Sen {activeBookMeta.label}...
          </span>
        </div>
      </div>
    );
  }

  if (loadError || !textbookData || !exercisesData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F6F4EE] p-6">
        <div className="max-w-md rounded-2xl border border-rose-200 bg-white p-6 text-center">
          <p className="text-sm font-bold text-rose-800">
            {loadError || 'Không thể tải dữ liệu giáo trình'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F4EE] text-stone-900">
      {/* TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-30 flex flex-col md:flex-row md:items-center justify-between gap-2 sm:gap-4 border-b border-stone-200 bg-white/95 px-3 sm:px-6 py-2 sm:py-2.5 backdrop-blur-xs">
        {/* Zone 1: Brand Wordmark + Book Selector (Quyển 1, 2, 3) - Responsive on mobile so Quyển 3 never overflows */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 w-full md:w-auto">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('ebook');
            }}
            className="font-['Fraunces'] text-base sm:text-lg font-bold tracking-tight text-stone-900 whitespace-nowrap shrink-0"
          >
            Giáo Trình Hán Ngữ Hoa Sen
          </a>

          {/* Book Switcher (Phiên Âm | Quyển 1 | Quyển 2 | Quyển 3) */}
          <div
            className="grid grid-cols-4 w-full sm:w-auto sm:inline-flex items-center rounded-xl border border-stone-200 bg-stone-100/90 p-0.5"
            role="group"
            aria-label="Chọn phần Phiên Âm hoặc quyển giáo trình"
          >
            <button
              type="button"
              onClick={() => {
                setShowPinyinIntro(true);
                setActiveTab('ebook');
              }}
              className={`rounded-lg px-2 sm:px-2.5 py-1 text-xs font-bold transition-all whitespace-nowrap text-center ${
                showPinyinIntro && activeTab === 'ebook'
                  ? 'bg-amber-700 text-white shadow-2xs'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              Phiên Âm
            </button>
            {(['q1', 'q2', 'q3'] as BookId[]).map((bId) => {
              const isSelected = !showPinyinIntro && selectedBook === bId;
              return (
                <button
                  key={bId}
                  onClick={() => handleSelectBook(bId)}
                  className={`rounded-lg px-2 sm:px-2.5 py-1 text-xs font-bold transition-all whitespace-nowrap text-center ${
                    isSelected
                      ? 'bg-amber-700 text-white shadow-2xs'
                      : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/60'
                  }`}
                >
                  {BOOKS_CONFIG[bId].shortTitle}
                </button>
              );
            })}
          </div>
        </div>

        {/* Zone 2: 4 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
          <button
            onClick={() => setActiveTab('ebook')}
            className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              activeTab === 'ebook'
                ? 'text-stone-900 underline decoration-amber-700 decoration-2 underline-offset-4 font-semibold'
                : ''
            }`}
          >
            {showPinyinIntro ? 'Phiên Âm & Bút Thuận' : 'Sách Điện Tử'}
          </button>
          <button
            onClick={() => {
              setShowPinyinIntro(false);
              setActiveTab('ai_practice');
            }}
            className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              activeTab === 'ai_practice'
                ? 'text-stone-900 underline decoration-amber-700 decoration-2 underline-offset-4 font-semibold'
                : ''
            }`}
          >
            Câu Hỏi Và Đáp Án
          </button>
          <button
            onClick={() => {
              setShowPinyinIntro(false);
              setActiveTab('dictionary_hub');
            }}
            className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              activeTab === 'dictionary_hub'
                ? 'text-stone-900 underline decoration-amber-700 decoration-2 underline-offset-4 font-semibold'
                : ''
            }`}
          >
            Từ Điển Trực Quan ({allVocab.length})
          </button>
          <button
            onClick={() => {
              setShowPinyinIntro(false);
              setActiveTab('notebook');
            }}
            className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              activeTab === 'notebook'
                ? 'text-stone-900 underline decoration-amber-700 decoration-2 underline-offset-4 font-semibold'
                : ''
            }`}
          >
            Sổ Tay ({Object.keys(bookmarks).length})
          </button>
        </nav>
      </header>

      {/* Mobile Workspace Switcher (shown on small screens) */}
      <div className="flex md:hidden items-center gap-1 overflow-x-auto border-b border-stone-200 bg-white px-3 py-2">
        {[
          { id: 'ebook', label: showPinyinIntro ? 'Phiên Âm' : 'Sách Điện Tử' },
          { id: 'ai_practice', label: 'Câu Hỏi Và Đáp Án' },
          { id: 'dictionary_hub', label: `Từ Điển (${allVocab.length})` },
          { id: 'notebook', label: `Sổ Tay (${Object.keys(bookmarks).length})` },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => {
              if (t.id !== 'ebook') setShowPinyinIntro(false);
              setActiveTab(t.id as ActiveWorkspaceTab);
            }}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 ${
              activeTab === t.id
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Main Content Container */}
      <main className="mx-auto w-full max-w-[1440px] flex-1 px-3 sm:px-6 py-4 sm:py-6 space-y-5">
        {/* Global Audio Playback Controller Bar */}
        <AudioPlayerBar
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          playlist={playlist}
          playlistIndex={playlistIndex}
          playbackRate={playbackRate}
          onChangeRate={(r) => setPlaybackRate(r)}
          voiceName={voiceName}
          onChangeVoice={handleChangeVoice}
          loopOne={loopOne}
          onToggleLoopOne={() => setLoopOne((prev) => !prev)}
          autoAdvance={autoAdvance}
          onToggleAutoAdvance={() => setAutoAdvance((prev) => !prev)}
          pageSoundEnabled={pageSoundEnabled}
          onTogglePageSound={() => setPageSoundEnabled((prev) => !prev)}
          onPlayResume={() => {
            if (currentTrack) {
              playTrackListFromIndex(
                playlist.length ? playlist : [currentTrack],
                playlistIndex
              );
            }
          }}
          onStop={handleStopAudio}
          onPrevTrack={() => {
            if (playlistIndex > 0) {
              playTrackListFromIndex(playlist, playlistIndex - 1);
            }
          }}
          onNextTrack={() => {
            if (playlistIndex + 1 < playlist.length) {
              playTrackListFromIndex(playlist, playlistIndex + 1);
            }
          }}
        />

        {/* TAB 1: PINYIN INTRO (BEFORE BOOK 1) OR INTERACTIVE 3D AUDIO E-BOOK READER */}
        {activeTab === 'ebook' && showPinyinIntro && (
          <PinyinSectionView
            onSpeak={handleSpeakDirect}
            onWordClick={(hanzi, contextSentence, lessonTitle) =>
              setDictModalWord({ hanzi, contextSentence, lessonTitle })
            }
            onJumpToBook1={() => {
              setShowPinyinIntro(false);
              handleSelectBook('q1');
            }}
          />
        )}

        {activeTab === 'ebook' && !showPinyinIntro && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Mobile Collapsible TOC Toggle */}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileTocOpen((prev) => !prev)}
                className="flex w-full items-center justify-between rounded-xl border border-stone-200 bg-white px-4 py-3 text-xs font-semibold text-stone-900 shadow-2xs"
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-amber-700" />
                  <span>
                    Mục lục {activeBookMeta.label} ({completedCount}/
                    {textbookData.sections.length} đã học xong)
                  </span>
                </span>
                {mobileTocOpen ? (
                  <ChevronUp className="h-4 w-4 text-stone-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-stone-500" />
                )}
              </button>
            </div>

            {/* Left Sidebar: Interactive Table of Contents with Per-Browser Lesson Completion */}
            <aside
              className={`${
                mobileTocOpen ? 'block' : 'hidden'
              } lg:block lg:col-span-3 rounded-2xl border border-stone-200 bg-white p-4 space-y-4`}
            >
              <div className="border-b border-stone-100 pb-3 space-y-2.5">
                {/* Quick Book Switcher inside TOC Sidebar (Phiên Âm | Quyển 1 | Quyển 2 | Quyển 3) */}
                <div className="grid grid-cols-4 gap-1 rounded-xl bg-stone-100 p-1">
                  <button
                    type="button"
                    onClick={() => setShowPinyinIntro(true)}
                    className="rounded-lg py-1.5 text-[11px] font-bold text-stone-600 hover:text-stone-900 transition-all"
                  >
                    Phiên Âm
                  </button>
                  {(['q1', 'q2', 'q3'] as BookId[]).map((bId) => {
                    const isSelected = selectedBook === bId;
                    return (
                      <button
                        key={bId}
                        onClick={() => handleSelectBook(bId)}
                        className={`rounded-lg py-1.5 text-[11px] font-bold transition-all ${
                          isSelected
                            ? 'bg-white text-amber-900 shadow-2xs border border-amber-200/80'
                            : 'text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        {BOOKS_CONFIG[bId].shortTitle}
                      </button>
                    );
                  })}
                </div>

                <div>
                  <div className="text-xs font-medium text-stone-500">
                    Mục lục {activeBookMeta.label} · {textbookData.total_pages}{' '}
                    Trang
                  </div>
                  <h2 className="font-['Fraunces'] text-base font-bold text-stone-900">
                    {activeBookMeta.subtitle}
                  </h2>
                  <p className="text-[11px] text-stone-600 mt-0.5 font-medium">
                    Hán ngữ Hoa Sen
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Biên soạn: Nguyễn Thị Cẩm Nho
                  </p>
                </div>

                {/* Progress Bar for Completed Lessons */}
                <div className="rounded-xl bg-stone-50 p-2.5 border border-stone-200/70">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-stone-700">
                    <span>Tiến độ hoàn thành</span>
                    <span className="font-mono text-emerald-700 tabular-nums">
                      {completedCount} / {textbookData.sections.length} bài
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-stone-200">
                    <div
                      className="h-full rounded-full bg-emerald-600 transition-all duration-300"
                      style={{
                        width: `${Math.round(
                          (completedCount / textbookData.sections.length) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 max-h-[520px] overflow-y-auto overflow-x-hidden pr-1">
                {/* Pinyin Intro Entry right before Bài 1 of Quyển 1 */}
                {selectedBook === 'q1' && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowPinyinIntro(true);
                      setMobileTocOpen(false);
                    }}
                    className="w-full rounded-xl border border-amber-300 bg-amber-50/70 p-2.5 text-left hover:bg-amber-100/80 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2 text-[11px] font-bold text-amber-900">
                      <span>Mở đầu (Trước Quyển 1)</span>
                      <span className="rounded bg-amber-700 px-1.5 py-0.5 text-[10px] text-white">
                        Pinyin & Bút thuận
                      </span>
                    </div>
                    <div className="mt-0.5 font-['Noto_Sans_SC'] text-xs font-bold text-stone-900">
                      汉语拼音 · 笔画笔顺
                    </div>
                    <div className="text-xs font-semibold text-stone-700">
                      PHIÊN ÂM TIẾNG TRUNG & CÁCH VIẾT NÉT THUẬN
                    </div>
                  </button>
                )}
                {textbookData.sections.map((sec, idx) => {
                  const isActive = currentSection?.id === sec.id;
                  const isDone = !!completedLessons[sec.id];
                  const meta = LESSON_SUPPLEMENTARY_DATA[sec.id];
                  const fallbackLabel = sec.id.includes('từ_vựng')
                    ? 'Chuyên ngành'
                    : `Mục ${idx + 1}`;
                  return (
                    <div
                      key={sec.id}
                      className={`flex items-start justify-between gap-2 rounded-xl p-2.5 transition-colors ${
                        isActive
                          ? 'bg-amber-50 border border-amber-300 text-stone-900'
                          : isDone
                          ? 'bg-emerald-50/40 border border-emerald-200/70 text-stone-800 hover:bg-emerald-50/70'
                          : 'hover:bg-stone-50 text-stone-700 border border-transparent'
                      }`}
                    >
                      <button
                        onClick={() => {
                          handlePageChange(
                            sec.page_start,
                            sec.page_start > currentPage ? 'next' : 'prev'
                          );
                          setMobileTocOpen(false);
                        }}
                        className="flex-1 min-w-0 text-left"
                      >
                        <div className="flex items-center justify-between gap-2 text-[11px] text-stone-500">
                          <span className="font-semibold text-amber-800 truncate">
                            {meta?.lessonNumberLabel || fallbackLabel}
                          </span>
                          <span className="shrink-0 font-mono tabular-nums">
                            Tr.{sec.page_start}–{sec.page_end}
                          </span>
                        </div>
                        <div className="mt-0.5 font-['Noto_Sans_SC'] text-xs font-bold text-stone-900 truncate">
                          {sec.title_cn}
                        </div>
                        <div className="text-xs font-medium text-stone-600 truncate">
                          {sec.title_vi}
                        </div>
                      </button>

                      {/* Toggle Lesson Completed Button */}
                      <button
                        onClick={() => handleToggleLessonComplete(sec.id)}
                        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                          isDone
                            ? 'border-emerald-500 bg-emerald-600 text-white'
                            : 'border-stone-200 bg-white text-stone-300 hover:border-emerald-400 hover:text-emerald-600'
                        }`}
                        title={
                          isDone
                            ? 'Đã học xong bài này (nhấn để bỏ đánh dấu)'
                            : 'Đánh dấu đã học xong bài này'
                        }
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Quick Jump to Questions & Answers */}
              <div className="border-t border-stone-100 pt-3">
                <button
                  onClick={() => {
                    if (currentSection) {
                      const meta = LESSON_SUPPLEMENTARY_DATA[currentSection.id];
                      if (meta) {
                        setSelectedPracticeLessonId(meta.lessonExerciseId);
                      }
                    }
                    setActiveTab('ai_practice');
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-stone-900 px-3 py-2.5 text-xs font-semibold text-white hover:bg-stone-800 transition-colors"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Câu hỏi và đáp án bài này
                </button>
              </div>
            </aside>

            {/* Right Main Stage: 3D Page-Flipping Book Reader */}
            <div className="lg:col-span-9">
              <InteractiveBookReader
                sections={textbookData.sections}
                exercisesByLessonId={exercisesByLessonId}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                dualPageMode={dualPageMode}
                onToggleDualPage={() => setDualPageMode((prev) => !prev)}
                showPinyin={showPinyin}
                onTogglePinyin={() => setShowPinyin((prev) => !prev)}
                showViMeaning={showViMeaning}
                onToggleViMeaning={() => setShowViMeaning((prev) => !prev)}
                bookmarks={bookmarks}
                onToggleBookmark={(w) => handleToggleBookmark(w)}
                onWordClick={(hanzi, contextSentence, lessonTitle) =>
                  setDictModalWord({ hanzi, contextSentence, lessonTitle })
                }
                activePlayingId={isPlaying ? currentTrack?.id || null : null}
                isPlayingSequence={isPlaying && playlist.length > 1}
                onPlaySingleItem={handlePlaySingleItem}
                onPlayPageSequence={(items) => playTrackListFromIndex(items, 0)}
                onStopAudio={handleStopAudio}
                attempts={attempts}
                onSaveAttempt={handleSaveAttempt}
                onOpenPracticeForLesson={(lessonExId) => {
                  setSelectedPracticeLessonId(lessonExId);
                  setActiveTab('ai_practice');
                }}
                completedLessons={completedLessons}
                onToggleLessonComplete={handleToggleLessonComplete}
                vocabSet={vocabSet}
                sortedVocabKeys={sortedVocabKeys}
                totalPages={textbookData.total_pages}
                bookLabel={activeBookMeta.label}
              />
            </div>
          </div>
        )}

        {/* TAB 2: ANSWER INPUT & ACCURACY CHECKING DASHBOARD */}
        {activeTab === 'ai_practice' && (
          <SmartPracticeDashboard
            lessonsExercises={enrichedLessonsExercises}
            selectedLessonId={selectedPracticeLessonId}
            onSelectLessonId={setSelectedPracticeLessonId}
            lessonVocab={
              textbookData.sections.find(
                (s) =>
                  LESSON_SUPPLEMENTARY_DATA[s.id]?.lessonExerciseId ===
                  selectedPracticeLessonId
              )?.vocabulary || allVocab.slice(0, 35)
            }
            attempts={attempts}
            onSaveAttempt={handleSaveAttempt}
            onSpeak={handleSpeakDirect}
            onWordClick={(hanzi, contextSentence) =>
              setDictModalWord({ hanzi, contextSentence })
            }
            vocabSet={vocabSet}
            sortedVocabKeys={sortedVocabKeys}
          />
        )}

        {/* TAB 3: SPECIALIZED VISUAL & CONTEXTUAL DICTIONARY EXPLORER */}
        {activeTab === 'dictionary_hub' && (
          <div className="space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-xl border border-stone-200 bg-white p-4 sm:p-5">
              <div>
                <h2 className="font-['Fraunces'] text-lg sm:text-xl font-bold text-stone-900">
                  Từ Điển Trực Quan & Tra Cứu — {activeBookMeta.label} (Hiển
                  thị {filteredHubVocab.length} / {allVocab.length} từ)
                </h2>
                <p className="mt-0.5 text-xs text-stone-600">
                  Đầy đủ toàn bộ {allVocab.length} từ vựng của Giáo Trình Hán
                  Ngữ Hoa Sen {activeBookMeta.label}. Ấn vào bất kỳ từ nào để
                  xem ví dụ ngữ cảnh, từ đồng nghĩa và phát âm chuẩn.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5">
                {/* View Mode Toggle: Có ảnh minh họa vs Dạng danh sách (Không ảnh) */}
                <div className="inline-flex items-center rounded-lg border border-stone-200 bg-stone-100 p-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setDictHubViewMode('visual_grid')}
                    className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                      dictHubViewMode === 'visual_grid'
                        ? 'bg-white text-stone-900 shadow-2xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                    <span>Có ảnh minh họa</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDictHubViewMode('compact_list')}
                    className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                      dictHubViewMode === 'compact_list'
                        ? 'bg-white text-stone-900 shadow-2xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <List className="h-3.5 w-3.5" />
                    <span>Dạng danh sách</span>
                  </button>
                </div>

                {/* Toggle Show/Hide Pinyin & Nghĩa từ vựng in Dictionary */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setDictShowPinyin((prev) => !prev)}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                      dictShowPinyin
                        ? 'border-amber-400 bg-amber-50 text-amber-900'
                        : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {dictShowPinyin ? (
                      <Eye className="h-3.5 w-3.5" />
                    ) : (
                      <EyeOff className="h-3.5 w-3.5" />
                    )}
                    <span>Pinyin</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDictShowMeaning((prev) => !prev)}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                      dictShowMeaning
                        ? 'border-amber-400 bg-amber-50 text-amber-900'
                        : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {dictShowMeaning ? (
                      <Eye className="h-3.5 w-3.5" />
                    ) : (
                      <EyeOff className="h-3.5 w-3.5" />
                    )}
                    <span>Nghĩa từ vựng</span>
                  </button>
                </div>

                <select
                  value={dictHubLessonFilter}
                  onChange={(e) => setDictHubLessonFilter(e.target.value)}
                  className="rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-xs font-semibold text-stone-900"
                >
                  <option value="all">
                    Tất cả {textbookData.sections.length} Mục ({allVocab.length}{' '}
                    từ)
                  </option>
                  {textbookData.sections.map((sec) => (
                    <option key={sec.id} value={sec.id}>
                      {sec.title_vi} ({sec.vocab_count} từ)
                    </option>
                  ))}
                </select>

                <div className="relative w-full sm:w-64">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={dictHubQuery}
                    onChange={(e) => setDictHubQuery(e.target.value)}
                    placeholder="Tra chữ Hán, Pinyin hoặc nghĩa Việt..."
                    className="w-full rounded-lg border border-stone-300 bg-stone-50 py-2 pl-9 pr-3 text-xs text-stone-900 placeholder:text-stone-400 focus:border-amber-700 focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {dictHubViewMode === 'visual_grid' ? (
              /* MODE 1: VISUAL GRID WITH ILLUSTRATION IMAGES */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredHubVocab.map((v, idx) => {
                  const isBookmarked = !!bookmarks[v.hanzi];
                  const cat = detectWordCategory(v.hanzi, v.meaning_vi);
                  return (
                    <div
                      key={`${v.lessonId}_${v.index}_${idx}`}
                      onClick={() =>
                        setDictModalWord({
                          hanzi: v.hanzi,
                          lessonTitle: v.lessonTitle,
                        })
                      }
                      className="cursor-pointer rounded-xl border border-stone-200 bg-white p-4 hover:border-amber-500 transition-all space-y-3"
                    >
                      <WordVisualIllustration
                        hanzi={v.hanzi}
                        pinyin={v.pinyin}
                        meaningVi={v.meaning_vi}
                        category={cat}
                        showPinyin={dictShowPinyin}
                        showMeaning={dictShowMeaning}
                      />
                      <div
                        className="flex items-center justify-between pt-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="text-xs text-stone-500">
                          Từ #{idx + 1} · Trang {v.page} · {v.lessonTitle}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleSpeakDirect(v.hanzi, false)}
                            className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-900 hover:bg-amber-100"
                          >
                            <Volume2 className="h-3.5 w-3.5" />
                            Nghe
                          </button>
                          <button
                            onClick={() =>
                              handleToggleBookmark({
                                hanzi: v.hanzi,
                                pinyin: v.pinyin,
                                meaning_vi: v.meaning_vi,
                                page: v.page,
                                lessonTitle:
                                  v.lessonTitle || activeBookMeta.label,
                              })
                            }
                            className={`flex h-7 w-7 items-center justify-center rounded-lg border ${
                              isBookmarked
                                ? 'border-amber-400 bg-amber-50 text-amber-600'
                                : 'border-stone-200 text-stone-400 hover:text-stone-700'
                            }`}
                            title={
                              isBookmarked
                                ? 'Đã lưu sổ tay (Nhãn Đã lưu)'
                                : 'Lưu vào sổ tay (Nhãn Đã lưu)'
                            }
                          >
                            <Bookmark
                              className={`h-3.5 w-3.5 ${
                                isBookmarked ? 'fill-amber-500' : ''
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* MODE 2: COMPACT LIST VIEW WITHOUT ILLUSTRATION IMAGES */
              <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-stone-200 bg-stone-50 text-[11px] font-semibold uppercase tracking-wider text-stone-600">
                        <th className="py-3 pl-4 pr-2 w-12">#</th>
                        <th className="py-3 px-3">Từ mới</th>
                        {dictShowPinyin && (
                          <th className="py-3 px-3">Phiên âm</th>
                        )}
                        {dictShowMeaning && (
                          <th className="py-3 px-3">Nghĩa tiếng Việt</th>
                        )}
                        <th className="py-3 px-3 hidden md:table-cell">
                          Bài học & Trang
                        </th>
                        <th className="py-3 pl-2 pr-4 text-right">
                          Nghe / Hanzii / Lưu
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-xs sm:text-sm">
                      {filteredHubVocab.map((v, idx) => {
                        const isBookmarked = !!bookmarks[v.hanzi];
                        const hanziiUrl = buildHanziiDictUrl(v.hanzi);
                        return (
                          <tr
                            key={`list_${v.lessonId}_${v.index}_${idx}`}
                            onClick={() =>
                              setDictModalWord({
                                hanzi: v.hanzi,
                                lessonTitle: v.lessonTitle,
                              })
                            }
                            className={`cursor-pointer transition-colors ${
                              isBookmarked
                                ? 'bg-amber-50/45 hover:bg-amber-50/80'
                                : 'hover:bg-stone-50'
                            }`}
                          >
                            <td className="py-2.5 pl-4 pr-2 font-mono text-xs text-stone-400 tabular-nums">
                              {idx + 1}.
                            </td>
                            <td className="py-2.5 px-3">
                              <span className="font-['Noto_Sans_SC'] text-base sm:text-lg font-bold text-stone-900 hover:text-amber-800">
                                {v.hanzi}
                              </span>
                            </td>
                            {dictShowPinyin && (
                              <td className="py-2.5 px-3 font-mono text-xs sm:text-sm font-semibold text-amber-800">
                                {v.pinyin}
                              </td>
                            )}
                            {dictShowMeaning && (
                              <td className="py-2.5 px-3 font-medium text-stone-800">
                                <div>{v.meaning_vi}</div>
                                <div className="mt-0.5 text-[11px] text-stone-500 md:hidden">
                                  Tr.{v.page} · {v.lessonTitle}
                                </div>
                              </td>
                            )}
                            <td className="py-2.5 px-3 text-xs text-stone-500 hidden md:table-cell">
                              <span className="font-mono text-stone-700 font-semibold">
                                Tr.{v.page}
                              </span>{' '}
                              · {v.lessonTitle}
                            </td>
                            <td
                              className="py-2.5 pl-2 pr-4 text-right"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="inline-flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleSpeakDirect(v.hanzi, false)
                                  }
                                  className="inline-flex items-center gap-1 rounded-lg bg-amber-50 border border-amber-200/80 px-2.5 py-1 text-xs font-semibold text-amber-900 hover:bg-amber-100 transition-colors"
                                  title="Phát âm chuẩn"
                                >
                                  <Volume2 className="h-3.5 w-3.5" />
                                  <span className="hidden sm:inline">Nghe</span>
                                </button>
                                <a
                                  href={hanziiUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) =>
                                    handleHanziiLinkClick(e, v.hanzi)
                                  }
                                  className="inline-flex items-center gap-1 rounded-lg border border-amber-300 bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-950 hover:bg-amber-100 transition-colors"
                                  title={`Tra cứu từ "${v.hanzi}" trên Hanzii`}
                                >
                                  <span>Hanzii</span>
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleToggleBookmark({
                                      hanzi: v.hanzi,
                                      pinyin: v.pinyin,
                                      meaning_vi: v.meaning_vi,
                                      page: v.page,
                                      lessonTitle:
                                        v.lessonTitle || activeBookMeta.label,
                                    })
                                  }
                                  className={`flex h-7 w-7 items-center justify-center rounded-lg border transition-colors ${
                                    isBookmarked
                                      ? 'border-amber-400 bg-amber-100 text-amber-700'
                                      : 'border-stone-200 bg-white text-stone-400 hover:text-stone-700'
                                  }`}
                                  title={
                                    isBookmarked
                                      ? 'Đã lưu vào Sổ tay (Nhãn Đã lưu)'
                                      : 'Lưu vào Sổ tay (Nhãn Đã lưu)'
                                  }
                                >
                                  <Bookmark
                                    className={`h-3.5 w-3.5 ${
                                      isBookmarked ? 'fill-amber-500' : ''
                                    }`}
                                  />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: BOOKMARKED VOCABULARY NOTEBOOK & FLASHCARDS */}
        {activeTab === 'notebook' && (
          <VocabularyNotebook
            bookmarks={bookmarks}
            onRemoveBookmark={(hanzi) =>
              setBookmarks((prev) => {
                const next = { ...prev };
                delete next[hanzi];
                return next;
              })
            }
            onUpdateTag={(hanzi, tag) =>
              setBookmarks((prev) =>
                prev[hanzi]
                  ? { ...prev, [hanzi]: { ...prev[hanzi], tag } }
                  : prev
              )
            }
            onSpeak={handleSpeakDirect}
            onOpenDictionary={(hanzi) => setDictModalWord({ hanzi })}
            onJumpToPage={(page) => {
              setCurrentPage(page);
              setActiveTab('ebook');
            }}
            isPlayingPlaylist={isPlaying && playlist.length > 1}
            onPlayWordList={(words) => {
              const items: PlayTrackItem[] = words.map((w) => ({
                id: `nb_${w.hanzi}`,
                hanzi: w.hanzi,
                pinyin: w.pinyin,
                meaningVi: w.meaning_vi,
                speaker: 'Sổ tay từ vựng',
              }));
              playTrackListFromIndex(items, 0);
            }}
            onStopPlaylist={handleStopAudio}
          />
        )}
      </main>

      {/* Footer with Center Name & Author Credit */}
      <footer className="border-t border-stone-200 bg-white py-4 px-6 text-center text-xs text-stone-600">
        Giáo Trình Hán Ngữ Hoa Sen {activeBookMeta.label} · Biên soạn: Nguyễn
        Thị Cẩm Nho · {textbookData.total_pages} Trang · {allVocab.length} Từ
        vựng
      </footer>

      {/* SPECIALIZED CONTEXTUAL & VISUAL DICTIONARY MODAL */}
      <DictionaryModal
        wordHanzi={dictModalWord?.hanzi || null}
        contextSentence={dictModalWord?.contextSentence}
        lessonTitle={dictModalWord?.lessonTitle}
        allVocab={globalAllVocab}
        allDialogues={allDialogues}
        bookmarks={bookmarks}
        onToggleBookmark={handleToggleBookmark}
        onSpeak={handleSpeakDirect}
        onSelectWord={(nextHanzi) =>
          setDictModalWord({
            hanzi: nextHanzi,
            lessonTitle: dictModalWord?.lessonTitle,
          })
        }
        onClose={() => setDictModalWord(null)}
      />
    </div>
  );
}
