'use client';

import { useTranslation } from 'react-i18next';
import '@/lib/i18n';
import { Shield, Bot, Link as LinkIcon, Zap } from 'lucide-react';

export default function DocsPage() {
  const { t } = useTranslation();

  return (
    <div className="prose prose-invert max-w-none">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold text-white">
          {t('docs.overview.title', 'DarkBet Documentation')}
        </h1>
        <p className="text-lg leading-relaxed text-gray-300">
          {t(
            'docs.overview.description',
            'DarkBet is an on-chain prediction market built on BNB Chain, designed to allow users to forecast real-world events, market trends, and community-driven outcomes using blockchain technology. Every prediction, transaction, and resolution is executed on-chain, ensuring verifiable transparency and fairness.'
          )}
        </p>
        <p className="mt-4 text-base leading-relaxed text-gray-400">
          {t(
            'docs.overview.subdescription',
            "Whether it's sports results, political elections, or crypto price movements, DarkBet turns public sentiment and data analysis into actionable, tradeable predictions, creating a decentralized marketplace for knowledge and foresight with the revolutionary Dark Pool betting system."
          )}
        </p>
      </div>

      <div className="mb-12 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-gray-800 p-6">
          <h3 className="mb-3 text-lg font-semibold text-white">
            {t('docs.overview.features.title', 'Key Features')}
          </h3>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-center">
              <Shield
                className="mr-3 h-4 w-4 flex-shrink-0 text-yellow-400"
                aria-hidden
              />
              {t(
                'docs.overview.features.privacy',
                'Dark Pool Privacy - Bets remain hidden until resolution'
              )}
            </li>
            <li className="flex items-center">
              <Bot
                className="mr-3 h-4 w-4 flex-shrink-0 text-yellow-400"
                aria-hidden
              />
              {t(
                'docs.overview.features.ai',
                'AI-Powered Resolution - Automated outcome determination'
              )}
            </li>
            <li className="flex items-center">
              <LinkIcon
                className="mr-3 h-4 w-4 flex-shrink-0 text-yellow-400"
                aria-hidden
              />
              {t(
                'docs.overview.features.blockchain',
                'Fully On-Chain - Built on BNB Smart Chain'
              )}
            </li>
            <li className="flex items-center">
              <Zap
                className="mr-3 h-4 w-4 flex-shrink-0 text-yellow-400"
                aria-hidden
              />
              {t(
                'docs.overview.features.amm',
                'Dynamic AMM Pricing - Fair market-based pricing'
              )}
            </li>
          </ul>
        </div>

        <div className="rounded-lg bg-gray-800 p-6">
          <h3 className="mb-3 text-lg font-semibold text-white">
            {t('docs.overview.getting_started.title', 'Getting Started')}
          </h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <span className="mr-4 mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-orange-600 text-sm font-bold text-white">
                1
              </span>
              <div>
                <p className="font-medium text-white">
                  {t(
                    'docs.overview.getting_started.step1',
                    'Connect your wallet'
                  )}
                </p>
                <p className="text-sm text-gray-400">
                  {t(
                    'docs.overview.getting_started.step1_desc',
                    'Connect using MetaMask, WalletConnect, or other supported wallets'
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="mr-4 mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-orange-600 text-sm font-bold text-white">
                2
              </span>
              <div>
                <p className="font-medium text-white">
                  {t(
                    'docs.overview.getting_started.step2',
                    'Create or join predictions'
                  )}
                </p>
                <p className="text-sm text-gray-400">
                  {t(
                    'docs.overview.getting_started.step2_desc',
                    'Describe your prediction or browse existing markets'
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="mr-4 mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-orange-600 text-sm font-bold text-white">
                3
              </span>
              <div>
                <p className="font-medium text-white">
                  {t(
                    'docs.overview.getting_started.step3',
                    'Claim your winnings'
                  )}
                </p>
                <p className="text-sm text-gray-400">
                  {t(
                    'docs.overview.getting_started.step3_desc',
                    'Automated resolution and manual claiming process'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 rounded-lg bg-gradient-to-r from-orange-600/20 to-red-600/20 p-6">
        <h3 className="mb-4 text-2xl font-semibold text-white">
          {t('docs.overview.dark_pool.title', 'What is Dark Pool Betting?')}
        </h3>
        <p className="mb-4 leading-relaxed text-gray-300">
          {t(
            'docs.overview.dark_pool.description',
            'Dark Pool betting combines the privacy and efficiency of traditional dark pools with prediction markets. Your bets remain completely hidden until the market resolves, preventing market manipulation and ensuring a fair, competitive environment for all participants.'
          )}
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-gray-800/50 p-4">
            <h4 className="mb-2 font-semibold text-white">
              {t(
                'docs.overview.dark_pool.benefits.privacy',
                'Privacy Protection'
              )}
            </h4>
            <p className="text-sm text-gray-400">
              {t(
                'docs.overview.dark_pool.benefits.privacy_desc',
                'Your betting strategy remains completely hidden from other participants'
              )}
            </p>
          </div>
          <div className="rounded-lg bg-gray-800/50 p-4">
            <h4 className="mb-2 font-semibold text-white">
              {t(
                'docs.overview.dark_pool.benefits.fairness',
                'Fair Competition'
              )}
            </h4>
            <p className="text-sm text-gray-400">
              {t(
                'docs.overview.dark_pool.benefits.fairness_desc',
                'No first-mover advantage or copy trading'
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <h3 className="mb-4 text-2xl font-semibold text-white">
          {t('docs.overview.ready.title', 'Ready to Start?')}
        </h3>
        <p className="mb-6 text-gray-300">
          {t(
            'docs.overview.ready.description',
            'Explore our documentation to learn more about DarkBet and start your prediction market journey.'
          )}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="/docs/connect-wallet"
            className="rounded-lg bg-orange-600 px-6 py-3 font-medium text-white hover:bg-orange-700"
          >
            {t('docs.overview.ready.connect_wallet', 'Connect Wallet')}
          </a>
          <a
            href="/docs/creating-predictions"
            className="rounded-lg bg-gray-700 px-6 py-3 font-medium text-white hover:bg-gray-600"
          >
            {t('docs.overview.ready.create_prediction', 'Create Prediction')}
          </a>
        </div>
      </div>
    </div>
  );
}
