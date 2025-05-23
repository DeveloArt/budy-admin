import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
  basePath: "",
  assetPrefix: "",
};

export default nextConfig;
