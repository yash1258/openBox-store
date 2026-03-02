import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSession } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-auth";
import { rateLimit } from "@/lib/rate-limit";
import { loginSchema } from "@/lib/validation";

// POST /api/auth/login
export async function POST(request: NextRequest) {
  try {
    // Rate limiting - 5 attempts per minute per IP
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = rateLimit(`login:${ip}`, 5, 60000);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.', code: 'RATE_LIMITED' },
        { status: 429, headers: {
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
        }}
      );
    }

    const body = await request.json();
    
    // Validate input with Zod
    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((issue: { message: string }) => issue.message).join(', ');
      return errorResponse(errors, "VALIDATION_ERROR");
    }

    const { email, password } = validationResult.data;

    // Find seller by email
    const seller = await prisma.seller.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!seller) {
      return errorResponse("Invalid email or password", "INVALID_CREDENTIALS", 401);
    }

    if (!seller.isActive) {
      return errorResponse("Account is deactivated", "ACCOUNT_DISABLED", 401);
    }

    // Verify password
    const isValid = await verifyPassword(password, seller.password);

    if (!isValid) {
      return errorResponse("Invalid email or password", "INVALID_CREDENTIALS", 401);
    }

    // Create session
    await createSession(seller.id);

    return successResponse({
      id: seller.id,
      email: seller.email,
      name: seller.name,
      shopName: seller.shopName,
    }, {
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    return errorResponse("Login failed", "LOGIN_ERROR", 500);
  }
}
