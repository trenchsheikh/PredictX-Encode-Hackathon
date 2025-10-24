# DarkBet Onboarding Flow

## Overview

DarkBet implements a mandatory 3-step onboarding process that ensures legal compliance and responsible gambling practices. Users must complete all steps before they can place bets on the platform.

## Architecture

The onboarding flow consists of three main components:

1. **OnboardingFlow Component** (`components/onboarding/onboarding-flow.tsx`)
   - Multi-step modal dialog
   - Manages user progression through verification steps
   - Handles state and validation

2. **OnboardingProvider** (`components/providers/onboarding-provider.tsx`)
   - React context provider
   - Manages onboarding state across the app
   - Stores completion status in localStorage

3. **Integration** (`app/layout.tsx`)
   - Wraps the entire app with OnboardingProvider
   - Shows onboarding modal on first visit

## Onboarding Steps

### Step 1: Concordium Identity Verification

**Purpose:** Verify user age (18+) and jurisdiction using Concordium's privacy-preserving identity system.

**Process:**

1. User clicks "Verify with Concordium ID"
2. Concordium ID App is launched (mobile app or web)
3. User completes identity verification in the Concordium app
4. Verification response is sent back to DarkBet
5. Backend validates and stores identity commitment

**Privacy:**

- Only age verification (18+) and jurisdiction are checked
- Personal information (name, address, etc.) remains private
- Zero-knowledge proof ensures privacy

**API Endpoint:** `POST /api/rg/link-identity`

**localStorage Keys:**

- `concordium_id_commitment`: Anonymous identity hash
- `concordium_attributes`: Age and jurisdiction data

### Step 2: Wallet Connection

**Purpose:** Connect Solana wallet for placing bets and receiving payouts.

**Process:**

1. User clicks "Connect Solana Wallet"
2. Privy authentication modal appears
3. User selects wallet provider (Phantom, Solflare, etc.)
4. Wallet connection is established
5. Solana address is linked to identity commitment

**Supported Wallets:**

- Phantom
- Solflare
- Coinbase Wallet
- Embedded wallets (via Privy)

### Step 3: Set Betting Limits

**Purpose:** Implement responsible gambling by setting user-defined betting limits.

**Limits Configured:**

1. **Daily Limit** (default: 1.0 SOL)
   - Maximum SOL that can be bet in 24 hours
2. **Weekly Limit** (default: 5.0 SOL)
   - Maximum SOL that can be bet in 7 days
3. **Monthly Limit** (default: 20.0 SOL)
   - Maximum SOL that can be bet in 30 days
4. **Single Bet Limit** (default: 0.5 SOL)
   - Maximum SOL for a single bet
5. **Cooldown Period** (default: 5 minutes)
   - Minimum time between consecutive bets

**Validation Rules:**

- All limits must be positive numbers
- Single bet limit ≤ Daily limit
- Daily limit ≤ Weekly limit
- Weekly limit ≤ Monthly limit

**API Endpoint:** `POST /api/rg/set-limit`

**localStorage Key:**

- `bet_restrictions`: Stored limit configuration

## Completion

Once all three steps are complete:

1. `darkbet_onboarding_completed` is set to `true` in localStorage
2. Onboarding modal closes
3. User can access all platform features
4. Betting limits are enforced on all transactions

## Resetting Onboarding

For testing or re-verification purposes:

```javascript
// Access via OnboardingProvider context
const { resetOnboarding } = useOnboarding();
resetOnboarding(); // Clears all onboarding data and restarts flow
```

This will:

- Clear `darkbet_onboarding_completed`
- Clear `concordium_id_commitment`
- Clear `concordium_attributes`
- Clear `bet_restrictions`
- Reopen onboarding modal

## API Integration

### 1. Link Identity

```typescript
POST / api / rg / link - identity;

Request: {
  privyUserId: string;
  solanaPublicKey: string;
  concordiumAccountAddress: string;
  concordiumAttributes: {
    age: number;
    jurisdiction: string;
  }
}

Response: {
  success: boolean;
  data: {
    idCommitment: string;
    verified: boolean;
    kycStatus: 'verified';
    accountAddress: string;
  }
}
```

### 2. Set Betting Limits

```typescript
POST / api / rg / set - limit;

Request: {
  idCommitment: string;
  userAddress: string;
  limits: {
    dailyLimit: number; // in SOL
    weeklyLimit: number; // in SOL
    monthlyLimit: number; // in SOL
    singleBetLimit: number; // in SOL
    cooldownPeriod: number; // in seconds
  }
}

Response: {
  success: boolean;
  data: {
    message: string;
    limits: RGLimits;
  }
}
```

## Security Considerations

1. **Identity Privacy**
   - Concordium Web3 ID uses zero-knowledge proofs
   - No personal data stored on-chain
   - Only age and jurisdiction verified

2. **Limit Enforcement**
   - Limits checked on both frontend and backend
   - Cannot be bypassed by multiple wallets (linked to identity commitment)
   - Enforced on-chain for maximum security

3. **Data Storage**
   - Identity commitment: Hashed, anonymous
   - localStorage: Client-side convenience only
   - Backend: Authoritative source of truth

## User Experience

- **First-time users:** See onboarding modal immediately
- **Returning users:** Skip onboarding (localStorage check)
- **Modal cannot be dismissed:** Ensures compliance
- **Clear progress indicators:** Step numbers and descriptions
- **Validation feedback:** Inline error messages
- **Mobile-friendly:** Responsive design, Concordium app integration

## Testing

To test the onboarding flow:

1. Clear localStorage: `localStorage.clear()`
2. Refresh the page
3. Onboarding modal should appear
4. Complete all steps with test data

## Future Enhancements

- [ ] Self-exclusion option in step 3
- [ ] Timeout periods (24h, 7d, 30d, permanent)
- [ ] Reality checks (periodic spending reports)
- [ ] Session time limits
- [ ] Email notifications for limit changes
- [ ] Support for additional identity providers
- [ ] Multi-factor authentication
- [ ] Biometric verification for mobile

## Dependencies

- `@privy-io/react-auth`: Wallet connection
- `@concordium/id-app-sdk`: Identity verification
- React Context API: State management
- localStorage: Persistence
- Next.js API Routes: Backend integration

## Support

For issues or questions about the onboarding flow:

- Check console logs for debugging
- Verify Concordium ID App is installed
- Ensure Solana wallet is properly configured
- Contact support@darkbet.fun
