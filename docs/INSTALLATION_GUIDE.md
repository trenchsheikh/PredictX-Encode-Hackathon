# Solana & Anchor Installation Guide (Windows)

**Platform:** Windows 10/11  
**Prerequisites:** ✅ Rust 1.90.0, ✅ Node.js v22.19.0, ✅ VS Build Tools

---

## 📋 Current Status

✅ **Rust** - Installed (v1.90.0)  
✅ **Node.js** - Installed (v22.19.0)  
✅ **VS Build Tools** - Installed (MSVC linker available)  
✅ **Project Structure** - Created  
✅ **Smart Contract** - Written (450+ lines)  
✅ **Frontend** - Updated for Solana + Privy  
⏳ **Solana CLI** - Pending installation  
⏳ **Anchor CLI** - Pending installation

---

## 🎯 Installation Steps

### Method 1: Manual Download (Recommended for Windows)

#### Step 1: Install Solana CLI

**Option A: Direct Installer (Easiest)**

1. Download the installer from your browser:
   ```
   https://github.com/solana-labs/solana/releases/download/v1.18.26/solana-install-init-x86_64-pc-windows-msvc.exe
   ```

2. Run the installer:
   - Double-click the downloaded file
   - Follow installation prompts
   - Choose default installation directory

3. Add to PATH (PowerShell):
   ```powershell
   $env:Path += ";$env:USERPROFILE\.local\share\solana\install\active_release\bin"
   
   # Make it permanent
   [Environment]::SetEnvironmentVariable(
     "Path",
     [Environment]::GetEnvironmentVariable("Path", "User") + ";$env:USERPROFILE\.local\share\solana\install\active_release\bin",
     "User"
   )
   ```

4. Verify installation:
   ```powershell
   # Restart terminal or refresh PATH
   $env:Path = [System.Environment]::GetEnvironmentVariable("Path","User")
   
   # Check version
   solana --version
   # Expected: solana-cli 1.18.26
   ```

**Option B: Using Scoop (Alternative)**

```powershell
# Install Scoop if you don't have it
irm get.scoop.sh | iex

# Install Solana
scoop install solana
```

---

#### Step 2: Install Anchor CLI

**Prerequisites Check:**
```powershell
# Ensure Rust is available
rustc --version
cargo --version

# Ensure MSVC linker is available
where link.exe
# Should show: C:\Program Files\Microsoft Visual Studio\...\link.exe
```

**Install Anchor Version Manager (AVM):**

```powershell
# Option 1: Using cargo (after ensuring MSVC is in PATH)
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force

# Option 2: If above fails, try with specific features
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force --no-default-features
```

**Install Anchor:**
```powershell
# Install latest version
avm install latest

# Use latest version
avm use latest

# Verify
anchor --version
# Expected: anchor-cli 0.29.0
```

---

### Method 2: Using WSL (Windows Subsystem for Linux)

If you encounter issues with Windows installation:

```powershell
# Install WSL
wsl --install

# Restart computer

# After restart, open WSL terminal
wsl

# Inside WSL, run:
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
cargo install --git https://github.com/coral-xyz/anchor avm --locked
avm install latest
avm use latest
```

---

## 🔧 Configuration

### Step 3: Configure Solana for Devnet

```powershell
# Set devnet cluster
solana config set --url https://api.devnet.solana.com

# Generate keypair (if you don't have one)
solana-keygen new --outfile ~/.config/solana/devnet.json

# Set as default keypair
solana config set --keypair ~/.config/solana/devnet.json

# Check configuration
solana config get

# Expected output:
# Config File: C:\Users\YourName\.config\solana\cli\config.yml
# RPC URL: https://api.devnet.solana.com
# WebSocket URL: wss://api.devnet.solana.com/
# Keypair Path: C:\Users\YourName\.config\solana\devnet.json
# Commitment: confirmed
```

### Step 4: Fund Devnet Wallet

```powershell
# Airdrop 2 SOL (can be done multiple times)
solana airdrop 2

# Check balance
solana balance
# Expected: 2 SOL

# If airdrop fails (rate limited), try:
solana airdrop 1
# Wait a minute, then:
solana airdrop 1
```

