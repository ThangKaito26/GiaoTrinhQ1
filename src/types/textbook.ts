export interface VocabItem {
  index: number;
  hanzi: string;
  pinyin: string;
  meaning_vi: string;
  type: 'từ mới' | 'danh từ riêng' | string;
  page: number;
  lessonId?: string;
  lessonTitle?: string;
}

export interface TextbookSectionRaw {
  id: string;
  type: string;
  title_raw: string;
  title_cn: string;
  title_pinyin: string;
  title_vi: string;
  page_start: number;
  page_end: number;
  vocab_count: number;
  vocabulary: VocabItem[];
}

export interface TextbookDataRaw {
  book_title: string;
  book_id: string;
  source_file: string;
  total_sections: number;
  total_vocab: number;
  sections: TextbookSectionRaw[];
}

export interface ExerciseItem {
  exercise_id: string;
  exercise_type: 'dich_viet_trung' | 'dat_cau' | 'luyen_tap_ngu_phap' | 'luyen_tap_doan_van' | 'luyen_tap_viet_van' | string;
  category: string;
  prompt_vietnamese?: string;
  target_word?: string;
  target_word_pinyin?: string;
  target_word_meaning?: string;
  requirement?: string;
  sample_sentence_vietnamese?: string;
  source_hanzi?: string;
  source_pinyin?: string;
  title?: string;
  grammar_point?: string;
  answer_hanzi: string;
  answer_pinyin: string;
  vocab_grammar_notes: string;
}

export interface LessonExercisesRaw {
  lesson_id: string;
  lesson_num: number;
  lesson_title: string;
  exercises: ExerciseItem[];
}

export interface ExercisesDataRaw {
  book_id: string;
  book_title: string;
  total_lessons: number;
  total_exercises: number;
  lessons: LessonExercisesRaw[];
}

export interface DialogueLine {
  id: string;
  speaker?: string;
  hanzi: string;
  pinyin: string;
  meaningVi: string;
  page: number;
}

export interface DialogueSection {
  id: string;
  titleCn: string;
  titlePinyin: string;
  titleVi: string;
  pageStart: number;
  pageEnd: number;
  isReadingPassage?: boolean;
  lines: DialogueLine[];
}

export interface GrammarCallout {
  id: string;
  title: string;
  formula: string;
  explanation: string;
  examples: {
    hanzi: string;
    pinyin: string;
    meaningVi: string;
  }[];
  page: number;
}

export interface LessonSupplementaryContent {
  sectionId: string;
  lessonExerciseId: string;
  lessonNumberLabel: string;
  themeColor: string;
  topicTag: string;
  dialogues: DialogueSection[];
  grammarCallouts: GrammarCallout[];
}

export interface BookmarkedWord {
  key: string; // hanzi
  hanzi: string;
  pinyin: string;
  meaning_vi: string;
  lessonId: string;
  lessonTitle: string;
  page: number;
  tag: 'quan_trong' | 'can_on' | 'hay_nham' | 'da_thuoc';
  personalNote: string;
  createdAt: number;
}

export interface AIResult {
  score: number;
  status: 'correct' | 'partial' | 'needs_work';
  summaryHeadline: string;
  correctedHanzi: string;
  correctedPinyin: string;
  detailedFeedbackVi: string;
  grammarPoints: string[];
  alternativeExpressions: {
    hanzi: string;
    pinyin: string;
    noteVi: string;
  }[];
}

export interface SavedExerciseAttempt {
  exerciseId: string;
  userAnswer: string;
  aiResult?: AIResult;
  updatedAt: number;
}

export interface DictionaryAIResponse {
  hanzi: string;
  pinyin: string;
  sinoVietnamese: string;
  partOfSpeech: string;
  coreMeaningVi: string;
  contextualUsageVi: string;
  radicalAndComponents: string;
  synonymsAndRelated: {
    hanzi: string;
    pinyin: string;
    meaningVi: string;
    relationType: string;
    distinctionVi: string;
  }[];
  collocations: {
    hanzi: string;
    pinyin: string;
    meaningVi: string;
  }[];
  examples: {
    hanzi: string;
    pinyin: string;
    meaningVi: string;
    contextLabel: string;
  }[];
}
