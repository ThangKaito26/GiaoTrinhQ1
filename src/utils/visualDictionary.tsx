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
  hanziiExampleUrl: string;
  collocations: { hanzi: string; pinyin: string; meaningVi: string }[];
  synonyms: { hanzi: string; pinyin: string; meaningVi: string; relation: string }[];
  textbookExamples: {
    hanzi: string;
    traditional: string;
    pinyin: string;
    meaningVi: string;
    page?: number;
  }[];
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
  const firstPart = hanzi.split(/[\/，,、;；–—\-]/)[0] || hanzi;
  const cleaned = firstPart
    .replace(/[()（）A-Za-z0-9.,!?:;？!：；…\-—\s+]/g, '')
    .trim();
  return cleaned || firstPart.trim() || hanzi.trim();
}

/**
 * Extracts all valid Chinese word variants from a vocabulary entry's hanzi field
 * (e.g. "出货（单）" -> ["出货单", "出货"], "这(个)星期" -> ["这个星期", "这星期"], "早/早上" -> ["早", "早上"])
 */
export function extractVocabKeysFromHanzi(rawHanzi: string): string[] {
  if (!rawHanzi) return [];
  const results = new Set<string>();
  const cleaned = rawHanzi.replace(/[:：？?！!。.]/g, ' ');
  const parts = cleaned
    .split(/[\/，,、;；–—\-]/)
    .map((s) => s.trim())
    .filter(Boolean);

  for (const part of parts) {
    const withParensContent = part.replace(/[\(（\)）]/g, '');
    const withoutParensContent = part.replace(/[\(（][^\)）]*[\)）]/g, '');
    for (const candidate of [withParensContent, withoutParensContent]) {
      const matches = candidate.match(/[\u4e00-\u9fa5]+/g) || [];
      for (const m of matches) {
        if (m.length >= 1) {
          results.add(m);
        }
      }
    }
  }
  return Array.from(results);
}

/**
 * Built-in compound vocabulary dictionary for compound words appearing in dialogues,
 * reading passages, and exercises across Quyển 1, 2, 3 whose characters may have been
 * taught separately or in another book.
 */
