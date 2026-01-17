"use client";

import { Button } from "@/components/ui/button";
import { Sparkles, RotateCcw } from "lucide-react";

interface HeaderSectionProps {
  onReset: () => void;
}

export function HeaderSection({ onReset }: HeaderSectionProps) {
  return (
    <header className="border-b border-border/40 bg-card/30 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-neon-pink flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="absolute inset-0 rounded-xl glow-neon-subtle animate-pulse-glow" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                Stamp Studio
              </h1>
              <p className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase">
                Slack Emoji Creator
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              リセット
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
