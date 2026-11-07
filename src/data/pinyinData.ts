export interface PinyinFinalItem {
  stt: number;
  pinyin: string;
  vietnamese: string;
  ttsChar: string;
  examplePinyin: string;
  exampleHanzi: string;
  exampleMeaning: string;
  guideVi: string;
}

export interface PinyinInitialItem {
  stt: number;
  pinyin: string;
  vietnamese: string;
  exampleCn: string;
  exampleVi: string;
  ttsChar: string;
  exampleHanzi: string;
  guideVi: string;
}

export interface PinyinToneItem {
  stt: number;
  name: string;
  symbol: string;
  description: string;
  examplePinyin: string;
  exampleHanzi: string;
  exampleMeaning: string;
  pitchContour: string;
}

export interface ToneSandhiRule {
  id: string;
  formula: string;
  example: string;
  ttsHanzi: string;
  meaningVi: string;
  note?: string;
}

export interface BasicStrokeItem {
  id: string;
  nameVi: string;
  shortLabel: string;
  hanziSymbol: string;
  directionVi: string;
  svgPaths: string[];
  examples: string[];
}

export interface StrokeOrderRuleItem {
  id: string;
  ruleVi: string;
  examples: string[];
  isSupplementary?: boolean;
}

export interface PinyinChartColumn {
  colIndex: number; // 1 to 37
  part: 1 | 2; // 1: Col 1..20, 2: Col 21..37
  finalLabel: string;
  subNote?: string;
}

export interface PinyinChartRow {
  stt: number; // 1 to 22
  initial: string; // 'b' .. 's', or '' for row 22
  displayInitial: string;
  cells: Record<number, string>; // colIndex -> syllable
}

// I. 38 VẬN MẪU (Bám sát 100% bảng I. VẬN MẪU trong ảnh)
export const PINYIN_FINALS_38: PinyinFinalItem[] = [
  {
    stt: 1,
    pinyin: 'o',
    vietnamese: 'o',
    ttsChar: '喔',
    examplePinyin: 'bō',
    exampleHanzi: '波',
    exampleMeaning: 'Sóng nước',
    guideVi: 'Môi tròn vừa phải, lưỡi hơi lùi về sau, đọc gần giống âm "o" tròn môi (hoặc "ua" nhẹ khi ghép với b, p, m, f).',
  },
  {
    stt: 2,
    pinyin: 'a',
    vietnamese: 'a',
    ttsChar: '啊',
    examplePinyin: 'bā',
    exampleHanzi: '八',
    exampleMeaning: 'Số 8',
    guideVi: 'Há rộng miệng tự nhiên, lưỡi đặt thấp ở giữa khoang miệng, đọc vang và rõ như chữ "a" tiếng Việt.',
  },
  {
    stt: 3,
    pinyin: 'e',
    vietnamese: 'ơ',
    ttsChar: '鹅',
    examplePinyin: 'dé',
    exampleHanzi: '德',
    exampleMeaning: 'Đức hạnh',
    guideVi: 'Miệng mở vừa, khóe miệng hơi kéo sang hai bên, đọc là "ơ" (như trong tơ, lơ).',
  },
  {
    stt: 4,
    pinyin: 'e',
    vietnamese: 'ưa',
    ttsChar: '饿',
    examplePinyin: 'hē',
    exampleHanzi: '喝',
    exampleMeaning: 'Uống',
    guideVi: 'Khi đi với g, k, h hoặc đứng một mình có thanh điệu, âm "e" chuyển nhẹ từ "ưa" sang "ơ" ở cuống họng.',
  },
  {
    stt: 5,
    pinyin: 'u',
    vietnamese: 'u',
    ttsChar: '乌',
    examplePinyin: 'wū',
    exampleHanzi: '屋',
    exampleMeaning: 'Ngôi nhà',
    guideVi: 'Chu tròn hai môi đưa về phía trước, đọc giống nguyên âm "u" trong tiếng Việt.',
  },
  {
    stt: 6,
    pinyin: 'ü',
    vietnamese: 'uy',
    ttsChar: '迂',
    examplePinyin: 'nǚ',
    exampleHanzi: '女',
    exampleMeaning: 'Phụ nữ',
    guideVi: 'Âm tròn môi: giữ nguyên khuôn miệng chúm tròn suốt từ đầu đến cuối (không bè môi cuối âm), đọc giống "uy".',
  },
  {
    stt: 7,
    pinyin: 'ün',
    vietnamese: 'uyn',
    ttsChar: '晕',
    examplePinyin: 'yūn',
    exampleHanzi: '晕',
    exampleMeaning: 'Chóng mặt',
    guideVi: 'Bắt đầu bằng âm tròn môi "ü" rồi đưa đầu lưỡi chạm lợi trên kết thúc bằng âm mũi "-n", đọc gần giống "uyn".',
  },
  {
    stt: 8,
    pinyin: 'i',
    vietnamese: 'i',
    ttsChar: '衣',
    examplePinyin: 'yī',
    exampleHanzi: '一',
    exampleMeaning: 'Số 1',
    guideVi: 'Khóe miệng kéo ngang như đang mỉm cười, đầu lưỡi chạm mặt sau răng dưới, đọc như "i" tiếng Việt.',
  },
  {
    stt: 9,
    pinyin: 'i',
    vietnamese: 'ư',
    ttsChar: '知',
    examplePinyin: 'zhī',
    exampleHanzi: '知',
    exampleMeaning: 'Biết',
    guideVi: 'Ghi chú 1: Khi đi sau 7 thanh mẫu z, c, s, zh, ch, sh, r thì "i" đọc thành "ư" (giữ nguyên vị trí lưỡi của phụ âm trước).',
  },
  {
    stt: 10,
    pinyin: 'ai',
    vietnamese: 'ai',
    ttsChar: '哀',
    examplePinyin: 'ài',
    exampleHanzi: '爱',
    exampleMeaning: 'Yêu',
    guideVi: 'Mở miệng đọc "a" rõ rồi lướt nhanh sang "i", giống vần "ai" trong tiếng Việt.',
  },
  {
    stt: 11,
    pinyin: 'ei',
    vietnamese: 'ây',
    ttsChar: '杯',
    examplePinyin: 'bēi',
    exampleHanzi: '杯',
    exampleMeaning: 'Cái cốc',
    guideVi: 'Đọc lướt từ "ê" sang "i", nghe rất giống vần "ây" trong tiếng Việt.',
  },
  {
    stt: 12,
    pinyin: 'ao',
    vietnamese: 'ao',
    ttsChar: '熬',
    examplePinyin: 'hǎo',
    exampleHanzi: '好',
    exampleMeaning: 'Tốt, khỏe',
    guideVi: 'Đọc từ "a" mở rộng miệng rồi chu môi về "o/u", giống vần "ao" trong tiếng Việt.',
  },
  {
    stt: 13,
    pinyin: 'er',
    vietnamese: 'Ơ + r',
    ttsChar: '儿',
    examplePinyin: 'ér',
    exampleHanzi: '儿',
    exampleMeaning: 'Con trai / Nhi',
    guideVi: 'Vừa phát âm "ơ" vừa uốn cong đầu lưỡi lên phía vòm họng trên để tạo âm cuốn lưỡi "ơ + r".',
  },
  {
    stt: 14,
    pinyin: 'ou',
    vietnamese: 'Âu',
    ttsChar: '欧',
    examplePinyin: 'kǒu',
    exampleHanzi: '口',
    exampleMeaning: 'Miệng',
    guideVi: 'Bắt đầu từ âm "ô/ơ" rồi khép tròn môi về "u", đọc giống vần "âu" trong tiếng Việt.',
  },
  {
    stt: 15,
    pinyin: 'uo',
    vietnamese: 'Ua',
    ttsChar: '窝',
    examplePinyin: 'guó',
    exampleHanzi: '国',
    exampleMeaning: 'Đất nước',
    guideVi: 'Chu môi ở "u" rồi mở sang "o", đọc gần giống "ua" hoặc "uô" trong tiếng Việt.',
  },
  {
    stt: 16,
    pinyin: 'ua',
    vietnamese: 'Oa',
    ttsChar: '蛙',
    examplePinyin: 'huā',
    exampleHanzi: '花',
    exampleMeaning: 'Bông hoa',
    guideVi: 'Lướt nhanh từ âm tròn môi "u" sang âm mở rộng "a", đọc giống "oa" trong tiếng Việt.',
  },
  {
    stt: 17,
    pinyin: 'ia',
    vietnamese: 'i + a',
    ttsChar: '呀',
    examplePinyin: 'jiā',
    exampleHanzi: '家',
    exampleMeaning: 'Nhà, gia đình',
    guideVi: 'Đọc nối nhanh từ "i" sang "a" thành 1 âm tiết liền mạch (i+a).',
  },
  {
    stt: 18,
    pinyin: 'ie',
    vietnamese: 'i + ê',
    ttsChar: '耶',
    examplePinyin: 'xiè',
    exampleHanzi: '谢',
    exampleMeaning: 'Cảm ơn',
    guideVi: 'Đọc nối nhanh từ "i" sang "ê" (i+ê), giống như "iê" trong tiếng Việt.',
  },
  {
    stt: 19,
    pinyin: 'üe',
    vietnamese: 'Uê',
    ttsChar: '约',
    examplePinyin: 'xué',
    exampleHanzi: '学',
    exampleMeaning: 'Học tập',
    guideVi: 'Tròn môi ở âm "ü" rồi mở nhẹ sang "ê", đọc giống "uê" hoặc "uyê".',
  },
  {
    stt: 20,
    pinyin: 'iao',
    vietnamese: 'i + eo',
    ttsChar: '腰',
    examplePinyin: 'xiǎo',
    exampleHanzi: '小',
    exampleMeaning: 'Nhỏ bé',
    guideVi: 'Đọc lướt từ "i" sang "ao", nghe gần giống "i + eo" (như chữ "tiêu, kiêu").',
  },
  {
    stt: 21,
    pinyin: 'iou (iu)',
    vietnamese: 'iu',
    ttsChar: '优',
    examplePinyin: 'liù',
    exampleHanzi: '六',
    exampleMeaning: 'Số 6',
    guideVi: 'Khi ghép với phụ âm viết gọn là "iu", đọc lướt từ "i" qua "âu/u" (i-âu / iu).',
  },
  {
    stt: 22,
    pinyin: 'uei (ui)',
    vietnamese: 'Uây',
    ttsChar: '威',
    examplePinyin: 'shuǐ',
    exampleHanzi: '水',
    exampleMeaning: 'Nước',
    guideVi: 'Khi ghép với phụ âm viết gọn là "ui", đọc chuẩn là "uây" (chu môi "u" rồi sang "ây").',
  },
  {
    stt: 23,
    pinyin: 'uai',
    vietnamese: 'Oai',
    ttsChar: '歪',
    examplePinyin: 'kuài',
    exampleHanzi: '快',
    exampleMeaning: 'Nhanh',
    guideVi: 'Chu môi "u" rồi mở sang "ai", đọc giống hệt vần "oai" trong tiếng Việt.',
  },
  {
    stt: 24,
    pinyin: 'üan',
    vietnamese: 'Oen',
    ttsChar: '冤',
    examplePinyin: 'yuǎn',
    exampleHanzi: '远',
    exampleMeaning: 'Xa',
    guideVi: 'Bắt đầu tròn môi "ü" rồi nối sang "an", đọc giống "oen" hoặc "uyên" tròn môi.',
  },
  {
    stt: 25,
    pinyin: 'uan',
    vietnamese: 'oan',
    ttsChar: '弯',
    examplePinyin: 'guān',
    exampleHanzi: '关',
    exampleMeaning: 'Đóng / Cửa ải',
    guideVi: 'Bắt đầu bằng "u" rồi sang "an", đọc giống vần "oan" trong tiếng Việt.',
  },
  {
    stt: 26,
    pinyin: 'uang',
    vietnamese: 'Oang',
    ttsChar: '汪',
    examplePinyin: 'huáng',
    exampleHanzi: '黄',
    exampleMeaning: 'Màu vàng',
    guideVi: 'Bắt đầu bằng "u" rồi mở rộng sang âm mũi sau "ang", đọc giống "oang" tiếng Việt.',
  },
  {
    stt: 27,
    pinyin: 'en',
    vietnamese: 'Ân',
    ttsChar: '恩',
    examplePinyin: 'rén',
    exampleHanzi: '人',
    exampleMeaning: 'Người',
    guideVi: 'Đọc giống vần "ân" trong tiếng Việt, kết thúc đầu lưỡi chạm chân răng trên.',
  },
  {
    stt: 28,
    pinyin: 'eng',
    vietnamese: 'Âng',
    ttsChar: '灯',
    examplePinyin: 'dēng',
    exampleHanzi: '灯',
    exampleMeaning: 'Cái đèn',
    guideVi: 'Âm mũi sau: đọc giống vần "âng" trong tiếng Việt, ngân âm ở cuống họng.',
  },
  {
    stt: 29,
    pinyin: 'uen (un)',
    vietnamese: 'Uân',
    ttsChar: '温',
    examplePinyin: 'chūn',
    exampleHanzi: '春',
    exampleMeaning: 'Mùa xuân',
    guideVi: 'Khi ghép với phụ âm viết gọn là "un", đọc giống vần "uân" trong tiếng Việt.',
  },
  {
    stt: 30,
    pinyin: 'ueng',
    vietnamese: 'Uâng',
    ttsChar: '翁',
    examplePinyin: 'wēng',
    exampleHanzi: '翁',
    exampleMeaning: 'Ông lão',
    guideVi: 'Chu môi đọc "u" kết hợp với "âng", tạo thành vần "uâng" (thường viết là weng).',
  },
  {
    stt: 31,
    pinyin: 'an',
    vietnamese: 'an',
    ttsChar: '安',
    examplePinyin: 'ān',
    exampleHanzi: '安',
    exampleMeaning: 'Bình an',
    guideVi: 'Đọc giống vần "an" trong tiếng Việt, đầu lưỡi chạm lợi trên ở cuối âm.',
  },
  {
    stt: 32,
    pinyin: 'ang',
    vietnamese: 'ang',
    ttsChar: '昂',
    examplePinyin: 'máng',
    exampleHanzi: '忙',
    exampleMeaning: 'Bận rộn',
    guideVi: 'Mở rộng khoang miệng, đọc vang giống vần "ang" trong tiếng Việt.',
  },
  {
    stt: 33,
    pinyin: 'ian',
    vietnamese: 'i + en',
    ttsChar: '烟',
    examplePinyin: 'tiān',
    exampleHanzi: '天',
    exampleMeaning: 'Bầu trời / Ngày',
    guideVi: 'Đọc nối nhanh từ "i" sang "en" (i + en / iên), không đọc thành "i-an" mở quá rộng.',
  },
  {
    stt: 34,
    pinyin: 'iang',
    vietnamese: 'i + eng',
    ttsChar: '央',
    examplePinyin: 'liǎng',
    exampleHanzi: '两',
    exampleMeaning: 'Hai (2)',
    guideVi: 'Đọc nối từ "i" sang "ang/eng" vang ở mũi sau (i + eng / iang).',
  },
  {
    stt: 35,
    pinyin: 'ong',
    vietnamese: 'Ung',
    ttsChar: '中',
    examplePinyin: 'zhōng',
    exampleHanzi: '中',
    exampleMeaning: 'Ở giữa / Trung',
    guideVi: 'Môi giữ tròn từ đầu đến cuối (không ngậm kín môi cuối âm như tiếng Việt), đọc gần giống "ung".',
  },
  {
    stt: 36,
    pinyin: 'iong',
    vietnamese: 'i + ung',
    ttsChar: '雍',
    examplePinyin: 'xiōng',
    exampleHanzi: '兄',
    exampleMeaning: 'Anh trai',
    guideVi: 'Bắt đầu từ "i" rồi tròn môi ngân vang âm "ung" (i + ung).',
  },
  {
    stt: 37,
    pinyin: 'in',
    vietnamese: 'in',
    ttsChar: '因',
    examplePinyin: 'xīn',
    exampleHanzi: '心',
    exampleMeaning: 'Trái tim, tấm lòng',
    guideVi: 'Đọc giống vần "in" trong tiếng Việt, đầu lưỡi chạm lợi trên.',
  },
  {
    stt: 38,
    pinyin: 'ing',
    vietnamese: 'inh',
    ttsChar: '英',
    examplePinyin: 'tīng',
    exampleHanzi: '听',
    exampleMeaning: 'Nghe',
    guideVi: 'Đọc gần giống vần "inh" trong tiếng Việt nhưng cuống lưỡi nâng lên ngân vang ở mũi sau.',
  },
];

