# OpenBox Implementation Roadmap

## Overview
Complete transformation from product catalog to full-featured e-commerce platform with enterprise-grade security and performance.

**Timeline:** 7 weeks  
**Priority:** Security → Foundation → Features → Polish

---

## Phase 1: Critical Security Fixes (Week 1) - P0
*Goal: Secure the application before any production use*

### Day 1-2: Authentication Overhaul
- [ ] **1.1** Replace SHA-256 with bcrypt for password hashing
- [ ] **1.2** Remove hardcoded API key, move to environment variables
- [ ] **1.3** Implement server-side session storage in database
- [ ] **1.4** Add session expiration and invalidation
- [ ] **1.5** Fix HTTPS enforcement in production

**Files to modify:**
- `src/lib/auth.ts`
- `prisma/schema.prisma` (add Session model)
- `src/lib/api-auth.ts`
- `.env.local` (add SESSION_SECRET)

### Day 3-4: API Security
- [ ] **1.6** Add rate limiting to all auth endpoints (5 requests/minute)
- [ ] **1.7** Implement CSRF token validation
- [ ] **1.8** Add authentication check to `/api/products/import`
- [ ] **1.9** Fix IDOR vulnerabilities (verify seller owns resource)
- [ ] **1.10** Add request body size limits (1MB)

**Files to modify:**
- `src/lib/rate-limit.ts` (new)
- `src/lib/csrf.ts` (new)
- `src/app/api/products/import/route.ts`
- All API route files for IDOR fixes

### Day 5: Input Validation & XSS Prevention
- [ ] **1.11** Install and configure Zod
- [ ] **1.12** Create validation schemas for all API inputs
- [ ] **1.13** Add DOMPurify for HTML content sanitization
- [ ] **1.14** Validate and sanitize all search parameters
- [ ] **1.15** Add type-safe request handlers

**Files to modify:**
- `src/lib/validation.ts` (new)
- `src/lib/sanitize.ts` (new)
- All API route files

---

## Phase 2: Database Foundation (Week 2) - P1
*Goal: Robust data layer with transactions and indexing*

### Day 6-7: Schema Improvements
- [ ] **2.1** Add Session model to Prisma schema
- [ ] **2.2** Add Cart and CartItem models
- [ ] **2.3** Add Order and OrderItem models with enums
- [ ] **2.4** Add ProductImage table (replace JSON array)
- [ ] **2.5** Add Review/Rating model
- [ ] **2.6** Add database indexes on frequently queried fields
- [ ] **2.7** Add database constraints (CHECK for prices)

**Schema additions:**
```prisma
model Session {
  id        String   @id @default(cuid())
  token     String   @unique
  sellerId  String
  seller    Seller   @relation(fields: [sellerId], references: [id], onDelete: Cascade)
  expiresAt DateTime
  createdAt DateTime @default(now())
  
  @@index([token])
  @@index([sellerId])
}

model Cart {
  id        String     @id @default(cuid())
  sessionId String     @unique
  items     CartItem[]
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  
  @@index([sessionId])
}

model CartItem {
  id        String  @id @default(cuid())
  cartId    String
  productId String
  quantity  Int     @default(1)
  cart      Cart    @relation(fields: [cartId], references: [id], onDelete: Cascade)
  product   Product @relation(fields: [productId], references: [id])
  
  @@unique([cartId, productId])
  @@index([cartId])
  @@index([productId])
}

model Order {
  id            String        @id @default(cuid())
  customerName  String
  customerEmail String
  customerPhone String
  address       String
  items         OrderItem[]
  totalAmount   Float
  status        OrderStatus   @default(PENDING)
  paymentStatus PaymentStatus @default(PENDING)
  sellerId      String
  seller        Seller        @relation(fields: [sellerId], references: [id])
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  
  @@index([status])
  @@index([sellerId])
  @@index([createdAt])
}

enum OrderStatus {
  PENDING
  CONFIRMED
  SHIPPED
  DELIVERED
  CANCELLED
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}

model OrderItem {
  id          String  @id @default(cuid())
  orderId     String
  productId   String
  productName String
  quantity    Int
  unitPrice   Float
  totalPrice  Float
  order       Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  
  @@index([orderId])
}

model ProductImage {
  id        String  @id @default(cuid())
  productId String
  url       String
  order     Int     @default(0)
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  @@index([productId])
}

model Review {
  id        String   @id @default(cuid())
  productId String
  customerName String
  rating    Int      // 1-5
  comment   String?
  createdAt DateTime @default(now())
  
  @@index([productId])
}
```

### Day 8-9: Query Optimization
- [ ] **2.8** Fix N+1 query problem in categories API
- [ ] **2.9** Add database transactions for bulk operations
- [ ] **2.10** Implement cursor-based pagination
- [ ] **2.11** Add query result caching

