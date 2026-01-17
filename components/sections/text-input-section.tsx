"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TextStampConfig } from "@/types";
import { FONTS, FONT_CATEGORIES } from "@/constants";

interface TextInputSectionProps {
  textConfig: TextStampConfig;
  onUpdateTextConfig: <K extends keyof TextStampConfig>(
    key: K,
    value: TextStampConfig[K]
  ) => void;
}

export function TextInputSection({
  textConfig,
  onUpdateTextConfig,
}: TextInputSectionProps) {
  // Group fonts by category
  const fontsByCategory = FONTS.reduce(
    (acc, font) => {
      if (!acc[font.category]) acc[font.category] = [];
      acc[font.category].push(font);
      return acc;
    },
    {} as Record<string, typeof FONTS>
  );

  return (
    <div className="panel rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 bg-primary rounded-full" />
        <h2 className="font-semibold">テキスト入力</h2>
      </div>

      <div className="space-y-3">
        <Label
          htmlFor="text"
          className="text-xs text-muted-foreground uppercase tracking-wider"
        >
          表示テキスト
        </Label>
        <Input
          id="text"
          value={textConfig.text}
          onChange={(e) => onUpdateTextConfig("text", e.target.value)}
          placeholder="スタンプのテキストを入力..."
          className="h-12 text-lg bg-secondary/30 border-border/50 focus:border-primary/50"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <Label className="text-xs text-muted-foreground uppercase tracking-wider">
            フォント
          </Label>
          <Select
            value={textConfig.fontFamily}
            onValueChange={(v) => onUpdateTextConfig("fontFamily", v)}
          >
            <SelectTrigger className="bg-secondary/30 border-border/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {Object.entries(fontsByCategory).map(([category, fonts]) => (
                <div key={category}>
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                    {FONT_CATEGORIES[category as keyof typeof FONT_CATEGORIES]}
                  </div>
                  {fonts.map((font) => (
                    <SelectItem
                      key={font.family}
                      value={font.family}
                      style={{ fontFamily: font.family }}
                    >
                      {font.name}
                    </SelectItem>
                  ))}
                </div>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="text-xs text-muted-foreground uppercase tracking-wider">
            フォントサイズ
          </Label>
          <div className="flex items-center gap-3">
            <Slider
              value={[textConfig.fontSize]}
              onValueChange={([v]) => onUpdateTextConfig("fontSize", v)}
              min={12}
              max={96}
              step={1}
              className="flex-1"
            />
            <span className="text-sm font-mono text-muted-foreground w-8">
              {textConfig.fontSize}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
