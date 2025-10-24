# Darkbet Platform Refactor: Technical Design Document
## Solana + Privy + Pyth Network + Concordium Integration

**Version:** 1.0  
**Date:** October 24, 2025  
**Author:** Senior Blockchain Engineering Team  
**Status:** Architecture & Design Phase

---

## Executive Summary

This document outlines the comprehensive refactoring of the Darkbet prediction market platform from a Binance Smart Chain (BSC) architecture to a production-grade Web3 system built on **Solana**, with integrated **Privy authentication**, **Pyth Network oracle feeds**, and **Concordium identity verification** for responsible gambling compliance.

### Key Objectives

1. **Complete migration** from BSC/EVM to Solana blockchain
2. **Privy authentication** reconfigured for Phantom wallet and Solana
3. **Pyth Network integration** for verifiable on-chain price feeds
4. **Concordium identity layer** for privacy-preserving responsible gambling enforcement
5. **Production-grade architecture** with security, scalability, and regulatory compliance

---

## Table of Contents

1. [Current State Analysis](#1-current-state-analysis)
2. [Target Architecture Overview](#2-target-architecture-overview)
3. [Solana Blockchain Migration](#3-solana-blockchain-migration)
4. [Privy Authentication Integration](#4-privy-authentication-integration)
5. [Pyth Network Oracle Integration](#5-pyth-network-oracle-integration)
6. [Concordium Responsible Gambling Layer](#6-concordium-responsible-gambling-layer)
7. [System Integration Flow](#7-system-integration-flow)
8. [Security & Privacy Considerations](#8-security--privacy-considerations)
9. [Implementation Roadmap](#9-implementation-roadmap)
10. [Configuration & Deployment](#10-configuration--deployment)
11. [References & Documentation](#11-references--documentation)

---

## 1. Current State Analysis

### 1.1 Existing Architecture

The current Darkbet platform operates on:

- **Blockchain:** Binance Smart Chain (BSC)
- **Smart Contracts:** Solidity-based EVM contracts
- **Wallet Integration:** MetaMask, BSC-compatible wallets
- **Authentication:** Privy (configured for EVM chains)
- **Price Feeds:** Custom or centralized price sources
- **Currency:** BNB/WBNB tokens

### 1.2 Limitations of Current System

| Limitation | Impact |
|------------|--------|
| **High transaction fees** | User friction, reduced profitability |
| **Slower block times** | Delayed bet settlement |
| **EVM dependency** | Limited to Ethereum-compatible chains |
| **Centralized price feeds** | Trust assumptions, manipulation risk |
| **No identity verification** | Regulatory compliance gaps |
| **BSC ecosystem lock-in** | Limited interoperability |

### 1.3 Migration Drivers

- **Performance:** Solana's 65,000 TPS vs BSC's ~60 TPS
- **Cost Efficiency:** ~$0.00025 per transaction on Solana
- **Oracle Infrastructure:** Native Pyth Network integration
- **Compliance:** Concordium's identity layer for KYC/responsible gambling
- **Developer Ecosystem:** Growing Solana DeFi and gaming infrastructure

---

## 2. Target Architecture Overview

### 2.1 High-Level System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND LAYER                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Next.js Application (React + TypeScript)                │  │
│  │  • Wallet Adapter (Phantom, Solflare, Ledger)           │  │
│  │  • @solana/web3.js                                       │  │
│  │  • Privy React Hooks                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     AUTHENTICATION LAYER                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Privy Authentication Service                            │  │
│  │  • Solana Wallet Configuration                           │  │
│  │  • Session Management                                    │  │
│  │  • User Metadata (Concordium ID Proof)                   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
┌──────────────────────────────┐  ┌──────────────────────────────┐
│   SOLANA BLOCKCHAIN LAYER    │  │  CONCORDIUM IDENTITY LAYER   │
│  ┌────────────────────────┐  │  │  ┌────────────────────────┐  │
│  │ Anchor Programs (Rust) │  │  │  │  RG Registry Contract  │  │
│  │ • PredictionMarket     │  │  │  │  • Spending Limits     │  │
│  │ • CommitReveal         │  │  │  │  • Self-Exclusion      │  │
│  │ • VaultManager         │  │  │  │  • Cooldown Policies   │  │
│  │ • UserRegistry         │  │  │  │  • Audit Logs          │  │
│  └────────────────────────┘  │  │  └────────────────────────┘  │
│           │                   │  │           │                  │
│           ▼                   │  │           ▼                  │
│  ┌────────────────────────┐  │  │  ┌────────────────────────┐  │
│  │  Pyth Price Oracle     │  │  │  │  Web3 ID Verifier      │  │
│  │  • BTC/USD Feed        │  │  │  │  • Age Verification    │  │
│  │  • ETH/USD Feed        │  │  │  │  • Jurisdiction Check  │  │
│  │  • SOL/USD Feed        │  │  │  │  • ZK Proof Validator  │  │
│  └────────────────────────┘  │  │  └────────────────────────┘  │
└──────────────────────────────┘  └──────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     BACKEND API LAYER                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Node.js API (Next.js API Routes)                        │  │
│  │  • /rg/check - Pre-flight limit validation               │  │
│  │  • /rg/link-identity - Bind Privy + Concordium           │  │
│  │  • /rg/selfExclude - Mark user exclusion                 │  │
│  │  • /rg/audit - Regulator compliance view                 │  │
│  │  • /markets/* - Market data & resolution                 │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Component Relationships

| Component | Primary Responsibility | Interacts With |
|-----------|------------------------|----------------|
| **Frontend** | User interface, wallet connection | Privy, Solana RPC, Backend API |
| **Privy** | Authentication, session management | Frontend, Backend API |
| **Solana Programs** | Betting logic, fund custody, settlement | Pyth Oracle, Frontend |
| **Pyth Network** | Real-time price feeds | Solana Programs |
| **Concordium** | Identity verification, RG policies | Backend API, Privy |
| **Backend API** | Business logic, RG enforcement, data aggregation | All layers |

---

## 3. Solana Blockchain Migration

### 3.1 Smart Contract Architecture (Anchor Framework)

#### 3.1.1 Program Structure

The Darkbet smart contract suite will consist of **four primary Anchor programs**:

##### **Program 1: PredictionMarket**

**Purpose:** Core betting logic, market creation, position management

**Key Accounts:**
```rust
#[account]
pub struct Market {
    pub authority: Pubkey,          // Market creator
    pub market_id: u64,             // Unique identifier
    pub asset_type: AssetType,      // BTC, ETH, SOL, etc.
    pub resolution_time: i64,       // Unix timestamp
    pub pyth_feed_account: Pubkey,  // Pyth oracle account
    pub total_long_stake: u64,      // Lamports staked on LONG
    pub total_short_stake: u64,     // Lamports staked on SHORT
    pub status: MarketStatus,       // Open, Locked, Resolved, Cancelled
    pub settlement_price: Option<i64>, // Final Pyth price
    pub bump: u8,                   // PDA bump seed
}

#[account]
pub struct UserPosition {
    pub user: Pubkey,               // User wallet address
    pub market: Pubkey,             // Market PDA
    pub direction: Direction,       // LONG or SHORT
    pub stake_amount: u64,          // Lamports committed
    pub commitment_hash: [u8; 32],  // Blake3 hash for commit-reveal
    pub revealed: bool,             // Commitment revealed?
    pub claimed: bool,              // Winnings claimed?
    pub bump: u8,
}
```

**Key Instructions:**
- `initialize_market()` - Create new prediction market
- `commit_bet(amount, hash)` - Commit bet with hash (commit phase)
- `reveal_bet(direction, nonce)` - Reveal position (reveal phase)
- `resolve_market()` - Fetch Pyth price and settle market
- `claim_winnings()` - Claim user's share of losing side's stake

##### **Program 2: CommitReveal**

**Purpose:** Enforce commit-reveal scheme to prevent front-running

**Flow:**
1. **Commit Phase:** User submits `Blake3(direction || nonce || timestamp)`
2. **Lock Period:** Market locks before resolution time (no new bets)
3. **Reveal Phase:** Users reveal their `direction` and `nonce` within window
4. **Validation:** Program verifies hash matches and applies stakes

**Security Properties:**
- Prevents bet observation before commitment
- Time-bound reveal window (e.g., 5 minutes post-lock)
- Forfeiture of unrevealed positions (stake goes to treasury)

##### **Program 3: VaultManager**

**Purpose:** SOL custody, treasury management, fee collection

**Accounts:**
```rust
#[account]
pub struct Vault {
    pub authority: Pubkey,          // Program authority
    pub total_deposits: u64,        // Total SOL in vault
    pub total_fees_collected: u64,  // Platform fees
    pub protocol_fee_bps: u16,      // Fee in basis points (e.g., 200 = 2%)
    pub bump: u8,
}
```

**Instructions:**
- `deposit()` - User deposits SOL to vault
- `withdraw()` - User withdraws available balance
- `collect_fees()` - Admin collects protocol fees

##### **Program 4: UserRegistry**

**Purpose:** Link on-chain wallets to off-chain identity commitments

**Accounts:**
```rust
#[account]
pub struct UserProfile {
    pub wallet: Pubkey,             // Solana public key
    pub id_commitment: [u8; 32],    // Blake2b(privyId || solanaPubkey)
    pub concordium_linked: bool,    // Has Concordium proof?
    pub registration_time: i64,     // First interaction timestamp
    pub total_volume: u64,          // Lifetime betting volume
    pub bump: u8,
}
```

**Purpose of `id_commitment`:**
- Anonymous identifier that links Privy session → Concordium RG proof
- Computed as: `Blake2b(privy_user.id || solana_pubkey)`
- Stored on-chain for RG enforcement without exposing PII
- Queried by backend API during `/rg/check` calls

#### 3.1.2 Program Derived Addresses (PDAs)

PDAs enable deterministic account generation without private keys. Darkbet will use:

| PDA Type | Seeds | Purpose |
|----------|-------|---------|
| **Market** | `[b"market", market_id.to_le_bytes()]` | Unique market accounts |
| **UserPosition** | `[b"position", user.key(), market.key()]` | One position per user per market |
| **Vault** | `[b"vault"]` | Global SOL custody account |
| **UserProfile** | `[b"profile", user.key()]` | User identity linkage |

#### 3.1.3 Anchor Development Best Practices

**Security Measures:**
- **Checked Math:** Use `checked_add()`, `checked_sub()` to prevent overflows
- **Account Validation:** Anchor's `#[account]` macro enforces account ownership
- **Signer Checks:** Explicit `Signer<'info>` constraints on authority accounts
- **Reinitialization Protection:** `init` constraint prevents account reuse
- **Close Accounts:** Properly close accounts to reclaim rent

**Example Instruction:**
```rust
#[derive(Accounts)]
pub struct CommitBet<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + std::mem::size_of::<UserPosition>(),
        seeds = [b"position", user.key().as_ref(), market.key().as_ref()],
        bump
    )]
    pub position: Account<'info, UserPosition>,
    
    #[account(mut, seeds = [b"market", market.market_id.to_le_bytes().as_ref()], bump)]
    pub market: Account<'info, Market>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}
```

### 3.2 Frontend Integration with @solana/web3.js

#### 3.2.1 Wallet Adapter Configuration

**Recommended Wallets:**
- Phantom (primary recommendation)
- Solflare
- Ledger (hardware wallet support)
- Backpack

**Implementation Pattern:**
```typescript
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

// Wrapper component
export function SolanaWalletProvider({ children }) {
  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
```

#### 3.2.2 Transaction Construction

**Commit Bet Example:**
```typescript
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, web3, BN } from '@project-serum/anchor';
import { blake3 } from 'hash-wasm';

async function commitBet(marketId: number, direction: 'LONG' | 'SHORT', amount: number) {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  
  // Generate nonce and hash
  const nonce = crypto.randomUUID();
  const timestamp = Date.now();
  const commitmentHash = await blake3(`${direction}|${nonce}|${timestamp}`);
  
  // Store nonce locally for reveal phase
  localStorage.setItem(`bet_${marketId}`, JSON.stringify({ direction, nonce, timestamp }));
  
  // Build transaction
  const provider = new AnchorProvider(connection, wallet, {});
  const program = new Program(IDL, PROGRAM_ID, provider);
  
  const [marketPda] = await PublicKey.findProgramAddress(
    [Buffer.from('market'), new BN(marketId).toArrayLike(Buffer, 'le', 8)],
    program.programId
  );
  
  const [positionPda] = await PublicKey.findProgramAddress(
    [Buffer.from('position'), wallet.publicKey.toBuffer(), marketPda.toBuffer()],
    program.programId
  );
  
  const tx = await program.methods
    .commitBet(new BN(amount * web3.LAMPORTS_PER_SOL), Array.from(Buffer.from(commitmentHash, 'hex')))
    .accounts({
      position: positionPda,
      market: marketPda,
      user: wallet.publicKey,
      systemProgram: web3.SystemProgram.programId,
    })
    .rpc();
    
  return { signature: tx, positionPda };
}
```

#### 3.2.3 RPC Configuration

**Production RPC Providers:**
- **Helius:** `https://mainnet.helius-rpc.com/?api-key=<KEY>`
- **QuickNode:** `https://solana-mainnet.quiknode.pro/<KEY>`
- **Triton:** `https://darkbet-mainnet.rpcpool.com/<KEY>`
- **Public (fallback):** `https://api.mainnet-beta.solana.com` (rate limited)

**Configuration:**
```typescript
const RPC_ENDPOINTS = {
  mainnet: process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
  devnet: 'https://api.devnet.solana.com',
  testnet: 'https://api.testnet.solana.com',
};

const connection = new Connection(RPC_ENDPOINTS.mainnet, {
  commitment: 'confirmed',
  confirmTransactionInitialTimeout: 60000,
});
```

### 3.3 Migration Strategy from BSC

#### Phase 1: Parallel Development (Weeks 1-4)
- Develop Solana programs on devnet
- Build frontend POC with test wallets
- Test commit-reveal flow
- Integrate Pyth devnet feeds

#### Phase 2: Feature Parity (Weeks 5-8)
- Port all BSC contract features to Anchor
- Migrate frontend components to Solana wallet adapter
- Implement market creation and resolution
- End-to-end testing on devnet

#### Phase 3: Soft Launch (Weeks 9-10)
- Deploy to Solana mainnet-beta
- Open limited beta with whitelist
- Monitor transaction performance
- Collect user feedback

#### Phase 4: Full Migration (Week 11+)
- Announce BSC deprecation timeline
- Provide migration tools for existing users
- Gradual traffic shift to Solana
- Sunset BSC contracts after 3-month overlap

---

## 4. Privy Authentication Integration

### 4.1 Privy Configuration for Solana

#### 4.1.1 Privy App Configuration

**Dashboard Settings:**
```json
{
  "appId": "clxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "clientId": "client-xxxx-xxxx-xxxx",
  "networks": {
    "solana": {
      "enabled": true,
      "cluster": "mainnet-beta",
      "defaultWallet": "phantom"
    },
    "ethereum": {
      "enabled": false
    },
    "bsc": {
      "enabled": false
    }
  },
  "loginMethods": {
    "email": true,
    "sms": true,
    "google": true,
    "twitter": true,
    "discord": true,
    "wallet": {
      "phantom": true,
      "solflare": true
    }
  },
  "embeddedWallets": {
    "createOnLogin": "users-without-wallets",
    "noPromptOnSignature": false
  }
}
```

**Reference:** [Privy Solana Configuration Docs](https://docs.privy.io/guide/react/wallets/solana)

#### 4.1.2 React Integration

**Provider Setup:**
```typescript
import { PrivyProvider } from '@privy-io/react-auth';
import { SolanaWalletConnectors } from '@privy-io/react-auth/solana';

export default function App({ Component, pageProps }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}
      config={{
        loginMethods: ['email', 'wallet'],
        appearance: {
          theme: 'dark',
          accentColor: '#8B5CF6',
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
        supportedChains: [
          {
            id: 101, // Solana mainnet
            name: 'Solana',
            network: 'mainnet-beta',
            nativeCurrency: { name: 'SOL', symbol: 'SOL', decimals: 9 },
            rpcUrls: { default: process.env.NEXT_PUBLIC_SOLANA_RPC_URL },
          },
        ],
        walletConnectors: [
          SolanaWalletConnectors.phantom(),
          SolanaWalletConnectors.solflare(),
        ],
      }}
    >
      <Component {...pageProps} />
    </PrivyProvider>
  );
}
```

**Authentication Hook:**
```typescript
import { usePrivy, useWallets } from '@privy-io/react-auth';

export function useAuth() {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const { wallets } = useWallets();
  
  const solanaWallet = wallets.find(w => w.walletClientType === 'phantom');
  const publicKey = solanaWallet?.address;
  
  return {
    ready,
    authenticated,
    user,
    publicKey,
    login,
    logout,
  };
}
```

### 4.2 Session Management & User Object

#### 4.2.1 Privy User Object Structure

```typescript
interface PrivyUser {
  id: string;                    // Privy unique user ID (e.g., "did:privy:...")
  createdAt: number;             // Account creation timestamp
  linkedAccounts: Array<{
    type: 'wallet' | 'email' | 'google' | 'twitter';
    address?: string;            // For wallet type
    chain?: 'solana';
    walletClient?: 'phantom' | 'solflare';
    verified: boolean;
  }>;
  customMetadata: {
    concordiumIdCommitment?: string;  // Blake2b hash linking to RG registry
    concordiumProofVerified?: boolean;
    kycStatus?: 'pending' | 'verified' | 'failed';
    riskLevel?: 'low' | 'medium' | 'high';
  };
}
```

#### 4.2.2 Linking Concordium Identity to Privy

**Backend API Endpoint:**
```typescript
// POST /api/rg/link-identity
export async function linkIdentity(req, res) {
  const { privyUserId, solanaPublicKey, concordiumProof } = req.body;
  
  // Verify Privy JWT
  const privyUser = await verifyPrivyToken(req.headers.authorization);
  if (privyUser.id !== privyUserId) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  
  // Verify Concordium proof signature
  const isValidProof = await concordium.verifyWeb3IdProof(concordiumProof);
  if (!isValidProof) {
    return res.status(400).json({ error: 'Invalid Concordium proof' });
  }
  
  // Generate anonymous commitment
  const idCommitment = blake2b(`${privyUserId}||${solanaPublicKey}`);
  
  // Store in Privy user metadata
  await privy.updateUserMetadata(privyUserId, {
    concordiumIdCommitment: idCommitment,
    concordiumProofVerified: true,
    kycStatus: 'verified',
  });
  
  // Register commitment on Concordium RG contract
  await concordium.registerUser(idCommitment, concordiumProof.attributes);
  
  // Update Solana UserProfile account
  await updateSolanaUserProfile(solanaPublicKey, idCommitment);
  
  return res.status(200).json({ success: true, idCommitment });
}
```

### 4.3 Authentication Flow

```
1. User visits Darkbet
   ↓
2. Click "Connect Wallet" → Privy modal appears
   ↓
3. User selects Phantom → Phantom prompts connection approval
   ↓
4. Privy creates session → JWT issued
   ↓
5. Frontend reads user.linkedAccounts → extracts Solana address
   ↓
6. Check if user.customMetadata.concordiumIdCommitment exists
   ↓
7. If NO → Redirect to Concordium ID verification flow
   If YES → User can access platform
   ↓
8. On bet placement:
   - Frontend calls POST /rg/check with idCommitment + amount
   - Backend queries Concordium RG contract
   - If limits OK → Sign Solana transaction
   - If limits exceeded → Block with error message
```

---

## 5. Pyth Network Oracle Integration

### 5.1 Pyth Network Overview

**Pyth Network** is a decentralized oracle that publishes financial market data on-chain with:
- **Sub-second latency** (400ms update frequency)
- **95+ price feeds** (crypto, equities, FX, commodities)
- **Confidence intervals** for data quality assessment
- **Native Solana integration** (first-class support)

**Official Documentation:** [docs.pyth.network](https://docs.pyth.network)

### 5.2 On-Chain Integration (Solana Program)

#### 5.2.1 Pyth Account Structure

Pyth publishes price data to **dedicated Solana accounts**. Each feed has:
- **Price:** Current price (scaled by exponent)
- **Confidence:** Confidence interval (±)
- **Publish Time:** Unix timestamp of last update
- **Exponent:** Power of 10 for price scaling

**Example Feed Accounts (Mainnet-Beta):**
| Asset | Feed ID (Public Key) |
|-------|----------------------|
| BTC/USD | `GVXRSBjFk6e6J3NbVPXohDJetcTjaeeuykUpbQF8UoMU` |
| ETH/USD | `JBu1AL4obBcCMqKBBxhpWCNUt136ijcuMZLFvTP7iWdB` |
| SOL/USD | `H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG` |

**Full list:** [pyth.network/developers/price-feed-ids](https://pyth.network/developers/price-feed-ids)

#### 5.2.2 Reading Pyth Price in Anchor Program

**Add Pyth SDK to Cargo.toml:**
```toml
[dependencies]
anchor-lang = "0.29.0"
pyth-sdk-solana = "0.10.0"
```

**Read Price in Instruction:**
```rust
use anchor_lang::prelude::*;
use pyth_sdk_solana::load_price_feed_from_account_info;

#[derive(Accounts)]
pub struct ResolveMarket<'info> {
    #[account(mut)]
    pub market: Account<'info, Market>,
    
    /// CHECK: Pyth price account (validated by Pyth SDK)
    pub pyth_price_account: AccountInfo<'info>,
    
    pub authority: Signer<'info>,
}

pub fn resolve_market(ctx: Context<ResolveMarket>) -> Result<()> {
    let market = &mut ctx.accounts.market;
    let pyth_account = &ctx.accounts.pyth_price_account;
    
    // Load Pyth price feed
    let price_feed = load_price_feed_from_account_info(pyth_account)?;
    let current_price = price_feed.get_current_price()
        .ok_or(ErrorCode::PriceUnavailable)?;
    
    // Validate price is recent (within 60 seconds)
    let clock = Clock::get()?;
    require!(
        clock.unix_timestamp - current_price.publish_time < 60,
        ErrorCode::StalePriceData
    );
    
    // Validate confidence interval is acceptable (< 1% of price)
    let confidence_pct = (current_price.conf as f64) / (current_price.price as f64) * 100.0;
    require!(
        confidence_pct < 1.0,
        ErrorCode::LowConfidencePrice
    );
    
    // Store settlement price
    market.settlement_price = Some(current_price.price);
    market.status = MarketStatus::Resolved;
    
    msg!("Market resolved at price: {}", current_price.price);
    
    Ok(())
}

#[error_code]
pub enum ErrorCode {
    #[msg("Price data unavailable from Pyth")]
    PriceUnavailable,
    #[msg("Price data is stale (> 60s old)")]
    StalePriceData,
    #[msg("Price confidence interval too wide")]
    LowConfidencePrice,
}
```

### 5.3 Frontend Integration (Off-Chain View)

#### 5.3.1 Pyth Price Service (WebSocket)

For **real-time price updates** in the UI (not for settlement), use Pyth's price service:

**Install Package:**
```bash
npm install @pythnetwork/price-service-client
```

**Subscribe to Price Feed:**
```typescript
import { PriceServiceConnection } from '@pythnetwork/price-service-client';

const connection = new PriceServiceConnection('https://hermes.pyth.network', {
  priceFeedRequestConfig: {
    binary: false,
  },
});

const priceIds = [
  'e62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43', // BTC/USD
  'ff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace', // ETH/USD
  'ef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d', // SOL/USD
];

connection.subscribePriceFeedUpdates(priceIds, (priceFeed) => {
  const price = priceFeed.getPriceUnchecked(); // Latest price
  console.log(`${priceFeed.id}: $${price.price} ± $${price.conf}`);
  
  // Update UI
  updatePriceDisplay(priceFeed.id, price);
});
```

#### 5.3.2 Price Display Component

```typescript
import { usePythPrice } from '@/hooks/use-pyth-price';

export function PriceChart({ asset }: { asset: 'BTC' | 'ETH' | 'SOL' }) {
  const { price, confidence, lastUpdate } = usePythPrice(asset);
  
  return (
    <div className="price-display">
      <h3>{asset}/USD</h3>
      <div className="price">${price.toLocaleString()}</div>
      <div className="confidence">±${confidence.toFixed(2)}</div>
      <div className="timestamp">
        Last updated: {new Date(lastUpdate * 1000).toLocaleTimeString()}
      </div>
    </div>
  );
}
```

### 5.4 Price Feed Configuration

**Recommended Feeds for Darkbet:**

| Asset Class | Asset | Feed ID | Update Frequency |
|-------------|-------|---------|------------------|
| **Crypto** | BTC/USD | `GVXRSBjFk6e6J3NbVPXohDJetcTjaeeuykUpbQF8UoMU` | 400ms |
| **Crypto** | ETH/USD | `JBu1AL4obBcCMqKBBxhpWCNUt136ijcuMZLFvTP7iWdB` | 400ms |
| **Crypto** | SOL/USD | `H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG` | 400ms |
| **Crypto** | BNB/USD | `4CkQJBxhU8EZ2UjhigbtdaPbpTe6mqf811fipYBFbSYN` | 400ms |
| **FX** | EUR/USD | `...` | 1s |
| **Equities** | TSLA/USD | `...` | 1s |

**Configuration File:**
```typescript
// config/pyth-feeds.ts
export const PYTH_FEEDS = {
  mainnet: {
    BTC: 'GVXRSBjFk6e6J3NbVPXohDJetcTjaeeuykUpbQF8UoMU',
    ETH: 'JBu1AL4obBcCMqKBBxhpWCNUt136ijcuMZLFvTP7iWdB',
    SOL: 'H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG',
  },
  devnet: {
    BTC: 'HovQMDrbAgAYPCmHVSrezcSmkMtXSSUsLDFANExrZh2J',
    ETH: 'EdVCmQ9FSPcVe5YySXDPCRmc8aDQLKJ9xvYBMZPie1Vw',
    SOL: 'J83w4HKfqxwcq3BEMMkPFSppX3gqekLyLJBexebFVkix',
  },
};
```

### 5.5 Oracle Security Considerations

**Validation Rules:**
1. **Staleness Check:** Reject prices older than 60 seconds
2. **Confidence Threshold:** Require confidence < 1% of price
3. **Circuit Breaker:** Halt trading if price moves > 20% in single update
4. **Fallback Logic:** If Pyth unavailable, pause new market creation
5. **Multi-Feed Aggregation:** For critical markets, consider multiple feeds

---

## 6. Concordium Responsible Gambling Layer

### 6.1 Concordium Overview

**Concordium** is a Layer 1 blockchain focused on:
- **Identity Layer:** Built-in KYC at protocol level
- **Web3 ID:** Zero-knowledge identity proofs
- **Regulatory Compliance:** Identity without revealing personal data
- **Privacy-Preserving:** Selective disclosure of attributes

**Official Documentation:** [developer.concordium.software](https://developer.concordium.software)

### 6.2 Responsible Gambling (RG) Architecture

#### 6.2.1 RG Registry Smart Contract (Concordium)

**Purpose:** Store user RG policies and enforce limits anonymously

**Contract Structure (Rust + Concordium SDK):**
```rust
use concordium_std::*;

#[derive(Serialize, SchemaType, Clone)]
pub struct RGPolicy {
    pub id_commitment: [u8; 32],      // Blake2b(privyId || solanaPubkey)
    pub daily_limit: Amount,          // Max bet per day (in CCD)
    pub weekly_limit: Amount,         // Max bet per week
    pub cooldown_until: Timestamp,    // Self-imposed cooldown expiry
    pub self_excluded: bool,          // Permanent self-exclusion flag
    pub total_staked_today: Amount,   // Rolling 24h total
    pub last_bet_time: Timestamp,     // Last transaction timestamp
}

#[derive(Serialize, SchemaType)]
pub struct RGRegistry {
    policies: StateMap<[u8; 32], RGPolicy, StateApi>,
    admin: AccountAddress,
}

#[init(contract = "rg_registry")]
fn init(ctx: &InitContext, _state_builder: &mut StateBuilder) -> InitResult<RGRegistry> {
    Ok(RGRegistry {
        policies: _state_builder.new_map(),
        admin: ctx.init_origin(),
    })
}

#[receive(
    contract = "rg_registry",
    name = "register_user",
    parameter = "RegisterUserParams",
    mutable
)]
fn register_user(
    ctx: &ReceiveContext,
    host: &mut Host<RGRegistry>,
) -> ReceiveResult<()> {
    let params: RegisterUserParams = ctx.parameter_cursor().get()?;
    
    // Verify Web3 ID proof
    ensure!(verify_web3_id_proof(&params.proof), ContractError::InvalidProof);
    
    // Create default policy
    let policy = RGPolicy {
        id_commitment: params.id_commitment,
        daily_limit: Amount::from_micro_ccd(1_000_000_000), // 1000 CCD default
        weekly_limit: Amount::from_micro_ccd(5_000_000_000), // 5000 CCD
        cooldown_until: Timestamp::from_timestamp_millis(0),
        self_excluded: false,
        total_staked_today: Amount::zero(),
        last_bet_time: ctx.metadata().slot_time(),
    };
    
    host.state_mut().policies.insert(params.id_commitment, policy);
    
    Ok(())
}

#[receive(
    contract = "rg_registry",
    name = "check_limits",
    parameter = "CheckLimitsParams",
    return_value = "CheckLimitsResponse"
)]
fn check_limits(
    ctx: &ReceiveContext,
    host: &Host<RGRegistry>,
) -> ReceiveResult<CheckLimitsResponse> {
    let params: CheckLimitsParams = ctx.parameter_cursor().get()?;
    let policy = host.state()
        .policies
        .get(&params.id_commitment)
        .ok_or(ContractError::UserNotRegistered)?;
    
    let now = ctx.metadata().slot_time();
    
    // Check self-exclusion
    if policy.self_excluded {
        return Ok(CheckLimitsResponse {
            allowed: false,
            reason: "User is self-excluded".to_string(),
        });
    }
    
    // Check cooldown
    if now < policy.cooldown_until {
        return Ok(CheckLimitsResponse {
            allowed: false,
            reason: "User is in cooldown period".to_string(),
        });
    }
    
    // Check daily limit
    let proposed_total = policy.total_staked_today + params.bet_amount;
    if proposed_total > policy.daily_limit {
        return Ok(CheckLimitsResponse {
            allowed: false,
            reason: "Daily limit exceeded".to_string(),
        });
    }
    
    // Check weekly limit (simplified - needs rolling window)
    if proposed_total > policy.weekly_limit {
        return Ok(CheckLimitsResponse {
            allowed: false,
            reason: "Weekly limit exceeded".to_string(),
        });
    }
    
    Ok(CheckLimitsResponse {
        allowed: true,
        reason: "".to_string(),
    })
}

#[receive(
    contract = "rg_registry",
    name = "self_exclude",
    parameter = "SelfExcludeParams",
    mutable
)]
fn self_exclude(
    ctx: &ReceiveContext,
    host: &mut Host<RGRegistry>,
) -> ReceiveResult<()> {
    let params: SelfExcludeParams = ctx.parameter_cursor().get()?;
    
    let mut policy = host.state_mut()
        .policies
        .get_mut(&params.id_commitment)
        .ok_or(ContractError::UserNotRegistered)?;
    
    policy.self_excluded = true;
    
    Ok(())
}
```

#### 6.2.2 Backend Relayer (Node.js API)

**Purpose:** Bridge between Privy sessions and Concordium RG contract

**API Endpoints:**

##### **POST /api/rg/link-identity**
```typescript
import { ConcordiumGRPCClient, AccountAddress } from '@concordium/web-sdk';

export async function linkIdentity(req, res) {
  const { privyUserId, solanaPublicKey, concordiumProof } = req.body;
  
  // 1. Verify Privy JWT
  const privyUser = await verifyPrivyToken(req.headers.authorization);
  if (privyUser.id !== privyUserId) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  
  // 2. Verify Concordium Web3 ID proof
  const client = new ConcordiumGRPCClient(
    new NodeHttpTransport(process.env.CONCORDIUM_NODE_URL)
  );
  
  const isValidProof = await verifyWeb3IdCredential(client, concordiumProof);
  if (!isValidProof) {
    return res.status(400).json({ error: 'Invalid Concordium proof' });
  }
  
  // 3. Extract attributes (age, jurisdiction)
  const attributes = parseWeb3IdAttributes(concordiumProof);
  if (attributes.age < 18) {
    return res.status(403).json({ error: 'User must be 18+' });
  }
  
  // 4. Generate anonymous commitment
  const idCommitment = blake2b(`${privyUserId}||${solanaPublicKey}`);
  
  // 5. Register in Concordium RG contract
  const contractAddress = { index: 1234n, subindex: 0n };
  const tx = await client.sendContractUpdateTransaction(
    AccountAddress.fromBase58(process.env.CONCORDIUM_ADMIN_ACCOUNT),
    'rg_registry',
    'register_user',
    { id_commitment: Array.from(idCommitment) },
    10000n, // Max energy
  );
  
  await tx.wait();
  
  // 6. Store commitment in Privy metadata
  await privy.updateUserMetadata(privyUserId, {
    concordiumIdCommitment: Buffer.from(idCommitment).toString('hex'),
    concordiumProofVerified: true,
    kycStatus: 'verified',
  });
  
  return res.status(200).json({ success: true, idCommitment });
}
```

##### **POST /api/rg/check**
```typescript
export async function checkLimits(req, res) {
  const { idCommitment, betAmount } = req.body;
  
  // Query Concordium RG contract
  const client = new ConcordiumGRPCClient(...);
  const response = await client.invokeContract({
    contract: { index: 1234n, subindex: 0n },
    method: 'rg_registry.check_limits',
    parameter: {
      id_commitment: Buffer.from(idCommitment, 'hex'),
      bet_amount: betAmount,
    },
  });
  
  const result = parseResponse(response);
  
  if (!result.allowed) {
    return res.status(403).json({
      allowed: false,
      reason: result.reason,
    });
  }
  
  return res.status(200).json({
    allowed: true,
    remainingDailyLimit: result.remainingDailyLimit,
  });
}
```

##### **POST /api/rg/self-exclude**
```typescript
export async function selfExclude(req, res) {
  const { idCommitment } = req.body;
  
  // Verify user owns this commitment (via Privy session)
  const privyUser = await verifyPrivyToken(req.headers.authorization);
  const expectedCommitment = blake2b(`${privyUser.id}||${req.body.solanaPublicKey}`);
  
  if (idCommitment !== Buffer.from(expectedCommitment).toString('hex')) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  
  // Update Concordium contract
  const client = new ConcordiumGRPCClient(...);
  await client.sendContractUpdateTransaction(
    AccountAddress.fromBase58(process.env.CONCORDIUM_ADMIN_ACCOUNT),
    'rg_registry',
    'self_exclude',
    { id_commitment: Buffer.from(idCommitment, 'hex') },
    10000n,
  );
  
  return res.status(200).json({ success: true });
}
```

##### **GET /api/rg/audit**
```typescript
export async function getAuditLog(req, res) {
  // Restricted to authorized regulators
  const apiKey = req.headers['x-api-key'];
  if (!isAuthorizedRegulator(apiKey)) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  
  const { startDate, endDate, jurisdiction } = req.query;
  
  // Query Concordium event logs
  const client = new ConcordiumGRPCClient(...);
  const logs = await client.getBlockItemStatus(...);
  
  // Aggregate anonymized statistics
  const stats = {
    totalUsers: 1234,
    selfExcludedUsers: 45,
    limitViolations: 12,
    averageDailyVolume: 5000,
  };
  
  return res.status(200).json(stats);
}
```

### 6.3 Web3 ID Integration

#### 6.3.1 Concordium Web3 ID Flow

```
1. User clicks "Verify Identity" in Darkbet
   ↓
2. Frontend redirects to Concordium ID Provider
   ↓
3. User authenticates with ID provider (e.g., Notabene, Fractal)
   ↓
4. ID provider issues Web3 ID credential with attributes:
   - Age
   - Jurisdiction
   - Identity commitment
   ↓
5. User's Concordium wallet stores credential
   ↓
6. User returns to Darkbet, presents credential
   ↓
7. Darkbet backend verifies signature and extracts attributes
   ↓
8. If age >= 18 and jurisdiction allowed → register in RG contract
   ↓
9. Link id_commitment to Privy user metadata
```

#### 6.3.2 Selective Disclosure

**Attributes Requested:**
```json
{
  "requiredAttributes": [
    "age",
    "jurisdiction"
  ],
  "optionalAttributes": [
    "firstName",
    "lastName"
  ],
  "minimumAge": 18,
  "allowedJurisdictions": [
    "US",
    "UK",
    "CA",
    "EU"
  ]
}
```

**User can choose to reveal:**
- ✅ Age (must be >= 18) → Revealed as `age: 25`
- ✅ Jurisdiction → Revealed as `jurisdiction: "US"`
- ❌ Name → **Not revealed** (selective disclosure)

### 6.4 Privacy Architecture

**Key Privacy Principles:**

1. **Anonymous ID Commitment:**
   - `id_commit = Blake2b(privyUserId || solanaPubkey)`
   - Stored on Concordium + Solana
   - No raw PII on-chain

2. **Zero-Knowledge Proofs:**
   - User proves "age >= 18" without revealing exact age
   - Concordium's Web3 ID uses ZK proofs for attribute disclosure

3. **Data Minimization:**
   - Only necessary attributes stored
   - PII kept off-chain in Concordium ID provider
   - Darkbet never sees user's real name or documents

4. **Regulator Access:**
   - Regulators can query aggregated statistics
   - Individual user data requires court order
   - Concordium ID provider holds deanonymization keys (escrow)

---

## 7. System Integration Flow

### 7.1 End-to-End Betting Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER INTERACTION FLOW                       │
└─────────────────────────────────────────────────────────────────┘

1. User Authentication
   User → [Connect Wallet] → Phantom popup → Sign message
   → Privy creates session → JWT issued → Frontend reads publicKey

2. Identity Verification (First-time users only)
   User → [Verify Identity] → Concordium ID Provider → Web3 ID credential
   → Backend verifies proof → id_commitment generated
   → Registered in Concordium RG contract + Privy metadata

3. Market Selection
   User browses markets → Selects "BTC/USD - Will BTC > $45,000 at 5pm?"
   → Frontend displays:
     - Current Pyth price (WebSocket)
     - Pool sizes (LONG vs SHORT)
     - Potential payout

4. Place Bet (Commit Phase)
   User → Enters bet amount (e.g., 1 SOL)
   → Frontend calls: POST /api/rg/check
     - Body: { idCommitment, betAmount: 1000000000 }
   → Backend queries Concordium RG contract
   → Response:
     ✅ { allowed: true, remainingDailyLimit: 9 SOL }
     ❌ { allowed: false, reason: "Daily limit exceeded" }
   
   If allowed:
   → Frontend generates:
     - nonce = crypto.randomUUID()
     - commitHash = Blake3(direction || nonce || timestamp)
   → Stores { direction, nonce } in localStorage
   → Signs Solana transaction:
     - Instruction: commitBet(marketPda, 1 SOL, commitHash)
     - Sends to Solana network
   → Transaction confirmed → Position created

5. Market Lock
   At resolution_time - 5 minutes:
   → Solana program stops accepting new commits
   → Users can no longer place bets
   → Reveal window opens

6. Reveal Phase
   User → [Reveal Bet] button
   → Frontend retrieves { direction, nonce } from localStorage
   → Signs Solana transaction:
     - Instruction: revealBet(marketPda, direction, nonce)
   → Program validates: Blake3(direction || nonce || storedTimestamp) == commitHash
   → If valid: position marked as revealed
   → If invalid or timeout: position forfeited

7. Market Resolution
   Backend cron job OR any user:
   → Calls resolveMarket() instruction
   → Program reads Pyth price feed account
   → Validates price freshness (< 60s old)
   → Compares price to market threshold
   → Marks market as resolved
   → Emits MarketResolved event

8. Claim Winnings
   User (if on winning side) → [Claim Winnings]
   → Signs Solana transaction:
     - Instruction: claimWinnings(marketPda)
   → Program calculates:
     - userStake = 1 SOL
     - totalWinningStake = 10 SOL
     - totalLosingStake = 15 SOL
     - userShare = (1 / 10) * 15 = 1.5 SOL
     - platformFee = 1.5 * 0.02 = 0.03 SOL
     - netPayout = 1.5 - 0.03 = 1.47 SOL
   → Transfers 1.47 SOL to user's wallet
   → Transfers 0.03 SOL to protocol vault
   → Marks position as claimed

9. RG Limit Update
   After bet placement:
   → Backend updates Concordium RG contract:
     - totalStakedToday += 1 SOL
     - lastBetTime = now
   → Ensures next bet checks updated limits
```

### 7.2 Data Flow Diagram

```
┌──────────────┐                    ┌──────────────┐
│   FRONTEND   │◄──────WebSocket────│  Pyth Price  │
│   (Next.js)  │     (Real-time)    │   Service    │
└──────┬───────┘                    └──────────────┘
       │
       │ HTTP/RPC
       │
       ▼
┌──────────────┐      ┌───────────────┐     ┌──────────────┐
│  Privy Auth  │◄────►│   Backend     │◄───►│  Concordium  │
│   Service    │ JWT  │   API (Node)  │ RPC │ RG Registry  │
└──────────────┘      └───────┬───────┘     └──────────────┘
                              │
                              │ RPC
                              │
                              ▼
                      ┌───────────────┐     ┌──────────────┐
                      │    Solana     │◄───►│ Pyth Oracle  │
                      │  RPC Node     │     │   Accounts   │
                      └───────┬───────┘     └──────────────┘
                              │
                              ▼
                      ┌───────────────┐
                      │ Anchor Programs│
                      │ • Market       │
                      │ • CommitReveal │
                      │ • Vault        │
                      │ • UserRegistry │
                      └───────────────┘
```

### 7.3 State Management

**On-Chain State (Solana):**
- Market accounts (prices, stakes, status)
- User positions (commitments, reveals)
- Vault balances
- User profiles (id_commitment linkage)

**On-Chain State (Concordium):**
- RG policies (limits, cooldowns, exclusions)
- Anonymized audit logs

**Off-Chain State (Backend DB):**
- Market metadata (descriptions, images)
- Historical price charts
- User analytics (aggregated, non-PII)

**Client State (Frontend):**
- Wallet connection status
- Active markets (fetched from Solana)
- User positions (filtered by wallet address)
- RG limit status (cached from API)

---

## 8. Security & Privacy Considerations

### 8.1 Security Measures

#### 8.1.1 Smart Contract Security

**Anchor Program Protections:**
- ✅ **Overflow Protection:** Use `checked_add()`, `checked_sub()`, `checked_mul()`
- ✅ **Reentrancy Guards:** Solana's single-threaded execution prevents reentrancy
- ✅ **Account Validation:** Anchor's `#[account]` macro enforces ownership
- ✅ **Signer Verification:** Explicit `Signer<'info>` constraints
- ✅ **PDA Security:** Seeds-based derivation prevents spoofing
- ✅ **Rent Exemption:** All accounts must be rent-exempt (prevents closure attacks)

**Additional Mitigations:**
- **Access Control:** Admin-only functions use `require!(ctx.accounts.authority.key() == ADMIN_PUBKEY)`
- **Pause Mechanism:** Emergency pause function to halt all trading
- **Rate Limiting:** Max bet size per transaction (e.g., 100 SOL)
- **Time Locks:** Admin actions (e.g., withdrawals) have 24h delay

**Audit Requirements:**
- Third-party audit by Neodyme, OtterSec, or Sec3
- Formal verification of critical functions (Certora)
- Bug bounty program (Immunefi)

#### 8.1.2 Oracle Security

**Pyth Network Safeguards:**
- ✅ **Staleness Checks:** Reject prices > 60s old
- ✅ **Confidence Thresholds:** Require confidence < 1% of price
- ✅ **Circuit Breakers:** Pause if price moves > 20% in single update
- ✅ **Multi-Publisher Validation:** Pyth aggregates 80+ publishers
- ✅ **On-Chain Verification:** All validation happens on-chain (no trust in backend)

**Fallback Strategy:**
- If Pyth unavailable → pause new market creation
- Existing markets → extend resolution time by 1 hour
- Critical failure → admin-triggered emergency resolution mode

#### 8.1.3 Authentication Security

**Privy Security:**
- ✅ JWT validation on every API request
- ✅ Short-lived tokens (15 min expiry, refresh token rotation)
- ✅ HTTPS-only communication
- ✅ CSRF protection (SameSite cookies)
- ✅ Rate limiting on auth endpoints

**Wallet Security:**
- ✅ Users must sign message to prove ownership
- ✅ Frontend validates signature before allowing transactions
- ✅ No private key storage (user-controlled wallets only)

### 8.2 Privacy Architecture

#### 8.2.1 Data Minimization

**PII Handling:**
| Data Type | Storage Location | Access Control |
|-----------|------------------|----------------|
| **Privy User ID** | Privy servers | Privy only |
| **Solana Public Key** | Solana blockchain (public) | Public |
| **id_commitment** | Concordium + Solana (public) | Public, but anonymized |
| **Age, Jurisdiction** | Concordium ID Provider | User + Regulator (with warrant) |
| **Name, Documents** | Concordium ID Provider | User + Regulator (with warrant) |
| **Bet History** | Solana blockchain (public) | Public, linked to pubkey |
| **RG Limits** | Concordium RG contract | Linked to id_commitment (anonymized) |

**No PII on Darkbet servers:** Backend API does not store names, emails, or documents.

#### 8.2.2 Zero-Knowledge Architecture

**ZK Proofs Used:**
1. **Age Verification:** User proves "age >= 18" without revealing exact age
2. **Jurisdiction Check:** User proves "jurisdiction in [US, UK, CA]" without revealing exact country
3. **Identity Linkage:** `id_commitment` proves user has valid Web3 ID without revealing identity

**Concordium Web3 ID Flow:**
```
User → ID Provider → Issues credential with attributes
     → Darkbet requests proof: "age >= 18"
     → User's wallet generates ZK proof
     → Darkbet verifies proof (no actual age revealed)
```

#### 8.2.3 Regulatory Compliance

**GDPR Compliance:**
- ✅ **Right to Access:** User can export their id_commitment and bet history
- ✅ **Right to Erasure:** User can self-exclude (cannot delete blockchain data, but can anonymize)
- ✅ **Data Portability:** User can export bet history as JSON
- ✅ **Privacy by Design:** id_commitment prevents PII exposure

**AML/KYC Compliance:**
- ✅ **Age Verification:** Enforced via Concordium Web3 ID
- ✅ **Jurisdiction Checks:** Blocked regions enforced at ID verification
- ✅ **Transaction Monitoring:** Blockchain transparency enables audit
- ✅ **Regulator Access:** Concordium ID provider can deanonymize with court order

**Responsible Gambling Compliance:**
- ✅ **Spending Limits:** Enforced by Concordium RG contract
- ✅ **Self-Exclusion:** Permanent flag in RG contract
- ✅ **Cooling-Off Periods:** User-set cooldowns
- ✅ **Audit Trails:** Anonymized logs for regulators

### 8.3 Operational Security

**Infrastructure Security:**
- ✅ RPC endpoints behind API gateway (rate limiting)
- ✅ Backend API deployed on Vercel (automatic DDoS protection)
- ✅ Database encryption at rest (if using PostgreSQL for metadata)
- ✅ Secrets management (AWS Secrets Manager / Vercel env vars)

**Incident Response Plan:**
1. **Monitoring:** Datadog alerts on anomalous transaction patterns
2. **Pause Mechanism:** Emergency pause function callable by multisig
3. **Communication:** Status page (status.darkbet.io) for downtime
4. **Recovery:** Backup RPC endpoints, snapshot-based state recovery

---

## 9. Implementation Roadmap

### 9.1 Phase 1: Foundation (Weeks 1-4)

**Objectives:** Set up development environment and core infrastructure

**Tasks:**
- [ ] **Week 1: Environment Setup**
  - Install Solana CLI, Rust, Anchor
  - Create Anchor project: `anchor init darkbet-solana`
  - Set up GitHub repo with CI/CD (GitHub Actions)
  - Configure devnet RPC endpoints (Helius, QuickNode)
  
- [ ] **Week 2: Core Program Development**
  - Implement `PredictionMarket` program skeleton
  - Define account structures (Market, UserPosition)
  - Implement `initialize_market()` instruction
  - Write unit tests with Anchor test framework
  
- [ ] **Week 3: Commit-Reveal Logic**
  - Implement `commit_bet()` instruction
  - Implement `reveal_bet()` instruction
  - Add time-lock validation (commit vs reveal phases)
  - Test commit-reveal flow end-to-end
  
- [ ] **Week 4: Vault & User Registry**
  - Implement `VaultManager` program
  - Implement `UserRegistry` program (id_commitment linkage)
  - Add PDA derivation for all accounts
  - Deploy to devnet for initial testing

**Deliverables:**
- ✅ 4 Anchor programs deployed on devnet
- ✅ Test suite with 80%+ coverage
- ✅ Documentation of program APIs

---

### 9.2 Phase 2: Oracle Integration (Weeks 5-6)

**Objectives:** Integrate Pyth Network price feeds

**Tasks:**
- [ ] **Week 5: On-Chain Pyth Integration**
  - Add `pyth-sdk-solana` dependency
  - Implement `resolve_market()` instruction
  - Add Pyth account validation logic
  - Test with devnet Pyth feeds (BTC/USD, ETH/USD)
  
- [ ] **Week 6: Frontend Price Display**
  - Install `@pythnetwork/price-service-client`
  - Build WebSocket price subscription hook
  - Create real-time price chart component
  - Test price updates in UI

**Deliverables:**
- ✅ Markets resolve using Pyth prices
- ✅ Live price charts in frontend

---

### 9.3 Phase 3: Frontend Migration (Weeks 7-9)

**Objectives:** Rebuild frontend for Solana

**Tasks:**
- [ ] **Week 7: Wallet Adapter**
  - Install `@solana/wallet-adapter-react`
  - Configure Phantom, Solflare wallets
  - Build wallet connect button
  - Test transaction signing
  
- [ ] **Week 8: Transaction UI**
  - Build `CommitBetModal` component
  - Build `RevealBetModal` component
  - Build `ClaimWinningsModal` component
  - Add transaction status notifications
  
- [ ] **Week 9: Market Views**
  - Build `MarketListPage` (fetch from Solana)
  - Build `MarketDetailPage` (show positions, charts)
  - Build `MyBetsPage` (filter by user wallet)
  - Test full user flow on devnet

**Deliverables:**
- ✅ Fully functional frontend on devnet
- ✅ User can place, reveal, and claim bets

---

### 9.4 Phase 4: Privy Authentication (Weeks 10-11)

**Objectives:** Integrate Privy for Solana

**Tasks:**
- [ ] **Week 10: Privy Setup**
  - Create Privy app in dashboard
  - Configure Solana network settings
  - Install `@privy-io/react-auth`
  - Implement `PrivyProvider` wrapper
  
- [ ] **Week 11: Session Management**
  - Build `useAuth()` hook
  - Implement login/logout flow
  - Test wallet connection via Privy
  - Store user metadata (prepare for Concordium linkage)

**Deliverables:**
- ✅ Users authenticate with Privy
- ✅ Phantom wallet connected via Privy

---

### 9.5 Phase 5: Concordium RG Layer (Weeks 12-15)

**Objectives:** Build responsible gambling compliance

**Tasks:**
- [ ] **Week 12: Concordium Contract**
  - Set up Concordium development environment
  - Implement `rg_registry` contract in Rust
  - Deploy to Concordium testnet
  - Test `register_user()`, `check_limits()` functions
  
- [ ] **Week 13: Web3 ID Integration**
  - Research Concordium Web3 ID providers
  - Implement ID verification flow
  - Test selective disclosure (age, jurisdiction)
  - Generate test credentials
  
- [ ] **Week 14: Backend Relayer**
  - Build `/api/rg/link-identity` endpoint
  - Build `/api/rg/check` endpoint
  - Build `/api/rg/self-exclude` endpoint
  - Test end-to-end RG flow
  
- [ ] **Week 15: Frontend RG UI**
  - Build "Verify Identity" onboarding flow
  - Add limit warnings in bet modal
  - Build self-exclusion page
  - Test user-facing RG features

**Deliverables:**
- ✅ Concordium RG contract on testnet
- ✅ Backend relayer connecting Privy + Concordium
- ✅ Users can verify identity and set limits

---

### 9.6 Phase 6: Testing & Audit (Weeks 16-18)

**Objectives:** Security audit and stress testing

**Tasks:**
- [ ] **Week 16: Security Audit**
  - Engage third-party auditor (e.g., OtterSec)
  - Provide audit report and fix findings
  - Conduct internal code review
  
- [ ] **Week 17: Stress Testing**
  - Simulate 1000 concurrent users on devnet
  - Test edge cases (staleness, limits, forfeiture)
  - Load test RPC endpoints
  
- [ ] **Week 18: Bug Fixes**
  - Address all critical/high findings
  - Retest resolved issues
  - Prepare for mainnet deployment

**Deliverables:**
- ✅ Clean audit report
- ✅ 99.9% test coverage on critical paths

---

### 9.7 Phase 7: Mainnet Deployment (Weeks 19-20)

**Objectives:** Launch on Solana mainnet

**Tasks:**
- [ ] **Week 19: Mainnet Prep**
  - Deploy Anchor programs to mainnet-beta
  - Configure mainnet Pyth feeds
  - Deploy Concordium RG contract to mainnet
  - Update frontend to mainnet RPC
  
- [ ] **Week 20: Soft Launch**
  - Invite 100 beta users (whitelist)
  - Monitor transactions and errors
  - Collect user feedback
  - Fix any production issues

**Deliverables:**
- ✅ Darkbet live on Solana mainnet
- ✅ Beta users successfully placing bets

---

### 9.8 Phase 8: BSC Deprecation (Weeks 21-24)

**Objectives:** Sunset old BSC contracts

**Tasks:**
- [ ] **Week 21: Announcement**
  - Announce migration timeline (3 months)
  - Publish migration guide
  - Notify users via email/Discord
  
- [ ] **Week 22-23: Migration Tools**
  - Build "Migrate to Solana" flow
  - Allow BSC users to claim outstanding bets
  - Transfer balances to Solana (manual process)
  
- [ ] **Week 24: BSC Shutdown**
  - Pause BSC contracts (no new bets)
  - Close out all positions
  - Redirect BSC frontend to Solana

**Deliverables:**
- ✅ All users migrated to Solana
- ✅ BSC contracts closed

---

## 10. Configuration & Deployment

### 10.1 Environment Variables

**Frontend (.env.local):**
```bash
# Privy
NEXT_PUBLIC_PRIVY_APP_ID=clxxx-xxxx-xxxx-xxxx

# Solana
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=xxx
NEXT_PUBLIC_PROGRAM_ID=DarkBet11111111111111111111111111111111111

# Pyth
NEXT_PUBLIC_PYTH_BTC_FEED=GVXRSBjFk6e6J3NbVPXohDJetcTjaeeuykUpbQF8UoMU
NEXT_PUBLIC_PYTH_ETH_FEED=JBu1AL4obBcCMqKBBxhpWCNUt136ijcuMZLFvTP7iWdB
NEXT_PUBLIC_PYTH_SOL_FEED=H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG

# Concordium
NEXT_PUBLIC_CONCORDIUM_NETWORK=mainnet
```

**Backend (.env):**
```bash
# Privy (server-side)
PRIVY_APP_ID=clxxx-xxxx-xxxx-xxxx
PRIVY_APP_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Concordium
CONCORDIUM_NODE_URL=https://grpc.mainnet.concordium.software:20000
CONCORDIUM_ADMIN_ACCOUNT=3XYZ...ABC
CONCORDIUM_ADMIN_KEY=./keys/admin.key
CONCORDIUM_RG_CONTRACT_INDEX=1234
CONCORDIUM_RG_CONTRACT_SUBINDEX=0

# Database (optional)
DATABASE_URL=postgresql://user:pass@host:5432/darkbet
```

**Anchor (Anchor.toml):**
```toml
[features]
seeds = false
skip-lint = false

[programs.mainnet]
darkbet_prediction_market = "DarkBet11111111111111111111111111111111111"

[provider]
cluster = "Mainnet"
wallet = "~/.config/solana/id.json"

[scripts]
test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts"
```

### 10.2 Deployment Commands

**Solana Program Deployment:**
```bash
# Build programs
anchor build

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Deploy to mainnet (requires funded wallet)
anchor deploy --provider.cluster mainnet
```

**Frontend Deployment (Vercel):**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod

# Environment variables configured in Vercel dashboard
```

**Concordium Contract Deployment:**
```bash
# Compile contract
cargo concordium build --schema-out rg_registry_schema.json

# Deploy to testnet
concordium-client module deploy \
  ./target/concordium/wasm32-unknown-unknown/release/rg_registry.wasm \
  --sender $ADMIN_ACCOUNT \
  --grpc-ip grpc.testnet.concordium.com \
  --grpc-port 10000

# Initialize contract
concordium-client contract init \
  <module-hash> \
  --contract rg_registry \
  --sender $ADMIN_ACCOUNT \
  --energy 10000
```

### 10.3 Monitoring & Observability

**Recommended Tools:**
- **Solana Explorer:** https://explorer.solana.com (mainnet transaction monitoring)
- **Pyth Status:** https://pyth.network/price-feeds (oracle health)
- **Datadog:** Custom dashboards for API latency, error rates
- **Sentry:** Frontend error tracking
- **Discord Alerts:** Webhook notifications for critical errors

**Key Metrics to Monitor:**
| Metric | Threshold | Action |
|--------|-----------|--------|
| RPC Latency | > 500ms | Switch to backup RPC |
| Transaction Failure Rate | > 5% | Investigate contract or RPC issue |
| Pyth Price Staleness | > 60s | Pause market creation |
| API Error Rate | > 1% | Check backend logs |
| User Signups | < 10/day | Marketing issue (not technical) |

---

## 11. References & Documentation

### 11.1 Official Documentation

**Solana Development:**
- **Solana Docs:** https://solana.com/docs
- **Anchor Book:** https://book.anchor-lang.com
- **Solana Cookbook:** https://solanacookbook.com
- **Metaplex SPL Token Guide:** https://spl.solana.com

**Pyth Network:**
- **Pyth Docs:** https://docs.pyth.network
- **Price Feed IDs:** https://pyth.network/developers/price-feed-ids
- **Solana Integration Guide:** https://docs.pyth.network/price-feeds/use-real-time-data/solana

**Privy:**
- **Privy Docs:** https://docs.privy.io
- **React SDK:** https://docs.privy.io/guide/react
- **Solana Wallet Support:** https://docs.privy.io/guide/react/wallets/solana

**Concordium:**
- **Developer Portal:** https://developer.concordium.software
- **Web3 ID Docs:** https://docs.concordium.com/en/mainnet/net/web3-id/web3-id.html
- **Smart Contract Rust SDK:** https://docs.concordium.com/en/mainnet/smart-contracts/general/develop-contracts.html

### 11.2 Code Examples & Templates

**Anchor Program Templates:**
- Anchor Examples: https://github.com/coral-xyz/anchor/tree/master/tests
- Solana Program Library: https://github.com/solana-labs/solana-program-library

**Wallet Adapter Templates:**
- Next.js Wallet Adapter: https://github.com/solana-labs/wallet-adapter/tree/master/packages/starter/nextjs-starter

**Concordium Examples:**
- Smart Contract Examples: https://github.com/Concordium/concordium-rust-smart-contracts/tree/main/examples

### 11.3 Community & Support

**Solana:**
- Discord: https://discord.gg/solana
- Stack Exchange: https://solana.stackexchange.com
- Developer Telegram: t.me/solana_dev

**Pyth:**
- Discord: https://discord.gg/pythnetwork
- Twitter: @PythNetwork

**Concordium:**
- Discord: https://discord.gg/concordium
- Telegram: t.me/concordium_official

---

## Conclusion

This technical design document provides a comprehensive blueprint for refactoring the Darkbet platform from BSC to Solana, with integrated Privy authentication, Pyth Network oracles, and Concordium responsible gambling compliance.

**Key Success Factors:**
1. **Incremental Migration:** Parallel development allows testing without disrupting existing users
2. **Security First:** Third-party audits and formal verification before mainnet launch
3. **Privacy by Design:** Zero-knowledge proofs and anonymous commitments protect user data
4. **Regulatory Compliance:** Concordium's identity layer ensures legal operation
5. **User Experience:** Solana's speed and Privy's seamless auth reduce friction

**Next Steps:**
1. Review this document with engineering team
2. Finalize technical architecture decisions
3. Begin Phase 1 implementation (Foundation)
4. Schedule weekly sync meetings to track progress
5. Engage security auditors early (Week 10-12)

**Questions or Clarifications:**
For any questions about this design, please contact:
- **Technical Lead:** [Your Name]
- **Blockchain Architect:** [Architect Name]
- **Compliance Officer:** [Officer Name]

**Document Version History:**
- v1.0 (Oct 24, 2025): Initial draft

---

*This document is a living artifact and will be updated as the project evolves. All stakeholders should review quarterly.*


