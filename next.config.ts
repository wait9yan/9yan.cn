import type { NextConfig } from 'next';
import packageJson from './package.json' assert { type: 'json' };

const nextConfig: NextConfig = {
  output: 'standalone',
  env: {
    APP_VERSION: packageJson.version,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizePackageImports: ['motion', 'jotai'],
  },
};

export default nextConfig;
