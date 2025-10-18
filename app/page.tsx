'use client';

import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { PredictionCard } from '@/components/prediction/prediction-card';
import { Filters } from '@/components/prediction/filters';
import { CreateBetModal } from '@/components/prediction/create-bet-modal';
import { BetModal } from '@/components/prediction/bet-modal';
import {
  CryptoPredictionModal,
  CryptoPredictionData,
} from '@/components/prediction/crypto-prediction-modal';
import {
  CreateEventPredictionModal,
  EventPredictionData,
} from '@/components/prediction/create-event-prediction-modal';
import { TransactionHistoryModal } from '@/components/prediction/transaction-history-modal';
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
  BarChart3,
  Loader2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { useI18n } from '@/components/providers/i18n-provider';
import { api, getErrorMessage } from '@/lib/api-client';
import { usePredictionContract } from '@/lib/hooks/use-prediction-contract';
import { generateCommit, storeCommitSecret } from '@/lib/commit-reveal';
import { mapCategory, mapStatus, calculatePrice } from '@/lib/blockchain-utils';
import { logger } from '@/lib/logger';
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
  const [showEventModal, setShowEventModal] = useState(false);
  const [showBetModal, setShowBetModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showOracleErrorModal, setShowOracleErrorModal] = useState(false);
  const [selectedPrediction, setSelectedPrediction] =
    useState<Prediction | null>(null);
  const [selectedOutcome, setSelectedOutcome] = useState<'yes' | 'no'>('yes');
  const [selectedHistoryPrediction, setSelectedHistoryPrediction] =
    useState<string>('');

  // User bets tracking
  const [userBets, setUserBets] = useState<{
    [predictionId: string]: { outcome: 'yes' | 'no'; shares: number };
  }>({});

  // Removed homepage background bubbles/dust; no mounted gating needed

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
      logger.error('Failed to fetch markets:', err);
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
      logger.user(t('errors.wallet_required'));
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
        user: userAddress, // Backend expects 'user', not 'userAddress'
        commitHash,
        amount: ethers.parseEther(amount.toString()).toString(),
        txHash: result.txHash,
      });

      // Refresh markets
      await fetchMarkets();

      logger.user(t('success.bet_placed'));
    } catch (err: any) {
      logger.error('Bet failed:', err);
      throw new Error(getErrorMessage(err));
    }
  };

  /**
   * Handle create prediction - Currently disabled, redirect to Crypto DarkPool
   */
  const handleCreatePrediction = async (data: CreatePredictionData) => {
    if (!authenticated || !user?.wallet?.address) {
      logger.user(t('errors.wallet_required'));
      return;
    }

    // Close the create modal and show oracle error modal
    setShowCreateModal(false);
    setShowOracleErrorModal(true);
  };

  /**
   * Handle create crypto prediction
   */
  const handleCreateCryptoPrediction = async (data: CryptoPredictionData) => {
    if (!authenticated || !user?.wallet?.address) {
      logger.user(t('errors.wallet_required'));
      return;
    }

    try {
      const userAddress = user.wallet.address;
      const category = 7; // Crypto category
      const expiresAtTimestamp = Math.floor(data.deadline / 1000); // Convert to seconds

      logger.blockchain('Creating crypto prediction with parameters:', {
        title: data.title,
        description: data.description,
        expiresAt: expiresAtTimestamp,
        category: category,
        currentTimestamp: Math.floor(Date.now() / 1000),
        timeUntilExpiry:
          (expiresAtTimestamp - Math.floor(Date.now() / 1000)) / 60,
      });

      // Call smart contract to create market
      const result = await contract.createMarket(
        data.title,
        data.description,
        '',
        '',
        category,
        expiresAtTimestamp,
        '0'
      );

      if (!result.success || !result.txHash) {
        const actualError = contract.error || 'Transaction failed';
        logger.error('Contract error:', contract.error);
        throw new Error(actualError);
      }

      // The backend will automatically index the market via blockchain event listener
      // Wait a moment for the event to be processed, then refresh markets
      setTimeout(async () => {
        await fetchMarkets();
      }, 2000);

      setShowCryptoModal(false);
      logger.user(t('success.crypto_prediction_created'));
    } catch (err: any) {
      logger.error('Create crypto prediction failed:', err);
    }
  };

  /**
   * Handle create event prediction
   */
  const handleCreateEventPrediction = async (data: EventPredictionData) => {
    if (!authenticated || !user?.wallet?.address) {
      logger.user(t('errors.wallet_required'));
      return;
    }

    try {
      const userAddress = user.wallet.address.toLowerCase();
      const expiresAtTimestamp = Math.floor(data.expiresAt.getTime() / 1000);

      logger.info('Creating event prediction:', {
        title: data.title,
        keywords: data.keywords,
        expiresAt: data.expiresAt.toISOString(),
      });

      // Step 1: Create market on blockchain
      const result = await contract.createMarket(
        data.title,
        data.description,
        '',
        '',
        parseInt(data.category),
        expiresAtTimestamp,
        ethers.parseEther(data.amount.toString()).toString()
      );

      if (!result.success || !result.txHash) {
        const actualError = contract.error || 'Transaction failed';
        logger.error('Contract error:', contract.error);
        throw new Error(actualError);
      }

      // Step 2: Extract market ID from blockchain event
      // The backend will sync this automatically, but we'll wait for it
      logger.info('Event prediction created on blockchain:', result.txHash);

      // Wait for backend to sync the market
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Step 3: Get the latest market ID (the backend will have created it)
      const marketsResponse = await api.markets.getMarkets({ limit: 1 });
      if (
        !marketsResponse.success ||
        !marketsResponse.data ||
        marketsResponse.data.length === 0
      ) {
        throw new Error('Failed to get market ID from backend');
      }

      const latestMarket = marketsResponse.data[0];
      const marketId = latestMarket.marketId;

      // Step 4: Save event data to backend
      await api.eventPredictions.createEventPrediction({
        title: data.title,
        description: data.description,
        category: data.category,
        expiresAt: data.expiresAt,
        keywords: data.keywords,
        newsSearchQuery: data.newsSearchQuery,
        verificationThreshold: data.verificationThreshold || 0.6,
        creator: userAddress,
        txHash: result.txHash!,
        marketId: marketId,
      });

      logger.user('Event prediction created! News monitoring started.');

      // Refresh markets to show the new event prediction
      setTimeout(async () => {
        await fetchMarkets();
      }, 1000);

      setShowEventModal(false);
    } catch (err: any) {
      logger.error('Create event prediction failed:', err);
      throw err;
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
      {/* Removed page-specific animated background */}

      <style jsx>{`
        /* Animations removed for performance and to avoid fade/scale effects */
        .bold-title {
          font-weight: 900;
          letter-spacing: -0.02em;
        }
        .rotating-border-btn,
        button.rotating-border-btn {
          border: 5px solid #00ff00 !important;
          outline: 3px solid #00ff00 !important;
          outline-offset: 3px !important;
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease,
            background 0.25s ease !important;
        }
      `}</style>

      {/* Removed rising dust/bubbles from left and right sides */}

      {/* Hero Section */}
      <HeroSection
        onCreateClick={() => setShowCreateModal(true)}
        onCryptoClick={() => setShowCryptoModal(true)}
        onNewsClick={() => setShowEventModal(true)}
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
                  {t('errors.retry')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* All Markets Section */}
      <div
        id="all-markets"
        className="relative z-10 mx-auto max-w-7xl px-6 pb-16 lg:px-8"
      >
        <div className="space-y-6">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg border border-yellow-400/30 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 p-2">
                <BarChart3 className="h-6 w-6 text-yellow-400" />
              </div>
              <h2 className="font-heading text-2xl text-white">
                {t('markets.all_markets')}
              </h2>
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
                  {t('markets.no_predictions_found')}
                </h3>
                <p className="mb-4 text-gray-300">
                  {t('markets.try_adjusting_filters')}
                </p>
                <Button
                  onClick={() => setShowCreateModal(true)}
                  variant="default"
                  disabled={!authenticated}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {t('markets.create_first_prediction')}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid auto-rows-fr grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
              <div className="rounded-lg border border-green-400/30 bg-gradient-to-r from-green-400/20 to-green-600/20 p-2">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <h2 className="font-heading text-2xl text-white">
                {t('markets.completed_predictions')}
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

      {/* Event Prediction Modal */}
      <CreateEventPredictionModal
        open={showEventModal}
        onOpenChange={setShowEventModal}
        onConfirm={handleCreateEventPrediction}
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

      {/* Oracle Error Modal */}
      <Dialog
        open={showOracleErrorModal}
        onOpenChange={setShowOracleErrorModal}
      >
        <DialogContent className="max-w-md border border-orange-500/50 bg-gray-900/95 shadow-2xl backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-orange-400">
              <AlertCircle className="h-5 w-5" />
              Oracle Not Available
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Regular prediction markets are temporarily disabled
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-lg border border-orange-500/20 bg-orange-500/10 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange-400" />
                <div className="space-y-2">
                  <p className="text-sm text-orange-200">
                    <strong>Oracle system is under development.</strong> We
                    don't have a way to automatically resolve regular prediction
                    outcomes yet.
                  </p>
                  <p className="text-sm text-orange-200">
                    However, you can create <strong>crypto predictions</strong>{' '}
                    that are automatically verified using real-time price data!
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-white">
                Try Crypto DarkPool instead:
              </h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>Automatic price verification</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>Real-time crypto data</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>No manual resolution needed</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowOracleErrorModal(false)}
              className="flex-1 border-gray-700/50 bg-gray-800/60 text-white hover:bg-gray-800/80"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowOracleErrorModal(false);
                setShowCryptoModal(true);
              }}
              className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 font-semibold text-black shadow-md hover:from-yellow-500 hover:to-yellow-700"
            >
              Open Crypto DarkPool
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
