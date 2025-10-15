'use client';

import { useTranslation } from 'react-i18next';
import '@/lib/i18n';

export default function Phase1Page() {
  const { t } = useTranslation();

  return (
    <div className="prose prose-invert max-w-none">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold text-white">
          {t('docs.phase_1.title', 'Phase 1: Foundation Launch')}
        </h1>
        <p className="mb-6 text-lg leading-relaxed text-gray-300">
          {t(
            'docs.phase_1.description',
            'Establish the core platform and ecosystem fundamentals.'
          )}
        </p>
      </div>

      <div className="space-y-8">
        <div className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            {t('docs.phase_1.milestones.title', 'Milestones')}
          </h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <span className="mr-3 mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-orange-600 text-sm font-bold text-white">
                1
              </span>
              <div>
                <h3 className="font-semibold text-white">
                  {t(
                    'docs.phase_1.milestones.launch.title',
                    'Official Launch of DarkBet on BNB Chain'
                  )}
                </h3>
                <p className="text-sm text-gray-300">
                  {t(
                    'docs.phase_1.milestones.launch.description',
                    'Launch the core DarkBet platform with Dark Pool betting capabilities on BNB Chain.'
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
                    'docs.phase_1.milestones.contracts.title',
                    'Smart Contract Deployment'
                  )}
                </h3>
                <p className="text-sm text-gray-300">
                  {t(
                    'docs.phase_1.milestones.contracts.description',
                    'Deploy smart contracts for on-chain prediction markets with Dark Pool privacy features.'
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
                    'docs.phase_1.milestones.privacy.title',
                    'Integration with Privy for Secure Authentication'
                  )}
                </h3>
                <p className="text-sm text-gray-300">
                  {t(
                    'docs.phase_1.milestones.privacy.description',
                    'Integrate Privy for secure wallet connection and identity verification with privacy protection.'
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
                    'docs.phase_1.milestones.prediction_types.title',
                    'Launch of Custom Bet and Price Oracle Prediction Types'
                  )}
                </h3>
                <p className="text-sm text-gray-300">
                  {t(
                    'docs.phase_1.milestones.prediction_types.description',
                    'Enable custom prediction creation and automated price oracle integration for various market types.'
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
                    'docs.phase_1.milestones.liquidity.title',
                    'Initial Liquidity Setup and DEX Listing'
                  )}
                </h3>
                <p className="text-sm text-gray-300">
                  {t(
                    'docs.phase_1.milestones.liquidity.description',
                    'Set up initial liquidity pools and prepare for DEX listing of DarkBet tokens.'
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
                    'docs.phase_1.milestones.community.title',
                    'Community Onboarding and Early Reward Campaigns'
                  )}
                </h3>
                <p className="text-sm text-gray-300">
                  {t(
                    'docs.phase_1.milestones.community.description',
                    'Launch community onboarding programs and early adopter reward campaigns to build initial user base.'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-orange-600/30 bg-orange-600/10 p-6">
          <h2 className="mb-4 text-xl font-semibold text-orange-300">
            {t('docs.phase_1.focus.title', 'Phase 1 Focus')}
          </h2>
          <p className="text-gray-300">
            {t(
              'docs.phase_1.focus.description',
              'This foundation phase establishes DarkBet as the first Dark Pool prediction market platform, focusing on core functionality, security, and initial community building. The emphasis is on creating a robust, privacy-focused betting experience that sets the stage for future growth.'
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
