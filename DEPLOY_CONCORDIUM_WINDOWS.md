# 🚀 Deploy Concordium Contract on Windows

## Quick Guide: Use WSL for Deployment

Since we're on Windows, using WSL (Windows Subsystem for Linux) is the easiest way to deploy Concordium contracts.

---

## Step 1: Install WSL (5 minutes)

### Open PowerShell as Administrator and run:

```powershell
wsl --install
```

This will:

- Install WSL 2
- Install Ubuntu (default Linux distribution)
- Take about 5-10 minutes

**After installation, restart your computer.**

---

## Step 2: Set Up WSL (After Restart)

1. **Open Ubuntu** from Start Menu
2. **Create a username and password** when prompted
3. **Update packages:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

---

## Step 3: Install Tools in WSL

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
rustup target add wasm32-unknown-unknown

# Install cargo-concordium
cargo install --locked cargo-concordium

# Install concordium-client
wget https://distribution.concordium.software/tools/linux/concordium-client
chmod +x concordium-client
sudo mv concordium-client /usr/local/bin/
```

---

## Step 4: Access Your Project from WSL

Your Windows C: drive is accessible at `/mnt/c/` in WSL:

```bash
cd /mnt/c/darkbet/concordium-contracts/rg-registry
```

---

## Step 5: Deploy the Contract

```bash
# Build the contract
cargo concordium build --out rg_registry.wasm.v1 --schema-embed

# Configure Concordium client for testnet
concordium-client config node add testnet https://grpc.testnet.concordium.com:20000 --secure
concordium-client config node use testnet

# You'll need to import your Concordium account here
# (We'll do this in the next steps)
```

---

## Alternative: Fix Windows Build Tools (If you prefer native Windows)

If you'd rather not use WSL:

1. **Open Visual Studio Installer**
2. **Modify your installation**
3. **Check "Desktop development with C++"**
4. **Install** (takes ~15-20 minutes)
5. **Restart terminal**
6. **Run:** `cargo install --locked cargo-concordium`

---

## Which Method Do You Prefer?

Let me know and I'll guide you through the rest!
