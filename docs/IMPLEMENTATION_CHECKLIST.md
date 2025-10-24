# Darkbet Solana Migration - Implementation Checklist

**Practical Task List for Development Team**  
**Use this checklist to track progress through each phase**

---

## ✅ Phase 1: Foundation (Weeks 1-4)

### Week 1: Environment Setup

#### Development Tools
- [ ] Install Rust (`curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`)
- [ ] Install Solana CLI (`sh -c "$(curl -sSfL https://release.solana.com/stable/install)"`)
- [ ] Install Anchor CLI (`cargo install --git https://github.com/coral-xyz/anchor avm --locked && avm install latest && avm use latest`)
- [ ] Install Node.js 18+ and npm/yarn
- [ ] Install Cargo (Rust package manager)

#### Project Initialization
- [ ] Create new Anchor project: `anchor init darkbet-solana`
- [ ] Set up GitHub repository: `git remote add origin https://github.com/trenchsheikh/PredictX-Encode-Hackathon`
- [ ] Configure `.gitignore` for Rust and Node.js
- [ ] Set up CI/CD pipeline (GitHub Actions for tests)
- [ ] Create development/staging/production branches

#### Solana Configuration
- [ ] Generate devnet wallet: `solana-keygen new --outfile ~/.config/solana/devnet.json`
- [ ] Configure devnet: `solana config set --url https://api.devnet.solana.com`
- [ ] Airdrop devnet SOL: `solana airdrop 2`
- [ ] Register for Helius devnet API key
- [ ] Test RPC connection with `solana balance`

---

### Week 2: Core Program Development

#### PredictionMarket Program

##### Account Structures
- [ ] Define `Market` account structure
  ```rust
  #[account]
  pub struct Market {
      pub authority: Pubkey,
      pub market_id: u64,
      pub asset_type: AssetType,
      pub resolution_time: i64,
      pub pyth_feed_account: Pubkey,
      pub total_long_stake: u64,
      pub total_short_stake: u64,
      pub status: MarketStatus,
      pub settlement_price: Option<i64>,
      pub bump: u8,
  }
  ```
- [ ] Define `UserPosition` account structure
- [ ] Define `AssetType` enum (BTC, ETH, SOL, etc.)
- [ ] Define `MarketStatus` enum (Open, Locked, Resolved, Cancelled)
- [ ] Define `Direction` enum (LONG, SHORT)

##### PDA Seeds
- [ ] Implement market PDA: `[b"market", market_id.to_le_bytes()]`
- [ ] Implement position PDA: `[b"position", user.key(), market.key()]`
- [ ] Add bump seed tracking to all PDAs

##### Instructions
- [ ] Implement `initialize_market()` instruction
  - [ ] Authority signer check
  - [ ] Market account initialization
  - [ ] Validate resolution_time is future
  - [ ] Validate Pyth feed account exists
  - [ ] Emit `MarketCreated` event
- [ ] Add error codes (`ErrorCode` enum)
- [ ] Add event definitions (`#[event]` macro)

##### Testing
- [ ] Write test: `test_initialize_market_success()`
- [ ] Write test: `test_initialize_market_invalid_time()`
- [ ] Write test: `test_initialize_market_unauthorized()`
- [ ] Run tests: `anchor test`
- [ ] Deploy to devnet: `anchor deploy --provider.cluster devnet`

---

### Week 3: Commit-Reveal Logic

#### CommitReveal Module

##### Commit Phase
- [ ] Implement `commit_bet()` instruction
  - [ ] Accept parameters: `amount: u64`, `commitment_hash: [u8; 32]`
  - [ ] Validate market status is `Open`
  - [ ] Transfer SOL from user to vault
  - [ ] Store commitment hash in `UserPosition`
  - [ ] Update market stake totals (initially neutral)
  - [ ] Emit `BetCommitted` event
- [ ] Add validation: minimum bet amount (e.g., 0.01 SOL)
- [ ] Add validation: maximum bet amount (e.g., 100 SOL)
- [ ] Add validation: user doesn't already have position

##### Reveal Phase
- [ ] Implement `reveal_bet()` instruction
  - [ ] Accept parameters: `direction: Direction`, `nonce: String`
  - [ ] Validate market status is `Locked`
  - [ ] Recompute hash: `Blake3(direction || nonce || timestamp)`
  - [ ] Verify hash matches stored commitment
  - [ ] Update `direction` in `UserPosition`
  - [ ] Increment `total_long_stake` or `total_short_stake`
  - [ ] Mark position as `revealed: true`
  - [ ] Emit `BetRevealed` event