**Files to modify:**
- `src/app/api/categories/route.ts`
- `src/app/api/products/import/route.ts`
- `src/app/api/products/route.ts`
- `src/lib/prisma.ts`

### Day 10: Migration & Seeding
- [ ] **2.12** Generate Prisma migration
- [ ] **2.13** Update seed script with new models
- [ ] **2.14** Migrate existing JSON image data to ProductImage table
- [ ] **2.15** Test all database operations

**Commands:**
```bash
npx prisma migrate dev --name add_ecommerce_models
npx prisma db seed
```

---

## Phase 3: Shopping Cart (Week 3) - P1
*Goal: Full-featured cart with persistence*

### Day 11-12: Cart API & Logic
- [ ] **3.1** Create cart service layer
- [ ] **3.2** Implement add-to-cart API endpoint
- [ ] **3.3** Implement update quantity API
- [ ] **3.4** Implement remove-from-cart API
- [ ] **3.5** Implement get-cart API with totals calculation
- [ ] **3.6** Add cart validation (check stock availability)

**New files:**
- `src/lib/cart.ts`
- `src/app/api/cart/route.ts`
- `src/app/api/cart/[itemId]/route.ts`

### Day 13-14: Cart UI Components
- [ ] **3.7** Create CartContext for state management
- [ ] **3.8** Build CartDrawer slide-out component
- [ ] **3.9** Create CartItem component
- [ ] **3.10** Build CartSummary component with totals
- [ ] **3.11** Add cart icon with item count badge to header
- [ ] **3.12** Create AddToCartButton component

**New files:**
- `src/context/CartContext.tsx`
- `src/components/CartDrawer.tsx`
- `src/components/CartItem.tsx`
- `src/components/CartSummary.tsx`
- `src/components/AddToCartButton.tsx`

### Day 15: Cart Integration
- [ ] **3.13** Integrate cart into product detail page
- [ ] **3.14** Add cart persistence (localStorage fallback)
- [ ] **3.15** Add cart animations and loading states
- [ ] **3.16** Test cart functionality thoroughly

---

## Phase 4: Order System (Week 4) - P1
*Goal: Complete order management with checkout flow*

### Day 16-17: Order API
- [ ] **4.1** Create order service layer
- [ ] **4.2** Implement create-order endpoint
- [ ] **4.3** Implement order validation (stock, pricing)
- [ ] **4.4** Create order status update endpoint
- [ ] **4.5** Implement order listing (with filters)
- [ ] **4.6** Add order detail endpoint

**New files:**
- `src/lib/order.ts`
- `src/app/api/orders/route.ts`
- `src/app/api/orders/[id]/route.ts`
- `src/app/api/orders/[id]/status/route.ts`

### Day 18-19: Checkout Flow
- [ ] **4.7** Create checkout page layout
- [ ] **4.8** Build customer information form
- [ ] **4.9** Create order review step
- [ ] **4.10** Add payment method selection
- [ ] **4.11** Implement order confirmation page
- [ ] **4.12** Add order success email template

**New files:**
- `src/app/checkout/page.tsx`
- `src/app/checkout/layout.tsx`
- `src/components/CheckoutForm.tsx`
- `src/components/OrderReview.tsx`
- `src/app/checkout/success/page.tsx`

### Day 20: Admin Order Management
- [ ] **4.13** Build admin orders list page
- [ ] **4.14** Create order detail view for admin
- [ ] **4.15** Add order status update UI
- [ ] **4.16** Implement order filtering and search
- [ ] **4.17** Add order statistics dashboard

**New files:**
- `src/app/admin/orders/page.tsx`
- `src/app/admin/orders/[id]/page.tsx`

---

## Phase 5: Payment Integration (Week 5) - P1
*Goal: Multiple payment options with secure processing*

### Day 21-22: Payment Gateway Setup
- [ ] **5.1** Research and select payment provider (Stripe/Razorpay)
- [ ] **5.2** Install payment SDK
- [ ] **5.3** Configure payment webhooks
- [ ] **5.4** Create payment intent/order endpoint
- [ ] **5.5** Implement payment confirmation handling

**New files:**
- `src/lib/payment.ts`
- `src/app/api/payment/create/route.ts`
- `src/app/api/payment/verify/route.ts`
- `src/app/api/webhooks/payment/route.ts`

### Day 23-24: Payment UI
- [ ] **5.6** Create payment form component
- [ ] **5.7** Add card payment UI
- [ ] **5.8** Implement UPI payment option
- [ ] **5.9** Add COD (Cash on Delivery) option
- [ ] **5.10** Create payment success/failure handlers

**New files:**
- `src/components/PaymentForm.tsx`
- `src/components/PaymentMethods.tsx`

