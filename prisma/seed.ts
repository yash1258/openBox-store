import { PrismaClient } from "@prisma/client";
import { hashPassword } from "@/lib/auth";

const prisma = new PrismaClient();

const products = [
  {
    name: "iPhone 14 Pro Max 256GB",
    description: "Deep Purple, 85% battery health, original box missing but includes charger and cable. Minor scratch on back.",
    category: "Mobiles",
    condition: "like_new",
    originalPrice: 139999,
    sellingPrice: 89999,
    images: JSON.stringify(["https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=600"]),
    status: "available",
    amazonRating: 4.6,
    amazonReviewCount: 2847,
    amazonUrl: "https://www.amazon.in/Apple-iPhone-256GB-Deep-Purple/dp/B0BDJ7G6PF",
  },
  {
    name: "Samsung Galaxy S23 Ultra",
    description: "Phantom Black, 256GB, 90% battery. Comes with original charger and case. Single owner.",
    category: "Mobiles",
    condition: "like_new",
    originalPrice: 124999,
    sellingPrice: 74999,
    images: JSON.stringify(["https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600"]),
    status: "available",
    amazonRating: 4.5,
    amazonReviewCount: 1523,
    amazonUrl: "https://www.amazon.in/Samsung-Galaxy-Ultra-Phantom-Storage/dp/B0BT9M1P4F",
  },
  {
    name: "MacBook Pro 14 M2 Pro",
    description: "Space Gray, 16GB RAM, 512GB SSD. Barely used, 99% battery. Includes original charger and box.",
    category: "Laptops",
    condition: "like_new",
    originalPrice: 199999,
    sellingPrice: 145000,
    images: JSON.stringify(["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600"]),
    status: "available",
    amazonRating: 4.7,
    amazonReviewCount: 892,
    amazonUrl: "https://www.amazon.in/Apple-MacBook-14-inch-10-core-16-core/dp/B0BSHF7LLL",
  },
  {
    name: "Dell XPS 15 9520",
    description: "Silver, i7-12700H, 16GB RAM, 512GB SSD, RTX 3050 Ti. Excellent condition, minor wear on edges.",
    category: "Laptops",
    condition: "used",
    originalPrice: 159999,
    sellingPrice: 95000,
    images: JSON.stringify(["https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600"]),
    status: "available",
    amazonRating: 4.3,
    amazonReviewCount: 234,
    amazonUrl: "https://www.amazon.in/Dell-XPS-9520-15-6-inch-Laptop/dp/B09WQJQ8S3",
  },
  {
    name: "Sony WH-1000XM5",
    description: "Black, noise cancelling headphones. Like new condition, used for 2 weeks. Original case included.",
    category: "Accessories",
    condition: "like_new",
    originalPrice: 29990,
    sellingPrice: 18999,
    images: JSON.stringify(["https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600"]),
    status: "available",
    amazonRating: 4.5,
    amazonReviewCount: 3421,
    amazonUrl: "https://www.amazon.in/Sony-WH-1000XM5-Cancelling-Headphones-Hands-Free/dp/B09XS7JWHH",
  },
  {
    name: "Apple Watch Series 9 GPS 45mm",
    description: "Midnight aluminum case with midnight sport band. Never worn, still in sealed box.",
    category: "Accessories",
    condition: "openbox",
    originalPrice: 41900,
    sellingPrice: 32999,
    images: JSON.stringify(["https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600"]),
    status: "available",
    amazonRating: 4.6,
    amazonReviewCount: 1876,
    amazonUrl: "https://www.amazon.in/Apple-Watch-Smartwatch-Midnight-Aluminium/dp/B0CHX2F5QT",
  },
  {
    name: "Sony Alpha a7 IV Camera",
    description: "Full frame mirrorless camera. Shutter count ~2000. Includes 28-70mm kit lens, 2 batteries, charger.",
    category: "Electronics",
    condition: "used",
    originalPrice: 214990,
    sellingPrice: 165000,
    images: JSON.stringify(["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600"]),
    status: "available",
    amazonRating: 4.7,
    amazonReviewCount: 445,
    amazonUrl: "https://www.amazon.in/Sony-Alpha-Full-Frame-Mirrorless-Interchangeable/dp/B09JZT9W9J",
  },
  {
    name: "OnePlus 12 512GB",
    description: "Flowy Emerald, 16GB RAM. 95% battery, comes with original charger and cable.",
    category: "Mobiles",
    condition: "like_new",
    originalPrice: 69999,
    sellingPrice: 52000,
    images: JSON.stringify(["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600"]),
    status: "available",
    amazonRating: 4.4,
    amazonReviewCount: 2156,
    amazonUrl: "https://www.amazon.in/OnePlus-Emerald-256GB-Storage-Battery/dp/B0CQPPZWVD",
  },
  {
    name: "iPad Pro 12.9 M2 256GB",
    description: "Space Gray, WiFi only. Includes Magic Keyboard and Apple Pencil 2. Like new.",
    category: "Electronics",
    condition: "like_new",
    originalPrice: 119900,
    sellingPrice: 85000,
    images: JSON.stringify(["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600"]),
    status: "available",
    amazonRating: 4.8,
    amazonReviewCount: 1234,
    amazonUrl: "https://www.amazon.in/Apple-iPad-Pro-12-9-inch-Wi-Fi-256GB/dp/B0BJLFC67L",
  },
  {
    name: "JBL Flip 6 Speaker",
    description: "Black, portable Bluetooth speaker. Used for 3 months, perfect working condition.",
    category: "Electronics",
    condition: "used",
    originalPrice: 8999,
    sellingPrice: 4999,
    images: JSON.stringify(["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600"]),
    status: "available",
    amazonRating: 4.5,
    amazonReviewCount: 5678,
    amazonUrl: "https://www.amazon.in/JBL-Waterproof-Powerful-Signature-Bluetooth/dp/B08WM3LMJD",
  },
  {
    name: "AirPods Pro 2nd Gen",
    description: "With MagSafe Charging Case. Like new, used for 1 month only. Active warranty.",
    category: "Accessories",
    condition: "like_new",
    originalPrice: 24900,
    sellingPrice: 17999,
    images: JSON.stringify(["https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600"]),
    status: "available",
    amazonRating: 4.6,
    amazonReviewCount: 4532,
    amazonUrl: "https://www.amazon.in/Apple-AirPods-Pro-2nd-Generation/dp/B0BDJ7G6PF",
  },
  {
    name: "LG C3 55 inch OLED TV",
    description: "55 inch 4K OLED, HDMI 2.1, VRR. Used for 6 months, perfect picture quality. Wall mount included.",
    category: "Home",
    condition: "like_new",
    originalPrice: 149990,
    sellingPrice: 95000,
    images: JSON.stringify(["https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600"]),
    status: "available",
    amazonRating: 4.4,
    amazonReviewCount: 678,
    amazonUrl: "https://www.amazon.in/LG-inches-OLED55C3PSA-Smart-Display/dp/B0BYJ7P8BM",
  },
  {
    name: "Google Pixel 8 Pro",
    description: "Obsidian, 128GB. 90% battery, single user. Includes charger.",
    category: "Mobiles",
    condition: "used",
    originalPrice: 106999,
    sellingPrice: 65000,
    images: JSON.stringify(["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600"]),
    status: "available",
    amazonRating: 4.3,
    amazonReviewCount: 987,
    amazonUrl: "https://www.amazon.in/Google-Pixel-Pro-Obsidian-Storage/dp/B0CHX4DS6H",
  },
  {
    name: "Bose QuietComfort 45",
    description: "White, noise cancelling. Great condition, includes carrying case.",
    category: "Accessories",
    condition: "used",
    originalPrice: 26900,
    sellingPrice: 15999,
    images: JSON.stringify(["https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600"]),
    status: "available",
    amazonRating: 4.4,
    amazonReviewCount: 2890,
    amazonUrl: "https://www.amazon.in/Bose-QuietComfort-45-Bluetooth-Headphones/dp/B098FKXT8L",
  },
  {
    name: "Nintendo Switch OLED",
    description: "White, with dock and 3 games (Mario Kart, Zelda, Pokemon). Good condition.",
    category: "Electronics",
    condition: "used",
    originalPrice: 34990,
    sellingPrice: 22000,
    images: JSON.stringify(["https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=600"]),
    status: "available",
    amazonRating: 4.7,
    amazonReviewCount: 2134,
    amazonUrl: "https://www.amazon.in/Nintendo-Switch-OLED-Model-White/dp/B098RKWHHZ",
  },
  {
    name: "Sony PlayStation 5 Slim",
    description: "Digital Edition, 1TB SSD. Used for 2 months, comes with 2 controllers.",
    category: "Electronics",
    condition: "like_new",
    originalPrice: 44999,
    sellingPrice: 38000,
    images: JSON.stringify(["https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600"]),
    status: "available",
    amazonRating: 4.8,
    amazonReviewCount: 5678,
    amazonUrl: "https://www.amazon.in/Sony-PlayStation%C2%AE5-Digital-Edition/dp/B0CVKZ76P5",
  },
  {
    name: "Canon EOS R6 Mark II",
    description: "Body only, shutter count ~5000. Excellent condition, includes extra battery.",
    category: "Electronics",
    condition: "used",
    originalPrice: 249995,
    sellingPrice: 185000,
    images: JSON.stringify(["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600"]),
    status: "available",
    amazonRating: 4.6,
    amazonReviewCount: 234,
    amazonUrl: "https://www.amazon.in/Canon-Mirrorless-Camera-24-105mm-Black/dp/B0BLNVMPMY",
  },
  {
    name: "Dyson V15 Detect",
    description: "Cordless vacuum cleaner. All attachments included, perfect working condition.",
    category: "Home",
    condition: "used",
    originalPrice: 72900,
    sellingPrice: 45000,
    images: JSON.stringify(["https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600"]),
    status: "available",
    amazonRating: 4.5,
    amazonReviewCount: 1234,
    amazonUrl: "https://www.amazon.in/Dyson-V15-Detect-Cordless-Vacuum/dp/B08X1H6B3X",
  },
  {
    name: "Samsung Galaxy Watch 6 Classic",
    description: "44mm, Black, LTE. Used for 3 months, includes extra band.",
    category: "Accessories",
    condition: "like_new",
    originalPrice: 40999,
    sellingPrice: 27999,
    images: JSON.stringify(["https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600"]),
    status: "available",
    amazonRating: 4.4,
    amazonReviewCount: 876,
    amazonUrl: "https://www.amazon.in/Samsung-Galaxy-Watch-Classic-Bluetooth/dp/B0C7X6WP4X",
  },
  {
    name: "Xiaomi 13 Pro",
    description: "Ceramic White, 256GB. 92% battery, charger included. Minor scratch on screen protector.",
    category: "Mobiles",
    condition: "used",
    originalPrice: 79999,
    sellingPrice: 42000,
    images: JSON.stringify(["https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600"]),
    status: "available",
    amazonRating: 4.3,
    amazonReviewCount: 654,
    amazonUrl: "https://www.amazon.in/Xiaomi-13-Pro-Ceramic-White/dp/B0BZB5Z4T8",
  },
];

