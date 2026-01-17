"use client";

import { useRef, useEffect } from "react";
import { TextStampConfig, StampMode, AnimationConfig } from "@/types";
import { OUTPUT_SIZE, GIF_CONFIG } from "@/constants";
import { Type, ImageIcon } from "lucide-react";
import { useDebounce } from "@/hooks";
import { calculateFrameTransform, applyHueRotate } from "@/utils/animations";

interface PreviewCanvasProps {
  mode: StampMode;
  textConfig: TextStampConfig;
  croppedImage: string | null;
  animationConfig?: AnimationConfig;
  canvasRef?: React.RefObject<HTMLCanvasElement | null>;
}

export function PreviewCanvas({
  mode,
  textConfig,
  croppedImage,
  animationConfig,
  canvasRef,
}: PreviewCanvasProps) {
  const internalRef = useRef<HTMLCanvasElement>(null);
  const ref = canvasRef || internalRef;
  const animationFrameRef = useRef<number | null>(null);
  const frameIndexRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);

  // Debounce text config changes for smoother rendering
  const debouncedTextConfig = useDebounce(textConfig, 50);

  // 静止画の描画関数
  const drawStaticFrame = (ctx: CanvasRenderingContext2D, size: number) => {
    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    if (mode === "image" && croppedImage) {
      // Draw cropped image
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, size, size);
      };
      img.src = croppedImage;
      return;
    }

    // Text mode - draw background
    if (!debouncedTextConfig.backgroundTransparent) {
      if (
        debouncedTextConfig.gradient.enabled &&
        debouncedTextConfig.gradient.direction !== "horizontal"
      ) {
        // Background gradient
        const bgGradient = ctx.createLinearGradient(
          0,
          0,
          debouncedTextConfig.gradient.direction === "diagonal" ? size : 0,
          size
        );
        bgGradient.addColorStop(0, debouncedTextConfig.gradient.startColor);
        bgGradient.addColorStop(1, debouncedTextConfig.gradient.endColor);
        ctx.fillStyle = bgGradient;
      } else {
        ctx.fillStyle = debouncedTextConfig.backgroundColor;
      }
      ctx.fillRect(0, 0, size, size);
    }

    if (!debouncedTextConfig.text) return;

    // Save context state
    ctx.save();

    // Move to center and apply rotation
    ctx.translate(size / 2, size / 2);
    ctx.rotate((debouncedTextConfig.rotation * Math.PI) / 180);

    // Calculate font size to fit text
    const lines = debouncedTextConfig.text.split("\n");
    const lineCount = lines.length;

    // Auto-fit font size
    let fontSize = debouncedTextConfig.fontSize;
    ctx.font = `bold ${fontSize}px "${debouncedTextConfig.fontFamily}"`;

    // Measure and adjust
    const maxWidth = size * 0.85;
    const maxHeight = size * 0.85;

    let textWidth = 0;
    for (const line of lines) {
      const metrics = ctx.measureText(line);
      textWidth = Math.max(textWidth, metrics.width);
    }

    const totalHeight = fontSize * lineCount * 1.2;

    // Scale down if needed
    const scaleX = textWidth > maxWidth ? maxWidth / textWidth : 1;
    const scaleY = totalHeight > maxHeight ? maxHeight / totalHeight : 1;
    const scale = Math.min(scaleX, scaleY);

    if (scale < 1) {
      fontSize *= scale;
      ctx.font = `bold ${fontSize}px "${debouncedTextConfig.fontFamily}"`;
    }

    // Set text styles
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Draw each line
    const lineHeight = fontSize * 1.2;
    const startY = -((lineCount - 1) * lineHeight) / 2;

    lines.forEach((line, index) => {
      const y = startY + index * lineHeight;

      // Shadow
      if (debouncedTextConfig.shadow.enabled) {
        ctx.shadowColor = debouncedTextConfig.shadow.color;
        ctx.shadowBlur = debouncedTextConfig.shadow.blur;
        ctx.shadowOffsetX = debouncedTextConfig.shadow.offsetX;
        ctx.shadowOffsetY = debouncedTextConfig.shadow.offsetY;
      }

      // Stroke (outline)
      if (debouncedTextConfig.stroke.enabled) {
        ctx.strokeStyle = debouncedTextConfig.stroke.color;
        ctx.lineWidth = debouncedTextConfig.stroke.width * 2;
        ctx.lineJoin = "round";
        ctx.strokeText(line, 0, y);
      }

      // Fill with gradient or solid color
      if (debouncedTextConfig.gradient.enabled) {
        const gradient = ctx.createLinearGradient(
          debouncedTextConfig.gradient.direction === "vertical" ? 0 : -size / 2,
          debouncedTextConfig.gradient.direction === "horizontal" ? 0 : -size / 2,
          debouncedTextConfig.gradient.direction === "vertical" ? 0 : size / 2,
          debouncedTextConfig.gradient.direction === "horizontal" ? 0 : size / 2
        );
        gradient.addColorStop(0, debouncedTextConfig.gradient.startColor);
        gradient.addColorStop(1, debouncedTextConfig.gradient.endColor);
        ctx.fillStyle = gradient;
      } else {
        ctx.fillStyle = debouncedTextConfig.color;
      }

      // Reset shadow for fill
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      ctx.fillText(line, 0, y);
    });

    ctx.restore();
  };

  // アニメーションフレームの描画
  useEffect(() => {
    if (!animationConfig || animationConfig.type === "none") {
      // アニメーションなしの場合は静止画のみ表示
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      const canvas = ref.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      drawStaticFrame(ctx, OUTPUT_SIZE);
      return;
    }

    // アニメーションがある場合
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 基本となるキャンバスを作成
    const baseCanvas = document.createElement("canvas");
    baseCanvas.width = OUTPUT_SIZE;
    baseCanvas.height = OUTPUT_SIZE;
    const baseCtx = baseCanvas.getContext("2d")!;

    // 白背景で塗りつぶし
    baseCtx.fillStyle = "#ffffff";
    baseCtx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

    // 基本フレームを描画
    drawStaticFrame(baseCtx, OUTPUT_SIZE);

    const frameDelay = GIF_CONFIG.getFrameDelay(animationConfig.speed);
    const totalFrames = GIF_CONFIG.FRAME_COUNT;

    const animate = (timestamp: number) => {
      if (!lastFrameTimeRef.current) {
        lastFrameTimeRef.current = timestamp;
      }

      const elapsed = timestamp - lastFrameTimeRef.current;

      if (elapsed >= frameDelay) {
        // フレームを更新
        frameIndexRef.current = (frameIndexRef.current + 1) % totalFrames;
        lastFrameTimeRef.current = timestamp;

        // 変換を計算
        const transform = calculateFrameTransform(
          animationConfig.type,
          frameIndexRef.current,
          totalFrames
        );

        // キャンバスをクリアして白背景を追加
        ctx.clearRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

        // 変換を適用して描画
        ctx.save();
        ctx.translate(OUTPUT_SIZE / 2, OUTPUT_SIZE / 2);
        ctx.rotate((transform.rotation * Math.PI) / 180);
        ctx.scale(transform.scale, transform.scale);
        ctx.globalAlpha = transform.opacity;

        // 色相回転
        if (animationConfig.type === "rainbow") {
          ctx.filter = `hue-rotate(${transform.hueRotate}deg)`;
        }

        ctx.drawImage(
          baseCanvas,
          -OUTPUT_SIZE / 2 + transform.offsetX,
          -OUTPUT_SIZE / 2 + transform.offsetY,
          OUTPUT_SIZE,
          OUTPUT_SIZE
        );

        ctx.restore();
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [mode, debouncedTextConfig, croppedImage, animationConfig]);

  const isEmpty =
    (mode === "text" && !textConfig.text) ||
    (mode === "image" && !croppedImage);

  return (
    <div className="relative">
      {/* Decorative corner accents */}
      <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-primary/60" />
      <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-primary/60" />
      <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-primary/60" />
      <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-primary/60" />

      {/* Canvas container with transparency grid */}
      <div className="transparency-grid rounded-lg p-0 overflow-hidden relative w-[200px] h-[200px] sm:w-[256px] sm:h-[256px]">
        <canvas
          ref={ref}
          width={OUTPUT_SIZE}
          height={OUTPUT_SIZE}
          className="block w-full h-full"
        />

        {/* Empty state overlay */}
        {isEmpty && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center mb-3">
              {mode === "text" ? (
                <Type className="w-8 h-8 text-muted-foreground/50" />
              ) : (
                <ImageIcon className="w-8 h-8 text-muted-foreground/50" />
              )}
            </div>
            <p className="text-sm text-muted-foreground/70 text-center px-4">
              {mode === "text"
                ? "テキストを入力してください"
                : "画像を選択してください"}
            </p>
          </div>
        )}
      </div>

      {/* Size indicator */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-muted-foreground/60">
        {OUTPUT_SIZE}×{OUTPUT_SIZE}px
      </div>
    </div>
  );
}
