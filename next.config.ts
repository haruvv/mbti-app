import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "images.clerk.dev",
      },
      {
        protocol: "https",
        hostname: "tpwzbzitqbzariowlnfg.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    domains: ["localhost", "tpwzbzitqbzariowlnfg.supabase.co"],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["*"],
    },
  },
};

export default nextConfig;
