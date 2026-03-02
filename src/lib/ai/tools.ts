// AI Tools - Define available functions for the AI assistant
// These tools allow the AI to fetch real data from the database

import { prisma } from "@/lib/prisma";

// Tool definitions for OpenRouter function calling
export const AI_TOOLS = [
  {
    type: "function",
    function: {
      name: "get_live_stats",
      description: "Get real-time store statistics for today (page views, orders, revenue, etc.)",
      parameters: {
        type: "object",
        properties: {},
        required: []
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_inventory_summary",
      description: "Get current inventory summary including total products, available stock, and low stock alerts",
      parameters: {
        type: "object",
        properties: {
          includeLowStock: {
            type: "boolean",
            description: "Whether to include low stock products in the response",
            default: true
          }
        }
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_daily_report",
      description: "Get the daily report for a specific date (revenue, orders, conversion rates, top products)",
      parameters: {
        type: "object",
        properties: {
          date: {
            type: "string",
            description: "Date in YYYY-MM-DD format. Use 'yesterday' for yesterday's report.",
            default: "today"
          }
        }
      }
    }
  },
  {
    type: "function",
    function: {
      name: "search_products",
      description: "Search for products in the inventory by name, category, or status",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Search term (product name, category, etc.)"
          },
          status: {
            type: "string",
            enum: ["available", "sold", "reserved", "all"],
            description: "Filter by product status",
            default: "all"
          },
          limit: {
            type: "number",
            description: "Maximum number of results",
            default: 10
          }
        },
        required: ["query"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_trending_products",
      description: "Get the most viewed products in the last 6 hours (trending items)",
      parameters: {
        type: "object",
        properties: {
          limit: {
            type: "number",
            description: "Number of trending products to return",
            default: 5
          }
        }
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_recent_orders",
      description: "Get recent orders from today or the last few days",
      parameters: {
        type: "object",
        properties: {
          days: {
            type: "number",
            description: "Number of days to look back",
            default: 1
          },
          limit: {
            type: "number",
            description: "Maximum number of orders to return",
            default: 10
          }
        }
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_sales_comparison",
      description: "Compare sales between two time periods (e.g., this week vs last week)",
      parameters: {
        type: "object",
        properties: {
          period1: {
            type: "string",
            enum: ["today", "yesterday", "week", "last_week", "month", "last_month"],
            description: "First period to compare"
          },
          period2: {
            type: "string",
            enum: ["today", "yesterday", "week", "last_week", "month", "last_month"],
            description: "Second period to compare"
          }
        },
        required: ["period1", "period2"]
      }
    }
  }
];

// Tool implementations
export async function getLiveStats() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [
    pageViews,
    uniqueVisitors,
    productViews,
    cartAdds,
    orders,
  ] = await Promise.all([
    prisma.analyticsEvent.count({
      where: { type: "page_view", createdAt: { gte: startOfDay } },
    }),
    prisma.analyticsEvent.groupBy({
      by: ["sessionId"],
      where: { createdAt: { gte: startOfDay } },
    }).then(sessions => sessions.length),
    prisma.analyticsEvent.count({
      where: { type: "product_view", createdAt: { gte: startOfDay } },
    }),
    prisma.analyticsEvent.count({
      where: { type: "cart_add", createdAt: { gte: startOfDay } },
    }),
    prisma.order.count({
      where: { createdAt: { gte: startOfDay }, status: { not: "CANCELLED" } },
    }),
  ]);

  const ordersData = await prisma.order.findMany({
    where: { createdAt: { gte: startOfDay }, status: { not: "CANCELLED" } },
    select: { totalAmount: true },
  });
  const revenue = ordersData.reduce((sum, o) => sum + o.totalAmount, 0);

  return {
    pageViews,
    uniqueVisitors,
    productViews,
    cartAdds,
    orders,
    revenue,
    conversionRate: pageViews > 0 ? ((orders / pageViews) * 100).toFixed(2) : 0,
  };
}

export async function getInventorySummary(includeLowStock: boolean = true) {
  const [
    totalProducts,
    availableProducts,
    lowStockProducts,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { status: "available" } }),
    includeLowStock ? prisma.product.findMany({
      where: { status: "available", stockQuantity: { lte: 3 } },
      select: { id: true, name: true, stockQuantity: true },
      orderBy: { stockQuantity: "asc" },
      take: 10,
    }) : Promise.resolve([]),
  ]);

  const available = await prisma.product.findMany({
    where: { status: "available" },
    select: { sellingPrice: true, stockQuantity: true },
  });
  const totalValue = available.reduce((sum, p) => sum + (p.sellingPrice * p.stockQuantity), 0);

  return {
    totalProducts,
    availableProducts,
    totalValue,
    lowStockCount: lowStockProducts.length,
    lowStockProducts: lowStockProducts.map(p => ({
      id: p.id,
      name: p.name,
      stock: p.stockQuantity,
    })),
  };
}

