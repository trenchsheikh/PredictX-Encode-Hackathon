import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { PrivyProviderWrapper } from '@/components/providers/privy-provider';
import { AnimatedHeader } from '@/components/layout/animated-header';
import { AnimatedFooter } from '@/components/layout/animated-footer';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { PageTransition } from '@/components/ui/page-transition';
import { IntroProvider } from '@/components/providers/intro-provider';
import { ErrorBoundary } from '@/components/ui/error-boundary';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});
const poppins = Poppins({ 
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://darkbet.vercel.app'),
  title: 'DarkBet - DarkPool Betting Platform',
  description: 'DarkPool Betting - The future of prediction markets. Built on BNB Smart Chain with AI-driven results and fully on-chain execution.',
  keywords: ['darkpool betting', 'prediction markets', 'BNB Chain', 'blockchain', 'betting', 'crypto', 'DeFi', 'dark pool'],
  authors: [{ name: 'DarkBet Team' }],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'DarkBet - DarkPool Betting Platform',
    description: 'DarkPool Betting - The future of prediction markets. Built on BNB Smart Chain with AI-driven results and fully on-chain execution.',
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
    description: 'DarkPool Betting - The future of prediction markets. Built on BNB Smart Chain with AI-driven results and fully on-chain execution.',
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
      <body className={`${inter.className} ${poppins.variable} ${inter.variable}`}>
        <PrivyProviderWrapper>
          <IntroProvider>
            <div className="min-h-screen flex flex-col relative">
              {/* Animated Background */}
              <AnimatedBackground variant="gradient" />
              
              <AnimatedHeader />
              <main className="flex-1 relative z-10">
                <ErrorBoundary>
                  <PageTransition>
                    {children}
                  </PageTransition>
                </ErrorBoundary>
              </main>
              <AnimatedFooter />
            </div>
          </IntroProvider>
        </PrivyProviderWrapper>
      </body>
    </html>
  );
}

