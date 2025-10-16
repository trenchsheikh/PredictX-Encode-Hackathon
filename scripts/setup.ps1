Write-Host "🚀 Setting up DarkBet - DarkPool Betting Platform" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node -v
    Write-Host "✅ Node.js $nodeVersion detected" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

# Check Node.js version
$version = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
if ($version -lt 18) {
    Write-Host "❌ Node.js version 18+ is required. Current version: $nodeVersion" -ForegroundColor Red
    exit 1
}

# Install frontend dependencies
Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install frontend dependencies" -ForegroundColor Red
    exit 1
}

# Install backend dependencies
Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install backend dependencies" -ForegroundColor Red
    exit 1
}

# Install contract dependencies
Write-Host "📦 Installing contract dependencies..." -ForegroundColor Yellow
Set-Location ../contracts
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install contract dependencies" -ForegroundColor Red
    exit 1
}

Set-Location ..

Write-Host ""
Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "🔧 Next steps:" -ForegroundColor Cyan
Write-Host "1. Set up your environment variables:" -ForegroundColor White
Write-Host "   - Copy .env.example to .env in the backend directory" -ForegroundColor Gray
Write-Host "   - Copy .env.local.example to .env.local in the root directory" -ForegroundColor Gray
Write-Host "   - Fill in your MongoDB URI, Privy App ID, and contract addresses" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Deploy smart contracts:" -ForegroundColor White
Write-Host "   cd contracts" -ForegroundColor Gray
Write-Host "   npx hardhat run scripts/deploy.js --network bscTestnet" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Start the backend:" -ForegroundColor White
Write-Host "   cd ../backend" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Start the frontend (in a new terminal):" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "🌐 Your app will be available at http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "📚 For detailed instructions, see README.md" -ForegroundColor Cyan
