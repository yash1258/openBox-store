import { prisma } from "@/lib/prisma";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import { Package, Search, Sparkles, Shield, Clock, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";
import Filters from "@/components/Filters";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; condition?: string; q?: string }>;
}) {
  const { category: categoryParam, condition: conditionParam, q } = await searchParams;
  const category = categoryParam || "all";
  const condition = conditionParam || "all";
  const query = q || "";

  // Skip DB queries during build if no DATABASE_URL
  if (!process.env.DATABASE_URL) {
    return (
      <div className="min-h-screen bg-white pb-20 lg:pb-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-stone-500">Loading...</p>
        </div>
      </div>
    );
  }

  const where: Record<string, unknown> = { status: "available" };

  if (category !== "all") where.category = category;
  if (condition !== "all") where.condition = condition;
  if (query) {
    where.OR = [
      { name: { contains: query } },
      { description: { contains: query } },
    ];
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  const settings = await prisma.settings.findFirst();
  const whatsappNumber = settings?.whatsapp || "";

  return (
    <div className="min-h-screen bg-white pb-20 lg:pb-8">
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950">
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="floating-orb orb-1 top-0 -left-20 opacity-30" />
          <div className="floating-orb orb-2 top-1/2 -right-20 opacity-20" />
          <div className="floating-orb orb-3 bottom-0 left-1/3 opacity-15" />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />

        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-12 lg:py-24">
          <div className="max-w-3xl">
            {/* Animated Badge */}
            <div className="animate-fade-in-up inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4 animate-pulse" />
              <span>Verified Quality • Expert Inspected</span>
            </div>

            {/* Headline */}
            <h1 className="animate-fade-in-up animation-delay-100 text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Best Deals on{' '}
              <span className="text-gradient">Pre-Loved</span> Products
            </h1>

            <p className="animate-fade-in-up animation-delay-200 text-base md:text-xl text-stone-300 mb-8 max-w-xl">
              Discover premium openbox, like-new, and quality used products at unbeatable prices. Every item verified for quality.
            </p>

            {/* Search Bar - Premium */}
            <form className="animate-fade-in-up animation-delay-300 relative max-w-2xl">
              <div className="relative flex items-center">
                <div className="absolute left-4 text-stone-400">
                  <Search className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  name="q"
                  defaultValue={query}
                  placeholder="Search for iPhones, laptops, gadgets..."
                  className="w-full pl-12 pr-36 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-stone-400 text-base focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-2 btn-primary py-2.5 px-5 text-sm font-semibold rounded-xl"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Quick stats */}
            <div className="animate-fade-in-up animation-delay-400 flex flex-wrap items-center gap-6 mt-8 text-sm text-stone-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{products.length}+ Products Available</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-400" />
                <span>Instant WhatsApp Response</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Premium Trust Badges with Glassmorphism */}
      <section className="relative -mt-8 px-4 md:px-6 mb-8">
        <div className="max-w-5xl mx-auto">
          <div className="glass rounded-2xl p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
              <div className="flex items-center gap-4">
                <div className="icon-wrapper bg-emerald-100 rounded-xl p-3">
                  <Shield className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-stone-900">Quality Verified</p>
                  <p className="text-sm text-stone-500">Every product inspected</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="icon-wrapper bg-blue-100 rounded-xl p-3">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-stone-900">Quick Response</p>
                  <p className="text-sm text-stone-500">Fast WhatsApp support</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="icon-wrapper bg-amber-100 rounded-xl p-3">
                  <Package className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="font-semibold text-stone-900">Best Prices</p>
                  <p className="text-sm text-stone-500">Up to 50% savings</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <Filters category={category} condition={condition} />

      {/* Products Section */}
      <section className="max-w-7xl mx-auto px-3 md:px-6 py-6 md:py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 md:mb-10">
          <div>
            <h2 className="text-xl md:text-3xl font-bold text-stone-900">
              {category === "all" ? "Featured Products" : category}
            </h2>
            <p className="text-stone-500 mt-1">
              {products.length} {products.length === 1 ? 'product' : 'products'} available
            </p>
          </div>
        </div>

        {/* Grid */}
        {products.length === 0 ? (
          <div className="premium-card p-12 md:p-20 text-center">
            <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-10 w-10 text-stone-300" />
            </div>
            <h3 className="text-xl font-semibold text-stone-900 mb-2">
              No products found
            </h3>
            <p className="text-stone-500 max-w-md mx-auto">
              Try adjusting your filters or search for something else
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product, index) => {
              const images = JSON.parse(product.images || "[]");
              const discount = product.originalPrice
                ? Math.round(((product.originalPrice - product.sellingPrice) / product.originalPrice) * 100)
                : 0;

              return (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className={`product-card stagger-${Math.min(index + 1, 8)}`}
                >
                  {/* Image */}
                  <div className="aspect-square relative bg-stone-100 overflow-hidden">
                    {images.length > 0 ? (
                      <div className="image-container w-full h-full">
                        <img
                          src={images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-16 w-16 text-stone-200" />
                      </div>
                    )}

                    {/* Premium Badges */}
                    <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                      {discount > 0 && (
                        <span className="badge-discount">
                          {discount}% OFF
                        </span>
                      )}
                      <span className="bg-stone-900/80 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-lg capitalize font-medium">
                        {product.condition.replace("_", " ")}
                      </span>
                    </div>

                    {/* Quick view on hover */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="bg-white text-stone-900 px-4 py-2 rounded-full text-sm font-medium">
                        View Details
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-3 md:p-4">
                    <p className="text-xs font-medium text-amber-600 uppercase tracking-wider mb-1">
                      {product.category}
                    </p>
                    <h3 className="font-semibold text-stone-900 text-sm md:text-base mb-2 line-clamp-2 leading-tight">
                      {product.name}
                    </h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg md:text-xl font-bold text-stone-900">
                        ₹{product.sellingPrice.toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-stone-400 line-through">
                          ₹{(product.originalPrice / 1000).toFixed(1)}k
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Premium WhatsApp CTA */}
      {whatsappNumber && (
        <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50">
          <a
            href={generateWhatsAppLink(whatsappNumber, "Hi! I visited your OpenBox store.")}
            target="_blank"
            rel="noopener noreferrer"
            className="animate-pulse-glow flex items-center gap-3 bg-[#25D366] text-white px-5 md:px-7 py-3 md:py-4 rounded-full shadow-2xl hover:bg-[#128C7E] hover:shadow-2xl transition-all group"
          >
            <svg viewBox="0 0 24 24" className="h-6 md:h-8 w-6 md:w-8" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span className="text-sm md:text-base font-bold hidden sm:inline">Chat on WhatsApp</span>
            <span className="text-sm font-bold sm:hidden">Chat</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      )}
    </div>
  );
}
