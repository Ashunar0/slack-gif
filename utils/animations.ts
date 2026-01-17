import { AnimationType } from "@/types";
import { OUTPUT_SIZE, GIF_CONFIG } from "@/constants";

// アニメーションフレームの変換パラメータ
interface FrameTransform {
  offsetX: number;
  offsetY: number;
  scale: number;
  rotation: number;
  opacity: number;
  hueRotate: number;
}

// 各アニメーションタイプのフレーム変換を計算
export function calculateFrameTransform(
  type: AnimationType,
  frameIndex: number,
  totalFrames: number
): FrameTransform {
  const progress = frameIndex / totalFrames;
  const angle = progress * Math.PI * 2;

  const defaultTransform: FrameTransform = {
    offsetX: 0,
    offsetY: 0,
    scale: 1,
    rotation: 0,
    opacity: 1,
    hueRotate: 0,
  };

  switch (type) {
    case "none":
      return defaultTransform;

    case "blink":
      // 点滅: 透明度を0と1で切り替え
      return {
        ...defaultTransform,
        opacity: frameIndex % 2 === 0 ? 1 : 0.2,
      };

    case "bounce":
      // バウンス: 上下に弾む（サイン波）
      const bounceOffset = Math.abs(Math.sin(angle)) * 15;
      return {
        ...defaultTransform,
        offsetY: -bounceOffset,
      };

    case "slide":
      // スライド: 左右に移動
      const slideOffset = Math.sin(angle) * 10;
      return {
        ...defaultTransform,
        offsetX: slideOffset,
      };

    case "rotate":
      // 回転: 360度回転
      return {
        ...defaultTransform,
        rotation: progress * 360,
      };

    case "shake":
      // シェイク: 左右に小刻みに揺れる
      const shakeOffset = Math.sin(angle * 4) * 5;
      return {
        ...defaultTransform,
        offsetX: shakeOffset,
      };

    case "fade":
      // フェード: フェードイン・アウト
      const fadeOpacity = (Math.sin(angle) + 1) / 2;
      return {
        ...defaultTransform,
        opacity: 0.3 + fadeOpacity * 0.7,
      };

    case "zoom":
      // ズーム: 拡大縮小
      const zoomScale = 0.8 + (Math.sin(angle) + 1) * 0.15;
      return {
        ...defaultTransform,
        scale: zoomScale,
      };

    case "swing":
      // 揺れ: ゆらゆら揺れる
      const swingRotation = Math.sin(angle) * 15;
      return {
        ...defaultTransform,
        rotation: swingRotation,
      };

    case "rainbow":
      // 虹色: 色相が変化
      return {
        ...defaultTransform,
        hueRotate: progress * 360,
      };

    case "sparkle":
      // キラキラ: 明滅 + 少しスケール変化
      const sparklePhase = (frameIndex * 3) % totalFrames;
      const sparkleOpacity = sparklePhase < totalFrames / 2 ? 1 : 0.6;
      const sparkleScale = 0.95 + Math.sin(angle * 2) * 0.05;
      return {
        ...defaultTransform,
        opacity: sparkleOpacity,
        scale: sparkleScale,
      };

    default:
      return defaultTransform;
  }
}

// キャンバスにフレーム変換を適用して描画
export function applyFrameTransform(
  sourceCanvas: HTMLCanvasElement,
  transform: FrameTransform
): HTMLCanvasElement {
  const size = OUTPUT_SIZE;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // 中心を原点に移動
  ctx.translate(size / 2, size / 2);

  // 変換を適用
  ctx.rotate((transform.rotation * Math.PI) / 180);
  ctx.scale(transform.scale, transform.scale);

  // 透明度
  ctx.globalAlpha = transform.opacity;

  // 色相回転（hue-rotate）はCanvasでは直接できないので、
  // rainbowの場合は別処理が必要

  // 描画
  ctx.drawImage(
    sourceCanvas,
    -size / 2 + transform.offsetX,
    -size / 2 + transform.offsetY,
    size,
    size
  );

  return canvas;
}

// 色相回転を適用（rainbow用）
export function applyHueRotate(
  canvas: HTMLCanvasElement,
  hueRotate: number
): HTMLCanvasElement {
  const size = canvas.width;
  const resultCanvas = document.createElement("canvas");
  resultCanvas.width = size;
  resultCanvas.height = size;
  const ctx = resultCanvas.getContext("2d")!;

  // filter を使用して色相回転
  ctx.filter = `hue-rotate(${hueRotate}deg)`;
  ctx.drawImage(canvas, 0, 0);
  ctx.filter = "none";

  return resultCanvas;
}

// アニメーションフレームを生成
export function generateAnimationFrames(
  sourceCanvas: HTMLCanvasElement,
  animationType: AnimationType,
  frameCount: number = GIF_CONFIG.FRAME_COUNT
): HTMLCanvasElement[] {
  const frames: HTMLCanvasElement[] = [];

  for (let i = 0; i < frameCount; i++) {
    const transform = calculateFrameTransform(animationType, i, frameCount);
    let frameCanvas = applyFrameTransform(sourceCanvas, transform);

    // rainbow の場合は色相回転を適用
    if (animationType === "rainbow") {
      frameCanvas = applyHueRotate(frameCanvas, transform.hueRotate);
    }

    frames.push(frameCanvas);
  }

  return frames;
}
