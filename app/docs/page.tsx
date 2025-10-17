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
          {t(
            'docs.overview.title',
            'DarkBet: The Future of Private Prediction Markets'
          )}
        </h1>
        <p className="text-lg leading-relaxed text-gray-300">
          {t(
            'docs.overview.description',
            "DarkBet revolutionizes prediction markets with DarkPool technology — the first privacy-first prediction system that keeps your crypto market forecasts completely hidden until resolution. Built on BNB Chain for speed and efficiency, we're creating the fastest, most scalable prediction darkpool in Web3."
          )}
        </p>
        <p className="mt-4 text-base leading-relaxed text-gray-400">
          {t(
            'docs.overview.subdescription',
            'Unlike traditional prediction markets where strategies are visible, DarkPool ensures complete privacy during betting phases. This prevents market manipulation, copy trading, and first-mover advantages while maintaining full transparency in outcomes. Currently focused on crypto predictions with plans to expand across all major prediction categories.'
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
                'DarkPool Technology - Revolutionary privacy-first betting system'
              )}
            </li>
            <li className="flex items-center">
              <Bot
                className="mr-3 h-4 w-4 flex-shrink-0 text-yellow-400"
                aria-hidden
              />
              {t(
                'docs.overview.features.ai',
                'AI Oracle Network - Multi-source data verification and resolution'
              )}
            </li>
            <li className="flex items-center">
              <LinkIcon
                className="mr-3 h-4 w-4 flex-shrink-0 text-yellow-400"
                aria-hidden
              />
              {t(
                'docs.overview.features.blockchain',
                'BNB Chain Optimized - Ultra-fast transactions with minimal fees'
              )}
            </li>
            <li className="flex items-center">
              <Zap
                className="mr-3 h-4 w-4 flex-shrink-0 text-yellow-400"
                aria-hidden
              />
              {t(
                'docs.overview.features.amm',
                'Dynamic Pricing Engine - Real-time market-based odds calculation'
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
                    'Create or join crypto predictions'
                  )}
                </p>
                <p className="text-sm text-gray-400">
                  {t(
                    'docs.overview.getting_started.step2_desc',
                    'Predict crypto price movements or browse existing crypto markets'
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

      {/* DarkPool Technology Section */}
      <div className="mb-8 rounded-lg bg-gradient-to-r from-orange-600/20 to-red-600/20 p-6">
        <h3 className="mb-4 text-2xl font-semibold text-white">
          {t(
            'docs.overview.dark_pool.title',
            'DarkPool Technology: The Privacy Revolution'
          )}
        </h3>
        <p className="mb-6 leading-relaxed text-gray-300">
          {t(
            'docs.overview.dark_pool.description',
            'DarkPool is our proprietary privacy-first prediction system that fundamentally changes how prediction markets work. Unlike traditional markets where all bets are visible, DarkPool keeps your crypto price predictions completely hidden until resolution — creating a fair, manipulation-free environment.'
          )}
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">
              {t('docs.overview.dark_pool.advantages.title', 'Key Advantages')}
            </h4>
            <div className="space-y-3">
              <div className="rounded-lg bg-gray-800/50 p-4">
                <h5 className="mb-2 font-semibold text-orange-400">
                  {t(
                    'docs.overview.dark_pool.advantages.privacy',
                    '🔒 Complete Privacy'
                  )}
                </h5>
                <p className="text-sm text-gray-300">
                  {t(
                    'docs.overview.dark_pool.advantages.privacy_desc',
                    'Your betting strategy remains completely hidden from other participants until market resolution'
                  )}
                </p>
              </div>
              <div className="rounded-lg bg-gray-800/50 p-4">
                <h5 className="mb-2 font-semibold text-orange-400">
                  {t(
                    'docs.overview.dark_pool.advantages.fairness',
                    '⚖️ True Fairness'
                  )}
                </h5>
                <p className="text-sm text-gray-300">
                  {t(
                    'docs.overview.dark_pool.advantages.fairness_desc',
                    'Eliminates first-mover advantage, copy trading, and market manipulation'
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">
              {t(
                'docs.overview.dark_pool.performance.title',
                'Performance Metrics'
              )}
            </h4>
            <div className="space-y-3">
              <div className="rounded-lg bg-gray-800/50 p-4">
                <h5 className="mb-2 font-semibold text-orange-400">
                  {t(
                    'docs.overview.dark_pool.performance.speed',
                    '⚡ Resolution Speed'
                  )}
                </h5>
                <p className="text-sm text-gray-300">
                  {t(
                    'docs.overview.dark_pool.performance.speed_desc',
                    '95% of markets resolve within 2 hours using AI-powered oracle network'
                  )}
                </p>
              </div>
              <div className="rounded-lg bg-gray-800/50 p-4">
                <h5 className="mb-2 font-semibold text-orange-400">
                  {t(
                    'docs.overview.dark_pool.performance.scale',
                    '📈 Current Scale'
                  )}
                </h5>
                <p className="text-sm text-gray-300">
                  {t(
                    'docs.overview.dark_pool.performance.scale_desc',
                    'Supporting 7.2 BNB volume across 11 active markets with 32 participants'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scalability & Performance Roadmap */}
      <div className="mb-8 rounded-lg bg-gradient-to-r from-orange-600/20 to-red-600/20 p-6">
        <h3 className="mb-4 text-2xl font-semibold text-white">
          {t(
            'docs.overview.roadmap.title',
            '🛠️ Roadmap: Scalability & Performance'
          )}
        </h3>
        <p className="mb-6 leading-relaxed text-gray-300">
          {t(
            'docs.overview.roadmap.description',
            'As DarkBet grows, our next major milestone is to expand the prediction engine and dispute system to handle global scale without compromising privacy or fairness.'
          )}
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Performance Goals */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">
              {t(
                'docs.overview.roadmap.performance.title',
                'Performance Targets'
              )}
            </h4>
            <div className="space-y-3">
              <div className="rounded-lg bg-gray-800/50 p-4">
                <h5 className="mb-2 font-semibold text-orange-400">
                  {t(
                    'docs.overview.roadmap.performance.fast_resolutions',
                    '⚡ Fast Resolutions'
                  )}
                </h5>
                <p className="text-sm text-gray-300">
                  {t(
                    'docs.overview.roadmap.performance.fast_resolutions_desc',
                    "We're targeting the vast majority of markets to resolve automatically within hours, ensuring near-instant outcomes for most predictions."
                  )}
                </p>
              </div>
              <div className="rounded-lg bg-gray-800/50 p-4">
                <h5 className="mb-2 font-semibold text-orange-400">
                  {t(
                    'docs.overview.roadmap.performance.transparent_disputes',
                    '⏳ Transparent Disputes'
                  )}
                </h5>
                <p className="text-sm text-gray-300">
                  {t(
                    'docs.overview.roadmap.performance.transparent_disputes_desc',
                    'For contested results, DarkBet will introduce a tracked dispute system that finalizes outcomes quickly — giving users full visibility into each step of the review process.'
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Scale Goals */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">
              {t('docs.overview.roadmap.scale.title', 'Built for Scale')}
            </h4>
            <div className="space-y-3">
              <div className="rounded-lg bg-gray-800/50 p-4">
                <h5 className="mb-2 font-semibold text-orange-400">
                  {t(
                    'docs.overview.roadmap.scale.capacity',
                    '🧱 Infrastructure Goals'
                  )}
                </h5>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li>
                    • Supporting massive scale with 50,000+ concurrent active
                    markets
                  </li>
                  <li>
                    • Processing high-volume daily market creation of 1,000+
                    markets at enterprise scale
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Vision */}
        <div className="mt-6 rounded-lg bg-gray-800/30 p-4">
          <h4 className="mb-3 text-lg font-semibold text-white">
            {t('docs.overview.roadmap.technical.title', '🔬 Technical Vision')}
          </h4>
          <p className="mb-4 text-sm text-gray-300">
            {t(
              'docs.overview.roadmap.technical.description',
              "To achieve this, we'll expand the DarkPool backend and oracle pipeline through:"
            )}
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            <ul className="space-y-1 text-sm text-gray-300">
              <li>• Optimized smart contracts for faster on-chain execution</li>
              <li>• Batched oracle resolutions for grouped predictions</li>
            </ul>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>• Load-balanced backend architecture using MongoDB</li>
              <li>• Decentralized API nodes for reliability and uptime</li>
            </ul>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="mt-6 rounded-lg bg-gradient-to-r from-yellow-600/20 to-orange-600/20 p-4">
          <h4 className="mb-2 text-lg font-semibold text-white">
            {t('docs.overview.roadmap.mission.title', '🚀 The Mission')}
          </h4>
          <p className="text-sm text-gray-300">
            {t(
              'docs.overview.roadmap.mission.description',
              "DarkBet's long-term mission is to become the fastest, most scalable prediction darkpool in Web3 — combining speed, privacy, and trust across every market."
            )}
          </p>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="text-center">
        <h3 className="mb-4 text-2xl font-semibold text-white">
          {t('docs.overview.ready.title', 'Ready to Experience DarkPool?')}
        </h3>
        <p className="mb-6 text-gray-300">
          {t(
            'docs.overview.ready.description',
            'Join the privacy revolution in prediction markets. Start making crypto predictions with complete privacy and fair competition.'
          )}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="/docs/connect-wallet"
            className="rounded-lg bg-gradient-to-r from-orange-600 to-red-600 px-8 py-3 font-medium text-white transition-all duration-200 hover:from-orange-700 hover:to-red-700"
          >
            {t('docs.overview.ready.connect_wallet', 'Connect Wallet')}
          </a>
          <a
            href="/docs/creating-predictions"
            className="rounded-lg bg-gradient-to-r from-gray-700 to-gray-600 px-8 py-3 font-medium text-white transition-all duration-200 hover:from-gray-600 hover:to-gray-500"
          >
            {t(
              'docs.overview.ready.create_prediction',
              'Create Crypto Prediction'
            )}
          </a>
        </div>
        <p className="mt-4 text-sm text-gray-400">
          {t(
            'docs.overview.ready.note',
            'Experience the future of private prediction markets today'
          )}
        </p>
      </div>
    </div>
  );
}
