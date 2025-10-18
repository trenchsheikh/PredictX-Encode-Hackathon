# User-Friendly Error Handling System

## Overview

All errors in the application are now automatically converted to user-friendly, actionable messages. Users will never see technical jargon or confusing error codes.

## What Changed

### 1. New Error Handling System

Created `lib/user-friendly-errors.ts` - a comprehensive error translation system that converts technical blockchain and application errors into clear messages.

### 2. Updated Components

#### Core Libraries

- **`lib/blockchain-utils.ts`** - `parseContractError()` now uses user-friendly messages
- **`lib/api-client.ts`** - `getErrorMessage()` now uses user-friendly messages
- **`lib/hooks/use-prediction-contract.ts`** - Added retry logic for RPC errors with better gas handling

#### UI Components

- **`components/ui/error-display.tsx`** - New component for displaying errors beautifully
  - `ErrorDisplay` - Full error card with icon, title, message, and action button
  - `InlineError` - Compact inline error message
  - `ErrorToast` - Toast notification for errors

- **`components/prediction/bet-modal.tsx`** - Updated to use new error display system

## Error Message Examples

### Before (Technical)

```
Error: could not coalesce error (error={ "code": -32603, "message": "Transaction does not have a transaction hash, there was a problem" })
```

### After (User-Friendly)

```
Network Connection Issue

We had trouble connecting to the blockchain network.

💡 This is usually temporary. Please wait a moment and try again.

[Try Again]
```

## Error Categories Handled

### 1. User Actions

- ✅ **Transaction Cancelled** - User rejected in wallet
- ✅ **Already Placed Bet** - Can only place one bet per market
- ✅ **Already Claimed** - Winnings already claimed

### 2. Network/Technical Issues

- ✅ **Network Connection Issue** - RPC errors, transaction hash problems
- ✅ **Wrong Network** - Needs to switch to BSC Mainnet
- ✅ **Transaction Stuck** - Nonce issues
- ✅ **Transaction Taking Too Long** - Timeout errors

### 3. Financial Issues

- ✅ **Insufficient Balance** - Not enough BNB
- ✅ **Amount Too Low** - Below minimum bet
- ✅ **Amount Too High** - Above maximum bet

### 4. Market State Issues

- ✅ **Market Closed** - Market expired
- ✅ **Market Not Resolved Yet** - Can't claim before resolution
- ✅ **Need to Reveal First** - Must reveal before claiming
- ✅ **Bet Did Not Win** - Wrong prediction

### 5. General Errors

- ✅ **Configuration Error** - Contract issues
- ✅ **Server Issue** - Backend problems
- ✅ **Connection Problem** - API/fetch errors
- ✅ **Wallet Issue** - Wallet connection problems

## How to Use

### In Components

#### Simple Usage (Inline)

```tsx
import { InlineError } from '@/components/ui/error-display';

function MyComponent() {
  const [error, setError] = useState<any>(null);

  return <div>{error && <InlineError error={error} />}</div>;
}
```

#### Full Error Card

```tsx
import { ErrorDisplay } from '@/components/ui/error-display';

function MyComponent() {
  const [error, setError] = useState<any>(null);

  const handleRetry = () => {
    // Retry logic
    setError(null);
  };

  return (
    <div>
      {error && (
        <ErrorDisplay
          error={error}
          onRetry={handleRetry}
          onDismiss={() => setError(null)}
        />
      )}
    </div>
  );
}
```

#### Toast Notification

```tsx
import { ErrorToast } from '@/components/ui/error-display';

function MyComponent() {
  const [error, setError] = useState<any>(null);

  return (
    <>
      {/* Your content */}
      {error && <ErrorToast error={error} onClose={() => setError(null)} />}
    </>
  );
}
```

### In Contract Interactions

The `usePredictionContract` hook automatically handles errors:

```tsx
const contract = usePredictionContract();

// Errors are automatically parsed and user-friendly
contract.error; // Contains user-friendly message
```

### In API Calls

```tsx
import { api, getErrorMessage } from '@/lib/api-client';

try {
  await api.markets.getMarkets();
} catch (error) {
  // getErrorMessage automatically converts to user-friendly message
  const message = getErrorMessage(error);
  setError(message);
}
```

## Advanced Usage

### Get Full Error Object

