import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

// GET /api/admin/stories - Get all stories (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse("Unauthorized", "UNAUTHORIZED", 401);
    }

    const { searchParams } = new URL(request.url);
    const published = searchParams.get("published");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: Record<string, unknown> = {};
    
    if (published !== null) {
      where.published = published === "true";
    }

    const stories = await prisma.successStory.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
      },
    });

    const total = await prisma.successStory.count({ where });

    return successResponse(stories, {
      total,
      limit,
      offset,
      hasMore: offset + stories.length < total,
    });
  } catch (error) {
    console.error("Get admin stories error:", error);
    return errorResponse("Failed to get stories", "STORIES_ERROR", 500);
  }
}

// POST /api/admin/stories - Create new story (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse("Unauthorized", "UNAUTHORIZED", 401);
    }

    const body = await request.json();
    
    const story = await prisma.successStory.create({
      data: {
        customerName: body.customerName,
        location: body.location,
        customerPhoto: body.customerPhoto,
        productPhoto: body.productPhoto,
        productId: body.productId || null,
        productName: body.productName,
        comment: body.comment,
        rating: body.rating,
        deliveredAt: new Date(body.deliveredAt),
        featured: body.featured || false,
        published: body.published !== undefined ? body.published : true,
      },
    });

    return successResponse(story, { message: "Story created successfully" });
  } catch (error) {
    console.error("Create story error:", error);
    return errorResponse("Failed to create story", "CREATE_ERROR", 500);
  }
}
