# OpenBox Store

A modern, full-stack e-commerce platform for selling open-box and pre-owned tech products. Built with Next.js, TypeScript, Prisma, and PostgreSQL.

![OpenBox Store](https://img.shields.io/badge/OpenBox-Store-amber)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![Prisma](https://img.shields.io/badge/Prisma-5.22-green)

## ✨ Features

### Customer-Facing
- 🛍️ **Product Catalog** - Browse products with filters (category, condition, search)
- 🛒 **Shopping Cart** - Persistent cart with 30-day session storage
- 📦 **Checkout Flow** - Multiple payment options (COD, UPI, Card)
- ⭐ **Amazon Ratings** - Display official Amazon ratings on product pages
- 📸 **Success Stories** - Customer testimonials with photo gallery (`/stories`)
- 📱 **Mobile-First** - Fully responsive design

### Seller Dashboard
- 🔐 **Secure Authentication** - bcrypt password hashing, session-based auth
- 📝 **Product Management** - CRUD operations, bulk import, inventory tracking
- 📊 **Analytics & Reports** - Real-time dashboard + daily automated reports
- 🤖 **AI Assistant** - Chat with AI to get insights and manage store
- 🏷️ **Category Management** - Custom categories with icons
- 🖼️ **Success Stories** - Manage customer testimonials and photos
- 🔑 **API Keys** - Generate keys for AI agent integration

### Analytics & AI
- 📈 **Real-time Analytics** - Live dashboard with 30-second auto-refresh
- 📅 **Daily Reports** - Automated Excel replacement (9 AM daily)
- 🔔 **Smart Alerts** - Low stock warnings, trending products
- 🤖 **AI Chat Assistant** - Ask questions, get insights, manage inventory
- 📊 **Visual Charts** - Orders, revenue, conversion tracking

### Security & Performance
- 🔒 **Enterprise Security** - Rate limiting, input validation, CSRF protection
- 🚀 **Fast Performance** - Next.js App Router, optimized images
- 🗄️ **PostgreSQL** - Neon database with automatic backups
- 🧪 **Dev Tools** - Dev bypass button for testing (development only)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database (Neon recommended)

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/openbox-store.git
cd openbox-store

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your database URL

# Setup database
npx prisma db push
npx prisma db seed

# Run development server
npm run dev
```

### Environment Variables

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# Optional: Dev API key for testing
DEV_API_KEY=dev-api-key-12345

# Cron Secret (for automated reports)
CRON_SECRET=your-cron-secret-key-here

# OpenRouter API Key (for AI Assistant)
OPENROUTER_API_KEY=sk-or-v1-...
```

### Access the App

- **Store:** http://localhost:3000
- **Login:** http://localhost:3000/login
- **Admin:** http://localhost:3000/admin
- **Stories:** http://localhost:3000/stories

**Default Credentials:**
- Email: `seller@example.com`
- Password: `password123`

**Dev Bypass:** Click "Dev: Skip Login" button on login page (development only)

## 📁 Project Structure

```
open-box/
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   ├── analytics/    # Analytics endpoints
│   │   │   ├── ai/           # AI assistant endpoints
│   │   │   └── cron/         # Cron jobs (daily reports)
│   │   ├── admin/            # Seller dashboard
│   │   │   ├── analytics/    # Real-time analytics
│   │   │   └── reports/      # Daily reports
│   │   ├── (auth)/           # Login, Signup pages
│   │   ├── product/[id]/     # Product detail
│   │   ├── stories/          # Success stories page
│   │   └── page.tsx          # Home page
│   ├── components/
│   │   ├── AIChat/           # AI chat widget
│   │   └── AnalyticsTracker/ # Event tracking
│   ├── context/              # Cart context
│   ├── lib/
│   │   ├── ai/               # OpenRouter client
│   │   ├── jobs/             # Report generation
│   │   └── analytics.ts      # Tracking helper
│   └── styles/               # Global styles
├── prisma/
│   └── schema.prisma         # Database schema
└── public/                   # Static assets
```

## 🛠️ Tech Stack

- **Framework:** Next.js 16.1.6 (App Router)
- **Language:** TypeScript 5.7
- **Database:** PostgreSQL (Neon)
- **ORM:** Prisma 5.22
- **Styling:** Tailwind CSS 3.4
- **UI Components:** Radix UI, Lucide icons
- **Auth:** bcrypt (12 rounds), session cookies
- **Validation:** Zod

## 📚 Documentation

- **[API Documentation](API.md)** - Complete REST API reference
- **[Quick Start Guide](QUICK_START.md)** - Step-by-step setup instructions
- **[Implementation Plan](IMPLEMENTATION_PLAN.md)** - Development roadmap

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - Login seller
- `POST /api/auth/signup` - Register new seller
- `POST /api/auth/logout` - Logout
- `POST /api/auth/dev-login` - Dev bypass (development only)

### Products
- `GET /api/products` - List products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `POST /api/products/bulk` - Bulk create
- `POST /api/products/import` - Import from JSON

### Cart & Orders
- `GET /api/cart` - Get cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart/:id` - Update quantity
- `DELETE /api/cart/:id` - Remove item
- `GET /api/orders` - List orders
- `POST /api/orders` - Create order

### Stories
- `GET /api/stories` - Get success stories
- `GET /api/admin/stories` - Admin: list all
- `POST /api/admin/stories` - Admin: create
- `PUT /api/admin/stories/:id` - Admin: update
- `DELETE /api/admin/stories/:id` - Admin: delete

### Analytics
- `GET /api/analytics/live` - Real-time store statistics
- `GET /api/analytics/inventory` - Inventory analytics
- `GET /api/admin/reports` - Daily reports (list/generate)
- `POST /api/admin/reports/generate` - Generate report for date
- `GET /api/cron/daily-report` - Automated daily report (9 AM)

### AI Assistant (Phase 3)
- `POST /api/ai/chat` - Chat with AI assistant
- `GET /api/ai/suggestions` - Get suggested queries

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Environment Variables on Vercel:**
- `DATABASE_URL` - Your Neon connection string
- `DEV_API_KEY` - Optional dev key

### Database Setup

1. Create account at [neon.tech](https://neon.tech)
2. Create new project (choose Mumbai/India region)
3. Copy connection string
4. Add to environment variables
5. Run `npx prisma db push`

## 🧪 Development

### Dev Tools
- **Dev Login:** Click "Dev: Skip Login" on login page
- **API Testing:** Use `dev-api-key-12345` header
- **Database:** View at `npx prisma studio`

### Build
```bash
npm run build    # Production build
npm run dev      # Development server
npm run lint     # Run ESLint
```

### Database Commands
```bash
npx prisma db push      # Push schema changes
npx prisma db seed      # Seed with sample data
npx prisma studio       # Open Prisma Studio
npx prisma migrate dev  # Create migration
```

## 📝 Key Features Explained

### Success Stories
Showcase happy customers with verified delivery photos:
- Customer photos with delivered products
- Location and delivery date
- Star ratings and testimonials
- Admin management dashboard

### Amazon Integration
Display official Amazon ratings on products:
- Star rating display
- Review count
- Link to Amazon product page
- Builds buyer trust

### Secure Signup
New sellers can register with:
- Email validation
- Strong password requirements
- WhatsApp number with country code
- Shop details
- Auto-login after registration

### Analytics Dashboard
Real-time insights into your store performance:
- Live revenue, orders, visitors tracking
- Conversion rate monitoring
- Trending products (last 6 hours)
- Recent activity feed
- Visual charts (last 7 days)
- Auto-refreshes every 30 seconds
- Mobile-responsive design

### Daily Reports (Excel Replacement!)
Automated daily analytics reports:
- Generated automatically at 9 AM
- Revenue, orders, traffic summary
- Conversion funnel analysis
- Top products (viewed + sold)
- Low stock alerts
- Historical data storage
- Mobile-friendly report viewer

### AI Assistant (Coming Soon)
Chat with AI to manage your store:
- "How many orders today?"
- "What's low in stock?"
- "Show me trending products"
- Get insights and recommendations
- Natural language interface
- Mobile chat widget

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

MIT License - feel free to use for personal or commercial projects.

## 🙏 Credits

Built with ❤️ using:
- [Next.js](https://nextjs.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [Neon](https://neon.tech)

---

**Questions?** Check the [API Documentation](API.md) or [Quick Start Guide](QUICK_START.md).
