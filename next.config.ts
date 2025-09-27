// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "dogkitchen.paw-spoon.com" },
      { protocol: "https", hostname: "*.paw-spoon.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.cloudflare.com" },
      { protocol: "https", hostname: "*.r2.cloudflarestorage.com" },
      { protocol: "https", hostname: "1da531377a6fe6d969f5c2b84e4a3eda.r2.cloudflarestorage.com" },
      { protocol: "https", hostname: "pub-cfe9dbdc66fe4ac2a608873ba0acfdc4.r2.dev" },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
  experimental: {
    optimizePackageImports: ['@supabase/supabase-js', 'stripe'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  poweredByHeader: false,
  compress: true,
  generateEtags: true,
  // ESLintルールを本番ビルドで無効化
  eslint: {
    ignoreDuringBuilds: true,
  },
  // APIルートのボディサイズ制限は各APIルートで個別に設定
};

export default nextConfig;
