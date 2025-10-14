# 📋 Frontend Integration Plan - DarkBet

**Date:** October 14, 2025  
**Status:** Ready for Implementation  
**Goal:** Replace all hardcoded frontend data with live backend API and smart contract interactions

---

## 🎯 Executive Summary

The DarkBet frontend is currently using **mock/hardcoded data** for all markets, bets, and user interactions. This document outlines the complete plan to integrate:

1. **Backend API** (MongoDB cache) - Fast queries for market data
2. **Smart Contracts** (BSC Testnet) - Live blockchain interactions via Privy + Ethers.js
3. **Real-time updates** - Wallet transactions and state management

---

## 📊 Current State Analysis

### Hardcoded Data Locations

| File | Lines | Hardcoded Data | Count |
|------|-------|----------------|-------|
| `app/page.tsx` | 21-232 | `mockPredictions` array | 10 markets |
| `app/page.tsx` | 260-299 | Mock bet placement logic | - |
| `app/page.tsx` | 301-349 | Mock prediction creation | - |
| `app/my-bets/page.tsx` | 15-40 | `mockUserBets` array | 2 bets |
| `app/my-bets/page.tsx` | 42-89 | `mockPredictions` object | 2 markets |
| `app/leaderboard/page.tsx` | 40-106 | `mockLeaderboard` array | 5 entries |

### Components Using Mock Data

1. ✅ **`components/prediction/prediction-card.tsx`** - ✅ No hardcoded data (receives props)
2. ⚠️ **`components/prediction/create-bet-modal.tsx`** - Uses AI service (working), needs contract integration
3. ⚠️ **`components/prediction/filters.tsx`** - Filters client-side only (needs API integration)

---

## 🔄 Data Flow Architecture

### Current (Mock) Flow:
```
Frontend Component
    ↓
Local State (mockPredictions)
    ↓
Display in UI
```

### New (Live) Flow:
```
Frontend Component
    ↓
Backend API (GET /api/markets) ← MongoDB Cache ← Blockchain Events
    ↓
Display in UI

User Action (Bet/Create)
    ↓
Smart Contract Call (via Privy + Ethers.js)
    ↓
Transaction Confirmed
    ↓
Backend Event Listener Updates MongoDB
    ↓
Frontend Refetches Data
```

---

## 📑 Integration Tasks by Component

### 1. **Home Page (`app/page.tsx`)**

**Current Issues:**
- Uses `mockPredictions` array (10 hardcoded markets)
- Mock bet placement (`handleBet`)
- Mock prediction creation (`handleCreatePrediction`)
- Mock stats calculation

**Integration Steps:**

#### 1.1 Fetch Markets from API
```typescript
// Replace mockPredictions with API call
const [predictions, setPredictions] = useState<Prediction[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  async function fetchMarkets() {
    try {
      const response = await fetch('http://localhost:3001/api/markets?status=0&limit=50');
      const data = await response.json();
      
      if (data.success) {
        // Transform backend data to frontend format
        const transformedMarkets = data.data.map(market => ({
          id: market.marketId.toString(),
          title: market.title,
          description: market.description,
          category: mapCategory(market.category), // Map number to category string
          status: mapStatus(market.status), // Map number to status string
          createdAt: new Date(market.createdAt).getTime(),
          expiresAt: new Date(market.expiresAt).getTime(),
          creator: market.creator,
          totalPool: parseFloat(ethers.formatEther(market.totalPool)),
          yesPool: parseFloat(ethers.formatEther(market.yesPool)),
          noPool: parseFloat(ethers.formatEther(market.noPool)),
          // Calculate prices using FPMM formula
          yesPrice: calculatePrice(market.yesPool, market.totalPool),
          noPrice: calculatePrice(market.noPool, market.totalPool),
          totalShares: parseFloat(ethers.formatEther(market.yesShares)) + parseFloat(ethers.formatEther(market.noShares)),
          yesShares: parseFloat(ethers.formatEther(market.yesShares)),
          noShares: parseFloat(ethers.formatEther(market.noShares)),
          participants: market.participants,
          isHot: market.participants > 50 || parseFloat(ethers.formatEther(market.totalPool)) > 1.0,
          summary: market.summary, // If backend stores AI summary
          resolution: market.outcome !== undefined ? {
            outcome: market.outcome ? 'yes' : 'no',
            resolvedAt: Date.now(),
            reasoning: market.resolutionReasoning,
            evidence: []
          } : undefined
        }));
        
        setPredictions(transformedMarkets);
      }
    } catch (error) {
      console.error('Failed to fetch markets:', error);
    } finally {
      setLoading(false);
    }
  }
  
  fetchMarkets();
  // Refetch every 30 seconds
  const interval = setInterval(fetchMarkets, 30000);
  return () => clearInterval(interval);
}, []);
```

