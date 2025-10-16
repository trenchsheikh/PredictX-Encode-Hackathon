'use client';

import { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import {
  getContractAddresses,
  checkNetwork,
  estimateGas,
  waitForTransaction,
  parseContractError,
  switchToBSCTestnet,
  switchToBSCMainnet,
} from '@/lib/blockchain-utils';
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

  // Load ABIs on mount
  useEffect(() => {
    async function loadABIs() {
      try {
        console.log('Loading contract ABIs...');
        // Load BSC Mainnet ABI
        const predictionRes = await fetch(
          `/deployments/bscMainnet/PredictionMarket.json`
        );

        if (predictionRes.ok) {
          const predictionABI = await predictionRes.json();
          console.log(
            'PredictionMarket ABI loaded:',
            predictionABI.length,
            'functions'
          );
          setContractABI(predictionABI);
        } else {
          console.error(
            'Failed to load PredictionMarket ABI:',
            predictionRes.status
          );
        }
      } catch (err) {
        console.error('Failed to load contract ABIs:', err);
      }
    }
    loadABIs();
  }, []);

  /**
   * Get signer from Privy wallet
   */
  const getSigner = useCallback(async (): Promise<ethers.Signer | null> => {
    console.log('🔍 Getting signer...', {
      authenticated,
      walletCount: wallets.length,
      userAddress: user?.wallet?.address,
    });

    if (!authenticated) {
      const errorMsg = 'Please connect your wallet first';
      console.error(errorMsg);
      setError(errorMsg);
      return null;
    }

    if (!wallets || wallets.length === 0) {
      const errorMsg = 'No wallet found. Please connect your wallet.';
      console.error(errorMsg);
      setError(errorMsg);
      return null;
    }

    try {
      const wallet = wallets[0];
      console.log('🔍 Wallet found:', {
        address: wallet.address,
        type: wallet.walletClientType,
        chainId: wallet.chainId,
        availableMethods: Object.keys(wallet).filter(
          key => typeof (wallet as any)[key] === 'function'
        ),
      });

      // Try multiple methods to get the signer
      let signer: ethers.Signer | null = null;

      // Method 1: Try Privy's getEthereumProvider (for MetaMask)
      if (
        wallet.walletClientType === 'metamask' ||
        wallet.walletClientType === 'injected'
      ) {
        console.log('Trying MetaMask via Privy...');

        if (typeof wallet.getEthereumProvider === 'function') {
          try {
            console.log('Using Privy getEthereumProvider...');
            const provider = await wallet.getEthereumProvider();
            console.log('Provider obtained from Privy');

            const ethersProvider = new ethers.BrowserProvider(provider);

            // Verify wallet is on BSC Mainnet (no switching)
            const chainIdStr = wallet.chainId?.toString();
            const expectedChainId = '56'; // BSC Mainnet
            const expectedChainIdHex = '0x38'; // BSC Mainnet hex
            const expectedChainIdEip155 = 'eip155:56'; // BSC Mainnet EIP155

            // Debug network check (only in development)
            if (process.env.NODE_ENV === 'development') {
              console.log('🔍 BSC Mainnet Check:', {
                currentChainId: chainIdStr,
                expectedChainId,
                expectedChainIdHex,
                expectedChainIdEip155,
                isCorrectNetwork:
                  chainIdStr === expectedChainIdHex ||
                  chainIdStr === expectedChainId ||
                  chainIdStr === expectedChainIdEip155,
              });
            }

            if (
              chainIdStr !== expectedChainIdHex &&
              chainIdStr !== expectedChainId &&
              chainIdStr !== expectedChainIdEip155
            ) {
              const errorMsg = `Wallet must be on BSC Mainnet (Chain ID: 56). Current: ${chainIdStr || 'Unknown'}. Please switch to BSC Mainnet in your wallet and try again.`;
              console.error('❌ Wrong network:', errorMsg);
              setError(errorMsg);
              return null;
            }

            console.log(`✅ Wallet is on BSC Mainnet`);

            signer = await ethersProvider.getSigner();
            console.log('✅ Signer obtained via Privy');

            // Verify the signer is working and on correct network
            try {
              const signerAddress = await signer.getAddress();
              console.log('✅ Signer address verified:', signerAddress);

              // Check if we're on the correct network
              const network = await ethersProvider.getNetwork();
              console.log('🔍 Current network after switch:', {
                chainId: network.chainId,
                name: network.name,
              });

              if (Number(network.chainId) !== 56) {
                console.warn(
                  '⚠️ Still not on BSC Mainnet after switch. Chain ID:',
                  network.chainId
                );
                throw new Error(
                  `Wallet is on wrong network. Expected BSC Mainnet (56), got ${network.chainId}`
                );
              }

              console.log('✅ Confirmed on BSC Mainnet');
            } catch (signerError: any) {
              console.error(
                '❌ Signer verification failed:',
                signerError.message
              );
              throw new Error(
                `Signer verification failed: ${signerError.message}`
              );
            }
          } catch (privyError: any) {
            console.warn('Privy method failed:', privyError.message);
          }
        }

        // Method 2: Fallback to window.ethereum
        if (!signer && typeof window !== 'undefined' && window.ethereum) {
          try {
            console.log('Fallback to window.ethereum...');
            const provider = new ethers.BrowserProvider(window.ethereum);

            // Request accounts
            await window.ethereum.request({ method: 'eth_requestAccounts' });

            // Verify wallet is on BSC Mainnet (no switching)
            const network = await provider.getNetwork();
            console.log('Current network:', {
              chainId: network.chainId,
              name: network.name,
            });

            if (Number(network.chainId) !== 56) {
              const errorMsg = `Wallet must be on BSC Mainnet (Chain ID: 56). Current: ${network.chainId}. Please switch to BSC Mainnet in your wallet and try again.`;
              console.error('❌ Wrong network:', errorMsg);
              setError(errorMsg);
              return null;
            }

            console.log(`✅ Wallet is on BSC Mainnet`);

            signer = await provider.getSigner();
            console.log('✅ Signer obtained via window.ethereum');

            // Verify the signer is working
            try {
              const signerAddress = await signer.getAddress();
              console.log('✅ Signer address verified:', signerAddress);
            } catch (signerError: any) {
              console.error(
                '❌ Signer verification failed:',
                signerError.message
              );
              throw new Error(
                `Signer verification failed: ${signerError.message}`
              );
            }
          } catch (windowError: any) {
            console.warn('Window.ethereum method failed:', windowError.message);
          }
        }
      }

      // Method 3: Try Privy embedded wallet
      if (
        !signer &&
        wallet.walletClientType === 'privy' &&
        typeof wallet.getEthereumProvider === 'function'
      ) {
        try {
          console.log('Trying Privy embedded wallet...');
          const provider = await wallet.getEthereumProvider();
          const ethersProvider = new ethers.BrowserProvider(provider);
          signer = await ethersProvider.getSigner();
          console.log('Signer obtained via Privy embedded wallet');
        } catch (privyError: any) {
          console.warn('Privy embedded wallet failed:', privyError.message);
        }
      }

      // Method 4: Try any available method on the wallet object
      if (!signer) {
        console.log('Trying any available signer method...');
        const methods = Object.keys(wallet).filter(
          key =>
            typeof (wallet as any)[key] === 'function' &&
            (key.includes('signer') ||
              key.includes('provider') ||
              key.includes('ethereum'))
        );

        console.log('Available methods to try:', methods);

        for (const method of methods) {
          try {
            console.log(`Trying wallet.${method}...`);
            const result = await (wallet as any)[method]();
            console.log(`Result from wallet.${method}:`, result);

            if (result && typeof result.getSigner === 'function') {
              signer = await result.getSigner();
              console.log(`Signer obtained via wallet.${method}`);
              break;
            } else if (result && typeof result.getSigner === 'function') {
              // Some wallets might have getSigner as a property
              signer = result.getSigner;
              console.log(`Signer obtained via wallet.${method} (property)`);
              break;
            }
          } catch (methodError: any) {
            console.warn(`wallet.${method} failed:`, methodError.message);
          }
        }
      }

      // Method 5: Try to create a simple provider from the wallet address
      if (!signer && wallet.address) {
        try {
          console.log('🔍 Trying to create provider from wallet address...');
          if (typeof window !== 'undefined' && window.ethereum) {
            const provider = new ethers.BrowserProvider(window.ethereum);
            signer = await provider.getSigner();
            console.log(
              'Signer created from window.ethereum with wallet address'
            );
          }
        } catch (addressError: any) {
          console.warn(
            '⚠️ Address-based signer creation failed:',
            addressError.message
          );
        }
      }

      // Method 6: Create a basic signer if all else fails
      if (!signer && wallet.address) {
        try {
          console.log('🔍 Creating basic signer as last resort...');
          if (typeof window !== 'undefined' && window.ethereum) {
            const provider = new ethers.BrowserProvider(window.ethereum);

            // Create a basic signer with just the address
            const basicSigner = {
              getAddress: async () => wallet.address,
              signMessage: async (message: string) => {
                return await window.ethereum.request({
                  method: 'personal_sign',
                  params: [message, wallet.address],
                });
              },
              signTransaction: async (transaction: any) => {
                return await window.ethereum.request({
                  method: 'eth_signTransaction',
                  params: [transaction],
                });
              },
              sendTransaction: async (transaction: any) => {
                return await window.ethereum.request({
                  method: 'eth_sendTransaction',
                  params: [transaction],
                });
              },
              provider: provider,
              _isSigner: true,
            };

            signer = basicSigner as any;
            console.log('✅ Basic signer created');
          }
        } catch (basicError: any) {
          console.warn('⚠️ Basic signer creation failed:', basicError.message);
        }
      }

      if (!signer) {
        throw new Error(
          `Unable to get signer from wallet type: ${wallet.walletClientType}. Available methods: ${Object.keys(
            wallet
          )
            .filter(key => typeof (wallet as any)[key] === 'function')
            .join(', ')}`
        );
      }

      // Verify signer
      try {
        const signerAddress = await signer.getAddress();
        console.log('✅ Signer address:', signerAddress);
        console.log('✅ Wallet address:', wallet.address);
        console.log(
          '✅ Addresses match:',
          signerAddress.toLowerCase() === wallet.address.toLowerCase()
        );
      } catch (addressError: any) {
        console.warn('⚠️ Could not get signer address:', addressError.message);
        console.log('Signer object:', signer);
        console.log('Signer methods:', Object.getOwnPropertyNames(signer));
        console.log(
          'Signer prototype methods:',
          Object.getOwnPropertyNames(Object.getPrototypeOf(signer))
        );

        // Check if signer has the expected methods
        if (typeof signer.getAddress !== 'function') {
          throw new Error(
            'Signer does not have getAddress method. Signer type: ' +
              typeof signer
          );
        }
      }

      return signer;
    } catch (err: any) {
      console.error('❌ Failed to get signer:', err);
      const errorMsg = `Failed to get wallet signer: ${err.message}`;
      setError(errorMsg);
      return null;
    }
  }, [authenticated, wallets, user?.wallet?.address]);

  /**
   * Get contract instance
   */
  const getContract = useCallback(async (): Promise<ethers.Contract | null> => {
    console.log('🔍 Getting contract instance...', {
      authenticated,
      walletCount: wallets?.length || 0,
      abiLength: contractABI.length,
    });

    try {
      // Check if user is authenticated
      if (!authenticated) {
        const errorMsg = 'Please connect your wallet first';
        console.error(errorMsg);
        setError(errorMsg);
        return null;
      }

      // Check if wallet is available
      if (!wallets || wallets.length === 0) {
        const errorMsg = 'No wallet found. Please connect your wallet.';
        console.error(errorMsg);
        setError(errorMsg);
        return null;
      }

      console.log('🔍 Getting signer...');
      const signer = await getSigner();
      if (!signer) {
        const errorMsg =
          'Failed to get wallet signer. Please check your wallet connection.';
        console.error(errorMsg);
        setError(errorMsg);
        return null;
      }
      console.log('✅ Signer obtained for contract creation');

      // Test signer before using it
      try {
        const testAddress = await signer.getAddress();
        console.log('✅ Signer test passed, address:', testAddress);
      } catch (signerTestError: any) {
        console.error('❌ Signer test failed:', signerTestError);
        throw new Error(`Signer is invalid: ${signerTestError.message}`);
      }

      if (contractABI.length === 0) {
        const errorMsg =
          'Contract ABI not loaded. Please refresh the page and try again.';
        console.error(errorMsg);
        setError(errorMsg);
        return null;
      }
      console.log('ABI loaded');

      // Check network
      console.log('Checking network...');

      // First try to get chainId from wallet
      const wallet = wallets[0];
      let currentChainId: string | number = wallet.chainId;

      // Convert chainId to number if it's in different formats
      if (typeof currentChainId === 'string') {
        if (currentChainId.startsWith('eip155:')) {
          currentChainId = parseInt(currentChainId.split(':')[1]);
        } else if (currentChainId.startsWith('0x')) {
          currentChainId = parseInt(currentChainId, 16);
        } else {
          currentChainId = parseInt(currentChainId);
        }
      }

      console.log('Wallet chainId:', {
        original: wallet.chainId,
        converted: currentChainId,
      });

      // Verify wallet is on BSC Mainnet (no switching)
      if (currentChainId !== 56) {
        const errorMsg = `Wallet must be on BSC Mainnet (Chain ID: 56). Current: ${currentChainId || 'Unknown'}. Please switch to BSC Mainnet in your wallet and try again.`;
        console.error('❌ Wrong network:', errorMsg);
        setError(errorMsg);
        return null;
      }

      console.log(`✅ Wallet is on BSC Mainnet`);

      // Also try the provider-based check as backup
      try {
        const networkCheck = await checkNetwork();
        if (!networkCheck.isCorrect) {
          console.warn(
            'Provider-based network check failed, but wallet chainId is correct'
          );
        }
      } catch (networkError: any) {
        console.warn('Network check failed:', networkError.message);
        // Continue anyway since wallet chainId check passed
      }

      console.log('✅ Network check passed');

      const addresses = getContractAddresses();
      console.log('Contract addresses:', addresses);

      if (!addresses.predictionMarket) {
        const errorMsg =
          'Contract address not found. Please check your configuration.';
        console.error(errorMsg);
        setError(errorMsg);
        return null;
      }

      console.log('🔍 Creating contract instance...');

      // Verify signer before creating contract
      if (!signer || typeof signer.getAddress !== 'function') {
        throw new Error('Invalid signer: missing getAddress method');
      }

      // Test signer before using it
      try {
        const testAddress = await signer.getAddress();
        console.log('✅ Signer test passed, address:', testAddress);
      } catch (signerTestError: any) {
        console.error('Signer test failed:', signerTestError);
        throw new Error(`Signer is invalid: ${signerTestError.message}`);
      }

      const contract = new ethers.Contract(
        addresses.predictionMarket,
        contractABI,
        signer
      );
      console.log('✅ Contract instance created successfully');
      return contract;
    } catch (err: any) {
      console.error('Failed to create contract instance:', err);
      const errorMessage = err.message || 'Unknown error occurred';
      setError(`Failed to get contract instance: ${errorMessage}`);
      return null;
    }
  }, [authenticated, wallets, getSigner, contractABI]);

  /**
   * Create a new market
   */
  const createMarket = useCallback(
    async (
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
        let fullDescription = summary
          ? `${description}\n\n${summary}`
          : description;
        if (resolutionInstructions) {
          fullDescription += `\n\nResolution: ${resolutionInstructions}`;
        }

        // Estimate gas
        const gasLimit = await estimateGas(contract, 'createMarket', [
          title,
          fullDescription,
          expiresAt,
          category,
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

        const marketId = event?.args?.marketId
          ? Number(event.args.marketId)
          : undefined;

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
    },
    [getContract]
  );

  /**
   * Commit a bet (darkpool)
   */
  const commitBet = useCallback(
    async (
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
          { value: amountWei },
        ]);

        // Send transaction
        const tx = await contract.commitBet(marketId, commitHash, {
          value: amountWei,
          gasLimit,
        });

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
    },
    [getContract]
  );

  /**
   * Reveal a bet
   */
  const revealBet = useCallback(
    async (
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
          salt,
        ]);

        // Send transaction
        const tx = await contract.revealBet(marketId, outcome, salt, {
          gasLimit,
        });

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
    },
    [getContract]
  );

  /**
   * Claim winnings
   */
  const claimWinnings = useCallback(
    async (
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

        // Debug: Check market and bet data before claiming
        console.log('Checking market and bet data before claiming...');
        console.log('Market ID:', marketId, 'Type:', typeof marketId);

        try {
          console.log('Calling getMarket with marketId:', marketId);

          // First check if market exists by trying to get basic info
          try {
            const market = await contract.getMarket(marketId);
            console.log('Market exists on blockchain');
          } catch (marketError: any) {
            console.error('Market does not exist on blockchain:', marketError);
            throw new Error(
              `Market ${marketId} does not exist on blockchain. Error: ${marketError.message}`
            );
          }

          const market = await contract.getMarket(marketId);
          console.log('Raw market data:', market);

          // Handle both array and object formats
          let marketData;
          if (
            Array.isArray(market) ||
            (market && typeof market === 'object' && '0' in market)
          ) {
            // Market data is returned as array or indexed object
            // Let's log all indices to understand the structure
            console.log('Market indices:', {
              '0': market[0]?.toString(),
              '1': market[1],
              '2': market[2],
              '3': market[3],
              '4': market[4]?.toString(),
              '5': market[5]?.toString(),
              '6': market[6]?.toString(),
              '7': market[7]?.toString(),
              '8': market[8]?.toString(),
              '9': market[9]?.toString(),
              '10': market[10]?.toString(),
              '11': market[11]?.toString(),
              '12': market[12],
              '13': market[13]?.toString(),
              '14': market[14],
              '15': market[15],
            });

            // Based on the actual data structure from the logs
            marketData = {
              marketId: market[0]?.toString() || 'undefined',
              title: market[1] || 'undefined',
              description: market[2] || 'undefined',
              creator: market[3] || 'undefined',
              createdAt: market[4]?.toString() || 'undefined',
              expiresAt: market[5]?.toString() || 'undefined',
              category: market[6]?.toString() || 'undefined',
              totalPool: market[7]?.toString() || 'undefined',
              yesShares: market[8]?.toString() || 'undefined',
              noShares: market[9]?.toString() || 'undefined',
              status: market[10]?.toString() || 'undefined',
              outcome: market[11] ? (market[11] > 0 ? true : false) : false, // Convert bigint to boolean
              resolutionReasoning: market[12] || 'undefined',
              fee: market[13]?.toString() || 'undefined',
              cancelled: market[14] || false,
              resolutionTxHash: market[15] || 'undefined',
            };
          } else {
            // Market data is returned as object with named properties
            marketData = {
              marketId: market?.marketId?.toString() || 'undefined',
              status: market?.status?.toString() || 'undefined',
              outcome: market?.outcome,
              totalPool: market?.totalPool?.toString() || 'undefined',
              yesShares: market?.yesShares?.toString() || 'undefined',
              noShares: market?.noShares?.toString() || 'undefined',
            };
          }
          console.log('Market data:', marketData);

          let userAddress;
          try {
            // Check if signer has getAddress method
            if (
              contract.signer &&
              typeof (contract.signer as any).getAddress === 'function'
            ) {
              userAddress = await (contract.signer as any).getAddress();
              console.log('User address from signer:', userAddress);
            } else {
              throw new Error('Signer does not have getAddress method');
            }
          } catch (addressError: any) {
            console.warn(
              'Failed to get address from signer:',
              addressError.message
            );
            // Fallback to wallet address
            if (wallets && wallets.length > 0) {
              userAddress = wallets[0].address;
              console.log('Using wallet address as fallback:', userAddress);
            } else {
              throw new Error('Cannot get user address');
            }
          }

          let bet;
          try {
            bet = await contract.getBet(marketId, userAddress);
            console.log('Raw bet data from getBet:', bet);
          } catch (getBetError: any) {
            console.warn(
              'getBet failed, trying alternative method:',
              getBetError.message
            );

            // Try alternative method - check if bet exists in the bets mapping
            try {
              bet = await contract.bets(marketId, userAddress);
              console.log('Raw bet data from bets mapping:', bet);
            } catch (betsError: any) {
              console.error('bets mapping also failed:', betsError.message);
              throw new Error(
                `Failed to fetch bet data: ${getBetError.message}`
              );
            }
          }

          // Safely extract bet data with null checks
          const betData = {
            user: bet?.user || 'undefined',
            amount: bet?.amount?.toString() || 'undefined',
            outcome: bet?.outcome,
            claimed: bet?.claimed,
            shares: bet?.shares?.toString() || 'undefined',
          };
          console.log('Bet data:', betData);

          // Check requirements with safe data
          if (!market || marketData.status === 'undefined') {
            throw new Error('Failed to fetch market data from contract');
          }

          // Check if market is resolved on blockchain
          if (marketData.status !== '2') {
            console.log(
              '⚠️ Market not resolved on blockchain, checking database...'
            );

            // Try to get market data from backend API as fallback
            try {
              const response = await fetch(`/api/markets/${marketId}`);

              if (response.ok) {
                const dbResponse = await response.json();
                console.log('Database market data:', dbResponse);

                // Handle different response structures
                let dbMarket;
                if (dbResponse.success && dbResponse.data) {
                  dbMarket = dbResponse.data;
                  console.log('Using dbResponse.data structure');
                } else if (dbResponse.marketId) {
                  dbMarket = dbResponse;
                  console.log('Using direct dbResponse structure');
                } else {
                  console.error(
                    'Invalid database response format:',
                    dbResponse
                  );
                  throw new Error('Invalid database response format');
                }

                console.log('Parsed database market:', dbMarket);
                console.log(
                  'Database market status:',
                  dbMarket.status,
                  'Type:',
                  typeof dbMarket.status
                );

                // If market is resolved in database, proceed with claim
                if (dbMarket.status === 2) {
                  console.log(
                    '✅ Market resolved in database, proceeding with claim...'
                  );
                } else {
                  console.log(
                    '❌ Market not resolved in database. Status:',
                    dbMarket.status
                  );
                  throw new Error(
                    `Market not resolved. Blockchain status: ${marketData.status}, Database status: ${dbMarket.status}. Please wait for resolution or contact support.`
                  );
                }
              } else {
                throw new Error(
                  `Market not resolved on blockchain. Status: ${marketData.status}. Please wait for resolution or contact support.`
                );
              }
            } catch (dbError: any) {
              console.error('Database check failed:', dbError);
              throw new Error(
                `Market not resolved on blockchain. Status: ${marketData.status}. Please wait for resolution or contact support.`
              );
            }
          }

          if (!bet || bet.amount === undefined) {
            throw new Error('Failed to fetch bet data from contract');
          }
          if (bet.amount === 0) {
            throw new Error('No bet found for this user');
          }
          if (bet.claimed) {
            throw new Error('Bet already claimed');
          }
          if (bet.outcome !== market.outcome) {
            throw new Error(
              `Bet did not win. Bet outcome: ${bet.outcome}, Market outcome: ${market.outcome}`
            );
          }

          console.log('All requirements met, proceeding with claim...');
        } catch (debugError: any) {
          console.error('Pre-claim validation failed:', debugError);

          // Check if it's a contract call error
          if (
            debugError.code === 'CALL_EXCEPTION' ||
            debugError.message.includes('missing revert data')
          ) {
            throw new Error(
              `Market ${marketId} does not exist on blockchain or contract call failed. Please check if the market is properly deployed.`
            );
          }

          throw new Error(`Pre-claim validation failed: ${debugError.message}`);
        }

        // Estimate gas
        const gasLimit = await estimateGas(contract, 'claimWinnings', [
          marketId,
        ]);

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

        const amount = event?.args?.amount
          ? ethers.formatEther(event.args.amount)
          : undefined;

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
    },
    [getContract]
  );

  /**
   * Check if refund is available for a market
   */
  const checkRefundAvailability = useCallback(
    async (
      marketId: number
    ): Promise<{ available: boolean; reason?: string; amount?: string }> => {
      try {
        const contract = await getContract();
        if (!contract) {
          return { available: false, reason: 'Contract not available' };
        }

        // Get user address safely
        let userAddress: string;
        try {
          userAddress = await (contract.signer as any).getAddress();
        } catch (addressError: any) {
          console.error(
            'Failed to get user address from signer:',
            addressError
          );

          // Fallback to wallet address
          if (wallets && wallets.length > 0) {
            userAddress = wallets[0].address;
            console.log('Using wallet address as fallback:', userAddress);
          } else {
            return { available: false, reason: 'Failed to get user address' };
          }
        }

        // Get market data
        const market = await contract.getMarket(marketId);
        const commitment = await contract.getCommitment(marketId, userAddress);

        // Check if user has a commitment
        if (
          commitment.commitHash ===
          '0x0000000000000000000000000000000000000000000000000000000000000000'
        ) {
          return { available: false, reason: 'No commitment found' };
        }

        // Check if already revealed
        if (commitment.revealed) {
          return { available: false, reason: 'Already revealed' };
        }

        // Check market status and timing
        const now = Math.floor(Date.now() / 1000);
        const expiresAt = Number(market.expiresAt);
        const commitRevealTimeout = 3600; // 1 hour in seconds

        if (market.status === 3) {
          // Cancelled
          return {
            available: true,
            amount: ethers.formatEther(commitment.amount),
            reason: 'Market cancelled',
          };
        } else if (
          market.status === 1 &&
          now > expiresAt + commitRevealTimeout
        ) {
          // Resolving + timeout
          return {
            available: true,
            amount: ethers.formatEther(commitment.amount),
            reason: 'Reveal period expired',
          };
        } else {
          return {
            available: false,
            reason: `Refunds not available. Market status: ${market.status}, Expired: ${now > expiresAt}, Timeout: ${now > expiresAt + commitRevealTimeout}`,
          };
        }
      } catch (err: any) {
        console.error('Error checking refund availability:', err);
        return { available: false, reason: `Error: ${err.message}` };
      }
    },
    [getContract, wallets]
  );

  /**
   * Claim refund for unrevealed commitment
   */
  const claimRefund = useCallback(
    async (
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

        // Check if refund is available first
        const refundCheck = await checkRefundAvailability(marketId);
        if (!refundCheck.available) {
          throw new Error(`Refund not available: ${refundCheck.reason}`);
        }

        // Estimate gas
        const gasLimit = await estimateGas(contract, 'claimRefund', [marketId]);

        // Send transaction
        const tx = await contract.claimRefund(marketId, { gasLimit });

        setTxHash(tx.hash);

        // Wait for confirmation
        const receipt = await waitForTransaction(tx);
        if (!receipt) {
          throw new Error('Transaction timeout');
        }

        setTxStatus('success');
        setLoading(false);

        return { success: true, txHash: tx.hash, amount: refundCheck.amount };
      } catch (err: any) {
        const errorMsg = parseContractError(err);
        setError(errorMsg);
        setTxStatus('error');
        setLoading(false);
        return { success: false };
      }
    },
    [getContract, checkRefundAvailability]
  );

  /**
   * Resolve a market (oracle/admin only)
   */
  const resolveMarket = useCallback(
    async (
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
          reasoning,
        ]);

        // Send transaction
        const tx = await contract.resolveMarket(marketId, outcome, reasoning, {
          gasLimit,
        });

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
    },
    [getContract]
  );

  /**
   * Read market data from contract
   */
  const getMarketData = useCallback(
    async (marketId: number): Promise<any | null> => {
      try {
        const contract = await getContract();
        if (!contract) return null;

        const data = await contract.markets(marketId);
        return data;
      } catch (err) {
        console.error('Failed to fetch market data:', err);
        return null;
      }
    },
    [getContract]
  );

  /**
   * Get user's bet info
   */
  const getUserBet = useCallback(
    async (marketId: number, userAddress: string): Promise<any | null> => {
      try {
        const contract = await getContract();
        if (!contract) return null;

        const betData = await contract.getUserBet(marketId, userAddress);
        return betData;
      } catch (err) {
        console.error('Failed to fetch user bet:', err);
        return null;
      }
    },
    [getContract]
  );

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
    claimRefund,
    resolveMarket,

    // Read methods
    getMarketData,
    getUserBet,
    checkRefundAvailability,

    // Utilities
    resetTxState,
  };
}
