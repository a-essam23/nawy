import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.eu-central-1.amazonaws.com",
      },

      {
        protocol: "https",
        hostname: "iili.io",
      },
    ],
  },
};

export default nextConfig;
