import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://tavuel-back-production.up.railway.app https://*.r2.dev https://storage.tavuel.com",
      "font-src 'self'",
      "connect-src 'self' https://tavuel-back-production.up.railway.app http://192.168.10.7:3000 http://localhost:3000",
      "frame-ancestors 'none'",
    ].join("; "),
  },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "192.168.10.7", port: "3000" },
      { protocol: "http", hostname: "localhost", port: "3000" },
      { protocol: "https", hostname: "storage.tavuel.com" },
      { protocol: "https", hostname: "tavuel-back-production.up.railway.app" },
      { protocol: "https", hostname: "*.r2.dev" },
    ],
  },
  webpack: (config) => {
    // Fix Windows case-sensitivity: pnpm symlinks resolve C:\Dev vs C:\dev
    // causing duplicate module instances that break React context
    config.resolve.symlinks = false;
    return config;
  },
};

export default nextConfig;
