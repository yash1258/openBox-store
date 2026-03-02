import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireApiKey, successResponse, errorResponse } from "@/lib/api-auth";

// GET /api/categories - List all categories
export async function GET(request: NextRequest) {
  const authError = await requireApiKey(request);
  if (authError) return authError;

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  // Get product counts for each category
  const categoriesWithCounts = await Promise.all(
    categories.map(async (cat) => {
      const count = await prisma.product.count({
        where: { category: cat.name },
      });
      return { ...cat, productCount: count };
    })
  );

  // Also get list of unique categories from products
  const productCategories = await prisma.product.findMany({
    select: { category: true },
    distinct: ["category"],
  });

  return successResponse({
    custom: categoriesWithCounts,
    all: productCategories.map((c) => c.category),
  });
}

// POST /api/categories - Create a new category
export async function POST(request: NextRequest) {
  const authError = await requireApiKey(request);
  if (authError) return authError;

  try {
    const body = await request.json();

    if (!body.name) {
      return errorResponse("Category name is required", "VALIDATION_ERROR");
    }

    // Generate slug from name
    const slug = body.name.toLowerCase().replace(/\s+/g, "-");

    // Check if category already exists (using findFirst since we need sellerId for unique constraint)
    const existing = await prisma.category.findFirst({
      where: { slug },
    });

    if (existing) {
      return errorResponse("Category already exists", "DUPLICATE_ERROR", 409);
    }

    // Get first seller to satisfy required sellerId (temporary solution)
    const firstSeller = await prisma.seller.findFirst();
    if (!firstSeller) {
      return errorResponse("No seller found", "SELLER_NOT_FOUND", 500);
    }

    const category = await prisma.category.create({
      data: {
        name: body.name,
        slug,
        icon: body.icon || null,
        color: body.color || null,
        sellerId: firstSeller.id,
      },
    });

    return successResponse(category, { message: "Category created successfully" });
  } catch (error) {
    console.error("Error creating category:", error);
    return errorResponse("Failed to create category", "CREATE_ERROR", 500);
  }
}
