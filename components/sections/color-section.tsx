"use client";

import { ColorPicker } from "@/components/color-picker";
import { TextStampConfig } from "@/types";

interface ColorSectionProps {
  textConfig: TextStampConfig;
  onUpdateTextConfig: <K extends keyof TextStampConfig>(
    key: K,
    value: TextStampConfig[K]
  ) => void;
}

export function ColorSection({
  textConfig,
  onUpdateTextConfig,
}: ColorSectionProps) {
  return (
    <div className="panel rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 bg-neon-pink rounded-full" />
        <h2 className="font-semibold">カラー設定</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ColorPicker
          label="文字色"
          color={textConfig.color}
          onChange={(c) => onUpdateTextConfig("color", c)}
        />
        <ColorPicker
          label="背景色"
          color={textConfig.backgroundColor}
          onChange={(c) => onUpdateTextConfig("backgroundColor", c)}
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={() =>
            onUpdateTextConfig(
              "backgroundTransparent",
              !textConfig.backgroundTransparent
            )
          }
          className={`relative w-11 h-6 rounded-full transition-colors ${
            textConfig.backgroundTransparent ? "bg-primary" : "bg-secondary"
          }`}
        >
          <div
            className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
              textConfig.backgroundTransparent
                ? "translate-x-6"
                : "translate-x-1"
            }`}
          />
        </button>
        <span className="text-sm">背景を透明にする</span>
      </div>
    </div>
  );
}
