import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@gov360/ui",
    "@gov360/utils",
    "@gov360/types",
    "@gov360/api-client",
    "@gov360/env",
  ],
};

export default nextConfig;
