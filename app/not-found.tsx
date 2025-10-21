import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 px-4">
      {/* Background Pattern */}
      <div className="bnb-pattern absolute inset-0 opacity-20" />

      {/* Content */}
      <div className="relative z-10 text-center">
        {/* Logo */}
        <div className="mb-8 animate-float">
          <Image
            src="/binanceeye.jpg"
            alt="DarkBet"
            width={120}
            height={120}
            className="mx-auto rounded-2xl object-cover shadow-2xl"
            priority
          />
        </div>

        {/* 404 Number */}
        <div className="mb-6">
          <h1 className="font-brand-large gradient-text-brand animate-glow text-8xl md:text-9xl">
            404
          </h1>
        </div>

        {/* Error Message */}
        <Card className="card-gradient mx-auto mb-8 max-w-md border-yellow-500/20">
          <CardContent className="p-8">
            <h2 className="font-heading mb-4 text-2xl text-white">
              Page Not Found
            </h2>
            <p className="font-body mb-6 leading-relaxed text-gray-300">
              The page you're looking for doesn't exist or has been moved. Let's
              get you back to the action!
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                asChild
                className="btn-primary transition-smooth hover:scale-105"
              >
                <Link href="/">
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Back to Home
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="transition-smooth border-yellow-500/30 text-yellow-400 hover:scale-105 hover:bg-yellow-500/10"
              >
                <Link href="/my-bets">
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  My Bets
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Additional Help */}
        <div className="text-center">
          <p className="font-caption mb-4 text-gray-400">
            Need help? Check out our resources:
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link
              href="/how-it-works"
              className="text-yellow-400 transition-colors duration-200 hover:text-yellow-300 hover:underline"
            >
              How It Works
            </Link>
            <Link
              href="/leaderboard"
              className="text-yellow-400 transition-colors duration-200 hover:text-yellow-300 hover:underline"
            >
              Leaderboard
            </Link>
            <a
              href="https://x.com/DarkbetBNB"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-400 transition-colors duration-200 hover:text-yellow-300 hover:underline"
            >
              Support
            </a>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute left-10 top-20 h-4 w-4 animate-pulse-glow rounded-full bg-yellow-400/20" />
      <div className="absolute right-20 top-40 h-6 w-6 animate-float rounded-full bg-yellow-400/10" />
      <div className="absolute bottom-32 left-20 h-3 w-3 animate-pulse-glow rounded-full bg-yellow-400/30" />
      <div className="absolute bottom-20 right-10 h-5 w-5 animate-float rounded-full bg-yellow-400/15" />
    </div>
  );
}
