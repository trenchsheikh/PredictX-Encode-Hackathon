'use client';

import { useState, useEffect } from 'react';

import { usePrivy } from '@privy-io/react-auth';
import { ethers } from 'ethers';
import {
  Plus,
  TrendingUp,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Wallet,
  ChevronDown,
} from 'lucide-react';

import { BetModal } from '@/components/prediction/bet-modal';
import { CreateBetModal } from '@/components/prediction/create-bet-modal';
import type { EventPredictionData } from '@/components/prediction/create-event-prediction-modal';
import { CreateEventPredictionModal } from '@/components/prediction/create-event-prediction-modal';
import type { CryptoPredictionData } from '@/components/prediction/crypto-prediction-modal';
import { CryptoPredictionModal } from '@/components/prediction/crypto-prediction-modal';
import { PredictionCard } from '@/components/prediction/prediction-card';
import { TransactionHistoryModal } from '@/components/prediction/transaction-history-modal';
import { useI18n } from '@/components/providers/i18n-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TetrisLoading from '@/components/ui/tetris-loader';
import { TransactionStatus } from '@/components/ui/transaction-status';
import { api, getErrorMessage } from '@/lib/api-client';
import { mapCategory, mapStatus, calculatePrice } from '@/lib/blockchain-utils';
import { generateCommit, storeCommitSecret } from '@/lib/commit-reveal';
import { usePredictionContract } from '@/lib/hooks/use-prediction-contract';
import { logger } from '@/lib/logger';
import type {
  Prediction,
  CreatePredictionData,
  PredictionCategory,
  PredictionStatus,
} from '@/types/prediction';

