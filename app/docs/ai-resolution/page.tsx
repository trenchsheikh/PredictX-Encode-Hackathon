'use client';

import { useTranslation } from 'react-i18next';
import '@/lib/i18n';
import {
  Bot,
  Link as LinkIcon,
  CloudSun,
  Trophy,
  Newspaper,
  BarChart3,
  Timer,
  CheckCircle2,
  CircleDot,
} from 'lucide-react';

export default function AIResolutionPage() {
  const { t } = useTranslation();

  return (
    <div className="prose prose-invert max-w-none">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold text-white">
          {t('docs.ai_resolution.title', 'AI-Powered Resolution')}
        </h1>
        <p className="text-lg leading-relaxed text-gray-300">
          {t(
            'docs.ai_resolution.description',
            'How our AI system automatically resolves prediction market outcomes.'
          )}
        </p>
      </div>

      <div className="space-y-8">
        {/* Overview */}
        <div className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            <Bot
              className="mr-2 inline h-5 w-5 align-text-bottom text-yellow-400"
              aria-hidden
            />{' '}
            {t(
              'docs.ai_resolution.overview.title',
              'Multi-Layer Verification System'
            )}
          </h2>
          <p className="mb-4 text-gray-300">
            {t(
              'docs.ai_resolution.overview.description',
              'When bets expire, our multi-layer verification system automatically determines the outcome using advanced AI analysis and real-world data sources.'
            )}
          </p>
        </div>

        {/* Layer 1 */}
        <div className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            <LinkIcon
              className="mr-2 inline h-5 w-5 align-text-bottom text-yellow-400"
              aria-hidden
            />{' '}
            {t(
              'docs.ai_resolution.layer1.title',
              'Layer 1: Deterministic Checks'
            )}
          </h2>
          <p className="mb-4 text-gray-300">
            {t(
              'docs.ai_resolution.layer1.description',
              'Price oracles and on-chain data provide instant, verifiable results for crypto/token bets.'
            )}
          </p>
          <div className="space-y-3 text-gray-300">
            <div className="flex items-start">
              <CircleDot
                className="mr-3 mt-1 h-4 w-4 flex-shrink-0 text-green-400"
                aria-hidden
              />
              {t(
                'docs.ai_resolution.layer1.crypto_prices',
                'Real-time cryptocurrency price data from multiple exchanges'
              )}
            </div>
            <div className="flex items-start">
              <CircleDot
                className="mr-3 mt-1 h-4 w-4 flex-shrink-0 text-green-400"
                aria-hidden
              />
              {t(
                'docs.ai_resolution.layer1.on_chain_data',
                'On-chain transaction and block data verification'
              )}
            </div>
            <div className="flex items-start">
              <CircleDot
                className="mr-3 mt-1 h-4 w-4 flex-shrink-0 text-green-400"
                aria-hidden
              />
              {t(
                'docs.ai_resolution.layer1.instant_resolution',
                'Instant resolution for price-based predictions'
              )}
            </div>
          </div>
        </div>

        {/* Layer 2 */}
        <div className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            <Trophy
              className="mr-2 inline h-5 w-5 align-text-bottom text-yellow-400"
              aria-hidden
            />{' '}
            {t(
              'docs.ai_resolution.layer2.title',
              'Layer 2: Evidence Gathering'
            )}
          </h2>
          <p className="mb-4 text-gray-300">
            {t(
              'docs.ai_resolution.layer2.description',
              'Category-specific APIs fetch real data: weather data for weather bets, sports scores for sports bets, news for political events.'
            )}
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-gray-700 p-4">
              <h3 className="mb-2 font-semibold text-white">
                <CloudSun
                  className="mr-2 inline h-5 w-5 align-text-bottom text-yellow-400"
                  aria-hidden
                />{' '}
                {t('docs.ai_resolution.layer2.weather.title', 'Weather Data')}
              </h3>
              <p className="text-sm text-gray-300">
                {t(
                  'docs.ai_resolution.layer2.weather.description',
                  'Accurate weather data from meteorological services for weather-related predictions.'
                )}
              </p>
            </div>
            <div className="rounded-lg border border-gray-700 p-4">
              <h3 className="mb-2 font-semibold text-white">
                <Trophy
                  className="mr-2 inline h-5 w-5 align-text-bottom text-yellow-400"
                  aria-hidden
                />{' '}
                {t('docs.ai_resolution.layer2.sports.title', 'Sports Scores')}
              </h3>
              <p className="text-sm text-gray-300">
                {t(
                  'docs.ai_resolution.layer2.sports.description',
                  'Real-time sports data from official leagues and sports data providers.'
                )}
              </p>
            </div>
            <div className="rounded-lg border border-gray-700 p-4">
              <h3 className="mb-2 font-semibold text-white">
                <Newspaper
                  className="mr-2 inline h-5 w-5 align-text-bottom text-yellow-400"
                  aria-hidden
                />{' '}
                {t('docs.ai_resolution.layer2.news.title', 'News & Events')}
              </h3>
              <p className="text-sm text-gray-300">
                {t(
                  'docs.ai_resolution.layer2.news.description',
                  'Verified news sources and official announcements for political and current events.'
                )}
              </p>
            </div>
            <div className="rounded-lg border border-gray-700 p-4">
              <h3 className="mb-2 font-semibold text-white">
                <BarChart3
                  className="mr-2 inline h-5 w-5 align-text-bottom text-yellow-400"
                  aria-hidden
                />{' '}
                {t('docs.ai_resolution.layer2.markets.title', 'Market Data')}
              </h3>
              <p className="text-sm text-gray-300">
                {t(
                  'docs.ai_resolution.layer2.markets.description',
                  'Financial market data from multiple exchanges and data providers.'
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Layer 3 */}
        <div className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            <Bot
              className="mr-2 inline h-5 w-5 align-text-bottom text-yellow-400"
              aria-hidden
            />{' '}
            {t('docs.ai_resolution.layer3.title', 'Layer 3: AI Analysis')}
          </h2>
          <p className="mb-4 text-gray-300">
            {t(
              'docs.ai_resolution.layer3.description',
              'Advanced AI analyzes gathered evidence and makes final determination with reasoning.'
            )}
          </p>
          <div className="space-y-3 text-gray-300">
            <div className="flex items-start">
              <CircleDot
                className="mr-3 mt-1 h-4 w-4 flex-shrink-0 text-blue-400"
                aria-hidden
              />
              {t(
                'docs.ai_resolution.layer3.data_analysis',
                'Comprehensive analysis of all gathered evidence'
              )}
            </div>
            <div className="flex items-start">
              <CircleDot
                className="mr-3 mt-1 h-4 w-4 flex-shrink-0 text-blue-400"
                aria-hidden
              />
              {t(
                'docs.ai_resolution.layer3.reasoning',
                'Detailed reasoning provided for each resolution decision'
              )}
            </div>
            <div className="flex items-start">
              <CircleDot
                className="mr-3 mt-1 h-4 w-4 flex-shrink-0 text-blue-400"
                aria-hidden
              />
              {t(
                'docs.ai_resolution.layer3.consensus',
                'Consensus building from multiple data sources'
              )}
            </div>
            <div className="flex items-start">
              <CircleDot
                className="mr-3 mt-1 h-4 w-4 flex-shrink-0 text-blue-400"
                aria-hidden
              />
              {t(
                'docs.ai_resolution.layer3.verification',
                'Cross-verification with independent sources'
              )}
            </div>
          </div>
        </div>

        {/* Data Sources */}
        <div className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            <LinkIcon
              className="mr-2 inline h-5 w-5 align-text-bottom text-yellow-400"
              aria-hidden
            />{' '}
            {t('docs.ai_resolution.data_sources.title', 'Data Sources & APIs')}
          </h2>
          <p className="mb-4 text-gray-300">
            {t(
              'docs.ai_resolution.data_sources.description',
              'Our AI system integrates with 25+ APIs and data sources to ensure accurate and comprehensive resolution.'
            )}
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-gray-700 p-4">
              <h3 className="mb-2 font-semibold text-white">
                <BarChart3
                  className="mr-2 inline h-5 w-5 align-text-bottom text-yellow-400"
                  aria-hidden
                />{' '}
                {t(
                  'docs.ai_resolution.data_sources.financial.title',
                  'Financial Data'
                )}
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• CoinGecko API</li>
                <li>• Binance API</li>
                <li>• Yahoo Finance</li>
                <li>• Alpha Vantage</li>
              </ul>
            </div>
            <div className="rounded-lg border border-gray-700 p-4">
              <h3 className="mb-2 font-semibold text-white">
                <Trophy
                  className="mr-2 inline h-5 w-5 align-text-bottom text-yellow-400"
                  aria-hidden
                />{' '}
                {t(
                  'docs.ai_resolution.data_sources.sports.title',
                  'Sports Data'
                )}
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• ESPN API</li>
                <li>• The Sports DB</li>
                <li>• Football Data API</li>
                <li>• NBA Stats API</li>
              </ul>
            </div>
            <div className="rounded-lg border border-gray-700 p-4">
              <h3 className="mb-2 font-semibold text-white">
                <Newspaper
                  className="mr-2 inline h-5 w-5 align-text-bottom text-yellow-400"
                  aria-hidden
                />{' '}
                {t(
                  'docs.ai_resolution.data_sources.news.title',
                  'News & Events'
                )}
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• NewsAPI</li>
                <li>• Reuters API</li>
                <li>• Associated Press</li>
                <li>• Government APIs</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Resolution Process */}
        <div className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            <Timer
              className="mr-2 inline h-5 w-5 align-text-bottom text-yellow-400"
              aria-hidden
            />{' '}
            {t(
              'docs.ai_resolution.process.title',
              'Resolution Process Timeline'
            )}
          </h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <span className="mr-3 mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-orange-600 text-sm font-bold text-white">
                1
              </span>
              <div>
                <h3 className="font-semibold text-white">
                  {t(
                    'docs.ai_resolution.process.step1.title',
                    'Market Expiration'
                  )}
                </h3>
                <p className="text-sm text-gray-300">
                  {t(
                    'docs.ai_resolution.process.step1.description',
                    'Prediction market reaches its expiration time and closes for new bets.'
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
                    'docs.ai_resolution.process.step2.title',
                    'Data Collection (1-2 minutes)'
                  )}
                </h3>
                <p className="text-sm text-gray-300">
                  {t(
                    'docs.ai_resolution.process.step2.description',
                    'System gathers relevant data from all configured APIs and sources.'
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
                    'docs.ai_resolution.process.step3.title',
                    'AI Analysis (2-3 minutes)'
                  )}
                </h3>
                <p className="text-sm text-gray-300">
                  {t(
                    'docs.ai_resolution.process.step3.description',
                    'AI processes the data and determines the outcome with detailed reasoning.'
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
                    'docs.ai_resolution.process.step4.title',
                    'Resolution & Payouts'
                  )}
                </h3>
                <p className="text-sm text-gray-300">
                  {t(
                    'docs.ai_resolution.process.step4.description',
                    'Outcome is recorded on-chain and winners can claim their payouts.'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Transparency Note */}
        <div className="rounded-lg border border-green-600/30 bg-green-600/10 p-6">
          <div className="flex items-start">
            <CheckCircle2
              className="mr-3 mt-1 h-4 w-4 flex-shrink-0 text-green-400"
              aria-hidden
            />
            <div>
              <h3 className="mb-2 font-semibold text-green-300">
                {t(
                  'docs.ai_resolution.transparency.title',
                  'Transparency & Verification'
                )}
              </h3>
              <p className="text-sm text-gray-300">
                {t(
                  'docs.ai_resolution.transparency.description',
                  "All resolution decisions are recorded on-chain with detailed reasoning. Users can verify the data sources used and the AI's decision-making process for complete transparency."
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
