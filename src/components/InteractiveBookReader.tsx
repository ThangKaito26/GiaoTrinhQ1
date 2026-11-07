import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Volume2,
  Play,
  Square,
  Bookmark,
  BookOpen,
  Eye,
  EyeOff,
  Columns2,
  Maximize2,
  Minimize2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  X,
  SlidersHorizontal,
  Hand,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import {
  TextbookSectionRaw,
  VocabItem,
  DialogueLine,
  GrammarCallout,
  LessonSupplementaryContent,
  ExerciseItem,
  BookmarkedWord,
  SavedExerciseAttempt,
  AIResult,
} from '../types/textbook';
import {
  LESSON_SUPPLEMENTARY_DATA,
  EXERCISE_PAGE_MAP,
  SUPPLEMENTARY_EXERCISES_BY_LESSON,
} from '../data/dialoguesAndGrammar';
import { segmentChineseSentence } from '../utils/visualDictionary';
import { PlayTrackItem } from '../utils/audioEngine';
import {
  evaluateExerciseAnswerLocal,
  evaluateDialogueVietnameseTranslation,
} from '../utils/answerChecker';

interface InteractiveBookReaderProps {
  sections: TextbookSectionRaw[];
  exercisesByLessonId: Record<string, ExerciseItem[]>;
  currentPage: number;
  onPageChange: (page: number, direction?: 'next' | 'prev') => void;
  dualPageMode: boolean;
  onToggleDualPage: () => void;
  showPinyin: boolean;
  onTogglePinyin: () => void;
  showViMeaning: boolean;
  onToggleViMeaning: () => void;
  bookmarks: Record<string, BookmarkedWord>;
  onToggleBookmark: (word: {
    hanzi: string;
    pinyin: string;
    meaning_vi: string;
    page: number;
    lessonTitle: string;
  }) => void;
  onWordClick: (
    hanzi: string,
    contextSentence?: string,
    lessonTitle?: string
  ) => void;
  activePlayingId: string | null;
  isPlayingSequence: boolean;
  onPlaySingleItem: (item: PlayTrackItem) => void;
  onPlayPageSequence: (items: PlayTrackItem[], pageNum: number) => void;
  onStopAudio: () => void;
  attempts: Record<string, SavedExerciseAttempt>;
  onSaveAttempt: (
    exerciseId: string,
    userAnswer: string,
    aiResult?: AIResult
  ) => void;
  onOpenPracticeForLesson: (lessonExerciseId: string) => void;
  completedLessons: Record<string, boolean>;
  onToggleLessonComplete: (sectionId: string) => void;
  vocabSet: Set<string>;
  sortedVocabKeys: string[];
  totalPages?: number;
  bookLabel?: string;
}

interface PageContentData {
  pageNumber: number;
  primarySection: TextbookSectionRaw;
  lessonMeta: (typeof LESSON_SUPPLEMENTARY_DATA)[string] | undefined;
  vocabItems: VocabItem[];
  dialogueLines: {
    sectionTitleCn: string;
    sectionTitleVi: string;
    line: DialogueLine;
  }[];
  grammarItems: GrammarCallout[];
  pageExercises: {
    ex: ExerciseItem;
    lessonId: string;
    indexInLesson: number;
    sectionHeading: string;
  }[];
}

