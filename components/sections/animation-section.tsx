"use client";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { AnimationConfig } from "@/types";
import { ANIMATION_PRESETS } from "@/constants";
import { Zap } from "lucide-react";

interface AnimationSectionProps {
  animationConfig: AnimationConfig;
  onSetAnimationConfig: React.Dispatch<React.SetStateAction<AnimationConfig>>;
}

export function AnimationSection({
  animationConfig,
  onSetAnimationConfig,
}: AnimationSectionProps) {
  return (
    <div className="panel rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-4 h-4 text-neon-yellow" />
        <h2 className="font-semibold">アニメーション</h2>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {ANIMATION_PRESETS.map((preset) => (
          <button
            key={preset.type}
            onClick={() =>
              onSetAnimationConfig((prev) => ({
                ...prev,
                type: preset.type,
                enabled: preset.type !== "none",
              }))
            }
            className={`h-16 rounded-lg text-xs font-medium transition-all flex flex-col items-center justify-center gap-1 ${
              animationConfig.type === preset.type
                ? "bg-primary text-primary-foreground ring-2 ring-primary/50"
                : "bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>{preset.name}</span>
          </button>
        ))}
      </div>

      {animationConfig.type !== "none" && (
        <div className="space-y-2 pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">
              速度
            </Label>
            <span className="text-xs font-mono text-muted-foreground">
              {animationConfig.speed}
            </span>
          </div>
          <Slider
            value={[animationConfig.speed]}
            onValueChange={([v]) =>
              onSetAnimationConfig((prev) => ({ ...prev, speed: v }))
            }
            min={1}
            max={10}
            step={1}
          />
        </div>
      )}
    </div>
  );
}
