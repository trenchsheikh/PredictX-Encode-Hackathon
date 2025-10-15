'use client';

import { useTranslation } from 'react-i18next';
import '@/lib/i18n';

export default function ConnectWalletPage() {
  const { t } = useTranslation();

  return (
    <div className="prose prose-invert max-w-none">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold text-white">
          {t('docs.connect_wallet.title', 'Connect Wallet')}
        </h1>
        <p className="mb-6 text-lg leading-relaxed text-gray-300">
          {t(
            'docs.connect_wallet.description',
            "Before you start predicting, you'll need to set up your account. Here's how to sign up and connect your wallet to DarkBet securely."
          )}
        </p>
      </div>

      <div className="space-y-8">
        <div className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            {t(
              'docs.connect_wallet.supported_wallets.title',
              'Supported Wallets'
            )}
          </h2>
          <p className="mb-4 text-gray-300">
            {t(
              'docs.connect_wallet.supported_wallets.description',
              'DarkBet supports a wide range of popular cryptocurrency wallets through our integration with Privy.'
            )}
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-gray-700 p-4 text-center">
              <div className="mb-2 text-3xl">🦊</div>
              <h3 className="font-semibold text-white">MetaMask</h3>
              <p className="text-sm text-gray-400">Browser Extension</p>
            </div>
            <div className="rounded-lg bg-gray-700 p-4 text-center">
              <div className="mb-2 text-3xl">🔗</div>
              <h3 className="font-semibold text-white">WalletConnect</h3>
              <p className="text-sm text-gray-400">Mobile Wallets</p>
            </div>
            <div className="rounded-lg bg-gray-700 p-4 text-center">
              <div className="mb-2 text-3xl">📱</div>
              <h3 className="font-semibold text-white">Coinbase Wallet</h3>
              <p className="text-sm text-gray-400">Mobile & Extension</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            {t('docs.connect_wallet.steps.title', 'How to Connect')}
          </h2>

          <div className="space-y-6">
            <div className="flex items-start">
              <span className="mr-4 mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-orange-600 text-sm font-bold text-white">
                1
              </span>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t(
                    'docs.connect_wallet.steps.step1.title',
                    'Click Connect Wallet'
                  )}
                </h3>
                <p className="text-gray-300">
                  {t(
                    'docs.connect_wallet.steps.step1.description',
                    'Click the "Connect Wallet" button in the top navigation bar of the DarkBet platform.'
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <span className="mr-4 mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-orange-600 text-sm font-bold text-white">
                2
              </span>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t(
                    'docs.connect_wallet.steps.step2.title',
                    'Select Your Wallet'
                  )}
                </h3>
                <p className="text-gray-300">
                  {t(
                    'docs.connect_wallet.steps.step2.description',
                    "Choose your preferred wallet from the list of supported options. If you're using MetaMask, it will automatically connect. For mobile wallets, scan the QR code with WalletConnect."
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <span className="mr-4 mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-orange-600 text-sm font-bold text-white">
                3
              </span>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t(
                    'docs.connect_wallet.steps.step3.title',
                    'Approve Connection'
                  )}
                </h3>
                <p className="text-gray-300">
                  {t(
                    'docs.connect_wallet.steps.step3.description',
                    'Approve the connection request in your wallet. This allows DarkBet to interact with your wallet for transactions and balance checking.'
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <span className="mr-4 mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-orange-600 text-sm font-bold text-white">
                4
              </span>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t('docs.connect_wallet.steps.step4.title', 'Start Betting')}
                </h3>
                <p className="text-gray-300">
                  {t(
                    'docs.connect_wallet.steps.step4.description',
                    'Once connected, you can start creating predictions, placing bets, and participating in DarkBet markets!'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-yellow-600/30 bg-yellow-600/20 p-6">
          <h2 className="mb-4 text-2xl font-semibold text-yellow-300">
            {t('docs.connect_wallet.important.title', 'Important Notes')}
          </h2>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-yellow-400">⚠️</span>
              {t(
                'docs.connect_wallet.important.note1',
                "Make sure you're connected to the BNB Smart Chain network in your wallet."
              )}
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-yellow-400">⚠️</span>
              {t(
                'docs.connect_wallet.important.note2',
                'Keep some BNB in your wallet for transaction fees.'
              )}
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-yellow-400">⚠️</span>
              {t(
                'docs.connect_wallet.important.note3',
                'Never share your private keys or seed phrases with anyone.'
              )}
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-yellow-400">⚠️</span>
              {t(
                'docs.connect_wallet.important.note4',
                'DarkBet will never ask for your private keys or seed phrases.'
              )}
            </li>
          </ul>
        </div>

        <div className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            {t('docs.connect_wallet.troubleshooting.title', 'Troubleshooting')}
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="mb-2 font-semibold text-white">
                {t(
                  'docs.connect_wallet.troubleshooting.network.title',
                  'Wrong Network'
                )}
              </h3>
              <p className="text-sm text-gray-300">
                {t(
                  'docs.connect_wallet.troubleshooting.network.description',
                  'If you see a network error, make sure your wallet is connected to BNB Smart Chain (BSC). You can add BSC to your wallet using Chain ID: 56.'
                )}
              </p>
            </div>

            <div>
              <h3 className="mb-2 font-semibold text-white">
                {t(
                  'docs.connect_wallet.troubleshooting.transaction.title',
                  'Transaction Failed'
                )}
              </h3>
              <p className="text-sm text-gray-300">
                {t(
                  'docs.connect_wallet.troubleshooting.transaction.description',
                  'Ensure you have enough BNB for gas fees. Try increasing the gas limit if transactions are failing.'
                )}
              </p>
            </div>

            <div>
              <h3 className="mb-2 font-semibold text-white">
                {t(
                  'docs.connect_wallet.troubleshooting.connection.title',
                  'Connection Issues'
                )}
              </h3>
              <p className="text-sm text-gray-300">
                {t(
                  'docs.connect_wallet.troubleshooting.connection.description',
                  'Try refreshing the page and reconnecting your wallet. Clear your browser cache if problems persist.'
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-blue-600/30 bg-blue-600/20 p-6">
          <h2 className="mb-4 text-2xl font-semibold text-blue-300">
            {t('docs.connect_wallet.security.title', 'Security & Privacy')}
          </h2>
          <p className="mb-4 text-gray-300">
            {t(
              'docs.connect_wallet.security.description',
              'DarkBet integrates Privy, a trusted third-party authentication provider, to ensure the security and privacy of all users. Privy enables safe wallet connections, encrypted session management, and identity verification, helping protect the community from fraudulent activity while maintaining a seamless on-chain experience.'
            )}
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="mb-2 font-semibold text-white">
                {t(
                  'docs.connect_wallet.security.encrypted.title',
                  'Encrypted Sessions'
                )}
              </h3>
              <p className="text-sm text-gray-300">
                {t(
                  'docs.connect_wallet.security.encrypted.description',
                  'All wallet connections are encrypted and secure, protecting your private keys and session data.'
                )}
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-white">
                {t(
                  'docs.connect_wallet.security.verification.title',
                  'Identity Verification'
                )}
              </h3>
              <p className="text-sm text-gray-300">
                {t(
                  'docs.connect_wallet.security.verification.description',
                  'Advanced verification systems help protect against fraudulent activity and ensure community safety.'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
