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
      <body className={spaceGrotesk.className + ' dark bg-black'}>
        <PrivyProviderWrapper>
          <div className="min-h-screen bg-transparent flex flex-col">
            {/* Global background behind header to match page theme */}
            <div className="fixed inset-0 -z-10">
              <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0a0a0a] to-black" />
              {/* Subtle yellow radial glows to achieve black→yellow theme */}
              <div className="absolute inset-0 pointer-events-none [background:radial-gradient(60%_40%_at_0%_0%,rgba(240,185,11,0.12)_0%,transparent_60%),radial-gradient(50%_35%_at_100%_100%,rgba(240,185,11,0.08)_0%,transparent_60%)]" />
              <Particles 
                className="absolute inset-0" 
                quantity={50} 
                color="#F0B90B" 
                size={0.5}
                staticity={30}
              />
              <InteractiveGridPattern 
                className="absolute inset-0 opacity-20" 
                width={40} 
                height={40}
                size={4}
                gap={1}
                strokeColor="#3a3a3a"
              />
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

