import type { Metadata } from 'next';
import './globals.css';
import { PrivyProviderWrapper } from '@/components/providers/privy-provider';
import { AnimatedHeader } from '@/components/layout/navbar';
import { IntroProvider } from '@/components/providers/intro-provider';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { FooterGate } from '@/components/layout/footer-gate';
import Image from 'next/image';

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
    <html lang="zh" suppressHydrationWarning>
      <head>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
        `}</style>
      </head>
      <body className="font-[Be_Vietnam_Pro]">
        <PrivyProviderWrapper>
          <IntroProvider>
            <div className="relative flex min-h-screen flex-col bg-gradient-to-br from-gray-900 via-black to-gray-800">
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
      </body>
    </html>
  );
}
