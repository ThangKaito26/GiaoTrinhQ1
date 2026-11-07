import {
  LessonSupplementaryContent,
  ExerciseItem,
  ExercisesDataRaw,
  DialogueSection,
  DialogueLine,
  TextbookDataRaw,
  TextbookSectionRaw,
  VocabItem,
} from '../types/textbook';

/**
 * Exact page numbers in Quyển 2 (119 pages) and Quyển 3 (159 pages) for each exercise
 */
export const BOOK2_AND_3_EXERCISE_PAGE_MAP: Record<string, number> = {
  // ================= QUYỂN 2 =================
  // Bài 13 (II. 会话 tr.3-6, III. 课文 tr.8-9, IV. 造句 tr.9-10)
  q2_b13_ex01: 3,
  q2_b13_ex02: 5,
  q2_b13_ex03: 8,
  q2_b13_ex04: 9,
  q2_b13_ex05: 9,
  q2_b13_ex06: 9,
  q2_b13_ex07: 9,
  q2_b13_ex08: 10,
  q2_b13_ex09: 10,
  q2_b13_ex10: 10,
  q2_b13_ex11: 10,
  q2_b13_ex12: 10,
  q2_b13_ex13: 10,
  q2_b13_ex14: 10,

  // Bài Ngữ Pháp 2 (Trang 10 - 18)
  q2_np2_ex01: 12,
  q2_np2_ex02: 13,
  q2_np2_ex03: 13,
  q2_np2_ex04: 14,
  q2_np2_ex05: 14,
  q2_np2_ex06: 14,
  q2_np2_ex07: 14,
  q2_np2_ex08: 14,
  q2_np2_ex09: 15,
  q2_np2_ex10: 15,
  q2_np2_ex11: 15,
  q2_np2_ex12: 15,
  q2_np2_ex13: 16,
  q2_np2_ex14: 17,
  q2_np2_ex15: 18,

  // Bài 14 (II. 会话 tr.23-25, III. 课文 tr.27-28, IV. 造句 tr.29)
  q2_b14_ex01: 23,
  q2_b14_ex02: 24,
  q2_b14_ex03: 27,
  q2_b14_ex04: 28,
  q2_b14_ex05: 29,
  q2_b14_ex06: 29,
  q2_b14_ex07: 29,
  q2_b14_ex08: 29,
  q2_b14_ex09: 29,
  q2_b14_ex10: 29,
  q2_b14_ex11: 29,
  q2_b14_ex12: 29,
  q2_b14_ex13: 29,

  // Bài 15 (II. 会话 tr.32-36, III. 课文 tr.37-38, IV. 造句 tr.39)
  q2_b15_ex01: 32,
  q2_b15_ex02: 34,
  q2_b15_ex03: 37,
  q2_b15_ex04: 39,
  q2_b15_ex05: 39,
  q2_b15_ex06: 39,
  q2_b15_ex07: 39,
  q2_b15_ex08: 39,
  q2_b15_ex09: 39,
  q2_b15_ex10: 39,
  q2_b15_ex11: 39,
  q2_b15_ex12: 39,
  q2_b15_ex13: 39,

  // Bài 16 (II. 会话 tr.42-44, III. 课文 tr.45-46, IV. 造句 tr.47)
  q2_b16_ex01: 42,
  q2_b16_ex02: 44,
  q2_b16_ex03: 45,
  q2_b16_ex04: 46,
  q2_b16_ex05: 47,
  q2_b16_ex06: 47,
  q2_b16_ex07: 47,
  q2_b16_ex08: 47,
  q2_b16_ex09: 47,
  q2_b16_ex10: 47,
  q2_b16_ex11: 47,
  q2_b16_ex12: 47,
  q2_b16_ex13: 47,
  q2_b16_ex14: 47,

  // Bài 17 (II. 会话 tr.50-54, III. 课文 tr.55-56, IV. 造句 tr.57)
  q2_b17_ex01: 50,
  q2_b17_ex02: 52,
  q2_b17_ex03: 55,
  q2_b17_ex04: 57,
  q2_b17_ex05: 57,
  q2_b17_ex06: 57,
  q2_b17_ex07: 57,
  q2_b17_ex08: 57,
  q2_b17_ex09: 57,
  q2_b17_ex10: 57,
  q2_b17_ex11: 57,
  q2_b17_ex12: 57,

  // Bài Ngữ Pháp 3 (Trang 57 - 65)
  q2_np3_ex01: 58,
  q2_np3_ex02: 58,
  q2_np3_ex03: 58,
  q2_np3_ex04: 59,
  q2_np3_ex05: 59,
  q2_np3_ex06: 60,
  q2_np3_ex07: 60,
  q2_np3_ex08: 61,
  q2_np3_ex09: 61,
  q2_np3_ex10: 62,
  q2_np3_ex11: 62,
  q2_np3_ex12: 63,
  q2_np3_ex13: 64,
  q2_np3_ex14: 65,

  // Bài 18 (II. 会话 tr.67-70, III. 课文 tr.71-72, IV. 造句 tr.73)
  q2_b18_ex01: 67,
  q2_b18_ex02: 69,
  q2_b18_ex03: 71,
  q2_b18_ex04: 73,
  q2_b18_ex05: 73,
  q2_b18_ex06: 73,
  q2_b18_ex07: 73,
  q2_b18_ex08: 73,
  q2_b18_ex09: 73,

  // Bài 19 (II. 会话 tr.76-78, III. 课文 tr.79-80, IV. 造句 tr.81-82)
  q2_b19_ex01: 76,
  q2_b19_ex02: 77,
  q2_b19_ex03: 79,
  q2_b19_ex04: 81,
  q2_b19_ex05: 81,
  q2_b19_ex06: 81,
  q2_b19_ex07: 81,
  q2_b19_ex08: 82,
  q2_b19_ex09: 82,
  q2_b19_ex10: 82,
  q2_b19_ex11: 82,
  q2_b19_ex12: 82,

  // Bài 20 (II. 会话 tr.84-87, III. 课文 tr.88-89, IV. 造句 tr.89-90)
  q2_b20_ex01: 84,
  q2_b20_ex02: 85,
  q2_b20_ex03: 88,
  q2_b20_ex04: 89,
  q2_b20_ex05: 90,
  q2_b20_ex06: 90,
  q2_b20_ex07: 90,
  q2_b20_ex08: 90,
  q2_b20_ex09: 90,
  q2_b20_ex10: 90,
  q2_b20_ex11: 90,

  // Bài 21 (II. 会话 tr.92-96, III. 造句 tr.98-99)
  q2_b21_ex01: 92,
  q2_b21_ex02: 94,
  q2_b21_ex03: 98,
  q2_b21_ex04: 98,
  q2_b21_ex05: 98,
  q2_b21_ex06: 98,
  q2_b21_ex07: 98,
  q2_b21_ex08: 98,
  q2_b21_ex09: 99,
  q2_b21_ex10: 99,
  q2_b21_ex11: 99,

  // Bài 22 (II. 会话 tr.101-104, III. 课文 tr.105-107, IV. 造句 tr.108)
  q2_b22_ex01: 101,
  q2_b22_ex02: 102,
  q2_b22_ex03: 105,
  q2_b22_ex04: 108,
  q2_b22_ex05: 108,
  q2_b22_ex06: 108,
  q2_b22_ex07: 108,
  q2_b22_ex08: 108,
  q2_b22_ex09: 108,
  q2_b22_ex10: 108,

  // Bài 23 (II. 会话 tr.110-115, III. 课文 tr.116-117, IV. 造句 tr.118-119)
  q2_b23_ex01: 110,
  q2_b23_ex02: 112,
  q2_b23_ex03: 116,
  q2_b23_ex04: 118,
  q2_b23_ex05: 118,
  q2_b23_ex06: 118,
  q2_b23_ex07: 118,
  q2_b23_ex08: 118,
  q2_b23_ex09: 118,
  q2_b23_ex10: 118,
  q2_b23_ex11: 118,
  q2_b23_ex12: 118,
  q2_b23_ex13: 118,
  q2_b23_ex14: 119,
  q2_b23_ex15: 119,
  q2_b23_ex16: 119,
  q2_b23_ex17: 119,

  // ================= QUYỂN 3 =================
  // Bài 1 (II. 会话 tr.4-8, III. 翻译成越语 tr.9-10, IV. 造句 tr.10)
  q3_b01_ex01: 4,
  q3_b01_ex02: 6,
  q3_b01_ex03: 8,
  q3_b01_ex04: 9,
  q3_b01_ex05: 9,
  q3_b01_ex06: 9,
  q3_b01_ex07: 9,
  q3_b01_ex08: 9,
  q3_b01_ex09: 10,
  q3_b01_ex10: 10,
  q3_b01_ex11: 10,
  q3_b01_ex12: 10,
  q3_b01_ex13: 10,
  q3_b01_ex14: 10,
  q3_b01_ex15: 10,

  // Bài 2 (II. 会话 tr.13-15, III. 翻译成越语 tr.16-17, IV. 造句 tr.17)
  q3_b02_ex01: 13,
  q3_b02_ex02: 14,
  q3_b02_ex03: 16,
  q3_b02_ex04: 16,
  q3_b02_ex05: 16,
  q3_b02_ex06: 17,
  q3_b02_ex07: 17,
  q3_b02_ex08: 17,
  q3_b02_ex09: 17,
  q3_b02_ex10: 17,
  q3_b02_ex11: 17,
  q3_b02_ex12: 17,
  q3_b02_ex13: 17,
  q3_b02_ex14: 17,

  // Bài 3 (II. 会话 tr.19-22, III. 翻译成越语 tr.23, IV. 造句 tr.24)
  q3_b03_ex01: 19,
  q3_b03_ex02: 20,
  q3_b03_ex03: 23,
  q3_b03_ex04: 23,
  q3_b03_ex05: 23,
  q3_b03_ex06: 23,
  q3_b03_ex07: 23,
  q3_b03_ex08: 24,
  q3_b03_ex09: 24,
  q3_b03_ex10: 24,
  q3_b03_ex11: 24,
  q3_b03_ex12: 24,
  q3_b03_ex13: 24,

  // Bài 4 (II. 会话 tr.26-29, III. 造句 tr.29-30, IV. 翻译成越语 tr.30)
  q3_b04_ex01: 26,
  q3_b04_ex02: 28,
  q3_b04_ex07: 29,
  q3_b04_ex08: 29,
  q3_b04_ex09: 29,
  q3_b04_ex10: 29,
  q3_b04_ex11: 29,
  q3_b04_ex12: 30,
  q3_b04_ex03: 30,
  q3_b04_ex04: 30,
  q3_b04_ex05: 30,
  q3_b04_ex06: 30,

  // Bài 5 (II. 会话 tr.33-37, III. 造句 tr.38-39, IV. 翻译成越语 tr.39)
  q3_b05_ex01: 33,
  q3_b05_ex02: 35,
  q3_b05_ex08: 38,
  q3_b05_ex09: 38,
  q3_b05_ex10: 38,
  q3_b05_ex11: 39,
  q3_b05_ex12: 39,
  q3_b05_ex13: 39,
  q3_b05_ex03: 39,
  q3_b05_ex04: 39,
  q3_b05_ex05: 39,
  q3_b05_ex06: 39,
  q3_b05_ex07: 39,

  // Bài 6 (II. 会话 & 课文 tr.42-47, III. 造句 tr.47-48, IV. 翻译成越语 tr.48)
  q3_b06_ex01: 42,
  q3_b06_ex07: 47,
  q3_b06_ex08: 47,
  q3_b06_ex09: 47,
  q3_b06_ex10: 47,
  q3_b06_ex11: 47,
  q3_b06_ex12: 48,
  q3_b06_ex13: 48,
  q3_b06_ex02: 48,
  q3_b06_ex03: 48,
  q3_b06_ex04: 48,
  q3_b06_ex05: 48,
  q3_b06_ex06: 48,

  // Bài 7 (II. 会话 & 课文 tr.51-57, III. 造句 tr.57-58, IV. 翻译成越语 tr.58)
  q3_b07_ex01: 51,
  q3_b07_ex02: 56,
  q3_b07_ex08: 57,
  q3_b07_ex09: 57,
  q3_b07_ex10: 57,
  q3_b07_ex11: 57,
  q3_b07_ex12: 57,
  q3_b07_ex13: 58,
  q3_b07_ex03: 58,
  q3_b07_ex04: 58,
  q3_b07_ex05: 58,
  q3_b07_ex06: 58,
  q3_b07_ex07: 58,

  // Bài 8 (II. 句子 tr.61-66, III. 造句 tr.66, IV. 翻译成越语 tr.67)
  q3_b08_ex01: 61,
  q3_b08_ex07: 66,
  q3_b08_ex08: 66,
  q3_b08_ex09: 66,
  q3_b08_ex10: 66,
  q3_b08_ex11: 66,
  q3_b08_ex12: 66,
  q3_b08_ex02: 67,
  q3_b08_ex03: 67,
  q3_b08_ex04: 67,
  q3_b08_ex05: 67,
  q3_b08_ex06: 67,

  // Bài 9 (II. 句子 tr.70-75, III. 造句 tr.75-76, IV. 翻译成越语 tr.76)
  q3_b09_ex01: 70,
  q3_b09_ex07: 75,
  q3_b09_ex08: 75,
  q3_b09_ex09: 75,
  q3_b09_ex10: 75,
  q3_b09_ex11: 76,
  q3_b09_ex02: 76,
  q3_b09_ex03: 76,
  q3_b09_ex04: 76,
  q3_b09_ex05: 76,
  q3_b09_ex06: 76,

  // Bài 10 (II. 句子 tr.79-84, III. 造句 tr.86, IV. 翻译成越语 tr.86-87)
  q3_b10_ex01: 79,
  q3_b10_ex07: 86,
  q3_b10_ex08: 86,
  q3_b10_ex09: 86,
  q3_b10_ex10: 86,
  q3_b10_ex11: 86,
  q3_b10_ex02: 86,
  q3_b10_ex03: 86,
  q3_b10_ex04: 86,
  q3_b10_ex05: 87,
  q3_b10_ex06: 87,

  // Bài 11 (II. 句子 tr.89-94, III. 造句 tr.95, IV. 翻译成越语 tr.95-96)
  q3_b11_ex01: 89,
  q3_b11_ex07: 95,
  q3_b11_ex08: 95,
  q3_b11_ex09: 95,
  q3_b11_ex10: 95,
  q3_b11_ex11: 95,
  q3_b11_ex02: 95,
  q3_b11_ex03: 95,
  q3_b11_ex04: 95,
  q3_b11_ex05: 96,
  q3_b11_ex06: 96,

  // Bài 12 (II. 句子 tr.98-103, III. 造句 tr.104, IV. 翻译成越语 tr.105)
  q3_b12_ex01: 98,
  q3_b12_ex08: 104,
  q3_b12_ex09: 104,
  q3_b12_ex10: 104,
  q3_b12_ex11: 104,
  q3_b12_ex12: 104,
  q3_b12_ex13: 104,
  q3_b12_ex02: 105,
  q3_b12_ex03: 105,
  q3_b12_ex04: 105,
  q3_b12_ex05: 105,
  q3_b12_ex06: 105,
  q3_b12_ex07: 105,

  // Bài 13 (II. 会话 & 句子 tr.108-111, III. 造句 tr.112, IV. 翻译成越语 tr.112-113)
  q3_b13_ex01: 108,
  q3_b13_ex02: 110,
  q3_b13_ex08: 112,
  q3_b13_ex09: 112,
  q3_b13_ex10: 112,
  q3_b13_ex11: 112,
  q3_b13_ex12: 112,
  q3_b13_ex03: 112,
  q3_b13_ex04: 112,
  q3_b13_ex05: 112,
  q3_b13_ex06: 113,
  q3_b13_ex07: 113,
};

/**
 * Reading passages for Quyển 2 are now included directly in bai_tap_tieng_trung_q2_794d6e50.json
 */
export const BOOK2_AND_3_SUPPLEMENTARY_EXERCISES: Record<string, ExerciseItem[]> = {};

/**
 * Dialogues, Sample Sentences, and Grammar Callouts for Quyển 2 and Quyển 3
 */
export const BOOK2_AND_3_SUPPLEMENTARY_DATA: Record<
  string,
  LessonSupplementaryContent
