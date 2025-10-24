# Darkbet Solana Programs

Solana smart contracts for the Darkbet prediction market platform, built with the Anchor framework.

## 📁 Project Structure

```
solana-programs/
├── programs/
│   └── darkbet-prediction-market/    # Core prediction market program
│       ├── src/
│       │   └── lib.rs                # Main program logic
│       └── Cargo.toml
├── tests/
│   └── prediction-market.ts          # TypeScript tests
├── migrations/                        # Deployment scripts
├── target/                            # Build artifacts
│   ├── idl/                          # Interface Definition Language files
│   └── types/                        # TypeScript type definitions
├── Anchor.toml                        # Anchor configuration
├── tsconfig.json                      # TypeScript configuration
└── package.json                       # Node.js dependencies

## 🚀 Current Implementation Status

### ✅ Completed (Phase 1 - Initial Setup)

- [x] Project structure created
- [x] Anchor configuration set up
- [x] PredictionMarket program initialized
- [x] Core account structures defined:
  - `Market` - Main market state
  - `UserPosition` - Individual user bet positions
- [x] Initial instructions implemented:
  - `initialize_market()` - Create new prediction markets
  - `commit_bet()` - Commit-reveal phase 1 (hide bet direction)
  - `reveal_bet()` - Commit-reveal phase 2 (reveal actual bet)
  - `lock_market()` - Lock market before resolution
- [x] Event emissions for transparency
- [x] Error handling with custom error codes
- [x] Test framework configured

### 📝 Next Steps (Phase 1 - Remaining)

1. **Install Full Solana Toolchain**
   - Install Solana CLI (pending network issues)
   - Install Anchor CLI via AVM
   - Generate devnet keypairs

2. **Build & Test**
   - Compile Rust programs: `anchor build`
   - Run tests: `anchor test`
   - Fix any compilation issues

3. **Deploy to Devnet**
   - Deploy programs: `anchor deploy --provider.cluster devnet`
   - Update program IDs in code
   - Test on devnet with real transactions

## 🛠️ Development Commands

### Prerequisites

**Required:**
- Rust 1.70+ (`rustup`)
- Solana CLI 1.17+ 
- Anchor CLI 0.29+
- Node.js 18+

**Installation (Windows):**
```powershell
# Rust (already installed ✅)
# Install from: https://rustup.rs

# Solana CLI (pending)
# Download from: https://docs.solana.com/cli/install-solana-cli-tools

# Anchor CLI (pending)
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest
```

### Build

```bash
# Build all programs
anchor build

# Build specific program
anchor build -p darkbet-prediction-market
```

### Test

```bash
# Run all tests
anchor test

# Run specific test file
npm test tests/prediction-market.ts
```

### Deploy

```bash
# Deploy to devnet
anchor deploy --provider.cluster devnet

# Deploy to mainnet (when ready)
anchor deploy --provider.cluster mainnet
```

## 📖 Program Details

### PredictionMarket Program

**Purpose:** Core betting logic with commit-reveal scheme to prevent front-running.

**Key Features:**
- ✅ Commit-reveal scheme (two-phase betting)
- ✅ Time-locked markets (lock 5 minutes before resolution)
- ✅ Configurable stake limits (min 0.01 SOL, max 100 SOL)
- ✅ Multiple asset types (BTC, ETH, SOL, BNB)
- ✅ Event emissions for off-chain indexing
- ⏳ Pyth Network integration (coming next)
- ⏳ Market resolution logic (coming next)
- ⏳ Payout calculation (coming next)

**Account Structure:**

1. **Market Account**
   - PDA: `["market", market_id]`
   - Stores: market metadata, stakes, status, resolution data

2. **UserPosition Account**
   - PDA: `["position", user_pubkey, market_pubkey]`
   - Stores: user's bet commitment, direction, stake amount

**Instructions:**

| Instruction | Parameters | Description |
|-------------|-----------|-------------|
| `initialize_market` | market_id, asset_type, resolution_time, pyth_feed, threshold | Create new market |
| `commit_bet` | stake_amount, commitment_hash | Commit a bet (phase 1) |
| `reveal_bet` | direction, nonce | Reveal bet direction (phase 2) |
| `lock_market` | - | Lock market for resolution |

**State Flow:**

```
Open → [commit bets] → Locked → [reveal bets] → Resolved → [claim winnings]
```

## 🧪 Testing

### Test Structure

```typescript
// tests/prediction-market.ts

describe("darkbet-prediction-market", () => {
  it("Initializes a prediction market", async () => {
    // 1. Create market PDA
    // 2. Call initialize_market instruction
    // 3. Verify market state
  });

  it("Commits a bet", async () => {
    // 1. Generate commitment hash
    // 2. Call commit_bet instruction
    // 3. Verify position created
  });

  it("Reveals a bet", async () => {
    // 1. Call reveal_bet with nonce
    // 2. Verify hash matches
    // 3. Verify stake added to correct side
  });
});
```

### Running Tests

Once Solana CLI is installed:

```bash
# Start local validator
solana-test-validator

# Run tests (in another terminal)
anchor test --skip-local-validator
```

## 🔧 Configuration

### Anchor.toml

```toml
[programs.devnet]
darkbet_prediction_market = "11111111111111111111111111111111"  # Will be updated after deployment
```

### RPC Endpoints

- **Devnet:** https://api.devnet.solana.com
- **Mainnet:** (to be configured with Helius/QuickNode)

## 📊 Current Status

**Phase 1: Foundation** (Week 1 of 24)

```
[████░░░░░░░░░░░░░░░░] 20% Complete

✅ Project structure created
✅ Core program logic implemented
✅ Test framework configured
⏳ Solana CLI installation (blocked by network issues)
⏳ Build & compile programs
⏳ Deploy to devnet
```

## 🐛 Known Issues

1. **Solana CLI Installation**: Network connection issues preventing HTTPS downloads
   - **Workaround**: Manual download or use WSL/Linux
   - **Status**: Investigating alternative installation methods

2. **Visual Studio Build Tools**: Required for Rust compilation on Windows
   - **Status**: ✅ Installed

3. **Program ID Placeholder**: Using default `11111111111111111111111111111111`
   - **Fix**: Will update after first deployment

## 📚 Resources

- [Anchor Documentation](https://book.anchor-lang.com)
- [Solana Documentation](https://docs.solana.com)
- [Full Technical Design](../docs/SOLANA_REFACTOR_DESIGN.md)
- [Implementation Checklist](../docs/IMPLEMENTATION_CHECKLIST.md)

## 🚨 Next Actions

1. **Complete Solana CLI installation** (manual download if needed)
2. **Install Anchor CLI** via AVM
3. **Build programs**: `anchor build`
4. **Fix compilation errors** (if any)
5. **Deploy to devnet**: `anchor deploy --provider.cluster devnet`
6. **Update program IDs** in code
7. **Run tests** to verify functionality

---

**Last Updated:** October 24, 2025  
**Version:** 0.1.0  
**Status:** Development


