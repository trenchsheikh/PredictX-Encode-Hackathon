'use client';

import { useState, useEffect, useCallback } from 'react';

import {
  Trophy,
  Medal,
  Award,
  TrendingUp,
  Target,
  DollarSign,
  Crown,
  Star,
  Zap,
  ExternalLink,
  Loader2,
  AlertCircle,
} from 'lucide-react';

import { useI18n } from '@/components/providers/i18n-provider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { api } from '@/lib/api-client';
import { formatBNB, formatAddress } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { LeaderboardEntry } from '@/types';

// Leaderboard data will be fetched from API

const timeframes = [
  { value: 'all', label: 'All Time' },
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '90d', label: '90 Days' },
];

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'crypto', label: 'Crypto' },
  { value: 'sports', label: 'Sports' },
  { value: 'politics', label: 'Politics' },
  { value: 'entertainment', label: 'Entertainment' },
];

export default function LeaderboardPage() {
  const { t } = useI18n();
  const [selectedTimeframe, setSelectedTimeframe] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<
    'winnings' | 'winrate' | 'volume' | 'bets'
  >('winnings');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  /**
   * Fetch leaderboard data from API
   */
  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    setError(undefined);

    try {
      const response = await api.leaderboard.getLeaderboard({
        timeframe: selectedTimeframe as 'all' | '7d' | '30d' | '90d',
        limit: 50,
      });

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch leaderboard');
      }

      setLeaderboard(response.data.leaderboard || []);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to fetch leaderboard'
      );
    } finally {
      setLoading(false);
    }
  }, [selectedTimeframe]);

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-black/80">#{rank}</span>;
    }
  };

  const getBadgeColor = (badge: string) => {
    const colors = {
      Champion: 'bg-yellow-500',
      'Hot Streak': 'bg-red-500',
      'High Roller': 'bg-purple-500',
      Expert: 'bg-blue-500',
      Consistent: 'bg-green-500',
      'Rising Star': 'bg-pink-500',
      'Active Trader': 'bg-cyan-500',
      Whale: 'bg-indigo-500',
      Pro: 'bg-orange-500',
    };
    return colors[badge as keyof typeof colors] || 'bg-gray-500';
  };

  const formatLastActive = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const sortedLeaderboard = [...leaderboard].sort((a, b) => {
    switch (sortBy) {
      case 'winnings':
        return b.totalWinnings - a.totalWinnings;
      case 'winrate':
        return b.winRate - a.winRate;
      case 'volume':
        return b.totalVolume - a.totalVolume;
      case 'bets':
        return b.totalBets - a.totalBets;
      default:
        return a.rank - b.rank;
    }
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-yellow-400" />
          <p className="text-lg text-white">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <p className="mb-4 text-lg text-white">Failed to load leaderboard</p>
          <p className="mb-6 text-gray-300">{error}</p>
          <Button
            onClick={fetchLeaderboard}
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 font-semibold text-black hover:from-yellow-500 hover:to-yellow-700"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="rounded-lg border border-yellow-400/30 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 p-3">
              <Trophy className="h-8 w-8 text-yellow-400" />
            </div>
            <h1 className="font-brand-large gradient-text-brand text-4xl font-bold tracking-tight text-white sm:text-6xl">
              {t('leaderboard')}
            </h1>
          </div>
          <p className="mx-auto max-w-2xl text-lg text-gray-300">
            {t('top_performers')}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="mb-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border border-gray-700/50 bg-gray-800/60 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Trophy className="h-8 w-8 text-yellow-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-300">
                      {t('total_players')}
                    </dt>
                    <dd className="text-lg font-medium text-white">
                      {leaderboard.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-700/50 bg-gray-800/60 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-8 w-8 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-300">
                      {t('total_winnings')}
                    </dt>
                    <dd className="text-lg font-medium text-white">
                      {formatBNB(
                        leaderboard.reduce(
                          (sum, entry) => sum + entry.totalWinnings,
                          0
                        )
                      )}
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-700/50 bg-gray-800/60 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Target className="h-8 w-8 text-yellow-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-300">
                      {t('total_bets_sort')}
                    </dt>
                    <dd className="text-lg font-medium text-white">
                      {leaderboard.reduce(
                        (sum, entry) => sum + entry.totalBets,
                        0
                      )}
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-700/50 bg-gray-800/60 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-8 w-8 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-300">
                      Avg Win Rate
                    </dt>
                    <dd className="text-lg font-medium text-white">
                      {leaderboard.length > 0
                        ? Math.round(
                            (leaderboard.reduce(
                              (sum, entry) => sum + entry.winRate,
                              0
                            ) /
                              leaderboard.length) *
                              100
                          )
                        : 0}
                      %
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8 border border-gray-700/50 border-white/20 bg-gray-800/60 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1">
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Timeframe
                </label>
                <select
                  value={selectedTimeframe}
                  onChange={e => setSelectedTimeframe(e.target.value)}
                  className="w-full rounded-md border border-gray-700/50 bg-gray-800/60 p-2 text-white focus:border-white/50 focus:ring-white/20"
                >
                  {timeframes.map(timeframe => (
                    <option key={timeframe.value} value={timeframe.value}>
                      {timeframe.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="w-full rounded-md border border-gray-700/50 bg-gray-800/60 p-2 text-white focus:border-white/50 focus:ring-white/20"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  {t('sort_by')}
                </label>
                <select
                  value={sortBy}
                  onChange={e =>
                    setSortBy(
                      e.target.value as
                        | 'winnings'
                        | 'winrate'
                        | 'volume'
                        | 'bets'
                    )
                  }
                  className="w-full rounded-md border border-gray-700/50 bg-gray-800/60 p-2 text-white focus:border-white/50 focus:ring-white/20"
                >
                  <option value="winnings">{t('total_winnings_sort')}</option>
                  <option value="winrate">{t('win_rate_sort')}</option>
                  <option value="volume">{t('total_volume_sort')}</option>
                  <option value="bets">{t('total_bets_sort')}</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <div className="space-y-4">
          {sortedLeaderboard.map(entry => (
            <Card
              key={entry.address}
              className={cn(
                'border-gray-700/50 bg-gray-800/60 backdrop-blur-sm transition-all duration-300 hover:shadow-lg',
                entry.rank <= 3 &&
                  'bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 ring-2 ring-yellow-400/30'
              )}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {getRankIcon(entry.rank)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <h3 className="truncate text-lg font-semibold text-white">
                          {entry.username || formatAddress(entry.address)}
                        </h3>
                        {entry.isVerified && (
                          <Badge variant="success" className="text-xs">
                            <Star className="mr-1 h-3 w-3" />
                            Verified
                          </Badge>
                        )}
                        {entry.streak > 3 && (
                          <Badge variant="warning" className="text-xs">
                            <Zap className="mr-1 h-3 w-3" />
                            {entry.streak} streak
                          </Badge>
                        )}
                      </div>

                      <div className="mb-3 flex items-center gap-4 text-sm text-gray-300">
                        <span>{formatAddress(entry.address)}</span>
                        <span>•</span>
                        <span>
                          Last active {formatLastActive(entry.lastActive)}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {entry.badges.map((badge, badgeIndex) => (
                          <Badge
                            key={badgeIndex}
                            variant="secondary"
                            className={cn('text-xs', getBadgeColor(badge))}
                          >
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <div className="text-sm text-gray-300">
                        {t('winnings')}
                      </div>
                      <div className="text-lg font-semibold text-white">
                        {formatBNB(entry.totalWinnings)}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-sm text-gray-300">
                        {t('win_rate')}
                      </div>
                      <div className="text-lg font-semibold text-white">
                        {Math.round(entry.winRate * 100)}%
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-sm text-gray-300">{t('bets')}</div>
                      <div className="text-lg font-semibold text-white">
                        {entry.totalBets}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-sm text-gray-300">{t('volume')}</div>
                      <div className="text-lg font-semibold text-white">
                        {formatBNB(entry.totalVolume)}
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-600/50 text-gray-300 hover:bg-gray-700/50 hover:text-white"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      {t('view')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Coming Soon Notice */}
        <Card className="mt-12 border-yellow-500/20 bg-black/50 text-center">
          <CardContent className="p-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/10">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-white">
              {t('more_features_coming')}
            </h3>
            <p className="mb-4 text-gray-200">{t('working_on_features')}</p>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge
                variant="outline"
                className="border-yellow-500/20 text-gray-200"
              >
                {t('historical_charts')}
              </Badge>
              <Badge
                variant="outline"
                className="border-yellow-500/20 text-gray-200"
              >
                {t('advanced_filters')}
              </Badge>
              <Badge
                variant="outline"
                className="border-yellow-500/20 text-gray-200"
              >
                {t('portfolio_tracking')}
              </Badge>
              <Badge
                variant="outline"
                className="border-yellow-500/20 text-gray-200"
              >
                {t('achievement_system')}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