- [ ] Add time-bound reveal window (5 minutes after lock)
- [ ] Implement forfeiture logic for unrevealed bets

##### Market Lifecycle
- [ ] Implement `lock_market()` instruction
  - [ ] Check `Clock::get().unix_timestamp >= market.resolution_time - 300`
  - [ ] Set status to `Locked`
- [ ] Add automated lock via cron job (off-chain keeper)

##### Testing
- [ ] Write test: `test_commit_bet_success()`
- [ ] Write test: `test_commit_bet_market_locked()`
- [ ] Write test: `test_reveal_bet_success()`
- [ ] Write test: `test_reveal_bet_invalid_hash()`
- [ ] Write test: `test_reveal_bet_timeout_forfeiture()`
- [ ] Run full test suite: `anchor test`

---

### Week 4: Vault & User Registry

#### VaultManager Program

##### Vault Account
- [ ] Define `Vault` account structure
  ```rust
  #[account]
  pub struct Vault {
      pub authority: Pubkey,
      pub total_deposits: u64,
      pub total_fees_collected: u64,
      pub protocol_fee_bps: u16,  // e.g., 200 = 2%
      pub bump: u8,
  }
  ```
- [ ] Implement vault PDA: `[b"vault"]`
- [ ] Initialize vault in deploy script

##### Instructions
- [ ] Implement `deposit()` instruction (user deposits SOL)
- [ ] Implement `withdraw()` instruction (user withdraws available balance)
- [ ] Implement `collect_fees()` instruction (admin only)
- [ ] Add access control for admin functions

##### Testing
- [ ] Write test: `test_deposit_success()`
- [ ] Write test: `test_withdraw_success()`
- [ ] Write test: `test_collect_fees_admin_only()`

#### UserRegistry Program

##### UserProfile Account
- [ ] Define `UserProfile` account structure
  ```rust
  #[account]
  pub struct UserProfile {
      pub wallet: Pubkey,
      pub id_commitment: [u8; 32],
      pub concordium_linked: bool,
      pub registration_time: i64,
      pub total_volume: u64,
      pub bump: u8,
  }
  ```
- [ ] Implement profile PDA: `[b"profile", user.key()]`

##### Instructions
- [ ] Implement `create_profile()` instruction
- [ ] Implement `link_concordium_id()` instruction (stores id_commitment)
- [ ] Add validation: id_commitment must be 32 bytes

##### Testing
- [ ] Write test: `test_create_profile()`
- [ ] Write test: `test_link_concordium_id()`

#### Deployment
- [ ] Build all programs: `anchor build`
- [ ] Deploy to devnet: `anchor deploy --provider.cluster devnet`
- [ ] Verify deployments on Solana Explorer
- [ ] Save program IDs to `deployments/solana/devnet.json`

---

## 🔮 Phase 2: Oracle Integration (Weeks 5-6)

### Week 5: On-Chain Pyth Integration

#### Dependencies
- [ ] Add `pyth-sdk-solana = "0.10.0"` to `Cargo.toml`
- [ ] Run `cargo update` to resolve dependencies

#### Resolve Market Instruction
- [ ] Implement `resolve_market()` instruction
  - [ ] Accept Pyth price account as parameter
  - [ ] Load price feed: `load_price_feed_from_account_info()`
  - [ ] Extract current price: `price_feed.get_current_price()`
  - [ ] Validate staleness: `publish_time < 60s ago`
  - [ ] Validate confidence: `conf < 1% of price`
  - [ ] Store `settlement_price` in market
  - [ ] Set status to `Resolved`
  - [ ] Emit `MarketResolved` event
- [ ] Add error codes: `PriceUnavailable`, `StalePriceData`, `LowConfidencePrice`

#### Circuit Breakers
- [ ] Add validation: reject if price moved > 20% since market creation
- [ ] Add admin override for emergency resolution

#### Testing
- [ ] Write test: `test_resolve_market_success()` (using devnet Pyth feeds)
- [ ] Write test: `test_resolve_market_stale_price()`
- [ ] Write test: `test_resolve_market_low_confidence()`
- [ ] Manually test with real Pyth devnet feeds:
  - BTC/USD: `HovQMDrbAgAYPCmHVSrezcSmkMtXSSUsLDFANExrZh2J`
  - ETH/USD: `EdVCmQ9FSPcVe5YySXDPCRmc8aDQLKJ9xvYBMZPie1Vw`

