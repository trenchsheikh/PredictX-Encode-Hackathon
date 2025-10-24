'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { solana } from '@privy-io/react-auth/solana';

import {
  PRIVY_APP_ID,
  isValidPrivyAppId,
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
        loginMethods: ['email', 'google', 'twitter', 'discord', 'wallet'],
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
        // Configure for Solana only
        supportedChains: [solana],
        defaultChain: solana,
        // Wallet configuration - only Solana wallets
        walletConnectCloudProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
      }}
    >
      <I18nProvider>{children}</I18nProvider>
    </PrivyProvider>
  );
}
