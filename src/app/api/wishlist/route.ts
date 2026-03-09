import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-auth";
import { cookies } from "next/headers";

// Get or create session ID for wishlist
async function getSessionId(): Promise<string> {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get("wishlist_session")?.value;

  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
    cookieStore.set("wishlist_session", sessionId, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
    });
  }

  return sessionId;
}

// GET /api/wishlist - Get user's wishlist
export async function GET() {
  try {
    const sessionId = await getSessionId();

    const wishlistItems = await prisma.wishlist.findMany({
      where: { sessionId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sellingPrice: true,
            originalPrice: true,
            images: true,
            status: true,
            category: true,
            condition: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Parse images for each product
    const items = wishlistItems.map((item) => ({
      ...item,
      product: {
        ...item.product,
        images: JSON.parse(item.product.images || "[]"),
      },
    }));

    return successResponse(items);
  } catch (error) {
    console.error("Get wishlist error:", error);
    return errorResponse("Failed to get wishlist", "WISHLIST_ERROR", 500);
  }
}

// POST /api/wishlist - Add to wishlist
export async function POST(request: NextRequest) {
  try {
    const sessionId = await getSessionId();
    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return errorResponse("Product ID is required", "VALIDATION_ERROR", 400);
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });

    if (!product) {
      return errorResponse("Product not found", "NOT_FOUND", 404);
    }

    // Add to wishlist (will throw if already exists due to unique constraint)
    try {
      const wishlistItem = await prisma.wishlist.create({
        data: {
          sessionId,
          productId,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sellingPrice: true,
              images: true,
              status: true,
            },
          },
        },
      });

      return successResponse(
        {
          ...wishlistItem,
          product: {
            ...wishlistItem.product,
            images: JSON.parse(wishlistItem.product.images || "[]"),
          },
        },
        { message: "Added to wishlist" }
      );
    } catch (e) {
      // Already in wishlist
      return errorResponse("Product already in wishlist", "DUPLICATE", 409);
    }
  } catch (error) {
    console.error("Add to wishlist error:", error);
    return errorResponse("Failed to add to wishlist", "WISHLIST_ERROR", 500);
  }
}

// DELETE /api/wishlist?productId=xxx - Remove from wishlist
export async function DELETE(request: NextRequest) {
  try {
    const sessionId = await getSessionId();
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return errorResponse("Product ID is required", "VALIDATION_ERROR", 400);
    }

    await prisma.wishlist.deleteMany({
      where: {
        sessionId,
        productId,
      },
    });

    return successResponse(null, { message: "Removed from wishlist" });
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    return errorResponse("Failed to remove from wishlist", "WISHLIST_ERROR", 500);
  }
}
