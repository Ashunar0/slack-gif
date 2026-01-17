import { GIFEncoder, quantize, applyPalette } from "gifenc";
import { OUTPUT_SIZE, GIF_CONFIG } from "@/constants";
import { TextStampConfig } from "@/types";

// 画像をキャンバスに描画（非同期）
export function drawImageToCanvas(imageSrc: string): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const ctx = canvas.getContext("2d")!;

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
      resolve(canvas);
    };
    img.onerror = reject;
    img.src = imageSrc;
  });
}

// テキストをキャンバスに描画
export function drawTextToCanvas(textConfig: TextStampConfig): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const size = OUTPUT_SIZE;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // 背景を描画
  if (!textConfig.backgroundTransparent) {
    if (
      textConfig.gradient.enabled &&
      textConfig.gradient.direction !== "horizontal"
    ) {
      const bgGradient = ctx.createLinearGradient(
        0,
        0,
        textConfig.gradient.direction === "diagonal" ? size : 0,
        size
      );
      bgGradient.addColorStop(0, textConfig.gradient.startColor);
      bgGradient.addColorStop(1, textConfig.gradient.endColor);
      ctx.fillStyle = bgGradient;
    } else {
      ctx.fillStyle = textConfig.backgroundColor;
    }
    ctx.fillRect(0, 0, size, size);
  }

  if (!textConfig.text) return canvas;

  ctx.save();
  ctx.translate(size / 2, size / 2);
  ctx.rotate((textConfig.rotation * Math.PI) / 180);

  const lines = textConfig.text.split("\n");
  const lineCount = lines.length;

  let fontSize = textConfig.fontSize;
  ctx.font = `bold ${fontSize}px "${textConfig.fontFamily}"`;

  const maxWidth = size * 0.85;
  const maxHeight = size * 0.85;

  let textWidth = 0;
  for (const line of lines) {
    const metrics = ctx.measureText(line);
    textWidth = Math.max(textWidth, metrics.width);
  }

  const totalHeight = fontSize * lineCount * 1.2;
  const scaleX = textWidth > maxWidth ? maxWidth / textWidth : 1;
  const scaleY = totalHeight > maxHeight ? maxHeight / totalHeight : 1;
  const scale = Math.min(scaleX, scaleY);

  if (scale < 1) {
    fontSize *= scale;
    ctx.font = `bold ${fontSize}px "${textConfig.fontFamily}"`;
  }

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const lineHeight = fontSize * 1.2;
  const startY = -((lineCount - 1) * lineHeight) / 2;

  lines.forEach((line, index) => {
    const y = startY + index * lineHeight;

    if (textConfig.shadow.enabled) {
      ctx.shadowColor = textConfig.shadow.color;
      ctx.shadowBlur = textConfig.shadow.blur;
      ctx.shadowOffsetX = textConfig.shadow.offsetX;
      ctx.shadowOffsetY = textConfig.shadow.offsetY;
    }

    if (textConfig.stroke.enabled) {
      ctx.strokeStyle = textConfig.stroke.color;
      ctx.lineWidth = textConfig.stroke.width * 2;
      ctx.lineJoin = "round";
      ctx.strokeText(line, 0, y);
    }

    if (textConfig.gradient.enabled) {
      const gradient = ctx.createLinearGradient(
        textConfig.gradient.direction === "vertical" ? 0 : -size / 2,
        textConfig.gradient.direction === "horizontal" ? 0 : -size / 2,
        textConfig.gradient.direction === "vertical" ? 0 : size / 2,
        textConfig.gradient.direction === "horizontal" ? 0 : size / 2
      );
      gradient.addColorStop(0, textConfig.gradient.startColor);
      gradient.addColorStop(1, textConfig.gradient.endColor);
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = textConfig.color;
    }

    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    ctx.fillText(line, 0, y);
  });

  ctx.restore();
  return canvas;
}

// GIFを生成
export async function encodeGIF(
  frames: HTMLCanvasElement[],
  speed: number
): Promise<Blob> {
  const size = OUTPUT_SIZE;
  const delay = GIF_CONFIG.getFrameDelay(speed);

  // GIFエンコーダーを作成
  const gif = GIFEncoder();

  for (let frameIndex = 0; frameIndex < frames.length; frameIndex++) {
    const frame = frames[frameIndex];
    const ctx = frame.getContext("2d")!;
    const imageData = ctx.getImageData(0, 0, size, size);
    const { data } = imageData;

    // RGBA から RGB に変換（透明部分は白で埋める）
    const rgbData = new Uint8Array(size * size * 3);
    for (let i = 0; i < size * size; i++) {
      const alpha = data[i * 4 + 3];
      if (alpha < 128) {
        // 透明部分は白
        rgbData[i * 3] = 255;
        rgbData[i * 3 + 1] = 255;
        rgbData[i * 3 + 2] = 255;
      } else {
        rgbData[i * 3] = data[i * 4];
        rgbData[i * 3 + 1] = data[i * 4 + 1];
        rgbData[i * 3 + 2] = data[i * 4 + 2];
      }
    }

    // パレットを生成（256色に量子化）
    const palette = quantize(rgbData, 256);

    // パレットを適用してインデックスカラーに変換
    const index = applyPalette(rgbData, palette);

    // フレームを追加（最初のフレームにはループ設定を含める）
    if (frameIndex === 0) {
      gif.writeFrame(index, size, size, {
        palette,
        delay,
        first: true,
        repeat: 0, // 0 = 無限ループ
      });
    } else {
      gif.writeFrame(index, size, size, {
        palette,
        delay,
      });
    }
  }

  // GIFを完成
  gif.finish();

  // Blobとして返す
  const bytes = gif.bytes();
  return new Blob([new Uint8Array(bytes)], { type: "image/gif" });
}

// GIFをダウンロード
export function downloadGIF(blob: Blob, filename?: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || `stamp-${Date.now()}.gif`;
  link.click();
  URL.revokeObjectURL(url);
}

// PNGをダウンロード
export function downloadPNG(canvas: HTMLCanvasElement, filename?: string): void {
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = filename || `stamp-${Date.now()}.png`;
  link.click();
}
