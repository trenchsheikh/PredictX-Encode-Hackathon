'use client';

import { useState, useCallback, useEffect } from 'react';

import { usePrivy, useWallets } from '@privy-io/react-auth';
import { ethers } from 'ethers';

import type { TransactionStatus } from '@/components/ui/transaction-status';
import {
  getContractAddresses,
  checkNetwork,
  estimateGas,
  waitForTransaction,
  parseContractError,
} from '@/lib/blockchain-utils';

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
  const [contractABI, setContractABI] = useState<ethers.InterfaceAbi>([]);

  // Load ABIs on mount
  useEffect(() => {
    async function loadABIs() {
      try {
        // eslint-disable-next-line no-console
        console.log('Loading contract ABIs...');
        // Determine which network to load from based on environment
        const network =
          process.env.NEXT_PUBLIC_CHAIN_ID === '56'
            ? 'bscMainnet'
            : 'bscTestnet';
        const predictionRes = await fetch(
          `/deployments/${network}/PredictionMarket.json`
        );

        if (predictionRes.ok) {
          const predictionABI = await predictionRes.json();
          // eslint-disable-next-line no-console
          console.log(
            'PredictionMarket ABI loaded:',
            predictionABI.length,
            'functions'
          );
          setContractABI(predictionABI);
        } else {
          // eslint-disable-next-line no-console
          console.error(
            'Failed to load PredictionMarket ABI:',
            predictionRes.status
          );
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to load contract ABIs:', err);
      }
    }
    loadABIs();
  }, []);

  /**
   * Get signer from Privy wallet
   */
  const getSigner = useCallback(async (): Promise<ethers.Signer | null> => {
    // eslint-disable-next-line no-console
    console.log('🔍 Getting signer...', {
      authenticated,
      walletCount: wallets.length,
      userAddress: user?.wallet?.address,
    });

    if (!authenticated) {
      const errorMsg = 'Please connect your wallet first';
      // eslint-disable-next-line no-console
      console.error(errorMsg);
      setError(errorMsg);
      return null;
    }

    if (!wallets || wallets.length === 0) {
      const errorMsg = 'No wallet found. Please connect your wallet.';
      // eslint-disable-next-line no-console
      console.error(errorMsg);
      setError(errorMsg);
      return null;
    }

    try {
      const wallet = wallets[0];
      // eslint-disable-next-line no-console
      console.log('🔍 Wallet found:', {
        address: wallet.address,
        type: wallet.walletClientType,
        chainId: wallet.chainId,
        availableMethods: Object.keys(wallet).filter(
          key => typeof (wallet as Record<string, unknown>)[key] === 'function'
        ),
      });

      // Try multiple methods to get the signer
      let signer: ethers.Signer | null = null;

      // Method 1: Try Privy's getEthereumProvider (for MetaMask)
      if (
        wallet.walletClientType === 'metamask' ||
        wallet.walletClientType === 'injected'
      ) {
        // eslint-disable-next-line no-console
        console.log('Trying MetaMask via Privy...');

        if (typeof wallet.getEthereumProvider === 'function') {
          try {
            // eslint-disable-next-line no-console
            console.log('Using Privy getEthereumProvider...');
            const provider = await wallet.getEthereumProvider();
            // eslint-disable-next-line no-console
            console.log('Provider obtained from Privy');

            const ethersProvider = new ethers.BrowserProvider(provider);

            // Verify wallet is on correct network
            const chainIdStr = wallet.chainId?.toString();
            const expectedChainId =
              process.env.NEXT_PUBLIC_CHAIN_ID === '56' ? '56' : '97';
            const expectedChainIdHex =
              process.env.NEXT_PUBLIC_CHAIN_ID === '56' ? '0x38' : '0x61';
            const expectedChainIdEip155 =
              process.env.NEXT_PUBLIC_CHAIN_ID === '56'
                ? 'eip155:56'
                : 'eip155:97';
            const networkName =
              process.env.NEXT_PUBLIC_CHAIN_ID === '56'
                ? 'BSC Mainnet'
                : 'BSC Testnet';

            // Debug network check (only in development)
            if (process.env.NODE_ENV === 'development') {
              // eslint-disable-next-line no-console
              console.log(`🔍 ${networkName} Check:`, {
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
              // eslint-disable-next-line no-console
              console.log(`Switching to ${networkName}...`, {
                currentChainId: wallet.chainId,
                expectedChainId,
              });
              try {
                await wallet.switchChain(parseInt(expectedChainId));
                // eslint-disable-next-line no-console
                console.log(`Switched to ${networkName}`);
              } catch (switchError: unknown) {
                // eslint-disable-next-line no-console
                console.warn('Failed to switch chain:', switchError.message);
                // Try alternative method
                try {
                  // eslint-disable-next-line no-console
                  console.log('Trying alternative chain switch...');
                  await wallet.switchChain(expectedChainIdHex); // Hex format
                  // eslint-disable-next-line no-console
                  console.log(`Switched to ${networkName} (hex)`);
                } catch (altError: unknown) {
                  // eslint-disable-next-line no-console
                  console.warn(
                    'Alternative switch also failed:',
                    altError.message
                  );
                  // Continue anyway, user can switch manually
                }
              }
            } else {
              // eslint-disable-next-line no-console
              console.log(`Already on ${networkName}`);
            }

            // eslint-disable-next-line no-console
            console.log(`✅ Wallet is on ${networkName}`);

            signer = await ethersProvider.getSigner();
            // eslint-disable-next-line no-console
            console.log('✅ Signer obtained via Privy');

            // Verify the signer is working and on correct network
            try {
              const signerAddress = await signer.getAddress();
              // eslint-disable-next-line no-console
              console.log('✅ Signer address verified:', signerAddress);

              // Check if we're on the correct network
              const network = await ethersProvider.getNetwork();
              const expectedChainId = parseInt(
                process.env.NEXT_PUBLIC_CHAIN_ID || '56'
              );
              const networkName =
                expectedChainId === 56 ? 'BSC Mainnet' : 'BSC Testnet';

              // eslint-disable-next-line no-console
              console.log('🔍 Current network after switch:', {
                chainId: network.chainId,
                name: network.name,
              });

              if (Number(network.chainId) !== expectedChainId) {
                // eslint-disable-next-line no-console
                console.warn(
                  `⚠️ Still not on ${networkName} after switch. Chain ID:`,
                  network.chainId
                );
                throw new Error(
                  `Wallet is on wrong network. Expected ${networkName} (${expectedChainId}), got ${network.chainId}`
                );
              }

              // eslint-disable-next-line no-console
              console.log(`✅ Confirmed on ${networkName}`);
            } catch (signerError: unknown) {
              // eslint-disable-next-line no-console
              console.error(
                '❌ Signer verification failed:',
                signerError.message
              );
              throw new Error(
                `Signer verification failed: ${signerError.message}`
              );
            }
          } catch (privyError: unknown) {
            // eslint-disable-next-line no-console
            console.warn('Privy method failed:', privyError.message);
          }
        }

        // No fallback to window.ethereum - only use Privy-connected wallet
      }

      // Method 2: Try Privy embedded wallet
      if (
        !signer &&
        wallet.walletClientType === 'privy' &&
        typeof wallet.getEthereumProvider === 'function'
      ) {
        try {
          // eslint-disable-next-line no-console
          console.log('Trying Privy embedded wallet...');
          const provider = await wallet.getEthereumProvider();
          const ethersProvider = new ethers.BrowserProvider(provider);
          signer = await ethersProvider.getSigner();
          // eslint-disable-next-line no-console
          console.log('Signer obtained via Privy embedded wallet');
        } catch (privyError: unknown) {
          // eslint-disable-next-line no-console
          console.warn('Privy embedded wallet failed:', privyError.message);
        }
      }

      // Method 4: Try any available method on the wallet object
      if (!signer) {
        // eslint-disable-next-line no-console
        console.log('Trying any available signer method...');
        const methods = Object.keys(wallet).filter(
          key =>
            typeof (wallet as Record<string, unknown>)[key] === 'function' &&
            (key.includes('signer') ||
              key.includes('provider') ||
              key.includes('ethereum'))
        );

        // eslint-disable-next-line no-console
        console.log('Available methods to try:', methods);

        for (const method of methods) {
          try {
            // eslint-disable-next-line no-console
            console.log(`Trying wallet.${method}...`);
            const result = await (
              wallet as Record<string, () => Promise<unknown>>
            )[method]();
            // eslint-disable-next-line no-console
            console.log(`Result from wallet.${method}:`, result);

            if (result && typeof result.getSigner === 'function') {
              signer = await result.getSigner();
              // eslint-disable-next-line no-console
              console.log(`Signer obtained via wallet.${method}`);
              break;
            } else if (result && typeof result.getSigner === 'function') {
              // Some wallets might have getSigner as a property
              signer = result.getSigner;
              // eslint-disable-next-line no-console
              console.log(`Signer obtained via wallet.${method} (property)`);
              break;
            }
          } catch (methodError: unknown) {
            // eslint-disable-next-line no-console
            console.warn(`wallet.${method} failed:`, methodError.message);
          }
        }
      }

      // Method 5: Try to create a simple provider from the wallet address
      if (!signer && wallet.address) {
        try {
          // eslint-disable-next-line no-console
          console.log('🔍 Trying to create provider from wallet address...');
          // Use only Privy-connected wallet, no window.ethereum fallback
          // eslint-disable-next-line no-console
          console.error('No wallet connected through Privy');
          throw new Error('Please connect your wallet through Privy');
        } catch (addressError: unknown) {
          // eslint-disable-next-line no-console
          console.warn(
            '⚠️ Address-based signer creation failed:',
            addressError.message
          );
        }
      }

      // Method 6: Create a basic signer if all else fails
      if (!signer && wallet.address) {
        try {
          // eslint-disable-next-line no-console
          console.log('🔍 Creating basic signer as last resort...');
          // Skip window.ethereum - use only Privy-connected wallet
        } catch (basicError: unknown) {
          // eslint-disable-next-line no-console
          console.warn('⚠️ Basic signer creation failed:', basicError.message);
        }
      }

      if (!signer) {
        throw new Error(
          `Unable to get signer from wallet type: ${wallet.walletClientType}. Available methods: ${Object.keys(
            wallet
          )
            .filter(
              key =>
                typeof (wallet as Record<string, unknown>)[key] === 'function'
            )
            .join(', ')}`
        );
      }

      // Verify signer
      try {
        const signerAddress = await signer.getAddress();
        // eslint-disable-next-line no-console
        console.log('✅ Signer address:', signerAddress);
        // eslint-disable-next-line no-console
        console.log('✅ Wallet address:', wallet.address);
        // eslint-disable-next-line no-console
        console.log(
          '✅ Addresses match:',
          signerAddress.toLowerCase() === wallet.address.toLowerCase()
        );
      } catch (addressError: unknown) {
        // eslint-disable-next-line no-console
        console.warn('⚠️ Could not get signer address:', addressError.message);
        // eslint-disable-next-line no-console
        console.log('Signer object:', signer);
        // eslint-disable-next-line no-console
        console.log('Signer methods:', Object.getOwnPropertyNames(signer));
        // eslint-disable-next-line no-console
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
    } catch (err: unknown) {
      // eslint-disable-next-line no-console
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
    // eslint-disable-next-line no-console
    console.log('🔍 Getting contract instance...', {
      authenticated,
      walletCount: wallets?.length || 0,
      abiLength: contractABI.length,
    });

    try {
      // Check if user is authenticated
      if (!authenticated) {
        const errorMsg = 'Please connect your wallet first';
        // eslint-disable-next-line no-console
        console.error(errorMsg);
        setError(errorMsg);
        return null;
      }

      // Check if wallet is available
      if (!wallets || wallets.length === 0) {
        const errorMsg = 'No wallet found. Please connect your wallet.';
        // eslint-disable-next-line no-console
        console.error(errorMsg);
        setError(errorMsg);
        return null;
      }

      // eslint-disable-next-line no-console
      console.log('🔍 Getting signer...');
      const signer = await getSigner();
      if (!signer) {
        const errorMsg =
          'Failed to get wallet signer. Please check your wallet connection.';
        // eslint-disable-next-line no-console
        console.error(errorMsg);
        setError(errorMsg);
        return null;
      }
      // eslint-disable-next-line no-console
      console.log('✅ Signer obtained for contract creation');

      // Test signer before using it
      try {
        const testAddress = await signer.getAddress();
        // eslint-disable-next-line no-console
        console.log('✅ Signer test passed, address:', testAddress);
      } catch (signerTestError: unknown) {
        // eslint-disable-next-line no-console
        console.error('❌ Signer test failed:', signerTestError);
        throw new Error(`Signer is invalid: ${signerTestError.message}`);
      }

      if (contractABI.length === 0) {
        const errorMsg =
          'Contract ABI not loaded. Please refresh the page and try again.';
        // eslint-disable-next-line no-console
        console.error(errorMsg);
        setError(errorMsg);
        return null;
      }
      // eslint-disable-next-line no-console
      console.log('ABI loaded');

      // Check network
      // eslint-disable-next-line no-console
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

      // eslint-disable-next-line no-console
      console.log('Wallet chainId:', {
        original: wallet.chainId,
        converted: currentChainId,
      });

      // Check if we're on the correct network
      const expectedChainId =
        process.env.NEXT_PUBLIC_CHAIN_ID === '56' ? 56 : 97;
      const _expectedChainIdHex =
        process.env.NEXT_PUBLIC_CHAIN_ID === '56' ? '0x38' : '0x61';
      const networkName =
        process.env.NEXT_PUBLIC_CHAIN_ID === '56'
          ? 'BSC Mainnet'
          : 'BSC Testnet';
      const _rpcUrl =
        process.env.NEXT_PUBLIC_CHAIN_ID === '56'
          ? 'https://bsc-dataseed1.binance.org/'
          : 'https://data-seed-prebsc-1-s1.binance.org:8545/';
      const _blockExplorerUrl =
        process.env.NEXT_PUBLIC_CHAIN_ID === '56'
          ? 'https://bscscan.com/'
          : 'https://testnet.bscscan.com/';

      if (currentChainId !== expectedChainId) {
        // eslint-disable-next-line no-console
        console.log(`Attempting to switch to ${networkName}...`);
        try {
          // Use Privy's wallet provider for network switching
          const activeWallet = wallets?.[0];
          if (activeWallet && typeof activeWallet.switchChain === 'function') {
            await activeWallet.switchChain(expectedChainId);
            // eslint-disable-next-line no-console
            console.log(`Successfully switched to ${networkName}`);
            // Wait a moment for the network switch to complete
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Retry getting the contract after network switch
            return await getContract();
          } else {
            throw new Error('Wallet does not support network switching');
          }
        } catch (switchError: unknown) {
          // eslint-disable-next-line no-console
          console.warn(
            'Failed to switch network automatically:',
            switchError.message
          );

          const errorMsg = `Please switch to ${networkName} (Chain ID: ${expectedChainId}). Current: ${currentChainId || 'Unknown'}`;
          // eslint-disable-next-line no-console
          console.error(errorMsg);
          setError(errorMsg);
          return null;
        }
      }

      // eslint-disable-next-line no-console
      console.log(`✅ Wallet is on ${networkName}`);

      // Also try the provider-based check as backup
      try {
        const networkCheck = await checkNetwork();
        if (!networkCheck.isCorrect) {
          // eslint-disable-next-line no-console
          console.warn(
            'Provider-based network check failed, but wallet chainId is correct'
          );
        }
      } catch (networkError: unknown) {
        // eslint-disable-next-line no-console
        console.warn('Network check failed:', networkError.message);
        // Continue anyway since wallet chainId check passed
      }

      // eslint-disable-next-line no-console
      console.log('✅ Network check passed');

      const addresses = getContractAddresses();
      // eslint-disable-next-line no-console
      console.log('Contract addresses:', addresses);

      if (!addresses.predictionMarket) {
        const errorMsg =
          'Contract address not found. Please check your configuration.';
        // eslint-disable-next-line no-console
        console.error(errorMsg);
        setError(errorMsg);
        return null;
      }

      // eslint-disable-next-line no-console
      console.log('🔍 Creating contract instance...');

      // Verify signer before creating contract
      if (!signer || typeof signer.getAddress !== 'function') {
        throw new Error('Invalid signer: missing getAddress method');
      }

      // Test signer before using it
      try {
        const testAddress = await signer.getAddress();
        // eslint-disable-next-line no-console
        console.log('✅ Signer test passed, address:', testAddress);
      } catch (signerTestError: unknown) {
        // eslint-disable-next-line no-console
        console.error('Signer test failed:', signerTestError);
        throw new Error(`Signer is invalid: ${signerTestError.message}`);
      }

      const contract = new ethers.Contract(
        addresses.predictionMarket,
        contractABI,
        signer
      );
      // eslint-disable-next-line no-console
      console.log('✅ Contract instance created successfully');
      return contract;
    } catch (err: unknown) {
      // eslint-disable-next-line no-console
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
      _initialLiquidity: string
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

        // Validate parameters before sending
        if (!title || title.length === 0 || title.length > 200) {
          throw new Error('Invalid title: must be 1-200 characters');
        }
        if (category < 0 || category > 7) {
          throw new Error('Invalid category: must be 0-7');
        }
        if (expiresAt <= Math.floor(Date.now() / 1000) + 300) {
          throw new Error(
            'Invalid expiration: must be at least 5 minutes from now'
          );
        }

        // Estimate gas
        const gasLimit = await estimateGas(contract, 'createMarket', [
          title,
          fullDescription,
          expiresAt,
          category,
        ]);

        // eslint-disable-next-line no-console
        console.log('Creating market with parameters:', {
          title,
          description: fullDescription.substring(0, 100) + '...',
          expiresAt: new Date(expiresAt * 1000).toISOString(),
          category,
          gasLimit: gasLimit.toString(),
          chainId: process.env.NEXT_PUBLIC_CHAIN_ID,
        });

        // Send transaction
        // eslint-disable-next-line no-console
        console.log('Submitting transaction...');

        // Use fixed gas price for BSC Mainnet to avoid RPC issues
        let gasPrice;
        if (process.env.NEXT_PUBLIC_CHAIN_ID === '56') {
          // Use 3 gwei for BSC Mainnet (reliable and fast)
          gasPrice = ethers.parseUnits('3', 'gwei');
        } else {
          // For testnet, use dynamic pricing
          const feeData = await contract.runner?.provider?.getFeeData();
          gasPrice = feeData?.gasPrice
            ? (feeData.gasPrice * 110n) / 100n
            : undefined;
        }

        // eslint-disable-next-line no-console
        console.log('Gas price configuration:', {
          finalGasPrice: gasPrice?.toString(),
          gasPriceGwei:
            process.env.NEXT_PUBLIC_CHAIN_ID === '56' ? '3' : 'dynamic',
          chainId: process.env.NEXT_PUBLIC_CHAIN_ID,
        });

        let tx;
        try {
          tx = await contract.createMarket(
            title,
            fullDescription,
            expiresAt,
            category,
            {
              gasLimit,
              gasPrice: gasPrice ? gasPrice.toString() : undefined,
            }
          );
        } catch (txError: unknown) {
          // eslint-disable-next-line no-console
          console.error('Transaction failed:', txError);

          // If it's an RPC error, try with a different approach
          if (
            txError.message.includes(
              'Transaction does not have a transaction hash'
            ) ||
            txError.message.includes('-32603')
          ) {
            // eslint-disable-next-line no-console
            console.log(
              'RPC error detected, trying with different gas settings...'
            );

            // Try with higher gas limit and no gas price (let network decide)
            try {
              tx = await contract.createMarket(
                title,
                fullDescription,
                expiresAt,
                category,
                {
                  gasLimit: gasLimit * 2n, // Double the gas limit
                  // Don't specify gasPrice, let the network decide
                }
              );
            } catch (fallbackError: unknown) {
              // eslint-disable-next-line no-console
              console.error('Fallback transaction also failed:', fallbackError);

              // Last resort: try with minimal settings
              tx = await contract.createMarket(
                title,
                fullDescription,
                expiresAt,
                category
                // No gas settings at all - let ethers handle everything
              );
            }
          } else {
            throw txError;
          }
        }

        if (!tx || !tx.hash) {
          throw new Error('Transaction failed to generate hash');
        }

        // eslint-disable-next-line no-console
        console.log('Transaction submitted:', {
          hash: tx.hash,
          gasLimit: gasLimit.toString(),
        });

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
      } catch (err: unknown) {
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

        // Estimate gas (commitBet only takes marketId and commitHash, value is sent via msg.value)
        let gasLimit;
        try {
          gasLimit = await estimateGas(contract, 'commitBet', [
            marketId,
            commitHash,
          ]);
        } catch (gasError: unknown) {
          // Gas estimation failed - this means the transaction will fail
          // Don't retry, just throw the error with user-friendly message
          // eslint-disable-next-line no-console
          console.error('Gas estimation failed:', gasError);
          throw gasError; // Will be caught by outer try-catch and made user-friendly
        }

        // Use fixed gas price for BSC Mainnet to avoid RPC issues
        let gasPrice;
        if (process.env.NEXT_PUBLIC_CHAIN_ID === '56') {
          // Use 3 gwei for BSC Mainnet (reliable and fast)
          gasPrice = ethers.parseUnits('3', 'gwei');
        } else {
          // For testnet, use dynamic pricing
          const feeData = await contract.runner?.provider?.getFeeData();
          gasPrice = feeData?.gasPrice
            ? (feeData.gasPrice * 110n) / 100n
            : undefined;
        }

        // eslint-disable-next-line no-console
        console.log('Gas configuration for commitBet:', {
          gasLimit: gasLimit.toString(),
          gasPrice: gasPrice?.toString(),
          gasPriceGwei:
            process.env.NEXT_PUBLIC_CHAIN_ID === '56' ? '3' : 'dynamic',
        });

        // Send transaction with retry logic for RPC errors
        let tx;
        try {
          tx = await contract.commitBet(marketId, commitHash, {
            value: amountWei,
            gasLimit,
            gasPrice: gasPrice ? gasPrice.toString() : undefined,
          });
        } catch (txError: unknown) {
          // eslint-disable-next-line no-console
          console.error('Transaction failed:', txError);

          // Check if it's a business logic error (not an RPC issue)
          const errorMessage = txError.message || '';
          const isBusinessLogicError =
            errorMessage.includes('Already committed') ||
            errorMessage.includes('Bet too low') ||
            errorMessage.includes('Bet too high') ||
            errorMessage.includes('Market has expired') ||
            errorMessage.includes('execution reverted');

          // Don't retry business logic errors - they will fail again
          if (isBusinessLogicError) {
            // eslint-disable-next-line no-console
            console.log(
              'Business logic error detected, not retrying:',
              errorMessage
            );
            throw txError;
          }

          // If it's an RPC error, try with a different approach
          if (
            txError.message.includes(
              'Transaction does not have a transaction hash'
            ) ||
            txError.message.includes('-32603')
          ) {
            // eslint-disable-next-line no-console
            console.log(
              'RPC error detected, trying with different gas settings...'
            );

            // Try with higher gas limit and no gas price (let network decide)
            try {
              tx = await contract.commitBet(marketId, commitHash, {
                value: amountWei,
                gasLimit: gasLimit * 2n, // Double the gas limit
                // Don't specify gasPrice, let the network decide
              });
            } catch (fallbackError: unknown) {
              // eslint-disable-next-line no-console
              console.error('Fallback transaction also failed:', fallbackError);

              // Check if fallback also hit a business logic error
              const fallbackMessage = fallbackError.message || '';
              if (
                fallbackMessage.includes('Already committed') ||
                fallbackMessage.includes('Bet too low') ||
                fallbackMessage.includes('Bet too high')
              ) {
                // Don't try again - throw the fallback error
                throw fallbackError;
              }

              // Last resort: try with minimal settings
              tx = await contract.commitBet(marketId, commitHash, {
                value: amountWei,
                // No gas settings at all - let ethers handle everything
              });
            }
          } else {
            throw txError;
          }
        }

        if (!tx || !tx.hash) {
          throw new Error('Transaction failed to generate hash');
        }

        // eslint-disable-next-line no-console
        console.log('Transaction submitted:', {
          hash: tx.hash,
          gasLimit: gasLimit.toString(),
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
      } catch (err: unknown) {
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
      } catch (err: unknown) {
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
        // eslint-disable-next-line no-console
        console.log('Checking market and bet data before claiming...');
        // eslint-disable-next-line no-console
        console.log('Market ID:', marketId, 'Type:', typeof marketId);

        try {
          // eslint-disable-next-line no-console
          console.log('Calling getMarket with marketId:', marketId);

          // First check if market exists by trying to get basic info
          try {
            const _market = await contract.getMarket(marketId);
            // eslint-disable-next-line no-console
            console.log('Market exists on blockchain');
          } catch (marketError: unknown) {
            // eslint-disable-next-line no-console
            console.error('Market does not exist on blockchain:', marketError);
            throw new Error(
              `Market ${marketId} does not exist on blockchain. Error: ${marketError.message}`
            );
          }

          const market = await contract.getMarket(marketId);
          // eslint-disable-next-line no-console
          console.log('Raw market data:', market);

          // Handle both array and object formats
          let marketData;
          if (
            Array.isArray(market) ||
            (market && typeof market === 'object' && '0' in market)
          ) {
            // Market data is returned as array or indexed object
            // Let's log all indices to understand the structure
            // eslint-disable-next-line no-console
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
          // eslint-disable-next-line no-console
          console.log('Market data:', marketData);

          let userAddress;
          try {
            // Check if signer has getAddress method
            if (
              contract.signer &&
              typeof (contract.signer as { getAddress?: () => Promise<string> })
                .getAddress === 'function'
            ) {
              userAddress = await (
                contract.signer as { getAddress: () => Promise<string> }
              ).getAddress();
              // eslint-disable-next-line no-console
              console.log('User address from signer:', userAddress);
            } else {
              throw new Error('Signer does not have getAddress method');
            }
          } catch (addressError: unknown) {
            // eslint-disable-next-line no-console
            console.warn(
              'Failed to get address from signer:',
              addressError.message
            );
            // Fallback to wallet address
            if (wallets && wallets.length > 0) {
              userAddress = wallets[0].address;
              // eslint-disable-next-line no-console
              console.log('Using wallet address as fallback:', userAddress);
            } else {
              throw new Error('Cannot get user address');
            }
          }

          let bet;
          try {
            bet = await contract.getBet(marketId, userAddress);
            // eslint-disable-next-line no-console
            console.log('Raw bet data from getBet:', bet);
          } catch (getBetError: unknown) {
            // eslint-disable-next-line no-console
            console.warn(
              'getBet failed, trying alternative method:',
              getBetError.message
            );

            // Try alternative method - check if bet exists in the bets mapping
            try {
              bet = await contract.bets(marketId, userAddress);
              // eslint-disable-next-line no-console
              console.log('Raw bet data from bets mapping:', bet);
            } catch (betsError: unknown) {
              // eslint-disable-next-line no-console
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
          // eslint-disable-next-line no-console
          console.log('Bet data:', betData);

          // Check requirements with safe data
          if (!market || marketData.status === 'undefined') {
            throw new Error('Failed to fetch market data from contract');
          }

          // Check if market is resolved on blockchain
          if (marketData.status !== '2') {
            // eslint-disable-next-line no-console
            console.log(
              '⚠️ Market not resolved on blockchain, checking database...'
            );

            // Try to get market data from backend API as fallback
            try {
              const response = await fetch(`/api/markets/${marketId}`);

              if (response.ok) {
                const dbResponse = await response.json();
                // eslint-disable-next-line no-console
                console.log('Database market data:', dbResponse);

                // Handle different response structures
                let dbMarket;
                if (dbResponse.success && dbResponse.data) {
                  dbMarket = dbResponse.data;
                  // eslint-disable-next-line no-console
                  console.log('Using dbResponse.data structure');
                } else if (dbResponse.marketId) {
                  dbMarket = dbResponse;
                  // eslint-disable-next-line no-console
                  console.log('Using direct dbResponse structure');
                } else {
                  // eslint-disable-next-line no-console
                  console.error(
                    'Invalid database response format:',
                    dbResponse
                  );
                  throw new Error('Invalid database response format');
                }

                // eslint-disable-next-line no-console
                console.log('Parsed database market:', dbMarket);
                // eslint-disable-next-line no-console
                console.log(
                  'Database market status:',
                  dbMarket.status,
                  'Type:',
                  typeof dbMarket.status
                );

                // If market is resolved in database, proceed with claim
                if (dbMarket.status === 2) {
                  // eslint-disable-next-line no-console
                  console.log(
                    '✅ Market resolved in database, proceeding with claim...'
                  );
                } else {
                  // eslint-disable-next-line no-console
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
            } catch (dbError: unknown) {
              // eslint-disable-next-line no-console
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

          // eslint-disable-next-line no-console
          console.log('All requirements met, proceeding with claim...');
        } catch (debugError: unknown) {
          // eslint-disable-next-line no-console
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
      } catch (err: unknown) {
        const errorMsg = parseContractError(err);
        setError(errorMsg);
        setTxStatus('error');
        setLoading(false);
        return { success: false };
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          userAddress = await (
            contract.signer as { getAddress: () => Promise<string> }
          ).getAddress();
        } catch (addressError: unknown) {
          // eslint-disable-next-line no-console
          console.error(
            'Failed to get user address from signer:',
            addressError
          );

          // Fallback to wallet address
          if (wallets && wallets.length > 0) {
            userAddress = wallets[0].address;
            // eslint-disable-next-line no-console
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
            reason: 'Refund not available for this bet',
          };
        }
      } catch (err: unknown) {
        // eslint-disable-next-line no-console
        console.error('Error checking refund availability:', err);
        return { available: false, reason: 'Unable to check refund status' };
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
      } catch (err: unknown) {
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
      } catch (err: unknown) {
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
    async (marketId: number): Promise<unknown | null> => {
      try {
        const contract = await getContract();
        if (!contract) return null;

        const data = await contract.markets(marketId);
        return data;
      } catch (err) {
        // eslint-disable-next-line no-console
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
    async (marketId: number, userAddress: string): Promise<unknown | null> => {
      try {
        const contract = await getContract();
        if (!contract) return null;

        const betData = await contract.getUserBet(marketId, userAddress);
        return betData;
      } catch (err) {
        // eslint-disable-next-line no-console
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