// II. 22 THANH MẪU (Bám sát 100% bảng II. THANH MẪU trong ảnh)
export const PINYIN_INITIALS_22: PinyinInitialItem[] = [
  {
    stt: 1,
    pinyin: 'b',
    vietnamese: 'P',
    exampleCn: 'Bo',
    exampleVi: 'Po',
    ttsChar: '玻',
    exampleHanzi: '波 (bō)',
    guideVi: 'Âm hai môi, KHÔNG bật hơi: khép hai môi rồi mở nhẹ phát âm "P" (như chữ "pin" tiếng Việt).',
  },
  {
    stt: 2,
    pinyin: 'p',
    vietnamese: 'P (bật hơi)',
    exampleCn: 'Po',
    exampleVi: 'Po',
    ttsChar: '坡',
    exampleHanzi: '坡 (pō)',
    guideVi: 'Âm hai môi, BẬT HƠI mạnh: mím hai môi nén hơi rồi bật mạnh luồng hơi ra ngoài khi đọc "P".',
  },
  {
    stt: 3,
    pinyin: 'm',
    vietnamese: 'M',
    exampleCn: 'Mo',
    exampleVi: 'Mo',
    ttsChar: '摸',
    exampleHanzi: '摸 (mō)',
    guideVi: 'Âm mũi hai môi: đọc giống hệt phụ âm "M" trong tiếng Việt (Mo).',
  },
  {
    stt: 4,
    pinyin: 'f',
    vietnamese: 'Ph',
    exampleCn: 'Fo',
    exampleVi: 'Pho',
    ttsChar: '佛',
    exampleHanzi: '佛 (fó)',
    guideVi: 'Âm môi răng: răng cửa trên chạm nhẹ môi dưới, đọc giống "Ph" trong tiếng Việt (Pho).',
  },
  {
    stt: 5,
    pinyin: 'd',
    vietnamese: 'T',
    exampleCn: 'De',
    exampleVi: 'Tơ',
    ttsChar: '得',
    exampleHanzi: '德 (dé)',
    guideVi: 'Âm đầu lưỡi, KHÔNG bật hơi: đầu lưỡi chạm lợi trên rồi hạ xuống đọc "T" (De -> Tơ).',
  },
  {
    stt: 6,
    pinyin: 't',
    vietnamese: 'Th (bật hơi)',
    exampleCn: 'Te',
    exampleVi: 'Thơ',
    ttsChar: '特',
    exampleHanzi: '特 (tè)',
    guideVi: 'Âm đầu lưỡi, BẬT HƠI: đầu lưỡi chạm lợi trên rồi đẩy luồng hơi mạnh ra, đọc giống "Th" (Te -> Thơ).',
  },
  {
    stt: 7,
    pinyin: 'k',
    vietnamese: 'Kh (bật hơi)',
    exampleCn: 'Ke',
    exampleVi: 'Khơ',
    ttsChar: '科',
    exampleHanzi: '科 (kē)',
    guideVi: 'Âm cuống lưỡi, BẬT HƠI mạnh: nâng cuống lưỡi rồi bật hơi mạnh ở cổ họng, đọc giống "Kh" (Ke -> Khơ).',
  },
  {
    stt: 8,
    pinyin: 'h',
    vietnamese: 'H',
    exampleCn: 'He',
    exampleVi: 'Hơ',
    ttsChar: '喝',
    exampleHanzi: '喝 (hē)',
    guideVi: 'Âm xát cuống lưỡi: ma sát nhẹ ở cuống họng, đọc giữa "H" và "Kh" nhẹ (He -> Hơ).',
  },
  {
    stt: 9,
    pinyin: 'g',
    vietnamese: 'C',
    exampleCn: 'Ge',
    exampleVi: 'Cơ',
    ttsChar: '哥',
    exampleHanzi: '哥 (gē)',
    guideVi: 'Âm cuống lưỡi, KHÔNG bật hơi: đọc giống phụ âm "C / K" trong tiếng Việt (Ge -> Cơ).',
  },
  {
    stt: 10,
    pinyin: 'n',
    vietnamese: 'N',
    exampleCn: 'Ne',
    exampleVi: 'Nơ',
    ttsChar: '讷',
    exampleHanzi: '呢 (ne)',
    guideVi: 'Âm mũi đầu lưỡi: đọc giống phụ âm "N" trong tiếng Việt (Ne -> Nơ).',
  },
  {
    stt: 11,
    pinyin: 'l',
    vietnamese: 'L',
    exampleCn: 'Le',
    exampleVi: 'Lơ',
    ttsChar: '勒',
    exampleHanzi: '乐 (lè)',
    guideVi: 'Âm biên đầu lưỡi: đọc giống phụ âm "L" trong tiếng Việt (Le -> Lơ).',
  },
  {
    stt: 12,
    pinyin: 'j',
    vietnamese: 'Ch (thẳng lưỡi)',
    exampleCn: 'Ji',
    exampleVi: 'Chi',
    ttsChar: '基',
    exampleHanzi: '机 (jī)',
    guideVi: 'Âm mặt lưỡi, KHÔNG bật hơi: đầu lưỡi hạ xuống chạm mặt sau răng dưới, mặt lưỡi nâng lên đọc "Ch" thẳng lưỡi (Ji -> Chi).',
  },
  {
    stt: 13,
    pinyin: 'q',
    vietnamese: 'Ch (+bật hơi)',
    exampleCn: 'Qi',
    exampleVi: 'Chi',
    ttsChar: '欺',
    exampleHanzi: '七 (qī)',
    guideVi: 'Âm mặt lưỡi, BẬT HƠI mạnh: giữ vị trí lưỡi giống "j" (đầu lưỡi chạm răng dưới) nhưng đẩy mạnh luồng hơi ra ngoài (Qi -> Chi bật hơi).',
  },
  {
    stt: 14,
    pinyin: 'x',
    vietnamese: 'X',
    exampleCn: 'Xi',
    exampleVi: 'Xi',
    ttsChar: '希',
    exampleHanzi: '西 (xī)',
    guideVi: 'Âm mặt lưỡi xát: đầu lưỡi chạm răng dưới, khóe miệng hơi kéo ngang, đọc êm như "X" (Xi -> Xi).',
  },
  {
    stt: 15,
    pinyin: 'zh',
    vietnamese: 'Tr (cong lưỡi)',
    exampleCn: 'Zhi',
    exampleVi: 'Trư',
    ttsChar: '知',
    exampleHanzi: '知 (zhī)',
    guideVi: 'Âm đầu lưỡi sau (CONG LƯỠI), KHÔNG bật hơi: uốn cong đầu lưỡi lên chạm vòm miệng cứng, đọc giống "Tr" (Zhi -> Trư).',
  },
  {
    stt: 16,
    pinyin: 'ch',
    vietnamese: 'Tr (bật hơi)',
    exampleCn: 'Chi',
    exampleVi: 'Trư',
    ttsChar: '蚩',
    exampleHanzi: '吃 (chī)',
    guideVi: 'Âm CONG LƯỠI + BẬT HƠI mạnh: uốn cong đầu lưỡi như "zh" nhưng bật mạnh luồng hơi ra ngoài (Chi -> Trư bật hơi).',
  },
  {
    stt: 17,
    pinyin: 'sh',
    vietnamese: 'S (cong lưỡi, bật hơi)',
    exampleCn: 'Shi',
    exampleVi: 'Sư',
    ttsChar: '诗',
    exampleHanzi: '师 (shī)',
    guideVi: 'Âm xát CONG LƯỠI: uốn cong đầu lưỡi lên gần ngạc cứng, đọc giống "S" nặng trong tiếng Việt (Shi -> Sư).',
  },
  {
    stt: 18,
    pinyin: 'r',
    vietnamese: 'R',
    exampleCn: 'Ri',
    exampleVi: 'Rư',
    ttsChar: '日',
    exampleHanzi: '日 (rì)',
    guideVi: 'Âm cong lưỡi rung nhẹ: uốn cong đầu lưỡi như "sh" và làm rung dây thanh quản (không rung đầu lưỡi quá mạnh), đọc giống "R" (Ri -> Rư).',
  },
  {
    stt: 19,
    pinyin: 'z',
    vietnamese: 'Ch (âm đầu lưỡi, thẳng lưỡi)',
    exampleCn: 'Zi',
    exampleVi: 'Chư',
    ttsChar: '资',
    exampleHanzi: '资 (zī)',
    guideVi: 'Âm đầu lưỡi trước (THẲNG LƯỠI), KHÔNG bật hơi: đầu lưỡi đặt thẳng chạm mặt sau răng cửa trên, đọc nhẹ "Ch/Tz" (Zi -> Chư).',
  },
  {
    stt: 20,
    pinyin: 'c',
    vietnamese: 'Ch/X (thẳng lưỡi, bật hơi, đầu lưỡi cắm vào mặt sau răng trên)',
    exampleCn: 'Ci',
    exampleVi: 'Chư/Xư',
    ttsChar: '雌',
    exampleHanzi: '次 (cì)',
    guideVi: 'Âm đầu lưỡi trước (THẲNG LƯỠI) + BẬT HƠI mạnh: đầu lưỡi chạm mặt sau răng trên rồi bật luồng hơi xát mạnh ra ngoài (Ci -> Chư/Xư bật hơi).',
  },
  {
    stt: 21,
    pinyin: 's',
    vietnamese: 'X (đầu lưỡi, chân răng dưới)',
    exampleCn: 'Si',
    exampleVi: 'Xư',
    ttsChar: '思',
    exampleHanzi: '四 (sì)',
    guideVi: 'Âm xát đầu lưỡi thẳng: lưỡi duỗi thẳng gần mặt sau răng cửa, đọc nhẹ như chữ "X" tiếng Việt (Si -> Xư).',
  },
  {
    stt: 22,
    pinyin: 'w - y',
    vietnamese: 'Qu - D',
    exampleCn: 'Wai - Yu',
    exampleVi: 'Quai - Duy',
    ttsChar: '歪',
    exampleHanzi: '外 (wài) · 鱼 (yú)',
    guideVi: 'Bán nguyên âm đứng đầu âm tiết: "w" đọc tròn môi như "Qu/U" (Wai -> Quai); "y" đọc như "D/I" hoặc khi đi với ü đọc là "Uy" (Yu -> Duy/Uy).',
  },
];

