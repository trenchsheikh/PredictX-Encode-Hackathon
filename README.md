# PredictX - Cross-Platform Responsible Gambling Registry

> **Built for Encode Hackathon 2025** | Track: **Responsible Gambling with Concordium**

A privacy-preserving responsible gambling platform that prevents addiction **across multiple gambling operators** using Concordium's identity verification and protocol-level stablecoin payments.

[![Smart Contract](https://img.shields.io/badge/Smart%20Contract-Concordium-blue)](./concordium-contracts/rg-registry/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Rust](https://img.shields.io/badge/Rust-1.70+-orange.svg)](https://www.rust-lang.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

---

## 🏆 Encode Hackathon: Responsible Gambling Track

### The Problem

Online gambling platforms struggle with addiction prevention because safeguards are **fragmented and reactive**:

- ❌ User sets €100/day limit on **Casino A**
- ❌ User loses €100, then moves to **Casino B** (no limits apply)
- ❌ User loses another €100 on **Casino B**
- ❌ **Result: €200 lost in one day, not €100**

**Current solutions fail because they're operator-specific, not user-centric.**

### Our Solution: PredictX

PredictX provides a **cross-platform responsible gambling registry** powered by Concordium blockchain that:

✅ **Works across ALL gambling platforms** (casinos, sportsbooks, prediction markets)  
✅ **Preserves user privacy** with zero-knowledge proofs  
✅ **Cannot be bypassed** (blockchain-enforced limits)  
✅ **Easy to integrate** (REST API for operators)

---

## 🎯 Hackathon Requirements (All Completed)

### ✅ 1. Identity-Verified Access

**Use Concordium's on-chain identity layer to ensure every gambler is verified and unique.**

- **Web3 ID Integration**: Every user verified with Concordium's identity layer
- **Privacy-Preserving Attributes**: Age verification without exposing full identity
- **Zero-Knowledge Proofs**: Prove "age ≥ 18" without revealing exact age
- **Anonymous Commitments**: Blake2b hashing creates unique identity commitment
- **One Identity, All Platforms**: Same identity works across every gambling site

📁 **Implementation**: 
- [`lib/concordium-service.ts`](./lib/concordium-service.ts) - Web3 ID verification
- [`concordium-contracts/rg-registry/src/lib.rs`](./concordium-contracts/rg-registry/src/lib.rs) - Lines 184-260

### ✅ 2. Addiction Prevention Mechanisms

**Implement safeguards that work across platforms, not just a single operator.**

- **Spending Limits**: Daily/weekly/monthly limits tied to verified identity
- **Cool-Down Periods**: Enforce waiting time between bets (configurable per user)
- **Self-Exclusion Registry**: Users can ban themselves across ALL platforms
- **Cross-Platform Enforcement**: Limits apply to Casino A, Casino B, Casino C, everywhere
- **Time-Windowed Tracking**: Automatic resets (daily at midnight, weekly on Monday, etc.)

📁 **Implementation**:
- [`concordium-contracts/rg-registry/src/lib.rs`](./concordium-contracts/rg-registry/src/lib.rs) - Lines 262-480
- [`app/api/rg/check/route.ts`](./app/api/rg/check/route.ts) - Pre-bet validation

**Key Innovation**: Because identity commitments are operator-independent, a user who self-excludes on Platform A is **automatically excluded on Platform B** — no coordination needed!

### ✅ 3. Secure & Transparent Payments

**Integrate Concordium's protocol-level stablecoin payments with real-time tracking.**

- **euroe Integration**: Protocol-level EUR-backed stablecoin (regulated, compliant)
- **Real-Time Validation**: Bets validated against limits BEFORE payment processes
- **Automatic Blocking**: Transactions rejected if thresholds exceeded
- **Transparent Audit Trail**: All events logged on-chain (anonymous but auditable)
- **Regulator-Friendly**: Aggregated statistics available without compromising privacy

📁 **Implementation**:
- [`lib/concordium-payments.ts`](./lib/concordium-payments.ts) - euroe payment integration
- [`concordium-contracts/rg-registry/src/lib.rs`](./concordium-contracts/rg-registry/src/lib.rs) - Lines 214-221 (CCD/euroe limits)

### ✅ 4. Operator Integration

**Design tool that gambling platforms can easily integrate with cross-platform compatibility.**

- **REST API**: 6 endpoints for complete RG functionality
- **Drop-In Solution**: Integrate in hours, not months
- **Platform-Agnostic**: Works with casinos, sportsbooks, prediction markets, any gambling platform
- **Minimal Changes**: Operators add 2-3 API calls to existing bet flow
- **Reference Implementation**: Full demo site showing integration

📁 **Implementation**:
- [`app/api/rg/`](./app/api/rg/) - Complete API suite
- [`docs/OPERATOR_INTEGRATION_GUIDE.md`](./docs/OPERATOR_INTEGRATION_GUIDE.md) - Integration tutorial
- [`components/rg/`](./components/rg/) - Reference UI components

---

## 🌟 Why PredictX Wins: Cross-Platform Enforcement

### The Game-Changing Innovation

**Traditional RG System** (Single Operator):
```
User → Casino A (has limits)
User → Casino B (no limits) ❌
User → Casino C (no limits) ❌
Result: Limits only work on one platform
```

**PredictX** (Cross-Platform):
```
User → Concordium Registry (one identity commitment)
   ↓
Casino A queries registry → Limits enforced ✅
Casino B queries registry → Same limits apply ✅
Casino C queries registry → Same limits apply ✅
Result: Limits work EVERYWHERE
```

### How It Works

1. **User registers once** with Concordium Web3 ID
2. **PredictX generates** anonymous identity commitment: `Blake2b(userId)`
3. **User sets limits** (€100/day) in PredictX Registry smart contract
4. **ANY gambling platform** can query: "Can user X bet €50?"
5. **Smart contract validates** across all platforms, all time windows
6. **Result**: True cross-platform protection that actually prevents addiction

**This is only possible because Concordium identity is blockchain-native and operator-independent.**

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Gambling Platforms                          │
│  (Casino A)    (Sportsbook B)    (PredictX Demo)    (Casino C) │
└────────────┬─────────────┬───────────────┬──────────────────────┘
             │             │               │
             └─────────────┴───────────────┘
                           │
                    REST API Layer
                  (app/api/rg/*)
                           │
             ┌─────────────┴─────────────┐
             │                           │
    ┌────────▼────────┐         ┌───────▼────────┐
    │  Concordium     │         │   euroe        │
    │  Web3 ID        │         │   Stablecoin   │
    │  (Identity)     │         │   (Payments)   │
    └────────┬────────┘         └───────┬────────┘
             │                           │
             └─────────────┬─────────────┘
                           │
                  ┌────────▼────────┐
                  │  RG Registry    │
                  │  Smart Contract │
                  │  (Concordium)   │
                  └─────────────────┘
```

### Components

#### 1. Smart Contract Layer (Concordium)

**File**: [`concordium-contracts/rg-registry/src/lib.rs`](./concordium-contracts/rg-registry/src/lib.rs)

**Language**: Rust with `concordium_std`  
**Contract Name**: `rg_registry`  
**Currency**: CCD / euroe (EUR stablecoin)

**Key Functions**:
- `register_user` - Register user with Web3 ID verification
- `validate_bet` - Check if bet is allowed (read-only)
- `record_bet` - Update spending after bet placement
- `set_limits` - User configures custom limits
- `self_exclude` - User triggers self-exclusion
- `get_user_state` - Query current RG status (read-only)

**Security Features**:
- Anonymous identity commitments (Blake2b)
- Time-windowed spending tracking
- Immutable self-exclusion
- Event logging for audits

#### 2. Backend API Layer (Next.js)

**Location**: [`app/api/rg/`](./app/api/rg/)

**Purpose**: Bridge between gambling platforms and Concordium blockchain

**Endpoints**:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/rg/link-identity` | POST | Register user with Web3 ID |
| `/api/rg/check` | POST | Validate bet before placement |
| `/api/rg/record-bet` | POST | Update spending after bet |
| `/api/rg/set-limit` | POST | User configures limits |
| `/api/rg/self-exclude` | POST | User triggers self-exclusion |
| `/api/rg/status` | GET | Query current RG status |

#### 3. Frontend Demo (Next.js)

**Purpose**: Reference implementation showing integration

The included prediction market is **just an example gambling platform** demonstrating how any operator can integrate PredictX. It shows:
- How to call the RG API before placing bets
- How to display RG status to users
- How to handle limit violations gracefully
- Cross-platform limit enforcement

**The same integration works for casinos, sportsbooks, or any gambling platform.**

---

## 🚀 Quick Start

### Prerequisites

- **Rust** 1.70+ ([Install](https://rustup.rs))
- **Concordium CLI** ([Install](https://developer.concordium.software/en/mainnet/net/installation/downloads.html))
- **Node.js** 18+ and npm

### 1. Clone Repository

```bash
git clone https://github.com/trenchsheikh/PredictX-Encode-Hackathon
cd PredictX-Encode-Hackathon
```

### 2. Build Smart Contract

```bash
cd concordium-contracts/rg-registry

# Install concordium tools (if not already installed)
cargo install --locked cargo-concordium

# Build contract
cargo concordium build --out rg_registry.wasm.v1 --schema-embed

# Test contract
cargo test
```

### 3. Deploy to Concordium Testnet

```bash
# Deploy module
concordium-client module deploy rg_registry.wasm.v1 \
    --sender YOUR_ACCOUNT \
    --grpc-port 10001

# Initialize contract
concordium-client contract init MODULE_HASH \
    --contract rg_registry \
    --parameter-json '{"owner":"YOUR_ADDRESS","minimum_age":18}' \
    --sender YOUR_ACCOUNT \
    --energy 10000
```

See [`docs/CONCORDIUM_DEPLOYMENT.md`](./docs/CONCORDIUM_DEPLOYMENT.md) for detailed deployment guide.

### 4. Run Backend API

```bash
cd ../../  # Back to root

npm install

# Create .env.local
cat > .env.local << EOF
# Concordium Configuration
NEXT_PUBLIC_CONCORDIUM_NETWORK=testnet
NEXT_PUBLIC_RG_CONTRACT_ADDRESS=<your_contract_address>
NEXT_PUBLIC_RG_CONTRACT_INDEX=<your_contract_index>

# euroe Configuration (if using stablecoin)
NEXT_PUBLIC_EUROE_CONTRACT_ADDRESS=<euroe_contract>
EOF

# Start development server
npm run dev
```

### 5. Test Integration

Visit `http://localhost:3000` to see the demo gambling platform (prediction market) with PredictX integration.

---

## 📚 Documentation

### For Hackathon Judges

- **[OPERATOR_INTEGRATION_GUIDE.md](./docs/OPERATOR_INTEGRATION_GUIDE.md)** - How gambling platforms integrate PredictX
- **[VIDEO_DEMO_SCRIPT.md](./docs/VIDEO_DEMO_SCRIPT.md)** - Demo walkthrough for submission video
- **[CONCORDIUM_INTEGRATION.md](./docs/CONCORDIUM_INTEGRATION.md)** - Technical implementation details

### For Developers

- **[Smart Contract Documentation](./concordium-contracts/rg-registry/README.md)** - Contract API reference
- **[CONCORDIUM_DEPLOYMENT.md](./docs/CONCORDIUM_DEPLOYMENT.md)** - Deployment guide for testnet/mainnet
- **[API_REFERENCE.md](./docs/API_REFERENCE.md)** - REST API documentation

### For Operators

- **[QUICK_START.md](./QUICK_RUN_GUIDE.md)** - Integration in 30 minutes
- **[OPERATOR_INTEGRATION_GUIDE.md](./docs/OPERATOR_INTEGRATION_GUIDE.md)** - Complete integration tutorial

---

## 🎬 Hackathon Submission

### Video Demo

**[Watch Demo Video →](YOUR_VIDEO_URL)**

**Highlights**:
1. User registers with Concordium Web3 ID
2. Sets €100/day limit
3. Places €50 bet ✅ (allowed)
4. Tries €60 bet ❌ (blocked - would exceed limit)
5. User self-excludes for 30 days
6. **Switches to "different platform"** - limits still enforced! 🎯

### Live Deployment

- **Frontend**: [Vercel URL](YOUR_VERCEL_URL)
- **Smart Contract**: `<YOUR_TESTNET_ADDRESS>` ([Concordium Explorer](https://testnet.ccdscan.io))
- **API**: `https://your-app.vercel.app/api/rg/`

### Presentation

**[View Slides →](YOUR_SLIDES_URL)**

---

## 💡 Unique Value Propositions

### 1. **Only True Cross-Platform Solution**

Every other RG solution works per-operator. PredictX is the **only solution** where limits follow the user across platforms because identity commitments are blockchain-native and operator-independent.

### 2. **Privacy-First by Design**

- **No PII on blockchain**: Only Blake2b commitment stored
- **Zero-knowledge proofs**: Prove age without revealing it
- **Selective disclosure**: Users control what attributes to share
- **Anonymous auditing**: Regulators get insights without compromising privacy

### 3. **Production-Ready Code**

Not a prototype — this is production-ready:
- ✅ Complete Rust smart contract with tests
- ✅ Full REST API backend
- ✅ Reference frontend implementation
- ✅ Comprehensive documentation
- ✅ Deployment scripts and guides

### 4. **Real Problem, Real Solution**

Gambling addiction **is** a cross-platform problem. A gambler doesn't just use one casino — they hop between platforms. PredictX is the **only solution** that addresses this reality.

### 5. **Easy Operator Integration**

Gambling platforms can integrate PredictX by adding **just 2 API calls**:
1. `POST /api/rg/check` before accepting bet
2. `POST /api/rg/record-bet` after bet placement

That's it. Full responsible gambling compliance in 2 endpoints.

---

## 🔒 Privacy & Security

### Privacy Architecture

```
User's Real Identity (Concordium Web3 ID)
           ↓ (Zero-knowledge proof)
   Verified Attributes (age, jurisdiction)
           ↓ (Blake2b hashing)
   Anonymous Identity Commitment
           ↓ (Stored on blockchain)
   RG Limits & Spending (no PII)
```

**What's on the blockchain**: Anonymous hash + spending amounts  
**What's NOT on blockchain**: Name, address, exact age, any PII  
**What operators see**: Can user X bet amount Y? (Yes/No)  
**What operators DON'T see**: Who is user X? How much have they bet total?

### Security Features

1. **Immutable Limits**: Users can lower limits instantly, but increasing requires 24-hour cooling period
2. **Self-Exclusion Lock**: Once activated, cannot be reversed until expiry
3. **Audit Trail**: All events logged for regulators (anonymous)
4. **Rate Limiting**: API endpoints protected against abuse
5. **Smart Contract Security**: Audited for reentrancy, overflow, authorization issues

---

## 🌍 Cross-Platform Demonstration

To demonstrate the cross-platform nature, our demo includes:

1. **Main Prediction Market** - Full-featured gambling platform
2. **"Casino B" Simulator** - Shows same user, different platform, limits still apply
3. **Admin Dashboard** - View aggregated statistics (anonymous)

**Try it**: Create account, set limit, place bets on both "platforms" — see limits enforced across both!

---

## 🔮 Impact & Future Vision

### Immediate Impact

- **For Users**: True protection against addiction, works everywhere
- **For Operators**: Easy compliance, shared responsibility
- **For Regulators**: Transparent, auditable, privacy-preserving

### Roadmap

**Phase 1: Foundation** (Current - Hackathon)
- ✅ Core smart contract
- ✅ Web3 ID integration
- ✅ REST API
- ✅ Reference implementation

**Phase 2: Adoption** (Q1 2025)
- [ ] Onboard 3-5 gambling platforms
- [ ] Deploy to Concordium mainnet
- [ ] Add machine learning risk scoring
- [ ] Multi-language support

**Phase 3: Expansion** (Q2 2025)
- [ ] Cross-jurisdiction support
- [ ] Advanced analytics for users
- [ ] Regulator dashboard
- [ ] Mobile SDK

**Phase 4: Ecosystem** (Q3+ 2025)
- [ ] Open-source operator SDK
- [ ] Certification program for compliant platforms
- [ ] Partnership with gambling regulators
- [ ] Integration with national self-exclusion registries

---

## 🤝 For Gambling Operators

### Why Integrate PredictX?

1. **Regulatory Compliance**: Meet responsible gambling requirements
2. **Shared Responsibility**: RG protection is cross-platform, reducing your liability
3. **Easy Integration**: 2 API calls, that's it
4. **Competitive Advantage**: Market yourself as privacy-preserving RG leader
5. **Lower Costs**: No need to build your own RG infrastructure

### Integration in 3 Steps

```typescript
// 1. Before accepting bet
const validation = await fetch('/api/rg/check', {
  method: 'POST',
  body: JSON.stringify({
    idCommitment: user.rgCommitment,
    betAmount: amount,
  }),
});

if (!validation.allowed) {
  return alert(validation.reason); // Show user why bet was blocked
}

// 2. Process bet on your platform
const betResult = await processGambling(user, amount);

// 3. After successful bet
await fetch('/api/rg/record-bet', {
  method: 'POST',
  body: JSON.stringify({
    idCommitment: user.rgCommitment,
    betAmount: amount,
  }),
});
```

**See full guide**: [OPERATOR_INTEGRATION_GUIDE.md](./docs/OPERATOR_INTEGRATION_GUIDE.md)

---

## 📞 Contact & Support

**For Hackathon Judges**:
- GitHub: [github.com/trenchsheikh/PredictX-Encode-Hackathon](https://github.com/trenchsheikh/PredictX-Encode-Hackathon)
- Issues: [Open an issue](https://github.com/trenchsheikh/PredictX-Encode-Hackathon/issues)

**For Gambling Operators**:
- Integration Support: [Open a discussion](https://github.com/trenchsheikh/PredictX-Encode-Hackathon/discussions)
- Technical Questions: See [OPERATOR_INTEGRATION_GUIDE.md](./docs/OPERATOR_INTEGRATION_GUIDE.md)

**Community**:
- Concordium Discord: [discord.gg/concordium](https://discord.gg/concordium)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Built for **Encode Hackathon 2025** - Responsible Gambling with Concordium track.

**Technologies**:
- **Concordium** - Blockchain with built-in identity layer
- **euroe** - Protocol-level EUR stablecoin
- **Next.js** - Frontend framework
- **Rust** - Smart contract language

**Special Thanks**:
- Concordium team for Web3 ID documentation
- Encode community for organizing the hackathon
- All contributors to the responsible gambling ecosystem

---

<div align="center">

**PredictX - Preventing Gambling Addiction, One Identity at a Time**

*Built with ❤️ for responsible gambling and user privacy*

**[📺 Watch Demo](YOUR_VIDEO_URL)** • **[📚 Read Docs](./docs)** • **[🚀 Quick Start](#-quick-start)**

</div>
