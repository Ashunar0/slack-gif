"use client";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ColorPicker } from "@/components/color-picker";
import { TextStampConfig } from "@/types";

interface EffectSectionProps {
  textConfig: TextStampConfig;
  onUpdateTextConfig: <K extends keyof TextStampConfig>(
    key: K,
    value: TextStampConfig[K]
  ) => void;
  onUpdateShadow: <K extends keyof TextStampConfig["shadow"]>(
    key: K,
    value: TextStampConfig["shadow"][K]
  ) => void;
  onUpdateStroke: <K extends keyof TextStampConfig["stroke"]>(
    key: K,
    value: TextStampConfig["stroke"][K]
  ) => void;
}

export function EffectSection({
  textConfig,
  onUpdateTextConfig,
  onUpdateShadow,
  onUpdateStroke,
}: EffectSectionProps) {
  return (
    <div className="panel rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 bg-neon-yellow rounded-full" />
        <h2 className="font-semibold">エフェクト</h2>
      </div>

      {/* Shadow */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm">シャドウ</span>
          <button
            onClick={() => onUpdateShadow("enabled", !textConfig.shadow.enabled)}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              textConfig.shadow.enabled ? "bg-primary" : "bg-secondary"
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                textConfig.shadow.enabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
        {textConfig.shadow.enabled && (
          <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <ColorPicker
              label="色"
              color={textConfig.shadow.color}
              onChange={(c) => onUpdateShadow("color", c)}
            />
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                ぼかし
              </Label>
              <Slider
                value={[textConfig.shadow.blur]}
                onValueChange={([v]) => onUpdateShadow("blur", v)}
                min={0}
                max={20}
                step={1}
              />
            </div>
          </div>
        )}
      </div>

      {/* Stroke */}
      <div className="space-y-3 pt-2 border-t border-border/30">
        <div className="flex items-center justify-between">
          <span className="text-sm">縁取り</span>
          <button
            onClick={() => onUpdateStroke("enabled", !textConfig.stroke.enabled)}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              textConfig.stroke.enabled ? "bg-primary" : "bg-secondary"
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                textConfig.stroke.enabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
        {textConfig.stroke.enabled && (
          <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <ColorPicker
              label="色"
              color={textConfig.stroke.color}
              onChange={(c) => onUpdateStroke("color", c)}
            />
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                太さ
              </Label>
              <Slider
                value={[textConfig.stroke.width]}
                onValueChange={([v]) => onUpdateStroke("width", v)}
                min={1}
                max={10}
                step={1}
              />
            </div>
          </div>
        )}
      </div>

      {/* Rotation */}
      <div className="space-y-3 pt-2 border-t border-border/30">
        <div className="flex items-center justify-between">
          <span className="text-sm">回転</span>
          <span className="text-xs font-mono text-muted-foreground">
            {textConfig.rotation}°
          </span>
        </div>
        <Slider
          value={[textConfig.rotation]}
          onValueChange={([v]) => onUpdateTextConfig("rotation", v)}
          min={-180}
          max={180}
          step={1}
        />
      </div>
    </div>
  );
}
