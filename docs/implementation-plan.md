# Implementation Plan - DarkBet Backend & Smart Contracts

**Generated:** October 13, 2025  
**Project:** DarkBet - BNB Chain Prediction Markets  
**Purpose:** Backend API (Node.js + MongoDB) + Smart Contracts (Solidity on BNB Chain)

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Tech Stack](#2-tech-stack)
3. [Smart Contract Design](#3-smart-contract-design)
4. [Backend API Design](#4-backend-api-design)
5. [Database Schema](#5-database-schema)
6. [AI Resolution System](#6-ai-resolution-system)
7. [Integration Points](#7-integration-points)
8. [Security Considerations](#8-security-considerations)
9. [Deployment Strategy](#9-deployment-strategy)
10. [Testing Strategy](#10-testing-strategy)
11. [Timeline & Milestones](#11-timeline--milestones)
12. [Cost Analysis](#12-cost-analysis)

---

## 1. Architecture Overview

### 1.1 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                      │
│  - Market listings, filtering, creation UI                      │
│  - Wallet connection (Privy)                                    │
│  - User portfolio, leaderboard                                  │
└──────────────────┬──────────────────────────────────────────────┘
                   │ HTTPS/WSS
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND API (Node.js)                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ REST API Layer                                           │  │
│  │ - Express/Fastify                                        │  │
│  │ - JWT authentication                                     │  │
│  │ - Rate limiting                                          │  │
│  │ - Request validation                                     │  │
│  └──────────────────┬───────────────────────────────────────┘  │
│                     │                                            │
│  ┌──────────────────┴────────────────┬─────────────────────┐   │
│  │                                   │                      │   │
│  ▼                                   ▼                      ▼   │
│  ┌────────────────┐  ┌──────────────────┐  ┌─────────────┐    │
│  │  Market Service│  │  AI Service      │  │  Blockchain │    │
│  │  - CRUD ops    │  │  - Analyze       │  │  Service    │    │
│  │  - Validation  │  │  - Resolve       │  │  - Interact │    │
│  │  - Stats       │  │  - Evidence API  │  │  - Listen   │    │
│  └────────┬───────┘  └──────┬───────────┘  └──────┬──────┘    │
│           │                  │                      │            │
│           └──────────────────┴──────────────────────┘            │
│                              │                                   │
└──────────────────────────────┼───────────────────────────────────┘
                               │
                    ┌──────────┴───────────┐
                    ▼                      ▼
         ┌──────────────────┐   ┌────────────────────┐
         │  MongoDB         │   │  BNB Smart Chain   │
         │  - Predictions   │   │  ┌──────────────┐  │
         │  - Bets          │   │  │ Prediction   │  │
         │  - Users         │   │  │ Market.sol   │  │
         │  - Resolutions   │   │  └──────────────┘  │
         │  - Cache         │   │  ┌──────────────┐  │
         └──────────────────┘   │  │ Vault.sol    │  │
                                │  └──────────────┘  │
                                └────────────────────┘

         ┌────────────────────────────────────────┐
         │  External Services                     │
         │  - Gemini AI (title generation)        │
         │  - News APIs (resolution evidence)     │
         │  - Sports APIs (scores)                │
         │  - Weather APIs                        │
         │  - Crypto price feeds                  │
         │  - Social APIs (optional)              │
         └────────────────────────────────────────┘
```

### 1.2 Data Flow

**Create Market Flow:**

```
1. User submits market via CreateBetModal
2. Frontend → POST /api/ai/analyze (get AI-generated title/summary)
3. Frontend → POST /api/predictions (with AI result + user input)
4. Backend validates data
5. Backend → Smart Contract: createMarket()
6. Smart Contract emits MarketCreated event
7. Backend listens to event, stores in MongoDB
8. Backend returns market ID + tx hash to frontend
9. Frontend redirects to market page
```

**Place Bet Flow:**

```
1. User clicks YES/NO on PredictionCard with amount
2. Frontend → POST /api/predictions/:id/bet
3. Backend calculates shares and price
4. Backend generates quote (valid 30s)
5. Frontend receives quote → user confirms
6. Frontend → Smart Contract: placeBet() with BNB value
7. Smart Contract emits BetPlaced event
8. Backend listens, updates MongoDB (pools, shares, participants)
9. Backend broadcasts update via WebSocket
10. All clients receive real-time price update
```

**Resolve Market Flow (Automated):**

```
1. Cron job runs every hour
2. Check for markets with expiresAt < now AND status = active
3. For each expired market:
   a. POST /api/ai/resolve (with market data)
   b. AI gathers evidence from 25+ APIs
   c. AI analyzes and determines outcome (yes/no)
   d. Backend → Smart Contract: resolveMarket(outcome, reasoning)
   e. Smart Contract emits MarketResolved event
   f. Backend updates MongoDB (status, resolution)
   g. Backend notifies all participants via WebSocket
```

**Claim Winnings Flow:**

```
1. User clicks "Claim" in My Bets page
2. Frontend → POST /api/bets/:id/claim
3. Backend verifies:
   - Market is resolved
   - User bet on winning side
   - Not already claimed
4. Backend → Smart Contract: claimWinnings(marketId)
5. Smart Contract transfers BNB (90% of winnings, 10% fee)
6. Smart Contract emits WinningsClaimed event
7. Backend updates MongoDB (bet.claimed = true, bet.payout = X)
8. Frontend shows success + BSCScan link
```

---

## 2. Tech Stack

### 2.1 Backend API

- **Runtime:** Node.js 20 LTS
- **Framework:** Express.js (simple, widely supported) OR Fastify (faster)
- **Language:** TypeScript
- **Database:** MongoDB (Atlas for cloud)
- **ODM:** Mongoose
- **Validation:** Zod (matches frontend)
- **Authentication:** JWT (optional, for admin routes)
- **Real-time:** Socket.io or Server-Sent Events
- **Cron Jobs:** node-cron or Vercel Cron
- **HTTP Client:** Axios
- **Testing:** Jest + Supertest
- **Linting:** ESLint + Prettier
- **Rate Limiting:** express-rate-limit
- **Security:** helmet, cors

### 2.2 Smart Contracts

- **Language:** Solidity 0.8.20+
- **Framework:** Hardhat
- **Chain:** BNB Smart Chain (BSC)
  - Mainnet: Chain ID 56
  - Testnet: Chain ID 97
- **Libraries:**
  - OpenZeppelin Contracts (ownable, reentrancy guard, pausable)
  - Chainlink (optional, for price oracles)
- **Testing:** Hardhat + Waffle + Chai
- **Gas Optimization:** Solidity optimizer enabled
- **Verification:** Hardhat-etherscan (BSCScan)

### 2.3 AI & External APIs

- **AI Provider:** Google Gemini (primary), OpenAI (fallback)
- **Evidence Sources (25+ APIs):**
  - **News:** NewsAPI, Google News API, Bing News, NYTimes, Guardian
  - **Sports:** SportsData.io, ESPN API, TheSportsDB, RapidAPI Sports
  - **Crypto:** CoinGecko, CoinMarketCap, Binance API, CryptoCompare
  - **Weather:** OpenWeatherMap, WeatherAPI, Tomorrow.io
  - **Politics:** PolitiFact API, FactCheck.org, Ballotpedia API
  - **Entertainment:** TMDb, OMDb, Spotify API
  - **Social:** Twitter API v2 (optional)
  - **Blockchain:** BSCScan API, Etherscan API

### 2.4 Infrastructure

- **API Hosting:** Railway, Render, or AWS ECS
- **Database:** MongoDB Atlas (M10 shared cluster)
- **Frontend:** Vercel (already set up)
- **Contract Deployment:** Hardhat + private key
- **Monitoring:** DataDog or New Relic
- **Error Tracking:** Sentry
- **CDN:** Cloudflare (for API caching)

---

## 3. Smart Contract Design

### 3.1 PredictionMarket.sol

**Purpose:** Main contract for creating, betting, and resolving prediction markets.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title PredictionMarket
 * @dev Decentralized prediction market contract for DarkBet
 * @notice This contract manages the creation, betting, and resolution of prediction markets
 */
contract PredictionMarket is Ownable, ReentrancyGuard, Pausable {

    // ============ State Variables ============

    uint256 public marketIdCounter;
    uint256 public constant PLATFORM_FEE_PERCENT = 10; // 10% fee
    uint256 public constant MIN_BET_AMOUNT = 0.001 ether; // 0.001 BNB
    uint256 public constant MAX_BET_AMOUNT = 100 ether; // 100 BNB

    address public vaultAddress;
    address public resolverAddress; // Backend resolver bot

    // ============ Structs ============

    struct Market {
        uint256 id;
        string title;
        string description;
        address creator;
        uint256 createdAt;
        uint256 expiresAt;
        uint8 category; // 0=sports, 1=crypto, 2=politics, etc.
        uint256 totalPool;
        uint256 yesPool;
        uint256 noPool;
        uint256 yesShares;
        uint256 noShares;
        uint256 participants;
        MarketStatus status;
        bool outcome; // true = YES wins, false = NO wins
        string resolutionReasoning;
    }

    enum MarketStatus {
        Active,
        Resolved,
        Cancelled,
        Expired
    }

    struct Bet {
        uint256 marketId;
        address user;
        bool outcome; // true = YES, false = NO
        uint256 shares;
        uint256 amount;
        uint256 price;
        uint256 timestamp;
        bool claimed;
    }

    // ============ Mappings ============

    mapping(uint256 => Market) public markets;
    mapping(uint256 => mapping(address => Bet[])) public userBets; // marketId => user => bets
    mapping(address => uint256[]) public userMarketIds; // user => list of market IDs

    // ============ Events ============

    event MarketCreated(
        uint256 indexed marketId,
        address indexed creator,
        string title,
        uint256 expiresAt,
        uint8 category
    );

    event BetPlaced(
        uint256 indexed marketId,
        address indexed user,
        bool outcome,
        uint256 amount,
        uint256 shares,
        uint256 price
    );

    event MarketResolved(
        uint256 indexed marketId,
        bool outcome,
        string reasoning,
        uint256 totalPool
    );

    event WinningsClaimed(
        uint256 indexed marketId,
        address indexed user,
        uint256 amount,
        uint256 fee
    );

    event MarketCancelled(
        uint256 indexed marketId,
        address indexed creator,
        uint256 refundAmount
    );

    // ============ Modifiers ============

    modifier onlyResolver() {
        require(msg.sender == resolverAddress, "Only resolver can call");
        _;
    }

    modifier marketExists(uint256 marketId) {
        require(markets[marketId].id != 0, "Market does not exist");
        _;
    }

    modifier marketActive(uint256 marketId) {
        require(markets[marketId].status == MarketStatus.Active, "Market not active");
        require(block.timestamp < markets[marketId].expiresAt, "Market expired");
        _;
    }

    // ============ Constructor ============

    constructor(address _vaultAddress, address _resolverAddress) {
        vaultAddress = _vaultAddress;
        resolverAddress = _resolverAddress;
        marketIdCounter = 0;
    }

    // ============ Core Functions ============

    /**
     * @notice Create a new prediction market
     * @param title Market title (max 100 chars)
     * @param description Market description
     * @param expiresAt Unix timestamp when market closes
     * @param category Market category (0-7)
     * @param initialOutcome Creator's initial bet (true=YES, false=NO)
     * @return marketId The ID of the created market
     */
    function createMarket(
        string memory title,
        string memory description,
        uint256 expiresAt,
        uint8 category,
        bool initialOutcome
    ) external payable whenNotPaused nonReentrant returns (uint256) {
        require(msg.value >= MIN_BET_AMOUNT, "Initial bet too low");
        require(msg.value <= MAX_BET_AMOUNT, "Initial bet too high");
        require(expiresAt > block.timestamp + 1 hours, "Must expire at least 1 hour from now");
        require(expiresAt < block.timestamp + 365 days, "Cannot expire more than 1 year from now");
        require(bytes(title).length > 0 && bytes(title).length <= 100, "Invalid title length");
        require(category <= 7, "Invalid category");

        marketIdCounter++;
        uint256 marketId = marketIdCounter;

        // Initialize market
        Market storage market = markets[marketId];
        market.id = marketId;
        market.title = title;
        market.description = description;
        market.creator = msg.sender;
        market.createdAt = block.timestamp;
        market.expiresAt = expiresAt;
        market.category = category;
        market.status = MarketStatus.Active;

        // Place creator's initial bet
        _placeBetInternal(marketId, msg.sender, initialOutcome, msg.value);

        emit MarketCreated(marketId, msg.sender, title, expiresAt, category);

        return marketId;
    }

    /**
     * @notice Place a bet on a market
     * @param marketId Market ID
     * @param outcome true for YES, false for NO
     */
    function placeBet(uint256 marketId, bool outcome)
        external
        payable
        whenNotPaused
        nonReentrant
        marketExists(marketId)
        marketActive(marketId)
    {
        require(msg.value >= MIN_BET_AMOUNT, "Bet too low");
        require(msg.value <= MAX_BET_AMOUNT, "Bet too high");

        _placeBetInternal(marketId, msg.sender, outcome, msg.value);

        emit BetPlaced(
            marketId,
            msg.sender,
            outcome,
            msg.value,
            userBets[marketId][msg.sender][userBets[marketId][msg.sender].length - 1].shares,
            userBets[marketId][msg.sender][userBets[marketId][msg.sender].length - 1].price
        );
    }

    /**
     * @notice Resolve a market (only callable by resolver bot)
     * @param marketId Market ID
     * @param outcome true for YES wins, false for NO wins
     * @param reasoning AI-generated resolution reasoning
     */
    function resolveMarket(
        uint256 marketId,
        bool outcome,
        string memory reasoning
    ) external onlyResolver marketExists(marketId) {
        Market storage market = markets[marketId];
        require(market.status == MarketStatus.Active, "Market not active");
        require(block.timestamp >= market.expiresAt, "Market not expired yet");

        market.status = MarketStatus.Resolved;
        market.outcome = outcome;
        market.resolutionReasoning = reasoning;

        emit MarketResolved(marketId, outcome, reasoning, market.totalPool);
    }

    /**
     * @notice Claim winnings from a resolved market
     * @param marketId Market ID
     */
    function claimWinnings(uint256 marketId)
        external
        nonReentrant
        marketExists(marketId)
    {
        Market storage market = markets[marketId];
        require(market.status == MarketStatus.Resolved, "Market not resolved");

        Bet[] storage bets = userBets[marketId][msg.sender];
        require(bets.length > 0, "No bets found");

        uint256 totalPayout = 0;
        uint256 totalShares = 0;

        // Calculate total winning shares for user
        for (uint256 i = 0; i < bets.length; i++) {
            if (bets[i].outcome == market.outcome && !bets[i].claimed) {
                totalShares += bets[i].shares;
                bets[i].claimed = true;
            }
        }

        require(totalShares > 0, "No winning bets to claim");

        // Calculate payout: (user shares / total winning shares) * total pool * 0.9
        uint256 totalWinningShares = market.outcome ? market.yesShares : market.noShares;
        uint256 grossPayout = (totalShares * market.totalPool) / totalWinningShares;
        uint256 fee = (grossPayout * PLATFORM_FEE_PERCENT) / 100;
        totalPayout = grossPayout - fee;

        // Transfer payout
        (bool success, ) = payable(msg.sender).call{value: totalPayout}("");
        require(success, "Transfer failed");

        // Transfer fee to vault
        (bool feeSuccess, ) = payable(vaultAddress).call{value: fee}("");
        require(feeSuccess, "Fee transfer failed");

        emit WinningsClaimed(marketId, msg.sender, totalPayout, fee);
    }

    /**
     * @notice Cancel market and refund creator (only if sole participant)
     * @param marketId Market ID
     */
    function cancelMarket(uint256 marketId)
        external
        nonReentrant
        marketExists(marketId)
    {
        Market storage market = markets[marketId];
        require(market.creator == msg.sender, "Only creator can cancel");
        require(market.status == MarketStatus.Active, "Market not active");
        require(market.participants == 1, "Cannot cancel with multiple participants");

        market.status = MarketStatus.Cancelled;

        // Refund creator (minus 10% fee)
        uint256 refundAmount = (market.totalPool * 90) / 100;
        uint256 fee = market.totalPool - refundAmount;

        (bool success, ) = payable(msg.sender).call{value: refundAmount}("");
        require(success, "Refund failed");

        (bool feeSuccess, ) = payable(vaultAddress).call{value: fee}("");
        require(feeSuccess, "Fee transfer failed");

        emit MarketCancelled(marketId, msg.sender, refundAmount);
    }

    // ============ Internal Functions ============

    function _placeBetInternal(
        uint256 marketId,
        address user,
        bool outcome,
        uint256 amount
    ) internal {
        Market storage market = markets[marketId];

        // Calculate shares based on current pool ratio
        uint256 shares;
        uint256 price;

        if (market.totalPool == 0) {
            // First bet: 1 share per 0.01 BNB
            shares = amount / 0.01 ether;
            price = 0.01 ether;
        } else {
            // Calculate current price
            uint256 totalShares = market.yesShares + market.noShares;
            uint256 outcomePool = outcome ? market.yesPool : market.noPool;
            price = (outcomePool * 1e18) / totalShares; // Price per share in wei
            shares = (amount * 1e18) / price;
        }

        // Update market pools and shares
        market.totalPool += amount;
        if (outcome) {
            market.yesPool += amount;
            market.yesShares += shares;
        } else {
            market.noPool += amount;
            market.noShares += shares;
        }

        // Track unique participants
        if (userBets[marketId][user].length == 0) {
            market.participants++;
            userMarketIds[user].push(marketId);
        }

        // Store bet
        userBets[marketId][user].push(Bet({
            marketId: marketId,
            user: user,
            outcome: outcome,
            shares: shares,
            amount: amount,
            price: price,
            timestamp: block.timestamp,
            claimed: false
        }));
    }

    // ============ View Functions ============

    function getMarket(uint256 marketId) external view returns (Market memory) {
        return markets[marketId];
    }

    function getUserBets(uint256 marketId, address user) external view returns (Bet[] memory) {
        return userBets[marketId][user];
    }

    function getUserMarkets(address user) external view returns (uint256[] memory) {
        return userMarketIds[user];
    }

    function getMarketCount() external view returns (uint256) {
        return marketIdCounter;
    }

    // ============ Admin Functions ============

    function setVaultAddress(address _vaultAddress) external onlyOwner {
        vaultAddress = _vaultAddress;
    }

    function setResolverAddress(address _resolverAddress) external onlyOwner {
        resolverAddress = _resolverAddress;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // ============ Emergency Functions ============

    function emergencyWithdraw() external onlyOwner {
        (bool success, ) = payable(owner()).call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }
}
```

### 3.2 Vault.sol

**Purpose:** Holds platform fees and manages payouts.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title Vault
 * @dev Holds platform fees and manages withdrawals
 */
contract Vault is Ownable, ReentrancyGuard {

    event FeeReceived(address indexed from, uint256 amount);
    event Withdrawal(address indexed to, uint256 amount);

    receive() external payable {
        emit FeeReceived(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) external onlyOwner nonReentrant {
        require(amount <= address(this).balance, "Insufficient balance");

        (bool success, ) = payable(owner()).call{value: amount}("");
        require(success, "Withdrawal failed");

        emit Withdrawal(owner(), amount);
    }

    function withdrawAll() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");

        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");

        emit Withdrawal(owner(), balance);
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
```

### 3.3 Contract Deployment Strategy

**Testnet First (BSC Testnet - Chain ID 97):**

1. Deploy Vault.sol
2. Deploy PredictionMarket.sol with Vault address
3. Set resolver address to backend bot
4. Verify contracts on BSCScan Testnet
5. Test all functions thoroughly
6. Run security audit

**Mainnet Deployment (BSC Mainnet - Chain ID 56):**

1. Final audit review
2. Deploy Vault.sol
3. Deploy PredictionMarket.sol
4. Verify on BSCScan
5. Transfer ownership to multi-sig wallet (recommended)
6. Update frontend environment variables

---

## 4. Backend API Design

### 4.1 Project Structure

```
backend/
├── src/
│   ├── server.ts              # Express app entry point
│   ├── config/
│   │   ├── database.ts        # MongoDB connection
│   │   ├── blockchain.ts      # Web3 setup
│   │   └── env.ts             # Environment variables
│   ├── models/
│   │   ├── Prediction.ts      # Mongoose model
│   │   ├── Bet.ts
│   │   ├── User.ts
│   │   └── Resolution.ts
│   ├── routes/
│   │   ├── predictions.ts     # Market CRUD routes
│   │   ├── bets.ts            # Betting routes
│   │   ├── users.ts           # User routes
│   │   ├── leaderboard.ts     # Leaderboard routes
│   │   ├── stats.ts           # Statistics routes
│   │   └── ai.ts              # AI service routes
│   ├── services/
│   │   ├── predictionService.ts  # Business logic
│   │   ├── blockchainService.ts  # Smart contract interaction
│   │   ├── aiService.ts          # AI integration
│   │   ├── resolutionService.ts  # AI resolution logic
│   │   └── evidenceService.ts    # Evidence gathering from APIs
│   ├── middleware/
│   │   ├── auth.ts            # JWT authentication
│   │   ├── rateLimit.ts       # Rate limiting
│   │   ├── validation.ts      # Request validation
│   │   └── errorHandler.ts    # Error handling
│   ├── utils/
│   │   ├── logger.ts          # Winston logging
│   │   ├── helpers.ts         # Helper functions
│   │   └── constants.ts       # Constants
│   ├── jobs/
│   │   ├── resolutionCron.ts  # Auto-resolve markets
│   │   ├── statsUpdate.ts     # Update cached stats
│   │   └── cleanup.ts         # Database cleanup
│   └── websocket/
│       └── server.ts          # Socket.io server
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

### 4.2 API Endpoints

#### **Prediction Market Endpoints**

```typescript
// GET /api/predictions
// Query: status, category, timeRange, isHot, limit, offset, sortBy
{
  predictions: Prediction[],
  total: number,
  page: number,
  totalPages: number
}

// GET /api/predictions/:id
{
  prediction: Prediction,
  userBets?: UserBet[] // if authenticated
}

// POST /api/predictions
// Body: CreatePredictionData
{
  id: string,
  marketId: number, // Smart contract market ID
  txHash: string
}

// POST /api/predictions/:id/bet
// Body: { outcome: 'yes' | 'no', amount: number }
// Returns quote first, then user confirms
{
  quote: {
    shares: number,
    price: number,
    estimatedGas: string,
    validUntil: number, // timestamp (30s validity)
  }
}

// POST /api/predictions/:id/bet/confirm
// Body: { quoteId: string, signature: string }
{
  betId: string,
  shares: number,
  txHash: string
}

// POST /api/predictions/:id/resolve (Admin/Resolver only)
// Body: { outcome: 'yes' | 'no', reasoning: string, evidence: string[] }
{
  success: boolean,
  txHash: string
}

// POST /api/predictions/:id/cancel (Creator only, if sole participant)
{
  success: boolean,
  refundAmount: number,
  txHash: string
}
```

#### **User/Bet Endpoints**

```typescript
// GET /api/users/:address/bets
// Query: status (active/resolved), limit, offset
{
  bets: UserBet[],
  stats: {
    totalInvested: number,
    totalPayout: number,
    activeBets: number,
    resolvedBets: number,
    winRate: number
  },
  total: number
}

// GET /api/users/:address/stats
{
  address: string,
  totalBets: number,
  totalWinnings: number,
  totalVolume: number,
  winRate: number,
  badges: string[],
  streak: number,
  rank: number
}

// POST /api/bets/:id/claim
{
  success: boolean,
  payout: number,
  fee: number,
  txHash: string
}
```

#### **Leaderboard Endpoints**

```typescript
// GET /api/leaderboard
// Query: timeframe, category, sortBy, limit, offset
{
  entries: LeaderboardEntry[],
  total: number,
  page: number
}
```

#### **Stats Endpoints**

```typescript
// GET /api/stats
{
  totalPredictions: number,
  activePredictions: number,
  resolvedPredictions: number,
  totalVolume: number, // BNB
  totalParticipants: number,
  totalBets: number,
  topCategories: { category: string, count: number }[]
}

// GET /api/stats/charts
// Query: timeRange
{
  volumeByDay: { date: string, volume: number }[],
  predictionsByCategory: { category: string, count: number }[],
  participantsOverTime: { date: string, count: number }[]
}
```

#### **AI Endpoints (Backend Only)**

```typescript
// POST /api/ai/analyze
// Body: { description: string, category: string }
{
  title: string,
  description: string,
  summary: string,
  category: string,
  expiresAt: number,
  resolutionInstructions: string,
  suggestedOptions: string[]
}

// POST /api/ai/resolve (Internal - called by cron)
// Body: { predictionId: string }
{
  outcome: 'yes' | 'no',
  confidence: number,
  reasoning: string,
  evidence: string[]
}
```

### 4.3 Backend Services

#### **4.3.1 BlockchainService**

```typescript
// src/services/blockchainService.ts
import { ethers } from 'ethers';
import PredictionMarketABI from '../abis/PredictionMarket.json';
import VaultABI from '../abis/Vault.json';

class BlockchainService {
  private provider: ethers.providers.JsonRpcProvider;
  private predictionMarket: ethers.Contract;
  private vault: ethers.Contract;
  private wallet: ethers.Wallet;

  constructor() {
    this.provider = new ethers.providers.JsonRpcProvider(
      process.env.BSC_RPC_URL
    );
    this.wallet = new ethers.Wallet(
      process.env.RESOLVER_PRIVATE_KEY!,
      this.provider
    );

    this.predictionMarket = new ethers.Contract(
      process.env.PREDICTION_CONTRACT_ADDRESS!,
      PredictionMarketABI,
      this.wallet
    );

    this.vault = new ethers.Contract(
      process.env.VAULT_CONTRACT_ADDRESS!,
      VaultABI,
      this.wallet
    );

    this.setupEventListeners();
  }

  // Listen to smart contract events
  setupEventListeners() {
    // MarketCreated event
    this.predictionMarket.on(
      'MarketCreated',
      async (marketId, creator, title, expiresAt, category, event) => {
        console.log('MarketCreated event:', { marketId, creator, title });
        await this.handleMarketCreated(
          marketId,
          creator,
          title,
          expiresAt,
          category,
          event
        );
      }
    );

    // BetPlaced event
    this.predictionMarket.on(
      'BetPlaced',
      async (marketId, user, outcome, amount, shares, price, event) => {
        console.log('BetPlaced event:', { marketId, user, outcome, amount });
        await this.handleBetPlaced(
          marketId,
          user,
          outcome,
          amount,
          shares,
          price,
          event
        );
      }
    );

    // MarketResolved event
    this.predictionMarket.on(
      'MarketResolved',
      async (marketId, outcome, reasoning, totalPool, event) => {
        console.log('MarketResolved event:', { marketId, outcome });
        await this.handleMarketResolved(
          marketId,
          outcome,
          reasoning,
          totalPool,
          event
        );
      }
    );

    // WinningsClaimed event
    this.predictionMarket.on(
      'WinningsClaimed',
      async (marketId, user, amount, fee, event) => {
        console.log('WinningsClaimed event:', { marketId, user, amount });
        await this.handleWinningsClaimed(marketId, user, amount, fee, event);
      }
    );
  }

  // Smart contract interactions
  async createMarket(
    title: string,
    description: string,
    expiresAt: number,
    category: number,
    initialOutcome: boolean,
    value: bigint
  ) {
    const tx = await this.predictionMarket.createMarket(
      title,
      description,
      expiresAt,
      category,
      initialOutcome,
      { value }
    );

    const receipt = await tx.wait();
    return receipt;
  }

  async resolveMarket(marketId: number, outcome: boolean, reasoning: string) {
    const tx = await this.predictionMarket.resolveMarket(
      marketId,
      outcome,
      reasoning
    );
    const receipt = await tx.wait();
    return receipt;
  }

  async getMarket(marketId: number) {
    return await this.predictionMarket.getMarket(marketId);
  }

  async getUserBets(marketId: number, userAddress: string) {
    return await this.predictionMarket.getUserBets(marketId, userAddress);
  }

  // Event handlers (update MongoDB)
  private async handleMarketCreated(...args) {
    // Update MongoDB with on-chain data
    // See PredictionService
  }

  private async handleBetPlaced(...args) {
    // Update MongoDB
  }

  private async handleMarketResolved(...args) {
    // Update MongoDB
  }

  private async handleWinningsClaimed(...args) {
    // Update MongoDB
  }
}

export default new BlockchainService();
```

#### **4.3.2 AIService**

```typescript
// src/services/aiService.ts
import axios from 'axios';

interface AIAnalysisResult {
  title: string;
  description: string;
  summary: string;
  category: string;
  expiresAt: number;
  resolutionInstructions: string;
  suggestedOptions: string[];
}

class AIService {
  private apiKey: string;
  private provider: 'gemini' | 'openai';

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY!;
    this.provider = 'gemini';
  }

  async analyzePrediction(
    description: string,
    category: string
  ): Promise<AIAnalysisResult> {
    const prompt = this.buildAnalysisPrompt(description, category);

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        },
      }
    );

    const text = response.data.candidates[0].content.parts[0].text;
    return this.parseAnalysisResponse(text);
  }

  private buildAnalysisPrompt(description: string, category: string): string {
    return `You are an expert prediction market analyst. Analyze the following prediction description and generate:

1. A clear, concise title (max 60 characters)
2. A 3-line concise description (max 150 characters total, 3 sentences)
3. A detailed, unbiased summary (200-300 words) explaining what could happen if YES wins and what could happen if NO wins. Present both scenarios equally without favoring either outcome.
4. The most appropriate category from: sports, crypto, politics, entertainment, weather, finance, technology, custom
5. A reasonable expiration date (in days from now, max 365)
6. Detailed resolution instructions for how to determine the outcome
7. Optional: 2-4 suggested betting options (default: YES/NO)

Prediction Description: "${description}"
Current Category: "${category}"

Please respond in JSON format:
{
  "title": "Will [specific event] happen?",
  "description": "Brief 3-line description. Max 150 chars. Concise overview.",
  "summary": "A detailed, balanced summary explaining the prediction context. If YES wins: [explain what this means and potential implications]. If NO wins: [explain what this means and potential implications]. Present both scenarios objectively without bias, highlighting key factors that could influence the outcome.",
  "category": "sports",
  "expiresInDays": 7,
  "resolutionInstructions": "Determine the outcome based on [specific criteria]...",
  "suggestedOptions": ["YES", "NO"]
}

Make the title specific, measurable, and time-bound. The 3-line description should be very concise. The summary should be detailed and present both YES and NO outcomes equally without bias. The resolution instructions should be clear about what data sources to use and how to verify the outcome.`;
  }

  private parseAnalysisResponse(response: string): AIAnalysisResult {
    // Extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in AI response');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Calculate expiration date
    const expiresInDays = parsed.expiresInDays || 7;
    const expiresAt = Date.now() + expiresInDays * 24 * 60 * 60 * 1000;

    return {
      title: parsed.title || 'AI Generated Prediction',
      description: parsed.description || 'AI-generated prediction market.',
      summary:
        parsed.summary ||
        'This prediction market allows participants to bet on the outcome of a future event.',
      category: parsed.category || 'custom',
      expiresAt,
      resolutionInstructions:
        parsed.resolutionInstructions ||
        'AI will determine the outcome based on available data.',
      suggestedOptions: parsed.suggestedOptions || ['YES', 'NO'],
    };
  }
}

export default new AIService();
```

#### **4.3.3 ResolutionService (AI-powered)**

```typescript
// src/services/resolutionService.ts
import EvidenceService from './evidenceService';
import AIService from './aiService';
import BlockchainService from './blockchainService';
import { Prediction } from '../models/Prediction';

interface ResolutionResult {
  outcome: 'yes' | 'no';
  confidence: number;
  reasoning: string;
  evidence: string[];
}

class ResolutionService {
  /**
   * Resolve a prediction market using AI and evidence gathering
   */
  async resolvePrediction(predictionId: string): Promise<ResolutionResult> {
    // 1. Fetch prediction from database
    const prediction = await Prediction.findOne({ id: predictionId });
    if (!prediction) {
      throw new Error('Prediction not found');
    }

    // 2. Gather evidence from multiple sources
    const evidence = await EvidenceService.gatherEvidence(prediction);

    // 3. Use AI to analyze evidence and determine outcome
    const aiAnalysis = await this.analyzeWithAI(prediction, evidence);

    // 4. Call smart contract to resolve
    const tx = await BlockchainService.resolveMarket(
      prediction.contractMarketId,
      aiAnalysis.outcome === 'yes',
      aiAnalysis.reasoning
    );

    // 5. Update database
    await Prediction.updateOne(
      { id: predictionId },
      {
        $set: {
          status: 'resolved',
          resolution: {
            outcome: aiAnalysis.outcome,
            resolvedAt: Date.now(),
            reasoning: aiAnalysis.reasoning,
            evidence: aiAnalysis.evidence,
          },
        },
      }
    );

    return aiAnalysis;
  }

  private async analyzeWithAI(
    prediction: any,
    evidence: any[]
  ): Promise<ResolutionResult> {
    const prompt = this.buildResolutionPrompt(prediction, evidence);

    const response = await AIService.callGemini(prompt);

    return this.parseResolutionResponse(response, evidence);
  }

  private buildResolutionPrompt(prediction: any, evidence: any[]): string {
    return `You are an expert fact-checker and prediction market resolver. Analyze the following prediction and evidence to determine the outcome.

Prediction Title: ${prediction.title}
Prediction Description: ${prediction.description}
Resolution Instructions: ${prediction.resolutionInstructions || 'Determine outcome based on verifiable evidence.'}
Created: ${new Date(prediction.createdAt).toISOString()}
Expires: ${new Date(prediction.expiresAt).toISOString()}

Evidence Gathered:
${evidence
  .map(
    (e, i) => `
${i + 1}. Source: ${e.source}
   Type: ${e.type}
   Data: ${JSON.stringify(e.data, null, 2)}
`
  )
  .join('\n')}

Based on the evidence above, determine:
1. The outcome (YES or NO)
2. Your confidence level (0-100)
3. A clear, fact-based reasoning for your decision

Respond in JSON format:
{
  "outcome": "yes" or "no",
  "confidence": 85,
  "reasoning": "Based on [source 1], [source 2], and [source 3], the outcome is [YES/NO] because [detailed explanation]. The evidence shows that [key facts]. This conclusion is supported by [specific data points]."
}

Be objective, thorough, and base your decision solely on the evidence provided.`;
  }

  private parseResolutionResponse(
    response: string,
    evidence: any[]
  ): ResolutionResult {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid AI response format');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      outcome: parsed.outcome,
      confidence: parsed.confidence,
      reasoning: parsed.reasoning,
      evidence: evidence.map(e => `${e.source}: ${e.type}`),
    };
  }
}

export default new ResolutionService();
```

#### **4.3.4 EvidenceService (25+ APIs)**

```typescript
// src/services/evidenceService.ts
import axios from 'axios';

interface EvidenceSource {
  source: string;
  type: string;
  data: any;
}

class EvidenceService {
  /**
   * Gather evidence from multiple sources based on prediction category
   */
  async gatherEvidence(prediction: any): Promise<EvidenceSource[]> {
    const evidence: EvidenceSource[] = [];

    switch (prediction.category) {
      case 'sports':
        evidence.push(...(await this.gatherSportsEvidence(prediction)));
        break;
      case 'crypto':
        evidence.push(...(await this.gatherCryptoEvidence(prediction)));
        break;
      case 'politics':
        evidence.push(...(await this.gatherPoliticsEvidence(prediction)));
        break;
      case 'weather':
        evidence.push(...(await this.gatherWeatherEvidence(prediction)));
        break;
      case 'entertainment':
        evidence.push(...(await this.gatherEntertainmentEvidence(prediction)));
        break;
      default:
        evidence.push(...(await this.gatherGeneralEvidence(prediction)));
    }

    return evidence;
  }

  // ============ Sports Evidence ============

  private async gatherSportsEvidence(
    prediction: any
  ): Promise<EvidenceSource[]> {
    const evidence: EvidenceSource[] = [];

    try {
      // ESPN API
      const espnData = await this.fetchESPN(prediction.title);
      evidence.push({ source: 'ESPN', type: 'sports_score', data: espnData });
    } catch (err) {
      console.error('ESPN API error:', err);
    }

    try {
      // TheSportsDB
      const sportsDbData = await this.fetchTheSportsDB(prediction.title);
      evidence.push({
        source: 'TheSportsDB',
        type: 'sports_result',
        data: sportsDbData,
      });
    } catch (err) {
      console.error('TheSportsDB API error:', err);
    }

    try {
      // SportsData.io
      const sportsDataIo = await this.fetchSportsDataIo(prediction.title);
      evidence.push({
        source: 'SportsData.io',
        type: 'sports_stats',
        data: sportsDataIo,
      });
    } catch (err) {
      console.error('SportsData.io API error:', err);
    }

    return evidence;
  }

  // ============ Crypto Evidence ============

  private async gatherCryptoEvidence(
    prediction: any
  ): Promise<EvidenceSource[]> {
    const evidence: EvidenceSource[] = [];

    try {
      // CoinGecko
      const coinGeckoData = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price',
        {
          params: {
            ids: 'bitcoin,ethereum,binancecoin',
            vs_currencies: 'usd',
            include_24hr_change: true,
          },
        }
      );
      evidence.push({
        source: 'CoinGecko',
        type: 'crypto_price',
        data: coinGeckoData.data,
      });
    } catch (err) {
      console.error('CoinGecko API error:', err);
    }

    try {
      // Binance API
      const binanceData = await axios.get(
        'https://api.binance.com/api/v3/ticker/price',
        {
          params: { symbol: 'BNBUSDT' },
        }
      );
      evidence.push({
        source: 'Binance',
        type: 'crypto_price',
        data: binanceData.data,
      });
    } catch (err) {
      console.error('Binance API error:', err);
    }

    try {
      // CoinMarketCap (requires API key)
      const cmcData = await axios.get(
        'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
        {
          headers: {
            'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
          },
          params: {
            symbol: 'BTC,ETH,BNB',
          },
        }
      );
      evidence.push({
        source: 'CoinMarketCap',
        type: 'crypto_price',
        data: cmcData.data,
      });
    } catch (err) {
      console.error('CoinMarketCap API error:', err);
    }

    return evidence;
  }

  // ============ Politics Evidence ============

  private async gatherPoliticsEvidence(
    prediction: any
  ): Promise<EvidenceSource[]> {
    const evidence: EvidenceSource[] = [];

    try {
      // News API (political news)
      const newsData = await axios.get('https://newsapi.org/v2/everything', {
        params: {
          q: prediction.title,
          category: 'politics',
          apiKey: process.env.NEWS_API_KEY,
          language: 'en',
          sortBy: 'relevancy',
        },
      });
      evidence.push({
        source: 'NewsAPI',
        type: 'news_articles',
        data: newsData.data.articles.slice(0, 5),
      });
    } catch (err) {
      console.error('NewsAPI error:', err);
    }

    // Additional political data sources...

    return evidence;
  }

  // ============ Weather Evidence ============

  private async gatherWeatherEvidence(
    prediction: any
  ): Promise<EvidenceSource[]> {
    const evidence: EvidenceSource[] = [];

    try {
      // OpenWeatherMap
      const weatherData = await axios.get(
        'https://api.openweathermap.org/data/2.5/weather',
        {
          params: {
            q: 'New York', // Extract city from prediction
            appid: process.env.OPENWEATHER_API_KEY,
            units: 'metric',
          },
        }
      );
      evidence.push({
        source: 'OpenWeatherMap',
        type: 'weather_data',
        data: weatherData.data,
      });
    } catch (err) {
      console.error('OpenWeatherMap API error:', err);
    }

    return evidence;
  }

  // ============ General Evidence ============

  private async gatherGeneralEvidence(
    prediction: any
  ): Promise<EvidenceSource[]> {
    const evidence: EvidenceSource[] = [];

    try {
      // Google News
      const newsData = await axios.get('https://newsapi.org/v2/everything', {
        params: {
          q: prediction.title,
          apiKey: process.env.NEWS_API_KEY,
          language: 'en',
          sortBy: 'relevancy',
          pageSize: 10,
        },
      });
      evidence.push({
        source: 'Google News',
        type: 'news_articles',
        data: newsData.data.articles,
      });
    } catch (err) {
      console.error('News API error:', err);
    }

    return evidence;
  }

  // ============ Helper Methods (implement actual API calls) ============

  private async fetchESPN(query: string) {
    // Implement ESPN API call
    return {};
  }

  private async fetchTheSportsDB(query: string) {
    // Implement TheSportsDB API call
    return {};
  }

  private async fetchSportsDataIo(query: string) {
    // Implement SportsData.io API call (requires API key)
    return {};
  }
}

export default new EvidenceService();
```

---

## 5. Database Schema

### 5.1 MongoDB Collections

```typescript
// src/models/Prediction.ts
import mongoose from 'mongoose';

const predictionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    contractMarketId: { type: Number, required: true, index: true }, // Smart contract ID
    title: { type: String, required: true },
    description: { type: String, required: true },
    summary: { type: String }, // AI-generated
    category: {
      type: String,
      enum: [
        'sports',
        'crypto',
        'politics',
        'entertainment',
        'weather',
        'finance',
        'technology',
        'custom',
      ],
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['active', 'resolved', 'cancelled', 'expired'],
      default: 'active',
      index: true,
    },
    createdAt: { type: Date, required: true, index: true },
    expiresAt: { type: Date, required: true, index: true },
    creator: { type: String, required: true, index: true }, // wallet address
    totalPool: { type: Number, default: 0 },
    yesPool: { type: Number, default: 0 },
    noPool: { type: Number, default: 0 },
    yesPrice: { type: Number, default: 0.005 },
    noPrice: { type: Number, default: 0.005 },
    totalShares: { type: Number, default: 0 },
    yesShares: { type: Number, default: 0 },
    noShares: { type: Number, default: 0 },
    resolution: {
      outcome: { type: String, enum: ['yes', 'no'] },
      resolvedAt: { type: Date },
      reasoning: { type: String },
      evidence: [{ type: String }],
    },
    participants: { type: Number, default: 0 },
    isHot: { type: Boolean, default: false, index: true },
    txHash: { type: String }, // creation transaction hash
    resolutionInstructions: { type: String },
  },
  { timestamps: true }
);

// Indexes for efficient queries
predictionSchema.index({ status: 1, category: 1 });
predictionSchema.index({ expiresAt: 1, status: 1 });
predictionSchema.index({ createdAt: -1 });

export const Prediction = mongoose.model('Prediction', predictionSchema);
```

```typescript
// src/models/Bet.ts
import mongoose from 'mongoose';

const betSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    predictionId: { type: String, required: true, index: true },
    user: { type: String, required: true, index: true }, // wallet address
    outcome: { type: String, enum: ['yes', 'no'], required: true },
    shares: { type: Number, required: true },
    amount: { type: Number, required: true }, // BNB
    price: { type: Number, required: true },
    createdAt: { type: Date, required: true },
    claimed: { type: Boolean, default: false, index: true },
    payout: { type: Number },
    txHash: { type: String },
  },
  { timestamps: true }
);

// Compound indexes
betSchema.index({ predictionId: 1, user: 1 });
betSchema.index({ user: 1, createdAt: -1 });

export const Bet = mongoose.model('Bet', betSchema);
```

```typescript
// src/models/User.ts (optional, for caching)
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    address: { type: String, required: true, unique: true, index: true },
    username: { type: String },
    totalBets: { type: Number, default: 0 },
    totalWinnings: { type: Number, default: 0 },
    totalVolume: { type: Number, default: 0 },
    winRate: { type: Number, default: 0 },
    badges: [{ type: String }],
    isVerified: { type: Boolean, default: false },
    streak: { type: Number, default: 0 },
    lastActive: { type: Date },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
```

---

## 6. AI Resolution System

### 6.1 Cron Job Setup

```typescript
// src/jobs/resolutionCron.ts
import cron from 'node-cron';
import { Prediction } from '../models/Prediction';
import ResolutionService from '../services/resolutionService';
import logger from '../utils/logger';

/**
 * Run every hour to check for expired markets
 */
cron.schedule('0 * * * *', async () => {
  logger.info('Running resolution cron job...');

  try {
    // Find all markets that have expired but not resolved
    const expiredMarkets = await Prediction.find({
      status: 'active',
      expiresAt: { $lt: new Date() },
    });

    logger.info(`Found ${expiredMarkets.length} expired markets to resolve`);

    for (const market of expiredMarkets) {
      try {
        logger.info(`Resolving market ${market.id}...`);

        const result = await ResolutionService.resolvePrediction(market.id);

        logger.info(
          `Market ${market.id} resolved: ${result.outcome} (confidence: ${result.confidence})`
        );
      } catch (error) {
        logger.error(`Failed to resolve market ${market.id}:`, error);
        // Continue with next market
      }
    }

    logger.info('Resolution cron job completed');
  } catch (error) {
    logger.error('Resolution cron job error:', error);
  }
});
```

### 6.2 Evidence Gathering Strategy

**Category-Specific APIs:**

1. **Sports:**
   - ESPN API (game scores, schedules)
   - TheSportsDB (team info, past results)
   - SportsData.io (live scores, stats)
   - RapidAPI Sports (multiple sports coverage)
   - Official league APIs (NBA, NFL, FIFA, etc.)

2. **Crypto:**
   - CoinGecko (prices, market data)
   - CoinMarketCap (prices, rankings)
   - Binance API (real-time prices)
   - CryptoCompare (historical data)
   - BSCScan API (on-chain data)

3. **Politics:**
   - NewsAPI (news articles)
   - PolitiFact API (fact-checking)
   - FactCheck.org (fact-checking)
   - Ballotpedia API (election data)
   - Government APIs (official results)

4. **Weather:**
   - OpenWeatherMap (current/forecast)
   - WeatherAPI (historical data)
   - Tomorrow.io (accurate forecasts)

5. **Entertainment:**
   - TMDb (movie/TV data)
   - OMDb (movie info)
   - Spotify API (music charts)
   - Box Office Mojo (box office data)

6. **Finance:**
   - Alpha Vantage (stock prices)
   - IEX Cloud (financial data)
   - Yahoo Finance (market data)

7. **General:**
   - Google News API
   - Bing News API
   - Twitter API v2 (social sentiment)

**Evidence Quality Scoring:**

```typescript
interface EvidenceQuality {
  source: string;
  reliability: number; // 0-1
  recency: number; // 0-1 (how recent is data)
  relevance: number; // 0-1 (how relevant to prediction)
  totalScore: number; // weighted average
}
```

---

## 7. Integration Points

### 7.1 Frontend ↔ Backend Integration

**Authentication:**

- Frontend sends JWT token (optional) or wallet signature
- Backend verifies signature for user-specific endpoints

**WebSocket Updates:**

```typescript
// Backend emits
io.emit('marketUpdate', {
  predictionId: '1',
  totalPool: 5.2,
  yesPrice: 0.0064,
  noPrice: 0.0036,
  participants: 46,
});

// Frontend listens
socket.on('marketUpdate', data => {
  setPredictions(prev =>
    prev.map(p => (p.id === data.predictionId ? { ...p, ...data } : p))
  );
});
```

### 7.2 Backend ↔ Smart Contract Integration

**Event Listening:**

```typescript
// Backend listens to contract events
predictionMarket.on('BetPlaced', async (marketId, user, outcome, amount, shares, price) => {
  // Update MongoDB
  await Bet.create({
    id: generateBetId(),
    predictionId: await getInternalId(marketId),
    user,
    outcome: outcome ? 'yes' : 'no',
    amount: ethers.utils.formatEther(amount),
    shares: shares.toString(),
    price: ethers.utils.formatEther(price),
    createdAt: new Date(),
    txHash: event.transactionHash
  });

  // Broadcast via WebSocket
  io.emit('betPlaced', { ... });
});
```

**Transaction Handling:**

```typescript
// Backend calls contract
const tx = await contract.resolveMarket(marketId, outcome, reasoning);
const receipt = await tx.wait();

if (receipt.status === 1) {
  // Success - update DB
} else {
  // Failed - rollback or retry
}
```

---

## 8. Security Considerations

### 8.1 Backend Security

**1. Environment Variables:**

```env
# NEVER expose these to frontend
MONGODB_URI=mongodb+srv://...
RESOLVER_PRIVATE_KEY=0x...
GEMINI_API_KEY=...
JWT_SECRET=...
```

**2. Rate Limiting:**

```typescript
import rateLimit from 'express-rate-limit';

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', apiLimiter);

// Stricter limit for market creation
const createMarketLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 markets per hour per IP
});

app.use('/api/predictions', createMarketLimiter);
```

**3. Input Validation:**

```typescript
import { z } from 'zod';

const createPredictionSchema = z.object({
  title: z.string().min(10).max(100),
  description: z.string().min(10).max(1000),
  category: z.enum([
    'sports',
    'crypto',
    'politics',
    'entertainment',
    'weather',
    'finance',
    'technology',
    'custom',
  ]),
  expiresAt: z.number().int().positive(),
  initialOutcome: z.enum(['yes', 'no']),
  bnbAmount: z.number().min(0.001).max(100),
});

app.post('/api/predictions', async (req, res) => {
  try {
    const data = createPredictionSchema.parse(req.body);
    // Process...
  } catch (error) {
    return res.status(400).json({ error: 'Validation failed' });
  }
});
```

**4. CORS Configuration:**

```typescript
import cors from 'cors';

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'https://darkbet.vercel.app',
    credentials: true,
  })
);
```

### 8.2 Smart Contract Security

**1. Reentrancy Protection:**

```solidity
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract PredictionMarket is ReentrancyGuard {
  function claimWinnings(uint256 marketId) external nonReentrant {
    // Protected against reentrancy
  }
}
```

**2. Access Control:**

```solidity
import "@openzeppelin/contracts/access/Ownable.sol";

contract PredictionMarket is Ownable {
  address public resolverAddress;

  modifier onlyResolver() {
    require(msg.sender == resolverAddress, "Only resolver");
    _;
  }

  function resolveMarket(...) external onlyResolver {
    // Only backend bot can resolve
  }
}
```

**3. Pausable:**

```solidity
import "@openzeppelin/contracts/security/Pausable.sol";

contract PredictionMarket is Pausable {
  function createMarket(...) external whenNotPaused {
    // Can pause in emergency
  }
}
```

**4. Integer Overflow Protection:**

- Solidity 0.8+ has built-in overflow checks
- No need for SafeMath

**5. Testing:**

- 100% code coverage with Hardhat tests
- Fuzz testing with Echidna
- Security audit before mainnet

---

## 9. Deployment Strategy

### 9.1 Phase 1: Testnet Deployment (Week 1-2)

**Tasks:**

1. Deploy smart contracts to BSC Testnet
2. Verify contracts on BSCScan Testnet
3. Deploy backend API to staging environment
4. Connect frontend to testnet backend
5. Test all flows end-to-end
6. Fix bugs and issues

**Environment:**

- Chain: BSC Testnet (Chain ID 97)
- RPC: https://data-seed-prebsc-1-s1.binance.org:8545/
- Faucet: https://testnet.binance.org/faucet-smart
- Backend: Railway staging environment
- Frontend: Vercel preview deployment

### 9.2 Phase 2: Security Audit (Week 3)

**Tasks:**

1. Internal code review
2. External smart contract audit (recommended)
3. Penetration testing
4. Fix all critical/high issues
5. Re-test

**Audit Checklist:**

- [ ] Reentrancy vulnerabilities
- [ ] Access control issues
- [ ] Integer overflow/underflow
- [ ] Front-running vulnerabilities
- [ ] Gas optimization
- [ ] Logic errors

### 9.3 Phase 3: Mainnet Deployment (Week 4)

**Tasks:**

1. Deploy Vault.sol to BSC Mainnet
2. Deploy PredictionMarket.sol to BSC Mainnet
3. Verify contracts on BSCScan
4. Deploy backend API to production
5. Update frontend environment variables
6. Set up monitoring and alerts
7. Test with small amounts first
8. Gradual rollout

**Environment:**

- Chain: BSC Mainnet (Chain ID 56)
- RPC: https://bsc-dataseed.binance.org/
- Backend: Railway production
- Frontend: Vercel production (darkbet.com)
- Database: MongoDB Atlas M10+

### 9.4 Infrastructure Setup

**Backend (Railway):**

```yaml
# railway.toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "npm run start:prod"
healthcheckPath = "/health"
healthcheckTimeout = 100
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

**MongoDB Atlas:**

- Cluster: M10 (dedicated)
- Region: Same as backend (low latency)
- Backups: Enabled (continuous)
- Monitoring: Enabled

**Environment Variables (Production):**

```env
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://...
BSC_RPC_URL=https://bsc-dataseed.binance.org/
PREDICTION_CONTRACT_ADDRESS=0x...
VAULT_CONTRACT_ADDRESS=0x...
RESOLVER_PRIVATE_KEY=0x... (from secure vault)
GEMINI_API_KEY=...
NEWS_API_KEY=...
OPENWEATHER_API_KEY=...
CMC_API_KEY=...
JWT_SECRET=...
FRONTEND_URL=https://darkbet.com
SENTRY_DSN=...
```

---

## 10. Testing Strategy

### 10.1 Smart Contract Tests

```typescript
// test/PredictionMarket.test.ts
import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('PredictionMarket', function () {
  let predictionMarket: any;
  let vault: any;
  let owner: any;
  let resolver: any;
  let user1: any;
  let user2: any;

  beforeEach(async function () {
    [owner, resolver, user1, user2] = await ethers.getSigners();

    // Deploy Vault
    const Vault = await ethers.getContractFactory('Vault');
    vault = await Vault.deploy();
    await vault.deployed();

    // Deploy PredictionMarket
    const PredictionMarket =
      await ethers.getContractFactory('PredictionMarket');
    predictionMarket = await PredictionMarket.deploy(
      vault.address,
      resolver.address
    );
    await predictionMarket.deployed();
  });

  describe('Market Creation', function () {
    it('Should create a market successfully', async function () {
      const title = 'Will BTC reach $100k?';
      const description = 'Bitcoin price prediction';
      const expiresAt = Math.floor(Date.now() / 1000) + 86400; // 1 day
      const category = 1; // crypto
      const initialOutcome = true; // YES
      const amount = ethers.utils.parseEther('0.01');

      const tx = await predictionMarket
        .connect(user1)
        .createMarket(title, description, expiresAt, category, initialOutcome, {
          value: amount,
        });

      const receipt = await tx.wait();
      const event = receipt.events.find(
        (e: any) => e.event === 'MarketCreated'
      );

      expect(event.args.marketId).to.equal(1);
      expect(event.args.creator).to.equal(user1.address);
      expect(event.args.title).to.equal(title);
    });

    it('Should fail if initial bet is too low', async function () {
      const amount = ethers.utils.parseEther('0.0001'); // Too low

      await expect(
        predictionMarket
          .connect(user1)
          .createMarket(
            'Test Market',
            'Description',
            Math.floor(Date.now() / 1000) + 86400,
            1,
            true,
            { value: amount }
          )
      ).to.be.revertedWith('Initial bet too low');
    });
  });

  describe('Betting', function () {
    let marketId: number;

    beforeEach(async function () {
      // Create a market first
      const tx = await predictionMarket
        .connect(user1)
        .createMarket(
          'Test Market',
          'Description',
          Math.floor(Date.now() / 1000) + 86400,
          1,
          true,
          { value: ethers.utils.parseEther('0.01') }
        );

      const receipt = await tx.wait();
      marketId = receipt.events[0].args.marketId;
    });

    it('Should allow placing a bet', async function () {
      const amount = ethers.utils.parseEther('0.01');

      const tx = await predictionMarket
        .connect(user2)
        .placeBet(marketId, false, { value: amount });
      const receipt = await tx.wait();

      const event = receipt.events.find((e: any) => e.event === 'BetPlaced');
      expect(event.args.user).to.equal(user2.address);
      expect(event.args.outcome).to.equal(false);
    });

    it('Should update market pools correctly', async function () {
      const amount = ethers.utils.parseEther('0.02');

      await predictionMarket
        .connect(user2)
        .placeBet(marketId, false, { value: amount });

      const market = await predictionMarket.getMarket(marketId);
      expect(market.totalPool).to.equal(ethers.utils.parseEther('0.03'));
    });
  });

  describe('Resolution', function () {
    let marketId: number;

    beforeEach(async function () {
      // Create market
      const tx = await predictionMarket
        .connect(user1)
        .createMarket(
          'Test Market',
          'Description',
          Math.floor(Date.now() / 1000) + 86400,
          1,
          true,
          { value: ethers.utils.parseEther('0.01') }
        );

      const receipt = await tx.wait();
      marketId = receipt.events[0].args.marketId;

      // Place bets
      await predictionMarket.connect(user2).placeBet(marketId, false, {
        value: ethers.utils.parseEther('0.01'),
      });

      // Fast forward time
      await ethers.provider.send('evm_increaseTime', [86400 + 1]);
      await ethers.provider.send('evm_mine', []);
    });

    it('Should resolve market correctly', async function () {
      const tx = await predictionMarket
        .connect(resolver)
        .resolveMarket(marketId, true, 'BTC reached $100k');

      const receipt = await tx.wait();
      const event = receipt.events.find(
        (e: any) => e.event === 'MarketResolved'
      );

      expect(event.args.outcome).to.equal(true);
    });

    it('Should only allow resolver to resolve', async function () {
      await expect(
        predictionMarket
          .connect(user1)
          .resolveMarket(marketId, true, 'Reasoning')
      ).to.be.revertedWith('Only resolver can call');
    });
  });

  describe('Claiming Winnings', function () {
    // Test claiming logic
  });

  describe('Market Cancellation', function () {
    // Test cancellation logic
  });
});
```

**Test Coverage Target:** 100%

### 10.2 Backend API Tests

```typescript
// tests/api/predictions.test.ts
import request from 'supertest';
import app from '../src/server';
import { Prediction } from '../src/models/Prediction';

describe('Predictions API', () => {
  beforeAll(async () => {
    // Connect to test database
  });

  afterAll(async () => {
    // Disconnect and cleanup
  });

  describe('GET /api/predictions', () => {
    it('should return all predictions', async () => {
      const response = await request(app).get('/api/predictions').expect(200);

      expect(response.body).toHaveProperty('predictions');
      expect(response.body).toHaveProperty('total');
    });

    it('should filter by category', async () => {
      const response = await request(app)
        .get('/api/predictions?category=crypto')
        .expect(200);

      expect(
        response.body.predictions.every((p: any) => p.category === 'crypto')
      ).toBe(true);
    });
  });

  describe('POST /api/predictions', () => {
    it('should create a new prediction', async () => {
      const data = {
        title: 'Test Market',
        description: 'Test description',
        category: 'crypto',
        expiresAt: Date.now() + 86400000,
        initialOutcome: 'yes',
        bnbAmount: 0.01,
      };

      const response = await request(app)
        .post('/api/predictions')
        .send(data)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('txHash');
    });
  });

  // More tests...
});
```

### 10.3 Integration Tests

Test complete user flows:

1. Create market → place bet → resolve → claim
2. Multiple users betting on same market
3. Market cancellation flow
4. Error handling (insufficient funds, expired market, etc.)

---

## 11. Timeline & Milestones

### Week 1: Smart Contracts

- **Days 1-2:** Write and test PredictionMarket.sol
- **Days 3-4:** Write and test Vault.sol
- **Days 5-7:** Deploy to BSC Testnet, initial testing

**Deliverables:**

- ✅ PredictionMarket.sol deployed to testnet
- ✅ Vault.sol deployed to testnet
- ✅ 100% test coverage
- ✅ Contracts verified on BSCScan Testnet

### Week 2: Backend API

- **Days 1-2:** Set up Express server, MongoDB, basic routes
- **Days 3-4:** Implement BlockchainService (event listening)
- **Days 5-6:** Implement AIService and EvidenceService
- **Day 7:** WebSocket integration

**Deliverables:**

- ✅ Backend API deployed to Railway staging
- ✅ All CRUD endpoints working
- ✅ Smart contract event listening active
- ✅ WebSocket real-time updates

### Week 3: AI Resolution System

- **Days 1-2:** Implement ResolutionService
- **Days 3-4:** Integrate 25+ evidence APIs
- **Days 5-6:** Set up cron jobs
- **Day 7:** Test resolution accuracy

**Deliverables:**

- ✅ AI resolution system functional
- ✅ Evidence gathering from multiple sources
- ✅ Cron jobs running
- ✅ 80%+ resolution accuracy

### Week 4: Frontend Integration

- **Days 1-2:** Connect frontend to backend API
- **Days 3-4:** Test all user flows
- **Days 5-6:** Bug fixes and polish
- **Day 7:** Prepare for mainnet

**Deliverables:**

- ✅ Frontend fully integrated with backend
- ✅ All features working on testnet
- ✅ User acceptance testing complete
- ✅ Documentation complete

### Week 5: Security Audit & Mainnet

- **Days 1-3:** Security audit and fixes
- **Days 4-5:** Deploy to mainnet
- **Days 6-7:** Monitor and support

**Deliverables:**

- ✅ Security audit report
- ✅ All critical/high issues fixed
- ✅ Mainnet deployment complete
- ✅ Monitoring and alerts set up

**Total Timeline:** 5 weeks (can be accelerated with more resources)

---

## 12. Cost Analysis

### 12.1 Development Costs (One-time)

**Smart Contract Development:**

- Solidity Developer (2 weeks): $5,000 - $10,000
- Security Audit: $3,000 - $15,000
- Testing and QA: $1,000 - $3,000
- **Subtotal:** $9,000 - $28,000

**Backend Development:**

- Node.js Developer (3 weeks): $7,500 - $15,000
- Database setup: $500 - $1,000
- Testing and QA: $1,000 - $2,000
- **Subtotal:** $9,000 - $18,000

**Frontend Integration:**

- Integration work (1 week): $2,500 - $5,000
- Testing: $500 - $1,000
- **Subtotal:** $3,000 - $6,000

**Total Development Cost:** $21,000 - $52,000

_(Can be reduced significantly if building in-house)_

### 12.2 Operational Costs (Monthly)

**Infrastructure:**

- Backend API (Railway): $20 - $100
- MongoDB Atlas: $0 - $57 (free tier to M10)
- Domain + SSL: $1 - $5
- **Subtotal:** $21 - $162

**External APIs:**

- Gemini AI: Free tier (60 req/min)
- News APIs: $0 - $50
- Sports APIs: $0 - $50
- Weather APIs: $0 - $20
- **Subtotal:** $0 - $120

**Blockchain Costs:**

- Gas for resolutions: $50 - $500 (platform pays)
- **Subtotal:** $50 - $500

**Monitoring & Tools:**

- Sentry: $0 - $26 (error tracking)
- DataDog: $0 - $15 (monitoring)
- **Subtotal:** $0 - $41

**Total Monthly Operational Cost:** $71 - $823

### 12.3 Revenue Model

**Platform Fee:** 10% on all winning payouts and cancellations

**Break-even Analysis:**

- At $823/month costs, need $8,230/month in total payouts
- If 10% fee, need $82,300/month in bet volume
- Average bet size: $10 → need 8,230 bets/month
- Or 270 bets/day

**Conservative Projections:**

| Month | Users | Daily Bets | Volume   | Payouts | Revenue (10%) | Profit  |
| ----- | ----- | ---------- | -------- | ------- | ------------- | ------- |
| 1     | 50    | 20         | $2,000   | $1,000  | $100          | -$700   |
| 2     | 150   | 75         | $7,500   | $3,750  | $375          | -$450   |
| 3     | 300   | 200        | $20,000  | $10,000 | $1,000        | +$180   |
| 6     | 1,000 | 500        | $50,000  | $25,000 | $2,500        | +$1,700 |
| 12    | 3,000 | 1,500      | $150,000 | $75,000 | $7,500        | +$6,700 |

**Break-even:** Month 3 (conservative estimate)

---

## 13. Risk Mitigation

### 13.1 Technical Risks

**Smart Contract Bugs:**

- Mitigation: Thorough testing, security audit, gradual rollout
- Contingency: Pausable contract, emergency withdrawal

**AI Resolution Errors:**

- Mitigation: Multi-source evidence, confidence threshold
- Contingency: Manual override, dispute system (future)

**Blockchain Downtime:**

- Mitigation: Use reliable RPC providers, fallback RPCs
- Contingency: Cache data, graceful degradation

### 13.2 Business Risks

**Low User Adoption:**

- Mitigation: Marketing, partnerships, airdrops
- Contingency: Pivot features, adjust strategy

**Regulatory Issues:**

- Mitigation: Terms of service, geographic restrictions
- Contingency: Legal consultation, compliance measures

**Competition:**

- Mitigation: Unique features (dark pools, AI resolution)
- Contingency: Rapid feature development, user feedback

---

## 14. Next Steps

### Immediate Actions (This Week):

1. **Review and Approve Plans:**
   - Review this implementation plan
   - Review frontend audit report
   - Provide feedback and adjustments

2. **Set Up Development Environment:**
   - Create GitHub repository (if not exists)
   - Set up project boards (Jira/Linear/GitHub Projects)
   - Create BSC Testnet wallets (get test BNB)
   - Register for required API keys (Gemini, NewsAPI, etc.)

3. **Assign Roles:**
   - Smart Contract Developer
   - Backend API Developer
   - Integration & Testing Lead
   - DevOps Engineer (optional)

### Week 1 Kickoff:

1. **Smart Contracts:**
   - Initialize Hardhat project
   - Write PredictionMarket.sol
   - Write comprehensive tests
   - Deploy to BSC Testnet

2. **Backend:**
   - Initialize Node.js/Express project
   - Set up MongoDB connection
   - Create basic API structure
   - Implement first endpoints

3. **Documentation:**
   - API documentation (Swagger/OpenAPI)
   - Smart contract documentation
   - Development setup guide

---

## 15. Conclusion

This implementation plan provides a comprehensive roadmap for building the backend API and smart contracts that integrate with your existing DarkBet frontend. The architecture is designed to be:

- **Scalable:** Can handle thousands of users and predictions
- **Secure:** Multiple layers of security (smart contracts, backend, frontend)
- **Automated:** AI-powered resolution with minimal manual intervention
- **Reliable:** Event-driven updates, error handling, monitoring
- **Cost-effective:** Efficient infrastructure, low operational costs

**Key Highlights:**

- ✅ Complete smart contract design (PredictionMarket + Vault)
- ✅ Comprehensive backend API with all required endpoints
- ✅ AI resolution system with 25+ evidence sources
- ✅ Real-time updates via WebSocket
- ✅ Security best practices throughout
- ✅ Clear deployment strategy (testnet → audit → mainnet)
- ✅ Realistic timeline (5 weeks) and budget ($21k-$52k)

**Success Criteria:**

- Users can create prediction markets
- Users can place bets and claim winnings
- Markets resolve automatically and accurately (80%+ accuracy)
- Platform is profitable within 3-6 months
- No critical security vulnerabilities
- 99.9% uptime

With the frontend already complete and this detailed implementation plan, you're well-positioned to bring DarkBet to life on the BNB Chain. The next step is to begin development following this roadmap, starting with smart contracts and backend infrastructure.

---

**End of Implementation Plan**

**Questions or clarifications?** Refer back to the [Frontend Audit Report](./reports/frontend-audit.md) for detailed analysis of what's already built, and this document for how to build the missing pieces.

**Ready to start?** Begin with Week 1 tasks (smart contracts) and proceed through the timeline. Good luck! 🚀
