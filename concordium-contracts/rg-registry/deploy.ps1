# Concordium RG Registry Deployment Script (PowerShell)
# Usage: .\deploy.ps1 [testnet|mainnet]

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet('testnet', 'mainnet')]
    [string]$Network = 'testnet'
)

$ErrorActionPreference = "Stop"

# Configuration
$CONTRACT_NAME = "darkbet_rg_registry"
$WASM_FILE = "rg_registry.wasm.v1"
$ACCOUNT_NAME = if ($env:CONCORDIUM_ACCOUNT) { $env:CONCORDIUM_ACCOUNT } else { "my-account" }

Write-Host "╔════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  Concordium RG Registry Deployment Script     ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

Write-Host "📡 Network: " -NoNewline -ForegroundColor Yellow
Write-Host $Network
Write-Host "👤 Account: " -NoNewline -ForegroundColor Yellow
Write-Host $ACCOUNT_NAME
Write-Host ""

# Check dependencies
Write-Host "🔍 Checking dependencies..." -ForegroundColor Yellow

if (-not (Get-Command cargo -ErrorAction SilentlyContinue)) {
    Write-Host "❌ cargo not found. Please install Rust from https://rustup.rs" -ForegroundColor Red
    exit 1
}

if (-not (Get-Command cargo-concordium -ErrorAction SilentlyContinue)) {
    Write-Host "❌ cargo-concordium not found. Installing..." -ForegroundColor Red
    cargo install --locked cargo-concordium
}

if (-not (Get-Command concordium-client -ErrorAction SilentlyContinue)) {
    Write-Host "❌ concordium-client not found. Please install from:" -ForegroundColor Red
    Write-Host "   https://developer.concordium.software/en/mainnet/net/installation/downloads-testnet.html"
    exit 1
}

Write-Host "✅ All dependencies found" -ForegroundColor Green
Write-Host ""

# Step 1: Build the contract
Write-Host "🔨 Step 1: Building smart contract..." -ForegroundColor Yellow
cargo concordium build --out $WASM_FILE --schema-embed

if (-not (Test-Path $WASM_FILE)) {
    Write-Host "❌ Build failed: $WASM_FILE not found" -ForegroundColor Red
    exit 1
}

$WASM_SIZE = (Get-Item $WASM_FILE).Length / 1KB
Write-Host "✅ Contract built successfully" -ForegroundColor Green
Write-Host "   Size: $([math]::Round($WASM_SIZE, 2)) KB"
Write-Host ""

# Step 2: Configure network
Write-Host "🌐 Step 2: Configuring network..." -ForegroundColor Yellow

if ($Network -eq "testnet") {
    $NODE_URL = "https://grpc.testnet.concordium.com:20000"
    $EXPLORER = "https://testnet.ccdscan.io"
} else {
    $NODE_URL = "https://grpc.mainnet.concordium.software:20000"
    $EXPLORER = "https://ccdscan.io"
}

# Try to add node (ignore if exists)
try {
    concordium-client config node add $Network $NODE_URL --secure 2>$null
} catch {}

concordium-client config node use $Network

Write-Host "✅ Network configured: $Network" -ForegroundColor Green
Write-Host ""

# Step 3: Check account balance
Write-Host "💰 Step 3: Checking account balance..." -ForegroundColor Yellow

try {
    $BALANCE_OUTPUT = concordium-client account show-balance $ACCOUNT_NAME 2>&1 | Out-String
    if ($BALANCE_OUTPUT -match "Total:\s+([\d.]+)\s+CCD") {
        $BALANCE = [double]$matches[1]
        Write-Host "   Balance: " -NoNewline
        Write-Host "$BALANCE CCD" -ForegroundColor Green
        
        $REQUIRED = 100
        if ($BALANCE -lt $REQUIRED) {
            Write-Host "❌ Insufficient balance. Required: $REQUIRED CCD" -ForegroundColor Red
            if ($Network -eq "testnet") {
                Write-Host "   Get test CCDs from: https://testnet.ccdscan.io/"
            }
            exit 1
        }
    }
} catch {
    Write-Host "❌ Account not found: $ACCOUNT_NAME" -ForegroundColor Red
    Write-Host "   Please import your account first:"
    Write-Host "   concordium-client config account import <account.export> --name $ACCOUNT_NAME"
    exit 1
}

Write-Host "✅ Sufficient balance" -ForegroundColor Green
Write-Host ""

# Step 4: Deploy module
Write-Host "📤 Step 4: Deploying module to blockchain..." -ForegroundColor Yellow
Write-Host "   This may take 1-2 minutes..."

$DEPLOY_OUTPUT = concordium-client module deploy $WASM_FILE `
    --sender $ACCOUNT_NAME `
    --grpc-port 20000 2>&1 | Out-String

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Module deployment failed" -ForegroundColor Red
    Write-Host $DEPLOY_OUTPUT
    exit 1
}

# Extract module reference
if ($DEPLOY_OUTPUT -match "Module reference:\s+([a-f0-9]+)") {
    $MODULE_REF = $matches[1]
} else {
    Write-Host "❌ Could not extract module reference" -ForegroundColor Red
    Write-Host $DEPLOY_OUTPUT
    exit 1
}

