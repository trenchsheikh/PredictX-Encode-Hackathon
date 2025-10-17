'use client';

import { useTranslation } from 'react-i18next';
import '@/lib/i18n';
import { KeyRound, Shield, Lock, AlertTriangle, Eye } from 'lucide-react';

export default function SecurityPage() {
  const { t } = useTranslation();

  return (
    <div className="prose prose-invert max-w-none">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold text-white">
          {t('docs.security.title', 'Security & Transparency')}
        </h1>
        <p className="text-lg leading-relaxed text-gray-300">
          {t(
            'docs.security.description',
            'Security measures and transparency features of the DarkBet platform.'
          )}
        </p>
      </div>

      <div className="space-y-8">
        {/* Blockchain Security */}
        <div className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            <KeyRound
              className="mr-2 inline h-5 w-5 align-text-bottom text-yellow-400"
              aria-hidden
            />{' '}
            {t('docs.security.blockchain.title', 'Blockchain Security')}
          </h2>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start">
              <span className="mr-3 mt-1 text-green-400">•</span>
              {t(
                'docs.security.blockchain.all_transactions',
                'All transactions on BNB Smart Chain'
              )}
            </li>
            <li className="flex items-start">
              <span className="mr-3 mt-1 text-green-400">•</span>
              {t(
                'docs.security.blockchain.verifiable',
                'Verifiable on BSCScan'
              )}
            </li>
            <li className="flex items-start">
              <span className="mr-3 mt-1 text-green-400">•</span>
              {t(
                'docs.security.blockchain.multi_wallet',
                'Multi-wallet support via Privy'
              )}
            </li>
            <li className="flex items-start">
              <span className="mr-3 mt-1 text-green-400">•</span>
              {t(
                'docs.security.blockchain.network_switching',
                'Automatic network switching'
              )}
            </li>
          </ul>
        </div>

        {/* Smart Protections */}
        <div className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            <Shield
              className="mr-2 inline h-5 w-5 align-text-bottom text-yellow-400"
              aria-hidden
            />{' '}
            {t('docs.security.smart_protections.title', 'Smart Protections')}
          </h2>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start">
              <span className="mr-3 mt-1 text-blue-400">•</span>
              {t(
                'docs.security.smart_protections.server_calculations',
                'Server-side price calculations'
              )}
            </li>
            <li className="flex items-start">
              <span className="mr-3 mt-1 text-blue-400">•</span>
              {t(
                'docs.security.smart_protections.zero_trust',
                'Zero client trust model'
              )}
            </li>
            <li className="flex items-start">
              <span className="mr-3 mt-1 text-blue-400">•</span>
              {t(
                'docs.security.smart_protections.rate_limiting',
                'Rate limiting on claims'
              )}
            </li>
            <li className="flex items-start">
              <span className="mr-3 mt-1 text-blue-400">•</span>
              {t(
                'docs.security.smart_protections.rollback',
                'Database rollback support'
              )}
            </li>
          </ul>
        </div>

        {/* Dark Pool Privacy */}
        <div className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            <Lock
              className="mr-2 inline h-5 w-5 align-text-bottom text-yellow-400"
              aria-hidden
            />{' '}
            {t('docs.security.dark_pool.title', 'Dark Pool Privacy')}
          </h2>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start">
              <span className="mr-3 mt-1 text-purple-400">•</span>
              {t(
                'docs.security.dark_pool.hidden_bets',
                'Your betting strategy remains completely hidden until market resolution'
              )}
            </li>
            <li className="flex items-start">
              <span className="mr-3 mt-1 text-purple-400">•</span>
              {t(
                'docs.security.dark_pool.no_manipulation',
                'Prevents market manipulation and copy trading'
              )}
            </li>
            <li className="flex items-start">
              <span className="mr-3 mt-1 text-purple-400">•</span>
              {t(
                'docs.security.dark_pool.fair_competition',
                'Ensures fair competition for all participants'
              )}
            </li>
            <li className="flex items-start">
              <span className="mr-3 mt-1 text-purple-400">•</span>
              {t(
                'docs.security.dark_pool.encrypted_data',
                'All betting data is encrypted and stored securely'
              )}
            </li>
          </ul>
        </div>

        {/* Important Security Note */}
        <div className="rounded-lg border border-red-600/30 bg-red-600/10 p-6">
          <div className="flex items-start">
            <AlertTriangle
              className="mr-3 mt-1 h-4 w-4 flex-shrink-0 text-red-400"
              aria-hidden
            />
            <div>
              <h3 className="mb-2 font-semibold text-red-300">
                {t('docs.security.note.title', 'Security Note')}
              </h3>
              <p className="text-sm text-gray-300">
                {t(
                  'docs.security.note.description',
                  'All API keys and sensitive data are masked - We never expose internal credentials, vault wallet addresses, or verification source endpoints to protect platform integrity.'
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Transparency Features */}
        <div className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            <Eye
              className="mr-2 inline h-5 w-5 align-text-bottom text-yellow-400"
              aria-hidden
            />{' '}
            {t('docs.security.transparency.title', 'Transparency Features')}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-gray-700 p-4">
              <h3 className="mb-2 font-semibold text-white">
                {t(
                  'docs.security.transparency.on_chain.title',
                  'On-Chain Verification'
                )}
              </h3>
              <p className="text-sm text-gray-300">
                {t(
                  'docs.security.transparency.on_chain.description',
                  'All transactions and outcomes are recorded on BNB Smart Chain and can be verified on BSCScan.'
                )}
              </p>
            </div>
            <div className="rounded-lg border border-gray-700 p-4">
              <h3 className="mb-2 font-semibold text-white">
                {t(
                  'docs.security.transparency.open_source.title',
                  'Open Source Components'
                )}
              </h3>
              <p className="text-sm text-gray-300">
                {t(
                  'docs.security.transparency.open_source.description',
                  'Key components of the platform are open source, allowing for community verification and auditing.'
                )}
              </p>
            </div>
            <div className="rounded-lg border border-gray-700 p-4">
              <h3 className="mb-2 font-semibold text-white">
                {t(
                  'docs.security.transparency.audit_reports.title',
                  'Regular Audits'
                )}
              </h3>
              <p className="text-sm text-gray-300">
                {t(
                  'docs.security.transparency.audit_reports.description',
                  'Smart contracts undergo regular security audits by third-party firms.'
                )}
              </p>
            </div>
            <div className="rounded-lg border border-gray-700 p-4">
              <h3 className="mb-2 font-semibold text-white">
                {t(
                  'docs.security.transparency.community.title',
                  'Community Oversight'
                )}
              </h3>
              <p className="text-sm text-gray-300">
                {t(
                  'docs.security.transparency.community.description',
                  'Community members can report security issues and participate in platform governance.'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
