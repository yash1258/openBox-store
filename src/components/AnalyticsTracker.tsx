"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackPageView, trackProductView, trackCartAbandonment } from "@/lib/analytics";

// Track page views automatically
export function AnalyticsTracker() {
  const pathname = usePathname();
  const lastPathRef = useRef<string | null>(null);
  const cartAbandonedRef = useRef(false);

  // Track page views
  useEffect(() => {
    if (pathname && pathname !== lastPathRef.current) {
      // Small delay to ensure page title is set
      const timer = setTimeout(() => {
        trackPageView(pathname);
        lastPathRef.current = pathname;
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  // Track cart abandonment when leaving site
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!cartAbandonedRef.current) {
        // Check if cart has items
        const cartData = localStorage.getItem("cart");
        if (cartData) {
          try {
            const cart = JSON.parse(cartData);
            if (cart.items && cart.items.length > 0) {
              const itemCount = cart.items.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0);
              const cartValue = cart.items.reduce((sum: number, item: { product: { sellingPrice: number }; quantity: number }) => sum + (item.product.sellingPrice * item.quantity), 0);
              
              trackCartAbandonment(cartValue, itemCount);
              cartAbandonedRef.current = true;
            }
          } catch {
            // Invalid cart data, ignore
          }
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return null; // This component doesn't render anything
}

// Hook to track product views
export function useProductTracking(productId: string, productName: string) {
  useEffect(() => {
    if (productId) {
      trackProductView(productId, productName);
    }
  }, [productId, productName]);
}

// Hook to track when element comes into view (for impression tracking)
export function useImpressionTracking(
  ref: React.RefObject<HTMLElement>,
  productId: string,
  productName: string
) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            trackProductView(productId, productName);
            observer.unobserve(element);
          }
        });
      },
      { threshold: 0.5 } // Trigger when 50% visible
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [ref, productId, productName]);
}
