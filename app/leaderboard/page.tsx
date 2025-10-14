'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatBNB, formatAddress } from '@/lib/utils';
import { 
  Trophy, 
  Medal, 
  Award, 
  TrendingUp, 
  Users, 
  Target, 
  DollarSign,
  Crown,
  Star,
  Zap,
  Calendar,
  ExternalLink,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/components/providers/privy-provider';
import { api, getErrorMessage } from '@/lib/api-client';

interface LeaderboardEntry {
  rank: number;
  address: string;
  username?: string;
  totalWinnings: number;
  totalBets: number;
  winRate: number;
  totalVolume: number;
  badges: string[];
  isVerified: boolean;
  streak: number;
  lastActive: number;
}

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
  const [sortBy, setSortBy] = useState<'winnings' | 'winrate' | 'volume' | 'bets'>('winnings');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  /**
   * Fetch leaderboard data from API
   */
  const fetchLeaderboard = async () => {
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
      setError(err instanceof Error ? err.message : 'Failed to fetch leaderboard');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchLeaderboard();
  }, [selectedTimeframe, selectedCategory]);

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
      'Champion': 'bg-yellow-500',
      'Hot Streak': 'bg-red-500',
      'High Roller': 'bg-purple-500',
      'Expert': 'bg-blue-500',
      'Consistent': 'bg-green-500',
      'Rising Star': 'bg-pink-500',
      'Active Trader': 'bg-cyan-500',
      'Whale': 'bg-indigo-500',
      'Pro': 'bg-orange-500',
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-yellow-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-white text-lg mb-4">Failed to load leaderboard</p>
          <p className="text-gray-300 mb-6">{error}</p>
          <Button 
            onClick={fetchLeaderboard}
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-4 font-brand-large gradient-text-brand">
            {t('leaderboard')}
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            {t('top_performers')}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          <Card className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Trophy className="h-8 w-8 text-yellow-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-300 truncate">
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

          <Card className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-8 w-8 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-300 truncate">
                      {t('total_winnings')}
                    </dt>
                    <dd className="text-lg font-medium text-white">
                      {formatBNB(leaderboard.reduce((sum, entry) => sum + entry.totalWinnings, 0))}
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Target className="h-8 w-8 text-yellow-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-300 truncate">
                      {t('total_bets_sort')}
                    </dt>
                    <dd className="text-lg font-medium text-white">
                      {leaderboard.reduce((sum, entry) => sum + entry.totalBets, 0)}
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-8 w-8 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-300 truncate">
                      Avg Win Rate
                    </dt>
                    <dd className="text-lg font-medium text-white">
                      {leaderboard.length > 0 ? Math.round(leaderboard.reduce((sum, entry) => sum + entry.winRate, 0) / leaderboard.length * 100) : 0}%
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8 border-yellow-500/20 bg-gray-800/60 backdrop-blur-sm border border-gray-700/50">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Timeframe
                </label>
                <select
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                  className="w-full p-2 border border-gray-700/50 rounded-md bg-gray-800/60 text-white focus:border-yellow-400/50 focus:ring-yellow-400/20"
                >
                  {timeframes.map((timeframe) => (
                    <option key={timeframe.value} value={timeframe.value}>
                      {timeframe.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border border-gray-700/50 rounded-md bg-gray-800/60 text-white focus:border-yellow-400/50 focus:ring-yellow-400/20"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  {t('sort_by')}
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full p-2 border border-gray-700/50 rounded-md bg-gray-800/60 text-white focus:border-yellow-400/50 focus:ring-yellow-400/20"
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
          {sortedLeaderboard.map((entry, index) => (
            <Card 
              key={entry.address} 
              className={cn(
                "hover:shadow-lg transition-all duration-300 border-gray-700/50 bg-gray-800/60 backdrop-blur-sm",
                entry.rank <= 3 && "ring-2 ring-yellow-400/30 bg-gradient-to-r from-yellow-400/10 to-yellow-600/10"
              )}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {getRankIcon(entry.rank)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-white truncate">
                          {entry.username || formatAddress(entry.address)}
                        </h3>
                        {entry.isVerified && (
                          <Badge variant="success" className="text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                        {entry.streak > 3 && (
                          <Badge variant="warning" className="text-xs">
                            <Zap className="h-3 w-3 mr-1" />
                            {entry.streak} streak
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-300 mb-3">
                        <span>{formatAddress(entry.address)}</span>
                        <span>•</span>
                        <span>Last active {formatLastActive(entry.lastActive)}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {entry.badges.map((badge, badgeIndex) => (
                          <Badge
                            key={badgeIndex}
                            variant="secondary"
                            className={cn("text-xs", getBadgeColor(badge))}
                          >
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <div className="text-sm text-gray-300">{t('winnings')}</div>
                      <div className="text-lg font-semibold text-white">
                        {formatBNB(entry.totalWinnings)}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-gray-300">{t('win_rate')}</div>
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
                    
                    <Button variant="outline" size="sm" className="border-gray-600/50 text-gray-300 hover:bg-gray-700/50 hover:text-white">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      {t('view')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Coming Soon Notice */}
        <Card className="mt-12 text-center border-yellow-500/20 bg-black/50">
          <CardContent className="p-8">
            <div className="mx-auto w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mb-4">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">
              {t('more_features_coming')}
            </h3>
            <p className="text-gray-200 mb-4">
              {t('working_on_features')}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="outline" className="border-yellow-500/20 text-gray-200">{t('historical_charts')}</Badge>
              <Badge variant="outline" className="border-yellow-500/20 text-gray-200">{t('advanced_filters')}</Badge>
              <Badge variant="outline" className="border-yellow-500/20 text-gray-200">{t('portfolio_tracking')}</Badge>
              <Badge variant="outline" className="border-yellow-500/20 text-gray-200">{t('achievement_system')}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


