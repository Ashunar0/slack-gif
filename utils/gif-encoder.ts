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

    // 背景は透明のまま（塗りつぶさない）

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

  // 背景は透明がデフォルト（塗りつぶさない）

  // カスタム背景を描画（ユーザーが透明背景を無効にしている場合）
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

  // 透明色として使う色（パレットに必ず含める）
  const transparentColor = [0, 0, 0]; // RGB: 黒

  // 全フレーム共通のパレットを生成するため、全フレームのデータを集める
  const frameDataList: ImageData[] = [];
  const allPixels: number[] = [];

  // 各フレームのImageDataを取得し、全ピクセルのRGBAを収集
  for (let frameIndex = 0; frameIndex < frames.length; frameIndex++) {
    const frame = frames[frameIndex];
    const ctx = frame.getContext("2d")!;
    const imageData = ctx.getImageData(0, 0, size, size);
    frameDataList.push(imageData);

    // 全ピクセルのRGBA値を収集
    const { data } = imageData;
    for (let i = 0; i < size * size; i++) {
      allPixels.push(
        data[i * 4],
        data[i * 4 + 1],
        data[i * 4 + 2],
        data[i * 4 + 3]
      );
    }
  }

  // 共通パレットを生成（透明色を含める）
  const globalPalette = quantize(new Uint8Array(allPixels), 256, {
    format: "rgba444",
    oneBit: true, // 透明/不透明の2値化
  });

  // 透明色のインデックスを特定
  let transparentIndex = -1;
  for (let p = 0; p < globalPalette.length; p++) {
    const [r, g, b, a] = globalPalette[p];
    if (a === 0) {
      // アルファが0の色を透明色として使用
      transparentIndex = p;
      break;
    }
  }
  const hasTransparent = transparentIndex >= 0;

  // 各フレームをエンコード
  for (let frameIndex = 0; frameIndex < frameDataList.length; frameIndex++) {
    const imageData = frameDataList[frameIndex];

    // Uint8ClampedArray を Uint8Array に変換
    const rgbaData = new Uint8Array(imageData.data);

    // グローバルパレットを適用してインデックスカラーに変換
    const index = applyPalette(rgbaData, globalPalette, {
      format: "rgba444",
    });

    // フレームを追加
    if (frameIndex === 0) {
      gif.writeFrame(index, size, size, {
        palette: globalPalette,
        delay,
        first: true,
        repeat: 0, // 0 = 無限ループ
        transparent: hasTransparent ? transparentIndex : undefined, // 透明色のインデックスを指定
        disposal: 2, // 前フレームを背景色（透明）にクリア
      });
    } else {
      gif.writeFrame(index, size, size, {
        delay,
        transparent: hasTransparent ? transparentIndex : undefined,
        disposal: 2,
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
