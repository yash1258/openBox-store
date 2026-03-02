import { NextRequest } from "next/server";
import { getCart, addToCart } from "@/lib/cart";
import { successResponse, errorResponse } from "@/lib/api-auth";
import { cartItemSchema } from "@/lib/validation";

// GET /api/cart - Get current cart
export async function GET() {
  try {
    const cart = await getCart();
    return successResponse(cart);
  } catch (error) {
    console.error("Get cart error:", error);
    return errorResponse("Failed to get cart", "CART_ERROR", 500);
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = cartItemSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((issue: { message: string }) => issue.message).join(', ');
      return errorResponse(errors, "VALIDATION_ERROR", 400);
    }

    const { productId, quantity } = validationResult.data;
    const cart = await addToCart(productId, quantity);
    
    return successResponse(cart, { message: "Item added to cart" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to add to cart";
    return errorResponse(message, "CART_ERROR", 400);
  }
}
