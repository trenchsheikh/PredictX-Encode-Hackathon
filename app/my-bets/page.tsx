'use client';

import { useState, useEffect } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserBet, Prediction } from '@/types/prediction';
import { formatBNB, formatTimeRemaining, calculatePayout, formatAddress } from '@/lib/utils';
import { Wallet, TrendingUp, TrendingDown, Clock, DollarSign, ExternalLink, Eye, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { StatsDashboard } from '@/components/ui/stats-dashboard';
import { PerformanceChart } from '@/components/ui/performance-chart';
import { AnimatedCard } from '@/components/ui/animated-card';
import { AnimatedButton } from '@/components/ui/animated-button';
import { AnimatedBackground } from '@/components/ui/animated-background';
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
  const { wallets } = useWallets();
  const contract = usePredictionContract();
  
  // Data state
  const [userBets, setUserBets] = useState<UserBet[]>([]);
  const [predictions, setPredictions] = useState<{ [id: string]: Prediction }>({});
  const [activeTab, setActiveTab] = useState<'active' | 'resolved' | 'all'>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [refundChecks, setRefundChecks] = useState<{ [betId: string]: { available: boolean; reason?: string; amount?: string } }>({});
  
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
      const bets: UserBet[] = (response.data.bets || []).map((bet: any) => {
        const isRevealed = bet.type === 'bet' && bet.outcome !== undefined;
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

  /**
   * Check refund availability for all unrevealed bets
   */
  const checkAllRefunds = async () => {
    if (!contract.checkRefundAvailability) return;

    const unrevealedBets = userBets.filter(bet => !bet.revealed);
    const checks: { [betId: string]: { available: boolean; reason?: string; amount?: string } } = {};

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
    if (userBets.length > 0 && contract.checkRefundAvailability) {
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
        console.log('🕐 Found expired bets, triggering instant resolution...', expiredBets.length);
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
      }
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, [authenticated, user?.wallet?.address]);

  /**
   * Test backend connection
   */
  const testBackendConnection = async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
      console.log('🔍 Testing backend connection to:', backendUrl);
      
      const response = await fetch(`${backendUrl}/health`);
      const result = await response.json();
      
      if (response.ok) {
        console.log('✅ Backend connection successful:', result);
      } else {
        console.error('❌ Backend connection failed:', result);
      }
    } catch (error: any) {
      console.error('❌ Backend connection error:', error);
    }
  };

  /**
   * Test wallet connection
   */
  const testWalletConnection = async () => {
    console.log('🧪 Testing wallet connection...');
    console.log('Authenticated:', authenticated);
    console.log('User:', user);
    console.log('Wallets:', wallets);
    
    if (!authenticated) {
      alert('Please connect your wallet first');
      return;
    }
    
    if (!wallets || wallets.length === 0) {
      alert('No wallet found. Please connect your wallet.');
      return;
    }
    
    const wallet = wallets[0];
    console.log('Testing wallet:', wallet);
    
    try {
      // Test if contract hook is working
      if (contract.error) {
        alert(`❌ Contract error: ${contract.error}`);
        return;
      }
      
      if (contract.loading) {
        alert('⏳ Contract is loading, please wait...');
        return;
      }
      
      // Test if we can create a signer (this tests the core wallet connection)
      try {
        // Import the contract hook's getSigner function
        const { getContractAddresses } = await import('@/lib/blockchain-utils');
        const { ethers } = await import('ethers');
        
        // Test if we can get contract addresses
        const addresses = getContractAddresses();
        console.log('✅ Contract addresses loaded:', addresses);
        
        // Test Privy wallet methods
        console.log('🔍 Testing Privy wallet methods...');
        console.log('Wallet object:', wallet);
        console.log('Available methods:', Object.keys(wallet).filter(key => typeof wallet[key] === 'function'));
        
        // Test different signer creation methods
        let signerCreated = false;
        
        // Method 1: Try Privy's getEthereumProvider
        if (typeof wallet.getEthereumProvider === 'function') {
          try {
            console.log('🔍 Trying wallet.getEthereumProvider()...');
            const provider = await wallet.getEthereumProvider();
            console.log('✅ Provider from Privy:', provider);
            
            const ethersProvider = new ethers.BrowserProvider(provider);
            const signer = await ethersProvider.getSigner();
            const address = await signer.getAddress();
            console.log('✅ Signer created via Privy:', address);
            signerCreated = true;
          } catch (privyError: any) {
            console.warn('⚠️ Privy method failed:', privyError.message);
          }
        }
        
        // Method 2: Try window.ethereum
        if (!signerCreated && typeof window !== 'undefined' && window.ethereum) {
          try {
            console.log('🔍 Trying window.ethereum...');
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            console.log('✅ Signer created via window.ethereum:', address);
            signerCreated = true;
          } catch (windowError: any) {
            console.warn('⚠️ Window.ethereum method failed:', windowError.message);
          }
        }
        
        // Method 3: Try any other method on the wallet
        if (!signerCreated) {
          console.log('🔍 Trying other wallet methods...');
          const methods = Object.keys(wallet).filter(key => 
            typeof wallet[key] === 'function' && 
            (key.includes('provider') || key.includes('ethereum') || key.includes('signer'))
          );
          
          for (const method of methods) {
            try {
              console.log(`🔍 Trying wallet.${method}()...`);
              const result = await wallet[method]();
              console.log(`Result from wallet.${method}:`, result);
              
              if (result && typeof result.getSigner === 'function') {
                const signer = await result.getSigner();
                const address = await signer.getAddress();
                console.log(`✅ Signer created via wallet.${method}:`, address);
                signerCreated = true;
                break;
              }
            } catch (methodError: any) {
              console.warn(`⚠️ wallet.${method} failed:`, methodError.message);
            }
          }
        }
        
        if (signerCreated) {
          console.log('✅ Wallet connection successful! Signer is working.');
        } else {
          console.error('❌ Failed to create signer with any method. Check console for details.');
        }
      } catch (signerError: any) {
        console.error('Signer creation failed:', signerError);
      }
    } catch (error: any) {
      console.error('Wallet test failed:', error);
    }
  };

  /**
   * Manually trigger market resolution
   */
  const triggerMarketResolution = async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
      const response = await fetch(`${backendUrl}/api/markets/trigger-resolution`, {
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
        alert(`❌ Backend error (${response.status}): ${errorText}`);
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
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
      console.log('🔄 Manually resolving market 6...');
      
      const response = await fetch(`${backendUrl}/api/markets/resolve-market`, {
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
      alert('No wallet found');
      return;
    }

    const wallet = wallets[0];
    console.log('🔄 Switching to BSC Testnet...', { currentChainId: wallet.chainId });

    try {
      // Try Privy's switchChain method
      if (typeof wallet.switchChain === 'function') {
        await wallet.switchChain(97);
        console.log('✅ Switched via Privy');
        alert('✅ Switched to BSC Testnet!');
        return;
      }

      // Fallback to window.ethereum
      if (typeof window !== 'undefined' && window.ethereum) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x61' }],
        });
        console.log('✅ Switched via window.ethereum');
        alert('✅ Switched to BSC Testnet!');
        return;
      }

      alert('❌ Unable to switch network. Please switch manually in your wallet.');
    } catch (error: any) {
      console.error('Network switch failed:', error);
      if (error.code === 4902) {
        // Network not added, try to add it
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x61',
              chainName: 'BSC Testnet',
              nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
              rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
              blockExplorerUrls: ['https://testnet.bscscan.com/'],
            }],
          });
          alert('✅ Added and switched to BSC Testnet!');
        } catch (addError: any) {
          console.error('Failed to add network:', addError);
          alert('❌ Failed to add BSC Testnet. Please add it manually in your wallet.');
        }
      } else {
        alert(`❌ Failed to switch network: ${error.message}`);
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
   * Handle claim button click - show confirmation modal
   */
  const handleClaimClick = (betId: string) => {
    const bet = userBets.find(b => b.id === betId);
    if (!bet) return;

    const prediction = predictions[bet.predictionId];
    if (!prediction) return;

    const isWinning = prediction.outcome === bet.outcome;
    const canClaim = prediction.status === 'resolved' && isWinning && !bet.claimed;
    const canRefund = !bet.revealed && (prediction.status === 'cancelled' || 
      (prediction.status === 'resolved' && prediction.outcome === null));

    const claimType = canClaim ? 'winnings' : 'refund';
    const claimAmount = canClaim ? calculatePotentialPayout(bet, prediction) : bet.amount;

    setClaimBet({
      bet,
      prediction,
      type: claimType,
      amount: claimAmount
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

      alert(`Winnings claimed! Amount: ${result.amount} BNB`);
    } catch (err: any) {
      console.error('Claim failed:', err);
      alert(getErrorMessage(err));
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
        throw new Error('Contract not available. Please refresh the page and try again.');
      }

      // Call smart contract
      const result = await contract.claimRefund(marketId);

      if (!result.success || !result.txHash) {
        throw new Error('Transaction failed');
      }

      // Refresh bets
      await fetchUserBets();

      alert(`Refund claimed! Amount: ${result.amount} BNB`);
    } catch (err: any) {
      console.error('Refund failed:', err);
      const errorMsg = getErrorMessage(err);
      alert(`Refund failed: ${errorMsg}`);
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
  const calculatePotentialPayout = (bet: UserBet, prediction: Prediction): number => {
    if (prediction.status !== 'resolved' || !prediction.outcome) return 0;
    
    const isWinning = prediction.outcome === bet.outcome;
    if (!isWinning) return 0;

    const totalWinningShares = prediction.outcome === 'yes' ? prediction.yesShares : prediction.noShares;
    if (totalWinningShares === 0) return 0;

    // Calculate payout: (user shares / total winning shares) * total pool * 0.9 (10% platform fee)
    const grossPayout = (bet.shares / totalWinningShares) * prediction.totalPool;
    const platformFee = grossPayout * 0.1; // 10% platform fee
    return grossPayout - platformFee;
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
    <div className="min-h-screen relative">
      {/* Page-specific background */}
      <AnimatedBackground variant="particles" />
      
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display text-white mb-2">{t('my_bets')}</h1>
          <p className="text-gray-300 font-body">
            {t('track_investments')}
          </p>
          
          {/* Connection Status */}
          <div className="mt-4 p-4 rounded-xl bg-gray-900/60 backdrop-blur-sm border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${contract.error ? 'bg-red-500' : 'bg-green-500'}`}></div>
                <span className="text-white font-caption">
                  {contract.error ? `Connection Issue: ${contract.error}` : 'Connected to BSC Testnet'}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={testBackendConnection}
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Test Backend
                </Button>
                <Button
                  onClick={testWalletConnection}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Test Connection
                </Button>
                <Button
                  onClick={switchToBSC}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Switch to BSC
                </Button>
                <Button
                  onClick={triggerMarketResolution}
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  Resolve Markets
                </Button>
                <Button
                  onClick={manualResolveMarket6}
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Resolve Market 6
                </Button>
                {contract.error && (
                  <Button
                    onClick={() => {
                      // Force refresh the contract connection
                      window.location.reload();
                    }}
                    size="sm"
                    className="bg-yellow-600 hover:bg-yellow-700 text-white"
                  >
                    Retry Connection
                  </Button>
                )}
              </div>
            </div>
            {contract.error && (
              <div className="mt-2 text-xs text-gray-400">
                <div>Please check your wallet connection and network settings.</div>
                <div className="mt-1">
                  <strong>Debug Info:</strong> Authenticated: {authenticated ? 'Yes' : 'No'}, 
                  Wallets: {wallets?.length || 0}, 
                  User: {user?.wallet?.address ? 'Connected' : 'Not connected'},
                  Network: {wallets?.[0]?.chainId || 'Unknown'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Dashboard */}
        <StatsDashboard
          totalBets={userBets.length}
          totalWinnings={totalPayout}
          winRate={resolvedBets > 0 ? (userBets.filter(bet => {
            const prediction = predictions[bet.predictionId];
            return prediction?.status === 'resolved' && prediction.outcome === bet.outcome;
          }).length / resolvedBets) * 100 : 0}
          activeBets={activeBets}
        />

        {/* Performance Chart */}
        <div className="mb-8">
          <PerformanceChart
            data={[
              { date: 'Week 1', winnings: 0.5, bets: 2 },
              { date: 'Week 2', winnings: 1.2, bets: 4 },
              { date: 'Week 3', winnings: 0.8, bets: 3 },
              { date: 'Week 4', winnings: 2.1, bets: 5 },
              { date: 'This Week', winnings: totalPayout, bets: userBets.length },
            ]}
            type="area"
          />
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
              const isWinning = prediction.outcome === bet.outcome;
              const isExpired = new Date().getTime() > prediction.expiresAt;
              
              // Check if bet is revealed (use revealed property or check outcome)
              const isRevealed = bet.revealed || bet.outcome !== 'unknown';
              
              // Can claim winnings if: resolved + won + not claimed + revealed
              const canClaim = prediction.status === 'resolved' && isWinning && !bet.claimed && isRevealed;
              
              // Check refund availability from smart contract
              const refundCheck = refundChecks[bet.id];
              const canRefund = !isRevealed && refundCheck?.available === true;
              
              // Check if user can claim winnings (revealed + won + resolved + not claimed)
              const canClaimWinnings = isRevealed && prediction.status === 'resolved' && isWinning && !bet.claimed;
              
              // Check if user lost the bet (revealed + resolved + not winning)
              const hasLost = isRevealed && prediction.status === 'resolved' && !isWinning;
              
              // Check if bet is waiting for resolution (revealed + not resolved yet)
              const waitingForResolution = isRevealed && prediction.status !== 'resolved';
              
              // Determine if user can claim anything (winnings or refund)
              const canClaimAnything = canClaim || canRefund;
              const claimType = canClaim ? 'winnings' : 'refund';
              const claimAmount = canClaim ? calculatePotentialPayout(bet, prediction) : (refundCheck?.amount ? parseFloat(refundCheck.amount) : bet.amount);

              // Debug logging
              console.log('Bet Debug:', {
                betId: bet.id,
                predictionId: bet.predictionId,
                outcome: bet.outcome,
                revealed: bet.revealed,
                isRevealed,
                predictionStatus: prediction.status,
                predictionOutcome: prediction.outcome,
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
                canReveal: canReveal(prediction.expiresAt)
              });

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
                              {prediction.status === 'resolved' && prediction.outcome 
                                ? formatBNB(calculatePotentialPayout(bet, prediction))
                                : formatBNB(calculatePayout(bet.shares, 
                                    bet.outcome === 'yes' ? prediction.yesShares : prediction.noShares, 
                                    prediction.totalPool
                                  ))
                              }
                            </div>
                          </div>
                        </div>

                        {/* Resolution Info */}
                        {prediction.status === 'resolved' && prediction.outcome !== undefined && (
                          <div className="mt-4 p-3 rounded-lg bg-yellow-500/20 border border-yellow-500/30">
                            <div className="text-sm font-medium mb-1 text-white">
                              Resolution: {prediction.outcome ? 'YES' : 'NO'}
                            </div>
                            {prediction.resolutionReasoning && (
                              <div className="text-xs text-gray-200">
                                {prediction.resolutionReasoning}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="ml-4 flex-shrink-0 flex flex-col gap-2">
                        {/* Reveal button for unrevealed bets */}
                        {!isRevealed && hasUnrevealedCommit(bet.predictionId) && !isExpired && (
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
                        
                        {/* Unified Claim button for winnings or refunds */}
                        {canClaimAnything ? (
                          <Button
                            onClick={() => handleClaimClick(bet.id)}
                            className={canClaim ? "bg-green-600 hover:bg-green-700 text-white" : "bg-orange-600 hover:bg-orange-700 text-white"}
                            size="sm"
                            disabled={contract.loading}
                          >
                            {contract.loading ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <DollarSign className="h-4 w-4 mr-2" />
                            )}
                            Claim {claimType === 'winnings' ? 'Winnings' : 'Refund'} ({formatBNB(claimAmount)} BNB)
                          </Button>
                        ) : bet.claimed ? (
                          <Badge variant="success" className="bg-green-600 text-white">Claimed</Badge>
                        ) : !isRevealed && isExpired ? (
                          <div className="flex flex-col gap-2">
                            <Badge variant="warning" className="bg-orange-600 text-white">
                              {refundCheck?.available ? 'Can Refund' : 'Expired - Check Refund'}
                            </Badge>
                            {refundCheck?.reason && (
                              <div className="text-xs text-gray-300 max-w-32">
                                {refundCheck.reason}
                              </div>
                            )}
                            {refundCheck?.available ? (
                              <Button
                                onClick={() => handleClaimClick(bet.id)}
                                className="bg-orange-600 hover:bg-orange-700 text-white"
                                size="sm"
                                disabled={contract.loading}
                              >
                                <DollarSign className="h-4 w-4 mr-2" />
                                Claim Refund
                              </Button>
                            ) : (
                              <Button
                                onClick={() => checkAllRefunds()}
                                className="bg-gray-600 hover:bg-gray-700 text-white"
                                size="sm"
                              >
                                Check Again
                              </Button>
                            )}
                          </div>
                        ) : !isRevealed ? (
                          <Badge variant="secondary" className="bg-gray-600 text-white">Unrevealed</Badge>
                        ) : waitingForResolution ? (
                          <Badge variant="secondary" className="bg-yellow-600 text-white">Waiting for Resolution</Badge>
                        ) : hasLost ? (
                          <Badge variant="destructive" className="bg-red-600 text-white">Lost</Badge>
                        ) : canClaimWinnings ? (
                          <div className="flex flex-col gap-2">
                            <Badge variant="success" className="bg-green-600 text-white">Won - Can Claim</Badge>
                            <Button
                              onClick={() => handleClaimClick(bet.id)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                              size="sm"
                              disabled={contract.loading}
                            >
                              <DollarSign className="h-4 w-4 mr-2" />
                              Claim Winnings
                            </Button>
                          </div>
                        ) : isWinning ? (
                          <div className="flex flex-col gap-2">
                            <Badge variant="success" className="bg-green-600 text-white">Won</Badge>
                            <Button
                              onClick={() => handleClaimClick(bet.id)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                              size="sm"
                              disabled={contract.loading}
                            >
                              <DollarSign className="h-4 w-4 mr-2" />
                              Try Claim
                            </Button>
                          </div>
                        ) : (
                          <Badge variant="destructive" className="bg-red-600 text-white">Lost</Badge>
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md bg-black/90 border-black">
            <CardHeader>
              <CardTitle className="text-white text-center">
                {claimBet.type === 'winnings' ? 'Claim Winnings' : 'Claim Refund'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-2">
                  {formatBNB(claimBet.amount)} BNB
                </div>
                <p className="text-gray-300 text-sm">
                  {claimBet.type === 'winnings' 
                    ? 'You won this prediction! Claim your winnings.'
                    : 'This prediction expired. Get your refund.'
                  }
                </p>
              </div>
              
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3">
                <p className="text-yellow-200 text-sm">
                  <strong>Note:</strong> You'll need to sign a transaction to {claimBet.type === 'winnings' ? 'claim your winnings' : 'get your refund'}.
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
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <DollarSign className="h-4 w-4 mr-2" />
                  )}
                  {claimBet.type === 'winnings' ? 'Claim Winnings' : 'Claim Refund'}
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

