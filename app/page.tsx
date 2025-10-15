'use client';

import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PredictionCard } from '@/components/prediction/prediction-card';
import { Filters } from '@/components/prediction/filters';
import { CreateBetModal } from '@/components/prediction/create-bet-modal';
import { BetModal } from '@/components/prediction/bet-modal';
import {
  CryptoPredictionModal,
  CryptoPredictionData,
} from '@/components/prediction/crypto-prediction-modal';
import { TransactionHistoryModal } from '@/components/prediction/transaction-history-modal';
import { Particles } from '@/components/ui/particles';
import { ShimmeringText } from '@/components/ui/shimmering-text';
import { AppleHelloEffect } from '@/components/ui/apple-hello-effect';
import { InteractiveGridPattern } from '@/components/ui/interactive-grid-pattern';
import { TransactionStatus } from '@/components/ui/transaction-status';
import {
  Prediction,
  FilterOptions,
  CreatePredictionData,
  PredictionCategory,
  PredictionStatus,
} from '@/types/prediction';
import {
  Plus,
  TrendingUp,
  Users,
  Clock,
  Zap,
  Star,
  Trophy,
  Flame,
  Target,
  BarChart3,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Eye,
  Shield,
  Lock,
  Loader2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { AnimatedButton } from '@/components/ui/animated-button';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { useI18n } from '@/components/providers/privy-provider';
import { cn } from '@/lib/utils';
import { api, getErrorMessage } from '@/lib/api-client';
import { usePredictionContract } from '@/lib/hooks/use-prediction-contract';
import { generateCommit, storeCommitSecret } from '@/lib/commit-reveal';
import { mapCategory, mapStatus, calculatePrice } from '@/lib/blockchain-utils';
import { ethers } from 'ethers';

export default function HomePage() {
  const { t } = useI18n();
  const { authenticated, user } = usePrivy();
  const contract = usePredictionContract();

  // Data state
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [filters, setFilters] = useState<FilterOptions>({});

  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCryptoModal, setShowCryptoModal] = useState(false);
  const [showBetModal, setShowBetModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedPrediction, setSelectedPrediction] =
    useState<Prediction | null>(null);
  const [selectedOutcome, setSelectedOutcome] = useState<'yes' | 'no'>('yes');
  const [selectedHistoryPrediction, setSelectedHistoryPrediction] =
    useState<string>('');

  // User bets tracking
  const [userBets, setUserBets] = useState<{
    [predictionId: string]: { outcome: 'yes' | 'no'; shares: number };
  }>({});

  // Client-only mounted state (fixes hydration errors for random animations)
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /**
   * Fetch markets from backend API
   */
  const fetchMarkets = async () => {
    setLoading(true);
    setError(undefined);

    try {
      const response = await api.markets.getMarkets({
        status: filters.status,
        category: filters.category,
      });

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch markets');
      }

      // Map backend data to frontend Prediction format
      const mappedPredictions: Prediction[] = response.data.map(
        (market: any) => ({
          id: market.marketId.toString(),
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
          isHot:
            market.participants > 10 ||
            parseFloat(ethers.formatEther(market.totalPool || '0')) > 1,
          outcome:
            market.outcome === true
              ? 'yes'
              : market.outcome === false
                ? 'no'
                : undefined,
          resolutionReasoning: market.resolutionReasoning,
        })
      );

      setPredictions(mappedPredictions);
    } catch (err: any) {
      console.error('Failed to fetch markets:', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch markets on mount and when filters change
   */
  useEffect(() => {
    fetchMarkets();
  }, [filters.status, filters.category]);

  /**
   * Filter predictions locally (for client-side filters)
   */
  const filteredPredictions = predictions.filter(prediction => {
    if (filters.isHot && !prediction.isHot) return false;
    if (filters.timeRange) {
      const now = Date.now();
      const timeRanges = {
        '24h': 86400000,
        '7d': 86400000 * 7,
        '30d': 86400000 * 30,
      };
      const timeRange =
        timeRanges[filters.timeRange as keyof typeof timeRanges];
      if (timeRange && prediction.createdAt < now - timeRange) return false;
    }
    return true;
  });

  /**
   * Open bet modal
   */
  const handleBetClick = (predictionId: string, outcome: 'yes' | 'no') => {
    const prediction = predictions.find(p => p.id === predictionId);
    if (!prediction) return;

    if (!authenticated) {
      alert('Please connect your wallet to place a bet');
      return;
    }

    setSelectedPrediction(prediction);
    setSelectedOutcome(outcome);
    setShowBetModal(true);
  };

  const handleViewHistory = (predictionId: string) => {
    setSelectedHistoryPrediction(predictionId);
    setShowHistoryModal(true);
  };

  /**
   * Place a bet (commit)
   */
  const handleBetConfirm = async (amount: number) => {
    if (!selectedPrediction || !user?.wallet?.address) {
      throw new Error('Missing prediction or wallet');
    }

    try {
      const userAddress = user.wallet.address;
      const marketId = parseInt(selectedPrediction.id);

      // Generate commit hash and salt
      const { commitHash, salt } = generateCommit(selectedOutcome, userAddress);

      // Call smart contract
      const result = await contract.commitBet(
        marketId,
        commitHash,
        amount.toString()
      );

      if (!result.success || !result.txHash) {
        throw new Error('Transaction failed');
      }

      // Store commit secret locally
      const commitData = {
        commitHash,
        salt,
        outcome: selectedOutcome,
        amount: ethers.parseEther(amount.toString()).toString(),
        timestamp: Date.now(),
      };
      storeCommitSecret(selectedPrediction.id, commitData);

      // Call backend API to index the bet
      await api.markets.commitBet(selectedPrediction.id, {
        userAddress,
        commitHash,
        amount: ethers.parseEther(amount.toString()).toString(),
        txHash: result.txHash,
      });

      // Refresh markets
      await fetchMarkets();

      alert(
        'Bet placed successfully! Remember to reveal after market expiration.'
      );
    } catch (err: any) {
      console.error('Bet failed:', err);
      throw new Error(getErrorMessage(err));
    }
  };

  /**
   * Handle create prediction
   */
  const handleCreatePrediction = async (data: CreatePredictionData) => {
    if (!authenticated || !user?.wallet?.address) {
      alert('Please connect your wallet to create a prediction');
      return;
    }

    try {
      const userAddress = user.wallet.address;
      const category = [
        'sports',
        'crypto',
        'politics',
        'entertainment',
        'weather',
        'finance',
        'technology',
        'custom',
      ].indexOf(data.category);
      const expiresAtTimestamp = Math.floor(data.expiresAt / 1000); // Convert to seconds

      // Call smart contract to create market
      const result = await contract.createMarket(
        data.title,
        data.description,
        data.summary || data.description,
        data.resolutionInstructions || '',
        category,
        expiresAtTimestamp,
        data.bnbAmount.toString()
      );

      if (!result.success || !result.txHash) {
        // Get the actual error from the contract hook
        const actualError = contract.error || 'Transaction failed';
        console.error('Contract error:', contract.error);
        throw new Error(actualError);
      }

      // Call backend API to index the market
      await api.markets.createMarket({
        title: data.title,
        description: data.description,
        category: data.category,
        expiresAt: data.expiresAt,
        initialLiquidity: ethers
          .parseEther(data.bnbAmount.toString())
          .toString(),
        userAddress,
        txHash: result.txHash,
      });

      // Refresh markets
      await fetchMarkets();

      setShowCreateModal(false);
      alert('Prediction created successfully!');
    } catch (err: any) {
      console.error('Create prediction failed:', err);
      alert(getErrorMessage(err));
    }
  };

  /**
   * Handle create crypto prediction
   */
  const handleCreateCryptoPrediction = async (data: CryptoPredictionData) => {
    if (!authenticated || !user?.wallet?.address) {
      alert('Please connect your wallet to create a prediction');
      return;
    }

    try {
      const userAddress = user.wallet.address;
      const category = 7; // Crypto category
      const expiresAtTimestamp = Math.floor(data.deadline / 1000); // Convert to seconds

      // Call smart contract to create market
      const result = await contract.createMarket(
        data.title,
        data.description,
        data.description, // Use description as summary
        '', // No resolution instructions for auto-verified
        category,
        expiresAtTimestamp,
        '0' // No initial liquidity for crypto predictions
      );

      if (!result.success || !result.txHash) {
        const actualError = contract.error || 'Transaction failed';
        console.error('Contract error:', contract.error);
        throw new Error(actualError);
      }

      // Call backend API to index the market
      await api.markets.createMarket({
        title: data.title,
        description: data.description,
        category: 'crypto',
        expiresAt: data.deadline,
        initialLiquidity: '0',
        userAddress,
        txHash: result.txHash,
      });

      // Refresh markets
      await fetchMarkets();

      setShowCryptoModal(false);
      alert('Crypto prediction created successfully!');
    } catch (err: any) {
      console.error('Create crypto prediction failed:', err);
      alert(getErrorMessage(err));
    }
  };

  /**
   * Calculate stats
   */
  const stats = {
    totalPredictions: predictions.length,
    activePredictions: predictions.filter(p => p.status === 'active').length,
    totalVolume: predictions.reduce((sum, p) => sum + p.totalPool, 0),
    totalParticipants: predictions.reduce((sum, p) => sum + p.participants, 0),
  };

  return (
    <div className="relative overflow-hidden">
      {/* Page-specific background */}
      <AnimatedBackground variant="grid" />

      <style jsx>{`
        @keyframes riseUp {
          0% {
            transform: translateY(100vh);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-100vh);
            opacity: 0;
          }
        }
        .dust-particle {
          position: absolute;
          background-color: #000000;
          border-radius: 50%;
          animation: riseUp linear infinite;
        }

        @keyframes boldPulse {
          0%,
          100% {
            transform: scale(1);
            text-shadow:
              0 0 20px rgba(0, 0, 0, 0.3),
              0 0 40px rgba(0, 0, 0, 0.2);
          }
          50% {
            transform: scale(1.05);
            text-shadow:
              0 0 30px rgba(0, 0, 0, 0.5),
              0 0 60px rgba(0, 0, 0, 0.3),
              0 0 80px rgba(0, 0, 0, 0.2);
          }
        }

        @keyframes slideInScale {
          0% {
            transform: translateY(-20px) scale(0.9);
            opacity: 0;
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        @keyframes greenGlow {
          0%,
          100% {
            box-shadow:
              0 0 10px 3px #00ff00,
              0 0 20px 5px #00ff00,
              inset 0 0 10px rgba(0, 255, 0, 0.3);
          }
          50% {
            box-shadow:
              0 0 20px 5px #00ff00,
              0 0 40px 10px #00ff00,
              inset 0 0 20px rgba(0, 255, 0, 0.5);
          }
        }

        .rotating-border-btn,
        button.rotating-border-btn {
          border: 5px solid #00ff00 !important;
          outline: 3px solid #00ff00 !important;
          outline-offset: 3px !important;
          animation: greenGlow 1.5s ease-in-out infinite !important;
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease,
            background 0.25s ease !important;
        }

        .rotating-border-btn:hover,
        button.rotating-border-btn:hover {
          transform: scale(1.06) !important;
          background: #111111 !important;
          box-shadow:
            0 0 35px 10px #00ff00,
            0 0 70px 18px #00ff00,
            inset 0 0 35px rgba(0, 255, 0, 0.65) !important;
        }

        .bold-title {
          animation:
            slideInScale 0.8s ease-out,
            boldPulse 3s ease-in-out infinite;
          font-weight: 900;
          letter-spacing: -0.02em;
        }

        /* Neon green (brighter) border wrapper */
        @keyframes neonPulse {
          0%,
          100% {
            box-shadow:
              0 0 10px #39ff14,
              0 0 22px rgba(57, 255, 20, 0.5);
          }
          50% {
            box-shadow:
              0 0 16px #39ff14,
              0 0 30px rgba(57, 255, 20, 0.65);
          }
        }
        .neon-border {
          position: relative;
          display: inline-block;
        }
        .neon-border::before {
          content: '';
          position: absolute;
          top: -6px;
          left: -6px;
          right: -6px;
          bottom: -6px;
          border-radius: 0.75rem; /* match/extend button rounding */
          border: 3px solid #39ff14; /* toned-down neon green */
          box-shadow:
            0 0 12px #39ff14,
            0 0 24px rgba(57, 255, 20, 0.55);
          pointer-events: none;
          animation: neonPulse 2.2s ease-in-out infinite;
          transition: box-shadow 160ms ease;
        }
        .neon-border:hover::before {
          box-shadow:
            0 0 18px #39ff14,
            0 0 36px rgba(57, 255, 20, 0.75);
        }
      `}</style>

      {/* Rising dust on left side - Client-only to prevent hydration errors */}
      {mounted && (
        <div className="pointer-events-none fixed bottom-0 left-0 top-0 z-[1] w-64 overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={`left-${i}`}
              className="dust-particle"
              style={{
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                animationDuration: `${Math.random() * 10 + 15}s`,
                animationDelay: `${Math.random() * 20}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Rising dust on right side - Client-only to prevent hydration errors */}
      {mounted && (
        <div className="pointer-events-none fixed bottom-0 right-0 top-0 z-[1] w-64 overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={`right-${i}`}
              className="dust-particle"
              style={{
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                animationDuration: `${Math.random() * 10 + 15}s`,
                animationDelay: `${Math.random() * 20}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Hero Section */}
      <HeroSection
        onCreateClick={() => setShowCreateModal(true)}
        onCryptoClick={() => setShowCryptoModal(true)}
      />

      {/* Error Banner */}
      {error && (
        <div className="relative z-10 mx-auto mb-6 max-w-7xl px-6 lg:px-8">
          <Card className="border-red-500/50 bg-red-900/30 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <p className="font-medium text-red-100">{error}</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={fetchMarkets}
                  className="ml-auto border-red-400/70 bg-red-500/10 text-red-100 hover:border-red-400 hover:bg-red-500/30"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* All Markets Section */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-16 lg:px-8">
        <div className="space-y-6">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-yellow-400" />
              <h2 className="font-heading text-2xl text-white">All Markets</h2>
              <Badge
                variant="outline"
                className="border-yellow-400/50 bg-yellow-400/10 text-yellow-400"
              >
                {filteredPredictions.length} markets
              </Badge>
            </div>
          </div>

          {/* Filters */}
          <Filters
            filters={filters}
            onFiltersChange={setFilters}
            totalCount={filteredPredictions.length}
          />

          {/* Markets Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-yellow-400" />
            </div>
          ) : filteredPredictions.length === 0 ? (
            <Card className="border-gray-700/50 bg-gray-900/60 py-12 text-center backdrop-blur-sm">
              <CardContent>
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full border border-yellow-400/30 bg-yellow-400/20">
                  <TrendingUp className="h-12 w-12 text-yellow-400" />
                </div>
                <h3 className="font-heading mb-2 text-lg text-white">
                  {t('no_predictions_found')}
                </h3>
                <p className="mb-4 text-gray-300">
                  {t('try_adjusting_filters')}
                </p>
                <Button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-yellow-400 text-black hover:bg-yellow-500"
                  disabled={!authenticated}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {t('create_first_prediction')}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPredictions.map((prediction, index) => (
                <AnimatedCard
                  key={prediction.id}
                  delay={index * 0.1}
                  className="p-0"
                >
                  <PredictionCard
                    prediction={prediction}
                    onBet={handleBetClick}
                    onViewHistory={handleViewHistory}
                    userBets={userBets}
                  />
                </AnimatedCard>
              ))}
            </div>
          )}
        </div>

        {/* Completed Predictions Section */}
        {predictions.filter(
          p => p.status === 'resolved' || p.status === 'cancelled'
        ).length > 0 && (
          <div className="mt-12">
            <div className="mb-6 flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-400" />
              <h2 className="font-heading text-2xl text-white">
                Completed Predictions
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {predictions
                .filter(
                  p => p.status === 'resolved' || p.status === 'cancelled'
                )
                .map((prediction, index) => (
                  <AnimatedCard
                    key={prediction.id}
                    delay={index * 0.1}
                    className="p-0"
                  >
                    <PredictionCard
                      prediction={prediction}
                      onBet={handleBetClick}
                      onViewHistory={handleViewHistory}
                      userBets={userBets}
                    />
                  </AnimatedCard>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Create Prediction Modal */}
      <CreateBetModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSubmit={handleCreatePrediction}
      />

      {/* Crypto Prediction Modal */}
      <CryptoPredictionModal
        open={showCryptoModal}
        onOpenChange={setShowCryptoModal}
        onSubmit={handleCreateCryptoPrediction}
      />

      {/* Bet Modal */}
      {selectedPrediction && (
        <BetModal
          open={showBetModal}
          onOpenChange={setShowBetModal}
          prediction={selectedPrediction}
          outcome={selectedOutcome}
          onConfirm={handleBetConfirm}
        />
      )}

      {/* Transaction History Modal */}
      <TransactionHistoryModal
        open={showHistoryModal}
        onOpenChange={setShowHistoryModal}
        predictionId={selectedHistoryPrediction}
        predictionTitle={
          predictions.find(p => p.id === selectedHistoryPrediction)?.title || ''
        }
      />

      {/* Transaction Status (from contract hook) */}
      {contract.txStatus !== 'idle' && (
        <TransactionStatus
          status={contract.txStatus}
          txHash={contract.txHash}
          error={contract.error}
          showDialog={true}
          onClose={contract.resetTxState}
        />
      )}
    </div>
  );
}
