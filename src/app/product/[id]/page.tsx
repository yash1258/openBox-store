import { prisma } from "@/lib/prisma";
import { generateWhatsAppLink, generateInquiryMessage } from "@/lib/whatsapp";
import { Package, ArrowLeft, Share2, MessageCircle, Shield, CheckCircle, Sparkles, Tag, Star, ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";
import { ProductTracker } from "@/components/ProductTracker";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    notFound();
  }

  const images = JSON.parse(product.images || "[]");
  const settings = await prisma.settings.findFirst();
  const whatsappNumber = settings?.whatsapp || "";
  const shopName = settings?.shopName || "OpenBox Store";

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.sellingPrice) / product.originalPrice) * 100)
    : 0;

  const inquiryMsg = generateInquiryMessage(product.name, product.sellingPrice, shopName);
  const shareMsg = `Check out: ${product.name} - ₹${product.sellingPrice}`;

  return (
    <div className="min-h-screen bg-stone-50 pb-24 lg:pb-8">
      {/* Track product view */}
      <ProductTracker productId={product.id} productName={product.name} />
      
      <div className="px-4 py-4 lg:py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-stone-500 hover:text-stone-700 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to products</span>
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Premium Image Gallery */}
          <div className="lg:w-3/5">
            {/* Main Image - Premium Card */}
            <div className="premium-card overflow-hidden aspect-square relative">
              {images.length > 0 ? (
                <img
                  src={images[0]}
                  alt={product.name}
                  className="w-full h-full object-contain bg-stone-50"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-stone-100">
                  <Package className="h-24 w-24 text-stone-200" />
                </div>
              )}

              {/* Premium Badges */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                {discount > 0 && (
                  <span className="badge-discount px-3 py-1.5 text-sm">
                    {discount}% OFF
                  </span>
                )}
                <span className="bg-stone-900/90 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full capitalize font-medium flex items-center gap-1.5">
                  <Shield className="h-3 w-3" />
                  {product.condition.replace("_", " ")}
                </span>
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2 -webkit-overflow-scrolling-touch">
                {images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 border-stone-200 flex-shrink-0 hover:border-amber-500 hover:shadow-md transition-all"
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Premium Details */}
          <div className="lg:w-2/5 space-y-6">
            {/* Breadcrumb & Category */}
            <div className="animate-fade-in-up">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="badge-premium flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {product.category}
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 className="animate-fade-in-up animation-delay-100 text-2xl md:text-3xl lg:text-4xl font-bold text-stone-900 leading-tight">
              {product.name}
            </h1>

            {/* Premium Price Card */}
            <div className="animate-fade-in-up animation-delay-200 premium-card p-5">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl md:text-4xl font-bold text-gradient">
                  ₹{product.sellingPrice.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-lg text-stone-400 line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  </>
                )}
              </div>
              {discount > 0 && (
                <p className="text-sm text-emerald-600 mt-2 flex items-center gap-1">
                  <Sparkles className="h-4 w-4" />
                  You save ₹{(product.originalPrice! - product.sellingPrice).toLocaleString()} ({discount}% off)
                </p>
              )}
            </div>

            {/* Amazon Rating */}
            {product.amazonRating && (
              <div className="animate-fade-in-up animation-delay-250 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="#FF9900">
                      <path d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.582l.315-.118c.138-.053.209-.053.276 0 .069.056.076.138.021.266-.219.506-.647.795-1.294.795-.674 0-1.245-.132-1.722-.395l-.342-.171c-2.79-1.395-5.79-2.093-9.006-2.093-2.774 0-5.457.513-8.05 1.54-.137.057-.229.064-.276.022-.046-.043-.058-.144-.035-.303v.002c.013-.088.044-.175.092-.258.056-.098.136-.174.241-.231l.015-.008zM11.6 22.6c-3.803 0-7.22-.967-10.248-2.9-.196-.126-.294-.22-.294-.28 0-.06.044-.1.132-.122 2.414-.609 4.705-1.756 6.873-3.442.17-.134.308-.2.412-.2.104 0 .208.066.312.2 1.67 1.93 3.57 3.38 5.702 4.35.146.07.246.13.3.18.054.05.08.106.08.168 0 .062-.06.122-.18.18-1.458.72-2.946 1.228-4.465 1.526-.838.164-1.664.246-2.477.246-.047 0-.083-.002-.113-.006z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.amazonRating!)
                                ? 'fill-amber-400 text-amber-400'
                                : i < product.amazonRating!
                                ? 'fill-amber-400/50 text-amber-400'
                                : 'fill-stone-200 text-stone-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-bold text-stone-900">{product.amazonRating}</span>
                      <span className="text-stone-500 text-sm">({product.amazonReviewCount?.toLocaleString()} reviews)</span>
                    </div>
                    <p className="text-xs text-stone-500 mt-1">Amazon rating for reference</p>
                  </div>
                  {product.amazonUrl && (
                    <a
                      href={product.amazonUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-amber-100 rounded-lg transition-colors"
                      title="View on Amazon"
                    >
                      <ExternalLink className="h-4 w-4 text-amber-700" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Availability Status */}
            <div className="animate-fade-in-up animation-delay-300 flex items-center gap-3">
              {product.status === "available" ? (
                <>
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm font-semibold text-emerald-700">Available for Purchase</span>
                </>
              ) : product.status === "reserved" ? (
                <>
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-sm font-semibold text-amber-700">Reserved</span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 rounded-full bg-stone-300" />
                  <span className="text-sm font-semibold text-stone-500">Sold Out</span>
                </>
              )}
            </div>

            {/* Premium Description Card */}
            {product.description && (
              <div className="animate-fade-in-up animation-delay-300 premium-card p-5">
                <h2 className="text-sm font-semibold text-stone-900 mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  Product Details
                </h2>
                <p className="text-sm text-stone-600 whitespace-pre-wrap leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Quick Info Grid */}
            <div className="animate-fade-in-up animation-delay-400 grid grid-cols-2 gap-3">
              <div className="glass p-4 rounded-xl">
                <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Category</p>
                <p className="text-sm font-semibold text-stone-900 mt-1">{product.category}</p>
              </div>
              <div className="glass p-4 rounded-xl">
                <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Condition</p>
                <p className="text-sm font-semibold text-stone-900 mt-1 capitalize">{product.condition.replace("_", " ")}</p>
              </div>
            </div>

            {/* Add to Cart Button */}
            {product.status === "available" && (
              <div className="animate-fade-in-up animation-delay-500 space-y-3 fixed bottom-0 left-0 right-0 p-4 bg-white lg:bg-transparent border-t border-stone-200 lg:border-0 z-30 safe-area-pt">
                <AddToCartButton 
                  productId={product.id} 
                  productName={product.name}
                  productPrice={product.sellingPrice}
                  className="w-full py-4 text-base" 
                />

                {whatsappNumber && (
                  <a
                    href={generateWhatsAppLink(whatsappNumber, inquiryMsg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary w-full py-3 text-sm flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Chat on WhatsApp</span>
                  </a>
                )}
              </div>
            )}

            {/* Trust Note */}
            {whatsappNumber && (
              <p className="animate-fade-in-up animation-delay-500 text-xs text-stone-500 text-center hidden lg:block">
                <CheckCircle className="h-3 w-3 inline mr-1" />
                Verified seller • Quick responses on WhatsApp
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
