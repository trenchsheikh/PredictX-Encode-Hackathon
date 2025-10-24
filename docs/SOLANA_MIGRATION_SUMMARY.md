# Darkbet Solana Migration - Executive Summary

**Quick Reference Guide**  
**Last Updated:** October 24, 2025

---

## 🎯 Migration Overview

**Current State:** BSC-based prediction market  
**Target State:** Solana-native platform with compliance layer  
**Timeline:** 20-24 weeks  
**Status:** Design Phase

---

## 🏗️ Architecture Components

### 1. Solana Blockchain Layer
- **Framework:** Anchor (Rust)
- **Programs:**
  - `PredictionMarket` - Core betting logic
  - `CommitReveal` - Anti-front-running
  - `VaultManager` - SOL custody
  - `UserRegistry` - Identity linkage
- **Currency:** SOL (replaces BNB)
- **Performance:** 65,000 TPS, ~$0.00025/tx

### 2. Privy Authentication
- **Configuration:** Solana + Phantom wallet (default)
- **Features:**
  - Email/social login
  - Embedded wallets
  - Session management
  - Concordium ID metadata storage
- **Integration:** `@privy-io/react-auth`

### 3. Pyth Network Oracles
- **Purpose:** On-chain verifiable price feeds
- **Integration:**
  - On-chain: `pyth-sdk-solana` in Anchor programs
  - Off-chain: WebSocket price service for UI
- **Feeds:** BTC/USD, ETH/USD, SOL/USD (400ms updates)
- **Security:** Staleness checks, confidence thresholds

### 4. Concordium Responsible Gambling
- **Smart Contract:** RG Registry (Rust + Concordium SDK)
- **Features:**
  - Daily/weekly spending limits
  - Self-exclusion
  - Cooldown periods
  - Anonymous audit logs
- **Identity:** Web3 ID with zero-knowledge proofs
- **Privacy:** `id_commitment = Blake2b(privyUserId || solanaPubkey)`

---

## 🔄 User Flow

```
1. User connects Phantom wallet via Privy
2. Completes Concordium ID verification (first-time)
3. Selects market, enters bet amount
4. Frontend calls POST /rg/check (limit validation)
5. If allowed → Sign Solana transaction (commit_bet)
6. After market lock → Reveal bet
7. System resolves market using Pyth price
8. Winner claims payout from losers' pool
```

---

## 🔐 Security Architecture

### Smart Contract Security
- ✅ Anchor framework protections (overflow, reentrancy)
- ✅ PDA-based account derivation
- ✅ Checked math operations
- ✅ Third-party audit (OtterSec/Neodyme)

### Oracle Security
- ✅ Pyth price validation (staleness, confidence)
- ✅ Circuit breakers (20% price move limit)
- ✅ On-chain verification only

### Privacy Architecture
- ✅ No PII on Darkbet servers
- ✅ Zero-knowledge age verification
- ✅ Anonymous id_commitment on-chain
- ✅ GDPR compliant (right to erasure via self-exclusion)

---

## 📋 Implementation Phases

| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| **1. Foundation** | 4 weeks | Anchor programs on devnet |
| **2. Oracle Integration** | 2 weeks | Pyth price feeds working |
| **3. Frontend Migration** | 3 weeks | Solana wallet adapter UI |
| **4. Privy Auth** | 2 weeks | Authentication for Solana |
| **5. Concordium RG** | 4 weeks | Identity + limit enforcement |
| **6. Testing & Audit** | 3 weeks | Security audit, stress tests |
| **7. Mainnet Launch** | 2 weeks | Production deployment |
| **8. BSC Sunset** | 4 weeks | Migrate users, close BSC |

**Total Timeline:** 24 weeks (~6 months)

---

## 🛠️ Technology Stack

### Backend
- **Blockchain:** Solana (mainnet-beta)
- **Smart Contracts:** Rust + Anchor 0.29.0
- **Oracle:** Pyth Network
- **Compliance:** Concordium RG contract
- **API:** Next.js API routes (Node.js)

### Frontend
- **Framework:** Next.js 14 + React 18 + TypeScript
- **Wallet:** `@solana/wallet-adapter-react`
- **Auth:** `@privy-io/react-auth`
- **RPC:** `@solana/web3.js`
- **Styling:** TailwindCSS + shadcn/ui

### Infrastructure
- **RPC Providers:** Helius, QuickNode, Triton
- **Deployment:** Vercel (frontend), Solana mainnet (contracts)
- **Monitoring:** Datadog, Sentry
- **Database:** PostgreSQL (metadata only, no PII)

---

## 🌐 Configuration

### Network Endpoints

**Solana:**
- Mainnet: `https://mainnet.helius-rpc.com/?api-key=<KEY>`
- Devnet: `https://api.devnet.solana.com`

**Pyth Oracle:**
- Price Service: `wss://hermes.pyth.network/ws`
- Mainnet Feeds: See `config/pyth-feeds.ts`

**Concordium:**
- Mainnet gRPC: `https://grpc.mainnet.concordium.software:20000`
- Testnet gRPC: `https://grpc.testnet.concordium.com:10000`

### Environment Variables

