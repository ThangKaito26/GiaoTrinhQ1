import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Volume2,
  Eye,
  EyeOff,
  RotateCcw,
  BookOpen,
  Keyboard,
  CheckCheck,
} from 'lucide-react';
import {
  ExerciseItem,
  LessonExercisesRaw,
  SavedExerciseAttempt,
  VocabItem,
  AIResult,
} from '../types/textbook';
import { evaluateExerciseAnswerLocal } from '../utils/answerChecker';
import { segmentChineseSentence } from '../utils/visualDictionary';

interface SmartPracticeDashboardProps {
  lessonsExercises: LessonExercisesRaw[];
  selectedLessonId: string;
  onSelectLessonId: (lessonId: string) => void;
  lessonVocab: VocabItem[];
  attempts: Record<string, SavedExerciseAttempt>;
  onSaveAttempt: (
    exerciseId: string,
    userAnswer: string,
    aiResult?: AIResult
  ) => void;
  onSpeak: (text: string, slow?: boolean) => void;
  onWordClick: (hanzi: string, contextSentence?: string) => void;
  vocabSet: Set<string>;
  sortedVocabKeys: string[];
}

/**
 * Format lesson title so Vietnamese ("Bài 1: ...") comes FIRST, followed by " / ", then Chinese & Pinyin
 */
export function formatLessonTitleViFirst(rawTitle: string): string {
  if (!rawTitle.includes('/')) return rawTitle;
  const parts = rawTitle.split('/').map((s) => s.trim());
  if (parts.length < 2) return rawTitle;
  const [first, second] = parts;
  if (/^bài\s/i.test(second)) {
    return `${second} / ${first}`;
  }
  return `${first} / ${second}`;
}

