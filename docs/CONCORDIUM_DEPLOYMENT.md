# Concordium Deployment Guide

> **Deploy the PredictX Responsible Gambling Registry smart contract to Concordium testnet or mainnet**

This guide walks through deploying the RG Registry contract, testing it, and connecting your frontend to the deployed contract.

---

## 📋 Prerequisites

### Install Concordium Tools

#### 1. Install Rust and Cargo

```bash
# Install Rust (if not already installed)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Add wasm32 target for Concordium
rustup target add wasm32-unknown-unknown
```

#### 2. Install cargo-concordium

```bash
cargo install --locked cargo-concordium
```

Verify installation:

```bash
cargo concordium --version
# Should output: cargo-concordium 3.x.x
```

#### 3. Install Concordium Client

**macOS:**
```bash
brew install concordium-software/concordium/concordium-client
```

**Linux:**
```bash
wget https://distribution.concordium.software/tools/linux/concordium-client_5.1.1-0
chmod +x concordium-client_5.1.1-0
sudo mv concordium-client_5.1.1-0 /usr/local/bin/concordium-client
```

**Windows:**
Download from [Concordium Downloads](https://developer.concordium.software/en/mainnet/net/installation/downloads.html)

Verify:
```bash
concordium-client --version
```

---

## 🔑 Setup Concordium Account

### 1. Get Concordium Wallet

Download and install:
- **Desktop**: [Concordium Desktop Wallet](https://developer.concordium.software/en/mainnet/net/desktop-wallet/overview.html)
- **Mobile**: Concordium Mobile Wallet (iOS/Android)
- **Browser**: Concordium Browser Wallet Extension

### 2. Create Account

1. Open wallet and create new account
2. **Save your seed phrase** (you'll need this)
3. Switch to testnet in wallet settings
4. Note your account address (format: `4Ec3LXL...`)

### 3. Export Account Keys

In Concordium Desktop Wallet:
1. Go to "Accounts"
2. Select your account
3. Click "Export" → "Export private keys"
4. Save to `~/concordium-keys/account.json`

### 4. Configure concordium-client

```bash
# Import account
concordium-client config account import ~/concordium-keys/account.json \
    --name my-account

# Set default account
concordium-client config account set-default my-account

# Connect to testnet
concordium-client config node set https://grpc.testnet.concordium.com:20000
```

Verify connection:
```bash
concordium-client account show my-account
```

---

## 💰 Get Testnet CCD

### Option 1: Testnet Faucet (Recommended)

1. Visit: https://faucet.testnet.concordium.com
2. Enter your account address
3. Click "Get CCD"
4. Wait 1-2 minutes

### Option 2: Request from Concordium Discord

1. Join [Concordium Discord](https://discord.gg/concordium)
2. Go to #testnet-faucet channel
3. Post your account address
4. Wait for bot to send CCD

### Verify Balance

```bash
concordium-client account show my-account
```

You should see at least 100 CCD for deployment and testing.

---

## 🏗️ Build Smart Contract

### 1. Navigate to Contract Directory

```bash
cd PredictX-Encode-Hackathon/concordium-contracts/rg-registry
```

### 2. Build Contract

```bash
cargo concordium build --out rg_registry.wasm.v1 --schema-embed
```

This creates:
- `rg_registry.wasm.v1` - The compiled smart contract
- Embedded schema for parameter serialization

### 3. Test Contract (Optional but Recommended)

```bash
cargo test
```

All tests should pass.

---

## 🚀 Deploy to Testnet

### Step 1: Deploy Module

The module contains the contract code.

```bash
concordium-client module deploy \
    rg_registry.wasm.v1 \
    --sender my-account \
    --grpc-ip grpc.testnet.concordium.com \
    --grpc-port 20000
```

**Expected output:**
```
Module deployed successfully.
Module reference: a1b2c3d4e5f6...
Transaction hash: tx_hash...
```

**Save the Module Reference!** You'll need it next.

**Cost:** ~5-10 CCD

### Step 2: Initialize Contract

Now create an instance of the contract.

```bash
# Create init parameters file
cat > init_params.json << EOF
{
  "owner": "YOUR_ACCOUNT_ADDRESS",
  "minimum_age": 18
}
EOF

# Initialize contract
concordium-client contract init \
    MODULE_REFERENCE \
    --contract rg_registry \
    --parameter-json init_params.json \
    --sender my-account \
    --energy 10000 \
    --grpc-ip grpc.testnet.concordium.com \
    --grpc-port 20000
```

Replace:
- `MODULE_REFERENCE` with the module reference from Step 1
- `YOUR_ACCOUNT_ADDRESS` with your account address (from wallet)

**Expected output:**
```
Contract initialized successfully.
Contract instance: <7890,0>
Transaction hash: tx_hash...
```

**Save the Contract Instance!** Format: `<index, subindex>`

**Cost:** ~1-2 CCD

---

## 🧪 Test Deployed Contract

### Test 1: Register User

```bash
# Create test user commitment (64 bytes hex)
TEST_COMMITMENT="0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f40"

# Create register parameters
cat > register_params.json << EOF
{
  "id_commitment": "$TEST_COMMITMENT",
  "age_verified": true,
  "jurisdiction_allowed": true
}
EOF

# Invoke register_user
concordium-client contract update \
    7890 \
    --entrypoint register_user \
    --parameter-json register_params.json \
    --sender my-account \
    --energy 5000 \
    --grpc-ip grpc.testnet.concordium.com \
    --grpc-port 20000
```

Replace `7890` with your contract index.

**Expected:** Success message

**Cost:** ~0.5 CCD

### Test 2: Query User State

```bash
# Create query parameters
cat > query_params.json << EOF
"$TEST_COMMITMENT"
EOF

# Query user state (no cost, read-only)
concordium-client contract invoke \
    7890 \
    --entrypoint get_user_state \
    --parameter-json query_params.json \
    --grpc-ip grpc.testnet.concordium.com \
    --grpc-port 20000
```

**Expected:** User state JSON with limits and spending

**Cost:** Free (read-only)

### Test 3: Validate Bet

```bash
# Create validation parameters
cat > validate_params.json << EOF
{
  "id_commitment": "$TEST_COMMITMENT",
  "bet_amount": { "micro_ccd": 50000000 }
}
EOF

# Validate bet (read-only)
concordium-client contract invoke \
    7890 \
    --entrypoint validate_bet \
    --parameter-json validate_params.json \
    --grpc-ip grpc.testnet.concordium.com \
    --grpc-port 20000
```

**Expected:** `{ "allowed": true, "reason": null }`

**Cost:** Free (read-only)

---

## 🌐 Connect Frontend to Deployed Contract

### 1. Update Environment Variables

Create or update `.env.local`:

```bash
# Concordium Configuration
NEXT_PUBLIC_CONCORDIUM_NETWORK=testnet
NEXT_PUBLIC_CONCORDIUM_NODE_URL=https://grpc.testnet.concordium.com:20000
NEXT_PUBLIC_CONCORDIUM_EXPLORER=https://testnet.ccdscan.io

# RG Registry Contract
NEXT_PUBLIC_RG_CONTRACT_INDEX=7890
NEXT_PUBLIC_RG_CONTRACT_SUBINDEX=0
NEXT_PUBLIC_RG_CONTRACT_ADDRESS=<7890,0>

# Optional: euroe Contract (if deploying separately)
NEXT_PUBLIC_EUROE_CONTRACT_INDEX=TBD
NEXT_PUBLIC_EUROE_CONTRACT_SUBINDEX=0
```

Replace `7890` with your actual contract index.

### 2. Restart Development Server

```bash
npm run dev
```

### 3. Test Frontend Connection

1. Open http://localhost:3000
2. Connect wallet
3. Try to place a bet
4. Check that RG validation works

---

## 🔍 Verify Deployment

### Check on Block Explorer

Visit: https://testnet.ccdscan.io

1. Search for your contract address: `<7890,0>`
2. View transactions
3. Check contract state
4. See events emitted

### Check Contract State

```bash
# Get full contract info
concordium-client contract show 7890 \
    --grpc-ip grpc.testnet.concordium.com \
    --grpc-port 20000
```

---

## 🎯 Mainnet Deployment

**⚠️ IMPORTANT: Only deploy to mainnet after thorough testing!**

### Differences from Testnet

1. **Cost**: Transactions cost real money (CCD/EUR)
2. **Permanence**: Cannot easily undo mistakes
3. **Security**: Contract bugs can't be easily fixed
4. **Auditing**: Get contract audited first

### Mainnet Deployment Steps

Same as testnet, but:

```bash
# Use mainnet node
--grpc-ip grpc.mainnet.concordium.com
--grpc-port 20000

# Update env vars
NEXT_PUBLIC_CONCORDIUM_NETWORK=mainnet
NEXT_PUBLIC_CONCORDIUM_NODE_URL=https://grpc.mainnet.concordium.com:20000
```

### Pre-Mainnet Checklist

- [ ] Contract thoroughly tested on testnet
- [ ] Security audit completed
- [ ] Documentation finalized
- [ ] Error handling robust
- [ ] Monitoring set up
- [ ] Emergency pause mechanism tested
- [ ] Legal review completed
- [ ] Sufficient CCD for deployment (~50-100 CCD)

---

## 📊 Monitoring Deployed Contract

### Option 1: Concordium Explorer

https://testnet.ccdscan.io (or mainnet.ccdscan.io)

- View all transactions
- See contract events
- Monitor gas usage
- Track user activity

### Option 2: Custom Monitoring

```typescript
// lib/concordium-monitoring.ts

import { ConcordiumGRPCClient, ContractAddress } from '@concordium/web-sdk';

const client = new ConcordiumGRPCClient(
  process.env.NEXT_PUBLIC_CONCORDIUM_NODE_URL,
  { timeout: 15000 }
);

export async function monitorContract() {
  const contractAddress = ContractAddress.create(
    Number(process.env.NEXT_PUBLIC_RG_CONTRACT_INDEX),
    Number(process.env.NEXT_PUBLIC_RG_CONTRACT_SUBINDEX)
  );

  // Get contract info
  const info = await client.getInstanceInfo(contractAddress);
  console.log('Contract name:', info.name);
  console.log('Contract owner:', info.owner);
  console.log('Contract amount:', info.amount);

  // Listen for events
  const stream = client.getFinalizedBlocks();
  for await (const block of stream) {
    console.log('New block:', block.blockHash);
    // Process block transactions
  }
}
```

---

## 🔧 Update Contract

### Option 1: Deploy New Version

1. Make changes to contract code
2. Deploy as new module + instance
3. Migrate users to new contract
4. Update frontend to new contract address

### Option 2: Upgradeable Contract Pattern

```rust
// Add upgrade function to contract
#[receive(
    contract = "rg_registry",
    name = "upgrade",
    parameter = "ModuleReference",
    mutable
)]
fn upgrade<S: HasStateApi>(
    ctx: &impl HasReceiveContext,
    host: &mut impl HasHost<State<S>, StateApiType = S>,
) -> Result<(), Error> {
    // Only owner can upgrade
    ensure!(ctx.sender() == host.state().owner, Error::Unauthorized);

    let new_module: ModuleReference = ctx.parameter_cursor().get()?;
    
    // Upgrade to new module
    host.upgrade(new_module)?;
    
    Ok(())
}
```

---

## 🚨 Troubleshooting

### Error: "Insufficient funds"

**Solution:** Get more CCD from faucet or buy on exchange

### Error: "Out of energy"

**Solution:** Increase `--energy` parameter (try 20000)

### Error: "Module not found"

**Solution:** Verify module reference is correct, re-deploy if needed

### Error: "Parse error"

**Solution:** Check parameter JSON format matches schema exactly

### Error: "Connection refused"

**Solution:** Check node URL and firewall settings

### Contract Shows Wrong State

**Solution:** 
1. Check you're querying correct contract instance
2. Verify transaction was finalized (wait 1-2 minutes)
3. Use `contract show` to inspect state

---

## 📝 Deployment Checklist

### Pre-Deployment

- [ ] Contract code reviewed and tested
- [ ] All unit tests passing
- [ ] Integration tests completed
- [ ] Concordium tools installed
- [ ] Testnet account created
- [ ] Testnet CCD acquired (100+)
- [ ] Contract built successfully

### Deployment

- [ ] Module deployed to testnet
- [ ] Module reference saved
- [ ] Contract initialized
- [ ] Contract instance saved
- [ ] Test transactions executed
- [ ] Contract state verified

### Post-Deployment

- [ ] Environment variables updated
- [ ] Frontend connected to contract
- [ ] End-to-end testing completed
- [ ] Monitoring set up
- [ ] Documentation updated with contract address
- [ ] Contract address shared with team

### For Production/Mainnet

- [ ] Security audit completed
- [ ] Legal review done
- [ ] Mainnet CCD acquired
- [ ] Backup/recovery plan in place
- [ ] Emergency contacts identified
- [ ] Deployment announcement prepared

---

## 📚 Additional Resources

### Official Documentation

- [Concordium Smart Contracts Guide](https://developer.concordium.software/en/mainnet/smart-contracts/guides/index.html)
- [cargo-concordium Documentation](https://developer.concordium.software/en/mainnet/smart-contracts/guides/build-schema.html)
- [concordium-client Manual](https://developer.concordium.software/en/mainnet/net/references/concordium-client.html)

### Community

- [Concordium Discord](https://discord.gg/concordium) - Get help
- [Concordium GitHub](https://github.com/Concordium) - Examples
- [Concordium Developer Portal](https://developer.concordium.software) - Tutorials

### Block Explorers

- **Testnet**: https://testnet.ccdscan.io
- **Mainnet**: https://ccdscan.io

---

## 🆘 Need Help?

### GitHub Issues

[Open an issue](https://github.com/trenchsheikh/PredictX-Encode-Hackathon/issues) with:
- Your deployment command
- Full error message
- Your concordium-client version
- Network (testnet/mainnet)

### Concordium Support

Join #smart-contracts channel on [Concordium Discord](https://discord.gg/concordium)

---

**Ready to deploy?** Follow this guide step by step and you'll have your contract live in 30 minutes! 🚀

