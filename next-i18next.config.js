module.exports = {
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en'],
    localeDetection: false,
  },
  fallbackLng: {
    default: ['zh'],
  },
  debug: false,
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
};
