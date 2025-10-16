'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  delay?: number;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  className,
  delay = 0,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-gray-700/50 bg-gradient-to-br from-gray-900/60 to-gray-800/40 p-6 backdrop-blur-sm',
        'transition-all duration-300 hover:border-yellow-500/30 hover:shadow-lg hover:shadow-yellow-500/10',
        className
      )}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-transparent" />
      </div>

      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-between">
          <div className="rounded-lg bg-yellow-500/10 p-2">
            <Icon className="h-5 w-5 text-yellow-400" />
          </div>
          {trend && (
            <div
              className={cn(
                'flex items-center space-x-1 rounded-full px-2 py-1 text-sm font-medium',
                trend.isPositive
                  ? 'bg-green-500/10 text-green-400'
                  : 'bg-red-500/10 text-red-400'
              )}
            >
              <span>
                {trend.isPositive ? '+' : ''}
                {trend.value}%
              </span>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <h3 className="text-2xl font-bold text-white">{value}</h3>
          <p className="text-sm text-gray-400">{title}</p>
        </div>
      </div>
    </div>
  );
}
