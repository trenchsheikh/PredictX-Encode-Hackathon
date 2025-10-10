'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePrivy } from '@privy-io/react-auth';
import { useI18n } from '@/components/providers/privy-provider';
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
    <header className="sticky top-0 z-50 bg-gradient-to-b from-black/70 to-transparent">
      <nav className="mx-auto mt-3 mb-3 flex max-w-7xl items-center justify-between p-2 lg:px-4 rounded-full bg-black/40 backdrop-blur supports-[backdrop-filter]:bg-black/40" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center space-x-2">
            <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center">
              <Image src="/binanceeye.jpg" alt="DarkBet" width={36} height={36} className="object-cover" />
            </div>
            <span className="text-xl font-bold text-gradient">DarkBet</span>
          </Link>
        </div>
        
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-foreground"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Magnetic key={item.key} intensity={0.1} scale={1.05}>
              <Link
                href={item.href}
                className="text-sm font-semibold leading-6 text-yellow-200 hover:text-yellow-400 transition-colors"
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
              className="flex items-center gap-2 text-yellow-200 hover:text-yellow-400 hover:bg-yellow-500/10 border border-yellow-500/20"
            >
              <Globe className="h-4 w-4" />
              {locale === 'en' ? '中文' : 'EN'}
            </Button>
          </Magnetic>
          
          {!ready ? (
            <Magnetic intensity={0.1} scale={1.05}>
              <Button disabled className="bg-secondary text-secondary-foreground">
                <Wallet className="h-4 w-4 mr-2" />
                {t('connecting')}
              </Button>
            </Magnetic>
          ) : authenticated ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {user?.wallet?.address ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}` : t('connected')}
              </span>
              <Magnetic intensity={0.1} scale={1.05}>
                <Button variant="outline" size="sm" onClick={logout} className="border-yellow-500/20 hover:bg-yellow-500/10">
                  Disconnect
                </Button>
              </Magnetic>
            </div>
          ) : (
            <Magnetic intensity={0.1} scale={1.05}>
              <Button onClick={login} className="btn-primary shadow-[0_0_20px_rgba(240,185,11,0.25)]">
                <Wallet className="h-4 w-4 mr-2" />
                {t('connect_wallet')}
              </Button>
            </Magnetic>
          )}
        </div>
      </nav>
      
      {/* Mobile menu */}
      <div className={cn(
        "lg:hidden",
        mobileMenuOpen ? "block" : "hidden"
      )}>
        <div className="fixed inset-0 z-50" />
        <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-black px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-yellow-500/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5 flex items-center space-x-2">
              <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center">
                <Image src="/binanceeye.jpg" alt="DarkBet" width={36} height={36} className="object-cover" />
              </div>
              <span className="text-xl font-bold text-gradient">DarkBet</span>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-border">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-yellow-200 hover:text-yellow-400 hover:bg-yellow-500/10"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t(item.key)}
                  </Link>
                ))}
              </div>
              <div className="py-6 space-y-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleLanguage}
                  className="w-full justify-start text-yellow-200 hover:text-yellow-400 hover:bg-yellow-500/10 border border-yellow-500/20"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  {locale === 'en' ? '中文' : 'EN'}
                </Button>
                
                {!ready ? (
                  <Button disabled className="w-full bg-secondary text-secondary-foreground">
                    <Wallet className="h-4 w-4 mr-2" />
                    {t('connecting')}
                  </Button>
                ) : authenticated ? (
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground text-center">
                      {user?.wallet?.address ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}` : t('connected')}
                    </div>
                    <Button variant="outline" size="sm" onClick={logout} className="w-full border-yellow-500/20 hover:bg-yellow-500/10">
                      {t('disconnect')}
                    </Button>
                  </div>
                ) : (
                  <Button onClick={login} className="w-full btn-primary shadow-[0_0_20px_rgba(240,185,11,0.25)]">
                    <Wallet className="h-4 w-4 mr-2" />
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
