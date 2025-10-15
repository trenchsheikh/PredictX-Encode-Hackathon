'use client';

import { useTranslation } from 'react-i18next';
import '@/lib/i18n';

export default function Phase2Page() {
  const { t } = useTranslation();

  return (
    <div className="prose prose-invert max-w-none">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold text-white">
          {t('docs.phase_2.title', 'Phase 2: Expansion & Growth')}
        </h1>
        <p className="mb-6 text-lg leading-relaxed text-gray-300">
          {t(
            'docs.phase_2.description',
            'Strengthen community participation and introduce advanced features.'
          )}
        </p>
      </div>

      <div className="space-y-8">
        <div className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            {t('docs.phase_2.milestones.title', 'Milestones')}
          </h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <span className="mr-3 mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-orange-600 text-sm font-bold text-white">
                1
              </span>
              <div>
                <h3 className="font-semibold text-white">
                  {t(
                    'docs.phase_2.milestones.buyback.title',
                    'Implementation of Buyback & Burn Program'
                  )}
                </h3>
                <p className="text-sm text-gray-300">
                  {t(
                    'docs.phase_2.milestones.buyback.description',
                    'Launch token buyback and burn mechanisms to support long-term token stability and value growth.'
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="mr-3 mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-orange-600 text-sm font-bold text-white">
                2
              </span>
              <div>
                <h3 className="font-semibold text-white">
                  {t(
                    'docs.phase_2.milestones.leaderboard.title',
                    'Launch of Leaderboard System and Referral Rewards'
                  )}
                </h3>
                <p className="text-sm text-gray-300">
                  {t(
                    'docs.phase_2.milestones.leaderboard.description',
                    'Introduce competitive leaderboards and referral reward systems to incentivize community participation.'
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="mr-3 mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-orange-600 text-sm font-bold text-white">
                3
              </span>
              <div>
                <h3 className="font-semibold text-white">
                  {t(
                    'docs.phase_2.milestones.mobile.title',
                    'Rollout of Mobile-Friendly Interface'
                  )}
                </h3>
                <p className="text-sm text-gray-300">
                  {t(
                    'docs.phase_2.milestones.mobile.description',
                    'Launch mobile-optimized interface and performance improvements for better user experience.'
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="mr-3 mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-orange-600 text-sm font-bold text-white">
                4
              </span>
              <div>
                <h3 className="font-semibold text-white">
                  {t(
                    'docs.phase_2.milestones.oracles.title',
                    'Integration with Additional Oracles'
                  )}
                </h3>
                <p className="text-sm text-gray-300">
                  {t(
                    'docs.phase_2.milestones.oracles.description',
                    'Expand oracle integrations for sports, stocks, and real-world data sources.'
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="mr-3 mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-orange-600 text-sm font-bold text-white">
                5
              </span>
              <div>
                <h3 className="font-semibold text-white">
                  {t(
                    'docs.phase_2.milestones.marketing.title',
                    'Strategic Marketing Partnerships'
                  )}
                </h3>
                <p className="text-sm text-gray-300">
                  {t(
                    'docs.phase_2.milestones.marketing.description',
                    'Establish strategic marketing partnerships and community collaborations for platform growth.'
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="mr-3 mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-orange-600 text-sm font-bold text-white">
                6
              </span>
              <div>
                <h3 className="font-semibold text-white">
                  {t(
                    'docs.phase_2.milestones.token_integration.title',
                    'Token Integration for Direct Betting'
                  )}
                </h3>
                <p className="text-sm text-gray-300">
                  {t(
                    'docs.phase_2.milestones.token_integration.description',
                    'Develop integration of DarkBet tokens for direct betting within the platform.'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-orange-600/30 bg-orange-600/10 p-6">
          <h2 className="mb-4 text-xl font-semibold text-orange-300">
            {t('docs.phase_2.focus.title', 'Phase 2 Focus')}
          </h2>
          <p className="text-gray-300">
            {t(
              'docs.phase_2.focus.description',
              'This expansion phase focuses on growing the DarkBet community and ecosystem. We introduce advanced features, improve user experience, and establish strategic partnerships while maintaining the core Dark Pool privacy principles that make DarkBet unique.'
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
