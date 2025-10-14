# DarkBet Quick Start Guide

Get DarkBet running locally in 5 minutes! 🚀

## ⚡ Super Quick Start

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd darkbet
npm install
cd backend && npm install && cd ..
cd contracts && npm install && cd ..
```

### 2. Set Up Environment Variables

**Backend** (`backend/.env`):
```env
MONGODB_URI=mongodb://localhost:27017/darkbet
BSC_TESTNET_RPC_URL=https://data-seed-prefork-1-s1.binance.org:8545
ADMIN_PRIVATE_KEY=your_private_key_here
PREDICTION_CONTRACT_ADDRESS=0x...
VAULT_CONTRACT_ADDRESS=0x...
```

**Frontend** (`.env.local`):
```env
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
NEXT_PUBLIC_PREDICTION_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_VAULT_CONTRACT_ADDRESS=0x...
```

### 3. Deploy Contracts
```bash
cd contracts
npx hardhat run scripts/deploy.js --network bscTestnet
# Copy the contract addresses to your .env files
```

### 4. Start Everything
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
npm run dev
```

### 5. Open Your App
Visit `http://localhost:3000` 🎉

## 🔧 What You Need

- **Node.js 18+**
- **MongoDB** (local or Atlas)
- **BNB Testnet BNB** (for gas fees)
- **Privy App ID** (for wallet connection)

## 📝 Getting Required Keys

### MongoDB
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free cluster
3. Get connection string
4. Use: `mongodb+srv://username:password@cluster.mongodb.net/darkbet`

### Privy App ID
1. Go to [Privy Dashboard](https://dashboard.privy.io)
2. Create new app
3. Copy App ID
4. Add your domain to allowed origins

### BNB Testnet BNB
1. Go to [BNB Testnet Faucet](https://testnet.bnbchain.org/faucet-smart)
2. Enter your wallet address
3. Get test BNB

### Admin Private Key
1. Create a new wallet (MetaMask, etc.)
2. Export private key
3. Fund with test BNB
4. Use for market resolution

## 🎯 First Steps After Setup

1. **Connect Wallet**: Click "Connect Wallet" in the app
2. **Create Market**: Click "Start DarkPool Betting" → Create a test market
3. **Place Bet**: Browse markets and place a test bet
4. **Check My Bets**: Go to "My Bets" to see your activity

## 🐛 Common Issues

### "Contract not found"
- Make sure you deployed contracts and copied addresses to .env files

### "Database connection failed"
- Check your MongoDB URI
- Make sure MongoDB is running (if local)

### "Privy connection failed"
- Check your Privy App ID
- Make sure your domain is whitelisted

### "Insufficient funds"
- Get more BNB from the testnet faucet
- Check you're on BNB Testnet network

## 🚀 Ready for Production?

Check out [DEPLOYMENT.md](./DEPLOYMENT.md) for deploying to Vercel + Render.

## 📚 Need More Help?

- Full documentation: [README.md](./README.md)
- Deployment guide: [DEPLOYMENT.md](./DEPLOYMENT.md)
- Create an issue in GitHub

---

**Happy betting! 🎲**
