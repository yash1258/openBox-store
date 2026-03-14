import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { requireApiKey, successResponse, errorResponse } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { sendOrderStatusUpdateEmail } from "@/lib/email/order-emails";
import { z } from "zod";

const updateOrderSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"]).optional(),
  paymentStatus: z.enum(["PENDING", "PAID", "FAILED", "REFUNDED"]).optional(),
  trackingNumber: z.string().optional(),
});

// GET /api/orders/[id] - Get single order
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Try API key auth first
    const apiKeyAuth = await requireApiKey(request);
    if (!apiKeyAuth) {
      const order = await prisma.order.findUnique({
        where: { id },
        include: { items: true },
      });
      
      if (!order) {
        return errorResponse("Order not found", "NOT_FOUND", 404);
      }
      
      return successResponse(order);
    }
    
    // Try session auth
    const session = await getSession();
    if (!session) {
      return errorResponse("Unauthorized", "UNAUTHORIZED", 401);
    }

    const order = await prisma.order.findFirst({
      where: { id, sellerId: session.sellerId },
      include: { items: true },
    });

    if (!order) {
      return errorResponse("Order not found", "NOT_FOUND", 404);
    }

    return successResponse(order);
  } catch (error) {
    console.error("Get order error:", error);
    return errorResponse("Failed to get order", "ORDER_ERROR", 500);
  }
}

// PUT /api/orders/[id] - Update order
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Validate input
    const validationResult = updateOrderSchema.safeParse(body);
    if (!validationResult.success) {
      return errorResponse("Invalid input", "VALIDATION_ERROR", 400);
    }

    const { status, paymentStatus, trackingNumber } = validationResult.data;

    // Get current order to check for status changes
    const currentOrder = await prisma.order.findUnique({
      where: { id },
      include: { seller: { select: { id: true } } },
    });

    if (!currentOrder) {
      return errorResponse("Order not found", "NOT_FOUND", 404);
    }

    // Update order
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus }),
        ...(trackingNumber && { trackingNumber }),
      },
      include: { items: true },
    });

    // Send status update email if status changed
    if (status && status !== currentOrder.status) {
      sendOrderStatusUpdateEmail({
        orderId: id,
        customerEmail: currentOrder.customerEmail,
        customerName: currentOrder.customerName,
        previousStatus: currentOrder.status,
      }).catch(console.error);
    }

    return successResponse(updatedOrder, { message: "Order updated successfully" });
  } catch (error) {
    console.error("Update order error:", error);
    return errorResponse("Failed to update order", "ORDER_ERROR", 500);
  }
}

// DELETE /api/orders/[id] - Delete order
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Check auth
    const apiKeyAuth = await requireApiKey(request);
    if (apiKeyAuth) {
      const session = await getSession();
      if (!session) {
        return errorResponse("Unauthorized", "UNAUTHORIZED", 401);
      }
    }

    await prisma.order.delete({
      where: { id },
    });

    return successResponse(null, { message: "Order deleted successfully" });
  } catch (error) {
    console.error("Delete order error:", error);
    return errorResponse("Failed to delete order", "ORDER_ERROR", 500);
  }
}
