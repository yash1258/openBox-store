import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireApiKey, successResponse, errorResponse } from "@/lib/api-auth";

// GET /api/products - List products with filters
export async function GET(request: NextRequest) {
  const authError = await requireApiKey(request);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);

  // Parse query parameters
  const status = searchParams.get("status");
  const category = searchParams.get("category");
  const condition = searchParams.get("condition");
  const q = searchParams.get("q");
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
  const offset = parseInt(searchParams.get("offset") || "0");

  // Build where clause
  const { searchParams: qParams } = new URL(request.url);
  const sellerId = qParams.get("sellerId");

  const where: Record<string, unknown> = sellerId ? { sellerId } : {};

  if (status && status !== "all") where.status = status;
  if (category && category !== "all") where.category = category;
  if (condition && condition !== "all") where.condition = condition;

  if (q) {
    where.OR = [
      { name: { contains: q } },
      { description: { contains: q } },
    ];
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  // Parse images from JSON string
  const parsedProducts = products.map((p) => ({
    ...p,
    images: JSON.parse(p.images || "[]"),
  }));

  return successResponse(parsedProducts, {
    total,
    limit,
    offset,
    hasMore: offset + products.length < total,
  });
}

// POST /api/products - Create a new product
export async function POST(request: NextRequest) {
  const authError = await requireApiKey(request);
  if (authError) return authError;

  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.category || !body.sellingPrice) {
      return errorResponse(
        "Missing required fields: name, category, sellingPrice",
        "VALIDATION_ERROR"
      );
    }

    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description || null,
        category: body.category,
        condition: body.condition || "openbox",
        originalPrice: body.originalPrice || null,
        sellingPrice: body.sellingPrice,
        images: Array.isArray(body.images) ? JSON.stringify(body.images) : "[]",
        status: body.status || "available",
        sellerId: body.sellerId || "unknown",
      },
    });

    return successResponse(
      { ...product, images: JSON.parse(product.images || "[]") },
      { message: "Product created successfully" }
    );
  } catch (error) {
    console.error("Error creating product:", error);
    return errorResponse("Failed to create product", "CREATE_ERROR", 500);
  }
}
