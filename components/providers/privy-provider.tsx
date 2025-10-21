'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import {
  PRIVY_APP_ID,
  privyClientConfig,
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
    <PrivyProvider appId={PRIVY_APP_ID} config={privyClientConfig}>
      <I18nProvider>{children}</I18nProvider>
    </PrivyProvider>
  );
}
