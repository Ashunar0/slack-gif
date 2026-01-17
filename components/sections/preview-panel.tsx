"use client";

import { RefObject } from "react";
import { Button } from "@/components/ui/button";
import { PreviewCanvas } from "@/components/preview-canvas";
import { TextStampConfig, AnimationConfig, StampMode } from "@/types";
import { OUTPUT_SIZE } from "@/constants";
import { Download, Loader2 } from "lucide-react";

interface PreviewPanelProps {
  mode: StampMode;
  textConfig: TextStampConfig;
  croppedImage: string | null;
  animationConfig: AnimationConfig;
  isGenerating: boolean;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  onDownload: () => void;
}

export function PreviewPanel({
  mode,
  textConfig,
  croppedImage,
  animationConfig,
  isGenerating,
  canvasRef,
  onDownload,
}: PreviewPanelProps) {
  const isDownloadDisabled =
    isGenerating ||
    (mode === "text" && !textConfig.text) ||
    (mode === "image" && !croppedImage);

  return (
    <>
      <div className="order-1 lg:order-2 w-full lg:w-[400px] shrink-0 lg:sticky lg:top-24 lg:self-start">
        <div className="panel rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">プレビュー</h2>
            <span className="text-xs px-2 py-1 rounded-full bg-secondary text-muted-foreground font-mono">
              {OUTPUT_SIZE}px
            </span>
          </div>

          {/* Preview Canvas */}
          <div className="flex justify-center py-4 sm:py-8">
            <PreviewCanvas
              mode={mode}
              textConfig={textConfig}
              croppedImage={croppedImage}
              canvasRef={canvasRef}
            />
          </div>

          {/* Download Button - Desktop */}
          <Button
            onClick={onDownload}
            className="hidden sm:flex w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-neon-pink
                     hover:opacity-90 transition-opacity glow-neon-subtle"
            disabled={isDownloadDisabled}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                GIF生成中...
              </>
            ) : (
              <>
                <Download className="w-5 h-5 mr-2" />
                {animationConfig.type !== "none"
                  ? "GIFをダウンロード"
                  : "PNGをダウンロード"}
              </>
            )}
          </Button>

          {/* Quick Tips - Desktop only */}
          <div className="hidden sm:block pt-4 border-t border-border/30">
            <p className="text-xs text-muted-foreground">
              Slackでは 128×128px のカスタム絵文字が推奨されています。
              作成したスタンプは Slack の設定からアップロードできます。
            </p>
          </div>
        </div>
      </div>

      {/* Fixed Download Button - Mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border/30 sm:hidden z-50">
        <Button
          onClick={onDownload}
          className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-neon-pink
                   hover:opacity-90 transition-opacity glow-neon-subtle"
          disabled={isDownloadDisabled}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              GIF生成中...
            </>
          ) : (
            <>
              <Download className="w-5 h-5 mr-2" />
              {animationConfig.type !== "none"
                ? "GIFをダウンロード"
                : "PNGをダウンロード"}
            </>
          )}
        </Button>
      </div>
    </>
  );
}