> = {
  // ================= QUYỂN 2 =================
  q2_bai_13: {
    sectionId: 'q2_bai_13',
    lessonExerciseId: 'q2_b13',
    lessonNumberLabel: 'Bài 13',
    themeColor: 'amber',
    topicTag: 'Đặt vé máy bay & Du lịch',
    grammarCallouts: [
      {
        id: 'g_q2_b13',
        title: 'Trợ từ động thái 过 (Guò) & Bổ ngữ tần suất 次 (Cì)',
        formula: 'Chủ ngữ + Động từ + 过 + Tân ngữ (+ Số lần + 次)',
        explanation:
          'Diễn tả hành động đã từng xảy ra trong quá khứ (nhấn mạnh trải nghiệm). Phủ định dùng 没(有) + Động từ + 过.',
        page: 3,
        examples: [
          {
            hanzi: '我去过北京两次。',
            pinyin: 'Wǒ qùguò Běijīng liǎng cì.',
            meaningVi: 'Tôi đã từng đi Bắc Kinh 2 lần.',
          },
          {
            hanzi: '我还没坐过飞机。',
            pinyin: 'Wǒ hái méi zuòguò fēijī.',
            meaningVi: 'Tôi vẫn chưa từng đi máy bay.',
          },
        ],
      },
    ],
    dialogues: [
      {
        id: 'd_q2_b13_1',
        titleCn: '1. 第一会话',
        titlePinyin: 'Dì yī huìhuà',
        titleVi: 'HỘI THOẠI 1',
        pageStart: 3,
        pageEnd: 5,
        lines: [
          { id: 'q2_b13_d1_1', hanzi: '你好！请问你想订去哪儿的机票？', pinyin: 'Nǐ hǎo! Qǐngwèn nǐ xiǎng dìng qù nǎr de jīpiào?', meaningVi: 'Xin chào! Xin hỏi bạn muốn đặt vé máy bay đi đâu?', page: 3 },
          { id: 'q2_b13_d1_2', hanzi: '我想订一张去北京的机票。', pinyin: 'Wǒ xiǎng dìng yī zhāng qù Běijīng de jīpiào.', meaningVi: 'Tôi muốn đặt một tấm vé máy bay đi Bắc Kinh.', page: 3 },
          { id: 'q2_b13_d1_3', hanzi: '你要订几月几号的？', pinyin: 'Nǐ yào dìng jǐ yuè jǐ hào de?', meaningVi: 'Bạn muốn đặt vé ngày mấy tháng mấy?', page: 4 },
          { id: 'q2_b13_d1_4', hanzi: '十月十五号上午的，有吗？', pinyin: 'Shí yuè shíwǔ hào shàngwǔ de, yǒu ma?', meaningVi: 'Chuyến sáng ngày 15 tháng 10, có không?', page: 4 },
          { id: 'q2_b13_d1_5', hanzi: '有，上午八点半起飞，十一点半到。', pinyin: 'Yǒu, shàngwǔ bā diǎn bàn qǐfēi, shíyī diǎn bàn dào.', meaningVi: 'Có, 8 giờ rưỡi sáng cất cánh, 11 giờ rưỡi tới nơi.', page: 4 },
          { id: 'q2_b13_d1_6', hanzi: '多少钱一张？可以打折吗？', pinyin: 'Duōshǎo qián yī zhāng? Kěyǐ dǎzhé ma?', meaningVi: 'Bao nhiêu tiền một tấm? Có được giảm giá không?', page: 4 },
          { id: 'q2_b13_d1_7', hanzi: '打八折，一共三百二十万越盾。', pinyin: 'Dǎ bā zhé, yīgòng sān bǎi èrshí wàn Yuèdùn.', meaningVi: 'Giảm 20% (còn 80%), tổng cộng 3.200.000 VNĐ.', page: 4 },
          { id: 'q2_b13_d1_8', hanzi: '好的，请帮我订一张，把机票送到我家可以吗？', pinyin: 'Hǎo de, qǐng bāng wǒ dìng yī zhāng, bǎ jīpiào sòng dào wǒ jiā kěyǐ ma?', meaningVi: 'Được, xin giúp tôi đặt 1 tấm, giao vé đến nhà tôi được không?', page: 5 },
        ],
      },
      {
        id: 'd_q2_b13_2',
        titleCn: '2. 第二会话',
        titlePinyin: 'Dì èr huìhuà',
        titleVi: 'HỘI THOẠI 2',
        pageStart: 5,
        pageEnd: 6,
        lines: [
          { id: 'q2_b13_d2_1', hanzi: '你去过中国吗？', pinyin: 'Nǐ qùguò Zhōngguó ma?', meaningVi: 'Bạn đã từng đi Trung Quốc chưa?', page: 5 },
          { id: 'q2_b13_d2_2', hanzi: '我去过一次，去年我跟朋友去北京旅游了。', pinyin: 'Wǒ qùguò yī cì, qùnián wǒ gēn péngyǒu qù Běijīng lǚyóu le.', meaningVi: 'Tôi từng đi 1 lần rồi, năm ngoái tôi cùng bạn đi Bắc Kinh du lịch.', page: 5 },
          { id: 'q2_b13_d2_3', hanzi: '从河内到北京坐飞机要多长时间？', pinyin: 'Cóng Hénèi dào Běijīng zuò fēijī yào duō cháng shíjiān?', meaningVi: 'Từ Hà Nội đến Bắc Kinh đi máy bay mất bao lâu?', page: 5 },
          { id: 'q2_b13_d2_4', hanzi: '大概三个半小时就到了。', pinyin: 'Dàgài sān gè bàn xiǎoshí jiù dào le.', meaningVi: 'Khoảng 3 tiếng rưỡi là tới nơi.', page: 6 },
          { id: 'q2_b13_d2_5', hanzi: '你大学毕业以后想做什么工作？', pinyin: 'Nǐ dàxué bìyè yǐhòu xiǎng zuò shénme gōngzuò?', meaningVi: 'Sau khi tốt nghiệp đại học bạn muốn làm công việc gì?', page: 6 },
          { id: 'q2_b13_d2_6', hanzi: '我想在一家中国公司当翻译。', pinyin: 'Wǒ xiǎng zài yī jiā Zhōngguó gōngsī dāng fānyì.', meaningVi: 'Tôi muốn làm phiên dịch tại một công ty Trung Quốc.', page: 6 },
        ],
      },
    ],
  },

  q2_bai_ngu_phap_2: {
    sectionId: 'q2_bai_ngu_phap_2',
    lessonExerciseId: 'q2_np2',
    lessonNumberLabel: 'Ngữ Pháp 2',
    themeColor: 'purple',
    topicTag: '13 Chủ điểm Ngữ pháp Trọng tâm (Phần 2)',
    grammarCallouts: [
      {
        id: 'g_q2_np2_1',
        title: 'Tổng hợp Liên từ & Cấu trúc câu phức (一…就…, 虽然…但是…, 因为…所以…)',
        formula: '虽然 + A，但是 + B  |  因为 + Nguyên nhân，所以 + Kết quả  |  一 + V1 + 就 + V2',
        explanation:
          'Các cấu trúc liên kết mệnh đề thông dụng nhất trong tiếng Trung giao tiếp để diễn tả nhượng bộ, nhân quả và hành động nối tiếp.',
        page: 13,
        examples: [
          {
            hanzi: '我的儿子一下了课就去玩儿。',
            pinyin: "Wǒ de érzi yī xiàle kè jiù qù wánr.",
            meaningVi: 'Con trai tôi hễ tan học một cái là đi chơi.',
          },
          {
            hanzi: '因为爸爸很忙，所以没有时间照顾孩子。',
            pinyin: 'Yīnwèi bàba hěn máng, suǒyǐ méiyǒu shíjiān zhàogù háizi.',
            meaningVi: 'Vì bố rất bận nên không có thời gian chăm sóc con cái.',
          },
        ],
      },
      {
        id: 'g_q2_np2_2',
        title: 'Cấu trúc Hành động song song & Trạng thái (一边…一边…, 又…又…, 有时候…有时候…)',
        formula: '一边 + V1 + 一边 + V2  |  又 + Adj1 + 又 + Adj2',
        explanation:
          'Dùng 一边…一边… khi hai hành động diễn ra đồng thời; dùng 又…又… khi hai tính chất cùng tồn tại trên một chủ thể.',
        page: 16,
        examples: [
          {
            hanzi: '他们一边吃饭一边聊天儿。',
            pinyin: "Tāmen yībiān chīfàn yībiān liáotiānr.",
            meaningVi: 'Họ vừa ăn cơm vừa nói chuyện phiếm.',
          },
          {
            hanzi: '这个西瓜又大又甜。',
            pinyin: 'Zhège xīguā yòu dà yòu tián.',
            meaningVi: 'Quả dưa hấu này vừa to vừa ngọt.',
          },
        ],
      },
      {
        id: 'g_q2_np2_3',
        title: 'Cấu trúc Thời gian & Bổ ngữ Trạng thái (要…了, 以前/以后, 多+Adj, V+得+Adj)',
        formula: '快要 + V + 了  |  V / Mốc thời gian + 以前 / 以后  |  V + 得 + Cụm tính từ',
        explanation:
          'Diễn tả sự việc sắp xảy ra (要…了), trình tự trước/sau một mốc thời gian (以前/以后), hỏi mức độ (多远/多高) và đánh giá mức độ hành động (得).',
        page: 18,
        examples: [
          {
            hanzi: '去中国以前，他在越南学过汉语。',
            pinyin: 'Qù Zhōngguó yǐqián, tā zài Yuènán xuéguò Hànyǔ.',
            meaningVi: 'Trước khi đi Trung Quốc, anh ấy đã từng học tiếng Hán ở Việt Nam.',
          },
          {
            hanzi: '他感动得说不出话来。',
            pinyin: 'Tā gǎndòng de shuō bù chū huà lái.',
            meaningVi: 'Anh ấy cảm động đến mức nói không nên lời.',
          },
        ],
      },
    ],
    dialogues: [],
  },

  q2_bai_14: {
    sectionId: 'q2_bai_14',
    lessonExerciseId: 'q2_b14',
    lessonNumberLabel: 'Bài 14',
    themeColor: 'emerald',
    topicTag: 'Hành lý, Đồ dùng & Thuốc Đông Y',
    grammarCallouts: [],
    dialogues: [
      {
        id: 'd_q2_b14_1',
        titleCn: '1. 第一会话',
        titlePinyin: 'Dì yī huìhuà',
        titleVi: 'HỘI THOẠI 1',
        pageStart: 23,
        pageEnd: 24,
        lines: [
          { id: 'q2_b14_d1_1', hanzi: '先生，请打开这个黑箱子检查一下儿。', pinyin: 'Xiānshēng, qǐng dǎkāi zhège hēi xiāngzi jiǎnchá yīxiàr.', meaningVi: 'Thưa ông, xin mở chiếc vali màu đen này ra kiểm tra một chút.', page: 23 },
          { id: 'q2_b14_d1_2', hanzi: '这个箱子里都是我的衣服和日用品。', pinyin: 'Zhège xiāngzi lǐ dōu shì wǒ de yīfú hé rìyòngpǐn.', meaningVi: 'Trong chiếc vali này đều là quần áo và đồ dùng hàng ngày của tôi.', page: 23 },
          { id: 'q2_b14_d1_3', hanzi: '这两包是什么东西？是中药吗？', pinyin: 'Zhè liǎng bāo shì shénme dōngxi? Shì zhōngyào ma?', meaningVi: 'Hai gói này là thứ gì vậy? Có phải thuốc Đông y không?', page: 23 },
          { id: 'q2_b14_d1_4', hanzi: '这儿不是中药，这是越南茶叶和咖啡。', pinyin: 'Zhèr bù shì zhōngyào, zhè shì Yuènán cháyè hé kāfēi.', meaningVi: 'Đây không phải thuốc Đông y, đây là trà và cà phê Việt Nam.', page: 24 },
          { id: 'q2_b14_d1_5', hanzi: '那个瓶子里装的是什么？', pinyin: 'Nàgè píngzi lǐ zhuāng de shì shénme?', meaningVi: 'Trong cái lọ kia đựng thứ gì?', page: 24 },
          { id: 'q2_b14_d1_6', hanzi: '是一瓶香水，送给我女朋友的礼物。', pinyin: 'Shì yī píng xiāngshuǐ, sòng gěi wǒ nǚpéngyǒu de lǐwù.', meaningVi: 'Là một lọ nước hoa, quà tặng bạn gái tôi.', page: 24 },
        ],
      },
      {
        id: 'd_q2_b14_2',
        titleCn: '2. 第二会话',
        titlePinyin: 'Dì èr huìhuà',
        titleVi: 'HỘI THOẠI 2',
        pageStart: 24,
        pageEnd: 25,
        lines: [
          { id: 'q2_b14_d2_1', hanzi: '你的箱子真重，里边放了什么？', pinyin: 'Nǐ de xiāngzi zhēn zhòng, lǐbiān fàngle shénme?', meaningVi: 'Vali của bạn nặng thật, bên trong để gì thế?', page: 24 },
          { id: 'q2_b14_d2_2', hanzi: '放了几本词典、两双鞋和一把雨伞。', pinyin: 'Fàngle jǐ běn cídiǎn, liǎng shuāng xié hé yī bǎ yǔsǎn.', meaningVi: 'Để mấy cuốn từ điển, hai đôi giày và một chiếc ô.', page: 25 },
          { id: 'q2_b14_d2_3', hanzi: '明天考试以后你打算去哪儿旅游？', pinyin: 'Míngtiān kǎoshì yǐhòu nǐ dǎsuàn qù nǎr lǚyóu?', meaningVi: 'Sau kỳ thi ngày mai bạn dự định đi đâu du lịch?', page: 25 },
          { id: 'q2_b14_d2_4', hanzi: '我想跟同学一起去大叻旅游三天。', pinyin: 'Wǒ xiǎng gēn tóngxué yīqǐ qù Dàlè lǚyóu sān tiān.', meaningVi: 'Tôi muốn cùng bạn học đi Đà Lạt du lịch 3 ngày.', page: 25 },
        ],
      },
    ],
  },

  q2_bai_15: {
    sectionId: 'q2_bai_15',
    lessonExerciseId: 'q2_b15',
    lessonNumberLabel: 'Bài 15',
    themeColor: 'blue',
    topicTag: 'Hỏi đường, Phương hướng & Đời sống',
    grammarCallouts: [],
    dialogues: [
      {
        id: 'd_q2_b15_1',
        titleCn: '1. 第一会话',
        titlePinyin: 'Dì yī huìhuà',
        titleVi: 'HỘI THOẠI 1',
        pageStart: 32,
        pageEnd: 34,
        lines: [
          { id: 'q2_b15_d1_1', hanzi: '喂，阿兰，你在哪儿呢？怎么还没到？', pinyin: 'Wèi, Ā Lán, nǐ zài nǎr ne? Zěnme hái méi dào?', meaningVi: 'Alo, A Lan, bạn đang ở đâu thế? Sao vẫn chưa tới?', page: 32 },
          { id: 'q2_b15_d1_2', hanzi: '不好意思，我迷路了，不知道现在在哪儿。', pinyin: 'Bù hǎoyìsi, wǒ mílù le, bù zhīdào xiànzài zài nǎr.', meaningVi: 'Ngại quá, tôi bị lạc đường rồi, không biết hiện đang ở đâu.', page: 33 },
          { id: 'q2_b15_d1_3', hanzi: '你看看旁边有什么商店或者银行吗？', pinyin: 'Nǐ kànkan pángbiān yǒu shénme shāngdiàn huòzhě yínháng ma?', meaningVi: 'Bạn nhìn xem bên cạnh có cửa hàng hay ngân hàng nào không?', page: 33 },
          { id: 'q2_b15_d1_4', hanzi: '我前边有一个大超市，右边是邮局。', pinyin: 'Wǒ qiánbiān yǒu yīgè dà chāoshì, yòubiān shì yóujú.', meaningVi: 'Phía trước tôi có một siêu thị lớn, bên phải là bưu điện.', page: 33 },
          { id: 'q2_b15_d1_5', hanzi: '别担心，你在超市门口等我，我马上去接你。', pinyin: 'Bié dānxīn, nǐ zài chāoshì ménkǒu děng wǒ, wǒ mǎshàng qù jiē nǐ.', meaningVi: 'Đừng lo, bạn đợi tôi ở cổng siêu thị, tôi đi đón bạn ngay.', page: 34 },
        ],
      },
      {
        id: 'd_q2_b15_2',
        titleCn: '2. 第二会话',
        titlePinyin: 'Dì èr huìhuà',
        titleVi: 'HỘI THOẠI 2',
        pageStart: 34,
        pageEnd: 36,
        lines: [
          { id: 'q2_b15_d2_1', hanzi: '刚才王经理来找你，你去哪儿了？', pinyin: 'Gāngcái Wáng jīnglǐ lái zhǎo nǐ, nǐ qù nǎr le?', meaningVi: 'Vừa nãy giám đốc Vương tới tìm bạn, bạn đi đâu thế?', page: 34 },
          { id: 'q2_b15_d2_2', hanzi: '我去办公室用复印机复印资料了。他有什么事吗？', pinyin: 'Wǒ qù bàngōngshì yòng fùyìnjī fùyìn zīliào le. Tā yǒu shénme shì ma?', meaningVi: 'Tôi đến văn phòng dùng máy photocopy photo tài liệu. Ông ấy có việc gì không?', page: 35 },
          { id: 'q2_b15_d2_3', hanzi: '他让我转告你，今天下午三点半开会。', pinyin: 'Tā ràng wǒ zhuǎngào nǐ, jīntiān xiàwǔ sān diǎn bàn kāihuì.', meaningVi: 'Ông ấy bảo tôi nhắn lại với bạn, 3 giờ rưỡi chiều nay họp.', page: 35 },
          { id: 'q2_b15_d2_4', hanzi: '好的，谢谢你告诉我。', pinyin: 'Hǎo de, xièxiè nǐ gàosù wǒ.', meaningVi: 'Được, cảm ơn bạn đã báo cho tôi.', page: 36 },
        ],
      },
    ],
  },

  q2_bai_16: {
    sectionId: 'q2_bai_16',
    lessonExerciseId: 'q2_b16',
    lessonNumberLabel: 'Bài 16',
    themeColor: 'amber',
    topicTag: 'Bổ ngữ trạng thái 得 & Việc học tiếng Trung',
    grammarCallouts: [
      {
        id: 'g_q2_b16',
        title: 'Bổ ngữ trạng thái với trợ từ 得 (De)',
        formula: 'Chủ ngữ + (Động từ + Tân ngữ) + Động từ + 得 + Tính từ',
        explanation:
          'Dùng để đánh giá mức độ, kết quả hoặc trạng thái của hành động (như nói nhanh, học giỏi, viết đẹp).',
        page: 42,
        examples: [
          {
            hanzi: '他汉语说得很好。',
            pinyin: 'Tā Hànyǔ shuō de hěn hǎo.',
            meaningVi: 'Anh ấy nói tiếng Hán rất tốt.',
          },
          {
            hanzi: '我汉字写得不太好看。',
            pinyin: 'Wǒ Hànzì xiě de bù tài hǎokàn.',
            meaningVi: 'Tôi viết chữ Hán không đẹp lắm.',
          },
        ],
      },
    ],
    dialogues: [
      {
        id: 'd_q2_b16_1',
        titleCn: '1. 第一会话',
        titlePinyin: 'Dì yī huìhuà',
        titleVi: 'HỘI THOẠI 1',
        pageStart: 42,
        pageEnd: 43,
        lines: [
          { id: 'q2_b16_d1_1', hanzi: '你学汉语学了多长时间了？', pinyin: 'Nǐ xué Hànyǔ xuéle duō cháng shíjiān le?', meaningVi: 'Bạn học tiếng Hán được bao lâu rồi?', page: 42 },
          { id: 'q2_b16_d1_2', hanzi: '我学了四个多月了，但是我说得不太流利。', pinyin: 'Wǒ xuéle sì gè duō yuè le, dànshì wǒ shuō de bù tài liúlì.', meaningVi: 'Tôi học hơn 4 tháng rồi, nhưng tôi nói chưa lưu loát lắm.', page: 43 },
          { id: 'q2_b16_d1_3', hanzi: '你发音很准，只要每天多练习，一定能学好。', pinyin: 'Nǐ fāyīn hěn zhǔn, zhǐyào měitiān duō liànxí, yīdìng néng xuéhǎo.', meaningVi: 'Bạn phát âm rất chuẩn, chỉ cần mỗi ngày luyện tập nhiều, nhất định sẽ học tốt.', page: 43 },
          { id: 'q2_b16_d1_4', hanzi: '谢谢你的鼓励，我会更加努力的。', pinyin: 'Xièxiè nǐ de gǔlì, wǒ huì gèngjiā nǔlì de.', meaningVi: 'Cảm ơn sự khích lệ của bạn, tôi sẽ cố gắng hơn nữa.', page: 43 },
        ],
      },
      {
        id: 'd_q2_b16_2',
        titleCn: '2. 第二会话',
        titlePinyin: 'Dì èr huìhuà',
        titleVi: 'HỘI THOẠI 2',
        pageStart: 44,
        pageEnd: 44,
        lines: [
          { id: 'q2_b16_d2_1', hanzi: '你平时喜欢做什么运动？', pinyin: 'Nǐ píngshí xǐhuān zuò shénme yùndòng?', meaningVi: 'Bình thường bạn thích tập môn thể thao gì?', page: 44 },
          { id: 'q2_b16_d2_2', hanzi: '我喜欢跑步和打羽毛球，每天早上我都起得很早去锻炼。', pinyin: 'Wǒ xǐhuān pǎobù hé dǎ yǔmáoqiú, měitiān zǎoshang wǒ dōu qǐ de hěn zǎo qù duànliàn.', meaningVi: 'Tôi thích chạy bộ và đánh cầu lông, sáng nào tôi cũng dậy rất sớm đi tập thể dục.', page: 44 },
          { id: 'q2_b16_d2_3', hanzi: '明天我有事想跟老师请假，你知道怎么写请假条吗？', pinyin: 'Míngtiān wǒ yǒushì xiǎng gēn lǎoshī qǐngjià, nǐ zhīdào zěnme xiě qǐngjiàtiáo ma?', meaningVi: 'Ngày mai tôi có việc muốn xin phép thầy giáo nghỉ học, bạn biết viết đơn xin nghỉ phép thế nào không?', page: 44 },
          { id: 'q2_b16_d2_4', hanzi: '知道，我教你写吧。', pinyin: 'Zhīdào, wǒ jiāo nǐ xiě ba.', meaningVi: 'Biết, để tôi chỉ bạn viết nhé.', page: 44 },
        ],
      },
    ],
  },

  q2_bai_17: {
    sectionId: 'q2_bai_17',
    lessonExerciseId: 'q2_b17',
    lessonNumberLabel: 'Bài 17',
    themeColor: 'rose',
    topicTag: 'Khám bệnh, Triệu chứng & Sức khỏe',
    grammarCallouts: [],
    dialogues: [
      {
        id: 'd_q2_b17_1',
        titleCn: '1. 第一会话',
        titlePinyin: 'Dì yī huìhuà',
        titleVi: 'HỘI THOẠI 1',
        pageStart: 50,
        pageEnd: 51,
        lines: [
          { id: 'q2_b17_d1_1', hanzi: '你怎么了？脸色不太好。', pinyin: 'Nǐ zěnme le? Liǎnsè bù tài hǎo.', meaningVi: 'Bạn làm sao thế? Sắc mặt không tốt lắm.', page: 50 },
          { id: 'q2_b17_d1_2', hanzi: '我肚子疼得厉害，可能是昨天吃坏肚子了。', pinyin: 'Wǒ dùzi téng de lìhài, kěnéng shì zuótiān chī huài dùzi le.', meaningVi: 'Tôi đau bụng dữ dội, có lẽ là hôm qua ăn phải đồ làm đau bụng rồi.', page: 50 },
          { id: 'q2_b17_d1_3', hanzi: '昨天晚上你吃了什么？', pinyin: 'Zuótiān wǎnshàng nǐ chīle shénme?', meaningVi: 'Tối hôm qua bạn đã ăn gì?', page: 50 },
          { id: 'q2_b17_d1_4', hanzi: '我吃了一条烤鱼，还喝了两瓶冰啤酒。', pinyin: 'Wǒ chīle yī tiáo kǎoyú, hái hēle liǎng píng bīng píjiǔ.', meaningVi: 'Tôi ăn một con cá nướng, còn uống hai chai bia lạnh.', page: 51 },
          { id: 'q2_b17_d1_5', hanzi: '我陪你去医院化验一下吧，别耽误了。', pinyin: 'Wǒ péi nǐ qù yīyuàn huàyàn yīxià ba, bié dānwù le.', meaningVi: 'Tôi đưa bạn đi bệnh viện xét nghiệm một chút nhé, đừng để chậm trễ.', page: 51 },
        ],
      },
      {
        id: 'd_q2_b17_2',
        titleCn: '2. 第二会话',
        titlePinyin: 'Dì èr huìhuà',
        titleVi: 'HỘI THOẠI 2',
        pageStart: 51,
        pageEnd: 52,
        lines: [
          { id: 'q2_b17_d2_1', hanzi: '大夫，我头疼、全身出汗，嗓子也很疼。', pinyin: 'Dàifū, wǒ tóuténg, quánshēn chūhàn, sǎngzi yě hěn téng.', meaningVi: 'Bác sĩ ơi, tôi đau đầu, toàn thân đổ mồ hôi, cổ họng cũng rất đau.', page: 51 },
          { id: 'q2_b17_d2_2', hanzi: '量一下体温吧，三十八度五，你发烧了。', pinyin: 'Liáng yīxià tǐwēn ba, sānshíbā dù wǔ, nǐ fāshāo le.', meaningVi: 'Đo nhiệt độ một chút nhé, 38.5 độ, bạn bị sốt rồi.', page: 52 },
          { id: 'q2_b17_d2_3', hanzi: '严重吗？要不要打针？', pinyin: 'Yánzhòng ma? Yào bùyào dǎzhēn?', meaningVi: 'Có nặng không ạ? Có cần phải tiêm không?', page: 52 },
          { id: 'q2_b17_d2_4', hanzi: '不用打针，我给你开一些感冒药，一天吃三次。', pinyin: 'Bùyòng dǎzhēn, wǒ gěi nǐ kāi yīxiē gǎnmàoyào, yī tiān chī sān cì.', meaningVi: 'Không cần tiêm, tôi kê cho bạn một ít thuốc cảm, mỗi ngày uống 3 lần.', page: 52 },
        ],
      },
    ],
  },

  q2_bai_ngu_phap_3: {
    sectionId: 'q2_bai_ngu_phap_3',
    lessonExerciseId: 'q2_np3',
    lessonNumberLabel: 'Ngữ Pháp 3',
    themeColor: 'purple',
    topicTag: '12 Chủ điểm Ngữ pháp Trọng tâm (Phần 3)',
    grammarCallouts: [
      {
        id: 'g_q2_np3_1',
        title: 'Hỏi số lượng (几 / 多少), Lượng từ động tác (一下) & Cấu trúc nhấn mạnh (是…的)',
        formula: 'S + 是 + [Thời gian / Địa điểm / Cách thức / Tác nhân] + V + 的',
        explanation:
          'Cấu trúc 是…的 dùng để nhấn mạnh chi tiết (ai, khi nào, ở đâu, bằng cách nào) của một hành động đã xảy ra trong quá khứ.',
        page: 57,
        examples: [
          {
            hanzi: '这本书是我买的。',
            pinyin: 'Zhè běn shū shì wǒ mǎi de.',
            meaningVi: 'Quyển sách này là do tôi mua.',
          },
          {
            hanzi: '你先休息一下吧。',
            pinyin: 'Nǐ xiān xiūxi yīxià ba.',
            meaningVi: 'Bạn cứ nghỉ ngơi một lát trước đi nhé.',
          },
        ],
      },
      {
        id: 'g_q2_np3_2',
        title: 'Câu cầu khiến ngăn cấm (不要/别…了) & Câu so sánh hơn/kém (比 / 没有)',
        formula: 'A + 比 + B + Adj (+ Cụm định lượng / 得多)  |  A + 没有 + B + Adj',
        explanation:
          'Dùng 比 để so sánh hơn; dùng 没有 để so sánh kém (A không bằng B); tuyệt đối không dùng 很/太 trước tính từ trong câu chữ 比.',
        page: 60,
        examples: [
          {
            hanzi: '西瓜比苹果贵两块钱。',
            pinyin: 'Xīguā bǐ píngguǒ guì liǎng kuài qián.',
            meaningVi: 'Dưa hấu đắt hơn táo 2 đồng.',
          },
          {
            hanzi: '哥哥没有姐姐高。',
            pinyin: 'Gēge méiyǒu jiějie gāo.',
            meaningVi: 'Anh trai không cao bằng chị gái.',
          },
        ],
      },
      {
        id: 'g_q2_np3_3',
        title: 'Trợ từ động thái (着 / 过), Câu phản vấn (不是…吗) & Bổ ngữ tần suất (次)',
        formula: 'V + 着 (Trạng thái duy trì)  |  V + 过 (+ Số lần + 次) (Trải nghiệm)',
        explanation:
          '着 biểu thị trạng thái đang tiếp diễn hoặc duy trì; 过 biểu thị hành động đã từng xảy ra trong quá khứ kèm bổ ngữ tần suất 次.',
        page: 63,
        examples: [
          {
            hanzi: '他们穿着红色的衣服。',
            pinyin: 'Tāmen chuānzhe hóngsè de yīfu.',
            meaningVi: 'Họ đang mặc quần áo màu đỏ.',
          },
          {
            hanzi: '我们看过三次这个电影。',
            pinyin: 'Wǒmen kànguò sān cì zhège diànyǐng.',
            meaningVi: 'Chúng tôi đã từng xem bộ phim này 3 lần.',
          },
        ],
      },
    ],
    dialogues: [],
  },

  q2_bai_18: {
    sectionId: 'q2_bai_18',
    lessonExerciseId: 'q2_b18',
    lessonNumberLabel: 'Bài 18',
    themeColor: 'emerald',
    topicTag: 'Thuê nhà, Phòng ốc & Môi trường sống',
    grammarCallouts: [],
    dialogues: [
      {
        id: 'd_q2_b18_1',
        titleCn: '1. 第一会话',
        titlePinyin: 'Dì yī huìhuà',
        titleVi: 'HỘI THOẠI 1',
        pageStart: 67,
        pageEnd: 68,
        lines: [
          { id: 'q2_b18_d1_1', hanzi: '你想租什么样的房子？', pinyin: 'Nǐ xiǎng zū shénmeyàng de fángzi?', meaningVi: 'Bạn muốn thuê căn nhà như thế nào?', page: 67 },
          { id: 'q2_b18_d1_2', hanzi: '我想租一套一室一厅的房子，要有厨房和卫生间。', pinyin: 'Wǒ xiǎng zū yī tào yī shì yī tīng de fángzi, yào yǒu chúfáng hé wèishēngjiān.', meaningVi: 'Tôi muốn thuê một căn hộ 1 phòng ngủ 1 phòng khách, phải có bếp và phòng vệ sinh.', page: 68 },
          { id: 'q2_b18_d1_3', hanzi: '这套房子怎么样？周围环境很安静，面积有五十平方米。', pinyin: 'Zhè tào fángzi zěnmeyàng? Zhōuwéi huánjìng hěn ānjìng, miànjī yǒu wǔshí píngfāngmǐ.', meaningVi: 'Căn nhà này thế nào? Môi trường xung quanh rất yên tĩnh, diện tích 50 mét vuông.', page: 68 },
          { id: 'q2_b18_d1_4', hanzi: '房租一个月多少钱？', pinyin: 'Fángzū yīgè yuè duōshǎo qián?', meaningVi: 'Tiền thuê nhà một tháng bao nhiêu tiền?', page: 68 },
          { id: 'q2_b18_d1_5', hanzi: '一个月两千五百块，水电费自己付。', pinyin: 'Yīgè yuè liǎng qiān wǔ bǎi kuài, shuǐdiànfèi zìjǐ fù.', meaningVi: 'Một tháng 2.500 tệ, tiền điện nước tự trả.', page: 68 },
        ],
      },
      {
        id: 'd_q2_b18_2',
        titleCn: '2. 第二会话',
        titlePinyin: 'Dì èr huìhuà',
        titleVi: 'HỘI THOẠI 2',
        pageStart: 69,
        pageEnd: 70,
        lines: [
          { id: 'q2_b18_d2_1', hanzi: '你搬家了吗？新房子离公司远不远？', pinyin: 'Nǐ bānjiā le ma? Xīn fángzi lí gōngsī yuǎn bù yuǎn?', meaningVi: 'Bạn chuyển nhà chưa? Nhà mới cách công ty có xa không?', page: 69 },
          { id: 'q2_b18_d2_2', hanzi: '上个周末刚搬好，离公司很近，骑自行车十分钟就到了。', pinyin: 'Shàng gè zhōumò gāng bānhǎo, lí gōngsī hěn jìn, qí zìxíngchē shí fēnzhōng jiù dàole.', meaningVi: 'Cuối tuần trước vừa dọn xong, cách công ty rất gần, đi xe đạp 10 phút là tới.', page: 69 },
          { id: 'q2_b18_d2_3', hanzi: '要是这个星期天你有空，欢迎来我家玩儿！', pinyin: 'Yàoshi zhège xīngqītiān nǐ yǒukòng, huānyíng lái wǒjiā wánr!', meaningVi: 'Nếu Chủ nhật tuần này bạn rảnh, hoan nghênh đến nhà tôi chơi!', page: 70 },
        ],
      },
    ],
  },

  q2_bai_19: {
    sectionId: 'q2_bai_19',
    lessonExerciseId: 'q2_b19',
    lessonNumberLabel: 'Bài 19',
    themeColor: 'blue',
    topicTag: 'Bổ ngữ kết quả & Chế độ rèn luyện',
    grammarCallouts: [],
    dialogues: [
      {
        id: 'd_q2_b19_1',
        titleCn: '1. 第一会话',
        titlePinyin: 'Dì yī huìhuà',
        titleVi: 'HỘI THOẠI 1',
        pageStart: 76,
        pageEnd: 77,
        lines: [
          { id: 'q2_b19_d1_1', hanzi: '你看见我的汉越词典了吗？', pinyin: 'Nǐ kànjiàn wǒ de Hàn-Yuè cídiǎn le ma?', meaningVi: 'Bạn có nhìn thấy cuốn từ điển Hán Việt của tôi không?', page: 76 },
          { id: 'q2_b19_d1_2', hanzi: '我没看见，是不是放在书包里了？', pinyin: 'Wǒ méi kànjiàn, shì bùshì fàng zài shūbāo lǐ le?', meaningVi: 'Tôi không nhìn thấy, có phải để trong cặp sách rồi không?', page: 76 },
          { id: 'q2_b19_d1_3', hanzi: '我找过了，没有。今天的作业你做完了吗？', pinyin: 'Wǒ zhǎoguò le, méiyǒu. Jīntiān de zuòyè nǐ zuòwán le ma?', meaningVi: 'Tôi tìm rồi, không có. Bài tập hôm nay bạn làm xong chưa?', page: 77 },
          { id: 'q2_b19_d1_4', hanzi: '我已经做完了，这次考试你的成绩怎么样？', pinyin: 'Wǒ yǐjīng zuòwán le, zhè cì kǎoshì nǐ de chéngjì zěnmeyàng?', meaningVi: 'Tôi đã làm xong rồi, kỳ thi lần này thành tích của bạn thế nào?', page: 77 },
          { id: 'q2_b19_d1_5', hanzi: '考得还可以，听力和口语都考了九十分。', pinyin: 'Kǎo de hái kěyǐ, tīnglì hé kǒuyǔ dōu kǎole jiǔshí fēn.', meaningVi: 'Thi cũng tạm được, môn nghe và nói đều đạt 90 điểm.', page: 77 },
        ],
      },
      {
        id: 'd_q2_b19_2',
        titleCn: '2. 第二会话',
        titlePinyin: 'Dì èr huìhuà',
        titleVi: 'HỘI THOẠI 2',
        pageStart: 77,
        pageEnd: 78,
        lines: [
          { id: 'q2_b19_d2_1', hanzi: '好久不见，你越来越瘦、越来越漂亮了！', pinyin: 'Hǎojiǔ bùjiàn, nǐ yuèláiyuè shòu, yuèláiyuè piàoliang le!', meaningVi: 'Lâu rồi không gặp, bạn càng ngày càng thon gọn, càng ngày càng xinh đẹp ra!', page: 77 },
          { id: 'q2_b19_d2_2', hanzi: '是吗？这两个月我一直在减肥，每天都去游泳。', pinyin: 'Shì ma? Zhè liǎng gè yuè wǒ yīzhí zài jiǎnféi, měitiān dōu qù yóuyǒng.', meaningVi: 'Thật sao? Hai tháng nay tôi vẫn luôn giảm cân, ngày nào cũng đi bơi.', page: 78 },
          { id: 'q2_b19_d2_3', hanzi: '难怪效果这么好，我也要向你学习！', pinyin: 'Nánguài xiàoguǒ zhème hǎo, wǒ yě yào xiàng nǐ xuéxí!', meaningVi: 'Thảo nào hiệu quả tốt như vậy, tôi cũng phải học tập bạn!', page: 78 },
        ],
      },
    ],
  },

  q2_bai_20: {
    sectionId: 'q2_bai_20',
    lessonExerciseId: 'q2_b20',
    lessonNumberLabel: 'Bài 20',
    themeColor: 'amber',
    topicTag: 'Công việc, Phỏng vấn & Xin nghỉ việc',
    grammarCallouts: [],
    dialogues: [
      {
        id: 'd_q2_b20_1',
        titleCn: '1. 第一会话',
        titlePinyin: 'Dì yī huìhuà',
        titleVi: 'HỘI THOẠI 1',
        pageStart: 84,
        pageEnd: 85,
        lines: [
          { id: 'q2_b20_d1_1', hanzi: '听说你想辞职，为什么呢？', pinyin: 'Tīngshuō nǐ xiǎng cízhí, wèishénme ne?', meaningVi: 'Nghe nói bạn muốn từ chức, tại sao thế?', page: 84 },
          { id: 'q2_b20_d1_2', hanzi: '这家公司离我家太远，而且天天加班，影响身体健康。', pinyin: 'Zhè jiā gōngsī lí wǒjiā tài yuǎn, érqiě tiāntiān jiābān, yǐngxiǎng shēntǐ jiànkāng.', meaningVi: 'Công ty này cách nhà tôi xa quá, hơn nữa ngày nào cũng tăng ca, ảnh hưởng sức khỏe.', page: 85 },
          { id: 'q2_b20_d1_3', hanzi: '那你找到新工作了吗？', pinyin: 'Nà nǐ zhǎodào xīn gōngzuò le ma?', meaningVi: 'Vậy bạn đã tìm được công việc mới chưa?', page: 85 },
          { id: 'q2_b20_d1_4', hanzi: '找到了，下个星期一我就去新公司上班。', pinyin: 'Zhǎodào le, xià gè xīngqīyī wǒ jiù qù xīn gōngsī shàngbān.', meaningVi: 'Tìm được rồi, thứ Hai tuần sau tôi sẽ đi làm ở công ty mới.', page: 85 },
        ],
      },
      {
        id: 'd_q2_b20_2',
        titleCn: '2. 第二会话',
        titlePinyin: 'Dì èr huìhuà',
        titleVi: 'HỘI THOẠI 2',
        pageStart: 85,
        pageEnd: 87,
        lines: [
          { id: 'q2_b20_d2_1', hanzi: '这份报告你检查过了吗？有没有问题？', pinyin: 'Zhè fèn bàogào nǐ jiǎncháguò le ma? Yǒu méiyǒu wèntí?', meaningVi: 'Bản báo cáo này bạn đã kiểm tra qua chưa? Có vấn đề gì không?', page: 86 },
          { id: 'q2_b20_d2_2', hanzi: '我已经认真检查了两遍，大家没有什么意见。', pinyin: 'Wǒ yǐjīng rènzhēn jiǎnchále liǎng biàn, dàjiā méiyǒu shénme yìjiàn.', meaningVi: 'Tôi đã kiểm tra kỹ 2 lần rồi, mọi người không có ý kiến gì.', page: 86 },
          { id: 'q2_b20_d2_3', hanzi: '好，那你马上发给总经理吧。', pinyin: 'Hǎo, nà nǐ mǎshàng fā gěi zǒngjīnglǐ ba.', meaningVi: 'Tốt, vậy bạn gửi ngay cho Tổng giám đốc đi.', page: 87 },
        ],
      },
    ],
  },

  q2_bai_21: {
    sectionId: 'q2_bai_21',
    lessonExerciseId: 'q2_b21',
    lessonNumberLabel: 'Bài 21',
    themeColor: 'emerald',
    topicTag: 'Ẩm thực Việt – Trung & Gọi món nhà hàng',
    grammarCallouts: [],
    dialogues: [
      {
        id: 'd_q2_b21_1',
        titleCn: '1. 第一会话',
        titlePinyin: 'Dì yī huìhuà',
        titleVi: 'HỘI THOẠI 1',
        pageStart: 92,
        pageEnd: 94,
        lines: [
          { id: 'q2_b21_d1_1', hanzi: '服务员，请给我们看一下菜单。', pinyin: 'Fúwùyuán, qǐng gěi wǒmen kàn yīxià càidān.', meaningVi: 'Phục vụ ơi, xin cho chúng tôi xem thực đơn một chút.', page: 92 },
          { id: 'q2_b21_d1_2', hanzi: '越南菜好不好吃？有什么特色菜？', pinyin: 'Yuènán cài hǎo bù hǎochī? Yǒu shénme tèsècài?', meaningVi: 'Món ăn Việt Nam có ngon không? Có món đặc sản gì?', page: 93 },
          { id: 'q2_b21_d1_3', hanzi: '越南菜很丰富，既有酸甜的，也有清淡的。', pinyin: 'Yuènán cài hěn fēngfù, jì yǒu suāntián de, yě yǒu qīngdàn de.', meaningVi: 'Món ăn Việt Nam rất phong phú, vừa có món chua ngọt, vừa có món thanh đạm.', page: 93 },
          { id: 'q2_b21_d1_4', hanzi: '别点太多了，我们两个人吃不了。', pinyin: 'Bié diǎn tài duō le, wǒmen liǎng gèrén chī bù liǎo.', meaningVi: 'Đừng gọi nhiều quá, hai người chúng mình ăn không hết được.', page: 94 },
        ],
      },
      {
        id: 'd_q2_b21_2',
        titleCn: '2. 第二会话',
        titlePinyin: 'Dì èr huìhuà',
        titleVi: 'HỘI THOẠI 2',
        pageStart: 94,
        pageEnd: 95,
        lines: [
          { id: 'q2_b21_d2_1', hanzi: '服务员，买单！一共多少钱？', pinyin: 'Fúwùyuán, mǎidān! Yīgòng duōshǎo qián?', meaningVi: 'Phục vụ ơi, tính tiền! Tổng cộng bao nhiêu tiền?', page: 94 },
          { id: 'q2_b21_d2_2', hanzi: '一共四十五万越盾，请问您付现金还是刷卡？', pinyin: 'Yīgòng sìshíwǔ wàn Yuèdùn, qǐngwèn nín fù xiànjīn háishì shuākǎ?', meaningVi: 'Tổng cộng 450.000 VNĐ, xin hỏi ngài trả tiền mặt hay quẹt thẻ?', page: 95 },
          { id: 'q2_b21_d2_3', hanzi: '我刷信用卡，请帮我开一张发票。', pinyin: 'Wǒ shuā xìnyòngkǎ, qǐng bāng wǒ kāi yī zhāng fāpiào.', meaningVi: 'Tôi quẹt thẻ tín dụng, xin giúp tôi xuất một tờ hóa đơn.', page: 95 },
        ],
      },
    ],
  },

  q2_bai_22: {
    sectionId: 'q2_bai_22',
    lessonExerciseId: 'q2_b22',
    lessonNumberLabel: 'Bài 22',
    themeColor: 'blue',
    topicTag: 'Bổ ngữ thời lượng & Thủ tục gia hạn Visa',
    grammarCallouts: [],
    dialogues: [
      {
        id: 'd_q2_b22_1',
        titleCn: '1. 第一会话',
        titlePinyin: 'Dì yī huìhuà',
        titleVi: 'HỘI THOẠI 1',
        pageStart: 101,
        pageEnd: 102,
        lines: [
          { id: 'q2_b22_d1_1', hanzi: '你来中国多长时间了？', pinyin: 'Nǐ lái Zhōngguó duō cháng shíjiān le?', meaningVi: 'Bạn đến Trung Quốc được bao lâu rồi?', page: 101 },
          { id: 'q2_b22_d1_2', hanzi: '我来了两个多月了，现在已经习惯这儿的生活了。', pinyin: 'Wǒ láile liǎng gè duō yuè le, xiànzài yǐjīng xíguàn zhèr de shēnghuó le.', meaningVi: 'Tôi đến được hơn hai tháng rồi, hiện tại đã quen với cuộc sống ở đây rồi.', page: 101 },
          { id: 'q2_b22_d1_3', hanzi: '你在发愁什么呢？', pinyin: 'Nǐ zài fāchóu shénme ne?', meaningVi: 'Bạn đang lo lắng chuyện gì thế?', page: 102 },
          { id: 'q2_b22_d1_4', hanzi: '我的签证下个星期就到期了，我想去申请延长一个月。', pinyin: 'Wǒ de qiānzhèng xià gè xīngqī jiù dàoqī le, wǒ xiǎng qù shēnqǐng yáncháng yīgè yuè.', meaningVi: 'Visa của tôi tuần sau là hết hạn rồi, tôi muốn đi xin gia hạn thêm 1 tháng.', page: 102 },
        ],
      },
      {
        id: 'd_q2_b22_2',
        titleCn: '2. 第二会话',
        titlePinyin: 'Dì èr huìhuà',
        titleVi: 'HỘI THOẠI 2',
        pageStart: 102,
        pageEnd: 104,
        lines: [
          { id: 'q2_b22_d2_1', hanzi: '糟糕！我把房间钥匙忘在办公室里了。', pinyin: 'Zāogāo! Wǒ bǎ fángjiān yàoshi wàng zài bàngōngshì lǐ le.', meaningVi: 'Thôi chết! Tôi để quên chìa khóa phòng ở trong văn phòng mất rồi.', page: 103 },
          { id: 'q2_b22_d2_2', hanzi: '现在太晚了，办公室已经锁门了，再说外边还下着雨。', pinyin: 'Xiànzài tài wǎn le, bàngōngshì yǐjīng suǒmén le, zàishuō wàibiān hái xiàzhe yǔ.', meaningVi: 'Bây giờ muộn quá rồi, văn phòng đã khóa cửa rồi, hơn nữa bên ngoài còn đang mưa.', page: 103 },
          { id: 'q2_b22_d2_3', hanzi: '那今天晚上我先在你房间住一晚，明天再去拿钥匙。', pinyin: 'Nà jīntiān wǎnshàng wǒ xiān zài nǐ fángjiān zhù yī wǎn, míngtiān zài qù ná yàoshi.', meaningVi: 'Vậy tối nay tôi ngủ nhờ phòng bạn một đêm trước, ngày maiค่อย đi lấy chìa khóa.', page: 104 },
        ],
      },
    ],
  },

  q2_bai_23: {
    sectionId: 'q2_bai_23',
    lessonExerciseId: 'q2_b23',
    lessonNumberLabel: 'Bài 23',
    themeColor: 'amber',
    topicTag: 'Ước mơ, Định hướng tương lai & Từ vựng bổ sung',
    grammarCallouts: [],
    dialogues: [
      {
        id: 'd_q2_b23_1',
        titleCn: '1. 第一会话',
        titlePinyin: 'Dì yī huìhuà',
        titleVi: 'HỘI THOẠI 1',
        pageStart: 110,
        pageEnd: 112,
        lines: [
          { id: 'q2_b23_d1_1', hanzi: '今年暑假你有什么安排？打算去打工吗？', pinyin: 'Jīnnián shǔjià nǐ yǒu shénme ānpái? Dǎsuàn qù dǎgōng ma?', meaningVi: 'Kỳ nghỉ hè năm nay bạn có sắp xếp gì? Có định đi làm thêm không?', page: 110 },
          { id: 'q2_b23_d1_2', hanzi: '我打算去一家旅行社兼职当导游，既能赚钱又能锻炼口语。', pinyin: 'Wǒ dǎsuàn qù yī jiā lǚxíngshè jiānzhí dāng dǎoyóu, jì néng zhuànqián yòu néng duànliàn kǒuyǔ.', meaningVi: 'Tôi định đến một công ty du lịch làm hướng dẫn viên bán thời gian, vừa kiếm được tiền vừa rèn được khẩu ngữ.', page: 111 },
          { id: 'q2_b23_d1_3', hanzi: '你最大的梦想是什么？', pinyin: 'Nǐ zuìdà de mèngxiǎng shì shénme?', meaningVi: 'Ước mơ lớn nhất của bạn là gì?', page: 111 },
          { id: 'q2_b23_d1_4', hanzi: '我喜欢自由的生活，希望能开一家自己的公司。', pinyin: 'Wǒ xǐhuān zìyóu de shēnghuó, xīwàng néng kāi yī jiā zìjǐ de gōngsī.', meaningVi: 'Tôi thích cuộc sống tự do, hy vọng có thể mở một công ty của riêng mình.', page: 112 },
        ],
      },
      {
        id: 'd_q2_b23_2',
        titleCn: '2. 第二会话',
        titlePinyin: 'Dì èr huìhuà',
        titleVi: 'HỘI THOẠI 2',
        pageStart: 112,
        pageEnd: 113,
        lines: [
          { id: 'q2_b23_d2_1', hanzi: '那个戴眼镜的女孩是谁？你认识她吗？', pinyin: 'Nàgè dài yǎnjìng de nǚhái shì shéi? Nǐ rènshí tā ma?', meaningVi: 'Cô gái đeo kính kia là ai thế? Bạn có quen cô ấy không?', page: 112 },
          { id: 'q2_b23_d2_2', hanzi: '她是我们部门新来的翻译，不仅人长得漂亮，而且工作非常认真。', pinyin: 'Tā shì wǒmen bùmén xīn lái de fānyì, bùjǐn rén zhǎng de piàoliang, érqiě gōngzuò fēicháng rènzhēn.', meaningVi: 'Cô ấy là phiên dịch viên mới đến của bộ phận chúng tôi, không những xinh đẹp mà làm việc còn vô cùng nghiêm túc.', page: 113 },
        ],
      },
    ],
  },

  // ================= QUYỂN 3 =================
  q3_bai_01: {
    sectionId: 'q3_bai_01',
    lessonExerciseId: 'q3_b01',
    lessonNumberLabel: 'Bài 1 (Q3)',
    themeColor: 'amber',
    topicTag: 'Phỏng vấn xin việc & Nhân sự công ty',
    grammarCallouts: [],
    dialogues: [
      {
        id: 'd_q3_b01_1',
        titleCn: '1. 第一会话',
        titlePinyin: 'Dì yī huìhuà',
        titleVi: 'HỘI THOẠI 1: PHỎNG VẤN XIN VIỆC',
        pageStart: 4,
        pageEnd: 5,
        lines: [
          { id: 'q3_b01_d1_1', hanzi: '请进，请坐！先简单介绍一下你自己吧。', pinyin: 'Qǐng jìn, qǐng zuò! Xiān jiǎndān jièshào yīxià nǐ zìjǐ ba.', meaningVi: 'Mời vào, mời ngồi! Trước tiên hãy giới thiệu ngắn gọn về bản thân bạn nhé.', page: 4 },
          { id: 'q3_b01_d1_2', hanzi: '您好！我叫阮氏香，今年二十四岁，毕业于河内大学中文系。', pinyin: 'Nín hǎo! Wǒ jiào Ruǎn Shì Xiāng, jīnnián èrshísì suì, bìyè yú Hénèi Dàxué Zhōngwén xì.', meaningVi: 'Xin chào ngài! Tôi tên là Nguyễn Thị Hương, năm nay 24 tuổi, tốt nghiệp khoa Tiếng Trung Đại học Hà Nội.', page: 4 },
          { id: 'q3_b01_d1_3', hanzi: '你以前有工作经验吗？', pinyin: 'Nǐ yǐqián yǒu gōngzuò jīngyàn ma?', meaningVi: 'Trước đây bạn đã có kinh nghiệm làm việc chưa?', page: 4 },
          { id: 'q3_b01_d1_4', hanzi: '我在一家台湾工厂当过两年现场翻译，熟悉生产流程和办公软件。', pinyin: 'Wǒ zài yī jiā Táiwān gōngchǎng dāngguò liǎng nián xiànchǎng fānyì, shúxī shēngchǎn liúchéng hé bàngōng ruǎnjiàn.', meaningVi: 'Tôi từng làm phiên dịch hiện trường 2 năm tại một nhà máy Đài Loan, thôngạo quy trình sản xuất và phần mềm văn phòng.', page: 5 },
          { id: 'q3_b01_d1_5', hanzi: '你有什么优点和缺点？', pinyin: 'Nǐ yǒu shénme yōudiǎn hé quēdiǎn?', meaningVi: 'Bạn có ưu điểm và nhược điểm gì?', page: 5 },
          { id: 'q3_b01_d1_6', hanzi: '我的优点是工作认真、有责任心；缺点是有时候太着急。', pinyin: 'Wǒ de yōudiǎn shì gōngzuò rènzhēn, yǒu zérènxīn; quēdiǎn shì yǒushíhòu tài zháojí.', meaningVi: 'Ưu điểm của tôi là làm việc chăm chỉ, có tinh thần trách nhiệm; nhược điểm là đôi khi hơi nóng vội.', page: 5 },
        ],
      },
      {
        id: 'd_q3_b01_2',
        titleCn: '2. 第二会话',
        titlePinyin: 'Dì èr huìhuà',
        titleVi: 'HỘI THOẠI 2: CHẾ ĐỘ LƯƠNG & THỬ VIỆC',
        pageStart: 6,
        pageEnd: 8,
        lines: [
          { id: 'q3_b01_d2_1', hanzi: '请问贵公司的试用期是多长时间？工资怎么算？', pinyin: 'Qǐngwèn guì gōngsī de shìyòngqī shì duō cháng shíjiān? Gōngzī zěnme suàn?', meaningVi: 'Xin hỏi thời gian thử việc của quý công ty là bao lâu? Tiền lương tính như thế nào?', page: 6 },
          { id: 'q3_b01_d2_2', hanzi: '试用期是一个月，试用期工资是正式工资的百分之八十五。', pinyin: 'Shìyòngqī shì yīgè yuè, shìyòngqī gōngzī shì zhèngshì gōngzī de bǎifēnzhī bāshíwǔ.', meaningVi: 'Thời gian thử việc là 1 tháng, lương thử việc bằng 85% lương chính thức.', page: 6 },
          { id: 'q3_b01_d2_3', hanzi: '转正以后公司给交社会保险和医疗保险吗？', pinyin: 'Zhuǎnzhèng yǐhòu gōngsī gěi jiāo shèhuì bǎoxiǎn hé yīliáo bǎoxiǎn ma?', meaningVi: 'Sau khi lên chính thức công ty có đóng bảo hiểm xã hội và bảo hiểm y tế không?', page: 7 },
          { id: 'q3_b01_d2_4', hanzi: '当然交，每个月还有全勤奖、餐补和住宿补贴。', pinyin: 'Dāngrán jiāo, měi gè yuè hái yǒu quánqínjiǎng, cānbǔ hé zhùsù bǔtiē.', meaningVi: 'Đương nhiên có đóng, mỗi tháng còn có thưởng chuyên cần, phụ cấp ăn trưa và phụ cấp nhà ở.', page: 7 },
          { id: 'q3_b01_d2_5', hanzi: '你什么时候可以来人事部报到？', pinyin: 'Nǐ shénme shíhòu kěyǐ lái rénshìbù bàodào?', meaningVi: 'Khi nào bạn có thể đến phòng Nhân sự nhận việc?', page: 8 },
          { id: 'q3_b01_d2_6', hanzi: '下个星期一我就可以正式上班，谢谢经理！', pinyin: 'Xià gè xīngqīyī wǒ jiù kěyǐ zhèngshì shàngbān, xièxiè jīnglǐ!', meaningVi: 'Thứ Hai tuần sau tôi có thể chính thức đi làm, cảm ơn giám đốc!', page: 8 },
        ],
      },
    ],
  },

  q3_bai_02: {
    sectionId: 'q3_bai_02',
    lessonExerciseId: 'q3_b02',
    lessonNumberLabel: 'Bài 2 (Q3)',
    themeColor: 'emerald',
    topicTag: 'Đóng gói, Kiểm hàng & Xuất kho',
    grammarCallouts: [],
    dialogues: [
      {
        id: 'd_q3_b02_1',
        titleCn: '1. 第一会话',
        titlePinyin: 'Dì yī huìhuà',
        titleVi: 'HỘI THOẠI 1: ĐÓNG GÓI HÀNG HÓA',
        pageStart: 13,
        pageEnd: 14,
        lines: [
          { id: 'q3_b02_d1_1', hanzi: '这批货明天上午就要出库了，包装好了没有？', pinyin: 'Zhè pī huò míngtiān shàngwǔ jiù yào chūkù le, bāozhuāng hǎole méiyǒu?', meaningVi: 'Lô hàng này sáng mai phải xuất kho rồi, đã đóng gói xong chưa?', page: 13 },
          { id: 'q3_b02_d1_2', hanzi: '正在包装呢，还差五十箱就全部包完了。', pinyin: 'Zhèngzài bāozhuāng ne, hái chà wǔshí xiāng jiù quánbù bāowán le.', meaningVi: 'Đang đóng gói đây, còn thiếu 50 thùng nữa là đóng xong toàn bộ.', page: 13 },
          { id: 'q3_b02_d1_3', hanzi: '包装的时候一定要贴好标签，用胶带封紧纸箱。', pinyin: 'Bāozhuāng de shíhòu yīdìng yào tiēhǎo biāoqiān, yòng jiāodài fēngjǐn zhǐxiāng.', meaningVi: 'Lúc đóng gói nhất định phải dán kỹ tem nhãn, dùng băng keo dán chặt thùng carton.', page: 14 },
          { id: 'q3_b02_d1_4', hanzi: '放心吧，质检员已经检查过质量了，全部合格。', pinyin: 'Fàngxīn ba, zhìjiǎnyuán yǐjīng jiǎncháguò zhìliàng le, quánbù hégé.', meaningVi: 'Yên tâm đi, nhân viên QC đã kiểm tra chất lượng rồi, toàn bộ đều đạt chuẩn.', page: 14 },
        ],
      },
      {
        id: 'd_q3_b02_2',
        titleCn: '2. 第二会话',
        titlePinyin: 'Dì èr huìhuà',
        titleVi: 'HỘI THOẠI 2: KIỂM KHO & ĐƠN XUẤT KHO',
        pageStart: 14,
        pageEnd: 15,
        lines: [
          { id: 'q3_b02_d2_1', hanzi: '所有出库单都必须有仓库主管和财务部的签字。', pinyin: 'Suǒyǒu chūkùdān dōu bìxū yǒu cāngkù zhǔguǎn hé cáiwùbù de qiānzì.', meaningVi: 'Tất cả phiếu xuất kho đều bắt buộc phải có chữ ký của chủ quản kho và phòng Tài vụ.', page: 15 },
          { id: 'q3_b02_d2_2', hanzi: '好的，我已经把数量核对清楚了，现在就拿去给主管签字。', pinyin: 'Hǎo de, wǒ yǐjīng bǎ shùliàng héduì qīngchǔ le, xiànzài jiù ná qù gěi zhǔguǎn qiānzì.', meaningVi: 'Vâng, tôi đã đối chiếu rõ số lượng rồi, bây giờ mang đi trình chủ quản ký ngay.', page: 15 },
        ],
      },
    ],
  },

  q3_bai_03: {
    sectionId: 'q3_bai_03',
    lessonExerciseId: 'q3_b03',
    lessonNumberLabel: 'Bài 3 (Q3)',
    themeColor: 'blue',
    topicTag: 'Phân công nhiệm vụ & Quản lý đơn hàng',
    grammarCallouts: [],
    dialogues: [
      {
        id: 'd_q3_b03_1',
        titleCn: '1. 第一会话',
        titlePinyin: 'Dì yī huìhuà',
        titleVi: 'HỘI THOẠI 1: NHIỆM VỤ CÔNG VIỆC',
        pageStart: 19,
        pageEnd: 20,
        lines: [
          { id: 'q3_b03_d1_1', hanzi: '主管，我是新来的助理，请问我的主要任务是什么？', pinyin: 'Zhǔguǎn, wǒ shì xīn lái de zhùlǐ, qǐngwèn wǒ de zhǔyào rènwù shì shénme?', meaningVi: 'Chủ quản ơi, tôi là trợ lý mới đến, xin hỏi nhiệm vụ chính của tôi là gì ạ?', page: 19 },
          { id: 'q3_b03_d1_2', hanzi: '你的任务是跟进客户的订单，并联系采购部准备原材料。', pinyin: 'Nǐ de rènwù shì gēnjìn kèhù de dìngdān, bìng liánxì cǎigòubù zhǔnbèi yuáncáiliào.', meaningVi: 'Nhiệm vụ của bạn là theo sát đơn hàng của khách và liên hệ bộ phận thu mua chuẩn bị nguyên vật liệu.', page: 20 },
          { id: 'q3_b03_d1_3', hanzi: '明白了，有不懂的地方我会及时向您请教。', pinyin: 'Míngbái le, yǒu bù dǒng de dìfāng wǒ huì jíshí xiàng nín qǐngjiào.', meaningVi: 'Tôi hiểu rồi, có chỗ nào chưa hiểu tôi sẽ kịp thời xin ý kiến ngài.', page: 20 },
        ],
      },
      {
        id: 'd_q3_b03_2',
        titleCn: '2. 第二会话',
        titlePinyin: 'Dì èr huìhuà',
        titleVi: 'HỘI THOẠI 2: TIẾN ĐỘ GIAO HÀNG',
        pageStart: 20,
        pageEnd: 22,
        lines: [
          { id: 'q3_b03_d2_1', hanzi: '客户催得很急，这批订单月底以前能准时交货吗？', pinyin: 'Kèhù cuī de hěn jí, zhè pī dìngdān yuèdǐ yǐqián néng zhǔnshí jiāohuò ma?', meaningVi: 'Khách hàng giục rất gấp, lô đơn hàng này trước cuối tháng có giao hàng đúng hạn được không?', page: 21 },
          { id: 'q3_b03_d2_2', hanzi: '只要原材料按时到齐，生产线加班两天就一定能完成。', pinyin: 'Zhǐyào yuáncáiliào ànshí dàoqí, shēngchǎnxiàn jiābān liǎng tiān jiù yīdìng néng wánchéng.', meaningVi: 'Chỉ cần nguyên vật liệu về đủ đúng hạn, dây chuyền sản xuất tăng ca 2 ngày là nhất định hoàn thành.', page: 21 },
        ],
      },
    ],
  },

  q3_bai_04: {
    sectionId: 'q3_bai_04',
    lessonExerciseId: 'q3_b04',
    lessonNumberLabel: 'Bài 4 (Q3)',
    themeColor: 'amber',
    topicTag: 'Nội quy công xưởng & An toàn lao động',
    grammarCallouts: [],
    dialogues: [
      {
        id: 'd_q3_b04_1',
        titleCn: '1. 第一会话',
        titlePinyin: 'Dì yī huìhuà',
        titleVi: 'HỘI THOẠI 1: QUY ĐỊNH TRONG XƯỞNG',
        pageStart: 26,
        pageEnd: 28,
        lines: [
          { id: 'q3_b04_d1_1', hanzi: '进车间工作以前，大家必须遵守工厂的规定。', pinyin: 'Jìn chējiān gōngzuò yǐqián, dàjiā bìxū zūnshǒu gōngchǎng de guīdìng.', meaningVi: 'Trước khi vào phân xưởng làm việc, mọi người bắt buộc phải tuân thủ quy định của nhà máy.', page: 26 },
          { id: 'q3_b04_d1_2', hanzi: '请问车间里有哪些重要规定？', pinyin: 'Qǐngwèn chējiān lǐ yǒu nǎxiē zhòngyào guīdìng?', meaningVi: 'Xin hỏi trong phân xưởng có những quy định quan trọng nào?', page: 27 },
          { id: 'q3_b04_d1_3', hanzi: '上班必须穿厂服、戴厂牌，车间内严禁抽烟和玩手机。', pinyin: 'Shàngbān bìxū chuān chǎngfú, dài chǎngpái, chējiān nèi yánjìn chōuyān hé wán shǒujī.', meaningVi: 'Đi làm phải mặc đồng phục, đeo thẻ nhân viên, trong xưởng nghiêm cấm hút thuốc và nghịch điện thoại.', page: 27 },
          { id: 'q3_b04_d1_4', hanzi: '如果违反规定会被扣钱或者罚款吗？', pinyin: 'Rúguǒ wéifǎn guīdìng huì bèi kòuqián huòzhě fákuǎn ma?', meaningVi: 'Nếu vi phạm quy định có bị trừ tiền hay phạt tiền không?', page: 28 },
          { id: 'q3_b04_d1_5', hanzi: '第一次警告，第二次就会扣奖金。', pinyin: 'Dì yī cì jǐnggào, dì èr cì jiù huì kòu jiǎngjīn.', meaningVi: 'Lần đầu cảnh cáo, lần thứ hai sẽ trừ tiền thưởng.', page: 28 },
        ],
      },
      {
        id: 'd_q3_b04_2',
        titleCn: '2. 第二会话',
        titlePinyin: 'Dì èr huìhuà',
        titleVi: 'HỘI THOẠI 2: BẢO DƯỠNG MÁY MÓC',
        pageStart: 28,
        pageEnd: 29,
        lines: [
          { id: 'q3_b04_d2_1', hanzi: '这台机器坏了，操作的时候一定要先看使用说明书。', pinyin: 'Zhè tái jīqì huàile, cāozuò de shíhòu yīdìng yào xiān kàn shǐyòng shuōmíngshū.', meaningVi: 'Cỗ máy này hỏng rồi, lúc vận hành nhất định phải xem kỹ hướng dẫn sử dụng trước.', page: 28 },
          { id: 'q3_b04_d2_2', hanzi: '我已经通知维修部来修理了。', pinyin: 'Wǒ yǐjīng tōngzhī wéixiūbù lái xiūlǐ le.', meaningVi: 'Tôi đã thông báo cho bộ phận bảo trì tới sửa chữa rồi.', page: 29 },
        ],
      },
    ],
  },

  q3_bai_05: {
    sectionId: 'q3_bai_05',
    lessonExerciseId: 'q3_b05',
    lessonNumberLabel: 'Bài 5 (Q3)',
    themeColor: 'rose',
    topicTag: 'Xử lý sự cố, Xin nghỉ phép & Nhận lỗi',
    grammarCallouts: [],
    dialogues: [
      {
        id: 'd_q3_b05_1',
        titleCn: '1. 第一会话',
        titlePinyin: 'Dì yī huìhuà',
        titleVi: 'HỘI THOẠI 1: NHẬN LỖI & KHẮC PHỤC',
        pageStart: 33,
        pageEnd: 35,
        lines: [
          { id: 'q3_b05_d1_1', hanzi: '班长，对不起，这批产品的数据我填错了。', pinyin: 'Bānzhǎng, duìbùqǐ, zhè pī chǎnpǐn de shùjù wǒ tiáncuò le.', meaningVi: 'Tổ trưởng ơi, xin lỗi, số liệu của lô sản phẩm này tôi điền sai mất rồi.', page: 33 },
          { id: 'q3_b05_d1_2', hanzi: '你怎么这么粗心！我不是提醒过你要仔细核对吗？', pinyin: 'Nǐ zěnme zhème cūxīn! Wǒ bùshì tíxǐngguò nǐ yào zǐxì héduì ma?', meaningVi: 'Sao bạn bất cẩn thế! Chẳng phải tôi đã nhắc bạn phải đối chiếu kỹ rồi sao?', page: 34 },
          { id: 'q3_b05_d1_3', hanzi: '我真的知道错了，因为昨晚加班太困了，我现在马上重新处理。', pinyin: 'Wǒ zhēn de zhīdào cuòle, yīnwèi zuówǎn jiābān tài kùn le, wǒ xiànzài mǎshàng chóngxīn chǔlǐ.', meaningVi: 'Tôi thật sự biết lỗi rồi, vì tối qua tăng ca buồn ngủ quá, bây giờ tôi xử lý lại ngay lập tức.', page: 35 },
        ],
      },
      {
        id: 'd_q3_b05_2',
        titleCn: '2. 第二会话',
        titlePinyin: 'Dì èr huìhuà',
        titleVi: 'HỘI THOẠI 2: XIN NGHỈ ỐM & NGHỈ THAI SẢN',
        pageStart: 35,
        pageEnd: 37,
        lines: [
          { id: 'q3_b05_d2_1', hanzi: '组长，我今天身体不舒服，想请一天病假。', pinyin: 'Zǔzhǎng, wǒ jīntiān shēntǐ bù shūfú, xiǎng qǐng yī tiān bìngjià.', meaningVi: 'Tổ trưởng ơi, hôm nay trong người tôi không khỏe, muốn xin nghỉ ốm 1 ngày.', page: 36 },
          { id: 'q3_b05_d2_2', hanzi: '好，你把医院的证明附在请假单上交给人资部吧。', pinyin: 'Hǎo, nǐ bǎ yīyuàn de zhèngmíng fù zài qǐngjiàdān shàng jiāo gěi rénzībù ba.', meaningVi: 'Được, bạn đính kèm giấy khám bệnh của bệnh viện vào đơn xin nghỉ rồi nộp cho phòng Nhân sự nhé.', page: 36 },
        ],
      },
    ],
  },

  q3_bai_06: {
    sectionId: 'q3_bai_06',
    lessonExerciseId: 'q3_b06',
    lessonNumberLabel: 'Bài 6 (Q3)',
    themeColor: 'emerald',
    topicTag: 'Chấm công, Giải quyết vấn đề nhà máy & Mẫu câu',
    grammarCallouts: [],
    dialogues: [
      {
        id: 'd_q3_b06_1',
        titleCn: '1. 第一会话',
        titlePinyin: 'Dì yī huìhuà',
        titleVi: 'HỘI THOẠI 1 & 2: VẤN ĐỀ NHÀ MÁY',
        pageStart: 42,
        pageEnd: 45,
        lines: [
          { id: 'q3_b06_d1_1', hanzi: '今天早上你为什么忘记打卡了？', pinyin: 'Jīntiān zǎoshang nǐ wèishénme wàngjì dǎkǎ le?', meaningVi: 'Sáng nay tại sao bạn lại quên chấm công (dập thẻ)?', page: 42 },
          { id: 'q3_b06_d1_2', hanzi: '因为路上堵车，我怕迟到就急着进车间，忘了打卡。', pinyin: 'Yīnwèi lùshàng dǔchē, wǒ pà chídào jiù jízhe jìn chējiān, wàngle dǎkǎ.', meaningVi: 'Vì trên đường kẹt xe, tôi sợ đi muộn nên vội vào xưởng, quên mất bấm thẻ.', page: 43 },
          { id: 'q3_b06_d1_3', hanzi: '今天下午有重要客户来参观工厂，大家要把车间打扫干净。', pinyin: 'Jīntiān xiàwǔ yǒu zhòngyào kèhù lái cānguān gōngchǎng, dàjiā yào bǎ chējiān dǎsǎo gānjìng.', meaningVi: 'Chiều nay có khách hàng quan trọng đến tham quan nhà máy, mọi người hãy quét dọn phân xưởng sạch sẽ.', page: 44 },
          { id: 'q3_b06_d1_4', hanzi: '我向您保证，一定在两点以前全部整理好！', pinyin: 'Wǒ xiàng nín bǎozhèng, yīdìng zài liǎng diǎn yǐqián quánbù zhěnglǐ hǎo!', meaningVi: 'Tôi cam đoan với ngài, nhất định trước 2 giờ sẽ sắp xếp gọn gàng toàn bộ!', page: 45 },
        ],
      },
      {
        id: 'd_q3_b06_2',
        titleCn: 'III. 课文：Kèwén',
        titlePinyin: 'Chángyòng jùxíng',
        titleVi: 'MẪU CÂU THÔNG DỤNG (TRANG 46–47)',
        pageStart: 46,
        pageEnd: 47,
        lines: [
          { id: 'q3_b06_mc_1', hanzi: '1. 年底工厂的订单非常多，每天都要加班到九点。', pinyin: 'Niándǐ gōngchǎng de dìngdān fēicháng duō, měitiān dōu yào jiābān dào jiǔ diǎn.', meaningVi: 'Cuối năm đơn hàng của nhà máy rất nhiều, ngày nào cũng phải tăng ca đến 9 giờ.', page: 46 },
          { id: 'q3_b06_mc_2', hanzi: '2. 同事之间应该互相帮助，不要因为小事吵架。', pinyin: 'Tóngshì zhījiān yīnggāi hùxiāng bāngzhù, bùyào yīnwèi xiǎoshì chǎojià.', meaningVi: 'Giữa đồng nghiệp với nhau nên giúp đỡ lẫn nhau, đừng vì chuyện nhỏ mà cãi nhau.', page: 46 },
          { id: 'q3_b06_mc_3', hanzi: '3. 这批货好像有一点儿色差，请再检查一遍。', pinyin: 'Zhè pī huò hǎoxiàng yǒu yīdiǎnr sèchā, qǐng zài jiǎnchá yī biàn.', meaningVi: 'Lô hàng này hình như hơi lệch màu một chút, xin hãy kiểm tra lại một lần nữa.', page: 47 },
        ],
      },
    ],
  },

  q3_bai_07: {
    sectionId: 'q3_bai_07',
    lessonExerciseId: 'q3_b07',
    lessonNumberLabel: 'Bài 7 (Q3)',
    themeColor: 'blue',
    topicTag: 'Trách nhiệm quản lý & Xử lý công việc',
    grammarCallouts: [],
    dialogues: [
      {
        id: 'd_q3_b07_1',
        titleCn: '1. 第一会话',
        titlePinyin: 'Dì yī huìhuà',
        titleVi: 'HỘI THOẠI 1 & 2: QUẢN LÝ CÔNG VIỆC',
        pageStart: 51,
        pageEnd: 55,
        lines: [
          { id: 'q3_b07_d1_1', hanzi: '仓库的这些事都是你自己管的，出了问题你要负责。', pinyin: 'Cāngkù de zhèxiē shì dōu shì nǐ zìjǐ guǎn de, chūle wèntí nǐ yào fùzé.', meaningVi: 'Những việc này ở kho đều do tự bạn quản lý, xảy ra vấn đề bạn phải chịu trách nhiệm.', page: 51 },
          { id: 'q3_b07_d1_2', hanzi: '我已经把所有合同扫描成电子版发给客户了。', pinyin: 'Wǒ yǐjīng bǎ suǒyǒu hétóng sǎomiáo chéng diànzǐbǎn fā gěi kèhù le.', meaningVi: 'Tôi đã scan tất cả hợp đồng thành bản điện tử gửi cho khách hàng rồi.', page: 53 },
          { id: 'q3_b07_d1_3', hanzi: '现在已经五点半了，再不出发就来不及赶飞机了。', pinyin: 'Xiànzài yǐjīng wǔ diǎn bàn le, zài bù chūfā jiù láibùjí gǎn fēijī le.', meaningVi: 'Bây giờ đã 5 giờ rưỡi rồi, còn không xuất phát thì không kịp chuyến bay nữa.', page: 55 },
        ],
      },
      {
        id: 'd_q3_b07_2',
        titleCn: 'III. 课文：Kèwén',
        titlePinyin: 'Chángyòng jùxíng',
        titleVi: 'MẪU CÂU THÔNG DỤNG (TRANG 56–57)',
        pageStart: 56,
        pageEnd: 57,
        lines: [
          { id: 'q3_b07_mc_1', hanzi: '1. 疫情期间，进入厂区必须戴口罩、量体温。', pinyin: 'Yìqíng qījiān, jìnrù chǎngqū bìxū dài kǒuzhào, liáng tǐwēn.', meaningVi: 'Trong thời gian dịch bệnh, vào khu vực nhà máy bắt buộc phải đeo khẩu trang, đo thân nhiệt.', page: 56 },
          { id: 'q3_b07_mc_2', hanzi: '2. 这个问题暂时还没有解决的办法，我们要开会讨论。', pinyin: 'Zhège wèntí zànshí hái méiyǒu jiějué de bànfǎ, wǒmen yào kāihuì tǎolùn.', meaningVi: 'Vấn đề này tạm thời vẫn chưa có cách giải quyết, chúng ta phải họp bàn bạc.', page: 56 },
        ],
      },
    ],
  },

  q3_bai_08: {
    sectionId: 'q3_bai_08',
    lessonExerciseId: 'q3_b08',
    lessonNumberLabel: 'Bài 8 (Q3)',
    themeColor: 'rose',
    topicTag: 'An toàn lao động, Đào tạo & Thăng chức',
    grammarCallouts: [],
    dialogues: [
      {
        id: 'd_q3_b08_1',
        titleCn: '1. 第一会话',
        titlePinyin: 'Dì yī huìhuà',
        titleVi: 'HỘI THOẠI 1 & 2: AN TOÀN & ĐÀO TẠO',
        pageStart: 61,
        pageEnd: 64,
        lines: [
          { id: 'q3_b08_d1_1', hanzi: '不好了！阿明在操作机器的时候不小心受伤了！', pinyin: 'Bù hǎole! Ā Míng zài cāozuò jīqì de shíhòu bù xiǎoxīn shòushāng le!', meaningVi: 'Không xong rồi! A Minh trong lúc vận hành máy móc không cẩn thận bị thương rồi!', page: 61 },
          { id: 'q3_b08_d1_2', hanzi: '快送他去医务室包扎，新员工一定要先参加安全培训才能上岗。', pinyin: 'Kuài sòng tā qù yīwùshì bāozā, xīn yuángōng yīdìng yào xiān cānjiā ānquán péixùn cáinéng shànggǎng.', meaningVi: 'Mau đưa cậu ấy tới phòng y tế băng bó, nhân viên mới nhất định phải tham gia đào tạo an toàn trước mới được đứng máy.', page: 62 },
          { id: 'q3_b08_d1_3', hanzi: '如果表现优秀的话，年底你就有机会升职加薪。', pinyin: 'Rúguǒ biǎoxiàn yōuxiù dehuà, niándǐ nǐ jiù yǒu jīhuì shēngzhí jiāxīn.', meaningVi: 'Nếu biểu hiện xuất sắc, cuối năm bạn sẽ có cơ hội thăng chức tăng lương.', page: 64 },
        ],
      },
      {
        id: 'd_q3_b08_2',
        titleCn: 'III. 课文：Kèwén',
        titlePinyin: 'Chángyòng jùxíng',
        titleVi: 'MẪU CÂU THÔNG DỤNG (TRANG 65–66)',
        pageStart: 65,
        pageEnd: 66,
        lines: [
          { id: 'q3_b08_mc_1', hanzi: '1. 你提出的建议非常合理，公司决定采纳。', pinyin: 'Nǐ tíchū de jiànyì fēicháng hélǐ, gōngsī juédìng cǎinà.', meaningVi: 'Kiến nghị bạn đưa ra vô cùng hợp lý, công ty quyết định tiếp nhận.', page: 65 },
          { id: 'q3_b08_mc_2', hanzi: '2. 请量一下这张办公桌的长度和宽度。', pinyin: 'Qǐng liáng yīxià zhè zhāng bàngōngzhuō de chángdù hé kuāndù.', meaningVi: 'Xin hãy đo chiều dài và chiều rộng của chiếc bàn làm việc này một chút.', page: 66 },
        ],
      },
    ],
  },

  q3_bai_09: {
    sectionId: 'q3_bai_09',
    lessonExerciseId: 'q3_b09',
    lessonNumberLabel: 'Bài 9 (Q3)',
    themeColor: 'amber',
    topicTag: 'Sản lượng, Chỉ tiêu & Thái độ làm việc',
    grammarCallouts: [],
    dialogues: [
      {
        id: 'd_q3_b09_1',
        titleCn: '1. 第一会话',
        titlePinyin: 'Dì yī huìhuà',
        titleVi: 'HỘI THOẠI 1 & 2: SẢN LƯỢNG & CHỈ TIÊU',
        pageStart: 70,
        pageEnd: 74,
        lines: [
          { id: 'q3_b09_d1_1', hanzi: '今天我们生产线的产量又没有达标，原因是什么？', pinyin: 'Jīntiān wǒmen shēngchǎnxiàn de chǎnliàng yòu méiyǒu dábiāo, yuányīn shì shénme?', meaningVi: 'Hôm nay sản lượng dây chuyền sản xuất của chúng ta lại không đạt chỉ tiêu, nguyên nhân là gì?', page: 70 },
          { id: 'q3_b09_d1_2', hanzi: '因为上午停电了一个小时，而且有两位熟练工请假了。', pinyin: 'Yīnwèi shàngwǔ tíngdiànle yīgè xiǎoshí, érqiě yǒu liǎng wèi shúliàngōng qǐngjià le.', meaningVi: 'Bởi vì buổi sáng mất điện 1 tiếng, hơn nữa có 2 công nhân lành nghề xin nghỉ phép.', page: 71 },
          { id: 'q3_b09_d1_3', hanzi: '工作态度决定一切，大家一定要认真负责。', pinyin: 'Gōngzuò tàidù juédìng yīqiè, dàjiā yīdìng yào rènzhēn fùzé.', meaningVi: 'Thái độ làm việc quyết định tất cả, mọi người nhất định phải nghiêm túc có trách nhiệm.', page: 73 },
        ],
      },
      {
        id: 'd_q3_b09_2',
        titleCn: 'III. 课文：Kèwén',
        titlePinyin: 'Chángyòng jùxíng',
        titleVi: 'MẪU CÂU THÔNG DỤNG (TRANG 74–75)',
        pageStart: 74,
        pageEnd: 75,
        lines: [
          { id: 'q3_b09_mc_1', hanzi: '1. 经过三个月的努力，我们终于完成了这个项目。', pinyin: 'Jīngguò sān gè yuè de nǔlì, wǒmen zhōngyú wánchéngle zhège xiàngmù.', meaningVi: 'Trải qua 3 tháng nỗ lực, chúng tôi cuối cùng đã hoàn thành dự án này.', page: 74 },
          { id: 'q3_b09_mc_2', hanzi: '2. 车间温度太高，有个工人差点儿晕倒了。', pinyin: 'Chējiān wēndù tài gāo, yǒu gè gōngrén chàdiǎnr yūndǎo le.', meaningVi: 'Nhiệt độ trong xưởng cao quá, có một công nhân suýt nữa bị ngất xỉu.', page: 75 },
        ],
      },
    ],
  },

  q3_bai_10: {
    sectionId: 'q3_bai_10',
    lessonExerciseId: 'q3_b10',
    lessonNumberLabel: 'Bài 10 (Q3)',
    themeColor: 'emerald',
    topicTag: 'Đánh giá công việc, Thủ tục đăng ký & Kiên trì',
    grammarCallouts: [],
    dialogues: [
      {
        id: 'd_q3_b10_1',
        titleCn: '1. 第一会话',
        titlePinyin: 'Dì yī huìhuà',
        titleVi: 'HỘI THOẠI 1 & 2: NỖ LỰC & ĐÁNG GIÁ',
        pageStart: 79,
        pageEnd: 83,
        lines: [
          { id: 'q3_b10_d1_1', hanzi: '虽然每天工作都很辛苦，但是看到自己的进步，我觉得一切都值得。', pinyin: 'Suīrán měitiān gōngzuò dōu hěn xīnkǔ, dànshì kàndào zìjǐ de jìnbù, wǒ juédé yīqiè dōu zhídé.', meaningVi: 'Tuy mỗi ngày làm việc đều rất vất vả, nhưng nhìn thấy sự tiến bộ của bản thân, tôi cảm thấy tất cả đều xứng đáng.', page: 79 },
          { id: 'q3_b10_d1_2', hanzi: '不管遇到什么困难，我们都不要轻易放弃。', pinyin: 'Bùguǎn yùdào shénme kùnnán, wǒmen dōu bùyào qīngyì fàngqì.', meaningVi: 'Bất kể gặp phải khó khăn gì, chúng ta đều đừng dễ dàng từ bỏ.', page: 81 },
          { id: 'q3_b10_d1_3', hanzi: '外来人员进厂必须在保安室登记身份证。', pinyin: 'Wàilái rényuán jìn chǎng bìxū zài bǎo’ānshì dēngjì shēnfènzhèng.', meaningVi: 'Người ngoài vào nhà máy bắt buộc phải đăng ký chứng minh nhân dân tại phòng bảo vệ.', page: 82 },
        ],
      },
      {
        id: 'd_q3_b10_2',
        titleCn: 'III. 课文：Kèwén',
        titlePinyin: 'Chángyòng jùxíng',
        titleVi: 'MẪU CÂU THÔNG DỤNG (TRANG 83–84)',
        pageStart: 83,
        pageEnd: 84,
        lines: [
          { id: 'q3_b10_mc_1', hanzi: '1. 总之，我们要保证产品质量稳定，按时交货。', pinyin: 'Zǒngzhī, wǒmen yào bǎozhèng chǎnpǐn zhìliàng wěndìng, ànshí jiāohuò.', meaningVi: 'Tóm lại, chúng ta phải đảm bảo chất lượng sản phẩm ổn định, giao hàng đúng hẹn.', page: 83 },
          { id: 'q3_b10_mc_2', hanzi: '2. 今年经济不太好，有些公司开始裁员了。', pinyin: 'Jīnnián jīngjì bù tài hǎo, yǒuxiē gōngsī kāishǐ cáiyuán le.', meaningVi: 'Năm nay kinh tế không tốt lắm, một số công ty bắt đầu cắt giảm nhân sự rồi.', page: 84 },
        ],
      },
    ],
  },

  q3_bai_11: {
    sectionId: 'q3_bai_11',
    lessonExerciseId: 'q3_b11',
    lessonNumberLabel: 'Bài 11 (Q3)',
    themeColor: 'blue',
    topicTag: 'Họp bàn, Đóng góp ý kiến & Liên lạc WeChat',
    grammarCallouts: [],
    dialogues: [
      {
        id: 'd_q3_b11_1',
        titleCn: '1. 第一会话',
        titlePinyin: 'Dì yī huìhuà',
        titleVi: 'HỘI THOẠI 1 & 2: ĐÓNG GÓP Ý KIẾN',
        pageStart: 89,
        pageEnd: 92,
        lines: [
          { id: 'q3_b11_d1_1', hanzi: '在今天的会议上，大家的意见都一样重要，请畅所欲言。', pinyin: 'Zài jīntiān de huìyì shàng, dàjiā de yìjiàn dōu yīyàng zhòngyào, qǐng chàngsuǒyùyán.', meaningVi: 'Trong cuộc họp hôm nay, ý kiến của mọi người đều quan trọng như nhau, xin hãy thoải mái phát biểu.', page: 89 },
          { id: 'q3_b11_d1_2', hanzi: '第一次跟总经理汇报工作，我心里有一点儿紧张。', pinyin: 'Dì yī cì gēn zǒngjīnglǐ huìbào gōngzuò, wǒ xīnlǐ yǒu yīdiǎnr jǐnzhāng.', meaningVi: 'Lần đầu tiên báo cáo công việc với Tổng giám đốc, trong lòng tôi hơi hồi hộp một chút.', page: 90 },
          { id: 'q3_b11_d1_3', hanzi: '请把这份重要报表保存在电脑里，然后发到微信工作群。', pinyin: 'Qǐng bǎ zhè fèn zhòngyào bàobiǎo bǎocún zài diànnǎo lǐ, ránhòu fā dào Wēixìn gōngzuòqún.', meaningVi: 'Xin hãy lưu bảng báo cáo quan trọng này vào máy tính, sau đó gửi vào nhóm WeChat công việc.', page: 92 },
        ],
      },
      {
        id: 'd_q3_b11_2',
        titleCn: 'III. 课文：Kèwén',
        titlePinyin: 'Chángyòng jùxíng',
        titleVi: 'MẪU CÂU THÔNG DỤNG (TRANG 93–94)',
        pageStart: 93,
        pageEnd: 94,
        lines: [
          { id: 'q3_b11_mc_1', hanzi: '1. 他在中国留学过四年，怪不得汉语说得这么地道！', pinyin: 'Tā zài Zhōngguó liúxuéguò sì nián, guàibùdé Hànyǔ shuō de zhème dìdào!', meaningVi: 'Anh ấy từng du học ở Trung Quốc 4 năm, thảo nào tiếng Hán nói chuẩn bản xứ như vậy!', page: 93 },
          { id: 'q3_b11_mc_2', hanzi: '2. 我很羡慕她有一份既稳定工资又高的工作。', pinyin: 'Wǒ hěn xiànmù tā yǒu yī fèn jì wěndìng gōngzī yòu gāo de gōngzuò.', meaningVi: 'Tôi rất ngưỡng mộ cô ấy có một công việc vừa ổn định lương lại cao.', page: 94 },
        ],
      },
    ],
  },

  q3_bai_12: {
    sectionId: 'q3_bai_12',
    lessonExerciseId: 'q3_b12',
    lessonNumberLabel: 'Bài 12 (Q3)',
    themeColor: 'amber',
    topicTag: 'Hệ thống máy tính, Mật khẩu & Văn phòng',
    grammarCallouts: [],
    dialogues: [
      {
        id: 'd_q3_b12_1',
        titleCn: '1. 第一会话',
        titlePinyin: 'Dì yī huìhuà',
        titleVi: 'HỘI THOẠI 1 & 2: HỆ THỐNG & MẬT KHẨU',
        pageStart: 98,
        pageEnd: 102,
        lines: [
          { id: 'q3_b12_d1_1', hanzi: '我的电脑进不去公司系统了，不知道是怎么回事。', pinyin: 'Wǒ de diànnǎo jìn bù qù gōngsī xìtǒng le, bù zhīdào shì zěnme huí shì.', meaningVi: 'Máy tính của tôi không vào được hệ thống công ty nữa, không biết là bị làm sao.', page: 98 },
          { id: 'q3_b12_d1_2', hanzi: '你输入的密码正确吗？注意大小写字母。', pinyin: 'Nǐ shūrù de mìmǎ zhèngquè ma? Zhùyì dàxiǎoxiě zìmǔ.', meaningVi: 'Mật khẩu bạn nhập có đúng không? Chú ý chữ hoa và chữ thường.', page: 99 },
          { id: 'q3_b12_d1_3', hanzi: '备用钥匙放在办公桌第二个抽屉里，下班记得锁好门。', pinyin: 'Bèiyòng yàoshi fàng zài bàngōngzhuō dì èr gè chōutì lǐ, xiàbān jìdé suǒhǎo mén.', meaningVi: 'Chìa khóa dự phòng để trong ngăn kéo thứ hai của bàn làm việc, tan ca nhớ khóa kỹ cửa.', page: 101 },
        ],
      },
      {
        id: 'd_q3_b12_2',
        titleCn: 'III. 课文：Kèwén',
        titlePinyin: 'Chángyòng jùxíng',
        titleVi: 'MẪU CÂU THÔNG DỤNG (TRANG 102–103)',
        pageStart: 102,
        pageEnd: 103,
        lines: [
          { id: 'q3_b12_mc_1', hanzi: '1. 请把深色和浅色的布料分开放在不同的货架上。', pinyin: 'Qǐng bǎ shēnsè hé qiǎnsè de bùliào fēnkāi fàng zài bùtóng de huòjià shàng.', meaningVi: 'Xin hãy tách riêng vải màu đậm và màu nhạt đặt lên các kệ hàng khác nhau.', page: 102 },
          { id: 'q3_b12_mc_2', hanzi: '2. 今天我还有事，改天我再请你喝咖啡吧。', pinyin: 'Jīntiān wǒ hái yǒushì, gǎitiān wǒ zài qǐng nǐ hē kāfēi ba.', meaningVi: 'Hôm nay tôi còn bận việc, hôm khác tôi mời bạn uống cà phê nhé.', page: 103 },
        ],
      },
    ],
  },

  q3_bai_13: {
    sectionId: 'q3_bai_13',
    lessonExerciseId: 'q3_b13',
    lessonNumberLabel: 'Bài 13 (Q3)',
    themeColor: 'emerald',
    topicTag: 'In ấn bao bì, Kích thước vải & Công đoạn sản xuất',
    grammarCallouts: [],
    dialogues: [
      {
        id: 'd_q3_b13_1',
        titleCn: '1. 第一会话',
        titlePinyin: 'Dì yī huìhuà',
        titleVi: 'HỘI THOẠI 1 & 2: IN ẤN & KÍCH THƯỚC SẢN PHẨM',
        pageStart: 108,
        pageEnd: 111,
        lines: [
          { id: 'q3_b13_d1_1', hanzi: '你们车间经常印多大的纸板？尺寸是多少？', pinyin: 'Nǐmen chējiān jīngcháng yìn duōdà de zhǐbǎn? Chǐcùn shì duōshǎo?', meaningVi: 'Phân xưởng các bạn thường in tấm bìa cỡ bao nhiêu? Kích thước là bao nhiêu?', page: 108 },
          { id: 'q3_b13_d1_2', hanzi: '要看客户订单的要求，宽度和长度都有明确的标准。', pinyin: 'Yào kàn kèhù dìngdān de yāoqiú, kuāndù hé chángdù dōu yǒu míngquè de biāozhǔn.', meaningVi: 'Phải xem yêu cầu đơn hàng của khách, chiều rộng và chiều dài đều có tiêu chuẩn rõ ràng.', page: 109 },
          { id: 'q3_b13_d1_3', hanzi: '这张图纸印得太模糊了，看不清楚数字，请重新打印一张。', pinyin: 'Zhè zhāng túzhǐ yìn de tài móhú le, kàn bù qīngchǔ shùzì, qǐng chóngxīn dǎyìn yī zhāng.', meaningVi: 'Bản vẽ này in bị mờ quá, nhìn không rõ con số, xin hãy in lại một bản khác.', page: 110 },
          { id: 'q3_b13_d1_4', hanzi: '这种面料手感很好，非常适合做高档衬衫。', pinyin: 'Zhè zhǒng miànliào shǒugǎn hěn hǎo, fēicháng Shìhé zuò gāodàng chènshān.', meaningVi: 'Loại vải này sờ rất mịn tay, vô cùng thích hợp để may áo sơ mi cao cấp.', page: 111 },
        ],
      },
    ],
  },

  // ================= 10 CHUYÊN ĐỀ TỪ VỰNG CHUYÊN NGÀNH (QUYỂN 3: TRANG 113–159) =================
  q3_từ_vựng_về_văn_phòng_và_màu_sắc: {
    sectionId: 'q3_từ_vựng_về_văn_phòng_và_màu_sắc',
    lessonExerciseId: '',
    lessonNumberLabel: 'Chuyên ngành 1',
    themeColor: 'purple',
    topicTag: 'Từ vựng Văn phòng phẩm & Màu sắc thông dụng',
    grammarCallouts: [],
    dialogues: [],
  },
  q3_từ_vựng_chuyên_ngành_dệt_may_nhuộm: {
    sectionId: 'q3_từ_vựng_chuyên_ngành_dệt_may_nhuộm',
    lessonExerciseId: '',
    lessonNumberLabel: 'Chuyên ngành 2',
    themeColor: 'purple',
    topicTag: 'Từ vựng Chuyên ngành Dệt may & In nhuộm',
    grammarCallouts: [],
    dialogues: [],
  },
  q3_từ_vựng_chuyên_ngành_giày_da: {
    sectionId: 'q3_từ_vựng_chuyên_ngành_giày_da',
    lessonExerciseId: '',
    lessonNumberLabel: 'Chuyên ngành 3',
    themeColor: 'purple',
    topicTag: 'Từ vựng Chuyên ngành Sản xuất Giày da',
    grammarCallouts: [],
    dialogues: [],
  },
  q3_từ_vựng_chuyên_ngành_xuất_nhập_khẩu: {
    sectionId: 'q3_từ_vựng_chuyên_ngành_xuất_nhập_khẩu',
    lessonExerciseId: '',
    lessonNumberLabel: 'Chuyên ngành 4',
    themeColor: 'purple',
    topicTag: 'Từ vựng Chuyên ngành Xuất nhập khẩu & Hải quan',
    grammarCallouts: [],
    dialogues: [],
  },
  q3_từ_vựng_chuyên_ngành_kế_toán: {
    sectionId: 'q3_từ_vựng_chuyên_ngành_kế_toán',
    lessonExerciseId: '',
    lessonNumberLabel: 'Chuyên ngành 5',
    themeColor: 'purple',
    topicTag: 'Từ vựng Chuyên ngành Tài chính – Kế toán – Thuế',
    grammarCallouts: [],
    dialogues: [],
  },
  q3_từ_vựng_chuyên_ngành_hóa_nghiệm: {
    sectionId: 'q3_từ_vựng_chuyên_ngành_hóa_nghiệm',
    lessonExerciseId: '',
    lessonNumberLabel: 'Chuyên ngành 6',
    themeColor: 'purple',
    topicTag: 'Từ vựng Chuyên ngành Hóa nghiệm & Phòng thí nghiệm',
    grammarCallouts: [],
    dialogues: [],
  },
  q3_từ_vựng_chuyên_ngành_thiết_bị_điện_tử: {
    sectionId: 'q3_từ_vựng_chuyên_ngành_thiết_bị_điện_tử',
    lessonExerciseId: '',
    lessonNumberLabel: 'Chuyên ngành 7',
    themeColor: 'purple',
    topicTag: 'Từ vựng Chuyên ngành Thiết bị Điện tử & Linh kiện',
    grammarCallouts: [],
    dialogues: [],
  },
  q3_từ_vựng_chuyên_ngành_xây_dựng: {
    sectionId: 'q3_từ_vựng_chuyên_ngành_xây_dựng',
    lessonExerciseId: '',
    lessonNumberLabel: 'Chuyên ngành 8',
    themeColor: 'purple',
    topicTag: 'Từ vựng Chuyên ngành Xây dựng & Công trình',
    grammarCallouts: [],
    dialogues: [],
  },
  q3_từ_vựng_chuyên_ngành_con_người: {
    sectionId: 'q3_từ_vựng_chuyên_ngành_con_người',
    lessonExerciseId: '',
    lessonNumberLabel: 'Chuyên ngành 9',
    themeColor: 'purple',
    topicTag: 'Từ vựng Miêu tả Con người, Ngoại hình & Tính cách',
    grammarCallouts: [],
    dialogues: [],
  },
  q3_từ_vựng_chuyên_ngành_rau_củ_quả: {
    sectionId: 'q3_từ_vựng_chuyên_ngành_rau_củ_quả',
    lessonExerciseId: '',
    lessonNumberLabel: 'Chuyên ngành 10',
    themeColor: 'purple',
    topicTag: 'Từ vựng Chuyên đề Rau củ quả & Thực phẩm',
    grammarCallouts: [],
    dialogues: [],
  },
};

