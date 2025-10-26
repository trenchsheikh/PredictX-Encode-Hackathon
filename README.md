# PredictX - Decentralized Prediction Market

> **Built for Encode Hackathon 2025** | Tracks: **Concordium Identity Layer** + **Solana Ecosystem**

A next-generation decentralized prediction market platform that combines the speed and efficiency of **Solana** with privacy-preserving compliance through **Concordium's identity layer**. PredictX demonstrates how blockchain interoperability can create powerful, compliant, and user-friendly DeFi applications.

## 🏆 Encode Hackathon Tracks

### 1. Identity Layer with Concordium ✅
- **Web3 ID Integration**: Zero-knowledge identity verification
- **Responsible Gambling Registry**: Privacy-preserving compliance limits
- **Anonymous Commitments**: Bet without revealing personal data
- **Selective Disclosure**: Share only what's needed for compliance
- **ZK Proofs**: Prove eligibility without exposing identity

### 2. Solana Ecosystem Build ✅
- **Anchor Programs**: Production-ready smart contracts in Rust
- **Pyth Network Oracles**: Real-time price feeds with 400ms updates
- **Commit-Reveal Mechanism**: Anti-front-running betting system
- **Phantom Wallet Integration**: Seamless authentication via Privy
- **High Performance**: 65,000 TPS with sub-second finality

## 👨‍⚖️ For Hackathon Judges

### Track 1: Concordium Identity Layer
**What to Review:**
- [`concordium-contracts/rg-registry/src/lib.rs`](./concordium-contracts/rg-registry/src/lib.rs) - Responsible gambling smart contract
- [`lib/concordium-service.ts`](./lib/concordium-service.ts) - Web3 ID integration and ZK proofs
- [`app/api/rg/`](./app/api/rg/) - Backend relayer API for cross-chain identity
- [`components/rg/`](./components/rg/) - RG check UI components

**Key Innovations:**
- Privacy-preserving spending limits using ZK proofs
- Cross-chain identity bridge (Concordium → Solana)
- Anonymous commitment scheme for bets
- Regulatory compliance without sacrificing user privacy

### Track 2: Solana Ecosystem
**What to Review:**
- [`solana-programs/programs/darkbet-prediction-market/src/lib.rs`](./solana-programs/programs/darkbet-prediction-market/src/lib.rs) - Core Anchor program
- [`lib/blockchain-utils.ts`](./lib/blockchain-utils.ts) - Solana integration
- [`app/api/oracle/prices/route.ts`](./app/api/oracle/prices/route.ts) - Pyth Network integration
- [`lib/commit-reveal.ts`](./lib/commit-reveal.ts) - Cryptographic betting scheme

**Key Innovations:**
- Commit-reveal protocol preventing front-running
- Real-time Pyth oracle integration for verifiable settlements
- Optimized for Solana's high-throughput architecture
- Production-ready Anchor programs with comprehensive tests

### Live Demo
- **Frontend**: [Deployed URL] (if available)
- **Solana Program**: [Program ID on devnet/mainnet]
- **Concordium Contract**: [Contract address]

## 🌟 Key Features

- **🔐 Privacy-First Identity**: Concordium Web3 ID enables anonymous yet compliant betting
- **⚡ Lightning Fast**: Solana delivers 65,000 TPS with ~$0.00025 transaction fees
- **🛡️ Anti-Front-Running**: Commit-reveal scheme keeps bets hidden until resolution
- **📊 Real-Time Oracles**: Pyth Network provides verifiable price feeds
- **🎯 Responsible Gambling**: Concordium-based limits protect users while preserving privacy
- **💎 Modern UX**: Responsive design with smooth animations and real-time updates

## 🏗️ Architecture

### Blockchain Layer (Solana)

- **Framework**: Anchor 0.29.0 (Rust)
- **Programs**:
  - `PredictionMarket` - Core betting logic with commit-reveal
  - `VaultManager` - SOL custody and treasury
  - `UserRegistry` - Identity linkage
  - `CommitReveal` - Anti-front-running mechanism
