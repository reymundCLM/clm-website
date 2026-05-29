import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() { 
    return [
      // Removed the /sitemap.xml redirect from here so Next.js uses your sitemap.ts file!
      {
        source: '/openapi.json',
        destination: 'https://app.promptgraph.ai/api/v1/confluence-local-marketing/openapi.json',
        permanent: false,
      },
      {
        source: '/.well-known/ai-manifest.json',
        destination: 'https://app.promptgraph.ai/api/v1/confluence-local-marketing/.well-known/ai-manifest.json',
        permanent: false,
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'strapi.confluencelocalmarketing.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'strapi.confluencelocalmarketing.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;