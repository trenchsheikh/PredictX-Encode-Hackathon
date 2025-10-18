# Address Normalization Migration

## Problem

Users were unable to see their bets in the "My Bets" page due to address case-sensitivity issues in the database.

### Root Cause

- Ethereum addresses can be checksummed (mixed case) or lowercase
- When storing bets, addresses were saved with their original casing from the blockchain
- When querying bets, addresses were lowercased, but the stored addresses had mixed casing
- This caused MongoDB queries to fail to find matching records

## Solution

All user addresses are now normalized to lowercase throughout the system:

1. **Backend Changes**:
   - `backend/src/routes/markets.ts`: Normalize addresses when storing commitments and bets
   - `backend/src/routes/users.ts`: Simplified queries (no longer need regex)
   - `backend/src/services/BlockchainService.ts`: Normalize addresses from blockchain events
   - `backend/src/services/TransactionHistoryService.ts`: Normalize addresses in transaction records

2. **Database Migration**:
   - A migration script normalizes all existing addresses in the database

## How to Apply the Fix

### Step 1: Update Backend Code

The code changes are already applied. Make sure to restart your backend server after pulling the latest changes.

### Step 2: Run the Migration Script

**Important**: Backup your database before running the migration!

```bash
# Navigate to backend directory
cd backend

# Set your MongoDB URI (if not using default)
export MONGODB_URI="your_mongodb_connection_string"

# Run the migration
npx ts-node scripts/normalize-addresses.ts
```

The script will:

- Normalize all addresses in the `Commitments` collection
- Normalize all addresses in the `Bets` collection
- Normalize all addresses in the `Markets` collection (creator field)
- Normalize all addresses in the `Transactions` collection
- Show progress and total number of updates

### Step 3: Verify the Fix

After running the migration:

1. Restart your backend server
2. Have users log in and navigate to "My Bets"
3. Users should now see all their bets correctly

## Testing Locally

To test the fix without affecting production:

```bash
# Use a test database
export MONGODB_URI="mongodb://localhost:27017/darkbet_test"

# Run the migration
npx ts-node scripts/normalize-addresses.ts
```

## Expected Output

```
🔄 Connecting to MongoDB...
✅ Connected to MongoDB

📝 Normalizing addresses in Commitments...
  Updated commitment: 0xAbC... -> 0xabc...
  Updated commitment: 0xDeF... -> 0xdef...
✅ Updated 5 commitments

📝 Normalizing addresses in Bets...
  Updated bet: 0xAbC... -> 0xabc...
  Updated bet: 0xDeF... -> 0xdef...
✅ Updated 8 bets

📝 Normalizing addresses in Markets...
  Updated market: 0xAbC... -> 0xabc...
✅ Updated 2 markets

📝 Normalizing addresses in Transactions...
  Updated transaction: 0xAbC... -> 0xabc...
✅ Updated 15 transactions

✅ Migration completed successfully!
   Total updates: 30
📌 Disconnected from MongoDB

✨ All done!
```

## Rollback (if needed)

If you need to rollback:

1. Restore your database from the backup you created before the migration
2. Revert the code changes using git

## Future Prevention

Going forward:

- All new addresses are automatically normalized to lowercase when stored
- The codebase consistently uses lowercase addresses for all database operations
- This ensures consistent behavior regardless of how addresses are provided by wallets
