#!/bin/bash
# Concordium RG Registry Deployment Script
# Usage: ./deploy.sh [testnet|mainnet]

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
NETWORK=${1:-testnet}
CONTRACT_NAME="darkbet_rg_registry"
WASM_FILE="rg_registry.wasm.v1"
ACCOUNT_NAME=${CONCORDIUM_ACCOUNT:-"my-account"}

echo -e "${GREEN}╔════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  Concordium RG Registry Deployment Script     ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════╝${NC}"
echo ""

# Check network
if [ "$NETWORK" != "testnet" ] && [ "$NETWORK" != "mainnet" ]; then
    echo -e "${RED}❌ Invalid network: $NETWORK${NC}"
    echo -e "Usage: ./deploy.sh [testnet|mainnet]"
    exit 1
fi

echo -e "${YELLOW}📡 Network:${NC} $NETWORK"
echo -e "${YELLOW}👤 Account:${NC} $ACCOUNT_NAME"
echo ""

# Check dependencies
echo -e "${YELLOW}🔍 Checking dependencies...${NC}"

if ! command -v cargo &> /dev/null; then
    echo -e "${RED}❌ cargo not found. Please install Rust.${NC}"
    exit 1
fi

if ! command -v cargo-concordium &> /dev/null; then
    echo -e "${RED}❌ cargo-concordium not found. Installing...${NC}"
    cargo install --locked cargo-concordium
fi

if ! command -v concordium-client &> /dev/null; then
    echo -e "${RED}❌ concordium-client not found. Please install from:${NC}"
    echo -e "   https://developer.concordium.software/en/mainnet/net/installation/downloads-testnet.html"
    exit 1
fi

echo -e "${GREEN}✅ All dependencies found${NC}"
echo ""

# Step 1: Build the contract
echo -e "${YELLOW}🔨 Step 1: Building smart contract...${NC}"
cargo concordium build --out $WASM_FILE --schema-embed

if [ ! -f "$WASM_FILE" ]; then
    echo -e "${RED}❌ Build failed: $WASM_FILE not found${NC}"
    exit 1
fi

WASM_SIZE=$(du -h $WASM_FILE | cut -f1)
echo -e "${GREEN}✅ Contract built successfully${NC}"
echo -e "   Size: $WASM_SIZE"
echo ""

# Step 2: Configure network
echo -e "${YELLOW}🌐 Step 2: Configuring network...${NC}"

if [ "$NETWORK" = "testnet" ]; then
    NODE_URL="https://grpc.testnet.concordium.com:20000"
    EXPLORER="https://testnet.ccdscan.io"
else
    NODE_URL="https://grpc.mainnet.concordium.software:20000"
    EXPLORER="https://ccdscan.io"
fi

# Check if node exists, if not add it
if ! concordium-client config node show $NETWORK &> /dev/null; then
    concordium-client config node add $NETWORK $NODE_URL --secure
fi

concordium-client config node use $NETWORK

echo -e "${GREEN}✅ Network configured: $NETWORK${NC}"
echo ""

# Step 3: Check account balance
echo -e "${YELLOW}💰 Step 3: Checking account balance...${NC}"

if ! concordium-client account show-balance $ACCOUNT_NAME &> /dev/null; then
    echo -e "${RED}❌ Account not found: $ACCOUNT_NAME${NC}"
    echo -e "   Please import your account first:"
    echo -e "   concordium-client config account import <account.export> --name $ACCOUNT_NAME"
    exit 1
fi

BALANCE=$(concordium-client account show-balance $ACCOUNT_NAME | grep "Total" | awk '{print $3}')
echo -e "   Balance: ${GREEN}$BALANCE CCD${NC}"

# Check minimum balance
REQUIRED=100
if (( $(echo "$BALANCE < $REQUIRED" | bc -l) )); then
    echo -e "${RED}❌ Insufficient balance. Required: $REQUIRED CCD${NC}"
    if [ "$NETWORK" = "testnet" ]; then
        echo -e "   Get test CCDs from: https://testnet.ccdscan.io/"
    fi
    exit 1
fi

echo -e "${GREEN}✅ Sufficient balance${NC}"
echo ""

# Step 4: Deploy module
echo -e "${YELLOW}📤 Step 4: Deploying module to blockchain...${NC}"
echo -e "   This may take 1-2 minutes..."

DEPLOY_OUTPUT=$(concordium-client module deploy $WASM_FILE \
    --sender $ACCOUNT_NAME \
    --grpc-port 20000 2>&1)

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Module deployment failed${NC}"
    echo "$DEPLOY_OUTPUT"
    exit 1
fi

# Extract module reference
MODULE_REF=$(echo "$DEPLOY_OUTPUT" | grep -oP 'Module reference: \K[a-f0-9]+' | head -1)

