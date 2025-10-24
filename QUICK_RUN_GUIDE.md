# 🚀 Quick Run Guide - Darkbet with Concordium

## ✅ Server Status

Your Next.js development server is now running!

**Access your app at**: [http://localhost:3000](http://localhost:3000)

---

## 🔧 Important Configuration

### Environment Variables Needed

The app needs a Privy App ID to work properly. Here's how to set it up:

#### 1. Get Your Privy App ID (Free - 2 minutes)

1. Go to [https://dashboard.privy.io](https://dashboard.privy.io)
2. Sign up or log in
3. Click "Create New App"
4. Copy your App ID (looks like: `clpXXXXXXXXXXXXXX`)

#### 2. Update Environment Variables

Create or update `.env.local` file in the root directory:

```env
# Required - Get from Privy Dashboard
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id_here

# Optional - For production
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NODE_ENV=development
```

#### 3. Restart the Server

After adding your Privy App ID:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

---

## 🎯 What You Can Test Now

### ✅ Implemented Features

1. **Concordium Identity Verification**
   - Web3 ID integration (mock for now)
   - Anonymous identity commitments
   - Age & jurisdiction validation

2. **Responsible Gambling System**
   - Daily/weekly/monthly limits
   - Self-exclusion mechanism
   - Real-time bet validation
   - Spending tracking

3. **API Endpoints**
   - `POST /api/rg/link-identity` - Link identity
   - `POST /api/rg/check` - Validate bet
   - `GET /api/rg/status` - Get RG status
   - `POST /api/rg/set-limit` - Set limits
   - `POST /api/rg/self-exclude` - Self-exclude
   - `POST /api/rg/record-bet` - Record bet

4. **UI Components**
   - Concordium verification modal
   - RG limits configuration
   - RG status dashboard
   - Integrated bet flow with RG checks

---

## 📱 Testing the Features

### Step-by-Step Test Flow

1. **Connect Wallet**
   - Go to http://localhost:3000
   - Click "Connect Wallet"
   - Connect with Phantom or other Solana wallet

2. **Try to Place a Bet**
   - Navigate to any prediction market
   - Try to place a bet
   - System will prompt for identity verification

3. **Identity Verification**
   - A modal will appear asking for Concordium verification
   - Click "Verify with Concordium"
   - (Currently uses mock verification - auto-passes)

4. **Check RG Status**
   - After verification, you'll see your RG status
   - View your betting limits
   - Check current spending

5. **Test Bet Validation**
   - Try placing bets of different amounts
   - System validates against your limits
   - See real-time limit checks

6. **Configure Limits**
   - Click "Adjust Limits"
   - Set custom daily/weekly/monthly limits
   - Try placing a bet that exceeds limits

---

## 🛠️ Troubleshooting

### Server Won't Start

```bash
# Make sure dependencies are installed
npm install

# Clear Next.js cache
rm -rf .next

# Restart
npm run dev
```

### Port 3000 Already in Use

```bash
# Kill the process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# Or use a different port
npm run dev -- -p 3001
```

### Privy Connection Issues

1. Make sure `NEXT_PUBLIC_PRIVY_APP_ID` is set in `.env.local`
2. Check that your App ID is correct
3. In Privy dashboard, add `http://localhost:3000` to allowed origins
4. Restart the dev server

---

## 📊 Current Implementation Status

| Feature | Status | Notes |
|---------|--------|-------|
| Concordium Types | ✅ Complete | Full type definitions |
| RG Service Layer | ✅ Complete | In-memory database (mock) |
| API Endpoints | ✅ Complete | All 6 endpoints working |
| Smart Contract | ✅ Complete | Rust contract ready for deployment |
| Frontend Components | ✅ Complete | 3 modals/cards |
| Bet Integration | ✅ Complete | RG checks in bet flow |
| Web3 ID Verification | 🟡 Mock | Ready for production SDK |
| Database | 🟡 In-memory | Ready for PostgreSQL |

**Legend:**
- ✅ Complete - Fully functional
- 🟡 Mock - Working but needs production integration

---

## 🔄 Next Steps for Production

### Phase 1: Production Setup

1. **Concordium Web3 ID**
   - Integrate actual Concordium SDK
   - Connect to ID provider (Notabene, Fractal)
   - Replace mock verification

2. **Database**
   - Set up PostgreSQL or MongoDB
   - Replace in-memory RG database
   - Add user profiles table

3. **Concordium Smart Contract**
   ```bash
   cd concordium-contracts/rg-registry
   cargo concordium build --out rg_registry.wasm.v1
   # Deploy to testnet
   concordium-client module deploy rg_registry.wasm.v1
   ```

4. **Privy Metadata**
   - Get Privy Admin SDK credentials
   - Implement actual metadata updates
   - Sync with Concordium commitments

### Phase 2: Testing

1. Test on Concordium testnet
2. Test with real Solana devnet
3. End-to-end integration tests
4. Security audit

### Phase 3: Mainnet

1. Deploy Concordium contract to mainnet
2. Deploy Solana programs to mainnet
3. Configure production environment variables
4. Launch! 🚀

---

## 📚 Documentation

For detailed information:

- **Full Integration Guide**: `docs/CONCORDIUM_INTEGRATION.md`
- **Implementation Summary**: `docs/CONCORDIUM_IMPLEMENTATION_COMPLETE.md`
- **Smart Contract**: `concordium-contracts/rg-registry/README.md`
- **API Documentation**: In `CONCORDIUM_INTEGRATION.md`

---

## 💡 Tips

1. **Use DevTools Console**: Check browser console for debug info
2. **API Testing**: Use Postman/Insomnia to test API endpoints directly
3. **Check Network Tab**: Monitor API calls and responses
4. **Read Logs**: Server logs show RG validation details

---

## 🎉 You're All Set!

Your Darkbet application with Concordium identity integration and responsible gambling features is running!

**Access it now**: [http://localhost:3000](http://localhost:3000)

If you run into any issues, check the troubleshooting section above or refer to the comprehensive documentation in the `docs/` folder.

Happy betting! 🎲

