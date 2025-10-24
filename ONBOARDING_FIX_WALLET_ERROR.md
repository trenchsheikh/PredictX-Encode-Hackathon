# ✅ Fixed: "No Solana wallet connected" Error

## Problem

When clicking "Verify with Concordium ID App" in Step 1 of the onboarding flow, users were getting the error:

```
Error: No Solana wallet connected
```

This was happening because the original flow required users to connect their wallet **before** verifying their identity, which is backwards.

## Root Cause

The `ConcordiumVerifyModalV2` component was checking for a connected Solana wallet before allowing Concordium identity verification. This created a circular dependency:

- **Old Flow (Broken):**
  1. Need wallet to verify identity ❌
  2. But can't access app without identity ❌

## Solution

Modified the flow to allow identity verification **without** requiring a wallet connection first, then automatically link them when the wallet connects.

### New Flow (Fixed) ✅

1. **Step 1: Verify Identity** (No wallet needed)
   - User verifies Concordium identity
   - Verification data stored temporarily
   - Proceeds to Step 2

2. **Step 2: Connect Wallet**
   - User connects Solana wallet
   - Identity automatically linked to wallet
   - Proceeds to Step 3

3. **Step 3: Set Limits**
   - User configures betting limits
   - Complete!

## Changes Made

### 1. Modified `components/rg/concordium-verify-modal-v2.tsx`

**Before:**

```typescript
// Required wallet before verification
if (!user) {
  setError('Please connect your wallet first');
  return;
}

if (!solanaAccount?.address) {
  setError('No Solana wallet connected');
  return;
}
```

**After:**

```typescript
// Wallet is optional - verify identity first
const solanaAccount = user?.linkedAccounts.find(
  account => account.type === 'wallet' && account.chain === 'solana'
);

const walletAddress = solanaAccount?.address || `temp_${Date.now()}`;

// If wallet connected, link immediately
// Otherwise, store verification data for later linking
if (solanaAccount?.address && user?.id) {
  // Link now
} else {
  // Store temporarily, link when wallet connects
}
```

### 2. Updated `components/onboarding/onboarding-flow.tsx`

Added automatic wallet linking:

```typescript
// Auto-link Concordium identity to wallet when wallet connects
useEffect(() => {
  const linkIdentityToWallet = async () => {
    // Check for temporary verification data
    const tempCommitment = localStorage.getItem('concordium_id_commitment_temp');

    if (tempCommitment && authenticated) {
      // Link to wallet via backend API
      await fetch('/api/rg/link-identity', { ... });

      // Clean up temporary data
      localStorage.removeItem('concordium_id_commitment_temp');
    }
  };

  linkIdentityToWallet();
}, [authenticated, user]);
```

## Technical Details

### Temporary Storage Keys

When identity is verified before wallet connection:

- `concordium_id_commitment_temp` - Temporary ID commitment
- `concordium_account_temp` - Concordium account address
- `concordium_attributes_temp` - Age and jurisdiction data

These are automatically:

1. Created during Step 1 (identity verification)
2. Used during Step 2 (wallet connection to link)
3. Cleaned up after successful linking
4. Replaced with permanent keys:
   - `concordium_id_commitment`
   - `concordium_attributes`

### Backend API

The `/api/rg/link-identity` endpoint is called:

**Option A:** If wallet connected during Step 1 (rare)

- Links immediately during verification

**Option B:** If wallet not connected (normal flow)

- Links automatically when wallet connects in Step 2
- Uses temporary data stored in localStorage

## Testing the Fix

1. **Clear localStorage** (F12 > Application > Storage > localStorage > Clear all)
2. **Refresh page** - Onboarding modal appears
3. **Step 1**: Click "Verify with Concordium ID App"
   - ✅ Should work without wallet
   - ✅ No error about wallet
4. **Complete verification** in Concordium app
5. **Step 2**: Click "Connect Solana Wallet"
   - ✅ Wallet connects
   - ✅ Identity automatically linked (check console logs)
6. **Step 3**: Set limits and complete

## Verification

To verify the fix worked:

### Console Logs

```javascript
// After wallet connects, you should see:
'Linking identity to wallet...';
'Identity linked successfully';
```

### localStorage Check

```javascript
// Before wallet connection (Step 1 complete):
localStorage.getItem('concordium_id_commitment_temp'); // Should exist

// After wallet connection (Step 2 complete):
localStorage.getItem('concordium_id_commitment'); // Should exist
localStorage.getItem('concordium_id_commitment_temp'); // Should be null
```

### Network Tab

Check DevTools Network tab after wallet connection:

- Should see `POST /api/rg/link-identity` with 200 status
- Response should include `idCommitment` and `verified: true`

## Benefits

✅ **Logical Flow** - Identity first, wallet second  
✅ **No Circular Dependency** - Can verify without wallet  
✅ **Automatic Linking** - Seamless connection when wallet added  
✅ **Error-Free** - No more "No Solana wallet connected" error  
✅ **Privacy Preserved** - Identity still anonymous until linked  
✅ **Flexible** - Works whether wallet connected or not

## Future Improvements

Potential enhancements:

- [ ] Add visual indicator when linking happens automatically
- [ ] Show "Linking identity to wallet..." message during Step 2
- [ ] Allow re-linking to different wallet if needed
- [ ] Support multiple wallets per identity

## Rollback Plan

If issues arise, can rollback by:

1. Reverting changes to `concordium-verify-modal-v2.tsx`
2. Reverting changes to `onboarding-flow.tsx`
3. Requiring wallet connection before identity verification

However, this would reintroduce the original error.

## Status

**✅ FIXED** - Users can now verify Concordium identity without having a wallet connected first.

The onboarding flow now works in the correct, logical order:

1. Verify Identity (no wallet needed)
2. Connect Wallet (automatically links)
3. Set Limits (requires both)
