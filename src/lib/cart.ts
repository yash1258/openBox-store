import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import crypto from "crypto";

const CART_COOKIE = "cart_session";
const CART_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  sellingPrice: number;
  quantity: number;
  images: string[];
}

export interface Cart {
  id: string;
  items: CartItem[];
  total: number;
  itemCount: number;
}

async function getOrCreateCartSession(): Promise<string> {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get(CART_COOKIE)?.value;
  
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    cookieStore.set(CART_COOKIE, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: CART_DURATION,
      path: "/",
    });
  }
  
  return sessionId;
}

export async function getCart(): Promise<Cart> {
  const sessionId = await getOrCreateCartSession();
  
  const cart = await prisma.cart.findUnique({
    where: { sessionId },
    include: {
      items: {
        include: {
          product: {
            select: {
              name: true,
              sellingPrice: true,
              images: true,
              status: true,
            },
          },
        },
      },
    },
  });

  if (!cart) {
    return {
      id: sessionId,
      items: [],
      total: 0,
      itemCount: 0,
    };
  }

  const items = cart.items
    .filter((item) => item.product.status === "available")
    .map((item) => ({
      id: item.id,
      productId: item.productId,
      name: item.product.name,
      sellingPrice: item.product.sellingPrice,
      quantity: item.quantity,
      images: JSON.parse(item.product.images || "[]"),
    }));

  const total = items.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    id: cart.id,
    items,
    total,
    itemCount,
  };
}

export async function addToCart(productId: string, quantity: number = 1): Promise<Cart> {
  const sessionId = await getOrCreateCartSession();
  
  // Check product availability
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product || product.status !== "available") {
    throw new Error("Product not available");
  }

  // Get or create cart
  let cart = await prisma.cart.findUnique({
    where: { sessionId },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { sessionId },
    });
  }

  // Check if item already exists
  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productId,
    },
  });

  if (existingItem) {
    // Update quantity
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
  } else {
    // Create new item
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
    });
  }

  return getCart();
}

export async function updateCartItem(itemId: string, quantity: number): Promise<Cart> {
  const sessionId = await getOrCreateCartSession();
  
  const cart = await prisma.cart.findUnique({
    where: { sessionId },
  });

  if (!cart) {
    throw new Error("Cart not found");
  }

  if (quantity <= 0) {
    await prisma.cartItem.delete({
      where: { id: itemId },
    });
  } else {
    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  }

  return getCart();
}

export async function removeFromCart(itemId: string): Promise<Cart> {
  const sessionId = await getOrCreateCartSession();
  
  const cart = await prisma.cart.findUnique({
    where: { sessionId },
  });

  if (!cart) {
    throw new Error("Cart not found");
  }

  await prisma.cartItem.delete({
    where: { id: itemId },
  });

  return getCart();
}

export async function clearCart(): Promise<void> {
  const sessionId = await getOrCreateCartSession();
  
  const cart = await prisma.cart.findUnique({
    where: { sessionId },
  });

  if (cart) {
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
  }
}
