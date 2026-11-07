import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Volume2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  BookOpen,
  Info,
  PenTool,
  Grid,
  Turtle,
  X,
  ArrowRight,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  SlidersHorizontal,
  RotateCw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  PINYIN_FINALS_38,
  PINYIN_INITIALS_22,
  PINYIN_TONES_4,
  TONE_SANDHI_RULES,
  BASIC_STROKES_8,
  STROKE_ORDER_RULES,
  PINYIN_CHART_COLUMNS,
  PINYIN_CHART_ROWS,
  applyToneToSyllable,
  getToneCharactersForSyllable,
  getSyllableArticulationGuide,
  parseAccentedPinyin,
} from '../data/pinyinData';
import {
  CALLIGRAPHY_STROKE_ROWS,
  CalligraphyStrokeVariant,
} from '../data/calligraphyStrokes';

export type MasteryStatus = 'mastered' | 'needs_work';

export interface MasteryRecord {
  status: MasteryStatus;
  updatedAt: number;
}

interface PinyinSectionViewProps {
  onSpeak: (text: string, slow?: boolean) => void;
  onWordClick: (hanzi: string, contextSentence?: string, lessonTitle?: string) => void;
  onJumpToBook1: () => void;
}

const STORAGE_PINYIN_MASTERY_KEY = 'chinese_ebook_pinyin_mastery_v1';

type PinyinSubTab =
  | 'chart'
  | 'finals_initials'
  | 'tones_sandhi'
  | 'strokes';

interface SelectedPracticeTarget {
  key: string; // e.g. 'syl_lao', 'init_1', 'final_1'
  type: 'syllable' | 'initial' | 'final' | 'tone';
  displayTitle: string;
  baseSyllable: string;
  initial: string;
  vietnameseApprox: string;
  initialTip: string;
  finalTip: string;
  tones: {
    tone: 1 | 2 | 3 | 4;
    accented: string;
    hanzi: string;
  }[];
  activeTone: 1 | 2 | 3 | 4;
}

/**
 * Renders an authentic Chinese calligraphy brush stroke (楷书毛笔笔画)
 * with variable width, 顿笔 press, and 出锋 sharp taper, continuously animated
 * via a progressive SVG centerline mask and brush tip indicator.
 */
