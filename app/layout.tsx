import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import { PrivyProviderWrapper } from '@/components/providers/privy-provider';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { InteractiveGridPattern } from '@/components/ui/interactive-grid-pattern';
import { Particles } from '@/components/ui/particles';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://darkbet.vercel.app'),
  title: 'DarkBet - BNB Chain Prediction Markets',
  description: 'Fully On-Chain Live Betting Market with AI-Driven Results. Built on BNB Smart Chain.',
  keywords: ['prediction markets', 'BNB Chain', 'blockchain', 'betting', 'crypto', 'DeFi'],
  authors: [{ name: 'DarkBet Team' }],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'DarkBet - BNB Chain Prediction Markets',
    description: 'Fully On-Chain Live Betting Market with AI-Driven Results. Built on BNB Smart Chain.',
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
    title: 'DarkBet - BNB Chain Prediction Markets',
    description: 'Fully On-Chain Live Betting Market with AI-Driven Results. Built on BNB Smart Chain.',
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
      <body className={spaceGrotesk.className}>
        <PrivyProviderWrapper>
          <div className="min-h-screen flex flex-col relative">
            {/* Global Yellow Background - Clean, no dust */}
            <div className="fixed inset-0 -z-50">
              {/* Base yellow gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600" />
            </div>
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </PrivyProviderWrapper>
      </body>
    </html>
  );
}

