'use client';

import { useTranslation } from 'react-i18next';
import '@/lib/i18n';

export default function Phase1Page() {
  const { t } = useTranslation();

  return (
    <div className="prose prose-invert max-w-none">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold text-white">
          {t('docs.phase_1.title', '🛠️ Roadmap: Scalability & Performance')}
        </h1>
        <p className="mb-6 text-lg leading-relaxed text-gray-300">
          {t(
            'docs.phase_1.description',
            'As DarkBet grows, our next major milestone is to expand the prediction engine and dispute system to handle global scale without compromising privacy or fairness.'
          )}
        </p>
      </div>

      <div className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Performance Goals */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">
              {t('docs.phase_1.performance.title', 'Performance Targets')}
            </h2>
            <div className="space-y-3">
              <div className="rounded-lg bg-gray-800/50 p-4">
                <h3 className="mb-2 font-semibold text-orange-400">
                  {t(
                    'docs.phase_1.performance.fast_resolutions',
                    '⚡ Fast Resolutions'
                  )}
                </h3>
                <p className="text-sm text-gray-300">
                  {t(
                    'docs.phase_1.performance.fast_resolutions_desc',
                    "We're targeting the vast majority of markets to resolve automatically within hours, ensuring near-instant outcomes for most predictions."
                  )}
                </p>
              </div>
              <div className="rounded-lg bg-gray-800/50 p-4">
                <h3 className="mb-2 font-semibold text-orange-400">
                  {t(
                    'docs.phase_1.performance.transparent_disputes',
                    '⏳ Transparent Disputes'
                  )}
                </h3>
                <p className="text-sm text-gray-300">
                  {t(
                    'docs.phase_1.performance.transparent_disputes_desc',
                    'For contested results, DarkBet will introduce a tracked dispute system that finalizes outcomes quickly — giving users full visibility into each step of the review process.'
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Scale Goals */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">
              {t('docs.phase_1.scale.title', 'Built for Scale')}
            </h2>
            <div className="space-y-3">
              <div className="rounded-lg bg-gray-800/50 p-4">
                <h3 className="mb-2 font-semibold text-orange-400">
                  {t('docs.phase_1.scale.capacity', '🧱 Infrastructure Goals')}
                </h3>
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
        <div className="rounded-lg bg-gray-800/30 p-4">
          <h2 className="mb-3 text-lg font-semibold text-white">
            {t('docs.phase_1.technical.title', '🔬 Technical Vision')}
          </h2>
          <p className="mb-4 text-sm text-gray-300">
            {t(
              'docs.phase_1.technical.description',
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
        <div className="rounded-lg bg-gradient-to-r from-yellow-600/20 to-orange-600/20 p-4">
          <h2 className="mb-2 text-lg font-semibold text-white">
            {t('docs.phase_1.mission.title', '🚀 The Mission')}
          </h2>
          <p className="text-sm text-gray-300">
            {t(
              'docs.phase_1.mission.description',
              "DarkBet's long-term mission is to become the fastest, most scalable prediction darkpool in Web3 — combining speed, privacy, and trust across every market."
            )}
          </p>
        </div>

        <div className="rounded-lg border border-orange-600/30 bg-orange-600/10 p-6">
          <h2 className="mb-4 text-xl font-semibold text-orange-300">
            {t('docs.phase_1.focus.title', 'Current Focus')}
          </h2>
          <p className="text-gray-300">
            {t(
              'docs.phase_1.focus.description',
              'We are currently focused on building the infrastructure and scalability systems outlined above. Future phases will be announced as we complete our current roadmap milestones.'
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
