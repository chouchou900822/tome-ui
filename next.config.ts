import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 全静态导出到 out/，供任意静态托管
  output: "export",
};

export default nextConfig;
