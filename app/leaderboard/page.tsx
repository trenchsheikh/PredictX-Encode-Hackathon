'use client';

import { useState } from 'react';
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
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';

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

// Mock leaderboard data
const mockLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    address: '0x1234...5678',
    username: 'CryptoOracle',
    totalWinnings: 2.5,
    totalBets: 25,
    winRate: 0.84,
    totalVolume: 5.2,
    badges: ['Champion', 'Hot Streak', 'High Roller'],
    isVerified: true,
    streak: 8,
    lastActive: Date.now() - 3600000,
  },
  {
    rank: 2,
    address: '0x2345...6789',
    username: 'PredictionMaster',
    totalWinnings: 1.8,
    totalBets: 18,
    winRate: 0.78,
    totalVolume: 3.6,
    badges: ['Expert', 'Consistent'],
    isVerified: true,
    streak: 5,
    lastActive: Date.now() - 7200000,
  },
  {
    rank: 3,
    address: '0x3456...7890',
    username: 'MarketWizard',
    totalWinnings: 1.5,
    totalBets: 22,
    winRate: 0.73,
    totalVolume: 4.1,
    badges: ['Rising Star', 'Active Trader'],
    isVerified: false,
    streak: 3,
    lastActive: Date.now() - 1800000,
  },
  {
    rank: 4,
    address: '0x4567...8901',
    username: 'BNBWhale',
    totalWinnings: 1.2,
    totalBets: 15,
    winRate: 0.80,
    totalVolume: 6.8,
    badges: ['High Roller', 'Whale'],
    isVerified: true,
    streak: 2,
    lastActive: Date.now() - 10800000,
  },
  {
    rank: 5,
    address: '0x5678...9012',
    username: 'PredictionPro',
    totalWinnings: 1.0,
    totalBets: 20,
    winRate: 0.70,
    totalVolume: 2.9,
    badges: ['Pro', 'Consistent'],
    isVerified: false,
    streak: 1,
    lastActive: Date.now() - 5400000,
  },
];

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
  const [selectedTimeframe, setSelectedTimeframe] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'winnings' | 'winrate' | 'volume' | 'bets'>('winnings');

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
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

  const sortedLeaderboard = [...mockLeaderboard].sort((a, b) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl mb-4">
            Leaderboard
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Top performers on BNBPredict prediction markets
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          <Card className="card-gradient">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Trophy className="h-8 w-8 text-primary" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-muted-foreground truncate">
                      Total Players
                    </dt>
                    <dd className="text-lg font-medium text-foreground">
                      {mockLeaderboard.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-8 w-8 text-accent" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-muted-foreground truncate">
                      Total Winnings
                    </dt>
                    <dd className="text-lg font-medium text-foreground">
                      {formatBNB(mockLeaderboard.reduce((sum, entry) => sum + entry.totalWinnings, 0))}
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-muted-foreground truncate">
                      Total Bets
                    </dt>
                    <dd className="text-lg font-medium text-foreground">
                      {mockLeaderboard.reduce((sum, entry) => sum + entry.totalBets, 0)}
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-8 w-8 text-accent" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-muted-foreground truncate">
                      Avg Win Rate
                    </dt>
                    <dd className="text-lg font-medium text-foreground">
                      {Math.round(mockLeaderboard.reduce((sum, entry) => sum + entry.winRate, 0) / mockLeaderboard.length * 100)}%
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Timeframe
                </label>
                <select
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                  className="w-full p-2 border rounded-md bg-background"
                >
                  {timeframes.map((timeframe) => (
                    <option key={timeframe.value} value={timeframe.value}>
                      {timeframe.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex-1">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border rounded-md bg-background"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex-1">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full p-2 border rounded-md bg-background"
                >
                  <option value="winnings">Total Winnings</option>
                  <option value="winrate">Win Rate</option>
                  <option value="volume">Total Volume</option>
                  <option value="bets">Total Bets</option>
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
                "hover:shadow-lg transition-all duration-300",
                entry.rank <= 3 && "ring-2 ring-primary/20 bg-gradient-to-r from-primary/5 to-accent/5"
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
                        <h3 className="text-lg font-semibold text-foreground truncate">
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
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
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
                      <div className="text-sm text-muted-foreground">Winnings</div>
                      <div className="text-lg font-semibold text-foreground">
                        {formatBNB(entry.totalWinnings)}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Win Rate</div>
                      <div className="text-lg font-semibold text-foreground">
                        {Math.round(entry.winRate * 100)}%
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Bets</div>
                      <div className="text-lg font-semibold text-foreground">
                        {entry.totalBets}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Volume</div>
                      <div className="text-lg font-semibold text-foreground">
                        {formatBNB(entry.totalVolume)}
                      </div>
                    </div>
                    
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Coming Soon Notice */}
        <Card className="mt-12 text-center">
          <CardContent className="p-8">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Trophy className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              More Features Coming Soon
            </h3>
            <p className="text-muted-foreground mb-4">
              We're working on adding more detailed analytics, historical data, and advanced filtering options.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="outline">Historical Charts</Badge>
              <Badge variant="outline">Advanced Filters</Badge>
              <Badge variant="outline">Portfolio Tracking</Badge>
              <Badge variant="outline">Achievement System</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


