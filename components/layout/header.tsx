'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePrivy } from '@/lib/mock-privy';
import { Button } from '@/components/ui/button';
import { Magnetic } from '@/components/ui/magnetic';
import { Menu, X, Globe, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'My Bets', href: '/my-bets' },
  { name: 'How it Works', href: '/how-it-works' },
  { name: 'Leaderboard', href: '/leaderboard' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState('en');
  const { ready, authenticated, user, login, logout } = usePrivy();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border sticky top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-lg">B</span>
            </div>
            <span className="text-xl font-bold text-gradient">BNBPredict</span>
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
            <Magnetic key={item.name} intensity={0.1} scale={1.05}>
              <Link
                href={item.href}
                className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors"
              >
                {item.name}
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
              className="flex items-center gap-2"
            >
              <Globe className="h-4 w-4" />
              {language === 'en' ? '中文' : 'EN'}
            </Button>
          </Magnetic>
          
          {!ready ? (
            <Magnetic intensity={0.1} scale={1.05}>
              <Button disabled>
                <Wallet className="h-4 w-4 mr-2" />
                Connecting...
              </Button>
            </Magnetic>
          ) : authenticated ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {user?.wallet?.address ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}` : 'Connected'}
              </span>
              <Magnetic intensity={0.1} scale={1.05}>
                <Button variant="outline" size="sm" onClick={logout}>
                  Disconnect
                </Button>
              </Magnetic>
            </div>
          ) : (
            <Magnetic intensity={0.1} scale={1.05}>
              <Button onClick={login} className="btn-primary">
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
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
        <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-border">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5 flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-lg">B</span>
              </div>
              <span className="text-xl font-bold text-gradient">BNBPredict</span>
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
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-accent hover:text-accent-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6 space-y-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleLanguage}
                  className="w-full justify-start"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  {language === 'en' ? '中文' : 'EN'}
                </Button>
                
                {!ready ? (
                  <Button disabled className="w-full">
                    <Wallet className="h-4 w-4 mr-2" />
                    Connecting...
                  </Button>
                ) : authenticated ? (
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground text-center">
                      {user?.wallet?.address ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}` : 'Connected'}
                    </div>
                    <Button variant="outline" size="sm" onClick={logout} className="w-full">
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <Button onClick={login} className="w-full btn-primary">
                    <Wallet className="h-4 w-4 mr-2" />
                    Connect Wallet
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
