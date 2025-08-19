import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    baseUrl: process.env.BASE_URL
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true
  },
  /* config options here */
};

export default nextConfig;
