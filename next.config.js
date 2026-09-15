/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.AWF_BUILD_DIR || '.next',
  poweredByHeader: false,
  compress: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'drive.google.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
};
module.exports = nextConfig;
