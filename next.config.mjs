/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.(ttf|html)$/i,
      type: 'asset/resource'
    });
    
    // Exclude playwright and puppeteer from client bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
      };
    }
    
    return config;
  },
  experimental: {
    serverMinification: false, // the server minification unfortunately breaks the selector class names
    serverComponentsExternalPackages: ['@playwright/browser-chromium', 'rebrowser-playwright-core'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn1.suno.ai',
      },
      {
        protocol: 'https',
        hostname: 'cdn2.suno.ai',
      },
    ],
  },
  // Skip type checking and linting during build to speed up
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};  

export default nextConfig;
