import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Bookmark,
  Volume2,
  Trash2,
  Play,
  Square,
  BookOpen,
  Search,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  Maximize2,
  Minimize2,
  Settings,
  X,
  RotateCcw,
} from 'lucide-react';
import { BookmarkedWord } from '../types/textbook';
import {
  getPrimaryHanziKeyword,
  buildBingImageThumbUrl,
  buildHanziiDictUrl,
} from '../utils/visualDictionary';

interface VocabularyNotebookProps {
  bookmarks: Record<string, BookmarkedWord>;
  onRemoveBookmark: (hanzi: string) => void;
  onUpdateTag: (hanzi: string, tag: BookmarkedWord['tag']) => void;
  onSpeak: (text: string, slow?: boolean) => void;
  onOpenDictionary: (hanzi: string) => void;
  onJumpToPage: (page: number) => void;
  isPlayingPlaylist: boolean;
  onPlayWordList: (words: BookmarkedWord[]) => void;
  onStopPlaylist: () => void;
}

const SWIPE_COMMIT_THRESHOLD = 125;

const TAG_META: Record<
  BookmarkedWord['tag'],
  { label: string; badgeClass: string; activeBtnClass: string }
> = {
  quan_trong: {
    label: 'Chưa thuộc',
    badgeClass: 'text-emerald-800 bg-emerald-50 border-emerald-200',
    activeBtnClass: 'border-emerald-600 bg-emerald-600 text-white',
  },
  can_on: {
    label: 'Cần ôn tập',
    badgeClass: 'text-amber-800 bg-amber-50 border-amber-200',
    activeBtnClass: 'border-amber-600 bg-amber-600 text-white',
  },
  hay_nham: {
    label: 'Hay nhầm',
    badgeClass: 'text-purple-800 bg-purple-50 border-purple-200',
    activeBtnClass: 'border-purple-600 bg-purple-600 text-white',
  },
  da_thuoc: {
    label: 'Đã thuộc',
    badgeClass: 'text-sky-800 bg-sky-50 border-sky-200',
    activeBtnClass: 'border-sky-600 bg-sky-600 text-white',
  },
};

