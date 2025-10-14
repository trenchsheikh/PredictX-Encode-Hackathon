#!/bin/bash

echo "🚀 Setting up DarkBet - DarkPool Betting Platform"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

# Install contract dependencies
echo "📦 Installing contract dependencies..."
cd ../contracts
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install contract dependencies"
    exit 1
fi

cd ..

echo ""
echo "✅ Dependencies installed successfully!"
echo ""
echo "🔧 Next steps:"
echo "1. Set up your environment variables:"
echo "   - Copy .env.example to .env in the backend directory"
echo "   - Copy .env.local.example to .env.local in the root directory"
echo "   - Fill in your MongoDB URI, Privy App ID, and contract addresses"
echo ""
echo "2. Deploy smart contracts:"
echo "   cd contracts"
echo "   npx hardhat run scripts/deploy.js --network bscTestnet"
echo ""
echo "3. Start the backend:"
echo "   cd ../backend"
echo "   npm run dev"
echo ""
echo "4. Start the frontend (in a new terminal):"
echo "   npm run dev"
echo ""
echo "🌐 Your app will be available at http://localhost:3000"
echo ""
echo "📚 For detailed instructions, see README.md"
