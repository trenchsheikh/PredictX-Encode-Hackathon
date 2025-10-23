'use client';

import React, { type CSSProperties } from 'react';

import { cn } from '@/lib/utils';

export interface ShimmerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children?: React.ReactNode;
}

const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      shimmerColor = '#ffffff',
      shimmerSize = '0.05em',
      shimmerDuration = '3s',
      borderRadius = '999px',
      background = 'linear-gradient(180deg, #ffb84d 0%, #cc6b00 100%)',
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        style={
          {
            '--spread': '90deg',
            '--shimmer-color': shimmerColor,
            '--radius': borderRadius,
            '--speed': shimmerDuration,
            '--cut': shimmerSize,
            '--bg': background,
          } as CSSProperties
        }
        className={cn(
          'group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border border-yellow-400/40 px-8 py-4 font-semibold tracking-wide text-white [background:var(--bg)] [border-radius:var(--radius)]',
          'transform-gpu shadow-lg shadow-yellow-500/25 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:shadow-yellow-500/40 active:translate-y-px',
          'before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent',
          className
        )}
        ref={ref}
        {...props}
      >
        {/* Shimmer effect overlay */}
        <span className="relative z-10">{children}</span>

        {/* Background layer */}
        <div
          className={cn(
            'absolute inset-0 -z-10 [background:var(--bg)] [border-radius:var(--radius)]'
          )}
        />
      </button>
    );
  }
);

ShimmerButton.displayName = 'ShimmerButton';

export default ShimmerButton;
