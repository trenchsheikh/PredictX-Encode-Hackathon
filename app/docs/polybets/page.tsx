'use client';

import { useTranslation } from 'react-i18next';
import '@/lib/i18n';
import {
  Bot,
  Settings,
  BookOpen,
  Zap,
  Info,
  Rocket,
  CircleDot,
} from 'lucide-react';

export default function PolybetsPage() {
  const { t } = useTranslation();

  return (
    <div className="prose prose-invert max-w-none">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold text-white">
          {t('docs.polybets.title', 'Introducing Polybets')}
        </h1>
        <p className="text-lg leading-relaxed text-gray-300">
          {t(
            'docs.polybets.description',
            "DarkBet just got smarter. We're excited to launch Polybets, a new feature that automatically mirrors trending prediction markets from Polymarket, bringing real-time insights and verified outcomes directly to the DarkBet ecosystem."
          )}
        </p>
      </div>

      <div className="space-y-8">
        {/* Overview Section */}
        <div className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            <Bot
              className="mr-2 inline h-5 w-5 align-text-bottom text-yellow-400"
              aria-hidden
            />{' '}
            {t('docs.polybets.overview.title', 'Overview')}
          </h2>
          <p className="text-gray-300">
            {t(
              'docs.polybets.overview.description',
              "DarkBet just got smarter. We're excited to launch Polybets, a new feature that automatically mirrors trending prediction markets from Polymarket, bringing real-time insights and verified outcomes directly to the DarkBet ecosystem."
            )}
          </p>
        </div>

        {/* How It Works Section */}
        <div className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            <Settings
              className="mr-2 inline h-5 w-5 align-text-bottom text-yellow-400"
              aria-hidden
            />{' '}
            {t('docs.polybets.how_it_works.title', 'How It Works')}
          </h2>
          <p className="mb-4 text-gray-300">
            {t(
              'docs.polybets.how_it_works.description',
              'Polybets pulls the top 100 trending markets from Polymarket and keeps them live on DarkBet, with automatic syncing and resolution. No need to manually create or verify markets, everything updates automatically.'
            )}
          </p>

          <div className="space-y-4">
            <div className="rounded-lg border border-orange-600/30 bg-orange-600/10 p-4">
              <h3 className="mb-2 font-semibold text-orange-300">
                <BookOpen
                  className="mr-2 inline h-4 w-4 align-text-bottom text-orange-400"
                  aria-hidden
                />{' '}
                {t(
                  'docs.polybets.accumulating_library.title',
                  'Accumulating Library'
                )}
              </h3>
              <p className="mb-3 text-sm text-gray-300">
                {t(
                  'docs.polybets.accumulating_library.description',
                  'Polybets now works like a growing, self-updating library:'
                )}
              </p>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start">
                  <CircleDot
                    className="mr-3 mt-1 h-4 w-4 flex-shrink-0 text-orange-400"
                    aria-hidden
                  />
                  {t(
                    'docs.polybets.accumulating_library.point1',
                    'Every sync checks the top 100 trending markets from Polymarket.'
                  )}
                </li>
                <li className="flex items-start">
                  <CircleDot
                    className="mr-3 mt-1 h-4 w-4 flex-shrink-0 text-orange-400"
                    aria-hidden
                  />
                  {t(
                    'docs.polybets.accumulating_library.point2',
                    'New markets are added automatically to the DarkBet collection.'
                  )}
                </li>
                <li className="flex items-start">
                  <CircleDot
                    className="mr-3 mt-1 h-4 w-4 flex-shrink-0 text-orange-400"
                    aria-hidden
                  />
                  {t(
                    'docs.polybets.accumulating_library.point3',
                    'Old markets remain stored — even after they drop from the top 100.'
                  )}
                </li>
                <li className="flex items-start">
                  <CircleDot
                    className="mr-3 mt-1 h-4 w-4 flex-shrink-0 text-orange-400"
                    aria-hidden
                  />
                  {t(
                    'docs.polybets.accumulating_library.point4',
                    'Over time, DarkBet builds an ever-growing archive of on-chain prediction markets.'
                  )}
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-green-600/30 bg-green-600/10 p-4">
              <h3 className="mb-2 font-semibold text-green-300">
                <Zap
                  className="mr-2 inline h-4 w-4 align-text-bottom text-green-400"
                  aria-hidden
                />{' '}
                {t(
                  'docs.polybets.sync_interval.title',
                  '30-Second Sync Interval'
                )}
              </h3>
              <p className="mb-3 text-sm text-gray-300">
                {t(
                  'docs.polybets.sync_interval.description',
                  "We've made PolyBets faster than ever:"
                )}
              </p>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start">
                  <CircleDot
                    className="mr-3 mt-1 h-4 w-4 flex-shrink-0 text-green-400"
                    aria-hidden
                  />
                  {t(
                    'docs.polybets.sync_interval.point1',
                    'The system syncs every 30 seconds to capture new trending markets quickly.'
                  )}
                </li>
                <li className="flex items-start">
                  <CircleDot
                    className="mr-3 mt-1 h-4 w-4 flex-shrink-0 text-green-400"
                    aria-hidden
                  />
                  {t(
                    'docs.polybets.sync_interval.point2',
                    'Resolutions from Polymarket are also synced in near real-time.'
                  )}
                </li>
                <li className="flex items-start">
                  <CircleDot
                    className="mr-3 mt-1 h-4 w-4 flex-shrink-0 text-green-400"
                    aria-hidden
                  />
                  {t(
                    'docs.polybets.sync_interval.point3',
                    'Verified logs confirm that sync operations are consistently running every 30 seconds — ensuring smooth, up-to-date market data.'
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Important Note */}
        <div className="rounded-lg border border-blue-600/30 bg-blue-600/10 p-6">
          <div className="flex items-start">
            <Info
              className="mr-3 mt-1 h-4 w-4 flex-shrink-0 text-blue-400"
              aria-hidden
            />
            <div>
              <h3 className="mb-2 font-semibold text-blue-300">
                {t('docs.polybets.note.title', 'Important Note')}
              </h3>
              <p className="text-sm text-gray-300">
                {t(
                  'docs.polybets.note.description',
                  "Bets operate the same way as standard DarkBet markets, with no cancellations or refunds. All joined funds are secured in DarkBet's escrow, and the standard 1.5% platform fee applies."
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            <Rocket
              className="mr-2 inline h-5 w-5 align-text-bottom text-yellow-400"
              aria-hidden
            />{' '}
            {t('docs.polybets.benefits.title', 'Benefits of Polybets')}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-gray-700 p-4">
              <h3 className="mb-2 font-semibold text-white">
                {t(
                  'docs.polybets.benefits.automation.title',
                  'Automated Market Creation'
                )}
              </h3>
              <p className="text-sm text-gray-300">
                {t(
                  'docs.polybets.benefits.automation.description',
                  'No need to manually create markets - trending predictions are automatically synced and available.'
                )}
              </p>
            </div>
            <div className="rounded-lg border border-gray-700 p-4">
              <h3 className="mb-2 font-semibold text-white">
                {t(
                  'docs.polybets.benefits.verified.title',
                  'Verified Outcomes'
                )}
              </h3>
              <p className="text-sm text-gray-300">
                {t(
                  'docs.polybets.benefits.verified.description',
                  "All outcomes are verified through Polymarket's established resolution mechanisms."
                )}
              </p>
            </div>
            <div className="rounded-lg border border-gray-700 p-4">
              <h3 className="mb-2 font-semibold text-white">
                {t('docs.polybets.benefits.privacy.title', 'Dark Pool Privacy')}
              </h3>
              <p className="text-sm text-gray-300">
                {t(
                  'docs.polybets.benefits.privacy.description',
                  'Your betting strategies remain private until market resolution, even in mirrored markets.'
                )}
              </p>
            </div>
            <div className="rounded-lg border border-gray-700 p-4">
              <h3 className="mb-2 font-semibold text-white">
                {t('docs.polybets.benefits.growing.title', 'Growing Archive')}
              </h3>
              <p className="text-sm text-gray-300">
                {t(
                  'docs.polybets.benefits.growing.description',
                  'Access to an ever-growing library of prediction markets from the past and present.'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