export const SmartPracticeDashboard: React.FC<SmartPracticeDashboardProps> = ({
  lessonsExercises,
  selectedLessonId,
  onSelectLessonId,
  lessonVocab,
  attempts,
  onSaveAttempt,
  onSpeak,
  onWordClick,
  vocabSet,
  sortedVocabKeys,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [activeHelperId, setActiveHelperId] = useState<string | null>(null);
  const [errorMsgByEx, setErrorMsgByEx] = useState<Record<string, string>>({});

  const currentLessonBlock = useMemo(() => {
    return (
      lessonsExercises.find((l) => l.lesson_id === selectedLessonId) ||
      lessonsExercises[0]
    );
  }, [lessonsExercises, selectedLessonId]);

  const filteredExercises = useMemo(() => {
    if (!currentLessonBlock) return [];
    if (filterType === 'all') return currentLessonBlock.exercises;
    return currentLessonBlock.exercises.filter(
      (ex) => ex.exercise_type === filterType
    );
  }, [currentLessonBlock, filterType]);

  // Calculate overall stats
  const stats = useMemo(() => {
    const allEx = lessonsExercises.flatMap((l) => l.exercises);
    const total = allEx.length;
    const completedList = allEx
      .map((ex) => attempts[ex.exercise_id])
      .filter((a) => a && a.aiResult);
    const completed = completedList.length;
    const avgScore =
      completed > 0
        ? Math.round(
            completedList.reduce(
              (acc, c) => acc + (c.aiResult?.score || 0),
              0
            ) / completed
          )
        : 0;

    const currentLessonTotal = currentLessonBlock?.exercises.length || 0;
    const currentLessonDone =
      currentLessonBlock?.exercises.filter(
        (ex) => attempts[ex.exercise_id]?.aiResult
      ).length || 0;

    return {
      total,
      completed,
      avgScore,
      currentLessonTotal,
      currentLessonDone,
    };
  }, [lessonsExercises, attempts, currentLessonBlock]);

  const handleCheckAnswer = (ex: ExerciseItem) => {
    const currentAns = attempts[ex.exercise_id]?.userAnswer || '';
    if (!currentAns.trim()) {
      setErrorMsgByEx((prev) => ({
        ...prev,
        [ex.exercise_id]:
          'Bạn hãy nhập đáp án (bằng chữ Hán, Pinyin hoặc tiếng Việt) trước khi bấm Kiểm tra đáp án.',
      }));
      return;
    }

    setErrorMsgByEx((prev) => {
      const next = { ...prev };
      delete next[ex.exercise_id];
      return next;
    });

    const result = evaluateExerciseAnswerLocal(ex, currentAns);
    onSaveAttempt(ex.exercise_id, currentAns, result);
  };

  const handleCheckAllInLesson = () => {
    for (const ex of filteredExercises) {
      const currentAns = attempts[ex.exercise_id]?.userAnswer || '';
      if (currentAns.trim()) {
        const result = evaluateExerciseAnswerLocal(ex, currentAns);
        onSaveAttempt(ex.exercise_id, currentAns, result);
      }
    }
  };

  const appendTokenToAnswer = (exId: string, token: string) => {
    const prev = attempts[exId]?.userAnswer || '';
    const next = prev + token;
    onSaveAttempt(exId, next, attempts[exId]?.aiResult);
  };

  // Extract shuffled character/word chips from lesson vocabulary & reference so it doesn't give away the exact sentence order
  const getWordChipsForExercise = (ex: ExerciseItem): { hanzi: string }[] => {
    const chips: { hanzi: string }[] = [];
    const seen = new Set<string>();

    // Segment characters from reference answer and mix with lesson vocab
    const chars = ex.answer_hanzi
      .replace(/[，。！？、：；“”（）\s/(=)]/g, '')
      .split('');
    for (const ch of chars) {
      if (!seen.has(ch) && /[\u4e00-\u9fa5]/.test(ch)) {
        seen.add(ch);
        chips.push({ hanzi: ch });
      }
    }

    for (const v of lessonVocab) {
      const cleanH = v.hanzi.split('/')[0].trim();
      if (
        cleanH &&
        cleanH.length <= 2 &&
        !seen.has(cleanH) &&
        chips.length < 18
      ) {
        seen.add(cleanH);
        chips.push({ hanzi: cleanH });
      }
    }

    // Sort deterministically by character code so it doesn't reveal the exact sentence order
    return chips.slice(0, 18).sort((a, b) => a.hanzi.localeCompare(b.hanzi));
  };

  const renderSegmentedChinese = (sentence: string) => {
    const tokens = segmentChineseSentence(sentence, vocabSet, sortedVocabKeys);
    return tokens.map((tok, tIdx) =>
      tok.isWord ? (
        <button
          key={tIdx}
          type="button"
          onClick={() => onWordClick(tok.text, sentence)}
          className="rounded px-0.5 font-['Noto_Sans_SC'] font-bold text-stone-900 hover:bg-amber-100 hover:text-amber-900 transition-colors"
          title={`Tra từ "${tok.text}"`}
        >
          {tok.text}
        </button>
      ) : (
        <span key={tIdx}>{tok.text}</span>
      )
    );
  };

  return (
    <div className="space-y-5">
      {/* Top Smart Dashboard Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="rounded-xl border border-stone-200 bg-white p-4">
          <div className="text-xs text-stone-500">Tiến độ Bài đang chọn</div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="font-mono text-2xl font-bold tabular-nums text-stone-900">
              {stats.currentLessonDone} / {stats.currentLessonTotal}
            </span>
            <span className="text-xs font-medium text-amber-800">
              câu đã kiểm tra
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-stone-200 bg-white p-4">
          <div className="text-xs text-stone-500">
            Tổng bài tập toàn Giáo trình
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="font-mono text-2xl font-bold tabular-nums text-stone-900">
              {stats.completed} / {stats.total}
            </span>
            <span className="text-xs font-medium text-stone-600">
              {lessonsExercises.length} bài học
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-stone-200 bg-white p-4">
          <div className="text-xs text-stone-500">Độ chính xác trung bình</div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="font-mono text-2xl font-bold tabular-nums text-emerald-700">
              {stats.avgScore}%
            </span>
            <span className="text-xs font-medium text-emerald-800">
              {stats.avgScore >= 85
                ? 'Chính xác cao'
                : stats.avgScore >= 60
                ? 'Khá tốt'
                : 'Đang luyện tập'}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-stone-200 bg-white p-4 flex flex-col justify-between">
          <div className="text-xs text-stone-500">Kiểm tra nhanh toàn bài</div>
          <button
            onClick={handleCheckAllInLesson}
            className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber-700 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-800 transition-colors"
          >
            <CheckCheck className="h-4 w-4" />
            Kiểm tra tất cả câu đã nhập
          </button>
        </div>
      </div>

      {/* Lesson Selector & Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 rounded-xl border border-stone-200 bg-white p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
          <label
            htmlFor="lesson-select"
            className="text-xs font-semibold text-stone-700 whitespace-nowrap shrink-0"
          >
            Chọn Bài học:
          </label>
          <select
            id="lesson-select"
            value={selectedLessonId}
            onChange={(e) => onSelectLessonId(e.target.value)}
            className="w-full sm:w-auto rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-xs sm:text-sm font-medium text-stone-900 focus:border-amber-700 focus:bg-white focus:outline-hidden"
          >
            {lessonsExercises.map((les) => (
              <option key={les.lesson_id} value={les.lesson_id}>
                {formatLessonTitleViFirst(les.lesson_title)} (
                {les.exercises.length} câu)
              </option>
            ))}
          </select>
        </div>

        {/* Interactive Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1 rounded-lg bg-stone-100 p-1">
          {[
            { id: 'all', label: 'Tất cả dạng bài' },
            { id: 'luyen_dich_hoi_thoai', label: 'II. Hội thoại (会话)' },
            { id: 'luyen_tap_mau_cau', label: 'II. Mẫu câu (句子)' },
            { id: 'luyen_tap_doan_van', label: 'III. Bài đọc (课文/练习)' },
            { id: 'dich_viet_trung', label: 'III/IV. Dịch câu (翻译)' },
            { id: 'dat_cau', label: 'III/IV. Đặt câu (造句)' },
            { id: 'luyen_tap_ngu_phap', label: 'Ngữ pháp (语法)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                filterType === tab.id
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise Cards List */}
      <div className="space-y-4">
        {filteredExercises.map((ex, idx) => {
          const attempt = attempts[ex.exercise_id];
          const userAnswer = attempt?.userAnswer || '';
          const checkRes = attempt?.aiResult;
          const isRevealed = !!revealedIds[ex.exercise_id];
          const showHelper = activeHelperId === ex.exercise_id;
          const errMsg = errorMsgByEx[ex.exercise_id];
          const isViTranslationType =
            ex.exercise_type === 'luyen_tap_doan_van' ||
            ex.exercise_type === 'luyen_dich_hoi_thoai' ||
            ex.exercise_type === 'luyen_tap_mau_cau';

          return (
            <div
              key={ex.exercise_id}
              className="rounded-xl border border-stone-200 bg-white p-4 sm:p-5 transition-colors"
            >
              {/* Header row */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
                  <span className="font-mono font-semibold text-stone-900 tabular-nums">
                    Câu {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{ex.category}</span>
                  {ex.grammar_point && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="font-medium text-amber-800">
                        {ex.grammar_point}
                      </span>
                    </>
                  )}
                </div>

                {/* Accuracy Badge */}
                {checkRes && (
                  <div className="flex items-center gap-2">
                    {checkRes.status === 'correct' && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                        <CheckCircle2 className="h-4 w-4" />
                        Chính xác ({checkRes.score}%)
                      </span>
                    )}
                    {checkRes.status === 'partial' && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700">
                        <AlertTriangle className="h-4 w-4" />
                        Gần đúng ({checkRes.score}%)
                      </span>
                    )}
                    {checkRes.status === 'needs_work' && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700">
                        <XCircle className="h-4 w-4" />
                        Độ chính xác: {checkRes.score}%
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Exercise Prompt Content */}
              <div className="mt-3.5 space-y-2.5">
                {ex.target_word && (
                  <div className="flex flex-wrap items-center gap-2.5 rounded-lg bg-amber-50/70 border border-amber-200/70 px-3.5 py-2.5">
                    <span className="text-xs font-medium text-stone-600">
                      Từ cho trước:
                    </span>
                    <button
                      onClick={() => onWordClick(ex.target_word!)}
                      className="font-['Noto_Sans_SC'] text-lg font-bold text-amber-900 hover:underline"
                    >
                      {ex.target_word}
                    </button>
                    {ex.target_word_pinyin && (
                      <span className="font-mono text-xs font-semibold text-amber-800">
                        ({ex.target_word_pinyin})
                      </span>
                    )}
                    {ex.target_word_meaning && (
                      <span className="text-xs text-stone-700">
                        — {ex.target_word_meaning}
                      </span>
                    )}
                    <button
                      onClick={() => onSpeak(ex.target_word!, false)}
                      className="ml-auto inline-flex items-center gap-1 rounded-md bg-white px-2.5 py-1 text-xs font-medium text-stone-700 border border-stone-200 hover:text-amber-800"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                      Nghe từ
                    </button>
                  </div>
                )}

                {ex.dialogue_content && ex.dialogue_content.length > 0 && (
                  <div className="rounded-lg bg-stone-50 border border-stone-200/80 p-3.5 space-y-2">
                    <div className="flex items-center justify-between gap-2 pb-1 border-b border-stone-200/70">
                      <span className="text-xs font-bold text-amber-900">
                        {ex.section_title || ex.title || 'Nội dung Hội thoại:'}
                      </span>
                      {ex.source_hanzi && (
                        <button
                          onClick={() => onSpeak(ex.source_hanzi!, false)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-amber-700 px-2.5 py-1 text-xs font-semibold text-white hover:bg-amber-800 shrink-0"
                        >
                          <Volume2 className="h-3.5 w-3.5" />
                          Nghe toàn hội thoại
                        </button>
                      )}
                    </div>
                    <div className="space-y-2">
                      {ex.dialogue_content.map((line, lIdx) => (
                        <div
                          key={lIdx}
                          className="flex items-start justify-between gap-2.5 rounded-lg bg-white border border-stone-200/70 p-2.5"
                        >
                          <div className="space-y-0.5 flex-1 min-w-0">
                            <p className="font-['Noto_Sans_SC'] text-sm sm:text-base font-bold text-stone-900 leading-relaxed">
                              {line.speaker && line.speaker !== 'Hội thoại' ? (
                                <span className="text-amber-900 mr-1.5">
                                  {line.speaker}：
                                </span>
                              ) : null}
                              {renderSegmentedChinese(line.hanzi)}
                            </p>
                            {line.pinyin && (
                              <p className="font-mono text-xs text-amber-800">
                                {line.pinyin}
                              </p>
                            )}
                            {(isRevealed || checkRes) && line.vietnamese && (
                              <p className="text-xs font-medium text-emerald-800 pt-0.5">
                                → {line.vietnamese}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => onSpeak(line.hanzi, false)}
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-stone-200 bg-stone-50 text-stone-700 hover:bg-amber-50 hover:text-amber-800"
                            title="Nghe câu thoại này"
                          >
                            <Volume2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {ex.sentence_list && ex.sentence_list.length > 0 && (
                  <div className="rounded-lg bg-stone-50 border border-stone-200/80 p-3.5 space-y-2">
                    <div className="flex items-center justify-between gap-2 pb-1 border-b border-stone-200/70">
                      <span className="text-xs font-bold text-amber-900">
                        {ex.section_title || ex.title || 'Danh sách Mẫu câu:'}
                      </span>
                      {ex.source_hanzi && (
                        <button
                          onClick={() => onSpeak(ex.source_hanzi!, false)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-amber-700 px-2.5 py-1 text-xs font-semibold text-white hover:bg-amber-800 shrink-0"
                        >
                          <Volume2 className="h-3.5 w-3.5" />
                          Nghe toàn bộ mẫu câu
                        </button>
                      )}
                    </div>
                    <div className="space-y-2">
                      {ex.sentence_list.map((sent, sIdx) => (
                        <div
                          key={sIdx}
                          className="flex items-start justify-between gap-2.5 rounded-lg bg-white border border-stone-200/70 p-2.5"
                        >
                          <div className="space-y-0.5 flex-1 min-w-0">
                            <p className="font-['Noto_Sans_SC'] text-sm sm:text-base font-bold text-stone-900 leading-relaxed">
                              <span className="font-mono text-xs text-stone-500 mr-1.5">
                                {sent.id || sIdx + 1}.
                              </span>
                              {renderSegmentedChinese(sent.hanzi)}
                            </p>
                            {sent.pinyin && (
                              <p className="font-mono text-xs text-amber-800">
                                {sent.pinyin}
                              </p>
                            )}
                            {(isRevealed || checkRes) && sent.vietnamese && (
                              <p className="text-xs font-medium text-emerald-800 pt-0.5">
                                → {sent.vietnamese}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => onSpeak(sent.hanzi, false)}
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-stone-200 bg-stone-50 text-stone-700 hover:bg-amber-50 hover:text-amber-800"
                            title="Nghe mẫu câu này"
                          >
                            <Volume2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {ex.source_hanzi &&
                  (!ex.dialogue_content || ex.dialogue_content.length === 0) &&
                  (!ex.sentence_list || ex.sentence_list.length === 0) && (
                    <div className="rounded-lg bg-stone-50 border border-stone-200/80 p-3.5 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-amber-900">
                          {ex.title || 'Đoạn văn tiếng Trung:'}
                        </span>
                        <button
                          onClick={() => onSpeak(ex.source_hanzi!, false)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-amber-700 px-3 py-1 text-xs font-semibold text-white hover:bg-amber-800 shrink-0"
                        >
                          <Volume2 className="h-3.5 w-3.5" />
                          {ex.exercise_type === 'luyen_dich_hoi_thoai' ||
                          ex.exercise_type === 'luyen_tap_mau_cau'
                            ? 'Nghe câu này'
                            : 'Nghe đoạn văn'}
                        </button>
                      </div>
                      <div className="font-['Noto_Sans_SC'] text-base sm:text-lg leading-relaxed font-bold text-stone-900">
                        {ex.exercise_type === 'luyen_dich_hoi_thoai' ||
                        ex.exercise_type === 'luyen_tap_mau_cau' ? (
                          <>
                            <span className="mr-1.5 text-stone-400">-</span>
                            {renderSegmentedChinese(ex.source_hanzi)}
                          </>
                        ) : (
                          renderSegmentedChinese(ex.source_hanzi)
                        )}
                      </div>
                      {ex.source_pinyin && (
                        <p className="font-mono text-xs leading-relaxed text-amber-800">
                          {ex.exercise_type === 'luyen_dich_hoi_thoai' ||
                          ex.exercise_type === 'luyen_tap_mau_cau'
                            ? `- ${ex.source_pinyin}`
                            : ex.source_pinyin}
                        </p>
                      )}
                    </div>
                  )}

                {ex.prompt_vietnamese && (
                  <p className="text-sm sm:text-base font-semibold text-stone-900">
                    {ex.prompt_vietnamese}
                  </p>
                )}

                {ex.requirement && (
                  <p className="text-xs text-stone-500">
                    ☞ {ex.requirement}
                  </p>
                )}
              </div>

              {/* Answer Input Area */}
              <div className="mt-4 space-y-2.5">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) =>
                      onSaveAttempt(ex.exercise_id, e.target.value, checkRes)
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleCheckAnswer(ex);
                      }
                    }}
                    placeholder={
                      isViTranslationType
                        ? 'Nhập bản dịch tiếng Việt...'
                        : 'Nhập câu trả lời bằng chữ Hán hoặc Pinyin...'
                    }
                    className="flex-1 rounded-lg border border-stone-300 bg-stone-50/70 px-3.5 py-2.5 font-['Noto_Sans_SC'] text-sm text-stone-900 placeholder:font-sans placeholder:text-stone-400 focus:border-amber-700 focus:bg-white focus:outline-hidden"
                  />

                  <div className="flex items-center gap-2 shrink-0">
                    {!isViTranslationType && (
                      <button
                        onClick={() =>
                          setActiveHelperId(showHelper ? null : ex.exercise_id)
                        }
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                          showHelper
                            ? 'border-amber-500 bg-amber-50 text-amber-900'
                            : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-50'
                        }`}
                        title="Mở bảng chọn nhanh chữ Hán"
                      >
                        <Keyboard className="h-4 w-4" />
                        Bảng chữ Hán
                      </button>
                    )}

                    <button
                      onClick={() => handleCheckAnswer(ex)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-stone-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-stone-800 transition-colors whitespace-nowrap shrink-0"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      Kiểm tra đáp án
                    </button>
                  </div>
                </div>

                {/* Quick Chinese Character Picker (Sorted so it doesn't leak sentence order) */}
                {showHelper && !isViTranslationType && (
                  <div className="rounded-lg border border-stone-200 bg-stone-50 p-3">
                    <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                      <span>
                        Chọn chữ Hán để ghép thành câu trả lời:
                      </span>
                      <button
                        onClick={() =>
                          onSaveAttempt(ex.exercise_id, '', undefined)
                        }
                        className="inline-flex items-center gap-1 text-xs text-stone-600 hover:text-rose-700"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Xóa ô nhập
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {getWordChipsForExercise(ex).map((chip, cIdx) => (
                        <button
                          key={cIdx}
                          onClick={() =>
                            appendTokenToAnswer(ex.exercise_id, chip.hanzi)
                          }
                          className="rounded-md border border-stone-200 bg-white px-3 py-1.5 font-['Noto_Sans_SC'] text-sm font-semibold text-stone-900 hover:border-amber-500 hover:bg-amber-50 transition-colors"
                        >
                          {chip.hanzi}
                        </button>
                      ))}
                      {['，', '。', '？', '！'].map((punct) => (
                        <button
                          key={punct}
                          onClick={() =>
                            appendTokenToAnswer(ex.exercise_id, punct)
                          }
                          className="rounded-md border border-stone-200 bg-stone-100 px-2.5 py-1.5 text-xs font-bold text-stone-700 hover:bg-stone-200"
                        >
                          {punct}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {errMsg && (
                  <p className="text-xs font-medium text-rose-700">{errMsg}</p>
                )}

                {/* Action Row: Reveal Reference Answer */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <button
                    onClick={() =>
                      setRevealedIds((prev) => ({
                        ...prev,
                        [ex.exercise_id]: !prev[ex.exercise_id],
                      }))
                    }
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-stone-900"
                  >
                    {isRevealed ? (
                      <>
                        <EyeOff className="h-3.5 w-3.5" />
                        Ẩn đáp án chuẩn
                      </>
                    ) : (
                      <>
                        <Eye className="h-3.5 w-3.5" />
                        Xem đáp án chuẩn giáo trình
                      </>
                    )}
                  </button>

                  {(isRevealed || checkRes) && (
                    <button
                      onClick={() =>
                        onSpeak(
                          isViTranslationType && ex.source_hanzi
                            ? ex.source_hanzi
                            : ex.answer_hanzi,
                          false
                        )
                      }
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-800 hover:text-amber-950"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                      Nghe phát âm tiếng Trung
                    </button>
                  )}
                </div>
              </div>

              {/* Result / Revealed Textbook Reference Answer */}
              {(checkRes || isRevealed) && (
                <div className="mt-3.5 rounded-xl border border-stone-200 bg-[#FAF8F3] p-4 space-y-2.5">
                  {checkRes && (
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200/80 pb-2">
                      <span
                        className={`text-xs font-bold ${
                          checkRes.status === 'correct'
                            ? 'text-emerald-800'
                            : checkRes.status === 'partial'
                            ? 'text-amber-800'
                            : 'text-rose-800'
                        }`}
                      >
                        {checkRes.summaryHeadline}
                      </span>
                      <span className="font-mono text-xs font-bold tabular-nums text-stone-700">
                        Độ chính xác: {checkRes.score}%
                      </span>
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-3 rounded-lg border border-stone-200/90 bg-white p-3">
                    <div className="space-y-0.5">
                      <div className="text-[11px] font-medium text-stone-500">
                        Đáp án chuẩn trong Giáo trình:
                      </div>
                      <p className="font-['Noto_Sans_SC'] text-sm sm:text-base font-bold text-stone-900 whitespace-pre-line">
                        {ex.answer_hanzi}
                      </p>
                      {ex.answer_pinyin && (
                        <p className="font-mono text-xs font-medium text-amber-800">
                          {ex.answer_pinyin}
                        </p>
                      )}
                      {ex.sample_sentence_vietnamese &&
                        ex.sample_sentence_vietnamese !== ex.answer_hanzi && (
                          <p className="text-xs text-stone-700 pt-1 whitespace-pre-line">
                            Nghĩa: {ex.sample_sentence_vietnamese}
                          </p>
                        )}
                    </div>
                    <button
                      onClick={() =>
                        onSpeak(
                          isViTranslationType && ex.source_hanzi
                            ? ex.source_hanzi
                            : ex.answer_hanzi,
                          false
                        )
                      }
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-700 text-white hover:bg-amber-800"
                      title="Nghe phát âm chuẩn"
                    >
                      <Volume2 className="h-4 w-4" />
                    </button>
                  </div>

                  {checkRes?.detailedFeedbackVi && (
                    <p className="text-xs leading-relaxed text-stone-700">
                      {checkRes.detailedFeedbackVi}
                    </p>
                  )}

                  {ex.vocab_grammar_notes && (
                    <div className="flex items-start gap-1.5 text-xs text-stone-600 pt-1">
                      <BookOpen className="h-3.5 w-3.5 text-amber-700 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-stone-800">Ghi chú:</strong>{' '}
                        {ex.vocab_grammar_notes}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
