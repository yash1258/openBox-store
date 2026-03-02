import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/analytics/inventory - Get inventory stats
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lowStock = searchParams.get("lowStock") === "true";
    
    // Basic inventory counts
    const [
      totalProducts,
      availableProducts,
      reservedProducts,
      soldProducts,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { status: "available" } }),
      prisma.product.count({ where: { status: "reserved" } }),
      prisma.product.count({ where: { status: "sold" } }),
    ]);
    
    // Inventory value
    const available = await prisma.product.findMany({
      where: { status: "available" },
      select: { 
        id: true,
        name: true,
        sellingPrice: true,
        originalPrice: true,
        stockQuantity: true,
        category: true,
        images: true,
      },
    });
    
    const totalValue = available.reduce((sum, p) => sum + (p.sellingPrice * p.stockQuantity), 0);
    const totalOriginalValue = available.reduce(
      (sum, p) => sum + ((p.originalPrice || p.sellingPrice) * p.stockQuantity),
      0
    );
    const potentialSavings = totalOriginalValue - totalValue;
    
    // Category breakdown
    const categoryData = await prisma.product.groupBy({
      by: ["category"],
      where: { status: "available" },
      _count: { id: true },
      _sum: { sellingPrice: true },
    });
    
    const categories = categoryData.map((c) => ({
      name: c.category,
      count: c._count.id,
      value: c._sum.sellingPrice || 0,
    }));
    
    // Low stock products
    const lowStockProducts = lowStock
      ? await prisma.product.findMany({
          where: {
            status: "available",
            stockQuantity: { lte: 3 },
          },
          select: {
            id: true,
            name: true,
            stockQuantity: true,
            sellingPrice: true,
            category: true,
            images: true,
          },
          orderBy: { stockQuantity: "asc" },
          take: 20,
        })
      : [];
    
    // Top viewed products (from ProductStats)
    const topViewed = await prisma.productStats.findMany({
      orderBy: { viewsWeek: "desc" },
      take: 5,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sellingPrice: true,
            stockQuantity: true,
            images: true,
          },
        },
      },
    });
    
    return NextResponse.json({
      success: true,
      data: {
        overview: {
          total: totalProducts,
          available: availableProducts,
          reserved: reservedProducts,
          sold: soldProducts,
        },
        value: {
          totalValue,
          totalOriginalValue,
          potentialSavings,
        },
        categories,
        lowStock: lowStockProducts.map((p) => ({
          id: p.id,
          name: p.name,
          stock: p.stockQuantity,
          price: p.sellingPrice,
          category: p.category,
          image: p.images ? JSON.parse(p.images)[0] : null,
        })),
        topViewed: topViewed
          .filter((s) => s.product)
          .map((s) => ({
            id: s.product!.id,
            name: s.product!.name,
            views: s.viewsWeek,
            price: s.product!.sellingPrice,
            stock: s.product!.stockQuantity,
            image: s.product!.images ? JSON.parse(s.product!.images)[0] : null,
          })),
      },
    });
  } catch (error) {
    console.error("Inventory analytics error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get inventory analytics" },
      { status: 500 }
    );
  }
}
