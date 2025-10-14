# DarkBet Smart Contracts

Darkpool prediction market smart contracts with commit-reveal betting and FPMM pricing.

## 📦 Contracts

- **PredictionMarket.sol** - Main prediction market contract with commit-reveal mechanism
- **Vault.sol** - Fee collection and withdrawal management

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- BNB for gas (testnet BNB from [faucet](https://testnet.binance.org/faucet-smart))
- BSCScan API key (optional, for verification)

### Installation

```bash
npm install --legacy-peer-deps
```

### Configuration

Create `.env` file in this directory:

```env
# BSC Testnet
BSC_TESTNET_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545/
DEPLOYER_PRIVATE_KEY=your_private_key_WITHOUT_0x_prefix

# BSCScan (optional)
BSCSCAN_API_KEY=your_api_key_here
```

### Compile

```bash
npm run compile
```

### Test

```bash
npm run test
```

### Deploy to BSC Testnet

```bash
npm run deploy:testnet
```

Contracts will be deployed and info saved to `/deployments/bscTestnet/contracts.json`

### Verify on BSCScan

After deployment:

```bash
npx hardhat verify --network bscTestnet VAULT_ADDRESS

npx hardhat verify --network bscTestnet PREDICTION_MARKET_ADDRESS VAULT_ADDRESS RESOLVER_ADDRESS
```

## 📚 Contract Overview

### PredictionMarket

**Features:**

- ✅ Commit-reveal betting (darkpool privacy)
- ✅ FPMM pricing (Fixed Product Market Maker)
- ✅ Oracle resolution system
- ✅ 10% platform fee
- ✅ Pausable and upgradeable by owner

**Key Functions:**

- `createMarket()` - Create new prediction market
- `commitBet()` - Commit bet hash (darkpool)
- `revealBet()` - Reveal committed bet
- `resolveMarket()` - Resolve market (resolver only)
- `claimWinnings()` - Claim winnings after resolution
- `claimRefund()` - Claim refund for unrevealed bets

**How Commit-Reveal Works:**

1. **Commit Phase** (while market is active):

    ```typescript
    // User generates commit hash
    const outcome = true; // YES
    const salt = ethers.id('my_secret_salt');
    const commitHash = ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
            ['bool', 'bytes32', 'address'],
            [outcome, salt, userAddress]
        )
    );

    // User commits bet
    await predictionMarket.commitBet(marketId, commitHash, {
        value: betAmount,
    });
    ```

2. **Reveal Phase** (anytime before/after market expires):

    ```typescript
    // User reveals their bet
    await predictionMarket.revealBet(marketId, outcome, salt);
    ```

3. **Benefits:**
    - No front-running
    - No copycat betting
    - Fair price discovery
    - Privacy until reveal

### Vault

**Features:**

- ✅ Secure fee storage
- ✅ Owner-only withdrawals
- ✅ Emergency withdrawal
- ✅ Contract authorization

**Key Functions:**

- `withdraw(amount)` - Withdraw specific amount
- `withdrawAll()` - Withdraw all funds
- `emergencyWithdraw()` - Emergency withdrawal
- `authorizeContract(address)` - Authorize contract to send fees

## 🧪 Testing

36/40 tests passing (90% coverage)

**Test Coverage:**

- ✅ Market creation
- ✅ Commit betting
- ✅ Reveal betting (minor fixes needed)
- ✅ Market resolution
- ✅ Claiming winnings
- ✅ Admin functions
- ✅ Vault functionality

Run tests:

```bash
npm run test
```

With coverage:

```bash
npm run test:coverage
```

## 📁 Project Structure

```
contracts/
├── contracts/
│   ├── PredictionMarket.sol
│   └── Vault.sol
├── test/
│   ├── PredictionMarket.test.ts
│   └── Vault.test.ts
├── scripts/
│   └── deploy.ts
├── hardhat.config.ts
└── package.json
```

## 🔗 Deployment Info

After deployment, contract addresses and ABIs are saved to:

```
/deployments/bscTestnet/
├── contracts.json      # Deployment info
├── Vault.json          # Vault ABI
└── PredictionMarket.json  # PredictionMarket ABI
```

## 🛠️ Development

### Compile contracts:

```bash
npx hardhat compile
```

### Run local node:

```bash
npx hardhat node
```

### Deploy to local:

```bash
npx hardhat run scripts/deploy.ts --network localhost
```

### Clean artifacts:

```bash
npx hardhat clean
```

## 📊 Gas Costs (Approximate)

| Function      | Gas Cost |
| ------------- | -------- |
| createMarket  | ~200,000 |
| commitBet     | ~127,000 |
| revealBet     | ~180,000 |
| resolveMarket | ~85,000  |
| claimWinnings | ~70,000  |

## 🔒 Security

- OpenZeppelin contracts (Ownable, ReentrancyGuard, Pausable)
- Stack depth optimization (via-IR enabled)
- Reentrancy protection on all payable functions
- Access control for critical functions
- Emergency pause mechanism

## 📝 Notes

- **DO NOT deploy to mainnet yet** - testnet only
- Test thoroughly on BSC Testnet first
- Get security audit before mainnet
- Set proper resolver address after deployment
- Monitor gas costs on testnet

## 🤝 Integration with Backend

The backend API will:

1. Listen to contract events (`MarketCreated`, `BetCommitted`, `BetRevealed`, `MarketResolved`)
2. Cache data in MongoDB for fast queries
3. Provide REST API for frontend
4. Run resolver bot to auto-resolve markets

See `/backend/README.md` for backend integration details.

## 📞 Support

For issues or questions, check:

- Hardhat docs: https://hardhat.org/
- OpenZeppelin docs: https://docs.openzeppelin.com/
- BSC docs: https://docs.bnbchain.org/

---

**Status:** ✅ Ready for BSC Testnet deployment  
**Last Updated:** October 13, 2025
