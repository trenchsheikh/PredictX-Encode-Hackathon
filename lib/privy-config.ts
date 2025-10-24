// Privy configuration for Solana
export const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID || '';

// Validate Privy App ID
export const isValidPrivyAppId = (appId: string): boolean => {
  return Boolean(appId && appId.length > 0 && appId !== 'undefined');
};

// Get Solana cluster configuration
export const getSolanaCluster = (): 'mainnet-beta' | 'devnet' | 'testnet' => {
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';
  return network as 'mainnet-beta' | 'devnet' | 'testnet';
};

// Get Solana RPC URL
export const getSolanaRpcUrl = (): string => {
  return process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com';
};

// Log configuration for debugging (only in development)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line no-console
  console.log('🔗 Privy Configuration (Solana):', {
    cluster: getSolanaCluster(),
    rpcUrl: getSolanaRpcUrl(),
    appId: PRIVY_APP_ID ? '✓ Set' : '✗ Missing',
  });
}

// Privy will be configured directly in the PrivyProvider component
// to use Solana chain with Phantom, Solflare, and other Solana wallets
