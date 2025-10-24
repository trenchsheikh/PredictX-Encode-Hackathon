/**
 * API Client for backend communication
 * Base URL: /api (proxied to backend server)
 */

import type {
  APIResponse,
  Market,
  CreateMarketData,
  CommitBetData,
  RevealBetData,
  UserBetsResponse,
  UserMarketsCreatedResponse,
  UserStats,
  LeaderboardResponse,
  LeaderboardFilters,
} from '@/types';

import { logger } from './logger';

// Always use local API routes in production to ensure proper proxying
const API_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? '/api'
    : process.env.NEXT_PUBLIC_API_URL ||
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      '/api';

// Debug logging (development only)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  logger.api('API Client initialized', {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    API_BASE_URL: API_BASE_URL,
  });
}

// Re-export APIResponse for backward compatibility
export type { APIResponse };

/**
 * Base fetch wrapper with error handling
 */
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<APIResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    return {
      success: true,
      data: data.data || data,
      message: data.message,
    };
  } catch (error: unknown) {
    logger.error(`API Error [${endpoint}]:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error occurred',
    };
  }
}

/**
 * Market API Methods
 */
export const marketAPI = {
  /**
   * Get all markets with optional filters
   */
  async getMarkets(filters?: {
    status?: string;
    category?: string;
    limit?: number;
    offset?: number;
  }) {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const query = params.toString() ? `?${params.toString()}` : '';
    return apiFetch<Market[]>(`/markets${query}`, { method: 'GET' });
  },

  /**
   * Get a single market by ID
   */
  async getMarket(marketId: string) {
    return apiFetch<Market>(`/markets/${marketId}`, { method: 'GET' });
  },

  /**
   * Create a new market (admin only)
   */
  async createMarket(marketData: CreateMarketData) {
    return apiFetch<Market>('/markets', {
      method: 'POST',
      body: JSON.stringify(marketData),
    });
  },

  /**
   * Submit a bet commit
   */
  async commitBet(marketId: string, commitData: CommitBetData) {
    return apiFetch<{ success: boolean }>(`/markets/${marketId}/commit`, {
      method: 'POST',
      body: JSON.stringify(commitData),
    });
  },

  /**
   * Reveal a bet
   */
  async revealBet(marketId: string, revealData: RevealBetData) {
    return apiFetch<{ success: boolean }>(`/markets/${marketId}/reveal`, {
      method: 'POST',
      body: JSON.stringify(revealData),
    });
  },

  /**
   * Resolve a market (oracle/admin only)
   */
  async resolveMarket(
    marketId: string,
    resolutionData: {
      outcome: 'yes' | 'no';
      reasoning: string;
      oracleAddress: string;
      txHash: string;
    }
  ) {
    return apiFetch<Market>(`/markets/${marketId}/resolve`, {
      method: 'POST',
      body: JSON.stringify(resolutionData),
    });
  },
};

/**
 * User API Methods
 */
export const userAPI = {
  /**
   * Get user's bets
   */
  async getUserBets(userAddress: string) {
    return apiFetch<UserBetsResponse>(`/users/${userAddress}/bets`, {
      method: 'GET',
    });
  },

  /**
   * Get user's profile/stats
   */
  async getUserProfile(userAddress: string) {
    return apiFetch<UserStats>(`/users/${userAddress}/stats`, {
      method: 'GET',
    });
  },

  /**
   * Get markets created by a user
   */
  async getUserBetsCreated(userAddress: string) {
    return apiFetch<UserMarketsCreatedResponse>(
      `/users/${userAddress}/markets-created`,
      { method: 'GET' }
    );
  },
};

/**
 * Leaderboard API Methods
 */
export const leaderboardAPI = {
  /**
   * Get leaderboard
   */
  async getLeaderboard(filters?: LeaderboardFilters) {
    const params = new URLSearchParams();
    if (filters?.timeframe) params.append('timeframe', filters.timeframe);
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const query = params.toString() ? `?${params.toString()}` : '';
    return apiFetch<LeaderboardResponse>(`/users/leaderboard${query}`, {
      method: 'GET',
    });
  },
};

/**
 * Health check
 */
export const healthAPI = {
  async check() {
    return apiFetch<{ status: string; timestamp: number }>('/health', {
      method: 'GET',
    });
  },
};

/**
 * Helper: Check if backend is reachable
 */
export async function checkBackendHealth(): Promise<boolean> {
  const result = await healthAPI.check();
  return result.success === true;
}

/**
 * Helper: Handle API errors with user-friendly messages
 */
export function getErrorMessage(error: unknown): string {
  // Import the user-friendly error handler
  const { getUserFriendlyErrorMessage } = require('./user-friendly-errors');
  return getUserFriendlyErrorMessage(error);
}

/**
 * Export all API methods
 */
/**
 * Event Predictions API Methods
 */
export const eventPredictionsAPI = {
  /**
   * Create a new event-based prediction
   */
  async createEventPrediction(data: {
    title: string;
    description: string;
    category: string;
    expiresAt: Date;
    keywords: string[];
    newsSearchQuery?: string;
    verificationThreshold?: number;
    creator: string;
    txHash: string;
    marketId: number;
  }) {
    return apiFetch<Market>('/event-predictions', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        expiresAt: data.expiresAt.toISOString(),
      }),
    });
  },

  /**
   * Get all event predictions
   */
  async getEventPredictions(filters?: {
    status?: string;
    limit?: number;
    offset?: number;
  }) {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const query = params.toString() ? `?${params.toString()}` : '';
    return apiFetch<Market[]>(`/event-predictions${query}`, { method: 'GET' });
  },

  /**
   * Manually trigger news check for an event prediction
   */
  async checkEventManually(marketId: number) {
    return apiFetch<{ success: boolean; message?: string }>(
      `/event-predictions/${marketId}/check`,
      {
        method: 'POST',
      }
    );
  },
};

export const api = {
  markets: marketAPI,
  users: userAPI,
  leaderboard: leaderboardAPI,
  health: healthAPI,
  eventPredictions: eventPredictionsAPI,
};

export default api;
