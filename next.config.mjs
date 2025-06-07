/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',

  images: {
    unoptimized: true,
    domains: ['picsum.photos', 'upload.wikimedia.org'], // Add allowed image domains here
  },
};

export default nextConfig;
