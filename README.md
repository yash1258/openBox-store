# OpenBox Store

<p align="center">
  <strong>AI-Powered E-commerce Platform for Open-Box & Pre-owned Tech</strong>
</p>

<p align="center">
  <a href="https://github.com/yourusername/openbox-store/actions"><img src="https://img.shields.io/github/actions/workflow/status/yourusername/openbox-store/ci.yml?branch=main&style=flat-square&label=CI" alt="CI Status"></a>
  <a href="https://github.com/yourusername/openbox-store/stargazers"><img src="https://img.shields.io/github/stars/yourusername/openbox-store?style=flat-square&color=amber" alt="GitHub Stars"></a>
  <a href="https://github.com/yourusername/openbox-store/issues"><img src="https://img.shields.io/github/issues/yourusername/openbox-store?style=flat-square" alt="GitHub Issues"></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/yourusername/openbox-store?style=flat-square&color=blue" alt="License"></a>
  <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Prisma-5.22-green?style=flat-square&logo=prisma" alt="Prisma">
  <img src="https://img.shields.io/badge/PostgreSQL-16-blue?style=flat-square&logo=postgresql" alt="PostgreSQL">
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#demo">Demo</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#contributing">Contributing</a>
</p>

---

## ✨ Features

### 🛍️ Customer Experience
- **Product Catalog** - Browse with filters (category, condition, search)
- **Smart Cart** - Persistent 30-day session storage
- **Secure Checkout** - Multiple payment options (COD, UPI, Card)
- **Amazon Ratings** - Official ratings displayed on products
- **Success Stories** - Customer testimonials with verified photos
- **Mobile-First** - Fully responsive design

### 📊 AI-Powered Analytics
- **Real-time Dashboard** - Live metrics with 30-second auto-refresh
- **AI Intern Agent** - Chat + tool-calling actions (create products, adjust stock, update status/details with confirmation)
- **Daily Reports** - Automated Excel replacement (9 AM daily)
- **Smart Alerts** - Low stock warnings, trending products
- **Visual Charts** - Orders, revenue, conversion tracking

### 🔐 Seller Dashboard
- **Secure Auth** - bcrypt password hashing, session-based auth
- **Product Management** - CRUD operations, bulk import
- **API Keys** - Generate keys for external integrations
- **Category Management** - Custom categories with icons
- **Story Management** - Manage customer testimonials

---

## 🚀 Demo

<p align="center">
  <img src="docs/screenshots/home.png" alt="Home Page" width="80%">
</p>

**Live Demo:** [Coming Soon]

**Default Credentials:**
- Email: `seller@example.com`
- Password: `password123`

---

## 🏃 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (or [Neon](https://neon.tech) free tier)

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/openbox-store.git
cd openbox-store
npm install
```

### 2. Setup Database

```bash
# Create .env.local from example
cp .env.example .env.local

# Edit .env.local with your database URL
# DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# Push schema & seed data
npm run db:push
npm run db:seed
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) - you're live! 🎉

**Default Login:**
- **Store:** http://localhost:3000
- **Admin:** http://localhost:3000/login
- **Dev Bypass:** Click "Dev: Skip Login" (development only)

---

## 📦 One-Click Deploy

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/openbox-store)

**Required Environment Variables:**
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Random secret for auth (generate with `openssl rand -base64 32`)
- `OPENROUTER_API_KEY` - For AI features (optional, get free key at [openrouter.ai](https://openrouter.ai))

### Railway / Render
See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed guides.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework with App Router |
| **TypeScript** | Type-safe development |
| **PostgreSQL** | Primary database |
| **Prisma** | Database ORM |
| **Tailwind CSS** | Styling |
| **Radix UI** | Accessible components |
| **OpenRouter** | AI integration |
| **bcrypt** | Password hashing |

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [API.md](API.md) | Complete REST API reference |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Detailed deployment guides |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contribution guidelines |
| [AI_IMPLEMENTATION_PLAN.md](AI_IMPLEMENTATION_PLAN.md) | AI features roadmap |

---

## 🏗️ Project Structure

```
openbox-store/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes (analytics, AI, auth)
│   │   ├── admin/             # Seller dashboard
│   │   ├── (auth)/            # Login/signup pages
│   │   └── page.tsx           # Home page
│   ├── components/
│   │   ├── AIChat/            # AI chat widget
│   │   └── AnalyticsTracker/  # Event tracking
│   ├── lib/
│   │   ├── ai/                # OpenRouter client
│   │   └── jobs/              # Report generation
│   └── context/               # Cart context
├── prisma/
│   └── schema.prisma          # Database schema
└── public/                    # Static assets
```

---

## 🧪 Development

```bash
# Development with hot reload
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Database commands
npm run db:push      # Push schema changes
npm run db:seed      # Seed sample data
npx prisma studio    # Open Prisma Studio
```

---

## 🤝 Contributing

We love contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file.

---

## 🙏 Acknowledgments

Built with ❤️ using:
- [Next.js](https://nextjs.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [Neon](https://neon.tech)
- [OpenRouter](https://openrouter.ai)

---

<p align="center">
  Made with ❤️ for the open-source community
</p>
