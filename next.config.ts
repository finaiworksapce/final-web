import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on"
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload"
  },
  {
    key: "X-Frame-Options",
    value: "DENY" // Prevents clickjacking by disabling iframes
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff" // Prevents MIME type sniffing
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin"
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()"
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self';",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com;",
      "style-src 'self' 'unsafe-inline' https://api.fontshare.com;",
      "img-src 'self' data: https: blob:;",
      "font-src 'self' data: https://cdn.fontshare.com;",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://generativelanguage.googleapis.com https://finnhub.io https://*.vercel-insights.com;",
      "frame-ancestors 'none';"
    ].join(" ")
  }
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "assets.aceternity.com",
      },
    ],
  },
};

export default nextConfig;
