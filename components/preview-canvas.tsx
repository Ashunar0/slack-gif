"use client";

import { useRef, useEffect, useCallback } from "react";
import { TextStampConfig } from "@/types";
import { OUTPUT_SIZE } from "@/constants";

interface PreviewCanvasProps {
  textConfig: TextStampConfig;
  canvasRef?: React.RefObject<HTMLCanvasElement | null>;
}

export function PreviewCanvas({ textConfig, canvasRef }: PreviewCanvasProps) {
  const internalRef = useRef<HTMLCanvasElement>(null);
  const ref = canvasRef || internalRef;

  const drawText = useCallback(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = OUTPUT_SIZE;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Draw background
    if (!textConfig.backgroundTransparent) {
      if (textConfig.gradient.enabled && textConfig.gradient.direction !== "horizontal") {
        // Background gradient
        const bgGradient = ctx.createLinearGradient(
          0, 0,
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

    if (!textConfig.text) return;

    // Save context state
    ctx.save();

    // Move to center and apply rotation
    ctx.translate(size / 2, size / 2);
    ctx.rotate((textConfig.rotation * Math.PI) / 180);

    // Calculate font size to fit text
    const lines = textConfig.text.split("\n");
    const maxLineLength = Math.max(...lines.map((line) => line.length));
    const lineCount = lines.length;

    // Auto-fit font size
    let fontSize = textConfig.fontSize;
    ctx.font = `bold ${fontSize}px "${textConfig.fontFamily}"`;

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
      ctx.font = `bold ${fontSize}px "${textConfig.fontFamily}"`;
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
      if (textConfig.shadow.enabled) {
        ctx.shadowColor = textConfig.shadow.color;
        ctx.shadowBlur = textConfig.shadow.blur;
        ctx.shadowOffsetX = textConfig.shadow.offsetX;
        ctx.shadowOffsetY = textConfig.shadow.offsetY;
      }

      // Stroke (outline)
      if (textConfig.stroke.enabled) {
        ctx.strokeStyle = textConfig.stroke.color;
        ctx.lineWidth = textConfig.stroke.width * 2;
        ctx.lineJoin = "round";
        ctx.strokeText(line, 0, y);
      }

      // Fill with gradient or solid color
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

      // Reset shadow for fill
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      ctx.fillText(line, 0, y);
    });

    ctx.restore();
  }, [textConfig, ref]);

  useEffect(() => {
    drawText();
  }, [drawText]);

  return (
    <div className="relative">
      {/* Decorative corner accents */}
      <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-primary/60" />
      <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-primary/60" />
      <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-primary/60" />
      <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-primary/60" />

      {/* Canvas container with transparency grid */}
      <div className="transparency-grid rounded-lg p-0 overflow-hidden">
        <canvas
          ref={ref}
          width={OUTPUT_SIZE}
          height={OUTPUT_SIZE}
          className="block"
          style={{ width: OUTPUT_SIZE * 2, height: OUTPUT_SIZE * 2 }}
        />
      </div>

      {/* Size indicator */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-muted-foreground/60">
        {OUTPUT_SIZE}×{OUTPUT_SIZE}px
      </div>
    </div>
  );
}
