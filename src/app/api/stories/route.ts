import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-auth";

// GET /api/stories - Get all published success stories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: Record<string, unknown> = { published: true };
    
    if (featured === "true") {
      where.featured = true;
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
    console.error("Get stories error:", error);
    return errorResponse("Failed to get stories", "STORIES_ERROR", 500);
  }
}
