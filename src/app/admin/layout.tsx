import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Package, LayoutDashboard, Settings, Tags, Upload, ArrowLeft, LogOut, Award, BarChart3, Activity } from "lucide-react";
import { getSession } from "@/lib/auth";
import AIChatWidget from "@/components/AIChat/ChatWidget";

export const metadata: Metadata = {
  title: "Seller Dashboard - OpenBox",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // If not logged in, redirect to login
  if (!session) {
    redirect("/login");
  }

  async function logout() {
    "use server";
    const { destroySession } = await import("@/lib/auth");
    await destroySession();
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-40">
        <div className="px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="p-1.5 hover:bg-stone-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-stone-600" />
              </Link>
              <div>
                <h1 className="text-lg font-bold text-stone-900">Seller Dashboard</h1>
                <p className="text-xs text-stone-500">{session.shopName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/admin/settings"
                className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
              >
                <Settings className="h-5 w-5 text-stone-600" />
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                >
                  <LogOut className="h-5 w-5 text-stone-600" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Tabs - Mobile horizontal scroll */}
        <div className="flex gap-1 px-2 pb-2 overflow-x-auto scrollbar-hide">
          <Link
            href="/admin"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors bg-stone-100 text-stone-900"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </Link>
          <Link
            href="/admin/analytics"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors text-stone-600 hover:bg-stone-100"
          >
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors text-stone-600 hover:bg-stone-100"
          >
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Products</span>
          </Link>
          <Link
            href="/admin/inventory"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors text-stone-600 hover:bg-stone-100"
          >
            <Tags className="h-4 w-4" />
            <span className="hidden sm:inline">Inventory</span>
          </Link>
          <Link
            href="/admin/categories"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors text-stone-600 hover:bg-stone-100"
          >
            <Tags className="h-4 w-4" />
            <span className="hidden sm:inline">Categories</span>
          </Link>
          <Link
            href="/admin/import"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors text-stone-600 hover:bg-stone-100"
          >
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Import</span>
          </Link>
          <Link
            href="/admin/stories"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors text-stone-600 hover:bg-stone-100"
          >
            <Award className="h-4 w-4" />
            <span className="hidden sm:inline">Stories</span>
          </Link>
          <Link
            href="/admin/reports"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors text-stone-600 hover:bg-stone-100"
          >
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Reports</span>
          </Link>
        </div>
      </header>

      <main className="p-4 pb-24">{children}</main>
      
      {/* AI Chat Widget */}
      <AIChatWidget />
    </div>
  );
}
