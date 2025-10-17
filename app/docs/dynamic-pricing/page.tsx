'use client';

import { useTranslation } from 'react-i18next';
import '@/lib/i18n';
import {
  BarChart3,
  Tag,
  Repeat,
  Scale,
  Trophy,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  CircleDot,
} from 'lucide-react';

export default function DynamicPricingPage() {
  const { t } = useTranslation();

  return (
    <div className="prose prose-invert max-w-none">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold text-white">
          {t('docs.dynamic_pricing.title', 'Dynamic Market Pricing (AMM)')}
        </h1>
        <p className="text-lg leading-relaxed text-gray-300">
          {t(
            'docs.dynamic_pricing.description',
            'Understanding how our Automated Market Maker pricing system works.'
          )}
        </p>
      </div>

      <div className="space-y-8">
        {/* How Prices Work */}
        <div className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            <BarChart3
              className="mr-2 inline h-5 w-5 align-text-bottom text-yellow-400"
              aria-hidden
            />{' '}
            {t('docs.dynamic_pricing.how_prices.title', 'How Prices Work')}
          </h2>
          <p className="mb-4 text-gray-300">
            {t(
              'docs.dynamic_pricing.how_prices.description',
              'DarkBet uses a Fixed Product Market Maker (FPMM) for fair, dynamic pricing.'
            )}
          </p>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start">
              <CircleDot
                className="mr-3 mt-1 h-4 w-4 flex-shrink-0 text-green-400"
                aria-hidden
              />
              {t(
                'docs.dynamic_pricing.how_prices.ratios',
                'Prices determined by pool balance ratios'
              )}
            </li>
            <li className="flex items-start">
              <CircleDot
                className="mr-3 mt-1 h-4 w-4 flex-shrink-0 text-green-400"
                aria-hidden
              />
              {t(
                'docs.dynamic_pricing.how_prices.sum',
                'YES price + NO price = 0.01 BNB always'
              )}
            </li>
            <li className="flex items-start">
              <CircleDot
                className="mr-3 mt-1 h-4 w-4 flex-shrink-0 text-green-400"
                aria-hidden
              />
              {t(
                'docs.dynamic_pricing.how_prices.market_shift',
                'More bets on one side = higher price for that outcome'
              )}
            </li>
            <li className="flex items-start">
              <CircleDot
                className="mr-3 mt-1 h-4 w-4 flex-shrink-0 text-green-400"
                aria-hidden
              />
              {t(
                'docs.dynamic_pricing.how_prices.slight_shift',
                'Each bet shifts the market slightly'
              )}
            </li>
          </ul>
        </div>

        {/* Betting Options */}
        <div className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            <Tag
              className="mr-2 inline h-5 w-5 align-text-bottom text-yellow-400"
              aria-hidden
            />{' '}
            {t('docs.dynamic_pricing.betting_options.title', 'Betting Options')}
          </h2>
          <div className="space-y-4">
            <div className="rounded-lg border border-gray-700 p-4">
              <h3 className="mb-2 font-semibold text-white">
                <Trophy
                  className="mr-2 inline h-4 w-4 align-text-bottom text-yellow-400"
                  aria-hidden
                />{' '}
                {t(
                  'docs.dynamic_pricing.betting_options.default.title',
                  'Default: Market Price'
                )}
              </h3>
              <p className="text-sm text-gray-300">
                {t(
                  'docs.dynamic_pricing.betting_options.default.description',
                  'Buy 1 share at current market price - quick and simple betting.'
                )}
              </p>
            </div>
            <div className="rounded-lg border border-gray-700 p-4">
              <h3 className="mb-2 font-semibold text-white">
                <Repeat
                  className="mr-2 inline h-4 w-4 align-text-bottom text-yellow-400"
                  aria-hidden
                />{' '}
                {t(
                  'docs.dynamic_pricing.betting_options.custom.title',
                  'Custom: Amount-Based'
                )}
              </h3>
              <p className="text-sm text-gray-300">
                {t(
                  'docs.dynamic_pricing.betting_options.custom.description',
                  'Enter any BNB amount, get calculated shares based on current market price.'
                )}
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-lg border border-orange-600/30 bg-orange-600/10 p-4">
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start">
                <CircleDot
                  className="mr-3 mt-1 h-4 w-4 flex-shrink-0 text-orange-400"
                  aria-hidden
                />
                {t(
                  'docs.dynamic_pricing.betting_options.real_time',
                  'Real-time quotes with 30-second validity'
                )}
              </li>
              <li className="flex items-start">
                <CircleDot
                  className="mr-3 mt-1 h-4 w-4 flex-shrink-0 text-orange-400"
                  aria-hidden
                />
                {t(
                  'docs.dynamic_pricing.betting_options.shares_formula',
                  'Shares = Amount Paid ÷ Current Price'
                )}
              </li>
            </ul>
          </div>
        </div>

        {/* Example Calculation */}
        <div className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            <Scale
              className="mr-2 inline h-5 w-5 align-text-bottom text-yellow-400"
              aria-hidden
            />{' '}
            {t('docs.dynamic_pricing.example.title', 'Example Calculation')}
          </h2>
          <div className="rounded-lg border border-green-600/30 bg-green-600/10 p-4">
            <div className="flex items-start">
              <span className="mr-3 mt-1 text-green-400">💡</span>
              <div>
                <h3 className="mb-2 font-semibold text-green-300">
                  {t(
                    'docs.dynamic_pricing.example.scenario',
                    'Example Scenario'
                  )}
                </h3>
                <p className="mb-3 text-sm text-gray-300">
                  {t(
                    'docs.dynamic_pricing.example.description',
                    'If YES is trading at 0.006 BNB and you bet 0.01 BNB:'
                  )}
                </p>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start">
                    <CircleDot
                      className="mr-3 mt-1 h-3 w-3 flex-shrink-0 text-gray-400"
                      aria-hidden
                    />
                    {t(
                      'docs.dynamic_pricing.example.yes_price',
                      'YES Price: 0.006 BNB'
                    )}
                  </li>
                  <li className="flex items-start">
                    <CircleDot
                      className="mr-3 mt-1 h-3 w-3 flex-shrink-0 text-gray-400"
                      aria-hidden
                    />
                    {t(
                      'docs.dynamic_pricing.example.bet_amount',
                      'Your Bet: 0.01 BNB'
                    )}
                  </li>
                  <li className="flex items-start">
                    <CircleDot
                      className="mr-3 mt-1 h-3 w-3 flex-shrink-0 text-gray-400"
                      aria-hidden
                    />
                    {t(
                      'docs.dynamic_pricing.example.shares_received',
                      'Shares Received: 0.01 ÷ 0.006 = ~1.67 shares'
                    )}
                  </li>
                  <li className="flex items-start">
                    <CircleDot
                      className="mr-3 mt-1 h-3 w-3 flex-shrink-0 text-green-400"
                      aria-hidden
                    />
                    <span className="font-semibold text-green-400">
                      {t(
                        'docs.dynamic_pricing.example.if_wins',
                        'If YES wins: 1.67 × 0.01 = 0.0167 BNB payout'
                      )}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* AMM Mechanics */}
        <div className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            <Repeat
              className="mr-2 inline h-5 w-5 align-text-bottom text-yellow-400"
              aria-hidden
            />{' '}
            {t('docs.dynamic_pricing.amm_mechanics.title', 'AMM Mechanics')}
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-gray-700 p-4">
              <h3 className="mb-2 font-semibold text-white">
                <TrendingUp
                  className="mr-2 inline h-4 w-4 align-text-bottom text-yellow-400"
                  aria-hidden
                />{' '}
                {t(
                  'docs.dynamic_pricing.amm_mechanics.price_impact.title',
                  'Price Impact'
                )}
              </h3>
              <p className="text-sm text-gray-300">
                {t(
                  'docs.dynamic_pricing.amm_mechanics.price_impact.description',
                  'Larger bets have more price impact, creating natural market dynamics and preventing manipulation.'
                )}
              </p>
            </div>
            <div className="rounded-lg border border-gray-700 p-4">
              <h3 className="mb-2 font-semibold text-white">
                <Repeat
                  className="mr-2 inline h-4 w-4 align-text-bottom text-yellow-400"
                  aria-hidden
                />{' '}
                {t(
                  'docs.dynamic_pricing.amm_mechanics.liquidity.title',
                  'Liquidity Provision'
                )}
              </h3>
              <p className="text-sm text-gray-300">
                {t(
                  'docs.dynamic_pricing.amm_mechanics.liquidity.description',
                  'All participants contribute to market liquidity, ensuring continuous trading availability.'
                )}
              </p>
            </div>
            <div className="rounded-lg border border-gray-700 p-4">
              <h3 className="mb-2 font-semibold text-white">
                <Scale
                  className="mr-2 inline h-4 w-4 align-text-bottom text-yellow-400"
                  aria-hidden
                />{' '}
                {t(
                  'docs.dynamic_pricing.amm_mechanics.fairness.title',
                  'Fair Pricing'
                )}
              </h3>
              <p className="text-sm text-gray-300">
                {t(
                  'docs.dynamic_pricing.amm_mechanics.fairness.description',
                  'Algorithmic pricing ensures fair market value based on supply and demand.'
                )}
              </p>
            </div>
            <div className="rounded-lg border border-gray-700 p-4">
              <h3 className="mb-2 font-semibold text-white">
                <Trophy
                  className="mr-2 inline h-4 w-4 align-text-bottom text-yellow-400"
                  aria-hidden
                />{' '}
                {t(
                  'docs.dynamic_pricing.amm_mechanics.arbitrage.title',
                  'Arbitrage Opportunities'
                )}
              </h3>
              <p className="text-sm text-gray-300">
                {t(
                  'docs.dynamic_pricing.amm_mechanics.arbitrage.description',
                  'Price imbalances create opportunities for market efficiency and fair value discovery.'
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Market Dynamics */}
        <div className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            <BarChart3
              className="mr-2 inline h-5 w-5 align-text-bottom text-yellow-400"
              aria-hidden
            />{' '}
            {t('docs.dynamic_pricing.market_dynamics.title', 'Market Dynamics')}
          </h2>
          <div className="space-y-6">
            <div className="flex items-start">
              <TrendingUp
                className="mr-4 mt-1 h-4 w-4 flex-shrink-0 text-orange-400"
                aria-hidden
              />
              <div>
                <h3 className="font-semibold text-white">
                  {t(
                    'docs.dynamic_pricing.market_dynamics.bullish.title',
                    'Bullish Market (More YES bets)'
                  )}
                </h3>
                <p className="text-sm text-gray-300">
                  {t(
                    'docs.dynamic_pricing.market_dynamics.bullish.description',
                    'YES price increases, NO price decreases - reflecting market sentiment.'
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <TrendingDown
                className="mr-4 mt-1 h-4 w-4 flex-shrink-0 text-red-400"
                aria-hidden
              />
              <div>
                <h3 className="font-semibold text-white">
                  {t(
                    'docs.dynamic_pricing.market_dynamics.bearish.title',
                    'Bearish Market (More NO bets)'
                  )}
                </h3>
                <p className="text-sm text-gray-300">
                  {t(
                    'docs.dynamic_pricing.market_dynamics.bearish.description',
                    'NO price increases, YES price decreases - indicating negative sentiment.'
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <Scale
                className="mr-4 mt-1 h-4 w-4 flex-shrink-0 text-blue-400"
                aria-hidden
              />
              <div>
                <h3 className="font-semibold text-white">
                  {t(
                    'docs.dynamic_pricing.market_dynamics.balanced.title',
                    'Balanced Market'
                  )}
                </h3>
                <p className="text-sm text-gray-300">
                  {t(
                    'docs.dynamic_pricing.market_dynamics.balanced.description',
                    'Equal betting on both sides results in balanced pricing around 0.005 BNB each.'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Advantages */}
        <div className="rounded-lg border border-green-600/30 bg-green-600/10 p-6">
          <div className="flex items-start">
            <CheckCircle2
              className="mr-3 mt-1 h-4 w-4 flex-shrink-0 text-green-400"
              aria-hidden
            />
            <div>
              <h3 className="mb-2 font-semibold text-green-300">
                {t(
                  'docs.dynamic_pricing.advantages.title',
                  'Advantages of AMM Pricing'
                )}
              </h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start">
                  <CircleDot
                    className="mr-3 mt-1 h-4 w-4 flex-shrink-0 text-green-400"
                    aria-hidden
                  />
                  {t(
                    'docs.dynamic_pricing.advantages.fairness',
                    'Fair, algorithmic pricing based on market supply and demand'
                  )}
                </li>
                <li className="flex items-start">
                  <CircleDot
                    className="mr-3 mt-1 h-4 w-4 flex-shrink-0 text-green-400"
                    aria-hidden
                  />
                  {t(
                    'docs.dynamic_pricing.advantages.liquidity',
                    'Continuous liquidity provision from all participants'
                  )}
                </li>
                <li className="flex items-start">
                  <CircleDot
                    className="mr-3 mt-1 h-4 w-4 flex-shrink-0 text-green-400"
                    aria-hidden
                  />
                  {t(
                    'docs.dynamic_pricing.advantages.manipulation',
                    'Resistant to manipulation due to algorithmic pricing'
                  )}
                </li>
                <li className="flex items-start">
                  <CircleDot
                    className="mr-3 mt-1 h-4 w-4 flex-shrink-0 text-green-400"
                    aria-hidden
                  />
                  {t(
                    'docs.dynamic_pricing.advantages.transparency',
                    'Transparent pricing mechanism visible to all users'
                  )}
                </li>
                <li className="flex items-start">
                  <CircleDot
                    className="mr-3 mt-1 h-4 w-4 flex-shrink-0 text-green-400"
                    aria-hidden
                  />
                  {t(
                    'docs.dynamic_pricing.advantages.efficiency',
                    'Efficient price discovery through market dynamics'
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
