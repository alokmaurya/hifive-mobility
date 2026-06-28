import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? "/hifive-mobility" : "",
  assetPrefix: isProd ? "/hifive-mobility/" : "",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
