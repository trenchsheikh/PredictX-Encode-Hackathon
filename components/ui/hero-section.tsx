'use client';

import { Quote } from 'lucide-react';
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
      totalVolume: 7.2, // 7.2 BNB
      activeMarkets: 11, // 11 Active Markets
      participants: 32, // 32 Participants
    });

    setLoading(false);
  }, []);

  return (
    <div className="relative px-4 py-20 text-center">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-yellow-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-yellow-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(105deg,#101010_0px_1px,transparent_1px_8px)] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-5xl">
        {/* Update badge - left aligned */}
        <div className="mb-6 flex justify-start">
          <NewItemsLoading />
        </div>

        {/* Main Title */}
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
                <span className="relative z-0 inline-flex items-center overflow-hidden rounded-2xl border border-yellow-400/40 bg-gradient-to-br from-gray-800/95 to-gray-900/95 py-1 pl-2 pr-4 text-3xl md:py-1.5 md:pl-3 md:pr-6 md:text-5xl lg:pl-4 lg:pr-8 lg:text-6xl">
                  <span className="bnb-pattern pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay" />
                  <span className="relative min-w-0 font-medium italic leading-normal">
                    <WordAnimator
                      words={[
                        t('features.privacy'),
                        t('features.fully_onchain'),
                        t('features.ai_driven'),
                      ]}
                      duration={4}
                      className="whitespace-nowrap border-0 bg-transparent px-0"
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

        {/* CTA Buttons */}
        <div className="mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <ShimmerButton
            onClick={onCreateClick}
            background="linear-gradient(180deg, #ffb84d 0%, #cc6b00 100%)"
            className="h-14 min-w-[280px] rounded-full border-orange-600 px-8 text-base font-semibold tracking-wide text-white shadow-md ring-1 ring-black/40 hover:[background:linear-gradient(180deg,#ffc266_0%,#b35f00_100%)] md:text-lg"
          >
            {t('cta.start_darkpool_betting')}
          </ShimmerButton>

          <Button
            onClick={onCryptoClick}
            variant="outline"
            className="h-14 min-w-[280px] rounded-full border-white/10 bg-gradient-to-b from-[#121726] to-[#0b111c] px-8 text-base font-semibold tracking-wide text-white shadow-md ring-1 ring-white/10 hover:from-[#161d31] hover:to-[#0e1522] md:text-lg"
          >
            {t('cta.crypto_darkpool')}
          </Button>
        </div>

        {/* DarkPool Explanation Section (static) */}
        <div className="mb-8">
          <div className="mb-6">
            <Quote className="mx-auto h-12 w-12 fill-yellow-400 text-yellow-400" />
          </div>
          <h2 className="mb-6 text-4xl font-medium leading-tight text-white md:text-6xl">
            {t('what_is_darkpool')}
          </h2>
          <p className="mx-auto mb-12 max-w-3xl text-sm leading-relaxed text-gray-300 sm:text-base">
            {t('darkpool_explanation')}
          </p>
        </div>

        {/* Stats Section (static) */}
        <div className="mx-auto mb-12 flex w-fit flex-wrap justify-center gap-6 rounded-xl border border-yellow-400 bg-yellow-400/10 px-4 py-4 backdrop-blur-sm sm:gap-12 sm:px-6">
          <div className="text-center">
            <div className="mb-2 text-2xl font-semibold text-yellow-400 sm:text-4xl">
              {loading ? '...' : `${stats.totalVolume} BNB`}
            </div>
            <div className="text-xs text-gray-300 sm:text-base">
              {t('stats.total_volume')}
            </div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-2xl font-semibold text-yellow-400 sm:text-4xl">
              {loading ? '...' : stats.activeMarkets}
            </div>
            <div className="text-xs text-gray-300 sm:text-base">
              {t('stats.active_markets')}
            </div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-2xl font-semibold text-yellow-400 sm:text-4xl">
              {loading ? '...' : stats.participants}
            </div>
            <div className="text-xs text-gray-300 sm:text-base">
              {t('stats.participants')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
