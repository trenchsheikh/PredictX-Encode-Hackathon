'use client';
import { StatsCard } from './stats-card';
import { TrendingUp, DollarSign, Target, Trophy } from 'lucide-react';
import { formatBNB } from '@/lib/utils';

interface StatsDashboardProps {
  totalBets: number;
  totalWinnings: number;
  winRate: number;
  activeBets: number;
}

export function StatsDashboard({
  totalBets,
  totalWinnings,
  winRate,
  activeBets,
}: StatsDashboardProps) {
  const stats = [
    {
      title: 'Total Bets',
      value: totalBets,
      icon: Target,
      trend: { value: 12, isPositive: true },
    },
    {
      title: 'Total Winnings',
      value: formatBNB(totalWinnings),
      icon: DollarSign,
      trend: { value: 8, isPositive: true },
    },
    {
      title: 'Win Rate',
      value: `${winRate.toFixed(1)}%`,
      icon: Trophy,
      trend: { value: 5, isPositive: winRate > 50 },
    },
    {
      title: 'Active Bets',
      value: activeBets,
      icon: TrendingUp,
      trend: { value: 15, isPositive: true },
    },
  ];

  return (
    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatsCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          trend={stat.trend}
          delay={0}
        />
      ))}
    </div>
  );
}
