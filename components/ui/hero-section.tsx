'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Zap, Shield, Star, Loader2 } from 'lucide-react';
import { AnimatedButton } from './animated-button';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api-client';
import { useI18n } from '@/components/providers/i18n-provider';
import { ethers } from 'ethers';

interface HeroSectionProps {
  onCreateClick: () => void;
  onCryptoClick: () => void;
}

interface PlatformStats {
  totalVolume: number;
  activeMarkets: number;
  participants: number;
}

export function HeroSection({
  onCreateClick,
  onCryptoClick,
}: HeroSectionProps) {
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
        const activeMarkets = markets.filter(
          (market: any) => market.status === 0
        ).length;

        // Calculate total volume from all markets (convert from wei to BNB)
        const totalVolume = markets.reduce((sum: number, market: any) => {
          return sum + parseFloat(ethers.formatEther(market.totalPool || '0'));
        }, 0);

        // Fetch leaderboard to get participants count
        const leaderboardResponse = await api.leaderboard.getLeaderboard({
          limit: 1000,
        });
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
    {
      icon: Shield,
      text: t('features.fully_onchain'),
      color: 'text-yellow-400',
    },
    { icon: Zap, text: t('features.ai_driven'), color: 'text-yellow-400' },
    {
      icon: TrendingUp,
      text: t('features.realtime_markets'),
      color: 'text-yellow-400',
    },
  ];

  return (
    <div className="relative px-4 py-20 text-center">
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
            ease: 'easeInOut',
          }}
          className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-yellow-500/10 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
          className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-yellow-400/10 blur-3xl"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="font-brand-large gradient-text-brand mb-6 text-6xl md:text-8xl">
            {t('hero_title')}
          </h1>
          <p className="font-body mx-auto mb-4 max-w-3xl text-xl text-gray-300 md:text-2xl">
            {t('hero_subtitle')}
          </p>
          <p className="font-body mx-auto max-w-3xl text-lg text-gray-400">
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
          <div className="mx-auto max-w-4xl rounded-2xl border border-gray-700/50 bg-gray-900/40 p-6 backdrop-blur-sm">
            <h3 className="font-heading mb-3 text-center text-lg text-yellow-400">
              {t('what_is_darkpool')}
            </h3>
            <p className="text-center leading-relaxed text-gray-300">
              {t('darkpool_explanation')}
            </p>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-12 flex flex-wrap justify-center gap-8"
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
                className="flex items-center space-x-3 rounded-full border border-gray-700/50 bg-gray-900/50 px-6 py-3 backdrop-blur-sm"
              >
                <Icon className={`h-5 w-5 ${feature.color}`} />
                <span className="font-medium text-white">{feature.text}</span>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <AnimatedButton
            onClick={onCreateClick}
            size="lg"
            className="px-8 py-4 text-lg"
          >
            <Star className="mr-2 h-5 w-5" />
            {t('cta.start_darkpool_betting')}
          </AnimatedButton>

          <AnimatedButton
            onClick={onCryptoClick}
            variant="outline"
            size="lg"
            className="px-8 py-4 text-lg"
          >
            <TrendingUp className="mr-2 h-5 w-5" />
            {t('cta.crypto_darkpool')}
          </AnimatedButton>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3"
        >
          {[
            {
              label: t('stats.total_volume'),
              value: loading ? '...' : `${formatNumber(stats.totalVolume)} BNB`,
              icon: TrendingUp,
            },
            {
              label: t('stats.active_markets'),
              value: loading ? '...' : formatNumber(stats.activeMarkets),
              icon: Zap,
            },
            {
              label: t('stats.participants'),
              value: loading ? '...' : formatNumber(stats.participants),
              icon: Shield,
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
                className="rounded-xl border border-gray-700/30 bg-gray-900/30 p-6 text-center backdrop-blur-sm"
              >
                <Icon className="mx-auto mb-3 h-8 w-8 text-yellow-400" />
                <div className="font-heading mb-1 flex items-center justify-center text-3xl text-white">
                  {loading ? (
                    <Loader2 className="h-6 w-6 animate-spin text-yellow-400" />
                  ) : (
                    stat.value
                  )}
                </div>
                <div className="font-caption text-gray-400">{stat.label}</div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
