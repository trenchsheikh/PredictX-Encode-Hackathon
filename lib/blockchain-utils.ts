import { ethers } from 'ethers';

/**
 * Mapping functions between frontend and smart contract data formats
 */

export function mapCategoryToNumber(category: string): number {
  const mapping: { [key: string]: number } = {
    'sports': 0,
    'crypto': 1,
    'politics': 2,
    'entertainment': 3,
    'weather': 4,
    'finance': 5,
    'technology': 6,
    'custom': 7,
  };
  return mapping[category.toLowerCase()] || 7;
}

export function mapCategory(num: number): string {
  const mapping = ['sports', 'crypto', 'politics', 'entertainment', 'weather', 'finance', 'technology', 'custom'];
  return mapping[num] || 'custom';
}

export function mapStatusToNumber(status: string): number {
  const mapping: { [key: string]: number } = {
    'active': 0,
    'resolving': 1,
    'resolved': 2,
    'cancelled': 3,
  };
  return mapping[status.toLowerCase()] || 0;
}

export function mapStatus(num: number): string {
  const mapping = ['active', 'resolving', 'resolved', 'cancelled'];
  return mapping[num] || 'active';
}

/**
 * Calculate price from pool ratio (FPMM pricing)
 */
export function calculatePrice(pool: string, totalPool: string): number {
  const poolBN = BigInt(pool);
  const totalPoolBN = BigInt(totalPool);
  
  if (totalPoolBN === 0n) return 0.5;
  
  // Price = pool / total in BNB, then normalize to 0.01 scale
  const priceRatio = Number(poolBN) / Number(totalPoolBN);
  return priceRatio * 0.01; // Match frontend mock data scale
}

/**
 * Load contract ABI from deployments folder
 */