### Day 25: Order Confirmation & Notifications
- [ ] **5.11** Send order confirmation email
- [ ] **5.12** Create WhatsApp order notification
- [ ] **5.13** Add inventory deduction on order
- [ ] **5.14** Implement order receipt generation
- [ ] **5.15** Add order tracking page for customers

---

## Phase 6: Performance & UX (Week 6) - P2
*Goal: Fast, accessible, and polished user experience*

### Day 26-27: Performance Optimization
- [ ] **6.1** Migrate all images to Next.js Image component
- [ ] **6.2** Implement ISR for product pages
- [ ] **6.3** Add React.memo for expensive components
- [ ] **6.4** Implement virtual scrolling for long lists
- [ ] **6.5** Add service worker for offline support
- [ ] **6.6** Optimize bundle size

**Files to modify:**
- All pages with images
- `next.config.ts` (add image domains)
- `src/app/page.tsx`
- `src/app/product/[id]/page.tsx`

### Day 28-29: UX Improvements
- [ ] **6.7** Add loading skeletons
- [ ] **6.8** Implement error boundaries
- [ ] **6.9** Add toast notifications
- [ ] **6.10** Create confirmation dialogs
- [ ] **6.11** Add form validation feedback
- [ ] **6.12** Improve mobile navigation
- [ ] **6.13** Add ARIA labels and accessibility

**New files:**
- `src/components/ui/Skeleton.tsx`
- `src/app/error.tsx`
- `src/components/ui/Toast.tsx`
- `src/components/ui/ConfirmDialog.tsx`

### Day 30: Search Enhancement
- [ ] **6.14** Implement full-text search with Prisma
- [ ] **6.15** Add search suggestions/autocomplete
- [ ] **6.16** Implement faceted search
- [ ] **6.17** Add search analytics
- [ ] **6.18** Create advanced filters

---

## Phase 7: Monitoring & Polish (Week 7) - P3
*Goal: Production-ready with monitoring and analytics*

### Day 31-32: Logging & Monitoring
- [ ] **7.1** Add audit logging for all mutations
- [ ] **7.2** Implement error tracking (Sentry)
- [ ] **7.3** Add performance monitoring
- [ ] **7.4** Create admin activity log view
- [ ] **7.5** Add request logging middleware

**New files:**
- `src/lib/audit.ts`
- `src/lib/logger.ts`
- `src/app/admin/logs/page.tsx`

### Day 33-34: Analytics
- [ ] **7.6** Track page views
- [ ] **7.7** Monitor conversion funnel
- [ ] **7.8** Add product view analytics
- [ ] **7.9** Create sales dashboard
- [ ] **7.10** Add popular products widget

**New files:**
- `src/lib/analytics.ts`
- `src/app/admin/analytics/page.tsx`

### Day 35: Final Polish
- [ ] **7.11** Add SEO meta tags to all pages
- [ ] **7.12** Create sitemap.xml
- [ ] **7.13** Add robots.txt
- [ ] **7.14** Implement Open Graph tags
- [ ] **7.15** Add structured data (JSON-LD)
- [ ] **7.16** Final security audit
- [ ] **7.17** Performance testing
- [ ] **7.18** Documentation

---

## Implementation Order Summary

### Start Immediately (This Week):
1. Install bcrypt and zod
2. Fix password hashing
3. Remove hardcoded API key
4. Add rate limiting

### Week 1-2:
- Complete Phase 1 (Security)
- Complete Phase 2 (Database)

### Week 3-5:
- Complete Phase 3 (Cart)
- Complete Phase 4 (Orders)
- Complete Phase 5 (Payments)

### Week 6-7:
- Complete Phase 6 (Performance)
- Complete Phase 7 (Monitoring)

---

## Dependencies to Install

```bash
# Security
npm install bcrypt zod

# UI Components
npm install @radix-ui/react-dialog @radix-ui/react-toast
npm install lucide-react

# Payment
npm install @stripe/stripe-js stripe
# OR
npm install razorpay

# Monitoring
npm install @sentry/nextjs

# Utilities
npm install date-fns
npm install clsx tailwind-merge
```

---

## Testing Checklist

- [ ] All security vulnerabilities fixed
- [ ] Authentication working properly
- [ ] Cart functionality complete
- [ ] Orders can be created and managed
- [ ] Payments process successfully
- [ ] Mobile responsive
- [ ] Accessibility audit passed
- [ ] Performance metrics met (Lighthouse 90+)
- [ ] All API endpoints documented
- [ ] Error handling working

---

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrated
- [ ] SSL certificate installed
- [ ] CDN configured for images
- [ ] Webhook endpoints secured
- [ ] Backup strategy in place
- [ ] Monitoring dashboards set up
- [ ] Rollback plan ready

---

**Success Criteria:**
- Zero security vulnerabilities
- < 2 second page load times
- 99.9% uptime
- Full e-commerce functionality
- Mobile-first experience
- Accessible to all users
