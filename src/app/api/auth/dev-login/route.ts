import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-auth";

// =============================================================================
// 🚨 DEV LOGIN BYPASS - REMOVE BEFORE PRODUCTION DEPLOYMENT 🚨
// =============================================================================
// This endpoint allows quick login during development.
// It is automatically disabled in production (NODE_ENV === 'production').
// 
// TO REMOVE:
// 1. Delete this file: src/app/api/auth/dev-login/route.ts
// 2. Delete the dev login button from: src/app/(auth)/login/page.tsx
// 3. Remove DEV_LOGIN_SECRET from .env
// 4. Search for "dev-login" and remove all references
// =============================================================================

// POST /api/auth/dev-login - Dev-only bypass (development mode only)
export async function POST(request: NextRequest) {
  try {
    // SECURITY: Only allow in development mode - NEVER works in production
    if (process.env.NODE_ENV === 'production') {
      return errorResponse("Dev login not available in production", "FORBIDDEN", 403);
    }

    // Verify dev secret from environment (prevents accidental usage)
    const body = await request.json();
    const { devSecret } = body;
    
    const expectedSecret = process.env.DEV_LOGIN_SECRET || 'dev-mode-123';
    if (devSecret !== expectedSecret) {
      return errorResponse("Invalid dev credentials", "UNAUTHORIZED", 401);
    }

    // Get the first seller or create a test seller
    const { prisma } = await import("@/lib/prisma");
    let seller = await prisma.seller.findFirst();

    if (!seller) {
      // Create a test seller if none exists
      const { hashPassword } = await import("@/lib/auth");
      seller = await prisma.seller.create({
        data: {
          email: "dev@localhost",
          password: await hashPassword("dev"),
          name: "Dev User",
          shopName: "Dev Shop",
          whatsapp: "+919999999999",
          address: "Dev Address",
          isActive: true,
        },
      });

      // Create settings for dev seller
      await prisma.settings.create({
        data: {
          shopName: "Dev Shop",
          whatsapp: "+919999999999",
          address: "Dev Address",
        },
      });
    }

    // Create session
    await createSession(seller.id);

    return successResponse({
      id: seller.id,
      email: seller.email,
      name: seller.name,
      shopName: seller.shopName,
    }, {
      message: "Dev login successful",
    });
  } catch (error) {
    console.error("Dev login error:", error);
    return errorResponse("Dev login failed", "LOGIN_ERROR", 500);
  }
}
