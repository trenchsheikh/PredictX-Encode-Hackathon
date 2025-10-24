# 🔧 Environment Variables Setup Guide

## 📋 Complete .env.local Template

Copy this entire template to your `.env.local` file and fill in the values you need:

```env
# ==============================================================================
# DARKBET ENVIRONMENT VARIABLES - COMPLETE TEMPLATE
# ==============================================================================
# Copy this to .env.local and fill in your values
# Minimum required: NEXT_PUBLIC_PRIVY_APP_ID, MONGODB_URI, NEXT_PUBLIC_SOLANA_RPC_URL
# ==============================================================================

# ------------------------------------------------------------------------------
# REQUIRED - PRIVY AUTHENTICATION
# ------------------------------------------------------------------------------
# Get from: https://dashboard.privy.io
# 1. Create account → New App → Copy App ID
# 2. Add http://localhost:3000 to allowed origins
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id_here
PRIVY_APP_SECRET=your_privy_app_secret_here

# ------------------------------------------------------------------------------
# REQUIRED - MONGODB DATABASE
# ------------------------------------------------------------------------------
# Option 1: Local MongoDB (for development)
MONGODB_URI=mongodb://localhost:27017/darkbet

# Option 2: MongoDB Atlas (cloud - free tier available)
# Get from: https://cloud.mongodb.com
# MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/darkbet?retryWrites=true&w=majority

MONGODB_DB_NAME=darkbet

# ------------------------------------------------------------------------------
# REQUIRED - SOLANA BLOCKCHAIN
# ------------------------------------------------------------------------------
# Devnet (for testing)
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_SOLANA_NETWORK=devnet

# Or Mainnet (production)
# NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
# NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta

# Or Private RPC (recommended for production)
# Get from: https://helius.dev or https://quicknode.com
# NEXT_PUBLIC_SOLANA_RPC_URL=https://your-endpoint.solana.quiknode.pro/YOUR_TOKEN/

# Deployed Solana Program IDs (update after deployment)
NEXT_PUBLIC_PREDICTION_PROGRAM_ID=
NEXT_PUBLIC_VAULT_PROGRAM_ID=

# Admin wallet private key (backend only - NEVER expose in frontend!)
SOLANA_ADMIN_PRIVATE_KEY=

# ------------------------------------------------------------------------------
# CONCORDIUM BLOCKCHAIN (Identity & Responsible Gambling)
# ------------------------------------------------------------------------------
# Testnet (development)
CONCORDIUM_NODE_URL=https://grpc.testnet.concordium.com
CONCORDIUM_NODE_PORT=20000
USE_MOCK_CONCORDIUM=true

# Mainnet (production)
# CONCORDIUM_NODE_URL=https://grpc.mainnet.concordium.software
# CONCORDIUM_NODE_PORT=20000
# USE_MOCK_CONCORDIUM=false

# Contract addresses (update after deployment)
CONCORDIUM_RG_CONTRACT_ADDRESS=
CONCORDIUM_RG_CONTRACT_INDEX=

# Concordium wallet (backend only)
CONCORDIUM_WALLET_FILE=
CONCORDIUM_WALLET_PASSWORD=

# ------------------------------------------------------------------------------
# OPTIONAL - WALLETCONNECT
# ------------------------------------------------------------------------------
# Get from: https://cloud.walletconnect.com
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=

# ------------------------------------------------------------------------------
# OPTIONAL - PYTH NETWORK (Price Oracles)
# ------------------------------------------------------------------------------
NEXT_PUBLIC_PYTH_PROGRAM_ID=FsJ3A3u2vn5cTVofAjvy6y5kwABJAqYWpe4975bi2epH
NEXT_PUBLIC_PYTH_BTC_FEED=HovQMDrbAgAYPCmHVSrezcSmkMtXSSUsLDFANExrZh2J
NEXT_PUBLIC_PYTH_ETH_FEED=JBu1AL4obBcCMqKBBxhpWCNUt136ijcuMZLFvTP7iWdB
NEXT_PUBLIC_PYTH_SOL_FEED=J83w4HKfqxwcq3BEMMkPFSppX3gqekLyLJBexebFVkix

# ------------------------------------------------------------------------------
# OPTIONAL - AI SERVICE (for market descriptions)
# ------------------------------------------------------------------------------
NEXT_PUBLIC_AI_PROVIDER=gemini

# OpenAI - Get from: https://platform.openai.com/api-keys
NEXT_PUBLIC_OPENAI_API_KEY=
NEXT_PUBLIC_OPENAI_MODEL=gpt-4

# Anthropic Claude - Get from: https://console.anthropic.com
NEXT_PUBLIC_ANTHROPIC_API_KEY=
NEXT_PUBLIC_ANTHROPIC_MODEL=claude-3-sonnet-20240229

# Google Gemini - Get from: https://makersuite.google.com/app/apikey
NEXT_PUBLIC_GEMINI_API_KEY=
NEXT_PUBLIC_GEMINI_MODEL=gemini-1.5-flash

# ------------------------------------------------------------------------------
# OPTIONAL - NEWS API
# ------------------------------------------------------------------------------
# Get from: https://newsapi.org
NEXT_PUBLIC_NEWSAPI_KEY=

# ------------------------------------------------------------------------------
# APPLICATION CONFIGURATION
# ------------------------------------------------------------------------------
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=/api
BACKEND_URL=http://localhost:3001

# ------------------------------------------------------------------------------
# SECURITY & ADMIN
# ------------------------------------------------------------------------------
ADMIN_API_KEY=your_secure_random_string
ORACLE_ADMIN_KEY=your_oracle_admin_key
JWT_SECRET=your_jwt_secret
ENCRYPTION_KEY=your_encryption_key

# ------------------------------------------------------------------------------
# FEATURE FLAGS
# ------------------------------------------------------------------------------
NEXT_PUBLIC_ENABLE_CONCORDIUM=true
NEXT_PUBLIC_ENABLE_RG_FEATURES=true
NEXT_PUBLIC_ENABLE_AI_DESCRIPTIONS=false
NEXT_PUBLIC_ENABLE_SOCIAL_LOGIN=true

# ------------------------------------------------------------------------------
# CONCORDIUM RG SETTINGS
# ------------------------------------------------------------------------------
MINIMUM_AGE=18
ALLOWED_JURISDICTIONS=US,UK,CA,AU,NZ,SG,JP,KR,CH,SE,NO,DK,FI,DE,FR,ES,IT,NL,BE,AT,IE
DEFAULT_DAILY_LIMIT=10
DEFAULT_WEEKLY_LIMIT=50
DEFAULT_MONTHLY_LIMIT=200
DEFAULT_SINGLE_BET_LIMIT=100
SELF_EXCLUSION_DURATIONS=7,30,90,180,365

# ------------------------------------------------------------------------------
# OPTIONAL - ANALYTICS & MONITORING
# ------------------------------------------------------------------------------
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=
NEXT_PUBLIC_GA_MEASUREMENT_ID=
SENTRY_DSN=
NEXT_PUBLIC_SENTRY_DSN=

# ------------------------------------------------------------------------------
# OPTIONAL - EMAIL SERVICE
# ------------------------------------------------------------------------------
# SendGrid
SENDGRID_API_KEY=
SENDGRID_FROM_EMAIL=noreply@darkbet.com

# Or SMTP
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM_EMAIL=

# ------------------------------------------------------------------------------
# OPTIONAL - REDIS (caching & rate limiting)
# ------------------------------------------------------------------------------
REDIS_URL=redis://localhost:6379
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100

# ------------------------------------------------------------------------------
# TESTING & DEBUG
# ------------------------------------------------------------------------------
DEBUG=false
NEXT_PUBLIC_DEBUG=false
LOG_LEVEL=info
TEST_MODE=false

# ==============================================================================
# QUICK START: Only these 3 are required to get started:
# 1. NEXT_PUBLIC_PRIVY_APP_ID
# 2. MONGODB_URI
# 3. NEXT_PUBLIC_SOLANA_RPC_URL
# ==============================================================================
```

---

## 🚀 Quick Start (3 Steps)

### Step 1: Copy the Template Above
```bash
# Create your .env.local file from the template above
# Copy the entire template and paste it into: .env.local
```

### Step 2: Fill in Required Values

**Minimum Required (to get app running):**

1. **Privy App ID** (2 minutes):
   - Go to [https://dashboard.privy.io](https://dashboard.privy.io)
   - Create account → New App → Copy App ID
   - Paste into: `NEXT_PUBLIC_PRIVY_APP_ID=your_app_id_here`
   - Add `http://localhost:3000` to allowed origins in Privy dashboard

2. **MongoDB URI**:
   - **Easy Option**: Use local MongoDB
     ```env
     MONGODB_URI=mongodb://localhost:27017/darkbet
     ```
   - **Cloud Option**: Use MongoDB Atlas (free)
     - Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
     - Create free cluster → Get connection string
     ```env
     MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/darkbet
     ```

3. **Solana RPC** (already provided in template):
   ```env
   NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
   ```

### Step 3: Restart Your Server
```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

**That's it! Your app will now work with just these 3 variables.**

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

