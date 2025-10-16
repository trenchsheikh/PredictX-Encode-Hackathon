'use client';

import { TrendingUp, Zap, Shield, Loader2 } from 'lucide-react';
import WordAnimator from './word-animator';
import ShimmerButton from './shimmer-button';
import NewItemsLoading from './new-items-loading';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useI18n } from '@/components/providers/i18n-provider';

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

  // Set hardcoded platform statistics
  useEffect(() => {
    setLoading(true);

    // Hardcoded values as requested
    setStats({
      totalVolume: 2.1, // 2.1 BNB
      activeMarkets: 3, // 3 Active Markets
      participants: 12, // 12 Participants
    });

    setLoading(false);
  }, []);

  return (
    <div className="relative px-4 py-20 text-center">
      {/* Background Effects (static, no animation) */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-yellow-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-yellow-400/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl">
        {/* Update badge - left aligned */}
        <div className="mb-6 flex justify-start">
          <NewItemsLoading />
        </div>

        {/* Main Title (no pop-in) */}
        <div className="mb-10">
          {/* Large text - two lines */}
          <h1 className="mx-auto mb-6 mt-4 text-2xl leading-[1.12] tracking-tighter text-white md:text-4xl lg:text-5xl">
            <span className="relative z-10 block">
              {t('hero_headline_lead')}
            </span>
            <span className="mt-2 inline-flex max-w-full flex-wrap items-center gap-2 whitespace-nowrap font-medium md:mt-3 md:gap-3">
              <span className="text-3xl md:text-5xl lg:text-6xl">
                {t('hero_bet_word')}
              </span>{' '}
              <span className="relative inline-flex">
                <span className="relative z-0 inline-flex items-center rounded-2xl border border-yellow-400/40 bg-gradient-to-br from-gray-800/95 to-gray-900/95 px-2 py-1 text-3xl md:px-4 md:py-1.5 md:text-5xl lg:text-6xl">
                  <span className="pointer-events-none absolute inset-0 bg-[url('/noise.gif')] opacity-40 mix-blend-overlay" />
                  <span className="relative font-medium italic leading-normal">
                    <WordAnimator
                      words={[
                        t('features.fully_onchain'),
                        t('features.ai_driven'),
                        t('features.realtime_markets'),
                      ]}
                      duration={4}
                      className="border-0 bg-transparent px-0"
                    />
                  </span>
                </span>
              </span>
            </span>
          </h1>

          {/* Normal paragraph */}
          <p className="font-body mx-auto max-w-2xl text-base leading-relaxed text-gray-300 md:text-lg">
            {t('hero_description')}
          </p>
        </div>

        {/* DarkPool Explanation */}
        <div className="mb-8">
          <div className="mx-auto max-w-4xl rounded-2xl border border-gray-700/50 bg-gray-900/40 p-6">
            <h3 className="font-heading mb-3 text-center text-lg text-yellow-400">
              {t('what_is_darkpool')}
            </h3>
            <p className="text-center leading-relaxed text-gray-300">
              {t('darkpool_explanation')}
            </p>
          </div>
        </div>

        {/* CTA Buttons (no pop-in) */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <ShimmerButton
            onClick={onCreateClick}
            className="h-14 min-w-[280px] rounded-full px-8 text-base font-medium md:text-lg"
          >
            {t('cta.start_darkpool_betting')}
          </ShimmerButton>

          <Button
            onClick={onCryptoClick}
            variant="outline"
            className="h-14 min-w-[280px] rounded-full border-gray-700 bg-gray-900 px-8 text-base font-medium text-white hover:bg-gray-800 md:text-lg"
          >
            {t('cta.crypto_darkpool')}
          </Button>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              label: t('stats.total_volume'),
              value: loading ? '...' : `${stats.totalVolume} BNB`,
              icon: TrendingUp,
            },
            {
              label: t('stats.active_markets'),
              value: loading ? '...' : stats.activeMarkets.toString(),
              icon: Zap,
            },
            {
              label: t('stats.participants'),
              value: loading ? '...' : stats.participants.toString(),
              icon: Shield,
            },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="rounded-xl border border-gray-700/30 bg-gray-900/30 p-6 text-center backdrop-blur-sm"
              >
                <Icon className="mx-auto mb-3 h-8 w-8 text-yellow-400" />
                <div className="font-heading mb-1 flex items-center justify-center text-3xl text-white">
                  {loading ? (
                    <Loader2 className="h-6 w-6 text-yellow-400" />
                  ) : (
                    stat.value
                  )}
                </div>
                <div className="font-caption text-gray-400">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
