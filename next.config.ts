import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "192.168.10.7", port: "3000" },
      { protocol: "http", hostname: "localhost", port: "3000" },
      { protocol: "https", hostname: "storage.tavuel.com" },
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
