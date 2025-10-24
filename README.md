# DarkBet - Decentralized Prediction Market

A next-generation decentralized prediction market platform built on **Solana** with privacy-preserving compliance. DarkBet combines commit-reveal betting schemes with real-time oracle data and responsible gambling features.

## 🌟 Features

- **Commit-Reveal Betting**: Bets remain hidden until resolution, preventing front-running and manipulation
- **Lightning Fast**: Built on Solana - 65,000 TPS with sub-second finality
- **Ultra-Low Fees**: ~$0.00025 per transaction (99% cheaper than alternatives)
- **Real-Time Oracles**: Pyth Network integration for verifiable price feeds
- **Privacy-First Compliance**: Concordium identity layer with zero-knowledge proofs
- **Seamless Authentication**: Privy integration with Phantom wallet support
- **Modern UI**: Responsive design with smooth animations and real-time updates

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

### Compliance (Concordium)

- **Provider**: Concordium blockchain
- **Features**: Web3 ID, zero-knowledge proofs, responsible gambling limits
- **Privacy**: Anonymous commitments, selective disclosure

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
cd darkbet
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

```
darkbet/
├── solana-programs/           # Solana smart contracts (Rust/Anchor)
│   ├── programs/
│   │   └── darkbet-prediction-market/
│   │       └── src/lib.rs     # Main program logic
│   ├── tests/                 # TypeScript tests
│   └── Anchor.toml            # Anchor configuration
├── app/                       # Next.js app directory
│   ├── api/                  # API routes
│   ├── my-bets/              # User bets page
│   └── leaderboard/          # Leaderboard page
├── components/               # React components
│   ├── ui/                  # Reusable UI components
│   ├── prediction/          # Prediction-related components
│   └── layout/              # Layout components
├── lib/                     # Utility libraries
│   ├── hooks/               # Custom React hooks
│   └── blockchain-utils.ts  # Blockchain utilities
├── docs/                    # Documentation
│   ├── SOLANA_REFACTOR_DESIGN.md      # Complete architecture
│   ├── IMPLEMENTATION_CHECKLIST.md    # 200+ tasks
│   └── QUICK_START_SOLANA.md          # Quick setup guide
└── types/                   # TypeScript type definitions
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

- GitHub Issues: [Open an issue](https://github.com/trenchsheikh/PredictX-Encode-Hackathon/issues)
- Documentation: Check the `docs/` directory
- Solana Discord: [https://discord.gg/solana](https://discord.gg/solana)
- Anchor Discord: [https://discord.gg/anchorlang](https://discord.gg/anchorlang)

## 🔮 Roadmap

### Phase 1: Foundation (Weeks 1-4) - In Progress

- [x] Complete technical design and architecture
- [x] Implement core Solana smart contracts (Anchor/Rust)
- [ ] Integrate Pyth Network price oracles
- [ ] Deploy Privy authentication for Phantom wallet
- [ ] Security testing on devnet
- [ ] Deploy to mainnet

### Phase 2: Compliance Layer (Weeks 5-8)

- [ ] Build Concordium responsible gambling contract
- [ ] Implement Web3 ID verification
- [ ] Backend relayer API
- [ ] Privacy-preserving limits enforcement

### Phase 3: Feature Enhancement (Weeks 9-12)

- [ ] Additional prediction categories (sports, politics, etc.)
- [ ] Advanced analytics dashboard
- [ ] Social features (user profiles, achievements)
- [ ] Mobile-responsive improvements

### Phase 4: Decentralization (Weeks 13-16)

- [ ] Governance token launch
- [ ] DAO governance implementation
- [ ] Community-driven market creation
- [ ] Liquidity mining programs

## 🌟 Why Solana?

**Performance**
- 65,000 transactions per second
- Sub-second finality
- Block time: ~400ms

**Cost Efficiency**
- Transaction fee: ~$0.00025
- 99% cheaper than alternatives
- No gas price volatility

**Developer Experience**
- Rust-based (secure, performant)
- Anchor framework (simplified development)
- Rich ecosystem and tooling

---

**Built with ❤️ for the decentralized future of prediction markets**

**Powered by:** Solana • Pyth Network • Privy • Concordium