// III. 4 THANH ĐIỆU (Bám sát bảng III. THANH ĐIỆU trong ảnh)
export const PINYIN_TONES_4: PinyinToneItem[] = [
  {
    stt: 1,
    name: 'Thanh số 1',
    symbol: '" — "',
    description: 'Đọc gần giống thanh "Bằng" trong tiếng Việt, đọc Ngang không thêm dấu (cao và đều)',
    examplePinyin: 'Mā',
    exampleHanzi: '妈',
    exampleMeaning: 'Mẹ (Má)',
    pitchContour: '55 (Cao ngang)',
  },
  {
    stt: 2,
    name: 'Thanh số 2',
    symbol: '" / "',
    description: 'Đọc gần giống thanh "Hỏi" (hoặc sắc nhẹ vút lên) trong tiếng Việt, giọng đi từ trung bình lên cao',
    examplePinyin: 'Má',
    exampleHanzi: '麻',
    exampleMeaning: 'Cây gai / Tê',
    pitchContour: '35 (Đi lên)',
  },
  {
    stt: 3,
    name: 'Thanh số 3',
    symbol: '" ∨ "',
    description: 'Đọc gần giống thanh "Nặng" kết hợp "Hỏi" trong tiếng Việt (hạ trầm xuống rồi vòng lên)',
    examplePinyin: 'Mǎ',
    exampleHanzi: '马',
    exampleMeaning: 'Con ngựa',
    pitchContour: '214 (Trầm xuống rồi lên)',
  },
  {
    stt: 4,
    name: 'Thanh số 4',
    symbol: '" \\ "',
    description: 'Giống thanh 1 nhưng đọc nhanh và mạnh, dứt khoát từ cao xuống thấp, không thêm dấu',
    examplePinyin: 'Mà',
    exampleHanzi: '骂',
    exampleMeaning: 'Mắng',
    pitchContour: '51 (Dứt khoát từ cao xuống)',
  },
];

