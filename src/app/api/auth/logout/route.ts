import { NextRequest } from "next/server";
import { destroySession } from "@/lib/auth";
import { successResponse } from "@/lib/api-auth";

// POST /api/auth/logout
export async function POST(request: NextRequest) {
  await destroySession();
  return successResponse({ message: "Logged out successfully" });
}
