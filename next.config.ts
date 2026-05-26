import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export', // Forces static generation
  trailingSlash: true,
  basePath: process.env.NODE_ENV === 'production' ? '/Fintechconnect-website' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/Fintechconnect-website/' : '',
  // This is required for images to work on static exports
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
