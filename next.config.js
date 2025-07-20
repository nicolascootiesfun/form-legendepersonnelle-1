/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['fabluo.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fabluo.com',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    N8N_WEBHOOK_BASE_URL: process.env.N8N_WEBHOOK_BASE_URL,
  },
}

module.exports = nextConfig
