# 🎲 DarkBet - Darkpool Prediction Market

Complete decentralized prediction market with commit-reveal privacy and FPMM pricing on BNB Chain.

## 📊 Project Status

| Component | Status | Version |
|-----------|--------|---------|
| Frontend | ✅ Complete | v1.0 |
| Smart Contracts | ✅ Complete | v1.0 |
| Backend API | ✅ Complete | v1.0 |
| Deployment | ⏳ Pending Testnet | - |

## 🏗️ Architecture

```
┌─────────────────┐
│   Next.js UI    │  ← User Interface (Frontend)
└────────┬────────┘
         │
    ┌────┴─────────────────────────────┐
    │                                   │
    ▼                                   ▼
┌─────────────────┐           ┌────────────────┐
│  Smart Contract │           │   Backend API  │
│  (BSC Testnet)  │◄─────────►│  (Node.js)     │
└─────────────────┘   Events  └────────────────┘
         │                             │
         │                             ▼
         │                     ┌───────────────┐
         │                     │   MongoDB     │
         │                     │   (Cache)     │
         │                     └───────────────┘
         ▼
    Blockchain
   (Source of Truth)
```

## 🎯 Key Features

### 🔒 Darkpool Betting (Commit-Reveal)
- Users commit bets privately
- No front-running or copycat betting
- Fair price discovery
- Privacy until reveal

### 📈 FPMM Pricing
- Fixed Product Market Maker
- Dynamic pricing based on pool ratios
- Fair and transparent

### ⚡ Real-Time Sync
- Backend listens to blockchain events
- Automatic MongoDB cache updates
- Fast API queries

### 🛡️ Security
- OpenZeppelin contracts
- Reentrancy protection
- Pausable contracts
- Owner controls

## 📁 Project Structure

```
darkbet/
├── contracts/              # Smart Contracts (Solidity + Hardhat)
│   ├── contracts/
│   │   ├── PredictionMarket.sol
│   │   └── Vault.sol
│   ├── test/
│   ├── scripts/
│   └── README.md
│
├── backend/                # Backend API (Node.js + Express + MongoDB)
│   ├── src/
│   │   ├── config/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.ts
│   └── README.md
│
├── app/                    # Next.js Frontend (Pages)
├── components/             # React Components
├── lib/                    # Utility Functions
├── public/                 # Static Assets
├── types/                  # TypeScript Types
│
├── deployments/            # Contract Deployments (Created after deploy)
│   └── bscTestnet/
│
├── reports/                # Audit Reports
│   └── frontend-audit.md
│
├── plans/                  # Implementation Plans
│   └── implementation-plan.md
│
├── DEPLOYMENT_GUIDE.md     # Deployment Instructions
├── MILESTONE_2_COMPLETE.md # Progress Summary
└── PROJECT_README.md       # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- MetaMask with BSC Testnet
- Testnet BNB ([faucet](https://testnet.binance.org/faucet-smart))

### 1. Clone & Install

```bash
git clone <repo>
cd darkbet
npm install

cd contracts
npm install

cd ../backend
npm install
```

### 2. Configure Environment

Create `.env` in project root:

```env
# Blockchain
BSC_TESTNET_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545/
DEPLOYER_PRIVATE_KEY=your_private_key_WITHOUT_0x

# MongoDB
MONGODB_URI=mongodb://localhost:27017/darkbet

# Frontend
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
NEXT_PUBLIC_VAULT_CONTRACT_ADDRESS=0x... (after deployment)
NEXT_PUBLIC_PREDICTION_CONTRACT_ADDRESS=0x... (after deployment)

# AI (for market generation)
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Deploy Contracts

```bash
cd contracts
npm run deploy:testnet
```

### 4. Start Backend

```bash
cd backend
npm run dev
```

### 5. Start Frontend

```bash
cd darkbet  # root
npm run dev
```

