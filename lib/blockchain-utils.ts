import { PublicKey, Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';

/**
 * Solana blockchain utilities for Darkbet
 */

/**
 * Mapping functions between frontend and smart contract data formats
 */

export function mapCategoryToNumber(category: string): number {
  const mapping: { [key: string]: number } = {
    sports: 0,
    crypto: 1,
    politics: 2,
    entertainment: 3,
    weather: 4,
    finance: 5,
    technology: 6,
    custom: 7,
  };
  return mapping[category.toLowerCase()] || 7;
}

export function mapCategory(num: number): string {
  const mapping = [
    'sports',
    'crypto',
    'politics',
    'entertainment',
    'weather',
    'finance',
    'technology',
    'custom',
  ];
  return mapping[num] || 'crypto';
}

export function mapStatusToNumber(status: string): number {
  const mapping: { [key: string]: number } = {
    open: 0,
    locked: 1,
    resolved: 2,
    cancelled: 3,
  };
  return mapping[status.toLowerCase()] || 0;
}

export function mapStatus(num: number): string {
  const mapping = ['open', 'locked', 'resolved', 'cancelled'];
  return mapping[num] || 'open';
}

/**
 * Calculate price from pool ratio
 */
export function calculatePrice(longPool: string, shortPool: string): number {
  const longBN = BigInt(longPool);
  const shortBN = BigInt(shortPool);
  const total = longBN + shortBN;

  if (total === 0n) return 0.5;

  // Price = longPool / (longPool + shortPool)
  const priceRatio = Number(longBN) / Number(total);
  return priceRatio;
}

/**
 * Get Solana program addresses from environment
 */
export function getProgramAddresses() {
  const predictionMarket = process.env.NEXT_PUBLIC_PROGRAM_ID;

  if (predictionMarket) {
    console.log('Using environment variable for program ID');
    if (isValidSolanaAddress(predictionMarket)) {
      return {
        predictionMarket,
      };
    } else {
      console.warn('Invalid program ID in environment variables');
    }
  }

  // Fallback to placeholder (will be updated after deployment)
  console.warn('Environment variables not set, using placeholder');
  return {
    predictionMarket: '11111111111111111111111111111111',
  };
}

/**
 * Validate if a string is a valid Solana public key
 */
export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get Solana RPC endpoint from environment
 */
export function getSolanaRpcEndpoint(): string {
  return (
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
    'https://api.devnet.solana.com'
  );
}

/**
 * Get Solana cluster/network
 */
export function getSolanaCluster(): 'devnet' | 'mainnet-beta' | 'testnet' {
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';
  return network as 'devnet' | 'mainnet-beta' | 'testnet';
}

/**
 * Format timestamp for datetime-local input (local time)
 */
export function formatDateTimeLocal(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Parse datetime-local input to Unix timestamp (seconds)
 */
export function parseDateTimeLocal(dateTimeLocal: string): number {
  return Math.floor(new Date(dateTimeLocal).getTime() / 1000);
}

/**
 * Validate SOL amount
 */
export function validateSOLAmount(amount: number): {
  valid: boolean;
  error?: string;
} {
  const MIN_BET = 0.01; // 0.01 SOL
  const MAX_BET = 100; // 100 SOL

  if (isNaN(amount) || amount <= 0) {
    return { valid: false, error: 'Amount must be greater than 0' };
  }

  if (amount < MIN_BET) {
    return { valid: false, error: `Minimum bet is ${MIN_BET} SOL` };
  }

  if (amount > MAX_BET) {
    return { valid: false, error: `Maximum bet is ${MAX_BET} SOL` };
  }

  return { valid: true };
}

/**
 * Convert SOL to lamports
 */
export function solToLamports(sol: number): BN {
  return new BN(sol * LAMPORTS_PER_SOL);
}

/**
 * Convert lamports to SOL
 */
export function lamportsToSol(lamports: BN | number | bigint): number {
  const lamportsNum = typeof lamports === 'number' ? lamports : Number(lamports);
  return lamportsNum / LAMPORTS_PER_SOL;
}

/**
 * Format SOL amount for display
 */
export function formatSOL(lamports: BN | number | bigint, decimals: number = 4): string {
  const sol = lamportsToSol(lamports);
  return sol.toFixed(decimals);
}

/**
 * Format transaction signature for display
 */
export function formatSignature(signature: string): string {
  if (!signature) return '';
  return `${signature.slice(0, 10)}...${signature.slice(-8)}`;
}

/**
 * Get Solana Explorer URL for transaction
 */
export function getSolanaExplorerTxUrl(signature: string): string {
  const cluster = getSolanaCluster();
  const baseUrl = 'https://explorer.solana.com';
  const clusterParam = cluster === 'mainnet-beta' ? '' : `?cluster=${cluster}`;
  return `${baseUrl}/tx/${signature}${clusterParam}`;
}

/**
 * Get Solana Explorer URL for address/account
 */
export function getSolanaExplorerAddressUrl(address: string): string {
  const cluster = getSolanaCluster();
  const baseUrl = 'https://explorer.solana.com';
  const clusterParam = cluster === 'mainnet-beta' ? '' : `?cluster=${cluster}`;
  return `${baseUrl}/address/${address}${clusterParam}`;
}

/**
 * Get Solana Explorer URL for program/contract
 */
export function getSolanaExplorerProgramUrl(programId: string): string {
  return getSolanaExplorerAddressUrl(programId);
}

/**
 * Check if wallet is connected to correct network
 */
export async function checkSolanaNetwork(
  connection: Connection
): Promise<{ isCorrect: boolean; cluster?: string }> {
  try {
    const expectedCluster = getSolanaCluster();
    const endpoint = connection.rpcEndpoint;
    
    // Simple check based on RPC endpoint
    let currentCluster: string;
    if (endpoint.includes('devnet')) {
      currentCluster = 'devnet';
    } else if (endpoint.includes('testnet')) {
      currentCluster = 'testnet';
    } else if (endpoint.includes('mainnet')) {
      currentCluster = 'mainnet-beta';
    } else {
      currentCluster = 'unknown';
    }

    const isCorrect = currentCluster === expectedCluster;

    console.log('Network check:', {
      currentCluster,
      expectedCluster,
      isCorrect,
      endpoint,
    });

    return { isCorrect, cluster: currentCluster };
  } catch (error) {
    console.error('Error checking network:', error);
    return { isCorrect: false, cluster: undefined };
  }
}

/**
 * Get account balance in SOL
 */
export async function getAccountBalance(
  connection: Connection,
  publicKey: PublicKey
): Promise<number> {
  try {
    const balance = await connection.getBalance(publicKey);
    return lamportsToSol(balance);
  } catch (error) {
    console.error('Error getting account balance:', error);
    return 0;
  }
}

/**
 * Parse Solana error message
 */
export function parseSolanaError(error: unknown): string {
  if (!error) return 'Unknown error occurred';
  
  if (typeof error === 'string') return error;
  
  if (typeof error === 'object' && error !== null) {
    // Check for common Solana error patterns
    const err = error as any;
    
    if (err.message) {
      // Check for specific error codes
      if (err.message.includes('0x1')) {
        return 'Insufficient funds for transaction';
      }
      if (err.message.includes('0x0')) {
        return 'Custom program error';
      }
      if (err.message.includes('User rejected')) {
        return 'Transaction cancelled by user';
      }
      return err.message;
    }
    
    if (err.error && typeof err.error === 'string') {
      return err.error;
    }
    
    if (err.name === 'WalletSignTransactionError') {
      return 'Failed to sign transaction. Please try again.';
    }
    
    if (err.name === 'WalletNotConnectedError') {
      return 'Wallet not connected. Please connect your wallet.';
    }
  }
  
  return 'Transaction failed. Please try again.';
}

/**
 * Calculate potential payout for a bet
 */
export function calculatePotentialPayout(
  betAmount: BN,
  userShares: BN,
  totalWinningShares: BN,
  totalLosingShares: BN,
  platformFeeBps: number = 200 // 2% fee in basis points
): string {
  try {
    if (totalWinningShares.isZero()) return '0';

    // Payout = (userShares / totalWinningShares) * totalLosingShares * (1 - fee)
    const grossPayout = userShares.mul(totalLosingShares).div(totalWinningShares);
    
    // Apply platform fee
    const feeMultiplier = 10000 - platformFeeBps; // e.g., 10000 - 200 = 9800 (98%)
    const netPayout = grossPayout.mul(new BN(feeMultiplier)).div(new BN(10000));

    return formatSOL(netPayout, 4);
  } catch (error) {
    console.error('Error calculating payout:', error);
    return '0';
  }
}

/**
 * Calculate profit/loss percentage
 */
export function calculateProfitLossPercent(
  betAmount: BN,
  payout: BN
): number {
  if (betAmount.isZero()) return 0;
  
  const profit = payout.sub(betAmount);
  const percentBN = profit.mul(new BN(10000)).div(betAmount); // 100.00% precision
  return Number(percentBN) / 100;
}

/**
 * Generate PDA (Program Derived Address) seeds
 */
export function getMarketPDA(
  programId: PublicKey,
  marketId: BN
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('market'), marketId.toArrayLike(Buffer, 'le', 8)],
    programId
  );
}

export function getUserPositionPDA(
  programId: PublicKey,
  userPubkey: PublicKey,
  marketPubkey: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('position'),
      userPubkey.toBuffer(),
      marketPubkey.toBuffer(),
    ],
    programId
  );
}

export function getVaultPDA(programId: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('vault')],
    programId
  );
}

export function getUserProfilePDA(
  programId: PublicKey,
  userPubkey: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('profile'), userPubkey.toBuffer()],
    programId
  );
}

/**
 * Hash commitment for commit-reveal scheme
 */
export async function hashCommitment(
  direction: 'LONG' | 'SHORT',
  nonce: string,
  timestamp: number
): Promise<Uint8Array> {
  // Use crypto.subtle for hashing in browser
  const directionByte = direction === 'LONG' ? 1 : 2;
  const data = new Uint8Array([
    directionByte,
    ...new TextEncoder().encode(nonce),
    ...new Uint8Array(new BigInt64Array([BigInt(timestamp)]).buffer),
  ]);
  
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return new Uint8Array(hashBuffer);
}

/**
 * Generate random nonce for commit-reveal
 */
export function generateNonce(): string {
  return crypto.randomUUID();
}
