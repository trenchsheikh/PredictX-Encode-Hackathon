# 🚀 Concordium RG Registry Contract Deployment Guide

This guide will help you deploy the Darkbet Responsible Gambling Registry smart contract to the Concordium blockchain.

---

## 📋 Prerequisites

### 1. Install Concordium Tools

**Concordium Client:**

```bash
# Download from: https://developer.concordium.software/en/mainnet/net/installation/downloads-testnet.html

# Windows
# Download concordium-client.exe and add to PATH

# macOS/Linux
wget https://distribution.concordium.software/tools/linux/concordium-client
chmod +x concordium-client
sudo mv concordium-client /usr/local/bin/
```

**cargo-concordium (for building):**

```bash
cargo install --locked cargo-concordium
```

### 2. Install Rust

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Add wasm32 target
rustup target add wasm32-unknown-unknown
```

### 3. Set Up Concordium Wallet

**Option A: Concordium Desktop Wallet**

- Download from: https://concordium.com/wallet
- Create account and identity
- Export account keys

**Option B: Concordium Mobile Wallet**

- Download from App Store/Play Store
- Create account and identity
- Export account keys (Settings → Accounts → Export)

### 4. Get Test Funds (for Testnet)

**Testnet Faucet:**

- Visit: https://testnet.ccdscan.io/
- Click "Faucet" in top menu
- Enter your account address
- Receive 2000 test CCDs

---

## 🔧 Quick Deployment (All-in-One)

For **testnet** deployment:

```bash
cd concordium-contracts/rg-registry
chmod +x deploy.sh
./deploy.sh testnet
```

For **mainnet** deployment:

```bash
cd concordium-contracts/rg-registry
chmod +x deploy.sh
./deploy.sh mainnet
```

**On Windows:**

```powershell
cd concordium-contracts\rg-registry
.\deploy.ps1 testnet
```

---

## 📝 Step-by-Step Deployment

### Step 1: Build the Contract

```bash
cd concordium-contracts/rg-registry

# Build with cargo-concordium
cargo concordium build --out rg_registry.wasm.v1 --schema-embed

# This creates:
# - rg_registry.wasm.v1 (the contract module)
# - Embedded schema for parameter/return types
```

**Expected output:**

```
   Compiling darkbet-rg-registry v0.1.0
    Finished release [optimized] target(s) in 2m 30s
```

### Step 2: Configure Concordium Client

**For Testnet:**

```bash
# Set network
concordium-client config account-name-map add my-account --address YOUR_ADDRESS

# Set node (testnet)
concordium-client config node add testnet https://grpc.testnet.concordium.com:20000 \
  --secure

# Use testnet
concordium-client config node use testnet
```

**For Mainnet:**

```bash
# Set node (mainnet)
concordium-client config node add mainnet https://grpc.mainnet.concordium.software:20000 \
  --secure

# Use mainnet
concordium-client config node use mainnet
```

### Step 3: Import Your Account

**Option A: From JSON file**

```bash
concordium-client config account import my-account.export \
  --name my-account
```

**Option B: From Concordium Wallet**

1. Export account from wallet (JSON file)
2. Import using command above

### Step 4: Check Account Balance

```bash
concordium-client account show-balance my-account
```

**Minimum required:**

- **Testnet:** ~100 CCD (for deployment + initialization)
- **Mainnet:** ~500 CCD (actual costs may vary)

### Step 5: Deploy Module

```bash
# Deploy the compiled module
concordium-client module deploy rg_registry.wasm.v1 \
  --sender my-account \
  --name RGRegistry \
  --grpc-port 20000
```

**Expected output:**

```
Deploying module....
Transaction finalized: tx hash = abc123...
Module successfully deployed with reference: <MODULE_REFERENCE>
```

**Save the MODULE_REFERENCE** - you'll need it for initialization!

### Step 6: Initialize Contract

```bash
# Initialize the contract instance
concordium-client contract init <MODULE_REFERENCE> \
  --contract "darkbet_rg_registry" \
  --sender my-account \
  --energy 10000 \
  --parameter-json init_params.json
```

**Create `init_params.json`:**

```json
{
  "admin": "YOUR_ACCOUNT_ADDRESS"
}
```

**Expected output:**

```
Initializing contract...
Transaction finalized: tx hash = def456...
Contract successfully initialized with address: <CONTRACT_INDEX,SUBINDEX>
```

**Save the CONTRACT_INDEX** - this is your contract address!

### Step 7: Verify Deployment

```bash
# Get contract info
concordium-client contract show <CONTRACT_INDEX>

# Test contract is working
concordium-client contract invoke <CONTRACT_INDEX> \
  --entrypoint "view_admin" \
  --grpc-port 20000
```

---

## 🔑 Update Environment Variables

After successful deployment, update your `.env.local`:

```env
# Contract address (the INDEX from step 6)
CONCORDIUM_RG_CONTRACT_ADDRESS=1234
CONCORDIUM_RG_CONTRACT_INDEX=1234

# Network
CONCORDIUM_NETWORK=testnet  # or mainnet
CONCORDIUM_NODE_URL=https://grpc.testnet.concordium.com
CONCORDIUM_NODE_PORT=20000
```

---

## 🧪 Testing the Deployment

### 1. Test User Registration

```bash
# Register a test user
concordium-client contract update <CONTRACT_INDEX> \
  --entrypoint "register_user" \
  --sender my-account \
  --energy 5000 \
  --parameter-json register_params.json
