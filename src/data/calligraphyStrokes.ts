export interface CalligraphyStrokeVariant {
  id: string;
  nameVi: string;
  /**
   * Closed SVG path defining the authentic variable-width Chinese calligraphy brush stroke (楷书笔画)
   * in a 100x100 coordinate space (with 顿笔 press, 粗细 taper, and 出锋 sharp tip).
   */
  silhouettePath: string;
  /**
   * Centerline trajectory from start of stroke (起笔) to end of stroke (收笔)
   * used to drive the progressive calligraphy ink reveal mask and brush tip movement.
   */
  medianPath: string;
  /**
   * Mask stroke width to cleanly uncover the brush silhouette along medianPath
   */
  maskWidth?: number;
}

export interface CalligraphyStrokeRow {
  id: string;
  labelVi: string;
  hanziName: string;
  pinyinName: string;
  descriptionVi: string;
  examples: string[];
  variants: CalligraphyStrokeVariant[];
}

/**
 * All 8 Basic Strokes & their 35 authentic Kaiti calligraphy variants
 * matching 100% of the strokes in image_b47feaa4.png
 */
export const CALLIGRAPHY_STROKE_ROWS: CalligraphyStrokeRow[] = [
  // 1. NGANG (2 biến thể: Ngang dài, Ngang ngắn)
  {
    id: 'ngang',
    labelVi: 'Ngang',
    hanziName: '横',
    pinyinName: 'Héng',
    descriptionVi: 'Nét thẳng ngang hơi chếch nhẹ lên phải: đầu nét nhấn bút nhẹ, thân nét đều, cuối nét nhấn bút thu lại.',
    examples: ['一', '二', '三', '十', '大', '天'],
    variants: [
      {
        id: 'ngang_dai',
        nameVi: 'Ngang dài (长横)',
        silhouettePath:
          'M 12 52 C 14 47, 19 46, 25 47 L 76 43 C 82 42, 88 45, 89 49 C 90 53, 85 55, 79 54 L 24 56 C 17 57, 11 55, 12 52 Z',
        medianPath: 'M 13 52 L 88 48',
      },
      {
        id: 'ngang_ngan',
        nameVi: 'Ngang ngắn (短横)',
        silhouettePath:
          'M 24 52 C 26 48, 32 47, 40 46 L 68 43 C 74 42, 79 45, 80 49 C 80 53, 75 55, 68 54 L 34 56 C 27 56, 23 54, 24 52 Z',
        medianPath: 'M 25 52 L 79 48',
      },
    ],
  },

  // 2. SỔ (3 biến thể trong ảnh: Sổ kim nhọn đuôi, Sổ gọn tròn đuôi, Sổ ngắn hơi cong)
  {
    id: 'so',
    labelVi: 'Sổ',
    hanziName: '竖',
    pinyinName: 'Shù',
    descriptionVi: 'Nét thẳng đứng kéo từ trên xuống dưới: gồm Sổ kim (vuốt nhọn đuôi) và Sổ gọn (nhấn giữ bút ở cuối).',
    examples: ['十', '中', '干', '川', '丰', '木'],
    variants: [
      {
        id: 'so_kim',
        nameVi: 'Sổ kim (悬针竖)',
        silhouettePath:
          'M 45 13 C 49 11, 56 14, 57 19 C 56 23, 54 27, 54 34 L 52 72 L 50 90 L 48 72 L 46 30 C 46 21, 43 15, 45 13 Z',
        medianPath: 'M 50 13 L 50 90',
      },
      {
        id: 'so_gon',
        nameVi: 'Sổ gọn (垂露竖)',
        silhouettePath:
          'M 45 14 C 49 12, 56 15, 57 20 C 55 24, 54 30, 54 40 L 54 76 C 55 82, 52 87, 49 86 C 45 85, 44 79, 45 73 L 46 28 C 46 20, 43 16, 45 14 Z',
        medianPath: 'M 50 14 L 50 86',
      },
      {
        id: 'so_ngan',
        nameVi: 'Sổ ngắn (短竖)',
        silhouettePath:
          'M 47 26 C 51 24, 57 27, 58 32 C 57 38, 55 50, 52 66 C 50 72, 46 74, 45 70 C 45 62, 47 46, 47 34 C 47 29, 45 27, 47 26 Z',
        medianPath: 'M 52 26 Q 51 50 47 72',
      },
    ],
  },

  // 3. CHẤM (5 biến thể đúng như ảnh: Chấm phải, Chấm trái, Chấm phẩy, Chấm ngắn, Chấm móc nhẹ)
  {
    id: 'cham',
    labelVi: 'Chấm',
    hanziName: '点',
    pinyinName: 'Diǎn',
    descriptionVi: 'Đặt đầu bút nhẹ rồi nhấn nặng dần xuống dưới tạo hình giọt nước / hạt dưa tròn đầy.',
    examples: ['六', '主', '太', '玉', '文', '心'],
    variants: [
      {
        id: 'cham_phai',
        nameVi: 'Chấm phải (右点)',
        silhouettePath:
          'M 36 30 C 44 33, 56 44, 62 56 C 65 63, 62 70, 57 69 C 51 68, 44 56, 38 40 C 35 34, 34 30, 36 30 Z',
        medianPath: 'M 36 30 Q 52 48 60 68',
      },
      {
        id: 'cham_trai',
        nameVi: 'Chấm trái (左点)',
        silhouettePath:
          'M 54 28 C 56 36, 54 50, 48 64 C 45 70, 39 71, 38 65 C 37 58, 43 46, 50 32 C 52 28, 53 27, 54 28 Z',
        medianPath: 'M 53 28 Q 49 48 41 68',
      },
      {
        id: 'cham_phay',
        nameVi: 'Chấm phẩy (撇点)',
        silhouettePath:
          'M 58 30 C 63 32, 66 37, 62 42 C 56 50, 46 60, 36 68 C 34 69, 33 67, 35 64 C 43 54, 51 42, 56 33 C 57 30, 57 29, 58 30 Z',
        medianPath: 'M 62 32 Q 50 50 34 68',
      },
      {
        id: 'cham_ngan',
        nameVi: 'Chấm ngắn (短点)',
        silhouettePath:
          'M 42 36 C 49 39, 57 48, 60 57 C 62 63, 58 68, 53 66 C 48 64, 43 53, 40 42 C 39 38, 40 35, 42 36 Z',
        medianPath: 'M 41 36 Q 52 50 58 65',
      },
      {
        id: 'cham_hat',
        nameVi: 'Chấm hất (挑点)',
        silhouettePath:
          'M 44 38 C 48 44, 51 52, 52 58 L 66 44 C 68 43, 69 45, 67 47 L 52 66 C 48 69, 43 65, 43 58 C 43 51, 42 43, 44 38 Z',
        medianPath: 'M 44 39 L 49 62 L 67 45',
      },
    ],
  },

  // 4. HẤT (1 nét chuẩn trong ảnh: Nét hất vút nhọn lên phải)
  {
    id: 'hat',
    labelVi: 'Hất',
    hanziName: '提',
    pinyinName: 'Tí',
    descriptionVi: 'Nhấn đầu bút ở góc dưới bên trái rồi hất nhanh, dứt khoát và vuốt nhọn lên phía trên bên phải.',
    examples: ['我', '河', '冰', '打', '习', '江'],
    variants: [
      {
        id: 'hat_chuan',
        nameVi: 'Nét hất (提)',
        silhouettePath:
          'M 22 65 C 20 60, 25 56, 32 54 L 78 32 C 80 31, 81 33, 79 35 L 35 66 C 29 70, 24 69, 22 65 Z',
        medianPath: 'M 24 65 L 80 32',
      },
    ],
  },

  // 5. PHẨY (4 biến thể đúng như ảnh: Phẩy sổ cong, Phẩy nghiêng dài, Phẩy ngắn, Phẩy trung)
  {
    id: 'phay',
    labelVi: 'Phẩy',
    hanziName: '撇',
    pinyinName: 'Piě',
    descriptionVi: 'Nhấn đầu bút ở trên bên phải rồi kéo cong xuống phía dưới bên trái, nhấc bút vuốt nhọn đuôi.',
    examples: ['人', '八', '大', '千', '月', '用'],
    variants: [
      {
        id: 'phay_so',
        nameVi: 'Phẩy sổ (竖撇)',
        silhouettePath:
          'M 52 14 C 57 13, 63 16, 63 21 C 61 26, 59 38, 57 52 C 54 68, 44 80, 26 88 C 24 89, 23 87, 25 85 C 40 75, 48 63, 50 48 L 51 24 C 51 18, 49 15, 52 14 Z',
        medianPath: 'M 57 15 C 56 48 50 72 24 87',
      },
      {
        id: 'phay_dai',
        nameVi: 'Phẩy dài (斜撇)',
        silhouettePath:
          'M 64 18 C 69 18, 74 22, 72 27 C 68 32, 58 48, 44 64 C 35 74, 24 82, 16 86 C 14 87, 14 85, 16 83 C 28 74, 42 58, 54 38 C 60 28, 61 20, 64 18 Z',
        medianPath: 'M 69 20 Q 52 56 15 85',
      },
      {
        id: 'phay_ngan_1',
        nameVi: 'Phẩy ngắn (短撇)',
        silhouettePath:
          'M 62 28 C 67 29, 71 34, 68 39 C 62 45, 48 58, 30 68 C 28 69, 27 67, 29 65 C 43 53, 54 41, 59 32 C 60 29, 60 28, 62 28 Z',
        medianPath: 'M 66 31 Q 50 52 28 67',
      },
      {
        id: 'phay_ngan_2',
        nameVi: 'Phẩy gọn (平撇)',
        silhouettePath:
          'M 64 26 C 69 27, 72 32, 69 37 C 61 45, 46 60, 28 70 C 26 71, 25 69, 27 67 C 42 54, 55 39, 61 30 C 62 27, 62 26, 64 26 Z',
        medianPath: 'M 68 29 Q 50 52 26 69',
      },
    ],
  },

  // 6. MÁC (3 biến thể đúng như ảnh: Mác nghiêng, Mác bằng ngang, Mác chấm dài)
  {
    id: 'mac',
    labelVi: 'Mác',
    hanziName: '捺',
    pinyinName: 'Nà',
    descriptionVi: 'Đặt bút nhẹ ở trên bên trái, kéo xuống phải đậm dần, nhấn ở chân mác rồi vuốt nhọn sang ngang.',
    examples: ['人', '八', '大', '天', '木', '这'],
    variants: [
      {
        id: 'mac_nghieng',
        nameVi: 'Mác nghiêng (斜捺)',
        silhouettePath:
          'M 20 18 C 23 18, 28 24, 36 34 C 46 48, 58 62, 68 68 L 86 76 C 88 77, 88 79, 85 79 L 62 79 C 55 79, 49 72, 42 60 C 33 45, 24 30, 19 21 C 18 19, 18 18, 20 18 Z',
        medianPath: 'M 20 19 Q 46 58 58 73 L 87 78',
      },
      {
        id: 'mac_bang',
        nameVi: 'Mác bằng (平捺)',
        silhouettePath:
          'M 14 38 C 20 36, 28 38, 38 44 C 50 52, 62 58, 72 60 L 88 62 C 90 62, 90 64, 87 65 L 64 68 C 56 69, 48 64, 38 55 C 28 46, 20 43, 14 42 C 12 41, 12 39, 14 38 Z',
        medianPath: 'M 14 40 C 32 42 48 62 62 64 L 89 63',
      },
      {
        id: 'mac_phan',
        nameVi: 'Mác chấm dài (反捺)',
        silhouettePath:
          'M 26 28 C 36 32, 54 44, 70 58 C 76 64, 74 72, 67 70 C 58 67, 44 50, 27 33 C 24 30, 24 28, 26 28 Z',
        medianPath: 'M 26 29 Q 54 48 72 67',
      },
    ],
  },

  // 7. GẬP (7 biến thể đúng như 2 hàng Gập trong ảnh: Phẩy chấm, Phẩy gập, Sổ hất, Sổ cong, Sổ gập, Ngang gập, Ngang phẩy)
  {
    id: 'gap',
    labelVi: 'Gập',
    hanziName: '折',
    pinyinName: 'Zhé',
    descriptionVi: 'Có một khúc gập chuyển hướng ở giữa nét (nhấn nhẹ ở góc gập rồi đổi hướng kéo bút tiếp).',
    examples: ['女', '云', '民', '四', '山', '口', '又'],
    variants: [
      {
        id: 'phay_cham',
        nameVi: 'Phẩy chấm (撇点)',
        silhouettePath:
          'M 54 14 C 59 15, 62 19, 59 24 L 36 54 L 68 74 C 73 78, 71 85, 65 83 C 58 80, 44 68, 28 57 C 25 55, 25 52, 28 49 L 50 18 C 52 15, 52 14, 54 14 Z',
        medianPath: 'M 57 16 L 30 54 L 69 80',
      },
      {
        id: 'phay_gap',
        nameVi: 'Phẩy gập (撇折)',
        silhouettePath:
          'M 56 20 C 61 21, 64 25, 61 30 L 36 64 L 74 56 C 77 56, 78 58, 75 60 L 32 74 C 26 76, 23 71, 27 65 L 52 24 C 54 21, 54 20, 56 20 Z',
        medianPath: 'M 59 22 L 29 70 L 76 58',
      },
      {
        id: 'so_hat',
        nameVi: 'Sổ hất (竖提)',
        silhouettePath:
          'M 42 16 C 46 14, 53 17, 54 22 L 51 66 L 76 48 C 78 47, 79 49, 77 51 L 48 78 C 43 82, 39 77, 41 70 L 43 24 C 43 19, 40 17, 42 16 Z',
        medianPath: 'M 48 16 L 45 74 L 77 49',
      },
      {
        id: 'so_cong',
        nameVi: 'Sổ cong (竖弯)',
        silhouettePath:
          'M 34 18 C 38 16, 45 19, 45 24 L 43 58 C 43 66, 48 70, 58 70 L 76 69 C 81 69, 84 73, 81 77 C 78 80, 68 80, 55 79 C 39 78, 33 71, 34 58 L 35 26 C 35 20, 32 19, 34 18 Z',
        medianPath: 'M 39 18 L 38 60 Q 38 75 56 75 L 81 74',
      },
      {
        id: 'so_gap',
        nameVi: 'Sổ gập (竖折)',
        silhouettePath:
          'M 30 18 C 34 16, 41 19, 41 24 L 39 66 L 76 63 C 82 63, 86 67, 84 71 C 82 75, 75 74, 68 73 L 35 75 C 29 76, 27 71, 29 65 L 31 25 C 31 20, 28 19, 30 18 Z',
        medianPath: 'M 35 18 L 33 71 L 83 68',
      },
      {
        id: 'ngang_gap',
        nameVi: 'Ngang gập (横折)',
        silhouettePath:
          'M 20 30 C 22 26, 28 26, 36 25 L 66 21 C 72 20, 78 24, 77 30 L 67 74 C 65 80, 59 81, 58 75 L 64 31 L 30 35 C 23 36, 19 33, 20 30 Z',
        medianPath: 'M 21 31 L 71 25 L 61 78',
      },
      {
        id: 'ngang_phay',
        nameVi: 'Ngang phẩy (横撇)',
        silhouettePath:
          'M 24 26 C 26 22, 32 22, 40 21 L 66 17 C 72 16, 78 21, 75 27 C 68 44, 52 68, 24 82 C 22 83, 21 81, 23 79 C 46 64, 59 44, 64 26 L 32 30 C 25 31, 23 29, 24 26 Z',
        medianPath: 'M 25 27 L 70 21 Q 56 58 22 81',
      },
    ],
  },

  // 8. MÓC (10 biến thể đúng như 2 hàng Móc trong ảnh)
  {
    id: 'moc',
    labelVi: 'Móc',
    hanziName: '钩',
    pinyinName: 'Gōu',
    descriptionVi: 'Cuối nét nhấn nhẹ rồi bật mũi bút nhọn lên trên hoặc sang trái (Sổ móc, Cong móc, Ngang móc, Nghiêng móc, Nằm móc...).',
    examples: ['小', '家', '月', '刀', '买', '我', '九', '乙', '儿', '心'],
    variants: [
      {
        id: 'so_moc',
        nameVi: 'Sổ móc (竖钩)',
        silhouettePath:
          'M 48 14 C 52 12, 59 15, 60 20 L 58 74 C 58 82, 53 86, 47 83 L 30 70 C 28 69, 29 67, 32 68 L 49 74 L 50 24 C 50 18, 46 15, 48 14 Z',
        medianPath: 'M 54 14 L 54 80 L 30 68',
      },
      {
        id: 'cong_moc',
        nameVi: 'Cong móc (弯钩)',
        silhouettePath:
          'M 44 14 C 48 13, 54 16, 56 22 C 63 42, 62 64, 54 80 C 51 86, 45 86, 40 82 L 26 70 C 24 68, 26 66, 28 68 L 45 75 C 52 62, 53 42, 46 22 C 44 17, 42 15, 44 14 Z',
        medianPath: 'M 46 15 Q 62 48 49 81 L 27 68',
      },
      {
        id: 'ngang_gap_moc_dai',
        nameVi: 'Ngang gập móc (横折钩)',
        silhouettePath:
          'M 24 22 C 26 18, 32 18, 40 17 L 64 14 C 70 13, 76 17, 75 23 L 72 74 C 71 82, 65 86, 59 82 L 44 70 C 42 68, 44 66, 46 68 L 62 74 L 65 23 L 32 27 C 26 28, 23 25, 24 22 Z',
        medianPath: 'M 25 23 L 70 18 L 67 80 L 44 68',
      },
      {
        id: 'ngang_gap_moc_nghieng',
        nameVi: 'Ngang gập móc nghiêng',
        silhouettePath:
          'M 22 28 C 24 24, 30 24, 38 23 L 66 19 C 72 18, 78 22, 76 28 L 66 72 C 63 80, 57 83, 51 78 L 38 66 C 36 64, 38 62, 40 64 L 55 70 L 65 28 L 30 33 C 24 34, 21 31, 22 28 Z',
        medianPath: 'M 23 29 L 71 23 L 59 77 L 38 64',
      },
      {
        id: 'ngang_moc',
        nameVi: 'Ngang móc (横钩)',
        silhouettePath:
          'M 16 44 C 18 40, 24 40, 32 39 L 72 34 C 79 33, 85 37, 82 43 L 64 62 C 62 64, 60 62, 62 59 L 71 43 L 26 48 C 19 49, 15 47, 16 44 Z',
        medianPath: 'M 17 45 L 78 38 L 62 61',
      },
      {
        id: 'nghieng_moc',
        nameVi: 'Nghiêng móc (斜钩)',
        silhouettePath:
          'M 26 14 C 30 13, 36 16, 37 22 C 42 46, 52 68, 68 78 L 72 56 C 72 54, 75 54, 75 57 L 75 84 C 75 90, 68 91, 62 86 C 44 72, 33 48, 28 22 C 27 17, 24 15, 26 14 Z',
        medianPath: 'M 31 15 Q 44 62 70 85 L 74 56',
      },
      {
        id: 'ngang_gap_cong_moc',
        nameVi: 'Ngang gập cong móc (横折弯钩)',
        silhouettePath:
          'M 18 26 C 20 22, 26 22, 34 21 L 54 17 C 60 16, 65 20, 63 26 L 54 58 C 51 68, 55 74, 66 74 L 74 74 L 76 54 C 76 52, 79 52, 79 55 L 81 79 C 81 84, 75 85, 64 84 C 48 83, 42 74, 45 58 L 53 26 L 26 30 C 20 31, 17 29, 18 26 Z',
        medianPath: 'M 19 27 L 58 21 L 49 60 Q 47 79 68 79 L 77 79 L 78 54',
      },
      {
        id: 'ngang_phay_cong_moc',
        nameVi: 'Ngang phẩy cong móc (乙)',
        silhouettePath:
          'M 22 24 C 24 20, 30 20, 38 19 L 58 16 C 64 15, 69 20, 65 25 L 40 58 C 35 66, 39 73, 52 74 L 74 74 L 76 54 C 76 52, 79 52, 79 55 L 81 79 C 81 84, 74 85, 52 84 C 32 83, 25 72, 32 56 L 55 25 L 28 29 C 22 30, 20 27, 22 24 Z',
        medianPath: 'M 23 25 L 61 20 L 35 58 Q 29 78 55 79 L 77 79 L 78 54',
      },
      {
        id: 'so_cong_moc',
        nameVi: 'Sổ cong móc (竖弯钩)',
        silhouettePath:
          'M 32 16 C 36 14, 43 17, 43 22 L 40 58 C 40 68, 46 73, 60 73 L 74 73 L 76 52 C 76 50, 79 50, 79 53 L 82 78 C 82 83, 75 84, 58 83 C 38 82, 31 73, 32 58 L 34 24 C 34 19, 30 17, 32 16 Z',
        medianPath: 'M 37 16 L 35 60 Q 35 78 60 78 L 78 78 L 78 52',
      },
      {
        id: 'nam_moc',
        nameVi: 'Nằm móc (卧钩)',
        silhouettePath:
          'M 18 36 C 21 35, 25 40, 30 48 C 40 64, 56 72, 74 70 L 66 50 C 65 48, 68 47, 70 49 L 84 72 C 87 77, 82 82, 72 82 C 50 82, 33 70, 22 50 C 18 42, 16 37, 18 36 Z',
        medianPath: 'M 19 37 Q 42 77 79 76 L 68 49',
      },
    ],
  },
];
