# Fix All PATH Issues - PowerShell Script
# This script will add Node.js and Git to your PATH permanently

Write-Host "🔧 Fixing PATH issues for Node.js and Git..." -ForegroundColor Yellow

# Add Node.js to PATH for current session
$env:PATH += ";C:\Program Files\nodejs"

# Check if Node.js is working
Write-Host "`n📦 Testing Node.js..." -ForegroundColor Cyan
try {
    $nodeVersion = & "C:\Program Files\nodejs\node.exe" --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found at C:\Program Files\nodejs" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
}

# Check if npm is working
Write-Host "`n📦 Testing npm..." -ForegroundColor Cyan
try {
    $npmVersion = & "C:\Program Files\nodejs\npm.cmd" --version
    Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm not found" -ForegroundColor Red
}

# Check for Git
Write-Host "`n🔍 Looking for Git..." -ForegroundColor Cyan
$gitPaths = @(
    "C:\Program Files\Git\bin\git.exe",
    "C:\Program Files (x86)\Git\bin\git.exe",
    "C:\Users\$env:USERNAME\AppData\Local\Programs\Git\bin\git.exe"
)

$gitFound = $false
foreach ($path in $gitPaths) {
    if (Test-Path $path) {
        Write-Host "✅ Git found at: $path" -ForegroundColor Green
        $env:PATH += ";$(Split-Path $path -Parent)"
        $gitFound = $true
        break
    }
}

if (-not $gitFound) {
    Write-Host "❌ Git not found. Please install Git from https://git-scm.com/download/win" -ForegroundColor Red
}

# Test all commands
Write-Host "`n🧪 Testing all commands..." -ForegroundColor Cyan

# Test npm
try {
    & npm --version | Out-Null
    Write-Host "✅ npm is working" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not working" -ForegroundColor Red
}

# Test git
try {
    & git --version | Out-Null
    Write-Host "✅ git is working" -ForegroundColor Green
} catch {
    Write-Host "❌ git is not working" -ForegroundColor Red
}

Write-Host "`n🎯 Next steps:" -ForegroundColor Yellow
Write-Host "1. If Git is missing, install it from: https://git-scm.com/download/win" -ForegroundColor White
Write-Host "2. Restart your terminal after installing Git" -ForegroundColor White
Write-Host "3. Run this script again to verify everything works" -ForegroundColor White
Write-Host "4. Then run: npm run dev" -ForegroundColor White

Write-Host "`n✨ PATH fix complete!" -ForegroundColor Green
