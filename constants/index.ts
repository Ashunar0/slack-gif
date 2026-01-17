export * from './fonts';
export * from './animations';

// 出力設定
export const OUTPUT_SIZE = 128;

// 対応画像形式
export const SUPPORTED_IMAGE_FORMATS = [
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
];

// 最大ファイルサイズ（5MB）
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

// カラーピッカーのプリセットカラー
export const PRESET_COLORS = [
  '#000000', // 黒
  '#ffffff', // 白
  '#ff0000', // 赤
  '#ff6b6b', // ライトレッド
  '#ff9500', // オレンジ
  '#ffcc00', // 黄色
  '#34c759', // 緑
  '#00c7be', // ティール
  '#007aff', // 青
  '#5856d6', // 紫
  '#af52de', // マゼンタ
  '#ff2d55', // ピンク
];

// グラデーションプリセット
export const GRADIENT_PRESETS = [
  { name: '炎', startColor: '#ff6b6b', endColor: '#ffd93d' },
  { name: '海', startColor: '#667eea', endColor: '#764ba2' },
  { name: '森', startColor: '#11998e', endColor: '#38ef7d' },
  { name: '夕焼け', startColor: '#f093fb', endColor: '#f5576c' },
  { name: '宇宙', startColor: '#4facfe', endColor: '#00f2fe' },
  { name: 'ゴールド', startColor: '#f7971e', endColor: '#ffd200' },
];
