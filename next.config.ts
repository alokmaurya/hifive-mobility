import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const isMobile = process.env.IS_MOBILE === "true";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isMobile ? "" : (isProd ? "/hifive-mobility" : ""),
  assetPrefix: isMobile ? "" : (isProd ? "/hifive-mobility/" : ""),
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;