'use client';

import { useTranslation } from 'react-i18next';
import '@/lib/i18n';

export default function WhyChooseDarkBetPage() {
  const { t } = useTranslation();

  return (
    <div className="prose prose-invert max-w-none">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold text-white">
          {t('docs.why_choose_darkbet.title', 'Why Choose DarkBet')}
        </h1>
        <p className="mb-6 text-lg leading-relaxed text-gray-300">
          {t(
            'docs.why_choose_darkbet.description',
            'In a world where trust and data are everything, DarkBet brings both together on-chain. The platform allows users to turn their opinions into measurable predictions with full transparency and privacy through our revolutionary Dark Pool system.'
          )}
        </p>
      </div>

      <div className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg bg-gray-800 p-6">
            <h3 className="mb-3 text-lg font-semibold text-white">
              ⛓️{' '}
              {t('docs.why_choose_darkbet.built_on_bnb', 'Built on BNB Chain')}
            </h3>
            <p className="text-gray-300">
              {t(
                'docs.why_choose_darkbet.built_on_bnb_desc',
                'Leveraging the scalability and low transaction fees of BNB Chain, DarkBet ensures fast, cost-efficient, and secure market participation for users worldwide.'
              )}
            </p>
          </div>

          <div className="rounded-lg bg-gray-800 p-6">
            <h3 className="mb-3 text-lg font-semibold text-white">
              🔒{' '}
              {t(
                'docs.why_choose_darkbet.dark_pool_privacy',
                'Dark Pool Privacy'
              )}
            </h3>
            <p className="text-gray-300">
              {t(
                'docs.why_choose_darkbet.dark_pool_privacy_desc',
                'Your betting strategy remains completely hidden until market resolution, preventing manipulation and ensuring fair competition for all participants.'
              )}
            </p>
          </div>

          <div className="rounded-lg bg-gray-800 p-6">
            <h3 className="mb-3 text-lg font-semibold text-white">
              🔍{' '}
              {t(
                'docs.why_choose_darkbet.transparent',
                'Transparent and Verifiable'
              )}
            </h3>
            <p className="text-gray-300">
              {t(
                'docs.why_choose_darkbet.transparent_desc',
                'All predictions, outcomes, and payouts are recorded on-chain, ensuring trust and clarity across every interaction while maintaining betting privacy.'
              )}
            </p>
          </div>

          <div className="rounded-lg bg-gray-800 p-6">
            <h3 className="mb-3 text-lg font-semibold text-white">
              👥{' '}
              {t(
                'docs.why_choose_darkbet.community_driven',
                'Community-Driven Markets'
              )}
            </h3>
            <p className="text-gray-300">
              {t(
                'docs.why_choose_darkbet.community_driven_desc',
                'DarkBet empowers users to create and join prediction markets that reflect global events, trends, and on-chain data with complete privacy protection.'
              )}
            </p>
          </div>

          <div className="rounded-lg bg-gray-800 p-6">
            <h3 className="mb-3 text-lg font-semibold text-white">
              🏆{' '}
              {t(
                'docs.why_choose_darkbet.rewarding_accuracy',
                'Rewarding Accuracy'
              )}
            </h3>
            <p className="text-gray-300">
              {t(
                'docs.why_choose_darkbet.rewarding_accuracy_desc',
                'Users who predict correctly are rewarded directly from market pools, fostering data-backed, informed decision-making in a fair environment.'
              )}
            </p>
          </div>

          <div className="rounded-lg bg-gray-800 p-6">
            <h3 className="mb-3 text-lg font-semibold text-white">
              🤖{' '}
              {t('docs.why_choose_darkbet.ai_powered', 'AI-Powered Resolution')}
            </h3>
            <p className="text-gray-300">
              {t(
                'docs.why_choose_darkbet.ai_powered_desc',
                'Advanced AI automatically resolves prediction markets using real-world data from 25+ APIs, ensuring fast and accurate outcomes.'
              )}
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-gradient-to-r from-orange-600/20 to-red-600/20 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            {t(
              'docs.why_choose_darkbet.conclusion.title',
              'The DarkBet Advantage'
            )}
          </h2>
          <p className="text-lg leading-relaxed text-gray-300">
            {t(
              'docs.why_choose_darkbet.conclusion.description',
              'DarkBet gives you the tools to participate confidently, knowing every prediction is fair, secure, and verified on BNB Chain. Our Dark Pool system ensures your strategies remain private while maintaining complete transparency in outcomes and payouts.'
            )}
          </p>
        </div>

        <div className="rounded-lg border border-yellow-600/30 bg-yellow-600/20 p-6">
          <h2 className="mb-4 text-2xl font-semibold text-yellow-300">
            {t('docs.why_choose_darkbet.security.title', 'Security & Privacy')}
          </h2>
          <p className="mb-4 text-gray-300">
            {t(
              'docs.why_choose_darkbet.security.description',
              'DarkBet integrates Privy, a trusted third-party authentication provider, to ensure the security and privacy of all users. Privy enables safe wallet connections, encrypted session management, and identity verification, helping protect the community from fraudulent activity while maintaining a seamless on-chain experience.'
            )}
          </p>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-yellow-400">🔐</span>
              {t(
                'docs.why_choose_darkbet.security.encrypted',
                'Encrypted session management and secure wallet connections'
              )}
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-yellow-400">🛡️</span>
              {t(
                'docs.why_choose_darkbet.security.identity',
                'Identity verification and fraud protection'
              )}
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-yellow-400">🔒</span>
              {t(
                'docs.why_choose_darkbet.security.privacy',
                'Complete betting privacy with Dark Pool technology'
              )}
            </li>
          </ul>
        </div>

        <div className="text-center">
          <h2 className="mb-4 text-xl font-semibold text-white">
            {t('docs.why_choose_darkbet.ready.title', 'Ready to Start?')}
          </h2>
          <p className="mb-6 text-gray-300">
            {t(
              'docs.why_choose_darkbet.ready.description',
              'Join DarkBet today and experience the future of prediction markets with complete privacy and transparency.'
            )}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/docs/connect-wallet"
              className="rounded-lg bg-orange-600 px-6 py-3 font-medium text-white hover:bg-orange-700"
            >
              {t(
                'docs.why_choose_darkbet.ready.connect_wallet',
                'Connect Wallet'
              )}
            </a>
            <a
              href="/docs/creating-predictions"
              className="rounded-lg bg-gray-700 px-6 py-3 font-medium text-white hover:bg-gray-600"
            >
              {t(
                'docs.why_choose_darkbet.ready.create_prediction',
                'Create Prediction'
              )}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
