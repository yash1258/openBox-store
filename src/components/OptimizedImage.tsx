"use client";

import { useState } from "react";
import { getOptimizedImageUrl } from "@/lib/upload";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  onError?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  width = 400,
  height = 400,
  className,
  containerClassName,
  priority = false,
  onError,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const optimizedSrc = getOptimizedImageUrl(src, {
    width,
    height,
    quality: "auto",
    format: "auto",
  });

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    onError?.();
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  if (hasError) {
    return (
      <div
        className={cn(
          "bg-gray-100 flex items-center justify-center",
          containerClassName
        )}
        style={{ width: width ?? 400, height: height ?? 400 }}
      >
        <svg
          className="w-12 h-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", containerClassName)} >
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <img
        src={optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "object-cover transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
      />
    </div>
  );
}

// Responsive image with srcset
interface ResponsiveImageProps {
  src: string;
  alt: string;
  aspectRatio?: "square" | "video" | "portrait";
  className?: string;
  containerClassName?: string;
  sizes?: string;
  priority?: boolean;
}

export function ResponsiveImage({
  src,
  alt,
  aspectRatio = "square",
  className,
  containerClassName,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  priority = false,
}: ResponsiveImageProps) {
  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
  };

  // Generate srcset for different widths
  const widths = [320, 640, 960, 1280];
  const srcSet = widths
    .map((w) => {
      const url = getOptimizedImageUrl(src, {
        width: w,
        quality: "auto",
        format: "auto",
      });
      return `${url} ${w}w`;
    })
    .join(", ");

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gray-100",
        aspectClasses[aspectRatio],
        containerClassName
      )}
    >
      <img
        src={getOptimizedImageUrl(src, { width: 640, quality: "auto", format: "auto" })}
        alt={alt}
        srcSet={srcSet}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        className={cn(
          "w-full h-full object-cover transition-transform duration-300 hover:scale-105",
          className
        )}
      />
    </div>
  );
}
