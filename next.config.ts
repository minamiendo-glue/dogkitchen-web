// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "dogkitchen.paw-spoon.com" },
      { protocol: "https", hostname: "*.paw-spoon.com" },
    ],
  },
};

export default nextConfig;
