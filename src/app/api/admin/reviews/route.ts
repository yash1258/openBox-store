import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { requireApiKey, successResponse, errorResponse } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

// GET /api/admin/reviews - List all reviews with filtering
export async function GET(request: NextRequest) {
  try {
    // Check auth
    const session = await getSession();
    if (!session) {
      const apiKeyAuth = await requireApiKey(request);
      if (apiKeyAuth) return apiKeyAuth;
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId") || undefined;
    const minRating = searchParams.get("minRating")
      ? parseInt(searchParams.get("minRating")!)
      : undefined;
    const maxRating = searchParams.get("maxRating")
      ? parseInt(searchParams.get("maxRating")!)
      : undefined;
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: Record<string, unknown> = {};

    if (productId) where.productId = productId;
    if (minRating !== undefined || maxRating !== undefined) {
      where.rating = {};
      if (minRating !== undefined) (where.rating as Record<string, number>).gte = minRating;
      if (maxRating !== undefined) (where.rating as Record<string, number>).lte = maxRating;
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
        include: {
          product: {
            select: {
              id: true,
              name: true,
              images: true,
            },
          },
        },
      }),
      prisma.review.count({ where }),
    ]);

    return successResponse(reviews, {
      total,
      limit,
      offset,
      hasMore: offset + reviews.length < total,
    });
  } catch (error) {
    console.error("Get reviews error:", error);
    return errorResponse("Failed to get reviews", "REVIEWS_ERROR", 500);
  }
}
