import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

// PUT /api/admin/stories/:id - Update story
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse("Unauthorized", "UNAUTHORIZED", 401);
    }

    const { id } = await params;
    const body = await request.json();

    const story = await prisma.successStory.update({
      where: { id },
      data: {
        customerName: body.customerName,
        location: body.location,
        customerPhoto: body.customerPhoto,
        productPhoto: body.productPhoto,
        productId: body.productId,
        productName: body.productName,
        comment: body.comment,
        rating: body.rating,
        deliveredAt: body.deliveredAt ? new Date(body.deliveredAt) : undefined,
        featured: body.featured,
        published: body.published,
      },
    });

    return successResponse(story, { message: "Story updated successfully" });
  } catch (error) {
    console.error("Update story error:", error);
    return errorResponse("Failed to update story", "UPDATE_ERROR", 500);
  }
}

// DELETE /api/admin/stories/:id - Delete story
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse("Unauthorized", "UNAUTHORIZED", 401);
    }

    const { id } = await params;

    await prisma.successStory.delete({
      where: { id },
    });

    return successResponse({ id }, { message: "Story deleted successfully" });
  } catch (error) {
    console.error("Delete story error:", error);
    return errorResponse("Failed to delete story", "DELETE_ERROR", 500);
  }
}
