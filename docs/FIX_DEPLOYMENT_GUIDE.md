# Fix Deployment Guide: "Users Can't See Their Bets"

## Issue Summary

Users were unable to see their bets in the "My Bets" page due to address case-sensitivity mismatch in the database.

## Changes Made

### 1. Backend Code Updates

- ✅ Normalized addresses to lowercase in `backend/src/routes/markets.ts` (commit & reveal endpoints)
- ✅ Normalized addresses in `backend/src/services/BlockchainService.ts` (event listeners)
- ✅ Normalized addresses in `backend/src/services/TransactionHistoryService.ts`
- ✅ Simplified database queries in `backend/src/routes/users.ts`

### 2. Migration Script Created

- ✅ Created `backend/scripts/normalize-addresses.ts` to fix existing data
- ✅ Created `backend/scripts/README_MIGRATION.md` with detailed instructions

## Deployment Steps

### For Production (Render/Live Environment)

#### Step 1: Backup Database

```bash
# SSH into your backend server or use MongoDB Atlas backup
# Make sure you have a recent backup before proceeding!
```

#### Step 2: Deploy Code Changes

```bash
# Commit and push the changes
git add .
git commit -m "Fix: Normalize user addresses to fix My Bets visibility issue"
git push origin main
```

Your Render backend will automatically redeploy with the new code.

#### Step 3: Run Migration on Production Database

**Option A: Run migration from your local machine (recommended)**

```bash
# From your local backend directory
cd backend

# Set production MongoDB URI
export MONGODB_URI="your_production_mongodb_uri"

# Run the migration
npx ts-node scripts/normalize-addresses.ts
```

**Option B: Run migration on Render**

1. Go to your Render dashboard
2. Open a shell for your backend service
3. Run:

```bash
cd backend
npx ts-node scripts/normalize-addresses.ts
```

#### Step 4: Restart Backend (if needed)

If the backend doesn't auto-restart after the migration:

- Go to Render dashboard
- Click "Manual Deploy" > "Clear build cache & deploy"

#### Step 5: Verify the Fix

1. Clear browser cache and cookies
2. Log in with a user account that has placed bets
3. Navigate to "My Bets" page
4. Verify that all bets are now visible

### For Local Development

```bash
# Navigate to backend
cd backend

# Run migration (uses local MongoDB)
npx ts-node scripts/normalize-addresses.ts

# Restart backend
npm run dev
```

## Expected Results

After deployment:

- ✅ All users can see their committed bets
- ✅ All users can see their revealed bets
- ✅ No more case-sensitivity issues
- ✅ Consistent address handling across the platform

## Testing Checklist

- [ ] User A places a new bet → Can see it in "My Bets"
- [ ] User B who had previous bets → Can now see all their bets
- [ ] User C reveals a bet → Bet status updates correctly
- [ ] User D claims winnings → Transaction records correctly
- [ ] Leaderboard displays users correctly
- [ ] Transaction history works for all users

## Rollback Plan (if needed)

If something goes wrong:

1. **Restore database from backup**

   ```bash
   # Restore your MongoDB backup
   ```

2. **Revert code changes**
   ```bash
   git revert HEAD
   git push origin main
   ```

## Technical Details

### What Changed

- All user addresses are now stored in lowercase format
- Database queries use direct equality instead of regex
- Blockchain event listeners normalize addresses before storage
- Transaction records normalize addresses before storage

### Why This Works

- Ethereum addresses are case-insensitive at the protocol level
- Storing them in a consistent format (lowercase) ensures reliable queries
- No more mismatches between checksummed and lowercase addresses

## Monitoring

After deployment, monitor for:

- Backend logs for any database query errors
- User reports of missing bets (should be resolved)
- Performance improvements (direct equality is faster than regex)

## Support

If users still can't see their bets after migration:

1. Check backend logs for errors
2. Verify the migration completed successfully (check console output)
3. Verify user's wallet address matches the stored address format
4. Check if the user is connected with the same wallet they used to place bets

## Performance Impact

✅ **Positive impacts:**

- Faster database queries (direct equality vs regex)
- More efficient indexes
- Reduced query complexity

⚠️ **Migration time:**

- ~1 second per 1000 records
- Should complete in under a minute for most databases
- No downtime required (can run while backend is serving requests)
