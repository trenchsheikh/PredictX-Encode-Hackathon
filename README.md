# DarkBet - DarkPool Betting Platform

A decentralized prediction market platform built on BNB Smart Chain with AI-driven results and fully on-chain execution. DarkBet combines the privacy and efficiency of dark pools with prediction markets, ensuring fair outcomes while preventing market manipulation.

## 🌟 Features

- **DarkPool Betting**: Bets remain hidden until resolution, preventing manipulation.
- **AI-Driven Results**: Automated market resolution using external data sources
- **Fully On-Chain**: All transactions and logic executed on BNB Smart Chain
- **Real-Time Markets**: Live prediction markets with instant updates
- **User-Friendly Interface**: Modern, responsive design with smooth animations
- **Leaderboard System**: Track top performers and statistics
- **Crypto Predictions**: Specialized markets for cryptocurrency price predictions

## 🏗️ Architecture

### Frontend (Next.js + Vercel)

- **Framework**: Next.js 14 with TypeScript
- **UI Library**: shadcn/ui components
- **Animations**: Framer Motion
- **Charts**: Recharts for data visualization
- **Wallet Integration**: Privy for wallet connection
- **Styling**: TailwindCSS with custom dark theme

### Backend (Node.js + Render)

- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose
- **Blockchain**: Ethers.js for BNB Smart Chain interaction
- **Oracle Service**: CoinGecko API for price data
- **Deployment**: Render.com

### Smart Contracts

- **Network**: BNB Smart Chain Testnet
- **Language**: Solidity
- **Features**: Commit-reveal scheme, market resolution, payout distribution

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- MongoDB database (MongoDB Atlas recommended)
- BNB Smart Chain Testnet RPC URL
- Privy App ID for wallet integration

### 1. Clone the Repository

```bash
git clone <repository-url>
cd darkbet
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/darkbet

# Blockchain
BSC_TESTNET_RPC_URL=https://data-seed-prefork-1-s1.binance.org:8545
ADMIN_PRIVATE_KEY=your_admin_private_key_here

# Contract Addresses (deploy contracts first)
PREDICTION_CONTRACT_ADDRESS=0x...
VAULT_CONTRACT_ADDRESS=0x...

# Server
PORT=3001
NODE_ENV=production
```

### 3. Deploy Smart Contracts

```bash
cd contracts
npm install
npx hardhat compile
npx hardhat run scripts/deploy.js --network bscTestnet
```

Update the contract addresses in your backend `.env` file.

### 4. Start Backend

```bash
cd backend
npm run dev
```

The backend will be available at `http://localhost:3001`

### 5. Frontend Setup

```bash
cd .. # Back to root directory
npm install
```

Create a `.env.local` file in the root directory:

```env
# Privy Configuration
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id

# Backend URL (for development)
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001

# Contract Addresses (same as backend)
NEXT_PUBLIC_PREDICTION_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_VAULT_CONTRACT_ADDRESS=0x...
```

### 6. Start Frontend

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 🌐 Deployment

### Backend Deployment (Render)

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set the following environment variables in Render:
   - `MONGODB_URI`
   - `BSC_TESTNET_RPC_URL`
   - `ADMIN_PRIVATE_KEY`
   - `PREDICTION_CONTRACT_ADDRESS`
   - `VAULT_CONTRACT_ADDRESS`
   - `NODE_ENV=production`

4. Deploy and note the Render URL (e.g., `https://darkbet.onrender.com`)

### Frontend Deployment (Vercel)

1. Connect your GitHub repository to Vercel
2. Set the following environment variables in Vercel:
   - `NEXT_PUBLIC_PRIVY_APP_ID`
   - `NEXT_PUBLIC_PREDICTION_CONTRACT_ADDRESS`
   - `NEXT_PUBLIC_VAULT_CONTRACT_ADDRESS`
   - `NEXT_PUBLIC_BACKEND_URL=https://your-render-app.onrender.com`

3. Deploy

## 📁 Project Structure

