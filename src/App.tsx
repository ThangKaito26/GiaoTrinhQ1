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
} from './data/dialoguesAndGrammar';
import { bookAudio, PlayTrackItem } from './utils/audioEngine';
import { InteractiveBookReader } from './components/InteractiveBookReader';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { DictionaryModal } from './components/DictionaryModal';
import { SmartPracticeDashboard } from './components/SmartPracticeDashboard';
import { VocabularyNotebook } from './components/VocabularyNotebook';
import {
  WordVisualIllustration,
  detectWordCategory,
} from './utils/visualDictionary';

type ActiveWorkspaceTab =
  | 'ebook'
  | 'ai_practice'
  | 'dictionary_hub'
  | 'notebook';

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
    tag: 'quan_trong',
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
  const [textbookData, setTextbookData] = useState<TextbookDataRaw | null>(null);
  const [exercisesData, setExercisesData] = useState<ExercisesDataRaw | null>(
    null
  );
  const [loadingData, setLoadingData] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Navigation & Reader State
  const [activeTab, setActiveTab] = useState<ActiveWorkspaceTab>('ebook');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [dualPageMode, setDualPageMode] = useState<boolean>(true);
  const [showPinyin, setShowPinyin] = useState<boolean>(true);
  const [showViMeaning, setShowViMeaning] = useState<boolean>(false);
  const [mobileTocOpen, setMobileTocOpen] = useState<boolean>(false);
  const [selectedPracticeLessonId, setSelectedPracticeLessonId] =
    useState<string>('q1_b01');

  // Dictionary Modal & Hub State
  const [dictModalWord, setDictModalWord] = useState<{
    hanzi: string;
    contextSentence?: string;
    lessonTitle?: string;
  } | null>(null);
  const [dictHubQuery, setDictHubQuery] = useState<string>('');
  const [dictHubLessonFilter, setDictHubLessonFilter] = useState<string>('all');

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

  // Load Curriculum & Exercises JSON files
  useEffect(() => {
    let mounted = true;
    const loadAssets = async () => {
      setLoadingData(true);
      try {
        const [tbRes, exRes] = await Promise.all([
          fetch('/assets/aistudio/giao_trinh_tieng_trung_q1_13d0c89b.json'),
          fetch('/assets/aistudio/bai_tap_tieng_trung_q1_c99e6c3e.json'),
        ]);
        if (!tbRes.ok || !exRes.ok) {
          throw new Error('Không thể tải dữ liệu giáo trình');
        }
        const [tbJson, exJson] = await Promise.all([
          tbRes.json() as Promise<TextbookDataRaw>,
          exRes.json() as Promise<ExercisesDataRaw>,
        ]);
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
  }, []);

  // Flatten all 529 vocabulary items across all 13 sections
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

  const allDialogues = useMemo<DialogueLine[]>(() => {
    return Object.values(LESSON_SUPPLEMENTARY_DATA).flatMap((l) =>
      l.dialogues.flatMap((d) => d.lines)
    );
  }, []);

  const { vocabSet, sortedVocabKeys } = useMemo(() => {
    const set = new Set<string>();
    for (const v of allVocab) {
      const parts = v.hanzi
        .replace(/\(|\)/g, '')
        .split('/')
        .map((p) => p.trim())
        .filter((p) => p && /^[\u4e00-\u9fa5]+$/.test(p));
      for (const p of parts) {
        set.add(p);
      }
    }
    const sorted = Array.from(set).sort((a, b) => b.length - a.length);
    return { vocabSet: set, sortedVocabKeys: sorted };
  }, [allVocab]);

  const exercisesByLessonId = useMemo<Record<string, ExerciseItem[]>>(() => {
    if (!exercisesData) return {};
    const map: Record<string, ExerciseItem[]> = {};
    for (const les of exercisesData.lessons) {
      map[les.lesson_id] = les.exercises;
    }
    return map;
  }, [exercisesData]);

  // Complete merged lessons list for SmartPracticeDashboard (in exact textbook order)
  const enrichedLessonsExercises = useMemo<LessonExercisesRaw[]>(() => {
    if (!exercisesData) return [];
    return exercisesData.lessons.map((les) => {
      const supp = SUPPLEMENTARY_EXERCISES_BY_LESSON[les.lesson_id] || [];
      if (supp.length === 0) return les;
      const readingSupp = supp.filter(
        (e) => e.exercise_type === 'luyen_tap_doan_van'
      );
      const datCauSupp = supp.filter((e) => e.exercise_type === 'dat_cau');
      return {
        ...les,
        exercises: [...readingSupp, ...les.exercises, ...datCauSupp],
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
        meaningVi: 'Xin chào! Chào mừng bạn học Giáo trình Tiếng Trung Quyển 1.',
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
      const clamped = Math.max(1, Math.min(98, page));
      if (direction) {
        bookAudio.playPageFlipSound(pageSoundEnabled);
      }
      setCurrentPage(clamped);
    },
    [pageSoundEnabled]
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
              tag: customTag || existing?.tag || 'quan_trong',
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
            tag: 'quan_trong',
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
            Đang mở Giáo Trình Tiếng Trung Quyển 1 (98 trang & 529 từ vựng)...
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
      {/* STRICT 3-ZONE TOP BAR CONTRACT */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-4 sm:gap-8 border-b border-stone-200 bg-white/95 px-4 sm:px-6 py-3 backdrop-blur-xs">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('ebook');
          }}
          className="font-['Fraunces'] text-base sm:text-lg font-bold tracking-tight text-stone-900 whitespace-nowrap shrink-0"
        >
          Giáo Trình Tiếng Trung Q1
        </a>

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
            Sách Điện Tử
          </button>
          <button
            onClick={() => setActiveTab('ai_practice')}
            className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              activeTab === 'ai_practice'
                ? 'text-stone-900 underline decoration-amber-700 decoration-2 underline-offset-4 font-semibold'
                : ''
            }`}
          >
            Kiểm Tra Đáp Án
          </button>
          <button
            onClick={() => setActiveTab('dictionary_hub')}
            className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              activeTab === 'dictionary_hub'
                ? 'text-stone-900 underline decoration-amber-700 decoration-2 underline-offset-4 font-semibold'
                : ''
            }`}
          >
            Từ Điển Trực Quan (529)
          </button>
          <button
            onClick={() => setActiveTab('notebook')}
            className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              activeTab === 'notebook'
                ? 'text-stone-900 underline decoration-amber-700 decoration-2 underline-offset-4 font-semibold'
                : ''
            }`}
          >
            Sổ Tay ({Object.keys(bookmarks).length})
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              if (isPlaying) {
                handleStopAudio();
              } else if (currentSection) {
                const pageVocab = textbookData.sections
                  .flatMap((s) => s.vocabulary)
                  .filter((v) => v.page === currentPage)
                  .map((v) => ({
                    id: `vocab_${currentPage}_${v.index}_${v.hanzi}`,
                    hanzi: v.hanzi,
                    pinyin: v.pinyin,
                    meaningVi: v.meaning_vi,
                    speaker: 'Từ mới',
                  }));
                const pageDialogues = Object.values(LESSON_SUPPLEMENTARY_DATA)
                  .flatMap((m) => m.dialogues.flatMap((d) => d.lines))
                  .filter((l) => l.page === currentPage)
                  .map((l) => ({
                    id: l.id,
                    hanzi: l.hanzi,
                    pinyin: l.pinyin,
                    meaningVi: l.meaningVi,
                    speaker: 'Hội thoại',
                  }));
                const combined = [...pageVocab, ...pageDialogues];
                if (combined.length > 0) {
                  playTrackListFromIndex(combined, 0);
                } else {
                  handleSpeakDirect(currentSection.title_cn, false);
                }
              }
            }}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-amber-700 rounded-lg hover:bg-amber-800 transition-colors whitespace-nowrap shrink-0"
          >
            {isPlaying ? 'Dừng Phát Âm' : `Nghe Trang ${currentPage}`}
          </button>
        </div>
      </header>

      {/* Mobile Workspace Switcher (shown on small screens) */}
      <div className="flex md:hidden items-center gap-1 overflow-x-auto border-b border-stone-200 bg-white px-3 py-2">
        {[
          { id: 'ebook', label: 'Sách Điện Tử' },
          { id: 'ai_practice', label: 'Kiểm Tra Đáp Án' },
          { id: 'dictionary_hub', label: 'Từ Điển (529)' },
          { id: 'notebook', label: `Sổ Tay (${Object.keys(bookmarks).length})` },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as ActiveWorkspaceTab)}
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

        {/* TAB 1: INTERACTIVE 3D AUDIO E-BOOK READER */}
        {activeTab === 'ebook' && (
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
                    Mục lục 13 Bài học ({completedCount}/
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
              <div className="border-b border-stone-100 pb-3 space-y-2">
                <div>
                  <div className="text-xs font-medium text-stone-500">
                    Mục lục Giáo trình · 98 Trang
                  </div>
                  <h2 className="font-['Fraunces'] text-base font-bold text-stone-900">
                    13 Bài Học & Ngữ Pháp
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

              <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-1">
                {textbookData.sections.map((sec) => {
                  const isActive = currentSection?.id === sec.id;
                  const isDone = !!completedLessons[sec.id];
                  const meta = LESSON_SUPPLEMENTARY_DATA[sec.id];
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
                        <div className="flex items-center justify-between text-[11px] text-stone-500">
                          <span className="font-semibold text-amber-800">
                            {meta?.lessonNumberLabel || sec.id}
                          </span>
                          <span className="font-mono tabular-nums">
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

              {/* Quick Jump to Answer Checking */}
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
                  Làm bài & Kiểm tra đáp án bài này
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
          />
        )}

        {/* TAB 3: SPECIALIZED VISUAL & CONTEXTUAL DICTIONARY EXPLORER (FULL 529 WORDS) */}
        {activeTab === 'dictionary_hub' && (
          <div className="space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-xl border border-stone-200 bg-white p-4 sm:p-5">
              <div>
                <h2 className="font-['Fraunces'] text-lg sm:text-xl font-bold text-stone-900">
                  Từ Điển Chuyên Dụng & Hình Ảnh Minh Họa (Hiển thị{' '}
                  {filteredHubVocab.length} / {allVocab.length} từ)
                </h2>
                <p className="mt-0.5 text-xs text-stone-600">
                  Đầy đủ toàn bộ 529 từ vựng từ Bài 1 đến Bài 12 & Ngữ pháp Tổng hợp. Ấn vào bất kỳ thẻ từ nào để xem ví dụ ngữ cảnh, từ đồng nghĩa và phát âm chuẩn.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <select
                  value={dictHubLessonFilter}
                  onChange={(e) => setDictHubLessonFilter(e.target.value)}
                  className="rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-xs font-semibold text-stone-900"
                >
                  <option value="all">
                    Tất cả 13 Bài học (Đủ {allVocab.length} từ)
                  </option>
                  {textbookData.sections.map((sec) => (
                    <option key={sec.id} value={sec.id}>
                      {sec.title_vi} ({sec.vocab_count} từ)
                    </option>
                  ))}
                </select>

                <div className="relative w-full sm:w-72">
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

            {/* Render ALL matching words across all 529 items */}
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
                              lessonTitle: v.lessonTitle || 'Quyển 1',
                            })
                          }
                          className={`flex h-7 w-7 items-center justify-center rounded-lg border ${
                            isBookmarked
                              ? 'border-amber-400 bg-amber-50 text-amber-600'
                              : 'border-stone-200 text-stone-400 hover:text-stone-700'
                          }`}
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
        Giáo Trình Tiếng Trung Quyển 1 · Hán ngữ Hoa Sen · Biên soạn: Nguyễn Thị Cẩm Nho · 98 Trang · 529 Từ vựng
      </footer>

      {/* SPECIALIZED CONTEXTUAL & VISUAL DICTIONARY MODAL */}
      <DictionaryModal
        wordHanzi={dictModalWord?.hanzi || null}
        contextSentence={dictModalWord?.contextSentence}
        lessonTitle={dictModalWord?.lessonTitle}
        allVocab={allVocab}
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