- **Network**: Solana mainnet-beta
- **Currency**: SOL

### Oracle Layer (Pyth Network)

- **Provider**: Pyth Network
- **Feeds**: BTC/USD, ETH/USD, SOL/USD (400ms updates)
- **Integration**: On-chain verification + WebSocket for UI

### Authentication (Privy)

- **Provider**: Privy
- **Wallets**: Phantom (primary), Solflare, Ledger
- **Features**: Email/social login, embedded wallets, session management

### Compliance Layer (Concordium) 🎯 Hackathon Track

- **Provider**: Concordium blockchain
- **Features**: Web3 ID, zero-knowledge proofs, responsible gambling limits
- **Privacy**: Anonymous commitments, selective disclosure
- **Smart Contract**: Rust-based responsible gambling registry
- **Integration**: Backend relayer bridges Solana ↔ Concordium

### Cross-Chain Architecture

PredictX showcases **blockchain interoperability** by leveraging the strengths of both chains:
- **Solana**: High-speed betting transactions and real-time settlements
- **Concordium**: Privacy-preserving identity verification and compliance
- **Bridge**: Backend API relayer synchronizes state between chains
- **User Experience**: Seamless single-wallet flow (users interact primarily with Phantom)

### Frontend (Next.js)

- **Framework**: Next.js 14 with TypeScript
- **UI Library**: shadcn/ui components + TailwindCSS
- **Wallet**: @solana/wallet-adapter-react
- **Charts**: Recharts for data visualization
- **Animations**: Framer Motion

## 🚀 Quick Start

### Prerequisites

