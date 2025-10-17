'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import '@/lib/i18n';
import {
  Hand,
  Eye,
  HelpCircle,
  Wallet,
  FileText,
  BarChart3,
  Bot,
  Trophy,
  Shield,
  PieChart,
  Rocket,
  TrendingUp,
  Award,
  Globe,
  ExternalLink,
  MessageSquareText,
} from 'lucide-react';

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
      {
        href: '/docs',
        label: t('nav.docs.overview'),
        icon: <Hand className="h-4 w-4" aria-hidden />,
      },
      {
        href: '/docs/vision',
        label: t('nav.docs.vision'),
        icon: <Eye className="h-4 w-4" aria-hidden />,
      },
    ],
  },
  {
    title: t('nav.docs.getting_started'),
    items: [
      {
        href: '/docs/why-choose-darkbet',
        label: t('nav.docs.why_choose_darkbet'),
        icon: <HelpCircle className="h-4 w-4" aria-hidden />,
      },
    ],
  },
  {
    title: t('nav.docs.how_it_works'),
    items: [
      {
        href: '/docs/connect-wallet',
        label: t('nav.docs.connect_wallet'),
        icon: <Wallet className="h-4 w-4" aria-hidden />,
      },
      {
        href: '/docs/creating-predictions',
        label: t('nav.docs.creating_predictions'),
        icon: <FileText className="h-4 w-4" aria-hidden />,
      },
      {
        href: '/docs/dynamic-pricing',
        label: t('nav.docs.dynamic_pricing'),
        icon: <BarChart3 className="h-4 w-4" aria-hidden />,
      },
      {
        href: '/docs/ai-resolution',
        label: t('nav.docs.ai_resolution'),
        icon: <Bot className="h-4 w-4" aria-hidden />,
      },
      {
        href: '/docs/claiming-winnings',
        label: t('nav.docs.claiming_winnings'),
        icon: <Trophy className="h-4 w-4" aria-hidden />,
      },
      {
        href: '/docs/security',
        label: t('nav.docs.security'),
        icon: <Shield className="h-4 w-4" aria-hidden />,
      },
    ],
  },
  {
    title: t('nav.docs.tokenomics'),
    items: [
      {
        href: '/docs/tokenomics',
        label: t('nav.docs.tokenomics_page'),
        icon: <PieChart className="h-4 w-4" aria-hidden />,
      },
    ],
  },
  {
    title: t('nav.docs.roadmap'),
    items: [
      {
        href: '/docs/phase-1',
        label: t('nav.docs.phase_1'),
        icon: <Rocket className="h-4 w-4" aria-hidden />,
      },
      {
        href: '/docs/phase-2',
        label: t('nav.docs.phase_2'),
        icon: <TrendingUp className="h-4 w-4" aria-hidden />,
      },
      {
        href: '/docs/phase-3',
        label: t('nav.docs.phase_3'),
        icon: <Award className="h-4 w-4" aria-hidden />,
      },
      {
        href: '/docs/phase-4',
        label: t('nav.docs.phase_4'),
        icon: <Globe className="h-4 w-4" aria-hidden />,
      },
    ],
  },
  {
    title: t('nav.docs.official_links'),
    items: [
      {
        href: 'https://twitter.com/darkbetbnb',
        label: t('nav.docs.twitter'),
        icon: <ExternalLink className="h-4 w-4" aria-hidden />,
      },
    ],
  },
  {
    title: '',
    items: [
      {
        href: '/docs/final-words',
        label: t('nav.docs.final_words'),
        icon: <MessageSquareText className="h-4 w-4" aria-hidden />,
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
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-gray-100">
      {/* Main content container */}
      <div className="mx-auto max-w-7xl">
        {/* Use grid on large screens so the sidebar grows to fill the gap up to the content */}
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_minmax(0,56rem)]">
          {/* Mobile navigation - shown on top */}
          <nav className="w-full px-4 py-6 lg:hidden">
            <div className="rounded-lg border border-white/10 bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 p-4 backdrop-blur-sm">
              <div className="space-y-6">
                {getNavigationSections(t).map((section, sectionIndex) => (
                  <div key={sectionIndex} className="space-y-2">
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
                              'flex items-center rounded-md px-3 py-2 text-[0.95rem] font-medium leading-[1.05]',
                              'transition-colors duration-200 hover:bg-gray-700 hover:text-white',
                              pathname === item.href
                                ? 'border border-yellow-400/30 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 text-yellow-400'
                                : 'text-gray-300 hover:bg-white/5'
                            )}
                          >
                            {item.icon && (
                              <span className="mr-2 text-lg">{item.icon}</span>
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
          <aside className="hidden lg:block">
            <div className="sticky top-24 ml-4 mt-8 pr-6">
              <div className="rounded-lg border border-gray-700/30 bg-gray-800/90 backdrop-blur-sm">
                <nav className="space-y-8 p-6">
                  {getNavigationSections(t).map((section, sectionIndex) => (
                    <div key={sectionIndex} className="space-y-3">
                      {section.title && (
                        <h3 className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                          {section.title}
                        </h3>
                      )}
                      <ul className="space-y-1">
                        {section.items.map((item, itemIndex) => (
                          <li key={itemIndex}>
                            <Link
                              href={item.href}
                              className={cn(
                                'flex items-center rounded-md px-3 py-2 text-[0.95rem] font-medium leading-[1.05]',
                                'transition-colors duration-200 hover:bg-gray-700 hover:text-white',
                                pathname === item.href
                                  ? 'bg-orange-600 text-white'
                                  : 'text-gray-300'
                              )}
                            >
                              {item.icon && (
                                <span className="mr-2 text-lg">
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
            <div className="px-6 pb-8 pt-14">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
