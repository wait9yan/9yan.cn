import type { NextConfig } from 'next';
import packageJson from './package.json' assert { type: 'json' };

const nextConfig: NextConfig = {
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
  },
};

export default nextConfig;
