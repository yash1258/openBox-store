import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [total, available, reserved, sold, categories] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { status: "available" } }),
    prisma.product.count({ where: { status: "reserved" } }),
    prisma.product.count({ where: { status: "sold" } }),
    prisma.product.findMany({
      select: { category: true },
      distinct: ['category'],
    }),
  ]);

  return NextResponse.json({
    total,
    available,
    reserved,
    sold,
    categories: categories.map(c => c.category),
  });
}
