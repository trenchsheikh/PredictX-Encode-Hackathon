'use client';

import React from 'react';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

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
        {loading && (
          <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </div>
    </button>
  );
}