// Sample success stories with realistic delivery photos
const successStories = [
  {
    customerName: "Rahul Sharma",
    location: "Mumbai, Maharashtra",
    customerPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    productPhoto: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=600",
    productName: "iPhone 14 Pro Max",
    comment: "Got my iPhone 14 Pro Max in perfect condition! The packaging was secure and the phone looks brand new. Saved over ₹50k compared to buying new. Highly recommend OpenBox Deals!",
    rating: 5,
    deliveredAt: new Date("2025-02-15"),
    featured: true,
    published: true,
  },
  {
    customerName: "Priya Patel",
    location: "Delhi, NCR",
    customerPhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    productPhoto: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600",
    productName: "MacBook Pro 14",
    comment: "Amazing deal on the MacBook Pro! It's in pristine condition and works flawlessly. The seller was very responsive on WhatsApp and delivery was super fast. Will definitely buy again!",
    rating: 5,
    deliveredAt: new Date("2025-02-18"),
    featured: true,
    published: true,
  },
  {
    customerName: "Amit Kumar",
    location: "Bangalore, Karnataka",
    customerPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    productPhoto: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600",
    productName: "Sony WH-1000XM5",
    comment: "These headphones are incredible! Noise cancellation is top-notch and they look brand new. Great value for money. Delivery was prompt and well-packaged.",
    rating: 5,
    deliveredAt: new Date("2025-02-20"),
    featured: false,
    published: true,
  },
  {
    customerName: "Sneha Gupta",
    location: "Hyderabad, Telangana",
    customerPhoto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    productPhoto: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600",
    productName: "AirPods Pro 2",
    comment: "AirPods Pro 2nd gen arrived in original packaging. Sound quality is amazing and the spatial audio feature works perfectly. Very happy with my purchase!",
    rating: 5,
    deliveredAt: new Date("2025-02-22"),
    featured: true,
    published: true,
  },
  {
    customerName: "Vikram Singh",
    location: "Pune, Maharashtra",
    customerPhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    productPhoto: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600",
    productName: "PlayStation 5 Slim",
    comment: "Finally got my PS5 at a great price! Console is in excellent condition with both controllers working perfectly. Fast shipping and secure packaging. Gaming experience is phenomenal!",
    rating: 5,
    deliveredAt: new Date("2025-02-25"),
    featured: true,
    published: true,
  },
  {
    customerName: "Ananya Reddy",
    location: "Chennai, Tamil Nadu",
    customerPhoto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
    productPhoto: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600",
    productName: "iPad Pro 12.9",
    comment: "The iPad Pro bundle with Magic Keyboard and Apple Pencil is a steal! Everything works perfectly and looks almost new. Perfect for my design work. Thank you OpenBox Deals!",
    rating: 5,
    deliveredAt: new Date("2025-02-28"),
    featured: false,
    published: true,
  },
  {
    customerName: "Rajesh Verma",
    location: "Kolkata, West Bengal",
    customerPhoto: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
    productPhoto: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600",
    productName: "Samsung Galaxy S23 Ultra",
    comment: "Phone is in great condition as described. Camera quality is outstanding and battery life is excellent. Quick delivery and professional service. Would recommend to anyone looking for quality pre-owned phones.",
    rating: 4,
    deliveredAt: new Date("2025-03-01"),
    featured: false,
    published: true,
  },
  {
    customerName: "Meera Joshi",
    location: "Ahmedabad, Gujarat",
    customerPhoto: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400",
    productPhoto: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600",
    productName: "Apple Watch Series 9",
    comment: "Watch came sealed in original box - truly open box as described! All features work perfectly including fitness tracking. Great savings and trustworthy seller.",
    rating: 5,
    deliveredAt: new Date("2025-03-02"),
    featured: false,
    published: true,
  },
];

