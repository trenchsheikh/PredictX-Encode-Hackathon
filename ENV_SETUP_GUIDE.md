# 🔧 Environment Variables Setup Guide

## 📋 Quick Start (3 Steps)

### Step 1: Copy the Example File
```bash
# Copy the example file to create your .env.local
cp env.example .env.local
```

### Step 2: Get Required Keys

#### A. Privy App ID (Required - 2 minutes)
1. Go to [https://dashboard.privy.io](https://dashboard.privy.io)
2. Sign up or log in
3. Click "Create New App"
4. Copy your App ID (looks like: `clpXXXXXXXXXXXXXX`)
5. Add to `.env.local`:
   ```env
   NEXT_PUBLIC_PRIVY_APP_ID=clpXXXXXXXXXXXXXX
   ```
6. In Privy dashboard, go to Settings → Add `http://localhost:3000` to allowed origins

#### B. MongoDB (Required - 5 minutes)

**Option 1: Local MongoDB (Easiest for Development)**
```env
MONGODB_URI=mongodb://localhost:27017/darkbet
```

**Option 2: MongoDB Atlas (Free Cloud Database)**
1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Sign up for free account
3. Create a free cluster (M0)
4. Click "Connect" → "Connect your application"
5. Copy connection string
6. Replace `<username>`, `<password>`, and database name:
   ```env
   MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/darkbet?retryWrites=true&w=majority
   ```

#### C. Solana RPC (Optional - Default Provided)
For development, the default public RPC works fine:
```env
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
```

For better performance, get a free private RPC:
- **Helius**: [https://www.helius.dev](https://www.helius.dev)
- **QuickNode**: [https://www.quicknode.com](https://www.quicknode.com)

### Step 3: Restart Your Server
```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

---

## 🎯 Your .env.local Should Look Like This

```env
# Required
NEXT_PUBLIC_PRIVY_APP_ID=clpXXXXXXXXXXXXXX
MONGODB_URI=mongodb://localhost:27017/darkbet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com

# Optional but recommended
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

That's it! Your app will now work.

---

## 📚 Complete Environment Variables Reference

### Required Variables

| Variable | Where to Get | Purpose |
|----------|-------------|---------|
| `NEXT_PUBLIC_PRIVY_APP_ID` | [dashboard.privy.io](https://dashboard.privy.io) | User authentication |
| `MONGODB_URI` | [cloud.mongodb.com](https://cloud.mongodb.com) | Database connection |
| `NEXT_PUBLIC_SOLANA_RPC_URL` | Public or [helius.dev](https://helius.dev) | Solana blockchain |

### Optional but Recommended

| Variable | Where to Get | Purpose |
|----------|-------------|---------|
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | [cloud.walletconnect.com](https://cloud.walletconnect.com) | Better wallet connection |
| `CONCORDIUM_NODE_URL` | [Concordium Docs](https://docs.concordium.com) | Identity & RG features |
| `NEXT_PUBLIC_GEMINI_API_KEY` | [makersuite.google.com](https://makersuite.google.com/app/apikey) | AI descriptions |

### Production Variables

For production deployment (Vercel, Netlify, etc.):

```env
# Production MongoDB (use Atlas)
MONGODB_URI=mongodb+srv://prod_user:prod_pass@cluster.mongodb.net/darkbet_prod

# Production Privy
NEXT_PUBLIC_PRIVY_APP_ID=your_production_app_id

# Production Solana (use mainnet)
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# Security keys (generate strong random values)
JWT_SECRET=your_very_long_random_string
ADMIN_API_KEY=your_admin_key
ORACLE_ADMIN_KEY=your_oracle_key
```

---

## 🔒 Security Best Practices

### DO:
- ✅ Keep `.env.local` in `.gitignore`
- ✅ Use different keys for dev/staging/prod
- ✅ Generate strong random values for secrets
- ✅ Rotate keys regularly
- ✅ Use environment variables in hosting platforms

### DON'T:
- ❌ Commit `.env.local` to git
- ❌ Share your keys publicly
- ❌ Use the same keys across environments
- ❌ Store secrets in frontend code

---

## 🛠️ MongoDB Setup Details

### Local MongoDB Installation

**Windows:**
1. Download: [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Install MongoDB Community Server
3. MongoDB runs on `mongodb://localhost:27017` by default
4. Use in `.env.local`: `MONGODB_URI=mongodb://localhost:27017/darkbet`

**Mac (Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu):**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

### MongoDB Atlas (Cloud) Setup

1. **Create Account**: [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. **Create Cluster**: 
   - Click "Build a Database"
   - Choose "Free" (M0)
   - Select region closest to you
   - Click "Create Cluster"
3. **Create User**:
   - Go to "Database Access"
   - Add new user with username and password
   - Give "Read and write to any database" permission
4. **Whitelist IP**:
   - Go to "Network Access"
   - Click "Add IP Address"
   - For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production: Add specific IPs
5. **Get Connection String**:
   - Go to your cluster
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<username>`, `<password>`, and `<database>`

---

## 🔗 Concordium Setup (For Identity & RG Features)

### Testnet (Development)
```env
CONCORDIUM_NODE_URL=https://grpc.testnet.concordium.com
CONCORDIUM_NODE_PORT=20000
USE_MOCK_CONCORDIUM=true
```

### Mainnet (Production)
```env
CONCORDIUM_NODE_URL=https://grpc.mainnet.concordium.software
CONCORDIUM_NODE_PORT=20000
CONCORDIUM_RG_CONTRACT_ADDRESS=<deployed_contract_address>
USE_MOCK_CONCORDIUM=false
```

**Deploy Contract:**
```bash
cd concordium-contracts/rg-registry
cargo concordium build --out rg_registry.wasm.v1
concordium-client module deploy rg_registry.wasm.v1 --sender YOUR_ACCOUNT
```

---

## 🧪 Testing Configuration

For testing without external services:
```env
USE_MOCK_CONCORDIUM=true
USE_MOCK_SOLANA=false
USE_MOCK_PRIVY=false
TEST_MODE=true
```

---

## 📊 Complete Variable List

See `env.example` for the complete list of all available environment variables with descriptions.

**Categories:**
- Authentication (Privy)
- Database (MongoDB)
- Blockchain (Solana, Concordium)
- Oracles (Pyth)
- AI Services (OpenAI, Gemini, Claude)
- Security & Admin
- Feature Flags
- Analytics & Monitoring
- Email Services
- Rate Limiting

---

## ❓ Troubleshooting

### "Invalid Privy App ID"
- Check your App ID is correct (no spaces, quotes)
- Verify `http://localhost:3000` is in allowed origins
- Try restarting the dev server

### "MongoDB Connection Failed"
- For local: Ensure MongoDB is running
- For Atlas: Check username, password, and IP whitelist
- Verify connection string format

### "Solana RPC Error"
- Public RPCs can be slow/rate-limited
- Try a private RPC from Helius or QuickNode
- Check network (devnet vs mainnet)

---

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Set all environment variables in hosting platform
- [ ] Use production MongoDB Atlas cluster
- [ ] Use mainnet Solana RPC
- [ ] Deploy Concordium smart contract
- [ ] Update contract addresses
- [ ] Generate strong secrets
- [ ] Enable production features
- [ ] Test all functionality
- [ ] Set up monitoring/logging

---

## 📞 Need Help?

- **Privy Issues**: [https://docs.privy.io](https://docs.privy.io)
- **MongoDB Issues**: [https://docs.mongodb.com](https://docs.mongodb.com)
- **Solana Issues**: [https://docs.solana.com](https://docs.solana.com)
- **Concordium Issues**: [https://docs.concordium.com](https://docs.concordium.com)

---

**Your environment is now configured! 🎉**

Run `npm run dev` and visit `http://localhost:3000`