---

### Week 6: Frontend Price Display

#### Dependencies
- [ ] Install Pyth client: `npm install @pythnetwork/price-service-client`
- [ ] Install charting library: `npm install lightweight-charts`

#### Price Service Hook
- [ ] Create `hooks/use-pyth-price.ts`
  ```typescript
  export function usePythPrice(asset: 'BTC' | 'ETH' | 'SOL') {
    const [price, setPrice] = useState<number>(0);
    const [confidence, setConfidence] = useState<number>(0);
    const [lastUpdate, setLastUpdate] = useState<number>(0);
    
    useEffect(() => {
      const connection = new PriceServiceConnection('https://hermes.pyth.network');
      const priceId = PYTH_FEED_IDS[asset];
      
      connection.subscribePriceFeedUpdates([priceId], (priceFeed) => {
        const p = priceFeed.getPriceUnchecked();
        setPrice(p.price);
        setConfidence(p.conf);
        setLastUpdate(p.publishTime);
      });
      
      return () => connection.closeWebSocket();
    }, [asset]);
    
    return { price, confidence, lastUpdate };
  }
  ```
- [ ] Add price feed IDs to `config/pyth-feeds.ts`

#### UI Components
- [ ] Create `components/prediction/price-display.tsx`
- [ ] Create `components/prediction/price-chart.tsx` (real-time chart)
- [ ] Add price display to market detail page
- [ ] Add confidence interval indicator
- [ ] Add "last updated" timestamp

#### Testing
- [ ] Test WebSocket connection to Pyth Hermes
- [ ] Verify prices update every ~400ms
- [ ] Test reconnection logic on disconnect
- [ ] Test multiple simultaneous feeds (BTC + ETH + SOL)

---

## 🎨 Phase 3: Frontend Migration (Weeks 7-9)

### Week 7: Wallet Adapter

#### Dependencies
- [ ] Install wallet adapter:
  ```bash
  npm install @solana/wallet-adapter-react \
              @solana/wallet-adapter-react-ui \
              @solana/wallet-adapter-wallets \
              @solana/web3.js
  ```
- [ ] Install Phantom wallet adapter: `npm install @solana/wallet-adapter-phantom`

#### Provider Configuration
- [ ] Create `components/providers/solana-wallet-provider.tsx`
- [ ] Configure supported wallets (Phantom, Solflare)
- [ ] Set RPC endpoint (Helius devnet)
- [ ] Wrap app in provider hierarchy:
  ```tsx
  <ConnectionProvider>
    <WalletProvider>
      <WalletModalProvider>
        <App />
      </WalletModalProvider>
    </WalletProvider>
  </ConnectionProvider>
  ```

#### Wallet UI
- [ ] Create wallet connect button component
- [ ] Add wallet address display (truncated: `3XYZ...ABC`)
- [ ] Add disconnect button
- [ ] Add balance display (SOL balance)
- [ ] Test wallet connection flow with Phantom

---

### Week 8: Transaction UI

#### Commit Bet Modal
- [ ] Create `components/prediction/commit-bet-modal.tsx`
- [ ] Add form fields:
  - [ ] Bet amount (SOL input)
  - [ ] Direction selector (LONG/SHORT buttons)
  - [ ] Market details display
  - [ ] Payout calculator (estimate)
- [ ] Implement commit logic:
  - [ ] Generate nonce: `crypto.randomUUID()`
  - [ ] Compute hash: `Blake3(direction || nonce || timestamp)`
  - [ ] Store in localStorage
  - [ ] Build Solana transaction
  - [ ] Sign and send
  - [ ] Show confirmation toast
- [ ] Add error handling (insufficient balance, market locked, etc.)

#### Reveal Bet Modal
- [ ] Create `components/prediction/reveal-bet-modal.tsx`
- [ ] Retrieve stored nonce from localStorage
- [ ] Build reveal transaction
- [ ] Sign and send
- [ ] Show success/error toast
- [ ] Clear localStorage after reveal

#### Claim Winnings Modal
- [ ] Create `components/prediction/claim-winnings-modal.tsx`
- [ ] Display payout calculation
- [ ] Build claim transaction
- [ ] Sign and send
- [ ] Update user balance display

