'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { usePrivy } from '@privy-io/react-auth';
import { useI18n } from '@/components/providers/i18n-provider';
import { AnimatedButton } from '@/components/ui/animated-button';
import { Menu, X, Wallet, Home, HelpCircle, BookOpen } from 'lucide-react';

const navigation = [
  { key: 'nav_home', href: '/', icon: Home, isHome: true },
  { key: 'nav_my_bets', href: '/my-bets', icon: Wallet },
  { key: 'nav_how', href: '/how-it-works', icon: HelpCircle },
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
    localStorage.setItem('darkbet-locale', newLocale);
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Floating glassy navbar container (applied on nav) */}

      <nav className="relative z-10 mx-4 mb-4 mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-black/50 p-3 shadow-lg supports-[backdrop-filter]:backdrop-blur-md lg:mx-auto lg:max-w-screen-xl lg:px-8">
        {/* Logo */}
        <div className="flex flex-shrink-0">
          <Link
            href="/"
            className="group flex items-center space-x-3"
            prefetch={false}
          >
            <Image
              src="/binanceeye.jpg"
              alt="Logo"
              width={44}
              height={44}
              className="rounded-lg object-cover"
            />
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="rounded-lg p-2 text-gray-300 transition-all duration-200 hover:bg-gray-800/50 hover:text-white"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Right side: desktop navigation + actions, right-aligned with even spacing */}
        <div className="hidden lg:flex lg:flex-1 lg:flex-nowrap lg:items-center lg:justify-end lg:gap-x-5">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={item.key}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={`group flex items-center space-x-2 rounded-lg px-3 py-2 text-lg font-semibold transition-all duration-300 hover:bg-white/10 ${
                    isActive(item.href)
                      ? 'border border-yellow-400/30 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 text-yellow-400'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                  prefetch={item.isHome ? false : undefined}
                >
                  {!(
                    item.key === 'nav_home' ||
                    item.key === 'nav_how' ||
                    item.key === 'nav_docs' ||
                    item.key === 'nav_my_bets'
                  ) && (
                    <Icon className="h-4 w-4 transition-colors duration-200 group-hover:text-yellow-400" />
                  )}
                  <span className="whitespace-nowrap">
                    {mounted
                      ? t(item.key)
                      : item.key
                          .replace('nav_', '')
                          .replace('_', ' ')
                          .replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </Link>
              </div>
            );
          })}

          {/* Divider spacing between nav and actions keeps even gap due to container gap-x-6 */}
          <div>
            <AnimatedButton
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="flex min-w-[52px] items-center gap-2 border-none text-lg font-semibold text-gray-300 ring-0 transition-all duration-200 hover:bg-gray-800/30 hover:text-white focus:outline-none focus:ring-0 focus-visible:ring-0"
            >
              <span className="whitespace-nowrap">
                {mounted ? (locale === 'en' ? '中文' : 'EN') : 'EN'}
              </span>
            </AnimatedButton>
          </div>

          <div>
            {!ready ? (
              <AnimatedButton
                disabled
                className="pointer-events-none rounded-full border border-orange-600 bg-gradient-to-b from-[#ffb84d] to-[#cc6b00] px-6 py-2 font-semibold tracking-wide text-white/95 opacity-85 shadow-md ring-1 ring-black/40 backdrop-blur-sm"
              >
                {mounted ? t('connecting') : 'Connecting...'}
              </AnimatedButton>
            ) : authenticated ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center rounded-full border border-yellow-400/30 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 px-3 py-2 text-yellow-400 backdrop-blur-sm">
                  <span className="font-caption text-sm">
                    {user?.wallet?.address
                      ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}`
                      : mounted
                        ? t('connected')
                        : 'Connected'}
                  </span>
                </div>
                <AnimatedButton
                  size="sm"
                  onClick={logout}
                  className="rounded-full border border-red-600 bg-gradient-to-b from-[#ff6b6b] to-[#b40000] px-4 py-2 font-semibold text-white shadow-lg shadow-red-900/40 ring-1 ring-black/40 transition-all duration-200 hover:from-[#ff7d7d] hover:to-[#990000]"
                >
                  Disconnect
                </AnimatedButton>
              </div>
            ) : (
              <AnimatedButton
                onClick={login}
                className="rounded-full border border-yellow-400/40 bg-gradient-to-r from-yellow-400 to-yellow-600 px-6 py-2 font-semibold tracking-wide text-black shadow-lg shadow-yellow-500/25 backdrop-blur-sm transition-all duration-300 hover:from-yellow-500 hover:to-yellow-700 hover:shadow-xl hover:shadow-yellow-500/40"
              >
                {mounted ? t('connect_wallet') : 'Connect Wallet'}
              </AnimatedButton>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 lg:hidden">
          <div className="fixed inset-y-0 right-0 w-full max-w-sm border-l border-gray-700/50 bg-black shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-700/30 p-4">
              <div />
              <button
                type="button"
                className="rounded-lg p-2 text-gray-400 transition-all duration-200 hover:bg-gray-800/50 hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div className="space-y-1.5">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.key}>
                      <Link
                        href={item.href}
                        aria-current={isActive(item.href) ? 'page' : undefined}
                        className={`group flex items-center space-x-3 rounded-xl px-3 py-2 text-lg font-semibold transition-all duration-300 hover:bg-white/10 ${
                          isActive(item.href)
                            ? 'border border-yellow-400/30 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 text-yellow-400'
                            : 'text-gray-300 hover:bg-white/5 hover:text-white'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                        prefetch={item.isHome ? false : undefined}
                      >
                        {!(
                          item.key === 'nav_home' ||
                          item.key === 'nav_how' ||
                          item.key === 'nav_docs' ||
                          item.key === 'nav_my_bets'
                        ) && (
                          <Icon className="h-5 w-5 transition-colors group-hover:text-yellow-400" />
                        )}
                        <span className="whitespace-nowrap font-medium">
                          {mounted
                            ? t(item.key)
                            : item.key
                                .replace('nav_', '')
                                .replace('_', ' ')
                                .replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </Link>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-4 border-t border-gray-700/50 pt-6">
                <AnimatedButton
                  variant="ghost"
                  size="sm"
                  onClick={toggleLanguage}
                  className="w-full justify-start border-none text-gray-300 ring-0 hover:text-white focus:outline-none focus:ring-0 focus-visible:ring-0"
                >
                  <span className="whitespace-nowrap">
                    {mounted ? (locale === 'en' ? '中文' : 'EN') : 'EN'}
                  </span>
                </AnimatedButton>

                {!ready ? (
                  <AnimatedButton
                    disabled
                    className="pointer-events-none w-full rounded-full border border-yellow-600 bg-gradient-to-b from-[#f5c83b] to-[#a46b00] px-6 py-2 font-semibold tracking-wide text-white opacity-80 shadow-lg shadow-yellow-900/40 drop-shadow-[0_2px_2px_rgba(0,0,0,0.85)] backdrop-blur-sm"
                  >
                    {mounted ? t('connecting') : 'Connecting...'}
                  </AnimatedButton>
                ) : authenticated ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex flex-1 items-center justify-start rounded-full border border-yellow-400/30 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 px-3 py-2 text-yellow-400 backdrop-blur-sm">
                        <span className="font-caption text-sm">
                          {user?.wallet?.address
                            ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}`
                            : mounted
                              ? t('connected')
                              : 'Connected'}
                        </span>
                      </div>
                    </div>
                    <AnimatedButton
                      size="sm"
                      onClick={logout}
                      className="w-full rounded-full border border-red-600 bg-gradient-to-b from-[#ff6b6b] to-[#b40000] px-4 py-2 font-semibold text-white shadow-lg shadow-red-900/40 ring-1 ring-black/40 transition-all duration-200 hover:from-[#ff7d7d] hover:to-[#990000]"
                    >
                      Disconnect
                    </AnimatedButton>
                  </div>
                ) : (
                  <AnimatedButton
                    onClick={login}
                    className="w-full rounded-full border border-yellow-400/40 bg-gradient-to-r from-yellow-400 to-yellow-600 px-6 py-2 font-semibold tracking-wide text-black shadow-lg shadow-yellow-500/25 backdrop-blur-sm transition-all duration-300 hover:from-yellow-500 hover:to-yellow-700 hover:shadow-xl hover:shadow-yellow-500/40"
                  >
                    {mounted ? t('connect_wallet') : 'Connect Wallet'}
                  </AnimatedButton>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
