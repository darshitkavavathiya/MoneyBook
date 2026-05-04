import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
});

const nextConfig: NextConfig = {
  // Turbopack is default in Next.js 16. Setting empty config silences
  // the warning when next-pwa injects a webpack config for production.
  turbopack: {},
};

export default withPWA(nextConfig);
