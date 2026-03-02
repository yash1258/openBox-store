import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/analytics/live - Get live/real-time stats
export async function GET(request: NextRequest) {
  try {
    // Get today's date range
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const now = new Date();
    
    // Get today's stats
    const [
      pageViews,
      uniqueVisitors,
      productViews,
      cartAdds,
      orders,
    ] = await Promise.all([
      // Page views today
      prisma.analyticsEvent.count({
        where: {
          type: "page_view",
          createdAt: { gte: startOfDay },
        },
      }),
      // Unique visitors today
      prisma.analyticsEvent.groupBy({
        by: ["sessionId"],
        where: {
          createdAt: { gte: startOfDay },
        },
      }).then(sessions => sessions.length),
      // Product views today
      prisma.analyticsEvent.count({
        where: {
          type: "product_view",
          createdAt: { gte: startOfDay },
        },
      }),
      // Cart adds today
      prisma.analyticsEvent.count({
        where: {
          type: "cart_add",
          createdAt: { gte: startOfDay },
        },
      }),
      // Orders today
      prisma.order.count({
        where: {
          createdAt: { gte: startOfDay },
          status: { not: "CANCELLED" },
        },
      }),
    ]);
    
    // Get revenue
    const ordersData = await prisma.order.findMany({
      where: {
        createdAt: { gte: startOfDay },
        status: { not: "CANCELLED" },
      },
      select: { totalAmount: true },
    });
    const revenue = ordersData.reduce((sum, o) => sum + o.totalAmount, 0);
    
    // Get active carts (sessions with cart_add in last hour)
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const activeCartSessions = await prisma.analyticsEvent.groupBy({
      by: ["sessionId"],
      where: {
        type: "cart_add",
        createdAt: { gte: oneHourAgo },
      },
    });
    const activeCarts = activeCartSessions.length;
    
    // Calculate conversion rate
    const conversionRate = pageViews > 0 ? (orders / pageViews) * 100 : 0;
    
    // Get currently popular products (last 6 hours)
    const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000);
    const popularProducts = await prisma.analyticsEvent.groupBy({
      by: ["productId"],
      where: {
        type: "product_view",
        createdAt: { gte: sixHoursAgo },
        productId: { not: null },
      },
      _count: { productId: true },
      orderBy: { _count: { productId: "desc" } },
      take: 5,
    });
    
    const trendingProducts = await Promise.all(
      popularProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId! },
          select: { id: true, name: true, sellingPrice: true, images: true },
        });
        return {
          id: product?.id || item.productId!,
          name: product?.name || "Unknown Product",
          views: item._count.productId,
          price: product?.sellingPrice || 0,
          image: product?.images ? JSON.parse(product.images)[0] : null,
        };
      })
    );
    
    // Get recent activity (last 10 events)
    const recentActivity = await prisma.analyticsEvent.findMany({
      where: {
        createdAt: { gte: oneHourAgo },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        type: true,
        productId: true,
        createdAt: true,
      },
    });
    
    // Format recent activity
    const formattedActivity = await Promise.all(
      recentActivity.map(async (event) => {
        let description = "";
        switch (event.type) {
          case "page_view":
            description = "Page viewed";
            break;
          case "product_view":
            const product = event.productId ? await prisma.product.findUnique({
              where: { id: event.productId },
              select: { name: true },
            }) : null;
            description = product ? `Viewed ${product.name}` : "Product viewed";
            break;
          case "cart_add":
            description = "Added to cart";
            break;
          case "checkout_start":
            description = "Started checkout";
            break;
          case "order_complete":
            description = "Order completed";
            break;
          default:
            description = event.type.replace("_", " ");
        }
        return {
          type: event.type,
          description,
          time: event.createdAt,
        };
      })
    );
    
    return NextResponse.json({
      success: true,
      data: {
        today: {
          pageViews,
          uniqueVisitors,
          productViews,
          cartAdds,
          orders,
          revenue,
          activeCarts,
          conversionRate: Math.round(conversionRate * 100) / 100,
        },
        trendingProducts,
        recentActivity: formattedActivity,
        lastUpdated: now.toISOString(),
      },
    });
  } catch (error) {
    console.error("Live analytics error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get live analytics" },
      { status: 500 }
    );
  }
}
