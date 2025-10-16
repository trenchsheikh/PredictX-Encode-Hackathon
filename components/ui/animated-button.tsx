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
    'relative overflow-hidden rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500/20';

  const variants = {
    primary:
      'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700 shadow-lg hover:shadow-yellow-500/25',
    secondary:
      'bg-gradient-to-r from-gray-800 to-gray-700 text-white hover:from-gray-700 hover:to-gray-600 border border-gray-600',
    outline:
      'border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black',
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
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center space-x-2">
        {/* Loading indicator removed (no animation) */}
        {children}
      </div>
    </button>
  );
}
