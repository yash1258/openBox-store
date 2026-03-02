import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireApiKey, successResponse, errorResponse } from "@/lib/api-auth";

const VALID_STATUSES = ["available", "sold", "reserved"];

// PUT /api/products/:id/status - Quick status update
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
    const { status } = body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return errorResponse(
        `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
        "VALIDATION_ERROR"
      );
    }

    const product = await prisma.product.update({
      where: { id },
      data: { status },
    });

    const previousStatus = existing.status;
    const action =
      previousStatus === "available" && status === "sold"
        ? "sold"
        : previousStatus === "available" && status === "reserved"
        ? "reserved"
        : previousStatus === "sold" && status === "available"
        ? "returned_to_inventory"
        : "status_updated";

    return successResponse(
      {
        ...product,
        images: JSON.parse(product.images || "[]"),
      },
      {
        message: `Product marked as ${status}`,
        previousStatus,
        action,
      }
    );
  } catch (error) {
    console.error("Error updating product status:", error);
    return errorResponse("Failed to update product status", "UPDATE_ERROR", 500);
  }
}