- **Rust** 1.70+ ([Install](https://rustup.rs))
- **Solana CLI** 1.17+ ([Install](https://docs.solana.com/cli/install-solana-cli-tools))
- **Anchor CLI** 0.29+ ([Install](https://book.anchor-lang.com/getting_started/installation.html))
- **Node.js** 18+ and npm

### 1. Clone the Repository

```bash
git clone https://github.com/trenchsheikh/PredictX-Encode-Hackathon
cd PredictX-Encode-Hackathon
```

### 2. Solana Programs Setup

```bash
cd solana-programs

# Install dependencies
npm install

# Build programs
anchor build

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Run tests
anchor test
```

### 3. Frontend Setup

```bash
cd .. # Back to root directory
npm install
```

Create a `.env.local` file:

```env
# Privy Configuration
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id

# Solana Configuration
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_PROGRAM_ID=<your_program_id_from_deployment>

# Pyth Network
NEXT_PUBLIC_PYTH_BTC_FEED=GVXRSBjFk6e6J3NbVPXohDJetcTjaeeuykUpbQF8UoMU
NEXT_PUBLIC_PYTH_ETH_FEED=JBu1AL4obBcCMqKBBxhpWCNUt136ijcuMZLFvTP7iWdB
NEXT_PUBLIC_PYTH_SOL_FEED=H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG
```

### 4. Start Frontend

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 📁 Project Structure

Organized around the two Encode Hackathon tracks:

```
PredictX-Encode-Hackathon/
├── solana-programs/           # 🏆 TRACK 2: Solana Ecosystem
│   ├── programs/
│   │   └── darkbet-prediction-market/
│   │       └── src/lib.rs     # Anchor smart contracts (Rust)
│   ├── tests/                 # TypeScript integration tests
│   └── Anchor.toml            # Anchor configuration
├── concordium-contracts/      # 🏆 TRACK 1: Identity Layer
│   └── rg-registry/           # Responsible Gambling Registry
│       └── src/lib.rs         # Concordium smart contract (Rust)
├── app/                       # Next.js app directory
│   ├── api/                  # API routes (includes Concordium relayer)
│   │   ├── rg/               # Responsible gambling endpoints
│   │   ├── markets/          # Solana market endpoints
│   │   └── oracle/           # Pyth price feeds
│   ├── my-bets/              # User bets page
│   ├── leaderboard/          # Leaderboard page
│   └── how-it-works/         # Documentation page
├── components/               # React components
│   ├── ui/                  # shadcn/ui components
│   ├── prediction/          # Betting interface components
│   ├── rg/                  # Concordium RG components
│   └── layout/              # Header, footer, navbar
├── lib/                     # Utility libraries
│   ├── blockchain-utils.ts  # Solana utilities
│   ├── concordium-service.ts # Concordium integration
│   ├── commit-reveal.ts     # Betting cryptography
│   └── privy-config.ts      # Wallet authentication
├── docs/                    # Comprehensive documentation
│   ├── CONCORDIUM_INTEGRATION.md      # Track 1 implementation
│   ├── SOLANA_REFACTOR_DESIGN.md      # Track 2 architecture
│   └── QUICK_START_SOLANA.md          # Setup guide
└── types/                   # TypeScript type definitions
    ├── blockchain.ts        # Solana types
    └── concordium.ts        # Concordium types
```

## 🛠️ Development

### Running in Development Mode

```bash
# Terminal 1 - Solana local validator (optional)
solana-test-validator

# Terminal 2 - Frontend
npm run dev
```

### Available Scripts

#### Solana Programs

- `anchor build` - Compile programs
- `anchor test` - Run tests
- `anchor deploy --provider.cluster devnet` - Deploy to devnet
- `anchor deploy --provider.cluster mainnet` - Deploy to mainnet

#### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🔧 Configuration

### Environment Variables

#### Frontend (.env.local)

- `NEXT_PUBLIC_PRIVY_APP_ID` - Privy application ID
- `NEXT_PUBLIC_SOLANA_NETWORK` - Solana cluster (devnet/mainnet-beta)
- `NEXT_PUBLIC_SOLANA_RPC_URL` - Solana RPC endpoint
- `NEXT_PUBLIC_PROGRAM_ID` - Deployed prediction market program ID

### Solana Configuration

1. Configure Solana CLI for devnet:
   ```bash
   solana config set --url https://api.devnet.solana.com
   ```

2. Generate keypair (if needed):
   ```bash
   solana-keygen new
   ```

3. Airdrop devnet SOL:
   ```bash
   solana airdrop 2
   ```

## 📊 API Endpoints

### Markets

- `GET /api/markets` - List all markets
- `POST /api/markets` - Create new market
- `GET /api/markets/:id` - Get market details

### Users

- `GET /api/users/:address/bets` - Get user's bets
- `GET /api/users/leaderboard` - Get leaderboard data

### Oracle

- `GET /api/oracle/prices` - Get cryptocurrency prices from Pyth

## 🎯 Usage

### Creating a Prediction Market

1. Connect your Phantom wallet
2. Navigate to "Create Market"
3. Fill in market details:
   - Asset (BTC, ETH, SOL)
   - Threshold price
   - Resolution time
   - Initial stake
4. Sign transaction with Phantom

### Placing Bets

1. Browse active markets
2. Click on a market to view details
3. Choose LONG (above threshold) or SHORT (below threshold)
4. Enter bet amount in SOL
5. Commit your bet (direction hidden)
6. After market locks, reveal your bet
7. Claim winnings after market resolves

## 📚 Documentation

### Getting Started

- **[Quick Start Guide](./docs/QUICK_START_SOLANA.md)** - Set up in 30 minutes
- **[Quick Reference](./docs/QUICK_REFERENCE.md)** - Commands and tips

### Technical Documentation

- **[Technical Design](./docs/SOLANA_REFACTOR_DESIGN.md)** - Complete architecture (50+ pages)
- **[Migration Summary](./docs/SOLANA_MIGRATION_SUMMARY.md)** - Executive overview
- **[Implementation Checklist](./docs/IMPLEMENTATION_CHECKLIST.md)** - 200+ actionable tasks
- **[Documentation Index](./docs/SOLANA_REFACTOR_README.md)** - All documentation

### Program Documentation

- **[Solana Programs README](./solana-programs/README.md)** - Smart contract documentation

## 🔍 Troubleshooting

### Common Issues

1. **Program Not Found**: Verify program ID is correct in environment variables
2. **Wallet Connection**: Ensure Phantom wallet is installed and connected to correct network
3. **Transaction Failures**: Check Solana account has sufficient SOL for rent + fees
4. **RPC Errors**: Try switching to a different RPC endpoint

### Debug Mode

View program logs in real-time:
```bash
solana logs
```

Check account details:
```bash
solana account <address>
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- **GitHub Issues**: [Open an issue](https://github.com/trenchsheikh/PredictX-Encode-Hackathon/issues)
- **Documentation**: Check the comprehensive `docs/` directory
- **Encode Hackathon**: Join the Encode community channels
- **Solana**: [Solana Discord](https://discord.gg/solana)
- **Concordium**: [Concordium Discord](https://discord.gg/concordium)
- **Anchor**: [Anchor Discord](https://discord.gg/anchorlang)

## 🔮 Roadmap

### 🏆 Hackathon Phase (Current)

**Track 1: Concordium Identity Layer** ✅
- [x] Concordium responsible gambling smart contract
- [x] Web3 ID integration with ZK proofs
- [x] Backend relayer for cross-chain identity
- [x] Privacy-preserving spending limits
- [x] Anonymous commitment scheme

**Track 2: Solana Ecosystem** ✅
- [x] Core Anchor programs (commit-reveal betting)
- [x] Pyth Network oracle integration
- [x] Phantom wallet authentication (Privy)
- [x] Real-time price feeds and settlements
- [x] Comprehensive testing suite

**Frontend & UX** ✅
- [x] Modern responsive UI (Next.js 14 + TailwindCSS)
- [x] Real-time market updates
- [x] Seamless cross-chain experience
- [x] Comprehensive documentation

### Post-Hackathon: Production Enhancement

**Phase 1: Security & Testing**
- [ ] Full security audit (both Solana & Concordium contracts)
- [ ] Stress testing on devnet
- [ ] Bug bounty program
- [ ] Mainnet deployment

**Phase 2: Feature Expansion**
- [ ] Additional prediction categories (sports, politics, weather)
- [ ] Advanced analytics dashboard
- [ ] Social features (user profiles, achievements, referrals)
- [ ] Mobile app (React Native)

**Phase 3: Decentralization**
- [ ] Governance token launch
- [ ] DAO governance for market creation
- [ ] Community-driven oracle validation
- [ ] Liquidity mining programs

**Phase 4: Ecosystem Growth**
- [ ] Additional blockchain integrations
- [ ] SDK for third-party developers
- [ ] White-label prediction market platform
- [ ] Enterprise compliance features

## 🌟 Why Solana + Concordium?

### Solana: Speed & Scale 🚀

**Performance**
- 65,000 transactions per second
- Sub-second finality (~400ms)
- Perfect for high-frequency betting markets

**Cost Efficiency**
- Transaction fee: ~$0.00025
- 99% cheaper than Ethereum alternatives
- Predictable costs for users

**Developer Experience**
- Rust-based (secure, performant)
- Anchor framework (simplified smart contracts)
- Rich ecosystem and tooling (Pyth, Phantom, etc.)

### Concordium: Privacy & Compliance 🔐

**Identity Layer**
- Built-in Web3 ID at protocol level
- Zero-knowledge proofs for privacy
- Regulatory-friendly without sacrificing decentralization

**Responsible Gambling**
- Privacy-preserving spending limits
- Anonymous commitments
- Selective disclosure (prove eligibility without revealing identity)

**Developer Benefits**
- Rust smart contracts (same language as Solana!)
- Deterministic gas fees
- Built-in identity primitives

### Why Both? The Best of Two Worlds 🌐

PredictX demonstrates **blockchain interoperability** by combining:
1. **Solana's speed** for real-time betting and settlements
2. **Concordium's privacy** for compliant identity verification
3. **Seamless UX** via backend relayer (users don't see the complexity)

This architecture proves that specialized blockchains can work together, each handling what they do best, to create superior DeFi applications.

---

**Built for Encode Hackathon 2025** | *Showcasing the future of interoperable blockchain applications*

**Powered by:** Solana • Concordium • Pyth Network • Privy
