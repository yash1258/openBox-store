import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-auth";
import { z } from "zod";

const reviewSchema = z.object({
  customerName: z.string().min(1, "Name is required").max(100),
  rating: z.number().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

// GET /api/products/[id]/reviews - Get reviews for a product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!product) {
      return errorResponse("Product not found", "NOT_FOUND", 404);
    }

    // Get reviews with pagination
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { productId: id },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.review.count({ where: { productId: id } }),
    ]);

    // Calculate average rating
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    // Count ratings by star
    const ratingCounts = await prisma.review.groupBy({
      by: ["rating"],
      where: { productId: id },
      _count: { rating: true },
    });

    const ratingDistribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    ratingCounts.forEach((rc) => {
      ratingDistribution[rc.rating as keyof typeof ratingDistribution] = rc._count.rating;
    });

    return successResponse(
      {
        reviews,
        stats: {
          averageRating: Math.round(avgRating * 10) / 10,
          totalReviews: total,
          ratingDistribution,
        },
      },
      {
        total,
        limit,
        offset,
        hasMore: offset + reviews.length < total,
      }
    );
  } catch (error) {
    console.error("Get reviews error:", error);
    return errorResponse("Failed to get reviews", "REVIEWS_ERROR", 500);
  }
}

// POST /api/products/[id]/reviews - Create a review
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate input
    const validationResult = reviewSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((i) => i.message);
      return errorResponse(errors.join(", "), "VALIDATION_ERROR", 400);
    }

    const { customerName, rating, comment } = validationResult.data;

    // Check if product exists and is sold
    const product = await prisma.product.findUnique({
      where: { id },
      select: { id: true, status: true },
    });

    if (!product) {
      return errorResponse("Product not found", "NOT_FOUND", 404);
    }

    // Optional: Only allow reviews for sold products
    // if (product.status !== "sold") {
    //   return errorResponse("Can only review purchased products", "INVALID_STATUS", 400);
    // }

    // Create review
    const review = await prisma.review.create({
      data: {
        productId: id,
        customerName,
        rating,
        comment,
      },
    });

    return successResponse(review, { message: "Review submitted successfully" });
  } catch (error) {
    console.error("Create review error:", error);
    return errorResponse("Failed to submit review", "REVIEW_ERROR", 500);
  }
}
