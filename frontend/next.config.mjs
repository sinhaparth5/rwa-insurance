/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.web3modal.com',
      }
    ]
  }
};

export default nextConfig;
