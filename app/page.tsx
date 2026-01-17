"use client";

import { useState, useRef, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TextStampConfig,
  AnimationConfig,
  StampMode,
  defaultTextConfig,
  defaultAnimationConfig,
} from "@/types";
import {
  generateAnimationFrames,
  encodeGIF,
  downloadGIF,
  downloadPNG,
  drawTextToCanvas,
  drawImageToCanvas,
} from "@/utils";
import { Type, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import {
  HeaderSection,
  TextInputSection,
  ColorSection,
  GradientSection,
  EffectSection,
  AnimationSection,
  ImageSection,
  PreviewPanel,
} from "@/components/sections";

export default function Home() {
  const [mode, setMode] = useState<StampMode>("text");
  const [textConfig, setTextConfig] = useState<TextStampConfig>(defaultTextConfig);
  const [animationConfig, setAnimationConfig] = useState<AnimationConfig>(defaultAnimationConfig);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
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

  const handleDownload = useCallback(async () => {
    setIsGenerating(true);
    try {
      // モードに応じてキャンバスを生成
      let sourceCanvas: HTMLCanvasElement;
      if (mode === "image" && croppedImage) {
        sourceCanvas = await drawImageToCanvas(croppedImage);
      } else {
        sourceCanvas = drawTextToCanvas(textConfig);
      }

      // 静止画（PNG）の場合
      if (animationConfig.type === "none") {
        downloadPNG(sourceCanvas);
        toast.success("PNGをダウンロードしました");
        return;
      }

      // GIFアニメーションの場合
      const frames = generateAnimationFrames(
        sourceCanvas,
        animationConfig.type,
        12
      );
      const blob = await encodeGIF(frames, animationConfig.speed);
      downloadGIF(blob);
      toast.success("GIFをダウンロードしました");
    } catch (error) {
      console.error("GIF generation failed:", error);
      toast.error("GIF生成に失敗しました", {
        description: "もう一度お試しください",
      });
    } finally {
      setIsGenerating(false);
    }
  }, [mode, textConfig, croppedImage, animationConfig.type, animationConfig.speed]);

  const handleReset = useCallback(() => {
    setTextConfig(defaultTextConfig);
    setAnimationConfig(defaultAnimationConfig);
    setUploadedImage(null);
    setCroppedImage(null);
    toast.info("設定をリセットしました");
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

  const handleCropReset = useCallback(() => {
    setCroppedImage(null);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <HeaderSection onReset={handleReset} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 sm:pb-8">
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
                <TextInputSection
                  textConfig={textConfig}
                  onUpdateTextConfig={updateTextConfig}
                />
                <ColorSection
                  textConfig={textConfig}
                  onUpdateTextConfig={updateTextConfig}
                />
                <GradientSection
                  textConfig={textConfig}
                  onUpdateGradient={updateGradient}
                />
                <EffectSection
                  textConfig={textConfig}
                  onUpdateTextConfig={updateTextConfig}
                  onUpdateShadow={updateShadow}
                  onUpdateStroke={updateStroke}
                />
                <AnimationSection
                  animationConfig={animationConfig}
                  onSetAnimationConfig={setAnimationConfig}
                />
              </TabsContent>

              <TabsContent value="image" className="mt-6 space-y-6">
                <ImageSection
                  uploadedImage={uploadedImage}
                  croppedImage={croppedImage}
                  onImageSelect={handleImageSelect}
                  onCropComplete={handleCropComplete}
                  onImageClear={handleImageClear}
                  onCropReset={handleCropReset}
                />
                {croppedImage && (
                  <AnimationSection
                    animationConfig={animationConfig}
                    onSetAnimationConfig={setAnimationConfig}
                  />
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Panel - Preview */}
          <PreviewPanel
            mode={mode}
            textConfig={textConfig}
            croppedImage={croppedImage}
            animationConfig={animationConfig}
            isGenerating={isGenerating}
            canvasRef={canvasRef}
            onDownload={handleDownload}
          />
        </div>
      </main>
    </div>
  );
}
