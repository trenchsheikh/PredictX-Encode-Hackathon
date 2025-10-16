'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { usePrivy } from '@privy-io/react-auth';
import { useI18n } from '@/components/providers/i18n-provider';
import { AnimatedButton } from '@/components/ui/animated-button';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, Wallet, Home, Shield, BookOpen } from 'lucide-react';

const navigation = [
  { key: 'nav_home', href: '/', icon: Home, isHome: true },
  { key: 'nav_my_bets', href: '/my-bets', icon: Wallet },
  { key: 'nav_how', href: '/how-it-works', icon: Shield },
  { key: 'nav_docs', href: '/docs', icon: BookOpen },
  // { key: 'nav_leaderboard', href: '/leaderboard', icon: Zap },
];

export function AnimatedHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { locale, setLocale, t } = useI18n();
  const { ready, authenticated, user, login, logout } = usePrivy();
  const navItems = navigation.filter(
    item => item.key !== 'nav_my_bets' || authenticated
  );
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleLanguage = () => {
    const newLocale = locale === 'en' ? 'zh' : 'en';
    setLocale(newLocale);
    // Also update localStorage to sync with docs
    localStorage.setItem('darkbet-locale', newLocale);
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="sticky top-0 z-50"
    >
      {/* Floating glassy navbar container (applied on nav) */}

      <nav className="relative z-10 mx-4 mb-4 mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-black/35 p-3 shadow-lg supports-[backdrop-filter]:backdrop-blur-md lg:mx-auto lg:max-w-7xl lg:px-6">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex lg:flex-1"
        >
          <Link
            href="/"
            className="group flex items-center space-x-3"
            prefetch={false}
          >
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-600">
              <Image
                src="/binanceeye.jpg"
                alt="DarkBet"
                width={32}
                height={32}
                className="rounded-lg object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-brand gradient-text-brand text-2xl font-bold">
                DarkBet
              </span>
              <span className="font-caption text-sm text-gray-400">
                DarkPool Betting
              </span>
            </div>
          </Link>
        </motion.div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            type="button"
            className="rounded-lg p-2 text-gray-300 transition-all duration-200 hover:bg-gray-800/50 hover:text-white"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </motion.button>
        </div>

        {/* Right side: desktop navigation + actions, right-aligned with even spacing */}
        <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:gap-x-6">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -1 }}
              >
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={`group flex items-center space-x-2 rounded-lg px-3 py-2 text-lg font-semibold transition-all duration-200 hover:bg-gray-800/30 ${
                    isActive(item.href)
                      ? 'bg-white/10 text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                  prefetch={item.isHome ? false : undefined}
                >
                  <Icon className="h-4 w-4 transition-colors duration-200 group-hover:text-yellow-400" />
                  <span className="whitespace-nowrap">
                    {mounted
                      ? t(item.key)
                      : item.key
                          .replace('nav_', '')
                          .replace('_', ' ')
                          .replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </Link>
              </motion.div>
            );
          })}

          {/* Divider spacing between nav and actions keeps even gap due to container gap-x-6 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <AnimatedButton
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="flex min-w-[60px] items-center gap-3 text-gray-300 transition-all duration-200 hover:bg-gray-800/30 hover:text-white"
            >
              <Globe className="h-4 w-4 flex-shrink-0" />
              <span className="whitespace-nowrap">
                {mounted ? (locale === 'en' ? '中文' : 'EN') : 'EN'}
              </span>
            </AnimatedButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {!ready ? (
              <AnimatedButton
                disabled
                className="rounded-lg bg-gray-700/50 px-4 py-2 text-gray-400"
              >
                <Wallet className="mr-2 h-4 w-4" />
                {mounted ? t('connecting') : 'Connecting...'}
              </AnimatedButton>
            ) : authenticated ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center space-x-2 rounded-lg border border-green-500/20 bg-green-500/10 px-3 py-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
                  <span className="font-caption text-sm text-green-400">
                    {user?.wallet?.address
                      ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}`
                      : mounted
                        ? t('connected')
                        : 'Connected'}
                  </span>
                </div>
                <AnimatedButton
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="border-red-500/50 text-red-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-300"
                >
                  Disconnect
                </AnimatedButton>
              </div>
            ) : (
              <AnimatedButton
                onClick={login}
                className="rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-600 px-4 py-2 text-black shadow-md transition-all duration-200 hover:from-yellow-500 hover:to-yellow-700 hover:shadow-lg"
              >
                <Wallet className="mr-2 h-4 w-4" />
                {mounted ? t('connect_wallet') : 'Connect Wallet'}
              </AnimatedButton>
            )}
          </motion.div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 lg:hidden"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-sm border-l border-gray-700/50 bg-black shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-gray-700/30 p-4">
                <Link
                  href="/"
                  className="flex items-center space-x-3"
                  onClick={() => setMobileMenuOpen(false)}
                  prefetch={false}
                >
                  <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-600">
                    <Image
                      src="/binanceeye.jpg"
                      alt="DarkBet"
                      width={24}
                      height={24}
                      className="rounded-lg object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-brand gradient-text-brand text-2xl">
                      DarkBet
                    </span>
                    <span className="font-caption text-sm text-gray-400">
                      DarkPool Betting
                    </span>
                  </div>
                </Link>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  type="button"
                  className="rounded-lg p-2 text-gray-400 transition-all duration-200 hover:bg-gray-800/50 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>

              <div className="space-y-6 p-6">
                <div className="space-y-2">
                  {navItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={item.key}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          href={item.href}
                          aria-current={
                            isActive(item.href) ? 'page' : undefined
                          }
                          className={`group flex items-center space-x-3 rounded-xl px-4 py-3 text-lg font-semibold transition-all duration-300 hover:bg-white/10 ${
                            isActive(item.href)
                              ? 'bg-white/10 text-white'
                              : 'text-gray-300 hover:text-white'
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                          prefetch={item.isHome ? false : undefined}
                        >
                          <Icon className="h-5 w-5 transition-colors group-hover:text-yellow-400" />
                          <span className="whitespace-nowrap font-medium">
                            {mounted
                              ? t(item.key)
                              : item.key
                                  .replace('nav_', '')
                                  .replace('_', ' ')
                                  .replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="space-y-4 border-t border-gray-700/50 pt-6">
                  <AnimatedButton
                    variant="outline"
                    size="sm"
                    onClick={toggleLanguage}
                    className="w-full justify-start border-gray-600/50 text-gray-300 hover:text-white"
                  >
                    <Globe className="mr-3 h-4 w-4 flex-shrink-0" />
                    <span className="whitespace-nowrap">
                      {mounted ? (locale === 'en' ? '中文' : 'EN') : 'EN'}
                    </span>
                  </AnimatedButton>

                  {!ready ? (
                    <AnimatedButton
                      disabled
                      className="w-full bg-gray-700 text-gray-300"
                    >
                      <Wallet className="mr-2 h-4 w-4" />
                      {mounted ? t('connecting') : 'Connecting...'}
                    </AnimatedButton>
                  ) : authenticated ? (
                    <div className="space-y-3">
                      <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-3 text-center">
                        <div className="mb-1 flex items-center justify-center space-x-2">
                          <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
                          <span className="font-caption text-sm text-green-400">
                            Connected
                          </span>
                        </div>
                        <div className="text-xs text-gray-400">
                          {user?.wallet?.address
                            ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}`
                            : mounted
                              ? t('connected')
                              : 'Connected'}
                        </div>
                      </div>
                      <AnimatedButton
                        variant="outline"
                        size="sm"
                        onClick={logout}
                        className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10"
                      >
                        Disconnect
                      </AnimatedButton>
                    </div>
                  ) : (
                    <AnimatedButton
                      onClick={login}
                      className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black"
                    >
                      <Wallet className="mr-2 h-4 w-4" />
                      {mounted ? t('connect_wallet') : 'Connect Wallet'}
                    </AnimatedButton>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