export const SUPPLEMENTARY_COMPOUND_VOCAB: VocabItem[] = [
  { index: 1, hanzi: '介绍', pinyin: 'Jiè shào', meaning_vi: 'Giới thiệu', type: 'động từ / danh từ', page: 22, lessonTitle: 'Bài 5 (Quyển 1)' },
  { index: 2, hanzi: '自我介绍', pinyin: 'Zì wǒ jiè shào', meaning_vi: 'Tự giới thiệu bản thân', type: 'cụm từ', page: 1, lessonTitle: 'Bài 1 (Quyển 3)' },
  { index: 3, hanzi: '自我', pinyin: 'Zì wǒ', meaning_vi: 'Tự mình, bản thân', type: 'đại từ', page: 1, lessonTitle: 'Bài 1 (Quyển 3)' },
  { index: 4, hanzi: '自己', pinyin: 'Zì jǐ', meaning_vi: 'Tự mình, bản thân', type: 'đại từ', page: 1, lessonTitle: 'Giáo trình Hán Ngữ Hoa Sen' },
  { index: 5, hanzi: '一下', pinyin: 'Yī xià', meaning_vi: 'Một chút, một lát (biểu thị hành động ngắn)', type: 'bổ ngữ', page: 22, lessonTitle: 'Giáo trình Hán Ngữ Hoa Sen' },
  { index: 6, hanzi: '一下儿', pinyin: 'Yī xiàr', meaning_vi: 'Một chút, một lát', type: 'bổ ngữ', page: 22, lessonTitle: 'Giáo trình Hán Ngữ Hoa Sen' },
  { index: 7, hanzi: '你好', pinyin: 'Nǐ hǎo', meaning_vi: 'Xin chào, chào bạn', type: 'câu chào', page: 1, lessonTitle: 'Bài 1 (Quyển 1)' },
  { index: 8, hanzi: '您好', pinyin: 'Nín hǎo', meaning_vi: 'Xin chào (kính trọng)', type: 'câu chào', page: 1, lessonTitle: 'Bài 1 (Quyển 1)' },
  { index: 9, hanzi: '请问', pinyin: 'Qǐng wèn', meaning_vi: 'Xin hỏi', type: 'động từ', page: 12, lessonTitle: 'Bài 4 (Quyển 1)' },
  { index: 10, hanzi: '明天', pinyin: 'Míng tiān', meaning_vi: 'Ngày mai', type: 'danh từ chỉ thời gian', page: 15, lessonTitle: 'Bài 4 (Quyển 1)' },
  { index: 11, hanzi: '今天', pinyin: 'Jīn tiān', meaning_vi: 'Hôm nay', type: 'danh từ chỉ thời gian', page: 10, lessonTitle: 'Bài 3 (Quyển 1)' },
  { index: 12, hanzi: '昨天', pinyin: 'Zuó tiān', meaning_vi: 'Hôm qua', type: 'danh từ chỉ thời gian', page: 15, lessonTitle: 'Bài 4 (Quyển 1)' },
  { index: 13, hanzi: '今年', pinyin: 'Jīn nián', meaning_vi: 'Năm nay', type: 'danh từ chỉ thời gian', page: 38, lessonTitle: 'Bài 8 (Quyển 1)' },
  { index: 14, hanzi: '明年', pinyin: 'Míng nián', meaning_vi: 'Sang năm, năm sau', type: 'danh từ chỉ thời gian', page: 38, lessonTitle: 'Bài 8 (Quyển 1)' },
  { index: 15, hanzi: '去年', pinyin: 'Qù nián', meaning_vi: 'Năm ngoái', type: 'danh từ chỉ thời gian', page: 38, lessonTitle: 'Bài 8 (Quyển 1)' },
  { index: 16, hanzi: '打电话', pinyin: 'Dǎ diàn huà', meaning_vi: 'Gọi điện thoại', type: 'cụm động từ', page: 30, lessonTitle: 'Giáo trình Hán Ngữ Hoa Sen' },
  { index: 17, hanzi: '吃饭', pinyin: 'Chī fàn', meaning_vi: 'Ăn cơm, dùng bữa', type: 'cụm động từ', page: 25, lessonTitle: 'Giáo trình Hán Ngữ Hoa Sen' },
  { index: 18, hanzi: '喝水', pinyin: 'Hē shuǐ', meaning_vi: 'Uống nước', type: 'cụm động từ', page: 25, lessonTitle: 'Giáo trình Hán Ngữ Hoa Sen' },
  { index: 19, hanzi: '喝茶', pinyin: 'Hē chá', meaning_vi: 'Uống trà', type: 'cụm động từ', page: 25, lessonTitle: 'Giáo trình Hán Ngữ Hoa Sen' },
  { index: 20, hanzi: '要求', pinyin: 'Yāo qiú', meaning_vi: 'Yêu cầu, đòi hỏi', type: 'động từ / danh từ', page: 2, lessonTitle: 'Bài 1 (Quyển 3)' },
  { index: 21, hanzi: '标准', pinyin: 'Biāo zhǔn', meaning_vi: 'Tiêu chuẩn, chuẩn mực', type: 'danh từ / tính từ', page: 18, lessonTitle: 'Quyển 3' },
  { index: 22, hanzi: '应约', pinyin: 'Yìng yuē', meaning_vi: 'Theo lời hẹn,赴 hẹn', type: 'động từ', page: 2, lessonTitle: 'Bài 1 (Quyển 3)' },
  { index: 23, hanzi: '见到', pinyin: 'Jiàn dào', meaning_vi: 'Gặp được, nhìn thấy', type: 'động từ', page: 2, lessonTitle: 'Bài 1 (Quyển 3)' },
  { index: 24, hanzi: '出生于', pinyin: 'Chū shēng yú', meaning_vi: 'Sinh ra tại / sinh năm', type: 'cụm động từ', page: 2, lessonTitle: 'Bài 1 (Quyển 3)' },
  { index: 25, hanzi: '出生', pinyin: 'Chū shēng', meaning_vi: 'Sinh ra, ra đời', type: 'động từ', page: 1, lessonTitle: 'Bài 1 (Quyển 3)' },
  { index: 26, hanzi: '商业', pinyin: 'Shāng yè', meaning_vi: 'Thương mại, kinh doanh', type: 'danh từ', page: 2, lessonTitle: 'Bài 1 (Quyển 3)' },
  { index: 27, hanzi: '会计学', pinyin: 'Kuài jì xué', meaning_vi: 'Ngành Kế toán học', type: 'danh từ', page: 2, lessonTitle: 'Bài 1 (Quyển 3)' },
  { index: 28, hanzi: '胡志明市', pinyin: 'Hú Zhì Míng shì', meaning_vi: 'Thành phố Hồ Chí Minh', type: 'danh từ riêng', page: 3, lessonTitle: 'Bài 13 (Quyển 2)' },
  { index: 29, hanzi: '富国岛', pinyin: 'Fù Guó dǎo', meaning_vi: 'Đảo Phú Quốc', type: 'danh từ riêng', page: 3, lessonTitle: 'Bài 13 (Quyển 2)' },
  { index: 30, hanzi: '福国岛', pinyin: 'Fú Guó dǎo', meaning_vi: 'Đảo Phú Quốc', type: 'danh từ riêng', page: 3, lessonTitle: 'Bài 13 (Quyển 2)' },
  { index: 31, hanzi: '下龙湾', pinyin: 'Xià Lóng wān', meaning_vi: 'Vịnh Hạ Long', type: 'danh từ riêng', page: 25, lessonTitle: 'Quyển 2' },
  { index: 32, hanzi: '海阳省', pinyin: 'Hǎi Yáng shěng', meaning_vi: 'Tỉnh Hải Dương', type: 'danh từ riêng', page: 4, lessonTitle: 'Bài 13 (Quyển 2)' },
  { index: 33, hanzi: '手提行李', pinyin: 'Shǒu tí xíng lǐ', meaning_vi: 'Hành lý xách tay', type: 'cụm danh từ', page: 3, lessonTitle: 'Bài 13 (Quyển 2)' },
  { index: 34, hanzi: '托运行李', pinyin: 'Tuō yùn xíng lǐ', meaning_vi: 'Hành lý ký gửi', type: 'cụm danh từ', page: 3, lessonTitle: 'Bài 13 (Quyển 2)' },
  { index: 35, hanzi: '办理手续', pinyin: 'Bàn lǐ shǒu xù', meaning_vi: 'Làm thủ tục', type: 'cụm động từ', page: 3, lessonTitle: 'Bài 13 (Quyển 2)' },
  { index: 36, hanzi: '贸易公司', pinyin: 'Mào yì gōng sī', meaning_vi: 'Công ty thương mại', type: 'cụm danh từ', page: 4, lessonTitle: 'Bài 13 (Quyển 2)' },
  { index: 37, hanzi: '这个', pinyin: 'Zhè gè', meaning_vi: 'Cái này, chiếc này', type: 'đại từ', page: 12, lessonTitle: 'Giáo trình Hán Ngữ Hoa Sen' },
  { index: 38, hanzi: '那个', pinyin: 'Nà gè', meaning_vi: 'Cái kia, cái đó', type: 'đại từ', page: 12, lessonTitle: 'Giáo trình Hán Ngữ Hoa Sen' },
  { index: 39, hanzi: '这些', pinyin: 'Zhè xiē', meaning_vi: 'Những cái này', type: 'đại từ', page: 12, lessonTitle: 'Giáo trình Hán Ngữ Hoa Sen' },
  { index: 40, hanzi: '那些', pinyin: 'Nà xiē', meaning_vi: 'Những cái kia', type: 'đại từ', page: 12, lessonTitle: 'Giáo trình Hán Ngữ Hoa Sen' },
  { index: 41, hanzi: '这种', pinyin: 'Zhè zhǒng', meaning_vi: 'Loại này, kiểu này', type: 'đại từ', page: 20, lessonTitle: 'Giáo trình Hán Ngữ Hoa Sen' },
  { index: 42, hanzi: '这次', pinyin: 'Zhè cì', meaning_vi: 'Lần này', type: 'danh từ', page: 20, lessonTitle: 'Giáo trình Hán Ngữ Hoa Sen' },
  { index: 43, hanzi: '一次', pinyin: 'Yī cì', meaning_vi: 'Một lần', type: 'số lượng từ', page: 20, lessonTitle: 'Giáo trình Hán Ngữ Hoa Sen' },
  { index: 44, hanzi: '这批', pinyin: 'Zhè pī', meaning_vi: 'Lô hàng này, đợt này', type: 'danh từ', page: 18, lessonTitle: 'Quyển 3' },
  { index: 45, hanzi: '天数', pinyin: 'Tiān shù', meaning_vi: 'Số ngày', type: 'danh từ', page: 35, lessonTitle: 'Quyển 3' },
  { index: 46, hanzi: '不够', pinyin: 'Bù gòu', meaning_vi: 'Không đủ', type: 'cụm tính từ', page: 25, lessonTitle: 'Giáo trình Hán Ngữ Hoa Sen' },
  { index: 47, hanzi: '之后', pinyin: 'Zhī hòu', meaning_vi: 'Sau đó, về sau', type: 'danh từ chỉ thời gian', page: 25, lessonTitle: 'Giáo trình Hán Ngữ Hoa Sen' },
  { index: 48, hanzi: '过来', pinyin: 'Guò lái', meaning_vi: 'Qua đây, bước sang', type: 'động từ xu hướng', page: 15, lessonTitle: 'Quyển 2' },
  { index: 49, hanzi: '过去', pinyin: 'Guò qù', meaning_vi: 'Qua đó, đi qua', type: 'động từ xu hướng', page: 15, lessonTitle: 'Quyển 2' },
  { index: 50, hanzi: '全勤奖', pinyin: 'Quán qín jiǎng', meaning_vi: 'Tiền thưởng chuyên cần', type: 'danh từ', page: 95, lessonTitle: 'Quyển 3' },
  { index: 51, hanzi: '服装店', pinyin: 'Fú zhuāng diàn', meaning_vi: 'Cửa hàng quần áo / thời trang', type: 'danh từ', page: 95, lessonTitle: 'Quyển 3' },
  { index: 52, hanzi: '购物', pinyin: 'Gòu wù', meaning_vi: 'Mua sắm', type: 'động từ', page: 30, lessonTitle: 'Giáo trình Hán Ngữ Hoa Sen' },
  { index: 53, hanzi: '打印机', pinyin: 'Dǎ yìn jī', meaning_vi: 'Máy in', type: 'danh từ', page: 68, lessonTitle: 'Quyển 3' },
];

