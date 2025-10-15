'use client';

import { useTranslation } from 'react-i18next';
import '@/lib/i18n';

export default function Phase4Page() {
  const { t } = useTranslation();

  return (
    <div className="prose prose-invert max-w-none">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold text-white">
          {t('docs.phase_4.title', 'Phase 4: Governance & Global Adoption')}
        </h1>
        <p className="mb-6 text-lg leading-relaxed text-gray-300">
          {t(
            'docs.phase_4.description',
            'Transition toward a community-governed and globally recognized platform.'
          )}
        </p>
      </div>

      <div className="space-y-8">
        <div className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            {t('docs.phase_4.milestones.title', 'Milestones')}
          </h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <span className="mr-3 mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-orange-600 text-sm font-bold text-white">
                1
              </span>
              <div>
                <h3 className="font-semibold text-white">
                  {t(
                    'docs.phase_4.milestones.dao.title',
                    'Launch of DarkBet DAO'
                  )}
                </h3>
                <p className="text-sm text-gray-300">
                  {t(
                    'docs.phase_4.milestones.dao.description',
                    'Implement full decentralized governance through DarkBet DAO for community-driven platform decisions.'
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
                    'docs.phase_4.milestones.data_providers.title',
                    'Integration with Major Data Providers'
                  )}
                </h3>
                <p className="text-sm text-gray-300">
                  {t(
                    'docs.phase_4.milestones.data_providers.description',
                    'Integrate with major data providers and analytics tools for enhanced prediction accuracy.'
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
                    'docs.phase_4.milestones.media_partnerships.title',
                    'Partnership with Media and Web3 Platforms'
                  )}
                </h3>
                <p className="text-sm text-gray-300">
                  {t(
                    'docs.phase_4.milestones.media_partnerships.description',
                    'Establish partnerships with media and Web3 platforms for verified prediction feeds.'
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
                    'docs.phase_4.milestones.global_marketing.title',
                    'Global Marketing and Sponsorship Campaigns'
                  )}
                </h3>
                <p className="text-sm text-gray-300">
                  {t(
                    'docs.phase_4.milestones.global_marketing.description',
                    'Launch comprehensive global marketing and sponsorship campaigns for worldwide adoption.'
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
                    'docs.phase_4.milestones.ecosystem_upgrades.title',
                    'Continuous Ecosystem Upgrades'
                  )}
                </h3>
                <p className="text-sm text-gray-300">
                  {t(
                    'docs.phase_4.milestones.ecosystem_upgrades.description',
                    'Implement continuous ecosystem upgrades and scalability improvements for global scale.'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-orange-600/30 bg-orange-600/10 p-6">
          <h2 className="mb-4 text-xl font-semibold text-orange-300">
            {t('docs.phase_4.focus.title', 'Phase 4 Focus')}
          </h2>
          <p className="text-gray-300">
            {t(
              'docs.phase_4.focus.description',
              'This final phase transforms DarkBet into a globally recognized, community-governed platform. We achieve full decentralization through DAO governance while establishing strategic partnerships and global presence, all while maintaining our core Dark Pool privacy and security principles.'
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
