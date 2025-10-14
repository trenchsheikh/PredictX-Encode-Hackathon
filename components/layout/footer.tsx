'use client';
import Link from 'next/link';
import { ExternalLink, Twitter, MessageCircle } from 'lucide-react';

import { useI18n } from '@/components/providers/privy-provider';

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-black bg-black/90 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <Link
            href="https://dexscreener.com/bsc/your-contract-address"
            className="text-gray-300 transition-colors hover:text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="sr-only">DexScreener</span>
            <ExternalLink className="h-5 w-5" />
          </Link>
          <Link
            href="https://x.com/bnbpredict"
            className="text-gray-300 transition-colors hover:text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="sr-only">X (Twitter)</span>
            <Twitter className="h-5 w-5" />
          </Link>
          <Link
            href="https://t.me/bnbpredict"
            className="text-gray-300 transition-colors hover:text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="sr-only">Telegram</span>
            <MessageCircle className="h-5 w-5" />
          </Link>
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-xs leading-5 text-gray-300">
            &copy; 2025 DarkBet. {t('all_rights_reserved')}
          </p>
        </div>
      </div>
    </footer>
  );
}
