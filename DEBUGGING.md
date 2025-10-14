# 🐛 Debugging Guide - Transaction Failures

## Common Issues When Creating Markets

### 1. **Check Browser Console**
Open your browser's developer console (F12) and look for detailed error messages. You should now see:
```
Contract error: [Actual error message]
```

---

## Common Errors and Solutions

### ❌ Error: "Please connect your wallet first"
**Cause:** Privy wallet not connected  
**Solution:**
1. Click "Connect Wallet" in the header
2. Sign in with Privy
3. Approve wallet connection

---

### ❌ Error: "Failed to get contract instance"
**Cause:** Contract ABI or address not loaded  

**Solution:**
1. Check `.env.local` file exists in project root:
```env
NEXT_PUBLIC_PREDICTION_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_VAULT_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_CHAIN_ID=97
```

2. Verify contract deployment files exist:
```bash
ls deployments/bscTestnet/PredictionMarket.json
ls deployments/bscTestnet/Vault.json
```

3. If files are missing, copy them from contracts folder:
```bash
cp contracts/deployments/bscTestnet/* deployments/bscTestnet/
```

---

### ❌ Error: "Network error" or "Wrong network"
**Cause:** Not connected to BSC Testnet  

**Solution:**
1. Open MetaMask/wallet
2. Switch to BSC Testnet (Chain ID: 97)
3. Or approve the automatic network switch prompt

**Add BSC Testnet to MetaMask:**
- Network Name: BSC Testnet
- RPC URL: https://data-seed-prebsc-1-s1.binance.org:8545/
- Chain ID: 97
- Currency Symbol: BNB
- Block Explorer: https://testnet.bscscan.com/

---

### ❌ Error: "Insufficient funds" or "Insufficient balance"
**Cause:** Not enough BNB for transaction + gas  

**Solution:**
1. Get test BNB from faucet: https://testnet.binance.org/faucet-smart
2. Wait 5-10 minutes for BNB to arrive
3. Check balance in wallet
4. Retry transaction

**Minimum Required:**
- Initial liquidity: 0.01 BNB (minimum)
- Gas fees: ~0.001-0.005 BNB
- **Total needed:** ~0.015 BNB

---

### ❌ Error: "Transaction rejected by user"
**Cause:** User cancelled MetaMask popup  

**Solution:**
1. Retry the operation
2. Approve the transaction in MetaMask
3. Make sure you're not closing the popup accidentally

---

### ❌ Error: "Gas estimation failed"
**Cause:** Contract will revert, or invalid parameters  

**Possible Issues:**

#### A. Expiration date in the past
**Check:** Is your expiration date > 1 hour from now?
```javascript
// In create-bet-modal.tsx
// Expiration must be at least 1 hour in future
const minDate = new Date(Date.now() + 3600000);
```

**Solution:** Set expiration date to future time

#### B. Invalid category
**Check:** Category must be 0-7
```javascript
['sports', 'crypto', 'politics', 'entertainment', 'weather', 'finance', 'technology', 'custom']
```

**Solution:** Ensure category is in the list above

#### C. Invalid BNB amount
**Check:** Amount must be > 0
```javascript
// Minimum: 0.001 BNB
// Maximum: 100 BNB
```

**Solution:** Use valid amount range

#### D. Contract not deployed
**Check:** Is the contract address valid?
```bash
# Open browser console
console.log(process.env.NEXT_PUBLIC_PREDICTION_CONTRACT_ADDRESS);
```

**Solution:** Deploy contracts first (see DEPLOYMENT.md)

---

### ❌ Error: "Transaction timeout"
**Cause:** Transaction took >2 minutes  

**Solution:**
1. Check BSCScan with transaction hash
2. If pending, wait longer
3. If failed, check revert reason on BSCScan
4. Retry with higher gas price

---

### ❌ Error: "Nonce too low" or "Replacement transaction underpriced"
**Cause:** Pending transaction or MetaMask nonce issue  

**Solution:**
1. Wait for pending transaction to complete
2. Or reset MetaMask account:
   - Settings → Advanced → Reset Account
   - This clears pending transactions

---

## Debugging Steps Checklist

Run through this checklist to diagnose issues:

### 1. Environment Check
```bash
# Check .env.local exists
cat .env.local

# Should contain:
# NEXT_PUBLIC_PREDICTION_CONTRACT_ADDRESS=0x...
# NEXT_PUBLIC_VAULT_CONTRACT_ADDRESS=0x...
# NEXT_PUBLIC_CHAIN_ID=97
# NEXT_PUBLIC_PRIVY_APP_ID=...
```

### 2. Wallet Check
```javascript
// In browser console (F12)
// Check if wallet is connected
console.log('Authenticated:', authenticated);
console.log('User address:', user?.wallet?.address);
console.log('Network:', await provider.getNetwork());
```

