# BNBPredict - BNB Chain Prediction Markets

A fully on-chain prediction market platform built on BNB Smart Chain with AI-driven results and Privy wallet integration.

## Features

- 🔗 **Fully On-Chain**: All transactions happen on BNB Smart Chain with native BNB tokens
- 🤖 **AI-Powered**: Advanced AI generates bet titles, suggests deadlines, and resolves outcomes
- ⚡ **Real-Time**: Live activity feed and instant updates
- 🎯 **Multi-Category Support**: Sports, Crypto, Politics, Entertainment, Weather, Finance, Technology, and Custom
- 🔐 **Secure**: Privy wallet integration with multi-wallet support
- 📊 **Dynamic Pricing**: Fixed Product Market Maker (FPMM) for fair pricing
- 🏆 **Leaderboard**: Track top performers and achievements
- 🌐 **Multi-Language**: English and Chinese support

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom BNB theme
- **Wallet**: Privy for wallet integration
- **Blockchain**: BNB Smart Chain (BSC)
- **UI Components**: Radix UI primitives
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Privy account and app ID

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bnb-predict
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`:
```env
# Privy Configuration
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id_here

# BNB Chain Configuration
NEXT_PUBLIC_CHAIN_ID=56
NEXT_PUBLIC_RPC_URL=https://bsc-dataseed.binance.org/

# Contract Addresses (to be deployed)
NEXT_PUBLIC_VAULT_CONTRACT_ADDRESS=
NEXT_PUBLIC_PREDICTION_CONTRACT_ADDRESS=

# AI API Configuration
NEXT_PUBLIC_AI_API_URL=
AI_API_KEY=
```

5. Run the development server:
```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── my-bets/           # My Bets page
│   ├── how-it-works/      # How it Works page
│   └── leaderboard/       # Leaderboard page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── layout/           # Layout components
│   ├── prediction/       # Prediction-related components
│   └── providers/        # Context providers
├── lib/                  # Utility functions
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

## Key Components

### Prediction System
- **PredictionCard**: Displays individual prediction markets
- **CreateBetModal**: Modal for creating new predictions with AI integration
- **Filters**: Advanced filtering for predictions

### Wallet Integration
- **PrivyProvider**: Wraps the app with Privy authentication
- **Header**: Navigation with wallet connection status

### Pages
- **Home**: Live bet markets with stats and filtering
- **My Bets**: User's betting history and portfolio
- **How it Works**: Detailed explanation of the platform
- **Leaderboard**: Top performers and rankings

## BNB Theme

The platform uses a custom BNB-themed design system:

- **Primary**: BNB Yellow (#F0B90B)
- **Secondary**: BNB Dark (#1E2329)
- **Accent**: BNB Green (#00D4AA)
- **Gradients**: Primary to accent color combinations
- **Animations**: Glow effects and smooth transitions

## Smart Contract Integration

The platform is designed to integrate with BNB Smart Chain contracts:

- **Vault Contract**: Manages funds and payouts
- **Prediction Contract**: Handles prediction creation and resolution
- **Token Contract**: BNB token integration

## AI Integration

The platform includes AI-powered features:

- **Title Generation**: AI creates optimized prediction titles
- **Deadline Suggestions**: Smart deadline recommendations
- **Resolution**: Multi-layer AI verification system
- **Evidence Gathering**: 25+ verification APIs

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@bnbpredict.com or join our Telegram community.

## Roadmap

- [ ] Smart contract deployment
- [ ] AI API integration
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] Cross-chain support
- [ ] Governance token
- [ ] Staking rewards

---

Built with ❤️ for the BNB Chain ecosystem