/**
 * Concatenates a Chinese vocabulary keyword with Hanzii Chinese-Vietnamese Dictionary URL.
 * Uses clean HTTPS URL so all mobile and desktop browsers open the page reliably without black intent:// tabs.
 */
export function buildHanziiDictUrl(hanzi: string): string {
  const keyword = getPrimaryHanziKeyword(hanzi);
  const encoded = encodeURIComponent(keyword);
  return `https://hanzii.net/search/word/${encoded}?hl=vi`;
}

/**
 * Concatenates a Chinese vocabulary keyword with Hanzii Example Sentences search URL
 */
export function buildHanziiExampleUrl(hanzi: string): string {
  const keyword = getPrimaryHanziKeyword(hanzi);
  const encoded = encodeURIComponent(keyword);
  return `https://hanzii.net/search/example/${encoded}?hl=vi`;
}

const SIMP_TO_TRAD_MAP: Record<string, string> = {
  们: '們', 这: '這', 个: '個', 国: '國', 学: '學', 习: '習', 语: '語', 汉: '漢',
  师: '師', 生: '生', 车: '車', 机: '機', 飞: '飛', 钱: '錢', 买: '買', 卖: '賣',
  东: '東', 书: '書', 写: '寫', 读: '讀', 听: '聽', 说: '說', 见: '見', 现: '現',
  点: '點', 时: '時', 间: '間', 长: '長', 开: '開', 关: '關', 门: '門', 问: '問',
  题: '題', 员: '員', 厂: '廠', 产: '產', 质: '質', 订: '訂', 单: '單', 发: '發',
  电: '電', 话: '話', 脑: '腦', 视: '視', 欢: '歡', 谢: '謝', 对: '對', 没: '沒',
  系: '係', 医: '醫', 药: '藥', 越: '越', 南: '南', 华: '華', 爱: '愛', 亲: '親',
  妈: '媽', 爸: '爸', 姐: '姐', 哥: '哥', 弟: '弟', 妹: '妹', 认: '認', 识: '識',
  高: '高', 兴: '興', 贵: '貴', 姓: '姓', 友: '友', 职: '職', 商: '商', 店: '店',
  超: '超', 司: '司', 宿: '宿', 舍: '舍', 会: '會', 议: '議', 室: '室', 休: '休',
  息: '息', 影: '影', 乐: '樂', 班: '班', 结: '結', 婚: '婚', 银: '銀', 行: '行',
  业: '業', 区: '區', 翻: '翻', 译: '譯', 饭: '飯', 菜: '菜', 茶: '茶', 酒: '酒',
  面: '麵', 条: '條', 包: '包', 鸡: '雞', 鱼: '魚', 肉: '肉', 苹: '蘋', 果: '果',
  蕉: '蕉', 瓜: '瓜', 衣: '衣', 服: '服', 裤: '褲', 鞋: '鞋', 红: '紅', 黄: '黃',
  蓝: '藍', 绿: '綠', 黑: '黑', 白: '白', 块: '塊', 毛: '毛', 百: '百', 千: '千',
  万: '萬', 号: '號', 岁: '歲', 几: '幾', 谁: '誰', 哪: '哪', 儿: '兒', 样: '樣',
  怎: '怎', 什: '什', 么: '麼', 为: '為', 因: '因', 所: '所', 虽: '雖', 然: '然',
  但: '但', 还: '還', 经: '經', 常: '常', 已: '已', 刚: '剛', 才: '才', 准: '準',
  备: '備', 觉: '覺', 得: '得', 喜: '喜', 运动: '運動', 运: '運', 动: '動',
  游: '游', 泳: '泳', 球: '球', 跑: '跑', 步: '步', 旅: '旅', 馆: '館', 邮: '郵',
  局: '局', 边: '邊', 远: '遠', 近: '近', 离: '離', 坐: '坐', 骑: '騎', 站: '站',
  路: '路', 票: '票', 张: '張', 本: '本', 支: '支', 把: '把', 件: '件', 双: '雙',
  套: '套', 辆: '輛', 台: '台', 种: '種', 类: '類', 级: '級', 检: '檢',
  查: '查', 验: '驗', 报: '報', 告: '告', 计: '計', 划: '劃', 办: '辦', 法: '法',
  处: '處', 理: '理', 决: '決', 定: '定', 通: '通', 知: '知', 联: '聯', 络: '絡',
  签: '簽', 名: '名', 费: '費', 资: '資', 料: '料', 设: '設', 装: '裝', 修: '修',
  改: '改', 换: '換', 退: '退', 货: '貨', 库: '庫', 进: '進', 出: '出', 入: '入',
  总: '總', 管: '管', 组: '組', 线: '線', 达: '達', 标: '標', 规: '規', 则: '則',
  错: '錯', 误: '誤', 责: '責', 任: '任', 务: '務', 难: '難', 易: '易', 简: '簡',
  复: '複', 杂: '雜', 干: '乾', 净: '淨', 脏: '髒', 乱: '亂', 整: '整', 齐: '齊',
  轻: '輕', 重: '重', 快: '快', 慢: '慢', 早: '早', 晚: '晚', 新: '新', 旧: '舊',
  真: '真', 假: '假', 满: '滿', 意: '意', 放: '放', 心: '心', 担: '擔', 忧: '憂',
  帮: '幫', 助: '助', 请: '請', 让: '讓', 给: '給', 找: '找', 带: '帶', 拿: '拿',
  送: '送', 接: '接', 等: '等', 忘: '忘', 记: '記', 懂: '懂', 清: '清', 楚: '楚',
};

