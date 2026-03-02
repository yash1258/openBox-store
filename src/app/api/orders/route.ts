import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { requireApiKey, successResponse, errorResponse } from "@/lib/api-auth";
import { createOrder, getOrdersBySeller } from "@/lib/order";
import { orderSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";

// GET /api/orders - List orders for seller
export async function GET(request: NextRequest) {
  try {
    // Try API key auth first (for AI agents)
    const apiKeyAuth = await requireApiKey(request);
    if (!apiKeyAuth) {
      // API key auth succeeded - get first seller
      const firstSeller = await prisma.seller.findFirst();
      if (!firstSeller) {
        return errorResponse("No seller found", "NO_SELLER", 404);
      }
      
      const { searchParams } = new URL(request.url);
      const status = searchParams.get("status") || undefined;
      const paymentStatus = searchParams.get("paymentStatus") || undefined;
      const page = parseInt(searchParams.get("page") || "1");
      const limit = parseInt(searchParams.get("limit") || "20");

      const result = await getOrdersBySeller(firstSeller.id, {
        status,
        paymentStatus,
        page,
        limit,
      });

      return successResponse(result);
    }
    
    // Try session auth (for web dashboard)
    const session = await getSession();
    if (!session) {
      return errorResponse("Unauthorized", "UNAUTHORIZED", 401);
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || undefined;
    const paymentStatus = searchParams.get("paymentStatus") || undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const result = await getOrdersBySeller(session.sellerId, {
      status,
      paymentStatus,
      page,
      limit,
    });

    return successResponse(result);
  } catch (error) {
    console.error("Get orders error:", error);
    return errorResponse("Failed to get orders", "ORDERS_ERROR", 500);
  }
}

// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = orderSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((issue: { message: string }) => issue.message).join(', ');
      return errorResponse(errors, "VALIDATION_ERROR", 400);
    }

    const { customerName, customerEmail, customerPhone, address, items, paymentMethod } = validationResult.data;

    // For now, use the first seller (in production, this would come from a seller selection or default)
    const { prisma } = await import("@/lib/prisma");
    const firstSeller = await prisma.seller.findFirst();
    
    if (!firstSeller) {
      return errorResponse("No seller available", "NO_SELLER", 500);
    }

    const order = await createOrder({
      customerName,
      customerEmail,
      customerPhone,
      address,
      items,
      paymentMethod,
      sellerId: firstSeller.id,
    });

    return successResponse(order, { message: "Order created successfully" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create order";
    return errorResponse(message, "ORDER_ERROR", 400);
  }
}
