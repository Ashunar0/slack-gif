"use client";

import { useState, useRef, useCallback } from "react";
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";
import { Check, RotateCcw } from "lucide-react";
import { OUTPUT_SIZE } from "@/constants";

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedImageData: string) => void;
  onCancel: () => void;
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
): Crop {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export function ImageCropper({
  imageSrc,
  onCropComplete,
  onCancel,
}: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 1));
  }, []);

  const handleCropComplete = useCallback(() => {
    if (!completedCrop || !imgRef.current) return;

    const image = imgRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas to output size
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;

    // Calculate scale
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Draw cropped image to canvas
    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      OUTPUT_SIZE,
      OUTPUT_SIZE
    );

    // Get data URL
    const croppedImageData = canvas.toDataURL("image/png");
    onCropComplete(croppedImageData);
  }, [completedCrop, onCropComplete]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">トリミング</span>
        <span className="text-xs text-muted-foreground">1:1 正方形</span>
      </div>

      <div className="relative rounded-xl overflow-hidden bg-secondary/30 border border-border/50">
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          onComplete={(c) => setCompletedCrop(c)}
          aspect={1}
          circularCrop={false}
          className="max-h-[400px] mx-auto"
        >
          <img
            ref={imgRef}
            src={imageSrc}
            alt="トリミング対象"
            onLoad={onImageLoad}
            className="max-h-[400px] w-auto mx-auto"
          />
        </ReactCrop>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          やり直す
        </Button>
        <Button
          onClick={handleCropComplete}
          className="flex-1 bg-primary hover:bg-primary/90"
          disabled={!completedCrop}
        >
          <Check className="w-4 h-4 mr-2" />
          確定
        </Button>
      </div>

      <p className="text-xs text-center text-muted-foreground">
        ドラッグして切り抜き範囲を調整できます
      </p>
    </div>
  );
}
