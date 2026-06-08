import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() { 
    return [
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
  // The eslint block has been safely removed from here!
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