**Data Source:** Backend API → `GET /api/markets`  
**Endpoint:** `http://localhost:3001/api/markets?status=0`

#### 1.2 Implement Real Bet Placement
```typescript
// Replace mock handleBet
const handleBet = async (predictionId: string, outcome: 'yes' | 'no') => {
  if (!authenticated || !user) {
    alert('Please connect your wallet to place a bet');
    return;
  }
  
  try {
    // Step 1: Generate commit hash (darkpool privacy)
    const betAmount = prompt('Enter bet amount (BNB):');
    if (!betAmount) return;
    
    const amount = ethers.parseEther(betAmount);
    const salt = ethers.hexlify(ethers.randomBytes(32)); // Random salt
    const userAddress = user.wallet?.address;
    
    // Create commit hash: keccak256(outcome, salt, userAddress)
    const commitHash = ethers.keccak256(
      ethers.AbiCoder.defaultAbiCoder().encode(
        ['bool', 'bytes32', 'address'],
        [outcome === 'yes', salt, userAddress]
      )
    );
    
    // Store salt securely for reveal (localStorage for now, better: encrypted)
    localStorage.setItem(`bet_${predictionId}_salt`, salt);
    localStorage.setItem(`bet_${predictionId}_outcome`, outcome);
    
    // Step 2: Call smart contract commitBet()
    const predictionMarketAddress = process.env.NEXT_PUBLIC_PREDICTION_CONTRACT_ADDRESS;
    const predictionMarketABI = await fetch('/deployments/bscTestnet/PredictionMarket.json').then(r => r.json());
    
    const provider = await getEthersProvider();
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(predictionMarketAddress, predictionMarketABI, signer);
    
    // Send transaction
    const tx = await contract.commitBet(predictionId, commitHash, {
      value: amount
    });
    
    console.log('Transaction sent:', tx.hash);
    alert(`Committing bet... Transaction: ${tx.hash}`);
    
    // Wait for confirmation
    await tx.wait();
    
    // Step 3: Index in backend (optional, event listener does this automatically)
    await fetch(`http://localhost:3001/api/markets/${predictionId}/commit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: userAddress,
        commitHash,
        amount: amount.toString(),
        txHash: tx.hash
      })
    });
    
    alert('Bet committed successfully! Remember to reveal before market closes.');
    
    // Refresh markets
    // ... refetch logic
  } catch (error) {
    console.error('Bet failed:', error);
    alert('Transaction failed. Please try again.');
  }
};
```

**Data Source:** Smart Contract → `PredictionMarket.commitBet()`  
**Contract:** `0x672e13Cc6196c784EF3bf0762A18d2645F0f12ca`

#### 1.3 Implement Real Market Creation
```typescript
const handleCreatePrediction = async (data: CreatePredictionData) => {
  if (!authenticated || !user) {
    alert('Please connect your wallet to create a prediction');
    return;
  }

  try {
    // Step 1: Call smart contract createMarket()
    const predictionMarketAddress = process.env.NEXT_PUBLIC_PREDICTION_CONTRACT_ADDRESS;
    const predictionMarketABI = await fetch('/deployments/bscTestnet/PredictionMarket.json').then(r => r.json());
    
    const provider = await getEthersProvider();
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(predictionMarketAddress, predictionMarketABI, signer);
    
    // Create market on-chain
    const expirationTimestamp = Math.floor(data.expiresAt / 1000); // Convert to seconds
    const categoryNumber = mapCategoryToNumber(data.category); // Map string to 0-7
    
    const tx = await contract.createMarket(
      data.title,
      data.description,
      expirationTimestamp,
      categoryNumber
    );
    
    console.log('Market creation tx:', tx.hash);
    alert(`Creating market... Transaction: ${tx.hash}`);
    
    // Wait for confirmation
    const receipt = await tx.wait();
    
    // Extract marketId from event
    const event = receipt.logs.find(log => {
      try {
        const parsed = contract.interface.parseLog(log);
        return parsed?.name === 'MarketCreated';
      } catch {
        return false;
      }
    });
    
    const marketId = event ? contract.interface.parseLog(event).args[0] : null;
    
    // Step 2: Place initial bet (if user wants to)
    if (data.bnbAmount > 0) {
      // Commit initial bet using same flow as handleBet
      await handleBet(marketId.toString(), data.userPrediction);
    }
    
    alert('Market created successfully!');
    setShowCreateModal(false);
    
    // Refresh markets
    // ... refetch logic
  } catch (error) {
    console.error('Market creation failed:', error);
    alert('Transaction failed. Please try again.');
  }
};
```

**Data Source:** Smart Contract → `PredictionMarket.createMarket()`  
**Backend Sync:** Event listener automatically indexes

#### 1.4 Fetch Live Stats
```typescript
const stats = {
  totalPredictions: predictions.length,
  activePredictions: predictions.filter(p => p.status === 'active').length,
  totalVolume: predictions.reduce((sum, p) => sum + p.totalPool, 0),
  totalParticipants: predictions.reduce((sum, p) => sum + p.participants, 0), // Real count
};
```

**Data Source:** Derived from fetched predictions

---

### 2. **My Bets Page (`app/my-bets/page.tsx`)**

**Current Issues:**
- Uses `mockUserBets` array
- Uses `mockPredictions` object
- Mock claim functionality

**Integration Steps:**

#### 2.1 Fetch User Bets from Backend
```typescript
useEffect(() => {
  async function fetchUserBets() {
    if (!authenticated || !user) return;
    
    try {
      const userAddress = user.wallet?.address;
      
      // Fetch user's bets from backend
      // Note: Backend doesn't have a user-specific endpoint yet, so we'll need to add it
      // For now, we can query smart contract directly
      
      const predictionMarketAddress = process.env.NEXT_PUBLIC_PREDICTION_CONTRACT_ADDRESS;
      const predictionMarketABI = await fetch('/deployments/bscTestnet/PredictionMarket.json').then(r => r.json());
      
      const provider = await getEthersProvider();
      const contract = new ethers.Contract(predictionMarketAddress, predictionMarketABI, provider);
      
      // Get market count
      const marketCount = await contract.getMarketCount();
      
      // Query bets for each market
      const bets: UserBet[] = [];
      for (let i = 1; i <= marketCount; i++) {
        const bet = await contract.getBet(i, userAddress);
        if (bet.amount > 0) {
          bets.push({
            id: `${i}-${userAddress}`,
            predictionId: i.toString(),
            user: userAddress,
            outcome: bet.outcome ? 'yes' : 'no',
            shares: parseFloat(ethers.formatEther(bet.shares)),
            amount: parseFloat(ethers.formatEther(bet.amount)),
            price: parseFloat(ethers.formatEther(bet.amount)) / parseFloat(ethers.formatEther(bet.shares)),
            createdAt: Number(bet.revealedAt) * 1000,
            claimed: bet.claimed,
            payout: 0 // Calculate from contract
          });
        }
      }
      
      setUserBets(bets);
      
      // Fetch associated predictions
      const marketIds = bets.map(b => b.predictionId);
      const marketsData: { [id: string]: Prediction } = {};
      
      for (const id of marketIds) {
        const response = await fetch(`http://localhost:3001/api/markets/${id}`);
        const data = await response.json();
        if (data.success) {
          // Transform to Prediction type
          marketsData[id] = transformMarketData(data.data);
        }
      }
      
      setPredictions(marketsData);
    } catch (error) {
      console.error('Failed to fetch user bets:', error);
    }
  }
  
  fetchUserBets();
}, [authenticated, user]);
```

**Data Source:** Smart Contract → `PredictionMarket.getBet()` + Backend API → `GET /api/markets/:id`

#### 2.2 Implement Real Claim Functionality
```typescript
const handleClaim = async (betId: string) => {
  try {
    const bet = userBets.find(b => b.id === betId);
    if (!bet) return;
    
    const predictionMarketAddress = process.env.NEXT_PUBLIC_PREDICTION_CONTRACT_ADDRESS;
    const predictionMarketABI = await fetch('/deployments/bscTestnet/PredictionMarket.json').then(r => r.json());
    
    const provider = await getEthersProvider();
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(predictionMarketAddress, predictionMarketABI, signer);
    
    // Call claimWinnings
    const tx = await contract.claimWinnings(bet.predictionId);
    
    alert(`Claiming winnings... Transaction: ${tx.hash}`);
    
    await tx.wait();
    
    alert('Winnings claimed successfully!');
    
    // Update local state
    setUserBets(prev => prev.map(b => 
      b.id === betId ? { ...b, claimed: true } : b
    ));
  } catch (error) {
    console.error('Claim failed:', error);
    alert('Claim failed. Please try again.');
  }
};
```

**Data Source:** Smart Contract → `PredictionMarket.claimWinnings()`

---

### 3. **Leaderboard Page (`app/leaderboard/page.tsx`)**

**Current Issues:**
- Uses `mockLeaderboard` array (5 hardcoded entries)

**Integration Steps:**

#### 3.1 Fetch Leaderboard from Backend

**Note:** Backend doesn't have leaderboard endpoint yet. Two options:

**Option A: Add backend endpoint (recommended)**
```typescript
// Backend: Add GET /api/leaderboard endpoint that aggregates user bets

