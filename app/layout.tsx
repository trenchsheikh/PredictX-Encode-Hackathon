import { Be_Vietnam_Pro } from 'next/font/google';
import Image from 'next/image';

import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';

import './globals.css';
import '@/lib/console-filter';
import { FooterGate } from '@/components/layout/footer-gate';
import { AnimatedHeader } from '@/components/layout/navbar';
import { IntroProvider } from '@/components/providers/intro-provider';
import { PrivyProviderWrapper } from '@/components/providers/privy-provider';
import { ErrorBoundary } from '@/components/ui/error-boundary';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://darkbet.fun'),
  title: 'DarkBet - Decentralized Prediction Market on Solana',
  description:
    'Next-generation prediction markets on Solana. Lightning-fast, ultra-low fees, commit-reveal betting, and real-time Pyth Network oracles.',
  keywords: [
    'solana',
    'prediction markets',
    'darkpool betting',
    'blockchain',
    'betting',
    'crypto',
    'DeFi',
    'solana dapp',
    'phantom wallet',
    'pyth network',
  ],
  authors: [{ name: 'DarkBet Team' }],
  icons: {
    icon: '/binanceeye.jpg',
  },
  openGraph: {
    title: 'DarkBet - Prediction Market on Solana',
    description:
      'Next-generation prediction markets built on Solana. Lightning-fast transactions, ultra-low fees, and privacy-preserving commit-reveal betting.',
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
    title: 'DarkBet - Prediction Market on Solana',
    description:
      'Next-generation prediction markets on Solana with lightning-fast transactions and ultra-low fees.',
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
      <head></head>
      <body className={beVietnamPro.className}>
        <PrivyProviderWrapper>
          <IntroProvider>
            <div className="relative flex min-h-screen flex-col bg-background">
              <AnimatedHeader />
              <main className="relative z-10 flex-1">
                <ErrorBoundary>{children}</ErrorBoundary>
              </main>
              <FooterGate
                brandName="DarkBet"
                showTopInfo={false}
                showBackgroundBrandText={true}
                showCopyright={false}
                brandLinkHref="https://x.com/DarkbetSOL"
                brandIcon={
                  <Image
                    src="/binanceeye.jpg"
                    alt="DarkBet"
                    width={56}
                    height={56}
                    className="rounded-xl object-cover"
                    priority
                  />
                }
              />
            </div>
          </IntroProvider>
        </PrivyProviderWrapper>
        <Analytics />
      </body>
    </html>
  );
}