#### Transaction Status
- [ ] Add transaction status component (pending, confirmed, failed)
- [ ] Integrate with `useConnection().confirmTransaction()`
- [ ] Add Solana Explorer link for each transaction
- [ ] Add notification system (toast library: `sonner`)

---

### Week 9: Market Views

#### Market List Page
- [ ] Create `app/markets/page.tsx`
- [ ] Fetch all markets from Solana RPC:
  ```typescript
  const program = new Program(IDL, PROGRAM_ID, provider);
  const markets = await program.account.market.all();
  ```
- [ ] Display market cards with:
  - [ ] Asset (BTC, ETH, SOL)
  - [ ] Question/threshold
  - [ ] Current price (Pyth WebSocket)
  - [ ] Resolution time countdown
  - [ ] Pool sizes (LONG vs SHORT)
  - [ ] Status badge (Open, Locked, Resolved)
- [ ] Add filtering (by asset, status)
- [ ] Add sorting (by resolution time, volume)

#### Market Detail Page
- [ ] Create `app/markets/[id]/page.tsx`
- [ ] Fetch market data by PDA
- [ ] Display detailed info:
  - [ ] Price chart (historical + current)
  - [ ] Pool composition (pie chart)
  - [ ] User's position (if exists)
  - [ ] Other users' positions (aggregated)
- [ ] Add bet placement UI (opens commit modal)
- [ ] Add reveal button (if in reveal window)
- [ ] Add claim button (if market resolved and user won)

#### My Bets Page
- [ ] Create `app/my-bets/page.tsx`
- [ ] Fetch user positions:
  ```typescript
  const positions = await program.account.userPosition.all([
    {
      memcmp: {
        offset: 8, // After discriminator
        bytes: wallet.publicKey.toBase58(),
      },
    },
  ]);
  ```
- [ ] Display table with:
  - [ ] Market name
  - [ ] Direction (LONG/SHORT)
  - [ ] Stake amount
  - [ ] Status (Committed, Revealed, Claimed)
  - [ ] Payout (if won)
- [ ] Add bulk reveal button (reveal all unrevealed)
- [ ] Add bulk claim button (claim all winnings)

#### Testing
- [ ] Test full flow: connect wallet → commit → reveal → claim
- [ ] Test edge cases: market locked, insufficient balance, etc.
- [ ] Test UI responsiveness (mobile, tablet, desktop)

---

## 🔐 Phase 4: Privy Authentication (Weeks 10-11)

### Week 10: Privy Setup

#### Account Configuration
- [ ] Create Privy app at https://dashboard.privy.io
- [ ] Configure app settings:
  - [ ] Enable Solana network
  - [ ] Set default wallet to Phantom
  - [ ] Disable Ethereum/BSC networks
  - [ ] Enable email login
  - [ ] Enable social logins (Google, Twitter, Discord)
- [ ] Copy App ID and App Secret to `.env.local`

#### Dependencies
- [ ] Install Privy SDK: `npm install @privy-io/react-auth`
- [ ] Install Privy Solana connector: `npm install @privy-io/react-auth/solana`

#### Provider Setup
- [ ] Update `components/providers/privy-provider.tsx`:
  ```tsx
  <PrivyProvider
    appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}
    config={{
      loginMethods: ['email', 'wallet', 'google', 'twitter'],
      supportedChains: [
        {
          id: 101,
          name: 'Solana',
          network: 'mainnet-beta',
          // ...
        },
      ],
      walletConnectors: [
        SolanaWalletConnectors.phantom(),
        SolanaWalletConnectors.solflare(),
      ],
    }}
  >
    {children}
  </PrivyProvider>
  ```

#### Testing
- [ ] Test email login flow
- [ ] Test Phantom wallet login
- [ ] Test social login (Google)
- [ ] Verify JWT is issued on successful login
- [ ] Test logout flow

---

### Week 11: Session Management

#### Auth Hook
- [ ] Create `hooks/use-auth.ts`:
  ```typescript
  export function useAuth() {
    const { ready, authenticated, user, login, logout } = usePrivy();
    const { wallets } = useWallets();
    
    const solanaWallet = wallets.find(w => w.walletClientType === 'phantom');
    const publicKey = solanaWallet?.address;
    
    return { ready, authenticated, user, publicKey, login, logout };
  }
  ```

