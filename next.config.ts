import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // В этом проекте сборка не блокируется типовыми ошибками.
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
