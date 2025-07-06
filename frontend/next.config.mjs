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
  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline' https://secure.walletconnect.org https://secure.walletconnect.com https://*.walletconnect.org https://*.walletconnect.com;
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
              font-src 'self' https://fonts.gstatic.com;
              img-src 'self' data: https://api.web3modal.com https://api.web3modal.org https://*.walletconnect.org https://*.walletconnect.com;
              connect-src 'self' https://secure.walletconnect.org https://secure.walletconnect.com wss://*.walletconnect.org wss://*.walletconnect.com https://api.web3modal.com https://api.web3modal.org https://rpc.walletconnect.com;
              frame-src 'self' https://secure.walletconnect.org https://secure.walletconnect.com https://*.walletconnect.org https://*.walletconnect.com;
            `.replace(/\s{2,}/g, ' ').trim(),
          },
        ],
      },
    ];
  },
};

export default nextConfig;