#### Protected Routes
- [ ] Create `components/auth/protected-route.tsx`
- [ ] Wrap authenticated pages:
  ```tsx
  <ProtectedRoute>
    <MyBetsPage />
  </ProtectedRoute>
  ```
- [ ] Redirect unauthenticated users to login

#### User Metadata
- [ ] Configure custom metadata schema in Privy dashboard:
  ```json
  {
    "concordiumIdCommitment": "string",
    "concordiumProofVerified": "boolean",
    "kycStatus": "enum(pending, verified, failed)"
  }
  ```
- [ ] Prepare for Concordium linkage (Phase 5)

#### Testing
- [ ] Test session persistence (refresh page)
- [ ] Test protected route redirect
- [ ] Test concurrent sessions (multiple tabs)
- [ ] Test session expiry and refresh

---

## 🆔 Phase 5: Concordium RG Layer (Weeks 12-15)

### Week 12: Concordium Contract

#### Development Environment
- [ ] Install Concordium software: `cargo concordium install`
- [ ] Install Concordium client: `cargo install concordium-client`
- [ ] Create testnet wallet in Concordium Desktop Wallet
- [ ] Request testnet CCD from faucet: https://faucet.testnet.concordium.com
- [ ] Configure gRPC endpoint: `--grpc-ip grpc.testnet.concordium.com --grpc-port 10000`

#### RG Registry Contract
- [ ] Create new Concordium contract project: `cargo concordium init rg_registry`
- [ ] Define `RGPolicy` structure
- [ ] Define `RGRegistry` state
- [ ] Implement `init()` function
- [ ] Implement `register_user()` function
- [ ] Implement `check_limits()` function
- [ ] Implement `update_stake()` function
- [ ] Implement `self_exclude()` function
- [ ] Implement `set_cooldown()` function

#### Testing
- [ ] Write unit tests for each function
- [ ] Test limit enforcement logic
- [ ] Test rolling window calculations (daily/weekly)
- [ ] Run tests: `cargo concordium test`

#### Deployment
- [ ] Compile contract: `cargo concordium build --schema-out schema.json`
- [ ] Deploy module to testnet
- [ ] Initialize contract instance
- [ ] Save contract address to `.env`

---

### Week 13: Web3 ID Integration

#### Research & Setup
- [ ] Review Concordium Web3 ID documentation
- [ ] Identify supported ID providers (Notabene, Fractal)
- [ ] Create test credentials with ID provider
- [ ] Test selective disclosure (age, jurisdiction)

#### Proof Verification
- [ ] Implement proof verification in backend:
  ```typescript
  import { verifyWeb3IdCredential } from '@concordium/web-sdk';
  
  async function verifyProof(proof: any) {
    const client = new ConcordiumGRPCClient(...);
    return await verifyWeb3IdCredential(client, proof);
  }
  ```
- [ ] Extract attributes from proof (age, jurisdiction)
- [ ] Validate minimum age (18+)
- [ ] Validate jurisdiction (allowed list)

#### Frontend Flow
- [ ] Create `app/verify-identity/page.tsx`
- [ ] Add "Verify Identity" button
- [ ] Redirect to Concordium ID provider
- [ ] Handle callback with proof
- [ ] Submit proof to backend API

#### Testing
- [ ] Test full ID verification flow
- [ ] Test attribute extraction
- [ ] Test rejection (underage, banned jurisdiction)
- [ ] Test proof signature validation

---

### Week 14: Backend Relayer

#### API Endpoints

##### POST /api/rg/link-identity
- [ ] Implement endpoint handler
- [ ] Verify Privy JWT
- [ ] Verify Concordium proof
- [ ] Generate `id_commitment = Blake2b(privyUserId || solanaPubkey)`
- [ ] Call Concordium `register_user()` transaction
- [ ] Update Privy user metadata
- [ ] Update Solana `UserProfile` account
- [ ] Return success response

##### POST /api/rg/check
- [ ] Implement endpoint handler
- [ ] Extract `idCommitment` and `betAmount` from body
- [ ] Query Concordium contract: `check_limits()`
- [ ] Parse response
- [ ] Return `{ allowed: boolean, reason: string }`
- [ ] Add caching (Redis, 1-minute TTL)
- [ ] Add timeout (5 seconds max)

##### POST /api/rg/update-stake
- [ ] Implement endpoint handler (called after bet placed)
- [ ] Verify bet transaction on Solana
- [ ] Call Concordium `update_stake()` transaction
- [ ] Update rolling totals (daily/weekly)
- [ ] Return success response

