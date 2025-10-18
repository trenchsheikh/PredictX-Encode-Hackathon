/**
 * News Monitoring Service
 * Periodically checks NewsAPI.ai for event predictions
 * and triggers smart contract resolution when verified
 */

import { Market } from '../models/Market';
import { MarketStatus } from '../types';
import { newsAPIService } from './NewsAPIService';
import { blockchainService } from './BlockchainService';

export class NewsMonitoringService {
  private monitoringInterval: NodeJS.Timeout | null = null;
  private isMonitoring: boolean = false;
  private checkIntervalMs: number = 5 * 60 * 1000; // Check every 5 minutes

  constructor() {
    console.log('📰 News Monitoring Service initialized');
  }

  /**
   * Start monitoring active event predictions
   */
  startMonitoring() {
    if (this.isMonitoring) {
      console.log('⚠️  News monitoring already running');
      return;
    }

    console.log(
      `🚀 Starting news monitoring (check interval: ${this.checkIntervalMs / 1000}s)`
    );
    this.isMonitoring = true;

    // Initial check
    this.checkEventPredictions();

    // Set up periodic checks
    this.monitoringInterval = setInterval(() => {
      this.checkEventPredictions();
    }, this.checkIntervalMs);
  }

  /**
   * Stop monitoring
   */
  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    this.isMonitoring = false;
    console.log('🛑 News monitoring stopped');
  }

  /**
   * Check all active event predictions
   */
  private async checkEventPredictions() {
    try {
      console.log('🔍 Checking active event predictions...');

      // Find all active event predictions
      const activeEventMarkets = await Market.find({
        status: MarketStatus.Active,
        predictionType: 'event',
        'eventData.keywords': { $exists: true, $ne: [] },
      }).lean();

      if (activeEventMarkets.length === 0) {
        console.log('📭 No active event predictions to monitor');
        return;
      }

      console.log(
        `📊 Found ${activeEventMarkets.length} active event prediction(s) to check`
      );

      // Check each market
      for (const market of activeEventMarkets) {
        await this.checkMarket(market);
      }

      console.log('✅ Event prediction check completed');
    } catch (error: any) {
      console.error('❌ Error in news monitoring:', error.message);
    }
  }

  /**
   * Check a specific market for news verification
   */
  private async checkMarket(market: any) {
    try {
      if (!market.eventData) {
        console.warn(`⚠️  Market ${market.marketId} has no eventData`);
        return;
      }

      const now = new Date();
      const expiresAt = new Date(market.expiresAt);

      // Skip if market hasn't started or has expired
      if (
        now < new Date(market.eventData.monitoringStartDate) ||
        now > expiresAt
      ) {
        return;
      }

      // Rate limiting: Don't check more than once every hour
      if (
        market.eventData.lastChecked &&
        now.getTime() - new Date(market.eventData.lastChecked).getTime() <
          60 * 60 * 1000
      ) {
        return;
      }

      console.log(`🔎 Checking market ${market.marketId}: "${market.title}"`);

      // Verify event using NewsAPI
      const verification = await newsAPIService.verifyEvent(
        market.title,
        market.eventData.keywords,
        new Date(market.eventData.monitoringStartDate)
      );

      // Update last checked timestamp
      await Market.updateOne(
        { marketId: market.marketId },
        {
          $set: {
            'eventData.lastChecked': now,
          },
        }
      );

      const threshold = market.eventData.verificationThreshold || 0.6;

      console.log(
        `📊 Market ${market.marketId} verification: ${verification.verified ? '✅ VERIFIED' : '❌ NOT VERIFIED'} (confidence: ${(verification.confidence * 100).toFixed(1)}%, threshold: ${(threshold * 100).toFixed(1)}%)`
      );
      console.log(`   Reasoning: ${verification.reasoning}`);

      // If verified with high confidence, trigger resolution
      if (verification.verified && verification.confidence >= threshold) {
        console.log(
          `✨ Event VERIFIED for market ${market.marketId}! Triggering resolution...`
        );

        // Save news articles as evidence
        const newsArticles = verification.articles.map(article => ({
          title: article.title,
          url: article.url,
          source: article.source.name,
          publishedAt: new Date(article.publishedAt),
        }));

        await Market.updateOne(
          { marketId: market.marketId },
          {
            $set: {
              'eventData.newsArticles': newsArticles,
              status: MarketStatus.Resolving,
            },
          }
        );

        // Trigger smart contract resolution
        // Outcome is 'true' (YES) when event is verified
        await this.triggerResolution(
          market.marketId,
          true,
          verification.reasoning,
          newsArticles
        );
      }
    } catch (error: any) {
      console.error(
        `❌ Error checking market ${market.marketId}:`,
        error.message
      );
    }
  }

  /**
   * Trigger smart contract resolution
   */
  private async triggerResolution(
    marketId: number,
    outcome: boolean,
    reasoning: string,
    evidence: Array<{ title: string; url: string; source: string }>
  ) {
    try {
      console.log(
        `🎯 Triggering resolution for market ${marketId}: ${outcome ? 'YES' : 'NO'}`
      );

      // Call the blockchain service to resolve the market
      // This uses the same resolution logic as crypto predictions
      const resolvedMarket = await blockchainService.resolveMarket(
        marketId,
        outcome,
        reasoning
      );

      if (resolvedMarket) {
        console.log(`✅ Market ${marketId} resolved successfully on-chain!`);
        console.log(`   Outcome: ${outcome ? 'YES' : 'NO'}`);
        console.log(`   Reasoning: ${reasoning}`);
        console.log(`   Evidence: ${evidence.length} news article(s)`);
      } else {
        console.error(`❌ Failed to resolve market ${marketId} on-chain`);
      }
    } catch (error: any) {
      console.error(
        `❌ Error triggering resolution for market ${marketId}:`,
        error.message
      );
    }
  }

  /**
   * Manually check a specific market (for testing)
   */
  async checkMarketManually(marketId: number) {
    try {
      const market = await Market.findOne({
        marketId,
        predictionType: 'event',
      }).lean();

      if (!market) {
        console.error(
          `Market ${marketId} not found or not an event prediction`
        );
        return false;
      }

      await this.checkMarket(market);
      return true;
    } catch (error: any) {
      console.error(
        `Error manually checking market ${marketId}:`,
        error.message
      );
      return false;
    }
  }
}

export const newsMonitoringService = new NewsMonitoringService();
