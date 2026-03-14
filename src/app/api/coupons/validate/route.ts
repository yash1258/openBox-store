import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-auth";
import { z } from "zod";

const validateCouponSchema = z.object({
  code: z.string().min(1),
  cartTotal: z.number().positive(),
});

// POST /api/coupons/validate - Validate a coupon code
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = validateCouponSchema.safeParse(body);
    if (!validationResult.success) {
      return errorResponse("Invalid input", "VALIDATION_ERROR", 400);
    }

    const { code, cartTotal } = validationResult.data;

    // Find coupon
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      return errorResponse("Invalid coupon code", "INVALID_COUPON", 400);
    }

    // Check if active
    if (!coupon.isActive) {
      return errorResponse("Coupon is not active", "INACTIVE_COUPON", 400);
    }

    // Check dates
    const now = new Date();
    if (coupon.startDate && now < coupon.startDate) {
      return errorResponse("Coupon is not yet active", "COUPON_NOT_STARTED", 400);
    }
    if (coupon.endDate && now > coupon.endDate) {
      return errorResponse("Coupon has expired", "COUPON_EXPIRED", 400);
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return errorResponse("Coupon usage limit reached", "COUPON_LIMIT_REACHED", 400);
    }

    // Check minimum order amount
    if (coupon.minOrderAmount && cartTotal < coupon.minOrderAmount) {
      return errorResponse(
        `Minimum order amount of ₹${coupon.minOrderAmount} required`,
        "MIN_ORDER_NOT_MET",
        400
      );
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
      discountAmount = (cartTotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscount);
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    // Ensure discount doesn't exceed cart total
    discountAmount = Math.min(discountAmount, cartTotal);

    return successResponse({
      coupon: {
        id: coupon.id,
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },
      discountAmount: Math.round(discountAmount * 100) / 100,
      newTotal: cartTotal - discountAmount,
    });
  } catch (error) {
    console.error("Validate coupon error:", error);
    return errorResponse("Failed to validate coupon", "COUPON_ERROR", 500);
  }
}
