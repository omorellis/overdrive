import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Isso ignora erros de tipagem durante o build
    ignoreBuildErrors: true,
  },
  eslint: {
    // Isso ignora erros de lint durante o build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;