async function main() {
  console.log("Seeding database...");

  // Clear existing data (order matters due to foreign keys)
  await prisma.successStory.deleteMany();
  await prisma.review.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.session.deleteMany();
  await prisma.seller.deleteMany();
  await prisma.settings.deleteMany();

  // Create seller
  const hashedPassword = await hashPassword("password123");
  const seller = await prisma.seller.create({
    data: {
      email: "seller@example.com",
      password: hashedPassword,
      name: "Demo Seller",
      shopName: "OpenBox Deals",
      whatsapp: "919999999999",
      address: "Mumbai, India",
    },
  });
  console.log("Created seller:", seller.email);

  // Create settings
  await prisma.settings.create({
    data: {
      shopName: "OpenBox Deals",
      whatsapp: "919999999999",
      address: "Mumbai, India",
      isDefault: true,
    },
  });

  // Create products with sellerId
  const createdProducts: { id: string; name: string }[] = [];
  for (const product of products) {
    const created = await prisma.product.create({
      data: {
        ...product,
        sellerId: seller.id,
      },
    });
    createdProducts.push({ id: created.id, name: created.name });
  }
  console.log(`Created ${products.length} demo products!`);

  // Create success stories and link to products where possible
  for (const story of successStories) {
    // Find matching product
    const matchingProduct = createdProducts.find(p => 
      story.productName.toLowerCase().includes(p.name.toLowerCase().split(" ")[0].toLowerCase())
    );

    await prisma.successStory.create({
      data: {
        ...story,
        productId: matchingProduct?.id || null,
      },
    });
  }
  console.log(`Created ${successStories.length} success stories!`);

  console.log("\n🎉 Database seeded successfully!");
  console.log("\nNext steps:");
  console.log("1. Run 'npm run dev' to start the server");
  console.log("2. Visit http://localhost:3000/stories to see success stories");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
