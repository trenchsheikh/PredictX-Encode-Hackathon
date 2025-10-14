import { oracleService } from './OracleService';
import { Market } from '../models/Market';
import { Bet } from '../models/Bet';
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
  private readonly RESOLUTION_INTERVAL = 5000; // Check every 5 seconds for instant resolution
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
  async checkAndResolveMarkets(): Promise<void> {
    try {
      // Check database connection first
      try {
        await Market.findOne().limit(1);
        console.log('✅ Database connection OK');
      } catch (dbError: any) {
        console.error('❌ Database connection failed:', dbError.message);
        console.log('🔄 Skipping market resolution due to database issues');
        return;
      }

      // Find markets that are expired but not yet resolved
      const expiredMarkets = await Market.find({
        status: { $in: [0, 1] }, // Active or Resolving
        expiresAt: { $lte: new Date() },
      });

      console.log(`🔍 Found ${expiredMarkets.length} expired markets to check`);

      for (const market of expiredMarkets) {
        try {
          // Check if it's a crypto prediction that can be auto-resolved
          if (market.category === 7) {
            // Crypto category
            await this.resolveMarket(market);
          } else {
            // For non-crypto markets, try to resolve with basic logic first
            const basicResolution = await this.tryBasicResolution(market);
            if (basicResolution.success) {
              await this.resolveMarket(market);
            } else {
              // If basic resolution fails, mark as expired with default outcome
              await this.markMarketAsExpired(market);
            }
          }
        } catch (error) {
          console.error(
            `❌ Failed to resolve market ${market.marketId}:`,
            error
          );
        }
      }
    } catch (error) {
      console.error('❌ Error checking markets for resolution:', error);
    }
  }

  /**
   * Try to resolve non-crypto markets using basic logic
   */
  private async tryBasicResolution(
    market: any
  ): Promise<{ success: boolean; outcome?: boolean; reasoning?: string }> {
    try {
      const title = market.title.toLowerCase();

      // Check for time-based predictions
      if (title.includes('by') && title.includes('2024')) {
        const currentYear = new Date().getFullYear();
        if (currentYear > 2024) {
          return {
            success: true,
            outcome: false, // Past deadline, likely didn't happen
            reasoning: 'Prediction deadline has passed - defaulting to NO',
          };
        }
      }

      // Check for sports predictions (basic logic)
      if (market.category === 1) {
        // Sports category
        // For sports, we can't determine outcome without external data
        // Return false to trigger default resolution
        return { success: false };
      }

      // Check for weather predictions
      if (market.category === 2) {
        // Weather category
        // For weather, we can't determine outcome without external data
        return { success: false };
      }

      // Check for politics predictions
      if (market.category === 3) {
        // Politics category
        // For politics, we can't determine outcome without external data
        return { success: false };
      }

      // Check for entertainment predictions
      if (market.category === 4) {
        // Entertainment category
        // For entertainment, we can't determine outcome without external data
        return { success: false };
      }

      // Check for technology predictions
      if (market.category === 5) {
        // Technology category
        // For technology, we can't determine outcome without external data
        return { success: false };
      }

      // Check for economics predictions
      if (market.category === 6) {
        // Economics category
        // For economics, we can't determine outcome without external data
        return { success: false };
      }

      // Default: can't resolve
      return { success: false };
    } catch (error) {
      console.error(
        `❌ Error in basic resolution for market ${market.marketId}:`,
        error
      );
      return { success: false };
    }
  }

  /**
   * Mark market as expired (for non-crypto markets that can't be auto-resolved)
   * For now, we'll resolve with a default outcome to allow payouts
   * TODO: Implement proper refund mechanism in smart contract
   */
  private async markMarketAsExpired(market: any): Promise<void> {
    try {
      // For now, resolve with a default outcome to allow payouts
      // This is a temporary solution - ideally we'd implement refunds
      const defaultOutcome = true; // Default to YES wins for unresolved markets

      // Call smart contract to resolve with default outcome
      let txHash: string;
      try {
        txHash = await blockchainService.resolveMarket(
          market.marketId,
          defaultOutcome,
          'Market expired - default resolution applied (YES wins)'
        );
      } catch (blockchainError: any) {
        console.warn(
          `⚠️ Blockchain resolution failed for expired market ${market.marketId}:`,
          blockchainError.message
        );
        console.log('🔄 Proceeding with database-only resolution...');
        txHash = 'database-only-resolution'; // Fallback for testing
      }

      // Update market in database
      await Market.updateOne(
        { marketId: market.marketId },
        {
          status: 2, // Resolved
          outcome: defaultOutcome,
          resolutionReasoning:
            'Market expired - default resolution applied (YES wins)',
          updatedAt: new Date(),
        }
      );

      console.log(
        `⏰ Market ${market.marketId} resolved with default outcome: ${defaultOutcome ? 'YES' : 'NO'}`
      );

      // Process instant payouts for expired market
      await this.processInstantPayouts(market.marketId, defaultOutcome);
    } catch (error) {
      console.error(
        `❌ Failed to resolve market ${market.marketId} as expired:`,
        error
      );

      // Fallback: mark as resolved with null outcome (users won't be able to claim)
      try {
        await Market.updateOne(
          { marketId: market.marketId },
          {
            status: 2, // Resolved
            outcome: null, // No outcome determined
            resolutionReasoning: 'Market expired - resolution failed',
            updatedAt: new Date(),
          }
        );
        console.log(
          `⚠️ Market ${market.marketId} marked as expired with null outcome (no payouts possible)`
        );
      } catch (fallbackError) {
        console.error(
          `❌ Failed to mark market ${market.marketId} as expired (fallback):`,
          fallbackError
        );
      }
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
      let txHash: string;
      try {
        txHash = await blockchainService.resolveMarket(
          market.marketId,
          verification.outcome,
          verification.reasoning
        );
      } catch (blockchainError: any) {
        console.warn(
          `⚠️ Blockchain resolution failed for market ${market.marketId}:`,
          blockchainError.message
        );
        console.log('🔄 Proceeding with database-only resolution...');
        txHash = 'database-only-resolution'; // Fallback for testing
      }

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

      console.log(
        `✅ Market ${market.marketId} resolved: ${verification.outcome ? 'YES' : 'NO'}`
      );

      // Immediately process payouts for winning bets
      await this.processInstantPayouts(market.marketId, verification.outcome);

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
      const txHash = await blockchainService.resolveMarket(
        marketId,
        outcome,
        reasoning
      );

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

      console.log(
        `🔧 Manual resolution for market ${marketId}: ${outcome ? 'YES' : 'NO'}`
      );

      return {
        marketId,
        success: true,
        outcome,
        reasoning: `Manual resolution: ${reasoning}`,
        timestamp: Date.now(),
        txHash,
      };
    } catch (error: any) {
      console.error(
        `❌ Manual resolution failed for market ${marketId}:`,
        error
      );
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

  /**
   * Process instant payouts for winning bets after market resolution
   */
  private async processInstantPayouts(
    marketId: number,
    outcome: boolean
  ): Promise<void> {
    try {
      console.log(`💰 Processing instant payouts for market ${marketId}...`);

      // Find all revealed bets for this market
      const bets = await Bet.find({
        predictionId: marketId.toString(),
        revealed: true,
        claimed: false,
      });

      console.log(`🔍 Found ${bets.length} revealed bets to check`);

      for (const bet of bets) {
        try {
          // Check if bet won (outcome matches)
          // bet.outcome is boolean: true = yes, false = no
          const betWon =
            (bet.outcome === true && outcome) ||
            (bet.outcome === false && !outcome);

          if (betWon) {
            console.log(`🎉 Bet ${bet.id} won! Processing instant payout...`);

            // Calculate payout amount (bet.amount is stored as string)
            const betAmount = parseFloat(bet.amount);
            const payoutAmount = betAmount * 1.8; // 80% profit + original bet

            // Mark bet as claimed immediately
            await Bet.updateOne(
              { _id: bet._id },
              {
                claimed: true,
                payout: payoutAmount,
                claimedAt: new Date(),
                updatedAt: new Date(),
              }
            );

            console.log(
              `✅ Instant payout processed for bet ${bet.id}: ${payoutAmount} BNB`
            );
          } else {
            console.log(
              `❌ Bet ${bet.id} lost (${bet.outcome} vs ${outcome ? 'yes' : 'no'})`
            );
          }
        } catch (betError: any) {
          console.error(
            `❌ Failed to process payout for bet ${bet.id}:`,
            betError
          );
        }
      }

      console.log(
        `✅ Instant payout processing completed for market ${marketId}`
      );
    } catch (error: any) {
      console.error(
        `❌ Failed to process instant payouts for market ${marketId}:`,
        error
      );
    }
  }

  /**
   * Fix existing markets that are resolved but have null outcome
   * This method can be called to fix markets that were previously marked as expired
   */
  async fixNullOutcomeMarkets(): Promise<void> {
    try {
      console.log('🔧 Fixing markets with null outcome...');

      const nullOutcomeMarkets = await Market.find({
        status: 2, // Resolved
        outcome: null,
      });

      console.log(
        `🔍 Found ${nullOutcomeMarkets.length} markets with null outcome`
      );

      for (const market of nullOutcomeMarkets) {
        try {
          // Resolve with default outcome
          const defaultOutcome = true; // Default to YES wins

          // Call smart contract to resolve with default outcome
          let txHash: string;
          try {
            txHash = await blockchainService.resolveMarket(
              market.marketId,
              defaultOutcome,
              'Market expired - default resolution applied (YES wins) - Fixed by admin'
            );
          } catch (blockchainError: any) {
            console.warn(
              `⚠️ Blockchain resolution failed for null outcome market ${market.marketId}:`,
              blockchainError.message
            );
            console.log('🔄 Proceeding with database-only resolution...');
            txHash = 'database-only-resolution'; // Fallback for testing
          }

          // Update market in database
          await Market.updateOne(
            { marketId: market.marketId },
            {
              outcome: defaultOutcome,
              resolutionReasoning:
                'Market expired - default resolution applied (YES wins) - Fixed by admin',
              updatedAt: new Date(),
            }
          );

          console.log(
            `✅ Fixed market ${market.marketId} with default outcome: ${defaultOutcome ? 'YES' : 'NO'}`
          );
        } catch (error) {
          console.error(`❌ Failed to fix market ${market.marketId}:`, error);
        }
      }

      console.log('✅ Finished fixing null outcome markets');
    } catch (error) {
      console.error('❌ Error fixing null outcome markets:', error);
    }
  }
}

export const marketResolutionService = new MarketResolutionService();
