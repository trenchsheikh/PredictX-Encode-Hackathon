import Link from 'next/link';
import { ExternalLink, Twitter, MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <Link
            href="https://dexscreener.com/bsc/your-contract-address"
            className="text-muted-foreground hover:text-primary transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="sr-only">DexScreener</span>
            <ExternalLink className="h-5 w-5" />
          </Link>
          <Link
            href="https://x.com/bnbpredict"
            className="text-muted-foreground hover:text-primary transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="sr-only">X (Twitter)</span>
            <Twitter className="h-5 w-5" />
          </Link>
          <Link
            href="https://t.me/bnbpredict"
            className="text-muted-foreground hover:text-primary transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="sr-only">Telegram</span>
            <MessageCircle className="h-5 w-5" />
          </Link>
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-xs leading-5 text-muted-foreground">
            &copy; 2025 BNBPredict. All Rights Reserved.
          </p>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Contract: 0xcfafecd0b8e866a0626166667bb652bec9d14444
          </p>
        </div>
      </div>
    </footer>
  );
}


