import React, { useState } from 'react';
import { ExternalLink, Image as ImageIcon, BookOpen } from 'lucide-react';
import { VocabItem, DialogueLine } from '../types/textbook';

export interface LocalWordDetails {
  hanzi: string;
  primaryKeyword: string;
  pinyin: string;
  meaningVi: string;
  type: string;
  lessonTitle: string;
  page: number;
  category:
    | 'greeting'
    | 'family'
    | 'numbers_time'
    | 'work_company'
    | 'country_language'
    | 'places_direction'
    | 'sports_daily'
    | 'food_drink'
    | 'fruits'
    | 'clothing'
    | 'transport'
    | 'school_study'
    | 'money_shopping'
    | 'general';
  sinoVietnameseHint: string;
  contextualUsageVi: string;
  hanziiUrl: string;
  collocations: { hanzi: string; pinyin: string; meaningVi: string }[];
  synonyms: { hanzi: string; pinyin: string; meaningVi: string; relation: string }[];
  textbookExamples: { hanzi: string; pinyin: string; meaningVi: string; page: number }[];
  imageExamples: {
    title: string;
    query: string;
    thumbUrl: string;
    searchUrl: string;
  }[];
  searchLinks: {
    provider: string;
    label: string;
    url: string;
  }[];
}

const SINO_VIETNAMESE_MAP: Record<string, string> = {
  我: 'Ngã',
  你: 'Nhĩ',
  您: 'Nhẫm',
  他: 'Tha',
  她: 'Tha',
  它: 'Tha',
  我们: 'Ngã môn',
  你们: 'Nhĩ môn',
  他们: 'Tha môn',
  很: 'Ngận',
  好: 'Hảo',
  吗: 'Ma',
  来: 'Lai',
  去: 'Khứ',
  回: 'Hồi',
  在: 'Tại',
  家: 'Gia',
  妈妈: 'Ma ma',
  爸爸: 'Ba ba',
  哥哥: 'Ca ca',
  姐姐: 'Tỷ tỷ',
  弟弟: 'Đệ đệ',
  妹妹: 'Muội muội',
  老师: 'Lão sư',
  学生: 'Học sinh',
  身体: 'Thân thể',
  谢谢: 'Tạ tạ',
  再见: 'Tái kiến',
  对不起: 'Đối bất khởi',
  没关系: 'Một quan hệ',
  工作: 'Công tác',
  忙: 'Mang',
  累: 'Lụy',
  今天: 'Kim thiên',
  明天: 'Minh thiên',
  昨天: 'Tạc thiên',
  今年: 'Kim niên',
  明年: 'Minh niên',
  认识: 'Nhận thức',
  高兴: 'Cao hứng',
  名字: 'Danh tự',
  贵姓: 'Quý tính',
  医院: 'Y viện',
  医生: 'Y sinh',
  大夫: 'Đại phu',
  朋友: 'Bằng hữu',
  越南: 'Việt Nam',
  中国: 'Trung Quốc',
  美国: 'Mỹ Quốc',
  泰国: 'Thái Quốc',
  员工: 'Viên công',
  职员: 'Chức viên',
  商店: 'Thương điếm',
  超市: 'Siêu thị',
  公司: 'Công ty',
  宿舍: 'Túc xá',
  会议室: 'Hội nghị thất',
  休息: 'Hưu tức',
  星期: 'Tinh kỳ',
  电影: 'Điện ảnh',
  电视: 'Điện thị',
  音乐: 'Âm nhạc',
  上班: 'Thượng ban',
  下班: 'Hạ ban',
  加班: 'Gia ban',
  生日: 'Sinh nhật',
  结婚: 'Kết hôn',
  学习: 'Học tập',
  汉语: 'Hán ngữ',
  英语: 'Anh ngữ',
  银行: 'Ngân hàng',
  工业区: 'Công nghiệp khu',
  翻译: 'Phiên dịch',
  经理: 'Kinh lý',
  手机: 'Thủ cơ',
  电脑: 'Điện não',
  现在: 'Hiện tại',
  起床: 'Khởi sàng',
  睡觉: 'Thụy giác',
  运动: 'Vận động',
  喜欢: 'Hỷ hoan',
  足球: 'Túc cầu',
  篮球: 'Lam cầu',
  游泳: 'Du vịnh',
  跑步: 'Bào bộ',
  宾馆: 'Tân quán',
  房间: 'Phòng gian',
  欢迎: 'Hoan nghênh',
  知道: 'Tri đạo',
  公园: 'Công viên',
  邮局: 'Bưu cục',
  学校: 'Học hiệu',
  市场: 'Thị trường',
  火锅: 'Hỏa oa',
  烤肉: 'Khảo nhục',
  米饭: 'Mễ phạn',
  面条: 'Diện điều',
  面包: 'Diện bao',
  牛奶: 'Ngưu nãi',
  咖啡: 'Cà phê',
  茶: 'Trà',
  奶茶: 'Nãi trà',
  水果: 'Thủy quả',
  苹果: 'Bình quả',
  西瓜: 'Tây qua',
  榴莲: 'Lựu liên',
  芒果: 'Mang quả',
  葡萄: 'Bồ đào',
  便宜: 'Tiện nghi',
  衣服: 'Y phục',
  毛衣: 'Mao y',
  天气: 'Thiên khí',
  自行车: 'Tự hành xa',
  摩托车: 'Mô tô xa',
  公共汽车: 'Công cộng khí xa',
  出租车: 'Xuất tô xa',
  颜色: 'Nhan sắc',
  时间: 'Thời gian',
  礼物: 'Lễ vật',
  人: 'Nhân',
  大: 'Đại',
  小: 'Tiểu',
  多: 'Đa',
  少: 'Thiểu',
  男: 'Nam',
  女: 'Nữ',
  高: 'Cao',
  美: 'Mỹ',
  新: 'Tân',
  旧: 'Cựu',
  老: 'Lão',
  年: 'Niên',
  月: 'Nguyệt',
  日: 'Nhật',
  号: 'Hiệu',
  点: 'Điểm',
  分: 'Phân',
  半: 'Bán',
  早: 'Tảo',
  晚: 'Vãn',
  吃: 'Ngật',
  喝: 'Hát',
  看: 'Khán',
  听: 'Thính',
  说: 'Thuyết',
  读: 'Độc',
  写: 'Tả',
  买: 'Mãi',
  卖: 'Mại',
  钱: 'Tiền',
  车: 'Xa',
  路: 'Lộ',
  门: 'Môn',
  水: 'Thủy',
  火: 'Hỏa',
  山: 'Sơn',
  天: 'Thiên',
  地: 'Địa',
};

