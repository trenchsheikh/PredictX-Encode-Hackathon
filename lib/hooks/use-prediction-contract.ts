"use client";

import { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { getContractAddresses, checkNetwork, switchToBSCTestnet, estimateGas, waitForTransaction, parseContractError } from '@/lib/blockchain-utils';
import { TransactionStatus } from '@/components/ui/transaction-status';

/**
 * Custom hook for interacting with PredictionMarket contract
 */
export function usePredictionContract() {
  const { authenticated, user } = usePrivy();
  const { wallets } = useWallets();
  const [loading, setLoading] = useState(false);
  const [txStatus, setTxStatus] = useState<TransactionStatus>('idle');
  const [txHash, setTxHash] = useState<string>();
  const [error, setError] = useState<string>();
  const [contractABI, setContractABI] = useState<any[]>([]);
  const [vaultABI, setVaultABI] = useState<any[]>([]);

  // Load ABIs on mount
  useEffect(() => {
    async function loadABIs() {
      try {
        console.log('Loading contract ABIs...');
        const predictionRes = await fetch('/deployments/bscTestnet/PredictionMarket.json');
        const vaultRes = await fetch('/deployments/bscTestnet/Vault.json');
        
        if (predictionRes.ok) {
          const predictionABI = await predictionRes.json();
          console.log('✅ PredictionMarket ABI loaded:', predictionABI.length, 'functions');
          setContractABI(predictionABI);
        } else {
          console.error('❌ Failed to load PredictionMarket ABI:', predictionRes.status);
        }
        
        if (vaultRes.ok) {
          const vaultABIData = await vaultRes.json();
          console.log('✅ Vault ABI loaded');
          setVaultABI(vaultABIData);
        } else {
          console.error('❌ Failed to load Vault ABI:', vaultRes.status);
        }
      } catch (err) {
        console.error('❌ Failed to load contract ABIs:', err);
      }
    }
    loadABIs();
  }, []);

  /**
   * Get signer from Privy wallet
   */
  const getSigner = useCallback(async (): Promise<ethers.Signer | null> => {
    console.log('Getting signer...', { authenticated, walletCount: wallets.length });
    
    if (!authenticated || wallets.length === 0) {
      const errorMsg = 'Please connect your wallet first';
      console.error('❌', errorMsg);
      setError(errorMsg);
      return null;
    }

    try {
      const wallet = wallets[0];
      console.log('Wallet found:', wallet.address, 'Type:', wallet.walletClientType);
      console.log('Wallet object keys:', Object.keys(wallet));
      
      // Handle different wallet types
      if (wallet.walletClientType === 'metamask' || wallet.walletClientType === 'injected') {
        // For MetaMask connected via Privy, use Privy's getEthereumProvider
        console.log('Using MetaMask wallet via Privy');
        
        // Check if wallet has getEthereumProvider method (Privy's method)
        if (typeof wallet.getEthereumProvider === 'function') {
          console.log('Using Privy getEthereumProvider...');
          const provider = await wallet.getEthereumProvider();
          console.log('✅ Provider obtained from Privy');
          
          const ethersProvider = new ethers.BrowserProvider(provider);
          
          // Check and switch network using Privy's switchChain
          console.log('Current wallet chainId:', wallet.chainId);
          if (wallet.chainId !== '0x61' && wallet.chainId !== 97) {
            console.log('Switching to BSC Testnet via Privy...');
            try {
              await wallet.switchChain(97); // BSC Testnet
              console.log('✅ Switched to BSC Testnet');
            } catch (switchError: any) {
              console.error('Failed to switch chain:', switchError);
              throw new Error('Please switch to BSC Testnet in your wallet');
            }
          } else {
            console.log('✅ Already on BSC Testnet');
          }
          
          console.log('Getting signer from provider...');
          const signer = await ethersProvider.getSigner();
          console.log('✅ Signer obtained');
          
          const signerAddress = await signer.getAddress();
          console.log('✅ Signer address:', signerAddress);
          console.log('✅ Matches Privy wallet:', signerAddress.toLowerCase() === wallet.address.toLowerCase());
          
          return signer;
        } else {
          // Fallback to window.ethereum if getEthereumProvider not available
          console.log('Fallback to window.ethereum');
          if (typeof window === 'undefined' || !window.ethereum) {
            throw new Error('MetaMask not detected. Please install MetaMask extension.');
          }
          
          const provider = new ethers.BrowserProvider(window.ethereum);
          console.log('✅ Provider obtained');
          
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          
          // Check and switch network
          const network = await provider.getNetwork();
          if (Number(network.chainId) !== 97) {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x61' }],
            });
          }
          
          const signer = await provider.getSigner();
          return signer;
        }
      } else if (wallet.walletClientType === 'privy' && typeof wallet.getEthersProvider === 'function') {
        // For Privy embedded wallets
        console.log('Using Privy embedded wallet');
        const provider = await wallet.getEthersProvider();
        console.log('✅ Provider obtained');
        
        const signer = await provider.getSigner();
        console.log('✅ Signer obtained');
        
        const signerAddress = await signer.getAddress();
        console.log('✅ Signer address:', signerAddress);
        
        return signer;
      } else {
        throw new Error(`Unsupported wallet type: ${wallet.walletClientType}`);
      }
    } catch (err: any) {
      console.error('❌ Failed to get signer:', err);
      setError(parseContractError(err));
      return null;
    }
  }, [authenticated, wallets]);

  /**
   * Get contract instance
   */
  const getContract = useCallback(async (): Promise<ethers.Contract | null> => {
    const signer = await getSigner();
    if (!signer) {
      setError('Failed to get wallet signer');
      return null;
    }
    
    if (contractABI.length === 0) {
      setError('Contract ABI not loaded. Please refresh the page.');
      return null;
    }

    try {
      const addresses = getContractAddresses();
      console.log('Contract addresses:', addresses);
      const contract = new ethers.Contract(addresses.predictionMarket, contractABI, signer);
      console.log('✅ Contract instance created');
      return contract;
    } catch (err: any) {
      console.error('❌ Failed to create contract instance:', err);
      setError(parseContractError(err));
      return null;
    }
  }, [getSigner, contractABI]);

  /**
   * Create a new market
   */
  const createMarket = useCallback(async (
    title: string,
    description: string,
    summary: string,
    resolutionInstructions: string,
    category: number,
    expiresAt: number,
    initialLiquidity: string
  ): Promise<{ success: boolean; txHash?: string; marketId?: number }> => {
    setLoading(true);
    setTxStatus('pending');
    setError(undefined);
    setTxHash(undefined);

    try {
      const contract = await getContract();
      if (!contract) {
        throw new Error('Failed to get contract instance');
      }

      // Note: Contract createMarket is non-payable, doesn't take liquidity directly
      // The actual contract signature is: createMarket(title, description, expiresAt, category)
      
      // Combine description fields (since contract only has one description field)
      let fullDescription = summary ? `${description}\n\n${summary}` : description;
      if (resolutionInstructions) {
        fullDescription += `\n\nResolution: ${resolutionInstructions}`;
      }
      
      // Estimate gas
      const gasLimit = await estimateGas(contract, 'createMarket', [
        title,
        fullDescription,
        expiresAt,
        category
      ]);

      // Send transaction with correct parameter order: title, description, expiresAt, category
      const tx = await contract.createMarket(
        title,
        fullDescription,
        expiresAt,
        category,
        { gasLimit }
      );

      setTxHash(tx.hash);

      // Wait for confirmation
      const receipt = await waitForTransaction(tx);
      if (!receipt) {
        throw new Error('Transaction timeout');
      }

      // Parse market ID from event
      const event = receipt.logs
        .map(log => {
          try {
            return contract.interface.parseLog(log);
          } catch {
            return null;
          }
        })
        .find(e => e?.name === 'MarketCreated');

      const marketId = event?.args?.marketId ? Number(event.args.marketId) : undefined;

      setTxStatus('success');
      setLoading(false);

      return { success: true, txHash: tx.hash, marketId };
    } catch (err: any) {
      const errorMsg = parseContractError(err);
      setError(errorMsg);
      setTxStatus('error');
      setLoading(false);
      return { success: false };
    }
  }, [getContract]);

  /**
   * Commit a bet (darkpool)
   */
  const commitBet = useCallback(async (
    marketId: number,
    commitHash: string,
    amount: string
  ): Promise<{ success: boolean; txHash?: string }> => {
    setLoading(true);
    setTxStatus('pending');
    setError(undefined);
    setTxHash(undefined);

    try {
      const contract = await getContract();
      if (!contract) {
        throw new Error('Failed to get contract instance');
      }

      const amountWei = ethers.parseEther(amount);
      
      // Estimate gas
      const gasLimit = await estimateGas(contract, 'commitBet', [
        marketId,
        commitHash,
        { value: amountWei }
      ]);

      // Send transaction
      const tx = await contract.commitBet(
        marketId,
        commitHash,
        { value: amountWei, gasLimit }
      );

      setTxHash(tx.hash);

      // Wait for confirmation
      const receipt = await waitForTransaction(tx);
      if (!receipt) {
        throw new Error('Transaction timeout');
      }

      setTxStatus('success');
      setLoading(false);

      return { success: true, txHash: tx.hash };
    } catch (err: any) {
      const errorMsg = parseContractError(err);
      setError(errorMsg);
      setTxStatus('error');
      setLoading(false);
      return { success: false };
    }
  }, [getContract]);

  /**
   * Reveal a bet
   */
  const revealBet = useCallback(async (
    marketId: number,
    outcome: boolean,
    salt: string
  ): Promise<{ success: boolean; txHash?: string }> => {
    setLoading(true);
    setTxStatus('pending');
    setError(undefined);
    setTxHash(undefined);

    try {
      const contract = await getContract();
      if (!contract) {
        throw new Error('Failed to get contract instance');
      }

      // Estimate gas
      const gasLimit = await estimateGas(contract, 'revealBet', [
        marketId,
        outcome,
        salt
      ]);

      // Send transaction
      const tx = await contract.revealBet(
        marketId,
        outcome,
        salt,
        { gasLimit }
      );

      setTxHash(tx.hash);

      // Wait for confirmation
      const receipt = await waitForTransaction(tx);
      if (!receipt) {
        throw new Error('Transaction timeout');
      }

      setTxStatus('success');
      setLoading(false);

      return { success: true, txHash: tx.hash };
    } catch (err: any) {
      const errorMsg = parseContractError(err);
      setError(errorMsg);
      setTxStatus('error');
      setLoading(false);
      return { success: false };
    }
  }, [getContract]);

  /**
   * Claim winnings
   */
  const claimWinnings = useCallback(async (
    marketId: number
  ): Promise<{ success: boolean; txHash?: string; amount?: string }> => {
    setLoading(true);
    setTxStatus('pending');
    setError(undefined);
    setTxHash(undefined);

    try {
      const contract = await getContract();
      if (!contract) {
        throw new Error('Failed to get contract instance');
      }

      // Estimate gas
      const gasLimit = await estimateGas(contract, 'claimWinnings', [marketId]);

      // Send transaction
      const tx = await contract.claimWinnings(marketId, { gasLimit });

      setTxHash(tx.hash);

      // Wait for confirmation
      const receipt = await waitForTransaction(tx);
      if (!receipt) {
        throw new Error('Transaction timeout');
      }

      // Parse winnings amount from event
      const event = receipt.logs
        .map(log => {
          try {
            return contract.interface.parseLog(log);
          } catch {
            return null;
          }
        })
        .find(e => e?.name === 'WinningsClaimed');

      const amount = event?.args?.amount ? ethers.formatEther(event.args.amount) : undefined;

      setTxStatus('success');
      setLoading(false);

      return { success: true, txHash: tx.hash, amount };
    } catch (err: any) {
      const errorMsg = parseContractError(err);
      setError(errorMsg);
      setTxStatus('error');
      setLoading(false);
      return { success: false };
    }
  }, [getContract]);

  /**
   * Resolve a market (oracle/admin only)
   */
  const resolveMarket = useCallback(async (
    marketId: number,
    outcome: boolean,
    reasoning: string
  ): Promise<{ success: boolean; txHash?: string }> => {
    setLoading(true);
    setTxStatus('pending');
    setError(undefined);
    setTxHash(undefined);

    try {
      const contract = await getContract();
      if (!contract) {
        throw new Error('Failed to get contract instance');
      }

      // Estimate gas
      const gasLimit = await estimateGas(contract, 'resolveMarket', [
        marketId,
        outcome,
        reasoning
      ]);

      // Send transaction
      const tx = await contract.resolveMarket(
        marketId,
        outcome,
        reasoning,
        { gasLimit }
      );

      setTxHash(tx.hash);

      // Wait for confirmation
      const receipt = await waitForTransaction(tx);
      if (!receipt) {
        throw new Error('Transaction timeout');
      }

      setTxStatus('success');
      setLoading(false);

      return { success: true, txHash: tx.hash };
    } catch (err: any) {
      const errorMsg = parseContractError(err);
      setError(errorMsg);
      setTxStatus('error');
      setLoading(false);
      return { success: false };
    }
  }, [getContract]);

  /**
   * Read market data from contract
   */
  const getMarketData = useCallback(async (marketId: number): Promise<any | null> => {
    try {
      const contract = await getContract();
      if (!contract) return null;

      const data = await contract.markets(marketId);
      return data;
    } catch (err) {
      console.error('Failed to fetch market data:', err);
      return null;
    }
  }, [getContract]);

  /**
   * Get user's bet info
   */
  const getUserBet = useCallback(async (marketId: number, userAddress: string): Promise<any | null> => {
    try {
      const contract = await getContract();
      if (!contract) return null;

      const betData = await contract.getUserBet(marketId, userAddress);
      return betData;
    } catch (err) {
      console.error('Failed to fetch user bet:', err);
      return null;
    }
  }, [getContract]);

  /**
   * Reset transaction state
   */
  const resetTxState = useCallback(() => {
    setTxStatus('idle');
    setTxHash(undefined);
    setError(undefined);
  }, []);

  return {
    // State
    loading,
    txStatus,
    txHash,
    error,
    authenticated,
    userAddress: user?.wallet?.address,

    // Write methods
    createMarket,
    commitBet,
    revealBet,
    claimWinnings,
    resolveMarket,

    // Read methods
    getMarketData,
    getUserBet,

    // Utilities
    resetTxState,
  };
}