/**
 * Normalize Quyển 2 TextbookDataRaw so section IDs are scoped (`q2_*`),
 * clean Vietnamese titles are set, `q2_bai_ngu_phap_3` (pages 57-64) is inserted,
 * and `BOOK2_SUPPLEMENTARY_VOCAB_PAGES_117_119` is added for pages 117-119.
 */
export function normalizeBook2TextbookData(
  raw: TextbookDataRaw,
  exRaw?: ExercisesDataRaw,
  extraExPageMap?: Record<string, number>
): TextbookDataRaw {
  const cleanMeta: Record<
    string,
    { id: string; title_cn: string; title_pinyin: string; title_vi: string }
  > = {
    bai_13: {
      id: 'q2_bai_13',
      title_cn: '第十三课：我想订机票！',
      title_pinyin: 'Dì shísān kè: Wǒ xiǎng dìng jīpiào!',
      title_vi: 'TÔI MUỐN ĐẶT VÉ MÁY BAY!',
    },
    bài_ngữ_pháp_2: {
      id: 'q2_bai_ngu_phap_2',
      title_cn: '语法复习（二）',
      title_pinyin: 'Yǔfǎ fùxí (èr)',
      title_vi: 'BÀI NGỮ PHÁP 2 (TỔNG ÔN)',
    },
    bai_14: {
      id: 'q2_bai_14',
      title_cn: '第十四课：这儿不是中药！',
      title_pinyin: "Dì shísì kè: Zhè'r bù shì zhōngyào!",
      title_vi: 'ĐÂY KHÔNG PHẢI THUỐC ĐÔNG Y!',
    },
    bai_15: {
      id: 'q2_bai_15',
      title_cn: '第十五课：我迷路了！',
      title_pinyin: 'Dì shíwǔ kè: Wǒ mílù le!',
      title_vi: 'TÔI LẠC ĐƯỜNG RỒI!',
    },
    bai_16: {
      id: 'q2_bai_16',
      title_cn: '第十六课：我汉语学得不好！',
      title_pinyin: 'Dì shíliù kè: Wǒ Hànyǔ xué de bù hǎo!',
      title_vi: 'TÔI HỌC TIẾNG TRUNG KHÔNG GIỎI!',
    },
    bai_17: {
      id: 'q2_bai_17',
      title_cn: '第十七课：你怎么了？',
      title_pinyin: 'Dì shíqī kè: Nǐ zěnme le?',
      title_vi: 'BẠN LÀM SAO THẾ?',
    },
    bai_18: {
      id: 'q2_bai_18',
      title_cn: '第十八课：我在中国的家',
      title_pinyin: 'Dì shíbā kè: Wǒ zài Zhōngguó de jiā',
      title_vi: 'NHÀ CỦA TÔI Ở TRUNG QUỐC',
    },
    bai_19: {
      id: 'q2_bai_19',
      title_cn: '第十九课：我没看见你的词典',
      title_pinyin: 'Dì shíjiǔ kè: Wǒ méi kànjiàn nǐ de cídiǎn',
      title_vi: 'TÔI KHÔNG NHÌN THẤY TỪ ĐIỂN CỦA BẠN',
    },
    bai_20: {
      id: 'q2_bai_20',
      title_cn: '第二十课：我想辞职！',
      title_pinyin: 'Dì èrshí kè: Wǒ xiǎng cízhí!',
      title_vi: 'TÔI MUỐN TỪ CHỨC!',
    },
    bai_21: {
      id: 'q2_bai_21',
      title_cn: '第二十一课：越南菜好不好吃？',
      title_pinyin: 'Dì èrshíyī kè: Yuènán cài hǎo bù hǎochī?',
      title_vi: 'MÓN ĂN VIỆT NAM CÓ NGON KHÔNG?',
    },
    bai_22: {
      id: 'q2_bai_22',
      title_cn: '第二十二课：我来了两个多月了！',
      title_pinyin: "Dì èrshí'èr kè: Wǒ láile liǎng gè duō yuè le!",
      title_vi: 'TÔI ĐÃ ĐẾN HƠN HAI THÁNG RỒI!',
    },
    bai_23: {
      id: 'q2_bai_23',
      title_cn: '第二十三课：我最大的梦想',
      title_pinyin: 'Dì èrshísān kè: Wǒ zuìdà de mèngxiǎng',
      title_vi: 'ƯỚC MƠ LỚN NHẤT CỦA TÔI',
    },
  };

  const normalizedSections: TextbookSectionRaw[] = [];

  for (const sec of raw.sections) {
    const m = cleanMeta[sec.id];
    const cleanVocab = sec.vocabulary.filter((v) => v.hanzi && v.hanzi.trim());

    normalizedSections.push({
      ...sec,
      id: m?.id || `q2_${sec.id}`,
      title_cn: m?.title_cn || sec.title_cn,
      title_pinyin: m?.title_pinyin || sec.title_pinyin,
      title_vi: m?.title_vi || sec.title_vi,
      vocab_count: cleanVocab.length,
      vocabulary: cleanVocab,
    });

    // Insert Bài Ngữ Pháp 3 (pages 57-64) right after bai_17 so it does not overlap bai_18 (65-73)
    if (sec.id === 'bai_17') {
      normalizedSections.push({
        id: 'q2_bai_ngu_phap_3',
        type: 'grammar_review',
        title_cn: '语法复习（三）',
        title_pinyin: 'Yǔfǎ fùxí (sān)',
        title_vi: 'BÀI NGỮ PHÁP 3 (TỔNG ÔN)',
        page_start: 57,
        page_end: 64,
        vocab_count: 0,
        vocabulary: [],
      });
    }
  }

  const totalVocab = normalizedSections.reduce(
    (acc, s) => acc + s.vocabulary.length,
    0
  );

  const tbResult: TextbookDataRaw = {
    ...raw,
    total_pages: 119,
    total_vocabulary: totalVocab,
    sections: normalizedSections,
  };

  if (exRaw) {
    applyBalancedBookPagination(tbResult, exRaw, extraExPageMap);
  }

  return tbResult;
}

