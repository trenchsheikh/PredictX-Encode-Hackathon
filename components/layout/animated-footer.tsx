'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ExternalLink,
  Twitter,
  MessageCircle,
  Github,
  Globe,
  Shield,
  Zap,
} from 'lucide-react';
import { useI18n } from '@/components/providers/i18n-provider';

const socialLinks = [
  {
    name: 'DexScreener',
    href: 'https://dexscreener.com/bsc/your-contract-address',
    icon: ExternalLink,
    color: 'hover:text-blue-400',
  },
  {
    name: 'X (Twitter)',
    href: 'https://x.com/bnbpredict',
    icon: Twitter,
    color: 'hover:text-blue-400',
  },
  {
    name: 'Telegram',
    href: 'https://t.me/bnbpredict',
    icon: MessageCircle,
    color: 'hover:text-blue-400',
  },
  {
    name: 'GitHub',
    href: 'https://github.com/darkbet',
    icon: Github,
    color: 'hover:text-gray-300',
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
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="relative border-t border-gray-700/50 bg-gradient-to-t from-gray-900/95 to-gray-800/80 backdrop-blur-sm"
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-5"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
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
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
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
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center space-x-1 rounded-full border border-gray-700/50 bg-gray-800/50 px-3 py-1"
                  >
                    <Icon className="h-3 w-3 text-yellow-400" />
                    <span className="text-xs text-gray-300">
                      {feature.text}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h4 className="font-heading text-lg text-white">Quick Links</h4>
            <div className="space-y-2">
              {[
                { name: 'Home', href: '/' },
                { name: 'My Bets', href: '/my-bets' },
                { name: 'How It Works', href: '/how-it-works' },
                { name: 'Leaderboard', href: '/leaderboard' },
              ].map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className="block py-1 text-sm text-gray-400 transition-colors duration-300 hover:text-white"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h4 className="font-heading text-lg text-white">Connect</h4>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`rounded-xl border border-gray-700/50 bg-gray-800/50 p-3 text-gray-400 ${link.color} transition-all duration-300 hover:border-yellow-500/50 hover:bg-yellow-500/10`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="sr-only">{link.name}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            <div className="border-t border-gray-700/50 pt-4">
              <p className="text-xs text-gray-500">
                Built on BNB Smart Chain • Powered by AI • Fully Decentralized
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex flex-col items-center justify-between space-y-4 border-t border-gray-700/50 pt-8 md:flex-row md:space-y-0"
        >
          <p className="text-center text-xs text-gray-400 md:text-left">
            &copy; 2025 DarkPool. {t('all_rights_reserved')}
          </p>

          <div className="flex items-center space-x-6 text-xs text-gray-500">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Disclaimer</span>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
