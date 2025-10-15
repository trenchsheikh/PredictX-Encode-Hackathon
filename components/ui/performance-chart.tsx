'use client';

import { motion } from 'framer-motion';
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
import { TrendingUp, BarChart3 } from 'lucide-react';

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`rounded-xl border border-gray-700/50 bg-gradient-to-br from-gray-900/60 to-gray-800/40 p-6 backdrop-blur-sm ${className}`}
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="rounded-lg bg-yellow-500/10 p-2">
            <BarChart3 className="h-5 w-5 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              Performance Overview
            </h3>
            <p className="text-sm text-gray-400">
              Your betting performance over time
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-green-400">
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
                  <stop offset="5%" stopColor="#FCD34D" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FCD34D" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="date"
                stroke="#9CA3AF"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#9CA3AF"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB',
                }}
                formatter={(value: any, name: string) => [
                  `${value} ${name === 'winnings' ? 'BNB' : 'bets'}`,
                  name === 'winnings' ? 'Winnings' : 'Bets',
                ]}
                labelStyle={{ color: '#F9FAFB' }}
              />
              <Area
                type="monotone"
                dataKey="winnings"
                stroke="#FCD34D"
                strokeWidth={2}
                fill="url(#winningsGradient)"
              />
            </AreaChart>
          ) : (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="date"
                stroke="#9CA3AF"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#9CA3AF"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB',
                }}
                formatter={(value: any, name: string) => [
                  `${value} ${name === 'winnings' ? 'BNB' : 'bets'}`,
                  name === 'winnings' ? 'Winnings' : 'Bets',
                ]}
                labelStyle={{ color: '#F9FAFB' }}
              />
              <Line
                type="monotone"
                dataKey="winnings"
                stroke="#FCD34D"
                strokeWidth={2}
                dot={{ fill: '#FCD34D', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#FCD34D', strokeWidth: 2 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
