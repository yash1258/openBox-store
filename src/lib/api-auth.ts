// API Key Authentication Utilities
// Uses X-API-Key header for authentication

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const API_KEY_HEADER = "x-api-key";
const DEV_API_KEY = process.env.DEV_API_KEY || "";

export async function verifyApiKey(request: NextRequest): Promise<{ valid: boolean; error?: string }> {
  const apiKey = request.headers.get(API_KEY_HEADER);

  // Block dev key in production if not explicitly set
  if (process.env.NODE_ENV === 'production' && !DEV_API_KEY) {
    // Dev key is disabled in production
  } else if (DEV_API_KEY && apiKey === DEV_API_KEY) {
    return { valid: true };
  }

  // Check against stored API keys in database
  const settings = await prisma.settings.findFirst();
  const apiKeysJson = settings?.apiKeys || "[]";
  const validKeys: string[] = typeof apiKeysJson === "string" ? JSON.parse(apiKeysJson) : apiKeysJson;

  if (!apiKey) {
    return { valid: false, error: "Missing API key. Include 'X-API-Key' header." };
  }

  if (!validKeys.includes(apiKey)) {
    return { valid: false, error: "Invalid API key" };
  }

  return { valid: true };
}

export async function requireApiKey(request: NextRequest): Promise<NextResponse | null> {
  const { valid, error } = await verifyApiKey(request);

  if (!valid) {
    return NextResponse.json(
      { success: false, error, code: "UNAUTHORIZED" },
      { status: 401 }
    );
  }

  return null;
}

export function successResponse<T>(data: T, meta?: Record<string, unknown>): NextResponse {
  return NextResponse.json({
    success: true,
    data,
    ...(meta && { meta }),
  });
}

export function errorResponse(message: string, code: string, status = 400): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: message,
      code,
    },
    { status }
  );
}
