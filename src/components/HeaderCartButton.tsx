"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import CartDrawer from "./CartDrawer";

export default function HeaderCartButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { cart } = useCart();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 text-stone-600 hover:bg-stone-100 rounded-xl transition-colors flex flex-col items-center"
        aria-label="Shopping cart"
      >
        <ShoppingCart className="h-6 w-6" />
        {cart && cart.itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs font-bold min-w-[20px] h-5 rounded-full flex items-center justify-center px-1"
          >
            {cart.itemCount > 9 ? "9+" : cart.itemCount}
          </span>
        )}
      </button>
      <CartDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
