import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() { // Change back to redirects
    return [
      {
        source: '/sitemap.xml',
        destination: 'https://app.promptgraph.ai/api/v1/confluence-local-marketing/sitemap.xml',
        permanent: false,
      },
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