Visit: http://localhost:3000

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [Deployment Guide](DEPLOYMENT_GUIDE.md) | Step-by-step deployment |
| [Milestone 2 Summary](MILESTONE_2_COMPLETE.md) | What was built |
| [Contracts README](contracts/README.md) | Smart contract docs |
| [Backend README](backend/README.md) | Backend API docs |
| [Frontend Audit](reports/frontend-audit.md) | Frontend analysis |
| [Implementation Plan](plans/implementation-plan.md) | Architecture plan |

## 🧪 Testing

### Smart Contracts

```bash
cd contracts
npm run test
```

**Coverage:** 36/40 tests passing (90%)

### Backend

```bash
cd backend
npm run dev

# In another terminal:
curl http://localhost:3001/health
curl http://localhost:3001/api/markets
```

### Frontend

```bash
cd darkbet
npm run dev
```

Test features:
- Connect wallet (Privy)
- Create market
- Commit bet
- Reveal bet
- Check API data

## 🔧 Tech Stack

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui
- Privy (wallet auth)
- Ethers.js

### Smart Contracts
- Solidity 0.8.24
- Hardhat
- OpenZeppelin
- Ethers.js v6

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB (Mongoose)
- Ethers.js v6

### Blockchain
- BNB Smart Chain (BSC)
- Testnet (97)
- Mainnet (56) - future

## 🛠️ Development

### Compile Contracts

```bash
cd contracts
npm run compile
```

### Run Tests

```bash
cd contracts
npm run test
```

### Start Dev Environment

```bash
# Terminal 1: MongoDB
mongod

# Terminal 2: Backend
cd backend
npm run dev

# Terminal 3: Frontend
cd darkbet
npm run dev
```

### Deploy to Testnet

```bash
cd contracts
npm run deploy:testnet
```

### Verify on BSCScan

```bash
cd contracts
npm run verify:testnet
```

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/markets` | List all markets |
| GET | `/api/markets/:id` | Get single market |
| POST | `/api/markets` | Create market (info) |
| POST | `/api/markets/:id/commit` | Index commitment |
| POST | `/api/markets/:id/reveal` | Index revealed bet |
| POST | `/api/markets/:id/resolve` | Index resolution |

## 🔐 Security

- ✅ OpenZeppelin contracts
- ✅ Reentrancy protection
- ✅ Access control
- ✅ Pausable contracts
- ✅ Read-only backend
- ✅ Blockchain as source of truth

⚠️ **Get security audit before mainnet deployment**

## 🐛 Troubleshooting

### "Wrong network"
- Switch MetaMask to BSC Testnet (Chain ID: 97)

### "Contract addresses not found"
- Deploy contracts first
- Check `/deployments/bscTestnet/contracts.json`

### "MongoDB connection failed"
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`

### "No blockchain events"
- Verify RPC URL is correct
- Check contract addresses
- Ensure event listeners started

## 📈 Roadmap

- [x] Frontend development
- [x] Smart contract development
- [x] Backend API development
- [x] Event listeners
- [ ] Deploy to BSC Testnet
- [ ] Integration testing
- [ ] Security audit
- [ ] Deploy to BSC Mainnet

## 🤝 Contributing

This is a private project. For issues or questions, contact the team.

## 📝 License

MIT License - See LICENSE file

## 📞 Support

For help:
1. Check documentation in `/docs/`
2. Review troubleshooting in `DEPLOYMENT_GUIDE.md`
3. Check contract events on BSCScan
4. Review backend logs
5. Inspect MongoDB data

## ⚠️ Important Notes

- **DO NOT deploy to mainnet yet**
- Test thoroughly on testnet
- Get security audit before mainnet
- Never commit `.env` to git
- Use separate keys for testnet/mainnet

---

**Status:** ✅ Code Complete - Ready for Testnet Deployment  
**Built:** October 13, 2025  
**Stack:** Next.js + Solidity + Node.js + MongoDB  
**Network:** BNB Smart Chain (BSC)

---

🎲 **DarkBet** - The future of private prediction markets

