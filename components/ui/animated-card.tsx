'use client';

import React from 'react';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
  onClick?: () => void;
}

export function AnimatedCard({
  children,
  className,
  hover = true,
  delay = 0,
  onClick,
}: AnimatedCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'relative overflow-hidden rounded-2xl border border-gray-700/50 bg-gray-900/50 shadow-2xl backdrop-blur-sm',
        'transition-all duration-300 hover:border-yellow-500/30 hover:shadow-yellow-500/20',
        className
      )}
    >
      {/* Subtle gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-yellow-500/5" />

      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* Static border glow removed */}
    </div>
  );
}
