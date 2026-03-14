import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { requireApiKey, successResponse, errorResponse } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const couponSchema = z.object({
  code: z.string().min(3).max(20).toUpperCase(),
  description: z.string().optional(),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.number().positive(),
  minOrderAmount: z.number().optional(),
  maxDiscount: z.number().optional(),
  usageLimit: z.number().int().positive().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

// GET /api/admin/coupons - List all coupons
export async function GET(request: NextRequest) {
  try {
    // Check auth
    const session = await getSession();
    if (!session) {
      const apiKeyAuth = await requireApiKey(request);
      if (apiKeyAuth) return apiKeyAuth;
    }

    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get("isActive");

    const where: Record<string, unknown> = {};
    if (isActive !== null) {
      where.isActive = isActive === "true";
    }

    const coupons = await prisma.coupon.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { orders: true },
        },
      },
    });

    return successResponse(coupons);
  } catch (error) {
    console.error("Get coupons error:", error);
    return errorResponse("Failed to get coupons", "COUPONS_ERROR", 500);
  }
}

// POST /api/admin/coupons - Create a coupon
export async function POST(request: NextRequest) {
  try {
    // Check auth
    const session = await getSession();
    if (!session) {
      const apiKeyAuth = await requireApiKey(request);
      if (apiKeyAuth) return apiKeyAuth;
    }

    const body = await request.json();

    // Validate input
    const validationResult = couponSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((i) => i.message);
      return errorResponse(errors.join(", "), "VALIDATION_ERROR", 400);
    }

    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscount,
      usageLimit,
      startDate,
      endDate,
    } = validationResult.data;

    // Check if code already exists
    const existing = await prisma.coupon.findUnique({
      where: { code },
    });

    if (existing) {
      return errorResponse("Coupon code already exists", "DUPLICATE_CODE", 409);
    }

    // Create coupon
    const coupon = await prisma.coupon.create({
      data: {
        code,
        description,
        discountType,
        discountValue,
        minOrderAmount,
        maxDiscount,
        usageLimit,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    return successResponse(coupon, { message: "Coupon created successfully" });
  } catch (error) {
    console.error("Create coupon error:", error);
    return errorResponse("Failed to create coupon", "COUPON_ERROR", 500);
  }
}
