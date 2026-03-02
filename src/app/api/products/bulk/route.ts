import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireApiKey, successResponse, errorResponse } from "@/lib/api-auth";

// POST /api/products/bulk - Create multiple products at once
export async function POST(request: NextRequest) {
  const authError = await requireApiKey(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { products } = body;

    if (!Array.isArray(products) || products.length === 0) {
      return errorResponse(
        "Request body must contain an array of products",
        "VALIDATION_ERROR"
      );
    }

    // Validate each product has required fields
    const invalidProducts = products.filter(
      (p: Record<string, unknown>) => !p.name || !p.category || !p.sellingPrice
    );

    if (invalidProducts.length > 0) {
      return errorResponse(
        `${invalidProducts.length} products missing required fields (name, category, sellingPrice)`,
        "VALIDATION_ERROR"
      );
    }

    // Get first seller to satisfy required sellerId (temporary solution)
    const firstSeller = await prisma.seller.findFirst();
    if (!firstSeller) {
      return errorResponse("No seller found", "SELLER_NOT_FOUND", 500);
    }

    // Create products in parallel
    const createdProducts = await Promise.all(
      products.map((product: Record<string, unknown>) =>
        prisma.product.create({
          data: {
            name: product.name as string,
            description: (product.description as string) || null,
            category: product.category as string,
            condition: (product.condition as string) || "openbox",
            originalPrice: (product.originalPrice as number) || null,
            sellingPrice: product.sellingPrice as number,
            images: Array.isArray(product.images)
              ? JSON.stringify(product.images)
              : "[]",
            status: (product.status as string) || "available",
            sellerId: firstSeller.id,
          },
        })
      )
    );

    const parsedProducts = createdProducts.map((p) => ({
      ...p,
      images: JSON.parse(p.images || "[]"),
    }));

    return successResponse(parsedProducts, {
      message: `Successfully created ${createdProducts.length} products`,
      count: createdProducts.length,
    });
  } catch (error) {
    console.error("Error bulk creating products:", error);
    return errorResponse("Failed to create products", "CREATE_ERROR", 500);
  }
}
