import type { NextConfig } from "next";
const nextConfig: any = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
