import { AnimationPreset, AnimationType } from '@/types';

// アニメーションプリセット一覧
export const ANIMATION_PRESETS: AnimationPreset[] = [
  {
    type: 'none',
    name: 'なし',
    description: '静止画（アニメーションなし）',
  },
  {
    type: 'blink',
    name: '点滅',
    description: '透明度の切り替えによる点滅',
  },
  {
    type: 'bounce',
    name: 'バウンス',
    description: '上下に弾むアニメーション',
  },
  {
    type: 'slide',
    name: 'スライド',
    description: '左右にスライド',
  },
  {
    type: 'rotate',
    name: '回転',
    description: '360度回転',
  },
  {
    type: 'shake',
    name: 'シェイク',
    description: '左右に小刻みに揺れる',
  },
  {
    type: 'fade',
    name: 'フェード',
    description: 'フェードイン・アウト',
  },
  {
    type: 'zoom',
    name: 'ズーム',
    description: '拡大縮小を繰り返す',
  },
  {
    type: 'swing',
    name: '揺れ',
    description: 'ゆらゆら揺れる',
  },
  {
    type: 'rainbow',
    name: '虹色',
    description: '色相が変化する',
  },
  {
    type: 'sparkle',
    name: 'キラキラ',
    description: '光るエフェクト',
  },
];

// アニメーション速度設定
export const ANIMATION_SPEED = {
  MIN: 1,
  MAX: 10,
  DEFAULT: 5,
} as const;

// GIF設定
export const GIF_CONFIG = {
  // フレーム数
  FRAME_COUNT: 12,
  // フレーム遅延（ms）を速度から計算
  getFrameDelay: (speed: number): number => {
    // 速度1=200ms, 速度10=20ms
    return Math.round(200 - (speed - 1) * 20);
  },
  // 出力品質（1-30、低いほど高品質）
  QUALITY: 10,
} as const;

// アニメーションタイプからプリセットを取得
export const getAnimationPreset = (
  type: AnimationType
): AnimationPreset | undefined => {
  return ANIMATION_PRESETS.find((preset) => preset.type === type);
};