##### POST /api/rg/self-exclude
- [ ] Implement endpoint handler
- [ ] Verify user owns `idCommitment` (via Privy session)
- [ ] Call Concordium `self_exclude()` transaction
- [ ] Mark permanent exclusion flag
- [ ] Return success response

##### GET /api/rg/audit
- [ ] Implement endpoint handler (regulator access only)
- [ ] Validate API key
- [ ] Query Concordium event logs
- [ ] Aggregate statistics (anonymized)
- [ ] Return audit report

#### Testing
- [ ] Write API tests with `jest` or `vitest`
- [ ] Test happy path for each endpoint
- [ ] Test error cases (invalid proof, timeout, etc.)
- [ ] Test rate limiting
- [ ] Load test with `k6` (100 req/s)

---

### Week 15: Frontend RG UI

#### Identity Verification Flow
- [ ] Create onboarding wizard component
- [ ] Step 1: Connect Privy + Phantom
- [ ] Step 2: Verify Concordium ID
- [ ] Step 3: Set spending limits (optional)
- [ ] Step 4: Confirm and link identity
- [ ] Show success message and redirect to markets

#### Betting Limits UI
- [ ] Add pre-bet validation:
  - [ ] Call `POST /api/rg/check` before opening commit modal
  - [ ] Show error if limit exceeded: "Daily limit reached ($X/$Y)"
  - [ ] Show warning if close to limit: "You have $X remaining today"
- [ ] Display limits in user profile:
  - [ ] Daily limit progress bar
  - [ ] Weekly limit progress bar
  - [ ] Next reset time

#### Self-Exclusion Page
- [ ] Create `app/settings/responsible-gambling/page.tsx`
- [ ] Add self-exclusion button (requires confirmation)
- [ ] Show warning: "This action is permanent and cannot be undone"
- [ ] Implement cooldown setting (e.g., 24 hours, 7 days)
- [ ] Display current exclusion status

#### Testing
- [ ] Test full RG flow: verify ID → place bet → hit limit → blocked
- [ ] Test self-exclusion: exclude → attempt bet → blocked
- [ ] Test cooldown: set cooldown → wait → verify cooldown expired

---

## 🔍 Phase 6: Testing & Audit (Weeks 16-18)

### Week 16: Security Audit

#### Prepare Audit Package
- [ ] Clean up code (remove TODOs, dead code)
- [ ] Add inline documentation (Rust doc comments)
- [ ] Generate documentation: `cargo doc --open`
- [ ] Create audit scope document:
  - [ ] In-scope contracts and functions
  - [ ] Known issues (if any)
  - [ ] Deployment details
- [ ] Provide test accounts and test funds

#### Engage Auditor
- [ ] Contact OtterSec, Neodyme, or Sec3
- [ ] Share audit package
- [ ] Schedule kickoff call
- [ ] Answer auditor questions during review

#### Address Findings
- [ ] Receive preliminary report
- [ ] Categorize findings (critical, high, medium, low, informational)
- [ ] Fix critical and high findings immediately
- [ ] Discuss medium findings with auditor
- [ ] Document decisions for informational findings
- [ ] Request final report

---

### Week 17: Stress Testing

#### Load Testing
- [ ] Set up load testing environment (devnet with funded accounts)
- [ ] Write `k6` scripts:
  - [ ] Simulate 100 concurrent users placing bets
  - [ ] Simulate 1000 RPC requests per second
  - [ ] Simulate market resolution with 100 positions
- [ ] Run tests and measure:
  - [ ] RPC latency (p50, p95, p99)
  - [ ] Transaction success rate
  - [ ] Frontend response time
- [ ] Identify bottlenecks (RPC, backend API, Concordium)
- [ ] Optimize slow paths

#### Edge Case Testing
- [ ] Test commit without reveal (forfeiture)
- [ ] Test late reveal (timeout)
- [ ] Test stale Pyth price (should reject)
- [ ] Test low confidence Pyth price (should reject)
- [ ] Test simultaneous market resolution (race conditions)
- [ ] Test RG limit edge cases (exactly at limit, concurrent bets)
- [ ] Test self-exclusion enforcement