/**
 * Normalize Quyển 3 TextbookDataRaw so section IDs are scoped (`q3_*`),
 * clean Vietnamese titles are set, and empty vocabulary rows are removed.
 */
export function normalizeBook3TextbookData(
  raw: TextbookDataRaw,
  exRaw?: ExercisesDataRaw,
  extraExPageMap?: Record<string, number>
): TextbookDataRaw {
  const cleanMeta: Record<
    string,
    { title_cn: string; title_pinyin: string; title_vi: string; label: string }
  > = {
    bai_01: {
      title_cn: '第一课：面试',
      title_pinyin: 'Dì yī kè: Miànshì',
      title_vi: 'PHỎNG VẤN',
      label: 'Bài 1',
    },
    bai_02: {
      title_cn: '第二课：包装和出库',
      title_pinyin: 'Dì èr kè: Bāozhuāng hé chūkù',
      title_vi: 'ĐÓNG GÓI VÀ XUẤT KHO',
      label: 'Bài 2',
    },
    bai_03: {
      title_cn: '第三课：我的任务是什么？',
      title_pinyin: 'Dì sān kè: Wǒ de rènwù shì shénme?',
      title_vi: 'NHIỆM VỤ CỦA TÔI LÀ GÌ?',
      label: 'Bài 3',
    },
    bai_04: {
      title_cn: '第四课：工厂的规定是什么？',
      title_pinyin: 'Dì sì kè: Gōngchǎng de guīdìng shì shénme?',
      title_vi: 'QUY ĐỊNH CỦA CÔNG XƯỞNG LÀ GÌ?',
      label: 'Bài 4',
    },
    bai_05: {
      title_cn: '第五课：我真的知道错了',
      title_pinyin: 'Dì wǔ kè: Wǒ zhēn de zhīdào cuò le',
      title_vi: 'TÔI THẬT SỰ BIẾT LỖI RỒI',
      label: 'Bài 5',
    },
    bai_06: {
      title_cn: '第六课：一些工厂的问题',
      title_pinyin: 'Dì liù kè: Yīxiē gōngchǎng de wèntí',
      title_vi: 'MỘT SỐ VẤN ĐỀ CỦA NHÀ MÁY',
      label: 'Bài 6',
    },
    bai_07: {
      title_cn: '第七课：这些事都是你自己管的',
      title_pinyin: 'Dì qī kè: Zhèxiē shì dōu shì nǐ zìjǐ guǎn de',
      title_vi: 'NHỮNG VIỆC NÀY ĐỀU DO BẠN TỰ QUẢN LÝ',
      label: 'Bài 7',
    },
    bai_08: {
      title_cn: '第八课：工作时候我受伤了！',
      title_pinyin: 'Dì bā kè: Gōngzuò shíhòu wǒ shòushāng le!',
      title_vi: 'LÚC LÀM VIỆC TÔI BỊ THƯƠNG RỒI!',
      label: 'Bài 8',
    },
    bai_09: {
      title_cn: '第九课：我产量没有达标了！',
      title_pinyin: 'Dì jiǔ kè: Wǒ chǎnliàng méiyǒu dábiāo le!',
      title_vi: 'SẢN LƯỢNG CỦA TÔI KHÔNG ĐẠT CHỈ TIÊU RỒI!',
      label: 'Bài 9',
    },
    bai_10: {
      title_cn: '第十课：我觉得一切都值得',
      title_pinyin: 'Dì shí kè: Wǒ juédé yīqiè dōu zhídé',
      title_vi: 'TÔI CẢM THẤY TẤT CẢ ĐỀU XỨNG ĐÁNG',
      label: 'Bài 10',
    },
    bai_11: {
      title_cn: '第十一课：大家的意见都一样重要',
      title_pinyin: 'Dì shíyī kè: Dàjiā de yìjiàn dōu yīyàng zhòngyào',
      title_vi: 'Ý KIẾN CỦA MỌI NGƯỜI ĐỀU QUAN TRỌNG NHƯ NHAU',
      label: 'Bài 11',
    },
    bai_12: {
      title_cn: '第十二课：你输入密码正确吗？',
      title_pinyin: 'Dì shí’èr kè: Nǐ shūrù mìmǎ zhèngquè ma?',
      title_vi: 'BẠN NHẬP MẬT KHẨU CÓ ĐÚNG KHÔNG?',
      label: 'Bài 12',
    },
    bai_13: {
      title_cn: '第十三课：你们经常印多大的纸板？',
      title_pinyin: 'Dì shísān kè: Nǐmen jīngcháng yìn duōdà de zhǐbǎn?',
      title_vi: 'CÁC BẠN THƯỜNG IN TẤM BÌA CỠ BAO NHIÊU?',
      label: 'Bài 13',
    },
    từ_vựng_về_văn_phòng_và_màu_sắc: {
      title_cn: '专业词汇（一）：文具与颜色',
      title_pinyin: 'Zhuānyè cíhuì (yī): Wénjù yǔ yánsè',
      title_vi: 'TỪ VỰNG VĂN PHÒNG & MÀU SẮC',
      label: 'Chuyên ngành 1',
    },
    từ_vựng_chuyên_ngành_dệt_may_nhuộm: {
      title_cn: '专业词汇（二）：纺织与印染',
      title_pinyin: 'Zhuānyè cíhuì (èr): Fǎngzhī yǔ yìnrǎn',
      title_vi: 'CHUYÊN NGÀNH DỆT MAY – NHUỘM',
      label: 'Chuyên ngành 2',
    },
    từ_vựng_chuyên_ngành_giày_da: {
      title_cn: '专业词汇（三）：鞋业与皮具',
      title_pinyin: 'Zhuānyè cíhuì (sān): Xiéyè yǔ píjù',
      title_vi: 'CHUYÊN NGÀNH GIÀY DA',
      label: 'Chuyên ngành 3',
    },
    từ_vựng_chuyên_ngành_xuất_nhập_khẩu: {
      title_cn: '专业词汇（四）：进出口与物流',
      title_pinyin: 'Zhuānyè cíhuì (sì): Jìnchūkǒu yǔ wùliú',
      title_vi: 'CHUYÊN NGÀNH XUẤT NHẬP KHẨU',
      label: 'Chuyên ngành 4',
    },
    từ_vựng_chuyên_ngành_kế_toán: {
      title_cn: '专业词汇（五）：会计与财务',
      title_pinyin: 'Zhuānyè cíhuì (wǔ): Kuàijì yǔ cáiwù',
      title_vi: 'CHUYÊN NGÀNH KẾ TOÁN',
      label: 'Chuyên ngành 5',
    },
    từ_vựng_chuyên_ngành_hóa_nghiệm: {
      title_cn: '专业词汇（六）：化验与实验',
      title_pinyin: 'Zhuānyè cíhuì (liù): Huàyàn yǔ shíyàn',
      title_vi: 'CHUYÊN NGÀNH HÓA NGHIỆM',
      label: 'Chuyên ngành 6',
    },
    từ_vựng_chuyên_ngành_thiết_bị_điện_tử: {
      title_cn: '专业词汇（七）：电子与设备',
      title_pinyin: 'Zhuānyè cíhuì (qī): Diànzǐ yǔ shèbèi',
      title_vi: 'CHUYÊN NGÀNH THIẾT BỊ ĐIỆN TỬ',
      label: 'Chuyên ngành 7',
    },
    từ_vựng_chuyên_ngành_xây_dựng: {
      title_cn: '专业词汇（八）：建筑与工程',
      title_pinyin: 'Zhuānyè cíhuì (bā): Jiànzhù yǔ gōngchéng',
      title_vi: 'CHUYÊN NGÀNH XÂY DỰNG',
      label: 'Chuyên ngành 8',
    },
    từ_vựng_chuyên_ngành_con_người: {
      title_cn: '专业词汇（九）：人物与性格',
      title_pinyin: 'Zhuānyè cíhuì (jiǔ): Rénwù yǔ xìnggé',
      title_vi: 'CHUYÊN ĐỀ CON NGƯỜI & TÍNH CÁCH',
      label: 'Chuyên ngành 9',
    },
    từ_vựng_chuyên_ngành_rau_củ_quả: {
      title_cn: '专业词汇（十）：蔬果与食材',
      title_pinyin: 'Zhuānyè cíhuì (shí): Shūguǒ yǔ shícái',
      title_vi: 'CHUYÊN ĐỀ RAU CỦ QUẢ & THỰC PHẨM',
      label: 'Chuyên ngành 10',
    },
  };

  const normalizedSections: TextbookSectionRaw[] = raw.sections.map((sec) => {
    const m = cleanMeta[sec.id];
    const cleanVocab = sec.vocabulary.filter((v) => v.hanzi && v.hanzi.trim());
    const scopedId = `q3_${sec.id}`;

    return {
      ...sec,
      id: scopedId,
      title_cn: m?.title_cn || sec.title_cn,
      title_pinyin: m?.title_pinyin || sec.title_pinyin,
      title_vi: m?.title_vi || sec.title_vi,
      vocab_count: cleanVocab.length,
      vocabulary: cleanVocab,
    };
  });

  const totalVocab = normalizedSections.reduce(
    (acc, s) => acc + s.vocabulary.length,
    0
  );

  const tbResult: TextbookDataRaw = {
    ...raw,
    total_pages: 159,
    total_vocabulary: totalVocab,
    sections: normalizedSections,
  };

  if (exRaw) {
    applyBalancedBookPagination(tbResult, exRaw, extraExPageMap);
  }

  return tbResult;
}

