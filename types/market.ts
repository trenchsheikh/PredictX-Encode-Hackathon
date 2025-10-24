/**
 * Market Types
 * Based on backend/src/types/index.ts
 */

/**
 * Market status enum matching backend MarketStatus
 */
export enum MarketStatus {
  Active = 0,
  Resolving = 1,
  Resolved = 2,
  Cancelled = 3,
}

/**
 * News article structure for event predictions
 */
export interface NewsArticle {
  title: string;
  url: string;
  source: string;
  publishedAt: Date;
}

/**
 * Event data for event-based predictions
 */
export interface EventData {
  keywords: string[];
  newsSearchQuery: string;
  verificationThreshold?: number;
  monitoringStartDate: Date;
  lastChecked?: Date;
  newsArticles?: NewsArticle[];
}

/**
 * Market interface matching backend IMarket
 */
export interface Market {
  marketId: number;
  title: string;
  description: string;
  summary?: string;
  creator: string;
  createdAt: Date;
  expiresAt: Date;
  category: number;
  totalPool: string;
  yesPool: string;
  noPool: string;
  yesShares: string;
  noShares: string;
  participants: number;
  status: MarketStatus;
  outcome?: boolean;
  resolvedAt?: Date;
  resolutionReasoning?: string;
  txHash: string;
  predictionType?: 'crypto' | 'event';
  eventData?: EventData;
}

/**
 * Market creation data
 */
export interface CreateMarketData {
  title: string;
  description: string;
  category: string;
  expiresAt: number;
  initialLiquidity: string;
  userAddress: string;
  txHash?: string;
}

/**
 * Market with additional statistics
 */
export interface MarketWithStats extends Market {
  totalBets: number;
  userBet?: {
    outcome: boolean;
    shares: string;
    amount: string;
    claimed: boolean;
  } | null;
}
