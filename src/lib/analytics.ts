// Client-side analytics tracking helper
// Usage: import { trackEvent, trackPageView, trackProductView } from '@/lib/analytics'

const ANALYTICS_ENDPOINT = "/api/analytics/track";

// Generate session ID if not exists
function getSessionId(): string {
  if (typeof window === "undefined") return "";
  
  let sessionId = localStorage.getItem("analytics_session");
  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("analytics_session", sessionId);
  }
  return sessionId;
}

// Track any event
export async function trackEvent(
  type: string,
  productId?: string,
  metadata?: Record<string, unknown>
) {
  if (typeof window === "undefined") return;

  try {
    await fetch(ANALYTICS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type,
        productId,
        metadata: {
          ...metadata,
          url: window.location.href,
          referrer: document.referrer,
          userAgent: navigator.userAgent,
          timestamp: Date.now(),
        },
      }),
    });
  } catch (error) {
    // Silently fail - don't break user experience
    console.error("Analytics tracking failed:", error);
  }
}

// Track page view
export function trackPageView(path?: string) {
  trackEvent("page_view", undefined, {
    path: path || window.location.pathname,
    title: document.title,
  });
}

// Track product view
export function trackProductView(productId: string, productName: string) {
  trackEvent("product_view", productId, {
    productName,
  });
}

// Track cart add
export function trackCartAdd(
  productId: string,
  productName: string,
  quantity: number,
  price: number,
  cartValue: number
) {
  trackEvent("cart_add", productId, {
    productName,
    quantity,
    price,
    cartValue,
  });
}

// Track cart remove
export function trackCartRemove(
  productId: string,
  productName: string,
  quantity: number,
  cartValue: number
) {
  trackEvent("cart_remove", productId, {
    productName,
    quantity,
    cartValue,
  });
}

// Track search
export function trackSearch(query: string, resultsCount: number) {
  trackEvent("search", undefined, {
    query,
    resultsCount,
  });
}

// Track checkout start
export function trackCheckoutStart(cartValue: number, itemCount: number) {
  trackEvent("checkout_start", undefined, {
    cartValue,
    itemCount,
  });
}

// Track checkout complete
export function trackCheckoutComplete(orderId: string, orderValue: number) {
  trackEvent("checkout_complete", undefined, {
    orderId,
    orderValue,
  });
}

// Track order complete
export function trackOrderComplete(orderId: string, orderValue: number, itemCount: number) {
  trackEvent("order_complete", undefined, {
    orderId,
    orderValue,
    itemCount,
  });
}

// Track product click
export function trackProductClick(productId: string, productName: string, position: number) {
  trackEvent("product_click", productId, {
    productName,
    position,
  });
}

// Track filter usage
export function trackFilterUse(filterType: string, filterValue: string) {
  trackEvent("filter_use", undefined, {
    filterType,
    filterValue,
  });
}

// Track cart abandonment (call when user leaves with items in cart)
export function trackCartAbandonment(cartValue: number, itemCount: number) {
  trackEvent("cart_abandon", undefined, {
    cartValue,
    itemCount,
  });
}

// Debounce helper for tracking
export function debounce<T extends (...args: string[]) => void>(
  func: T,
  wait: number
): (...args: string[]) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: string[]) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Track search with debounce (to avoid tracking every keystroke)
export function trackSearchDebounced(query: string, resultsCount: number) {
  const debouncedTrack = debounce((q: string, count: string) => {
    trackSearch(q, parseInt(count, 10));
  }, 500);
  debouncedTrack(query, resultsCount.toString());
}
