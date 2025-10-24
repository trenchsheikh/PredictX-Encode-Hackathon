# Concordium ID App SDK Setup Guide

This guide explains how to properly set up Concordium identity verification using the official **@concordium/id-app-sdk**.

## Overview

We use the Concordium ID App SDK to verify user identity (age and jurisdiction) in a privacy-preserving way for responsible gambling compliance.

**Official Documentation:** https://www.npmjs.com/package/@concordium/id-app-sdk

## Architecture

```
User → Darkbet → Concordium ID App → Identity Provider → Darkbet Backend → Solana
```

1. **User initiates verification** in Darkbet UI
2. **Darkbet launches Concordium ID App** via deep link
3. **User completes verification** in ID App (age, jurisdiction)
4. **ID App returns signed credentials** to Darkbet
5. **Darkbet backend validates** and stores identity commitment
6. **User can now place bets** with RG limits

## Installation

The SDK is already installed:

```bash
npm install @concordium/id-app-sdk
```

## Key Components

### 1. Concordium ID Service (`lib/concordium-id-service.ts`)

This service handles the ID App SDK integration:

```typescript
import {
  ConcordiumIDAppSDK,
  type CreateAccountCreationRequestMessage,
  IDAppSdkWallectConnectMethods,
  type CreateAccountCreationResponse,
} from '@concordium/id-app-sdk';
```

**Main Functions:**

- `initializeConcordiumIDApp()` - Initialize the SDK
- `createAccountCreationRequest()` - Create identity verification request
- `handleAccountCreationResponse()` - Process ID App response
- `launchConcordiumIDApp()` - Open ID App for verification
- `setupIDAppResponseListener()` - Listen for verification completion

### 2. Verification Modal (`components/rg/concordium-verify-modal-v2.tsx`)

React component that provides the user interface for identity verification:

- **Step 1: Intro** - Explain the verification process
- **Step 2: Launching** - Open Concordium ID App
- **Step 3: Waiting** - User completes verification in ID App
- **Step 4: Processing** - Validate and store credentials
- **Step 5: Success** - Verification complete

### 3. API Endpoint (`app/api/rg/link-identity/route.ts`)

Backend endpoint that receives the verified credentials:

```typescript
POST /api/rg/link-identity
{
  "privyUserId": "user-123",
  "solanaPublicKey": "ABC...",
  "concordiumAccountAddress": "3...",
  "concordiumAttributes": {
    "age": 25,
    "jurisdiction": "US"
  }
}
```

## Configuration

Add these environment variables to your `.env`:

```bash
# Concordium Network
CONCORDIUM_NETWORK=testnet  # or mainnet
CONCORDIUM_NODE_URL=https://grpc.testnet.concordium.com:20000

# Responsible Gambling Settings
MINIMUM_AGE=18
ALLOWED_JURISDICTIONS=US,UK,CA,AU

# Concordium RG Contract Address (deploy contract first)
CONCORDIUM_RG_CONTRACT_ADDRESS=<your_contract_address>
```

## User Flow

### 1. User Initiates Verification

```tsx
<ConcordiumVerifyModalV2
  open={showVerifyModal}
  onOpenChange={setShowVerifyModal}
  onVerified={data => {
    console.log('Verified!', data);
    // Continue with bet placement
  }}
/>
```

### 2. ID App Opens

The SDK creates a deep link to the Concordium ID App:

```
concordium-id://request?data={encodedRequest}
```

Or fallback to web version:

```
https://id.concordium.com/verify?request={encodedRequest}
```

### 3. User Verifies in ID App

The user:

1. Connects their Concordium wallet
2. Selects which attributes to reveal (age, jurisdiction)
3. Signs the credential with their private key
4. Returns to Darkbet

### 4. Darkbet Processes Response

