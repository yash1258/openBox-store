// SEO and metadata utilities

export interface PageMetadata {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
  noIndex?: boolean;
}

export const defaultMetadata: PageMetadata = {
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
    "tech products",
    "discount electronics",
  ],
};

export function generateMetadata({
  title,
  description,
  keywords,
  ogImage,
  canonical,
  noIndex = false,
}: PageMetadata) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://openbox-store.vercel.app";
  const fullTitle = title === defaultMetadata.title ? title : `${title} | OpenBox Store`;

  return {
    title: fullTitle,
    description,
    keywords: keywords?.join(", "),
    robots: noIndex ? "noindex, nofollow" : "index, follow",
    openGraph: {
      title: fullTitle,
      description,
      url: canonical || baseUrl,
      siteName: "OpenBox Store",
      images: ogImage
        ? [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : [],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: ogImage ? [ogImage] : [],
    },
    alternates: {
      canonical: canonical || baseUrl,
    },
  };
}

// Generate product-specific metadata
export function generateProductMetadata(
  productName: string,
  productDescription: string,
  productPrice: number,
  productImage?: string,
  productId?: string
) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://openbox-store.vercel.app";

  return generateMetadata({
    title: `${productName} - Buy Now`,
    description: `${productDescription.substring(0, 155)}... Available at just ₹${productPrice.toLocaleString()}. Quality verified with warranty.`,
    keywords: [productName, "buy", "open box", "deal", "discount"],
    ogImage: productImage,
    canonical: productId ? `${baseUrl}/product/${productId}` : baseUrl,
  });
}
