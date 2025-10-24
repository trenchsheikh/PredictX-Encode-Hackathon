/**
 * User Types
 * User-related interfaces and types
 */

import type { ApiUserBet } from './bet';
import type { MarketWithStats } from './market';

/**
 * User statistics
 */
export interface UserStats {
  address: string;
  totalBets: number;
  totalInvested: string;
  totalShares: string;
  claimedBets: number;
  activeBets: number;
}

/**
 * User bets response
 */
export interface UserBetsResponse {
  address: string;
  totalBets: number;
  commitments: number;
  revealedBets: number;
  bets: ApiUserBet[];
}

/**
 * User markets created response
 */
export interface UserMarketsCreatedResponse {
  address: string;
  totalMarketsCreated: number;
  markets: MarketWithStats[];
}

/**
 * Leaderboard entry
 */
export interface LeaderboardEntry {
  rank: number;
  address: string;
  username?: string;
  totalWinnings: number;
  totalBets: number;
  winRate: number;
  totalVolume: number;
  badges: string[];
  isVerified: boolean;
  streak: number;
  lastActive: number;
}

/**
 * Leaderboard response
 */
export interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
  timeframe: string;
  totalUsers: number;
}

/**
 * Leaderboard filters
 */
export interface LeaderboardFilters {
  timeframe?: 'all' | '7d' | '30d' | '90d';
  limit?: number;
}
