'use client';

import { useTranslation } from 'react-i18next';
import '@/lib/i18n';
import { Clock, Construction } from 'lucide-react';

export default function TokenomicsPage() {
  const { t } = useTranslation();

  return (
    <div className="prose prose-invert max-w-none">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-orange-600/20">
          <Construction className="h-12 w-12 text-orange-400" />
        </div>
        <h1 className="mb-4 text-3xl font-bold text-white">
          {t('docs.tokenomics.title', 'Tokenomics')}
        </h1>
        <p className="text-lg leading-relaxed text-gray-300">
          {t(
            'docs.tokenomics.description',
            'Token economics and distribution model for DarkBet.'
          )}
        </p>
      </div>

      <div className="flex justify-center">
        <div className="rounded-lg bg-gradient-to-r from-orange-600/20 to-red-600/20 p-12 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-orange-600/30">
            <Clock className="h-8 w-8 text-orange-400" />
          </div>
          <h2 className="mb-4 text-2xl font-semibold text-white">
            {t('docs.tokenomics.coming_soon.title', 'Coming Soon')}
          </h2>
          <p className="mb-6 text-lg text-gray-300">
            {t(
              'docs.tokenomics.coming_soon.description',
              'We are currently developing our comprehensive tokenomics model. Stay tuned for detailed information about token distribution, utility, and governance mechanisms.'
            )}
          </p>
          <p className="text-sm text-gray-400">
            {t(
              'docs.tokenomics.coming_soon.note',
              'The DarkBet tokenomics will be designed to support our DarkPool prediction ecosystem and reward community participation.'
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