/**
 * Cleans a textbook vocabulary entry (e.g. "职员 / 员工", "(一)点儿") into a clean Chinese search keyword
 */
export function getPrimaryHanziKeyword(hanzi: string): string {
  const firstPart = hanzi.split('/')[0] || hanzi;
  const cleaned = firstPart
    .replace(/[()（）A-Za-z0-9.,!?:;…\-—\s]/g, '')
    .trim();
  return cleaned || firstPart.trim() || hanzi.trim();
}

/**
 * Concatenates a Chinese vocabulary keyword with Hanzii Chinese-Vietnamese Dictionary URL
 */
export function buildHanziiDictUrl(hanzi: string): string {
  const keyword = getPrimaryHanziKeyword(hanzi);
  return `https://hanzii.net/search/word/${encodeURIComponent(keyword)}?hl=vi`;
}

/**
 * Concatenates a Chinese vocabulary keyword with Bing's dynamic image thumbnail endpoint
 */
export function buildBingImageThumbUrl(
  query: string,
  width = 400,
  height = 280,
  serverIndex: 1 | 2 | 3 | 4 = 1
): string {
  return `https://tse${serverIndex}.mm.bing.net/th?q=${encodeURIComponent(
    query.trim()
  )}&w=${width}&h=${height}&c=7&rs=1&p=0`;
}

/**
 * Concatenates the Chinese vocabulary keyword with popular web image search engines & Hanzii dictionary
 */
