# DarkBet Deployment Guide

Complete step-by-step guide to deploy DarkBet prediction market to BSC Testnet.

## 📋 Prerequisites

Before deploying, ensure you have:

- [x] Node.js 18+ installed
- [x] MongoDB installed (local or Atlas account)
- [x] BSC Testnet wallet with BNB (get from [faucet](https://testnet.binance.org/faucet-smart))
- [x] BSCScan API key (optional, for verification)
- [x] Git repository set up

## 🗂️ Project Structure

```
darkbet/
├── contracts/          ✅ Smart contracts (COMPLETE)
├── backend/            ✅ Node.js API (COMPLETE)
├── deployments/        ⏳ Contract addresses (after deployment)
├── app/                ✅ Frontend (UNTOUCHED)
├── components/         ✅ Frontend (UNTOUCHED)
├── lib/                ✅ Frontend (UNTOUCHED)
└── ...                 ✅ Frontend files (UNTOUCHED)
```

## 🚀 Deployment Steps

### Phase 1: Deploy Smart Contracts to BSC Testnet

#### 1.1 Configure Environment

Edit `.env` in project root:

```env
# BSC Testnet Configuration
BSC_TESTNET_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545/
DEPLOYER_PRIVATE_KEY=your_private_key_WITHOUT_0x

# BSCScan API Key (for verification)
BSCSCAN_API_KEY=your_bscscan_api_key

# Note: DO NOT commit .env to git!
```

**⚠️ IMPORTANT:**
- Remove `0x` prefix from private key
- Never commit `.env` to git
- Get testnet BNB from: https://testnet.binance.org/faucet-smart
- Get BSCScan API key from: https://testnet.bscscan.com/myapikey

#### 1.2 Deploy Contracts

```bash
cd contracts
npm run deploy:testnet
```

**Expected Output:**
```
🚀 Starting DarkBet contracts deployment...
📡 Network: bscTestnet (Chain ID: 97)
👤 Deploying with account: 0x...
💰 Account balance: 1.5 BNB

📦 Deploying Vault...
✅ Vault deployed to: 0x...

📦 Deploying PredictionMarket...
✅ PredictionMarket deployed to: 0x...

🔐 Authorizing PredictionMarket to send fees to Vault...
✅ Authorization complete

🎉 DEPLOYMENT COMPLETE
```

**Contract addresses will be saved to:**
- `/deployments/bscTestnet/contracts.json`
- `/deployments/bscTestnet/Vault.json` (ABI)
- `/deployments/bscTestnet/PredictionMarket.json` (ABI)

#### 1.3 Verify Contracts on BSCScan

```bash
cd contracts

# Verify Vault
npx hardhat verify --network bscTestnet 0xYOUR_VAULT_ADDRESS

# Verify PredictionMarket
npx hardhat verify --network bscTestnet 0xYOUR_PREDICTION_MARKET_ADDRESS 0xYOUR_VAULT_ADDRESS 0xYOUR_RESOLVER_ADDRESS
```

**Check verification:**
- Visit: https://testnet.bscscan.com/address/0xYOUR_CONTRACT_ADDRESS
- Should see green checkmark ✓

---

### Phase 2: Set Up MongoDB

#### Option A: Local MongoDB

```bash
# Install MongoDB
# Ubuntu/Debian:
sudo apt-get install mongodb

# macOS:
brew install mongodb-community

# Windows:
# Download from: https://www.mongodb.com/try/download/community

# Start MongoDB
mongod

# Verify
mongosh
> show dbs
```

#### Option B: MongoDB Atlas (Recommended for Production)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Create database user
4. Whitelist your IP (or 0.0.0.0/0 for testing)
5. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/darkbet`

---

### Phase 3: Configure Backend

Edit `.env` in project root:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/darkbet
# Or Atlas:
# MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/darkbet

# Blockchain
BSC_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545/
NETWORK=bscTestnet

# Contract Addresses (auto-loaded from /deployments/bscTestnet/contracts.json)
# No need to set manually if deployment files exist

# Server
PORT=3001

# Optional: Sync historical events on startup
SYNC_ON_STARTUP=true
SYNC_FROM_BLOCK=0

# Frontend Environment (NEXT_PUBLIC_ variables)
NEXT_PUBLIC_VAULT_CONTRACT_ADDRESS=0xYOUR_VAULT_ADDRESS
NEXT_PUBLIC_PREDICTION_CONTRACT_ADDRESS=0xYOUR_PREDICTION_MARKET_ADDRESS
NEXT_PUBLIC_CHAIN_ID=97
NEXT_PUBLIC_NETWORK_NAME=BSC Testnet

# Privy (for wallet auth)
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id

# AI Configuration (for market generation)
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key
```

---

### Phase 4: Start Backend API

```bash
cd backend

# Install dependencies (if not done)
npm install

# Development mode (with hot reload)
npm run dev

# Or production mode
npm run build
npm start
```

**Expected Output:**
```
🚀 Starting DarkBet Backend API...

✅ MongoDB connected successfully
📊 Database: darkbet

✅ Loaded contract addresses from deployments
   PredictionMarket: 0x...
   Vault: 0x...

👂 Starting blockchain event listeners...
✅ Event listeners started successfully

============================================================
✅ DarkBet Backend API is running!
============================================================

📡 Server: http://localhost:3001
📊 Health: http://localhost:3001/health
🔗 API:    http://localhost:3001/api/markets

👂 Listening for blockchain events...
============================================================
```

**Test the API:**
```bash
# Health check
curl http://localhost:3001/health

# Get markets
curl http://localhost:3001/api/markets
```

---

### Phase 5: Update Frontend Configuration

Update `darkbet/.env` with deployed contract addresses:

```env
# Add these if not already present:
NEXT_PUBLIC_VAULT_CONTRACT_ADDRESS=0xYOUR_VAULT_ADDRESS
NEXT_PUBLIC_PREDICTION_CONTRACT_ADDRESS=0xYOUR_PREDICTION_MARKET_ADDRESS
NEXT_PUBLIC_CHAIN_ID=97
NEXT_PUBLIC_NETWORK_NAME=BSC Testnet
NEXT_PUBLIC_BSC_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545/

# Backend API URL (for production deployment)
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

### Phase 6: Test the Full Stack

#### 6.1 Start Frontend

```bash
cd darkbet  # root folder
npm run dev
```

Visit: http://localhost:3000

#### 6.2 Test Flow

1. **Connect Wallet** (Privy)
   - Click "Connect Wallet" in header
   - Connect with MetaMask (BSC Testnet)

2. **Create Market**
   - Click "Create Bet" button
   - Fill in market details
   - Sign transaction
   - Wait for confirmation

3. **Check Backend**
   - Backend should log: `📢 MarketCreated: 1 - Your Market Title`
   - Check database: `mongosh` → `use darkbet` → `db.markets.find()`

4. **Commit Bet**
   - Go to market
   - Click "Bet YES" or "Bet NO"
   - Enter amount
   - Generate commit hash
   - Sign transaction

5. **Reveal Bet**
   - Click "Reveal Bet"
   - Enter salt (same as commit)
   - Sign transaction

6. **Check Data**
   - Backend logs bet revealed
   - Check: `curl http://localhost:3001/api/markets/1`
   - Should show updated pools and shares

---

## 🔧 Troubleshooting

### Contracts

**"Insufficient funds for gas"**
- Get testnet BNB from faucet
- Check balance: add BSC Testnet to MetaMask

**"Contract verification failed"**
- Make sure constructor args are correct
- Wait a few minutes and retry
- Check BSCScan for error message

### Backend

**"Contract addresses not found"**
- Run deployment first: `cd contracts && npm run deploy:testnet`
- Check `/deployments/bscTestnet/contracts.json` exists

**"MongoDB connection failed"**
- Ensure MongoDB is running: `mongosh`
- Check connection string in `.env`

**"No blockchain events"**
- Verify RPC URL is correct
- Check contract addresses match deployed contracts
- Ensure event listeners started (check logs)

### Frontend

**"Wrong network"**
- Switch MetaMask to BSC Testnet
- Chain ID should be 97

**"Transaction failed"**
- Check you have enough BNB for gas
- Ensure contract addresses are correct in `.env`

---

## 📊 Monitoring

### Backend Logs

```bash
cd backend
npm run dev  # Development (shows all logs)

# Or with PM2 (production)
pm2 start dist/server.js --name darkbet-api
pm2 logs darkbet-api
```

### Smart Contract Events

Check on BSCScan:
- Go to: https://testnet.bscscan.com/address/0xYOUR_CONTRACT_ADDRESS
- Click "Events" tab
- Should see all emitted events

### Database

```bash
mongosh

use darkbet

# Check markets
db.markets.find().pretty()

# Check commitments
db.commitments.find().pretty()

# Check bets
db.bets.find().pretty()

# Count documents
db.markets.countDocuments()
```

---

## 🚢 Production Deployment

### Backend (Railway / Render / Vercel)

1. Push code to GitHub
2. Connect repo to hosting platform
3. Set environment variables
4. Deploy

**Environment Variables:**
- `MONGODB_URI`
- `BSC_RPC_URL` (mainnet for production!)
- `NETWORK`
- `PORT`

### Frontend (Vercel)

1. Already on Vercel (if previously deployed)
2. Update environment variables with mainnet addresses
3. Redeploy

---

## ⚠️ Important Notes

- **DO NOT deploy to mainnet yet** - test thoroughly on testnet first
- **Get security audit** before mainnet deployment
- **Test all features** on testnet (create, commit, reveal, resolve, claim)
- **Monitor gas costs** - optimize if needed
- **Set proper resolver** address (for market resolution)
- **Keep private keys secure** - never commit to git

---

## 📝 Next Steps

After successful testnet deployment:

1. ✅ Test market creation
2. ✅ Test commit-reveal betting
3. ✅ Test market resolution
4. ✅ Test claiming winnings
5. ✅ Test refunds for unrevealed bets
6. ✅ Monitor event listeners
7. ✅ Test API endpoints
8. ⏳ Get security audit (before mainnet)
9. ⏳ Deploy to BSC Mainnet (ONLY after audit + testing)

---

## 🤝 Need Help?

**Resources:**
- Hardhat docs: https://hardhat.org/
- BSC docs: https://docs.bnbchain.org/
- MongoDB docs: https://docs.mongodb.com/
- Privy docs: https://docs.privy.io/

**Check logs:**
- Backend: `npm run dev` (shows all logs)
- Contracts: Check BSCScan events
- Database: `mongosh` → inspect collections

---

**Status:** ✅ All code complete, ready for deployment testing  
**Last Updated:** October 13, 2025

