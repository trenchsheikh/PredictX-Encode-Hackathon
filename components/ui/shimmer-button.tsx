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
      background = 'linear-gradient(90deg, #FDE68A 0%, #F59E0B 100%)',
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
          'group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border border-yellow-400/40 px-6 py-3 text-black [background:var(--bg)] [border-radius:var(--radius)]',
          'transform-gpu shadow-[0_0_0_1px_rgba(234,179,8,0.3),0_8px_24px_rgba(234,179,8,0.15)] transition-transform duration-300 ease-in-out active:translate-y-px',
          className
        )}
        ref={ref}
        {...props}
      >
        {/* Minimal decorative layers to avoid content clipping */}
        {children}
        <div
          className={cn(
            'absolute inset-0 size-full',
            'rounded-full px-4 py-1.5 text-sm font-semibold',
            'transform-gpu transition-all duration-300 ease-in-out',
            'group-hover:opacity-90',
            'group-active:opacity-80'
          )}
        />
        <div
          className={cn(
            'absolute -z-20 [background:var(--bg)] [border-radius:var(--radius)] [inset:var(--cut)]'
          )}
        />
      </button>
    );
  }
);

ShimmerButton.displayName = 'ShimmerButton';

export default ShimmerButton;
