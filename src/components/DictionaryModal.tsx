import React, { useEffect, useState } from 'react';
import {
  Volume2,
  Bookmark,
  X,
  BookOpen,
  Layers,
  Check,
  Turtle,
  ArrowRight,
  ExternalLink,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';
import {
  VocabItem,
  DialogueLine,
  BookmarkedWord,
} from '../types/textbook';
import {
  buildLocalWordDetails,
  WordVisualIllustration,
  renderHighlightedChineseText,
  toTraditionalChinese,
  handleHanziiLinkClick,
} from '../utils/visualDictionary';

interface DictionaryModalProps {
  wordHanzi: string | null;
  contextSentence?: string;
  lessonTitle?: string;
  allVocab: VocabItem[];
  allDialogues: DialogueLine[];
  bookmarks: Record<string, BookmarkedWord>;
  onToggleBookmark: (
    word: {
      hanzi: string;
      pinyin: string;
      meaning_vi: string;
      page: number;
      lessonTitle: string;
    },
    tag?: BookmarkedWord['tag'],
    note?: string
  ) => void;
  onSpeak: (text: string, slow?: boolean) => void;
  onSelectWord: (hanzi: string) => void;
  onClose: () => void;
}

const TAG_LABELS: Record<
  BookmarkedWord['tag'],
  { label: string; colorClass: string }
> = {
  da_luu: {
    label: 'Đã lưu',
    colorClass: 'bg-amber-100 text-amber-950 border-amber-400',
  },
  quan_trong: {
    label: 'Chưa thuộc',
    colorClass: 'bg-rose-600 text-white border-rose-600',
  },
  can_on: {
    label: 'Cần ôn tập',
    colorClass: 'bg-orange-100 text-orange-950 border-orange-300',
  },
  hay_nham: {
    label: 'Hay nhầm',
    colorClass: 'bg-purple-100 text-purple-900 border-purple-300',
  },
  da_thuoc: {
    label: 'Đã thuộc',
    colorClass: 'bg-emerald-600 text-white border-emerald-600',
  },
};

export const DictionaryModal: React.FC<DictionaryModalProps> = ({
  wordHanzi,
  contextSentence,
  lessonTitle,
  allVocab,
  allDialogues,
  bookmarks,
  onToggleBookmark,
  onSpeak,
  onSelectWord,
  onClose,
}) => {
  const [noteInput, setNoteInput] = useState('');
  const [selectedTag, setSelectedTag] =
    useState<BookmarkedWord['tag']>('da_luu');
  const [remoteExamples, setRemoteExamples] = useState<
    {
      hanzi: string;
      traditional: string;
      pinyin: string;
      meaningVi: string;
    }[]
  >([]);
  const [loadingExamples, setLoadingExamples] = useState(false);

  const localDetails = wordHanzi
    ? buildLocalWordDetails(wordHanzi, allVocab, allDialogues)
    : null;

  const existingBookmark = wordHanzi ? bookmarks[wordHanzi] : undefined;

  useEffect(() => {
    if (existingBookmark) {
      setNoteInput(existingBookmark.personalNote || '');
      setSelectedTag(existingBookmark.tag || 'da_luu');
    } else {
      setNoteInput('');
      setSelectedTag('da_luu');
    }
  }, [wordHanzi, existingBookmark]);

  const primaryKw = localDetails?.primaryKeyword || '';

  useEffect(() => {
    if (!primaryKw) {
      setRemoteExamples([]);
      return;
    }
    let active = true;
    setLoadingExamples(true);
    fetch(`/api/examples?q=${encodeURIComponent(primaryKw)}`)
      .then((res) => (res.ok ? res.json() : { examples: [] }))
      .then((data: { examples?: typeof remoteExamples }) => {
        if (!active) return;
        setRemoteExamples(Array.isArray(data.examples) ? data.examples : []);
      })
      .catch(() => {
        if (active) setRemoteExamples([]);
      })
      .finally(() => {
        if (active) setLoadingExamples(false);
      });

    return () => {
      active = false;
    };
  }, [primaryKw]);

  if (!wordHanzi || !localDetails) return null;

  const displayPinyin = localDetails.pinyin;
  const displayMeaning = localDetails.meaningVi;

  // Merge textbook examples + popular online URL examples (deduplicated, up to 6 items)
  const combinedExamples: {
    hanzi: string;
    traditional: string;
    pinyin: string;
    meaningVi: string;
  }[] = [];
  const seenExampleHanzi = new Set<string>();

  for (const ex of [...remoteExamples, ...localDetails.textbookExamples]) {
    const cleanH = ex.hanzi.trim();
    if (!cleanH || seenExampleHanzi.has(cleanH)) continue;
    seenExampleHanzi.add(cleanH);
    combinedExamples.push({
      hanzi: cleanH,
      traditional: (ex.traditional || toTraditionalChinese(cleanH)).trim(),
      pinyin: ex.pinyin,
      meaningVi: ex.meaningVi,
    });
    if (combinedExamples.length >= 6) break;
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-end bg-slate-950/45 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div
        className="relative flex h-full w-full max-w-xl flex-col bg-[#FAF8F3] text-stone-900 shadow-2xl border-l border-stone-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-stone-200 bg-white px-6 py-4">
          <div>
            <div className="text-xs font-medium text-stone-500">
              Từ điển chuyên dụng & Ngữ cảnh · Trang {localDetails.page} (
              {lessonTitle || localDetails.lessonTitle})
            </div>
            <h2 className="font-['Fraunces'] text-lg font-bold text-stone-900">
              Tra cứu từ vựng trực quan
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors"
            aria-label="Đóng từ điển"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* 1. Unified First Lookup Card: Word + Thumbnail + Pronunciation + Hanzii + Bookmark Tags & Personal Note */}
          <WordVisualIllustration
            hanzi={wordHanzi}
            pinyin={displayPinyin}
            meaningVi={displayMeaning}
            category={localDetails.category}
            showSearchLinks={false}
            showImageSearchLinks={false}
          >
            <div
              className="mt-1 space-y-3 border-t border-stone-200/80 pt-3"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Action Row: Phát âm, Đọc chậm, Từ điển Hanzii, Đánh dấu từ vựng */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => onSpeak(wordHanzi, false)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-amber-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-800 transition-colors whitespace-nowrap shrink-0"
                >
                  <Volume2 className="h-3.5 w-3.5" />
                  <span>Phát âm (1.0x)</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSpeak(wordHanzi, true)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white/95 px-2.5 py-1.5 text-xs font-medium text-stone-800 hover:bg-stone-100 transition-colors whitespace-nowrap shrink-0"
                >
                  <Turtle className="h-3.5 w-3.5 text-amber-700" />
                  <span>Đọc chậm (0.65x)</span>
                </button>

                <a
                  href={localDetails.hanziiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) =>
                    handleHanziiLinkClick(e, localDetails.primaryKeyword)
                  }
                  className="inline-flex items-center gap-1 rounded-lg border border-amber-300 bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-amber-950 hover:bg-amber-100 transition-colors whitespace-nowrap shrink-0"
                  title={`Tra cứu chi tiết từ "${localDetails.primaryKeyword}" trên Từ điển Hanzii`}
                >
                  <BookOpen className="h-3.5 w-3.5 text-amber-800" />
                  <span>Từ điển Hanzii</span>
                  <ExternalLink className="h-3 w-3" />
                </a>

                <button
                  type="button"
                  onClick={() =>
                    onToggleBookmark(
                      {
                        hanzi: wordHanzi,
                        pinyin: displayPinyin,
                        meaning_vi: displayMeaning,
                        page: localDetails.page,
                        lessonTitle: localDetails.lessonTitle,
                      },
                      selectedTag,
                      noteInput
                    )
                  }
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    existingBookmark
                      ? 'border-amber-400 bg-amber-100/90 text-amber-950'
                      : 'border-stone-300 bg-white/95 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Bookmark
                    className={`h-3.5 w-3.5 ${
                      existingBookmark ? 'fill-amber-500 text-amber-600' : ''
                    }`}
                  />
                  <span>
                    {existingBookmark ? 'Đã lưu sổ tay' : 'Đánh dấu từ vựng'}
                  </span>
                </button>
              </div>

              {/* Integrated Bookmark Tag & Personal Note Section */}
              <div className="rounded-xl border border-stone-200/80 bg-white/90 p-3 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-700">
                    Nhãn đánh dấu & Ghi chú cá nhân
                  </span>
                  {existingBookmark && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                      <Check className="h-3.5 w-3.5" />
                      Đã đồng bộ sổ tay
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {(Object.keys(TAG_LABELS) as BookmarkedWord['tag'][]).map(
                    (tKey) => (
                      <button
                        key={tKey}
                        type="button"
                        onClick={() => {
                          setSelectedTag(tKey);
                          if (existingBookmark) {
                            onToggleBookmark(
                              {
                                hanzi: wordHanzi,
                                pinyin: displayPinyin,
                                meaning_vi: displayMeaning,
                                page: localDetails.page,
                                lessonTitle: localDetails.lessonTitle,
                              },
                              tKey,
                              noteInput
                            );
                          }
                        }}
                        className={`rounded-md border px-2.5 py-1 text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                          selectedTag === tKey
                            ? TAG_LABELS[tKey].colorClass + ' shadow-2xs'
                            : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        {TAG_LABELS[tKey].label}
                      </button>
                    )
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    placeholder="Ghi chú mẹo nhớ hoặc cách dùng riêng của bạn..."
                    className="flex-1 rounded-lg border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs text-stone-800 placeholder:text-stone-400 focus:border-amber-600 focus:bg-white focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      onToggleBookmark(
                        {
                          hanzi: wordHanzi,
                          pinyin: displayPinyin,
                          meaning_vi: displayMeaning,
                          page: localDetails.page,
                          lessonTitle: localDetails.lessonTitle,
                        },
                        selectedTag,
                        noteInput
                      )
                    }
                    className="rounded-lg bg-stone-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-stone-800 transition-colors whitespace-nowrap shrink-0"
                  >
                    Lưu ghi chú
                  </button>
                </div>
              </div>
            </div>
          </WordVisualIllustration>

          {/* 2. Multi-Image Web Search Gallery (3 Contextual Photos that open image search when clicked) */}
          <div className="rounded-xl border border-stone-200 bg-white p-4 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-800">
              <ImageIcon className="h-4 w-4 text-amber-700" />
              <span>
                Hình ảnh minh họa theo từ khóa chữ Hán “
                {localDetails.primaryKeyword}”
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {localDetails.imageExamples.map((imgItem, idx) => (
                <a
                  key={idx}
                  href={imgItem.searchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block overflow-hidden rounded-lg border border-stone-200 bg-stone-50 hover:border-amber-500 transition-all"
                  title={`Xem thêm ảnh "${imgItem.query}" trên Bing Images`}
                >
                  <div className="aspect-4/3 w-full overflow-hidden bg-stone-100">
                    <img
                      src={imgItem.thumbUrl}
                      alt={imgItem.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-1.5 text-center">
                    <span className="block truncate text-[11px] font-medium text-stone-700 group-hover:text-amber-900">
                      {imgItem.title}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* 3. Popular Complete Example Sentences & Contextual Usage */}
          <div className="rounded-xl border border-stone-200 bg-white p-4 space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-800">
                <BookOpen className="h-4 w-4 text-amber-700" />
                <span>
                  Mẫu câu ví dụ thông dụng của “{localDetails.primaryKeyword}”
                </span>
                {loadingExamples && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-700" />
                )}
              </div>

              <a
                href={localDetails.hanziiExampleUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) =>
                  handleHanziiLinkClick(e, localDetails.primaryKeyword)
                }
                className="inline-flex items-center gap-1 rounded-lg border border-amber-300 bg-amber-50/80 px-2.5 py-1 text-[11px] font-semibold text-amber-900 hover:bg-amber-100 transition-colors"
                title={`Xem thêm mẫu câu ví dụ của "${localDetails.primaryKeyword}" trên Hanzii`}
              >
                <span>Thêm câu ví dụ (Hanzii)</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {contextSentence && (
              <div className="rounded-lg bg-amber-50/70 border border-amber-200/80 p-3">
                <div className="text-xs font-medium text-amber-900">
                  Câu đang đọc trên trang:
                </div>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <p className="font-['Noto_Sans_SC'] text-base font-medium text-stone-900">
                    {renderHighlightedChineseText(
                      contextSentence,
                      localDetails.primaryKeyword
                    )}
                  </p>
                  <button
                    onClick={() => onSpeak(contextSentence, false)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-700 text-white hover:bg-amber-800"
                    title="Nghe cả câu"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            <p className="text-xs leading-relaxed text-stone-700 bg-stone-50 p-3 rounded-lg border border-stone-200/60">
              {localDetails.contextualUsageVi}
            </p>

            {/* Example Sentences List (Formatted with left speaker button, red highlighted keyword, Simplified + [Traditional], Pinyin, and Vietnamese translation) */}
            <div className="divide-y divide-stone-100 rounded-xl border border-stone-200/90 bg-white">
              {combinedExamples.map((ex, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3.5 p-3.5 hover:bg-stone-50/70 transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => onSpeak(ex.hanzi, false)}
                    className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-stone-200 bg-stone-50 text-stone-700 hover:border-amber-500 hover:bg-amber-50 hover:text-amber-800 transition-colors"
                    title="Nghe phát âm cả câu ví dụ"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>

                  <div className="min-w-0 flex-1 space-y-0.5">
                    <p className="font-['Noto_Sans_SC'] text-base sm:text-[17px] leading-snug font-medium text-stone-900">
                      {renderHighlightedChineseText(
                        ex.hanzi,
                        localDetails.primaryKeyword
                      )}
                    </p>
                    <p className="font-['Noto_Sans_SC'] text-sm sm:text-[15px] leading-snug text-stone-700">
                      [
                      {renderHighlightedChineseText(
                        ex.traditional,
                        localDetails.primaryKeyword
                      )}{' '}
                      ]
                    </p>
                    {ex.pinyin && (
                      <p className="pt-0.5 font-sans text-xs sm:text-sm text-stone-500">
                        {ex.pinyin}
                      </p>
                    )}
                    <p className="pt-0.5 text-sm sm:text-[15px] font-medium text-stone-900">
                      {ex.meaningVi}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Collocations & Related Combinations */}
          {localDetails.collocations.length > 0 && (
            <div className="rounded-xl border border-stone-200 bg-white p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-800">
                <Layers className="h-4 w-4 text-amber-700" />
                <span>Cụm từ & Từ vựng kết hợp trong bài</span>
              </div>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {localDetails.collocations.map((col, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-lg border border-stone-200/80 bg-stone-50/70 px-3 py-2"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-['Noto_Sans_SC'] text-sm font-semibold text-stone-900 truncate">
                        {col.hanzi}
                      </div>
                      <div className="font-mono text-xs text-amber-800 truncate">
                        {col.pinyin}
                      </div>
                      <div className="text-xs text-stone-600 truncate">
                        {col.meaningVi}
                      </div>
                    </div>
                    <button
                      onClick={() => onSpeak(col.hanzi, false)}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-stone-200 bg-white text-stone-700 hover:text-amber-700"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. Synonyms & Related Vocabulary (Clickable to jump in dictionary) */}
          <div className="rounded-xl border border-stone-200 bg-white p-4">
            <div className="text-xs font-semibold text-stone-800">
              Từ đồng nghĩa & Từ vựng liên quan trong Giáo Trình Hán Ngữ Hoa Sen
            </div>
            <div className="mt-3 space-y-2">
              {localDetails.synonyms.map((rel, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-3 rounded-lg border border-stone-200/80 bg-stone-50/70 p-2.5 hover:border-amber-400 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-['Noto_Sans_SC'] text-sm font-bold text-stone-900">
                        {rel.hanzi}
                      </span>
                      <span className="font-mono text-xs text-amber-800">
                        {rel.pinyin}
                      </span>
                      <span className="text-xs text-stone-400">·</span>
                      <span className="text-xs text-stone-600">
                        {rel.relation}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-stone-800">
                      {rel.meaningVi}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => onSpeak(rel.hanzi, false)}
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-stone-200 bg-white text-stone-700 hover:text-amber-700"
                      title="Nghe phát âm"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onSelectWord(rel.hanzi)}
                      className="inline-flex items-center gap-1 rounded-md bg-stone-900 px-2.5 py-1 text-xs font-medium text-white hover:bg-stone-800"
                    >
                      <span>Tra</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
