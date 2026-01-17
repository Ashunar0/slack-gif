declare module "gifenc" {
  export interface WriteFrameOptions {
    palette?: number[][];
    delay?: number;
    first?: boolean;
    repeat?: number;
    disposal?: number;
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
  export function quantize(data: Uint8Array, maxColors: number): number[][];
  export function applyPalette(data: Uint8Array, palette: number[][]): Uint8Array;
}
