# 🚀 Quick Start: Deploy in 5 Minutes

Get your Concordium RG Registry contract deployed to testnet in 5 minutes!

---

## ⚡ Prerequisites (2 minutes)

### 1. Install Rust (if not already installed)

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup target add wasm32-unknown-unknown
```

### 2. Install cargo-concordium

```bash
cargo install --locked cargo-concordium
```

### 3. Install Concordium Client

**Windows:**

- Download from: https://developer.concordium.software/en/mainnet/net/installation/downloads-testnet.html
- Extract and add to PATH

**macOS/Linux:**

```bash
wget https://distribution.concordium.software/tools/linux/concordium-client
chmod +x concordium-client
sudo mv concordium-client /usr/local/bin/
```

---

## 🎮 Get Test Funds (1 minute)

1. **Create Concordium Account:**
   - Download Concordium Wallet: https://concordium.com/wallet
   - Create account and identity
   - Copy your account address

2. **Get Test CCDs:**
   - Visit: https://testnet.ccdscan.io/
   - Click "Faucet" → Enter your address
   - Receive 2000 test CCDs instantly

3. **Export Account:**
   - In wallet: Settings → Accounts → Export
   - Save the JSON file as `my-account.export`

---

## 🚀 Deploy (2 minutes)

### Option 1: Automated Deployment (Easiest)

```bash
cd concordium-contracts/rg-registry

# Import your account
concordium-client config account import my-account.export --name my-account

# Deploy (all-in-one script)
chmod +x deploy.sh
./deploy.sh testnet
```

**On Windows:**

```powershell
cd concordium-contracts\rg-registry
concordium-client config account import my-account.export --name my-account
.\deploy.ps1 testnet
```

### Option 2: Manual Steps

```bash
cd concordium-contracts/rg-registry

# 1. Build
cargo concordium build --out rg_registry.wasm.v1 --schema-embed

# 2. Configure network
concordium-client config node add testnet https://grpc.testnet.concordium.com:20000 --secure
concordium-client config node use testnet

# 3. Import account
concordium-client config account import my-account.export --name my-account

# 4. Deploy module
concordium-client module deploy rg_registry.wasm.v1 \
  --sender my-account \
  --grpc-port 20000

# Note the MODULE_REFERENCE from output

# 5. Create init params
echo '{"admin": "YOUR_ACCOUNT_ADDRESS"}' > init_params.json

# 6. Initialize contract
concordium-client contract init MODULE_REFERENCE \
  --contract "darkbet_rg_registry" \
  --sender my-account \
  --energy 10000 \
  --parameter-json init_params.json

# Note the CONTRACT_INDEX from output
```

---

## ✅ Update Your App

After deployment, update `.env.local`:

```env
# Use the contract address from deployment output
CONCORDIUM_RG_CONTRACT_ADDRESS=1234
CONCORDIUM_RG_CONTRACT_INDEX=1234
CONCORDIUM_NETWORK=testnet
CONCORDIUM_NODE_URL=https://grpc.testnet.concordium.com
CONCORDIUM_NODE_PORT=20000
```

Restart your server:

```bash
npm run dev
```

---

## 🧪 Test It Works

```bash
# View contract info
concordium-client contract show CONTRACT_INDEX

# Test registration (from your app)
# - Connect wallet in UI
# - Complete Concordium ID verification
# - Should see "Identity Verified!" message
```

---

## 🎉 That's It!

Your contract is deployed and ready to use!

**Next Steps:**

- Test identity verification in your app
- Try setting betting limits
- Test bet validation
- See full guide: `DEPLOYMENT_GUIDE.md`

---

## 🐛 Common Issues

**"Account not found"**

```bash
# Make sure you imported your account
concordium-client config account import my-account.export --name my-account
```

**"Insufficient balance"**

```bash
# Check balance
concordium-client account show-balance my-account

# Get more test CCDs from faucet
# https://testnet.ccdscan.io/
```

**"Module deployment failed"**

```bash
# Check you're on testnet
concordium-client config node use testnet

# Verify account has funds
concordium-client account show-balance my-account
```

---

## 📚 More Info

- **Full Deployment Guide:** `DEPLOYMENT_GUIDE.md`
- **Contract Documentation:** `README.md`
- **Setup Instructions:** `../../docs/CONCORDIUM_ID_APP_SETUP.md`

---

**Total Time:** ~5 minutes ⏱️  
**Cost:** FREE (testnet CCDs) 💸  
**Difficulty:** Easy 🟢

---

**Ready for mainnet?** See `DEPLOYMENT_GUIDE.md` for production deployment!
