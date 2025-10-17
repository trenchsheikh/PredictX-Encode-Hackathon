'use client';

import { useTranslation } from 'react-i18next';
import '@/lib/i18n';

export default function VisionPage() {
  const { t } = useTranslation();

  return (
    <div className="prose prose-invert max-w-none">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold text-white">
          {t('docs.vision.title', 'DarkBet Vision')}
        </h1>
        <p className="mb-6 text-base leading-relaxed text-gray-300">
          {t(
            'docs.vision.description',
            'DarkBet imagines a tomorrow where confidential forecasting platforms transform our engagement with cryptocurrency markets. An ecosystem prioritizing secrecy where DarkPool innovation creates honest, interference-resistant digital asset predictions possessing genuine worth.'
          )}
        </p>
        <p className="mb-6 text-base leading-relaxed text-gray-300">
          {t(
            'docs.vision.subdescription',
            'Being the inaugural DarkPool forecasting system constructed on BNB Chain, DarkBet transforms digital currency market prediction by maintaining all forecasts entirely confidential until settlement. Participants can exchange cryptocurrency knowledge, forecast price changes, and engage in market occurrences that influence the destiny of digital currencies, all via blockchain openness and verifiable smart contracts.'
          )}
        </p>
        <p className="text-lg leading-relaxed text-gray-300">
          {t(
            'docs.vision.conclusion',
            'We dream of building a system that combines confidentiality, creativity, and confidence, where each cryptocurrency forecast is not merely a bet, but an expression of shared market wisdom. DarkBet aims to enable people to make evidence-based digital asset choices, unite groups through common convictions about virtual currency prospects, and cultivate a fresh economy founded on honesty, responsibility, and distributed involvement in the cryptocurrency realm.'
          )}
        </p>
      </div>

      <div className="space-y-8">
        <div className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            {t('docs.vision.mission.title', 'Our Mission')}
          </h2>
          <p className="leading-relaxed text-gray-300">
            {t(
              'docs.vision.mission.description',
              'To revolutionize prediction markets by introducing the first truly private, fair, and decentralized betting platform. We believe that prediction markets should be accessible to everyone while maintaining complete privacy and preventing manipulation.'
            )}
          </p>
        </div>

        <div className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            {t('docs.vision.values.title', 'Core Values')}
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                {t('docs.vision.values.privacy.title', 'Privacy First')}
              </h3>
              <p className="text-sm text-gray-400">
                {t(
                  'docs.vision.values.privacy.description',
                  'Your betting strategy remains completely hidden until market resolution.'
                )}
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                {t('docs.vision.values.fairness.title', 'Fair Competition')}
              </h3>
              <p className="text-sm text-gray-400">
                {t(
                  'docs.vision.values.fairness.description',
                  'No first-mover advantage, no copy trading, no manipulation.'
                )}
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                {t('docs.vision.values.transparency.title', 'Transparency')}
              </h3>
              <p className="text-sm text-gray-400">
                {t(
                  'docs.vision.values.transparency.description',
                  'All transactions are on-chain and verifiable.'
                )}
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                {t('docs.vision.values.innovation.title', 'Innovation')}
              </h3>
              <p className="text-sm text-gray-400">
                {t(
                  'docs.vision.values.innovation.description',
                  'AI-powered resolution and dynamic AMM pricing.'
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-gradient-to-r from-orange-600/20 to-red-600/20 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            {t('docs.vision.future.title', "The Future We're Building")}
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg bg-gray-800/50 p-4">
              <h3 className="mb-2 font-semibold text-white">
                {t(
                  'docs.vision.future.step1.title',
                  'Global Prediction Markets'
                )}
              </h3>
              <p className="text-sm text-gray-300">
                {t(
                  'docs.vision.future.step1.description',
                  'Access to prediction markets for events worldwide, from sports to politics to weather.'
                )}
              </p>
            </div>
            <div className="rounded-lg bg-gray-800/50 p-4">
              <h3 className="mb-2 font-semibold text-white">
                {t('docs.vision.future.step2.title', 'AI-Powered Insights')}
              </h3>
              <p className="text-sm text-gray-300">
                {t(
                  'docs.vision.future.step2.description',
                  'Advanced AI analysis providing unbiased market insights and automated resolution.'
                )}
              </p>
            </div>
            <div className="rounded-lg bg-gray-800/50 p-4">
              <h3 className="mb-2 font-semibold text-white">
                {t(
                  'docs.vision.future.step3.title',
                  'Decentralized Governance'
                )}
              </h3>
              <p className="text-sm text-gray-300">
                {t(
                  'docs.vision.future.step3.description',
                  'Community-driven decisions on platform features and market categories.'
                )}
              </p>
            </div>
            <div className="rounded-lg bg-gray-800/50 p-4">
              <h3 className="mb-2 font-semibold text-white">
                {t('docs.vision.future.step4.title', 'Cross-Chain Integration')}
              </h3>
              <p className="text-sm text-gray-300">
                {t(
                  'docs.vision.future.step4.description',
                  'Multi-chain support for broader accessibility and reduced transaction costs.'
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-gray-800 p-6 text-center">
          <h2 className="mb-4 text-xl font-semibold text-white">
            {t('docs.vision.join.title', 'Join Our Vision')}
          </h2>
          <p className="mb-6 text-gray-300">
            {t(
              'docs.vision.join.description',
              'Be part of the future of prediction markets. Connect your wallet and start participating in the DarkPool revolution.'
            )}
          </p>
          <a
            href="/"
            className="rounded-lg bg-orange-600 px-6 py-3 font-medium text-white hover:bg-orange-700"
          >
            {t('docs.vision.join.cta', 'Get Started')}
          </a>
        </div>
      </div>
    </div>
  );
}
