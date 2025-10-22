'use client';
import React from 'react';

import { Press_Start_2P } from 'next/font/google';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { NotepadTextDashed } from 'lucide-react';

import { useI18n } from '@/components/providers/i18n-provider';
import { cn } from '@/lib/utils';

const pixelFont = Press_Start_2P({ subsets: ['latin'], weight: '400' });

interface FooterLink {
  label: string;
  href: string;
}

interface SocialLink {
  icon: React.ReactNode;
  href: string;
  label: string;
}

interface FooterProps {
  brandName?: string;
  brandDescription?: string;
  socialLinks?: SocialLink[];
  navLinks?: FooterLink[];
  creatorName?: string;
  creatorUrl?: string;
  brandIcon?: React.ReactNode;
  brandLinkHref?: string;
  className?: string;
  showTopInfo?: boolean;
  showBackgroundBrandText?: boolean;
  showCopyright?: boolean;
}

export const Footer = ({
  brandName = 'DarkBet',
  brandDescription = '',
  socialLinks = [],
  navLinks = [],
  creatorName,
  creatorUrl,
  brandIcon,
  brandLinkHref,
  className,
  showTopInfo = false,
  showBackgroundBrandText = true,
  showCopyright = true,
}: FooterProps) => {
  const pathname = usePathname();
  const isDocs = pathname.startsWith('/docs');
  const { locale, t } = useI18n();
  return (
    <section className={cn('relative mt-0 w-full overflow-hidden', className)}>
      <footer className={cn('relative', isDocs ? 'mt-0' : 'mt-8')}>
        <div className="relative mx-auto flex min-h-[18rem] max-w-7xl flex-col justify-between p-4 py-8 sm:min-h-[22rem] md:min-h-[26rem]">
          <div className="mb-12 flex w-full flex-col sm:mb-20 md:mb-0">
            <div className="flex w-full flex-col items-center">
              {showTopInfo && (brandName || brandDescription) && (
                <div className="flex flex-1 flex-col items-center space-y-2">
                  {brandName && (
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold tracking-tight text-foreground">
                        {brandName}
                      </span>
                    </div>
                  )}
                  {brandDescription && (
                    <p className="w-full max-w-sm px-4 text-center font-semibold text-muted-foreground sm:w-96 sm:px-0">
                      {brandDescription}
                    </p>
                  )}
                </div>
              )}

              {socialLinks.length > 0 && (
                <div className="mb-8 mt-3 flex gap-4">
                  {socialLinks.map((link, index) => (
                    <Link
                      key={index}
                      href={link.href}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="h-6 w-6 duration-300 hover:scale-110">
                        {link.icon}
                      </div>
                      <span className="sr-only">{link.label}</span>
                    </Link>
                  ))}
                </div>
              )}

              {navLinks.length > 0 && (
                <div className="flex max-w-full flex-wrap justify-center gap-4 px-4 text-sm font-medium text-muted-foreground">
                  {navLinks.map((link, index) => (
                    <Link
                      key={index}
                      className="duration-300 hover:font-semibold hover:text-foreground"
                      href={link.href}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 right-6 z-50 flex items-center gap-6">
          <Link
            href={
              locale === 'en'
                ? 'https://docs.darkbet.fun/en'
                : 'https://docs.darkbet.fun/zh'
            }
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-400 transition-colors duration-200 hover:text-gray-300"
          >
            Documentation
          </Link>

          <Link
            href="https://x.com/DarkbetBNB"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-400 transition-colors duration-200 hover:text-gray-300"
          >
            Twitter
          </Link>
        </div>

        {showBackgroundBrandText && brandName && (
          <div
            className={cn(
              'pointer-events-none absolute bottom-36 left-1/2 -translate-x-1/2 select-none bg-white/30 bg-clip-text px-4 text-center font-extrabold leading-none tracking-tighter text-transparent md:bottom-28',
              pixelFont.className
            )}
            style={{
              fontSize: 'clamp(3rem, 12vw, 10rem)',
              maxWidth: '95vw',
            }}
          >
            {brandName.toUpperCase()}
          </div>
        )}

        {brandLinkHref ? (
          <Link
            href={brandLinkHref}
            target="_blank"
            rel="noopener noreferrer"
            className="duration-400 absolute bottom-24 left-1/2 z-10 flex -translate-x-1/2 items-center justify-center rounded-3xl border-2 border-white/60 bg-black/30 p-3 shadow-[0_0_24px_0_rgba(255,255,255,0.22)] backdrop-blur-sm hover:border-white/80 md:bottom-20"
          >
            {brandIcon || (
              <NotepadTextDashed className="h-10 w-10 text-white drop-shadow-lg sm:h-12 sm:w-12 md:h-16 md:w-16" />
            )}
          </Link>
        ) : (
          <div className="duration-400 absolute bottom-24 left-1/2 z-10 flex -translate-x-1/2 items-center justify-center rounded-3xl border-2 border-white/60 bg-black/30 p-3 shadow-[0_0_24px_0_rgba(255,255,255,0.22)] backdrop-blur-sm hover:border-white/80 md:bottom-20">
            {brandIcon || (
              <NotepadTextDashed className="h-10 w-10 text-white drop-shadow-lg sm:h-12 sm:w-12 md:h-16 md:w-16" />
            )}
          </div>
        )}

        {!isDocs && (
          <div
            className={cn(
              'sm:bottom-34 absolute bottom-32 left-1/2 h-px w-full -translate-x-1/2 bg-transparent backdrop-blur-[1px]',
              'via-white/25'
            )}
          ></div>
        )}

        {isDocs ? (
          <div
            className="pointer-events-none fixed inset-x-0 bottom-0 z-[1] h-[60vh] sm:h-[56vh] md:h-[52vh]"
            style={{
              backgroundImage:
                'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.06) 22%, rgba(0,0,0,0.18) 42%, rgba(0,0,0,0.34) 62%, rgba(0,0,0,0.9) 100%)',
            }}
          ></div>
        ) : (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[24vh] sm:h-[26vh] md:h-[28vh]"
            style={{
              backgroundImage:
                'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.28) 38%, rgba(0,0,0,0.92) 100%)',
            }}
          ></div>
        )}
      </footer>
    </section>
  );
};
