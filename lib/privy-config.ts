import type { PrivyClientConfig } from '@privy-io/react-auth';
import { bsc, bscTestnet } from 'viem/chains';

// Export separate APP ID and client config for the real Privy Provider
export const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID || '';

// Validate Privy App ID
export const isValidPrivyAppId = (appId: string): boolean => {
  return Boolean(appId && appId.length > 0 && appId !== 'undefined');
};

// Only support BSC Mainnet
const defaultChain = bsc;
const supportedChains = [bsc]; // Only BSC Mainnet

// Log configuration for debugging (only in development)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('🔗 Privy Configuration (BSC Mainnet Only):', {
    defaultChain: defaultChain.name,
    supportedChains: supportedChains.map(chain => chain.name),
    chainIdNumber: defaultChain.id,
  });
}

export const privyClientConfig: PrivyClientConfig = {
  appearance: {
    theme: 'dark',
    accentColor: '#F0B90B',
  },
  loginMethods: ['wallet', 'email', 'sms', 'google', 'twitter', 'discord'],
  embeddedWallets: {
    ethereum: {
      createOnLogin: 'users-without-wallets',
    },
  },
  supportedChains,
  defaultChain,
};