### 3. Contract Check
```javascript
// In browser console
// Check if contract address is set
console.log('Contract address:', process.env.NEXT_PUBLIC_PREDICTION_CONTRACT_ADDRESS);

// Check if ABI loaded
fetch('/deployments/bscTestnet/PredictionMarket.json')
  .then(r => r.json())
  .then(abi => console.log('ABI loaded:', abi.length, 'functions'));
```

### 4. Balance Check
```javascript
// In browser console
const balance = await provider.getBalance(user.wallet.address);
console.log('Balance:', ethers.formatEther(balance), 'BNB');

// Need at least 0.015 BNB for testing
```

### 5. Transaction Parameters Check
```javascript
// Check what's being sent
console.log({
  title: data.title,
  description: data.description,
  category: category, // Should be 0-7
  expiresAt: expiresAtTimestamp, // Should be Unix timestamp in future
  initialLiquidity: data.bnbAmount // Should be > 0
});
```

### 6. Contract Method Check
```javascript
// Try calling contract directly in console
const contract = new ethers.Contract(
  process.env.NEXT_PUBLIC_PREDICTION_CONTRACT_ADDRESS,
  abi,
  signer
);

// Try reading from contract first (no transaction)
const marketCount = await contract.marketCount();
console.log('Market count:', marketCount);

// If this fails, contract isn't deployed or address is wrong
```

---

## Testing with Hardhat Local Network

If BSC Testnet has issues, test locally first:

### 1. Start Local Node
```bash
cd contracts
npx hardhat node
```

### 2. Deploy Locally
```bash
npx hardhat run scripts/deploy.ts --network localhost
```

### 3. Update Frontend .env.local
```env
NEXT_PUBLIC_PREDICTION_CONTRACT_ADDRESS=0x... # From deployment output
NEXT_PUBLIC_CHAIN_ID=31337 # Hardhat network
```

### 4. Connect MetaMask to Localhost
- Network Name: Hardhat Local
- RPC URL: http://127.0.0.1:8545/
- Chain ID: 31337
- Currency Symbol: ETH

### 5. Import Test Account
```
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

---

## Get Detailed Error from Contract

Add more logging to see exactly what's failing:

```javascript
// In use-prediction-contract.ts, add console.log
console.log('Creating market with:', {
  title,
  description,
  summary,
  resolutionInstructions,
  category,
  expiresAt,
  initialLiquidity
});

// Before transaction
console.log('Gas limit:', gasLimit);
console.log('Liquidity Wei:', liquidityWei.toString());

// Check contract exists
console.log('Contract address:', contract.address);
console.log('Contract signer:', await contract.signer.getAddress());
```

---

## Common Smart Contract Revert Reasons

### "Must expire at least 1 hour from now"
```solidity
require(expiresAt >= block.timestamp + 1 hours, "Must expire at least 1 hour from now");
```
**Fix:** Set expiration date at least 1 hour in the future

### "Initial liquidity required"
```solidity
require(msg.value > 0, "Initial liquidity required");
```
**Fix:** Send BNB with transaction (initialLiquidity > 0)

### "Invalid category"
```solidity
require(category <= 7, "Invalid category");
```
**Fix:** Use category 0-7 only

---

## Still Having Issues?

### Check Backend Logs
```bash
cd backend
npm run dev

# Look for errors in console
```

### Check Frontend Logs
```bash
# In project root
npm run dev

# Look for compilation errors
```

### Verify Contract on BSCScan
1. Go to https://testnet.bscscan.com/
2. Search for your contract address
3. Check if contract is verified
4. Try calling functions directly on BSCScan

### Get Help
1. Export browser console logs
2. Copy transaction hash (if any)
3. Note exact error message
4. Share contract address
5. Share network (BSC Testnet / Localhost)

---

## Quick Fix Commands

```bash
# Reset everything
npm run clean
npm install
npm run dev

# Clear browser cache
# Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

# Reset MetaMask
# Settings → Advanced → Reset Account

# Get fresh test BNB
# Visit: https://testnet.binance.org/faucet-smart
```

---

## Example Working Transaction

Here's what a successful transaction looks like:

```javascript
// Input
{
  title: "Will BNB reach $1000 by Dec 2025?",
  description: "Price prediction for BNB...",
  summary: "AI-generated analysis...",
  resolutionInstructions: "Check CoinGecko on Dec 31, 2025",
  category: 1, // crypto
  expiresAt: 1735689600, // Dec 31, 2025 00:00:00 GMT
  initialLiquidity: "0.1" // 0.1 BNB
}

// Output
{
  success: true,
  txHash: "0x1234567890abcdef...",
  marketId: 1
}
```

**BSCScan Receipt:**
- Status: Success
- Gas Used: ~450,000
- Value: 0.1 BNB
- Event: MarketCreated(marketId=1, ...)

---

**Good luck debugging! 🐛→🦋**

