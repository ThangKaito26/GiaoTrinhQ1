import { ExerciseItem, AIResult } from '../types/textbook';

// Common synonym groups in Giáo Trình Tiếng Trung Quyển 1
const SYNONYM_GROUPS: string[][] = [
  ['医生', '大夫'],
  ['星期天', '星期日', '礼拜天', '礼拜日', '周日'],
  ['星期一', '礼拜一', '周一'],
  ['星期二', '礼拜二', '周二'],
  ['星期三', '礼拜三', '周三'],
  ['星期四', '礼拜四', '周四'],
  ['星期五', '礼拜五', '周五'],
  ['星期六', '礼拜六', '周六'],
  ['员工', '职员', '工人'],
  ['爸爸妈妈', '爸妈'],
  ['工业区', '工业园'],
  ['早上好', '你早', '早'],
  ['这儿', '这里'],
  ['那儿', '那里'],
  ['哪儿', '哪里'],
  ['前边', '前面'],
  ['后边', '后面'],
  ['里边', '里面', '里'],
  ['外边', '外面', '外'],
  ['外套', '外衣'],
  ['旅游', '旅行'],
  ['越南盾', '越盾'],
  ['取钱', '取款'],
  ['忘记', '忘'],
  ['记得', '记'],
  ['拐', '转'],
  ['常常', '常'],
  ['去年', '上年'],
  ['汉语', '中文'],
  ['一点儿', '一点'],
  ['一下儿', '一下'],
  ['玩儿', '玩'],
  ['散步', '走走'],
];

