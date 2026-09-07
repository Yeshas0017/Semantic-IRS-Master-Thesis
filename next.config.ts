import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ["192.168.68.201", "localhost:3000"],
};

export default nextConfig;