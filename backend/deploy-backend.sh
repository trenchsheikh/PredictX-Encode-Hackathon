#!/bin/bash

echo "🚀 Deploying DarkBet Backend with CORS fix..."

# Build the backend
echo "📦 Building backend..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"

# If using Git deployment, commit and push
echo "📤 Committing changes..."
git add .
git commit -m "Fix CORS configuration and add debugging endpoints"
git push origin main

echo "✅ Changes pushed to repository!"
echo "🔄 Render should automatically redeploy the backend..."
echo "⏳ Please wait a few minutes for deployment to complete."
echo ""
echo "🧪 Test endpoints:"
echo "  - Health: https://darkbet.onrender.com/health"
echo "  - Test: https://darkbet.onrender.com/test"
echo "  - Markets: https://darkbet.onrender.com/api/markets"
