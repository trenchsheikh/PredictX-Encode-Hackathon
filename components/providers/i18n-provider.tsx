'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import '@/lib/i18n';

type Locale = 'zh' | 'en';

interface I18nContextType {
  locale: Locale;
  t: (key: string, options?: Record<string, unknown>) => string;
  setLocale: (locale: Locale) => void;
  isInitialized: boolean;
}

const I18nContext = createContext<I18nContextType>({
  locale: 'zh',
  t: (key: string) => key,
  setLocale: () => {},
  isInitialized: false,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const { i18n, t } = useTranslation('common');
  const [locale, setLocaleState] = useState<Locale>('zh');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const savedLocale = localStorage.getItem('darkbet-locale') as Locale;
    const initialLocale = savedLocale || 'zh';

    // Set the state first
    setLocaleState(initialLocale);

    // Then change the i18n language
    i18n.changeLanguage(initialLocale).then(() => {
      setIsInitialized(true);
    });
  }, [i18n]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    i18n.changeLanguage(newLocale);
    localStorage.setItem('darkbet-locale', newLocale);
  };

  const value = {
    locale,
    t,
    setLocale,
    isInitialized,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
