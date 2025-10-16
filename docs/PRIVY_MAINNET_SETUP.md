# Privy BSC Mainnet Configuration

## Overview

The Privy configuration has been updated to automatically connect to BSC Mainnet when `NEXT_PUBLIC_CHAIN_ID=56` is set.

## Configuration Details

### Environment-Based Network Selection

```typescript
// lib/privy-config.ts
const isMainnet = process.env.NEXT_PUBLIC_CHAIN_ID === '56';
const defaultChain = isMainnet ? bsc : bscTestnet;
const supportedChains = [bsc, bscTestnet]; // Support both networks
```

### Supported Networks

- **BSC Mainnet** (Chain ID: 56) - Default when `NEXT_PUBLIC_CHAIN_ID=56`
- **BSC Testnet** (Chain ID: 97) - Default when `NEXT_PUBLIC_CHAIN_ID=97`

### Privy Configuration

```typescript
export const privyClientConfig: PrivyClientConfig = {
  appearance: {
    theme: 'dark',
    accentColor: '#F0B90B', // BNB Yellow
  },
  loginMethods: ['wallet', 'email', 'sms', 'google', 'twitter', 'discord'],
  embeddedWallets: {
    ethereum: {
      createOnLogin: 'users-without-wallets',
    },
  },
  supportedChains, // Both BSC Mainnet and Testnet
  defaultChain, // BSC Mainnet when NEXT_PUBLIC_CHAIN_ID=56
};
```

## Environment Variables Required

### For BSC Mainnet
```bash
NEXT_PUBLIC_CHAIN_ID=56
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id_here
```

### For BSC Testnet
```bash
NEXT_PUBLIC_CHAIN_ID=97
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id_here
```

## How It Works

1. **Automatic Network Detection**: The app reads `NEXT_PUBLIC_CHAIN_ID` to determine which network to use
2. **Default Chain Selection**: Privy will default to BSC Mainnet when `NEXT_PUBLIC_CHAIN_ID=56`
3. **Multi-Network Support**: Users can still switch between networks if needed
4. **Wallet Integration**: All wallet connections will automatically connect to the correct network

## Testing

### Development Testing
1. Set `NEXT_PUBLIC_CHAIN_ID=56` in your `.env.local`
2. Run `npm run dev`
3. Open browser console to see Privy configuration logs
4. Connect wallet - should automatically connect to BSC Mainnet

### Production Testing
1. Deploy with `NEXT_PUBLIC_CHAIN_ID=56` in Vercel environment variables
2. Visit the deployed app
3. Connect wallet - should automatically connect to BSC Mainnet
4. Verify transactions appear on BSCScan

## Debugging

The configuration includes debug logging in development mode:

```javascript
// Console output in development
🔗 Privy Configuration: {
  chainId: "56",
  isMainnet: true,
  defaultChain: "BSC",
  supportedChains: ["BSC", "BSC Testnet"]
}
```

## Migration from Testnet

To migrate from testnet to mainnet:

1. Update environment variable: `NEXT_PUBLIC_CHAIN_ID=56`
2. Update contract addresses to mainnet addresses
3. Redeploy the application
4. Users will automatically connect to BSC Mainnet

## Rollback

To rollback to testnet:

1. Update environment variable: `NEXT_PUBLIC_CHAIN_ID=97`
2. Update contract addresses to testnet addresses
3. Redeploy the application
