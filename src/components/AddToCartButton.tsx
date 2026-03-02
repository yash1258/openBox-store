"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Check, Loader2 } from "lucide-react";
import { trackCartAdd } from "@/lib/analytics";

interface AddToCartButtonProps {
  productId: string;
  productName?: string;
  productPrice?: number;
  className?: string;
}

export default function AddToCartButton({ 
  productId, 
  productName = "",
  productPrice = 0,
  className = "" 
}: AddToCartButtonProps) {
  const { addToCart, cart } = useCart();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      await addToCart(productId);
      
      // Track analytics
      const currentTotal = cart?.total || 0;
      const newCartValue = currentTotal + productPrice;
      const itemCount = (cart?.itemCount || 0) + 1;
      
      trackCartAdd(productId, productName, 1, productPrice, newCartValue);
      
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading}
      className={`
        inline-flex items-center justify-center gap-2 
        px-6 py-3 
        bg-gradient-to-r from-amber-600 to-amber-700 
        text-white rounded-xl font-semibold 
        shadow-lg shadow-amber-600/25
        hover:from-amber-700 hover:to-amber-800 
        hover:shadow-xl hover:shadow-amber-600/30
        hover:-translate-y-0.5
        active:translate-y-0
        transition-all duration-200 ease-out
        disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0
        ${added ? 'from-green-600 to-green-700 shadow-green-600/25' : ''}
        ${className}
      `}
    >
      {loading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Adding...</span>
        </>
      ) : added ? (
        <>
          <Check className="h-5 w-5" />
          <span>Added!</span>
        </>
      ) : (
        <>
          <ShoppingCart className="h-5 w-5" />
          <span>Add to Cart</span>
        </>
      )}
    </button>
  );
}
