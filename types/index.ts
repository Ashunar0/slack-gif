// スタンプ作成モード
export type StampMode = 'text' | 'image';

// グラデーション設定
export interface GradientConfig {
  enabled: boolean;
  startColor: string;
  endColor: string;
  direction: 'horizontal' | 'vertical' | 'diagonal';
}

// シャドウ設定
export interface ShadowConfig {
  enabled: boolean;
  color: string;
  blur: number;
  offsetX: number;
  offsetY: number;
}

// 縁取り設定
export interface StrokeConfig {
  enabled: boolean;
  color: string;
  width: number;
}

// テキストスタンプ設定
export interface TextStampConfig {
  text: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  backgroundColor: string;
  backgroundTransparent: boolean;
  gradient: GradientConfig;
  shadow: ShadowConfig;
  stroke: StrokeConfig;
  rotation: number;
}

// 画像スタンプ設定
export interface ImageStampConfig {
  imageData: string | null; // base64
  crop: CropArea | null;
}

// クロップエリア
export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

// アニメーションタイプ
export type AnimationType =
  | 'none'
  | 'blink'
  | 'bounce'
  | 'slide'
  | 'rotate'
  | 'shake'
  | 'fade'
  | 'zoom'
  | 'swing'
  | 'rainbow'
  | 'sparkle';

// アニメーション設定
export interface AnimationConfig {
  types: AnimationType[]; // 複数のアニメーションを配列で保持
  speed: number; // 1-10
  enabled: boolean;
}

// アニメーションプリセット情報
export interface AnimationPreset {
  type: AnimationType;
  name: string;
  description: string;
}

// フォント情報
export interface FontInfo {
  family: string;
  name: string;
  category: 'gothic' | 'mincho' | 'rounded' | 'handwriting' | 'display';
}

// 出力設定
export interface OutputConfig {
  size: number; // 128
  format: 'png' | 'gif';
}

// 全体の状態
export interface StampState {
  mode: StampMode;
  text: TextStampConfig;
  image: ImageStampConfig;
  animation: AnimationConfig;
  output: OutputConfig;
}

// デフォルト値
export const defaultTextConfig: TextStampConfig = {
  text: '',
  fontFamily: 'Noto Sans JP',
  fontSize: 48,
  color: '#000000',
  backgroundColor: '#ffffff',
  backgroundTransparent: true,
  gradient: {
    enabled: false,
    startColor: '#ff0000',
    endColor: '#0000ff',
    direction: 'horizontal',
  },
  shadow: {
    enabled: false,
    color: '#000000',
    blur: 4,
    offsetX: 2,
    offsetY: 2,
  },
  stroke: {
    enabled: false,
    color: '#ffffff',
    width: 2,
  },
  rotation: 0,
};

export const defaultImageConfig: ImageStampConfig = {
  imageData: null,
  crop: null,
};

export const defaultAnimationConfig: AnimationConfig = {
  types: ['none'],
  speed: 5,
  enabled: false,
};

export const defaultOutputConfig: OutputConfig = {
  size: 128,
  format: 'png',
};

export const defaultStampState: StampState = {
  mode: 'text',
  text: defaultTextConfig,
  image: defaultImageConfig,
  animation: defaultAnimationConfig,
  output: defaultOutputConfig,
};
