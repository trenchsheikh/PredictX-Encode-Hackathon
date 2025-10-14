'use client';

import Link from 'next/link';
import {
  ExternalLink,
  Twitter,
  MessageCircle,
  Github,
  Globe,
  Shield,
  Zap,
} from 'lucide-react';
import { useI18n } from '@/components/providers/privy-provider';

const socialLinks = [
  {
    name: 'DexScreener',
    href: 'https://dexscreener.com/bsc/your-contract-address',
    icon: ExternalLink,
    color: 'hover:text-white text-white',
  },
  {
    name: 'X (Twitter)',
    href: 'https://x.com/bnbpredict',
    icon: Twitter,
    color: 'hover:text-white text-white',
  },
  {
    name: 'Telegram',
    href: 'https://t.me/bnbpredict',
    icon: MessageCircle,
    color: 'hover:text-white text-white',
  },
];

const features = [
  { icon: Shield, text: 'Fully On-Chain' },
  { icon: Zap, text: 'AI-Powered' },
  { icon: Globe, text: 'Global Access' },
];

export function AnimatedFooter() {
  const { t } = useI18n();

  return (
    <footer className="relative mt-auto border-t border-gray-700/50 bg-black backdrop-blur-sm">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.1) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.1) 75%),
              linear-gradient(-45deg, transparent 25%, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.1) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.1) 75%)
            `,
            backgroundSize: '20px 20px',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600">
                <span className="text-lg font-bold text-black">D</span>
              </div>
              <div>
                <h3 className="font-brand gradient-text-brand text-xl">
                  DarkBet
                </h3>
                <p className="font-caption text-sm text-gray-400">
                  DarkPool Betting Platform
                </p>
              </div>
            </div>
            <p className="max-w-md text-sm text-gray-300">
              DarkPool Betting - The future of prediction markets. Built on BNB
              Smart Chain with AI-driven results and fully on-chain execution.
            </p>

            {/* Feature badges */}
            <div className="flex flex-wrap gap-2">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center space-x-1 rounded-full border border-gray-700/50 bg-black px-3 py-1 transition-transform duration-200 hover:scale-105"
                  >
                    <Icon className="h-3 w-3 text-yellow-400" />
                    <span className="text-xs text-gray-300">
                      {feature.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-heading text-lg text-white">Quick Links</h4>
            <div className="space-y-2">
              {[
                { name: 'Home', href: '/' },
                { name: 'My Bets', href: '/my-bets' },
                { name: 'How It Works', href: '/how-it-works' },
                { name: 'Leaderboard', href: '/leaderboard' },
              ].map((link, index) => (
                <div key={link.name}>
                  <Link
                    href={link.href}
                    className="block py-1 text-sm text-gray-400 transition-colors duration-300 hover:text-white"
                  >
                    {link.name}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="font-heading text-lg text-white">Connect</h4>
            <div className="flex space-x-3">
              {socialLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <div key={link.name}>
                    <Link
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-center rounded-xl border border-gray-700/50 bg-black p-3 ${link.color} transition-all duration-300 hover:scale-110 hover:border-yellow-500/50 hover:bg-yellow-500/10`}
                      title={link.name}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span className="sr-only">{link.name}</span>
                    </Link>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-gray-700/50 pt-4">
              <p className="text-xs text-gray-500">
                Built on BNB Smart Chain • Powered by AI • Fully Decentralized
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 flex flex-col items-center justify-between space-y-4 border-t border-gray-700/50 pt-8 md:flex-row md:space-y-0">
          <p className="text-center text-xs text-gray-400 md:text-left">
            &copy; 2025 DarkPool. {t('all_rights_reserved')}
          </p>

          <div className="flex items-center space-x-6 text-xs text-gray-500">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Disclaimer</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
