import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Valid event types
const VALID_EVENT_TYPES = [
  "page_view",
  "product_view",
  "cart_add",
  "cart_remove",
  "cart_abandon",
  "search",
  "checkout_start",
  "checkout_complete",
  "order_complete",
  "product_click",
  "filter_use",
] as const;

type EventType = (typeof VALID_EVENT_TYPES)[number];

interface TrackRequest {
  type: EventType;
  productId?: string;
  metadata?: Record<string, unknown>;
}

// Generate or get session ID from cookie
function getSessionId(request: NextRequest): string {
  const sessionCookie = request.cookies.get("analytics_session");
  if (sessionCookie) {
    return sessionCookie.value;
  }
  // Generate new session ID
  return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// POST /api/analytics/track - Track an analytics event
export async function POST(request: NextRequest) {
  try {
    const body: TrackRequest = await request.json();

    // Validate event type
    if (!VALID_EVENT_TYPES.includes(body.type)) {
      return NextResponse.json(
        { success: false, error: "Invalid event type" },
        { status: 400 }
      );
    }

    // Get or create session ID
    const sessionId = getSessionId(request);

    // Create event
    const event = await prisma.analyticsEvent.create({
      data: {
        type: body.type,
        sessionId,
        productId: body.productId || null,
        metadata: JSON.stringify(body.metadata || {}),
      },
    });

    // Update product stats if it's a product-related event
    if (body.productId && ["product_view", "cart_add"].includes(body.type)) {
      await updateProductStats(body.productId, body.type);
    }

    // Create cart event if cart-related
    if (["cart_add", "cart_remove", "cart_abandon"].includes(body.type)) {
      await createCartEvent(body, sessionId);
    }

    // Set session cookie if new
    const response = NextResponse.json({
      success: true,
      data: { eventId: event.id },
    });

    // Set session cookie (30 days)
    response.cookies.set("analytics_session", sessionId, {
      maxAge: 30 * 24 * 60 * 60,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Analytics tracking error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to track event" },
      { status: 500 }
    );
  }
}

// Update product statistics
async function updateProductStats(productId: string, eventType: string) {
  try {
    // Use upsert to handle race conditions (atomic operation)
    const isView = eventType === "product_view";
    const isCartAdd = eventType === "cart_add";
    
    await prisma.productStats.upsert({
      where: { productId },
      create: {
        productId,
        viewsToday: isView ? 1 : 0,
        viewsWeek: isView ? 1 : 0,
        viewsMonth: isView ? 1 : 0,
        cartAdds: isCartAdd ? 1 : 0,
        lastViewedAt: new Date(),
      },
      update: {
        lastViewedAt: new Date(),
        ...(isView && {
          viewsToday: { increment: 1 },
          viewsWeek: { increment: 1 },
          viewsMonth: { increment: 1 },
        }),
        ...(isCartAdd && {
          cartAdds: { increment: 1 },
        }),
      },
    });
  } catch (error) {
    console.error("Error updating product stats:", error);
  }
}

// Create cart event
async function createCartEvent(body: TrackRequest, sessionId: string) {
  try {
    const metadata = body.metadata || {};
    
    await prisma.cartEvent.create({
      data: {
        sessionId,
        eventType: body.type.replace("cart_", ""), // add, remove, abandon
        productId: body.productId || null,
        productName: metadata.productName as string || null,
        quantity: metadata.quantity as number || 1,
        price: metadata.price as number || 0,
        cartValue: metadata.cartValue as number || 0,
      },
    });
  } catch (error) {
    console.error("Error creating cart event:", error);
  }
}

// GET /api/analytics/events - Get recent events (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
    const type = searchParams.get("type");

    const where = type ? { type } : {};

    const events = await prisma.analyticsEvent.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({
      success: true,
      data: events,
      meta: { count: events.length },
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