export function buildWebImageSearchLinks(hanzi: string) {
  const keyword = getPrimaryHanziKeyword(hanzi);
  const encoded = encodeURIComponent(keyword);
  return [
    {
      provider: 'Hanzii Dict',
      label: `Tra từ điển Hanzii (${keyword})`,
      url: `https://hanzii.net/search/word/${encoded}?hl=vi`,
    },
    {
      provider: 'Bing Ảnh',
      label: `Bing Hình ảnh (${keyword})`,
      url: `https://www.bing.com/images/search?q=${encoded}`,
    },
    {
      provider: 'Google Ảnh',
      label: `Google Hình ảnh (${keyword})`,
      url: `https://www.google.com/search?tbm=isch&q=${encoded}`,
    },
    {
      provider: 'Baidu Ảnh',
      label: `Baidu Hình ảnh (${keyword})`,
      url: `https://image.baidu.com/search/index?tn=baiduimage&word=${encoded}`,
    },
  ];
}

export function detectWordCategory(
  hanzi: string,
  meaningVi: string
): LocalWordDetails['category'] {
  const m = meaningVi.toLowerCase();
  if (
    ['水果', '苹果', '橘子', '橙子', '芒果', '草莓', '葡萄', '西瓜', '榴莲', '果园'].some((w) =>
      hanzi.includes(w)
    ) ||
    m.includes('trái cây') ||
    m.includes('quả') ||
    m.includes('xoài') ||
    m.includes('sầu riêng') ||
    m.includes('dưa hấu')
  ) {
    return 'fruits';
  }
  if (
    ['吃', '喝', '饭', '火锅', '烤肉', '面', '包子', '海鲜', '牛奶', '肉', '鸡蛋', '酒', '咖啡', '水', '茶', '汁', '冰沙', '饿', '饱', '渴', '蛋糕', '碗'].some(
      (w) => hanzi.includes(w)
    ) ||
    m.includes('ăn') ||
    m.includes('uống') ||
    m.includes('cơm') ||
    m.includes('trà') ||
    m.includes('bánh') ||
    m.includes('thịt')
  ) {
    return 'food_drink';
  }
  if (
    ['车', '骑', '打的', '站', '辆', '红绿灯', '路', '拐', '走', '票'].some((w) =>
      hanzi.includes(w)
    ) ||
    m.includes('xe') ||
    m.includes('trạm') ||
    m.includes('đường') ||
    m.includes('ngã tư')
  ) {
    return 'transport';
  }
  if (
    ['衣服', '毛衣', '外套', '外衣', '鞋', '裤', '穿', '脱', '件', '短', '长', '试', '色'].some((w) =>
      hanzi.includes(w)
    ) ||
    m.includes('áo') ||
    m.includes('quần') ||
    m.includes('giày') ||
    m.includes('mặc') ||
    m.includes('màu')
  ) {
    return 'clothing';
  }
  if (
    ['球', '运动', '游泳', '跑步', '游戏', '玩', '唱歌'].some((w) => hanzi.includes(w)) ||
    m.includes('bóng') ||
    m.includes('thể thao') ||
    m.includes('bơi') ||
    m.includes('chạy bộ')
  ) {
    return 'sports_daily';
  }
  if (
    ['妈', '爸', '姐', '妹', '哥', '弟', '妻', '老婆', '老公', '儿', '奶', '爷', '外婆', '外公', '舅', '叔', '阿姨', '爱人', '孩子', '结婚', '家'].some(
      (w) => hanzi.includes(w)
    ) ||
    m.includes('bố') ||
    m.includes('mẹ') ||
    m.includes('anh trai') ||
    m.includes('chị gái') ||
    m.includes('em ') ||
    m.includes('vợ') ||
    m.includes('chồng')
  ) {
    return 'family';
  }
  if (
    ['工作', '忙', '累', '班', '公司', '员工', '职员', '工业', '经理', '主管', '秘书', '助理', '组长', '办公室', '车间', '大夫', '医生', '护士', '同事'].some(
      (w) => hanzi.includes(w)
    ) ||
    m.includes('công ty') ||
    m.includes('nhân viên') ||
    m.includes('làm việc') ||
    m.includes('giám đốc') ||
    m.includes('ca ')
  ) {
    return 'work_company';
  }
  if (
    ['国', '越', '英', '日', '韩', '汉语', '中文', '台湾', '外语', '语言'].some((w) =>
      hanzi.includes(w)
    ) ||
    m.includes('nước') ||
    m.includes('tiếng ') ||
    m.includes('việt nam') ||
    m.includes('trung quốc')
  ) {
    return 'country_language';
  }
  if (
    ['钱', '盾', '币', '元', '块', '买', '卖', '贵', '便宜', '换', '找', '取款'].some((w) =>
      hanzi.includes(w)
    ) ||
    m.includes('tiền') ||
    m.includes('mua') ||
    m.includes('bán') ||
    m.includes('đắt') ||
    m.includes('rẻ')
  ) {
    return 'money_shopping';
  }
  if (
    ['学', '老师', '课', '书', '报', '词典', '写', '读', '信', '语法', '汉子', '作业', '懂'].some((w) =>
      hanzi.includes(w)
    ) ||
    m.includes('học') ||
    m.includes('sách') ||
    m.includes('giáo viên') ||
    m.includes('từ điển')
  ) {
    return 'school_study';
  }
  if (
    ['店', '超市', '宿舍', '室', '网吧', '酒吧', '医院', '银行', '食堂', '宾馆', '房', '楼', '公园', '邮局', '市场', '边', '面', '里', '外', '远', '近'].some(
      (w) => hanzi.includes(w)
    ) ||
    m.includes('siêu thị') ||
    m.includes('cửa hàng') ||
    m.includes('bưu điện') ||
    m.includes('khách sạn') ||
    m.includes('bên ')
  ) {
    return 'places_direction';
  }
  if (
    ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '零', '百', '千', '万', '号', '日', '月', '年', '天', '星期', '礼拜', '周', '早', '午', '晚', '点', '分', '刻', '半', '现在', '时候', '岁'].some(
      (w) => hanzi.includes(w)
    )
  ) {
    return 'numbers_time';
  }
  if (
    ['好', '早', '谢谢', '再见', '对不起', '客气', '没关系', '请', '欢迎', '祝'].some((w) =>
      hanzi.includes(w)
    )
  ) {
    return 'greeting';
  }
  return 'general';
}

