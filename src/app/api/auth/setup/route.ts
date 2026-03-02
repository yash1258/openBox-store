import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createSession } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-auth";
import { rateLimit } from "@/lib/rate-limit";
import { z } from 'zod';

const setupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required').max(100),
  shopName: z.string().max(100).optional(),
});

// POST /api/auth/setup
// Only works if no seller exists
export async function POST(request: NextRequest) {
  try {
    // Rate limiting - 3 attempts per hour per IP
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = rateLimit(`setup:${ip}`, 3, 3600000);
    
    if (!rateLimitResult.success) {
      return errorResponse('Too many setup attempts. Please try again later.', 'RATE_LIMITED', 429);
    }

    // Check if any seller exists
    const existingSellers = await prisma.seller.count();

    if (existingSellers > 0) {
      return errorResponse("Seller already exists. Use login instead.", "ALREADY_EXISTS", 400);
    }

    const body = await request.json();

    // Validate input with Zod
    const validationResult = setupSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((issue: { message: string }) => issue.message).join(', ');
      return errorResponse(errors, "VALIDATION_ERROR");
    }

    const { email, password, name, shopName } = validationResult.data;

    // Check if email already exists
    const existingEmail = await prisma.seller.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingEmail) {
      return errorResponse("Email already exists", "EMAIL_EXISTS", 400);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create seller
    const seller = await prisma.seller.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
        shopName: shopName || "My OpenBox Store",
      },
    });

    // Create session
    await createSession(seller.id);

    return successResponse({
      id: seller.id,
      email: seller.email,
      name: seller.name,
      shopName: seller.shopName,
    }, {
      message: "Seller account created successfully",
    });
  } catch (error) {
    console.error("Setup error:", error);
    return errorResponse("Setup failed", "SETUP_ERROR", 500);
  }
}

// GET /api/auth/setup
// Check if setup is needed
export async function GET() {
  const sellerCount = await prisma.seller.count();

  return successResponse({
    needsSetup: sellerCount === 0,
    sellerCount,
  });
}
