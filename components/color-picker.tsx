"use client";

import { HexColorPicker, HexColorInput } from "react-colorful";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PRESET_COLORS } from "@/constants";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
  className?: string;
}

export function ColorPicker({
  color,
  onChange,
  label,
  className,
}: ColorPickerProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <button
            className="group relative h-10 w-full rounded-lg border border-border/50
                       bg-secondary/50 p-1 transition-all hover:border-primary/50
                       focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <div
              className="h-full w-full rounded-md transition-transform group-hover:scale-[0.98]"
              style={{ backgroundColor: color }}
            />
            <div className="absolute inset-0 rounded-lg opacity-0 transition-opacity group-hover:opacity-100 glow-neon-subtle" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-4 panel border-border/30"
          align="start"
        >
          <div className="flex flex-col gap-4">
            <HexColorPicker
              color={color}
              onChange={onChange}
              className="!w-[200px]"
            />
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-mono">#</span>
              <HexColorInput
                color={color}
                onChange={onChange}
                className="flex-1 h-8 px-2 rounded-md bg-secondary/50 border border-border/50
                         text-sm font-mono uppercase focus:outline-none focus:ring-2
                         focus:ring-primary/30 focus:border-primary/50"
                prefixed={false}
              />
            </div>
            <div className="grid grid-cols-6 gap-1.5">
              {PRESET_COLORS.map((presetColor) => (
                <button
                  key={presetColor}
                  className={cn(
                    "h-6 w-6 rounded-md border transition-all hover:scale-110",
                    color === presetColor
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-border/30 hover:border-border"
                  )}
                  style={{ backgroundColor: presetColor }}
                  onClick={() => onChange(presetColor)}
                />
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
