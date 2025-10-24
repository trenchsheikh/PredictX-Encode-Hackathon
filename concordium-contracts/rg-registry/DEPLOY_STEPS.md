# 🎯 Concordium Deployment - Step by Step

## ✅ Pre-Deployment Checklist

Before deploying, you need:

### 1. **Concordium Wallet & Account**

- [ ] Download Concordium Wallet: https://concordium.com/wallet
- [ ] Create account and complete identity verification
- [ ] Export account keys (JSON file)
- [ ] Copy your account address

### 2. **Get Test CCDs (Testnet)**

- [ ] Visit: https://testnet.ccdscan.io/
- [ ] Click "Faucet" button
- [ ] Enter your account address
- [ ] Receive 2000 test CCDs (instant!)

### 3. **WSL Installed**

- [ ] Run in PowerShell (as Admin): `wsl --install`
- [ ] Restart computer
- [ ] Open Ubuntu from Start Menu
- [ ] Create username/password

---

## 🚀 Deployment Steps (After WSL is Ready)

### In WSL Terminal:

```bash
# 1. Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
rustup target add wasm32-unknown-unknown

# 2. Install cargo-concordium (takes 5-10 minutes)
cargo install --locked cargo-concordium

# 3. Install concordium-client
wget https://distribution.concordium.software/tools/linux/concordium-client
chmod +x concordium-client
sudo mv concordium-client /usr/local/bin/

# 4. Navigate to project
cd /mnt/c/darkbet/concordium-contracts/rg-registry

# 5. Build contract
cargo concordium build --out rg_registry.wasm.v1 --schema-embed

# 6. Configure network
concordium-client config node add testnet https://grpc.testnet.concordium.com:20000 --secure
concordium-client config node use testnet

# 7. Import your account (copy the exported JSON to WSL first)
concordium-client config account import my-account.export --name my-account

# 8. Deploy!
./deploy.sh testnet
```

---

## 📝 What You Need to Do NOW:

### **Action 1: Install WSL**

Open PowerShell as Administrator:

```powershell
wsl --install
```

Then restart your computer.

### **Action 2: Set Up Concordium Wallet** (While WSL installs)

1. Download: https://concordium.com/wallet
2. Install the wallet app
3. Create account and identity (takes 5 minutes)
4. Get test CCDs from faucet: https://testnet.ccdscan.io/

### **Action 3: Export Account Keys**

In Concordium Wallet:

1. Go to Settings → Accounts
2. Select your account
3. Click "Export"
4. Save the JSON file (we'll need it)

---

## ⏱️ Time Estimate:

- WSL installation: ~10 minutes + restart
- Wallet setup: ~5 minutes
- Get test CCDs: ~1 minute (instant)
- Deploy contract in WSL: ~15 minutes

**Total: ~30 minutes**

---

## 🆘 Quick Support

**If WSL fails to install:**

- Make sure Windows is up to date
- Enable virtualization in BIOS
- Alternative: Use Docker Desktop

**If wallet setup is unclear:**

- Follow: https://docs.concordium.com/en/mainnet/docs/mobile-wallet/

**If you get stuck:**

- Let me know which step and I'll help!

---

## 📞 Next Steps

Once you've:

1. ✅ Installed WSL and restarted
2. ✅ Set up Concordium Wallet
3. ✅ Got test CCDs

Tell me "WSL is ready" and I'll guide you through the deployment in WSL!
