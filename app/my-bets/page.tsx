'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  UserBet,
  Prediction,
  PredictionCategory,
  PredictionStatus,
} from '@/types/prediction';
import { formatBNB, formatTimeRemaining, calculatePayout } from '@/lib/utils';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Clock,
  DollarSign,
  Eye,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { StatsDashboard } from '@/components/ui/stats-dashboard';
import { PerformanceChart } from '@/components/ui/performance-chart';
import { cn } from '@/lib/utils';
import { useI18n } from '@/components/providers/i18n-provider';
import { api, getErrorMessage } from '@/lib/api-client';
import { usePredictionContract } from '@/lib/hooks/use-prediction-contract';
import {
  getCommitSecret,
  hasUnrevealedCommit,
  canReveal,
  clearCommitSecret,
} from '@/lib/commit-reveal';
import { RevealModal } from '@/components/prediction/reveal-modal';
import { TransactionStatus } from '@/components/ui/transaction-status';
import { mapCategory, mapStatus, calculatePrice } from '@/lib/blockchain-utils';
import { ethers } from 'ethers';

export default function MyBetsPage() {
  const { t } = useI18n();
  const { authenticated, user } = usePrivy();
  const { wallets } = useWallets();
  const contract = usePredictionContract();
  const router = useRouter();

  // Data state
  const [userBets, setUserBets] = useState<UserBet[]>([]);
  const [marketsCreated, setMarketsCreated] = useState<any[]>([]);
  const [predictions, setPredictions] = useState<{ [id: string]: Prediction }>(
    {}
  );
  const [activeTab, setActiveTab] = useState<'active' | 'resolved' | 'all'>(
    'all'
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [refundChecks, setRefundChecks] = useState<{
    [betId: string]: { available: boolean; reason?: string; amount?: string };
  }>({});

  // Reveal modal state
  const [showRevealModal, setShowRevealModal] = useState(false);
  const [selectedBet, setSelectedBet] = useState<{
    prediction: Prediction;
    commitData: any;
  } | null>(null);

  // Claim modal state
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimBet, setClaimBet] = useState<{
    bet: UserBet;
    prediction: Prediction;
    type: 'winnings' | 'refund';
    amount: number;
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
      const bets: UserBet[] = (response.data?.bets || []).map((bet: any) => {
        const isRevealed = bet.type === 'bet' && bet.outcome !== undefined;
        return {
          id: bet.txHash || `${bet.marketId}-${Date.now()}`,
          predictionId: bet.marketId.toString(),
          user: response.data?.address || user?.wallet?.address || '',
          outcome: isRevealed ? (bet.outcome ? 'yes' : 'no') : 'unknown',
          shares: bet.shares ? parseFloat(ethers.formatEther(bet.shares)) : 0,
          amount: parseFloat(ethers.formatEther(bet.amount)),
          price: 0, // Would calculate from market data
          createdAt: new Date(
            isRevealed ? bet.revealedAt : bet.timestamp
          ).getTime(),
          claimed: bet.claimed || false,
          payout: undefined, // Calculate from market if claimed
          revealed: isRevealed,
        };
      });

      setUserBets(bets);

      // Fetch associated market data
      const marketIds = Array.from(new Set(bets.map(b => b.predictionId)));
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
            category: mapCategory(market.category) as PredictionCategory,
            status: mapStatus(market.status) as PredictionStatus,
            createdAt: new Date(market.createdAt).getTime(),
            expiresAt: new Date(market.expiresAt).getTime(),
            creator: market.creator,
            totalPool: parseFloat(ethers.formatEther(market.totalPool || '0')),
            yesPool: parseFloat(ethers.formatEther(market.yesPool || '0')),
            noPool: parseFloat(ethers.formatEther(market.noPool || '0')),
            yesPrice: calculatePrice(
              market.yesPool || '0',
              market.totalPool || '1'
            ),
            noPrice: calculatePrice(
              market.noPool || '0',
              market.totalPool || '1'
            ),
            totalShares:
              parseFloat(ethers.formatEther(market.yesShares || '0')) +
              parseFloat(ethers.formatEther(market.noShares || '0')),
            yesShares: parseFloat(ethers.formatEther(market.yesShares || '0')),
            noShares: parseFloat(ethers.formatEther(market.noShares || '0')),
            participants: market.participants || 0,
            isHot: false,
            resolution:
              market.outcome !== undefined
                ? {
                    outcome: market.outcome === true ? 'yes' : 'no',
                    resolvedAt: new Date(
                      market.resolvedAt || Date.now()
                    ).getTime(),
                    reasoning: market.resolutionReasoning || 'Market resolved',
                    evidence: [],
                  }
                : undefined,
          };
        }
      }

      setPredictions(marketData);
    } catch (err: any) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to fetch user bets:', err);
      }
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch markets created by the user
   */
  const fetchUserBetsCreated = async () => {
    if (!user?.wallet?.address) return;

    try {
      const response = await api.users.getUserBetsCreated(user.wallet.address);

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch created markets');
      }

      console.log(
        `📊 Found ${response.data.totalMarketsCreated} markets created by user`
      );
      setMarketsCreated(response.data.markets || []);
    } catch (err: any) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to fetch user-created markets:', err);
      }
      // Don't show error to user, just log it
    }
  };

  useEffect(() => {
    if (authenticated && user?.wallet?.address) {
      fetchUserBets();
      fetchUserBetsCreated();
    }
  }, [authenticated, user?.wallet?.address]);

  // Redirect unauthenticated users to home and render nothing
  useEffect(() => {
    if (!authenticated) {
      router.replace('/');
    }
  }, [authenticated, router]);

  /**
   * Check refund availability for all unrevealed bets
   */
  const checkAllRefunds = async () => {
    if (!contract.checkRefundAvailability) return;

    const unrevealedBets = userBets.filter(bet => !bet.revealed);
    const checks: {
      [betId: string]: { available: boolean; reason?: string; amount?: string };
    } = {};

    for (const bet of unrevealedBets) {
      try {
        const marketId = parseInt(bet.predictionId);
        const result = await contract.checkRefundAvailability(marketId);
        checks[bet.id] = result;
      } catch (error) {
        console.error(`Failed to check refund for bet ${bet.id}:`, error);
        checks[bet.id] = { available: false, reason: 'Check failed' };
      }
    }

    setRefundChecks(checks);
  };

  // Check refunds when bets are loaded
  useEffect(() => {
    if (
      userBets.length > 0 &&
      typeof contract.checkRefundAvailability === 'function'
    ) {
      checkAllRefunds();
    }
  }, [userBets, contract.checkRefundAvailability]);

  // Auto-trigger resolution for expired markets (with debounce to avoid spam)
  useEffect(() => {
    if (userBets.length > 0) {
      const expiredBets = userBets.filter(bet => {
        const prediction = predictions[bet.predictionId];
        if (!prediction) return false;
        const isExpired = new Date().getTime() > prediction.expiresAt;
        const isRevealed = bet.revealed || bet.outcome !== 'unknown';
        return isExpired && isRevealed && prediction.status !== 'resolved';
      });

      if (expiredBets.length > 0) {
        console.log(
          '🕐 Found expired bets, triggering instant resolution...',
          expiredBets.length
        );
        // Debounce to avoid multiple rapid calls
        const timeoutId = setTimeout(() => {
          triggerMarketResolution();
        }, 2000); // Wait 2 seconds before triggering

        return () => clearTimeout(timeoutId);
      }
    }
  }, [userBets, predictions]);

  // Real-time refresh every 10 seconds to show updates without being intrusive
  useEffect(() => {
    const interval = setInterval(() => {
      if (authenticated && user?.wallet?.address) {
        fetchUserBets();
        fetchUserBetsCreated();
      }
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, [authenticated, user?.wallet?.address]);

  /**
   * Test backend connection
   */
  const testBackendConnection = async () => {
    // Debug function removed for production safety
  };

  /**
   * Test wallet connection
   */
  const testWalletConnection = async () => {
    // Debug function removed for production safety
  };

  /**
   * Manually trigger market resolution
   */
  const triggerMarketResolution = async () => {
    try {
      const response = await fetch('/api/markets/trigger-resolution', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminKey: process.env.NEXT_PUBLIC_ADMIN_KEY || 'admin123', // You might want to use a proper admin key
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend response error:', response.status, errorText);
        console.error(`Backend error (${response.status}): ${errorText}`);
        return;
      }

      const result = await response.json();

      if (result.success) {
        console.log('✅ Market resolution triggered successfully');
        // Silently refresh data without page reload
        await fetchUserBets();
      } else {
        console.error(`❌ Failed to trigger resolution: ${result.error}`);
      }
    } catch (error: any) {
      console.error('Failed to trigger resolution:', error);
    }
  };

  /**
   * Manually resolve market 6 (Bitcoin prediction)
   */
  const manualResolveMarket6 = async () => {
    try {
      console.log('🔄 Manually resolving market 6...');

      const response = await fetch('/api/markets/resolve-market', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminKey: 'admin123',
          marketId: 6,
          outcome: true, // Bitcoin reached the target price
          reasoning: 'Manual resolution - Bitcoin price check',
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        console.log('✅ Market 6 resolved successfully:', result);
        // Refresh bets after a short delay
        setTimeout(() => {
          fetchUserBets();
        }, 2000);
      } else {
        console.error('❌ Failed to resolve market 6:', result);
      }
    } catch (error: any) {
      console.error('❌ Error resolving market 6:', error);
    }
  };

  /**
   * Switch to BSC Testnet
   */
  const switchToBSC = async () => {
    if (!wallets || wallets.length === 0) {
      console.info('No wallet found');
      return;
    }

    const wallet = wallets[0];
    console.log('🔄 Switching to BSC Testnet...', {
      currentChainId: wallet.chainId,
    });

    try {
      // Try Privy's switchChain method
      if (typeof wallet.switchChain === 'function') {
        await wallet.switchChain(97);
        console.log('✅ Switched via Privy');
        console.info('Switched to BSC Testnet!');
        return;
      }

      // Fallback to window.ethereum
      if (typeof window !== 'undefined' && window.ethereum) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x61' }],
        });
        console.log('✅ Switched via window.ethereum');
        console.info('Switched to BSC Testnet!');
        return;
      }

      console.info(
        'Unable to switch network. Please switch manually in your wallet.'
      );
    } catch (error: any) {
      console.error('Network switch failed:', error);
      if (error.code === 4902) {
        // Network not added, try to add it
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x61',
                chainName: 'BSC Testnet',
                nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
                rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
                blockExplorerUrls: ['https://testnet.bscscan.com/'],
              },
            ],
          });
          console.info('Added and switched to BSC Testnet!');
        } catch (addError: any) {
          console.error('Failed to add network:', addError);
          console.info(
            'Failed to add BSC Testnet. Please add it manually in your wallet.'
          );
        }
      } else {
        console.error(`Failed to switch network: ${error.message}`);
      }
    }
  };

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
      console.info(
        'Reveal data not found. Make sure you placed this bet on this device.'
      );
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

      // Wait for reveal to be processed on chain
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Get bet details from blockchain to get shares
      const chainBet = await contract.getUserBet(marketId, user.wallet.address);

      // Call backend API with correct parameters
      if (chainBet && chainBet.amount && chainBet.shares) {
        await api.markets.revealBet(selectedBet.prediction.id, {
          user: user.wallet.address,
          outcome: isYes,
          shares: chainBet.shares.toString(),
          amount: chainBet.amount.toString(),
          txHash: result.txHash,
        });
      } else {
        console.warn(
          'Could not fetch bet details from blockchain, using local data'
        );
        // Fallback to using local data (though shares won't be accurate)
        await api.markets.revealBet(selectedBet.prediction.id, {
          user: user.wallet.address,
          outcome: isYes,
          shares: '0', // We don't have shares locally
          amount: selectedBet.commitData.amount,
          txHash: result.txHash,
        });
      }

      // Clear local commit data
      clearCommitSecret(selectedBet.prediction.id);

      // Refresh bets
      await fetchUserBets();

      setShowRevealModal(false);
      console.info('Bet revealed successfully!');
    } catch (err: any) {
      console.error('Reveal failed:', err);
      console.error(getErrorMessage(err));
    }
  };

  /**
   * Handle claim button click - show confirmation modal
   */
  const handleClaimClick = (betId: string) => {
    const bet = userBets.find(b => b.id === betId);
    if (!bet) return;

    const prediction = predictions[bet.predictionId];
    if (!prediction) return;

    const isWinning = prediction.resolution?.outcome === bet.outcome;
    const canClaim =
      prediction.status === 'resolved' && isWinning && !bet.claimed;
    const canRefund =
      !bet.revealed &&
      (prediction.status === 'cancelled' ||
        (prediction.status === 'resolved' && !prediction.resolution));

    const claimType = canClaim ? 'winnings' : 'refund';
    const claimAmount = canClaim
      ? calculatePotentialPayout(bet, prediction)
      : bet.amount;

    setClaimBet({
      bet,
      prediction,
      type: claimType,
      amount: claimAmount,
    });
    setShowClaimModal(true);
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

      console.info(`Winnings claimed! Amount: ${result.amount} BNB`);
    } catch (err: any) {
      console.error('Claim failed:', err);
      console.error(getErrorMessage(err));
    }
  };

  /**
   * Handle claim refund for unrevealed bets
   */
  const handleRefund = async (betId: string) => {
    const bet = userBets.find(b => b.id === betId);
    if (!bet) return;

    try {
      const marketId = parseInt(bet.predictionId);

      // Check if contract is available
      if (!contract) {
        throw new Error(
          'Contract not available. Please refresh the page and try again.'
        );
      }

      // Call smart contract
      const result = await contract.claimRefund(marketId);

      if (!result.success || !result.txHash) {
        throw new Error('Transaction failed');
      }

      // Refresh bets
      await fetchUserBets();

      console.info(`Refund claimed! Amount: ${result.amount} BNB`);
    } catch (err: any) {
      console.error('Refund failed:', err);
      const errorMsg = getErrorMessage(err);
      console.error(`Refund failed: ${errorMsg}`);
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

  /**
   * Calculate potential payout for a bet
   */
  const calculatePotentialPayout = (
    bet: UserBet,
    prediction: Prediction
  ): number => {
    if (prediction.status !== 'resolved' || !prediction.resolution?.outcome)
      return 0;

    const isWinning = prediction.resolution.outcome === bet.outcome;
    if (!isWinning) return 0;

    const totalWinningShares =
      prediction.resolution.outcome === 'yes'
        ? prediction.yesShares
        : prediction.noShares;
    if (totalWinningShares === 0) return 0;

    // Calculate payout: (user shares / total winning shares) * total pool * 0.985 (1.5% platform fee)
    const grossPayout =
      (bet.shares / totalWinningShares) * prediction.totalPool;
    const platformFee = grossPayout * 0.015; // 1.5% platform fee
    return grossPayout - platformFee;
  };

  if (!authenticated) {
    return null;
  }

  const totalInvested = userBets.reduce((sum, bet) => sum + bet.amount, 0);
  const totalPayout = userBets.reduce((sum, bet) => sum + (bet.payout || 0), 0);
  const activeBets = userBets.filter(
    bet => predictions[bet.predictionId]?.status === 'active'
  ).length;
  const resolvedBets = userBets.filter(
    bet => predictions[bet.predictionId]?.status === 'resolved'
  ).length;

  /**
   * Generate real performance data based on user's betting history
   */
  const generatePerformanceData = () => {
    if (userBets.length === 0) {
      return [{ date: 'This Week', winnings: 0, bets: 0 }];
    }

    // Group bets by week
    const weeklyData: {
      [key: string]: { winnings: number; bets: number; weekStart: Date };
    } = {};

    userBets.forEach(bet => {
      const betDate = new Date(bet.createdAt);
      const weekStart = new Date(betDate);
      weekStart.setDate(betDate.getDate() - betDate.getDay()); // Start of week (Sunday)
      weekStart.setHours(0, 0, 0, 0);

      const weekKey = weekStart.toISOString().split('T')[0];

      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = { winnings: 0, bets: 0, weekStart };
      }

      weeklyData[weekKey].bets += 1;

      // Calculate winnings for resolved bets
      const prediction = predictions[bet.predictionId];
      const isWinning = prediction?.resolution?.outcome === bet.outcome;
      if (prediction?.status === 'resolved' && isWinning) {
        const payout = bet.payout || 0;
        weeklyData[weekKey].winnings += payout;
      }
    });

    // Convert to array and sort by date
    const performanceData = Object.values(weeklyData)
      .sort((a, b) => a.weekStart.getTime() - b.weekStart.getTime())
      .map((data, index) => ({
        date:
          index === Object.keys(weeklyData).length - 1
            ? 'This Week'
            : `Week ${index + 1}`,
        winnings: data.winnings,
        bets: data.bets,
      }));

    // If we have data, ensure we show at least 4 weeks for better visualization
    if (performanceData.length > 0) {
      const currentWeek = performanceData[performanceData.length - 1];
      const weeksToShow = Math.max(4, performanceData.length);

      const result = [];
      for (let i = 0; i < weeksToShow; i++) {
        if (i < performanceData.length - 1) {
          result.push(performanceData[i]);
        } else if (i === performanceData.length - 1) {
          result.push(currentWeek);
        } else {
          // Fill in empty weeks with zero data
          result.push({
            date: `Week ${i + 1}`,
            winnings: 0,
            bets: 0,
          });
        }
      }
      return result;
    }

    return performanceData;
  };

  return (
    <div className="relative min-h-screen">
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg border border-yellow-400/30 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 p-2">
              <Wallet className="h-6 w-6 text-yellow-400" />
            </div>
            <h1 className="font-display text-4xl text-white">
              {t('my_bets.title')}
            </h1>
          </div>
          <p className="font-body text-gray-300">{t('my_bets.subtitle')}</p>

          {/* Connection Status */}
          {/* <div className="mt-4 rounded-xl border border-gray-700/50 bg-gray-900/60 p-3 backdrop-blur-sm sm:p-4"> */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
              {/*
              <Button
                onClick={switchToBSC}
                size="sm"
                className="bg-purple-600 text-white hover:bg-purple-700"
              >
                Switch to BSC
              </Button>
              <Button
                onClick={triggerMarketResolution}
                size="sm"
                className="bg-orange-600 text-white hover:bg-orange-700"
              >
                Resolve Markets
              </Button>
              <Button
                onClick={manualResolveMarket6}
                size="sm"
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Resolve Market 6
              </Button>
              */}
            </div>
          </div>
        </div>

        {/* Stats Dashboard */}
        <StatsDashboard
          totalBets={userBets.length}
          totalWinnings={totalPayout}
          winRate={
            resolvedBets > 0
              ? (userBets.filter(bet => {
                  const prediction = predictions[bet.predictionId];
                  return (
                    prediction?.status === 'resolved' &&
                    prediction.resolution?.outcome === bet.outcome
                  );
                }).length /
                  resolvedBets) *
                100
              : 0
          }
          activeBets={activeBets}
        />

        {/* Performance Chart */}
        <div className="mb-8">
          <PerformanceChart data={generatePerformanceData()} type="area" />
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-black">
            <nav className="-mb-px flex flex-wrap sm:space-x-8">
              {[
                {
                  key: 'all',
                  label: t('my_bets.all_bets'),
                  count: userBets.length,
                },
                {
                  key: 'active',
                  label: t('my_bets.active'),
                  count: activeBets,
                },
                {
                  key: 'resolved',
                  label: t('my_bets.resolved_bets'),
                  count: resolvedBets,
                },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={cn(
                    'whitespace-nowrap border-b-2 px-1 py-2 text-sm font-medium transition-all duration-300',
                    activeTab === tab.key
                      ? 'border-yellow-400 text-yellow-400'
                      : 'border-transparent text-white/60 hover:border-yellow-400/50 hover:text-yellow-300'
                  )}
                >
                  {tab.label}
                  <Badge
                    variant="secondary"
                    className="ml-2 bg-black/90 text-white"
                  >
                    {tab.count}
                  </Badge>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Bets List */}
        {filteredBets.length === 0 ? (
          <Card className="border-black bg-black/90 py-12 text-center">
            <CardContent>
              <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-yellow-500">
                <TrendingUp className="h-12 w-12 text-black" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-white">
                {t('my_bets.no_bets_found')}
              </h3>
              <p className="mb-4 text-gray-200">
                {activeTab === 'all'
                  ? t('my_bets.no_bets_yet')
                  : activeTab === 'active'
                    ? t('my_bets.no_active_bets')
                    : t('my_bets.no_resolved_bets')}
              </p>
              <Button
                className="bg-white text-black hover:bg-gray-200"
                onClick={() => router.push('/#all-markets')}
              >
                {t('my_bets.explore_markets')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBets.map(bet => {
              const prediction = predictions[bet.predictionId];
              if (!prediction) return null;

              const OutcomeIcon =
                bet.outcome === 'unknown'
                  ? Clock
                  : getOutcomeIcon(bet.outcome as 'yes' | 'no');
              const isWinning = prediction.resolution?.outcome === bet.outcome;
              const isExpired = new Date().getTime() > prediction.expiresAt;

              // Check if bet is revealed (use revealed property or check outcome)
              const isRevealed = bet.revealed || bet.outcome !== 'unknown';

              // Can claim winnings if: resolved + won + not claimed + revealed
              const canClaim =
                prediction.status === 'resolved' &&
                isWinning &&
                !bet.claimed &&
                isRevealed;

              // Check refund availability from smart contract
              const refundCheck = refundChecks[bet.id];
              const canRefund = !isRevealed && refundCheck?.available === true;

              // Check if user can claim winnings (revealed + won + resolved + not claimed)
              const canClaimWinnings =
                isRevealed &&
                prediction.status === 'resolved' &&
                isWinning &&
                !bet.claimed;

              // Check if user lost the bet (revealed + resolved + not winning)
              const hasLost =
                isRevealed && prediction.status === 'resolved' && !isWinning;

              // Check if bet is waiting for resolution (revealed + not resolved yet)
              const waitingForResolution =
                isRevealed && prediction.status !== 'resolved';

              // Determine if user can claim anything (winnings or refund)
              const canClaimAnything = canClaim || canRefund;
              const claimType = canClaim ? 'winnings' : 'refund';
              const claimAmount = canClaim
                ? calculatePotentialPayout(bet, prediction)
                : refundCheck?.amount
                  ? parseFloat(refundCheck.amount)
                  : bet.amount;

              // Debug logging (development only)
              if (process.env.NODE_ENV === 'development') {
                console.log('Bet Debug:', {
                  betId: bet.id,
                  predictionId: bet.predictionId,
                  outcome: bet.outcome,
                  revealed: bet.revealed,
                  isRevealed,
                  predictionStatus: prediction.status,
                  predictionOutcome: prediction.resolution?.outcome,
                  isWinning,
                  isExpired,
                  canClaim,
                  canRefund,
                  canClaimWinnings,
                  hasLost,
                  waitingForResolution,
                  canClaimAnything,
                  claimed: bet.claimed,
                  hasUnrevealedCommit: hasUnrevealedCommit(bet.predictionId),
                  canReveal: canReveal(prediction.expiresAt),
                });
              }

              return (
                <Card
                  key={bet.id}
                  className="h-full border-black bg-black/90 transition-shadow hover:shadow-lg"
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col gap-4">
                      <div className="w-full">
                        <div className="mb-2 flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="border-white text-white"
                          >
                            {prediction.category}
                          </Badge>
                          <Badge
                            variant={getStatusColor(prediction.status) as any}
                            className="bg-yellow-500 text-black"
                          >
                            {prediction.status}
                          </Badge>
                          {prediction.isHot && (
                            <Badge variant="warning">Hot</Badge>
                          )}
                        </div>

                        <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-white">
                          {prediction.title}
                        </h3>

                        <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-gray-300 sm:gap-4">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>
                              {prediction.status === 'active'
                                ? `${t('my_bets.expires_in')} ${formatTimeRemaining(prediction.expiresAt)}`
                                : `${t('my_bets.resolved_on')} ${new Date(prediction.resolution?.resolvedAt || prediction.expiresAt).toLocaleDateString()}`}
                            </span>
                          </div>
                          {bet.outcome !== 'unknown' && (
                            <div className="flex items-center gap-1">
                              <OutcomeIcon
                                className={cn(
                                  'h-4 w-4',
                                  bet.outcome === 'yes'
                                    ? 'text-green-400'
                                    : 'text-red-400'
                                )}
                              />
                              <span
                                className={
                                  bet.outcome === 'yes'
                                    ? 'text-green-400'
                                    : 'text-red-400'
                                }
                              >
                                {bet.outcome.toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Bet Details */}
                        <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-4">
                          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            <div>
                              <div className="font-caption mb-1 text-xs uppercase tracking-wide text-gray-400">
                                Shares
                              </div>
                              <div className="font-heading text-base text-white">
                                {bet.shares.toFixed(2)}
                              </div>
                            </div>
                            <div>
                              <div className="font-caption mb-1 text-xs uppercase tracking-wide text-gray-400">
                                Amount
                              </div>
                              <div className="font-heading text-base text-white">
                                {formatBNB(bet.amount)}
                              </div>
                            </div>
                            <div>
                              <div className="font-caption mb-1 text-xs uppercase tracking-wide text-gray-400">
                                Price
                              </div>
                              <div className="font-heading text-base text-white">
                                {formatBNB(bet.price)}
                              </div>
                            </div>
                            <div>
                              <div className="font-caption mb-1 text-xs uppercase tracking-wide text-gray-400">
                                Potential Payout
                              </div>
                              <div className="font-heading text-base text-green-400">
                                {prediction.status === 'resolved' &&
                                prediction.resolution?.outcome
                                  ? formatBNB(
                                      calculatePotentialPayout(bet, prediction)
                                    )
                                  : formatBNB(
                                      calculatePayout(
                                        bet.shares,
                                        bet.outcome === 'yes'
                                          ? prediction.yesShares
                                          : prediction.noShares,
                                        prediction.totalPool
                                      )
                                    )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Resolution Info */}
                        {prediction.status === 'resolved' &&
                          prediction.resolution?.outcome !== undefined && (
                            <div className="mt-4 rounded-lg border border-yellow-500/30 bg-yellow-500/20 p-3">
                              <div className="mb-1 text-sm font-medium text-white">
                                Resolution:{' '}
                                {prediction.resolution.outcome === 'yes'
                                  ? 'YES'
                                  : 'NO'}
                              </div>
                              {prediction.resolution?.reasoning && (
                                <div className="text-xs text-gray-200">
                                  {prediction.resolution.reasoning}
                                </div>
                              )}
                            </div>
                          )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2">
                        {/* Reveal button for unrevealed bets */}
                        {!isRevealed &&
                          hasUnrevealedCommit(bet.predictionId) &&
                          !isExpired && (
                            <Button
                              onClick={() =>
                                handleRevealClick(bet.predictionId)
                              }
                              className="bg-yellow-600 text-white hover:bg-yellow-700"
                              size="sm"
                              disabled={!canReveal(prediction.expiresAt)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              {t('reveal')}
                            </Button>
                          )}

                        {/* Unified Claim button for winnings or refunds */}
                        {canClaimAnything ? (
                          <Button
                            onClick={() => handleClaimClick(bet.id)}
                            className={
                              canClaim
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-orange-600 text-white hover:bg-orange-700'
                            }
                            size="sm"
                            disabled={contract.loading}
                          >
                            {contract.loading ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <DollarSign className="mr-2 h-4 w-4" />
                            )}
                            Claim{' '}
                            {claimType === 'winnings' ? 'Winnings' : 'Refund'} (
                            {formatBNB(claimAmount)} BNB)
                          </Button>
                        ) : bet.claimed ? (
                          <Badge
                            variant="success"
                            className="bg-green-600 text-white"
                          >
                            Claimed
                          </Badge>
                        ) : !isRevealed && isExpired ? (
                          <div className="flex flex-col gap-2">
                            <Badge
                              variant="warning"
                              className="bg-orange-600 text-white"
                            >
                              {refundCheck?.available
                                ? 'Refund Available'
                                : 'Expired'}
                            </Badge>
                            {refundCheck?.available && refundCheck?.reason && (
                              <div className="text-xs text-gray-300">
                                {refundCheck.reason}
                              </div>
                            )}
                            {refundCheck?.available ? (
                              <Button
                                onClick={() => handleClaimClick(bet.id)}
                                className="bg-orange-600 text-white hover:bg-orange-700"
                                size="sm"
                                disabled={contract.loading}
                              >
                                <DollarSign className="mr-2 h-4 w-4" />
                                Claim Refund
                              </Button>
                            ) : (
                              <Button
                                onClick={() => checkAllRefunds()}
                                className="bg-gray-600 text-white hover:bg-gray-700"
                                size="sm"
                              >
                                Check Refund
                              </Button>
                            )}
                          </div>
                        ) : !isRevealed ? (
                          <Badge
                            variant="secondary"
                            className="bg-gray-600 text-white"
                          >
                            Unrevealed
                          </Badge>
                        ) : waitingForResolution ? (
                          <Badge
                            variant="secondary"
                            className="bg-yellow-600 text-white"
                          >
                            Waiting for Resolution
                          </Badge>
                        ) : hasLost ? (
                          <Badge
                            variant="destructive"
                            className="bg-red-600 text-white"
                          >
                            Lost
                          </Badge>
                        ) : canClaimWinnings ? (
                          <div className="flex flex-col gap-2">
                            <Badge
                              variant="success"
                              className="bg-green-600 text-white"
                            >
                              Won - Can Claim
                            </Badge>
                            <Button
                              onClick={() => handleClaimClick(bet.id)}
                              className="bg-green-600 text-white hover:bg-green-700"
                              size="sm"
                              disabled={contract.loading}
                            >
                              <DollarSign className="mr-2 h-4 w-4" />
                              Claim Winnings
                            </Button>
                          </div>
                        ) : isWinning ? (
                          <div className="flex flex-col gap-2">
                            <Badge
                              variant="success"
                              className="bg-green-600 text-white"
                            >
                              Won
                            </Badge>
                            <Button
                              onClick={() => handleClaimClick(bet.id)}
                              className="bg-green-600 text-white hover:bg-green-700"
                              size="sm"
                              disabled={contract.loading}
                            >
                              <DollarSign className="mr-2 h-4 w-4" />
                              Try Claim
                            </Button>
                          </div>
                        ) : (
                          <Badge
                            variant="destructive"
                            className="bg-red-600 text-white"
                          >
                            Lost
                          </Badge>
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

      {/* Claim Confirmation Modal */}
      {claimBet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md border-black bg-black/90">
            <CardHeader>
              <CardTitle className="text-center text-white">
                {claimBet.type === 'winnings'
                  ? 'Claim Winnings'
                  : 'Claim Refund'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="mb-2 text-2xl font-bold text-yellow-400">
                  {formatBNB(claimBet.amount)} BNB
                </div>
                <p className="text-sm text-gray-300">
                  {claimBet.type === 'winnings'
                    ? 'You won this prediction! Claim your winnings.'
                    : 'This prediction expired. Get your refund.'}
                </p>
              </div>

              <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/20 p-3">
                <p className="text-sm text-yellow-200">
                  <strong>Note:</strong> You'll need to sign a transaction to{' '}
                  {claimBet.type === 'winnings'
                    ? 'claim your winnings'
                    : 'get your refund'}
                  .
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setShowClaimModal(false)}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setShowClaimModal(false);
                    if (claimBet.type === 'winnings') {
                      handleClaim(claimBet.bet.id);
                    } else {
                      handleRefund(claimBet.bet.id);
                    }
                  }}
                  className={`flex-1 ${
                    claimBet.type === 'winnings'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-orange-600 hover:bg-orange-700'
                  } text-white`}
                  disabled={contract.loading}
                >
                  {contract.loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <DollarSign className="mr-2 h-4 w-4" />
                  )}
                  {claimBet.type === 'winnings'
                    ? 'Claim Winnings'
                    : 'Claim Refund'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
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
          <Card className="max-w-md border-red-500 bg-red-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <p className="text-sm font-medium text-red-900">{error}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