Write-Host "✅ Module deployed successfully" -ForegroundColor Green
Write-Host "   Module Reference: " -NoNewline
Write-Host $MODULE_REF -ForegroundColor Yellow
Write-Host ""

# Save module reference
$MODULE_REF | Out-File -FilePath "module_reference.txt" -Encoding UTF8

# Step 5: Get account address for init params
Write-Host "🔧 Step 5: Preparing initialization..." -ForegroundColor Yellow

$ACCOUNT_OUTPUT = concordium-client account show $ACCOUNT_NAME 2>&1 | Out-String
if ($ACCOUNT_OUTPUT -match "Address:\s+([a-zA-Z0-9]+)") {
    $ACCOUNT_ADDRESS = $matches[1]
} else {
    Write-Host "❌ Could not get account address" -ForegroundColor Red
    exit 1
}

# Create init params
$INIT_PARAMS = @{
    admin = $ACCOUNT_ADDRESS
} | ConvertTo-Json

$INIT_PARAMS | Out-File -FilePath "init_params.json" -Encoding UTF8

Write-Host "   Admin Address: " -NoNewline
Write-Host $ACCOUNT_ADDRESS -ForegroundColor Yellow
Write-Host ""

# Step 6: Initialize contract
Write-Host "🚀 Step 6: Initializing contract..." -ForegroundColor Yellow

$INIT_OUTPUT = concordium-client contract init $MODULE_REF `
    --contract $CONTRACT_NAME `
    --sender $ACCOUNT_NAME `
    --energy 10000 `
    --parameter-json init_params.json `
    --grpc-port 20000 2>&1 | Out-String

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Contract initialization failed" -ForegroundColor Red
    Write-Host $INIT_OUTPUT
    exit 1
}

# Extract contract address
if ($INIT_OUTPUT -match "Contract successfully initialized with address: <(\d+)") {
    $CONTRACT_INDEX = $matches[1]
} else {
    Write-Host "❌ Could not extract contract address" -ForegroundColor Red
    Write-Host $INIT_OUTPUT
    exit 1
}

Write-Host "✅ Contract initialized successfully" -ForegroundColor Green
Write-Host "   Contract Address: " -NoNewline
Write-Host $CONTRACT_INDEX -ForegroundColor Yellow
Write-Host ""

# Save contract address
$CONTRACT_INDEX | Out-File -FilePath "contract_address.txt" -Encoding UTF8

# Step 7: Verify deployment
Write-Host "✔️  Step 7: Verifying deployment..." -ForegroundColor Yellow

try {
    concordium-client contract show $CONTRACT_INDEX 2>&1 | Out-Null
    Write-Host "✅ Contract verified on blockchain" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Warning: Could not verify contract" -ForegroundColor Yellow
}

Write-Host ""

# Final summary
Write-Host "╔════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║         🎉 DEPLOYMENT SUCCESSFUL! 🎉           ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Deployment Summary:" -ForegroundColor Yellow
Write-Host "   Network:          " -NoNewline
Write-Host $Network -ForegroundColor Green
Write-Host "   Module Reference: " -NoNewline
Write-Host $MODULE_REF -ForegroundColor Yellow
Write-Host "   Contract Address: " -NoNewline
Write-Host $CONTRACT_INDEX -ForegroundColor Yellow
Write-Host "   Admin:            " -NoNewline
Write-Host $ACCOUNT_ADDRESS -ForegroundColor Yellow
Write-Host ""
Write-Host "🔗 Explorer Links:" -ForegroundColor Yellow
Write-Host "   Contract: " -NoNewline
Write-Host "$EXPLORER/contract/$CONTRACT_INDEX" -ForegroundColor Yellow
Write-Host "   Account:  " -NoNewline
Write-Host "$EXPLORER/account/$ACCOUNT_ADDRESS" -ForegroundColor Yellow
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Update your .env.local:"
Write-Host "      CONCORDIUM_RG_CONTRACT_ADDRESS=$CONTRACT_INDEX" -ForegroundColor Green
Write-Host "      CONCORDIUM_RG_CONTRACT_INDEX=$CONTRACT_INDEX" -ForegroundColor Green
Write-Host "      CONCORDIUM_NETWORK=$Network" -ForegroundColor Green
Write-Host ""
Write-Host "   2. Restart your dev server:"
Write-Host "      npm run dev" -ForegroundColor Green
Write-Host ""
Write-Host "✨ Contract is ready to use!" -ForegroundColor Green
Write-Host ""

# Save deployment info
$DEPLOYMENT_INFO = @{
    network = $Network
    moduleReference = $MODULE_REF
    contractAddress = $CONTRACT_INDEX
    admin = $ACCOUNT_ADDRESS
    deployedAt = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
    explorerUrl = "$EXPLORER/contract/$CONTRACT_INDEX"
} | ConvertTo-Json

$DEPLOYMENT_INFO | Out-File -FilePath "deployment_info.json" -Encoding UTF8

Write-Host "💾 Deployment info saved to:" -ForegroundColor Yellow
Write-Host "   - module_reference.txt"
Write-Host "   - contract_address.txt"
Write-Host "   - deployment_info.json"
Write-Host ""

exit 0

