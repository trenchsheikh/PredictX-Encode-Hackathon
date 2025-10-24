/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  output: 'standalone',
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  async headers() {
    // Check if we're in development mode
    const isDev = process.env.NODE_ENV === 'development';

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://auth.privy.io https://cdn.privy.io https://*.privy.io",
              "style-src 'self' 'unsafe-inline' https://auth.privy.io https://cdn.privy.io https://*.privy.io",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data: https:",
              // Allow localhost connections in development
              isDev
                ? "connect-src 'self' http://localhost:* ws://localhost:* https://*.privy.io https://auth.privy.io https://api.privy.io https://bsc-dataseed1.binance.org https://bsc-dataseed.binance.org https://*.binance.org wss://*.binance.org"
                : "connect-src 'self' https://*.privy.io https://auth.privy.io https://api.privy.io https://bsc-dataseed1.binance.org https://bsc-dataseed.binance.org https://*.binance.org wss://*.binance.org",
              "frame-src 'self' https://*.privy.io https://auth.privy.io https://verify.walletconnect.com https://verify.walletconnect.org",
              "frame-ancestors 'self' https://darkbet.fun https://www.darkbet.fun",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              // Only upgrade in production
              ...(isDev ? [] : ['upgrade-insecure-requests']),
            ]
              .filter(Boolean)
              .join('; '),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
