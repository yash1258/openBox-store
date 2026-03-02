import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createSession } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-auth";
import { rateLimit } from "@/lib/rate-limit";
import { signupSchema } from "@/lib/validation";

// POST /api/auth/signup - Register a new seller
export async function POST(request: NextRequest) {
  try {
    // Rate limiting - 3 signup attempts per hour per IP
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = rateLimit(`signup:${ip}`, 3, 3600000);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: 'Too many signup attempts. Please try again later.', 
          code: 'RATE_LIMITED',
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
        },
        { 
          status: 429, 
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString()
          }
        }
      );
    }

    const body = await request.json();
    
    // Validate input with Zod
    const validationResult = signupSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message
      }));
      return NextResponse.json(
        { success: false, error: 'Validation failed', code: 'VALIDATION_ERROR', errors },
        { status: 400 }
      );
    }

    const { email, password, name, shopName, whatsapp, address } = validationResult.data;

    // Check if email already exists (case insensitive)
    const existingSeller = await prisma.seller.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingSeller) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'An account with this email already exists', 
          code: 'EMAIL_EXISTS' 
        },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create seller
    const seller = await prisma.seller.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
        shopName,
        whatsapp,
        address,
        isActive: true,
      },
    });

    // Create settings for the seller
    await prisma.settings.create({
      data: {
        shopName,
        whatsapp,
        address: address || '',
      },
    });

    // Create session (auto-login after signup)
    await createSession(seller.id);

    return successResponse({
      id: seller.id,
      email: seller.email,
      name: seller.name,
      shopName: seller.shopName,
    }, {
      message: "Account created successfully",
    });
  } catch (error) {
    console.error("Signup error:", error);
    return errorResponse("Failed to create account", "SIGNUP_ERROR", 500);
  }
}
