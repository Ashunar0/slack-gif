import { FontInfo } from '@/types';

// Google Fontsで利用可能な日本語対応フォント
export const FONTS: FontInfo[] = [
  // ゴシック体
  { family: 'Noto Sans JP', name: 'Noto Sans JP', category: 'gothic' },
  { family: 'M PLUS 1p', name: 'M PLUS 1p', category: 'gothic' },
  { family: 'M PLUS 2', name: 'M PLUS 2', category: 'gothic' },
  { family: 'Zen Kaku Gothic New', name: 'Zen角ゴシック', category: 'gothic' },

  // 明朝体
  { family: 'Noto Serif JP', name: 'Noto Serif JP', category: 'mincho' },
  { family: 'Zen Old Mincho', name: 'Zen明朝', category: 'mincho' },
  { family: 'Shippori Mincho', name: 'しっぽり明朝', category: 'mincho' },

  // 丸ゴシック
  { family: 'M PLUS Rounded 1c', name: 'M PLUS Rounded', category: 'rounded' },
  { family: 'Zen Maru Gothic', name: 'Zen丸ゴシック', category: 'rounded' },
  { family: 'Kosugi Maru', name: '小杉丸ゴシック', category: 'rounded' },

  // 手書き風
  { family: 'Yomogi', name: 'よもぎ', category: 'handwriting' },
  { family: 'Zen Kurenaido', name: 'Zen紅道', category: 'handwriting' },
  { family: 'Yuji Syuku', name: '遊字朱雀', category: 'handwriting' },

  // ディスプレイ・装飾
  { family: 'Hachi Maru Pop', name: 'はちまるポップ', category: 'display' },
  { family: 'Dela Gothic One', name: 'デラゴシック', category: 'display' },
  { family: 'RocknRoll One', name: 'ロックンロール', category: 'display' },
  { family: 'Reggae One', name: 'レゲエ', category: 'display' },
  { family: 'DotGothic16', name: 'ドットゴシック', category: 'display' },
];

// Google Fontsのimport用URL
export const GOOGLE_FONTS_URL = `https://fonts.googleapis.com/css2?${FONTS.map(
  (font) => `family=${font.family.replace(/ /g, '+')}:wght@400;700`
).join('&')}&display=swap`;

// フォントカテゴリー表示名
export const FONT_CATEGORIES = {
  gothic: 'ゴシック体',
  mincho: '明朝体',
  rounded: '丸ゴシック',
  handwriting: '手書き風',
  display: 'ディスプレイ',
} as const;
