declare module "gifenc" {
  export interface WriteFrameOptions {
    palette?: number[][];
    delay?: number;
    first?: boolean;
    repeat?: number;
    dispose?: number;
    transparent?: boolean;
    transparentIndex?: number;
  }

  export interface QuantizeOptions {
    format?: "rgb444" | "rgb565" | "rgba4444";
    oneBitAlpha?: boolean | number;
    clearAlpha?: boolean;
    clearAlphaColor?: number;
    clearAlphaThreshold?: number;
  }

  export interface ApplyPaletteOptions {
    format?: "rgb444" | "rgb565" | "rgba4444";
  }

  export interface GIFEncoderInstance {
    writeFrame(
      index: Uint8Array,
      width: number,
      height: number,
      options: WriteFrameOptions
    ): void;
    finish(): void;
    bytes(): Uint8Array;
  }

  export function GIFEncoder(): GIFEncoderInstance;
  export function quantize(
    data: Uint8Array,
    maxColors: number,
    options?: QuantizeOptions
  ): number[][];
  export function applyPalette(
    data: Uint8Array,
    palette: number[][],
    options?: ApplyPaletteOptions
  ): Uint8Array;
}