export const VocabularyNotebook: React.FC<VocabularyNotebookProps> = ({
  bookmarks,
  onRemoveBookmark,
  onUpdateTag,
  onSpeak,
  onOpenDictionary,
  onJumpToPage,
  isPlayingPlaylist,
  onPlayWordList,
  onStopPlaylist,
}) => {
  const [filterTag, setFilterTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [mode, setMode] = useState<'list' | 'flashcard'>('list');
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Flashcard Settings Modal ("Tùy chọn") states matching user's reference screenshot
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [learningMethod, setLearningMethod] = useState<
    'phan_loai_co_ban' | 'duyet_tim_the'
  >('phan_loai_co_ban');
  const [onlyUnmemorized, setOnlyUnmemorized] = useState(false);
  const [autoSpeakCard, setAutoSpeakCard] = useState(false);
  const [shuffleSeed, setShuffleSeed] = useState<number | null>(null);
  const [frontSideMode, setFrontSideMode] = useState<'zh' | 'vi'>('zh');
  const [showFrontPinyin, setShowFrontPinyin] = useState(false);
  const [isFlashcardFullScreen, setIsFlashcardFullScreen] = useState(false);

  const [flashcardImgError, setFlashcardImgError] = useState<
    Record<string, boolean>
  >({});

  // Swipe / Drag state for Flashcard quick classification (Left Green = Chưa thuộc, Right Blue = Đã thuộc)
  const [dragDeltaX, setDragDeltaX] = useState<number>(0);
  const [isDraggingCard, setIsDraggingCard] = useState<boolean>(false);
  const [flyOutDir, setFlyOutDir] = useState<'left' | 'right' | null>(null);
  const [swipeFeedback, setSwipeFeedback] = useState<{
    text: string;
    tone: 'emerald' | 'sky';
  } | null>(null);

  const dragStartXRef = useRef<number | null>(null);
  const didSwipeMoveRef = useRef<boolean>(false);
  const thresholdVibratedRef = useRef<boolean>(false);

  // Sync Escape key for Flashcard Fullscreen and Settings Modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isSettingsOpen) {
          setIsSettingsOpen(false);
        } else if (isFlashcardFullScreen) {
          setIsFlashcardFullScreen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlashcardFullScreen, isSettingsOpen]);

  const toggleFlashcardFullScreen = () => {
    setIsFlashcardFullScreen((prev) => !prev);
  };

  // Word counts per category across all bookmarks
  const tagCounts = useMemo(() => {
    const allItems = Object.values(bookmarks) as BookmarkedWord[];
    const counts: Record<'all' | BookmarkedWord['tag'], number> = {
      all: allItems.length,
      quan_trong: 0,
      can_on: 0,
      hay_nham: 0,
      da_thuoc: 0,
    };
    for (const item of allItems) {
      if (counts[item.tag] !== undefined) {
        counts[item.tag]++;
      }
    }
    return counts;
  }, [bookmarks]);

  const bookmarkList = useMemo(() => {
    const arr = (Object.values(bookmarks) as BookmarkedWord[]).sort(
      (a, b) => b.createdAt - a.createdAt
    );
    const filtered = arr.filter((item) => {
      if (mode === 'flashcard' && onlyUnmemorized && item.tag === 'da_thuoc') {
        return false;
      }
      const matchTag = filterTag === 'all' || item.tag === filterTag;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        item.hanzi.toLowerCase().includes(q) ||
        item.pinyin.toLowerCase().includes(q) ||
        item.meaning_vi.toLowerCase().includes(q) ||
        item.personalNote.toLowerCase().includes(q);
      return matchTag && matchSearch;
    });

    if (mode === 'flashcard' && shuffleSeed !== null && filtered.length > 1) {
      const copy = [...filtered];
      let seed = shuffleSeed;
      for (let i = copy.length - 1; i > 0; i--) {
        seed = (seed * 1664525 + 1013904223) % 4294967296;
        const j = seed % (i + 1);
        const temp = copy[i];
        copy[i] = copy[j];
        copy[j] = temp;
      }
      return copy;
    }

    return filtered;
  }, [
    bookmarks,
    filterTag,
    searchQuery,
    mode,
    onlyUnmemorized,
    shuffleSeed,
  ]);

  const activeCard =
    bookmarkList.length > 0
      ? bookmarkList[cardIndex % bookmarkList.length]
      : null;

  // Auto-speak when switching card if "Chuyển văn bản thành lời nói" is enabled
  useEffect(() => {
    if (mode === 'flashcard' && autoSpeakCard && activeCard) {
      onSpeak(activeCard.hanzi, false);
    }
  }, [cardIndex, mode, autoSpeakCard, activeCard?.hanzi]);

  const activeCardKeyword = activeCard
    ? getPrimaryHanziKeyword(activeCard.hanzi)
    : '';
  const activeCardThumbUrl = activeCardKeyword
    ? buildBingImageThumbUrl(activeCardKeyword, 400, 260, 1)
    : '';
  const activeCardHanziiUrl = activeCardKeyword
    ? buildHanziiDictUrl(activeCardKeyword)
    : '';

  const triggerSwipeClassification = (
    direction: 'left_quan_trong' | 'right_da_thuoc'
  ) => {
    if (!activeCard || flyOutDir) return;
    const targetTag: BookmarkedWord['tag'] =
      direction === 'left_quan_trong' ? 'quan_trong' : 'da_thuoc';
    const label =
      direction === 'left_quan_trong' ? 'Chưa thuộc' : 'Đã thuộc';
    const cardHanzi = activeCard.hanzi;

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(35);
    }

    setFlyOutDir(direction === 'left_quan_trong' ? 'left' : 'right');

    setTimeout(() => {
      onUpdateTag(cardHanzi, targetTag);
      setSwipeFeedback({
        text: `Đã phân loại “${cardHanzi}” → ${label}`,
        tone: direction === 'left_quan_trong' ? 'emerald' : 'sky',
      });

      setFlyOutDir(null);
      setDragDeltaX(0);
      setIsFlipped(false);
      if (bookmarkList.length > 1) {
        setCardIndex((prev) => (prev + 1) % bookmarkList.length);
      }

      setTimeout(() => {
        setSwipeFeedback(null);
      }, 1600);
    }, 250);
  };

  const triggerBrowseSwipe = (dir: 'prev' | 'next') => {
    if (!activeCard || flyOutDir || bookmarkList.length <= 1) return;
    setFlyOutDir(dir === 'next' ? 'left' : 'right');
    setTimeout(() => {
      setFlyOutDir(null);
      setDragDeltaX(0);
      setIsFlipped(false);
      setCardIndex((prev) =>
        dir === 'next'
          ? (prev + 1) % bookmarkList.length
          : (prev - 1 + bookmarkList.length) % bookmarkList.length
      );
    }, 220);
  };

  // Touch handlers for Flashcard
  const handleCardTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1 || flyOutDir) return;
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) return;
    dragStartXRef.current = e.touches[0].clientX;
    didSwipeMoveRef.current = false;
    thresholdVibratedRef.current = false;
    setIsDraggingCard(true);
  };

  const handleCardTouchMove = (e: React.TouchEvent) => {
    if (dragStartXRef.current === null || e.touches.length === 0 || flyOutDir)
      return;
    const dx = e.touches[0].clientX - dragStartXRef.current;
    if (Math.abs(dx) > 10) {
      didSwipeMoveRef.current = true;
    }
    const clampedDx = Math.max(-240, Math.min(240, dx));
    if (
      Math.abs(clampedDx) >= SWIPE_COMMIT_THRESHOLD &&
      !thresholdVibratedRef.current
    ) {
      thresholdVibratedRef.current = true;
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(15);
      }
    } else if (Math.abs(clampedDx) < SWIPE_COMMIT_THRESHOLD) {
      thresholdVibratedRef.current = false;
    }
    setDragDeltaX(clampedDx);
  };

  const handleCardTouchEnd = () => {
    if (dragStartXRef.current === null) return;
    const finalDx = dragDeltaX;
    dragStartXRef.current = null;
    setIsDraggingCard(false);

    if (learningMethod === 'phan_loai_co_ban') {
      if (finalDx <= -SWIPE_COMMIT_THRESHOLD) {
        triggerSwipeClassification('left_quan_trong');
      } else if (finalDx >= SWIPE_COMMIT_THRESHOLD) {
        triggerSwipeClassification('right_da_thuoc');
      } else {
        setDragDeltaX(0);
      }
    } else {
      if (finalDx <= -SWIPE_COMMIT_THRESHOLD) {
        triggerBrowseSwipe('next');
      } else if (finalDx >= SWIPE_COMMIT_THRESHOLD) {
        triggerBrowseSwipe('prev');
      } else {
        setDragDeltaX(0);
      }
    }
  };

  // Mouse drag handlers for Flashcard on PC
  const handleCardMouseDown = (e: React.MouseEvent) => {
    if (flyOutDir) return;
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) return;
    dragStartXRef.current = e.clientX;
    didSwipeMoveRef.current = false;
    thresholdVibratedRef.current = false;
    setIsDraggingCard(true);
  };

  const handleCardMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingCard || dragStartXRef.current === null || flyOutDir) return;
    const dx = e.clientX - dragStartXRef.current;
    if (Math.abs(dx) > 10) {
      didSwipeMoveRef.current = true;
    }
    setDragDeltaX(Math.max(-250, Math.min(250, dx)));
  };

  const handleCardMouseUpOrLeave = () => {
    if (!isDraggingCard || dragStartXRef.current === null) return;
    const finalDx = dragDeltaX;
    dragStartXRef.current = null;
    setIsDraggingCard(false);

    if (learningMethod === 'phan_loai_co_ban') {
      if (finalDx <= -SWIPE_COMMIT_THRESHOLD) {
        triggerSwipeClassification('left_quan_trong');
      } else if (finalDx >= SWIPE_COMMIT_THRESHOLD) {
        triggerSwipeClassification('right_da_thuoc');
      } else {
        setDragDeltaX(0);
      }
    } else {
      if (finalDx <= -SWIPE_COMMIT_THRESHOLD) {
        triggerBrowseSwipe('next');
      } else if (finalDx >= SWIPE_COMMIT_THRESHOLD) {
        triggerBrowseSwipe('prev');
      } else {
        setDragDeltaX(0);
      }
    }
  };

  const swipeProgressRatio = Math.min(
    1,
    Math.abs(dragDeltaX) / SWIPE_COMMIT_THRESHOLD
  );
  const isReadyToCommitLeft = dragDeltaX <= -SWIPE_COMMIT_THRESHOLD;
  const isReadyToCommitRight = dragDeltaX >= SWIPE_COMMIT_THRESHOLD;

  const currentCardPosition =
    bookmarkList.length > 0 ? (cardIndex % bookmarkList.length) + 1 : 0;
  const progressPercent =
    bookmarkList.length > 0
      ? Math.round((currentCardPosition / bookmarkList.length) * 100)
      : 0;

  return (
    <div className="space-y-5">
      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-xl border border-stone-200 bg-white p-4 sm:p-5">
        <div>
          <h2 className="font-['Fraunces'] text-lg sm:text-xl font-bold text-stone-900">
            Sổ Tay Từ Vựng Đánh Dấu ({tagCounts.all} từ)
          </h2>
          <p className="mt-0.5 text-xs text-stone-600">
            Lưu trữ các từ vựng cần lưu ý khi đọc sách, phát âm liên tục và ôn luyện bằng thẻ Flashcard 3D có hình ảnh.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {bookmarkList.length > 0 && (
            <button
              onClick={() =>
                isPlayingPlaylist
                  ? onStopPlaylist()
                  : onPlayWordList(bookmarkList)
              }
              className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                isPlayingPlaylist
                  ? 'bg-rose-700 text-white hover:bg-rose-800'
                  : 'bg-amber-700 text-white hover:bg-amber-800'
              }`}
            >
              {isPlayingPlaylist ? (
                <>
                  <Square className="h-3.5 w-3.5 fill-current" />
                  Dừng đọc danh sách
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-current" />
                  Phát âm toàn bộ ({bookmarkList.length} từ)
                </>
              )}
            </button>
          )}

          <div className="grid grid-cols-2 rounded-lg bg-stone-100 p-1 w-full sm:w-auto">
            <button
              onClick={() => {
                setMode('list');
                setIsFlashcardFullScreen(false);
              }}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap text-center ${
                mode === 'list'
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Danh sách chi tiết
            </button>
            <button
              onClick={() => {
                setMode('flashcard');
                setCardIndex(0);
                setIsFlipped(false);
              }}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap text-center ${
                mode === 'flashcard'
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Thẻ Flashcard 3D
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar with Category Counts */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-stone-200 bg-white p-3.5 sm:p-4">
        <div className="flex items-center gap-1 overflow-x-auto rounded-lg bg-stone-100 p-1">
          {[
            { id: 'all', label: 'Tất cả nhãn', count: tagCounts.all },
            {
              id: 'quan_trong',
              label: 'Chưa thuộc',
              count: tagCounts.quan_trong,
            },
            { id: 'can_on', label: 'Cần ôn tập', count: tagCounts.can_on },
            { id: 'hay_nham', label: 'Hay nhầm', count: tagCounts.hay_nham },
            { id: 'da_thuoc', label: 'Đã thuộc', count: tagCounts.da_thuoc },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setFilterTag(tab.id);
                setCardIndex(0);
              }}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                filterTag === tab.id
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono tabular-nums ${
                  filterTag === tab.id
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-200/80 text-stone-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm chữ Hán, Pinyin, nghĩa..."
            className="w-full rounded-lg border border-stone-200 bg-stone-50 py-2 pl-9 pr-3 text-xs text-stone-900 placeholder:text-stone-400 focus:border-amber-700 focus:bg-white focus:outline-hidden"
          />
        </div>
      </div>

      {/* Empty State */}
      {bookmarkList.length === 0 ? (
        <div className="rounded-xl border border-stone-200 bg-white p-12 text-center">
          <Bookmark className="mx-auto h-10 w-10 text-stone-300" />
          <h3 className="mt-3 text-base font-bold text-stone-900">
            Chưa có từ vựng nào trong nhóm này
          </h3>
          <p className="mx-auto mt-1 max-w-md text-xs text-stone-500">
            {onlyUnmemorized
              ? 'Tất cả từ vựng trong nhóm này đã được đánh dấu Đã thuộc. Bạn có thể tắt bộ lọc “Chỉ học từ chưa thuộc” trong nút Cài đặt (⚙) để ôn lại toàn bộ.'
              : 'Khi đọc sách điện tử, bạn hãy nhấn vào biểu tượng đánh dấu cạnh từ mới hoặc nhấn trực tiếp vào bất kỳ chữ Hán nào trong hội thoại để lưu vào sổ tay.'}
          </p>
          {onlyUnmemorized && (
            <button
              onClick={() => setOnlyUnmemorized(false)}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-amber-700 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-800"
            >
              Hiện lại toàn bộ từ vựng
            </button>
          )}
        </div>
      ) : mode === 'flashcard' && activeCard ? (
        /* 3D Flashcard Review Mode */
        <div
          className={
            isFlashcardFullScreen
              ? 'fixed inset-0 z-50 overflow-y-auto bg-[#F6F4EE] px-3 pt-3 pb-28 sm:px-6 sm:pt-5'
              : 'mx-auto max-w-xl space-y-3 pb-24 px-1'
          }
        >
          <div className="mx-auto max-w-xl space-y-3 overflow-x-clip">
            {/* Top Header Bar: Left = Fullscreen/Close, Center = Progress (6 / 50), Right = 1 Main Settings Gear Button */}
            <div className="space-y-2 rounded-2xl border border-stone-200 bg-white px-3.5 py-2.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={toggleFlashcardFullScreen}
                  className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 px-3 text-xs font-semibold text-stone-700 hover:bg-stone-100 transition-colors"
                  title={
                    isFlashcardFullScreen
                      ? 'Thu nhỏ giao diện Flashcard (Esc)'
                      : 'Phóng to toàn màn hình giao diện Flashcard'
                  }
                >
                  {isFlashcardFullScreen ? (
                    <>
                      <Minimize2 className="h-4 w-4 text-stone-700" />
                      <span>Thu nhỏ</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="h-4 w-4 text-stone-700" />
                      <span>Phóng to</span>
                    </>
                  )}
                </button>

                <div className="font-mono text-sm sm:text-base font-bold text-stone-800 tabular-nums">
                  {currentCardPosition} / {bookmarkList.length}
                </div>

                {/* Single Main Settings Gear Button ("Gôm các nút chức năng vào đúng 1 nút cài đặt chính như ảnh") */}
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(true)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100 transition-colors"
                  title="Tùy chọn cài đặt thẻ ghi nhớ"
                  aria-label="Tùy chọn cài đặt thẻ ghi nhớ"
                >
                  <Settings className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Thin Progress Bar */}
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
                <div
                  className="h-full rounded-full bg-amber-600 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Classification Counter Pills Row: ONLY shown when learningMethod === 'phan_loai_co_ban'
                Left = Xanh lá (Chưa thuộc), Right = Xanh dương (Đã thuộc) */}
            {learningMethod === 'phan_loai_co_ban' && (
              <div className="flex items-center justify-between gap-3 pt-0.5">
                {/* Left Green Pill: Chưa thuộc */}
                <button
                  type="button"
                  onClick={() => triggerSwipeClassification('left_quan_trong')}
                  className={`inline-flex items-center gap-2 rounded-l-lg rounded-r-full border-2 px-3.5 py-1.5 text-xs font-bold transition-all shrink-0 ${
                    dragDeltaX < -40
                      ? 'scale-105 border-emerald-600 bg-emerald-600 text-white shadow-md'
                      : 'border-emerald-500 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                  title="Nhấn hoặc vuốt thẻ sang trái: Chưa thuộc"
                >
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1.5 font-mono text-xs font-extrabold text-white tabular-nums">
                    {tagCounts.quan_trong}
                  </span>
                  <span>Chưa thuộc</span>
                </button>

                {/* Center Feedback Toast when classified */}
                <div className="flex-1 flex items-center justify-center min-w-0">
                  {swipeFeedback && (
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold truncate ${
                        swipeFeedback.tone === 'emerald'
                          ? 'bg-emerald-100 text-emerald-900'
                          : 'bg-sky-100 text-sky-900'
                      }`}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{swipeFeedback.text}</span>
                    </span>
                  )}
                </div>

                {/* Right Blue Pill: Đã thuộc */}
                <button
                  type="button"
                  onClick={() => triggerSwipeClassification('right_da_thuoc')}
                  className={`inline-flex items-center gap-2 rounded-r-lg rounded-l-full border-2 px-3.5 py-1.5 text-xs font-bold transition-all shrink-0 ${
                    dragDeltaX > 40
                      ? 'scale-105 border-sky-600 bg-sky-600 text-white shadow-md'
                      : 'border-sky-500 bg-sky-50 text-sky-700 hover:bg-sky-100'
                  }`}
                  title="Nhấn hoặc vuốt thẻ sang phải: Đã thuộc"
                >
                  <span>Đã thuộc</span>
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-sky-600 px-1.5 font-mono text-xs font-extrabold text-white tabular-nums">
                    {tagCounts.da_thuoc}
                  </span>
                </button>
              </div>
            )}

            {/* Interactive Swipeable / Draggable Flashcard */}
            <div
              onTouchStart={handleCardTouchStart}
              onTouchMove={handleCardTouchMove}
              onTouchEnd={handleCardTouchEnd}
              onMouseDown={handleCardMouseDown}
              onMouseMove={handleCardMouseMove}
              onMouseUp={handleCardMouseUpOrLeave}
              onMouseLeave={handleCardMouseUpOrLeave}
              onClick={() => {
                if (!didSwipeMoveRef.current && !flyOutDir) {
                  setIsFlipped(!isFlipped);
                }
              }}
              style={{
                transform:
                  flyOutDir === 'left'
                    ? 'translateX(-125%) rotate(-18deg) scale(0.86)'
                    : flyOutDir === 'right'
                    ? 'translateX(125%) rotate(18deg) scale(0.86)'
                    : `translateX(${dragDeltaX}px) rotate(${
                        dragDeltaX * 0.05
                      }deg) scale(${1 - swipeProgressRatio * 0.025})`,
                opacity: flyOutDir
                  ? 0
                  : Math.max(0.55, 1 - swipeProgressRatio * 0.35),
                transition: isDraggingCard
                  ? 'none'
                  : flyOutDir
                  ? 'transform 250ms cubic-bezier(0.22, 1, 0.36, 1), opacity 240ms ease-in'
                  : 'transform 280ms cubic-bezier(0.22, 1, 0.36, 1), opacity 220ms ease-out',
              }}
              className={`relative select-none cursor-grab active:cursor-grabbing rounded-2xl border bg-white p-4 sm:p-7 text-center shadow-xs ${
                isFlashcardFullScreen
                  ? 'min-h-[370px] sm:min-h-[420px]'
                  : 'min-h-[320px]'
              } flex flex-col items-center justify-between gap-4 ${
                learningMethod === 'phan_loai_co_ban' && isReadyToCommitLeft
                  ? 'border-emerald-600 ring-4 ring-emerald-400/50 bg-emerald-50/20'
                  : learningMethod === 'phan_loai_co_ban' &&
                    isReadyToCommitRight
                  ? 'border-sky-600 ring-4 ring-sky-400/50 bg-sky-50/20'
                  : learningMethod === 'phan_loai_co_ban' && dragDeltaX < -45
                  ? 'border-emerald-400 ring-2 ring-emerald-300/30'
                  : learningMethod === 'phan_loai_co_ban' && dragDeltaX > 45
                  ? 'border-sky-400 ring-2 ring-sky-300/30'
                  : 'border-stone-300 hover:border-amber-500'
              }`}
            >
              {/* Clean Swipe Direction Badge in Phân loại cơ bản mode */}
              {learningMethod === 'phan_loai_co_ban' && dragDeltaX < -40 && (
                <div
                  className={`pointer-events-none absolute top-14 left-4 z-10 rounded-xl border-2 px-3 py-1 text-xs font-bold shadow-md transition-transform ${
                    isReadyToCommitLeft
                      ? 'scale-105 border-emerald-700 bg-emerald-600 text-white'
                      : 'border-emerald-500 bg-emerald-50/95 text-emerald-800'
                  }`}
                >
                  ← Chưa thuộc
                </div>
              )}
              {learningMethod === 'phan_loai_co_ban' && dragDeltaX > 40 && (
                <div
                  className={`pointer-events-none absolute top-14 right-4 z-10 rounded-xl border-2 px-3 py-1 text-xs font-bold shadow-md transition-transform ${
                    isReadyToCommitRight
                      ? 'scale-105 border-sky-700 bg-sky-600 text-white'
                      : 'border-sky-500 bg-sky-50/95 text-sky-800'
                  }`}
                >
                  Đã thuộc →
                </div>
              )}

              {/* Card Top Bar with Prominent Speaker Button ("Nút phát âm để trên đầu thẻ mỗi từ vựng") */}
              <div
                className="flex w-full items-center justify-between gap-2 border-b border-stone-100 pb-2.5"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onSpeak(activeCard.hanzi, false)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-amber-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-800 transition-colors shadow-2xs"
                    title="Phát âm từ vựng này"
                  >
                    <Volume2 className="h-3.5 w-3.5 shrink-0" />
                    <span>Phát âm</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenDictionary(activeCard.hanzi)}
                    className="inline-flex items-center gap-1 rounded-xl border border-stone-200 bg-stone-50 px-2.5 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-100 transition-colors"
                    title="Tra chi tiết trong từ điển giáo trình"
                  >
                    <BookOpen className="h-3.5 w-3.5 shrink-0 text-amber-800" />
                    <span>Từ điển</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-stone-500 tabular-nums">
                    Trang {activeCard.page}
                  </span>
                  {learningMethod === 'phan_loai_co_ban' && (
                    <span
                      className={`rounded-md border px-2 py-0.5 text-xs font-semibold ${
                        TAG_META[activeCard.tag].badgeClass
                      }`}
                    >
                      {TAG_META[activeCard.tag].label}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Center Content: Front vs Flipped Back (Clicking anywhere on card or image flips card!) */}
              {!isFlipped ? (
                <div className="my-6 space-y-2.5 py-4">
                  {frontSideMode === 'zh' ? (
                    <>
                      <div className="font-['Noto_Sans_SC'] text-5xl sm:text-6xl font-bold text-stone-900 tracking-wide">
                        {activeCard.hanzi}
                      </div>
                      {showFrontPinyin && (
                        <div className="font-mono text-lg sm:text-xl font-semibold text-amber-800">
                          [{activeCard.pinyin}]
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="text-2xl sm:text-3xl font-bold text-stone-900 px-2">
                        {activeCard.meaning_vi}
                      </div>
                      {showFrontPinyin && (
                        <div className="font-mono text-base sm:text-lg font-semibold text-amber-800">
                          [{activeCard.pinyin}]
                        </div>
                      )}
                    </>
                  )}
                  <p className="text-xs text-stone-400 pt-1">
                    (Chạm vào thẻ để lật xem chi tiết & hình ảnh)
                  </p>
                </div>
              ) : (
                <div className="w-full space-y-3 my-1">
                  <div className="space-y-1">
                    <div className="font-['Noto_Sans_SC'] text-3xl sm:text-4xl font-bold text-stone-900">
                      {activeCard.hanzi}
                    </div>
                    <div className="font-mono text-base sm:text-lg font-semibold text-amber-800">
                      [{activeCard.pinyin}]
                    </div>
                    <div className="text-base sm:text-lg font-bold text-stone-800">
                      {activeCard.meaning_vi}
                    </div>
                  </div>

                  {/* Vocabulary Visual Image: Clicking the image ALSO flips the card back (Req 4)! */}
                  <div className="mx-auto max-w-sm rounded-xl border border-stone-200 bg-[#FAF8F3] p-2.5 space-y-2 cursor-pointer">
                    {!flashcardImgError[activeCard.hanzi] ? (
                      <div className="relative h-36 sm:h-40 w-full overflow-hidden rounded-lg bg-white border border-stone-200/80">
                        <img
                          src={activeCardThumbUrl}
                          alt={`Hình ảnh từ vựng ${activeCard.hanzi} (${activeCard.meaning_vi})`}
                          loading="lazy"
                          onError={() =>
                            setFlashcardImgError((prev) => ({
                              ...prev,
                              [activeCard.hanzi]: true,
                            }))
                          }
                          className="h-full w-full object-cover"
                        />
                        <span className="absolute bottom-1.5 right-1.5 rounded bg-stone-900/75 px-2 py-0.5 font-['Noto_Sans_SC'] text-xs font-semibold text-white">
                          {activeCardKeyword}
                        </span>
                      </div>
                    ) : (
                      <div className="flex h-28 w-full items-center justify-center rounded-lg bg-amber-50/70 border border-amber-200/70">
                        <span className="font-['Noto_Sans_SC'] text-3xl font-bold text-amber-800">
                          {activeCardKeyword}
                        </span>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-center gap-1.5 pt-0.5">
                      <a
                        href={activeCardHanziiUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 rounded-md border border-amber-300 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-950 hover:bg-amber-100 transition-colors"
                      >
                        <BookOpen className="h-3 w-3 text-amber-800" />
                        <span>Từ điển Hanzii</span>
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    </div>
                  </div>

                  {activeCard.personalNote && (
                    <p className="text-xs italic text-stone-600 bg-amber-50/70 rounded-lg px-3 py-1.5">
                      Ghi chú: “{activeCard.personalNote}”
                    </p>
                  )}
                </div>
              )}

              {/* Bottom of Card: 4 Classification Buttons in 1 Horizontal Row (Req 5) when in Phân loại cơ bản mode */}
              {learningMethod === 'phan_loai_co_ban' ? (
                <div
                  className="grid grid-cols-4 gap-1.5 sm:gap-2 w-full pt-2.5 border-t border-stone-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  {(Object.keys(TAG_META) as BookmarkedWord['tag'][]).map(
                    (t) => {
                      const isSelected = activeCard.tag === t;
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => onUpdateTag(activeCard.hanzi, t)}
                          className={`inline-flex h-9 w-full items-center justify-center gap-1 rounded-xl border px-1.5 text-[11px] sm:text-xs font-semibold transition-all whitespace-nowrap ${
                            isSelected
                              ? TAG_META[t].activeBtnClass + ' shadow-2xs'
                              : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                          }`}
                        >
                          <span className="truncate">{TAG_META[t].label}</span>
                          <span
                            className={`hidden sm:inline-flex rounded-full px-1.5 py-0.2 text-[10px] font-mono tabular-nums ${
                              isSelected
                                ? 'bg-white/25 text-white'
                                : 'bg-stone-200/80 text-stone-600'
                            }`}
                          >
                            {tagCounts[t]}
                          </span>
                        </button>
                      );
                    }
                  )}
                </div>
              ) : (
                <div className="w-full pt-2 border-t border-stone-100 text-[11px] text-stone-400">
                  Chế độ Duyệt tìm thẻ · Chạm vào thẻ hoặc hình ảnh để lật mặt trước/sau
                </div>
              )}
            </div>
          </div>

          {/* Pinned Fixed Bottom Previous & Next Navigation Bar */}
          <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-1.5rem)] max-w-xl rounded-2xl border border-stone-300/90 bg-white/95 p-2 shadow-xl backdrop-blur-md">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setCardIndex(
                    (prev) =>
                      (prev - 1 + bookmarkList.length) % bookmarkList.length
                  );
                  setIsFlipped(false);
                }}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-stone-300 bg-stone-50 px-4 text-xs sm:text-sm font-semibold text-stone-800 hover:bg-stone-100 transition-colors whitespace-nowrap"
              >
                <ChevronLeft className="h-4 w-4 shrink-0" />
                <span>Từ trước</span>
              </button>

              <button
                onClick={() => {
                  setCardIndex((prev) => (prev + 1) % bookmarkList.length);
                  setIsFlipped(false);
                }}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-stone-900 px-4 text-xs sm:text-sm font-semibold text-white hover:bg-stone-800 transition-colors whitespace-nowrap"
              >
                <span>Từ tiếp theo</span>
                <ChevronRight className="h-4 w-4 shrink-0" />
              </button>
            </div>
          </div>

          {/* FLASHCARD SETTINGS MODAL ("Tùy chọn" - Req 8 matching user screenshot) */}
          {isSettingsOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/50 p-4 backdrop-blur-xs"
              onClick={() => setIsSettingsOpen(false)}
            >
              <div
                className="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-5 sm:p-6 shadow-2xl space-y-4 text-stone-900"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="relative flex items-center justify-center border-b border-stone-100 pb-3">
                  <button
                    type="button"
                    onClick={() => setIsSettingsOpen(false)}
                    className="absolute left-0 inline-flex h-8 w-8 items-center justify-center rounded-xl text-stone-500 hover:bg-stone-100 hover:text-stone-900"
                    aria-label="Đóng tùy chọn"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  <h3 className="text-base font-bold text-stone-900">
                    Tùy chọn
                  </h3>
                </div>

                {/* Section 1: Chung */}
                <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-4 space-y-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Chung
                  </div>

                  {/* Phương pháp học */}
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-stone-800">
                      Phương pháp học
                    </span>
                    <select
                      value={learningMethod}
                      onChange={(e) =>
                        setLearningMethod(
                          e.target.value as
                            | 'phan_loai_co_ban'
                            | 'duyet_tim_the'
                        )
                      }
                      className="rounded-xl border border-stone-300 bg-white px-3 py-1.5 text-xs font-bold text-sky-700 focus:border-sky-600 focus:outline-hidden"
                    >
                      <option value="phan_loai_co_ban">Phân loại cơ bản</option>
                      <option value="duyet_tim_the">
                        Duyệt tìm thẻ (Không phân loại)
                      </option>
                    </select>
                  </div>

                  {/* Chỉ học thuật ngữ chưa thuộc */}
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-stone-800">
                      Chỉ học từ chưa thuộc / cần ôn
                    </span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={onlyUnmemorized}
                      onClick={() => {
                        setOnlyUnmemorized((prev) => !prev);
                        setCardIndex(0);
                      }}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                        onlyUnmemorized ? 'bg-sky-600' : 'bg-stone-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition-transform ${
                          onlyUnmemorized ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Chuyển văn bản thành lời nói */}
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-stone-800">
                      Chuyển văn bản thành lời nói
                    </span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={autoSpeakCard}
                      onClick={() => setAutoSpeakCard((prev) => !prev)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                        autoSpeakCard ? 'bg-sky-600' : 'bg-stone-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition-transform ${
                          autoSpeakCard ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Trộn thẻ */}
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-stone-800">
                      Trộn thẻ
                    </span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={shuffleSeed !== null}
                      onClick={() => {
                        setShuffleSeed((prev) =>
                          prev === null ? Date.now() : null
                        );
                        setCardIndex(0);
                      }}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                        shuffleSeed !== null ? 'bg-sky-600' : 'bg-stone-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition-transform ${
                          shuffleSeed !== null
                            ? 'translate-x-5'
                            : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Hiển thị Pinyin mặt trước */}
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-stone-800">
                      Hiển thị Pinyin mặt trước
                    </span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={showFrontPinyin}
                      onClick={() => setShowFrontPinyin((prev) => !prev)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                        showFrontPinyin ? 'bg-sky-600' : 'bg-stone-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition-transform ${
                          showFrontPinyin ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Section 2: Thiết lập thẻ ghi nhớ */}
                <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-4 space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Thiết lập thẻ ghi nhớ
                  </div>
                  <div className="text-xs font-semibold text-stone-600">
                    Mặt trước
                  </div>
                  <div className="grid grid-cols-2 rounded-xl bg-stone-200/80 p-1">
                    <button
                      type="button"
                      onClick={() => setFrontSideMode('zh')}
                      className={`rounded-lg py-2 text-xs font-bold transition-colors ${
                        frontSideMode === 'zh'
                          ? 'bg-white text-stone-900 shadow-2xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      Tiếng Trung (Giản thể)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFrontSideMode('vi')}
                      className={`rounded-lg py-2 text-xs font-bold transition-colors ${
                        frontSideMode === 'vi'
                          ? 'bg-white text-stone-900 shadow-2xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      Tiếng Việt
                    </button>
                  </div>
                </div>

                {/* Section 3: Đặt lại Thẻ ghi nhớ */}
                <button
                  type="button"
                  onClick={() => {
                    setCardIndex(0);
                    setIsFlipped(false);
                    setShuffleSeed(null);
                    setOnlyUnmemorized(false);
                    setIsSettingsOpen(false);
                  }}
                  className="flex w-full items-center justify-between rounded-2xl border border-stone-200 bg-stone-50/70 px-4 py-3.5 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <span>Đặt lại Thẻ ghi nhớ</span>
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Detailed Grid List (With Speaker button at the top of each vocabulary card - Req 6) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookmarkList.map((item) => {
            const hanziiUrl = buildHanziiDictUrl(item.hanzi);
            return (
              <div
                key={item.hanzi}
                className="flex flex-col justify-between rounded-xl border border-stone-200 bg-white p-4 hover:border-amber-400 transition-colors"
              >
                <div>
                  {/* Top Bar of Vocabulary Card with Speaker Button at the Top */}
                  <div className="flex items-center justify-between gap-2 text-xs text-stone-500">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSpeak(item.hanzi, false)}
                        className="inline-flex items-center gap-1 rounded-lg bg-amber-700 px-2.5 py-1 text-xs font-semibold text-white hover:bg-amber-800 transition-colors"
                        title="Phát âm từ vựng"
                      >
                        <Volume2 className="h-3.5 w-3.5" />
                        <span>Phát âm</span>
                      </button>
                      <span>Trang {item.page}</span>
                    </div>

                    <select
                      value={item.tag}
                      onChange={(e) =>
                        onUpdateTag(
                          item.hanzi,
                          e.target.value as BookmarkedWord['tag']
                        )
                      }
                      className={`rounded border px-2 py-0.5 text-[11px] font-semibold ${
                        TAG_META[item.tag].badgeClass
                      }`}
                    >
                      {(Object.keys(TAG_META) as BookmarkedWord['tag'][]).map(
                        (tKey) => (
                          <option key={tKey} value={tKey}>
                            {TAG_META[tKey].label}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div className="mt-3 flex items-baseline gap-3">
                    <button
                      onClick={() => onOpenDictionary(item.hanzi)}
                      className="font-['Noto_Sans_SC'] text-2xl font-bold text-stone-900 hover:text-amber-800 transition-colors"
                    >
                      {item.hanzi}
                    </button>
                    <span className="font-mono text-sm font-semibold text-amber-800">
                      {item.pinyin}
                    </span>
                  </div>

                  <p className="mt-1 text-sm font-medium text-stone-800">
                    {item.meaning_vi}
                  </p>

                  {item.personalNote && (
                    <p className="mt-2 rounded-lg bg-amber-50/70 px-2.5 py-1.5 text-xs text-amber-950">
                      Ghi chú: {item.personalNote}
                    </p>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-stone-100 pt-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      onClick={() => onOpenDictionary(item.hanzi)}
                      className="inline-flex items-center gap-1 rounded-lg border border-stone-200 px-2.5 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50"
                    >
                      Từ điển
                    </button>
                    <a
                      href={hanziiUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50/60 px-2 py-1.5 text-xs font-medium text-amber-900 hover:bg-amber-100"
                    >
                      <span>Hanzii</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <button
                      onClick={() => onJumpToPage(item.page)}
                      className="inline-flex items-center gap-1 rounded-lg border border-stone-200 px-2 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50"
                    >
                      Tr.{item.page}
                    </button>
                  </div>

                  <button
                    onClick={() => onRemoveBookmark(item.hanzi)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-stone-400 hover:bg-rose-50 hover:text-rose-700"
                    title="Bỏ đánh dấu"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

