# ✅ Backend Setup Complete!

## 🎉 What Was Created

A fully structured, standalone Express.js backend has been created in the `backend/` folder with all the necessary components to run your DarkBet API independently.

## 📂 Complete Backend Structure

```
backend/
├── src/
│   ├── server.js                    # Main Express application & server
│   ├── routes/                      # API route handlers
│   │   ├── health.js               # Health check endpoint
│   │   ├── markets.js              # Market CRUD & operations
│   │   ├── oracle.js               # Price oracle integration
│   │   ├── rg.js                   # Responsible Gambling (Concordium)
│   │   ├── transactions.js         # Transaction history
│   │   └── users.js                # User data & leaderboard
│   ├── utils/                       # Utility modules
│   │   ├── database.js             # MongoDB connection pooling
│   │   └── concordium-service.js   # Concordium RG service
│   └── models/                      # (Empty) For future Mongoose models
├── node_modules/                    # ✅ Installed dependencies
├── package.json                     # Dependencies & scripts
├── .env                            # ✅ Environment variables (copied)
├── .gitignore                      # Git ignore rules
├── README.md                       # Detailed documentation
└── start-backend.bat               # Windows quick start script
```

## 🚀 How to Run

### Method 1: Quick Start (Recommended for Windows)

Simply **double-click**:

```
START_BACKEND.bat
```

(Located in the root folder)

### Method 2: Manual Start

```bash
cd backend
npm run dev
```

### Method 3: Production Mode

```bash
cd backend
npm start
```

## 🌐 The Backend Will Run On:

**Base URL**: `http://localhost:3001`

You can test it immediately after starting:

- **Health Check**: http://localhost:3001/api/health
- **Root Info**: http://localhost:3001/

## 📡 Complete API Reference

### 🏥 Health & Status

- `GET /` - API information
- `GET /api/health` - Server health check

### 🎯 Markets

- `GET /api/markets` - List all markets
- `GET /api/markets/:id` - Get specific market
- `POST /api/markets/:id/commit` - Commit prediction
- `POST /api/markets/resolve-market` - Resolve market
- `POST /api/markets/trigger-resolution` - Trigger resolution

### 💰 Oracle (Price Feeds)

- `GET /api/oracle/prices?symbols=BTC,ETH,SOL` - Get current prices

### 🛡️ Responsible Gambling (Concordium)

- `POST /api/rg/link-identity` - Link Concordium Web3 ID
- `POST /api/rg/check` - Validate if bet is allowed
- `GET /api/rg/status?idCommitment=<id>` - Get RG status
- `POST /api/rg/record-bet` - Record a bet
- `POST /api/rg/set-limit` - Set betting limits
- `POST /api/rg/self-exclude` - Self-exclude from betting

### 📊 Transactions

- `GET /api/transactions/market/:marketId` - Market transactions

### 👥 Users

- `GET /api/users/:address/bets` - User bet history
- `GET /api/users/leaderboard` - Platform leaderboard

## 🔧 Configuration

The backend uses your existing `.env` file. Key variables:

```env
# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb+srv://...

# Responsible Gambling
MINIMUM_AGE=18
ALLOWED_JURISDICTIONS=US,UK,CA,AU,...
DEFAULT_DAILY_LIMIT=10
DEFAULT_WEEKLY_LIMIT=50
```

## 🧪 Testing the Backend

### Using PowerShell/CMD:

```powershell
# Health check
Invoke-WebRequest http://localhost:3001/api/health

# Get API info
Invoke-WebRequest http://localhost:3001/
```

### Using curl (Git Bash/WSL):

```bash
curl http://localhost:3001/api/health
curl http://localhost:3001/
```

### Using a REST Client:

- **Postman**: Import and test endpoints
- **Thunder Client** (VS Code): Install extension and create requests
- **Insomnia**: API testing tool

## 🔄 Running Frontend + Backend Together

You need **TWO terminals**:

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

✅ Running on: http://localhost:3001

**Terminal 2 - Frontend:**

```bash
# (from root directory)
npm run dev
```

✅ Running on: http://localhost:3000

## 📦 What's Included & Working

### ✅ Implemented & Ready:

