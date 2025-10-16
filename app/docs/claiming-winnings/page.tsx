'use client';

import { useTranslation } from 'react-i18next';
import '@/lib/i18n';

export default function ClaimingWinningsPage() {
  const { t } = useTranslation();

  return (
    <div className="prose prose-invert max-w-none">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold text-white">
          {t('docs.claiming_winnings.title', 'Claiming Your Winnings')}
        </h1>
        <p className="text-lg leading-relaxed text-gray-300">
          {t(
            'docs.claiming_winnings.description',
            'How to claim your rewards after winning prediction markets.'
          )}
        </p>
      </div>

      <div className="space-y-8">
        {/* How Payouts Work */}
        <div className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            💰 {t('docs.claiming_winnings.payouts.title', 'How Payouts Work')}
          </h2>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-green-400">•</span>
              {t(
                'docs.claiming_winnings.payouts.winners_split',
                'Winners split the total pool proportionally'
              )}
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-green-400">•</span>
              {t(
                'docs.claiming_winnings.payouts.formula',
                'Payout = (Your Shares ÷ Total Winning Shares) × Total Pool'
              )}
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-green-400">•</span>
              {t(
                'docs.claiming_winnings.payouts.platform_fee',
                '1.5% platform fee automatically deducted'
              )}
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-green-400">•</span>
              {t(
                'docs.claiming_winnings.payouts.receive',
                'You receive 98.5% of gross winnings in BNB'
              )}
            </li>
          </ul>
        </div>

        {/* Security Features */}
        <div className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            ⚙️ {t('docs.claiming_winnings.security.title', 'Security Features')}
          </h2>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-blue-400">•</span>
              {t(
                'docs.claiming_winnings.security.vault_wallet',
                'Secure vault wallet holds all funds'
              )}
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-blue-400">•</span>
              {t(
                'docs.claiming_winnings.security.verification',
                'On-chain transaction verification'
              )}
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-blue-400">•</span>
              {t(
                'docs.claiming_winnings.security.cooldown',
                '30-second claim cooldown prevents duplicates'
              )}
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-blue-400">•</span>
              {t(
                'docs.claiming_winnings.security.bscscan',
                'View transaction on BSCScan after claiming'
              )}
            </li>
          </ul>
        </div>

        {/* Step-by-Step Process */}
        <div className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            📋{' '}
            {t(
              'docs.claiming_winnings.process.title',
              'How to Claim Your Winnings'
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
                    'docs.claiming_winnings.process.step1.title',
                    'Wait for Market Resolution'
                  )}
                </h3>
                <p className="text-sm text-gray-300">
                  {t(
                    'docs.claiming_winnings.process.step1.description',
                    'Once the prediction market expires, our AI system automatically determines the outcome.'
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
                    'docs.claiming_winnings.process.step2.title',
                    'Check Your Winning Bets'
                  )}
                </h3>
                <p className="text-sm text-gray-300">
                  {t(
                    'docs.claiming_winnings.process.step2.description',
                    'Navigate to "My Bets" to see which of your predictions were correct.'
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
                    'docs.claiming_winnings.process.step3.title',
                    'Click "Claim Winnings"'
                  )}
                </h3>
                <p className="text-sm text-gray-300">
                  {t(
                    'docs.claiming_winnings.process.step3.description',
                    'Click the claim button next to your winning prediction to initiate the payout.'
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
                    'docs.claiming_winnings.process.step4.title',
                    'Confirm Transaction'
                  )}
                </h3>
                <p className="text-sm text-gray-300">
                  {t(
                    'docs.claiming_winnings.process.step4.description',
                    'Confirm the transaction in your wallet to receive your winnings in BNB.'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="rounded-lg border border-yellow-600/30 bg-yellow-600/10 p-6">
          <div className="flex items-start">
            <span className="mr-3 mt-1 text-yellow-400">⚠️</span>
            <div>
              <h3 className="mb-2 font-semibold text-yellow-300">
                {t('docs.claiming_winnings.notes.title', 'Important Notes')}
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start">
                  <span className="mr-2 mt-1 text-yellow-400">•</span>
                  {t(
                    'docs.claiming_winnings.notes.gas_fees',
                    'You will need to pay gas fees for the claim transaction'
                  )}
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1 text-yellow-400">•</span>
                  {t(
                    'docs.claiming_winnings.notes.cooldown_period',
                    'There is a 30-second cooldown between claims to prevent duplicate transactions'
                  )}
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1 text-yellow-400">•</span>
                  {t(
                    'docs.claiming_winnings.notes.platform_fee',
                    'A 1.5% platform fee is automatically deducted from all winnings'
                  )}
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1 text-yellow-400">•</span>
                  {t(
                    'docs.claiming_winnings.notes.transaction_history',
                    'All transactions are recorded on-chain and can be viewed on BSCScan'
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Example Calculation */}
        <div className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            🧮{' '}
            {t('docs.claiming_winnings.example.title', 'Example Calculation')}
          </h2>
          <div className="rounded-lg border border-gray-700 p-4">
            <p className="mb-2 text-sm text-gray-300">
              {t(
                'docs.claiming_winnings.example.scenario',
                'If you bet on "YES" with 10 shares and "YES" wins:'
              )}
            </p>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>
                •{' '}
                {t(
                  'docs.claiming_winnings.example.total_pool',
                  'Total Pool: 1,000 BNB'
                )}
              </li>
              <li>
                •{' '}
                {t(
                  'docs.claiming_winnings.example.your_shares',
                  'Your Shares: 10'
                )}
              </li>
              <li>
                •{' '}
                {t(
                  'docs.claiming_winnings.example.total_winning',
                  'Total Winning Shares: 500'
                )}
              </li>
              <li>
                •{' '}
                {t(
                  'docs.claiming_winnings.example.gross_winnings',
                  'Gross Winnings: (10 ÷ 500) × 1,000 = 20 BNB'
                )}
              </li>
              <li>
                •{' '}
                {t(
                  'docs.claiming_winnings.example.platform_fee',
                  'Platform Fee (1.5%): 0.3 BNB'
                )}
              </li>
              <li>
                •{' '}
                <span className="font-semibold text-green-400">
                  {t(
                    'docs.claiming_winnings.example.net_winnings',
                    'Net Winnings: 19.7 BNB'
                  )}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
