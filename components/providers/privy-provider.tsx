'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana';

import {
  PRIVY_APP_ID,
  isValidPrivyAppId,
  getSolanaRpcUrl,
} from '@/lib/privy-config';

import { I18nProvider } from './i18n-provider';

export function PrivyProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isValidPrivyAppId(PRIVY_APP_ID)) {
    console.warn(
      'Privy App ID is missing or invalid. Rendering without authentication.'
    );
    return <I18nProvider>{children}</I18nProvider>;
  }

  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#14F195', // Solana green
          logo: '/binanceeye.jpg',
        },
        loginMethods: ['wallet', 'email', 'google', 'twitter', 'discord'],
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
        // Solana wallet configuration
        externalWallets: {
          solana: {
            connectors: toSolanaWalletConnectors(),
          },
        },
      }}
    >
      <I18nProvider>{children}</I18nProvider>
    </PrivyProvider>
  );
}
