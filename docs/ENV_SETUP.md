# DarkBet Environment Variables

Copy this file to `.env.local` and fill in your actual values.

## Required Environment Variables

```env
# Privy Configuration
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id_here

# BNB Chain Configuration
NEXT_PUBLIC_CHAIN_ID=56
NEXT_PUBLIC_RPC_URL=https://bsc-dataseed.binance.org/

# Contract Addresses (to be deployed)
NEXT_PUBLIC_VAULT_CONTRACT_ADDRESS=
NEXT_PUBLIC_PREDICTION_CONTRACT_ADDRESS=

# AI API Configuration (Optional)
NEXT_PUBLIC_AI_API_URL=
AI_API_KEY=
```

## How to Get Your Privy App ID

1. Go to [privy.io](https://privy.io)
2. Sign up or log in to your account
3. Create a new application
4. Copy your App ID from the dashboard
5. Paste it as `NEXT_PUBLIC_PRIVY_APP_ID`

## BNB Chain Configuration

- **Mainnet**: Use `NEXT_PUBLIC_CHAIN_ID=56`
- **Testnet**: Use `NEXT_PUBLIC_CHAIN_ID=97`

## Contract Addresses

These will be filled in once you deploy your smart contracts:

- `NEXT_PUBLIC_VAULT_CONTRACT_ADDRESS` - Address of your vault contract
- `NEXT_PUBLIC_PREDICTION_CONTRACT_ADDRESS` - Address of your prediction contract

## For Vercel Deployment

Set these environment variables in your Vercel dashboard:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add each variable with its production value
4. Redeploy your application
