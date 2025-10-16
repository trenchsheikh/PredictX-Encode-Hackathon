'use client';

import { cn } from '@/lib/utils';

interface ShimmeringTextProps {
  children: React.ReactNode;
  className?: string;
  shimmerColor?: string;
  duration?: number;
  delay?: number;
}

export function ShimmeringText({
  children,
  className,
  shimmerColor = '#F0B90B',
  duration = 2000,
  delay = 0,
}: ShimmeringTextProps) {
  return (
    <span
      className={cn(
        'relative inline-block bg-gradient-to-r from-transparent via-current to-transparent bg-clip-text text-transparent',
        className
      )}
      style={{
        backgroundImage: `linear-gradient(90deg, transparent, ${shimmerColor}, transparent)`,
      }}
    >
      {children}
    </span>
  );
}