/**
 * Multi-part conversation splits for exercises where multiple sub-dialogues in the textbook PDF
 * were stored inside a single dialogue_content array in the JSON.
 */
const DIALOGUE_SUBSECTION_SPLITS: Record<
  string,
  { start: number; end: number; titleVi: string }[]
> = {
  q2_b13_ex01: [
    { start: 0, end: 6, titleVi: 'HỘI THOẠI 1: ĐẶT VÉ MÁY BAY ĐI PHÚ QUỐC' },
    { start: 6, end: 23, titleVi: 'HỘI THOẠI 2: ĐÓN NGƯỜI Ở SÂN BAY' },
  ],
  q2_b13_ex02: [
    { start: 0, end: 11, titleVi: 'HỘI THOẠI 3: TIẾP ĐÓN ĐỐI TÁC CÔNG TY' },
  ],
  q2_b14_ex01: [
    { start: 0, end: 6, titleVi: 'HỘI THOẠI 1: KIỂM TRA HÀNH LÝ & VALI' },
    { start: 6, end: 14, titleVi: 'HỘI THOẠI 2: THUỐC ĐÔNG Y & ĐỒ DÙNG CÁ NHÂN' },
  ],
  q2_b14_ex02: [
    { start: 0, end: 8, titleVi: 'HỘI THOẠI 3: GỌI ĐIỆN THOẠI CHO BẠN' },
    { start: 8, end: 15, titleVi: 'HỘI THOẠI 4: RỦ BẠN ĐI DU LỊCH BIỂN' },
    { start: 15, end: 22, titleVi: 'HỘI THOẠI 5: RA SÂN BAY ĐÓN BẠN' },
  ],
  q2_b15_ex01: [
    { start: 0, end: 8, titleVi: 'HỘI THOẠI 1: NHẮN TIN QUA ĐIỆN THOẠI CÔNG TY' },
    { start: 8, end: 17, titleVi: 'HỘI THOẠI 2: MỜI THAM DỰ TIỆC GIÁNG SINH' },
  ],
  q2_b15_ex02: [
    { start: 0, end: 10, titleVi: 'HỘI THOẠI 3: HỎI THĂM SỨC KHỎE KHI BỊ CẢM' },
    { start: 10, end: 19, titleVi: 'HỘI THOẠI 4: KẾ HOẠCH NGHỈ TẾT & LÁI XE ĐI CHƠI' },
  ],
  q3_b01_ex01: [
    { start: 0, end: 3, titleVi: 'HỘI THOẠI 1: PHỎNG VẤN XIN VIỆC (PHẦN 1)' },
  ],
  q3_b01_ex02: [
    { start: 0, end: 19, titleVi: 'HỘI THOẠI 1 (TIẾP): KỸ NĂNG & LÝ DO ỨNG TUYỂN' },
  ],
  q3_b01_ex03: [
    { start: 0, end: 15, titleVi: 'HỘI THOẠI 2: PHỎNG VẤN CHUYÊN MÔN & NGUYỆN VỌNG' },
  ],
  q3_b05_ex01: [
    { start: 0, end: 5, titleVi: 'HỘI THOẠI 1: NHẮC NHỞ VIỆC NGHỈ LÀM KHÔNG XIN PHÉP' },
    { start: 5, end: 13, titleVi: 'HỘI THOẠI 2: BÁO CÁO SỰ CỐ THIẾT BỊ TỔ 2' },
  ],
  q3_b05_ex02: [
    { start: 0, end: 10, titleVi: 'HỘI THOẠI 3: NHẬN LỖI VI PHẠM NỘI QUY' },
    { start: 10, end: 16, titleVi: 'HỘI THOẠI 4: QUY ĐỊNH CẤP LẠI THẺ RA VÀO' },
    { start: 16, end: 28, titleVi: 'HỘI THOẠI 5: XIN ĐẾN MUỘN, VỀ SỚM & NGHỈ PHÉP' },
  ],
  q3_b07_ex01: [
    { start: 0, end: 6, titleVi: 'HỘI THOẠI 1: QUẢN LÝ THIẾT BỊ VĂN PHÒNG' },
    { start: 6, end: 15, titleVi: 'HỘI THOẠI 2: ĐẶT MUA BÀN GHẾ & TỦ HỒ SƠ' },
  ],
};

