"use client";

import { useState } from "react";
import { Tag, Check, X } from "lucide-react";
import { LoadingButton } from "@/components/ui/LoadingButton";

interface CouponInputProps {
  cartTotal: number;
  onApply: (coupon: { code: string; discountAmount: number; newTotal: number }) => void;
  onRemove: () => void;
  appliedCoupon?: { code: string; discountAmount: number } | null;
}

export function CouponInput({
  cartTotal,
  onApply,
  onRemove,
  appliedCoupon,
}: CouponInputProps) {
  const [code, setCode] = useState("");
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState("");

  const handleApply = async () => {
    if (!code.trim()) {
      setError("Please enter a coupon code");
      return;
    }

    setValidating(true);
    setError("");

    try {
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim(), cartTotal }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Invalid coupon");
      }

      onApply({
        code: data.data.coupon.code,
        discountAmount: data.data.discountAmount,
        newTotal: data.data.newTotal,
      });
      setCode("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to apply coupon");
    } finally {
      setValidating(false);
    }
  };

  if (appliedCoupon) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="font-medium text-green-900">Coupon Applied: {appliedCoupon.code}</p>
            <p className="text-sm text-green-700">
              You saved ₹{appliedCoupon.discountAmount.toLocaleString()}
            </p>
          </div>
        </div>
        <button
          onClick={onRemove}
          className="p-2 text-green-700 hover:bg-green-100 rounded-lg transition-colors"
          title="Remove coupon"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError("");
            }}
            placeholder="Enter coupon code"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase"
            onKeyDown={(e) => e.key === "Enter" && handleApply()}
          />
        </div>
        <LoadingButton
          onClick={handleApply}
          loading={validating}
          loadingText="Applying..."
          variant="secondary"
        >
          Apply
        </LoadingButton>
      </div>

      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <X className="h-4 w-4" />
          {error}
        </p>
      )}
    </div>
  );
}
