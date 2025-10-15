'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePrivy } from '@privy-io/react-auth';
import { useI18n } from '@/components/providers/i18n-provider';
import { AnimatedButton } from '@/components/ui/animated-button';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, Wallet, TrendingUp, Zap, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { key: 'nav_home', href: '/', icon: TrendingUp },
  { key: 'nav_my_bets', href: '/my-bets', icon: Wallet },
  { key: 'nav_how', href: '/how-it-works', icon: Shield },
  { key: 'nav_leaderboard', href: '/leaderboard', icon: Zap },
];

export function AnimatedHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { locale, setLocale, t } = useI18n();
  const { ready, authenticated, user, login, logout } = usePrivy();

  // Track scroll for header background effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    setLocale(locale === 'en' ? 'zh' : 'en');
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 relative"
    >
      {/* Animated Background */}
      <motion.div
        animate={{
          background: scrolled 
            ? 'linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.9) 100%)'
            : 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 100%)'
        }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 backdrop-blur-md border-b border-yellow-500/20"
      />
      
      {/* Animated particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400/30 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 8 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <nav className="relative z-10 mx-auto mt-4 mb-4 flex max-w-7xl items-center justify-between p-3 lg:px-6 rounded-xl bg-gray-900/80 backdrop-blur-md border border-gray-700/30 shadow-xl">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex lg:flex-1"
        >
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center">
              <Image 
                src="/binanceeye.jpg" 
                alt="DarkBet" 
                width={32} 
                height={32} 
                className="object-cover rounded-lg" 
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-brand gradient-text-brand">DarkBet</span>
              <span className="text-xs font-caption text-gray-400">DarkPool Betting</span>
            </div>
          </Link>
        </motion.div>
        
        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            type="button"
            className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-200"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </motion.button>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:gap-x-6">
          {navigation.map((item, index) => {
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
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-200 group"
                >
                  <Icon className="w-4 h-4 group-hover:text-yellow-400 transition-colors duration-200" />
                  <span>{t(item.key)}</span>
                </Link>
              </motion.div>
            );
          })}
        </div>
        
        {/* Desktop Actions */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-3">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <AnimatedButton
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-200"
            >
              <Globe className="h-4 w-4" />
              {locale === 'en' ? '中文' : 'EN'}
            </AnimatedButton>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {!ready ? (
              <AnimatedButton disabled className="bg-gray-700/50 text-gray-400 px-4 py-2 rounded-lg">
                <Wallet className="h-4 w-4 mr-2" />
                {t('connecting')}
              </AnimatedButton>
            ) : authenticated ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm font-caption text-green-400">
                    {user?.wallet?.address ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}` : t('connected')}
                  </span>
                </div>
                <AnimatedButton 
                  variant="outline" 
                  size="sm" 
                  onClick={logout} 
                  className="border-red-500/50 hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-all duration-200"
                >
                  Disconnect
                </AnimatedButton>
              </div>
            ) : (
              <AnimatedButton 
                onClick={login} 
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700 shadow-md hover:shadow-lg transition-all duration-200 px-4 py-2 rounded-lg"
              >
                <Wallet className="h-4 w-4 mr-2" />
                {t('connect_wallet')}
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
            className="lg:hidden fixed inset-0 z-50"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-sm bg-gradient-to-b from-gray-900 to-gray-800 backdrop-blur-md border-l border-gray-700/50 shadow-2xl"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-700/30">
                <Link href="/" className="flex items-center space-x-3" onClick={() => setMobileMenuOpen(false)}>
                  <div className="w-8 h-8 rounded-lg overflow-hidden bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center">
                    <Image src="/binanceeye.jpg" alt="DarkBet" width={24} height={24} className="object-cover rounded-lg" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-brand gradient-text-brand">DarkBet</span>
                    <span className="text-xs font-caption text-gray-400">DarkPool Betting</span>
                  </div>
                </Link>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  type="button"
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  {navigation.map((item, index) => {
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
                          className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 group"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Icon className="w-5 h-5 group-hover:text-yellow-400 transition-colors" />
                          <span className="font-medium">{t(item.key)}</span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
                
                <div className="pt-6 border-t border-gray-700/50 space-y-4">
                  <AnimatedButton
                    variant="outline"
                    size="sm"
                    onClick={toggleLanguage}
                    className="w-full justify-start text-gray-300 hover:text-white border-gray-600/50"
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    {locale === 'en' ? '中文' : 'EN'}
                  </AnimatedButton>
                  
                  {!ready ? (
                    <AnimatedButton disabled className="w-full bg-gray-700 text-gray-300">
                      <Wallet className="h-4 w-4 mr-2" />
                      {t('connecting')}
                    </AnimatedButton>
                  ) : authenticated ? (
                    <div className="space-y-3">
                      <div className="text-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                        <div className="flex items-center justify-center space-x-2 mb-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                          <span className="text-sm font-caption text-green-400">Connected</span>
                        </div>
                        <div className="text-xs text-gray-400">
                          {user?.wallet?.address ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}` : t('connected')}
                        </div>
                      </div>
                      <AnimatedButton 
                        variant="outline" 
                        size="sm" 
                        onClick={logout} 
                        className="w-full border-red-500/50 hover:bg-red-500/10 text-red-400"
                      >
                        Disconnect
                      </AnimatedButton>
                    </div>
                  ) : (
                    <AnimatedButton 
                      onClick={login} 
                      className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black"
                    >
                      <Wallet className="h-4 w-4 mr-2" />
                      {t('connect_wallet')}
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