export function buildLocalWordDetails(
  hanzi: string,
  allVocab: VocabItem[],
  allDialogues: DialogueLine[]
): LocalWordDetails {
  const exact =
    allVocab.find((v) => v.hanzi === hanzi) ||
    allVocab.find((v) => v.hanzi.split('/').map((s) => s.trim()).includes(hanzi)) ||
    allVocab.find((v) => v.hanzi.includes(hanzi) && hanzi.length >= 1);

  const primaryKeyword = getPrimaryHanziKeyword(exact?.hanzi || hanzi);
  const pinyin = exact?.pinyin || '';
  const meaningVi = exact?.meaning_vi || 'Từ vựng trong bài hội thoại';
  const type = exact?.type || 'từ mới';
  const lessonTitle = exact?.lessonTitle || 'Giáo trình Quyển 1';
  const page = exact?.page || 1;
  const category = detectWordCategory(hanzi, meaningVi);

  const sinoVietnameseHint =
    SINO_VIETNAMESE_MAP[primaryKeyword] ||
    SINO_VIETNAMESE_MAP[hanzi] ||
    primaryKeyword
      .split('')
      .map((ch) => SINO_VIETNAMESE_MAP[ch] || '')
      .filter(Boolean)
      .join(' ') ||
    'Từ vựng Hán ngữ thông dụng';

  const contextualUsageVi = `Từ “${hanzi}” (${pinyin}) có nghĩa là “${meaningVi}”, xuất hiện tại Trang ${page} thuộc ${lessonTitle}. Thường kết hợp trực tiếp trong câu giao tiếp hàng ngày và bài tập dịch Việt – Trung của bài học.`;

  const collocationMatches = allVocab
    .filter(
      (v) =>
        v.hanzi !== hanzi &&
        (v.hanzi.includes(primaryKeyword) || v.page === page)
    )
    .slice(0, 4)
    .map((v) => ({
      hanzi: v.hanzi,
      pinyin: v.pinyin,
      meaningVi: v.meaning_vi,
    }));

  const relatedPool = allVocab.filter(
    (v) =>
      v.hanzi !== hanzi &&
      v.hanzi.length <= 6 &&
      (detectWordCategory(v.hanzi, v.meaning_vi) === category || v.page === page)
  );

  const synonyms = relatedPool.slice(0, 5).map((v) => ({
    hanzi: v.hanzi,
    pinyin: v.pinyin,
    meaningVi: v.meaning_vi,
    relation:
      detectWordCategory(v.hanzi, v.meaning_vi) === category
        ? 'Cùng chủ đề từ vựng'
        : `Từ cùng bài (Trang ${v.page})`,
  }));

  const matchingLines = allDialogues
    .filter((line) => line.hanzi.includes(primaryKeyword) || line.hanzi.includes(hanzi))
    .slice(0, 4)
    .map((line) => ({
      hanzi: line.hanzi,
      pinyin: line.pinyin,
      meaningVi: line.meaningVi,
      page: line.page,
    }));

  if (matchingLines.length === 0) {
    matchingLines.push({
      hanzi: `我正在学习“${primaryKeyword}”这个生词。`,
      pinyin: `Wǒ zhèngzài xuéxí "${pinyin || primaryKeyword}" zhège shēngcí.`,
      meaningVi: `Tôi đang học từ mới "${primaryKeyword}" (${meaningVi}).`,
      page,
    });
  }

  const q1 = primaryKeyword;
  const q2 = `${primaryKeyword} 实物 高清`;
  const q3 = `${primaryKeyword} 插画 卡通`;

  const imageExamples = [
    {
      title: `Ảnh thực tế: ${primaryKeyword}`,
      query: q1,
      thumbUrl: buildBingImageThumbUrl(q1, 420, 300, 1),
      searchUrl: `https://www.bing.com/images/search?q=${encodeURIComponent(q1)}`,
    },
    {
      title: `Ngữ cảnh đời sống: ${primaryKeyword}`,
      query: q2,
      thumbUrl: buildBingImageThumbUrl(q2, 420, 300, 2),
      searchUrl: `https://www.bing.com/images/search?q=${encodeURIComponent(q2)}`,
    },
    {
      title: `Minh họa trực quan: ${primaryKeyword}`,
      query: q3,
      thumbUrl: buildBingImageThumbUrl(q3, 420, 300, 3),
      searchUrl: `https://www.bing.com/images/search?q=${encodeURIComponent(q3)}`,
    },
  ];

  const searchLinks = buildWebImageSearchLinks(primaryKeyword);
  const hanziiUrl = buildHanziiDictUrl(primaryKeyword);

  return {
    hanzi,
    primaryKeyword,
    pinyin,
    meaningVi,
    type,
    lessonTitle,
    page,
    category,
    sinoVietnameseHint,
    contextualUsageVi,
    hanziiUrl,
    collocations: collocationMatches,
    synonyms,
    textbookExamples: matchingLines,
    imageExamples,
    searchLinks,
  };
}

