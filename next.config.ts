import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    DASHBOARD_URL: process.env.DASHBOARD_URL,
    BACKEND_URL: process.env.BACKEND_URL,
    CLIENT_KEY_STRIPE: process.env.CLIENT_KEY_STRIPE,
    CLIENT_KEY_STRIPE_PROD: process.env.CLIENT_KEY_STRIPE_PROD,
  },
};

export default nextConfig;
