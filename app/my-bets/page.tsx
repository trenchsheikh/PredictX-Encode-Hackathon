'use client';

import { useState, useEffect } from 'react';
import { usePrivy } from '@/lib/mock-privy';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserBet, Prediction } from '@/types/prediction';
import { formatBNB, formatTimeRemaining, calculatePayout, formatAddress } from '@/lib/utils';
import { Wallet, TrendingUp, TrendingDown, Clock, DollarSign, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data for demonstration
const mockUserBets: UserBet[] = [
  {
    id: '1',
    predictionId: '1',
    user: '0x1234...5678',
    outcome: 'yes',
    shares: 1.67,
    amount: 0.01,
    price: 0.006,
    createdAt: Date.now() - 86400000,
    claimed: false,
    payout: 0.0167,
  },
  {
    id: '2',
    predictionId: '2',
    user: '0x1234...5678',
    outcome: 'no',
    shares: 2.0,
    amount: 0.01,
    price: 0.005,
    createdAt: Date.now() - 172800000,
    claimed: true,
    payout: 0.02,
  },
];

const mockPredictions: { [id: string]: Prediction } = {
  '1': {
    id: '1',
    title: 'Will Bitcoin reach $100,000 by end of 2024?',
    description: 'Bitcoin price prediction based on current market trends and institutional adoption.',
    category: 'crypto',
    status: 'active',
    createdAt: Date.now() - 86400000,
    expiresAt: Date.now() + 86400000 * 30,
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
  '2': {
    id: '2',
    title: 'Will the Lakers win the NBA Championship 2024?',
    description: 'NBA Championship prediction for the 2023-2024 season.',
    category: 'sports',
    status: 'resolved',
    createdAt: Date.now() - 172800000,
    expiresAt: Date.now() - 86400000,
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
    resolution: {
      outcome: 'no',
      resolvedAt: Date.now() - 86400000,
      reasoning: 'Lakers eliminated in playoffs',
      evidence: ['NBA official results', 'Sports news'],
    },
  },
};

export default function MyBetsPage() {
  const { authenticated, user } = usePrivy();
  const [userBets, setUserBets] = useState<UserBet[]>([]);
  const [predictions, setPredictions] = useState<{ [id: string]: Prediction }>({});
  const [activeTab, setActiveTab] = useState<'active' | 'resolved' | 'all'>('all');

  useEffect(() => {
    if (authenticated) {
      setUserBets(mockUserBets);
      setPredictions(mockPredictions);
    }
  }, [authenticated]);

  const filteredBets = userBets.filter(bet => {
    const prediction = predictions[bet.predictionId];
    if (!prediction) return false;
    
    switch (activeTab) {
      case 'active':
        return prediction.status === 'active';
      case 'resolved':
        return prediction.status === 'resolved';
      default:
        return true;
    }
  });

  const handleClaim = async (betId: string) => {
    // Mock claim functionality
    setUserBets(prev => prev.map(bet => 
      bet.id === betId ? { ...bet, claimed: true } : bet
    ));
  };

  const getOutcomeColor = (outcome: 'yes' | 'no') => {
    return outcome === 'yes' ? 'text-green-600' : 'text-red-600';
  };

  const getOutcomeIcon = (outcome: 'yes' | 'no') => {
    return outcome === 'yes' ? TrendingUp : TrendingDown;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'success',
      resolved: 'secondary',
      cancelled: 'destructive',
      expired: 'warning',
    };
    return colors[status as keyof typeof colors] || 'secondary';
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Wallet className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Connect Your Wallet
            </h2>
            <p className="text-muted-foreground mb-6">
              Please connect your wallet to view your bets
            </p>
            <Button className="btn-primary">
              <Wallet className="h-4 w-4 mr-2" />
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalInvested = userBets.reduce((sum, bet) => sum + bet.amount, 0);
  const totalPayout = userBets.reduce((sum, bet) => sum + (bet.payout || 0), 0);
  const activeBets = userBets.filter(bet => predictions[bet.predictionId]?.status === 'active').length;
  const resolvedBets = userBets.filter(bet => predictions[bet.predictionId]?.status === 'resolved').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Bets</h1>
          <p className="text-muted-foreground">
            Track your prediction market investments and winnings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="card-gradient">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-8 w-8 text-primary" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-muted-foreground truncate">
                      Total Invested
                    </dt>
                    <dd className="text-lg font-medium text-foreground">
                      {formatBNB(totalInvested)}
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
                      Total Payout
                    </dt>
                    <dd className="text-lg font-medium text-foreground">
                      {formatBNB(totalPayout)}
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
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-muted-foreground truncate">
                      Active Bets
                    </dt>
                    <dd className="text-lg font-medium text-foreground">
                      {activeBets}
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
                  <ExternalLink className="h-8 w-8 text-accent" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-muted-foreground truncate">
                      Resolved Bets
                    </dt>
                    <dd className="text-lg font-medium text-foreground">
                      {resolvedBets}
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-border">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'all', label: 'All Bets', count: userBets.length },
                { key: 'active', label: 'Active', count: activeBets },
                { key: 'resolved', label: 'Resolved', count: resolvedBets },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={cn(
                    'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm',
                    activeTab === tab.key
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                  )}
                >
                  {tab.label}
                  <Badge variant="secondary" className="ml-2">
                    {tab.count}
                  </Badge>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Bets List */}
        {filteredBets.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                No bets found
              </h3>
              <p className="text-muted-foreground mb-4">
                {activeTab === 'all' 
                  ? "You haven't placed any bets yet. Start by exploring the prediction markets!"
                  : `You don't have any ${activeTab} bets.`
                }
              </p>
              <Button className="btn-primary">
                Explore Markets
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredBets.map((bet) => {
              const prediction = predictions[bet.predictionId];
              if (!prediction) return null;

              const OutcomeIcon = getOutcomeIcon(bet.outcome);
              const isWinning = prediction.resolution?.outcome === bet.outcome;
              const canClaim = prediction.status === 'resolved' && isWinning && !bet.claimed;

              return (
                <Card key={bet.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">
                            {prediction.category}
                          </Badge>
                          <Badge variant={getStatusColor(prediction.status) as any}>
                            {prediction.status}
                          </Badge>
                          {prediction.isHot && (
                            <Badge variant="warning">Hot</Badge>
                          )}
                        </div>
                        
                        <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                          {prediction.title}
                        </h3>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>
                              {prediction.status === 'active' 
                                ? `Expires in ${formatTimeRemaining(prediction.expiresAt)}`
                                : `Resolved ${new Date(prediction.resolution?.resolvedAt || prediction.expiresAt).toLocaleDateString()}`
                              }
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <OutcomeIcon className={cn("h-4 w-4", getOutcomeColor(bet.outcome))} />
                            <span className={getOutcomeColor(bet.outcome)}>
                              {bet.outcome.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        {/* Bet Details */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <div className="text-xs text-muted-foreground">Shares</div>
                            <div className="text-sm font-medium">{bet.shares.toFixed(2)}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Amount</div>
                            <div className="text-sm font-medium">{formatBNB(bet.amount)}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Price</div>
                            <div className="text-sm font-medium">{bet.price.toFixed(4)}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Potential Payout</div>
                            <div className="text-sm font-medium">
                              {formatBNB(calculatePayout(bet.shares, 
                                bet.outcome === 'yes' ? prediction.yesShares : prediction.noShares, 
                                prediction.totalPool
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Resolution Info */}
                        {prediction.resolution && (
                          <div className="mt-4 p-3 rounded-lg bg-muted">
                            <div className="text-sm font-medium mb-1">
                              Resolution: {prediction.resolution.outcome.toUpperCase()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {prediction.resolution.reasoning}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="ml-4 flex-shrink-0">
                        {canClaim ? (
                          <Button
                            onClick={() => handleClaim(bet.id)}
                            className="btn-accent"
                            size="sm"
                          >
                            <DollarSign className="h-4 w-4 mr-2" />
                            Claim
                          </Button>
                        ) : bet.claimed ? (
                          <Badge variant="success">Claimed</Badge>
                        ) : prediction.status === 'active' ? (
                          <Badge variant="secondary">Active</Badge>
                        ) : isWinning ? (
                          <Badge variant="success">Won</Badge>
                        ) : (
                          <Badge variant="destructive">Lost</Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

