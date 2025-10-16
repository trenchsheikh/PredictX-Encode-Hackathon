# BSC Mainnet Deployment Guide

## Contract Addresses

The smart contracts have been successfully deployed to BSC Mainnet:

- **PredictionMarket**: `0x4DA603511D8aeA98B8d9534c19F59eB43c246DaF`
- **Vault**: `0x5499c4b5480900744350A9f891Bb2e2746d5BDbD`

## Environment Variables

To deploy to mainnet, update your environment variables:

### Frontend (.env.local or Vercel Environment Variables)

```bash
# BSC Mainnet Configuration
NEXT_PUBLIC_CHAIN_ID=56
NEXT_PUBLIC_PREDICTION_CONTRACT_ADDRESS=0x4DA603511D8aeA98B8d9534c19F59eB43c246DaF
NEXT_PUBLIC_VAULT_CONTRACT_ADDRESS=0x5499c4b5480900744350A9f891Bb2e2746d5BDbD

# Privy Configuration
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id_here

# Backend Configuration
BACKEND_URL=https://darkbet.onrender.com

# AI Configuration
NEXT_PUBLIC_AI_PROVIDER=gemini
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_AI_MODEL=models/gemini-2.5-flash
```

### Backend (.env)

```bash
# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string_here

# Oracle Admin Key
ORACLE_ADMIN_KEY=your_admin_key_here

# Contract Addresses
PREDICTION_CONTRACT_ADDRESS=0x4DA603511D8aeA98B8d9534c19F59eB43c246DaF
VAULT_CONTRACT_ADDRESS=0x5499c4b5480900744350A9f891Bb2e2746d5BDbD
```

## Deployment Steps

1. **Update Environment Variables**: Set the environment variables above in your deployment platform (Vercel, Render, etc.)

2. **Deploy Frontend**: The frontend will automatically use the mainnet configuration when `NEXT_PUBLIC_CHAIN_ID=56`

3. **Deploy Backend**: Update the backend with the new contract addresses

4. **Test Deployment**: Verify that the application works correctly on mainnet

## Network Configuration

The application will automatically:

- Load the correct contract ABIs from `/deployments/bscMainnet/`
- Use the correct contract addresses
- Switch users to BSC Mainnet (Chain ID: 56) when they connect their wallet
- Use the correct RPC URLs and block explorer URLs

## Verification

The contracts have been verified on BSCScan:

- [PredictionMarket Contract](https://bscscan.com/address/0x4DA603511D8aeA98B8d9534c19F59eB43c246DaF)
- [Vault Contract](https://bscscan.com/address/0x5499c4b5480900744350A9f891Bb2e2746d5BDbD)

## Testing

After deployment, test the following:

1. Connect wallet and verify it switches to BSC Mainnet
2. Create a crypto prediction
3. Place a bet
4. Verify transactions appear on BSCScan
5. Test AI generation for custom predictions

## Rollback

To rollback to testnet, simply change `NEXT_PUBLIC_CHAIN_ID` back to `97` and update the contract addresses to the testnet addresses.
