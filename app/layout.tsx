import type { Metadata } from 'next';
import './globals.css';
import '@/lib/console-filter';
import { PrivyProviderWrapper } from '@/components/providers/privy-provider';
import { AnimatedHeader } from '@/components/layout/navbar';
import { IntroProvider } from '@/components/providers/intro-provider';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { FooterGate } from '@/components/layout/footer-gate';
import Image from 'next/image';
import { Be_Vietnam_Pro } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

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
    icon: '/binanceeye.jpg',
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
                brandLinkHref="https://x.com/DarkbetBNB"
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
