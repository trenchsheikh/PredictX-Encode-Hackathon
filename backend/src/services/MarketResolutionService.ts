import { oracleService } from './OracleService';
import { Market } from '../models/Market';
import { blockchainService } from './BlockchainService';

/**
 * Market Resolution Service
 * Automatically resolves markets using oracle data
 */

export interface ResolutionResult {
  marketId: number;
  success: boolean;
  outcome: boolean;
  reasoning: string;
  timestamp: number;
  txHash?: string;
}

class MarketResolutionService {
  private readonly RESOLUTION_INTERVAL = 60000; // Check every minute
  private intervalId: NodeJS.Timeout | null = null;

  /**
   * Start automatic market resolution
   */
  startAutoResolution(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.intervalId = setInterval(async () => {
      await this.checkAndResolveMarkets();
    }, this.RESOLUTION_INTERVAL);

    console.log('🔍 Market resolution service started');
  }

  /**
   * Stop automatic market resolution
   */
  stopAutoResolution(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    console.log('⏹️ Market resolution service stopped');
  }

  /**
   * Check for markets that need resolution
   */
  private async checkAndResolveMarkets(): Promise<void> {
    try {
      // Find markets that are expired but not yet resolved
      const expiredMarkets = await Market.find({
        status: { $in: [0, 1] }, // Active or Resolving
        expiresAt: { $lte: new Date() },
      });

      console.log(`🔍 Found ${expiredMarkets.length} expired markets to check`);

      for (const market of expiredMarkets) {
        try {
          // Check if it's a crypto prediction that can be auto-resolved
          if (market.category === 7) { // Crypto category
            await this.resolveMarket(market);
          } else {
            // For non-crypto markets, mark as expired but not resolved
            await this.markMarketAsExpired(market);
          }
        } catch (error) {
          console.error(`❌ Failed to resolve market ${market.marketId}:`, error);
        }
      }
    } catch (error) {
      console.error('❌ Error checking markets for resolution:', error);
    }
  }

  /**
   * Mark market as expired (for non-crypto markets that can't be auto-resolved)
   */
  private async markMarketAsExpired(market: any): Promise<void> {
    try {
      await Market.updateOne(
        { marketId: market.marketId },
        {
          status: 2, // Resolved
          outcome: null, // No outcome determined
          resolutionReasoning: 'Market expired - manual resolution required',
          updatedAt: new Date(),
        }
      );

      console.log(`⏰ Market ${market.marketId} marked as expired`);
    } catch (error) {
      console.error(`❌ Failed to mark market ${market.marketId} as expired:`, error);
    }
  }

  /**
   * Resolve a specific market
   */
  async resolveMarket(market: any): Promise<ResolutionResult> {
    try {
      console.log(`🔍 Resolving market ${market.marketId}: "${market.title}"`);

      // Use oracle to verify the prediction
      const verification = await oracleService.verifyMarket(
        market.title,
        market.expiresAt.getTime()
      );

      if (!verification.success) {
        return {
          marketId: market.marketId,
          success: false,
          outcome: false,
          reasoning: verification.reasoning,
          timestamp: Date.now(),
        };
      }

      // Call smart contract to resolve the market
      const txHash = await blockchainService.resolveMarket(
        market.marketId,
        verification.outcome,
        verification.reasoning
      );

      // Update market in database
      await Market.updateOne(
        { marketId: market.marketId },
        {
          status: 2, // Resolved
          outcome: verification.outcome,
          resolutionReasoning: verification.reasoning,
          updatedAt: new Date(),
        }
      );

      console.log(`✅ Market ${market.marketId} resolved: ${verification.outcome ? 'YES' : 'NO'}`);

      return {
        marketId: market.marketId,
        success: true,
        outcome: verification.outcome,
        reasoning: verification.reasoning,
        timestamp: Date.now(),
        txHash,
      };
    } catch (error: any) {
      console.error(`❌ Failed to resolve market ${market.marketId}:`, error);
      return {
        marketId: market.marketId,
        success: false,
        outcome: false,
        reasoning: `Resolution failed: ${error.message}`,
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Manually resolve a market (admin override)
   */
  async manualResolve(
    marketId: number,
    outcome: boolean,
    reasoning: string,
    adminKey: string
  ): Promise<ResolutionResult> {
    try {
      // Verify admin key
      if (adminKey !== process.env.ORACLE_ADMIN_KEY) {
        throw new Error('Invalid admin key');
      }

      const market = await Market.findOne({ marketId });
      if (!market) {
        throw new Error('Market not found');
      }

      if (market.status === 2) {
        throw new Error('Market already resolved');
      }

      // Call smart contract to resolve
      const txHash = await blockchainService.resolveMarket(marketId, outcome, reasoning);

      // Update market in database
      await Market.updateOne(
        { marketId },
        {
          status: 2, // Resolved
          outcome,
          resolutionReasoning: reasoning,
          updatedAt: new Date(),
        }
      );

      console.log(`🔧 Manual resolution for market ${marketId}: ${outcome ? 'YES' : 'NO'}`);

      return {
        marketId,
        success: true,
        outcome,
        reasoning: `Manual resolution: ${reasoning}`,
        timestamp: Date.now(),
        txHash,
      };
    } catch (error: any) {
      console.error(`❌ Manual resolution failed for market ${marketId}:`, error);
      return {
        marketId,
        success: false,
        outcome: false,
        reasoning: `Manual resolution failed: ${error.message}`,
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Get markets pending resolution
   */
  async getPendingResolutions(): Promise<any[]> {
    return Market.find({
      status: { $in: [0, 1] }, // Active or Resolving
      expiresAt: { $lte: new Date() },
    }).sort({ expiresAt: 1 });
  }

  /**
   * Get resolution history
   */
  async getResolutionHistory(limit: number = 50): Promise<any[]> {
    return Market.find({
      status: 2, // Resolved
    })
      .sort({ updatedAt: -1 })
      .limit(limit);
  }
}

export const marketResolutionService = new MarketResolutionService();
