import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Игнорировать ошибки TypeScript при сборке
    ignoreBuildErrors: true,
  },
  eslint: {
    // Игнорировать ошибки оформления (Lint) при сборке
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;