/**
 * Segments a Chinese sentence into clickable tokens using the textbook vocabulary list
 */
export function segmentChineseSentence(
  sentence: string,
  vocabSet: Set<string>,
  sortedVocabKeys: string[]
): { text: string; isWord: boolean }[] {
  const tokens: { text: string; isWord: boolean }[] = [];
  let i = 0;
  const punctuationRegex = /[，。！？、：；“”‘’（）().,!?:;\s\-—…]/;

  while (i < sentence.length) {
    const ch = sentence[i];
    if (punctuationRegex.test(ch)) {
      tokens.push({ text: ch, isWord: false });
      i++;
      continue;
    }

    let matched = '';
    for (const key of sortedVocabKeys) {
      if (key.length > 1 && sentence.startsWith(key, i)) {
        matched = key;
        break;
      }
    }

    if (matched) {
      tokens.push({ text: matched, isWord: true });
      i += matched.length;
    } else {
      const isChineseChar = /[\u4e00-\u9fa5]/.test(ch);
      tokens.push({
        text: ch,
        isWord: isChineseChar || vocabSet.has(ch),
      });
      i++;
    }
  }
  return tokens;
}

/**
 * Vivid contextual card with dynamic Bing Image Search photo + Hanzii Dict & Web Image Links
 */
export const WordVisualIllustration: React.FC<{
  hanzi: string;
  pinyin: string;
  meaningVi: string;
  category: LocalWordDetails['category'];
  showSearchLinks?: boolean;
  showImageSearchLinks?: boolean;
}> = ({
  hanzi,
  pinyin,
  meaningVi,
  category,
  showSearchLinks = true,
  showImageSearchLinks = false,
}) => {
  const [imgError, setImgError] = useState(false);

  const primaryKeyword = getPrimaryHanziKeyword(hanzi);
  const bingThumbUrl = buildBingImageThumbUrl(primaryKeyword, 360, 260, 1);
  const hanziiUrl = buildHanziiDictUrl(primaryKeyword);
  const bingSearchUrl = `https://www.bing.com/images/search?q=${encodeURIComponent(
    primaryKeyword
  )}`;
  const googleSearchUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(
    primaryKeyword
  )}`;

  const themes: Record<
    LocalWordDetails['category'],
    { bg: string; accent: string; badge: string; label: string }
  > = {
    greeting: {
      bg: 'from-amber-50 via-orange-50/70 to-yellow-100/60',
      accent: '#D97706',
      badge: 'Giao tiếp & Chào hỏi',
      label: '礼貌交际',
    },
    family: {
      bg: 'from-rose-50 via-pink-50/70 to-amber-50/60',
      accent: '#E11D48',
      badge: 'Gia đình & Người thân',
      label: '家庭亲属',
    },
    numbers_time: {
      bg: 'from-sky-50 via-cyan-50/70 to-blue-50/60',
      accent: '#0284C7',
      badge: 'Con số & Thời gian',
      label: '数字时间',
    },
    work_company: {
      bg: 'from-slate-100 via-blue-50/60 to-indigo-50/60',
      accent: '#2563EB',
      badge: 'Công việc & Công xưởng',
      label: '职场工业',
    },
    country_language: {
      bg: 'from-indigo-50 via-purple-50/60 to-sky-50/60',
      accent: '#4F46E5',
      badge: 'Quốc gia & Ngôn ngữ',
      label: '国家语言',
    },
    places_direction: {
      bg: 'from-teal-50 via-emerald-50/60 to-cyan-50/60',
      accent: '#0D9488',
      badge: 'Địa điểm & Phương hướng',
      label: '地点方位',
    },
    sports_daily: {
      bg: 'from-orange-50 via-amber-50/70 to-lime-50/60',
      accent: '#EA580C',
      badge: 'Thể thao & Sinh hoạt',
      label: '运动生活',
    },
    food_drink: {
      bg: 'from-amber-50 via-red-50/60 to-orange-100/50',
      accent: '#DC2626',
      badge: 'Ẩm thực & Đồ uống',
      label: '中华美食',
    },
    fruits: {
      bg: 'from-emerald-50 via-lime-50/70 to-amber-50/60',
      accent: '#16A34A',
      badge: 'Trái cây tươi ngon',
      label: '新鲜水果',
    },
    clothing: {
      bg: 'from-fuchsia-50 via-rose-50/60 to-indigo-50/50',
      accent: '#C026D3',
      badge: 'Trang phục & Thời trang',
      label: '服装穿搭',
    },
    transport: {
      bg: 'from-blue-50 via-sky-50/70 to-emerald-50/50',
      accent: '#0369A1',
      badge: 'Giao thông & Phương tiện',
      label: '交通出行',
    },
    school_study: {
      bg: 'from-violet-50 via-indigo-50/60 to-amber-50/50',
      accent: '#7C3AED',
      badge: 'Học tập & Trường lớp',
      label: '教育学习',
    },
    money_shopping: {
      bg: 'from-yellow-50 via-amber-50/70 to-emerald-50/60',
      accent: '#B45309',
      badge: 'Tiền tệ & Mua sắm',
      label: '购物货币',
    },
    general: {
      bg: 'from-stone-100 via-amber-50/50 to-orange-50/40',
      accent: '#B45309',
      badge: 'Từ vựng Trọng tâm',
      label: '核心词汇',
    },
  };

  const t = themes[category] || themes.general;

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-stone-200/90 bg-gradient-to-br ${t.bg} p-3.5 sm:p-4 shadow-xs space-y-2.5`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-medium text-stone-500">
            {t.badge} · {t.label}
          </div>
          <div className="mt-1 flex flex-wrap items-baseline gap-2">
            <span className="font-['Noto_Sans_SC'] text-2xl sm:text-3xl font-bold tracking-wide text-stone-900">
              {hanzi}
            </span>
            {pinyin && (
              <span className="font-mono text-xs sm:text-sm font-semibold text-amber-800">
                [{pinyin}]
              </span>
            )}
          </div>
          <p className="mt-1 text-xs sm:text-sm font-semibold text-stone-800 line-clamp-2">
            {meaningVi}
          </p>
        </div>

        {/* Dynamic Web Search Image Thumbnail for this exact Chinese word (`primaryKeyword`) */}
        <div className="shrink-0">
          {!imgError ? (
            <div className="relative h-22 w-28 sm:h-24 sm:w-32 overflow-hidden rounded-lg bg-white shadow-2xs ring-1 ring-stone-200/80">
              <img
                src={bingThumbUrl}
                alt={`Ảnh minh họa cho từ ${primaryKeyword} (${meaningVi})`}
                loading="lazy"
                onError={() => setImgError(true)}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />
              <span className="absolute bottom-1 right-1 rounded bg-stone-900/75 px-1.5 py-0.5 font-['Noto_Sans_SC'] text-[10px] font-semibold text-white">
                {primaryKeyword}
              </span>
            </div>
          ) : (
            <svg
              viewBox="0 0 120 96"
              className="h-22 w-28 sm:h-24 sm:w-32 rounded-lg bg-white/80 p-1.5 shadow-2xs ring-1 ring-stone-200/70"
              aria-label={`Minh họa trực quan cho từ ${hanzi}`}
            >
              <rect
                x="2"
                y="2"
                width="116"
                height="92"
                rx="8"
                fill={t.accent}
                fillOpacity="0.12"
              />
              <text
                x="60"
                y="56"
                textAnchor="middle"
                fontSize="26"
                fontWeight="bold"
                fill={t.accent}
              >
                {primaryKeyword.slice(0, 3)}
              </text>
            </svg>
          )}
        </div>
      </div>

      {/* Direct Concatenated Links: Hanzii Dict always shown; Bing/Google Image links only when showImageSearchLinks is true */}
      {showSearchLinks && (
        <div
          className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-stone-200/60"
          onClick={(e) => e.stopPropagation()}
        >
          <a
            href={hanziiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-md border border-amber-300 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-950 hover:bg-amber-100 transition-colors"
            title={`Tra cứu chi tiết từ "${primaryKeyword}" trên Từ điển Hanzii`}
          >
            <BookOpen className="h-3 w-3 text-amber-800" />
            <span>Từ điển Hanzii</span>
            <ExternalLink className="h-2.5 w-2.5" />
          </a>

          {showImageSearchLinks && (
            <>
              <a
                href={bingSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-md border border-stone-200/90 bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-stone-800 hover:border-amber-500 hover:bg-amber-50 transition-colors"
                title={`Tìm ảnh "${primaryKeyword}" trên Bing Images`}
              >
                <ImageIcon className="h-3 w-3 text-amber-700" />
                <span>Bing Ảnh</span>
                <ExternalLink className="h-2.5 w-2.5" />
              </a>

              <a
                href={googleSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-md border border-stone-200/90 bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-stone-700 hover:border-amber-500 hover:bg-amber-50 transition-colors"
                title={`Tìm ảnh "${primaryKeyword}" trên Google Images`}
              >
                <span>Google Ảnh</span>
                <ExternalLink className="h-2.5 w-2.5" />
              </a>
            </>
          )}
        </div>
      )}
    </div>
  );
};