export const InteractiveBookReader: React.FC<InteractiveBookReaderProps> = ({
  sections,
  exercisesByLessonId,
  currentPage,
  onPageChange,
  dualPageMode,
  onToggleDualPage,
  showPinyin,
  onTogglePinyin,
  showViMeaning,
  onToggleViMeaning,
  bookmarks,
  onToggleBookmark,
  onWordClick,
  activePlayingId,
  isPlayingSequence,
  onPlaySingleItem,
  onPlayPageSequence,
  onStopAudio,
  attempts,
  onSaveAttempt,
  onOpenPracticeForLesson,
  completedLessons,
  onToggleLessonComplete,
  vocabSet,
  sortedVocabKeys,
  totalPages = 98,
  bookLabel = 'Quyển 1',
}) => {
  const [turningState, setTurningState] = useState<{
    dir: 'next' | 'prev';
    fromPage: number;
    toPage: number;
    startAngle: number;
  } | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showFullScreenToolbar, setShowFullScreenToolbar] = useState(false);
  const [fullscreenZoom, setFullscreenZoom] = useState<number>(100);
  const [dialogueTranslations, setDialogueTranslations] = useState<
    Record<string, string>
  >({});
  const [dialogueCheckResults, setDialogueCheckResults] = useState<
    Record<string, { score: number; isCorrect: boolean }>
  >({});
  const [revealedDialogueLineIds, setRevealedDialogueLineIds] = useState<
    Record<string, boolean>
  >({});
  const [revealedExerciseIds, setRevealedExerciseIds] = useState<
    Record<string, boolean>
  >({});

  // Touch & Mouse unified live 3D page-curl dragging (works on both Mobile touch & PC mouse!)
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const isTouchHorizontalRef = useRef<boolean | null>(null);

  const mouseDragStartXRef = useRef<number | null>(null);
  const didMouseDragMoveRef = useRef<boolean>(false);
  const [isMouseDragging, setIsMouseDragging] = useState<boolean>(false);
  const [ isSpringingBack, setIsSpringingBack ] = useState<boolean>(false);
  const [dragOriginDir, setDragOriginDir] = useState<'next' | 'prev' | null>(
    null
  );
  const [mouseDragDeltaX, setMouseDragDeltaX] = useState<number>(0);
  const springTimeoutRef = useRef<number | null>(null);

  // Merge all exercises (from JSON + supplementary reading/sentence exercises) with their exact lesson index
  const allExercisesWithMeta = useMemo(() => {
    const list: {
      ex: ExerciseItem;
      lessonId: string;
      indexInLesson: number;
      page: number;
      sectionHeading: string;
    }[] = [];

    for (const [lessonId, rawExList] of Object.entries(
      exercisesByLessonId
    ) as [string, ExerciseItem[]][]) {
      const suppList = SUPPLEMENTARY_EXERCISES_BY_LESSON[lessonId] || [];
      const readingSupp = suppList.filter(
        (e) => e.exercise_type === 'luyen_tap_doan_van'
      );
      const datCauSupp = suppList.filter((e) => e.exercise_type === 'dat_cau');

      const filteredRaw = rawExList.filter(
        (e) =>
          e.exercise_type !== 'luyen_dich_hoi_thoai' &&
          e.exercise_type !== 'luyen_tap_mau_cau'
      );

      // In Q3 Bài 4..13, III. 造句 (dat_cau) comes before IV. 翻译成越语 (dich_viet_trung) in the PDF
      const orderedRaw = /^q3_b(0[4-9]|1[0-3])$/.test(lessonId)
        ? [
            ...filteredRaw.filter((e) => e.exercise_type === 'dat_cau'),
            ...filteredRaw.filter((e) => e.exercise_type !== 'dat_cau'),
          ]
        : filteredRaw;

      const combined = [...readingSupp, ...orderedRaw, ...datCauSupp];

      let dichCounter = 0;
      let datCauCounter = 0;
      let nguPhapCounter = 0;
      let doanVanCounter = 0;

      for (const ex of combined) {
        const page = EXERCISE_PAGE_MAP[ex.exercise_id] || 1;
        let idx = 1;
        let heading = 'III. 翻译 Fānyì — BÀI TẬP DỊCH';

        if (ex.exercise_type === 'dich_viet_trung') {
          dichCounter++;
          idx = dichCounter;
          heading =
            lessonId === 'q1_b06' || /^q3_b(0[4-9]|1[0-3])$/.test(lessonId)
              ? 'IV. 翻译成越语 Fānyì — DỊCH VIỆT SANG TRUNG'
              : 'III. 翻译成越语 Fānyì — DỊCH VIỆT SANG TRUNG';
        } else if (ex.exercise_type === 'dat_cau') {
          datCauCounter++;
          idx = datCauCounter;
          heading =
            lessonId === 'q2_b21' || /^q3_b(0[4-9]|1[0-3])$/.test(lessonId)
              ? 'III. 造句 Zàojù — ĐẶT CÂU (Dùng từ cho trước đặt câu ít nhất 10 từ)'
              : 'IV. 造句 Zàojù — ĐẶT CÂU (Dùng từ cho trước đặt câu ít nhất 10 từ)';
        } else if (ex.exercise_type === 'luyen_tap_ngu_phap') {
          nguPhapCounter++;
          idx = nguPhapCounter;
          heading = 'II. 语法 Yǔfǎ — NGỮ PHÁP TỔNG HỢP & CÂU MẪU';
        } else if (ex.exercise_type === 'luyen_tap_doan_van') {
          doanVanCounter++;
          idx = doanVanCounter;
          heading =
            lessonId === 'q1_b12'
              ? 'III. 练习 Liànxí — LUYỆN TẬP ĐOẠN VĂN'
              : 'III. 课文 Kèwén — BÀI ĐỌC & DỊCH ĐOẠN VĂN';
        } else if (ex.exercise_type === 'luyen_tap_viet_van') {
          idx = 1;
          heading = '写短文 Xiě duǎn wén — VIẾT ĐOẠN VĂN TỰ GIỚI THIỆU';
        }

        list.push({
          ex,
          lessonId,
          indexInLesson: idx,
          page,
          sectionHeading: heading,
        });
      }
    }

    return list;
  }, [exercisesByLessonId]);

  // Build structured page data for any page 1..totalPages
  const getPageData = useMemo(() => {
    const activeSectionIds = new Set(sections.map((s) => s.id));
    const activeBookMetas = Object.values(LESSON_SUPPLEMENTARY_DATA).filter(
      (m) => activeSectionIds.has(m.sectionId)
    );

    return (pageNum: number): PageContentData => {
      const primarySection =
        sections.find(
          (s) => pageNum >= s.page_start && pageNum <= s.page_end
        ) || sections[0];

      const lessonMeta: LessonSupplementaryContent = LESSON_SUPPLEMENTARY_DATA[
        primarySection.id
      ] || {
        sectionId: primarySection.id,
        lessonExerciseId: '',
        lessonNumberLabel: 'Chuyên ngành',
        themeColor: 'purple',
        topicTag: 'Từ vựng Tiếng Trung Công xưởng & Chuyên ngành',
        grammarCallouts: [],
        dialogues: [],
      };

      const vocabItems = sections.flatMap((s) =>
        s.vocabulary.filter((v) => v.page === pageNum)
      );

      const dialogueLines: {
        sectionTitleCn: string;
        sectionTitleVi: string;
        line: DialogueLine;
      }[] = [];

      for (const meta of activeBookMetas) {
        for (const dSec of meta.dialogues) {
          for (const line of dSec.lines) {
            if (line.page === pageNum) {
              dialogueLines.push({
                sectionTitleCn: `${dSec.titleCn}：${dSec.titlePinyin}`,
                sectionTitleVi: dSec.titleVi,
                line,
              });
            }
          }
        }
      }

      const grammarItems = activeBookMetas.flatMap((m) =>
        m.grammarCallouts.filter((g) => g.page === pageNum)
      );

      const pageExercises = allExercisesWithMeta
        .filter((item) => item.page === pageNum)
        .map((item) => ({
          ex: item.ex,
          lessonId: item.lessonId,
          indexInLesson: item.indexInLesson,
          sectionHeading: item.sectionHeading,
        }));

      return {
        pageNumber: pageNum,
        primarySection,
        lessonMeta,
        vocabItems,
        dialogueLines,
        grammarItems,
        pageExercises,
      };
    };
  }, [sections, allExercisesWithMeta, exercisesByLessonId]);

  const triggerPageFlip = (
    targetPage: number,
    dir: 'next' | 'prev',
    startAngle?: number
  ) => {
    const clamped = Math.max(1, Math.min(totalPages, targetPage));
    if (clamped === currentPage || turningState) return;

    if (springTimeoutRef.current) {
      window.clearTimeout(springTimeoutRef.current);
      springTimeoutRef.current = null;
    }
    setIsSpringingBack(false);
    setDragOriginDir(null);
    setMouseDragDeltaX(0);

    const defaultStartAngle = startAngle !== undefined ? startAngle : 0;

    setTurningState({
      dir,
      fromPage: currentPage,
      toPage: clamped,
      startAngle: defaultStartAngle,
    });
    onPageChange(clamped, dir);

    setTimeout(() => {
      setTurningState(null);
    }, 720);
  };

  const handleStepNext = (
    startAngleOrEvent?: number | React.MouseEvent<HTMLButtonElement>
  ) => {
    const startAngle =
      typeof startAngleOrEvent === 'number' ? startAngleOrEvent : undefined;
    const isDesktopDual =
      dualPageMode &&
      typeof window !== 'undefined' &&
      window.innerWidth >= 1280;
    const step = isDesktopDual ? 2 : 1;
    triggerPageFlip(
      Math.min(totalPages, currentPage + step),
      'next',
      startAngle
    );
  };

  const handleStepPrev = (
    startAngleOrEvent?: number | React.MouseEvent<HTMLButtonElement>
  ) => {
    const startAngle =
      typeof startAngleOrEvent === 'number' ? startAngleOrEvent : undefined;
    const isDesktopDual =
      dualPageMode &&
      typeof window !== 'undefined' &&
      window.innerWidth >= 1280;
    const step = isDesktopDual ? 2 : 1;
    triggerPageFlip(Math.max(1, currentPage - step), 'prev', startAngle);
  };

  const handleToggleFullScreen = () => {
    const nextState = !isFullScreen;
    setIsFullScreen(nextState);
    if (nextState) {
      const isMobileViewport =
        typeof window !== 'undefined' && window.innerWidth < 768;
      setShowFullScreenToolbar(!isMobileViewport);
    }
    if (typeof document !== 'undefined') {
      if (nextState) {
        try {
          if (
            window.top &&
            window.top !== window &&
            window.top.document?.documentElement?.requestFullscreen
          ) {
            window.top.document.documentElement
              .requestFullscreen({ navigationUI: 'hide' })
              .catch(() => {
                document.documentElement
                  .requestFullscreen?.({ navigationUI: 'hide' })
                  .catch(() => {});
              });
            return;
          }
        } catch {
          // Cross-origin top frame: fall back to current documentElement
        }
        document.documentElement
          .requestFullscreen?.({ navigationUI: 'hide' })
          .catch(() => {});
      } else if (document.fullscreenElement) {
        document.exitFullscreen?.().catch(() => {});
      }
    }
  };

  // Handle clicking on blank space of the book page in Fullscreen mode to toggle/hide toolbar
  const handleBookBlankAreaClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isFullScreen) return;
    if (didMouseDragMoveRef.current) {
      didMouseDragMoveRef.current = false;
      return;
    }
    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('input') ||
      target.closest('select') ||
      target.closest('a') ||
      target.closest('label')
    ) {
      return;
    }
    setShowFullScreenToolbar((prev) => !prev);
  };

  const updateInteractiveDragDelta = (rawDx: number) => {
    if (Math.abs(rawDx) > 8) {
      didMouseDragMoveRef.current = true;
      setDragOriginDir((prevDir) => {
        if (prevDir) return prevDir;
        if (rawDx < 0 && currentPage < totalPages) return 'next';
        if (rawDx > 0 && currentPage > 1) return 'prev';
        return null;
      });
    }
    setMouseDragDeltaX(Math.max(-320, Math.min(320, rawDx)));
  };

  const commitOrSpringBackDrag = () => {
    const finalDx = mouseDragDeltaX;
    const activeDir =
      dragOriginDir || (finalDx < 0 ? 'next' : finalDx > 0 ? 'prev' : null);

    setIsMouseDragging(false);
    mouseDragStartXRef.current = null;
    touchStartXRef.current = null;
    touchStartYRef.current = null;
    isTouchHorizontalRef.current = null;

    if (!activeDir || Math.abs(finalDx) <= 8) {
      setDragOriginDir(null);
      setMouseDragDeltaX(0);
      return;
    }

    const isDesktopDual =
      dualPageMode &&
      typeof window !== 'undefined' &&
      window.innerWidth >= 1280;

    // Calculate current 3D leaf progress (0..1) in the active drag direction
    const directionalDx = activeDir === 'next' ? -finalDx : finalDx;
    const progress = Math.max(0, Math.min(1, directionalDx / 260));

    // Commit turn if dragged past 65px in the intended direction
    if (directionalDx >= 65) {
      if (activeDir === 'next' && currentPage < totalPages) {
        const startDeg = isDesktopDual
          ? Math.round(-progress * 165)
          : Math.round(-progress * 145);
        handleStepNext(startDeg);
        return;
      } else if (activeDir === 'prev' && currentPage > 1) {
        const startDeg = isDesktopDual
          ? Math.round(progress * 165)
          : Math.round(-145 + progress * 145);
        handleStepPrev(startDeg);
        return;
      }
    }

    // Halfway release ("lật nửa chừng rồi thả"): smoothly swing/bounce the page back to rest!
    setIsSpringingBack(true);
    setMouseDragDeltaX(0);
    if (springTimeoutRef.current) {
      window.clearTimeout(springTimeoutRef.current);
    }
    springTimeoutRef.current = window.setTimeout(() => {
      setIsSpringingBack(false);
      setDragOriginDir(null);
      springTimeoutRef.current = null;
    }, 420);
  };

  // PC Mouse Click-and-Drag Page Turning Handlers
  const handleBookMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0 || turningState) return;
    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('input') ||
      target.closest('select') ||
      target.closest('a') ||
      target.closest('textarea') ||
      target.closest('label')
    ) {
      return;
    }
    if (springTimeoutRef.current) {
      window.clearTimeout(springTimeoutRef.current);
      springTimeoutRef.current = null;
    }
    setIsSpringingBack(false);
    setDragOriginDir(null);
    mouseDragStartXRef.current = e.clientX;
    didMouseDragMoveRef.current = false;
    setIsMouseDragging(true);
    setMouseDragDeltaX(0);
  };

  const handleBookMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMouseDragging || mouseDragStartXRef.current === null || turningState)
      return;
    const dx = e.clientX - mouseDragStartXRef.current;
    updateInteractiveDragDelta(dx);
  };

  const finishBookMouseDrag = () => {
    if (!isMouseDragging || mouseDragStartXRef.current === null) return;
    commitOrSpringBackDrag();
  };

  // Keyboard shortcuts for Fullscreen exit (ESC), native fullscreenchange sync, and page turning (Left/Right arrows)
  useEffect(() => {
    const onFullScreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullScreen(false);
      }
    };
    document.addEventListener('fullscreenchange', onFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFullScreenChange);
    };
  }, []);

  useEffect(() => {
    if (!isFullScreen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (e.key === 'Escape') {
        setIsFullScreen(false);
        if (document.fullscreenElement) {
          document.exitFullscreen?.().catch(() => {});
        }
        return;
      }
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleStepNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleStepPrev();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isFullScreen, currentPage, dualPageMode, turningState]);

  // Mobile Touch Live Page-Swinging Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1 || turningState) return;
    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('input') ||
      target.closest('select') ||
      target.closest('a') ||
      target.closest('textarea')
    ) {
      return;
    }
    if (springTimeoutRef.current) {
      window.clearTimeout(springTimeoutRef.current);
      springTimeoutRef.current = null;
    }
    setIsSpringingBack(false);
    setDragOriginDir(null);
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    isTouchHorizontalRef.current = null;
    setIsMouseDragging(true);
    setMouseDragDeltaX(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (
      touchStartXRef.current === null ||
      touchStartYRef.current === null ||
      e.touches.length === 0 ||
      turningState
    ) {
      return;
    }
    const dx = e.touches[0].clientX - touchStartXRef.current;
    const dy = e.touches[0].clientY - touchStartYRef.current;

    if (isTouchHorizontalRef.current === null) {
      if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
        isTouchHorizontalRef.current = Math.abs(dx) > Math.abs(dy) * 1.15;
      }
    }

    if (isTouchHorizontalRef.current) {
      updateInteractiveDragDelta(dx);
    }
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current === null) return;
    commitOrSpringBackDrag();
  };

  const handleInlineCheckExercise = (ex: ExerciseItem) => {
    const userAnswer = attempts[ex.exercise_id]?.userAnswer || '';
    if (!userAnswer.trim()) return;
    const result = evaluateExerciseAnswerLocal(ex, userAnswer);
    onSaveAttempt(ex.exercise_id, userAnswer, result);
  };

  const handleCheckDialogueTranslation = (line: DialogueLine) => {
    const userVi = dialogueTranslations[line.id] || '';
    if (!userVi.trim()) return;
    const res = evaluateDialogueVietnameseTranslation(userVi, line.meaningVi);
    setDialogueCheckResults((prev) => ({ ...prev, [line.id]: res }));
  };

  const getAudioItemsForPage = (data: PageContentData): PlayTrackItem[] => {
    const list: PlayTrackItem[] = [];
    for (const v of data.vocabItems) {
      list.push({
        id: `vocab_${data.pageNumber}_${v.index}_${v.hanzi}`,
        hanzi: v.hanzi,
        pinyin: v.pinyin,
        meaningVi: v.meaning_vi,
        speaker: 'Từ mới',
      });
    }
    for (const d of data.dialogueLines) {
      list.push({
        id: d.line.id,
        hanzi: d.line.hanzi,
        pinyin: d.line.pinyin,
        meaningVi: d.line.meaningVi,
        speaker: 'Hội thoại',
      });
    }
    for (const { ex } of data.pageExercises) {
      list.push({
        id: ex.exercise_id,
        hanzi: ex.source_hanzi || ex.answer_hanzi,
        pinyin: ex.source_pinyin || ex.answer_pinyin,
        meaningVi: ex.prompt_vietnamese || ex.sample_sentence_vietnamese,
        speaker: 'Bài tập',
      });
    }
    return list;
  };

  const leftPageData = getPageData(currentPage);
  const rightPageData =
    dualPageMode && currentPage + 1 <= totalPages
      ? getPageData(currentPage + 1)
      : null;

  const isShowingDualSpread = Boolean(dualPageMode && rightPageData);

  // Active direction & progress (0..1) for live finger/mouse page swinging & spring-back
  const effectiveDragDir: 'next' | 'prev' | null =
    dragOriginDir ||
    (mouseDragDeltaX < -8 ? 'next' : mouseDragDeltaX > 8 ? 'prev' : null);

  const directionalDragPx =
    effectiveDragDir === 'next'
      ? Math.max(0, -mouseDragDeltaX)
      : effectiveDragDir === 'prev'
      ? Math.max(0, mouseDragDeltaX)
      : 0;

  const activeDragProgress = Math.min(1, directionalDragPx / 260);
  const showInteractiveDragPreview =
    Boolean(effectiveDragDir) &&
    (isMouseDragging || isSpringingBack) &&
    !turningState;

  // Determine which pages sit underneath on the left and right during a 3D turn or live drag so nothing jumps at t=0
  const baseLeftPageData = useMemo(() => {
    if (turningState) {
      if (isShowingDualSpread) {
        return turningState.dir === 'next'
          ? getPageData(turningState.fromPage)
          : getPageData(turningState.toPage);
      }
      return turningState.dir === 'next'
        ? getPageData(turningState.toPage)
        : getPageData(turningState.fromPage);
    }
    if (showInteractiveDragPreview && effectiveDragDir === 'prev' && currentPage > 1) {
      if (isShowingDualSpread) {
        return getPageData(Math.max(1, currentPage - 2));
      }
      return leftPageData;
    }
    if (showInteractiveDragPreview && effectiveDragDir === 'next' && !isShowingDualSpread) {
      return getPageData(Math.min(totalPages, currentPage + 1));
    }
    return leftPageData;
  }, [
    turningState,
    isShowingDualSpread,
    showInteractiveDragPreview,
    effectiveDragDir,
    currentPage,
    leftPageData,
    getPageData,
    totalPages,
  ]);

  const baseRightPageData = useMemo(() => {
    if (!isShowingDualSpread) return null;
    if (turningState) {
      return turningState.dir === 'next'
        ? getPageData(Math.min(totalPages, turningState.toPage + 1))
        : getPageData(Math.min(totalPages, turningState.fromPage + 1));
    }
    if (showInteractiveDragPreview && effectiveDragDir === 'next') {
      return getPageData(Math.min(totalPages, currentPage + 3));
    }
    return rightPageData;
  }, [
    isShowingDualSpread,
    turningState,
    showInteractiveDragPreview,
    effectiveDragDir,
    currentPage,
    rightPageData,
    getPageData,
    totalPages,
  ]);

  const renderSingleBookPage = (
    data: PageContentData,
    side: 'left' | 'right' | 'single'
  ) => {
    const pageAudioList = getAudioItemsForPage(data);
    const startingSections = sections.filter(
      (s) => s.page_start === data.pageNumber
    );
    const startingLessonExIds = new Set(
      startingSections
        .map((s) => LESSON_SUPPLEMENTARY_DATA[s.id]?.lessonExerciseId)
        .filter(Boolean)
    );
    const leadingPageExercises =
      startingSections.length > 0 && data.pageNumber > 1
        ? data.pageExercises.filter(
            (item) => !startingLessonExIds.has(item.lessonId)
          )
        : [];
    const mainPageExercises =
      startingSections.length > 0 && data.pageNumber > 1
        ? data.pageExercises.filter((item) =>
            startingLessonExIds.has(item.lessonId)
          )
        : data.pageExercises;
    const isLessonCompleted = !!completedLessons[data.primarySection.id];

    return (
      <div
        className={`relative flex h-full flex-col justify-between bg-[#FCFBF7] p-4 sm:p-6 lg:p-7 text-stone-900 ${
          isFullScreen
            ? 'min-h-[80vh] sm:p-8 lg:p-10'
            : 'min-h-[760px] sm:min-h-[860px]'
        } ${
          side === 'left'
            ? 'xl:rounded-l-2xl xl:border-r xl:border-stone-300/80 xl:shadow-[inset_-16px_0_26px_-14px_rgba(28,25,23,0.09)]'
            : side === 'right'
            ? 'xl:rounded-r-2xl xl:shadow-[inset_16px_0_26px_-14px_rgba(28,25,23,0.09)]'
            : 'xl:rounded-2xl xl:shadow-[inset_0_0_24px_-12px_rgba(28,25,23,0.08)]'
        }`}
      >
        {/* Top Page Running Header */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-2.5 mb-4">
            <div className="flex items-center gap-1.5 text-xs text-stone-500 min-w-0">
              <span className="font-semibold text-amber-900 shrink-0">
                {data.lessonMeta?.lessonNumberLabel || bookLabel}
              </span>
              <span aria-hidden="true">·</span>
              <span className="truncate">
                {data.primarySection.title_vi}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Per-Lesson Completion Status Button */}
              <button
                onClick={() => onToggleLessonComplete(data.primarySection.id)}
                className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  isLessonCompleted
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                    : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                }`}
                title="Lưu trạng thái đã học xong bài này trên trình duyệt"
              >
                <CheckCircle2
                  className={`h-3.5 w-3.5 ${
                    isLessonCompleted
                      ? 'text-emerald-600'
                      : 'text-stone-400'
                  }`}
                />
                <span>
                  {isLessonCompleted ? 'Đã học xong' : 'Đánh dấu học xong'}
                </span>
              </button>

              {pageAudioList.length > 0 && (
                <button
                  onClick={() =>
                    isPlayingSequence
                      ? onStopAudio()
                      : onPlayPageSequence(pageAudioList, data.pageNumber)
                  }
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    isPlayingSequence
                      ? 'bg-rose-700 text-white hover:bg-rose-800'
                      : 'bg-amber-700 text-white hover:bg-amber-800'
                  }`}
                >
                  {isPlayingSequence ? (
                    <>
                      <Square className="h-3 w-3 fill-current" />
                      Dừng
                    </>
                  ) : (
                    <>
                      <Play className="h-3 w-3 fill-current" />
                      Đọc trang {data.pageNumber}
                    </>
                  )}
                </button>
              )}

              <span className="font-mono text-xs font-bold text-stone-600 tabular-nums">
                {data.pageNumber} / {totalPages}
              </span>
            </div>
          </div>

          {/* Split-page exercises from previous lesson at the top (pages 15, 36, 44, 60, 80, 87 in Q1; pages 10, 57 in Q2) */}
          {leadingPageExercises.length > 0 && (
            <div className="mb-6 pb-5 border-b-2 border-dashed border-stone-200">
              {renderExercisesBlock(data, leadingPageExercises)}
            </div>
          )}

          {/* Lesson Title Banner when a lesson starts on this page */}
          {startingSections.map((sec) => {
            const meta = LESSON_SUPPLEMENTARY_DATA[sec.id];
            const secCompleted = !!completedLessons[sec.id];
            return (
              <div
                key={sec.id}
                className="mb-5 rounded-xl border border-amber-200/90 bg-gradient-to-r from-amber-50/90 via-orange-50/50 to-stone-50 p-3.5 sm:p-4 text-center"
              >
                <div className="text-xs font-medium text-amber-800">
                  {meta?.topicTag || `Giáo Trình Hán Ngữ Hoa Sen ${bookLabel}`}
                </div>
                <h2 className="mt-1 font-['Noto_Sans_SC'] text-lg sm:text-2xl font-bold text-stone-900">
                  {sec.title_cn}
                </h2>
                {sec.title_pinyin && (
                  <p className="font-mono text-xs font-semibold text-amber-800 mt-0.5">
                    {sec.title_pinyin}
                  </p>
                )}
                <p className="mt-1 font-['Fraunces'] text-sm sm:text-base font-bold text-stone-800">
                  {/^(q[23]_)?bai_\d+/.test(sec.id)
                    ? `Bài ${parseInt(sec.id.replace(/^(q[23]_)?bai_/, ''), 10)}: ${sec.title_vi}`
                    : sec.title_vi}
                </p>
                <div className="mt-2.5 flex justify-center">
                  <button
                    onClick={() => onToggleLessonComplete(sec.id)}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1 text-xs font-semibold transition-all ${
                      secCompleted
                        ? 'border-emerald-500 bg-emerald-600 text-white shadow-2xs'
                        : 'border-amber-300 bg-white text-amber-900 hover:bg-amber-50'
                    }`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>
                      {secCompleted
                        ? 'Đã hoàn thành bài học này'
                        : 'Đánh dấu hoàn thành bài học'}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}

          {/* SECTION I: VOCABULARY TABLE (I. 生词: TỪ MỚI) */}
          {data.vocabItems.length > 0 && (
            <div className="mb-5">
              <div className="flex flex-wrap items-center justify-between gap-1 mb-2">
                <h3 className="font-['Noto_Sans_SC'] text-xs sm:text-sm font-bold text-stone-900">
                  I. 生词：Shēng cí — TỪ MỚI
                </h3>
                <span className="text-[11px] text-stone-500">
                  Ấn vào từ mới để tra cứu từ điển & hình ảnh
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-stone-200/90 bg-white">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-stone-200 bg-stone-50/80 text-[11px] font-semibold text-stone-500">
                      <th className="py-2 pl-2.5 pr-1 w-8">#</th>
                      <th className="py-2 px-2">Từ mới</th>
                      {showPinyin && <th className="py-2 px-2">Phiên âm</th>}
                      {showViMeaning && (
                        <th className="py-2 px-2">Nghĩa tiếng Việt</th>
                      )}
                      <th className="py-2 pl-1 pr-2.5 text-right">Nghe / Lưu</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-xs">
                    {data.vocabItems.map((v, vIdx) => {
                      const itemId = `vocab_${data.pageNumber}_${v.index}_${v.hanzi}_${vIdx}`;
                      const isPlayingThis = activePlayingId === itemId;
                      const isBookmarked = !!bookmarks[v.hanzi];

                      return (
                        <tr
                          key={itemId}
                          className={`transition-colors ${
                            isPlayingThis
                              ? 'bg-amber-100/80'
                              : isBookmarked
                              ? 'bg-amber-50/50 hover:bg-stone-50'
                              : 'hover:bg-stone-50/90'
                          }`}
                        >
                          <td className="py-2 pl-2.5 pr-1 font-mono text-stone-400 tabular-nums">
                            {v.index}.
                          </td>
                          <td className="py-2 px-2">
                            <button
                              onClick={() =>
                                onWordClick(
                                  v.hanzi,
                                  undefined,
                                  data.primarySection.title_vi
                                )
                              }
                              className="font-['Noto_Sans_SC'] text-sm sm:text-base font-bold text-stone-900 hover:text-amber-700 transition-colors text-left"
                            >
                              {v.hanzi}
                            </button>
                          </td>
                          {showPinyin && (
                            <td className="py-2 px-2 font-mono text-xs font-medium text-amber-800">
                              {v.pinyin}
                            </td>
                          )}
                          {showViMeaning && (
                            <td className="py-2 px-2 text-stone-700 font-medium">
                              {v.meaning_vi}
                            </td>
                          )}
                          <td className="py-2 pl-1 pr-2.5 text-right">
                            <div className="inline-flex items-center justify-end gap-1">
                              <button
                                onClick={() =>
                                  onPlaySingleItem({
                                    id: itemId,
                                    hanzi: v.hanzi,
                                    pinyin: v.pinyin,
                                    meaningVi: v.meaning_vi,
                                    speaker: 'Từ mới',
                                  })
                                }
                                className={`flex h-7 w-7 items-center justify-center rounded-md border transition-colors ${
                                  isPlayingThis
                                    ? 'border-amber-700 bg-amber-700 text-white'
                                    : 'border-stone-200 bg-white text-stone-700 hover:border-amber-500 hover:text-amber-800'
                                }`}
                                title="Phát âm chuẩn"
                              >
                                <Volume2 className="h-3.5 w-3.5" />
                              </button>

                              <button
                                onClick={() =>
                                  onToggleBookmark({
                                    hanzi: v.hanzi,
                                    pinyin: v.pinyin,
                                    meaning_vi: v.meaning_vi,
                                    page: data.pageNumber,
                                    lessonTitle: data.primarySection.title_vi,
                                  })
                                }
                                className={`flex h-7 w-7 items-center justify-center rounded-md border transition-colors ${
                                  isBookmarked
                                    ? 'border-amber-400 bg-amber-50 text-amber-600'
                                    : 'border-stone-200 bg-white text-stone-400 hover:text-stone-700'
                                }`}
                                title="Đánh dấu từ vựng cần lưu ý"
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

          {/* GRAMMAR CALLOUTS ON THIS PAGE */}
          {data.grammarItems.length > 0 && (
            <div className="mb-5 space-y-3">
              {data.grammarItems.map((g) => (
                <div
                  key={g.id}
                  className="rounded-xl border border-amber-300/80 bg-amber-50/55 p-3.5 sm:p-4 space-y-2"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
                    <BookOpen className="h-4 w-4 text-amber-700 shrink-0" />
                    <span>{g.title}</span>
                  </div>
                  <div className="rounded-lg bg-white/90 px-3 py-1.5 font-mono text-xs font-semibold text-stone-900 border border-amber-200/70">
                    {g.formula}
                  </div>
                  <p className="text-xs leading-relaxed text-stone-700">
                    {g.explanation}
                  </p>
                  <div className="space-y-1.5 pt-1">
                    {g.examples.map((ex, idx) => {
                      const exTokens = segmentChineseSentence(
                        ex.hanzi,
                        vocabSet,
                        sortedVocabKeys
                      );
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between gap-2 rounded-lg bg-white/80 px-3 py-1.5 text-xs border border-stone-200/60"
                        >
                          <div>
                            <span className="font-['Noto_Sans_SC'] font-bold text-stone-900">
                              ➢{' '}
                              {exTokens.map((tok, tIdx) =>
                                tok.isWord ? (
                                  <button
                                    key={tIdx}
                                    type="button"
                                    onClick={() =>
                                      onWordClick(
                                        tok.text,
                                        ex.hanzi,
                                        data.primarySection.title_vi
                                      )
                                    }
                                    className="rounded px-0.5 font-['Noto_Sans_SC'] font-bold text-stone-900 hover:bg-amber-100 hover:text-amber-900 transition-colors"
                                    title={`Tra từ "${tok.text}"`}
                                  >
                                    {tok.text}
                                  </button>
                                ) : (
                                  <span key={tIdx}>{tok.text}</span>
                                )
                              )}
                            </span>{' '}
                            {showPinyin && (
                              <span className="font-mono text-amber-800">
                                ({ex.pinyin})
                              </span>
                            )}{' '}
                            <span className="text-stone-600">
                              — {ex.meaningVi}
                            </span>
                          </div>
                          <button
                            onClick={() =>
                              onPlaySingleItem({
                                id: `${g.id}_ex_${idx}`,
                                hanzi: ex.hanzi,
                                pinyin: ex.pinyin,
                                meaningVi: ex.meaningVi,
                              })
                            }
                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-amber-100 text-amber-900 hover:bg-amber-200"
                          >
                            <Volume2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SECTION II: DIALOGUES / SAMPLE SENTENCES (II. 会话 / II. 句子) */}
          {data.dialogueLines.length > 0 && (
            <div className="mb-5 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-1">
                <h3 className="font-['Noto_Sans_SC'] text-xs sm:text-sm font-bold text-stone-900">
                  {data.dialogueLines[0]?.sectionTitleCn.includes('句子')
                    ? 'II. 句子：Jùzi — MẪU CÂU THÔNG DỤNG'
                    : 'II. 会话：Huì huà — HỘI THOẠI'}
                </h3>
                <span className="text-[11px] text-stone-500">
                  Ấn vào chữ Hán để tra từ · Dịch sang tiếng Việt ở dòng chấm
                </span>
              </div>

              <div className="space-y-2.5">
                {data.dialogueLines.map(
                  ({ line, sectionTitleCn, sectionTitleVi }, idx) => {
                    const isPlayingThis = activePlayingId === line.id;
                    const tokens = segmentChineseSentence(
                      line.hanzi,
                      vocabSet,
                      sortedVocabKeys
                    );
                    const isPrevSameSection =
                      idx > 0 &&
                      data.dialogueLines[idx - 1].sectionTitleVi ===
                        sectionTitleVi;

                    const isLineAnswerRevealed =
                      !!revealedDialogueLineIds[line.id];
                    const lineCheck = dialogueCheckResults[line.id];

                    return (
                      <React.Fragment key={line.id}>
                        {!isPrevSameSection && (
                          <div className="pt-1 text-xs font-bold text-amber-900">
                            {sectionTitleCn} — {sectionTitleVi}
                          </div>
                        )}
                        <div
                          className={`rounded-xl border p-3 transition-all ${
                            isPlayingThis
                              ? 'border-amber-500 bg-amber-50/90 ring-2 ring-amber-500/20'
                              : 'border-stone-200/90 bg-white hover:border-stone-300'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2.5">
                            <div className="space-y-1 flex-1 min-w-0">
                              <div className="flex flex-wrap items-baseline gap-y-0.5 leading-relaxed">
                                <span className="mr-1.5 text-stone-400">˗</span>
                                {tokens.map((tok, tIdx) =>
                                  tok.isWord ? (
                                    <button
                                      key={tIdx}
                                      onClick={() =>
                                        onWordClick(
                                          tok.text,
                                          line.hanzi,
                                          data.primarySection.title_vi
                                        )
                                      }
                                      className={`rounded px-0.5 font-['Noto_Sans_SC'] text-base sm:text-lg font-bold transition-colors ${
                                        bookmarks[tok.text]
                                          ? 'bg-amber-200/70 text-amber-950 underline decoration-amber-600'
                                          : 'text-stone-900 hover:bg-amber-100 hover:text-amber-900'
                                      }`}
                                      title={`Tra từ "${tok.text}"`}
                                    >
                                      {tok.text}
                                    </button>
                                  ) : (
                                    <span
                                      key={tIdx}
                                      className="font-['Noto_Sans_SC'] text-base sm:text-lg text-stone-700"
                                    >
                                      {tok.text}
                                    </span>
                                  )
                                )}
                              </div>

                              {showPinyin && (
                                <p className="font-mono text-xs font-medium text-amber-800 pl-3">
                                  ˗ {line.pinyin}
                                </p>
                              )}
                            </div>

                            <button
                              onClick={() =>
                                onPlaySingleItem({
                                  id: line.id,
                                  hanzi: line.hanzi,
                                  pinyin: line.pinyin,
                                  meaningVi: line.meaningVi,
                                  speaker: 'Hội thoại',
                                })
                              }
                              className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                                isPlayingThis
                                  ? 'border-amber-700 bg-amber-700 text-white'
                                  : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-amber-50 hover:text-amber-800'
                              }`}
                              title="Phát âm câu thoại này"
                            >
                              <Volume2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="mt-2 flex flex-wrap items-center gap-1.5 pl-3">
                            <span className="text-stone-400 text-xs">˗</span>
                            <input
                              type="text"
                              value={dialogueTranslations[line.id] || ''}
                              onChange={(e) => {
                                setDialogueTranslations((prev) => ({
                                  ...prev,
                                  [line.id]: e.target.value,
                                }));
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleCheckDialogueTranslation(line);
                                }
                              }}
                              placeholder="........................................................................................"
                              className="flex-1 min-w-[140px] border-b border-dotted border-stone-400 bg-transparent py-0.5 text-xs text-stone-900 placeholder:text-stone-400 focus:border-amber-700 focus:outline-hidden"
                            />
                            <button
                              onClick={() =>
                                handleCheckDialogueTranslation(line)
                              }
                              disabled={!dialogueTranslations[line.id]?.trim()}
                              className="rounded-md bg-stone-900 px-2 py-1 text-[11px] font-semibold text-white hover:bg-stone-800 disabled:opacity-35 whitespace-nowrap shrink-0"
                            >
                              Kiểm tra
                            </button>
                            <button
                              onClick={() =>
                                setRevealedDialogueLineIds((prev) => ({
                                  ...prev,
                                  [line.id]: !prev[line.id],
                                }))
                              }
                              className="rounded-md border border-stone-200 bg-stone-50 px-2 py-1 text-[11px] font-medium text-stone-600 hover:text-amber-800 whitespace-nowrap shrink-0"
                            >
                              {isLineAnswerRevealed ? 'Ẩn dịch' : 'Đáp án'}
                            </button>
                          </div>

                          {lineCheck && (
                            <div className="mt-1.5 pl-3 flex items-center gap-2 text-xs">
                              <span
                                className={`font-semibold ${
                                  lineCheck.isCorrect
                                    ? 'text-emerald-700'
                                    : 'text-amber-700'
                                }`}
                              >
                                Độ chính xác: {lineCheck.score}%
                              </span>
                              <span className="text-stone-600">
                                — Nghĩa chuẩn: “{line.meaningVi}”
                              </span>
                            </div>
                          )}

                          {isLineAnswerRevealed && !lineCheck && (
                            <p className="mt-1 pl-3 text-xs font-medium text-emerald-800">
                              → Nghĩa chuẩn: {line.meaningVi}
                            </p>
                          )}
                        </div>
                      </React.Fragment>
                    );
                  }
                )}
              </div>
            </div>
          )}

          {/* SECTION III / IV: EXERCISES ON THIS PAGE */}
          {mainPageExercises.length > 0 &&
            renderExercisesBlock(data, mainPageExercises)}

          {/* Special Closing Message on Final Page */}
          {data.pageNumber === totalPages && (
            <div className="mt-8 py-6 text-center">
              <p className="font-['Noto_Sans_SC'] text-2xl font-bold italic tracking-wide text-stone-900">
                谢谢同学们！
              </p>
              <p className="mt-1 text-xs text-stone-500">
                Cảm ơn các bạn học viên đã hoàn thành Giáo Trình Hán Ngữ Hoa Sen{' '}
                {bookLabel}!
              </p>
            </div>
          )}
        </div>

        {/* Bottom Page Footer (Without "Trung tâm:") */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-stone-200/80 pt-3 text-[11px] text-stone-500">
          <span>
            Trang {data.pageNumber} / {totalPages}
          </span>
          <span className="font-medium text-stone-700 text-right">
            Hán ngữ Hoa Sen · Biên soạn: Nguyễn Thị Cẩm Nho
          </span>
        </div>
      </div>
    );
  };

  function renderExercisesBlock(
    data: PageContentData,
    exercisesList: PageContentData['pageExercises'] = data.pageExercises
  ) {
    return (
      <div className="space-y-3">
        {exercisesList.map(({ ex, indexInLesson, sectionHeading }, idx) => {
          const isPrevSameHeading =
            idx > 0 &&
            exercisesList[idx - 1].sectionHeading === sectionHeading;
          const attempt = attempts[ex.exercise_id];
          const userAns = attempt?.userAnswer || '';
          const checkRes = attempt?.aiResult;
          const isAnswerRevealed = !!revealedExerciseIds[ex.exercise_id];
          const sourceTokens = ex.source_hanzi
            ? segmentChineseSentence(
                ex.source_hanzi,
                vocabSet,
                sortedVocabKeys
              )
            : [];

          return (
            <React.Fragment key={ex.exercise_id}>
              {!isPrevSameHeading && (
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <h3 className="font-['Noto_Sans_SC'] text-xs sm:text-sm font-bold text-stone-900">
                    {sectionHeading}
                  </h3>
                  {data.lessonMeta && (
                    <button
                      onClick={() =>
                        onOpenPracticeForLesson(
                          data.lessonMeta!.lessonExerciseId
                        )
                      }
                      className="text-[11px] font-semibold text-amber-800 hover:underline"
                    >
                      Mở Bảng bài tập toàn bài →
                    </button>
                  )}
                </div>
              )}

              <div className="rounded-xl border border-stone-200 bg-white p-3.5 space-y-2.5">
                {ex.source_hanzi && (
                  <div className="rounded-lg bg-stone-50 border border-stone-200/80 p-3 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-stone-800">
                        {indexInLesson}. {ex.title || 'Đoạn văn:'}
                      </span>
                      <button
                        onClick={() =>
                          onPlaySingleItem({
                            id: `${ex.exercise_id}_src`,
                            hanzi: ex.source_hanzi!,
                            pinyin: ex.source_pinyin,
                            speaker: 'Bài đọc',
                          })
                        }
                        className="inline-flex items-center gap-1 rounded-md bg-amber-700 px-2.5 py-1 text-xs font-semibold text-white hover:bg-amber-800 shrink-0"
                      >
                        <Volume2 className="h-3.5 w-3.5" />
                        Đọc đoạn văn
                      </button>
                    </div>

                    <div className="flex flex-wrap items-baseline leading-relaxed">
                      {sourceTokens.map((tok, tIdx) =>
                        tok.isWord ? (
                          <button
                            key={tIdx}
                            onClick={() =>
                              onWordClick(
                                tok.text,
                                ex.source_hanzi,
                                data.primarySection.title_vi
                              )
                            }
                            className="rounded px-0.5 font-['Noto_Sans_SC'] text-base font-medium text-stone-900 hover:bg-amber-100 hover:text-amber-900"
                          >
                            {tok.text}
                          </button>
                        ) : (
                          <span
                            key={tIdx}
                            className="font-['Noto_Sans_SC'] text-base text-stone-700"
                          >
                            {tok.text}
                          </span>
                        )
                      )}
                    </div>

                    {showPinyin && ex.source_pinyin && (
                      <p className="font-mono text-xs leading-relaxed text-amber-800 pt-1 border-t border-stone-200/60">
                        {ex.source_pinyin}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex items-start justify-between gap-2">
                  <div className="text-xs sm:text-sm font-semibold text-stone-900">
                    {!ex.source_hanzi && (
                      <span className="font-mono text-stone-500 mr-1.5 tabular-nums">
                        {indexInLesson}.
                      </span>
                    )}
                    {ex.target_word ? (
                      <span>
                        ☞{' '}
                        <button
                          onClick={() => onWordClick(ex.target_word!)}
                          className="font-['Noto_Sans_SC'] text-base font-bold text-amber-900 underline"
                        >
                          {ex.target_word}
                        </button>{' '}
                        {showPinyin && ex.target_word_pinyin && (
                          <span className="font-mono text-xs text-amber-800">
                            （{ex.target_word_pinyin}）
                          </span>
                        )}
                      </span>
                    ) : (
                      <span>
                        {ex.grammar_point ? (
                          <span className="block text-xs font-bold text-amber-900 mb-1">
                            {ex.grammar_point}
                          </span>
                        ) : null}
                        {ex.exercise_type === 'luyen_tap_ngu_phap' &&
                        ex.vocab_grammar_notes ? (
                          <span className="mb-1.5 block rounded-lg border border-amber-200/80 bg-amber-50/60 px-2.5 py-1.5 text-[11px] font-normal leading-relaxed text-stone-700">
                            <strong className="font-semibold text-amber-950">
                              Lý thuyết:{' '}
                            </strong>
                            {ex.vocab_grammar_notes}
                          </span>
                        ) : null}
                        {ex.prompt_vietnamese || ex.title}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    value={userAns}
                    onChange={(e) =>
                      onSaveAttempt(ex.exercise_id, e.target.value, checkRes)
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleInlineCheckExercise(ex);
                      }
                    }}
                    placeholder={
                      ex.exercise_type === 'luyen_tap_doan_van'
                        ? 'Nhập bản dịch tiếng Việt vào dòng chấm...'
                        : 'Nhập đáp án chữ Hán hoặc Pinyin vào dòng chấm...'
                    }
                    className="flex-1 min-w-[160px] border-b border-dotted border-stone-400 bg-transparent py-1 font-['Noto_Sans_SC'] text-xs sm:text-sm text-stone-900 placeholder:font-sans placeholder:text-stone-400 focus:border-amber-700 focus:outline-hidden"
                  />

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleInlineCheckExercise(ex)}
                      disabled={!userAns.trim()}
                      className="inline-flex items-center gap-1 rounded-lg bg-stone-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-stone-800 disabled:opacity-40 whitespace-nowrap shrink-0"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Kiểm tra đáp án</span>
                    </button>

                    <button
                      onClick={() =>
                        setRevealedExerciseIds((prev) => ({
                          ...prev,
                          [ex.exercise_id]: !prev[ex.exercise_id],
                        }))
                      }
                      className="inline-flex items-center gap-1 rounded-lg border border-stone-200 bg-stone-50 px-2.5 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-100 whitespace-nowrap shrink-0"
                    >
                      {isAnswerRevealed ? 'Ẩn' : 'Đáp án'}
                    </button>
                  </div>
                </div>

                {(checkRes || isAnswerRevealed) && (
                  <div className="rounded-lg bg-[#FAF8F3] border border-stone-200/90 p-3 text-xs space-y-1.5">
                    {checkRes && (
                      <div className="flex items-center justify-between">
                        <span
                          className={`inline-flex items-center gap-1 font-bold ${
                            checkRes.status === 'correct'
                              ? 'text-emerald-700'
                              : checkRes.status === 'partial'
                              ? 'text-amber-700'
                              : 'text-rose-700'
                          }`}
                        >
                          {checkRes.status === 'correct' ? (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          ) : checkRes.status === 'partial' ? (
                            <AlertTriangle className="h-3.5 w-3.5" />
                          ) : (
                            <XCircle className="h-3.5 w-3.5" />
                          )}
                          {checkRes.summaryHeadline}
                        </span>
                      </div>
                    )}

                    <div className="flex items-start justify-between gap-2 pt-0.5">
                      <div className="space-y-0.5">
                        <div className="font-['Noto_Sans_SC'] text-sm font-bold text-stone-900">
                          Đáp án chuẩn: {ex.answer_hanzi}
                        </div>
                        <div className="font-mono text-xs text-amber-800">
                          {ex.answer_pinyin}
                        </div>
                        {ex.sample_sentence_vietnamese && (
                          <div className="text-xs text-stone-700">
                            Dịch nghĩa: {ex.sample_sentence_vietnamese}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() =>
                          onPlaySingleItem({
                            id: ex.exercise_id,
                            hanzi:
                              ex.exercise_type === 'luyen_tap_doan_van' &&
                              ex.source_hanzi
                                ? ex.source_hanzi
                                : ex.answer_hanzi,
                            pinyin:
                              ex.exercise_type === 'luyen_tap_doan_van' &&
                              ex.source_pinyin
                                ? ex.source_pinyin
                                : ex.answer_pinyin,
                            meaningVi: ex.prompt_vietnamese,
                            speaker: 'Đáp án chuẩn',
                          })
                        }
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-amber-700 text-white hover:bg-amber-800"
                        title="Nghe phát âm chuẩn"
                      >
                        <Volume2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {checkRes?.detailedFeedbackVi && (
                      <p className="text-[11px] text-stone-600">
                        {checkRes.detailedFeedbackVi}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={
        isFullScreen
          ? 'fixed inset-0 z-50 flex flex-col h-screen overflow-hidden bg-[#1E1915]'
          : 'space-y-4'
      }
    >
      {/* Floating Mini Control Pill when Fullscreen Toolbar is hidden */}
      {isFullScreen && !showFullScreenToolbar && (
        <div className="fixed top-2.5 right-2.5 z-40 flex items-center gap-1.5 rounded-full border border-stone-700/80 bg-stone-900/90 px-3 py-1.5 text-xs font-semibold text-white shadow-lg backdrop-blur-xs">
          <button
            onClick={() => setShowFullScreenToolbar(true)}
            className="inline-flex items-center gap-1.5 text-amber-300 hover:text-amber-200"
            title="Hiện thanh điều khiển trang & Pinyin"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Thanh điều khiển</span>
          </button>
          <span className="text-stone-600">|</span>
          <button
            onClick={handleToggleFullScreen}
            className="inline-flex items-center gap-1 text-stone-200 hover:text-white"
            title="Thu nhỏ toàn màn hình"
          >
            <Minimize2 className="h-3.5 w-3.5" />
            <span>Thu nhỏ</span>
          </button>
        </div>
      )}

      {/* Top Book Toolbar */}
      {(!isFullScreen || showFullScreenToolbar) && (
        <div
          className={`flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-between gap-2.5 rounded-xl border border-stone-200 bg-white p-3 sm:px-4 sm:py-2.5 shadow-2xs shrink-0 ${
            isFullScreen
              ? 'mx-auto mt-2 w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] max-w-[1720px] z-30'
              : ''
          }`}
        >
          {/* Left: Quick Lesson Jump & Page Counter */}
          <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2">
            <select
              value={leftPageData.primarySection.id}
              onChange={(e) => {
                const targetSec = sections.find((s) => s.id === e.target.value);
                if (targetSec) {
                  triggerPageFlip(
                    targetSec.page_start,
                    targetSec.page_start > currentPage ? 'next' : 'prev'
                  );
                }
              }}
              className="flex-1 sm:flex-initial max-w-full rounded-lg border border-stone-300 bg-stone-50 px-2.5 py-1.5 text-xs font-semibold text-stone-900 focus:border-amber-700 focus:bg-white focus:outline-hidden"
              aria-label="Chọn bài học"
            >
              {sections.map((sec) => (
                <option key={sec.id} value={sec.id}>
                  {completedLessons[sec.id] ? '✓ ' : ''}Tr.{sec.page_start}–
                  {sec.page_end}: {sec.title_vi}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={handleStepPrev}
                disabled={currentPage <= 1}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100 disabled:opacity-40"
                title="Lật trang trước"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-1 px-1.5 text-xs font-medium text-stone-700">
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={currentPage}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val)) {
                      onPageChange(Math.max(1, Math.min(totalPages, val)));
                    }
                  }}
                  className="w-11 rounded border border-stone-300 bg-white px-1 py-0.5 text-center font-mono text-xs font-bold tabular-nums text-stone-900"
                />
                <span className="text-stone-400">/ {totalPages}</span>
              </div>
              <button
                onClick={handleStepNext}
                disabled={currentPage >= totalPages}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100 disabled:opacity-40"
                title="Lật trang tiếp theo"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Right: Reading Display Controls & Fullscreen Button */}
          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-1.5 sm:gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={onTogglePinyin}
                className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  showPinyin
                    ? 'border-amber-300 bg-amber-50 text-amber-900'
                    : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                }`}
                title="Ẩn/hiện phiên âm Pinyin của chữ Hán trên trang sách"
              >
                {showPinyin ? (
                  <Eye className="h-3.5 w-3.5" />
                ) : (
                  <EyeOff className="h-3.5 w-3.5" />
                )}
                <span>Pinyin</span>
              </button>

              <button
                onClick={onToggleViMeaning}
                className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  showViMeaning
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                    : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                }`}
                title="Ẩn/hiện cột Nghĩa tiếng Việt trong bảng danh sách Từ mới (I. 生词)"
              >
                {showViMeaning ? (
                  <Eye className="h-3.5 w-3.5" />
                ) : (
                  <EyeOff className="h-3.5 w-3.5" />
                )}
                <span>Nghĩa từ vựng</span>
              </button>

              <button
                onClick={onToggleDualPage}
                className={`hidden xl:inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  dualPageMode
                    ? 'border-stone-900 bg-stone-900 text-white'
                    : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                }`}
              >
                <Columns2 className="h-3.5 w-3.5" />
                <span>{dualPageMode ? 'Sách mở 2 trang' : 'Xem 1 trang'}</span>
              </button>

              {/* PC Fullscreen Book Zoom Slider (60% – 150%) */}
              {isFullScreen && (
                <div
                  className="hidden md:inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-stone-50 px-2.5 py-1 shrink-0"
                  title="Kéo thanh trượt để phóng to / thu nhỏ kích thước sách trên màn hình PC"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setFullscreenZoom((z) => Math.max(60, z - 5))
                    }
                    disabled={fullscreenZoom <= 60}
                    className="inline-flex h-6 w-6 items-center justify-center rounded border border-stone-200 bg-white text-stone-700 hover:bg-amber-50 hover:text-amber-800 disabled:opacity-40"
                    title="Thu nhỏ sách (-5%)"
                  >
                    <ZoomOut className="h-3.5 w-3.5" />
                  </button>
                  <input
                    type="range"
                    min={60}
                    max={150}
                    step={5}
                    value={fullscreenZoom}
                    onChange={(e) =>
                      setFullscreenZoom(parseInt(e.target.value, 10))
                    }
                    aria-label="Thanh kéo tùy chỉnh kích thước sách"
                    className="w-24 lg:w-28 accent-amber-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFullscreenZoom((z) => Math.min(150, z + 5))
                    }
                    disabled={fullscreenZoom >= 150}
                    className="inline-flex h-6 w-6 items-center justify-center rounded border border-stone-200 bg-white text-stone-700 hover:bg-amber-50 hover:text-amber-800 disabled:opacity-40"
                    title="Phóng to sách (+5%)"
                  >
                    <ZoomIn className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setFullscreenZoom(100)}
                    className="min-w-[40px] rounded bg-amber-100/80 px-1.5 py-0.5 text-center font-mono text-[11px] font-bold text-amber-900 hover:bg-amber-200/80 tabular-nums"
                    title="Nhấn để đặt lại kích thước chuẩn 100%"
                  >
                    {fullscreenZoom}%
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleToggleFullScreen}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  isFullScreen
                    ? 'border-amber-600 bg-amber-700 text-white hover:bg-amber-800'
                    : 'border-stone-300 bg-stone-900 text-white hover:bg-stone-800'
                }`}
                title={
                  isFullScreen
                    ? 'Thu nhỏ trang sách (hoặc nhấn phím ESC)'
                    : 'Phóng to toàn màn hình trang sách để dễ lật và quan sát'
                }
              >
                {isFullScreen ? (
                  <>
                    <Minimize2 className="h-3.5 w-3.5" />
                    <span>Thu nhỏ</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="h-3.5 w-3.5" />
                    <span>Phóng to toàn màn hình</span>
                  </>
                )}
              </button>

              {isFullScreen && (
                <button
                  onClick={() => setShowFullScreenToolbar(false)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 bg-stone-100 text-stone-700 hover:bg-stone-200 shrink-0"
                  title="Tạm ẩn thanh điều khiển (hoặc chạm vào khoảng trống trên trang sách)"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Middle Scrollable Book Stage (In Fullscreen, only this middle stage scrolls while bottom bar stays pinned!) */}
      <div
        className={
          isFullScreen
            ? 'flex-1 min-h-0 overflow-y-auto px-1.5 sm:px-4 lg:px-6 py-2'
            : ''
        }
      >
        <div
          style={
            isFullScreen && fullscreenZoom !== 100
              ? ({ zoom: fullscreenZoom / 100 } as React.CSSProperties)
              : undefined
          }
          className={`book-stage-3d relative mx-auto w-full select-none cursor-grab active:cursor-grabbing ${
            isFullScreen ? 'max-w-[1720px]' : ''
          }`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleBookMouseDown}
          onMouseMove={handleBookMouseMove}
          onMouseUp={finishBookMouseDrag}
          onMouseLeave={finishBookMouseDrag}
          onClick={handleBookBlankAreaClick}
        >
          {/* Floating Live Drag/Swipe Indicator Pill */}
          {showInteractiveDragPreview && isMouseDragging && (
            <div className="pointer-events-none fixed top-16 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full border border-amber-400 bg-stone-900/90 px-4 py-1.5 text-xs font-bold text-amber-200 shadow-xl backdrop-blur-xs">
              <Hand className="h-4 w-4 text-amber-400" />
              <span>
                {effectiveDragDir === 'next'
                  ? directionalDragPx >= 65
                    ? '← Thả tay để lật sang Trang tiếp theo'
                    : '← Kéo qua lại để đong đưa trang sách'
                  : directionalDragPx >= 65
                  ? 'Thả tay để lật về Trang trước →'
                  : 'Kéo qua lại để đong đưa trang sách →'}
              </span>
            </div>
          )}

          {/* Outer Hardcover Book Binding Frame */}
          <div className="relative rounded-2xl sm:rounded-3xl bg-[#252A36] p-2 sm:p-3.5 shadow-2xl ring-1 ring-stone-900/20">
            {/* Book Page Spread (IMPORTANT: Do NOT use overflow-hidden here as CSS spec flattens preserve-3d!) */}
            <div
              className={`book-spread-3d relative grid grid-cols-1 ${
                isShowingDualSpread ? 'xl:grid-cols-2' : ''
              } rounded-xl sm:rounded-2xl bg-[#FCFBF7] shadow-inner`}
            >
              {/* Static Left / Single Page Underneath */}
              {renderSingleBookPage(
                baseLeftPageData,
                isShowingDualSpread ? 'left' : 'single'
              )}

              {/* Static Right Page Underneath (ONLY when Dual-Page Spread Mode is active) */}
              {isShowingDualSpread && baseRightPageData && (
                <div className="hidden xl:flex xl:flex-col h-full">
                  {renderSingleBookPage(baseRightPageData, 'right')}
                </div>
              )}

              {/* Central Book Spine Crease Line (ONLY in Dual-Page Spread Mode) */}
              {isShowingDualSpread && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-1/2 z-30 hidden xl:block w-12 -translate-x-1/2 bg-gradient-to-r from-transparent via-stone-900/20 to-transparent"
                />
              )}

              {/* LIVE INTERACTIVE TWO-SIDED 3D CURLING LEAF (Follows finger & mouse smoothly back and forth, and springs back on halfway release!) */}
              {showInteractiveDragPreview && (
                <>
                  {isShowingDualSpread && (
                    <div
                      aria-hidden="true"
                      style={{
                        transformOrigin:
                          effectiveDragDir === 'next'
                            ? 'left center'
                            : 'right center',
                        transformStyle: 'preserve-3d',
                        transition: isSpringingBack
                          ? 'transform 420ms cubic-bezier(0.25, 1.35, 0.45, 1)'
                          : 'transform 18ms linear',
                        transform:
                          effectiveDragDir === 'next'
                            ? `rotateY(${-activeDragProgress * 165}deg) rotateZ(${
                                -Math.sin(activeDragProgress * Math.PI) * 1.1
                              }deg)`
                            : `rotateY(${activeDragProgress * 165}deg) rotateZ(${
                                Math.sin(activeDragProgress * Math.PI) * 1.1
                              }deg)`,
                      }}
                      className={`pointer-events-none absolute inset-y-0 z-20 hidden xl:block w-1/2 ${
                        effectiveDragDir === 'next' ? 'left-1/2' : 'left-0'
                      }`}
                    >
                      {/* Front Face of Dragged Leaf */}
                      <div className="leaf-face-front absolute inset-0 overflow-hidden rounded-2xl shadow-2xl">
                        {effectiveDragDir === 'next' && rightPageData
                          ? renderSingleBookPage(rightPageData, 'right')
                          : renderSingleBookPage(leftPageData, 'left')}
                        <div
                          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-stone-950/20 via-transparent to-stone-950/15"
                          style={{
                            opacity: Math.sin(activeDragProgress * Math.PI) * 0.85,
                          }}
                        />
                      </div>
                      {/* Back Face of Dragged Leaf */}
                      <div className="leaf-face-back absolute inset-0 overflow-hidden rounded-2xl shadow-2xl">
                        {effectiveDragDir === 'next'
                          ? renderSingleBookPage(
                              getPageData(Math.min(totalPages, currentPage + 2)),
                              'left'
                            )
                          : renderSingleBookPage(
                              getPageData(Math.max(1, currentPage - 1)),
                              'right'
                            )}
                      </div>
                    </div>
                  )}

                  {/* Single-Page Live Touch & Mouse Swinging Leaf */}
                  <div
                    aria-hidden="true"
                    style={{
                      transformOrigin: 'left center',
                      transformStyle: 'preserve-3d',
                      transition: isSpringingBack
                        ? 'transform 420ms cubic-bezier(0.25, 1.35, 0.45, 1)'
                        : 'transform 18ms linear',
                      transform:
                        effectiveDragDir === 'next'
                          ? `rotateY(${-activeDragProgress * 145}deg) rotateZ(${
                              -Math.sin(activeDragProgress * Math.PI) * 1.1
                            }deg)`
                          : `rotateY(${
                              -145 + activeDragProgress * 145
                            }deg) rotateZ(${
                              -Math.sin((1 - activeDragProgress) * Math.PI) * 1.1
                            }deg)`,
                    }}
                    className={`pointer-events-none absolute inset-0 z-20 ${
                      isShowingDualSpread ? 'xl:hidden' : ''
                    } overflow-hidden rounded-xl sm:rounded-2xl shadow-2xl`}
                  >
                    {effectiveDragDir === 'next'
                      ? renderSingleBookPage(leftPageData, 'single')
                      : renderSingleBookPage(
                          getPageData(Math.max(1, currentPage - 1)),
                          'single'
                        )}
                    <div
                      className="pointer-events-none absolute inset-0 bg-gradient-to-r from-stone-950/25 via-transparent to-stone-950/15"
                      style={{
                        opacity: Math.sin(activeDragProgress * Math.PI) * 0.8,
                      }}
                    />
                  </div>
                </>
              )}

              {/* REALISTIC TWO-SIDED 3D PAGE-TURNING LEAF WITH ACTUAL BOOK PAGES */}
              {turningState && (
                <>
                  {/* 2-Page Spread Two-Sided 3D Turning Leaf */}
                  {isShowingDualSpread && (
                    <div
                      aria-hidden="true"
                      style={
                        {
                          '--start-angle': `${turningState.startAngle}deg`,
                        } as React.CSSProperties
                      }
                      className={`pointer-events-none absolute inset-y-0 z-20 hidden xl:block w-1/2 ${
                        turningState.dir === 'next'
                          ? 'left-1/2 turning-leaf-next-dual'
                          : 'left-0 turning-leaf-prev-dual'
                      }`}
                    >
                      {/* Front Face of the 3D Leaf */}
                      <div className="leaf-face-front absolute inset-0 overflow-hidden rounded-2xl">
                        {turningState.dir === 'next'
                          ? renderSingleBookPage(
                              getPageData(
                                Math.min(totalPages, turningState.fromPage + 1)
                              ),
                              'right'
                            )
                          : renderSingleBookPage(
                              getPageData(turningState.fromPage),
                              'left'
                            )}
                      </div>

                      {/* Back Face of the 3D Leaf (Revealed as the leaf passes -90deg / +90deg) */}
                      <div className="leaf-face-back absolute inset-0 overflow-hidden rounded-2xl">
                        {turningState.dir === 'next'
                          ? renderSingleBookPage(
                              getPageData(turningState.toPage),
                              'left'
                            )
                          : renderSingleBookPage(
                              getPageData(
                                Math.min(totalPages, turningState.toPage + 1)
                              ),
                              'right'
                            )}
                      </div>
                    </div>
                  )}

                  {/* Single-Page Real Content 3D Turning Leaf */}
                  <div
                    aria-hidden="true"
                    style={
                      {
                        '--start-angle':
                          turningState.dir === 'prev' &&
                          turningState.startAngle === 0
                            ? '-145deg'
                            : `${turningState.startAngle}deg`,
                      } as React.CSSProperties
                    }
                    className={`pointer-events-none absolute inset-0 z-20 ${
                      isShowingDualSpread ? 'xl:hidden' : ''
                    } overflow-hidden rounded-xl sm:rounded-2xl ${
                      turningState.dir === 'next'
                        ? 'turning-leaf-next-single'
                        : 'turning-leaf-prev-single'
                    }`}
                  >
                    {turningState.dir === 'next'
                      ? renderSingleBookPage(
                          getPageData(turningState.fromPage),
                          'single'
                        )
                      : renderSingleBookPage(
                          getPageData(turningState.toPage),
                          'single'
                        )}
                  </div>
                </>
              )}
            </div>

            {/* Bottom Page-Turn Bar (In normal mode, rendered inside book frame) */}
            {!isFullScreen && (
              <div className="mt-2.5 flex items-center justify-between gap-2 px-1 sm:px-2 text-xs text-stone-300">
                <button
                  onClick={handleStepPrev}
                  disabled={currentPage <= 1}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-stone-800/90 px-3 sm:px-4 py-2 text-xs font-semibold text-amber-100 hover:bg-stone-700 disabled:opacity-40 transition-colors shrink-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Trang trước</span>
                </button>

                <div className="flex flex-1 max-w-xs items-center gap-2 px-2">
                  <input
                    type="range"
                    min={1}
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => onPageChange(parseInt(e.target.value, 10))}
                    aria-label={`Thanh trượt chọn trang sách từ 1 đến ${totalPages}`}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <span className="font-mono text-xs text-amber-300 tabular-nums whitespace-nowrap">
                    {currentPage}/{totalPages}
                  </span>
                </div>

                <button
                  onClick={handleStepNext}
                  disabled={currentPage >= totalPages}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 sm:px-4 py-2 text-xs font-semibold text-white hover:bg-amber-500 disabled:opacity-40 transition-colors shrink-0"
                >
                  <span>Lật trang sau</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PINNED BOTTOM PAGE-TURN BAR IN FULLSCREEN MODE (Never scrolls with page!) */}
      {isFullScreen && (
        <div className="shrink-0 z-30 border-t border-stone-800 bg-[#261F19]/95 px-3 sm:px-6 py-2.5 shadow-2xl backdrop-blur-xs">
          <div className="mx-auto flex w-full max-w-[1720px] items-center justify-between gap-3 text-xs text-stone-300">
            <button
              onClick={handleStepPrev}
              disabled={currentPage <= 1}
              className="inline-flex items-center gap-1.5 rounded-lg bg-stone-800 px-3.5 sm:px-4 py-2 text-xs font-semibold text-amber-100 hover:bg-stone-700 disabled:opacity-40 transition-colors shrink-0"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Trang trước</span>
            </button>

            <div className="flex flex-1 max-w-md items-center gap-2.5 px-2">
              <span className="hidden sm:inline text-[11px] text-stone-400 whitespace-nowrap">
                Trang:
              </span>
              <input
                type="range"
                min={1}
                max={totalPages}
                value={currentPage}
                onChange={(e) => onPageChange(parseInt(e.target.value, 10))}
                aria-label={`Thanh trượt chọn trang sách từ 1 đến ${totalPages}`}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="font-mono text-xs font-bold text-amber-300 tabular-nums whitespace-nowrap">
                {currentPage}/{totalPages}
              </span>
            </div>

            {/* Bottom PC Zoom Slider in Fullscreen (Always accessible even when top toolbar is hidden) */}
            <div className="hidden md:flex items-center gap-1.5 rounded-lg border border-stone-700 bg-stone-800/90 px-2.5 py-1.5 shrink-0">
              <span className="text-[11px] font-medium text-stone-300 whitespace-nowrap">
                Cỡ sách:
              </span>
              <button
                type="button"
                onClick={() => setFullscreenZoom((z) => Math.max(60, z - 5))}
                disabled={fullscreenZoom <= 60}
                className="inline-flex h-6 w-6 items-center justify-center rounded bg-stone-700 text-amber-200 hover:bg-stone-600 disabled:opacity-40"
                title="Thu nhỏ kích thước sách (-5%)"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <input
                type="range"
                min={60}
                max={150}
                step={5}
                value={fullscreenZoom}
                onChange={(e) =>
                  setFullscreenZoom(parseInt(e.target.value, 10))
                }
                aria-label="Thanh kéo thu phóng kích thước sách"
                className="w-24 lg:w-28 accent-amber-500 cursor-pointer"
              />
              <button
                type="button"
                onClick={() => setFullscreenZoom((z) => Math.min(150, z + 5))}
                disabled={fullscreenZoom >= 150}
                className="inline-flex h-6 w-6 items-center justify-center rounded bg-stone-700 text-amber-200 hover:bg-stone-600 disabled:opacity-40"
                title="Phóng to kích thước sách (+5%)"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setFullscreenZoom(100)}
                className="min-w-[40px] rounded bg-stone-900 px-1.5 py-0.5 text-center font-mono text-[11px] font-bold text-amber-300 hover:bg-stone-700 tabular-nums"
                title="Nhấn để đặt lại kích thước 100%"
              >
                {fullscreenZoom}%
              </button>
            </div>

            <button
              onClick={handleStepNext}
              disabled={currentPage >= totalPages}
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3.5 sm:px-4 py-2 text-xs font-semibold text-white hover:bg-amber-500 disabled:opacity-40 transition-colors shrink-0"
            >
              <span>Lật trang sau</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
