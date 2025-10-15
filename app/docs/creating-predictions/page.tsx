'use client';

import { useTranslation } from 'react-i18next';
import '@/lib/i18n';

export default function CreatingPredictionsPage() {
  const { t } = useTranslation();

  return (
    <div className="prose prose-invert max-w-none">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold text-white">
          {t('docs.creating_predictions.title', 'Creating Predictions')}
        </h1>
        <p className="text-lg leading-relaxed text-gray-300">
          {t(
            'docs.creating_predictions.description',
            'Step-by-step guide to creating prediction markets on DarkBet.'
          )}
        </p>
      </div>

      <div className="space-y-8">
        {/* Overview */}
        <div className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            🎯 {t('docs.creating_predictions.overview.title', 'Overview')}
          </h2>
          <p className="text-gray-300">
            {t(
              'docs.creating_predictions.overview.description',
              'Turning your idea into a prediction market has never been easier. Follow these steps to create a transparent, on-chain prediction using DarkBet.'
            )}
          </p>
        </div>

        {/* Step 1 */}
        <div className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            📝{' '}
            {t(
              'docs.creating_predictions.step1.title',
              'STEP 1 - Describe Your Prediction'
            )}
          </h2>
          <p className="mb-4 text-gray-300">
            {t(
              'docs.creating_predictions.step1.description',
              'Simply describe what you want to bet on - AI will handle the rest.'
            )}
          </p>
          <div className="rounded-lg border border-orange-600/30 bg-orange-600/10 p-4">
            <h3 className="mb-2 font-semibold text-orange-300">
              {t(
                'docs.creating_predictions.step1.example.title',
                'Example Descriptions'
              )}
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-orange-400">•</span>
                {t(
                  'docs.creating_predictions.step1.example.bitcoin',
                  '"Will Bitcoin reach $100,000 by the end of 2024?"'
                )}
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-orange-400">•</span>
                {t(
                  'docs.creating_predictions.step1.example.weather',
                  '"Will it rain in New York City tomorrow?"'
                )}
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-orange-400">•</span>
                {t(
                  'docs.creating_predictions.step1.example.sports',
                  '"Will the Lakers win the NBA championship this season?"'
                )}
              </li>
            </ul>
          </div>
        </div>

        {/* Step 2 */}
        <div className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            🤖{' '}
            {t(
              'docs.creating_predictions.step2.title',
              'STEP 2 - AI Generates Smart Title'
            )}
          </h2>
          <p className="mb-4 text-gray-300">
            {t(
              'docs.creating_predictions.step2.description',
              'Our AI analyzes your description and creates a clear, searchable title optimized for the platform.'
            )}
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-gray-700 p-4">
              <h3 className="mb-2 font-semibold text-white">
                📝{' '}
                {t('docs.creating_predictions.step2.input.title', 'Your Input')}
              </h3>
              <p className="text-sm italic text-gray-400">
                "Will Bitcoin reach $100,000 by the end of 2024?"
              </p>
            </div>
            <div className="rounded-lg border border-green-600/30 bg-green-600/10 p-4">
              <h3 className="mb-2 font-semibold text-green-300">
                ✨{' '}
                {t(
                  'docs.creating_predictions.step2.output.title',
                  'AI Generated Title'
                )}
              </h3>
              <p className="text-sm text-gray-300">
                "Bitcoin (BTC) to reach $100,000 by December 31, 2024"
              </p>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            📅{' '}
            {t(
              'docs.creating_predictions.step3.title',
              'STEP 3 - Automatic Deadline & Category'
            )}
          </h2>
          <p className="mb-4 text-gray-300">
            {t(
              'docs.creating_predictions.step3.description',
              'AI suggests intelligent deadlines (match times for sports, market close for crypto) and assigns the right category.'
            )}
          </p>
          <div className="space-y-4">
            <div className="rounded-lg border border-gray-700 p-4">
              <h3 className="mb-2 font-semibold text-white">
                ⏰{' '}
                {t(
                  'docs.creating_predictions.step3.deadline.title',
                  'Smart Deadlines'
                )}
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start">
                  <span className="mr-2 mt-1 text-blue-400">•</span>
                  {t(
                    'docs.creating_predictions.step3.deadline.sports',
                    'Sports: Match end time or season conclusion'
                  )}
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1 text-blue-400">•</span>
                  {t(
                    'docs.creating_predictions.step3.deadline.crypto',
                    'Crypto: End of day, week, or specified date'
                  )}
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1 text-blue-400">•</span>
                  {t(
                    'docs.creating_predictions.step3.deadline.weather',
                    'Weather: Next day or specified timeframe'
                  )}
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1 text-blue-400">•</span>
                  {t(
                    'docs.creating_predictions.step3.deadline.events',
                    'Events: Event conclusion or announcement date'
                  )}
                </li>
              </ul>
            </div>
            <div className="rounded-lg border border-gray-700 p-4">
              <h3 className="mb-2 font-semibold text-white">
                🏷️{' '}
                {t(
                  'docs.creating_predictions.step3.category.title',
                  'Auto-Assigned Categories'
                )}
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
                <div className="flex items-center">
                  <span className="mr-2 text-green-400">💰</span>
                  {t(
                    'docs.creating_predictions.step3.category.crypto',
                    'Crypto'
                  )}
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-blue-400">⚽</span>
                  {t(
                    'docs.creating_predictions.step3.category.sports',
                    'Sports'
                  )}
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-yellow-400">🌤️</span>
                  {t(
                    'docs.creating_predictions.step3.category.weather',
                    'Weather'
                  )}
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-purple-400">📰</span>
                  {t('docs.creating_predictions.step3.category.news', 'News')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Features */}
        <div className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            ⚙️{' '}
            {t(
              'docs.creating_predictions.additional.title',
              'Additional Features'
            )}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-gray-700 p-4">
              <h3 className="mb-2 font-semibold text-white">
                🔒{' '}
                {t(
                  'docs.creating_predictions.additional.privacy.title',
                  'Dark Pool Privacy'
                )}
              </h3>
              <p className="text-sm text-gray-300">
                {t(
                  'docs.creating_predictions.additional.privacy.description',
                  'Your prediction remains private until resolution, preventing copy trading and manipulation.'
                )}
              </p>
            </div>
            <div className="rounded-lg border border-gray-700 p-4">
              <h3 className="mb-2 font-semibold text-white">
                🤖{' '}
                {t(
                  'docs.creating_predictions.additional.ai_resolution.title',
                  'AI-Powered Resolution'
                )}
              </h3>
              <p className="text-sm text-gray-300">
                {t(
                  'docs.creating_predictions.additional.ai_resolution.description',
                  'Automatic resolution using real-world data from 25+ APIs and AI analysis.'
                )}
              </p>
            </div>
            <div className="rounded-lg border border-gray-700 p-4">
              <h3 className="mb-2 font-semibold text-white">
                📊{' '}
                {t(
                  'docs.creating_predictions.additional.dynamic_pricing.title',
                  'Dynamic Pricing'
                )}
              </h3>
              <p className="text-sm text-gray-300">
                {t(
                  'docs.creating_predictions.additional.dynamic_pricing.description',
                  'Fair market-based pricing using Automated Market Maker (AMM) technology.'
                )}
              </p>
            </div>
            <div className="rounded-lg border border-gray-700 p-4">
              <h3 className="mb-2 font-semibold text-white">
                🌐{' '}
                {t(
                  'docs.creating_predictions.additional.global.title',
                  'Global Access'
                )}
              </h3>
              <p className="text-sm text-gray-300">
                {t(
                  'docs.creating_predictions.additional.global.description',
                  'Create predictions on events worldwide with multi-language support.'
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Best Practices */}
        <div className="rounded-lg border border-blue-600/30 bg-blue-600/10 p-6">
          <div className="flex items-start">
            <span className="mr-3 mt-1 text-blue-400">💡</span>
            <div>
              <h3 className="mb-2 font-semibold text-blue-300">
                {t(
                  'docs.creating_predictions.best_practices.title',
                  'Best Practices for Creating Predictions'
                )}
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start">
                  <span className="mr-2 mt-1 text-blue-400">•</span>
                  {t(
                    'docs.creating_predictions.best_practices.clear',
                    'Be clear and specific in your description'
                  )}
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1 text-blue-400">•</span>
                  {t(
                    'docs.creating_predictions.best_practices.verifiable',
                    'Ensure the outcome can be objectively verified'
                  )}
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1 text-blue-400">•</span>
                  {t(
                    'docs.creating_predictions.best_practices.timeframe',
                    'Include clear timeframes when relevant'
                  )}
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1 text-blue-400">•</span>
                  {t(
                    'docs.creating_predictions.best_practices.interesting',
                    'Create predictions that others will find interesting to bet on'
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Ready to Create */}
        <div className="rounded-lg bg-gray-800 p-6 text-center">
          <h2 className="mb-4 text-xl font-semibold text-white">
            {t(
              'docs.creating_predictions.ready.title',
              'Ready to Create Your First Prediction?'
            )}
          </h2>
          <p className="mb-6 text-gray-300">
            {t(
              'docs.creating_predictions.ready.description',
              "Now that you understand how to create predictions, you're ready to start building your own prediction markets on DarkBet."
            )}
          </p>
          <a
            href="/"
            className="rounded-lg bg-orange-600 px-6 py-3 font-medium text-white hover:bg-orange-700"
          >
            {t(
              'docs.creating_predictions.ready.cta',
              'Start Creating Predictions'
            )}
          </a>
        </div>
      </div>
    </div>
  );
}