if [ -z "$MODULE_REF" ]; then
    echo -e "${RED}❌ Could not extract module reference${NC}"
    echo "$DEPLOY_OUTPUT"
    exit 1
fi

echo -e "${GREEN}✅ Module deployed successfully${NC}"
echo -e "   Module Reference: ${YELLOW}$MODULE_REF${NC}"
echo ""

# Save module reference
echo "$MODULE_REF" > module_reference.txt

# Step 5: Get account address for init params
echo -e "${YELLOW}🔧 Step 5: Preparing initialization...${NC}"

ACCOUNT_ADDRESS=$(concordium-client account show $ACCOUNT_NAME | grep "Address" | awk '{print $2}')

# Create init params
cat > init_params.json <<EOF
{
  "admin": "$ACCOUNT_ADDRESS"
}
EOF

echo -e "   Admin Address: ${YELLOW}$ACCOUNT_ADDRESS${NC}"
echo ""

# Step 6: Initialize contract
echo -e "${YELLOW}🚀 Step 6: Initializing contract...${NC}"

INIT_OUTPUT=$(concordium-client contract init $MODULE_REF \
    --contract "$CONTRACT_NAME" \
    --sender $ACCOUNT_NAME \
    --energy 10000 \
    --parameter-json init_params.json \
    --grpc-port 20000 2>&1)

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Contract initialization failed${NC}"
    echo "$INIT_OUTPUT"
    exit 1
fi

# Extract contract address
CONTRACT_INDEX=$(echo "$INIT_OUTPUT" | grep -oP 'Contract successfully initialized with address: <\K[0-9]+' | head -1)

if [ -z "$CONTRACT_INDEX" ]; then
    echo -e "${RED}❌ Could not extract contract address${NC}"
    echo "$INIT_OUTPUT"
    exit 1
fi

echo -e "${GREEN}✅ Contract initialized successfully${NC}"
echo -e "   Contract Address: ${YELLOW}$CONTRACT_INDEX${NC}"
echo ""

# Save contract address
echo "$CONTRACT_INDEX" > contract_address.txt

# Step 7: Verify deployment
echo -e "${YELLOW}✔️  Step 7: Verifying deployment...${NC}"

VERIFY_OUTPUT=$(concordium-client contract show $CONTRACT_INDEX 2>&1)

if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠️  Warning: Could not verify contract${NC}"
else
    echo -e "${GREEN}✅ Contract verified on blockchain${NC}"
fi

echo ""

# Final summary
echo -e "${GREEN}╔════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║         🎉 DEPLOYMENT SUCCESSFUL! 🎉           ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}📋 Deployment Summary:${NC}"
echo -e "   Network:          ${GREEN}$NETWORK${NC}"
echo -e "   Module Reference: ${YELLOW}$MODULE_REF${NC}"
echo -e "   Contract Address: ${YELLOW}$CONTRACT_INDEX${NC}"
echo -e "   Admin:            ${YELLOW}$ACCOUNT_ADDRESS${NC}"
echo ""
echo -e "${YELLOW}🔗 Explorer Links:${NC}"
echo -e "   Contract: ${YELLOW}$EXPLORER/contract/$CONTRACT_INDEX${NC}"
echo -e "   Account:  ${YELLOW}$EXPLORER/account/$ACCOUNT_ADDRESS${NC}"
echo ""
echo -e "${YELLOW}📝 Next Steps:${NC}"
echo -e "   1. Update your .env.local:"
echo -e "      ${GREEN}CONCORDIUM_RG_CONTRACT_ADDRESS=$CONTRACT_INDEX${NC}"
echo -e "      ${GREEN}CONCORDIUM_RG_CONTRACT_INDEX=$CONTRACT_INDEX${NC}"
echo -e "      ${GREEN}CONCORDIUM_NETWORK=$NETWORK${NC}"
echo ""
echo -e "   2. Test the contract:"
echo -e "      ${GREEN}npm run test:concordium${NC}"
echo ""
echo -e "   3. Restart your dev server:"
echo -e "      ${GREEN}npm run dev${NC}"
echo ""
echo -e "${GREEN}✨ Contract is ready to use!${NC}"
echo ""

# Save deployment info
cat > deployment_info.json <<EOF
{
  "network": "$NETWORK",
  "moduleReference": "$MODULE_REF",
  "contractAddress": "$CONTRACT_INDEX",
  "admin": "$ACCOUNT_ADDRESS",
  "deployedAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "explorerUrl": "$EXPLORER/contract/$CONTRACT_INDEX"
}
EOF

echo -e "${YELLOW}💾 Deployment info saved to:${NC}"
echo -e "   - module_reference.txt"
echo -e "   - contract_address.txt"
echo -e "   - deployment_info.json"
echo ""

exit 0