/**
 * Converts a Simplified Chinese sentence to Traditional Chinese for dictionary display `[...]`
 */
export function toTraditionalChinese(text: string): string {
  return Array.from(text)
    .map((ch) => SIMP_TO_TRAD_MAP[ch] || ch)
    .join('');
}

/**
 * Highlights all occurrences of `keyword` (and its Traditional equivalent) in red (`text-rose-600`)
 */
export function renderHighlightedChineseText(
  sentence: string,
  keyword: string
): React.ReactNode {
  const cleanKw = getPrimaryHanziKeyword(keyword);
  const tradKw = toTraditionalChinese(cleanKw);
  const targets = Array.from(new Set([cleanKw, tradKw])).filter(Boolean);
  if (targets.length === 0) return sentence;

  const escaped = targets.map((t) =>
    t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  );
  const regex = new RegExp(`(${escaped.join('|')})`, 'g');
  const parts = sentence.split(regex);

  return parts.map((part, idx) =>
    targets.includes(part) ? (
      <span key={idx} className="text-rose-600 font-semibold">
        {part}
      </span>
    ) : (
      <React.Fragment key={idx}>{part}</React.Fragment>
    )
  );
}

/**
 * Copies the Chinese keyword to the clipboard on click so if the user opens or switches
 * to the Hanzii mobile app, Hanzii's clipboard auto-lookup immediately activates for the word.
 */
