import { GIFEncoder, quantize, applyPalette } from "gifenc";
import { OUTPUT_SIZE, GIF_CONFIG } from "@/constants";

// GIFを生成
export async function encodeGIF(
  frames: HTMLCanvasElement[],
  speed: number
): Promise<Blob> {
  const size = OUTPUT_SIZE;
  const delay = GIF_CONFIG.getFrameDelay(speed);

  // GIFエンコーダーを作成
  const gif = GIFEncoder();

  for (const frame of frames) {
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

    // フレームを追加
    gif.writeFrame(index, size, size, {
      palette,
      delay,
    });
  }

  // GIFを完成
  gif.finish();

  // Blobとして返す
  return new Blob([gif.bytes()], { type: "image/gif" });
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
