'use client';

import { useState, useEffect } from 'react';
import { usePrivy } from '@/lib/mock-privy';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PredictionCard } from '@/components/prediction/prediction-card';
import { Filters } from '@/components/prediction/filters';
import { CreateBetModal } from '@/components/prediction/create-bet-modal';
import { Particles } from '@/components/ui/particles';
import { ShimmeringText } from '@/components/ui/shimmering-text';
import { AppleHelloEffect } from '@/components/ui/apple-hello-effect';
import { InteractiveGridPattern } from '@/components/ui/interactive-grid-pattern';
import { Prediction, FilterOptions, CreatePredictionData } from '@/types/prediction';
import { Plus, TrendingUp, Users, Clock, Zap } from 'lucide-react';
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
  const { authenticated, user } = usePrivy();
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

    // Mock prediction creation
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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10 relative overflow-hidden">
      {/* Background Effects */}
      <Particles 
        className="absolute inset-0 z-0" 
        quantity={50} 
        color="#F0B90B" 
        size={0.5}
        staticity={30}
      />
      <InteractiveGridPattern 
        className="absolute inset-0 z-0 opacity-10" 
        width={40} 
        height={40}
        size={4}
        gap={1}
        strokeColor="#F0B90B"
      />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden z-10">
        <div className="absolute inset-0 bnb-pattern opacity-10" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
          <div className="text-center">
            <AppleHelloEffect delay={500} duration={1500}>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
                <ShimmeringText shimmerColor="#F0B90B" duration={3000}>
                  Live Bet Markets
                </ShimmeringText>
              </h1>
            </AppleHelloEffect>
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto animate-fade-in">
              Fully On-Chain Live Betting Market with AI-Driven Results. Built on BNB Smart Chain.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6 animate-fade-in">
              <Button
                size="lg"
                onClick={() => setShowCreateModal(true)}
                className="btn-primary glow-effect animate-glow"
                disabled={!authenticated}
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Bet
              </Button>
              {!authenticated && (
                <p className="text-sm text-muted-foreground">
                  Connect wallet to create predictions
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 mb-12 relative z-10">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="card-gradient animate-float">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-muted-foreground truncate">
                      Active Predictions
                    </dt>
                    <dd className="text-lg font-medium text-foreground">
                      {stats.activePredictions}
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient animate-float" style={{ animationDelay: '0.5s' }}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-accent" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-muted-foreground truncate">
                      Total Participants
                    </dt>
                    <dd className="text-lg font-medium text-foreground">
                      {stats.totalParticipants}
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient animate-float" style={{ animationDelay: '1s' }}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-muted-foreground truncate">
                      Total Volume
                    </dt>
                    <dd className="text-lg font-medium text-foreground">
                      {stats.totalVolume.toFixed(2)} BNB
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient animate-float" style={{ animationDelay: '1.5s' }}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-8 w-8 text-accent" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-muted-foreground truncate">
                      Total Predictions
                    </dt>
                    <dd className="text-lg font-medium text-foreground">
                      {stats.totalPredictions}
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-16 relative z-10">
        <div className="space-y-8">
          {/* Filters */}
          <Filters
            filters={filters}
            onFiltersChange={setFilters}
            totalCount={filteredPredictions.length}
          />

          {/* Predictions Grid */}
          {filteredPredictions.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No predictions found
                </h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or create the first prediction!
                </p>
                <Button
                  onClick={() => setShowCreateModal(true)}
                  disabled={!authenticated}
                  className="btn-primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Prediction
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