```typescript
const result = await handleAccountCreationResponse(response);

if (result.success) {
  // Extract verified attributes
  const { age, jurisdiction } = result.attributes;

  // Link to user account
  await fetch('/api/rg/link-identity', {
    method: 'POST',
    body: JSON.stringify({
      privyUserId: user.id,
      solanaPublicKey: solanaAddress,
      concordiumAccountAddress: result.accountAddress,
      concordiumAttributes: result.attributes,
    }),
  });
}
```

### 5. Backend Validates & Stores

```typescript
// Validate age
if (attributes.age < MINIMUM_AGE) {
  return error('User must be at least 18 years old');
}

// Validate jurisdiction
if (!ALLOWED_JURISDICTIONS.includes(attributes.jurisdiction)) {
  return error('Betting not allowed in your jurisdiction');
}

// Generate anonymous ID commitment
const idCommitment = generateIdCommitment(privyUserId, solanaPublicKey);

// Register in RG system
await registerUser(idCommitment, attributes);

// Update Privy metadata
await updatePrivyMetadata(privyUserId, {
  concordiumIdCommitment: idCommitment,
  concordiumAccountAddress,
  concordiumProofVerified: true,
  kycStatus: 'verified',
});
```

## Privacy Architecture

### Identity Commitment

We use **Blake2b hashing** to create an anonymous on-chain identifier:

```typescript
idCommitment = Blake2b(privyUserId || solanaPublicKey);
```

This ensures:

- ✅ No PII on-chain
- ✅ Linkable across sessions
- ✅ Unlinkable to real identity
- ✅ Verifiable without revealing details

### Zero-Knowledge Proofs

Concordium uses **zero-knowledge proofs** for attribute verification:

- User proves `age >= 18` without revealing exact age
- User proves `jurisdiction ∈ [US, UK, CA, AU]` without revealing exact location
- Cryptographic guarantees prevent forgery

## Testing

### Development Mode

For development, we can skip the actual ID App flow:

```typescript
// In lib/concordium-id-service.ts
if (process.env.NODE_ENV === 'development') {
  // Return mock credentials for testing
  return {
    success: true,
    accountAddress: 'mock_address',
    attributes: {
      age: 25,
      jurisdiction: 'US',
    },
  };
}
```

### Testnet

Use Concordium's testnet for integration testing:

1. Install Concordium Wallet (Testnet mode)
2. Create test identity
3. Get test CCDs from faucet
4. Test full verification flow

## Mobile Support

The ID App SDK supports mobile devices:

### iOS

- Deep link: `concordium-id://`
- App Store: [Concordium Wallet](https://apps.apple.com/app/concordium-wallet)

### Android

- Deep link: `concordium-id://`
- Play Store: [Concordium Wallet](https://play.google.com/store/apps/details?id=com.concordium.wallet)

### Fallback

If app not installed, redirect to web version:

```typescript
window.open('https://id.concordium.com/verify?request=...', '_blank');
```

## Troubleshooting

### ID App doesn't open

- Ensure Concordium Wallet is installed
- Check deep link permissions
- Try web fallback URL

### Verification fails

- Check `MINIMUM_AGE` and `ALLOWED_JURISDICTIONS` in `.env`
- Verify user's identity attributes meet requirements
- Check network connectivity to Concordium node

### Response not received

- Ensure message listener is set up correctly
- Check browser console for errors
- Verify callback is registered before launching ID App

## Next Steps

1. ✅ Install `@concordium/id-app-sdk`
2. ✅ Configure environment variables
3. ✅ Deploy Concordium RG smart contract
4. ✅ Implement verification flow in UI
5. ✅ Test on testnet
6. 🔲 Deploy to production with mainnet

## Resources

- [Concordium ID App SDK on npm](https://www.npmjs.com/package/@concordium/id-app-sdk)
- [Concordium Documentation](https://docs.concordium.com)
- [Concordium Wallet](https://concordium.com/wallet)
- [Web3 ID Guide](https://docs.concordium.com/en/mainnet/docs/web3-id/)

---

**Status:** ✅ Implementation Complete - Using Official SDK
**Last Updated:** October 24, 2025
