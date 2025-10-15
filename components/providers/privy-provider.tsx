'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { PRIVY_APP_ID, privyClientConfig } from '@/lib/privy-config';
import { I18nProvider } from './i18n-provider';

export function PrivyProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivyProvider appId={PRIVY_APP_ID} config={privyClientConfig}>
      <I18nProvider>{children}</I18nProvider>
    </PrivyProvider>
  );
}