// IV. LƯU Ý BIẾN ĐIỆU (Bám sát mục IV. LƯU Ý trong ảnh)
export const TONE_SANDHI_RULES: ToneSandhiRule[] = [
  {
    id: 'sandhi_3_3',
    formula: 'Thanh 3 + Thanh 3 → Thanh 2 + Thanh 3',
    example: 'Nǐ hǎo (你好) → Ní hǎo',
    ttsHanzi: '你好',
    meaningVi: 'Xin chào (khi 2 thanh 3 đi liền nhau, chữ đầu đọc thành thanh 2, nhưng khi viết vẫn giữ nguyên dấu thanh 3)',
  },
  {
    id: 'sandhi_yi_4',
    formula: 'Yī (一) + Thanh 4 → Yí (Thanh 2)',
    example: 'Yī cì (一次) → Yí cì',
    ttsHanzi: '一次',
    meaningVi: 'Một lần (Chữ Yī đi trước một chữ mang thanh 4 thì biến đổi đọc thành thanh 2: Yí)',
  },
  {
    id: 'sandhi_bu_4',
    formula: 'Bù (不) + Thanh 4 → Bú (Thanh 2)',
    example: 'Bù shì (不是) → Bú shì',
    ttsHanzi: '不是',
    meaningVi: 'Không phải (Chữ Bù đi trước một chữ mang thanh 4 thì biến đổi đọc thành thanh 2: Bú)',
    note: 'Lưu ý chung: Chữ Bù (不) và Yī (一) đi với 1 chữ nào đó mà thanh số 4 thì biến đổi thành thanh số 2.',
  },
];

// V. CÁCH VIẾT NÉT THUẬN - 8 NÉT CƠ BẢN (Bám sát mục V trong ảnh)
export const BASIC_STROKES_8: BasicStrokeItem[] = [
  {
    id: 'ngang',
    nameVi: 'Nét ngang (横 - Héng)',
    shortLabel: 'Ngang',
    hanziSymbol: '一',
    directionVi: 'Nét thẳng ngang, kéo từ trái sang phải.',
    svgPaths: ['M 18 50 L 82 50'],
    examples: ['一', '二', '三', '十', '大'],
  },
  {
    id: 'so',
    nameVi: 'Nét sổ thẳng (竖 - Shù)',
    shortLabel: 'Sổ',
    hanziSymbol: '丨',
    directionVi: 'Nét thẳng đứng, kéo từ trên xuống dưới.',
    svgPaths: ['M 50 16 L 50 84'],
    examples: ['十', '中', '干', '川', '丰'],
  },
  {
    id: 'cham',
    nameVi: 'Nét chấm (点 - Diǎn)',
    shortLabel: 'Chấm',
    hanziSymbol: '丶',
    directionVi: 'Một dấu chấm từ trên xuống (hơi nghiêng sang phải).',
    svgPaths: ['M 40 32 Q 52 46 58 64'],
    examples: ['六', '主', '太', '玉', '文'],
  },
  {
    id: 'hat',
    nameVi: 'Nét hất (提 - Tí)',
    shortLabel: 'Hất',
    hanziSymbol: '㇀',
    directionVi: 'Nét cong/thẳng, hất chéo lên, từ dưới trái sang trên phải.',
    svgPaths: ['M 24 68 L 76 34'],
    examples: ['我', '河', '冰', '打', '习'],
  },
  {
    id: 'phay',
    nameVi: 'Nét phẩy (撇 - Piě)',
    shortLabel: 'Phẩy',
    hanziSymbol: '丿',
    directionVi: 'Nét cong, kéo xuống từ phải sang trái.',
    svgPaths: ['M 66 20 Q 54 55 24 80'],
    examples: ['人', '八', '大', '千', '月'],
  },
  {
    id: 'mac',
    nameVi: 'Nét mác (捺 - Nà)',
    shortLabel: 'Mác',
    hanziSymbol: '㇏',
    directionVi: 'Nét thẳng/cong nhẹ, kéo xuống từ trái sang phải.',
    svgPaths: ['M 26 22 Q 48 54 78 78'],
    examples: ['人', '八', '大', '天', '木'],
  },
  {
    id: 'gap',
    nameVi: 'Nét gập (折 - Zhé)',
    shortLabel: 'Gập',
    hanziSymbol: '𠃍',
    directionVi: 'Có một khúc gập đổi hướng ở giữa nét (ngang gập sổ, sổ gập ngang...).',
    svgPaths: ['M 24 28 L 72 28 L 72 76'],
    examples: ['口', '日', '山', '女', '马'],
  },
  {
    id: 'moc',
    nameVi: 'Nét móc (钩 - Gōu)',
    shortLabel: 'Móc',
    hanziSymbol: '亅',
    directionVi: 'Nét móc nhọn lên ở cuối các nét khác (sổ móc, ngang móc, cong móc, nghiêng móc).',
    svgPaths: ['M 54 16 L 54 74 Q 54 84 44 80 L 34 70'],
    examples: ['小', '水', '手', '了', '心'],
  },
];

export const STROKE_ORDER_RULES: StrokeOrderRuleItem[] = [
  {
    id: 'rule_1',
    ruleVi: 'Ngang trước sổ sau',
    examples: ['十', '干', '丁', '于', '斗', '并'],
  },
  {
    id: 'rule_2',
    ruleVi: 'Phẩy (丿) trước, mác (乀) sau',
    examples: ['八', '人', '天', '大', '入'],
  },
  {
    id: 'rule_3',
    ruleVi: 'Từ trái qua phải',
    examples: ['州', '做', '條', '划', '你', '好'],
  },
  {
    id: 'rule_4',
    ruleVi: 'Từ trên xuống dưới',
    examples: ['三', '合', '二', '全', '早'],
  },
  {
    id: 'rule_5',
    ruleVi: 'Từ ngoài vào trong',
    examples: ['月', '同', '風', '风', '周', '问'],
  },
  {
    id: 'rule_6',
    ruleVi: 'Bộ 辶 và 廴 viết sau cùng',
    examples: ['这', '还', '远', '建', '延'],
  },
  {
    id: 'rule_7',
    ruleVi: 'Giữa trước hai bên sau (áp dụng khi 2 bên đối xứng nhau)',
    examples: ['少', '小', '樂', '水', '永'],
  },
  {
    id: 'rule_8',
    ruleVi: 'Vào nhà trước, đóng cửa sau',
    examples: ['日', '回', '国', '固', '四'],
  },
  // Những quy tắc bổ sung (từ ảnh trang 4)
  {
    id: 'supp_1',
    ruleVi: 'Nét sổ thẳng viết sau cùng, nét xuyên ngang viết sau cùng',
    examples: ['聿', '弗', '中', '母'],
    isSupplementary: true,
  },
  {
    id: 'supp_2',
    ruleVi: 'Ở các chữ đối xứng theo chiều dọc, phần ở giữa viết trước, bên trái viết trước bên phải',
    examples: ['兜', '承'],
    isSupplementary: true,
  },
  {
    id: 'supp_3',
    ruleVi: 'Các nét sổ dọc bên trái được viết trước các nét bao quanh bên ngoài',
    examples: ['日', '口', '田'],
    isSupplementary: true,
  },
  {
    id: 'supp_4',
    ruleVi: 'Các thành phần bao quanh nằm dưới đáy của chữ thường được viết sau cùng',
    examples: ['道', '建', '凶', '画'],
    isSupplementary: true,
  },
  {
    id: 'supp_5',
    ruleVi: 'Các nét nhỏ (như nét chấm nhỏ) thường được viết sau cùng',
    examples: ['玉', '求', '朮', '犬'],
    isSupplementary: true,
  },
];

// BẢNG GHÉP VẦN PINYIN 37 CỘT × 22 HÀNG (Bám sát 2 trang bảng trong ảnh 1 & 2)
export const PINYIN_CHART_COLUMNS: PinyinChartColumn[] = [
  // Phần 1: Cột 1 -> 20
  { colIndex: 1, part: 1, finalLabel: 'o' },
  { colIndex: 2, part: 1, finalLabel: 'a' },
  { colIndex: 3, part: 1, finalLabel: 'e' },
  { colIndex: 4, part: 1, finalLabel: 'i', subNote: 'đọc ư' },
  { colIndex: 5, part: 1, finalLabel: 'i', subNote: 'đọc i' },
  { colIndex: 6, part: 1, finalLabel: 'ai' },
  { colIndex: 7, part: 1, finalLabel: 'ei' },
  { colIndex: 8, part: 1, finalLabel: 'ao' },
  { colIndex: 9, part: 1, finalLabel: 'ou' },
  { colIndex: 10, part: 1, finalLabel: 'an' },
  { colIndex: 11, part: 1, finalLabel: 'ang' },
  { colIndex: 12, part: 1, finalLabel: 'en' },
  { colIndex: 13, part: 1, finalLabel: 'eng' },
  { colIndex: 14, part: 1, finalLabel: 'ong' },
  { colIndex: 15, part: 1, finalLabel: 'er' },
  { colIndex: 16, part: 1, finalLabel: 'ia' },
  { colIndex: 17, part: 1, finalLabel: 'ie' },
  { colIndex: 18, part: 1, finalLabel: 'iao' },
  { colIndex: 19, part: 1, finalLabel: 'iou', subNote: 'iu' },
  { colIndex: 20, part: 1, finalLabel: 'ian' },
  // Phần 2: Cột 21 -> 37
  { colIndex: 21, part: 2, finalLabel: 'in' },
  { colIndex: 22, part: 2, finalLabel: 'ing' },
  { colIndex: 23, part: 2, finalLabel: 'iong' },
  { colIndex: 24, part: 2, finalLabel: 'iang' },
  { colIndex: 25, part: 2, finalLabel: 'ua' },
  { colIndex: 26, part: 2, finalLabel: 'uo' },
  { colIndex: 27, part: 2, finalLabel: 'uai' },
  { colIndex: 28, part: 2, finalLabel: 'uei', subNote: 'ui' },
  { colIndex: 29, part: 2, finalLabel: 'ueng' },
  { colIndex: 30, part: 2, finalLabel: 'u' },
  { colIndex: 31, part: 2, finalLabel: 'ü' },
  { colIndex: 32, part: 2, finalLabel: 'üe' },
  { colIndex: 33, part: 2, finalLabel: 'üan' },
  { colIndex: 34, part: 2, finalLabel: 'uan' },
  { colIndex: 35, part: 2, finalLabel: 'uang' },
  { colIndex: 36, part: 2, finalLabel: 'uen', subNote: 'un' },
  { colIndex: 37, part: 2, finalLabel: 'ün' },
];

