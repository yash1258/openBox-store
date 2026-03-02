import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireApiKey, successResponse } from "@/lib/api-auth";

// GET /api/stats - Comprehensive inventory and sales statistics
export async function GET(request: NextRequest) {
  const authError = await requireApiKey(request);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const sellerId = searchParams.get("sellerId");

  const where = sellerId ? { sellerId } : {};

  // Get basic counts
  const [total, available, reserved, sold] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.count({ where: { ...where, status: "available" } }),
    prisma.product.count({ where: { ...where, status: "reserved" } }),
    prisma.product.count({ where: { ...where, status: "sold" } }),
  ]);

  // Get category breakdown
  const categoryData = await prisma.product.groupBy({
    by: ["category"],
    _count: { id: true },
    where: { ...where, status: "available" },
  });

  const categories = categoryData.map((c) => ({
    name: c.category,
    count: c._count.id,
  }));

  // Get condition breakdown
  const conditionData = await prisma.product.groupBy({
    by: ["condition"],
    _count: { id: true },
    where,
  });

  const conditions = conditionData.map((c) => ({
    name: c.condition,
    count: c._count.id,
  }));

  // Calculate inventory value
  const availableProducts = await prisma.product.findMany({
    where: { ...where, status: "available" },
    select: { sellingPrice: true, originalPrice: true },
  });

  const totalValue = availableProducts.reduce((sum, p) => sum + p.sellingPrice, 0);
  const totalOriginalValue = availableProducts.reduce(
    (sum, p) => sum + (p.originalPrice || p.sellingPrice),
    0
  );
  const potentialSavings = totalOriginalValue - totalValue;

  // Recent activity
  const recentProducts = await prisma.product.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    take: 5,
    select: {
      id: true,
      name: true,
      status: true,
      updatedAt: true,
    },
  });

  // Sold products value (revenue)
  const soldProducts = await prisma.product.findMany({
    where: { ...where, status: "sold" },
    select: { sellingPrice: true },
  });

  const totalRevenue = soldProducts.reduce((sum, p) => sum + p.sellingPrice, 0);

  return successResponse({
    inventory: {
      total,
      available,
      reserved,
      sold,
    },
    categories,
    conditions,
    financials: {
      totalInventoryValue: totalValue,
      potentialSavingsForBuyers: potentialSavings,
      totalRevenue,
      averageProductPrice: total > 0 ? totalValue / available : 0,
    },
    recentActivity: recentProducts.map((p) => ({
      id: p.id,
      name: p.name,
      status: p.status,
      lastUpdated: p.updatedAt,
    })),
  });
}
