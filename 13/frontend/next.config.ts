import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "dkstatics-public.digikala.com" },
    ],
  },
};
export default nextConfig;
