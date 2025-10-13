'use client';

import { useState, useEffect } from 'react';
import { usePrivy, useSendTransaction } from '@privy-io/react-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PredictionCard } from '@/components/prediction/prediction-card';
import { Filters } from '@/components/prediction/filters';
import { CreateBetModal } from '@/components/prediction/create-bet-modal';
import { Particles } from '@/components/ui/particles';
import { ShimmeringText } from '@/components/ui/shimmering-text';
import { AppleHelloEffect } from '@/components/ui/apple-hello-effect';
import { InteractiveGridPattern } from '@/components/ui/interactive-grid-pattern';
import { Prediction, FilterOptions, CreatePredictionData } from '@/types/prediction';
import { Plus, TrendingUp, Users, Clock, Zap, Star, Trophy, Fire, Target, BarChart3, TrendingDown, ArrowUp, ArrowDown, Eye, Shield, Lock } from 'lucide-react';
import { useI18n } from '@/components/providers/privy-provider';
import { cn } from '@/lib/utils';

// Mock data for demonstration
const mockPredictions: Prediction[] = [
  {
    id: '1',
    title: 'Will Bitcoin reach $100,000 by end of 2024?',
    description: 'Bitcoin price prediction based on current market trends and institutional adoption.',
    category: 'crypto',
    status: 'active',
    createdAt: Date.now() - 86400000, // 1 day ago
    expiresAt: Date.now() + 86400000 * 30, // 30 days from now
    creator: '0x1234...5678',
    totalPool: 0.5,
    yesPool: 0.3,
    noPool: 0.2,
    yesPrice: 0.006,
    noPrice: 0.004,
    totalShares: 50,
    yesShares: 30,
    noShares: 20,
    participants: 15,
    isHot: true,
  },
  {
    id: '2',
    title: 'Will the Lakers win the NBA Championship 2024?',
    description: 'NBA Championship prediction for the 2023-2024 season.',
    category: 'sports',
    status: 'active',
    createdAt: Date.now() - 172800000, // 2 days ago
    expiresAt: Date.now() + 86400000 * 60, // 60 days from now
    creator: '0x2345...6789',
    totalPool: 0.8,
    yesPool: 0.4,
    noPool: 0.4,
    yesPrice: 0.005,
    noPrice: 0.005,
    totalShares: 80,
    yesShares: 40,
    noShares: 40,
    participants: 25,
    isHot: false,
  },
  {
    id: '3',
    title: 'Will it rain in New York tomorrow?',
    description: 'Weather prediction for New York City based on meteorological data.',
    category: 'weather',
    status: 'resolved',
    createdAt: Date.now() - 259200000, // 3 days ago
    expiresAt: Date.now() - 86400000, // 1 day ago
    creator: '0x3456...7890',
    totalPool: 0.2,
    yesPool: 0.15,
    noPool: 0.05,
    yesPrice: 0.0075,
    noPrice: 0.0025,
    totalShares: 20,
    yesShares: 15,
    noShares: 5,
    participants: 8,
    isHot: false,
    resolution: {
      outcome: 'yes',
      resolvedAt: Date.now() - 86400000,
      reasoning: 'Heavy rainfall recorded in NYC area',
      evidence: ['Weather API data', 'Local weather stations'],
    },
  },
];

