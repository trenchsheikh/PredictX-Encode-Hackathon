#!/usr/bin/env ts-node

/**
 * Clear All Markets Script
 *
 * This script clears all markets from the database and resets the smart contract
 * to start fresh. This is useful for testing and development.
 *
 * Usage: npm run clear-markets
 */

import mongoose from 'mongoose';
import { Market } from '../src/models/Market';
import { Commitment } from '../src/models/Commitment';
import { Bet } from '../src/models/Bet';
import { blockchainService } from '../src/services/BlockchainService';

async function main() {
  try {
    console.log('🧹 Starting market clearing process...');
    console.log('⚠️  WARNING: This will delete ALL markets, bets, and commitments!');
    console.log('');

    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/darkbet';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Count existing data
    const marketCount = await Market.countDocuments();
    const commitmentCount = await Commitment.countDocuments();
    const betCount = await Bet.countDocuments();

    console.log(`📊 Current data counts:`);
    console.log(`   Markets: ${marketCount}`);
    console.log(`   Commitments: ${commitmentCount}`);
    console.log(`   Bets: ${betCount}`);
    console.log('');

    if (marketCount === 0 && commitmentCount === 0 && betCount === 0) {
      console.log('✅ Database is already empty. Nothing to clear.');
      return;
    }

    // Show markets that will be deleted
    if (marketCount > 0) {
      console.log('📋 Markets to be deleted:');
      const markets = await Market.find({}).select('marketId title creator createdAt').lean();
      markets.forEach((market, index) => {
        console.log(`   ${index + 1}. Market ${market.marketId}: "${market.title}"`);
        console.log(`      Creator: ${market.creator}`);
        console.log(`      Created: ${market.createdAt}`);
      });
      console.log('');
    }

    // Confirm deletion
    console.log('🚨 This action cannot be undone!');
    console.log('   - All markets will be deleted');
    console.log('   - All bets will be deleted');
    console.log('   - All commitments will be deleted');
    console.log('   - Smart contract state will remain (markets exist on-chain)');
    console.log('');

    // Delete all data
    console.log('🗑️  Deleting all data...');
    
    // Delete in order to respect foreign key constraints
    const deletedBets = await Bet.deleteMany({});
    console.log(`   ✅ Deleted ${deletedBets.deletedCount} bets`);

    const deletedCommitments = await Commitment.deleteMany({});
    console.log(`   ✅ Deleted ${deletedCommitments.deletedCount} commitments`);

    const deletedMarkets = await Market.deleteMany({});
    console.log(`   ✅ Deleted ${deletedMarkets.deletedCount} markets`);

    console.log('');
    console.log('✅ All data cleared successfully!');
    console.log('');
    console.log('📝 Next steps:');
    console.log('   1. The database is now empty');
    console.log('   2. Smart contract still has markets on-chain');
    console.log('   3. New markets will start with fresh IDs');
    console.log('   4. You can now create new markets for testing');
    console.log('');
    console.log('💡 Note: If you want to reset the smart contract too, you would need to:');
    console.log('   - Redeploy the contracts');
    console.log('   - Update contract addresses in the frontend');
    console.log('   - This script only clears the database');

  } catch (error) {
    console.error('❌ Error clearing markets:', error);
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
