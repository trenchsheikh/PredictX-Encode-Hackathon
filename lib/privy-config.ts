import { PrivyClientConfig } from '@privy-io/react-auth';

// Export separate APP ID and client config for the real Privy Provider
export const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID || '';

export const privyClientConfig: PrivyClientConfig = {
  appearance: {
    theme: 'light',
    accentColor: '#F0B90B',
  },
  loginMethods: ['wallet', 'email', 'sms', 'google', 'twitter', 'discord'],
  embeddedWallets: {
    createOnLogin: 'users-without-wallets',
  },
};