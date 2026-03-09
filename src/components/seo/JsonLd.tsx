"use client";

interface ProductJsonLdProps {
  product: {
    id: string;
    name: string;
    description?: string | null;
    sellingPrice: number;
    originalPrice?: number | null;
    images: string[];
    category: string;
    condition: string;
    status: string;
  };
  seller?: {
    shopName?: string;
    whatsapp?: string;
  };
}

export function ProductJsonLd({ product, seller }: ProductJsonLdProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://openbox-store.vercel.app";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || `${product.name} - ${product.condition.replace("_", " ")} condition`,
    image: product.images.length > 0 ? product.images : undefined,
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: product.category,
    },
    category: product.category,
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/product/${product.id}`,
      priceCurrency: "INR",
      price: product.sellingPrice.toString(),
      availability:
        product.status === "available"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition:
        product.condition === "new"
          ? "https://schema.org/NewCondition"
          : product.condition === "like_new"
          ? "https://schema.org/LikeNewCondition"
          : "https://schema.org/UsedCondition",
      seller: seller?.shopName
        ? {
            "@type": "Organization",
            name: seller.shopName,
          }
        : undefined,
    },
    ...(product.originalPrice && {
      priceSpecification: {
        "@type": "PriceSpecification",
        price: product.sellingPrice.toString(),
        priceCurrency: "INR",
        ...(product.originalPrice > product.sellingPrice && {
          minPrice: product.sellingPrice.toString(),
          maxPrice: product.originalPrice.toString(),
        }),
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}

// Organization structured data
export function OrganizationJsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://openbox-store.vercel.app";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "OpenBox Store",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description:
      "Premium open-box and pre-owned tech products at unbeatable prices",
    sameAs: [
      // Add social media URLs when available
      // "https://facebook.com/openboxstore",
      // "https://instagram.com/openboxstore",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      availableLanguage: ["English", "Hindi"],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}

// Website structured data with search
export function WebsiteJsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://openbox-store.vercel.app";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "OpenBox Store",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}
