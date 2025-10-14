Write-Host "🚀 Deploying DarkBet Backend with CORS fix..." -ForegroundColor Green

# Build the backend
Write-Host "📦 Building backend..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build successful!" -ForegroundColor Green

# If using Git deployment, commit and push
Write-Host "📤 Committing changes..." -ForegroundColor Yellow
git add .
git commit -m "Fix CORS configuration and add debugging endpoints"
git push origin main

Write-Host "✅ Changes pushed to repository!" -ForegroundColor Green
Write-Host "🔄 Render should automatically redeploy the backend..." -ForegroundColor Cyan
Write-Host "⏳ Please wait a few minutes for deployment to complete." -ForegroundColor Yellow
Write-Host ""
Write-Host "🧪 Test endpoints:" -ForegroundColor Cyan
Write-Host "  - Health: https://darkbet.onrender.com/health" -ForegroundColor White
Write-Host "  - Test: https://darkbet.onrender.com/test" -ForegroundColor White
Write-Host "  - Markets: https://darkbet.onrender.com/api/markets" -ForegroundColor White
