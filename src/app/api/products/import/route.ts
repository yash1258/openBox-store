import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { requireApiKey, errorResponse } from "@/lib/api-auth";
import { rateLimit } from "@/lib/rate-limit";
import { productSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting - 10 imports per minute per IP
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = rateLimit(`import:${ip}`, 10, 60000);
    
    if (!rateLimitResult.success) {
      return errorResponse('Rate limit exceeded. Please try again later.', 'RATE_LIMITED', 429);
    }

    // Authentication check - support both API key and session
    let sellerId: string;
    
    // Try API key auth first (for AI agents)
    const apiKeyAuth = await requireApiKey(request);
    if (!apiKeyAuth) {
      // API key auth succeeded
      const firstSeller = await prisma.seller.findFirst();
      if (!firstSeller) {
        return errorResponse('No seller found', 'NO_SELLER', 500);
      }
      sellerId = firstSeller.id;
    } else {
      // Try session auth (for web dashboard)
      const session = await getSession();
      if (!session) {
        return errorResponse('Unauthorized', 'UNAUTHORIZED', 401);
      }
      sellerId = session.sellerId;
    }

    const products = await request.json();

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ error: "No products to import" }, { status: 400 });
    }

    // Limit batch size
    if (products.length > 100) {
      return errorResponse('Maximum 100 products can be imported at once', 'BATCH_TOO_LARGE', 400);
    }

    // Validate all products first
    const validatedProducts: Array<{ name: string; description?: string; category: string; condition: string; originalPrice?: number; sellingPrice: number; images: string[]; status: string }> = [];
    for (let i = 0; i < products.length; i++) {
      const validationResult = productSchema.safeParse(products[i]);
      if (!validationResult.success) {
        const errors = validationResult.error.issues.map((issue: { message: string }) => issue.message).join(', ');
        return errorResponse(`Product ${i + 1} validation failed: ${errors}`, 'VALIDATION_ERROR', 400);
      }
      validatedProducts.push(validationResult.data);
    }

    // Import all products in a transaction
    const results = await prisma.$transaction(async (tx) => {
      const createdProducts = [];
      for (const product of validatedProducts) {
        const created = await tx.product.create({
          data: {
            name: product.name,
            description: product.description || "",
            category: product.category,
            condition: product.condition,
            originalPrice: product.originalPrice || null,
            sellingPrice: product.sellingPrice,
            images: JSON.stringify(product.images || []),
            status: product.status || 'available',
            sellerId: sellerId,
          },
        });
        createdProducts.push(created);
      }
      return createdProducts;
    });

    return NextResponse.json({
      success: true,
      imported: results.length,
      failed: 0,
    });
  } catch (error) {
    console.error("Import error:", error);
    return errorResponse('Failed to import products', 'IMPORT_ERROR', 500);
  }
}