export function handleHanziiLinkClick(
  e: React.MouseEvent<HTMLAnchorElement>,
  hanzi: string
): void {
  e.stopPropagation();
  const keyword = getPrimaryHanziKeyword(hanzi);
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(keyword).catch(() => {});
  }
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
      url: buildHanziiDictUrl(keyword),
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
    allVocab.find((v) => extractVocabKeysFromHanzi(v.hanzi).includes(hanzi)) ||
    SUPPLEMENTARY_COMPOUND_VOCAB.find(
      (v) =>
        v.hanzi === hanzi || extractVocabKeysFromHanzi(v.hanzi).includes(hanzi)
    ) ||
    (hanzi.length >= 2
      ? allVocab.find((v) => v.hanzi.includes(hanzi))
      : undefined);

  const primaryKeyword = getPrimaryHanziKeyword(exact?.hanzi || hanzi);
  const pinyin = exact?.pinyin || '';
  const meaningVi = exact?.meaning_vi || 'Từ vựng trong bài hội thoại';
  const type = exact?.type || 'từ mới';
  const lessonTitle = exact?.lessonTitle || 'Giáo trình Hán Ngữ Hoa Sen';
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
    .filter(
      (line) =>
        line.hanzi.includes(primaryKeyword) || line.hanzi.includes(hanzi)
    )
    .slice(0, 5)
    .map((line) => ({
      hanzi: line.hanzi,
      traditional: toTraditionalChinese(line.hanzi),
      pinyin: line.pinyin,
      meaningVi: line.meaningVi,
      page: line.page,
    }));

  const pyClean = (pinyin || primaryKeyword).toLowerCase();
  const viShort = meaningVi.split(',')[0].split(';')[0].trim().toLowerCase();

  const commonTemplates: {
    hanzi: string;
    pinyin: string;
    meaningVi: string;
  }[] =
    category === 'work_company'
      ? [
          {
            hanzi: `在公司里，大家都很重视${primaryKeyword}。`,
            pinyin: `Zài gōngsī lǐ, dàjiā dōu hěn zhòngshì ${pyClean}.`,
            meaningVi: `Ở trong công ty, mọi người đều rất coi trọng ${viShort}.`,
          },
          {
            hanzi: `关于${primaryKeyword}的问题，请先跟主管商量。`,
            pinyin: `Guānyú ${pyClean} de wèntí, qǐng xiān gēn zhǔguǎn shāngliáng.`,
            meaningVi: `Về vấn đề ${viShort}, xin hãy bàn bạc với chủ quản trước.`,
          },
          {
            hanzi: `今天下午我们要检查一下${primaryKeyword}。`,
            pinyin: `Jīntiān xiàwǔ wǒmen yào jiǎnchá yīxià ${pyClean}.`,
            meaningVi: `Chiều hôm nay chúng ta phải kiểm tra một chút về ${viShort}.`,
          },
        ]
      : category === 'food_drink' || category === 'fruits'
      ? [
          {
            hanzi: `我家里每个人都很喜欢${primaryKeyword}。`,
            pinyin: `Wǒ jiālǐ měi gèrén dōu hěn xǐhuān ${pyClean}.`,
            meaningVi: `Mỗi người trong gia đình tôi đều rất thích ${viShort}.`,
          },
          {
            hanzi: `这家餐厅的${primaryKeyword}非常好吃。`,
            pinyin: `Zhè jiā cāntīng de ${pyClean} fēicháng hǎochī.`,
            meaningVi: `Món ${viShort} của nhà hàng này vô cùng ngon.`,
          },
          {
            hanzi: `下班以后我去超市买了一点${primaryKeyword}。`,
            pinyin: `Xiàbān yǐhòu wǒ qù chāoshì mǎile yīdiǎn ${pyClean}.`,
            meaningVi: `Sau khi tan làm tôi đi siêu thị mua một ít ${viShort}.`,
          },
        ]
      : [
          {
            hanzi: `在日常生活中，“${primaryKeyword}”是一个很常用的词。`,
            pinyin: `Zài rìcháng shēnghuó zhōng, "${pyClean}" shì yīgè hěn chángyòng de cí.`,
            meaningVi: `Trong đời sống hàng ngày, "${primaryKeyword}" (${viShort}) là một từ rất thông dụng.`,
          },
          {
            hanzi: `老师今天在课堂上给我们讲解了“${primaryKeyword}”。`,
            pinyin: `Lǎoshī jīntiān zài kètáng shàng gěi wǒmen jiǎngjiěle "${pyClean}".`,
            meaningVi: `Hôm nay trên lớp thầy giáo đã giảng giải cho chúng tôi về "${primaryKeyword}" (${viShort}).`,
          },
          {
            hanzi: `请你用“${primaryKeyword}”造一个完整的句子。`,
            pinyin: `Qǐng nǐ yòng "${pyClean}" zào yīgè wánzhěng de jùzi.`,
            meaningVi: `Xin bạn hãy dùng từ "${primaryKeyword}" (${viShort}) để đặt một câu hoàn chỉnh.`,
          },
        ];

  for (const tpl of commonTemplates) {
    if (matchingLines.length >= 4) break;
    if (!matchingLines.some((m) => m.hanzi === tpl.hanzi)) {
      matchingLines.push({
        hanzi: tpl.hanzi,
        traditional: toTraditionalChinese(tpl.hanzi),
        pinyin: tpl.pinyin,
        meaningVi: tpl.meaningVi,
        page,
      });
    }
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
  const hanziiExampleUrl = buildHanziiExampleUrl(primaryKeyword);

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
    hanziiExampleUrl,
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
 * Vivid contextual card with dynamic Bing Image Search photo + Hanzii Dict & optional embedded controls
 */
export const WordVisualIllustration: React.FC<{
  hanzi: string;
  pinyin: string;
  meaningVi: string;
  category: LocalWordDetails['category'];
  showSearchLinks?: boolean;
  showImageSearchLinks?: boolean;
  showPinyin?: boolean;
  showMeaning?: boolean;
  children?: React.ReactNode;
}> = ({
  hanzi,
  pinyin,
  meaningVi,
  category,
  showSearchLinks = true,
  showImageSearchLinks = false,
  showPinyin = true,
  showMeaning = true,
  children,
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
            {showPinyin && pinyin && (
              <span className="font-mono text-xs sm:text-sm font-semibold text-amber-800">
                [{pinyin}]
              </span>
            )}
          </div>
          {showMeaning && (
            <p className="mt-1 text-xs sm:text-sm font-semibold text-stone-800 line-clamp-2">
              {meaningVi}
            </p>
          )}
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
            onClick={(e) => handleHanziiLinkClick(e, primaryKeyword)}
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

      {children}
    </div>
  );
};
