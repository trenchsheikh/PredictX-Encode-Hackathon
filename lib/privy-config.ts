import { PrivyClientConfig } from '@privy-io/react-auth';

// Privy configuration following the documentation
export const privyConfig: PrivyClientConfig = {
  appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID || '',
  config: {
    // Customize the appearance of the login modal
    appearance: {
      theme: 'light',
      accentColor: '#F0B90B',
    },
    // Configure which login methods to show
    loginMethods: ['wallet', 'email', 'sms', 'google', 'twitter', 'discord'],
    // Configure which wallets to show
    embeddedWallets: {
      createOnLogin: 'users-without-wallets',
    },
  },
};