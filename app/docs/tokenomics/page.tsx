'use client';

import { useTranslation } from 'react-i18next';
import '@/lib/i18n';

export default function TokenomicsPage() {
  const { t } = useTranslation();

  return (
    <div className="prose prose-invert max-w-none">
      <div className="mb-8">
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

      <div className="space-y-8">
        {/* Overview Section */}
        <div className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            {t('docs.tokenomics.overview.title', 'Overview')}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-700">
                <tr>
                  <td className="py-3 font-semibold text-gray-300">
                    {t('docs.tokenomics.overview.token_name', 'Token Name')}
                  </td>
                  <td className="py-3 text-gray-100">DarkBet</td>
                </tr>
                <tr>
                  <td className="py-3 font-semibold text-gray-300">
                    {t('docs.tokenomics.overview.symbol', 'Symbol')}
                  </td>
                  <td className="py-3 text-gray-100">$DarkBet</td>
                </tr>
                <tr>
                  <td className="py-3 font-semibold text-gray-300">
                    {t('docs.tokenomics.overview.network', 'Network')}
                  </td>
                  <td className="py-3 text-gray-100">BNB Chain (BEP-20)</td>
                </tr>
                <tr>
                  <td className="py-3 font-semibold text-gray-300">
                    {t('docs.tokenomics.overview.total_supply', 'Total Supply')}
                  </td>
                  <td className="py-3 text-gray-100">1,000,000,000 $DarkBet</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Token Distribution Section */}
        <div className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            {t('docs.tokenomics.distribution.title', 'Token Distribution')}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-3 text-left font-semibold text-gray-300">
                    {t('docs.tokenomics.distribution.category', 'Category')}
                  </th>
                  <th className="py-3 text-left font-semibold text-gray-300">
                    {t('docs.tokenomics.distribution.allocation', 'Allocation')}
                  </th>
                  <th className="py-3 text-left font-semibold text-gray-300">
                    {t(
                      'docs.tokenomics.distribution.description',
                      'Description'
                    )}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                <tr>
                  <td className="py-3 font-semibold text-gray-300">
                    {t(
                      'docs.tokenomics.distribution.marketing.title',
                      'Marketing & Collaboration'
                    )}
                  </td>
                  <td className="py-3 font-bold text-orange-400">5%</td>
                  <td className="py-3 text-gray-300">
                    {t(
                      'docs.tokenomics.distribution.marketing.description',
                      "Dedicated to brand growth, partnerships, and promotional activities that strengthen DarkBet's global presence."
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 font-semibold text-gray-300">
                    {t(
                      'docs.tokenomics.distribution.future_dev.title',
                      'Future Development'
                    )}
                  </td>
                  <td className="py-3 font-bold text-orange-400">2%</td>
                  <td className="py-3 text-gray-300">
                    {t(
                      'docs.tokenomics.distribution.future_dev.description',
                      'Set aside for future features, cross-chain integrations, and long-term ecosystem expansion.'
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Buyback & Burn Note */}
        <div className="rounded-lg border border-green-600/30 bg-green-600/10 p-6">
          <div className="flex items-start">
            <span className="mr-3 mt-1 text-green-400">✅</span>
            <div>
              <h3 className="mb-2 font-semibold text-green-300">
                {t(
                  'docs.tokenomics.buyback_note.title',
                  'Buyback & Burn Program'
                )}
              </h3>
              <p className="text-sm text-gray-300">
                {t(
                  'docs.tokenomics.buyback_note.description',
                  "All fees collected while DarkBet's market cap remains below 1M will be fully allocated to buyback and burn programs, supporting long-term token stability and value growth."
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Token Utility */}
        <div className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            {t('docs.tokenomics.utility.title', 'Token Utility')}
          </h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <span className="mr-3 mt-1 text-orange-400">🔒</span>
              <div>
                <h3 className="font-semibold text-white">
                  {t(
                    'docs.tokenomics.utility.staking.title',
                    'Staking Rewards'
                  )}
                </h3>
                <p className="text-sm text-gray-300">
                  {t(
                    'docs.tokenomics.utility.staking.description',
                    'Stake DarkBet tokens to earn yield rewards and participate in platform governance.'
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="mr-3 mt-1 text-orange-400">🎯</span>
              <div>
                <h3 className="font-semibold text-white">
                  {t('docs.tokenomics.utility.betting.title', 'Direct Betting')}
                </h3>
                <p className="text-sm text-gray-300">
                  {t(
                    'docs.tokenomics.utility.betting.description',
                    'Use DarkBet tokens directly for placing bets in prediction markets.'
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="mr-3 mt-1 text-orange-400">🗳️</span>
              <div>
                <h3 className="font-semibold text-white">
                  {t(
                    'docs.tokenomics.utility.governance.title',
                    'Governance Rights'
                  )}
                </h3>
                <p className="text-sm text-gray-300">
                  {t(
                    'docs.tokenomics.utility.governance.description',
                    'Participate in DAO governance to vote on platform features and ecosystem decisions.'
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="mr-3 mt-1 text-orange-400">💎</span>
              <div>
                <h3 className="font-semibold text-white">
                  {t(
                    'docs.tokenomics.utility.rewards.title',
                    'Creator Rewards'
                  )}
                </h3>
                <p className="text-sm text-gray-300">
                  {t(
                    'docs.tokenomics.utility.rewards.description',
                    'Earn DarkBet tokens for creating successful prediction markets and contributing to the ecosystem.'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