export async function loadContractABI(contractName: 'PredictionMarket' | 'Vault'): Promise<any[]> {
  try {
    const response = await fetch(`/deployments/bscTestnet/${contractName}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load ${contractName} ABI`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error loading ${contractName} ABI:`, error);
    throw error;
  }
}

/**
 * Get contract addresses from deployment files or environment
 */
export function getContractAddresses() {
  // Try environment variables first
  const predictionMarket = process.env.NEXT_PUBLIC_PREDICTION_CONTRACT_ADDRESS;
  const vault = process.env.NEXT_PUBLIC_VAULT_CONTRACT_ADDRESS;
  
  if (predictionMarket && vault) {
    return {
      predictionMarket,
      vault,
    };
  }
  
  // Fallback to hardcoded addresses from deployment
  console.warn('Environment variables not set, using hardcoded contract addresses');
  return {
    predictionMarket: '0x672e13Cc6196c784EF3bf0762A18d2645F0f12ca',
    vault: '0x9D4f9aFed1572a7947a1f6619111d3FfED66db17',
  };
}

/**
 * Format timestamp for datetime-local input
 */
export function formatDateTimeLocal(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toISOString().slice(0, 16);
}

/**
 * Parse datetime-local input to timestamp
 */
export function parseDateTimeLocal(dateTimeLocal: string): number {
  return new Date(dateTimeLocal).getTime();
}

/**
 * Validate BNB amount
 */
export function validateBNBAmount(amount: number): { valid: boolean; error?: string } {
  const MIN_BET = 0.001;
  const MAX_BET = 100;
  
  if (isNaN(amount) || amount <= 0) {
    return { valid: false, error: 'Amount must be greater than 0' };
  }
  
  if (amount < MIN_BET) {
    return { valid: false, error: `Minimum bet is ${MIN_BET} BNB` };
  }
  
  if (amount > MAX_BET) {
    return { valid: false, error: `Maximum bet is ${MAX_BET} BNB` };
  }
  
  return { valid: true };
}

/**
 * Format transaction hash for display
 */
export function formatTxHash(hash: string): string {
  if (!hash) return '';
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}

/**
 * Get BSCScan URL for transaction
 */
export function getBSCScanTxUrl(txHash: string): string {
  const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || '97';
  const baseUrl = chainId === '97' 
    ? 'https://testnet.bscscan.com' 
    : 'https://bscscan.com';
  return `${baseUrl}/tx/${txHash}`;
}

/**
 * Get BSCScan URL for address
 */
export function getBSCScanAddressUrl(address: string): string {
  const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || '97';
  const baseUrl = chainId === '97' 
    ? 'https://testnet.bscscan.com' 
    : 'https://bscscan.com';
  return `${baseUrl}/address/${address}`;
}

/**
 * Check if wallet is on correct network
 */
export async function checkNetwork(provider?: any): Promise<{ isCorrect: boolean; chainId?: number }> {
  try {
    let network;
    
    if (provider) {
      // Use provided provider
      network = await provider.getNetwork();
    } else if (typeof window !== 'undefined' && window.ethereum) {
      // Use window.ethereum as fallback
      const ethersProvider = new ethers.BrowserProvider(window.ethereum);
      network = await ethersProvider.getNetwork();
    } else {
      return { isCorrect: false, chainId: undefined };
    }
    
    const expectedChainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '97');
    const isCorrect = Number(network.chainId) === expectedChainId;
    
    console.log('Network check:', { 
      currentChainId: network.chainId, 
      expectedChainId, 
      isCorrect 
    });
    
    return { isCorrect, chainId: Number(network.chainId) };
  } catch (error) {
    console.error('Error checking network:', error);
    return { isCorrect: false, chainId: undefined };
  }
}

/**
 * Switch to BSC Testnet
 */
export async function switchToBSCTestnet(provider: any): Promise<boolean> {
  try {
    await provider.send('wallet_switchEthereumChain', [{ chainId: '0x61' }]); // 97 in hex
    return true;
  } catch (error: any) {
    // Chain not added to MetaMask
    if (error.code === 4902) {
      try {
        await provider.send('wallet_addEthereumChain', [{
          chainId: '0x61',
          chainName: 'BSC Testnet',
          nativeCurrency: {
            name: 'BNB',
            symbol: 'BNB',
            decimals: 18
          },
          rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
          blockExplorerUrls: ['https://testnet.bscscan.com/']
        }]);
        return true;
      } catch (addError) {
        console.error('Error adding BSC Testnet:', addError);
        return false;
      }
    }
    console.error('Error switching network:', error);
    return false;
  }
}

/**
 * Estimate gas for transaction
 */
export async function estimateGas(
  contract: ethers.Contract,
  method: string,
  args: any[]
): Promise<bigint> {
  try {
    const gasEstimate = await contract[method].estimateGas(...args);
    // Add 20% buffer
    return (gasEstimate * 120n) / 100n;
  } catch (error) {
    console.error('Gas estimation failed:', error);
    // Return default gas limit
    return 500000n;
  }
}

/**
 * Wait for transaction with timeout
 */
export async function waitForTransaction(
  tx: ethers.ContractTransactionResponse,
  timeoutMs: number = 120000 // 2 minutes
): Promise<ethers.ContractTransactionReceipt | null> {
  return Promise.race([
    tx.wait(),
    new Promise<null>((resolve) => setTimeout(() => resolve(null), timeoutMs))
  ]);
}

/**
 * Parse contract error message
 */
export function parseContractError(error: any): string {
  if (error.reason) return error.reason;
  if (error.data?.message) return error.data.message;
  if (error.message) {
    // Extract revert reason from error message
    const match = error.message.match(/reason="([^"]+)"/);
    if (match) return match[1];
    
    // Extract user rejection
    if (error.message.includes('user rejected')) {
      return 'Transaction rejected by user';
    }
    
    return error.message;
  }
  return 'Unknown error occurred';
}

/**
 * Calculate potential payout for a bet
 */
export function calculatePotentialPayout(
  betAmount: string,
  userShares: string,
  totalWinningShares: string,
  totalPool: string
): string {
  try {
    const betAmountBN = BigInt(betAmount);
    const userSharesBN = BigInt(userShares);
    const totalWinningSharesBN = BigInt(totalWinningShares);
    const totalPoolBN = BigInt(totalPool);
    
    if (totalWinningSharesBN === 0n) return '0';
    
    // Payout = (userShares / totalWinningShares) * totalPool * 0.9 (10% fee)
    const grossPayout = (userSharesBN * totalPoolBN) / totalWinningSharesBN;
    const netPayout = (grossPayout * 90n) / 100n; // 10% platform fee
    
    return ethers.formatEther(netPayout);
  } catch (error) {
    console.error('Error calculating payout:', error);
    return '0';
  }
}

