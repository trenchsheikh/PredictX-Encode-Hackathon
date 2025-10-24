/**
 * Bet and Commitment Types
 * Based on backend/src/types/index.ts
 */

import type { Market } from './market';

/**
 * Bet interface matching backend IBet
 */
export interface Bet {
  marketId: number;
  user: string;
  outcome: boolean;
  shares: string;
  amount: string;
  revealedAt: Date;
  claimed: boolean;
  txHash: string;
}

/**
 * Commitment interface matching backend ICommitment
 */
export interface Commitment {
  marketId: number;
  user: string;
  commitHash: string;
  amount: string;
  timestamp: Date;
  revealed: boolean;
  txHash: string;
}

/**
 * API user bet response with type discriminator
 * This represents the raw bet data from the backend API
 */
export type ApiUserBet =
  | {
      type: 'commitment';
      marketId: number;
      market?: Market;
      amount: string;
      timestamp: Date;
      revealed: boolean;
      txHash: string;
    }
  | {
      type: 'bet';
      marketId: number;
      market?: Market;
      outcome: boolean;
      shares: string;
      amount: string;
      revealedAt: Date;
      claimed: boolean;
      txHash: string;
    };

/**
 * Bet commit data for API
 */
export interface CommitBetData {
  user: string;
  commitHash: string;
  amount: string;
  txHash: string;
}

/**
 * Bet reveal data for API
 */
export interface RevealBetData {
  user: string;
  outcome: boolean;
  shares: string;
  amount: string;
  txHash: string;
}