```
darkbet/
├── app/                    # Next.js app directory
│   ├── api/               # Vercel API routes (proxy to backend)
│   ├── my-bets/           # User bets page
│   ├── leaderboard/       # Leaderboard page
│   └── how-it-works/      # How it works page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── prediction/       # Prediction-related components
│   └── layout/           # Layout components
├── lib/                  # Utility libraries
│   ├── api-client.ts     # API client for backend communication
│   ├── blockchain-utils.ts # Blockchain utilities
│   └── hooks/            # Custom React hooks
├── backend/              # Backend server
│   ├── src/
│   │   ├── models/       # MongoDB models
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   └── server.ts     # Express server
│   └── package.json
├── contracts/            # Smart contracts
│   ├── contracts/        # Solidity contracts
│   ├── scripts/          # Deployment scripts
│   └── hardhat.config.ts
└── types/               # TypeScript type definitions
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)

- `MONGODB_URI`: MongoDB connection string
- `BSC_TESTNET_RPC_URL`: BNB Smart Chain RPC endpoint
- `ADMIN_PRIVATE_KEY`: Private key for market resolution
- `PREDICTION_CONTRACT_ADDRESS`: Deployed prediction contract address
- `VAULT_CONTRACT_ADDRESS`: Deployed vault contract address

#### Frontend (.env.local)

- `NEXT_PUBLIC_PRIVY_APP_ID`: Privy application ID
- `NEXT_PUBLIC_BACKEND_URL`: Backend URL (development only)
- `NEXT_PUBLIC_PREDICTION_CONTRACT_ADDRESS`: Prediction contract address
- `NEXT_PUBLIC_VAULT_CONTRACT_ADDRESS`: Vault contract address

### Smart Contract Configuration

1. Deploy contracts to BNB Smart Chain Testnet
2. Update contract addresses in both frontend and backend
3. Ensure admin private key has sufficient BNB for gas fees

## 🎯 Usage

### Creating a Prediction Market

1. Connect your wallet using Privy
2. Click "Start DarkPool Betting" on the homepage
3. Fill in market details:
   - Title and description
   - Category (General, Crypto, Sports, etc.)
   - Resolution date
   - Initial BNB amount
4. Submit the transaction

### Placing Bets

1. Browse active markets on the homepage
2. Click on a market to view details
3. Choose YES or NO prediction
4. Enter bet amount
5. Confirm transaction

### Claiming Winnings

1. Go to "My Bets" page
2. View your bet history
3. Click "Claim Winnings" for resolved markets
4. Confirm transaction

## 🛠️ Development

### Running in Development Mode

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

### Available Scripts

#### Backend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run fix-null-outcomes` - Fix markets with null outcomes

#### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

#### Smart Contracts

- `npx hardhat compile` - Compile contracts
- `npx hardhat test` - Run tests
- `npx hardhat run scripts/deploy.js --network bscTestnet` - Deploy contracts

## 🔍 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend CORS is configured for your frontend domain
2. **Contract Not Found**: Verify contract addresses are correct in environment variables
3. **Database Connection**: Check MongoDB URI and network connectivity
4. **Wallet Connection**: Ensure Privy App ID is correctly configured

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` in your backend environment.

## 📊 API Endpoints

### Markets

- `GET /api/markets` - List all markets
- `POST /api/markets` - Create new market
- `GET /api/markets/:id` - Get market details
- `POST /api/markets/trigger-resolution` - Trigger market resolution

### Users

- `GET /api/users/:address/bets` - Get user's bets
- `GET /api/users/leaderboard` - Get leaderboard data

### Oracle

- `GET /api/oracle/prices` - Get cryptocurrency prices

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

- Create an issue in the GitHub repository
- Check the troubleshooting section above
- Review the API documentation

## 🔮 Roadmap

- [ ] Mainnet deployment
- [ ] Additional prediction categories
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] Social features
- [ ] Governance token

---

**Built with ❤️ for the decentralized future of prediction markets**
