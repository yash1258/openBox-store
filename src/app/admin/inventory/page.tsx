import { prisma } from "@/lib/prisma";
import { Package, Plus, Check, X, Clock } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import CategoryFilter from "@/components/CategoryFilter";

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; category?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { status: statusParam, q, category: categoryParam } = await searchParams;
  const status = statusParam || "all";
  const query = q || "";
  const category = categoryParam || "all";

  const where: Record<string, unknown> = { sellerId: session.sellerId };

  if (status !== "all") where.status = status;
  if (category !== "all") where.category = category;
  if (query) {
    where.OR = [
      { name: { contains: query } },
      { description: { contains: query } },
    ];
  }

  const [products, totalCount, availableCount, reservedCount, soldCount, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where: { sellerId: session.sellerId } }),
    prisma.product.count({ where: { sellerId: session.sellerId, status: "available" } }),
    prisma.product.count({ where: { sellerId: session.sellerId, status: "reserved" } }),
    prisma.product.count({ where: { sellerId: session.sellerId, status: "sold" } }),
    prisma.product.findMany({
      where: { sellerId: session.sellerId },
      select: { category: true },
      distinct: ["category"],
    }),
  ]);

  const categoryList = categories.map((c) => c.category);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-stone-900">Inventory</h1>
          <p className="text-sm text-stone-500">Manage all your products</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 btn-primary"
        >
          <Plus className="h-5 w-5" />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {[
          { value: "all", label: "All", count: totalCount },
          { value: "available", label: "Available", count: availableCount },
          { value: "reserved", label: "Reserved", count: reservedCount },
          { value: "sold", label: "Sold", count: soldCount },
        ].map((s) => (
          <Link
            key={s.value}
            href={`/admin/inventory?status=${s.value}`}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              status === s.value
                ? 'bg-amber-600 text-white'
                : 'bg-white text-stone-600 border border-stone-200'
            }`}
          >
            <span>{s.label}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              status === s.value ? 'bg-white/20' : 'bg-stone-100'
            }`}>
              {s.count}
            </span>
          </Link>
        ))}
      </div>

      {/* Search & Filters */}
      <CategoryFilter categories={categoryList} />

      {/* Products List */}
      <div className="premium-card overflow-hidden">
        {products.length === 0 ? (
          <div className="p-8 text-center">
            <Package className="h-12 w-12 text-stone-300 mx-auto mb-3" />
            <h3 className="font-semibold text-stone-900 mb-1">No products found</h3>
            <p className="text-stone-500 text-sm mb-4">
              {query || status !== "all" ? "Try adjusting filters" : "Add your first product"}
            </p>
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 text-amber-600 font-medium text-sm"
            >
              <Plus className="h-4 w-4" /> Add Product
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {products.map((product) => {
              const images = JSON.parse(product.images || "[]");
              return (
                <Link
                  key={product.id}
                  href={`/admin/products/${product.id}`}
                  className="flex items-center gap-3 p-3 hover:bg-stone-50 transition-colors"
                >
                  {/* Image */}
                  <div className="w-14 h-14 bg-stone-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                    {images.length > 0 ? (
                      <img src={images[0]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Package className="h-6 w-6 text-stone-300" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-stone-900 text-sm truncate">{product.name}</p>
                      {product.status === "available" && (
                        <Check className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                      )}
                      {product.status === "reserved" && (
                        <Clock className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
                      )}
                      {product.status === "sold" && (
                        <X className="h-3.5 w-3.5 text-stone-400 flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-stone-500">
                      <span className="capitalize">{product.category}</span>
                      <span>•</span>
                      <span className="capitalize">{product.condition.replace("_", " ")}</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-stone-900">₹{product.sellingPrice.toLocaleString()}</p>
                    {product.originalPrice && (
                      <p className="text-xs text-stone-400 line-through">₹{product.originalPrice.toLocaleString()}</p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
