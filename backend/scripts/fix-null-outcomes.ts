#!/usr/bin/env ts-node

/**
 * Fix Null Outcome Markets Script
 *
 * This script fixes markets that are resolved but have null outcome,
 * which prevents users from claiming their winnings.
 *
 * Usage: npm run fix-null-outcomes
 */

import mongoose from 'mongoose';
import { Market } from '../src/models/Market';
import { marketResolutionService } from '../src/services/MarketResolutionService';

async function main() {
  try {
    console.log('🚀 Starting null outcome markets fix...');

    // Connect to MongoDB
    const mongoUri =
      process.env.MONGODB_URI || 'mongodb://localhost:27017/darkbet';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Check for null outcome markets
    const nullOutcomeMarkets = await Market.find({
      status: 2, // Resolved
      outcome: null,
    });

    console.log(
      `🔍 Found ${nullOutcomeMarkets.length} markets with null outcome`
    );

    if (nullOutcomeMarkets.length === 0) {
      console.log('✅ No null outcome markets found. Nothing to fix.');
      return;
    }

    // Display markets that will be fixed
    console.log('\n📋 Markets to be fixed:');
    nullOutcomeMarkets.forEach((market, index) => {
      console.log(`${index + 1}. Market ${market.marketId}: "${market.title}"`);
      console.log(
        `   Category: ${market.category}, Expires: ${market.expiresAt}`
      );
    });

    // Fix the markets
    console.log('\n🔧 Fixing markets...');
    await marketResolutionService.fixNullOutcomeMarkets();

    console.log('\n✅ All null outcome markets have been fixed!');
    console.log('💡 Users can now claim their winnings for these markets.');
  } catch (error) {
    console.error('❌ Error fixing null outcome markets:', error);
    process.exit(1);
  } finally {
    // Close MongoDB connection
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

export { main };
