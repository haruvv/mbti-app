/** @type {import('next').NextConfig} */
const nextConfig = {
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
    domains: ["localhost", "your-supabase-project.supabase.co"],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
