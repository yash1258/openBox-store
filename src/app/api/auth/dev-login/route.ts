import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-auth";

// =============================================================================
// 🚨 DEV LOGIN BYPASS - ENABLED FOR DEMO SITE 🚨
// =============================================================================
// This endpoint allows quick login for the demo site on Vercel.
// Dev login is ENABLED in production for demo purposes.
// 
// TO DISABLE FOR PRODUCTION:
// 1. Add this check back:
//    if (process.env.NODE_ENV === 'production') {
//      return errorResponse("Dev login not available in production", "FORBIDDEN", 403);
//    }
// 2. Or delete this file entirely
// =============================================================================

// POST /api/auth/dev-login - Dev bypass (enabled for demo site)
export async function POST(request: NextRequest) {
  try {
    // SECURITY: Dev login enabled for demo site on Vercel

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
