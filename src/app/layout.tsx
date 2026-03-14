import type { Metadata } from "next";
import "./globals.css";
import { prisma } from "@/lib/prisma";
import { Package, Home, LayoutDashboard, Heart } from "lucide-react";
import Link from "next/link";
import { AuthProvider } from "@/components/AuthProvider";
import { CartProvider } from "@/context/CartContext";
import HeaderCartButton from "@/components/HeaderCartButton";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { generateMetadata } from "@/lib/seo";
import { OrganizationJsonLd, WebsiteJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = generateMetadata({
  title: "OpenBox Store - Premium Pre-owned Tech Products",
  description:
    "Discover premium open-box, like-new, and quality used tech products at unbeatable prices. Every item verified for quality. Best deals on iPhones, laptops, and gadgets.",
  keywords: [
    "open box",
    "pre-owned",
    "refurbished",
    "used electronics",
    "iPhone deals",
    "laptop deals",
  ],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch settings
  let settings = null;
  try {
    settings = await prisma.settings.findFirst();
  } catch (error) {
    console.error('Failed to fetch settings:', error);
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-[var(--background)] text-stone-900">
        <AuthProvider>
          <CartProvider>
            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200">
              <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                  {/* Logo */}
                  <Link href="/" className="flex items-center gap-3 group">
                    <div className="p-2 bg-amber-600 rounded-xl group-hover:bg-amber-700 transition-colors">
                      <Package className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-stone-800">
                      {settings?.shopName || "OpenBox"}
                    </span>
                  </Link>

                  {/* Desktop Nav Links */}
                  <div className="hidden lg:flex items-center gap-2">
                    <Link
                      href="/"
                      className="px-5 py-2.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl font-medium transition-all"
                    >
                      Browse
                    </Link>
                    <Link
                      href="/stories"
                      className="px-5 py-2.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl font-medium transition-all flex items-center gap-1.5"
                    >
                      <Heart className="h-4 w-4" />
                      Stories
                    </Link>
                    <HeaderCartButton />
                    <Link
                      href="/admin"
                      className="px-5 py-2.5 bg-stone-900 text-white hover:bg-stone-800 rounded-xl font-medium transition-all"
                    >
                      Seller Dashboard
                    </Link>
                  </div>

                  {/* Mobile Menu Button */}
                  <div className="flex items-center gap-2 lg:hidden">
                    <Link
                      href="/admin"
                      className="p-2 text-stone-600 hover:bg-stone-100 rounded-lg"
                    >
                      <LayoutDashboard className="h-5 w-5" />
                    </Link>
                    <Link
                      href="/"
                      className="p-2 text-stone-600 hover:bg-stone-100 rounded-lg"
                    >
                      <Home className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </nav>

            <main className="min-h-screen">{children}</main>

            {/* Mobile Bottom Navigation */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 z-40 safe-area-pb shadow-lg">
              <div className="flex items-center justify-around h-16">
                <Link
                  href="/"
                  className="flex flex-col items-center justify-center flex-1 h-full text-stone-600 hover:text-amber-600 transition-colors"
                >
                  <Home className="h-6 w-6" />
                  <span className="text-xs mt-1 font-medium">Home</span>
                </Link>
                
                {/* Cart Button - Mobile */}
                <div className="flex flex-col items-center justify-center flex-1 h-full">
                  <HeaderCartButton />
                  <span className="text-xs mt-1 font-medium text-stone-600">Cart</span>
                </div>
                
                <Link
                  href="/admin"
                  className="flex flex-col items-center justify-center flex-1 h-full text-stone-600 hover:text-amber-600 transition-colors"
                >
                  <LayoutDashboard className="h-6 w-6" />
                  <span className="text-xs mt-1 font-medium">Seller</span>
                </Link>
              </div>
            </div>

            {/* Spacer for mobile nav */}
            <div className="lg:hidden h-16" />

            {/* Footer - Desktop Only */}
            <footer className="hidden lg:block bg-stone-900 text-stone-400 py-8">
              <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-stone-500" />
                    <span className="font-semibold text-stone-200">
                      {settings?.shopName || "OpenBox Store"}
                    </span>
                  </div>
                  <p className="text-sm">
                    Quality openbox & used products at great prices
                  </p>
                </div>
              </div>
            </footer>
            
            {/* SEO Structured Data */}
            <OrganizationJsonLd />
            <WebsiteJsonLd />
            
            {/* Analytics Tracker - Invisible tracking component */}
            <AnalyticsTracker />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
