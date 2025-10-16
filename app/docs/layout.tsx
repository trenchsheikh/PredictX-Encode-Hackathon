'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { AnimatedBackground } from '@/components/ui/animated-background';
import '@/lib/i18n';

interface DocsLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const getNavigationSections = (t: any): NavSection[] => [
  {
    title: '',
    items: [
      { href: '/docs', label: t('nav.docs.overview'), icon: '👋' },
      { href: '/docs/vision', label: t('nav.docs.vision'), icon: '👁️' },
    ],
  },
  {
    title: t('nav.docs.getting_started'),
    items: [
      {
        href: '/docs/why-choose-darkbet',
        label: t('nav.docs.why_choose_darkbet'),
        icon: '❓',
      },
    ],
  },
  {
    title: t('nav.docs.how_it_works'),
    items: [
      {
        href: '/docs/connect-wallet',
        label: t('nav.docs.connect_wallet'),
        icon: '👛',
      },
      {
        href: '/docs/creating-predictions',
        label: t('nav.docs.creating_predictions'),
        icon: '📅',
      },
      {
        href: '/docs/dynamic-pricing',
        label: t('nav.docs.dynamic_pricing'),
        icon: '💰',
      },
      {
        href: '/docs/ai-resolution',
        label: t('nav.docs.ai_resolution'),
        icon: '🧠',
      },
      {
        href: '/docs/claiming-winnings',
        label: t('nav.docs.claiming_winnings'),
        icon: '🏆',
      },
      { href: '/docs/security', label: t('nav.docs.security'), icon: '🛡️' },
    ],
  },
  {
    title: t('nav.docs.polybets'),
    items: [
      {
        href: '/docs/polybets',
        label: t('nav.docs.introducing_polybets'),
        icon: '🔥',
      },
    ],
  },
  {
    title: t('nav.docs.tokenomics'),
    items: [
      {
        href: '/docs/tokenomics',
        label: t('nav.docs.tokenomics_page'),
        icon: '📊',
      },
    ],
  },
  {
    title: t('nav.docs.roadmap'),
    items: [
      {
        href: '/docs/phase-1',
        label: t('nav.docs.phase_1'),
        icon: '🚀',
      },
      {
        href: '/docs/phase-2',
        label: t('nav.docs.phase_2'),
        icon: '📈',
      },
      {
        href: '/docs/phase-3',
        label: t('nav.docs.phase_3'),
        icon: '🏆',
      },
      {
        href: '/docs/phase-4',
        label: t('nav.docs.phase_4'),
        icon: '🌍',
      },
    ],
  },
  {
    title: t('nav.docs.official_links'),
    items: [
      {
        href: 'https://twitter.com/darkbetbnb',
        label: t('nav.docs.twitter'),
        icon: '↗️',
      },
    ],
  },
  {
    title: '',
    items: [
      {
        href: '/docs/final-words',
        label: t('nav.docs.final_words'),
        icon: '💬',
      },
    ],
  },
];

export default function DocsLayout({ children }: DocsLayoutProps) {
  const { i18n, t } = useTranslation();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Sync with main app's language setting
    const savedLocale = localStorage.getItem('darkbet-locale');
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'zh')) {
      i18n.changeLanguage(savedLocale);
    }
  }, [i18n]);

  return (
    <div className="relative min-h-screen bg-black text-gray-100">
      {/* Animated Background */}
      <AnimatedBackground variant="gradient" />

      {/* Main content container */}
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row">
          {/* Mobile navigation - shown on top */}
          <nav className="w-full px-4 py-6 lg:hidden">
            <div className="rounded-lg border border-gray-700/30 bg-gray-800/90 p-4 backdrop-blur-sm">
              <div className="space-y-4">
                {getNavigationSections(t).map((section, sectionIndex) => (
                  <div key={sectionIndex}>
                    {section.title && (
                      <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        {section.title}
                      </h3>
                    )}
                    <ul className="space-y-1">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex}>
                          <Link
                            href={item.href}
                            className={cn(
                              'flex items-center rounded-md px-3 py-2 text-sm font-medium',
                              'hover:bg-gray-700 hover:text-white',
                              pathname === item.href
                                ? 'bg-orange-600 text-white'
                                : 'text-gray-300'
                            )}
                          >
                            {item.icon && (
                              <span className="mr-3 text-lg">{item.icon}</span>
                            )}
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </nav>

          {/* Desktop floating sidebar */}
          <aside className="hidden lg:block lg:w-64 lg:flex-shrink-0">
            <div className="sticky top-24 ml-4 mr-8 mt-8">
              <div className="rounded-lg border border-gray-700/30 bg-gray-800/90 backdrop-blur-sm">
                <nav className="space-y-6 p-4">
                  {getNavigationSections(t).map((section, sectionIndex) => (
                    <div key={sectionIndex}>
                      {section.title && (
                        <h3 className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                          {section.title}
                        </h3>
                      )}
                      <ul className="space-y-1">
                        {section.items.map((item, itemIndex) => (
                          <li key={itemIndex}>
                            <Link
                              href={item.href}
                              className={cn(
                                'flex items-center rounded-md px-3 py-2 text-sm font-medium',
                                'hover:bg-gray-700 hover:text-white',
                                pathname === item.href
                                  ? 'bg-orange-600 text-white'
                                  : 'text-gray-300'
                              )}
                            >
                              {item.icon && (
                                <span className="mr-3 text-lg">
                                  {item.icon}
                                </span>
                              )}
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </nav>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 lg:ml-0">
            <div className="mx-auto max-w-4xl px-6 py-8">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