Alternative: Use [Solana Faucet](https://faucet.solana.com/)

---

## 🏗️ Build & Deploy

### Step 5: Build Solana Programs

```powershell
# Navigate to solana-programs directory
cd c:\darkbet\solana-programs

# Build all programs
anchor build

# Expected output:
# Compiling darkbet-prediction-market v0.1.0
# ...
# Finished release [optimized] target(s) in XXs
```

**If build succeeds:**
- ✅ Programs compiled successfully
- ✅ IDL files generated in `target/idl/`
- ✅ Type definitions in `target/types/`

**Common Issues:**

| Error | Solution |
|-------|----------|
| `link.exe not found` | Restart terminal or add VS Build Tools to PATH |
| `overflow` errors | Check Rust code for arithmetic operations |
| `anchor not found` | Ensure AVM installed and PATH updated |

---

### Step 6: Deploy to Devnet

```powershell
# Deploy all programs
anchor deploy --provider.cluster devnet

# Expected output:
# Deploying cluster: https://api.devnet.solana.com
# Upgrade authority: <your-pubkey>
# Deploying program "darkbet_prediction_market"
# Program Id: <program-id>
```

**Save the Program ID!** You'll need it for frontend configuration.

---

### Step 7: Update Frontend Configuration

Create/update `.env.local`:

```env
# Privy (get from dashboard.privy.io)
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id

# Solana
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com

# Program ID (from deployment output)
NEXT_PUBLIC_PROGRAM_ID=<your-program-id>
```

---

### Step 8: Install Frontend Dependencies

```powershell
# In project root
cd c:\darkbet

# Install dependencies
npm install

# Install Solana packages
npm install @solana/web3.js @coral-xyz/anchor
```

---

### Step 9: Run Tests

```powershell
# In solana-programs directory
cd c:\darkbet\solana-programs

# Run tests
anchor test

# Expected: Tests pass
```

---

### Step 10: Start Frontend

```powershell
# In project root
cd c:\darkbet

# Start development server
npm run dev

# Open browser: http://localhost:3000
```

---

## ✅ Verification Checklist

After installation:

- [ ] `solana --version` shows v1.18.26+
- [ ] `anchor --version` shows v0.29.0
- [ ] `solana config get` shows devnet URL
- [ ] `solana balance` shows > 0 SOL
- [ ] `anchor build` completes without errors
- [ ] `anchor deploy --provider.cluster devnet` succeeds
- [ ] Program ID saved to `.env.local`
- [ ] `npm run dev` starts frontend
- [ ] Can connect Phantom wallet on localhost:3000

---

## 🐛 Troubleshooting

### Issue: Solana CLI not found after installation

**Solution:**
```powershell
# Refresh PATH
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","User") + ";" + [System.Environment]::GetEnvironmentVariable("Path","Machine")

# Or restart terminal
```

---

### Issue: Anchor installation fails (MSVC linker)

**Solution:**
```powershell
# Ensure VS Build Tools in PATH
$env:Path += ";C:\Program Files\Microsoft Visual Studio\2022\BuildTools\VC\Tools\MSVC\14.XX.XXXXX\bin\Hostx64\x64"

# Then retry
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
```

---

### Issue: Airdrop fails (rate limited)

**Solution:**
- Wait 5-10 minutes between airdrops
- Use [Solana Faucet](https://faucet.solana.com/)
- Request smaller amounts (1 SOL instead of 2)

---

### Issue: Anchor build fails with "overflow"

**Solution:**
Check `lib.rs` for checked arithmetic:
```rust
// Bad
let result = a + b;

// Good
let result = a.checked_add(b).ok_or(ErrorCode::MathOverflow)?;
```

---

### Issue: Can't connect Phantom wallet

**Solution:**
1. Install Phantom extension: [phantom.app](https://phantom.app)
2. Switch Phantom to Devnet:
   - Settings → Developer Settings → Testnet Mode → Devnet
3. Refresh page and reconnect

---

## 📚 Useful Commands

### Solana CLI

```powershell
# Check version
solana --version

# Get config
solana config get

# Set cluster
solana config set --url <devnet|testnet|mainnet-beta>

# Get balance
solana balance

# Airdrop SOL
solana airdrop 2

# Get account info
solana account <pubkey>

# View logs
solana logs

# Get program info
solana program show <program-id>
```

### Anchor CLI

```powershell
# Create new project
anchor init <project-name>

# Build programs
anchor build

# Run tests
anchor test

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Deploy to mainnet
anchor deploy --provider.cluster mainnet

# Clean build artifacts
anchor clean

# Generate IDL
anchor idl init <program-id> --filepath target/idl/darkbet_prediction_market.json
```

---

## 🎓 Next Steps After Installation

1. **Test the Stack**
   ```powershell
   cd c:\darkbet\solana-programs
   anchor test --skip-deploy
   ```

2. **Configure Privy**
   - Go to [dashboard.privy.io](https://dashboard.privy.io)
   - Create app → Enable Solana → Copy App ID
   - Add to `.env.local`

3. **Deploy to Devnet**
   ```powershell
   anchor deploy --provider.cluster devnet
   ```

4. **Test Frontend**
   ```powershell
   cd c:\darkbet
   npm run dev
   # Test wallet connection
   ```

5. **View on Explorer**
   - Program: `https://explorer.solana.com/address/<program-id>?cluster=devnet`
   - Transactions: Click any transaction to verify

---

## 📖 Additional Resources

- **Solana Docs:** https://docs.solana.com
- **Anchor Book:** https://book.anchor-lang.com
- **Solana Cookbook:** https://solanacookbook.com
- **Solana Stack Exchange:** https://solana.stackexchange.com

---

**Ready to build on Solana! 🚀**

