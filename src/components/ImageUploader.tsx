"use client";

import { useState, useRef } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";

interface ImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

interface UploadingImage {
  id: string;
  preview: string;
  uploading: boolean;
  error?: string;
}

export default function ImageUploader({
  images,
  onImagesChange,
  maxImages = 10,
  disabled = false,
}: ImageUploaderProps) {
  const [uploadingImages, setUploadingImages] = useState<UploadingImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check if adding these would exceed max
    if (images.length + uploadingImages.length + files.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    // Process each file
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        continue;
      }

      const id = Math.random().toString(36).substring(7);
      const preview = URL.createObjectURL(file);

      // Add to uploading state
      setUploadingImages((prev) => [
        ...prev,
        { id, preview, uploading: true },
      ]);

      try {
        // Convert to base64
        const base64 = await fileToBase64(file);

        // Upload
        const response = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64 }),
        });

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const { data } = await response.json();

        // Add to images
        onImagesChange([...images, data.url]);

        // Remove from uploading state
        setUploadingImages((prev) => prev.filter((img) => img.id !== id));
        URL.revokeObjectURL(preview);
      } catch (error) {
        console.error("Upload error:", error);
        setUploadingImages((prev) => {
          return prev.map((img) =>
            img.id === id ? { ...img, uploading: false, error: "Failed" } : img
          );
        });
      }
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onImagesChange(newImages);
  };

  const removeUploadingImage = (id: string) => {
    setUploadingImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) {
        URL.revokeObjectURL(img.preview);
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  const canAddMore = images.length + uploadingImages.length < maxImages;

  return (
    <div className="space-y-4">
      {/* Image Grid */}
      {(images.length > 0 || uploadingImages.length > 0) && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {/* Uploaded Images */}
          {images.map((url, index) => (
            <div
              key={`uploaded-${index}`}
              className="relative aspect-square group rounded-lg overflow-hidden border border-gray-200"
            >
              <img
                src={url}
                alt={`Product ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  title="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              {index === 0 && (
                <span className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                  Cover
                </span>
              )}
            </div>
          ))}

          {/* Uploading Images */}
          {uploadingImages.map((img) => (
            <div
              key={img.id}
              className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50"
            >
              <img
                src={img.preview}
                alt="Uploading..."
                className="w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {img.error ? (
                  <>
                    <span className="text-red-500 text-sm mb-2">{img.error}</span>
                    <button
                      type="button"
                      onClick={() => removeUploadingImage(img.id)}
                      className="p-1.5 bg-red-500 text-white rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                )}
              </div>
              {!img.error && (
                <button
                  type="button"
                  onClick={() => removeUploadingImage(img.id)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 hover:opacity-100 transition-opacity"
                  title="Cancel upload"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {canAddMore && !disabled && (
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors"
          >
            <Upload className="h-5 w-5" />
            <span>Add Images</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
          <span className="text-sm text-gray-500">
            {images.length + uploadingImages.length}/{maxImages} images
          </span>
        </div>
      )}

      {/* No Images Placeholder */}
      {images.length === 0 && uploadingImages.length === 0 && (
        <div
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={`border-2 border-dashed border-gray-300 rounded-lg p-8 text-center ${
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-blue-500"
          }`}
        >
          <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-2">Click to upload images</p>
          <p className="text-sm text-gray-500">PNG, JPG, GIF up to 5MB</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileSelect}
            disabled={disabled}
          />
        </div>
      )}
    </div>
  );
}
