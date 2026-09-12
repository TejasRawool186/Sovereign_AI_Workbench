import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname),

  images: {
    // Serve modern formats — browser gets AVIF first, falls back to WebP, then original
    formats: ["image/avif", "image/webp"],

    // Cover every common viewport width for `fill` images
    deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920, 2048],

    // Cover logo / icon sizes used in the UI
    imageSizes: [16, 32, 48, 64, 96, 128, 256],

    // Cache optimised images for 60 days (default is 60 s)
    minimumCacheTTL: 60 * 60 * 24 * 60,
  },
};

export default nextConfig;