useEffect(() => {
  async function fetchLeaderboard() {
    try {
      const response = await fetch(`http://localhost:3001/api/leaderboard?timeframe=${selectedTimeframe}&category=${selectedCategory}`);
      const data = await response.json();
      
      if (data.success) {
        setLeaderboard(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    }
  }
  
  fetchLeaderboard();
}, [selectedTimeframe, selectedCategory]);
```

**Option B: Query contracts directly (slower)**
```typescript
// Query all markets, aggregate user winnings on frontend
// Not recommended for production (slow and resource-intensive)
```

**Data Source:** Backend API → `GET /api/leaderboard` (needs to be implemented)  
**Status:** ⚠️ **Requires new backend endpoint**

---

### 4. **Filters Component (`components/prediction/filters.tsx`)**

**Current Issues:**
- Filters work client-side only
- Should leverage backend API filtering

**Integration Steps:**

#### 4.1 Pass Filters to API Call
```typescript
// In parent component (app/page.tsx)
useEffect(() => {
  async function fetchMarkets() {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', mapStatusToNumber(filters.status).toString());
    if (filters.category) params.append('category', mapCategoryToNumber(filters.category).toString());
    if (filters.timeRange) params.append('createdAfter', getTimeRangeTimestamp(filters.timeRange).toString());
    
    const response = await fetch(`http://localhost:3001/api/markets?${params.toString()}`);
    // ... rest of logic
  }
  
  fetchMarkets();
}, [filters]);
```

**Data Source:** Backend API with query parameters

---

### 5. **Prediction Card (`components/prediction/prediction-card.tsx`)**

**Status:** ✅ Already receives data via props, no changes needed

---

### 6. **Create Bet Modal (`components/prediction/create-bet-modal.tsx`)**

**Current State:**
- AI service integration ✅ Working
- Transaction sending (line 308-316 in page.tsx) ⚠️ Incomplete

**Integration Steps:**

#### 6.1 Complete Transaction Logic
Already covered in section 1.3 (Market Creation)

---

## 🔧 Helper Functions Needed

### Mapping Functions
```typescript
// lib/blockchain-utils.ts

export function mapCategoryToNumber(category: string): number {
  const mapping: { [key: string]: number } = {
    'sports': 0,
    'crypto': 1,
    'politics': 2,
    'entertainment': 3,
    'weather': 4,
    'finance': 5,
    'technology': 6,
    'custom': 7,
  };
  return mapping[category] || 7;
}

export function mapCategory(num: number): string {
  const mapping = ['sports', 'crypto', 'politics', 'entertainment', 'weather', 'finance', 'technology', 'custom'];
  return mapping[num] || 'custom';
}

export function mapStatusToNumber(status: string): number {
  const mapping: { [key: string]: number } = {
    'active': 0,
    'resolving': 1,
    'resolved': 2,
    'cancelled': 3,
  };
  return mapping[status] || 0;
}

export function mapStatus(num: number): string {
  const mapping = ['active', 'resolving', 'resolved', 'cancelled'];
  return mapping[num] || 'active';
}

export function calculatePrice(pool: string, totalPool: string): number {
  const poolBN = BigInt(pool);
  const totalPoolBN = BigInt(totalPool);
  if (totalPoolBN === 0n) return 0.5;
  
  // Price = pool / total in BNB, then normalize to 0.01 scale
  const priceRatio = Number(poolBN) / Number(totalPoolBN);
  return priceRatio * 0.01; // Match frontend mock data scale
}

export async function getEthersProvider() {
  // Get provider from Privy
  const privy = usePrivy(); // Use within component
  const provider = await privy.getEthereumProvider();
  return new ethers.BrowserProvider(provider);
}
```

### Commit-Reveal Helper
```typescript
// lib/commit-reveal.ts

export function generateCommit(outcome: 'yes' | 'no', userAddress: string): { commitHash: string; salt: string } {
  const salt = ethers.hexlify(ethers.randomBytes(32));
  const commitHash = ethers.keccak256(
    ethers.AbiCoder.defaultAbiCoder().encode(
      ['bool', 'bytes32', 'address'],
      [outcome === 'yes', salt, userAddress]
    )
  );
  
  return { commitHash, salt };
}

export function storeCommitSecret(marketId: string, salt: string, outcome: 'yes' | 'no') {
  // Store in localStorage (encrypted in production)
  localStorage.setItem(`bet_${marketId}_salt`, salt);
  localStorage.setItem(`bet_${marketId}_outcome`, outcome);
}

export function getCommitSecret(marketId: string): { salt: string; outcome: 'yes' | 'no' } | null {
  const salt = localStorage.getItem(`bet_${marketId}_salt`);
  const outcome = localStorage.getItem(`bet_${marketId}_outcome`) as 'yes' | 'no';
  
  if (!salt || !outcome) return null;
  return { salt, outcome };
}

export function clearCommitSecret(marketId: string) {
  localStorage.removeItem(`bet_${marketId}_salt`);
  localStorage.removeItem(`bet_${marketId}_outcome`);
}
```

---

## 📡 Backend API Requirements

### Existing Endpoints ✅
- `GET /api/markets` - List markets
- `GET /api/markets/:id` - Get single market
- `POST /api/markets/:id/commit` - Index commitment
- `POST /api/markets/:id/reveal` - Index reveal
- `POST /api/markets/:id/resolve` - Index resolution

### New Endpoints Needed ⚠️
- `GET /api/users/:address/bets` - Get user's bets (for My Bets page)
- `GET /api/leaderboard` - Get leaderboard with filters (for Leaderboard page)
- `GET /api/users/:address/stats` - Get user stats (wins, losses, volume)

---

## 🎯 Implementation Priority

### Phase 1: Core Market Functionality (High Priority)
1. ✅ Fetch markets from API (`app/page.tsx`)
2. ✅ Display live market data
3. ✅ Implement commit bet flow (smart contract + storage)
4. ✅ Implement create market flow

### Phase 2: User Features (Medium Priority)
5. ✅ Fetch user bets (`app/my-bets/page.tsx`)
6. ✅ Implement reveal bet flow
7. ✅ Implement claim winnings
8. ✅ Add reveal reminder UI

### Phase 3: Additional Features (Lower Priority)
9. ⏳ Leaderboard (requires new backend endpoint)
10. ⏳ Real-time updates (WebSocket or polling)
11. ⏳ Transaction history
12. ⏳ Notifications

---

## 🔐 Privy Integration Checklist

### Wallet Authentication ✅
- [x] Privy provider configured
- [x] Connect/disconnect wallet
- [x] Session management

### Transaction Signing
- [ ] Get Ethers provider from Privy
- [ ] Sign transactions with Privy wallet
- [ ] Handle transaction errors
- [ ] Show transaction confirmation UI
- [ ] Handle network switching (BSC Testnet)

### User Session
- [ ] Check authentication before actions
- [ ] Display wallet address
- [ ] Show BNB balance
- [ ] Handle wallet changes

---

## 📝 Implementation Checklist

### `app/page.tsx`
- [ ] Remove `mockPredictions` array
- [ ] Add `fetchMarkets()` function
- [ ] Replace `handleBet()` with smart contract call
- [ ] Replace `handleCreatePrediction()` with smart contract call
- [ ] Add loading states
- [ ] Add error handling
- [ ] Add transaction confirmation UI

### `app/my-bets/page.tsx`
- [ ] Remove `mockUserBets` array
- [ ] Remove `mockPredictions` object
- [ ] Add `fetchUserBets()` function
- [ ] Replace `handleClaim()` with smart contract call
- [ ] Add loading states
- [ ] Add error handling

### `app/leaderboard/page.tsx`
- [ ] Remove `mockLeaderboard` array
- [ ] Add `fetchLeaderboard()` function (pending backend endpoint)
- [ ] Add loading states
- [ ] Add error handling

### Helper Files
- [ ] Create `lib/blockchain-utils.ts`
- [ ] Create `lib/commit-reveal.ts`
- [ ] Create `lib/contract-loader.ts`
- [ ] Add types for blockchain data

### UI/UX
- [ ] Add loading spinners
- [ ] Add transaction pending states
- [ ] Add success/error toasts
- [ ] Add reveal reminder notifications
- [ ] Add "Unrevealed Bets" section in My Bets

---

## 🧪 Testing Checklist

### Market Listing
- [ ] Markets load from backend
- [ ] Filters work correctly
- [ ] Stats display correctly
- [ ] Loading states show
- [ ] Empty state shows when no markets

### Betting Flow
1. [ ] User can connect wallet
2. [ ] User can commit bet (transaction succeeds)
3. [ ] Commit is indexed in backend
4. [ ] User can see their commitment in My Bets
5. [ ] User can reveal bet before market expires
6. [ ] Reveal updates market pools
7. [ ] Backend syncs revealed bet

### Market Creation
1. [ ] AI analysis works
2. [ ] Form validation works
3. [ ] Transaction sends correctly
4. [ ] Market appears in list
5. [ ] Initial bet commits correctly

### Claiming
1. [ ] Resolved markets show claim button
2. [ ] Claim transaction succeeds
3. [ ] Winnings transfer to wallet
4. [ ] Claim button updates to "Claimed"

### Edge Cases
- [ ] Handle wallet disconnect
- [ ] Handle transaction rejection
- [ ] Handle insufficient gas
- [ ] Handle expired markets
- [ ] Handle unrevealed commitments

---

## 🚨 Known Issues & Limitations

### 1. **Leaderboard Requires New Backend Endpoint**
**Issue:** Backend doesn't have `/api/leaderboard` endpoint  
**Solution:** Either add backend endpoint or use mock data temporarily  
**Priority:** Medium

### 2. **No User-Specific Bet Endpoint**
**Issue:** Backend doesn't have `/api/users/:address/bets`  
**Solution:** Query smart contract directly (slower) or add backend endpoint  
**Priority:** High

### 3. **Reveal Timing**
**Issue:** Users might forget to reveal before market expires  
**Solution:** Add UI reminder, localStorage tracking, notifications  
**Priority:** High

### 4. **Transaction UX**
**Issue:** No pending/success/error states for transactions  
**Solution:** Add toast notifications and loading states  
**Priority:** High

### 5. **Contract Address Configuration**
**Issue:** Contract addresses are in `.env`, need validation  
**Solution:** Add startup check to verify contracts exist  
**Priority:** Medium

---

## 📦 Required Environment Variables

Add to `/darkbet/.env`:
```env
# Contract Addresses (already added)
NEXT_PUBLIC_VAULT_CONTRACT_ADDRESS=0x9D4f9aFed1572a7947a1f6619111d3FfED66db17
NEXT_PUBLIC_PREDICTION_CONTRACT_ADDRESS=0x672e13Cc6196c784EF3bf0762A18d2645F0f12ca
NEXT_PUBLIC_CHAIN_ID=97
NEXT_PUBLIC_NETWORK_NAME=BSC Testnet

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Privy (already configured)
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
```

---

## 🎯 Success Criteria

Integration is complete when:

1. ✅ All markets load from backend API
2. ✅ Users can commit bets via smart contract
3. ✅ Users can reveal bets via smart contract
4. ✅ Users can create markets via smart contract
5. ✅ Users can claim winnings via smart contract
6. ✅ My Bets page shows real user bets
7. ✅ All transactions show proper UI feedback
8. ✅ No hardcoded data remains
9. ✅ Error handling is complete
10. ⏳ Leaderboard shows real data (pending backend endpoint)

---

## 📊 Timeline Estimate

| Phase | Tasks | Estimated Time |
|-------|-------|----------------|
| Setup | Helper functions, types | 1 hour |
| Home Page | Market fetching, betting, creation | 3 hours |
| My Bets | Fetch bets, reveal, claim | 2 hours |
| UI/UX | Loading states, toasts, errors | 1 hour |
| Testing | Full flow testing | 2 hours |
| **Total** | | **9 hours** |

*Note: Leaderboard not included (requires backend work)*

---

## 🎬 Next Steps

**After Plan Approval:**

1. Create helper functions (`lib/blockchain-utils.ts`, `lib/commit-reveal.ts`)
2. Update `app/page.tsx` - market fetching & betting
3. Update `app/my-bets/page.tsx` - user bets & claiming
4. Add UI feedback (toasts, loading, errors)
5. Test full betting flow (commit → reveal → resolve → claim)
6. Document test results in `integration-test-report.md`

**Backend Team (if available):**
- Add `GET /api/users/:address/bets` endpoint
- Add `GET /api/leaderboard` endpoint

---

## ⚠️ Important Reminders

1. **DO NOT redesign UI** - Only wire functionality
2. **DO NOT touch backend code** - Only call APIs
3. **Test on BSC Testnet only** - No mainnet
4. **Store commit secrets securely** - Consider encryption
5. **Handle Privy wallet properly** - Check authentication
6. **Wait for transaction confirmations** - Don't assume success

---

**Status:** ✅ **Plan Complete - Awaiting Approval**  
**Next:** Wait for human review before proceeding to Step 2 (coding)

---

**Created:** October 14, 2025  
**By:** AI Assistant  
**For:** DarkBet Frontend Integration

