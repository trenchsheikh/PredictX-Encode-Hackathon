'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { PRIVY_APP_ID, privyClientConfig } from '@/lib/privy-config';

export function PrivyProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivyProvider appId={PRIVY_APP_ID} config={privyClientConfig}>
      {children}
    </PrivyProvider>
  );
}