export const PINYIN_CHART_ROWS: PinyinChartRow[] = [
  {
    stt: 1,
    initial: 'b',
    displayInitial: 'b',
    cells: {
      1: 'bo', 2: 'ba', 5: 'bi', 6: 'bai', 7: 'bei', 8: 'bao', 10: 'ban', 11: 'bang', 12: 'ben', 13: 'beng', 17: 'bie', 18: 'biao', 20: 'bian',
      21: 'bin', 22: 'bing', 30: 'bu',
    },
  },
  {
    stt: 2,
    initial: 'p',
    displayInitial: 'p',
    cells: {
      1: 'po', 2: 'pa', 5: 'pi', 6: 'pai', 7: 'pei', 8: 'pao', 9: 'pou', 10: 'pan', 11: 'pang', 12: 'pen', 13: 'peng', 17: 'pie', 18: 'piao', 20: 'pian',
      21: 'pin', 22: 'ping', 30: 'pu',
    },
  },
  {
    stt: 3,
    initial: 'm',
    displayInitial: 'm',
    cells: {
      1: 'mo', 2: 'ma', 3: 'me', 5: 'mi', 6: 'mai', 7: 'mei', 8: 'mao', 9: 'mou', 10: 'man', 11: 'mang', 12: 'men', 13: 'meng', 17: 'mie', 18: 'miao', 19: 'miu', 20: 'mian',
      21: 'min', 22: 'ming', 30: 'mu',
    },
  },
  {
    stt: 4,
    initial: 'f',
    displayInitial: 'f',
    cells: {
      1: 'fo', 2: 'fa', 7: 'fei', 9: 'fou', 10: 'fan', 11: 'fang', 12: 'fen', 13: 'feng',
      30: 'fu',
    },
  },
  {
    stt: 5,
    initial: 'd',
    displayInitial: 'd',
    cells: {
      2: 'da', 3: 'de', 5: 'di', 6: 'dai', 7: 'dei', 8: 'dao', 9: 'dou', 10: 'dan', 11: 'dang', 12: 'den', 13: 'deng', 14: 'dong', 16: 'dia', 17: 'die', 18: 'diao', 19: 'diu', 20: 'dian',
      22: 'ding', 26: 'duo', 28: 'dui', 30: 'du', 34: 'duan', 36: 'dun',
    },
  },
  {
    stt: 6,
    initial: 't',
    displayInitial: 't',
    cells: {
      2: 'ta', 3: 'te', 5: 'ti', 6: 'tai', 7: 'tei', 8: 'tao', 9: 'tou', 10: 'tan', 11: 'tang', 13: 'teng', 14: 'tong', 17: 'tie', 18: 'tiao', 20: 'tian',
      22: 'ting', 26: 'tuo', 28: 'tui', 30: 'tu', 34: 'tuan', 36: 'tun',
    },
  },
  {
    stt: 7,
    initial: 'n',
    displayInitial: 'n',
    cells: {
      2: 'na', 3: 'ne', 5: 'ni', 6: 'nai', 7: 'nei', 8: 'nao', 9: 'nou', 10: 'nan', 11: 'nang', 12: 'nen', 13: 'neng', 14: 'nong', 17: 'nie', 18: 'niao', 19: 'niu', 20: 'nian',
      21: 'nin', 22: 'ning', 24: 'niang', 26: 'nuo', 30: 'nu', 31: 'nü', 32: 'nüe', 34: 'nuan',
    },
  },
  {
    stt: 8,
    initial: 'l',
    displayInitial: 'l',
    cells: {
      2: 'la', 3: 'le', 5: 'li', 6: 'lai', 7: 'lei', 8: 'lao', 9: 'lou', 10: 'lan', 11: 'lang', 13: 'leng', 14: 'long', 16: 'lia', 17: 'lie', 18: 'liao', 19: 'liu', 20: 'lian',
      21: 'lin', 22: 'ling', 24: 'liang', 26: 'luo', 30: 'lu', 31: 'lü', 32: 'lüe', 34: 'luan', 36: 'lun',
    },
  },
  {
    stt: 9,
    initial: 'g',
    displayInitial: 'g',
    cells: {
      2: 'ga', 3: 'ge', 6: 'gai', 7: 'gei', 8: 'gao', 9: 'gou', 10: 'gan', 11: 'gang', 12: 'gen', 13: 'geng', 14: 'gong',
      25: 'gua', 26: 'guo', 27: 'guai', 28: 'gui', 30: 'gu', 34: 'guan', 35: 'guang', 36: 'gun',
    },
  },
  {
    stt: 10,
    initial: 'k',
    displayInitial: 'k',
    cells: {
      2: 'ka', 3: 'ke', 6: 'kai', 8: 'kao', 9: 'kou', 10: 'kan', 11: 'kang', 12: 'ken', 13: 'keng', 14: 'kong',
      25: 'kua', 26: 'kuo', 27: 'kuai', 28: 'kui', 30: 'ku', 34: 'kuan', 35: 'kuang', 36: 'kun',
    },
  },
  {
    stt: 11,
    initial: 'h',
    displayInitial: 'h',
    cells: {
      2: 'ha', 3: 'he', 6: 'hai', 7: 'hei', 8: 'hao', 9: 'hou', 10: 'han', 11: 'hang', 12: 'hen', 13: 'heng', 14: 'hong',
      25: 'hua', 26: 'huo', 27: 'huai', 28: 'hui', 30: 'hu', 34: 'huan', 35: 'huang', 36: 'hun',
    },
  },
  {
    stt: 12,
    initial: 'j',
    displayInitial: 'j',
    cells: {
      5: 'ji', 16: 'jia', 17: 'jie', 18: 'jiao', 19: 'jiu', 20: 'jian',
      21: 'jin', 22: 'jing', 23: 'jiong', 24: 'jiang', 31: 'ju', 32: 'jue', 33: 'juan', 37: 'jun',
    },
  },
  {
    stt: 13,
    initial: 'q',
    displayInitial: 'q',
    cells: {
      5: 'qi', 16: 'qia', 17: 'qie', 18: 'qiao', 19: 'qiu', 20: 'qian',
      21: 'qin', 22: 'qing', 23: 'qiong', 24: 'qiang', 31: 'qu', 32: 'que', 33: 'quan', 37: 'qun',
    },
  },
  {
    stt: 14,
    initial: 'x',
    displayInitial: 'x',
    cells: {
      5: 'xi', 16: 'xia', 17: 'xie', 18: 'xiao', 19: 'xiu', 20: 'xian',
      21: 'xin', 22: 'xing', 23: 'xiong', 24: 'xiang', 31: 'xu', 32: 'xue', 33: 'xuan', 37: 'xun',
    },
  },
  {
    stt: 15,
    initial: 'zh',
    displayInitial: 'zh',
    cells: {
      2: 'zha', 3: 'zhe', 4: 'zhi', 6: 'zhai', 7: 'zhei', 8: 'zhao', 9: 'zhou', 10: 'zhan', 11: 'zhang', 12: 'zhen', 13: 'zheng', 14: 'zhong',
      25: 'zhua', 26: 'zhuo', 27: 'zhuai', 28: 'zhui', 30: 'zhu', 34: 'zhuan', 35: 'zhuang', 36: 'zhun',
    },
  },
  {
    stt: 16,
    initial: 'ch',
    displayInitial: 'ch',
    cells: {
      2: 'cha', 3: 'che', 4: 'chi', 6: 'chai', 8: 'chao', 9: 'chou', 10: 'chan', 11: 'chang', 12: 'chen', 13: 'cheng', 14: 'chong',
      26: 'chuo', 28: 'chui', 30: 'chu', 34: 'chuan', 35: 'chuang', 36: 'chun',
    },
  },
  {
    stt: 17,
    initial: 'sh',
    displayInitial: 'sh',
    cells: {
      2: 'sha', 3: 'she', 4: 'shi', 6: 'shai', 7: 'shei', 8: 'shao', 9: 'shou', 10: 'shan', 11: 'shang', 12: 'shen', 13: 'sheng',
      25: 'shua', 26: 'shuo', 27: 'shuai', 28: 'shui', 30: 'shu', 34: 'shuan', 35: 'shuang', 36: 'shun',
    },
  },
  {
    stt: 18,
    initial: 'r',
    displayInitial: 'r',
    cells: {
      3: 're', 4: 'ri', 8: 'rao', 9: 'rou', 10: 'ran', 11: 'rang', 12: 'ren', 13: 'reng', 14: 'rong',
      26: 'ruo', 28: 'rui', 30: 'ru', 34: 'ruan', 36: 'run',
    },
  },
  {
    stt: 19,
    initial: 'z',
    displayInitial: 'z',
    cells: {
      2: 'za', 3: 'ze', 4: 'zi', 6: 'zai', 7: 'zei', 8: 'zao', 9: 'zou', 10: 'zan', 11: 'zang', 12: 'zen', 13: 'zeng', 14: 'zong',
      26: 'zuo', 28: 'zui', 30: 'zu', 34: 'zuan', 36: 'zun',
    },
  },
  {
    stt: 20,
    initial: 'c',
    displayInitial: 'c',
    cells: {
      2: 'ca', 3: 'ce', 4: 'ci', 6: 'cai', 8: 'cao', 9: 'cou', 10: 'can', 11: 'cang', 12: 'cen', 13: 'ceng', 14: 'cong',
      26: 'cuo', 28: 'cui', 30: 'cu', 34: 'cuan', 36: 'cun',
    },
  },
  {
    stt: 21,
    initial: 's',
    displayInitial: 's',
    cells: {
      2: 'sa', 3: 'se', 4: 'si', 6: 'sai', 8: 'sao', 9: 'sou', 10: 'san', 11: 'sang', 12: 'sen', 13: 'seng', 14: 'song',
      26: 'suo', 28: 'sui', 30: 'su', 34: 'suan', 36: 'sun',
    },
  },
  {
    stt: 22,
    initial: '',
    displayInitial: 'w / y',
    cells: {
      1: 'wo', 5: 'yi', 8: 'yao', 9: 'you', 11: 'yang', 15: 'er', 16: 'ya', 17: 'ye', 20: 'yan',
      21: 'yin', 22: 'ying', 23: 'yong', 25: 'wa', 27: 'wai', 28: 'wei', 29: 'weng', 30: 'wu', 31: 'yu', 32: 'yue', 33: 'yuan', 34: 'wan', 35: 'wang', 36: 'wen', 37: 'yun',
    },
  },
];

