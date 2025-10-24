'use client';

import { useI18n } from '@/components/providers/i18n-provider';
import { useClientOnly } from './use-client-only';

export function useSSRSafeI18n(fallbackValues: Record<string, string> = {}) {
  const { t, isInitialized } = useI18n();
  const isClient = useClientOnly();

  const ssrSafeT = (key: string, options?: any): string => {
    if (isClient && isInitialized) {
      return t(key, options);
    }

    return fallbackValues[key] || key;
  };

  return {
    t: ssrSafeT,
    isClient,
    isInitialized,
  };
}