export async function getDailyReport(date: string = "today") {
  let targetDate: Date;
  
  if (date === "today") {
    targetDate = new Date();
  } else if (date === "yesterday") {
    targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - 1);
  } else {
    targetDate = new Date(date);
  }
  
  targetDate.setHours(0, 0, 0, 0);

  const report = await prisma.dailyReport.findUnique({
    where: { date: targetDate },
  });

  if (!report) {
    return null;
  }

  return {
    date: report.date.toDateString(),
    orders: report.orders,
    revenue: report.revenue,
    visitors: report.uniqueVisitors,
    pageViews: report.pageViews,
    conversionRate: report.overallConversionRate,
    topProducts: JSON.parse(report.topViewedProducts || "[]"),
    lowStockAlerts: JSON.parse(report.lowStockAlerts || "[]"),
  };
}

export async function searchProducts(query: string, status: string = "all", limit: number = 10) {
  const where: any = {
    OR: [
      { name: { contains: query, mode: "insensitive" } },
      { category: { contains: query, mode: "insensitive" } },
    ],
  };

  if (status !== "all") {
    where.status = status;
  }

  const products = await prisma.product.findMany({
    where,
    select: {
      id: true,
      name: true,
      category: true,
      status: true,
      sellingPrice: true,
      stockQuantity: true,
    },
    take: limit,
  });

  return products;
}

export async function getTrendingProducts(limit: number = 5) {
  const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
  
  const popularProducts = await prisma.analyticsEvent.groupBy({
    by: ["productId"],
    where: {
      type: "product_view",
      createdAt: { gte: sixHoursAgo },
      productId: { not: null },
    },
    _count: { productId: true },
    orderBy: { _count: { productId: "desc" } },
    take: limit,
  });

  const products = await Promise.all(
    popularProducts.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId! },
        select: { id: true, name: true, sellingPrice: true },
      });
      return {
        id: product?.id || item.productId!,
        name: product?.name || "Unknown Product",
        views: item._count.productId,
        price: product?.sellingPrice || 0,
      };
    })
  );

  return products;
}

export async function getRecentOrders(days: number = 1, limit: number = 10) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: startDate },
      status: { not: "CANCELLED" },
    },
    select: {
      id: true,
      customerName: true,
      totalAmount: true,
      status: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return orders;
}

export async function getSalesComparison(period1: string, period2: string) {
  // Helper to get date range
  const getDateRange = (period: string) => {
    const end = new Date();
    const start = new Date();
    
    switch (period) {
      case "today":
        start.setHours(0, 0, 0, 0);
        break;
      case "yesterday":
        start.setDate(start.getDate() - 1);
        start.setHours(0, 0, 0, 0);
        end.setDate(end.getDate() - 1);
        end.setHours(23, 59, 59, 999);
        break;
      case "week":
        start.setDate(start.getDate() - 7);
        break;
      case "last_week":
        start.setDate(start.getDate() - 14);
        end.setDate(end.getDate() - 7);
        break;
      case "month":
        start.setDate(start.getDate() - 30);
        break;
      case "last_month":
        start.setDate(start.getDate() - 60);
        end.setDate(end.getDate() - 30);
        break;
    }
    
    return { start, end };
  };

  const range1 = getDateRange(period1);
  const range2 = getDateRange(period2);

  const [data1, data2] = await Promise.all([
    prisma.order.findMany({
      where: {
        createdAt: { gte: range1.start, lte: range1.end },
        status: { not: "CANCELLED" },
      },
      select: { totalAmount: true },
    }),
    prisma.order.findMany({
      where: {
        createdAt: { gte: range2.start, lte: range2.end },
        status: { not: "CANCELLED" },
      },
      select: { totalAmount: true },
    }),
  ]);

  const stats1 = {
    orders: data1.length,
    revenue: data1.reduce((sum, o) => sum + o.totalAmount, 0),
  };

  const stats2 = {
    orders: data2.length,
    revenue: data2.reduce((sum, o) => sum + o.totalAmount, 0),
  };

  const revenueChange = stats2.revenue > 0 
    ? (((stats1.revenue - stats2.revenue) / stats2.revenue) * 100).toFixed(1)
    : 0;

  return {
    period1: { ...stats1, period: period1 },
    period2: { ...stats2, period: period2 },
    revenueChange: parseFloat(revenueChange as string),
  };
}
