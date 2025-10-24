'use client';

import React from 'react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

import TetrisLoading from './tetris-loader';

interface AnimatedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export function AnimatedButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className,
  type = 'button',
  ...props
}: AnimatedButtonProps) {
  const baseClasses =
    'relative overflow-hidden rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/20';

  const variants = {
    primary:
      'bg-white text-black hover:bg-white/90 shadow-lg hover:shadow-white/25',
    secondary:
      'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border',
    outline: 'border-2 border-white text-white hover:bg-white hover:text-black',
    ghost: 'text-gray-400 hover:text-white hover:bg-gray-800/50',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
      {...props}
    >
      {/* Static background */}
      <div className="absolute inset-0 bg-white/5 opacity-0 transition-opacity group-hover:opacity-100" />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center space-x-2">
        {loading ? (
          <div className="flex items-center justify-center">
            <TetrisLoading size="sm" speed="fast" showLoadingText={false} />
          </div>
        ) : (
          children
        )}
      </div>
    </button>
  );
}
