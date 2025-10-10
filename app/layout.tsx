import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { PrivyProviderWrapper } from '@/components/providers/privy-provider';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BNBPredict - BNB Chain Prediction Markets',
  description: 'Fully On-Chain Live Betting Market with AI-Driven Results. Built on BNB Smart Chain.',
  keywords: ['prediction markets', 'BNB Chain', 'blockchain', 'betting', 'crypto', 'DeFi'],
  authors: [{ name: 'BNBPredict Team' }],
  openGraph: {
    title: 'BNBPredict - BNB Chain Prediction Markets',
    description: 'Fully On-Chain Live Betting Market with AI-Driven Results. Built on BNB Smart Chain.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BNBPredict - BNB Chain Prediction Markets',
    description: 'Fully On-Chain Live Betting Market with AI-Driven Results. Built on BNB Smart Chain.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <PrivyProviderWrapper>
          <div className="min-h-screen bg-background flex flex-col">
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