const ContinuousCalligraphyStrokeBox: React.FC<{
  variant: CalligraphyStrokeVariant;
  instanceKey: string;
  sizeClass?: string;
  durationSec?: number;
  showRiceGrid?: boolean;
}> = ({
  variant,
  instanceKey,
  sizeClass = 'h-24 w-24',
  durationSec = 2.2,
  showRiceGrid = true,
}) => {
  const dur = `${durationSec}s`;
  const maskId = `calligraphy_mask_${instanceKey}_${variant.id}`;

  return (
    <svg
      viewBox="0 0 100 100"
      className={`${sizeClass} rounded-xl border border-amber-300/90 bg-[#FFFDF7] shadow-2xs shrink-0`}
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse">
          <rect x="0" y="0" width="100" height="100" fill="black" />
          <path
            d={variant.medianPath}
            pathLength={100}
            fill="none"
            stroke="white"
            strokeWidth={variant.maskWidth || 28}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="100"
            strokeDashoffset="100"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="100;0;0;100"
              keyTimes="0;0.62;0.88;1"
              dur={dur}
              repeatCount="indefinite"
            />
          </path>
        </mask>
      </defs>

      {/* Tianzige Rice Grid Lines */}
      {showRiceGrid && (
        <>
          <line x1="50" y1="0" x2="50" y2="100" stroke="#E7E5E4" strokeDasharray="3,3" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="#E7E5E4" strokeDasharray="3,3" />
          <line x1="0" y1="0" x2="100" y2="100" stroke="#F5F5F4" strokeDasharray="2,4" />
          <line x1="100" y1="0" x2="0" y2="100" stroke="#F5F5F4" strokeDasharray="2,4" />
        </>
      )}

      {/* Faint authentic calligraphy brush silhouette watermark underneath */}
      <path d={variant.silhouettePath} fill="#E5E0D8" />

      {/* Animated dark ink calligraphy brush stroke revealed progressively along medianPath */}
      <path
        d={variant.silhouettePath}
        fill="#1C1917"
        mask={`url(#${maskId})`}
      >
        <animate
          attributeName="opacity"
          values="1;1;0;0"
          keyTimes="0;0.80;0.94;1"
          dur={dur}
          repeatCount="indefinite"
        />
      </path>

      {/* Subtle moving red calligraphy brush tip following the median trajectory */}
      <circle r="3.4" fill="#DC2626">
        <animateMotion
          path={variant.medianPath}
          dur={dur}
          keyPoints="0;1;1;0"
          keyTimes="0;0.62;0.88;1"
          calcMode="linear"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.9;0.9;0;0"
          keyTimes="0;0.63;0.78;1"
          dur={dur}
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
};

export const PinyinSectionView: React.FC<PinyinSectionViewProps> = ({
  onSpeak,
  onWordClick,
  onJumpToBook1,
}) => {
  const [subTab, setSubTab] = useState<PinyinSubTab>('chart');
  const [chartPartFilter, setChartPartFilter] = useState<'all' | 'part1' | 'part2'>('all');
  const [masteryFilter, setMasteryFilter] = useState<'all' | 'mastered' | 'needs_work' | 'unmarked'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Fullscreen, collapsible toolbar, and mobile landscape rotation states
  const [isChartFullscreen, setIsChartFullscreen] = useState<boolean>(false);
  const [showChartToolbar, setShowChartToolbar] = useState<boolean>(true);
  const [showGuidePanel, setShowGuidePanel] = useState<boolean>(true);
  const [chartZoomPercent, setChartZoomPercent] = useState<number>(100);
  const [isMobileLandscape, setIsMobileLandscape] = useState<boolean>(false);
  const [viewport, setViewport] = useState<{ width: number; height: number }>(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  }));

  useEffect(() => {
    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', updateViewport);
    window.addEventListener('orientationchange', updateViewport);
    return () => {
      window.removeEventListener('resize', updateViewport);
      window.removeEventListener('orientationchange', updateViewport);
    };
  }, []);

  // When in fullscreen and landscape mode is active while phone is held in portrait
  const isCssRotated90 =
    isChartFullscreen && isMobileLandscape && viewport.width < viewport.height;

  const requestBrowserFullscreen = useCallback(() => {
    if (typeof document === 'undefined') return Promise.resolve();
    try {
      if (
        window.top &&
        window.top !== window &&
        window.top.document?.documentElement?.requestFullscreen
      ) {
        return window.top.document.documentElement
          .requestFullscreen({ navigationUI: 'hide' })
          .catch(() => {
            return document.documentElement
              .requestFullscreen?.({ navigationUI: 'hide' })
              .catch(() => {});
          });
      }
    } catch {
      // Cross-origin top frame: fall back to current documentElement
    }
    return (
      document.documentElement
        .requestFullscreen?.({ navigationUI: 'hide' })
        .catch(() => {}) || Promise.resolve()
    );
  }, []);

  const exitBrowserFullscreen = useCallback(() => {
    if (typeof document === 'undefined') return;
    try {
      if (
        window.top &&
        window.top !== window &&
        window.top.document?.fullscreenElement
      ) {
        window.top.document.exitFullscreen?.().catch(() => {});
      }
    } catch {
      // ignore cross-origin
    }
    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    }
  }, []);

  const enterChartFullscreen = useCallback(
    (forceLandscapeOnMobile = true) => {
      const isMobileViewport =
        typeof window !== 'undefined' && window.innerWidth < 768;
      setIsChartFullscreen(true);
      // Hide toolbar by default on mobile fullscreen just like Book Reader in Quyển 1, 2, 3
      setShowChartToolbar(!isMobileViewport);

      if (typeof window !== 'undefined' && window.innerWidth < 900 && forceLandscapeOnMobile) {
        setIsMobileLandscape(true);
      }

      requestBrowserFullscreen().finally(() => {
        if (typeof window !== 'undefined' && window.innerWidth < 900 && forceLandscapeOnMobile) {
          try {
            (screen.orientation as any)?.lock?.('landscape')?.catch?.(() => {});
          } catch {
            // ignore if unsupported
          }
        }
      });
    },
    [requestBrowserFullscreen]
  );

  const exitChartFullscreen = useCallback(() => {
    setIsChartFullscreen(false);
    setIsMobileLandscape(false);
    try {
      (screen.orientation as any)?.unlock?.();
    } catch {
      // ignore
    }
    exitBrowserFullscreen();
  }, [exitBrowserFullscreen]);

  const handleToggleLandscape = useCallback(() => {
    if (!isChartFullscreen) {
      setIsChartFullscreen(true);
      const isMobileViewport =
        typeof window !== 'undefined' && window.innerWidth < 768;
      setShowChartToolbar(!isMobileViewport);
      setIsMobileLandscape(true);
      requestBrowserFullscreen().finally(() => {
        try {
          (screen.orientation as any)?.lock?.('landscape')?.catch?.(() => {});
        } catch {
          // ignore
        }
      });
    } else {
      setIsMobileLandscape((prev) => {
        const next = !prev;
        try {
          if (next) {
            (screen.orientation as any)?.lock?.('landscape')?.catch?.(() => {});
          } else {
            (screen.orientation as any)?.unlock?.();
          }
        } catch {
          // ignore
        }
        return next;
      });
    }
  }, [isChartFullscreen, requestBrowserFullscreen]);

  useEffect(() => {
    if (!isChartFullscreen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        exitChartFullscreen();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isChartFullscreen, exitChartFullscreen]);

  // Custom 2D touch panning when the fullscreen container is CSS-rotated 90deg on portrait phones
  const tableScrollRef = useRef<HTMLDivElement | null>(null);
  const didTouchDragRef = useRef<boolean>(false);
  const touchPanRef = useRef<{
    startX: number;
    startY: number;
    startScrollLeft: number;
    startScrollTop: number;
    isDragging: boolean;
  } | null>(null);

  const handleRotatedTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      didTouchDragRef.current = false;
      if (!isCssRotated90 || e.touches.length !== 1) return;
      const el = tableScrollRef.current;
      if (!el) return;
      const touch = e.touches[0];
      touchPanRef.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        startScrollLeft: el.scrollLeft,
        startScrollTop: el.scrollTop,
        isDragging: false,
      };
    },
    [isCssRotated90]
  );

  const handleRotatedTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (!isCssRotated90 || !touchPanRef.current || e.touches.length !== 1) return;
      const el = tableScrollRef.current;
      if (!el) return;
      const touch = e.touches[0];
      const dx = touch.clientX - touchPanRef.current.startX;
      const dy = touch.clientY - touchPanRef.current.startY;

      if (!touchPanRef.current.isDragging && Math.hypot(dx, dy) > 6) {
        touchPanRef.current.isDragging = true;
        didTouchDragRef.current = true;
      }

      if (touchPanRef.current.isDragging) {
        // Under +90deg clockwise rotation:
        // Screen +Y maps to table +X (columns), Screen -X maps to table +Y (rows)
        el.scrollLeft = touchPanRef.current.startScrollLeft - dy;
        el.scrollTop = touchPanRef.current.startScrollTop + dx;
      }
    },
    [isCssRotated90]
  );

  const handleRotatedTouchEnd = useCallback(() => {
    touchPanRef.current = null;
  }, []);

  // Persisted Green (Đã thuộc) / Red (Chưa thuộc) status for every cell
  const [masteryMap, setMasteryMap] = useState<Record<string, MasteryRecord>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PINYIN_MASTERY_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {};
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PINYIN_MASTERY_KEY, JSON.stringify(masteryMap));
    } catch {
      // ignore
    }
  }, [masteryMap]);

  // Currently selected syllable/sound for 4-tone audio & articulation guide (null by default — no pre-selected 'lao')
  const [selectedTarget, setSelectedTarget] = useState<SelectedPracticeTarget | null>(null);

  // Floating 4-tone popover anchor on the Pinyin table (like qchinese.net)
  const [activePopoverCellKey, setActivePopoverCellKey] = useState<string | null>(null);

  // Clicking on blank space (empty cells, headers, background) hides the control bar just like Quyển 1, 2, 3
  const handleChartBlankAreaClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (didTouchDragRef.current) {
        didTouchDragRef.current = false;
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
      if (activePopoverCellKey) {
        setActivePopoverCellKey(null);
      }
      if (showChartToolbar) {
        setShowChartToolbar(false);
      }
    },
    [activePopoverCellKey, showChartToolbar]
  );

  const handleMarkStatus = useCallback(
    (key: string, status: MasteryStatus | null) => {
      setMasteryMap((prev) => {
        if (status === null) {
          const next = { ...prev };
          delete next[key];
          return next;
        }
        return {
          ...prev,
          [key]: {
            status,
            updatedAt: Date.now(),
          },
        };
      });
    },
    []
  );

  // Select a syllable cell from the 37-column chart
  const handleSelectSyllableCell = useCallback(
    (syllable: string, initial: string, autoPlayTone: 1 | 2 | 3 | 4 = 1, togglePopover = true) => {
      const cleanSyl = syllable.trim().toLowerCase();
      const key = `syl_${cleanSyl}`;
      const guide = getSyllableArticulationGuide(cleanSyl, initial);
      const chars = getToneCharactersForSyllable(cleanSyl);
      const tones = ([1, 2, 3, 4] as const).map((t, idx) => ({
        tone: t,
        accented: applyToneToSyllable(cleanSyl, t),
        hanzi: chars[idx],
      }));

      setSelectedTarget({
        key,
        type: 'syllable',
        displayTitle: cleanSyl,
        baseSyllable: cleanSyl,
        initial,
        vietnameseApprox: guide.vietnameseApprox,
        initialTip: guide.initialTip,
        finalTip: guide.finalTip,
        tones,
        activeTone: autoPlayTone,
      });
      setShowGuidePanel(true);

      if (togglePopover) {
        setActivePopoverCellKey(key);
      }

      const toneChar = chars[autoPlayTone - 1] || chars[0];
      onSpeak(toneChar, false);
    },
    [onSpeak]
  );

  // Select an Initial (Thanh mẫu) or Final (Vận mẫu) for audio + guide
  const handleSelectInitialOrFinal = useCallback(
    (
      itemKey: string,
      type: 'initial' | 'final',
      title: string,
      ttsChar: string,
      vietnameseApprox: string,
      guideVi: string,
      exampleBaseSyllable: string
    ) => {
      const baseSyl = parseAccentedPinyin(exampleBaseSyllable).base || 'ba';
      const chars = getToneCharactersForSyllable(baseSyl);
      const tones = ([1, 2, 3, 4] as const).map((t, idx) => ({
        tone: t,
        accented: applyToneToSyllable(baseSyl, t),
        hanzi: chars[idx] || ttsChar,
      }));

      setSelectedTarget({
        key: itemKey,
        type,
        displayTitle: title,
        baseSyllable: baseSyl,
        initial: type === 'initial' ? title : '',
        vietnameseApprox,
        initialTip:
          type === 'initial'
            ? guideVi
            : 'Mở khẩu hình tự nhiên, phát âm rõ nguyên âm và vần.',
        finalTip:
          type === 'final'
            ? guideVi
            : `Ví dụ ghép âm chuẩn: ${exampleBaseSyllable} (${ttsChar}).`,
        tones,
        activeTone: 1,
      });
      setShowGuidePanel(true);

      onSpeak(ttsChar, false);
    },
    [onSpeak]
  );

  // Statistics of Đã thuộc (mastered) vs Chưa thuộc (needs_work)
  const stats = useMemo(() => {
    let mastered = 0;
    let needsWork = 0;
    for (const rec of Object.values(masteryMap)) {
      if (rec.status === 'mastered') mastered++;
      if (rec.status === 'needs_work') needsWork++;
    }
    return { mastered, needsWork };
  }, [masteryMap]);

  const visibleColumns = useMemo(() => {
    return PINYIN_CHART_COLUMNS.filter((c) => {
      if (chartPartFilter === 'part1') return c.part === 1;
      if (chartPartFilter === 'part2') return c.part === 2;
      return true;
    });
  }, [chartPartFilter]);

  const currentTargetStatus = selectedTarget
    ? masteryMap[selectedTarget.key]?.status || null
    : null;
  const activeToneItem = selectedTarget
    ? selectedTarget.tones.find((t) => t.tone === selectedTarget.activeTone) ||
      selectedTarget.tones[0]
    : null;

  // Reusable Pinyin Matrix Section (used in both normal view and Fullscreen Portal mode)
  const renderPinyinMatrixSection = (inFullscreen: boolean) => {
    const matrixContent = (
      <div
        onClick={handleChartBlankAreaClick}
        style={
          inFullscreen && isCssRotated90
            ? {
                position: 'fixed',
                top: '50%',
                left: '50%',
                width: `${viewport.height}px`,
                height: `${viewport.width}px`,
                transform: 'translate(-50%, -50%) rotate(90deg)',
                transformOrigin: 'center center',
              }
            : undefined
        }
        className={
          inFullscreen
            ? isCssRotated90
              ? 'z-[9999] flex flex-col bg-[#1E1915] overflow-hidden select-none'
              : 'fixed inset-0 z-[9999] flex flex-col h-dvh w-dvw bg-[#1E1915] overflow-hidden'
            : 'rounded-2xl border border-stone-200 bg-white p-3 sm:p-5 space-y-3'
        }
      >
        {/* FLOATING MINI PILL WHEN TOOLBAR IS COLLAPSED IN FULLSCREEN (Just like Book Reader) */}
        {inFullscreen && !showChartToolbar && (
          <div className="absolute right-2.5 top-2.5 z-50 flex items-center gap-1.5 rounded-full border border-stone-700/80 bg-stone-900/90 px-3 py-1.5 text-xs font-semibold text-white shadow-lg backdrop-blur-xs">
            <button
              type="button"
              onClick={() => setShowChartToolbar(true)}
              className="inline-flex items-center gap-1.5 text-amber-300 hover:text-amber-200"
              title="Hiện thanh điều khiển bảng ghép vần"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Thanh điều khiển</span>
            </button>
            <span className="text-stone-600">|</span>
            <button
              type="button"
              onClick={handleToggleLandscape}
              className={`inline-flex items-center gap-1 transition-colors ${
                isMobileLandscape
                  ? 'text-amber-300 hover:text-amber-200'
                  : 'text-stone-200 hover:text-white'
              }`}
              title="Xoay ngang bảng ghép vần"
            >
              <RotateCw className="h-3.5 w-3.5" />
              <span>Xoay ngang</span>
            </button>
            <span className="text-stone-600">|</span>
            <button
              type="button"
              onClick={exitChartFullscreen}
              className="inline-flex items-center gap-1 text-stone-200 hover:text-white"
              title="Thu nhỏ toàn màn hình (Esc)"
            >
              <Minimize2 className="h-3.5 w-3.5" />
              <span>Thu nhỏ</span>
            </button>
          </div>
        )}

        {/* COLLAPSIBLE / TOGGLEABLE TOP CONTROL BAR WHEN NOT FULLSCREEN */}
        {!inFullscreen && !showChartToolbar ? (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="font-['Fraunces'] text-sm font-bold text-stone-900">
                Bảng Ghép Vần Pinyin (37 Cột × 22 Hàng)
              </span>
              <span className="hidden sm:inline-block text-xs text-stone-500">
                · Đang ẩn thanh điều khiển
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowChartToolbar(true)}
                className="inline-flex items-center gap-1 rounded-lg border border-stone-300 bg-white px-2.5 py-1 text-xs font-bold text-stone-700 hover:bg-stone-100"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-amber-700" />
                <span>Thanh điều khiển</span>
              </button>
              <button
                type="button"
                onClick={handleToggleLandscape}
                className="inline-flex items-center gap-1 rounded-lg border border-amber-600 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-900 hover:bg-amber-100"
              >
                <RotateCw className="h-3.5 w-3.5 text-amber-700" />
                <span>Xoay ngang</span>
              </button>
              <button
                type="button"
                onClick={() => enterChartFullscreen(true)}
                className="inline-flex items-center gap-1 rounded-lg bg-stone-900 px-2.5 py-1 text-xs font-bold text-white hover:bg-stone-800"
              >
                <Maximize2 className="h-3.5 w-3.5" />
                <span>Phóng to toàn màn hình</span>
              </button>
            </div>
          </div>
        ) : null}

        {showChartToolbar && (
          <div
            className={
              inFullscreen
                ? 'mx-auto mt-1.5 w-[calc(100%-0.75rem)] sm:w-[calc(100%-1.5rem)] rounded-xl border border-stone-200 bg-white p-2.5 sm:px-4 sm:py-2.5 shadow-2xs flex flex-wrap items-center justify-between gap-2 z-30 shrink-0'
                : 'flex flex-col xl:flex-row xl:items-center justify-between gap-3'
            }
          >
            {/* Left Side: Title or Compact Active Sound Bar in Fullscreen */}
            {inFullscreen ? (
              <div className="flex flex-wrap items-center gap-2">
                {selectedTarget && activeToneItem ? (
                  <>
                    <div className="flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50/90 px-2.5 py-1">
                      <span className="font-['Fraunces'] text-sm font-black text-stone-900">
                        {activeToneItem.accented}
                      </span>
                      <span className="font-['Noto_Sans_SC'] text-sm font-bold text-amber-800">
                        {activeToneItem.hanzi}
                      </span>
                      <button
                        type="button"
                        onClick={() => onSpeak(activeToneItem.hanzi, false)}
                        className="rounded-lg bg-amber-700 p-1 text-white hover:bg-amber-800"
                        title="Nghe phát âm chuẩn"
                      >
                        <Volume2 className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Quick 4-tone buttons inside fullscreen toolbar */}
                    <div className="hidden md:inline-flex items-center gap-1">
                      {selectedTarget.tones.map((tItem) => (
                        <button
                          key={tItem.tone}
                          type="button"
                          onClick={() => {
                            setSelectedTarget((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    activeTone: tItem.tone,
                                  }
                                : null
                            );
                            onSpeak(tItem.hanzi, false);
                          }}
                          className={`rounded-lg border px-2 py-1 font-mono text-[11px] font-bold transition-colors ${
                            selectedTarget.activeTone === tItem.tone
                              ? 'border-amber-600 bg-amber-600 text-white'
                              : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-100'
                          }`}
                        >
                          {tItem.accented}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <span className="font-['Fraunces'] text-xs sm:text-sm font-bold text-stone-900">
                    Bảng Ghép Vần Pinyin (Chạm vào ô để nghe 4 thanh điệu · Chạm khoảng trống để ẩn thanh điều khiển)
                  </span>
                )}
              </div>
            ) : (
              <div>
                <h2 className="font-['Fraunces'] text-base sm:text-lg font-bold text-stone-900">
                  Bảng Ghép Vần Phiên Âm Tiếng Trung (Thanh Mẫu × Vận Mẫu)
                </h2>
                <p className="text-xs text-stone-600">
                  Ấn vào bất kỳ ô nào để mở bảng phát âm 4 thanh điệu và đánh dấu{' '}
                  <span className="font-bold text-emerald-700">Đã thuộc</span> hoặc{' '}
                  <span className="font-bold text-rose-700">Chưa thuộc</span>. Ấn vào khoảng trống để ẩn thanh điều khiển.
                </p>
              </div>
            )}

            {/* Right Side: Filters, Zoom, Landscape Toggle, Collapse Toolbar, Fullscreen */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {/* Page 1 / Page 2 / All 37 Columns Switcher */}
              <div className="inline-flex rounded-xl border border-stone-200 bg-stone-100 p-0.5">
                {[
                  { id: 'all', label: '37 cột', fullLabel: 'Tất cả 37 cột' },
                  { id: 'part1', label: 'Phần 1 (1–20)', fullLabel: 'Phần 1 (Cột 1–20: o → ian)' },
                  { id: 'part2', label: 'Phần 2 (21–37)', fullLabel: 'Phần 2 (Cột 21–37: in → ün)' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setChartPartFilter(p.id as 'all' | 'part1' | 'part2')}
                    className={`rounded-lg px-2 py-1 text-[11px] sm:text-xs font-bold transition-colors ${
                      chartPartFilter === p.id
                        ? 'bg-white text-stone-900 shadow-2xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <span className="sm:hidden">{p.label}</span>
                    <span className="hidden sm:inline">{p.fullLabel}</span>
                  </button>
                ))}
              </div>

              {/* Filter by Đã thuộc / Chưa thuộc */}
              <select
                value={masteryFilter}
                onChange={(e) => setMasteryFilter(e.target.value as any)}
                className="rounded-xl border border-stone-200 bg-white px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-stone-800 focus:border-amber-600 focus:outline-hidden"
              >
                <option value="all">Tất cả</option>
                <option value="mastered">Đã thuộc ({stats.mastered})</option>
                <option value="needs_work">Chưa thuộc ({stats.needsWork})</option>
                <option value="unmarked">Chưa đánh dấu</option>
              </select>

              {/* Quick syllable search */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm âm (zhi, ba)..."
                className="w-28 sm:w-40 rounded-xl border border-stone-200 bg-stone-50 px-2.5 py-1 text-[11px] sm:text-xs text-stone-900 placeholder:text-stone-400 focus:border-amber-600 focus:bg-white focus:outline-hidden"
              />

              {/* Zoom Slider (Visible on both Mobile & PC in Fullscreen) */}
              {inFullscreen && (
                <div className="inline-flex items-center gap-1 rounded-xl border border-stone-200 bg-stone-50 px-2 py-1">
                  <button
                    type="button"
                    onClick={() =>
                      setChartZoomPercent((z) => Math.max(60, z - 10))
                    }
                    className="rounded p-0.5 text-stone-600 hover:bg-stone-200"
                    title="Thu nhỏ cỡ bảng"
                  >
                    <ZoomOut className="h-3.5 w-3.5" />
                  </button>
                  <input
                    type="range"
                    min={60}
                    max={140}
                    step={5}
                    value={chartZoomPercent}
                    onChange={(e) => setChartZoomPercent(Number(e.target.value))}
                    className="w-14 sm:w-20 accent-amber-700 cursor-pointer"
                    title="Tùy chỉnh kích thước bảng ghép vần"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setChartZoomPercent((z) => Math.min(140, z + 10))
                    }
                    className="rounded p-0.5 text-stone-600 hover:bg-stone-200"
                    title="Phóng to cỡ bảng"
                  >
                    <ZoomIn className="h-3.5 w-3.5" />
                  </button>
                  <span className="font-mono text-[10px] font-bold text-stone-700 w-8 text-right">
                    {chartZoomPercent}%
                  </span>
                </div>
              )}

              {/* Rotate Horizontal Landscape Button ("Xoay ngang") */}
              <button
                type="button"
                onClick={handleToggleLandscape}
                className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                  isChartFullscreen && isMobileLandscape
                    ? 'border-amber-600 bg-amber-50 text-amber-900'
                    : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-100'
                }`}
                title="Xoay ngang bảng ghép vần"
              >
                <RotateCw className="h-3.5 w-3.5" />
                <span>Xoay ngang</span>
              </button>

              {/* Fullscreen Toggle Button (Same style as Book Reader) */}
              <button
                type="button"
                onClick={() =>
                  inFullscreen ? exitChartFullscreen() : enterChartFullscreen(true)
                }
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  inFullscreen
                    ? 'border-amber-600 bg-amber-700 text-white hover:bg-amber-800'
                    : 'border-stone-300 bg-stone-900 text-white hover:bg-stone-800'
                }`}
              >
                {inFullscreen ? (
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

              {/* Collapse / Hide Control Bar Button (X button like Book Reader) */}
              <button
                type="button"
                onClick={() => setShowChartToolbar(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 bg-stone-100 text-stone-700 hover:bg-stone-200 shrink-0"
                title="Tạm ẩn thanh điều khiển (hoặc chạm vào khoảng trống trên bảng)"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Interactive Scrollable Pinyin Matrix Table */}
        <div
          ref={inFullscreen ? tableScrollRef : undefined}
          onTouchStart={inFullscreen ? handleRotatedTouchStart : undefined}
          onTouchMove={inFullscreen ? handleRotatedTouchMove : undefined}
          onTouchEnd={inFullscreen ? handleRotatedTouchEnd : undefined}
          style={
            inFullscreen && isCssRotated90
              ? { touchAction: 'none' }
              : undefined
          }
          className={`relative overflow-auto ${
            inFullscreen
              ? 'flex-1 min-h-0 px-1.5 sm:px-3 py-1.5'
              : 'rounded-xl border border-stone-300 bg-stone-50/40 max-h-[72vh]'
          }`}
        >
          <div
            className={
              inFullscreen
                ? 'rounded-xl border border-stone-300 bg-white shadow-xl overflow-visible min-w-max'
                : 'min-w-max'
            }
            style={
              chartZoomPercent !== 100
                ? { zoom: `${chartZoomPercent}%` }
                : undefined
            }
          >
            <table className="w-full border-collapse text-center text-xs">
              <thead>
                {/* Row 1 of Header: Column Numbers 1..37 */}
                <tr className="bg-stone-100 text-[10px] font-mono font-bold text-stone-500">
                  <th className="sticky left-0 top-0 z-30 border border-stone-300 bg-stone-200 px-2 py-1.5 min-w-[42px]">
                    STT
                  </th>
                  <th className="sticky left-[42px] top-0 z-30 border border-stone-300 bg-teal-100 px-2.5 py-1.5 text-teal-950 min-w-[54px]">
                    Phụ âm
                  </th>
                  {visibleColumns.map((col) => (
                    <th
                      key={col.colIndex}
                      className="sticky top-0 z-20 border border-stone-300 bg-stone-100 px-2 py-1 min-w-[52px]"
                    >
                      {col.colIndex}
                    </th>
                  ))}
                </tr>
                {/* Row 2 of Header: Final Labels (o, a, e, i...) */}
                <tr className="bg-teal-50/95 text-xs font-extrabold text-teal-950">
                  <th className="sticky left-0 top-[25px] z-30 border border-stone-300 bg-stone-200 px-2 py-2 text-[10px] text-stone-600">
                    #
                  </th>
                  <th className="sticky left-[42px] top-[25px] z-30 border border-stone-300 bg-teal-100 px-2.5 py-2 text-xs font-extrabold text-teal-950">
                    Vần →
                  </th>
                  {visibleColumns.map((col) => (
                    <th
                      key={col.colIndex}
                      className="sticky top-[25px] z-20 border border-stone-300 bg-teal-50 px-2 py-2 font-mono"
                    >
                      <div>{col.finalLabel}</div>
                      {col.subNote && (
                        <div className="text-[9px] font-normal text-teal-700 leading-none mt-0.5">
                          ({col.subNote})
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PINYIN_CHART_ROWS.map((row) => {
                  const initItem = PINYIN_INITIALS_22.find(
                    (it) => it.pinyin === row.initial || (row.stt === 22 && it.stt === 22)
                  );
                  return (
                    <tr key={row.stt} className="hover:bg-amber-50/30">
                      {/* Sticky STT column */}
                      <td className="sticky left-0 z-10 border border-stone-300 bg-stone-100 px-2 py-1.5 font-mono text-[11px] font-bold text-stone-600">
                        {row.stt}
                      </td>

                      {/* Sticky Initial (Thanh mẫu) column — clickable to hear initial! */}
                      <td className="sticky left-[42px] z-10 border border-stone-300 bg-teal-50/95 px-2 py-1.5 font-mono font-extrabold text-teal-950">
                        <button
                          type="button"
                          onClick={() => {
                            if (initItem) {
                              handleSelectInitialOrFinal(
                                `init_${initItem.stt}`,
                                'initial',
                                initItem.pinyin,
                                initItem.ttsChar,
                                initItem.vietnamese,
                                initItem.guideVi,
                                initItem.exampleCn
                              );
                            }
                          }}
                          className="inline-flex items-center justify-center gap-0.5 rounded px-1.5 py-0.5 hover:bg-teal-200/70 transition-colors"
                          title={
                            initItem
                              ? `Thanh mẫu ${row.displayInitial} (Đọc như: ${initItem.vietnamese}) — Ấn để nghe`
                              : 'Không thanh mẫu (w / y)'
                          }
                        >
                          <span>{row.displayInitial}</span>
                        </button>
                      </td>

                      {/* Syllable Cells */}
                      {visibleColumns.map((col) => {
                        const syllable = row.cells[col.colIndex];
                        if (!syllable) {
                          return (
                            <td
                              key={col.colIndex}
                              className="border border-stone-200/80 bg-stone-100/40 px-1.5 py-1.5 cursor-pointer"
                              title="Chạm vào khoảng trống để ẩn thanh điều khiển"
                            />
                          );
                        }

                        const cellKey = `syl_${syllable}`;
                        const status = masteryMap[cellKey]?.status || null;
                        const isSelected = selectedTarget?.key === cellKey;
                        const isPopoverOpen = activePopoverCellKey === cellKey;

                        const matchesSearch =
                          !searchQuery.trim() ||
                          syllable.toLowerCase().includes(searchQuery.trim().toLowerCase());

                        const matchesFilter =
                          masteryFilter === 'all' ||
                          (masteryFilter === 'mastered' && status === 'mastered') ||
                          (masteryFilter === 'needs_work' && status === 'needs_work') ||
                          (masteryFilter === 'unmarked' && !status);

                        const dimmed = !matchesSearch || !matchesFilter;
                        const toneChars = getToneCharactersForSyllable(syllable);

                        return (
                          <td
                            key={col.colIndex}
                            className={`relative border border-stone-300 p-0 transition-all ${
                              dimmed ? 'opacity-25' : ''
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                handleSelectSyllableCell(syllable, row.initial, 1, true)
                              }
                              className={`flex h-full w-full flex-col items-center justify-center px-1.5 py-1.5 font-mono text-xs font-bold transition-all ${
                                status === 'mastered'
                                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                  : status === 'needs_work'
                                  ? 'bg-rose-600 text-white hover:bg-rose-700'
                                  : isSelected
                                  ? 'bg-amber-100 text-amber-950 ring-2 ring-inset ring-amber-600'
                                  : 'bg-white text-stone-800 hover:bg-amber-50 hover:text-amber-900'
                              }`}
                            >
                              <span>{syllable}</span>
                            </button>

                            {/* Floating 4-Tone Popover right over the cell */}
                            {isPopoverOpen && (
                              <div
                                className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 p-4 sm:absolute sm:inset-auto sm:left-1/2 sm:top-full sm:mt-1.5 sm:-translate-x-1/2 sm:bg-transparent sm:p-0"
                                onClick={() => setActivePopoverCellKey(null)}
                              >
                                <div
                                  className="w-60 rounded-2xl border-2 border-stone-300 bg-white p-3 text-left shadow-xl"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <div className="flex items-center justify-between border-b border-stone-100 pb-2 mb-2">
                                    <div>
                                      <span className="font-mono text-sm font-black text-stone-900">
                                        {syllable}
                                      </span>
                                      <span className="ml-1.5 text-[11px] font-semibold text-amber-800">
                                        (4 thanh điệu)
                                      </span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => setActivePopoverCellKey(null)}
                                      className="rounded-lg p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
                                    >
                                      <X className="h-3.5 w-3.5" />
                                    </button>
                                  </div>

                                  {/* 4 Tones list just like qchinese.net screenshot */}
                                  <div className="space-y-1">
                                    {([1, 2, 3, 4] as const).map((tNum, idx) => {
                                      const accented = applyToneToSyllable(syllable, tNum);
                                      const charForTone = toneChars[idx];
                                      const isToneSelected =
                                        selectedTarget?.key === cellKey &&
                                        selectedTarget?.activeTone === tNum;
                                      return (
                                        <button
                                          key={tNum}
                                          type="button"
                                          onClick={() => {
                                            handleSelectSyllableCell(
                                              syllable,
                                              row.initial,
                                              tNum,
                                              false
                                            );
                                          }}
                                          className={`flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-bold transition-colors ${
                                            isToneSelected
                                              ? 'bg-amber-100 text-amber-950 border border-amber-300'
                                              : 'hover:bg-stone-100 text-stone-800'
                                          }`}
                                        >
                                          <span className="font-mono text-sm">
                                            {accented}
                                          </span>
                                          <span className="flex items-center gap-2">
                                            <span className="font-['Noto_Sans_SC'] text-xs text-stone-500">
                                              {charForTone}
                                            </span>
                                            <Volume2 className="h-4 w-4 text-stone-800" />
                                          </span>
                                        </button>
                                      );
                                    })}
                                  </div>

                                  {/* Đã thuộc / Chưa thuộc / Xóa inside Popover */}
                                  <div className="mt-2.5 pt-2 border-t border-stone-100">
                                    <div className="grid grid-cols-3 gap-1">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          handleMarkStatus(cellKey, 'mastered');
                                          setActivePopoverCellKey(null);
                                        }}
                                        className={`rounded-lg py-1.5 text-[11px] font-bold ${
                                          status === 'mastered'
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                                        }`}
                                      >
                                        Đã thuộc
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          handleMarkStatus(cellKey, 'needs_work');
                                          setActivePopoverCellKey(null);
                                        }}
                                        className={`rounded-lg py-1.5 text-[11px] font-bold ${
                                          status === 'needs_work'
                                            ? 'bg-rose-600 text-white'
                                            : 'bg-rose-50 text-rose-800 border border-rose-300 hover:bg-rose-100'
                                        }`}
                                      >
                                        Chưa thuộc
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          handleMarkStatus(cellKey, null);
                                          setActivePopoverCellKey(null);
                                        }}
                                        className="rounded-lg border border-stone-200 bg-stone-100 py-1.5 text-[11px] font-semibold text-stone-600 hover:bg-stone-200"
                                      >
                                        Xóa
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );

    if (inFullscreen && typeof document !== 'undefined') {
      return createPortal(matrixContent, document.body);
    }

    return matrixContent;
  };

  return (
    <div className="space-y-5">
      {/* Top Hero Banner & Mastery Progress */}
      <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs font-bold text-amber-900">
              <Sparkles className="h-3.5 w-3.5 text-amber-700" />
              <span>Nhập Môn Trước Quyển 1 · Hệ Thống Ngữ Âm & Bút Thuận Chuẩn</span>
            </div>
            <h1 className="mt-2 font-['Fraunces'] text-xl sm:text-2xl font-bold text-stone-900">
              Phiên Âm Tiếng Trung (Pinyin) & Quy Tắc Viết Chữ Hán
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-stone-600">
              Ấn vào bất kỳ âm tiết nào để nghe phát âm 4 thanh điệu chuẩn kèm hướng dẫn khẩu hình, và đánh dấu{' '}
              <span className="font-bold text-emerald-700">Đã thuộc</span> hoặc{' '}
              <span className="font-bold text-rose-700">Chưa thuộc</span> ngay trên bảng.
            </p>
          </div>

          {/* Mastery Counters & Jump to Quyển 1 */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
              <div className="text-xs">
                <div className="font-bold text-emerald-900">{stats.mastered} âm</div>
                <div className="text-[11px] text-emerald-700">Đã thuộc</div>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-600" />
              <div className="text-xs">
                <div className="font-bold text-rose-900">{stats.needsWork} âm</div>
                <div className="text-[11px] text-rose-700">Chưa thuộc</div>
              </div>
            </div>

            <button
              type="button"
              onClick={onJumpToBook1}
              className="inline-flex items-center gap-1.5 rounded-xl bg-stone-900 px-3.5 py-2.5 text-xs font-bold text-white hover:bg-stone-800 transition-colors"
            >
              <span>Vào học Quyển 1</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Section Sub-Navigation Tabs (4 tabs, reference_scans removed) */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-stone-100 pt-3.5">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              {
                id: 'chart',
                label: 'Bảng Ghép Vần Pinyin (37 Cột)',
                icon: Grid,
              },
              {
                id: 'finals_initials',
                label: 'I. Vận Mẫu (38) & II. Thanh Mẫu (22)',
                icon: Volume2,
              },
              {
                id: 'tones_sandhi',
                label: 'III. Thanh Điệu & IV. Biến Điệu',
                icon: BookOpen,
              },
              {
                id: 'strokes',
                label: 'V. 8 Nét Cơ Bản & Bút Thuận',
                icon: PenTool,
              },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = subTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSubTab(tab.id as PinyinSubTab)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                    active
                      ? 'bg-amber-700 text-white shadow-2xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200/80 hover:text-stone-900'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* INTERACTIVE 4-TONE AUDIO & ARTICULATION GUIDE BAR (Only shown after user selects a sound!) */}
      {selectedTarget && activeToneItem && (
        <div className="rounded-2xl border-2 border-amber-300/90 bg-gradient-to-br from-amber-50/70 via-white to-stone-50 p-3.5 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-amber-200/60">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                Âm đang chọn:
              </span>
              <span className="font-['Fraunces'] text-lg font-black text-stone-900">
                {activeToneItem.accented}
              </span>
              <span className="font-['Noto_Sans_SC'] text-base font-bold text-amber-800">
                {activeToneItem.hanzi}
              </span>
              <span className="rounded-lg bg-stone-200/80 px-2 py-0.5 text-[11px] font-semibold text-stone-800">
                Đọc gần giống: {selectedTarget.vietnameseApprox}
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setShowGuidePanel((prev) => !prev)}
                className="inline-flex items-center gap-1 rounded-lg border border-amber-300 bg-white px-2.5 py-1 text-xs font-bold text-amber-900 hover:bg-amber-50"
              >
                {showGuidePanel ? (
                  <>
                    <ChevronUp className="h-3.5 w-3.5" />
                    <span>Thu gọn</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3.5 w-3.5" />
                    <span>Mở hướng dẫn</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setSelectedTarget(null)}
                className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-500 hover:bg-stone-100 hover:text-stone-800"
                title="Đóng khung âm đang chọn"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {showGuidePanel && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center pt-1">
              {/* Left: Selected Syllable + 4 Tones Player (qchinese.net style) */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                      Nghe phát âm 4 thanh điệu
                    </div>
                    <div className="mt-0.5 flex items-baseline gap-3">
                      <span className="font-['Fraunces'] text-3xl sm:text-4xl font-black text-stone-900">
                        {activeToneItem.accented}
                      </span>
                      <span className="font-['Noto_Sans_SC'] text-2xl font-bold text-amber-800">
                        {activeToneItem.hanzi}
                      </span>
                    </div>
                  </div>

                  {/* Quick Listen Normal & Slow */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => onSpeak(activeToneItem.hanzi, false)}
                      className="inline-flex items-center gap-1 rounded-xl bg-amber-700 px-3 py-2 text-xs font-bold text-white hover:bg-amber-800 transition-colors"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                      <span>Nghe chuẩn</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onSpeak(activeToneItem.hanzi, true)}
                      className="inline-flex items-center gap-1 rounded-xl border border-stone-300 bg-white px-2.5 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 transition-colors"
                      title="Nghe phát âm chậm 0.65x"
                    >
                      <Turtle className="h-3.5 w-3.5 text-amber-700" />
                      <span>Chậm</span>
                    </button>
                  </div>
                </div>

                {/* 4 Tones Interactive Strip */}
                <div>
                  <div className="text-[11px] font-semibold text-stone-500 mb-1.5">
                    Ấn vào từng thanh điệu để nghe phát âm chuẩn:
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {selectedTarget.tones.map((tItem) => {
                      const isActiveTone = selectedTarget.activeTone === tItem.tone;
                      return (
                        <button
                          key={tItem.tone}
                          type="button"
                          onClick={() => {
                            setSelectedTarget((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    activeTone: tItem.tone,
                                  }
                                : null
                            );
                            onSpeak(tItem.hanzi, false);
                          }}
                          className={`flex flex-col items-center justify-center rounded-xl border px-2.5 py-2 transition-all ${
                            isActiveTone
                              ? 'border-amber-600 bg-amber-600 text-white shadow-xs'
                              : 'border-stone-200 bg-white text-stone-900 hover:border-amber-400 hover:bg-amber-50/50'
                          }`}
                        >
                          <div className="flex items-center gap-1 text-sm font-bold">
                            <span>{tItem.accented}</span>
                            <Volume2 className="h-3.5 w-3.5 opacity-85" />
                          </div>
                          <div
                            className={`text-[11px] font-medium ${
                              isActiveTone ? 'text-amber-100' : 'text-stone-500'
                            }`}
                          >
                            Thanh {tItem.tone} · {tItem.hanzi}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Middle: Pronunciation Guide (Khẩu hình, Vị trí lưỡi, Bật hơi) */}
              <div className="lg:col-span-4 rounded-xl border border-stone-200/90 bg-white p-3.5 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900">
                  <Info className="h-4 w-4 text-amber-700 shrink-0" />
                  <span>Hướng dẫn khẩu hình & vị trí lưỡi chuẩn:</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  <span className="font-semibold text-stone-900">• Thanh mẫu: </span>
                  {selectedTarget.initialTip}
                </p>
                <p className="text-xs text-stone-700 leading-relaxed">
                  <span className="font-semibold text-stone-900">• Vận mẫu: </span>
                  {selectedTarget.finalTip}
                </p>
                <p className="text-[11px] font-medium text-amber-900 bg-amber-50/80 rounded-lg px-2.5 py-1.5 border border-amber-200/60">
                  Thanh {selectedTarget.activeTone}:{' '}
                  {PINYIN_TONES_4[selectedTarget.activeTone - 1]?.description}
                </p>
              </div>

              {/* Right: Đã thuộc / Chưa thuộc / Xóa Board Marking */}
              <div className="lg:col-span-3 flex flex-col justify-between gap-3 rounded-xl border border-stone-200 bg-white p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900">
                    Trạng thái ghi nhớ âm "{selectedTarget.displayTitle}"
                  </span>
                  {currentTargetStatus && (
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold ${
                        currentTargetStatus === 'mastered'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-rose-600 text-white'
                      }`}
                    >
                      {currentTargetStatus === 'mastered' ? 'Đã thuộc' : 'Chưa thuộc'}
                    </span>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="text-[11px] text-stone-500">
                    Đánh dấu trực tiếp lên bảng phiên âm để theo dõi các âm cần ôn lại:
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => handleMarkStatus(selectedTarget.key, 'mastered')}
                      className={`flex items-center justify-center gap-1 rounded-xl border px-2.5 py-2.5 text-xs font-bold transition-all ${
                        currentTargetStatus === 'mastered'
                          ? 'border-emerald-600 bg-emerald-600 text-white shadow-2xs'
                          : 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      }`}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                      <span>Đã thuộc</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMarkStatus(selectedTarget.key, 'needs_work')}
                      className={`flex items-center justify-center gap-1 rounded-xl border px-2.5 py-2.5 text-xs font-bold transition-all ${
                        currentTargetStatus === 'needs_work'
                          ? 'border-rose-600 bg-rose-600 text-white shadow-2xs'
                          : 'border-rose-300 bg-rose-50 text-rose-800 hover:bg-rose-100'
                      }`}
                    >
                      <XCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>Chưa thuộc</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMarkStatus(selectedTarget.key, null)}
                      className="flex items-center justify-center gap-1 rounded-xl border border-stone-200 bg-stone-100 px-2.5 py-2.5 text-xs font-semibold text-stone-600 hover:bg-stone-200"
                    >
                      <RotateCcw className="h-3.5 w-3.5 shrink-0" />
                      <span>Xóa</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* SUB-TAB 1: BẢNG GHÉP VẦN PINYIN ĐẦY ĐỦ (37 CỘT × 22 HÀNG + FULLSCREEN)*/}
      {/* ===================================================================== */}
      {subTab === 'chart' && (
        <>
          {renderPinyinMatrixSection(false)}
          {isChartFullscreen && renderPinyinMatrixSection(true)}
        </>
      )}

      {/* ===================================================================== */}
      {/* SUB-TAB 2: I. VẬN MẪU (38) & II. THANH MẪU (22)                       */}
      {/* ===================================================================== */}
      {subTab === 'finals_initials' && (
        <div className="space-y-6">
          {/* I. VẬN MẪU (38 Nguyên âm) */}
          <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5 space-y-4">
            <div>
              <h2 className="font-['Fraunces'] text-lg font-bold text-stone-900">
                I. VẬN MẪU (38 Vận Mẫu Tiếng Trung & Nguyên Âm Tiếng Việt Tương Đương)
              </h2>
              <p className="text-xs text-stone-600">
                Bám sát bảng I. Vận mẫu trong tài liệu. Ấn vào từng vận mẫu để nghe phát âm chuẩn và xem hướng dẫn khẩu hình.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {PINYIN_FINALS_38.map((fin) => {
                const itemKey = `final_${fin.stt}`;
                const status = masteryMap[itemKey]?.status || null;
                const isSelected = selectedTarget?.key === itemKey;
                return (
                  <div
                    key={fin.stt}
                    onClick={() =>
                      handleSelectInitialOrFinal(
                        itemKey,
                        'final',
                        fin.pinyin,
                        fin.ttsChar,
                        fin.vietnamese,
                        fin.guideVi,
                        fin.examplePinyin
                      )
                    }
                    className={`cursor-pointer rounded-xl border p-3 transition-all ${
                      status === 'mastered'
                        ? 'border-emerald-500 bg-emerald-50/90'
                        : status === 'needs_work'
                        ? 'border-rose-500 bg-rose-50/90'
                        : isSelected
                        ? 'border-amber-600 bg-amber-50/70 ring-1 ring-amber-600'
                        : 'border-stone-200 bg-stone-50/50 hover:border-amber-300 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-stone-200/80 font-mono text-[11px] font-bold text-stone-700">
                          {fin.stt}
                        </span>
                        <span className="font-mono text-base font-black text-stone-900">
                          {fin.pinyin}
                        </span>
                        <span className="text-xs font-semibold text-stone-400">→</span>
                        <span className="rounded-lg bg-amber-100/90 px-2 py-0.5 text-xs font-bold text-amber-950">
                          {fin.vietnamese}
                        </span>
                      </div>

                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() =>
                            handleSelectInitialOrFinal(
                              itemKey,
                              'final',
                              fin.pinyin,
                              fin.ttsChar,
                              fin.vietnamese,
                              fin.guideVi,
                              fin.examplePinyin
                            )
                          }
                          className="rounded-lg bg-amber-700 p-1.5 text-white hover:bg-amber-800"
                          title="Nghe phát âm vận mẫu"
                        >
                          <Volume2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMarkStatus(itemKey, status === 'mastered' ? null : 'mastered')}
                          className={`rounded-lg px-2 py-1 text-[10px] font-bold border ${
                            status === 'mastered'
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-50'
                          }`}
                        >
                          Đã thuộc
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMarkStatus(itemKey, status === 'needs_work' ? null : 'needs_work')}
                          className={`rounded-lg px-2 py-1 text-[10px] font-bold border ${
                            status === 'needs_work'
                              ? 'bg-rose-600 text-white border-rose-600'
                              : 'bg-white text-rose-700 border-rose-300 hover:bg-rose-50'
                          }`}
                        >
                          Chưa thuộc
                        </button>
                      </div>
                    </div>

                    <div className="mt-1.5 flex items-center justify-between text-[11px] text-stone-600">
                      <span>
                        VD: <strong className="text-stone-900">{fin.examplePinyin}</strong> ({fin.exampleHanzi} - {fin.exampleMeaning})
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-stone-500 line-clamp-2">
                      {fin.guideVi}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Ghi chú 1 từ tài liệu */}
            <div className="rounded-xl border-2 border-amber-300 bg-amber-50/80 p-3.5">
              <div className="text-xs font-extrabold text-amber-950">
                + Ghi chú 1: Khi C, CH, S, SH, Z, ZH, R + i thì chữ "i" sẽ biến đổi đọc thành chữ "ư"
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-stone-700">VD (Ấn để nghe):</span>
                {[
                  { py: 'Ci', init: 'c', vi: 'Chư/Xư' },
                  { py: 'Chi', init: 'ch', vi: 'Trư (bật hơi)' },
                  { py: 'Si', init: 's', vi: 'Xư' },
                  { py: 'Shi', init: 'sh', vi: 'Sư' },
                  { py: 'Zi', init: 'z', vi: 'Chư' },
                  { py: 'Zhi', init: 'zh', vi: 'Trư' },
                  { py: 'Ri', init: 'r', vi: 'Rư' },
                ].map((ex) => (
                  <button
                    key={ex.py}
                    type="button"
                    onClick={() =>
                      handleSelectSyllableCell(ex.py.toLowerCase(), ex.init, 1, false)
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-2.5 py-1 text-xs font-bold text-stone-900 hover:bg-amber-100"
                  >
                    <span>{ex.py}</span>
                    <span className="text-[10px] font-normal text-stone-500">({ex.vi})</span>
                    <Volume2 className="h-3 w-3 text-amber-700" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* II. THANH MẪU (22 Phụ âm) */}
          <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5 space-y-4">
            <div>
              <h2 className="font-['Fraunces'] text-lg font-bold text-stone-900">
                II. THANH MẪU (22 Phụ Âm Tiếng Trung & Ví Dụ Tương Đương Tiếng Việt)
              </h2>
              <p className="text-xs text-stone-600">
                Bám sát bảng II. Thanh mẫu trong tài liệu. Ấn vào bất kỳ hàng nào để nghe phát âm và đánh dấu Đã thuộc / Chưa thuộc.
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-stone-200">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-stone-100 text-stone-700 font-bold">
                    <th className="border-b border-stone-200 px-3 py-2.5 w-12 text-center">STT</th>
                    <th className="border-b border-stone-200 px-3 py-2.5">Thanh mẫu tiếng Trung</th>
                    <th className="border-b border-stone-200 px-3 py-2.5">Phụ âm tiếng Việt</th>
                    <th className="border-b border-stone-200 px-3 py-2.5 text-center">Ví dụ (Trung → Việt)</th>
                    <th className="border-b border-stone-200 px-3 py-2.5">Hướng dẫn vị trí lưỡi & bật hơi</th>
                    <th className="border-b border-stone-200 px-3 py-2.5 text-right">Nghe & Đánh dấu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {PINYIN_INITIALS_22.map((init) => {
                    const itemKey = `init_${init.stt}`;
                    const status = masteryMap[itemKey]?.status || null;
                    return (
                      <tr
                        key={init.stt}
                        onClick={() =>
                          handleSelectInitialOrFinal(
                            itemKey,
                            'initial',
                            init.pinyin,
                            init.ttsChar,
                            init.vietnamese,
                            init.guideVi,
                            init.exampleCn
                          )
                        }
                        className={`cursor-pointer transition-colors ${
                          status === 'mastered'
                            ? 'bg-emerald-50/90 hover:bg-emerald-100/80'
                            : status === 'needs_work'
                            ? 'bg-rose-50/90 hover:bg-rose-100/80'
                            : 'hover:bg-amber-50/50'
                        }`}
                      >
                        <td className="px-3 py-2.5 text-center font-mono font-bold text-stone-500">
                          {init.stt}
                        </td>
                        <td className="px-3 py-2.5 font-mono text-base font-black text-stone-900">
                          {init.pinyin}
                        </td>
                        <td className="px-3 py-2.5 font-bold text-amber-900">
                          {init.vietnamese}
                        </td>
                        <td className="px-3 py-2.5 text-center">
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-stone-100 px-2.5 py-1 font-semibold text-stone-800">
                            <span className="font-mono font-bold text-stone-900">{init.exampleCn}</span>
                            <span className="text-stone-400">→</span>
                            <span className="text-amber-800">{init.exampleVi}</span>
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-stone-600 max-w-md">
                          {init.guideVi}
                        </td>
                        <td
                          className="px-3 py-2.5 text-right whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() =>
                                handleSelectInitialOrFinal(
                                  itemKey,
                                  'initial',
                                  init.pinyin,
                                  init.ttsChar,
                                  init.vietnamese,
                                  init.guideVi,
                                  init.exampleCn
                                )
                              }
                              className="inline-flex items-center gap-1 rounded-lg bg-amber-700 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-amber-800"
                            >
                              <Volume2 className="h-3.5 w-3.5" />
                              <span>Nghe</span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleMarkStatus(itemKey, status === 'mastered' ? null : 'mastered')
                              }
                              className={`rounded-lg px-2 py-1.5 text-[11px] font-bold border ${
                                status === 'mastered'
                                  ? 'bg-emerald-600 text-white border-emerald-600'
                                  : 'bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-50'
                              }`}
                            >
                              Đã thuộc
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleMarkStatus(itemKey, status === 'needs_work' ? null : 'needs_work')
                              }
                              className={`rounded-lg px-2 py-1.5 text-[11px] font-bold border ${
                                status === 'needs_work'
                                  ? 'bg-rose-600 text-white border-rose-600'
                                  : 'bg-white text-rose-700 border-rose-300 hover:bg-rose-50'
                              }`}
                            >
                              Chưa thuộc
                            </button>
                            {status && (
                              <button
                                type="button"
                                onClick={() => handleMarkStatus(itemKey, null)}
                                className="rounded-lg border border-stone-200 bg-stone-100 px-2 py-1.5 text-[11px] font-semibold text-stone-600 hover:bg-stone-200"
                              >
                                Xóa
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Ghi chú 2 từ tài liệu */}
            <div className="rounded-xl border-2 border-amber-300 bg-amber-50/80 p-3.5">
              <div className="text-xs font-extrabold text-amber-950">
                + Ghi chú 2: Q, X, Y, J chỉ kết hợp với ü (không kết hợp với U) và đọc là Uy (khi viết bỏ 2 dấu chấm trên đầu chữ ü)
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-stone-700">VD (Ấn để nghe):</span>
                {[
                  { py: 'Qu', init: 'q', vi: 'Chuy (bật hơi)' },
                  { py: 'Xu', init: 'x', vi: 'Xuy' },
                  { py: 'Yu', init: '', vi: 'Duy / Uy' },
                  { py: 'Ju', init: 'j', vi: 'Chuy (thẳng lưỡi)' },
                ].map((ex) => (
                  <button
                    key={ex.py}
                    type="button"
                    onClick={() =>
                      handleSelectSyllableCell(ex.py.toLowerCase(), ex.init, 1, false)
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-2.5 py-1 text-xs font-bold text-stone-900 hover:bg-amber-100"
                  >
                    <span>{ex.py}</span>
                    <span className="text-[10px] font-normal text-stone-500">({ex.vi})</span>
                    <Volume2 className="h-3 w-3 text-amber-700" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SUB-TAB 3: III. THANH ĐIỆU (4 THANH) & IV. LƯU Ý BIẾN ĐIỆU            */}
      {/* ===================================================================== */}
      {subTab === 'tones_sandhi' && (
        <div className="space-y-6">
          {/* III. THANH ĐIỆU */}
          <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5 space-y-4">
            <div>
              <h2 className="font-['Fraunces'] text-lg font-bold text-stone-900">
                III. THANH ĐIỆU (4 Thanh Điệu Chính Trong Tiếng Trung)
              </h2>
              <p className="text-xs text-stone-600">
                Ấn vào từng thanh điệu để nghe phát âm mẫu chuẩn.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {PINYIN_TONES_4.map((t) => (
                <div
                  key={t.stt}
                  className="flex flex-col justify-between rounded-xl border border-stone-200 bg-stone-50/60 p-4 hover:border-amber-300 hover:bg-white transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-2 text-sm font-black text-stone-900">
                        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-700 text-xs text-white">
                          {t.stt}
                        </span>
                        <span>{t.name}</span>
                      </span>
                      <span className="rounded-lg border border-amber-300 bg-amber-50 px-2.5 py-1 font-mono text-sm font-black text-amber-950">
                        Kí hiệu: {t.symbol}
                      </span>
                    </div>

                    <p className="mt-2.5 text-xs text-stone-700 leading-relaxed">
                      {t.description}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-stone-200/70 pt-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs text-stone-500">Ví dụ:</span>
                      <span className="font-mono text-base font-black text-stone-900">
                        {t.examplePinyin}
                      </span>
                      <span className="font-['Noto_Sans_SC'] text-base font-bold text-amber-800">
                        ({t.exampleHanzi} - {t.exampleMeaning})
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleSelectSyllableCell('ma', 'm', t.stt as 1 | 2 | 3 | 4, false)
                      }
                      className="inline-flex items-center gap-1.5 rounded-xl bg-amber-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-800"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                      <span>Nghe {t.examplePinyin}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* IV. LƯU Ý - BIẾN ĐIỆU */}
          <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5 space-y-4">
            <div>
              <h2 className="font-['Fraunces'] text-lg font-bold text-stone-900">
                IV. LƯU Ý — QUY TẮC BIẾN ĐIỆU (Thanh 3, Yī 一, Bù 不)
              </h2>
              <p className="text-xs text-stone-600">
                Bám sát mục IV. Lưu ý Biến điệu. Ấn vào từng ví dụ để nghe sự biến đổi thanh điệu thực tế.
              </p>
            </div>

            <div className="space-y-3">
              {TONE_SANDHI_RULES.map((rule) => (
                <div
                  key={rule.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50/50 p-4"
                >
                  <div className="space-y-1">
                    <div className="font-mono text-sm font-black text-stone-900">
                      {rule.formula}
                    </div>
                    <div className="text-xs font-bold text-amber-900">
                      Ví dụ: {rule.example}
                    </div>
                    <p className="text-xs text-stone-600">{rule.meaningVi}</p>
                    {rule.note && (
                      <p className="text-xs font-semibold text-rose-800 mt-1">
                        * {rule.note}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onSpeak(rule.ttsHanzi, false)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-stone-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-stone-800"
                    >
                      <Volume2 className="h-3.5 w-3.5 text-amber-400" />
                      <span>Nghe "{rule.ttsHanzi}"</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onWordClick(
                          rule.ttsHanzi,
                          rule.example,
                          'Phiên Âm Tiếng Trung — Biến điệu'
                        )
                      }
                      className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100"
                    >
                      Tra từ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SUB-TAB 4: V. CÁCH VIẾT NÉT THUẬN (8 NÉT BÚT LÔNG THẬT CHUYỂN ĐỘNG)   */}
      {/* ===================================================================== */}
      {subTab === 'strokes' && (
        <div className="space-y-6">
          {/* Bảng Tổng Hợp "Quy tắc viết chữ Hán - 8 nét cơ bản" (Nét bút thư pháp Khải thư thật chuyển động liên tục như ảnh) */}
          <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5 space-y-4">
            <div>
              <h2 className="font-['Fraunces'] text-lg font-bold text-stone-900">
                Bảng Quy Tắc Viết Chữ Hán — 8 Nét Cơ Bản (Nét Bút Thư Pháp Chuyển Động Liên Tục)
              </h2>
              <p className="text-xs text-stone-600">
                Đầy đủ 8 nét cơ bản và 35 biến thể nét bút Khải thư thật (có nhấn đầu bút, vuốt nhọn đuôi, chân mác, góc gập và mũi móc) chuyển động liên tục theo chiều viết chuẩn.
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border-2 border-stone-800 bg-white">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-stone-100 text-stone-900 font-bold border-b-2 border-stone-800">
                    <th className="border-r-2 border-stone-800 px-4 py-3 w-32 text-sm">
                      8 Nét cơ bản
                    </th>
                    <th className="px-4 py-3 text-sm">
                      Các biến thể nét bút thật (Chuyển động liên tục)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y border-stone-400">
                  {CALLIGRAPHY_STROKE_ROWS.map((row) => {
                    const isMultiLineRow = row.id === 'gap' || row.id === 'moc';
                    const firstLineVariants =
                      row.id === 'gap'
                        ? row.variants.slice(0, 5)
                        : row.id === 'moc'
                        ? row.variants.slice(0, 5)
                        : row.variants;
                    const secondLineVariants =
                      row.id === 'gap'
                        ? row.variants.slice(5)
                        : row.id === 'moc'
                        ? row.variants.slice(5)
                        : [];

                    return (
                      <tr key={row.id} className="border-b border-stone-400">
                        <td className="border-r-2 border-stone-800 bg-stone-50/70 px-4 py-3 align-middle">
                          <div className="font-['Fraunces'] text-base font-bold text-stone-900">
                            {row.labelVi}
                          </div>
                          <div className="text-[11px] font-semibold text-amber-800">
                            {row.hanziName} ({row.pinyinName})
                          </div>
                        </td>
                        <td className="p-0">
                          <div className="px-4 py-3 flex flex-wrap items-center gap-4 sm:gap-6">
                            {firstLineVariants.map((v, vIdx) => (
                              <div
                                key={v.id}
                                className="flex flex-col items-center gap-1"
                              >
                                <ContinuousCalligraphyStrokeBox
                                  variant={v}
                                  instanceKey={`table_${row.id}_${vIdx}`}
                                  sizeClass="h-18 w-18 sm:h-20 sm:w-20"
                                  durationSec={2.1 + (vIdx % 3) * 0.18}
                                />
                                <span className="text-[10px] font-semibold text-stone-600">
                                  {v.nameVi}
                                </span>
                              </div>
                            ))}
                          </div>
                          {isMultiLineRow && secondLineVariants.length > 0 && (
                            <div className="border-t border-stone-300 px-4 py-3 flex flex-wrap items-center gap-4 sm:gap-6">
                              {secondLineVariants.map((v, vIdx) => (
                                <div
                                  key={v.id}
                                  className="flex flex-col items-center gap-1"
                                >
                                  <ContinuousCalligraphyStrokeBox
                                    variant={v}
                                    instanceKey={`table2_${row.id}_${vIdx}`}
                                    sizeClass="h-18 w-18 sm:h-20 sm:w-20"
                                    durationSec={2.2 + (vIdx % 3) * 0.18}
                                  />
                                  <span className="text-[10px] font-semibold text-stone-600">
                                    {v.nameVi}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 8 Nét Cơ Bản Chi Tiết Kèm Chữ Ví Dụ */}
          <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5 space-y-4">
            <div>
              <h3 className="font-['Fraunces'] text-lg font-bold text-stone-900">
                Chi Tiết Cách Viết 8 Nét Cơ Bản & Chữ Hán Ví Dụ
              </h3>
              <p className="text-xs text-stone-600">
                Ấn vào các chữ Hán ví dụ ở từng nét để nghe phát âm và xem giải nghĩa.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {BASIC_STROKES_8.map((st, idx) => {
                const calligraphyRow =
                  CALLIGRAPHY_STROKE_ROWS.find((r) => r.id === st.id) ||
                  CALLIGRAPHY_STROKE_ROWS[0];
                const primaryVariant = calligraphyRow.variants[0];

                return (
                  <div
                    key={st.id}
                    className="flex flex-col justify-between rounded-xl border border-stone-200 bg-stone-50/50 p-3.5 hover:border-amber-300 hover:bg-white transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-stone-900">
                          {idx + 1}. {st.nameVi}
                        </span>
                        <span className="font-['Noto_Sans_SC'] text-lg font-black text-amber-800">
                          {st.hanziSymbol}
                        </span>
                      </div>

                      {/* Continuously Animated Authentic Calligraphy Stroke */}
                      <div className="my-3 flex items-center justify-center">
                        <ContinuousCalligraphyStrokeBox
                          variant={primaryVariant}
                          instanceKey={`card_${st.id}`}
                          sizeClass="h-24 w-24"
                          durationSec={2.1 + (idx % 3) * 0.2}
                        />
                      </div>

                      <p className="text-xs text-stone-700 leading-relaxed">
                        {st.directionVi}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-stone-200/70">
                      <div className="text-[10px] font-semibold text-stone-500 mb-1">
                        Chữ ví dụ (Ấn để nghe & tra cứu):
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {st.examples.map((ch) => (
                          <button
                            key={ch}
                            type="button"
                            onClick={() => {
                              onSpeak(ch, false);
                              onWordClick(ch, st.nameVi, '8 Nét Cơ Bản Chữ Hán');
                            }}
                            className="rounded-lg border border-stone-200 bg-white px-2 py-0.5 font-['Noto_Sans_SC'] text-xs font-bold text-stone-900 hover:border-amber-400 hover:bg-amber-50"
                          >
                            {ch}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Những quy tắc bút thuận trong tiếng Trung & Quy tắc bổ sung */}
          <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5 space-y-4">
            <div>
              <h3 className="font-['Fraunces'] text-lg font-bold text-stone-900">
                Những Quy Tắc Bút Thuận Trong Tiếng Trung & Quy Tắc Bổ Sung
              </h3>
              <p className="text-xs text-stone-600">
                Nắm vững quy tắc viết chữ Hán giúp tập viết chính xác và đếm đúng số lượng nét khi tra từ điển.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {STROKE_ORDER_RULES.map((rule, idx) => (
                <div
                  key={rule.id}
                  className={`rounded-xl border p-3.5 ${
                    rule.isSupplementary
                      ? 'border-stone-200 bg-stone-50/70'
                      : 'border-amber-200/90 bg-amber-50/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-stone-900">
                      {rule.isSupplementary ? `Bổ sung` : `Quy tắc ${idx + 1}`}:{' '}
                      {rule.ruleVi}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] text-stone-500">Ví dụ:</span>
                    {rule.examples.map((ch) => (
                      <button
                        key={ch}
                        type="button"
                        onClick={() => {
                          onSpeak(ch, false);
                          onWordClick(ch, rule.ruleVi, 'Quy tắc bút thuận chữ Hán');
                        }}
                        className="inline-flex items-center gap-1 rounded-lg border border-stone-300 bg-white px-2.5 py-1 font-['Noto_Sans_SC'] text-sm font-bold text-stone-900 hover:border-amber-500 hover:bg-amber-50"
                      >
                        <span>{ch}</span>
                        <Volume2 className="h-3 w-3 text-amber-700" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