```tsx
import { getUserFriendlyError } from '@/lib/user-friendly-errors';

const error = someError;
const friendly = getUserFriendlyError(error);

console.log(friendly.title); // "Network Connection Issue"
console.log(friendly.message); // "We had trouble connecting..."
console.log(friendly.suggestion); // "This is usually temporary..."
console.log(friendly.action); // "Try Again"
```

### Check Error Type

```tsx
import {
  isRecoverableError,
  needsNetworkSwitch,
  isUserCancellation,
} from '@/lib/user-friendly-errors';

if (isRecoverableError(error)) {
  // Show retry button
}

if (needsNetworkSwitch(error)) {
  // Show network switch button
}

if (isUserCancellation(error)) {
  // Don't show error (user already knows)
}
```

## Testing

### Test Different Error Scenarios

```tsx
// Test with different error types
const errors = [
  { code: 4001 }, // User rejection
  { message: 'insufficient funds' }, // Low balance
  { message: '-32603' }, // RPC error
  { message: 'Market has expired' }, // Market closed
  // etc.
];

errors.forEach(error => {
  const friendly = getUserFriendlyError(error);
  console.log(friendly);
});
```

## Best Practices

### 1. Always Store Error Objects

```tsx
// ✅ Good - stores the full error
setError(error);

// ❌ Bad - loses context
setError(error.message);
```

### 2. Let the System Handle Messages

```tsx
// ✅ Good - automatic translation
<InlineError error={error} />

// ❌ Bad - manual message
<div>{error.message}</div>
```

### 3. Provide Retry Actions

```tsx
// ✅ Good - gives user action
<ErrorDisplay error={error} onRetry={handleRetry} />

// ❌ Bad - no way to recover
<div>{errorMessage}</div>
```

### 4. Don't Show User Cancellations

```tsx
// ✅ Good - respects user choice
if (!isUserCancellation(error)) {
  setError(error);
}

// ❌ Bad - shows unnecessary error
setError(error);
```

## Extending the System

### Adding New Error Types

Edit `lib/user-friendly-errors.ts` and add your error handler:

```typescript
// Check for your specific error
if (errorString.includes('your-error-keyword')) {
  return {
    title: 'Friendly Title',
    message: 'Clear explanation of what happened.',
    suggestion: 'What the user should do about it.',
    action: 'Button Text',
  };
}
```

### Custom Error Display

Create your own error component:

```tsx
import { getUserFriendlyError } from '@/lib/user-friendly-errors';

export function CustomErrorDisplay({ error }: { error: any }) {
  const friendly = getUserFriendlyError(error);

  return (
    <div className="your-custom-styles">
      <h3>{friendly.title}</h3>
      <p>{friendly.message}</p>
      {friendly.suggestion && <p>{friendly.suggestion}</p>}
    </div>
  );
}
```

## RPC Error Handling

Added special retry logic for BSC Mainnet RPC errors in `use-prediction-contract.ts`:

1. First attempt: Fixed 3 gwei gas price
2. Second attempt: Double gas limit, no gas price
3. Third attempt: Minimal settings, let network decide

This handles the common `-32603` "Transaction does not have a transaction hash" error.

## Migration Guide

### For Existing Components

1. **Import the error display component:**

   ```tsx
   import { InlineError } from '@/components/ui/error-display';
   ```

2. **Change error state to accept any type:**

   ```tsx
   // Before
   const [error, setError] = useState('');

   // After
   const [error, setError] = useState<any>(null);
   ```

3. **Store the full error object:**

   ```tsx
   // Before
   catch (err) {
     setError(err.message || 'Failed');
   }

   // After
   catch (err) {
     setError(err);
   }
   ```

4. **Use the error display component:**

   ```tsx
   // Before
   {
     error && <div className="error">{error}</div>;
   }

   // After
   {
     error && <InlineError error={error} />;
   }
   ```

## Summary

✅ All errors automatically translated to user-friendly messages
✅ Consistent error display across the entire app
✅ Clear, actionable suggestions for users
✅ Special handling for common blockchain errors
✅ RPC error retry logic for BSC Mainnet
✅ Beautiful, accessible error components
✅ Easy to extend and customize

Users will now always understand:

- **What went wrong** (title)
- **Why it happened** (message)
- **What to do about it** (suggestion + action)
