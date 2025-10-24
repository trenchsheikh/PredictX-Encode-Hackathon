'use client';

import React from 'react';

import { usePathname } from 'next/navigation';

import { Footer } from '@/components/ui/footer';

type FooterGateProps = React.ComponentProps<typeof Footer>;

export function FooterGate(props: FooterGateProps) {
  const pathname = usePathname();
  const isDocs = pathname.startsWith('/docs');
  if (isDocs) return null;
  return <Footer {...props} />;
}