export default function HomePage() {
  const { t } = useI18n();
  const { authenticated } = usePrivy();
  const { sendTransaction } = useSendTransaction();
  const [predictions, setPredictions] = useState<Prediction[]>(mockPredictions);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [userBets, setUserBets] = useState<{ [predictionId: string]: { outcome: 'yes' | 'no'; shares: number } }>({});

  const filteredPredictions = predictions.filter(prediction => {
    if (filters.status && prediction.status !== filters.status) return false;
    if (filters.category && prediction.category !== filters.category) return false;
    if (filters.isHot && !prediction.isHot) return false;
    if (filters.timeRange) {
      const now = Date.now();
      const timeRanges = {
        '24h': 86400000,
        '7d': 86400000 * 7,
        '30d': 86400000 * 30,
      };
      const timeRange = timeRanges[filters.timeRange as keyof typeof timeRanges];
      if (timeRange && prediction.createdAt < now - timeRange) return false;
    }
    return true;
  });

  const handleBet = async (predictionId: string, outcome: 'yes' | 'no') => {
    if (!authenticated) {
      alert('Please connect your wallet to place a bet');
      return;
    }
    
    // Mock bet placement
    const prediction = predictions.find(p => p.id === predictionId);
    if (!prediction) return;

    const betAmount = 0.01; // Mock amount
    const shares = betAmount / (outcome === 'yes' ? prediction.yesPrice : prediction.noPrice);
    
    setUserBets(prev => ({
      ...prev,
      [predictionId]: { outcome, shares }
    }));

    // Update prediction pools
    setPredictions(prev => prev.map(p => {
      if (p.id === predictionId) {
        const newYesPool = outcome === 'yes' ? p.yesPool + betAmount : p.yesPool;
        const newNoPool = outcome === 'no' ? p.noPool + betAmount : p.noPool;
        const newTotalPool = newYesPool + newNoPool;
        const newYesPrice = newTotalPool > 0 ? newYesPool / newTotalPool * 0.01 : 0.005;
        const newNoPrice = newTotalPool > 0 ? newNoPool / newTotalPool * 0.01 : 0.005;
        
        return {
          ...p,
          totalPool: newTotalPool,
          yesPool: newYesPool,
          noPool: newNoPool,
          yesPrice: newYesPrice,
          noPrice: newNoPrice,
          participants: p.participants + 1,
        };
      }
      return p;
    }));
  };

  const handleCreatePrediction = async (data: CreatePredictionData) => {
    if (!authenticated) {
      alert('Please connect your wallet to create a prediction');
      return;
    }

    // If a vault is configured and a wallet client is available, attempt to send value
    try {
      const vault = process.env.NEXT_PUBLIC_VAULT_CONTRACT_ADDRESS;
      if (vault && sendTransaction) {
        const wei = BigInt(Math.round(data.bnbAmount * 1e18));
        await sendTransaction({
          to: vault as `0x${string}`,
          value: wei,
        });
      }
    } catch (err: any) {
      console.error('Create bet transaction failed', err);
      alert('Transaction failed. Please try again.');
      return;
    }

    // Add mock prediction locally
    const newPrediction: Prediction = {
      id: Date.now().toString(),
      title: data.title,
      description: data.description,
      category: data.category,
      status: 'active',
      createdAt: Date.now(),
      expiresAt: data.expiresAt,
      creator: '0x1234...5678', // Mock creator address
      totalPool: data.bnbAmount,
      yesPool: data.userPrediction === 'yes' ? data.bnbAmount : 0,
      noPool: data.userPrediction === 'no' ? data.bnbAmount : 0,
      yesPrice: data.userPrediction === 'yes' ? 0.01 : 0,
      noPrice: data.userPrediction === 'no' ? 0.01 : 0,
      totalShares: data.bnbAmount / 0.01,
      yesShares: data.userPrediction === 'yes' ? data.bnbAmount / 0.01 : 0,
      noShares: data.userPrediction === 'no' ? data.bnbAmount / 0.01 : 0,
      participants: 1,
      isHot: false,
    };

    setPredictions(prev => [newPrediction, ...prev]);
    setShowCreateModal(false);
  };

  const stats = {
    totalPredictions: predictions.length,
    activePredictions: predictions.filter(p => p.status === 'active').length,
    totalVolume: predictions.reduce((sum, p) => sum + p.totalPool, 0),
    totalParticipants: predictions.reduce((sum, p) => sum + p.participants, 0),
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero Section - Betting Style */}
      <div className="relative overflow-hidden z-10">
        <div className="absolute inset-0 bnb-pattern opacity-10" />
        <div className="relative mx-auto max-w-7xl px-6 py-8 sm:py-12 lg:px-8">
          <div className="text-center">
            <AppleHelloEffect delay={500} duration={1500}>
              <h1 className="text-3xl font-bold tracking-tight text-yellow-300 sm:text-5xl">
                <ShimmeringText shimmerColor="#F0B90B" duration={2500}>
                  {t('live_markets')}
                </ShimmeringText>
              </h1>
            </AppleHelloEffect>
            <p className="mt-4 text-lg leading-8 text-yellow-200 max-w-2xl mx-auto animate-fade-in">
              {t('hero_subtitle')}
            </p>
            
            {/* Quick Stats Bar */}
            <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-yellow-500/10 px-4 py-2 rounded-full border border-yellow-500/20">
                <Fire className="h-4 w-4 text-yellow-400" />
                <span className="text-yellow-200 font-medium">{stats.activePredictions} Live Markets</span>
              </div>
              <div className="flex items-center gap-2 bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20">
                <TrendingUp className="h-4 w-4 text-green-400" />
                <span className="text-green-200 font-medium">{stats.totalVolume.toFixed(2)} BNB Volume</span>
              </div>
              <div className="flex items-center gap-2 bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/20">
                <Users className="h-4 w-4 text-blue-400" />
                <span className="text-blue-200 font-medium">{stats.totalParticipants} Players</span>
              </div>
            </div>

            {/* Dark Pools Feature Card */}
            <div className="mt-8 max-w-4xl mx-auto">
              <Card className="card-gradient border-yellow-500/20 bg-black/30 backdrop-blur">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Eye className="h-6 w-6 text-yellow-400" />
                    <h2 className="text-xl font-semibold text-yellow-400">
                      {t('dark_pools_title')}
                    </h2>
                  </div>
                  <p className="text-yellow-200 leading-relaxed text-center mb-6">
                    {t('dark_pools_description')}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="p-4 rounded-lg bg-yellow-950/20 border border-yellow-500/10">
                      <Lock className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
                      <div className="text-sm font-medium text-yellow-400 mb-1">{t('privacy')}</div>
                      <div className="text-xs text-yellow-200">{t('privacy_description')}</div>
                    </div>
                    <div className="p-4 rounded-lg bg-yellow-950/20 border border-yellow-500/10">
                      <Shield className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
                      <div className="text-sm font-medium text-yellow-400 mb-1">{t('anti_manipulation')}</div>
                      <div className="text-xs text-yellow-200">{t('anti_manipulation_description')}</div>
                    </div>
                    <div className="p-4 rounded-lg bg-yellow-950/20 border border-yellow-500/10">
                      <Users className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
                      <div className="text-sm font-medium text-yellow-400 mb-1">{t('clean_slate')}</div>
                      <div className="text-xs text-yellow-200">{t('clean_slate_description')}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
              <Button
                size="lg"
                onClick={() => setShowCreateModal(true)}
                className="btn-primary glow-effect animate-glow text-lg px-8 py-3"
              >
                <Plus className="h-5 w-5 mr-2" />
                {t('create_bet')}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/10 text-lg px-8 py-3"
              >
                <BarChart3 className="h-5 w-5 mr-2" />
                View Markets
              </Button>
              {!authenticated && (
                <p className="text-sm text-yellow-200 mt-2">
                  {t('connect_to_create')}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Promotional Banner */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 mb-6 relative z-10">
        <Card className="bg-gradient-to-r from-yellow-500/10 via-yellow-600/5 to-yellow-500/10 border-yellow-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <Star className="h-6 w-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-yellow-300">New to DarkBet?</h3>
                  <p className="text-yellow-200 text-sm">Get started with our AI-powered prediction markets</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/10"
                >
                  Learn More
                </Button>
                <Button
                  size="sm"
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                  onClick={() => setShowCreateModal(true)}
                >
                  Start Betting
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Bar */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 mb-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-yellow-500/20 bg-black/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{stats.activePredictions}</div>
              <div className="text-sm text-yellow-200">Live Markets</div>
            </CardContent>
          </Card>
          <Card className="border-green-500/20 bg-black/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{stats.totalVolume.toFixed(1)}</div>
              <div className="text-sm text-green-200">BNB Volume</div>
            </CardContent>
          </Card>
          <Card className="border-blue-500/20 bg-black/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{stats.totalParticipants}</div>
              <div className="text-sm text-blue-200">Active Players</div>
            </CardContent>
          </Card>
          <Card className="border-purple-500/20 bg-black/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">{stats.totalPredictions}</div>
              <div className="text-sm text-purple-200">Total Markets</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Featured Markets Section - Betting Style */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 mb-8 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Trophy className="h-6 w-6 text-yellow-400" />
            <h2 className="text-2xl font-bold text-yellow-300">Featured Markets</h2>
            <div className="flex items-center gap-1 bg-red-500/20 px-2 py-1 rounded-full">
              <Fire className="h-3 w-3 text-red-400" />
              <span className="text-xs text-red-400 font-medium">HOT</span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-yellow-500/20 text-yellow-200 hover:bg-yellow-500/10"
          >
            View All
          </Button>
        </div>

        {/* Featured Markets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {filteredPredictions.slice(0, 3).map((prediction, index) => (
            <Card 
              key={prediction.id} 
              className={cn(
                "relative overflow-hidden border-yellow-500/20 bg-black/50 hover:bg-black/60 transition-all duration-300",
                prediction.isHot && "ring-2 ring-yellow-500/30 bg-gradient-to-br from-yellow-500/5 to-transparent"
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge 
                        variant="outline" 
                        className="text-xs border-yellow-500/20 text-yellow-200"
                      >
                        {prediction.category}
                      </Badge>
                      {prediction.isHot && (
                        <Badge variant="warning" className="text-xs animate-pulse">
                          <Fire className="h-3 w-3 mr-1" />
                          HOT
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-yellow-300 line-clamp-2 mb-2">
                      {prediction.title}
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-yellow-200">Pool</div>
                    <div className="text-sm font-bold text-yellow-400">
                      {prediction.totalPool.toFixed(2)} BNB
                    </div>
                  </div>
                </div>

                {/* Odds Display - Betting Style */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
                    <div className="text-xs text-green-200 mb-1">YES</div>
                    <div className="text-lg font-bold text-green-400">
                      {prediction.yesPrice.toFixed(3)}
                    </div>
                    <div className="text-xs text-green-300">
                      {prediction.yesPool.toFixed(2)} BNB
                    </div>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center">
                    <div className="text-xs text-red-200 mb-1">NO</div>
                    <div className="text-lg font-bold text-red-400">
                      {prediction.noPrice.toFixed(3)}
                    </div>
                    <div className="text-xs text-red-300">
                      {prediction.noPool.toFixed(2)} BNB
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold"
                    onClick={() => handleBet(prediction.id, 'yes')}
                  >
                    <ArrowUp className="h-3 w-3 mr-1" />
                    YES
                  </Button>
                  <Button
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold"
                    onClick={() => handleBet(prediction.id, 'no')}
                  >
                    <ArrowDown className="h-3 w-3 mr-1" />
                    NO
                  </Button>
                </div>

                {/* Market Info */}
                <div className="flex items-center justify-between mt-3 text-xs text-yellow-200">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{prediction.participants}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>30d left</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* All Markets Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-16 relative z-10">
        <div className="space-y-6">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-yellow-400" />
              <h2 className="text-2xl font-bold text-yellow-300">All Markets</h2>
              <Badge variant="outline" className="border-yellow-500/20 text-yellow-200">
                {filteredPredictions.length} markets
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-yellow-500/20 text-yellow-200 hover:bg-yellow-500/10"
              >
                <TrendingUp className="h-4 w-4 mr-1" />
                Trending
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-yellow-500/20 text-yellow-200 hover:bg-yellow-500/10"
              >
                <Clock className="h-4 w-4 mr-1" />
                Ending Soon
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Filters
            filters={filters}
            onFiltersChange={setFilters}
            totalCount={filteredPredictions.length}
          />

          {/* Markets Grid */}
          {filteredPredictions.length === 0 ? (
            <Card className="text-center py-12 border-yellow-500/20 bg-black/50">
              <CardContent>
                <div className="mx-auto w-24 h-24 bg-yellow-500/10 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="h-12 w-12 text-yellow-400" />
                </div>
                <h3 className="text-lg font-medium text-yellow-300 mb-2">
                  {t('no_predictions_found')}
                </h3>
                <p className="text-yellow-200 mb-4">
                  {t('try_adjusting_filters')}
                </p>
                <Button
                  onClick={() => setShowCreateModal(true)}
                  className="btn-primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t('create_first_prediction')}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPredictions.map((prediction) => (
                <PredictionCard
                  key={prediction.id}
                  prediction={prediction}
                  onBet={handleBet}
                  userBets={userBets}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Bet Modal */}
      <CreateBetModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSubmit={handleCreatePrediction}
      />
    </div>
  );
}
