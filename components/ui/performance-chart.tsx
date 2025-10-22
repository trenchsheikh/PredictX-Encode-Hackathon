'use client';

import React from 'react';

import { TrendingUp, BarChart3 } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

interface PerformanceChartProps {
  data: Array<{
    date: string;
    winnings: number;
    bets: number;
  }>;
  type?: 'line' | 'area';
  className?: string;
}

export function PerformanceChart({
  data,
  type = 'area',
  className,
}: PerformanceChartProps) {
  return (
    <div className={`border border-white/20 bg-card p-6 ${className}`}>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Performance Overview
            </h3>
            <p className="text-sm text-muted-foreground">
              Your betting performance over time
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-white">
          <TrendingUp className="h-4 w-4" />
          <span className="text-sm font-medium">
            {(() => {
              if (data.length < 2) return '0%';
              const current = data[data.length - 1].winnings;
              const previous = data[data.length - 2].winnings;
              if (previous === 0) return current > 0 ? '+100%' : '0%';
              const change = ((current - previous) / previous) * 100;
              return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
            })()}
          </span>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'area' ? (
            <AreaChart data={data}>
              <defs>
                <linearGradient
                  id="winningsGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#FFFFFF"
                strokeOpacity={0.2}
              />
              <XAxis
                dataKey="date"
                stroke="#FFFFFF"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#FFFFFF"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0A0A0A',
                  border: '1px solid #FFFFFF',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                }}
                formatter={(value: any, name: string) => [
                  `${value} ${name === 'winnings' ? 'BNB' : 'bets'}`,
                  name === 'winnings' ? 'Winnings' : 'Bets',
                ]}
                labelStyle={{ color: '#FFFFFF' }}
              />
              <Area
                type="monotone"
                dataKey="winnings"
                stroke="#FFFFFF"
                strokeWidth={2}
                fill="url(#winningsGradient)"
              />
            </AreaChart>
          ) : (
            <LineChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#FFFFFF"
                strokeOpacity={0.2}
              />
              <XAxis
                dataKey="date"
                stroke="#FFFFFF"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#FFFFFF"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0A0A0A',
                  border: '1px solid #FFFFFF',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                }}
                formatter={(value: any, name: string) => [
                  `${value} ${name === 'winnings' ? 'BNB' : 'bets'}`,
                  name === 'winnings' ? 'Winnings' : 'Bets',
                ]}
                labelStyle={{ color: '#FFFFFF' }}
              />
              <Line
                type="monotone"
                dataKey="winnings"
                stroke="#FFFFFF"
                strokeWidth={2}
                dot={{ fill: '#FFFFFF', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#FFFFFF', strokeWidth: 2 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
