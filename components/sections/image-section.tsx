"use client";

import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/image-uploader";
import { ImageCropper } from "@/components/image-cropper";

interface ImageSectionProps {
  uploadedImage: string | null;
  croppedImage: string | null;
  onImageSelect: (imageData: string) => void;
  onCropComplete: (croppedData: string) => void;
  onImageClear: () => void;
  onCropReset: () => void;
}

export function ImageSection({
  uploadedImage,
  croppedImage,
  onImageSelect,
  onCropComplete,
  onImageClear,
  onCropReset,
}: ImageSectionProps) {
  return (
    <div className="panel rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 bg-primary rounded-full" />
        <h2 className="font-semibold">画像選択</h2>
      </div>

      {!uploadedImage ? (
        <ImageUploader
          onImageSelect={onImageSelect}
          currentImage={null}
          onClear={onImageClear}
        />
      ) : !croppedImage ? (
        <ImageCropper
          imageSrc={uploadedImage}
          onCropComplete={onCropComplete}
          onCancel={onImageClear}
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
              onClick={onCropReset}
              className="flex-1"
            >
              トリミングし直す
            </Button>
            <Button
              variant="outline"
              onClick={onImageClear}
              className="flex-1"
            >
              別の画像を選択
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
