import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-auth";

// GET /api/auth/session
export async function GET(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return errorResponse("Not authenticated", "NO_SESSION", 401);
  }

  return successResponse(session);
}
