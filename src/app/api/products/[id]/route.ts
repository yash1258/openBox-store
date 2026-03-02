import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireApiKey, successResponse, errorResponse } from "@/lib/api-auth";

// GET /api/products/:id - Get single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireApiKey(request);
  if (authError) return authError;

  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    return errorResponse("Product not found", "NOT_FOUND", 404);
  }

  return successResponse({
    ...product,
    images: JSON.parse(product.images || "[]"),
  });
}

// PUT /api/products/:id - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireApiKey(request);
  if (authError) return authError;

  const { id } = await params;

  // Check if product exists
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    return errorResponse("Product not found", "NOT_FOUND", 404);
  }

  try {
    const body = await request.json();

    const updateData: Record<string, unknown> = {};

    // Only include provided fields
    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.condition !== undefined) updateData.condition = body.condition;
    if (body.originalPrice !== undefined) updateData.originalPrice = body.originalPrice;
    if (body.sellingPrice !== undefined) updateData.sellingPrice = body.sellingPrice;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.images !== undefined) {
      updateData.images = Array.isArray(body.images) ? JSON.stringify(body.images) : body.images;
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    return successResponse(
      { ...product, images: JSON.parse(product.images || "[]") },
      { message: "Product updated successfully" }
    );
  } catch (error) {
    console.error("Error updating product:", error);
    return errorResponse("Failed to update product", "UPDATE_ERROR", 500);
  }
}

// DELETE /api/products/:id - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireApiKey(request);
  if (authError) return authError;

  const { id } = await params;

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    return errorResponse("Product not found", "NOT_FOUND", 404);
  }

  await prisma.product.delete({ where: { id } });

  return successResponse({ message: "Product deleted successfully" });
}
