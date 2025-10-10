'use client';

import { PrivyProvider } from '@/lib/mock-privy';
import { privyConfig } from '@/lib/privy-config';

export function PrivyProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={privyConfig.appId}
      config={privyConfig.config}
    >
      {children}
    </PrivyProvider>
  );
}