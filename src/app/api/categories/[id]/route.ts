import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireApiKey, successResponse, errorResponse } from "@/lib/api-auth";

// GET /api/categories/:id - Get single category
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireApiKey(request);
  if (authError) return authError;

  const { id } = await params;
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    return errorResponse("Category not found", "NOT_FOUND", 404);
  }

  const count = await prisma.product.count({
    where: { category: category.name },
  });

  return successResponse({ ...category, productCount: count });
}

// PUT /api/categories/:id - Update category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireApiKey(request);
  if (authError) return authError;

  const { id } = await params;

  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) {
    return errorResponse("Category not found", "NOT_FOUND", 404);
  }

  try {
    const body = await request.json();

    const updateData: Record<string, unknown> = {};
    if (body.name) {
      updateData.name = body.name;
      updateData.slug = body.name.toLowerCase().replace(/\s+/g, "-");
    }
    if (body.icon !== undefined) updateData.icon = body.icon;
    if (body.color !== undefined) updateData.color = body.color;

    const category = await prisma.category.update({
      where: { id },
      data: updateData,
    });

    return successResponse(category, { message: "Category updated successfully" });
  } catch (error) {
    console.error("Error updating category:", error);
    return errorResponse("Failed to update category", "UPDATE_ERROR", 500);
  }
}

// DELETE /api/categories/:id - Delete category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireApiKey(request);
  if (authError) return authError;

  const { id } = await params;

  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) {
    return errorResponse("Category not found", "NOT_FOUND", 404);
  }

  // Check if category has products
  const productCount = await prisma.product.count({
    where: { category: existing.name },
  });

  if (productCount > 0) {
    return errorResponse(
      `Cannot delete category with ${productCount} products. Move or delete products first.`,
      "CATEGORY_IN_USE",
      409
    );
  }

  await prisma.category.delete({ where: { id } });

  return successResponse({ message: "Category deleted successfully" });
}
