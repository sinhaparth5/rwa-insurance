/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.web3modal.com',
      },
      {
        protocol: 'https',
        hostname: 'api.web3modal.org',
      },
    ]
  },
  webpack: (config, { isServer }) => {
    // Fix for Web3 libraries
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
        querystring: false,
        buffer: false,
      };
    }

    // Ignore HeartbeatWorker files
    config.module.rules.push({
      test: /HeartbeatWorker\.(js|ts)$/,
      loader: 'null-loader',
    });

    return config;
  },
  
  experimental: {
    esmExternals: 'loose',
  },
  
  swcMinify: true,
  reactStrictMode: true,
  
  // Transpile problematic packages
  transpilePackages: [
    '@coinbase/wallet-sdk',
    '@web3modal/wagmi',
    '@web3modal/base',
    '@wagmi/connectors',
    '@walletconnect/core',
    '@walletconnect/utils',
  ],
  
  // Handle missing environment variables gracefully
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },
  
  // Remove CSP headers to allow WalletConnect to work properly
  // WalletConnect has its own CSP that blocks unauthorized domains
};

export default nextConfig;