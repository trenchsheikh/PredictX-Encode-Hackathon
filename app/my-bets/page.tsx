'use client';

import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserBet, Prediction } from '@/types/prediction';
import { formatBNB, formatTimeRemaining, calculatePayout, formatAddress } from '@/lib/utils';
import { Wallet, TrendingUp, TrendingDown, Clock, DollarSign, ExternalLink, Eye, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/components/providers/privy-provider';
import { api, getErrorMessage } from '@/lib/api-client';
import { usePredictionContract } from '@/lib/hooks/use-prediction-contract';
import { getCommitSecret, hasUnrevealedCommit, canReveal, clearCommitSecret } from '@/lib/commit-reveal';
import { RevealModal } from '@/components/prediction/reveal-modal';
import { TransactionStatus } from '@/components/ui/transaction-status';
import { mapCategory, mapStatus, calculatePrice } from '@/lib/blockchain-utils';
import { ethers } from 'ethers';

export default function MyBetsPage() {
  const { t } = useI18n();
  const { authenticated, user } = usePrivy();
  const contract = usePredictionContract();
  
  // Data state
  const [userBets, setUserBets] = useState<UserBet[]>([]);
  const [predictions, setPredictions] = useState<{ [id: string]: Prediction }>({});
  const [activeTab, setActiveTab] = useState<'active' | 'resolved' | 'all'>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  
  // Reveal modal state
  const [showRevealModal, setShowRevealModal] = useState(false);
  const [selectedBet, setSelectedBet] = useState<{
    prediction: Prediction;
    commitData: any;
  } | null>(null);

  /**
   * Fetch user's bets from backend
   */
  const fetchUserBets = async () => {
    if (!user?.wallet?.address) return;

    setLoading(true);
    setError(undefined);

    try {
      const response = await api.users.getUserBets(user.wallet.address);

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch bets');
      }

      // Map backend data to frontend UserBet format
      const bets: UserBet[] = (response.data.bets || []).map((bet: any) => {
        const isRevealed = bet.type === 'bet';
        return {
          id: bet.txHash || `${bet.marketId}-${Date.now()}`,
          predictionId: bet.marketId.toString(),
          user: response.data.address,
          outcome: isRevealed ? (bet.outcome ? 'yes' : 'no') : 'unknown',
          shares: bet.shares ? parseFloat(ethers.formatEther(bet.shares)) : 0,
          amount: parseFloat(ethers.formatEther(bet.amount)),
          price: 0, // Would calculate from market data
          createdAt: new Date(isRevealed ? bet.revealedAt : bet.timestamp).getTime(),
          claimed: bet.claimed || false,
          payout: undefined, // Calculate from market if claimed
          revealed: isRevealed,
        };
      });

      setUserBets(bets);

      // Fetch associated market data
      const marketIds = [...new Set(bets.map(b => b.predictionId))];
      const marketData: { [id: string]: Prediction } = {};

      for (const marketId of marketIds) {
        const marketResponse = await api.markets.getMarket(marketId);
        if (marketResponse.success && marketResponse.data) {
          const market = marketResponse.data;
          marketData[marketId] = {
            id: marketId,
            title: market.title,
            description: market.description,
            summary: market.summary || market.description,
            category: mapCategory(market.category),
            status: mapStatus(market.status),
            createdAt: new Date(market.createdAt).getTime(),
            expiresAt: new Date(market.expiresAt).getTime(),
            creator: market.creator,
            totalPool: parseFloat(ethers.formatEther(market.totalPool || '0')),
            yesPool: parseFloat(ethers.formatEther(market.yesPool || '0')),
            noPool: parseFloat(ethers.formatEther(market.noPool || '0')),
            yesPrice: calculatePrice(market.yesPool || '0', market.totalPool || '1'),
            noPrice: calculatePrice(market.noPool || '0', market.totalPool || '1'),
            totalShares: parseFloat(ethers.formatEther(market.yesShares || '0')) + parseFloat(ethers.formatEther(market.noShares || '0')),
            yesShares: parseFloat(ethers.formatEther(market.yesShares || '0')),
            noShares: parseFloat(ethers.formatEther(market.noShares || '0')),
            participants: market.participants || 0,
            isHot: false,
            outcome: market.outcome === true ? 'yes' : market.outcome === false ? 'no' : undefined,
            resolutionReasoning: market.resolutionReasoning,
          };
        }
      }

      setPredictions(marketData);
    } catch (err: any) {
      console.error('Failed to fetch user bets:', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authenticated && user?.wallet?.address) {
      fetchUserBets();
    }
  }, [authenticated, user?.wallet?.address]);

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

  /**
   * Handle reveal bet
   */
  const handleRevealClick = (predictionId: string) => {
    const prediction = predictions[predictionId];
    const commitData = getCommitSecret(predictionId);

    if (!prediction || !commitData) {
      alert('Reveal data not found. Make sure you placed this bet on this device.');
      return;
    }

    setSelectedBet({ prediction, commitData });
    setShowRevealModal(true);
  };

  /**
   * Confirm reveal bet
   */
  const handleRevealConfirm = async () => {
    if (!selectedBet || !user?.wallet?.address) return;

    try {
      const marketId = parseInt(selectedBet.prediction.id);
      const isYes = selectedBet.commitData.outcome === 'yes';

      // Call smart contract
      const result = await contract.revealBet(
        marketId,
        isYes,
        selectedBet.commitData.salt
      );

      if (!result.success || !result.txHash) {
        throw new Error('Transaction failed');
      }

      // Call backend API
      await api.markets.revealBet(selectedBet.prediction.id, {
        userAddress: user.wallet.address,
        outcome: selectedBet.commitData.outcome,
        salt: selectedBet.commitData.salt,
        amount: selectedBet.commitData.amount,
        txHash: result.txHash,
      });

      // Clear local commit data
      clearCommitSecret(selectedBet.prediction.id);

      // Refresh bets
      await fetchUserBets();

      setShowRevealModal(false);
      alert('Bet revealed successfully!');
    } catch (err: any) {
      console.error('Reveal failed:', err);
      alert(getErrorMessage(err));
    }
  };

  /**
   * Handle claim winnings
   */
  const handleClaim = async (betId: string) => {
    const bet = userBets.find(b => b.id === betId);
    if (!bet) return;

    try {
      const marketId = parseInt(bet.predictionId);

      // Call smart contract
      const result = await contract.claimWinnings(marketId);

      if (!result.success || !result.txHash) {
        throw new Error('Transaction failed');
      }

      // Refresh bets
      await fetchUserBets();

      alert(`Winnings claimed! Amount: ${result.amount} BNB`);
    } catch (err: any) {
      console.error('Claim failed:', err);
      alert(getErrorMessage(err));
    }
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

                      {/* Action Buttons */}
                      <div className="ml-4 flex-shrink-0 flex flex-col gap-2">
                        {/* Reveal button for unrevealed bets */}
                        {!bet.revealed && hasUnrevealedCommit(bet.predictionId) && (
                          <Button
                            onClick={() => handleRevealClick(bet.predictionId)}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white"
                            size="sm"
                            disabled={!canReveal(prediction.expiresAt)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            {t('reveal')}
                          </Button>
                        )}
                        
                        {/* Claim button for resolved winning bets */}
                        {canClaim ? (
                          <Button
                            onClick={() => handleClaim(bet.id)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                            size="sm"
                            disabled={contract.loading}
                          >
                            <DollarSign className="h-4 w-4 mr-2" />
                            {t('claim')}
                          </Button>
                        ) : bet.claimed ? (
                          <Badge variant="success" className="bg-green-600 text-white">{t('claimed')}</Badge>
                        ) : !bet.revealed ? (
                          <Badge variant="secondary" className="bg-gray-600 text-white">Unrevealed</Badge>
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

      {/* Reveal Modal */}
      {selectedBet && (
        <RevealModal
          open={showRevealModal}
          onOpenChange={setShowRevealModal}
          prediction={selectedBet.prediction}
          commitData={selectedBet.commitData}
          onConfirm={handleRevealConfirm}
        />
      )}

      {/* Transaction Status */}
      {contract.txStatus !== 'idle' && (
        <TransactionStatus
          status={contract.txStatus}
          txHash={contract.txHash}
          error={contract.error}
          showDialog={true}
          onClose={contract.resetTxState}
        />
      )}

      {/* Error Banner */}
      {error && !loading && (
        <div className="fixed bottom-4 right-4 z-50">
          <Card className="bg-red-500/20 border-red-500 max-w-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <p className="text-red-900 font-medium text-sm">{error}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

