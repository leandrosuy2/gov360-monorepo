import type { NextConfig } from "next";

const apiInternal = process.env.API_URL ?? "http://127.0.0.1:3001";

const apiPrefixes = [
  "health",
  "auth",
  "users",
  "opportunities",
  "tenders",
  "documents",
  "tasks",
  "contracts",
  "proposals",
  "price-records",
  "auctions",
  "competitors",
  "financial",
  "audit",
  "integrations",
  "tender-analysis",
];

const nextConfig: NextConfig = {
  transpilePackages: [
    "@gov360/ui",
    "@gov360/utils",
    "@gov360/types",
    "@gov360/api-client",
    "@gov360/env",
  ],
  async rewrites() {
    return [
      { source: "/dashboard/stats", destination: `${apiInternal}/dashboard/stats` },
      ...apiPrefixes.flatMap((prefix) => [
        { source: `/${prefix}`, destination: `${apiInternal}/${prefix}` },
        { source: `/${prefix}/:path*`, destination: `${apiInternal}/${prefix}/:path*` },
      ]),
    ];
  },
};

export default nextConfig;
