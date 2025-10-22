'use client';

import React from 'react';
import type { ReactNode } from 'react';

import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  return <div className="w-full">{children}</div>;
}