```

**`register_params.json`:**

```json
{
  "id_commitment": "0000000000000000000000000000000000000000000000000000000000000001",
  "age_verified": true,
  "jurisdiction_allowed": true
}
```

### 2. Test Get User State

```bash
concordium-client contract invoke <CONTRACT_INDEX> \
  --entrypoint "get_user_state" \
  --parameter-json query_params.json
```

**`query_params.json`:**

```json
{
  "id_commitment": "0000000000000000000000000000000000000000000000000000000000000001"
}
```

### 3. Test Bet Validation

```bash
concordium-client contract invoke <CONTRACT_INDEX> \
  --entrypoint "validate_bet" \
  --parameter-json bet_params.json
```

**`bet_params.json`:**

```json
{
  "id_commitment": "0000000000000000000000000000000000000000000000000000000000000001",
  "bet_amount": 1000000
}
```

---

## 🎯 Post-Deployment Checklist

- [ ] Module deployed successfully ✅
- [ ] Contract initialized ✅
- [ ] Contract address saved to `.env.local` ✅
- [ ] Admin can register users ✅
- [ ] Bet validation works ✅
- [ ] Limits can be set ✅
- [ ] Self-exclusion works ✅
- [ ] Events are logged ✅

---

## 📊 Deployment Costs

### Testnet (Free test CCDs)

- Module deployment: ~50-100 test CCD
- Contract init: ~10 test CCD
- Total: ~60-110 test CCD

### Mainnet (Real CCDs)

- Module deployment: ~50-100 CCD (≈ $5-10 USD)
- Contract init: ~10 CCD (≈ $1 USD)
- Total: ~60-110 CCD (≈ $6-11 USD)

_Actual costs depend on contract size and network conditions_

---

## ⚙️ Contract Interaction Examples

### From Backend (Node.js)

```typescript
import { ConcordiumGRPCClient } from '@concordium/node-sdk';

const client = new ConcordiumGRPCClient(
  'grpc.testnet.concordium.com',
  20000,
  {}
);

// Register user
const result = await client.invokeContract({
  contract: { index: BigInt(CONTRACT_INDEX), subindex: BigInt(0) },
  method: 'register_user',
  parameter: Buffer.from(
    JSON.stringify({
      id_commitment: commitment,
      age_verified: true,
      jurisdiction_allowed: true,
    })
  ),
});
```

### From Frontend (Web3)

```typescript
import { detectConcordiumProvider } from '@concordium/browser-wallet-api-helpers';

const provider = await detectConcordiumProvider();
const account = await provider.connect();

// Invoke contract
const result = await provider.sendTransaction(account, {
  type: 'Update',
  payload: {
    address: { index: CONTRACT_INDEX, subindex: 0 },
    receiveName: 'darkbet_rg_registry.register_user',
    message: parameters,
    amount: { microCcd: 0 },
    maxContractExecutionEnergy: { energy: 5000 },
  },
});
```

---

## 🐛 Troubleshooting

### "Module deployment failed"

- **Check balance:** Ensure you have enough CCDs
- **Check network:** Verify you're on the correct network (testnet/mainnet)
- **Check file:** Ensure `rg_registry.wasm.v1` exists

### "Contract initialization failed"

- **Check module reference:** Verify MODULE_REFERENCE is correct
- **Check parameters:** Ensure `init_params.json` is valid JSON
- **Check admin address:** Verify YOUR_ACCOUNT_ADDRESS is correct

### "Invoke failed: Contract not found"

- **Check contract index:** Verify CONTRACT_INDEX is correct
- **Check network:** Ensure you're querying the right network
- **Wait for finalization:** Transaction may still be pending

### "Insufficient balance"

- **Get more CCDs:** Use testnet faucet or purchase mainnet CCDs
- **Reduce energy:** Lower `--energy` parameter (minimum 3000)

---

## 🔄 Upgrade/Migration

To deploy a new version:

1. **Build new version:**

   ```bash
   cargo concordium build --out rg_registry_v2.wasm.v1 --schema-embed
   ```

2. **Deploy new module:**

   ```bash
   concordium-client module deploy rg_registry_v2.wasm.v1 --sender my-account
   ```

3. **Migrate data** (if needed):
   - Create migration contract
   - Export data from old contract
   - Import into new contract

4. **Update environment:**
   ```env
   CONCORDIUM_RG_CONTRACT_ADDRESS=<NEW_INDEX>
   ```

---

## 📚 Resources

- [Concordium Documentation](https://docs.concordium.com)
- [Smart Contract Guide](https://docs.concordium.com/en/mainnet/docs/smart-contracts/)
- [cargo-concordium Docs](https://docs.concordium.com/en/mainnet/docs/smart-contracts/guides/setup-tools.html)
- [Concordium Client Docs](https://docs.concordium.com/en/mainnet/docs/smart-contracts/guides/setup-tools.html#concordium-client)
- [Testnet Explorer](https://testnet.ccdscan.io/)
- [Mainnet Explorer](https://ccdscan.io/)

---

## 🆘 Need Help?

- **Discord:** https://discord.gg/concordium
- **Telegram:** https://t.me/concordium_official
- **Forum:** https://support.concordium.software/

---

**Status:** Ready to Deploy! 🚀

**Next Steps:**

1. Build the contract (`cargo concordium build`)
2. Deploy to testnet (`./deploy.sh testnet`)
3. Test functionality
4. Deploy to mainnet when ready

---

**Last Updated:** October 24, 2025
