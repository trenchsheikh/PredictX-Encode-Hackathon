# DarkBet Backend API

Node.js + Express + TypeScript + MongoDB backend for DarkBet prediction markets.

## 🎯 Features

- ✅ REST API for prediction markets
- ✅ Blockchain event listeners (auto-sync with MongoDB)
- ✅ Read data from blockchain (DB as cache only)
- ✅ Real-time event indexing
- ✅ TypeScript for type safety

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts        # MongoDB connection
│   │   └── blockchain.ts      # Blockchain config
│   ├── models/
│   │   ├── Market.ts          # Market schema
│   │   ├── Commitment.ts      # Commitment schema
│   │   └── Bet.ts             # Bet schema
│   ├── routes/
│   │   └── markets.ts         # API routes
│   ├── services/
│   │   └── BlockchainService.ts  # Event listeners
│   ├── types/
│   │   └── index.ts           # TypeScript types
│   └── server.ts              # Main entry point
├── package.json
├── tsconfig.json
└── nodemon.json
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Deployed smart contracts on BSC Testnet

### Installation

```bash
cd backend
npm install
```

### Configuration

Create `.env` file in the root (`/darkbet/.env`):

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/darkbet

# Blockchain
BSC_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545/
NETWORK=bscTestnet

# Contract Addresses (auto-loaded from /deployments/bscTestnet/contracts.json)
# Or set manually:
# PREDICTION_MARKET_ADDRESS=0x...
# VAULT_ADDRESS=0x...

# Server
PORT=3001

# Optional: Sync historical events on startup
SYNC_ON_STARTUP=true
SYNC_FROM_BLOCK=0
```

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
npm start
```

## 📡 API Endpoints

### **GET `/api/markets`**

List all markets with filters

**Query Parameters:**

- `status` - Filter by status (0=Active, 1=Resolving, 2=Resolved, 3=Cancelled)
- `category` - Filter by category (0-7)
- `creator` - Filter by creator address
- `limit` - Results per page (default: 50)
- `offset` - Pagination offset (default: 0)
- `sortBy` - Sort field (default: createdAt)
- `sortOrder` - asc or desc (default: desc)

**Example:**

```bash
curl http://localhost:3001/api/markets?status=0&limit=10
```

**Response:**

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 100,
    "limit": 10,
    "offset": 0
  }
}
```

---

### **GET `/api/markets/:id`**

Fetch single market by ID

**Example:**

```bash
curl http://localhost:3001/api/markets/1
```

**Response:**

```json
{
  "success": true,
  "data": {
    "marketId": 1,
    "title": "Will BTC reach $100k?",
    "description": "...",
    "creator": "0x...",
    "totalPool": "1000000000000000000",
    "yesPool": "600000000000000000",
    "noPool": "400000000000000000",
    ...
  }
}
```

---

### **POST `/api/markets`**

Create new market (admin only)

**Note:** This endpoint is informational. Market creation happens on-chain via smart contract. The backend automatically indexes MarketCreated events.

---

### **POST `/api/markets/:id/commit`**

Index a committed bet

**Body:**

```json
{
  "user": "0x...",
  "commitHash": "0x...",
  "amount": "10000000000000000",
  "txHash": "0x..."
}
```

**Note:** Called after on-chain commit. Event listener also indexes automatically.

---

### **POST `/api/markets/:id/reveal`**

Index a revealed bet

**Body:**

```json
{
  "user": "0x...",
  "outcome": true,
  "shares": "1000000000000000000",
  "amount": "10000000000000000",
  "txHash": "0x..."
}
```

**Note:** Called after on-chain reveal. Event listener also indexes automatically.

---

### **POST `/api/markets/:id/resolve`**

Index market resolution (oracle callback)

**Body:**

```json
{
  "outcome": true,
  "reasoning": "BTC reached $100k on Dec 31, 2025"
}
```

**Note:** Called after on-chain resolution. Event listener also indexes automatically.

---

## 🔄 Blockchain Event Listeners

The backend automatically listens to these smart contract events:

1. **MarketCreated** → Creates market in DB
2. **BetCommitted** → Creates commitment in DB
3. **BetRevealed** → Creates bet + updates market pools
4. **MarketResolved** → Updates market status
5. **WinningsClaimed** → Updates bet claimed status

### How It Works

```
Smart Contract Event Emitted
         ↓
Event Listener Catches It
         ↓
Handler Function Processes
         ↓
MongoDB Updated
         ↓
