/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    scrollRestoration: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  optimizeFonts: true,
  images: {
    disableStaticImages: true,
    domains: ["res.cloudinary.com"],
  },
};

module.exports = nextConfig;