const CN_NUMERALS = ['一', '二', '三', '四', '五', '六', '七', '八'];
const PY_NUMERALS = ['yī', 'èr', 'sān', 'sì', 'wǔ', 'liù', 'qī', 'bā'];

function cleanSpeakerPrefix(str: string): string {
  return str.replace(/^[AB]\s*[:：]\s*/i, '').trim();
}

/**
 * Unrolls grouped `dialogue_content` and `sentence_list` exercises in Quyển 2 and Quyển 3
 * so that every individual sentence is a standalone ExerciseItem with its own input box
 * and its own single-sentence Vietnamese answer (no lumped multi-line answers or A:/B: prefixes).
 */
export function expandLessonGroupedExercises(
  exercises: ExerciseItem[]
): ExerciseItem[] {
  const expanded: ExerciseItem[] = [];

  for (const ex of exercises) {
    if (ex.dialogue_content && ex.dialogue_content.length > 0) {
      const splits = DIALOGUE_SUBSECTION_SPLITS[ex.exercise_id];
      const isSentenceCollection =
        ex.exercise_id === 'q3_b06_ex01' ||
        ex.exercise_id === 'q3_b07_ex02' ||
        ex.exercise_id === 'q3_b13_ex02';

      ex.dialogue_content.forEach((line, lIdx) => {
        const cleanHanzi = cleanSpeakerPrefix(line.hanzi);
        const cleanVi = cleanSpeakerPrefix(line.vietnamese);
        const matchedSplit = splits?.find(
          (s) => lIdx >= s.start && lIdx < s.end
        );
        const subTitle =
          matchedSplit?.titleVi ||
          ex.title ||
          ex.section_title ||
          'II. 会话：HỘI THOẠI';

        expanded.push({
          exercise_id: `${ex.exercise_id}_dl_${lIdx + 1}`,
          exercise_type: isSentenceCollection
            ? 'luyen_tap_mau_cau'
            : 'luyen_dich_hoi_thoai',
          category: isSentenceCollection
            ? 'Luyện dịch câu giao tiếp nhà máy'
            : ex.category || 'Luyện tập dịch & giao tiếp hội thoại',
          title: `${subTitle} — Câu ${lIdx + 1}`,
          section_title: subTitle,
          grammar_point: ex.grammar_point,
          requirement:
            'Dịch câu tiếng Trung sau sang tiếng Việt chuẩn theo ngữ cảnh bài học',
          source_hanzi: cleanHanzi,
          source_pinyin: line.pinyin,
          answer_hanzi: cleanVi,
          answer_pinyin: '',
          sample_sentence_vietnamese: cleanVi,
          vocab_grammar_notes: ex.vocab_grammar_notes,
        });
      });
      continue;
    }

    if (ex.sentence_list && ex.sentence_list.length > 0) {
      ex.sentence_list.forEach((sent, sIdx) => {
        const num = sent.id || sIdx + 1;
        const cleanHanzi = cleanSpeakerPrefix(
          sent.hanzi.replace(/^\d+\.\s*/, '')
        );
        const cleanVi = cleanSpeakerPrefix(sent.vietnamese);
        const subTitle =
          ex.title || ex.section_title || 'II. 句子：MẪU CÂU THÔNG DỤNG';

        expanded.push({
          exercise_id: `${ex.exercise_id}_sl_${num}`,
          exercise_type: 'luyen_tap_mau_cau',
          category: ex.category || 'Luyện tập dịch mẫu câu (II. 句子)',
          title: `${subTitle} — Câu ${num}`,
          section_title: subTitle,
          grammar_point: ex.grammar_point,
          requirement:
            'Dịch mẫu câu tiếng Trung sau sang tiếng Việt chuẩn theo ngữ cảnh bài học',
          source_hanzi: cleanHanzi,
          source_pinyin: sent.pinyin,
          answer_hanzi: cleanVi,
          answer_pinyin: '',
          sample_sentence_vietnamese: cleanVi,
          vocab_grammar_notes: ex.vocab_grammar_notes,
        });
      });
      continue;
    }

    expanded.push(ex);
  }

  return expanded;
}

