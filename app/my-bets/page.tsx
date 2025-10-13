'use client';

import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserBet, Prediction } from '@/types/prediction';
import { formatBNB, formatTimeRemaining, calculatePayout, formatAddress } from '@/lib/utils';
import { Wallet, TrendingUp, TrendingDown, Clock, DollarSign, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/components/providers/privy-provider';

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
  const { t } = useI18n();
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600">
        <Card className="w-full max-w-md text-center bg-black/90 border-black">
          <CardContent className="p-8">
            <div className="mx-auto w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mb-4">
              <Wallet className="h-8 w-8 text-black" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {t('connect_wallet')}
            </h2>
            <p className="text-gray-200 mb-6">
              {t('connect_wallet_to_create')}
            </p>
            <Button className="bg-white hover:bg-gray-200 text-black">
              <Wallet className="h-4 w-4 mr-2" />
              {t('connect_wallet')}
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">{t('my_bets')}</h1>
          <p className="text-black/80">
            {t('track_investments')}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="bg-black/90 border-black">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-8 w-8 text-yellow-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-300 truncate">
                      {t('total_invested')}
                    </dt>
                    <dd className="text-lg font-medium text-white">
                      {formatBNB(totalInvested)}
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/90 border-black">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-8 w-8 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-300 truncate">
                      {t('total_payout')}
                    </dt>
                    <dd className="text-lg font-medium text-white">
                      {formatBNB(totalPayout)}
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/90 border-black">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-8 w-8 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-300 truncate">
                      {t('active_bets')}
                    </dt>
                    <dd className="text-lg font-medium text-white">
                      {activeBets}
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/90 border-black">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ExternalLink className="h-8 w-8 text-purple-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-300 truncate">
                      {t('resolved_bets')}
                    </dt>
                    <dd className="text-lg font-medium text-white">
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
          <div className="border-b border-black">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'all', label: t('all_bets'), count: userBets.length },
                { key: 'active', label: t('active'), count: activeBets },
                { key: 'resolved', label: t('resolved'), count: resolvedBets },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={cn(
                    'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm',
                    activeTab === tab.key
                      ? 'border-black text-black'
                      : 'border-transparent text-black/60 hover:text-black hover:border-black/30'
                  )}
                >
                  {tab.label}
                  <Badge variant="secondary" className="ml-2 bg-black/90 text-white">
                    {tab.count}
                  </Badge>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Bets List */}
        {filteredBets.length === 0 ? (
          <Card className="text-center py-12 bg-black/90 border-black">
            <CardContent>
              <div className="mx-auto w-24 h-24 bg-yellow-500 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="h-12 w-12 text-black" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                {t('no_bets_found')}
              </h3>
              <p className="text-gray-200 mb-4">
                {activeTab === 'all' 
                  ? t('no_bets_yet')
                  : activeTab === 'active' 
                    ? t('no_active_bets')
                    : t('no_resolved_bets')
                }
              </p>
              <Button className="bg-white hover:bg-gray-200 text-black">
                {t('explore_markets')}
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
                <Card key={bet.id} className="hover:shadow-lg transition-shadow bg-black/90 border-black">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="border-white text-white">
                            {prediction.category}
                          </Badge>
                          <Badge variant={getStatusColor(prediction.status) as any} className="bg-yellow-500 text-black">
                            {prediction.status}
                          </Badge>
                          {prediction.isHot && (
                            <Badge variant="warning">Hot</Badge>
                          )}
                        </div>
                        
                        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                          {prediction.title}
                        </h3>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-300 mb-4">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>
                              {prediction.status === 'active' 
                                ? `${t('expires_in')} ${formatTimeRemaining(prediction.expiresAt)}`
                                : `${t('resolved_on')} ${new Date(prediction.resolution?.resolvedAt || prediction.expiresAt).toLocaleDateString()}`
                              }
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <OutcomeIcon className={cn("h-4 w-4", bet.outcome === 'yes' ? 'text-green-400' : 'text-red-400')} />
                            <span className={bet.outcome === 'yes' ? 'text-green-400' : 'text-red-400'}>
                              {bet.outcome.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        {/* Bet Details */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <div className="text-xs text-gray-400">{t('shares')}</div>
                            <div className="text-sm font-medium text-white">{bet.shares.toFixed(2)}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-400">{t('amount')}</div>
                            <div className="text-sm font-medium text-white">{formatBNB(bet.amount)}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-400">{t('price')}</div>
                            <div className="text-sm font-medium text-white">{bet.price.toFixed(4)}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-400">{t('potential_payout')}</div>
                            <div className="text-sm font-medium text-white">
                              {formatBNB(calculatePayout(bet.shares, 
                                bet.outcome === 'yes' ? prediction.yesShares : prediction.noShares, 
                                prediction.totalPool
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Resolution Info */}
                        {prediction.resolution && (
                          <div className="mt-4 p-3 rounded-lg bg-yellow-500/20 border border-yellow-500/30">
                            <div className="text-sm font-medium mb-1 text-white">
                              {t('resolution')}: {prediction.resolution.outcome.toUpperCase()}
                            </div>
                            <div className="text-xs text-gray-200">
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
                            className="bg-green-600 hover:bg-green-700 text-white"
                            size="sm"
                          >
                            <DollarSign className="h-4 w-4 mr-2" />
                            {t('claim')}
                          </Button>
                        ) : bet.claimed ? (
                          <Badge variant="success" className="bg-green-600 text-white">{t('claimed')}</Badge>
                        ) : prediction.status === 'active' ? (
                          <Badge variant="secondary" className="bg-blue-600 text-white">{t('active')}</Badge>
                        ) : isWinning ? (
                          <Badge variant="success" className="bg-green-600 text-white">{t('won')}</Badge>
                        ) : (
                          <Badge variant="destructive" className="bg-red-600 text-white">{t('lost')}</Badge>
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

