# Quick Start Guide

## 🚀 Start Here

### Prerequisites
- Node.js 18+
- PostgreSQL database (we recommend [Neon](https://neon.tech))

### Step 1: Clone and Install (2 minutes)

```bash
# Clone repository
git clone https://github.com/yourusername/openbox-store.git
cd openbox-store

# Install dependencies
npm install
```

### Step 2: Setup Environment (3 minutes)

```bash
# Copy environment file
cp .env.example .env.local

# Edit .env.local and add your Neon database URL:
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# Optional: Add dev API key for testing
DEV_API_KEY=dev-api-key-12345
```

**Getting Neon Database URL:**
1. Go to [neon.tech](https://neon.tech) and sign up
2. Create new project (choose Mumbai/India region for best latency)
3. Copy the connection string from dashboard
4. Paste into `.env.local`

### Step 3: Setup Database (2 minutes)

```bash
# Push schema to database
npx prisma db push

# Seed with sample data (20 products, 8 success stories, 1 demo seller)
npx prisma db seed
```

### Step 4: Start Development Server (1 minute)

```bash
npm run dev
```

**Access the app:**
- Store: http://localhost:3000
- Login: http://localhost:3000/login
- Admin: http://localhost:3000/admin
- Stories: http://localhost:3000/stories

---

## 🔐 Default Credentials

**Demo Seller Account:**
- Email: `seller@example.com`
- Password: `password123`

**Or use Dev Bypass (Development Only):**
- Go to `/login`
- Click "Dev: Skip Login" button
- Automatically logged in

---

## 📚 Key Features

### Success Stories (`/stories`)
- Display customer testimonials with photos
- Build trust with verified deliveries
- Admin dashboard at `/admin/stories`
- Includes 8 sample stories with seed data

### Amazon Ratings
- Display official Amazon ratings on products
- Shows review count and star rating
- Links to Amazon product page
- Helps buyers make informed decisions

### Secure Signup
- New sellers can register at `/signup`
- Strong password requirements enforced
- WhatsApp number with country code validation
- Auto-login after registration

### Shopping Cart & Orders
- Persistent cart with 30-day storage
- Multiple payment options (COD, UPI, Card)
- Order management in admin dashboard

---

## 🛠️ Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build

# Database
npx prisma studio        # Open database GUI
npx prisma db push       # Push schema changes
npx prisma db seed       # Re-seed database
npx prisma migrate dev   # Create migration

# Testing
npm run lint             # Run ESLint
```

---

## 🚀 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Required Environment Variables on Vercel:**
- `DATABASE_URL` - Your Neon connection string
- `DEV_API_KEY` - Optional, for dev testing

### Database Migration for Production

```bash
# After deploying, run in production:
npx prisma db push
```

---

## 🆘 Troubleshooting

### Issue: Database connection fails
```bash
# Verify DATABASE_URL format:
postgresql://user:password@host.neon.tech/database?sslmode=require

# Test connection:
npx prisma db pull
```

### Issue: Build fails
```bash
# Clear cache and rebuild
rm -rf .next node_modules/.prisma
npm install
npx prisma generate
npm run build
```

### Issue: Prisma Client errors
```bash
# Regenerate Prisma client
npx prisma generate

# Or force reinstall
rm -rf node_modules
npm install
npx prisma generate
```

### Issue: Seed data not loading
```bash
# Clear database and re-seed
npx prisma db push --force-reset
npx prisma db seed
```

---

## 📖 Next Steps

1. **Customize Store:**
   - Update shop name and details in `/admin/settings`
   - Add your own products
   - Upload success stories with customer photos

2. **Configure WhatsApp:**
   - Add your WhatsApp number in settings
   - Format: `+919999999999` (with country code)
   - Enable customer inquiries via WhatsApp

3. **Add Products:**
   - Use admin dashboard (`/admin/products`)
   - Or bulk import via `/admin/import`
   - Include Amazon ratings for trust

4. **Manage Stories:**
   - Go to `/admin/stories`
   - Add customer testimonials
   - Upload delivery photos
   - Mark best stories as "Featured"

---

## 🔌 API Quick Reference

```bash
# List products
curl "http://localhost:3000/api/products" \
  -H "x-api-key: dev-api-key-12345"

# Create product
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "x-api-key: dev-api-key-12345" \
  -d '{"name":"iPhone 15","category":"Mobiles","sellingPrice":95000}'

# Get success stories
curl "http://localhost:3000/api/stories?featured=true"
```

**Full API Documentation:** See [API.md](API.md)

---

## 🎯 Quick Checklist

- [ ] Cloned repository
- [ ] Installed dependencies (`npm install`)
- [ ] Created `.env.local` with database URL
- [ ] Ran `npx prisma db push`
- [ ] Ran `npx prisma db seed`
- [ ] Started dev server (`npm run dev`)
- [ ] Tested login with demo credentials
- [ ] Viewed success stories page
- [ ] Checked admin dashboard

**Build Status:** Run `npm run build` to verify everything works.

---

## 📞 Need Help?

- **API Docs:** [API.md](API.md)
- **Full Guide:** [README.md](README.md)
- **Implementation Plan:** [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)

**Happy selling!** 🎉
