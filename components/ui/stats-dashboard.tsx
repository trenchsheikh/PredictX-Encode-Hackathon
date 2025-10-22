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
    },
    {
      title: 'Total Winnings',
      value: formatBNB(totalWinnings),
      icon: DollarSign,
    },
    {
      title: 'Win Rate',
      value: `${winRate.toFixed(1)}%`,
      icon: Trophy,
    },
    {
      title: 'Active Bets',
      value: activeBets,
      icon: TrendingUp,
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
          delay={0}
        />
      ))}
    </div>
  );
}
