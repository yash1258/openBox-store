import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Next.js 16 uses Turbopack by default - no need for experimental flag
  turbopack: {
    // Turbopack configuration options can go here
  },
  images: {
    // Default minimumCacheTTL changed to 4 hours (14400s) in Next.js 16
    // Adjust if you need different behavior
    minimumCacheTTL: 60,
    // Default qualities is now [75], add more if needed
    qualities: [50, 75, 100],
    // Default imageSizes no longer includes 16, add back if needed
    imageSizes: [32, 48, 64, 96, 128, 256, 384],
  },
}

export default nextConfig
