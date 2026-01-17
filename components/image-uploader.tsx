"use client";

import { useCallback, useState } from "react";
import { Upload, X, AlertCircle } from "lucide-react";
import { SUPPORTED_IMAGE_FORMATS, MAX_FILE_SIZE } from "@/constants";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ImageUploaderProps {
  onImageSelect: (imageData: string) => void;
  currentImage: string | null;
  onClear: () => void;
}

export function ImageUploader({
  onImageSelect,
  currentImage,
  onClear,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback((file: File): string | null => {
    if (!SUPPORTED_IMAGE_FORMATS.includes(file.type)) {
      return "対応していない形式です。PNG, JPG, GIF, WebPを使用してください。";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "ファイルサイズが大きすぎます。5MB以下にしてください。";
    }
    return null;
  }, []);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        toast.error("画像を読み込めませんでした", {
          description: validationError,
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onImageSelect(result);
        toast.success("画像を読み込みました");
      };
      reader.onerror = () => {
        setError("ファイルの読み込みに失敗しました");
        toast.error("ファイルの読み込みに失敗しました");
      };
      reader.readAsDataURL(file);
    },
    [validateFile, onImageSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  if (currentImage) {
    return (
      <div className="space-y-4">
        <div className="relative aspect-square w-full max-w-[300px] mx-auto rounded-xl overflow-hidden border border-border/50">
          <img
            src={currentImage}
            alt="アップロード画像"
            className="w-full h-full object-contain bg-secondary/30"
          />
          <button
            onClick={onClear}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-destructive/90 hover:bg-destructive
                     flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
        <p className="text-xs text-center text-muted-foreground">
          下のトリミングエリアで切り抜き範囲を調整してください
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer",
          isDragging
            ? "border-primary bg-primary/10"
            : "border-border/50 hover:border-primary/50 hover:bg-secondary/30"
        )}
      >
        <input
          type="file"
          accept={SUPPORTED_IMAGE_FORMATS.join(",")}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="flex flex-col items-center gap-4">
          <div
            className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center transition-colors",
              isDragging ? "bg-primary/20" : "bg-secondary/50"
            )}
          >
            <Upload
              className={cn(
                "w-8 h-8 transition-colors",
                isDragging ? "text-primary" : "text-muted-foreground"
              )}
            />
          </div>

          <div>
            <p className="font-semibold mb-1">
              {isDragging ? "ここにドロップ" : "画像をアップロード"}
            </p>
            <p className="text-sm text-muted-foreground">
              ドラッグ&ドロップ または クリックして選択
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
            <span className="px-2 py-1 rounded bg-secondary/50">PNG</span>
            <span className="px-2 py-1 rounded bg-secondary/50">JPG</span>
            <span className="px-2 py-1 rounded bg-secondary/50">GIF</span>
            <span className="px-2 py-1 rounded bg-secondary/50">WebP</span>
          </div>

          <p className="text-xs text-muted-foreground">最大 5MB</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
