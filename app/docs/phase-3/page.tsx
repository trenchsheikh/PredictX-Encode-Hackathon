'use client';

import { useTranslation } from 'react-i18next';
import '@/lib/i18n';

export default function Phase3Page() {
  const { t } = useTranslation();

  return (
    <div className="prose prose-invert max-w-none">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold text-white">
          {t('docs.phase_3.title', 'Phase 3: Ecosystem Development')}
        </h1>
        <p className="mb-6 text-lg leading-relaxed text-gray-300">
          {t(
            'docs.phase_3.description',
            'Build a sustainable, utility-driven token economy.'
          )}
        </p>
      </div>

      <div className="space-y-8">
        <div className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            {t('docs.phase_3.milestones.title', 'Milestones')}
          </h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <span className="mr-3 mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-orange-600 text-sm font-bold text-white">
                1
              </span>
              <div>
                <h3 className="font-semibold text-white">
                  {t(
                    'docs.phase_3.milestones.staking.title',
                    'Introduction of Staking System'
                  )}
                </h3>
                <p className="text-sm text-gray-300">
                  {t(
                    'docs.phase_3.milestones.staking.description',
                    'Launch staking system with yield rewards in DarkBet tokens for long-term holders.'
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
                    'docs.phase_3.milestones.creator_program.title',
                    'Launch of DarkBet Creator Program'
                  )}
                </h3>
                <p className="text-sm text-gray-300">
                  {t(
                    'docs.phase_3.milestones.creator_program.description',
                    'Introduce verified market creator program for high-quality prediction markets.'
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
                    'docs.phase_3.milestones.ai_analysis.title',
                    'AI-Based Prediction Analysis'
                  )}
                </h3>
                <p className="text-sm text-gray-300">
                  {t(
                    'docs.phase_3.milestones.ai_analysis.description',
                    'Launch AI-based prediction analysis for event outcomes and market insights.'
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
                    'docs.phase_3.milestones.mobile_app.title',
                    'Release of DarkBet Mobile App'
                  )}
                </h3>
                <p className="text-sm text-gray-300">
                  {t(
                    'docs.phase_3.milestones.mobile_app.description',
                    'Launch native mobile applications for iOS and Android platforms.'
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
                    'docs.phase_3.milestones.cex_listing.title',
                    'CEX Listing and Cross-Chain Integration'
                  )}
                </h3>
                <p className="text-sm text-gray-300">
                  {t(
                    'docs.phase_3.milestones.cex_listing.description',
                    'Secure CEX listing for DarkBet tokens and develop cross-chain bridge integration.'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-orange-600/30 bg-orange-600/10 p-6">
          <h2 className="mb-4 text-xl font-semibold text-orange-300">
            {t('docs.phase_3.focus.title', 'Phase 3 Focus')}
          </h2>
          <p className="text-gray-300">
            {t(
              'docs.phase_3.focus.description',
              'This ecosystem development phase focuses on building a sustainable token economy around DarkBet. We introduce staking rewards, creator incentives, and expand platform accessibility while maintaining the privacy and security features that define our Dark Pool approach.'
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
