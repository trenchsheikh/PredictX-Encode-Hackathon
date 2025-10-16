'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePrivy } from '@privy-io/react-auth';
import { useI18n } from '@/components/providers/i18n-provider';
import { Button } from '@/components/ui/button';
import { Magnetic } from '@/components/ui/magnetic';
import { Menu, X, Globe, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { key: 'nav_home', href: '/' },
  { key: 'nav_my_bets', href: '/my-bets' },
  { key: 'nav_how', href: '/how-it-works' },
  { key: 'nav_leaderboard', href: '/leaderboard' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { locale, setLocale, t } = useI18n();
  const { ready, authenticated, user, login, logout } = usePrivy();

  const toggleLanguage = () => {
    setLocale(locale === 'en' ? 'zh' : 'en');
  };

  return (
    <header className="relative top-0 z-50">
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600" />
      <nav
        className="relative z-10 mx-auto mb-3 mt-3 flex max-w-7xl items-center justify-between rounded-full border border-black bg-black/90 p-2 shadow-lg backdrop-blur-md lg:px-4"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 flex items-center space-x-2 p-1.5">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full">
              <Image
                src="/binanceeye.jpg"
                alt="DarkBet"
                width={56}
                height={56}
                className="scale-75 object-cover"
              />
            </div>
            <span className="text-xl font-bold text-white">DarkBet</span>
          </Link>
        </div>

        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map(item => (
            <Magnetic key={item.key} intensity={0.1} scale={1.05}>
              <Link
                href={item.href}
                className="text-sm font-semibold leading-6 text-gray-200 transition-colors hover:text-white"
              >
                {t(item.key)}
              </Link>
            </Magnetic>
          ))}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          <Magnetic intensity={0.1} scale={1.05}>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center gap-2 border border-white/20 text-gray-200 hover:bg-white/10 hover:text-white"
            >
              <Globe className="h-4 w-4" />
              {locale === 'en' ? '中文' : 'EN'}
            </Button>
          </Magnetic>

          {!ready ? (
            <Magnetic intensity={0.1} scale={1.05}>
              <Button
                disabled
                className="bg-secondary text-secondary-foreground"
              >
                <Wallet className="mr-2 h-4 w-4" />
                {t('connecting')}
              </Button>
            </Magnetic>
          ) : authenticated ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {user?.wallet?.address
                  ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}`
                  : t('connected')}
              </span>
              <Magnetic intensity={0.1} scale={1.05}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="border-yellow-500/20 hover:bg-yellow-500/10"
                >
                  Disconnect
                </Button>
              </Magnetic>
            </div>
          ) : (
            <Magnetic intensity={0.1} scale={1.05}>
              <Button
                onClick={login}
                className="btn-primary shadow-[0_0_20px_rgba(240,185,11,0.25)]"
              >
                <Wallet className="mr-2 h-4 w-4" />
                {t('connect_wallet')}
              </Button>
            </Magnetic>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={cn('lg:hidden', mobileMenuOpen ? 'block' : 'hidden')}>
        <div className="fixed inset-0 z-50" />
        <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-black/90 px-6 py-6 backdrop-blur-md sm:max-w-sm sm:ring-1 sm:ring-black">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 flex items-center space-x-2 p-1.5">
              <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full">
                <Image
                  src="/binanceeye.jpg"
                  alt="DarkBet"
                  width={56}
                  height={56}
                  className="scale-75 object-cover"
                />
              </div>
              <span className="text-xl font-bold text-white">DarkBet</span>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-700">
              <div className="space-y-2 py-6">
                {navigation.map(item => (
                  <Link
                    key={item.key}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-200 hover:bg-white/10 hover:text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t(item.key)}
                  </Link>
                ))}
              </div>
              <div className="space-y-4 py-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleLanguage}
                  className="w-full justify-start border border-white/20 text-gray-200 hover:bg-white/10 hover:text-white"
                >
                  <Globe className="mr-2 h-4 w-4" />
                  {locale === 'en' ? '中文' : 'EN'}
                </Button>

                {!ready ? (
                  <Button disabled className="w-full bg-gray-700 text-white">
                    <Wallet className="mr-2 h-4 w-4" />
                    {t('connecting')}
                  </Button>
                ) : authenticated ? (
                  <div className="space-y-2">
                    <div className="text-center text-sm text-gray-300">
                      {user?.wallet?.address
                        ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}`
                        : t('connected')}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={logout}
                      className="w-full border-white/20 text-gray-200 hover:bg-white/10"
                    >
                      {t('disconnect')}
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={login}
                    className="w-full bg-white text-black hover:bg-gray-200"
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    {t('connect_wallet')}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