#### Failure Scenarios
- [ ] Test RPC downtime (fallback to secondary RPC)
- [ ] Test Pyth oracle downtime (extend resolution time)
- [ ] Test Concordium downtime (fallback to cached limits)
- [ ] Test database failure (backend API degradation)

---

### Week 18: Bug Fixes & QA

#### Bug Triage
- [ ] Consolidate bugs from audit, testing, and manual QA
- [ ] Prioritize: P0 (critical) → P1 (high) → P2 (medium) → P3 (low)
- [ ] Assign owners for each bug

#### Fix Critical Bugs
- [ ] Fix all P0 bugs (blockers for launch)
- [ ] Write regression tests for each fix
- [ ] Retest affected flows
- [ ] Get auditor sign-off on security fixes

#### Final QA Pass
- [ ] Manual testing of all user flows
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Brave)
- [ ] Mobile testing (iOS Safari, Android Chrome)
- [ ] Wallet compatibility testing (Phantom, Solflare, Ledger)
- [ ] Accessibility testing (keyboard navigation, screen readers)

---

## 🚀 Phase 7: Mainnet Deployment (Weeks 19-20)

### Week 19: Mainnet Preparation

#### Solana Mainnet
- [ ] Generate mainnet deployer wallet: `solana-keygen new --outfile ~/.config/solana/mainnet.json`
- [ ] Fund deployer wallet (airdrop from team wallet)
- [ ] Update `Anchor.toml` to mainnet cluster
- [ ] Build release binaries: `anchor build --verifiable`
- [ ] Deploy programs: `anchor deploy --provider.cluster mainnet`
- [ ] Verify deployments on Solana Explorer
- [ ] Save program IDs to `deployments/solana/mainnet.json`
- [ ] Initialize vault and admin accounts

#### Concordium Mainnet
- [ ] Build contract: `cargo concordium build --schema-out schema.json`
- [ ] Deploy module to mainnet: `--grpc-ip grpc.mainnet.concordium.software --grpc-port 20000`
- [ ] Initialize contract instance
- [ ] Save contract address to production `.env`

#### Frontend Configuration
- [ ] Update RPC endpoints to mainnet (Helius paid tier)
- [ ] Update Pyth feed IDs to mainnet feeds
- [ ] Update program IDs in frontend config
- [ ] Update Concordium contract address
- [ ] Enable production analytics (PostHog, Mixpanel)
- [ ] Configure production error tracking (Sentry)

#### Infrastructure
- [ ] Set up Vercel production environment
- [ ] Configure environment variables in Vercel dashboard
- [ ] Set up custom domain (e.g., app.darkbet.io)
- [ ] Configure SSL certificate
- [ ] Set up monitoring (Datadog, Grafana)
- [ ] Create status page (status.darkbet.io)

---

### Week 20: Soft Launch

#### Beta Whitelist
- [ ] Create whitelist of 100 beta users (Privy user IDs)
- [ ] Implement whitelist check in backend API
- [ ] Send invitations via email/Discord
- [ ] Provide onboarding instructions

#### Monitoring Setup
- [ ] Configure alerts:
  - [ ] Transaction failure rate > 5%
  - [ ] RPC latency > 1s
  - [ ] API error rate > 1%
  - [ ] Pyth price staleness > 60s
- [ ] Set up dashboard with key metrics:
  - [ ] Active users
  - [ ] Total volume
  - [ ] Markets created/resolved
  - [ ] Transaction success rate
- [ ] Create on-call rotation for incidents

#### Beta Testing
- [ ] Monitor first 24 hours closely
- [ ] Collect user feedback (Discord, surveys)
- [ ] Fix any production issues immediately
- [ ] Iterate on UX based on feedback
- [ ] Gradually increase whitelist size (500 → 1000 users)

#### Go/No-Go Decision
- [ ] Review metrics after 1 week:
  - [ ] Transaction success rate > 95%
  - [ ] No P0/P1 bugs
  - [ ] Positive user feedback
- [ ] If GO: remove whitelist and open to public
- [ ] If NO-GO: extend beta period and address issues

---

## 🌅 Phase 8: BSC Deprecation (Weeks 21-24)

### Week 21: Migration Announcement

#### Communication Plan
- [ ] Draft migration announcement blog post
- [ ] Send email to all BSC users
- [ ] Post on Discord, Twitter, Telegram
- [ ] Update website banner: "Migrating to Solana"
- [ ] Create FAQ page: "Why Solana?" "How to migrate?"