/**
 * Balances all items (Vocabulary -> Grammar -> Dialogues/Sample Sentences -> Reading Passages -> Exercises)
 * within each section's [page_start .. page_end] so every page has a uniform visual height matching Quyển 1
 * (zero empty pages, zero 28-item pages, and zero cross-lesson spillover).
 */
export function applyBalancedBookPagination(
  tb: TextbookDataRaw,
  exRaw: ExercisesDataRaw,
  extraExPageMap?: Record<string, number>
): void {
  const exByLesson: Record<string, ExerciseItem[]> = {};
  for (const les of exRaw.lessons) {
    exByLesson[les.lesson_id] = les.exercises;
  }

  for (const sec of tb.sections) {
    const pStart = sec.page_start;
    const pEnd = sec.page_end;
    const pages: number[] = [];
    for (let p = pStart; p <= pEnd; p++) {
      pages.push(p);
    }
    if (pages.length === 0) continue;

    const meta = BOOK2_AND_3_SUPPLEMENTARY_DATA[sec.id];
    const isSpecVocab = sec.id.startsWith('q3_từ_vựng');
    const rawExs =
      !isSpecVocab && meta?.lessonExerciseId
        ? exByLesson[meta.lessonExerciseId] || []
        : [];

    // 1. If rawExs contains verbatim luyen_dich_hoi_thoai / luyen_tap_mau_cau, populate meta.dialogues
    const jsonDialogueExs = rawExs.filter(
      (e) =>
        (e.exercise_type === 'luyen_dich_hoi_thoai' &&
          e.dialogue_content &&
          e.dialogue_content.length > 0) ||
        (e.exercise_type === 'luyen_tap_mau_cau' &&
          e.sentence_list &&
          e.sentence_list.length > 0)
    );

    if (meta && jsonDialogueExs.length > 0) {
      const builtDialogues: DialogueSection[] = [];
      let secCounter = 0;

      jsonDialogueExs.forEach((ex) => {
        if (ex.dialogue_content && ex.dialogue_content.length > 0) {
          const splits = DIALOGUE_SUBSECTION_SPLITS[ex.exercise_id] || [
            {
              start: 0,
              end: ex.dialogue_content.length,
              titleVi:
                ex.title ||
                ex.section_title ||
                `HỘI THOẠI ${secCounter + 1}`,
            },
          ];
          const isSentenceCollection =
            ex.exercise_id === 'q3_b06_ex01' ||
            ex.exercise_id === 'q3_b07_ex02' ||
            ex.exercise_id === 'q3_b13_ex02';

          splits.forEach((sp, spIdx) => {
            const idxNum = secCounter;
            secCounter++;
            const cnOrd = CN_NUMERALS[idxNum] || String(idxNum + 1);
            const pyOrd = PY_NUMERALS[idxNum] || String(idxNum + 1);

            const sliceLines = ex.dialogue_content!.slice(sp.start, sp.end);
            const lines: DialogueLine[] = sliceLines.map((item, localIdx) => {
              const globalIdx = sp.start + localIdx;
              const cleanHanzi = cleanSpeakerPrefix(item.hanzi);
              const cleanVi = cleanSpeakerPrefix(item.vietnamese);
              return {
                id: `${ex.exercise_id}_dl_${globalIdx + 1}`,
                page: pStart,
                hanzi: isSentenceCollection
                  ? `${globalIdx + 1}. ${cleanHanzi}`
                  : cleanHanzi,
                pinyin: item.pinyin,
                meaningVi: cleanVi,
              };
            });

            builtDialogues.push({
              id: `${ex.exercise_id}_sec_${spIdx + 1}`,
              titleCn: isSentenceCollection
                ? `${idxNum + 1}. 句子`
                : `${idxNum + 1}. 第${cnOrd}会话`,
              titlePinyin: isSentenceCollection
                ? 'Jùzi'
                : `Dì ${pyOrd} huìhuà`,
              titleVi: sp.titleVi.toUpperCase(),
              pageStart: pStart,
              pageEnd: pEnd,
              lines,
            });
          });
        } else if (ex.sentence_list && ex.sentence_list.length > 0) {
          const idxNum = secCounter;
          secCounter++;
          const lines: DialogueLine[] = ex.sentence_list.map((sent, sIdx) => ({
            id: `${ex.exercise_id}_sl_${sIdx + 1}`,
            page: pStart,
            hanzi: `${sent.id || sIdx + 1}. ${cleanSpeakerPrefix(sent.hanzi)}`,
            pinyin: sent.pinyin,
            meaningVi: cleanSpeakerPrefix(sent.vietnamese),
          }));

          builtDialogues.push({
            id: `${ex.exercise_id}_sec`,
            titleCn: `${idxNum + 1}. 句子`,
            titlePinyin: 'Jùzi',
            titleVi: (
              ex.title ||
              ex.section_title ||
              'MẪU CÂU THÔNG DỤNG'
            ).toUpperCase(),
            pageStart: pStart,
            pageEnd: pEnd,
            lines,
          });
        }
      });

      meta.dialogues = builtDialogues;
    }

    // 2. Build ordered stream of visual items for this section
    type UnitItem =
      | { kind: 'vocab'; vocabRef: VocabItem; weight: number }
      | {
          kind: 'grammar';
          grammarRef: LessonSupplementaryContent['grammarCallouts'][number];
          weight: number;
        }
      | {
          kind: 'dialogue';
          lineRef: DialogueLine;
          exId?: string;
          weight: number;
        }
      | { kind: 'exercise'; exId: string; weight: number };

    const items: UnitItem[] = [];

    for (const v of sec.vocabulary) {
      items.push({ kind: 'vocab', vocabRef: v, weight: 0.42 });
    }

    if (meta && !isSpecVocab) {
      for (const g of meta.grammarCallouts) {
        items.push({ kind: 'grammar', grammarRef: g, weight: 2.2 });
      }
      meta.dialogues.forEach((dSec) => {
        for (const line of dSec.lines) {
          items.push({
            kind: 'dialogue',
            lineRef: line,
            weight: 1.15,
          });
        }
      });
    }

    const filteredRaw = rawExs.filter(
      (e) =>
        e.exercise_type !== 'luyen_dich_hoi_thoai' &&
        e.exercise_type !== 'luyen_tap_mau_cau'
    );
    const orderedRaw = /^q3_b(0[4-9]|1[0-3])$/.test(
      meta?.lessonExerciseId || ''
    )
      ? [
          ...filteredRaw.filter((e) => e.exercise_type === 'dat_cau'),
          ...filteredRaw.filter((e) => e.exercise_type !== 'dat_cau'),
        ]
      : filteredRaw;

    for (const ex of orderedRaw) {
      const w =
        ex.exercise_type === 'luyen_tap_doan_van'
          ? 3.2
          : ex.exercise_type === 'luyen_tap_ngu_phap'
          ? 2.4
          : 1.25;
      items.push({ kind: 'exercise', exId: ex.exercise_id, weight: w });
    }

    // 3. Distribute items across `pages` by visual weight so every page has uniform height
    const bannerWeight = 1.8;
    let itemIdx = 0;

    for (let pIdx = 0; pIdx < pages.length; pIdx++) {
      const p = pages[pIdx];
      const remainingPages = pages.length - pIdx;
      let pageWeight = pIdx === 0 ? bannerWeight : 0;
      let countOnPage = 0;
      const remWeight =
        pageWeight + items.slice(itemIdx).reduce((a, b) => a + b.weight, 0);
      const curTarget = remWeight / remainingPages;

      while (itemIdx < items.length) {
        const leftAfterThis = items.length - (itemIdx + 1);
        const pagesAfterThis = remainingPages - 1;
        // Guarantee at least 1 item for every remaining page in the section
        if (leftAfterThis < pagesAfterThis) break;

        const nextW = items[itemIdx].weight;
        if (
          pIdx < pages.length - 1 &&
          countOnPage > 0 &&
          pageWeight + nextW * 0.55 > curTarget
        ) {
          break;
        }

        const it = items[itemIdx++];
        pageWeight += it.weight;
        countOnPage++;

        if (it.kind === 'vocab') {
          it.vocabRef.page = p;
        } else if (it.kind === 'grammar') {
          it.grammarRef.page = p;
        } else if (it.kind === 'dialogue') {
          it.lineRef.page = p;
        } else if (it.kind === 'exercise') {
          BOOK2_AND_3_EXERCISE_PAGE_MAP[it.exId] = p;
          if (extraExPageMap) extraExPageMap[it.exId] = p;
        }
      }
    }

    // Update pageStart / pageEnd on built dialogue sections
    if (meta) {
      for (const dSec of meta.dialogues) {
        if (dSec.lines.length > 0) {
          dSec.pageStart = dSec.lines[0].page;
          dSec.pageEnd = dSec.lines[dSec.lines.length - 1].page;
        }
      }
    }
  }
}

