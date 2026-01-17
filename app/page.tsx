"use client";

import { useState, useRef, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
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
import { ColorPicker } from "@/components/color-picker";
import { PreviewCanvas } from "@/components/preview-canvas";
import { ImageUploader } from "@/components/image-uploader";
import { ImageCropper } from "@/components/image-cropper";
import {
  TextStampConfig,
  AnimationConfig,
  StampMode,
  defaultTextConfig,
  defaultAnimationConfig,
} from "@/types";
import { FONTS, FONT_CATEGORIES, ANIMATION_PRESETS, OUTPUT_SIZE } from "@/constants";
import { Download, Type, ImageIcon, Sparkles, RotateCcw, Zap } from "lucide-react";

export default function Home() {
  const [mode, setMode] = useState<StampMode>("text");
  const [textConfig, setTextConfig] = useState<TextStampConfig>(defaultTextConfig);
  const [animationConfig, setAnimationConfig] = useState<AnimationConfig>(defaultAnimationConfig);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const updateTextConfig = useCallback(
    <K extends keyof TextStampConfig>(key: K, value: TextStampConfig[K]) => {
      setTextConfig((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const updateGradient = useCallback(
    <K extends keyof TextStampConfig["gradient"]>(
      key: K,
      value: TextStampConfig["gradient"][K]
    ) => {
      setTextConfig((prev) => ({
        ...prev,
        gradient: { ...prev.gradient, [key]: value },
      }));
    },
    []
  );

  const updateShadow = useCallback(
    <K extends keyof TextStampConfig["shadow"]>(
      key: K,
      value: TextStampConfig["shadow"][K]
    ) => {
      setTextConfig((prev) => ({
        ...prev,
        shadow: { ...prev.shadow, [key]: value },
      }));
    },
    []
  );

  const updateStroke = useCallback(
    <K extends keyof TextStampConfig["stroke"]>(
      key: K,
      value: TextStampConfig["stroke"][K]
    ) => {
      setTextConfig((prev) => ({
        ...prev,
        stroke: { ...prev.stroke, [key]: value },
      }));
    },
    []
  );

  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `stamp-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, []);

  const handleReset = useCallback(() => {
    setTextConfig(defaultTextConfig);
    setAnimationConfig(defaultAnimationConfig);
    setUploadedImage(null);
    setCroppedImage(null);
  }, []);

  const handleImageSelect = useCallback((imageData: string) => {
    setUploadedImage(imageData);
    setCroppedImage(null);
  }, []);

  const handleCropComplete = useCallback((croppedData: string) => {
    setCroppedImage(croppedData);
  }, []);

  const handleImageClear = useCallback(() => {
    setUploadedImage(null);
    setCroppedImage(null);
  }, []);

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
    <div className="min-h-screen bg-background">
      {/* Header */}
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
                onClick={handleReset}
                className="text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                リセット
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Panel - Controls */}
          <div className="flex-1 space-y-6 order-2 lg:order-1 min-w-0">
            {/* Mode Tabs */}
            <Tabs value={mode} onValueChange={(v) => setMode(v as StampMode)}>
              <TabsList className="grid w-full grid-cols-2 h-12 p-1 bg-secondary/50">
                <TabsTrigger
                  value="text"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-10 gap-2"
                >
                  <Type className="w-4 h-4" />
                  テキスト
                </TabsTrigger>
                <TabsTrigger
                  value="image"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-10 gap-2"
                >
                  <ImageIcon className="w-4 h-4" />
                  画像
                </TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="mt-6 space-y-6">
                {/* Text Input */}
                <div className="panel rounded-xl p-5 space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-5 bg-primary rounded-full" />
                    <h2 className="font-semibold">テキスト入力</h2>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="text" className="text-xs text-muted-foreground uppercase tracking-wider">
                      表示テキスト
                    </Label>
                    <Input
                      id="text"
                      value={textConfig.text}
                      onChange={(e) => updateTextConfig("text", e.target.value)}
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
                        onValueChange={(v) => updateTextConfig("fontFamily", v)}
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
                          onValueChange={([v]) => updateTextConfig("fontSize", v)}
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

                {/* Colors */}
                <div className="panel rounded-xl p-5 space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-5 bg-neon-pink rounded-full" />
                    <h2 className="font-semibold">カラー設定</h2>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <ColorPicker
                      label="文字色"
                      color={textConfig.color}
                      onChange={(c) => updateTextConfig("color", c)}
                    />
                    <ColorPicker
                      label="背景色"
                      color={textConfig.backgroundColor}
                      onChange={(c) => updateTextConfig("backgroundColor", c)}
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() =>
                        updateTextConfig(
                          "backgroundTransparent",
                          !textConfig.backgroundTransparent
                        )
                      }
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        textConfig.backgroundTransparent
                          ? "bg-primary"
                          : "bg-secondary"
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

                {/* Gradient */}
                <div className="panel rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-5 bg-neon-cyan rounded-full" />
                      <h2 className="font-semibold">グラデーション</h2>
                    </div>
                    <button
                      onClick={() =>
                        updateGradient("enabled", !textConfig.gradient.enabled)
                      }
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        textConfig.gradient.enabled ? "bg-primary" : "bg-secondary"
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                          textConfig.gradient.enabled
                            ? "translate-x-6"
                            : "translate-x-1"
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
                          onChange={(c) => updateGradient("startColor", c)}
                        />
                        <ColorPicker
                          label="終了色"
                          color={textConfig.gradient.endColor}
                          onChange={(c) => updateGradient("endColor", c)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                          方向
                        </Label>
                        <div className="grid grid-cols-3 gap-2">
                          {(["horizontal", "vertical", "diagonal"] as const).map(
                            (dir) => (
                              <button
                                key={dir}
                                onClick={() => updateGradient("direction", dir)}
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
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Effects */}
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
                        onClick={() =>
                          updateShadow("enabled", !textConfig.shadow.enabled)
                        }
                        className={`relative w-11 h-6 rounded-full transition-colors ${
                          textConfig.shadow.enabled
                            ? "bg-primary"
                            : "bg-secondary"
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                            textConfig.shadow.enabled
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                    {textConfig.shadow.enabled && (
                      <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                        <ColorPicker
                          label="色"
                          color={textConfig.shadow.color}
                          onChange={(c) => updateShadow("color", c)}
                        />
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                            ぼかし
                          </Label>
                          <Slider
                            value={[textConfig.shadow.blur]}
                            onValueChange={([v]) => updateShadow("blur", v)}
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
                        onClick={() =>
                          updateStroke("enabled", !textConfig.stroke.enabled)
                        }
                        className={`relative w-11 h-6 rounded-full transition-colors ${
                          textConfig.stroke.enabled
                            ? "bg-primary"
                            : "bg-secondary"
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                            textConfig.stroke.enabled
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                    {textConfig.stroke.enabled && (
                      <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                        <ColorPicker
                          label="色"
                          color={textConfig.stroke.color}
                          onChange={(c) => updateStroke("color", c)}
                        />
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                            太さ
                          </Label>
                          <Slider
                            value={[textConfig.stroke.width]}
                            onValueChange={([v]) => updateStroke("width", v)}
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
                      onValueChange={([v]) => updateTextConfig("rotation", v)}
                      min={-180}
                      max={180}
                      step={1}
                    />
                  </div>
                </div>

                {/* Animation */}
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
                          setAnimationConfig((prev) => ({
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
                          setAnimationConfig((prev) => ({ ...prev, speed: v }))
                        }
                        min={1}
                        max={10}
                        step={1}
                      />
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="image" className="mt-6 space-y-6">
                {/* Upload or Crop */}
                <div className="panel rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-5 bg-primary rounded-full" />
                    <h2 className="font-semibold">画像選択</h2>
                  </div>

                  {!uploadedImage ? (
                    <ImageUploader
                      onImageSelect={handleImageSelect}
                      currentImage={null}
                      onClear={handleImageClear}
                    />
                  ) : !croppedImage ? (
                    <ImageCropper
                      imageSrc={uploadedImage}
                      onCropComplete={handleCropComplete}
                      onCancel={handleImageClear}
                    />
                  ) : (
                    <div className="space-y-4">
                      <div className="relative aspect-square w-full max-w-[200px] mx-auto rounded-xl overflow-hidden border border-border/50">
                        <img
                          src={croppedImage}
                          alt="トリミング済み"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setCroppedImage(null)}
                          className="flex-1"
                        >
                          トリミングし直す
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleImageClear}
                          className="flex-1"
                        >
                          別の画像を選択
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Animation for image mode */}
                {croppedImage && (
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
                            setAnimationConfig((prev) => ({
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
                            setAnimationConfig((prev) => ({ ...prev, speed: v }))
                          }
                          min={1}
                          max={10}
                          step={1}
                        />
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Panel - Preview */}
          <div className="order-1 lg:order-2 w-full lg:w-[400px] shrink-0 lg:sticky lg:top-24 lg:self-start">
            <div className="panel rounded-xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">プレビュー</h2>
                <span className="text-xs px-2 py-1 rounded-full bg-secondary text-muted-foreground font-mono">
                  {OUTPUT_SIZE}px
                </span>
              </div>

              {/* Preview Canvas */}
              <div className="flex justify-center py-8">
                <PreviewCanvas
                  mode={mode}
                  textConfig={textConfig}
                  croppedImage={croppedImage}
                  canvasRef={canvasRef}
                />
              </div>

              {/* Download Button */}
              <Button
                onClick={handleDownload}
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-neon-pink
                         hover:opacity-90 transition-opacity glow-neon-subtle"
                disabled={(mode === "text" && !textConfig.text) || (mode === "image" && !croppedImage)}
              >
                <Download className="w-5 h-5 mr-2" />
                {animationConfig.type !== "none" ? "GIFをダウンロード" : "PNGをダウンロード"}
              </Button>

              {/* Quick Tips */}
              <div className="pt-4 border-t border-border/30">
                <p className="text-xs text-muted-foreground">
                  Slackでは 128×128px のカスタム絵文字が推奨されています。
                  作成したスタンプは Slack の設定からアップロードできます。
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