const VOWEL_TONE_MARKS: Record<string, [string, string, string, string]> = {
  a: ['ā', 'á', 'ǎ', 'à'],
  o: ['ō', 'ó', 'ǒ', 'ò'],
  e: ['ē', 'é', 'ě', 'è'],
  i: ['ī', 'í', 'ǐ', 'ì'],
  u: ['ū', 'ú', 'ǔ', 'ù'],
  ü: ['ǖ', 'ǘ', 'ǚ', 'ǜ'],
};

/**
 * Adds standard Pinyin tone mark (1..4) to a base syllable (e.g. "lao" + 3 -> "lǎo")
 */
export function applyToneToSyllable(syllable: string, tone: 1 | 2 | 3 | 4): string {
  const s = syllable.trim().toLowerCase();
  const idx = tone - 1;

  // Rule 1: 'a' or 'e' always takes the tone mark
  if (s.includes('a')) {
    return s.replace('a', VOWEL_TONE_MARKS.a[idx]);
  }
  if (s.includes('e')) {
    return s.replace('e', VOWEL_TONE_MARKS.e[idx]);
  }
  // Rule 2: 'ou' -> 'o' takes the mark
  if (s.includes('ou')) {
    return s.replace('o', VOWEL_TONE_MARKS.o[idx]);
  }
  // Rule 3: 'iu' or 'ui' -> the second vowel takes the mark
  if (s.includes('iu')) {
    return s.replace('u', VOWEL_TONE_MARKS.u[idx]);
  }
  if (s.includes('ui')) {
    return s.replace('i', VOWEL_TONE_MARKS.i[idx]);
  }
  // Otherwise, mark the last vowel in the syllable
  for (let i = s.length - 1; i >= 0; i--) {
    const ch = s[i];
    if (VOWEL_TONE_MARKS[ch]) {
      return s.slice(0, i) + VOWEL_TONE_MARKS[ch][idx] + s.slice(i + 1);
    }
  }
  return s;
}

/**
 * Strips tone marks from accented Pinyin and returns { base, tone }
 */
export function parseAccentedPinyin(input: string): { base: string; tone: number } {
  const clean = input.trim().toLowerCase();
  let base = '';
  let detectedTone = 1;
  for (const ch of clean) {
    let matched = false;
    for (const [vowel, forms] of Object.entries(VOWEL_TONE_MARKS)) {
      const tIdx = forms.indexOf(ch);
      if (tIdx !== -1) {
        base += vowel;
        detectedTone = tIdx + 1;
        matched = true;
        break;
      }
    }
    if (!matched) {
      base += ch;
    }
  }
  return { base, tone: detectedTone };
}

/**
 * Canonical 4-tone Mandarin Hanzi map for accurate native Chinese TTS playback
 * and speech recognition matching across the Pinyin table.
 */