```bash
# Privy
NEXT_PUBLIC_PRIVY_APP_ID=clxxx-xxxx-xxxx
PRIVY_APP_SECRET=xxxxx

# Solana
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=xxx
NEXT_PUBLIC_PROGRAM_ID=DarkBet11111111111111111111111111111111111

# Concordium
CONCORDIUM_NODE_URL=https://grpc.mainnet.concordium.software:20000
CONCORDIUM_RG_CONTRACT_INDEX=1234
```

---

## 📊 Key Metrics

### Performance Targets
- Transaction confirmation: < 2 seconds
- RPC latency: < 500ms
- Price update frequency: 400ms (Pyth)
- Frontend load time: < 3 seconds

### Cost Efficiency
- Transaction fee: ~$0.00025 (vs $0.30 on BSC)
- RPC cost: $50-200/month (paid tier)
- Estimated savings: 99% lower tx fees

---

## ⚠️ Risk Mitigation

### Technical Risks
| Risk | Mitigation |
|------|-----------|
| **Solana network outage** | Backup RPC providers, status page |
| **Pyth oracle downtime** | Extend resolution time, pause new markets |
| **Smart contract exploit** | Third-party audit, bug bounty program |
| **Concordium integration complexity** | Phased rollout, testnet validation |

### Regulatory Risks
| Risk | Mitigation |
|------|-----------|
| **KYC/AML compliance** | Concordium Web3 ID (built-in identity) |
| **Responsible gambling laws** | RG limits enforced on-chain |
| **Jurisdiction restrictions** | Geo-blocking via Web3 ID attributes |

---

## 🚀 Next Steps

### Immediate Actions (Week 1)
1. ✅ Review technical design document
2. ⬜ Set up Solana development environment
3. ⬜ Initialize Anchor project (`anchor init darkbet-solana`)
4. ⬜ Create GitHub repo with CI/CD pipeline
5. ⬜ Schedule weekly engineering syncs

### Short-Term Goals (Month 1)
1. ⬜ Deploy MVP Anchor programs to devnet
2. ⬜ Integrate Pyth devnet feeds
3. ⬜ Build POC frontend with wallet adapter
4. ⬜ Test commit-reveal flow end-to-end

### Medium-Term Goals (Months 2-3)
1. ⬜ Complete Privy authentication integration
2. ⬜ Build Concordium RG contract on testnet
3. ⬜ Conduct internal security review
4. ⬜ Engage third-party auditor

### Long-Term Goals (Months 4-6)
1. ⬜ Launch beta on Solana mainnet
2. ⬜ Migrate BSC users
3. ⬜ Sunset BSC contracts
4. ⬜ Scale to 1000+ daily active users

---

## 📚 Key Documentation Links

### Official Docs
- **Solana:** https://solana.com/docs
- **Anchor:** https://book.anchor-lang.com
- **Pyth:** https://docs.pyth.network
- **Privy:** https://docs.privy.io
- **Concordium:** https://developer.concordium.software

### Internal Docs
- **Full Technical Design:** `docs/SOLANA_REFACTOR_DESIGN.md`
- **API Specification:** (TBD - create in Phase 5)
- **Deployment Guide:** (TBD - create in Phase 7)
- **Security Audit Report:** (TBD - after Phase 6)

---

## 👥 Team & Roles

### Core Team (To Be Assigned)
- **Technical Lead:** Oversees architecture and implementation
- **Blockchain Engineer:** Develops Anchor programs
- **Frontend Engineer:** Builds React UI and wallet integration
- **Compliance Engineer:** Implements Concordium RG layer
- **DevOps Engineer:** Manages deployment and monitoring
- **Security Auditor:** Third-party contract audit

### External Partners
- **Privy:** Authentication platform
- **Helius/QuickNode:** RPC infrastructure
- **OtterSec/Neodyme:** Security audit firm
- **Concordium Foundation:** Identity layer support

---

## ❓ FAQ

### Why migrate from BSC to Solana?
- **Performance:** 1000x more transactions per second
- **Cost:** 99% lower transaction fees
- **Ecosystem:** Better DeFi/gaming infrastructure
- **Oracle:** Native Pyth Network integration

### What happens to existing BSC users?
- 3-month overlap period for migration
- Tools to claim outstanding bets
- Manual balance transfer to Solana
- BSC contracts closed after overlap

### How is user privacy protected?
- No PII stored on Darkbet servers
- Concordium uses zero-knowledge proofs
- Anonymous `id_commitment` on-chain
- Regulator access requires court order

### What if Concordium is unavailable?
- RG checks have 5-second timeout
- Fallback to cached limits (10-minute TTL)
- Admin can disable RG enforcement temporarily
- Alert sent to compliance team

### How are disputes handled?
- On-chain resolution is deterministic (Pyth price)
- Admin can trigger manual resolution if oracle fails
- Disputes go through community governance (future DAO)

---

## 📞 Contact & Support

**Technical Questions:**  
Open GitHub issue or contact technical lead

**Security Concerns:**  
Email: security@darkbet.io (bounty program)

**Compliance Inquiries:**  
Email: compliance@darkbet.io

**General Support:**  
Discord: https://discord.gg/darkbet

---

*Last updated: October 24, 2025*  
*Document version: 1.0*


