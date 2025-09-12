const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_MEDIA_HOST || 'dogkitchen.paw-spoon.com',
        pathname: '/**',
      },
    ],
  },
};
export default nextConfig;