export const SYLLABLE_4_TONE_HANZI: Record<string, [string, string, string, string]> = {
  // b
  bo: ['波', '伯', '跛', '播'],
  ba: ['八', '拔', '把', '爸'],
  bi: ['逼', '鼻', '笔', '必'],
  bai: ['掰', '白', '百', '拜'],
  bei: ['杯', '倍', '北', '背'],
  bao: ['包', '薄', '饱', '报'],
  ban: ['班', '拔', '板', '半'],
  bang: ['帮', '旁', '榜', '棒'],
  ben: ['奔', '笨', '本', '笨'],
  beng: ['崩', '甭', '绷', '蹦'],
  bie: ['憋', '别', '瘪', '别'],
  biao: ['标', '表', '表', ''],
  bian: ['边', '便', '扁', '变'],
  bin: ['宾', '濒', '品', '鬓'],
  bing: ['冰', '丙', '饼', '病'],
  bu: ['杯', '不', '补', '不'],
  // p
  po: ['坡', '婆', '颇', '破'],
  pa: ['趴', '爬', '怕', '怕'],
  pi: ['批', '皮', '匹', '屁'],
  pai: ['拍', '排', '迫', '派'],
  pei: ['胚', '陪', '呸', '配'],
  pao: ['抛', '袍', '跑', '泡'],
  pou: ['剖', '抔', '掊', '剖'],
  pan: ['攀', '盘', '判', '盼'],
  pang: ['滂', '旁', '耪', '胖'],
  pen: ['喷', '盆', '本', '喷'],
  peng: ['烹', '朋', '捧', '碰'],
  pie: ['氕', '撇', '撇', '瞥'],
  piao: ['飘', '嫖', '漂', '票'],
  pian: ['篇', '便宜', '扁', '骗'],
  pin: ['拼', '贫', '品', '聘'],
  ping: ['乒', '平', '品', '评'],
  pu: ['扑', '葡', '普', '铺'],
  // m
  mo: ['摸', '磨', '抹', '末'],
  ma: ['妈', '麻', '马', '骂'],
  me: ['么', '模', '抹', '么'],
  mi: ['咪', '迷', '米', '密'],
  mai: ['埋', '埋', '买', '卖'],
  mei: ['枚', '没', '美', '妹'],
  mao: ['猫', '毛', '卯', '帽'],
  mou: ['哞', '谋', '某', '贸'],
  man: ['颟', '忙', '满', '慢'],
  mang: ['忙', '忙', '莽', '忙'],
  men: ['闷', '门', '满', '闷'],
  meng: ['蒙', '盟', '猛', '梦'],
  mie: ['咩', '灭', '灭', '灭'],
  miao: ['喵', '苗', '秒', '妙'],
  miu: ['喵', '缪', '谬', '谬'],
  mian: ['眠', '棉', '免', '面'],
  min: ['民', '民', '敏', '民'],
  ming: ['明', '明', '敏', '命'],
  mu: ['摸', '模', '母', '木'],
  // f
  fo: ['佛', '佛', '佛', '佛'],
  fa: ['发', '罚', '法', '发'],
  fei: ['飞', '肥', '匪', '费'],
  fou: ['夫', '浮', '否', '否'],
  fan: ['翻', '凡', '反', '饭'],
  fang: ['方', '房', '访', '放'],
  fen: ['分', '坟', '粉', '份'],
  feng: ['风', '逢', '讽', '凤'],
  fu: ['夫', '服', '府', '父'],
  // d
  da: ['搭', '答', '打', '大'],
  de: ['得', '德', '得', '的'],
  di: ['低', '敌', '底', '弟'],
  dai: ['呆', '代', '歹', '带'],
  dei: ['得', '得', '得', '代'],
  dao: ['刀', '导', '岛', '到'],
  dou: ['都', '读', '抖', '豆'],
  dan: ['单', '谈', '胆', '但'],
  dang: ['当', '挡', '党', '当'],
  den: ['扽', '扽', '等', '扽'],
  deng: ['灯', '等', '等', '邓'],
  dong: ['东', '懂', '懂', '动'],
  dia: ['嗲', '嗲', '嗲', '嗲'],
  die: ['爹', '叠', '跌', '跌'],
  diao: ['雕', '调', '鸟', '掉'],
  diu: ['丢', '丢', '丢', '丢'],
  dian: ['颠', '点', '点', '电'],
  ding: ['丁', '顶', '顶', '定'],
  duo: ['多', '夺', '朵', '舵'],
  dui: ['堆', '队', '对', '对'],
  du: ['都', '读', '赌', '度'],
  duan: ['端', '短', '短', '段'],
  dun: ['吨', '囤', '盹', '顿'],
  // t
  ta: ['他', '塔', '塔', '踏'],
  te: ['特', '特', '特', '特'],
  ti: ['梯', '提', '体', '替'],
  tai: ['胎', '台', '太', '太'],
  tei: ['忒', '忒', '忒', '太'],
  tao: ['掏', '逃', '讨', '套'],
  tou: ['偷', '头', '抖', '透'],
  tan: ['摊', '谈', '毯', '叹'],
  tang: ['汤', '糖', '躺', '烫'],
  teng: ['疼', '疼', '腾', '痛'],
  tong: ['通', '同', '统', '痛'],
  tie: ['贴', '铁', '铁', '帖'],
  tiao: ['挑', '条', '挑', '跳'],
  tian: ['天', '甜', '舔', '田'],
  ting: ['听', '停', '挺', '听'],
  tuo: ['拖', '驼', '妥', '拓'],
  tui: ['推', '颓', '腿', '退'],
  tu: ['秃', '图', '土', '兔'],
  tuan: ['湍', '团', '短', '团'],
  tun: ['吞', '屯', '滚', '褪'],
  // n
  na: ['那', '拿', '哪', '那'],
  ne: ['呢', '呢', '呐', '呢'],
  ni: ['妮', '泥', '你', '腻'],
  nai: ['乃', '乃', '奶', '奈'],
  nei: ['内', '内', '哪', '内'],
  nao: ['猫', '挠', '脑', '闹'],
  nou: ['耨', '耨', '耨', '耨'],
  nan: ['囡', '难', '腩', '难'],
  nang: ['囊', '囊', '攮', '齉'],
  nen: ['嫩', '您', '嫩', '嫩'],
  neng: ['能', '能', '能', '能'],
  nong: ['农', '农', '拢', '弄'],
  nie: ['捏', '茶', '啮', '孽'],
  niao: ['鸟', '鸟', '鸟', '尿'],
  niu: ['妞', '牛', '扭', '拗'],
  nian: ['拈', '年', '碾', '念'],
  nin: ['您', '您', '敏', '您'],
  ning: ['宁', '宁', '拧', '泞'],
  niang: ['娘', '娘', '两', '酿'],
  nuo: ['诺', '挪', '懦', '诺'],
  nu: ['奴', '奴', '努', '怒'],
  nü: ['女', '女', '女', '女'],
  nüe: ['虐', '虐', '虐', '虐'],
  nuan: ['暖', '暖', '暖', '暖'],
  // l
  la: ['拉', '旯', '喇叭', '辣'],
  le: ['勒', '乐', '了', '乐'],
  li: ['哩', '离', '里', '力'],
  lai: ['来', '来', '买', '赖'],
  lei: ['勒', '雷', '垒', '累'],
  lao: ['捞', '劳', '老', '烙'],
  lou: ['搂', '楼', '搂', '漏'],
  lan: ['兰', '蓝', '览', '烂'],
  lang: ['狼', '狼', '朗', '浪'],
  leng: ['棱', '棱', '冷', '愣'],
  long: ['龙', '龙', '拢', '弄'],
  lia: ['俩', '俩', '俩', '俩'],
  lie: ['咧', '裂', '咧', '列'],
  liao: ['撩', '聊', '了', '料'],
  liu: ['溜', '留', '柳', '六'],
  lian: ['连', '连', '脸', '练'],
  lin: ['林', '林', '凛', '赁'],
  ling: ['拎', '零', '领', '令'],
  liang: ['良', '凉', '两', '亮'],
  luo: ['啰', '罗', '裸', '落'],
  lu: ['撸', '炉', '鲁', '路'],
  lü: ['驴', '驴', '旅', '绿'],
  lüe: ['略', '略', '略', '略'],
  luan: ['峦', '峦', '卵', '乱'],
  lun: ['抡', '轮', '论', '论'],
  // g
  ga: ['咖', '嘎', '嘎', '尬'],
  ge: ['哥', '革', '葛', '个'],
  gai: ['该', '改', '改', '盖'],
  gei: ['给', '给', '给', '给'],
  gao: ['高', '搞', '搞', '告'],
  gou: ['沟', '狗', '狗', '够'],
  gan: ['干', '敢', '感', '干'],
  gang: ['刚', '扛', '岗', '杠'],
  gen: ['根', '哏', '艮', '跟'],
  geng: ['更', '脖', '耿', '更'],
  gong: ['工', '共', '巩', '共'],
  gua: ['瓜', '刮', '寡', '挂'],
  guo: ['锅', '国', '果', '过'],
  guai: ['乖', '拐', '拐', '怪'],
  gui: ['归', '鬼', '鬼', '贵'],
  gu: ['姑', '骨', '古', '故'],
  guan: ['关', '馆', '管', '惯'],
  guang: ['光', '广', '广', '逛'],
  gun: ['滚', '滚', '滚', '棍'],
  // k
  ka: ['咖', '咳', '卡', '卡'],
  ke: ['科', '咳', '渴', '客'],
  kai: ['开', '凯', '凯', '慨'],
  kao: ['尻', '烤', '考', '靠'],
  kou: ['抠', '口', '口', '扣'],
  kan: ['刊', '砍', '砍', '看'],
  kang: ['康', '扛', '慷', '抗'],
  ken: ['坑', '肯', '肯', '肯'],
  keng: ['坑', '坑', '肯', '坑'],
  kong: ['空', '孔', '恐', '空'],
  kua: ['夸', '垮', '垮', '跨'],
  kuo: ['宽', '扩', '阔', '阔'],
  kuai: ['快', '怀', '块', '快'],
  kui: ['亏', '魁', '傀', '愧'],
  ku: ['哭', '苦', '苦', '裤'],
  kuan: ['宽', '款', '款', '款'],
  kuang: ['筐', '狂', '枉', '况'],
  kun: ['昆', '捆', '捆', '困'],
  // h
  ha: ['哈', '蛤', '哈', '哈'],
  he: ['喝', '河', '渴', '贺'],
  hai: ['嗨', '孩', '海', '害'],
  hei: ['黑', '黑', '黑', '黑'],
  hao: ['蒿', '毫', '好', '号'],
  hou: ['齁', '猴', '吼', '后'],
  han: ['酣', '寒', '喊', '汗'],
  hang: ['夯', '行', '航', '巷'],
  hen: ['哼', '痕', '很', '恨'],
  heng: ['哼', '恒', '冷', '横'],
  hong: ['烘', '红', '哄', '哄'],
  hua: ['花', '华', '画', '话'],
  huo: ['豁', '活', '火', '或'],
  huai: ['怀', '怀', '坏', '坏'],
  hui: ['灰', '回', '毁', '会'],
  hu: ['呼', '壶', '虎', '户'],
  huan: ['欢', '环', '缓', '换'],
  huang: ['荒', '黄', '谎', '晃'],
  hun: ['昏', '魂', '混', '混'],
  // j
  ji: ['鸡', '及', '己', '记'],
  jia: ['家', '夹', '假', '价'],
  jie: ['街', '节', '姐', '借'],
  jiao: ['教', '嚼', '脚', '叫'],
  jiu: ['究', '求', '九', '就'],
  jian: ['间', '钱', '剪', '见'],
  jin: ['斤', '琴', '紧', '进'],
  jing: ['京', '晴', '井', '静'],
  jiong: ['扃', '穷', '迥', '窘'],
  jiang: ['江', '强', '讲', '降'],
  ju: ['居', '局', '举', '句'],
  jue: ['撅', '决', '角', '觉'],
  juan: ['捐', '全', '卷', '倦'],
  jun: ['军', '群', '窘', '俊'],
  // q
  qi: ['七', '齐', '起', '气'],
  qia: ['掐', '卡', '卡', '恰'],
  qie: ['切', '茄', '且', '切'],
  qiao: ['敲', '桥', '巧', '俏'],
  qiu: ['秋', '球', '糗', '求'],
  qian: ['千', '钱', '浅', '欠'],
  qin: ['亲', '琴', '寝', '沁'],
  qing: ['清', '晴', '请', '庆'],
  qiong: ['穹', '穷', '迥', '穷'],
  qiang: ['枪', '强', '抢', '呛'],
  qu: ['区', '渠', '取', '去'],
  que: ['缺', '瘸', '却', '确'],
  quan: ['圈', '全', '犬', '劝'],
  qun: ['群', '群', '犬', '群'],
  // x
  xi: ['西', '习', '洗', '戏'],
  xia: ['瞎', '匣', '小', '下'],
  xie: ['些', '鞋', '写', '谢'],
  xiao: ['消', '学', '小', '笑'],
  xiu: ['修', '球', '朽', '秀'],
  xian: ['先', '闲', '显', '现'],
  xin: ['心', '寻', '醒', '信'],
  xing: ['星', '行', '醒', '姓'],
  xiong: ['兄', '雄', '炯', '胸'],
  xiang: ['香', '详', '想', '向'],
  xu: ['虚', '徐', '许', '续'],
  xue: ['薛', '学', '雪', '血'],
  xuan: ['宣', '悬', '选', '炫'],
  xun: ['勋', '寻', '损', '训'],
  // zh
  zha: ['扎', '砸', '眨', '炸'],
  zhe: ['遮', '折', '者', '这'],
  zhi: ['知', '直', '纸', '至'],
  zhai: ['斋', '宅', '窄', '债'],
  zhei: ['这', '这', '这', '这'],
  zhao: ['招', '着', '找', '照'],
  zhou: ['州', '轴', '肘', '昼'],
  zhan: ['沾', '咱', '斩', '站'],
  zhang: ['张', '常', '涨', '丈'],
  zhen: ['真', '神', '枕', '震'],
  zheng: ['争', '成', '整', '正'],
  zhong: ['中', '虫', '肿', '重'],
  zhua: ['抓', '抓', '爪', '抓'],
  zhuo: ['桌', '着', '左', '捉'],
  zhuai: ['拽', '拽', '转', '拽'],
  zhui: ['追', '垂', '嘴', '坠'],
  zhu: ['猪', '竹', '主', '住'],
  zhuan: ['专', '船', '转', '赚'],
  zhuang: ['装', '床', '爽', '壮'],
  zhun: ['谆', '纯', '准', '准'],
  // ch
  cha: ['叉', '茶', '察', '差'],
  che: ['车', '折', '扯', '彻'],
  chi: ['吃', '迟', '尺', '赤'],
  chai: ['拆', '柴', '窄', '债'],
  chao: ['抄', '潮', '吵', '吵'],
  chou: ['抽', '愁', '丑', '臭'],
  chan: ['搀', '馋', '产', '颤'],
  chang: ['昌', '常', '厂', '唱'],
  chen: ['嗔', '陈', '惨', '趁'],
  cheng: ['称', '成', '逞', '秤'],
  chong: ['冲', '虫', '宠', '冲'],
  chuo: ['戳', '着', '尺', '绰'],
  chui: ['吹', '垂', '嘴', '吹'],
  chu: ['出', '除', '楚', '处'],
  chuan: ['穿', '船', '喘', '串'],
  chuang: ['窗', '床', '闯', '创'],
  chun: ['春', '纯', '蠢', '春'],
  // sh
  sha: ['沙', '啥', '傻', '厦'],
  she: ['奢', '蛇', '舍', '射'],
  shi: ['师', '十', '史', '是'],
  shai: ['筛', '柴', '色', '晒'],
  shei: ['谁', '谁', '水', '谁'],
  shao: ['烧', '勺', '少', '绍'],
  shou: ['收', '熟', '手', '受'],
  shan: ['山', '馋', '闪', '扇'],
  shang: ['商', '裳', '赏', '上'],
  shen: ['深', '神', '审', '甚'],
  sheng: ['生', '绳', '省', '胜'],
  shua: ['刷', '刷', '耍', '刷'],
  shuo: ['说', '着', '所', '硕'],
  shuai: ['摔', '甩', '甩', '帅'],
  shui: ['吹', '谁', '水', '睡'],
  shu: ['书', '熟', '鼠', '树'],
  shuan: ['拴', '船', '闪', '涮'],
  shuang: ['双', '床', '爽', '双'],
  shun: ['春', '纯', '吮', '顺'],
  // r
  re: ['热', '人', '惹', '热'],
  ri: ['知', '十', '尔', '日'],
  rao: ['烧', '饶', '扰', '绕'],
  rou: ['收', '柔', '揉', '肉'],
  ran: ['山', '然', '染', '让'],
  rang: ['商', '瓤', '壤', '让'],
  ren: ['深', '人', '忍', '认'],
  reng: ['扔', '仍', '冷', '扔'],
  rong: ['中', '容', '冗', '用'],
  ruo: ['说', '如', '惹', '弱'],
  rui: ['追', '随', '蕊', '瑞'],
  ru: ['书', '如', '乳', '入'],
  ruan: ['专', '船', '软', '软'],
  run: ['春', '轮', '准', '润'],
  // z
  za: ['扎', '砸', '咋', '杂'],
  ze: ['遮', '则', '怎', '仄'],
  zi: ['资', '词', '子', '字'],
  zai: ['灾', '才', '宰', '在'],
  zei: ['杯', '贼', '美', '贼'],
  zao: ['遭', '凿', '早', '造'],
  zou: ['邹', '愁', '走', '奏'],
  zan: ['簪', '咱', '攒', '赞'],
  zang: ['脏', '藏', '驵', '葬'],
  zen: ['针', '岑', '怎', '谮'],
  zeng: ['增', '层', '整', '赠'],
  zong: ['宗', '从', '总', '纵'],
  zuo: ['作', '昨', '左', '坐'],
  zui: ['堆', '随', '嘴', '最'],
  zu: ['租', '足', '组', '足'],
  zuan: ['钻', '攒', '纂', '赚'],
  zun: ['尊', '存', '撙', '俊'],
  // c
  ca: ['擦', '茶', '礤', '擦'],
  ce: ['车', '折', '尺', '侧'],
  ci: ['疵', '词', '此', '次'],
  cai: ['猜', '才', '采', '菜'],
  cao: ['操', '曹', '草', '糙'],
  cou: ['抽', '愁', '丑', '凑'],
  can: ['餐', '残', '惨', '灿'],
  cang: ['苍', '藏', '厂', '藏'],
  cen: ['参', '岑', '惨', '趁'],
  ceng: ['噌', '层', '逞', '蹭'],
  cong: ['匆', '从', '宠', '从'],
  cuo: ['搓', '痤', '脞', '错'],
  cui: ['催', '随', '璀', '翠'],
  cu: ['粗', '除', '楚', '促'],
  cuan: ['蹿', '攒', '喘', '窜'],
  cun: ['村', '存', '忖', '寸'],
  // s
  sa: ['撒', '啥', '洒', '飒'],
  se: ['奢', '蛇', '舍', '色'],
  si: ['思', '十', '死', '四'],
  sai: ['腮', '才', '色', '赛'],
  sao: ['骚', '勺', '嫂', '扫'],
  sou: ['搜', '熟', '叟', '嗽'],
  san: ['三', '咱', '伞', '散'],
  sang: ['桑', '藏', '嗓', '丧'],
  sen: ['森', '神', '审', '甚'],
  seng: ['僧', '层', '省', '胜'],
  song: ['松', '从', '耸', '送'],
  suo: ['缩', '昨', '所', '锁'],
  sui: ['虽', '随', '髓', '岁'],
  su: ['苏', '俗', '鼠', '素'],
  suan: ['酸', '船', '选', '算'],
  sun: ['孙', '存', '损', '逊'],
  // row 22 (w / y / zero initial)
  wo: ['窝', '哦', '我', '卧'],
  yi: ['一', '姨', '椅', '意'],
  yao: ['腰', '摇', '咬', '要'],
  you: ['优', '由', '有', '又'],
  yang: ['央', '羊', '养', '样'],
  er: ['儿', '儿', '耳', '二'],
  ya: ['丫', '牙', '雅', '亚'],
  ye: ['耶', '爷', '也', '夜'],
  yan: ['烟', '言', '眼', '燕'],
  yin: ['因', '银', '引', '印'],
  ying: ['英', '迎', '影', '应'],
  yong: ['拥', '容', '永', '用'],
  wa: ['蛙', '娃', '瓦', '袜'],
  wai: ['歪', '怀', '崴', '外'],
  wei: ['威', '围', '伟', '为'],
  weng: ['翁', '翁', '蓊', '瓮'],
  wu: ['乌', '无', '五', '物'],
  yu: ['迂', '鱼', '雨', '玉'],
  yue: ['约', '学', '雪', '月'],
  yuan: ['冤', '元', '远', '院'],
  wan: ['弯', '完', '晚', '万'],
  wang: ['汪', '王', '网', '忘'],
  wen: ['温', '文', '吻', '问'],
  yun: ['晕', '云', '允', '运'],
};

