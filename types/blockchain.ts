/**
 * Blockchain-specific types
 * Types for data returned from smart contracts
 */

/**
 * User bet data from blockchain
 */
export interface BlockchainUserBet {
  amount: bigint | string;
  shares: bigint | string;
  outcome: boolean;
  claimed: boolean;
  exists?: boolean;
}

/**
 * Market data from blockchain
 */
export interface BlockchainMarket {
  marketId: number;
  creator: string;
  totalPool: bigint | string;
  yesPool: bigint | string;
  noPool: bigint | string;
  yesShares: bigint | string;
  noShares: bigint | string;
  outcome: boolean;
  resolved: boolean;
  cancelled: boolean;
  expiresAt: bigint | number;
  category: number;
}

/**
 * Contract addresses configuration
 */
export interface ContractAddresses {
  PredictionMarket: string;
  Vault: string;
}

/**
 * Blockchain event
 */
export interface BlockchainEvent {
  eventName: string;
  blockNumber: number;
  transactionHash: string;
  args: unknown;
}