API Returns Fresh Data
```

### Historical Sync

To sync past events on startup:

```env
SYNC_ON_STARTUP=true
SYNC_FROM_BLOCK=0
```

Or manually via service:

```typescript
await blockchainService.syncHistoricalEvents(fromBlock);
```

## 🗄️ MongoDB Schema

### Market

```typescript
{
  marketId: number;      // Unique market ID
  title: string;
  description: string;
  creator: string;       // Wallet address
  createdAt: Date;
  expiresAt: Date;
  category: number;
  totalPool: string;     // Wei as string
  yesPool: string;
  noPool: string;
  yesShares: string;
  noShares: string;
  participants: number;
  status: 0-3;
  outcome?: boolean;
  resolutionReasoning?: string;
  txHash: string;
}
```

### Commitment

```typescript
{
  marketId: number;
  user: string; // Wallet address
  commitHash: string;
  amount: string; // Wei as string
  timestamp: Date;
  revealed: boolean;
  txHash: string;
}
```

### Bet

```typescript
{
  marketId: number;
  user: string;
  outcome: boolean; // true=YES, false=NO
  shares: string;
  amount: string;
  revealedAt: Date;
  claimed: boolean;
  txHash: string;
}
```

## 🧪 Testing

Test endpoints:

```bash
# Health check
curl http://localhost:3001/health

# Get all markets
curl http://localhost:3001/api/markets

# Get specific market
curl http://localhost:3001/api/markets/1

# Get filtered markets
curl "http://localhost:3001/api/markets?status=0&category=1&limit=5"
```

## 🔧 Development

### Hot Reload

```bash
npm run dev
```

Nodemon watches `src/` folder and restarts on changes.

### Build

```bash
npm run build
```

Compiles TypeScript to `dist/` folder.

### Logs

The backend logs:

- Incoming HTTP requests
- Blockchain events caught
- Database operations
- Errors and warnings

## 🐛 Troubleshooting

### "Contract addresses not found"

- Deploy contracts first: `cd ../contracts && npm run deploy:testnet`
- Check deployments folder: `/deployments/bscTestnet/contracts.json`
- Or set manually in `.env`

### "MongoDB connection failed"

- Ensure MongoDB is running: `mongosh` (local) or check Atlas connection string
- Check `MONGODB_URI` in `.env`

### "No blockchain events"

- Ensure contracts are deployed on correct network
- Check `BSC_RPC_URL` points to BSC Testnet
- Verify contract addresses are correct
- Check RPC is not rate-limited

### "Event listener errors"

- Make sure ABIs match deployed contracts
- Recompile contracts if changed: `cd ../contracts && npm run compile`
- Check event signatures match

## 📊 Performance

- **DB queries:** Indexed for fast lookups
- **Blockchain reads:** Cached in MongoDB (only fetch if missing)
- **Event listeners:** Real-time sync (< 1 second delay)
- **Historical sync:** Processes in chunks (5000 blocks) to avoid RPC limits

## 🔐 Security

- No private keys in backend (read-only)
- All mutations happen on-chain first
- Backend verifies data against blockchain
- MongoDB as cache only (blockchain is source of truth)

## 🚢 Deployment

### Option 1: Railway

1. Connect GitHub repo
2. Set environment variables
3. Deploy

### Option 2: Render

1. New Web Service
2. Connect repo
3. Build command: `cd backend && npm install && npm run build`
4. Start command: `cd backend && npm start`

### Option 3: VPS (Ubuntu)

```bash
# Install Node.js, MongoDB
# Clone repo
cd backend
npm install
npm run build

# Run with PM2
pm2 start dist/server.js --name darkbet-api
pm2 save
pm2 startup
```

## 📝 Notes

- **Read from blockchain:** Always fetches latest data from chain if not in cache
- **DB as cache only:** MongoDB just speeds up queries
- **Event-driven:** All updates triggered by smart contract events
- **No admin auth:** Market creation/resolution happens on-chain with proper access control

## 🤝 Integration with Frontend

Frontend should:

1. Create markets via smart contract
2. Commit/reveal bets via smart contract
3. Query backend API for fast reads
4. Listen to backend for real-time updates (optional WebSocket future enhancement)

## 📞 Support

Check logs for errors:

```bash
# Development
npm run dev

# Production
pm2 logs darkbet-api
```

---

**Status:** ✅ Ready for testing with deployed contracts  
**Last Updated:** October 13, 2025