export default function HomePage() {
  const { t, isInitialized } = useI18n();
  const { authenticated, user, login } = usePrivy();
  const contract = usePredictionContract();
  const [mounted, setMounted] = useState(false);

  // Data state
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCryptoModal, setShowCryptoModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showBetModal, setShowBetModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showOracleErrorModal, setShowOracleErrorModal] = useState(false);
  const [showWalletPrompt, setShowWalletPrompt] = useState(false);
  const [selectedPrediction, setSelectedPrediction] =
    useState<Prediction | null>(null);
  const [selectedOutcome, setSelectedOutcome] = useState<'yes' | 'no'>('yes');
  const [selectedHistoryPrediction, setSelectedHistoryPrediction] =
    useState<string>('');

  // User bets tracking
  const [userBets, _setUserBets] = useState<{
    [predictionId: string]: { outcome: 'yes' | 'no'; shares: number };
  }>({});

  // Filtering state
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Set mounted state to prevent hydration mismatch
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
      const response = await api.markets.getMarkets();

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch markets');
      }

      // Map backend data to frontend Prediction format
      const mappedPredictions: Prediction[] = response.data.map(market => ({
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
        noPrice: calculatePrice(market.noPool || '0', market.totalPool || '1'),
        totalShares:
          parseFloat(ethers.formatEther(market.yesShares || '0')) +
          parseFloat(ethers.formatEther(market.noShares || '0')),
        yesShares: parseFloat(ethers.formatEther(market.yesShares || '0')),
        noShares: parseFloat(ethers.formatEther(market.noShares || '0')),
        participants: market.participants || 0,
        isHot:
          market.participants > 10 ||
          parseFloat(ethers.formatEther(market.totalPool || '0')) > 1,
        resolution:
          market.outcome !== undefined && market.resolvedAt
            ? {
                outcome: market.outcome ? 'yes' : ('no' as const),
                resolvedAt: new Date(market.resolvedAt).getTime(),
                reasoning: market.resolutionReasoning || '',
                evidence: [],
              }
            : undefined,
      }));

      setPredictions(mappedPredictions);
    } catch (err: unknown) {
      logger.error('Failed to fetch markets:', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch markets on mount
   */
  useEffect(() => {
    fetchMarkets();
  }, []);

  /**
   * Handle crypto prediction button click
   */
  const handleCryptoClick = () => {
    if (!authenticated) {
      setShowWalletPrompt(true);
      return;
    }
    setShowCryptoModal(true);
  };

  /**
   * Handle news event prediction button click
   */
  const handleNewsClick = () => {
    if (!authenticated) {
      setShowWalletPrompt(true);
      return;
    }
    setShowEventModal(true);
  };

  /**
   * Open bet modal
   */
  const handleBetClick = (predictionId: string, outcome: 'yes' | 'no') => {
    const prediction = predictions.find(p => p.id === predictionId);
    if (!prediction) return;

    if (!authenticated) {
      setShowWalletPrompt(true);
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
    } catch (err: unknown) {
      logger.error('Bet failed:', err);
      throw new Error(getErrorMessage(err));
    }
  };

  /**
   * Handle create prediction - Currently disabled, redirect to Crypto
   */
  const handleCreatePrediction = async (_data: CreatePredictionData) => {
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

      if (!result.success || !result.txHash || !result.marketId) {
        const actualError = contract.error || 'Transaction failed';
        logger.error('Contract error:', contract.error);
        throw new Error(actualError);
      }

      const marketId = result.marketId;
      logger.info('Market created with ID:', marketId);

      // Wait for the backend to index the market
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Now automatically place the creator's initial bet
      logger.info('Placing creator initial bet...');

      // Generate commit hash and salt
      const { commitHash, salt } = generateCommit(data.outcome, userAddress);

      // Commit the bet
      const commitResult = await contract.commitBet(
        marketId,
        commitHash,
        data.amount.toString()
      );

      if (!commitResult.success || !commitResult.txHash) {
        logger.warn('Failed to commit creator bet, but market was created');
        throw new Error('Failed to place initial bet');
      }

      // Store commit secret
      const commitData = {
        commitHash,
        salt,
        outcome: data.outcome,
        amount: ethers.parseEther(data.amount.toString()).toString(),
        timestamp: Date.now(),
      };
      storeCommitSecret(marketId.toString(), commitData);

      // Index commit in backend
      await api.markets.commitBet(marketId.toString(), {
        user: userAddress,
        commitHash,
        amount: ethers.parseEther(data.amount.toString()).toString(),
        txHash: commitResult.txHash,
      });

      // Wait a moment for commit to be indexed
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Reveal the bet immediately
      logger.info('Revealing creator bet...');
      const revealResult = await contract.revealBet(
        marketId,
        data.outcome === 'yes',
        salt
      );

      if (!revealResult.success || !revealResult.txHash) {
        logger.warn(
          'Failed to reveal creator bet, you may need to reveal manually'
        );
      } else {
        // Wait for reveal to be processed on chain
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Get bet details from blockchain
        const chainBet = await contract.getUserBet(marketId, userAddress);

        if (chainBet && chainBet.amount && chainBet.shares) {
          // Index reveal in backend with correct parameters
          await api.markets.revealBet(marketId.toString(), {
            user: userAddress,
            outcome: data.outcome === 'yes',
            shares: chainBet.shares.toString(),
            amount: chainBet.amount.toString(),
            txHash: revealResult.txHash,
          });
        } else {
          logger.warn('Could not fetch bet details from blockchain');
        }
      }

      // Refresh markets
      await fetchMarkets();

      setShowCryptoModal(false);
      logger.user(t('success.crypto_prediction_created'));
    } catch (err: unknown) {
      logger.error('Create crypto prediction failed:', err);
      throw err;
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
        '0'
      );

      if (!result.success || !result.txHash || !result.marketId) {
        const actualError = contract.error || 'Transaction failed';
        logger.error('Contract error:', contract.error);
        throw new Error(actualError);
      }

      const marketId = result.marketId;
      logger.info(
        'Event prediction created on blockchain. Market ID:',
        marketId
      );

      // Wait for backend to sync the market
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 2: Place creator's initial bet
      logger.info('Placing creator initial bet...');

      // Generate commit hash and salt
      const { commitHash, salt } = generateCommit(data.outcome, userAddress);

      // Commit the bet
      const commitResult = await contract.commitBet(
        marketId,
        commitHash,
        data.amount.toString()
      );

      if (!commitResult.success || !commitResult.txHash) {
        logger.warn('Failed to commit creator bet, but market was created');
        throw new Error('Failed to place initial bet');
      }

      // Store commit secret
      const commitData = {
        commitHash,
        salt,
        outcome: data.outcome,
        amount: ethers.parseEther(data.amount.toString()).toString(),
        timestamp: Date.now(),
      };
      storeCommitSecret(marketId.toString(), commitData);

      // Index commit in backend
      await api.markets.commitBet(marketId.toString(), {
        user: userAddress,
        commitHash,
        amount: ethers.parseEther(data.amount.toString()).toString(),
        txHash: commitResult.txHash,
      });

      // Wait a moment for commit to be indexed
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Reveal the bet immediately
      logger.info('Revealing creator bet...');
      const revealResult = await contract.revealBet(
        marketId,
        data.outcome === 'yes',
        salt
      );

      if (!revealResult.success || !revealResult.txHash) {
        logger.warn(
          'Failed to reveal creator bet, you may need to reveal manually'
        );
      } else {
        // Wait for reveal to be processed on chain
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Get bet details from blockchain
        const chainBet = await contract.getUserBet(marketId, userAddress);

        if (chainBet && chainBet.amount && chainBet.shares) {
          // Index reveal in backend with correct parameters
          await api.markets.revealBet(marketId.toString(), {
            user: userAddress,
            outcome: data.outcome === 'yes',
            shares: chainBet.shares.toString(),
            amount: chainBet.amount.toString(),
            txHash: revealResult.txHash,
          });
        } else {
          logger.warn('Could not fetch bet details from blockchain');
        }
      }

      // Step 3: Save event data to backend
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
      await fetchMarkets();

      setShowEventModal(false);
    } catch (err: unknown) {
      logger.error('Create event prediction failed:', err);
      throw err;
    }
  };

  /**
   * Calculate stats
   */
  const _stats = {
    totalPredictions: predictions.length,
    activePredictions: predictions.filter(p => p.status === 'active').length,
    totalVolume: predictions.reduce((sum, p) => sum + p.totalPool, 0),
    totalParticipants: predictions.reduce((sum, p) => sum + p.participants, 0),
  };

  /**
   * Filter predictions based on active filters
   */
  const getFilteredPredictions = () => {
    let filtered = [...predictions];

    // Apply category filter
    if (activeCategory !== 'all') {
      filtered = filtered.filter(p => p.category === activeCategory);
    }

    // Apply sorting filter
    switch (activeFilter) {
      case 'new':
        filtered = filtered.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case 'trending':
        filtered = filtered.sort((a, b) => b.participants - a.participants);
        break;
      case 'all':
      default:
        // Keep original order
        break;
    }

    return filtered;
  };

  const filteredPredictions = getFilteredPredictions();

  /**
   * Get unique categories from predictions
   */
  const getCategories = () => {
    const categories = Array.from(new Set(predictions.map(p => p.category)));
    return categories.sort();
  };

  return (
    <div className="relative overflow-hidden">
      {/* Removed page-specific animated background */}

      <style jsx>{`
        /* Flat design - no animations or transitions */
        .bold-title {
          font-weight: 900;
          letter-spacing: -0.02em;
        }
      `}</style>

      {/* Removed rising dust/bubbles from left and right sides */}

      {/* Error Banner */}
      {error && (
        <div className="relative z-10 mx-auto mb-6 max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="border-red-500/50 bg-red-900/30 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <p className="font-medium text-red-100">{error}</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={fetchMarkets}
                  className="ml-auto border-red-400/70 bg-red-500/10 text-red-100"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {mounted && isInitialized ? t('errors.retry') : 'Retry'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* All Markets Section */}
      <div
        id="all-markets"
        className="relative z-10 mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8"
      >
        <div className="space-y-6">
          {/* Filtering Tabs and Create Buttons - Hide during loading */}
          {!loading && (
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Tabs
                value={`${activeFilter}-${activeCategory}`}
                onValueChange={value => {
                  const [filter, category] = value.split('-');
                  setActiveFilter(filter);
                  setActiveCategory(category);
                }}
                className="w-full sm:flex-1"
              >
                <TabsList className="scrollbar-hide inline-flex w-full justify-start gap-1 overflow-x-auto sm:w-auto">
                  <TabsTrigger
                    value="new-all"
                    className="flex-shrink-0 text-center"
                  >
                    {mounted && isInitialized ? t('filters.new') : 'New'}
                  </TabsTrigger>
                  <TabsTrigger
                    value="trending-all"
                    className="flex-shrink-0 text-center"
                  >
                    {mounted && isInitialized
                      ? t('filters.trending')
                      : 'Trending'}
                  </TabsTrigger>
                  <TabsTrigger
                    value="all-all"
                    className="flex-shrink-0 text-center"
                  >
                    {mounted && isInitialized ? t('filters.all') : 'All'}
                  </TabsTrigger>
                  {getCategories().map(category => (
                    <TabsTrigger
                      key={category}
                      value={`all-${category}`}
                      className="flex-shrink-0 whitespace-nowrap text-center"
                    >
                      {mounted && isInitialized
                        ? t(`categories.${category}`)
                        : category.charAt(0).toUpperCase() + category.slice(1)}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              {/* Create + Dropdown Button */}
              <div className="flex flex-col gap-2 sm:flex-row">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="default"
                      className="bg-white px-3 py-1 text-black"
                    >
                      {mounted && isInitialized
                        ? t('cta.start_darkpool_betting')
                        : 'Create +'}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onClick={() => setShowCreateModal(true)}
                      className="cursor-pointer"
                    >
                      {mounted && isInitialized ? t('cta.events') : 'Events'}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleCryptoClick}
                      className="cursor-pointer"
                    >
                      {mounted && isInitialized
                        ? t('cta.crypto_darkpool')
                        : 'Crypto'}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleNewsClick}
                      className="cursor-pointer"
                    >
                      {mounted && isInitialized ? t('cta.news_events') : 'News'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}

          {/* Markets Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12 pt-48">
              <TetrisLoading
                size="md"
                speed="normal"
                loadingText="Loading predictions..."
              />
            </div>
          ) : filteredPredictions.length === 0 ? (
            <Card className="border-white/20 bg-card py-12 text-center backdrop-blur-sm">
              <CardContent>
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full border border-white/30 bg-white/20">
                  <TrendingUp className="h-12 w-12 text-white" />
                </div>
                <h3 className="font-heading mb-2 text-lg text-foreground">
                  {mounted && isInitialized
                    ? t('markets.no_predictions_found')
                    : 'No Predictions Found'}
                </h3>
                <p className="mb-4 text-muted-foreground">
                  {mounted && isInitialized
                    ? t('markets.try_adjusting_filters')
                    : 'Try adjusting your filters'}
                </p>
                <Button
                  onClick={() => setShowCreateModal(true)}
                  variant="outline"
                  disabled={!authenticated}
                  className="border-white/20 bg-card text-foreground"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {mounted && isInitialized
                    ? t('markets.create_first_prediction')
                    : 'Create First Prediction'}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid auto-rows-fr grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPredictions
                .filter(
                  p => p.status !== 'resolved' && p.status !== 'cancelled'
                )
                .map(prediction => (
                  <PredictionCard
                    key={prediction.id}
                    prediction={prediction}
                    onBet={handleBetClick}
                    onViewHistory={handleViewHistory}
                    userBets={userBets}
                  />
                ))}
            </div>
          )}
        </div>

        {/* Completed Predictions Section */}
        {filteredPredictions.filter(
          p => p.status === 'resolved' || p.status === 'cancelled'
        ).length > 0 && (
          <div className="mt-12">
            <div className="mb-6 flex items-center">
              <h2 className="font-heading text-2xl text-foreground">
                {mounted && isInitialized
                  ? t('markets.completed_predictions')
                  : 'Completed Predictions'}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPredictions
                .filter(
                  p => p.status === 'resolved' || p.status === 'cancelled'
                )
                .map(prediction => (
                  <PredictionCard
                    key={prediction.id}
                    prediction={prediction}
                    onBet={handleBetClick}
                    onViewHistory={handleViewHistory}
                    userBets={userBets}
                  />
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
        <DialogContent className="max-w-md border border-white/20 bg-card shadow-2xl backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <AlertCircle className="h-5 w-5" />
              Oracle Not Available
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Regular prediction markets are temporarily disabled
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-lg border border-white/20 bg-white/10 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-white" />
                <div className="space-y-2">
                  <p className="text-sm text-white">
                    <strong>Oracle system is under development.</strong> We
                    don't have a way to automatically resolve regular prediction
                    outcomes yet.
                  </p>
                  <p className="text-sm text-white">
                    However, you can create <strong>crypto predictions</strong>{' '}
                    that are automatically verified using real-time price data!
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-foreground">
                Try Crypto instead:
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-white" />
                  <span>Automatic price verification</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-white" />
                  <span>Real-time crypto data</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-white" />
                  <span>No manual resolution needed</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowOracleErrorModal(false)}
              className="flex-1 border-white/20 bg-card text-foreground"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowOracleErrorModal(false);
                setShowCryptoModal(true);
              }}
              variant="outline"
              className="flex-1 border-white/20 bg-white text-black"
            >
              Open Crypto
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Wallet Connection Prompt */}
      <Dialog open={showWalletPrompt} onOpenChange={setShowWalletPrompt}>
        <DialogContent className="max-w-md border border-white/20 bg-card shadow-2xl backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <Wallet className="h-5 w-5" />
              {mounted && isInitialized
                ? t('wallet_prompt.title')
                : 'Connect Your Wallet'}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {mounted && isInitialized
                ? t('wallet_prompt.description')
                : 'You need to connect your wallet to create or place predictions'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-lg border border-white/20 bg-white/10 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-white" />
                <div className="space-y-2 text-sm text-white">
                  <p>
                    {mounted && isInitialized
                      ? t('wallet_prompt.message')
                      : 'To participate in DarkBet predictions, you need to connect a Web3 wallet. We support MetaMask, WalletConnect, and more.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowWalletPrompt(false)}
              className="flex-1 border-white/20 bg-card text-foreground"
            >
              {mounted && isInitialized ? t('cancel') : 'Cancel'}
            </Button>
            <Button
              onClick={() => {
                setShowWalletPrompt(false);
                login();
              }}
              variant="outline"
              className="flex-1 border-white/20 bg-white text-black"
            >
              {mounted && isInitialized
                ? t('connect_wallet')
                : 'Connect Wallet'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
