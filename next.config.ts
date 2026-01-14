import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 1. السماح للـ Optimizer بمعالجة الصور المحلية
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
    
    // 2. إذا كنت تستخدم روابط خارجية مثل Unsplash كـ fallback
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;