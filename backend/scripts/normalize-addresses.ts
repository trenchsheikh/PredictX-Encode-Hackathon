/**
 * Migration script to normalize all user addresses to lowercase
 * This fixes the case-sensitivity issue where users couldn't see their bets
 *
 * Run with: npx ts-node scripts/normalize-addresses.ts
 */

import mongoose from 'mongoose';
import { Bet } from '../src/models/Bet';
import { Commitment } from '../src/models/Commitment';
import { Market } from '../src/models/Market';
import { Transaction } from '../src/models/Transaction';

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/darkbet';

async function normalizeAddresses() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Normalize addresses in Commitments
    console.log('\n📝 Normalizing addresses in Commitments...');
    const commitments = await Commitment.find({}).lean();
    let commitmentUpdates = 0;

    for (const commitment of commitments) {
      const normalizedAddress = commitment.user.toLowerCase();
      if (commitment.user !== normalizedAddress) {
        await Commitment.updateOne(
          { _id: commitment._id },
          { $set: { user: normalizedAddress } }
        );
        commitmentUpdates++;
        console.log(
          `  Updated commitment: ${commitment.user} -> ${normalizedAddress}`
        );
      }
    }
    console.log(`✅ Updated ${commitmentUpdates} commitments`);

    // Normalize addresses in Bets
    console.log('\n📝 Normalizing addresses in Bets...');
    const bets = await Bet.find({}).lean();
    let betUpdates = 0;

    for (const bet of bets) {
      const normalizedAddress = bet.user.toLowerCase();
      if (bet.user !== normalizedAddress) {
        await Bet.updateOne(
          { _id: bet._id },
          { $set: { user: normalizedAddress } }
        );
        betUpdates++;
        console.log(`  Updated bet: ${bet.user} -> ${normalizedAddress}`);
      }
    }
    console.log(`✅ Updated ${betUpdates} bets`);

    // Normalize addresses in Markets (creator field)
    console.log('\n📝 Normalizing addresses in Markets...');
    const markets = await Market.find({}).lean();
    let marketUpdates = 0;

    for (const market of markets) {
      const normalizedAddress = market.creator.toLowerCase();
      if (market.creator !== normalizedAddress) {
        await Market.updateOne(
          { _id: market._id },
          { $set: { creator: normalizedAddress } }
        );
        marketUpdates++;
        console.log(
          `  Updated market: ${market.creator} -> ${normalizedAddress}`
        );
      }
    }
    console.log(`✅ Updated ${marketUpdates} markets`);

    // Normalize addresses in Transactions
    console.log('\n📝 Normalizing addresses in Transactions...');
    const transactions = await Transaction.find({}).lean();
    let transactionUpdates = 0;

    for (const transaction of transactions) {
      const normalizedAddress = transaction.userAddress.toLowerCase();
      if (transaction.userAddress !== normalizedAddress) {
        await Transaction.updateOne(
          { _id: transaction._id },
          { $set: { userAddress: normalizedAddress } }
        );
        transactionUpdates++;
        console.log(
          `  Updated transaction: ${transaction.userAddress} -> ${normalizedAddress}`
        );
      }
    }
    console.log(`✅ Updated ${transactionUpdates} transactions`);

    console.log('\n✅ Migration completed successfully!');
    console.log(
      `   Total updates: ${commitmentUpdates + betUpdates + marketUpdates + transactionUpdates}`
    );
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('📌 Disconnected from MongoDB');
  }
}

// Run the migration
normalizeAddresses()
  .then(() => {
    console.log('\n✨ All done!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n💥 Migration failed:', error);
    process.exit(1);
  });