/**
 * Returns the 4 tone characters for any syllable
 */
export function getToneCharactersForSyllable(syllable: string): [string, string, string, string] {
  const key = syllable.trim().toLowerCase();
  if (SYLLABLE_4_TONE_HANZI[key]) {
    return SYLLABLE_4_TONE_HANZI[key];
  }
  return ['啊', '麻', '马', '骂'];
}

/**
 * Generates an accurate Vietnamese articulatory guide for any syllable
 */
export function getSyllableArticulationGuide(
  syllable: string,
  initial: string
): {
  initialTip: string;
  finalTip: string;
  vietnameseApprox: string;
} {
  const cleanSyl = syllable.trim().toLowerCase();
  const initObj = PINYIN_INITIALS_22.find((i) => i.pinyin === initial) ||
    (cleanSyl.startsWith('w') || cleanSyl.startsWith('y')
      ? PINYIN_INITIALS_22[21]
      : null);

  let finalPart = initial ? cleanSyl.slice(initial.length) : cleanSyl;
  if (['j', 'q', 'x'].includes(initial) && finalPart.startsWith('u')) {
    finalPart = 'ü' + finalPart.slice(1);
  }

  const finalObj =
    PINYIN_FINALS_38.find((f) => {
      const p = f.pinyin.replace(/\s+/g, '');
      if (p === finalPart) return true;
      if (p === 'iou(iu)' && (finalPart === 'iu' || finalPart === 'iou')) return true;
      if (p === 'uei(ui)' && (finalPart === 'ui' || finalPart === 'uei')) return true;
      if (p === 'uen(un)' && (finalPart === 'un' || finalPart === 'uen')) return true;
      return false;
    }) ||
    (['zh', 'ch', 'sh', 'r', 'z', 'c', 's'].includes(initial) && finalPart === 'i'
      ? PINYIN_FINALS_38[8] // i -> ư
      : PINYIN_FINALS_38.find((f) => f.pinyin === finalPart));

  const isRetroflexI =
    ['zh', 'ch', 'sh', 'r', 'z', 'c', 's'].includes(initial) && finalPart === 'i';

  const initialTip = initObj
    ? `${initObj.pinyin.toUpperCase()} (≈ ${initObj.vietnamese}): ${initObj.guideVi}`
    : 'Âm tiết mở đầu bằng nguyên âm / bán nguyên âm: mở khẩu hình tự nhiên, phát âm tròn vành rõ chữ.';

  const finalTip = isRetroflexI
    ? 'Vận mẫu "i" (đọc là "ư"): Khi đi sau z, c, s, zh, ch, sh, r thì "i" biến đổi đọc thành âm "ư", giữ nguyên vị trí lưỡi của phụ âm đầu.'
    : finalObj
    ? `Vận mẫu "${finalObj.pinyin}" (≈ ${finalObj.vietnamese}): ${finalObj.guideVi}`
    : `Vận mẫu "${finalPart}": giữ khẩu hình ổn định và ngân đúng cao độ của thanh điệu.`;

  const initVi = initObj ? initObj.vietnamese.split('(')[0].trim() : '';
  const finVi = isRetroflexI
    ? 'ư'
    : finalObj
    ? finalObj.vietnamese
    : finalPart;

  return {
    initialTip,
    finalTip,
    vietnameseApprox: initObj && initObj.pinyin !== 'w - y' ? `${initVi} + ${finVi}` : finVi,
  };
}
