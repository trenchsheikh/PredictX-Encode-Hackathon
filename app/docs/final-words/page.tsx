'use client';

import { useTranslation } from 'react-i18next';
import '@/lib/i18n';
import { Heart } from 'lucide-react';

export default function FinalWordsPage() {
  const { t } = useTranslation();

  return (
    <div className="prose prose-invert max-w-none">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold text-white">
          {t('final_words.title', 'Final Words')}
        </h1>
      </div>

      <div className="space-y-8">
        <div className="rounded-lg bg-gray-800 p-8">
          <p className="mb-6 text-lg leading-relaxed text-gray-300">
            {t(
              'final_words.intro',
              'DarkBet stands at the intersection of innovation, transparency, and community-driven finance.'
            )}
          </p>
        </div>

        <div className="rounded-lg bg-gray-800 p-8">
          <p className="mb-6 text-lg leading-relaxed text-gray-300">
            {t(
              'final_words.mission',
              'As the first dark pool prediction market built on BNB Chain, our mission goes beyond simple forecasting, we aim to reshape how people interact with information, markets, and each other in the decentralized world.'
            )}
          </p>
        </div>

        <div className="rounded-lg bg-gray-800 p-8">
          <p className="mb-6 text-lg leading-relaxed text-gray-300">
            {t(
              'final_words.transformation',
              'By empowering users to create and participate in transparent, verifiable prediction markets, DarkBet transforms insight into opportunity. Every prediction, every trade, and every outcome contributes to a smarter, fairer, and more connected ecosystem.'
            )}
          </p>
        </div>

        <div className="rounded-lg bg-gray-800 p-8">
          <p className="mb-6 text-lg leading-relaxed text-gray-300">
            {t(
              'final_words.journey',
              'The journey of DarkBet is only beginning. With continuous development, strategic partnerships, and a growing community, we are committed to building a platform that represents the future of prediction — where foresight becomes value, and every voice shapes the market.'
            )}
          </p>
        </div>

        <div className="rounded-lg border border-orange-600/30 bg-orange-600/10 p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold text-orange-300">
            {t('final_words.cta', 'Think You Know? Bet It!')}
          </h2>
          <p className="text-lg text-gray-300">
            <span className="flex items-center justify-center gap-1">
              {t('final_words.signature', 'DarkBet Team')}{' '}
              <Heart className="h-4 w-4 text-red-400" aria-hidden />
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
