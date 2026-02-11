/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: false
  },
  typescript: {
    ignoreBuildErrors: false
  },
  images: {
    remotePatterns: [],
    formats: ['image/avif', 'image/webp']
  },
  staticPageGenerationTimeout: 120
};

export default nextConfig;
