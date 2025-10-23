'use client';

import { useState, useEffect } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { usePrivy } from '@privy-io/react-auth';
import { Menu, X, Wallet, Home, HelpCircle } from 'lucide-react';

import { useI18n } from '@/components/providers/i18n-provider';
import { AnimatedButton } from '@/components/ui/animated-button';

const getNavigation = (_locale: string) => [
  { key: 'nav_home', href: '/', icon: Home, isHome: true },
  { key: 'nav_my_bets', href: '/my-bets', icon: Wallet },
  { key: 'nav_how', href: '/how-it-works', icon: HelpCircle },
  // { key: 'nav_leaderboard', href: '/leaderboard', icon: Zap },
];

export function AnimatedHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { locale, setLocale, t } = useI18n();
  const { ready, authenticated, user, login, logout } = usePrivy();
  const navItems = getNavigation(locale).filter(
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

      <nav className="relative z-10 mx-2 mb-2 mt-2 flex items-center justify-between border border-border bg-card/50 p-2 supports-[backdrop-filter]:backdrop-blur-md lg:mx-auto lg:max-w-screen-xl lg:px-4">
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
              className="object-cover"
            />
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="p-2 text-gray-300"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Right side: desktop navigation + actions, right-aligned with even spacing */}
        <div className="hidden lg:flex lg:flex-1 lg:flex-nowrap lg:items-center lg:justify-end lg:gap-x-1">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <div key={item.key}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={`group flex items-center space-x-2 px-2 py-1 text-base font-semibold ${
                    isActive(item.href)
                      ? 'border border-white/30 bg-white/20 text-white'
                      : 'text-gray-300'
                  }`}
                  prefetch={item.isHome ? false : undefined}
                >
                  {!(
                    item.key === 'nav_home' ||
                    item.key === 'nav_how' ||
                    item.key === 'nav_docs' ||
                    item.key === 'nav_my_bets'
                  ) && (
                    <Icon className="h-4 w-4 transition-colors duration-200 group-hover:text-white" />
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
              className="flex min-w-[52px] items-center gap-1 border-none text-base font-semibold text-gray-300 ring-0 focus:outline-none focus:ring-0 focus-visible:ring-0"
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
                className="pointer-events-none border border-white/60 bg-white px-4 py-1 font-semibold tracking-wide text-black opacity-85 ring-1 ring-black/40 backdrop-blur-sm"
              >
                {mounted ? t('connecting') : 'Connecting...'}
              </AnimatedButton>
            ) : authenticated ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center border border-white/30 bg-white/20 px-2 py-1 text-white backdrop-blur-sm">
                  <span className="font-caption text-sm">
                    {user?.wallet?.address
                      ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}`
                      : mounted
                        ? t('connected')
                        : 'Connected'}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="border border-white/20 bg-white/10 px-3 py-1 font-semibold text-white"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <AnimatedButton
                onClick={login}
                className="border border-white/40 bg-white px-4 py-1 font-semibold tracking-wide text-black backdrop-blur-sm"
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
          <div className="fixed inset-y-0 right-0 w-full max-w-sm border-l border-gray-700/50 bg-black">
            <div className="flex items-center justify-between border-b border-gray-700/30 p-4">
              <div />
              <button
                type="button"
                className="p-2 text-gray-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div className="space-y-1.5">
                {navItems.map(item => {
                  const Icon = item.icon;
                  return (
                    <div key={item.key}>
                      <Link
                        href={item.href}
                        aria-current={isActive(item.href) ? 'page' : undefined}
                        className={`group flex items-center space-x-3 px-2 py-1 text-base font-semibold ${
                          isActive(item.href)
                            ? 'border border-white/30 bg-white/20 text-white'
                            : 'text-gray-300'
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
                          <Icon className="h-5 w-5 transition-colors group-hover:text-white" />
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
                  className="w-full justify-start border-none text-gray-300 ring-0 focus:outline-none focus:ring-0 focus-visible:ring-0"
                >
                  <span className="whitespace-nowrap">
                    {mounted ? (locale === 'en' ? '中文' : 'EN') : 'EN'}
                  </span>
                </AnimatedButton>

                {!ready ? (
                  <AnimatedButton
                    disabled
                    className="pointer-events-none w-full border border-white/60 bg-white px-4 py-1 font-semibold tracking-wide text-black opacity-80 backdrop-blur-sm"
                  >
                    {mounted ? t('connecting') : 'Connecting...'}
                  </AnimatedButton>
                ) : authenticated ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex flex-1 items-center justify-start border border-white/30 bg-white/20 px-2 py-1 text-white backdrop-blur-sm">
                        <span className="font-caption text-sm">
                          {user?.wallet?.address
                            ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}`
                            : mounted
                              ? t('connected')
                              : 'Connected'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={logout}
                      className="w-full border border-white/20 bg-white/10 px-3 py-1 font-semibold text-white"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <AnimatedButton
                    onClick={login}
                    className="w-full border border-white/40 bg-white px-4 py-1 font-semibold tracking-wide text-black backdrop-blur-sm"
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
