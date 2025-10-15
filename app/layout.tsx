import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import './critical.css';
import './globals.css';
import { PrivyProviderWrapper } from '@/components/providers/privy-provider';
import { I18nProvider } from '@/components/providers/i18n-provider';
import { AnimatedHeader } from '@/components/layout/animated-header';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { PageTransition } from '@/components/ui/page-transition';
import { IntroProvider } from '@/components/providers/intro-provider';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { PerformanceMonitor } from '@/components/ui/performance-monitor';

export const metadata: Metadata = {
  metadataBase: new URL('https://darkbet.fun'),
  title: 'DarkBet - DarkPool Betting Platform',
  description:
    'DarkPool Betting - The future of prediction markets. Built on BNB Smart Chain with AI-driven results and fully on-chain execution.',
  keywords: [
    'darkpool betting',
    'prediction markets',
    'BNB Chain',
    'blockchain',
    'betting',
    'crypto',
    'DeFi',
    'dark pool',
  ],
  authors: [{ name: 'DarkBet Team' }],
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'DarkBet - DarkPool Betting Platform',
    description:
      'DarkPool Betting - The future of prediction markets. Built on BNB Smart Chain with AI-driven results and fully on-chain execution.',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/darkbet.jpg',
        width: 1200,
        height: 630,
        alt: 'DarkBet Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DarkBet - DarkPool Betting Platform',
    description:
      'DarkPool Betting - The future of prediction markets. Built on BNB Smart Chain with AI-driven results and fully on-chain execution.',
    images: ['/darkbet.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains for faster loading */}
        <link rel="preconnect" href="https://auth.privy.io" />
        <link rel="preconnect" href="https://explorer-api.walletconnect.com" />
        <link rel="preconnect" href="https://api.coingecko.com" />
        <link rel="dns-prefetch" href="https://auth.privy.io" />
        <link rel="dns-prefetch" href="https://explorer-api.walletconnect.com" />
        <link rel="dns-prefetch" href="https://api.coingecko.com" />
      </head>
      <body className={GeistSans.className}>
        <I18nProvider>
          <PrivyProviderWrapper>
            <IntroProvider>
              <div className="relative flex min-h-screen flex-col bg-black">
                {/* Animated Background */}
                <AnimatedBackground variant="gradient" />

                <AnimatedHeader />
                <main className="relative z-10 flex-1">
                  <ErrorBoundary>
                    <PageTransition>{children}</PageTransition>
                  </ErrorBoundary>
                </main>
                <PerformanceMonitor />
              </div>
            </IntroProvider>
          </PrivyProviderWrapper>
        </I18nProvider>
      </body>
    </html>
  );
}