function stripPunctuation(str: string): string {
  return str
    .replace(/[，。！？、：；“”‘’（）().,!?:;\s\-—…'"/]/g, '')
    .trim();
}

function removeDiacritics(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function normalizeChineseCanonical(str: string): string {
  let s = stripPunctuation(str);
  for (const group of SYNONYM_GROUPS) {
    const canonical = group[0];
    for (let i = 1; i < group.length; i++) {
      s = s.split(group[i]).join(canonical);
    }
  }
  return s;
}

/**
 * Compute character/token overlap similarity (0..100)
 */
function calculateSimilarity(a: string, b: string): number {
  if (!a || !b) return 0;
  if (a === b) return 100;

  // Also check without optional '的'
  const aNoDe = a.replace(/的/g, '');
  const bNoDe = b.replace(/的/g, '');
  if (aNoDe === bNoDe && aNoDe.length > 0) return 96;

  // Bigram / character Dice coefficient + LCS ratio
  const aChars = Array.from(a);
  const bChars = Array.from(b);

  // LCS length
  const m = aChars.length;
  const n = bChars.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0)
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (aChars[i - 1] === bChars[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  const lcs = dp[m][n];
  const score = Math.round(((2 * lcs) / (m + n)) * 100);
  return Math.max(0, Math.min(100, score));
}

export function evaluateExerciseAnswerLocal(
  ex: ExerciseItem,
  rawUserAnswer: string
): AIResult {
  const userTrimmed = rawUserAnswer.trim();
  const hasChineseChars = /[\u4e00-\u9fa5]/.test(userTrimmed);

  // Handle multi-option reference answers separated by '/' or '（='
  const refCandidatesHanzi = ex.answer_hanzi
    .replace(/（=/g, '/')
    .replace(/\(=/g, '/')
    .replace(/）/g, '')
    .replace(/\)/g, '')
    .split('/')
    .map((s) => s.trim())
    .filter(Boolean);

  const refCandidatesPinyin = ex.answer_pinyin
    .replace(/\(=/g, '/')
    .replace(/\)/g, '')
    .split('/')
    .map((s) => s.trim())
    .filter(Boolean);

  // 1. Reading comprehension / Paragraph translation (Trung -> Việt)
  if (ex.exercise_type === 'luyen_tap_doan_van' && ex.sample_sentence_vietnamese) {
    if (hasChineseChars) {
      const sim = calculateSimilarity(
        normalizeChineseCanonical(userTrimmed),
        normalizeChineseCanonical(ex.answer_hanzi)
      );
      return {
        score: sim,
        status: sim >= 85 ? 'correct' : sim >= 55 ? 'partial' : 'needs_work',
        summaryHeadline:
          sim >= 85
            ? `Độ chính xác: ${sim}% — Chính xác!`
            : `Độ chính xác: ${sim}% — Hãy đối chiếu bản dịch tiếng Việt`,
        correctedHanzi: ex.answer_hanzi,
        correctedPinyin: ex.answer_pinyin,
        detailedFeedbackVi: `Bản dịch chuẩn: "${ex.sample_sentence_vietnamese}"`,
        grammarPoints: ex.vocab_grammar_notes ? [ex.vocab_grammar_notes] : [],
        alternativeExpressions: [],
      };
    }

    const userWords = removeDiacritics(stripPunctuation(userTrimmed))
      .split(/\s+/)
      .filter(Boolean);
    const refWords = removeDiacritics(
      stripPunctuation(ex.sample_sentence_vietnamese)
    )
      .split(/\s+/)
      .filter(Boolean);

    const matchedCount = userWords.filter((w) => refWords.includes(w)).length;
    const ratio =
      refWords.length > 0
        ? Math.min(
            100,
            Math.round(
              (matchedCount / Math.min(refWords.length, Math.max(userWords.length, 5))) *
                100
            )
          )
        : 0;

    return {
      score: ratio,
      status: ratio >= 80 ? 'correct' : ratio >= 50 ? 'partial' : 'needs_work',
      summaryHeadline:
        ratio >= 80
          ? `Độ chính xác: ${ratio}% — Dịch rất sát nghĩa!`
          : ratio >= 50
          ? `Độ chính xác: ${ratio}% — Đúng ý chính, xem thêm bản dịch chuẩn`
          : `Độ chính xác: ${ratio}% — Cần bổ sung đầy đủ ý trong đoạn văn`,
      correctedHanzi: ex.answer_hanzi,
      correctedPinyin: ex.answer_pinyin,
      detailedFeedbackVi: `Bản dịch chuẩn: ${ex.sample_sentence_vietnamese}`,
      grammarPoints: ex.vocab_grammar_notes ? [ex.vocab_grammar_notes] : [],
      alternativeExpressions: [],
    };
  }

  // 2. Sentence Building (IV. 造句 - Đặt câu với từ cho trước)
  if (ex.exercise_type === 'dat_cau' && ex.target_word) {
    const cleanTarget = stripPunctuation(ex.target_word);
    const cleanTargetPinyin = removeDiacritics(
      stripPunctuation(ex.target_word_pinyin || '')
    );

    if (hasChineseChars) {
      const cleanUser = stripPunctuation(userTrimmed);
      const containsTarget = cleanUser.includes(cleanTarget);
      const exactRefSim = calculateSimilarity(
        normalizeChineseCanonical(userTrimmed),
        normalizeChineseCanonical(ex.answer_hanzi)
      );

      if (exactRefSim >= 85) {
        return {
          score: exactRefSim,
          status: 'correct',
          summaryHeadline: `Độ chính xác: ${exactRefSim}% — Câu đặt hoàn toàn chuẩn xác!`,
          correctedHanzi: ex.answer_hanzi,
          correctedPinyin: ex.answer_pinyin,
          detailedFeedbackVi: `Câu của bạn trùng khớp với mẫu chuẩn trong giáo trình. Nghĩa: "${ex.sample_sentence_vietnamese || ''}"`,
          grammarPoints: ex.vocab_grammar_notes ? [ex.vocab_grammar_notes] : [],
          alternativeExpressions: [],
        };
      }

      if (!containsTarget) {
        return {
          score: 30,
          status: 'needs_work',
          summaryHeadline: `Độ chính xác: 30% — Câu chưa có từ bắt buộc “${ex.target_word}”`,
          correctedHanzi: ex.answer_hanzi,
          correctedPinyin: ex.answer_pinyin,
          detailedFeedbackVi: `Đề bài yêu cầu đặt câu có chứa từ “${ex.target_word}” (${ex.target_word_pinyin} - ${ex.target_word_meaning}).`,
          grammarPoints: ex.vocab_grammar_notes ? [ex.vocab_grammar_notes] : [],
          alternativeExpressions: [],
        };
      }

      // Check length requirement (at least 8-10 characters for a full meaningful sentence)
      const charCount = cleanUser.length;
      const lenScore =
        charCount >= 10 ? 95 : charCount >= 7 ? 82 : Math.max(50, charCount * 9);

      return {
        score: lenScore,
        status: lenScore >= 85 ? 'correct' : 'partial',
        summaryHeadline:
          lenScore >= 85
            ? `Độ chính xác: ${lenScore}% — Đã dùng đúng từ “${ex.target_word}” và đủ độ dài câu (${charCount} chữ)!`
            : `Độ chính xác: ${lenScore}% — Đã có từ “${ex.target_word}” (${charCount} chữ, giáo trình yêu cầu câu dài ít nhất 10 từ)`,
        correctedHanzi: ex.answer_hanzi,
        correctedPinyin: ex.answer_pinyin,
        detailedFeedbackVi: `Câu mẫu tham khảo: ${ex.answer_hanzi} (${ex.sample_sentence_vietnamese || ''})`,
        grammarPoints: ex.vocab_grammar_notes ? [ex.vocab_grammar_notes] : [],
        alternativeExpressions: [],
      };
    } else {
      // User typed in Pinyin
      const userPinyinNorm = removeDiacritics(stripPunctuation(userTrimmed));
      const refPinyinNorm = removeDiacritics(stripPunctuation(ex.answer_pinyin));
      const sim = calculateSimilarity(userPinyinNorm, refPinyinNorm);
      const hasTargetPy =
        cleanTargetPinyin && userPinyinNorm.includes(cleanTargetPinyin);
      const finalScore = hasTargetPy ? Math.max(sim, 75) : sim;

      return {
        score: finalScore,
        status:
          finalScore >= 85
            ? 'correct'
            : finalScore >= 55
            ? 'partial'
            : 'needs_work',
        summaryHeadline: `Độ chính xác Pinyin: ${finalScore}%`,
        correctedHanzi: ex.answer_hanzi,
        correctedPinyin: ex.answer_pinyin,
        detailedFeedbackVi: `Bạn đang nhập bằng Pinyin. Hãy đối chiếu chữ Hán chuẩn: ${ex.answer_hanzi}`,
        grammarPoints: ex.vocab_grammar_notes ? [ex.vocab_grammar_notes] : [],
        alternativeExpressions: [],
      };
    }
  }

  // 3. Standard Translation (Dịch Việt sang Trung) & Grammar Practice
  if (hasChineseChars) {
    const userCanon = normalizeChineseCanonical(userTrimmed);
    let bestScore = 0;
    for (const candidate of refCandidatesHanzi) {
      const candCanon = normalizeChineseCanonical(candidate);
      const s = calculateSimilarity(userCanon, candCanon);
      if (s > bestScore) bestScore = s;
    }

    // Character diff breakdown for helpful feedback
    const primaryRef = stripPunctuation(refCandidatesHanzi[0] || ex.answer_hanzi);
    const cleanUser = stripPunctuation(userTrimmed);
    const missingChars = Array.from(primaryRef).filter(
      (ch) => !cleanUser.includes(ch)
    );

    let feedbackVi = 'Câu trả lời của bạn hoàn toàn chính xác so với đáp án giáo trình!';
    if (bestScore < 100 && bestScore >= 85) {
      feedbackVi =
        'Câu trả lời của bạn rất sát đáp án chuẩn (chỉ khác biệt nhỏ về trợ từ hoặc từ đồng nghĩa).';
    } else if (bestScore < 85) {
      feedbackVi =
        missingChars.length > 0
          ? `Cần chú ý các chữ Hán trong đáp án chuẩn: ${Array.from(new Set(missingChars)).join(', ')}. Hãy kiểm tra lại trật tự từ và cấu trúc câu.`
          : 'Hãy kiểm tra lại trật tự các thành phần trong câu (Thời gian / Chủ ngữ + Địa điểm + Động từ).';
    }

    return {
      score: bestScore,
      status:
        bestScore >= 85
          ? 'correct'
          : bestScore >= 55
          ? 'partial'
          : 'needs_work',
      summaryHeadline:
        bestScore >= 85
          ? `Độ chính xác: ${bestScore}% — Chính xác!`
          : bestScore >= 55
          ? `Độ chính xác: ${bestScore}% — Gần đúng, cần chỉnh nhẹ`
          : `Độ chính xác: ${bestScore}% — Chưa chính xác, hãy xem đáp án chuẩn`,
      correctedHanzi: ex.answer_hanzi,
      correctedPinyin: ex.answer_pinyin,
      detailedFeedbackVi: feedbackVi,
      grammarPoints: ex.vocab_grammar_notes ? [ex.vocab_grammar_notes] : [],
      alternativeExpressions: [],
    };
  } else {
    // Compare Pinyin input
    const userPyTone = stripPunctuation(userTrimmed).toLowerCase();
    const userPyPlain = removeDiacritics(userPyTone);

    let bestScore = 0;
    for (const candPy of refCandidatesPinyin) {
      const candTone = stripPunctuation(candPy).toLowerCase();
      const candPlain = removeDiacritics(candTone);
      const toneSim = calculateSimilarity(userPyTone, candTone);
      const plainSim = calculateSimilarity(userPyPlain, candPlain);
      const combined = Math.round(toneSim * 0.4 + plainSim * 0.6);
      if (combined > bestScore) bestScore = combined;
    }

    return {
      score: bestScore,
      status:
        bestScore >= 85
          ? 'correct'
          : bestScore >= 55
          ? 'partial'
          : 'needs_work',
      summaryHeadline:
        bestScore >= 85
          ? `Độ chính xác (Pinyin): ${bestScore}% — Chính xác!`
          : bestScore >= 55
          ? `Độ chính xác (Pinyin): ${bestScore}% — Gần đúng`
          : `Độ chính xác: ${bestScore}% — Hãy đối chiếu đáp án chuẩn`,
      correctedHanzi: ex.answer_hanzi,
      correctedPinyin: ex.answer_pinyin,
      detailedFeedbackVi: `Bạn đã nhập bằng Pinyin. Chữ Hán chuẩn trong giáo trình là: ${ex.answer_hanzi}`,
      grammarPoints: ex.vocab_grammar_notes ? [ex.vocab_grammar_notes] : [],
      alternativeExpressions: [],
    };
  }
}

/**
 * Evaluate Vietnamese translation typed on dialogue dotted lines
 */
export function evaluateDialogueVietnameseTranslation(
  userVi: string,
  referenceVi: string
): { score: number; isCorrect: boolean } {
  const u = removeDiacritics(stripPunctuation(userVi));
  const r = removeDiacritics(stripPunctuation(referenceVi));
  if (!u) return { score: 0, isCorrect: false };
  if (u === r) return { score: 100, isCorrect: true };

  // Normalize common Vietnamese pronoun synonyms
  const normPronouns = (s: string) =>
    s
      .replace(/\b(ban|anh|chi|em|cau|minh|to)\b/g, 'ban')
      .replace(/\b(ba|bo)\b/g, 'bo')
      .replace(/\b(ma|me)\b/g, 'me')
      .replace(/\b(khoe|tot)\b/g, 'khoe');

  const sim = calculateSimilarity(normPronouns(u), normPronouns(r));
  return {
    score: sim,
    isCorrect: sim >= 70,
  };
}
