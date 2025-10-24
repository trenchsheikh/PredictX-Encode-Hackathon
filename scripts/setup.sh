#!/bin/bash

echo "🚀 Setting up BNBPredict..."

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

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOF
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
EOF
    echo "✅ Created .env.local file. Please update with your actual values."
else
    echo "✅ .env.local already exists"
fi

# Run build to check for errors
echo "🔨 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🎉 Setup complete! Next steps:"
    echo "1. Update .env.local with your Privy app ID"
    echo "2. Run 'npm run dev' to start the development server"
    echo "3. Open http://localhost:3000 in your browser"
    echo ""
    echo "📚 For more information, see README.md"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi


