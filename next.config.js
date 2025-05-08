/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Skip ESLint during production builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Skip type checking during production builds
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
