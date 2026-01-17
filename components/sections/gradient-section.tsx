"use client";

import { Label } from "@/components/ui/label";
import { ColorPicker } from "@/components/color-picker";
import { TextStampConfig } from "@/types";

interface GradientSectionProps {
  textConfig: TextStampConfig;
  onUpdateGradient: <K extends keyof TextStampConfig["gradient"]>(
    key: K,
    value: TextStampConfig["gradient"][K]
  ) => void;
}

export function GradientSection({
  textConfig,
  onUpdateGradient,
}: GradientSectionProps) {
  return (
    <div className="panel rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 bg-neon-cyan rounded-full" />
          <h2 className="font-semibold">グラデーション</h2>
        </div>
        <button
          onClick={() =>
            onUpdateGradient("enabled", !textConfig.gradient.enabled)
          }
          className={`relative w-11 h-6 rounded-full transition-colors ${
            textConfig.gradient.enabled ? "bg-primary" : "bg-secondary"
          }`}
        >
          <div
            className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
              textConfig.gradient.enabled ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {textConfig.gradient.enabled && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-4">
            <ColorPicker
              label="開始色"
              color={textConfig.gradient.startColor}
              onChange={(c) => onUpdateGradient("startColor", c)}
            />
            <ColorPicker
              label="終了色"
              color={textConfig.gradient.endColor}
              onChange={(c) => onUpdateGradient("endColor", c)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">
              方向
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {(["horizontal", "vertical", "diagonal"] as const).map((dir) => (
                <button
                  key={dir}
                  onClick={() => onUpdateGradient("direction", dir)}
                  className={`h-9 rounded-lg text-sm font-medium transition-all ${
                    textConfig.gradient.direction === dir
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/50 hover:bg-secondary"
                  }`}
                >
                  {dir === "horizontal"
                    ? "横"
                    : dir === "vertical"
                      ? "縦"
                      : "斜め"}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
