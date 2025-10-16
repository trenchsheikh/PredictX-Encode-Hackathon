import { PrivyClientConfig } from '@privy-io/react-auth';
import { bsc, bscTestnet } from 'viem/chains';

// Export separate APP ID and client config for the real Privy Provider
export const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID || '';

// Determine which network to use based on environment
const isMainnet = process.env.NEXT_PUBLIC_CHAIN_ID === '56';
const defaultChain = isMainnet ? bsc : bscTestnet;
const supportedChains = [bsc, bscTestnet]; // Support both networks

// Log configuration for debugging
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('🔗 Privy Configuration:', {
    chainId: process.env.NEXT_PUBLIC_CHAIN_ID,
    isMainnet,
    defaultChain: defaultChain.name,
    supportedChains: supportedChains.map(chain => chain.name),
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