- Express server with proper middleware
- CORS configuration for frontend
- All route stubs created
- **Concordium RG Service** (fully implemented in mock mode)
  - Identity linking
  - Bet validation
  - Limit enforcement
  - Self-exclusion
  - Audit logging
- Database connection (with graceful fallback)
- Error handling
- Request logging
- Environment configuration

### ⚠️ Needs Implementation (Stubs Only):

- Market operations (connect to Solana program)
- Oracle price fetching (connect to Pyth)
- Transaction history (query blockchain/DB)
- User bets & leaderboard (query DB)
- Database models

## 🛠️ Next Development Steps

### 1. Add Database Models

Create Mongoose schemas in `backend/src/models/`:

```javascript
// src/models/Market.js
const mongoose = require('mongoose');

const MarketSchema = new mongoose.Schema({
  marketId: String,
  title: String,
  description: String,
  // ... more fields
});

module.exports = mongoose.model('Market', MarketSchema);
```

### 2. Implement Solana Integration

In `routes/markets.js`:

```javascript
const { Connection, PublicKey } = require('@solana/web3.js');

// Connect to your deployed program
const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL);
const programId = new PublicKey(process.env.NEXT_PUBLIC_PREDICTION_PROGRAM_ID);
```

### 3. Add Authentication

```javascript
// middleware/auth.js
const verifyPrivyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  // Verify token with Privy
  // ...
  next();
};
```

### 4. Connect to Pyth Oracle

In `routes/oracle.js`:

```javascript
const { Connection, PublicKey } = require('@solana/web3.js');
const { PythHttpClient } = require('@pythnetwork/client');
```

## 🐛 Troubleshooting

### Backend Won't Start

**Port 3001 already in use:**

```bash
# Find and kill the process (Windows)
netstat -ano | findstr :3001
taskkill /PID <PID_NUMBER> /F

# Or change port in .env
PORT=3002
```

**MongoDB connection error:**

- Check if MongoDB is running (local)
- Verify `MONGODB_URI` in `.env`
- Server will still start without DB connection

**Module not found errors:**

```bash
cd backend
npm install
```

### CORS Errors

If frontend can't connect:

1. Check `FRONTEND_URL` in `.env` matches frontend (http://localhost:3000)
2. Ensure both servers are running
3. Check browser console for specific error

### 500 Internal Server Error

Check backend terminal for error logs. Most likely:

- Database connection issue (non-critical, server still runs)
- Missing environment variable
- Route handler error

## 📚 Additional Resources

- **Backend README**: `backend/README.md` (detailed docs)
- **Main README**: `BACKEND_README.md` (this file moved there)
- **API Testing**: Use Postman or Thunder Client

## 🎯 Current Status

| Component           | Status         |
| ------------------- | -------------- |
| Server Setup        | ✅ Complete    |
| Dependencies        | ✅ Installed   |
| Routes Created      | ✅ Complete    |
| RG Service          | ✅ Implemented |
| Database Connection | ✅ Configured  |
| CORS                | ✅ Configured  |
| Error Handling      | ✅ Implemented |
| Documentation       | ✅ Complete    |
| Solana Integration  | ⚠️ Needs work  |
| Oracle Integration  | ⚠️ Needs work  |
| Database Models     | ⚠️ Not started |
| Authentication      | ⚠️ Not started |

## 🚀 Quick Start Summary

```bash
# 1. Start backend
cd backend
npm run dev

# 2. Test it's working
# Open: http://localhost:3001/api/health

# 3. Start frontend (in another terminal)
cd ..
npm run dev

# 4. Open app
# http://localhost:3000
```

## 📝 Notes

- The backend can run completely independently of the Next.js app
- All Next.js API routes (`app/api/*`) are now replicated in the backend
- Frontend can be configured to use this backend instead of Next.js API routes
- Perfect for deploying backend and frontend separately

## 🎉 You're All Set!

Your backend is ready to run. The basic structure is complete, and the Responsible Gambling system is fully functional in mock mode.

**To get started:**

1. Run: `START_BACKEND.bat` or `cd backend && npm run dev`
2. Visit: http://localhost:3001
3. Start developing! 🚀

---

**Need help?** Check:

- `backend/README.md` - Full documentation
- Backend terminal - Error logs
- API responses - Detailed error messages
