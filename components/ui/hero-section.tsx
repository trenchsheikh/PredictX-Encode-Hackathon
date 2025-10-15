'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Zap, Shield, Star, Loader2 } from 'lucide-react';
import { AnimatedButton } from './animated-button';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api-client';
import { useI18n } from '@/components/providers/i18n-provider';

interface HeroSectionProps {
  onCreateClick: () => void;
  onCryptoClick: () => void;
  isAuthenticated: boolean;
}

interface PlatformStats {
  totalVolume: number;
  activeMarkets: number;
  participants: number;
}

export function HeroSection({ onCreateClick, onCryptoClick, isAuthenticated }: HeroSectionProps) {
  const { t } = useI18n();
  const [stats, setStats] = useState<PlatformStats>({
    totalVolume: 0,
    activeMarkets: 0,
    participants: 0,
  });
  const [loading, setLoading] = useState(true);

  // Helper function to format numbers
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Fetch real platform statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch markets to get active markets count and total volume
        const marketsResponse = await api.markets.getMarkets();
        const markets = marketsResponse.data || [];
        
        // Calculate active markets (status 0 = active)
        const activeMarkets = markets.filter((market: any) => market.status === 0).length;
        
        // Calculate total volume from all markets
        const totalVolume = markets.reduce((sum: number, market: any) => {
          return sum + parseFloat(market.totalPool || '0');
        }, 0);
        
        // Fetch leaderboard to get participants count
        const leaderboardResponse = await api.leaderboard.getLeaderboard({ limit: 1000 });
        const participants = leaderboardResponse.data?.totalUsers || 0;
        
        setStats({
          totalVolume,
          activeMarkets,
          participants,
        });
      } catch (error) {
        console.error('Error fetching platform stats:', error);
        // Keep default values on error
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);
  const features = [
    { icon: Shield, text: t('features.fully_onchain'), color: 'text-yellow-400' },
    { icon: Zap, text: t('features.ai_driven'), color: 'text-white' },
    { icon: TrendingUp, text: t('features.realtime_markets'), color: 'text-yellow-400' },
  ];

  return (
    <div className="relative py-20 px-4 text-center">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-6xl md:text-8xl font-brand-large mb-6 gradient-text-brand">
            {t('hero_title')}
          </h1>
          <p className="text-xl md:text-2xl font-body text-gray-300 max-w-3xl mx-auto mb-4">
            {t('hero_subtitle')}
          </p>
          <p className="text-lg font-body text-gray-400 max-w-3xl mx-auto">
            {t('hero_description')}
          </p>
        </motion.div>

        {/* DarkPool Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <div className="max-w-4xl mx-auto p-6 rounded-2xl bg-gray-900/40 backdrop-blur-sm border border-gray-700/50">
            <h3 className="text-lg font-heading text-yellow-400 mb-3 text-center">{t('what_is_darkpool')}</h3>
            <p className="text-gray-300 text-center leading-relaxed">
              {t('darkpool_explanation')}
            </p>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-8 mb-12"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-3 px-6 py-3 rounded-full bg-gray-900/50 backdrop-blur-sm border border-gray-700/50"
              >
                <Icon className={`w-5 h-5 ${feature.color}`} />
                <span className="text-white font-medium">{feature.text}</span>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <AnimatedButton
            onClick={onCreateClick}
            size="lg"
            className="px-8 py-4 text-lg"
          >
            <Star className="w-5 h-5 mr-2" />
            {t('cta.start_darkpool_betting')}
          </AnimatedButton>
          
          <AnimatedButton
            onClick={onCryptoClick}
            variant="outline"
            size="lg"
            className="px-8 py-4 text-lg"
          >
            <TrendingUp className="w-5 h-5 mr-2" />
            {t('cta.crypto_darkpool')}
          </AnimatedButton>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          {[
            { 
              label: t('stats.total_volume'), 
              value: loading ? '...' : `${formatNumber(stats.totalVolume)} BNB`, 
              icon: TrendingUp 
            },
            { 
              label: t('stats.active_markets'), 
              value: loading ? '...' : formatNumber(stats.activeMarkets), 
              icon: Zap 
            },
            { 
              label: t('stats.participants'), 
              value: loading ? '...' : formatNumber(stats.participants), 
              icon: Shield 
            },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="text-center p-6 rounded-xl bg-gray-900/30 backdrop-blur-sm border border-gray-700/30"
              >
                <Icon className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                <div className="text-3xl font-heading text-white mb-1 flex items-center justify-center">
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin text-yellow-400" />
                  ) : (
                    stat.value
                  )}
                </div>
                <div className="text-gray-400 font-caption">{stat.label}</div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
