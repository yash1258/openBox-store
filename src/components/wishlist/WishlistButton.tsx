"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  productId: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function WishlistButton({
  productId,
  className,
  size = "md",
  showLabel = false,
}: WishlistButtonProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  // Check if product is in wishlist on mount
  useEffect(() => {
    checkWishlistStatus();
  }, [productId]);

  const checkWishlistStatus = async () => {
    try {
      const response = await fetch("/api/wishlist");
      if (response.ok) {
        const { data } = await response.json();
        const isInWishlist = data.some((item: { productId: string }) => item.productId === productId);
        setIsWishlisted(isInWishlist);
      }
    } catch (error) {
      console.error("Error checking wishlist:", error);
    }
  };

  const toggleWishlist = async () => {
    if (loading) return;

    setLoading(true);
    try {
      if (isWishlisted) {
        // Remove from wishlist
        const response = await fetch(`/api/wishlist?productId=${productId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setIsWishlisted(false);
        }
      } else {
        // Add to wishlist
        const response = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });

        if (response.ok || response.status === 409) {
          setIsWishlisted(true);
        }
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleWishlist}
      disabled={loading}
      className={cn(
        "flex items-center gap-2 rounded-full transition-all",
        sizeClasses[size],
        isWishlisted
          ? "bg-red-50 text-red-500 hover:bg-red-100"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200",
        loading && "opacity-70",
        className
      )}
      title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={cn(
          iconSizes[size],
          isWishlisted && "fill-current",
          loading && "animate-pulse"
        )}
      />
      {showLabel && (
        <span className="text-sm font-medium pr-2">
          {isWishlisted ? "Saved" : "Save"}
        </span>
      )}
    </button>
  );
}
