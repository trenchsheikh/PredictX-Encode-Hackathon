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
        'relative overflow-hidden border border-white/20 bg-card p-6',
        className
      )}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-white/10" />
      </div>

      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-between">
          <div className="p-2">
            <Icon className="h-5 w-5 text-white" />
          </div>
          {trend && (
            <div
              className={cn(
                'flex items-center space-x-1 px-2 py-1 text-sm font-medium',
                trend.isPositive ? 'text-white' : 'text-white'
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
          <h3 className="text-2xl font-bold text-foreground">{value}</h3>
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>
      </div>
    </div>
  );
}
