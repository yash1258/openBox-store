import { prisma } from "@/lib/prisma";
import { Package, DollarSign, ShoppingCart, TrendingUp, ArrowRight, Plus, Zap, Users } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function AdminDashboard() {
  // Check if any seller exists - if not, redirect to setup
  const sellerCount = await prisma.seller.count();

  if (sellerCount === 0) {
    redirect("/setup");
  }

  // Get current session
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const totalProducts = await prisma.product.count({
    where: { sellerId: session.sellerId },
  });
  const availableProducts = await prisma.product.count({
    where: { sellerId: session.sellerId, status: "available" },
  });
  const soldProducts = await prisma.product.count({
    where: { sellerId: session.sellerId, status: "sold" },
  });
  const reservedProducts = await prisma.product.count({
    where: { sellerId: session.sellerId, status: "reserved" },
  });

  const available = await prisma.product.findMany({
    where: { sellerId: session.sellerId, status: "available" },
    select: { sellingPrice: true, originalPrice: true },
  });
  const inventoryValue = available.reduce((sum, p) => sum + p.sellingPrice, 0);
  const originalValue = available.reduce((sum, p) => sum + (p.originalPrice || p.sellingPrice), 0);
  const potentialSavings = originalValue - inventoryValue;

  // Recent activity
  const recentProducts = await prisma.product.findMany({
    where: { sellerId: session.sellerId },
    orderBy: { updatedAt: "desc" },
    take: 5,
  });

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="animate-fade-in-up">
        <h1 className="text-2xl md:text-3xl font-bold text-stone-900">Dashboard</h1>
        <p className="text-stone-500 mt-1">Welcome back, {session.name}</p>
      </div>

      {/* Premium Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="stat-card stagger-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Total Products</p>
              <p className="text-2xl md:text-3xl font-bold text-stone-900 mt-1">{totalProducts}</p>
            </div>
            <div className="icon-wrapper bg-amber-100">
              <Package className="h-5 w-5 text-amber-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs text-emerald-600">
            <TrendingUp className="h-3 w-3" />
            <span>Active inventory</span>
          </div>
        </div>

        <div className="stat-card stagger-2">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Available</p>
              <p className="text-2xl md:text-3xl font-bold text-emerald-600 mt-1">{availableProducts}</p>
            </div>
            <div className="icon-wrapper bg-emerald-100">
              <ShoppingCart className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs text-stone-400">
            <span>Ready to sell</span>
          </div>
        </div>

        <div className="stat-card stagger-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Reserved</p>
              <p className="text-2xl md:text-3xl font-bold text-amber-600 mt-1">{reservedProducts}</p>
            </div>
            <div className="icon-wrapper bg-amber-100">
              <Zap className="h-5 w-5 text-amber-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs text-stone-400">
            <span>Awaiting pickup</span>
          </div>
        </div>

        <div className="stat-card stagger-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Inventory Value</p>
              <p className="text-2xl md:text-3xl font-bold text-stone-900 mt-1">₹{(inventoryValue / 1000).toFixed(1)}k</p>
            </div>
            <div className="icon-wrapper bg-blue-100">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs text-emerald-600">
            <Zap className="h-3 w-3" />
            <span>₹{(potentialSavings / 1000).toFixed(1)}k savings for buyers</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/admin/products/new"
          className="premium-card p-5 flex items-center justify-between group hover:border-amber-200"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-stone-900">Add Product</h3>
              <p className="text-sm text-stone-500">List a new item for sale</p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-stone-300 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          href="/admin/import"
          className="premium-card p-5 flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-stone-600 to-stone-700 rounded-xl flex items-center justify-center">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-stone-900">Import Products</h3>
              <p className="text-sm text-stone-500">Bulk upload from CSV</p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-stone-300 group-hover:text-stone-600 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>

      {/* Recent Products */}
      <div className="premium-card overflow-hidden">
        <div className="p-4 md:p-5 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-stone-900">Recent Updates</h2>
            <p className="text-sm text-stone-500">Latest changes to your inventory</p>
          </div>
          <Link
            href="/admin/products"
            className="text-sm text-amber-600 font-medium flex items-center gap-1 hover:gap-2 transition-all"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {recentProducts.length === 0 ? (
          <div className="p-8 md:p-12 text-center">
            <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-stone-300" />
            </div>
            <h3 className="font-semibold text-stone-900 mb-2">No products yet</h3>
            <p className="text-stone-500 text-sm mb-4">Start by adding your first product</p>
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 text-amber-600 font-medium text-sm hover:gap-3 transition-all"
            >
              <Plus className="h-4 w-4" /> Add Product
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-stone-50">
            {recentProducts.map((product, index) => (
              <Link
                key={product.id}
                href={`/admin/products/${product.id}`}
                className={`stagger-${Math.min(index + 1, 6)} flex items-center gap-4 p-4 hover:bg-stone-50 transition-colors`}
              >
                <div className="w-14 h-14 bg-stone-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                  {product.images && JSON.parse(product.images).length > 0 ? (
                    <img
                      src={JSON.parse(product.images)[0]}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package className="h-6 w-6 text-stone-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-stone-900 text-sm truncate">{product.name}</p>
                  <p className="text-xs text-stone-500 capitalize">{product.category} • {product.condition.replace("_", " ")}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-stone-900">₹{product.sellingPrice.toLocaleString()}</p>
                  <span className={`text-xs ${
                    product.status === 'available' ? 'text-emerald-600' :
                    product.status === 'reserved' ? 'text-amber-600' : 'text-stone-400'
                  }`}>
                    {product.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Info */}
      <div className="premium-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center">
            <Users className="h-5 w-5 text-stone-600" />
          </div>
          <div>
            <h3 className="font-semibold text-stone-900">Store Information</h3>
            <p className="text-sm text-stone-500">Your seller profile</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-stone-500">Store Name</p>
            <p className="font-medium text-stone-900">{session.shopName}</p>
          </div>
          <div>
            <p className="text-stone-500">Email</p>
            <p className="font-medium text-stone-900">{session.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
