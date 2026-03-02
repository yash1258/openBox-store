import { prisma } from "@/lib/prisma";
import { Package, Star, MapPin, Calendar, Users, TrendingUp, MessageCircle } from "lucide-react";
import Image from "next/image";

interface SuccessStory {
  id: string;
  customerName: string;
  location: string;
  customerPhoto: string | null;
  productPhoto: string;
  productName: string;
  comment: string;
  rating: number;
  deliveredAt: Date;
  featured: boolean;
  product?: {
    id: string;
    name: string;
    category: string;
  } | null;
}

export default async function StoriesPage() {
  // Fetch stats
  const totalStories = await prisma.successStory.count({
    where: { published: true },
  });
  
  const featuredStories = await prisma.successStory.findMany({
    where: { published: true, featured: true },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  const recentStories = await prisma.successStory.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 12,
    include: {
      product: {
        select: {
          id: true,
          name: true,
          category: true,
        },
      },
    },
  });

  // Calculate average rating
  const allRatings = await prisma.successStory.findMany({
    where: { published: true },
    select: { rating: true },
  });
  const avgRating = allRatings.length > 0 
    ? (allRatings.reduce((sum, s) => sum + s.rating, 0) / allRatings.length).toFixed(1)
    : "0.0";

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

        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-12 lg:py-20">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="animate-fade-in-up inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Users className="h-4 w-4" />
              <span>{totalStories}+ Happy Customers</span>
            </div>

            <h1 className="animate-fade-in-up animation-delay-100 text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Real Customers,{' '}
              <span className="text-gradient">Real Deliveries</span>
            </h1>

            <p className="animate-fade-in-up animation-delay-200 text-base md:text-xl text-stone-300 mb-8 max-w-2xl mx-auto">
              See how our customers are saving big on premium tech products. Every photo is a verified delivery!
            </p>

            {/* Stats */}
            <div className="animate-fade-in-up animation-delay-300 grid grid-cols-3 gap-4 md:gap-8 max-w-lg mx-auto">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">{totalStories}+</div>
                <div className="text-xs md:text-sm text-stone-400">Deliveries</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <div className="text-2xl md:text-3xl font-bold text-emerald-400 mb-1 flex items-center justify-center gap-1">
                  {avgRating}
                  <Star className="h-4 w-4 md:h-5 md:w-5 fill-current" />
                </div>
                <div className="text-xs md:text-sm text-stone-400">Avg Rating</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <div className="text-2xl md:text-3xl font-bold text-amber-400 mb-1 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 md:h-7 md:w-7" />
                </div>
                <div className="text-xs md:text-sm text-stone-400">Verified</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Featured Stories Carousel */}
      {featuredStories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              <Star className="h-4 w-4 fill-current" />
              <span>Featured Stories</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-stone-900">
              What Our Customers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredStories.map((story: SuccessStory, index: number) => (
              <div
                key={story.id}
                className={`premium-card overflow-hidden stagger-${Math.min(index + 1, 6)} group hover:shadow-xl transition-all duration-300`}
              >
                {/* Product Photo */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={story.productPhoto}
                    alt={`${story.customerName}'s ${story.productName}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-1 text-amber-400 mb-1">
                      {[...Array(story.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-white font-semibold text-sm">{story.productName}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    {story.customerPhoto ? (
                      <img
                        src={story.customerPhoto}
                        alt={story.customerName}
                        className="w-10 h-10 rounded-full object-cover border-2 border-stone-100"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                        <span className="text-amber-700 font-bold text-sm">
                          {story.customerName.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-stone-900 text-sm">{story.customerName}</p>
                      <div className="flex items-center gap-1 text-stone-500 text-xs">
                        <MapPin className="h-3 w-3" />
                        <span>{story.location}</span>
                      </div>
                    </div>
                  </div>

                  <blockquote className="text-stone-600 text-sm leading-relaxed italic">
                    "{story.comment}"
                  </blockquote>

                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-stone-100">
                    <Calendar className="h-3.5 w-3.5 text-stone-400" />
                    <span className="text-xs text-stone-400">
                      Delivered {new Date(story.deliveredAt).toLocaleDateString('en-IN', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recent Deliveries Gallery */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16 bg-stone-50">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-medium mb-3">
              <Package className="h-4 w-4" />
              <span>Recent Deliveries</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-stone-900">
              Latest Happy Customers
            </h2>
            <p className="text-stone-500 mt-1">
              {recentStories.length} verified deliveries this month
            </p>
          </div>
        </div>

        {recentStories.length === 0 ? (
          <div className="premium-card p-12 text-center">
            <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-10 w-10 text-stone-300" />
            </div>
            <h3 className="text-xl font-semibold text-stone-900 mb-2">No stories yet</h3>
            <p className="text-stone-500">Be the first to share your success story!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recentStories.map((story: SuccessStory, index: number) => (
              <div
                key={story.id}
                className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 stagger-${Math.min(index + 1, 12)}`}
              >
                {/* Product Photo */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={story.productPhoto}
                    alt={story.productName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Verified Badge */}
                  <div className="absolute top-3 left-3 bg-emerald-500 text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Package className="h-3 w-3" />
                    <span>Delivered</span>
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-amber-600 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    <span>{story.rating}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {story.customerPhoto ? (
                      <img
                        src={story.customerPhoto}
                        alt={story.customerName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center">
                        <span className="text-stone-600 font-bold text-xs">
                          {story.customerName.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-stone-900 text-sm truncate">{story.customerName}</p>
                      <p className="text-xs text-stone-500 truncate">{story.location}</p>
                    </div>
                  </div>

                  <p className="font-semibold text-stone-900 text-sm mb-1 truncate">{story.productName}</p>

                  <p className="text-stone-500 text-xs line-clamp-2 leading-relaxed">
                    {story.comment}
                  </p>

                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-stone-100">
                    <Calendar className="h-3 w-3 text-stone-400" />
                    <span className="text-xs text-stone-400">
                      {new Date(story.deliveredAt).toLocaleDateString('en-IN', { 
                        month: 'short', 
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 md:px-6 py-16 md:py-20">
        <div className="premium-card p-8 md:p-12 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/30">
            <MessageCircle className="h-8 w-8 text-white" />
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-3">
            Share Your Story
          </h2>
          
          <p className="text-stone-500 mb-8 max-w-lg mx-auto">
            Have you received your product? We'd love to hear about your experience! Share a photo and help others discover great deals.
          </p>

          <a
            href="https://wa.me/919999999999?text=Hi! I received my order and would love to share my success story."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#128C7E] transition-all shadow-lg shadow-green-500/30"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Share on WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