#### Migration Timeline
- [ ] Week 21-22: BSC open, Solana open (parallel operation)
- [ ] Week 23: BSC new markets disabled (only claim/resolve)
- [ ] Week 24: BSC fully closed (redirect to Solana)

---

### Week 22-23: Migration Tools

#### Claim Outstanding Bets (BSC)
- [ ] Create `app/migrate/claim-bsc-bets/page.tsx`
- [ ] Fetch user's BSC positions
- [ ] Display claimable winnings
- [ ] Provide "Claim All" button (BSC transactions)
- [ ] Show claim status (pending, confirmed)

#### Balance Transfer (Manual)
- [ ] Create `app/migrate/transfer-balance/page.tsx`
- [ ] Display user's BSC balance
- [ ] Show instructions: "Withdraw from BSC → Bridge to Solana"
- [ ] Provide bridge links (e.g., Wormhole, Allbridge)
- [ ] Alternative: Team-assisted transfer (support ticket)

#### User Migration Tracking
- [ ] Track migration progress:
  - [ ] % of users migrated
  - [ ] % of BSC positions closed
  - [ ] % of BSC balances withdrawn
- [ ] Remind unmigrated users via email (weekly)

---

### Week 24: BSC Shutdown

#### Final Cleanup
- [ ] Resolve all remaining BSC markets (admin override if needed)
- [ ] Force-close unclaimed positions (refund to user)
- [ ] Withdraw remaining BSC contract funds to team wallet
- [ ] Pause BSC contracts: `pauseContract()` instruction

#### Frontend Redirect
- [ ] Update BSC frontend to redirect to Solana version
- [ ] Show banner: "Darkbet is now on Solana! Claim your positions here."
- [ ] Provide "Go to Solana App" button

#### Archive BSC Data
- [ ] Export BSC transaction history (CSV)
- [ ] Export BSC user balances (for records)
- [ ] Archive BSC contract ABIs and deployment info
- [ ] Store in backup S3 bucket (7-year retention for compliance)

#### Celebrate! 🎉
- [ ] Announce successful migration
- [ ] Thank early beta users
- [ ] Share migration statistics (volume, users, etc.)
- [ ] Plan v2.0 features (DAO governance, more markets, etc.)

---

## 📊 Success Metrics

### Technical KPIs
- [ ] **Transaction Success Rate:** > 99%
- [ ] **RPC Latency (p95):** < 500ms
- [ ] **Frontend Load Time:** < 3s
- [ ] **API Error Rate:** < 0.1%

### Business KPIs
- [ ] **Daily Active Users:** > 100 (Month 1)
- [ ] **Total Volume:** > $100k SOL (Month 1)
- [ ] **User Retention (7-day):** > 40%
- [ ] **Net Promoter Score (NPS):** > 50

### Security KPIs
- [ ] **Audit Findings:** 0 critical, 0 high
- [ ] **Security Incidents:** 0
- [ ] **Bug Bounty Claims:** Resolved within 48h

---

## 🎓 Resources & Support

### Documentation
- [ ] Bookmark: [Solana Docs](https://solana.com/docs)
- [ ] Bookmark: [Anchor Book](https://book.anchor-lang.com)
- [ ] Bookmark: [Pyth Docs](https://docs.pyth.network)
- [ ] Bookmark: [Privy Docs](https://docs.privy.io)
- [ ] Bookmark: [Concordium Docs](https://developer.concordium.software)

### Community Support
- [ ] Join Solana Discord: https://discord.gg/solana
- [ ] Join Anchor Discord: https://discord.gg/anchorlang
- [ ] Join Pyth Discord: https://discord.gg/pythnetwork
- [ ] Join Concordium Discord: https://discord.gg/concordium

### Internal Resources
- [ ] Set up internal developer wiki (Notion, Confluence)
- [ ] Document common troubleshooting issues
- [ ] Create runbook for production incidents
- [ ] Schedule weekly engineering standups

---

**Last Updated:** October 24, 2025  
**Document Version:** 1.0

**Instructions:**
- Use this checklist during development sprints
- Check off items as completed
- Add notes for blockers or decisions made
- Update timeline if scope changes
- Share progress weekly with team

**Next Steps:**
1. Review checklist with team
2. Assign owners for each phase
3. Set up project management board (Linear, Jira, GitHub Projects)
4. Begin Phase 1, Week 1 tasks

Good luck! 🚀


