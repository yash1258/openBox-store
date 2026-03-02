import { NextRequest } from "next/server";
import { updateCartItem, removeFromCart } from "@/lib/cart";
import { successResponse, errorResponse } from "@/lib/api-auth";

// PUT /api/cart/[itemId] - Update item quantity
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const { itemId } = await params;
    const body = await request.json();
    const { quantity } = body;

    if (typeof quantity !== 'number' || quantity < 0) {
      return errorResponse("Invalid quantity", "VALIDATION_ERROR", 400);
    }

    const cart = await updateCartItem(itemId, quantity);
    return successResponse(cart);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update cart";
    return errorResponse(message, "CART_ERROR", 400);
  }
}

// DELETE /api/cart/[itemId] - Remove item from cart
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const { itemId } = await params;
    const cart = await removeFromCart(itemId);
    return successResponse(cart);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to remove from cart";
    return errorResponse(message, "CART_ERROR", 400);
  }
}
