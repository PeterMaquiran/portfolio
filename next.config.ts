import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    // 👇 this enables the standalone output required by your Dockerfile
  output: 'standalone',
  images: {
    unoptimized: true,  // Static export cannot optimize images
  },
};

export default nextConfig;
