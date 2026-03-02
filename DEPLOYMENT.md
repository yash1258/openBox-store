# Deployment Guide

Complete deployment guides for OpenBox Store on various platforms.

## Table of Contents
- [Vercel (Recommended)](#vercel-recommended)
- [Railway](#railway)
- [Render](#render)
- [Self-Hosted](#self-hosted)

---

## Vercel (Recommended)

The easiest way to deploy OpenBox Store.

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/openbox-store)

### Manual Steps

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Create Vercel Account**
   - Sign up at [vercel.com](https://vercel.com) with GitHub

3. **Import Project**
   - Click "Add New Project"
   - Import your GitHub repository
   - Framework preset: Next.js

4. **Environment Variables**
   Add these in Vercel dashboard:
   ```
   DATABASE_URL=your_neon_connection_string
   NEXTAUTH_SECRET=openssl_rand_base64_32
   OPENROUTER_API_KEY=your_openrouter_key
   ```

5. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy automatically

6. **Database Setup**
   ```bash
   # In Vercel dashboard, open Console
   npx prisma db push
   npx prisma db seed
   ```

---

## Railway

Great for full-stack deployment with database included.

### Steps

1. **Create Railway Account**
   - Sign up at [railway.app](https://railway.app)

2. **Deploy Template**
   ```bash
   # Option 1: Use Railway CLI
   npm i -g @railway/cli
   railway login
   railway init
   railway add --database postgresql
   railway up
   ```

3. **Or use Dashboard**
   - New Project → Deploy from GitHub repo
   - Add PostgreSQL service
   - Copy database URL to environment variables

4. **Environment Variables**
   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   NEXTAUTH_SECRET=your-secret
   OPENROUTER_API_KEY=your-key
   ```

---

## Render

Reliable and cost-effective.

### Steps

1. **Create Render Account**
   - Sign up at [render.com](https://render.com)

2. **Create Web Service**
   - New → Web Service
   - Connect your GitHub repo
   - Name: openbox-store
   - Runtime: Node
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

3. **Create PostgreSQL Database**
   - New → PostgreSQL
   - Name: openbox-db
   - Copy Internal Database URL

4. **Environment Variables**
   ```
   DATABASE_URL=postgres://user:pass@host:5432/dbname
   NEXTAUTH_SECRET=your-secret
   OPENROUTER_API_KEY=your-key
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Render will auto-deploy on git push

---

## Self-Hosted

Deploy on your own server or VPS.

### Requirements
- Node.js 18+
- PostgreSQL 14+
- PM2 or similar process manager
- Nginx (recommended)

### Steps

1. **Server Setup**
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install -y nodejs npm postgresql nginx
   
   # Install PM2
   sudo npm i -g pm2
   ```

2. **Database Setup**
   ```bash
   sudo -u postgres psql
   CREATE DATABASE openbox;
   CREATE USER openboxuser WITH ENCRYPTED PASSWORD 'yourpassword';
   GRANT ALL PRIVILEGES ON DATABASE openbox TO openboxuser;
   \q
   ```

3. **Deploy Application**
   ```bash
   git clone https://github.com/yourusername/openbox-store.git
   cd openbox-store
   npm install
   npm run build
   
   # Setup environment
   cp .env.example .env.local
   # Edit .env.local with production values
   
   # Database migration
   npx prisma db push
   npx prisma db seed
   ```

4. **PM2 Configuration**
   ```bash
   pm2 start npm --name "openbox" -- start
   pm2 save
   pm2 startup
   ```

5. **Nginx Configuration**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

6. **SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

---

## Database Setup (All Platforms)

### Using Neon (Recommended)

1. Sign up at [neon.tech](https://neon.tech)
2. Create new project
3. Choose region closest to your users
4. Copy connection string:
   ```
   postgresql://username:password@host/database?sslmode=require
   ```

### Using Supabase

1. Create project at [supabase.com](https://supabase.com)
2. Go to Settings → Database
3. Copy connection string
4. Use pooling mode for serverless environments

---

## Post-Deployment Checklist

- [ ] Database migrated: `npx prisma db push`
- [ ] Seed data added: `npx prisma db seed`
- [ ] Environment variables set
- [ ] Default login works (seller@example.com / password123)
- [ ] AI features working (if OPENROUTER_API_KEY set)
- [ ] Cron job for daily reports configured (optional)
- [ ] SSL certificate installed
- [ ] Custom domain configured
- [ ] Monitoring/alerts set up

---

## Troubleshooting

### Build Failures
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Database Connection Issues
- Check DATABASE_URL format
- Ensure SSL mode is correct
- Verify database exists

### AI Not Working
- Verify OPENROUTER_API_KEY is set
- Check OpenRouter dashboard for credits
- Review Vercel function logs

---

## Need Help?

- [GitHub Issues](https://github.com/yourusername/openbox-store/issues)
- [GitHub Discussions](https://github.com/yourusername/openbox-store/discussions)
- [API Documentation](API.md)

---

Happy deploying! 🚀
