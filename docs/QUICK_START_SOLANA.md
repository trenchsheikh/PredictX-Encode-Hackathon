# Darkbet Solana Migration - Quick Start Guide

**Get started with development in under 30 minutes**

---

## 🚀 Prerequisites

Before you begin, ensure you have:
- **macOS, Linux, or WSL2** (Windows Subsystem for Linux)
- **Git** installed
- **Node.js 18+** and **npm/yarn**
- **Basic knowledge** of Rust, TypeScript, and React

---

## ⚡ Quick Setup (5 minutes)

### Step 1: Install Solana CLI

```bash
# Install Solana
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Add to PATH (add to ~/.bashrc or ~/.zshrc)
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"

# Verify installation
solana --version
# Output: solana-cli 1.17.x
```

### Step 2: Install Rust

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Verify installation
rustc --version
cargo --version
```

### Step 3: Install Anchor CLI

```bash
# Install Anchor Version Manager (avm)
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force

# Install latest Anchor
avm install latest
avm use latest

# Verify installation
anchor --version
# Output: anchor-cli 0.29.x
```

---

## 🏗️ Project Setup (10 minutes)

### Step 1: Create Solana Keypair

```bash
# Generate devnet wallet
solana-keygen new --outfile ~/.config/solana/devnet.json

# Set devnet as default cluster
solana config set --url https://api.devnet.solana.com

# Set keypair
solana config set --keypair ~/.config/solana/devnet.json

# Verify configuration
solana config get
```

### Step 2: Get Devnet SOL

```bash
# Airdrop 2 SOL (can repeat up to 5 times)
solana airdrop 2

# Check balance
solana balance
# Output: 2 SOL
```

### Step 3: Initialize Anchor Project

```bash
# Create new Anchor project
anchor init darkbet-solana
cd darkbet-solana

# Project structure:
# darkbet-solana/
# ├── programs/           # Rust smart contracts
# │   └── darkbet-solana/
# │       └── src/
# │           └── lib.rs
# ├── tests/              # TypeScript tests
# ├── migrations/         # Deployment scripts
# ├── app/                # (We'll add Next.js here)
# └── Anchor.toml         # Config file
```

### Step 4: Build and Test

```bash
# Build programs
anchor build

# Run tests
anchor test

# Output: Tests passed! 🎉
```

---

## 📝 Create Your First Program (5 minutes)

### Edit `programs/darkbet-solana/src/lib.rs`

Replace the default code with a simple prediction market:

```rust
use anchor_lang::prelude::*;

declare_id!("YourProgramIDHere111111111111111111111111111");

#[program]
pub mod darkbet_solana {
    use super::*;

    pub fn initialize_market(
        ctx: Context<InitializeMarket>,
        market_id: u64,
        resolution_time: i64,
    ) -> Result<()> {
        let market = &mut ctx.accounts.market;
        market.authority = ctx.accounts.authority.key();
        market.market_id = market_id;
        market.resolution_time = resolution_time;
        market.total_long_stake = 0;
        market.total_short_stake = 0;
        market.status = MarketStatus::Open;
        market.bump = ctx.bumps.market;
        
        msg!("Market {} initialized", market_id);
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(market_id: u64)]
pub struct InitializeMarket<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + Market::INIT_SPACE,
        seeds = [b"market", market_id.to_le_bytes().as_ref()],
        bump
    )]
    pub market: Account<'info, Market>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct Market {
    pub authority: Pubkey,
    pub market_id: u64,
    pub resolution_time: i64,
    pub total_long_stake: u64,
    pub total_short_stake: u64,
    pub status: MarketStatus,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, InitSpace)]
pub enum MarketStatus {
    Open,
    Locked,
    Resolved,
}
```

### Build and Deploy

```bash
# Build
anchor build

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Copy your Program ID
solana address -k target/deploy/darkbet_solana-keypair.json
# Output: YourProgramIDHere111111111111111111111111111

# Update declare_id! in lib.rs with your Program ID
# Then rebuild and redeploy
anchor build
anchor deploy --provider.cluster devnet
```

---

## 🧪 Test Your Program (5 minutes)

### Edit `tests/darkbet-solana.ts`

```typescript
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { DarkbetSolana } from "../target/types/darkbet_solana";
import { expect } from "chai";

describe("darkbet-solana", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.DarkbetSolana as Program<DarkbetSolana>;

  it("Creates a market", async () => {
    const marketId = new anchor.BN(1);
    const resolutionTime = new anchor.BN(Date.now() / 1000 + 3600); // 1 hour from now
    
    const [marketPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("market"), marketId.toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    await program.methods
      .initializeMarket(marketId, resolutionTime)
      .accounts({
        market: marketPda,
        authority: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    const market = await program.account.market.fetch(marketPda);
    
    expect(market.marketId.toString()).to.equal(marketId.toString());
    expect(market.status).to.deep.equal({ open: {} });
    expect(market.totalLongStake.toString()).to.equal("0");
    
    console.log("✅ Market created successfully!");
    console.log("Market PDA:", marketPda.toBase58());
    console.log("Market ID:", market.marketId.toString());
  });
});
```

### Run Tests

```bash
anchor test

# Output:
# darkbet-solana
#   ✅ Market created successfully!
#   ✓ Creates a market (500ms)
# 
# 1 passing (500ms)
```

---

## 🌐 Add Frontend (5 minutes)

### Install Next.js and Dependencies

```bash
# In project root
npx create-next-app@latest app --typescript --tailwind --app --no-src-dir

cd app

# Install Solana wallet adapter
npm install @solana/wallet-adapter-react \
            @solana/wallet-adapter-react-ui \
            @solana/wallet-adapter-wallets \
            @solana/web3.js \
            @coral-xyz/anchor
```

### Create Wallet Provider

Create `app/components/wallet-provider.tsx`:

```typescript
'use client';

import { FC, ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

require('@solana/wallet-adapter-react-ui/styles.css');

export const SolanaWalletProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const endpoint = useMemo(() => clusterApiUrl('devnet'), []);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
```

### Update Root Layout

Edit `app/layout.tsx`:

```typescript
import { SolanaWalletProvider } from './components/wallet-provider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SolanaWalletProvider>
          {children}
        </SolanaWalletProvider>
      </body>
    </html>
  );
}
```

### Create Simple UI

Edit `app/page.tsx`:

```typescript
'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Program, AnchorProvider, web3, BN } from '@coral-xyz/anchor';
import { useState } from 'react';

export default function Home() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [marketId, setMarketId] = useState('');

  const createMarket = async () => {
    if (!wallet.publicKey) return;

    const provider = new AnchorProvider(connection, wallet as any, {});
    // Load your program (you'll need to import the IDL)
    
    const marketIdBN = new BN(marketId);
    const resolutionTime = new BN(Date.now() / 1000 + 3600);
    
    const [marketPda] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("market"), marketIdBN.toArrayLike(Buffer, "le", 8)],
      new web3.PublicKey("YourProgramIDHere")
    );

    // Call program.methods.initializeMarket()...
    
    alert(`Market created at ${marketPda.toBase58()}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Darkbet on Solana</h1>
      
      <WalletMultiButton />
      
      {wallet.connected && (
        <div className="mt-8 space-y-4">
          <input
            type="number"
            placeholder="Market ID"
            value={marketId}
            onChange={(e) => setMarketId(e.target.value)}
            className="px-4 py-2 border rounded"
          />
          <button
            onClick={createMarket}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create Market
          </button>
        </div>
      )}
    </main>
  );
}
```

### Run Frontend

```bash
npm run dev
# Open http://localhost:3000
```

---

## 🎯 Next Steps

Congratulations! You now have:
- ✅ Solana development environment set up
- ✅ Basic prediction market program deployed on devnet
- ✅ Frontend with wallet connection

### Continue Learning

1. **Add Pyth Integration**
   - Follow: [Pyth Solana Guide](https://docs.pyth.network/price-feeds/use-real-time-data/solana)
   - Add `pyth-sdk-solana` to `Cargo.toml`
   - Implement `resolve_market()` with Pyth price

2. **Add Commit-Reveal Logic**
   - Implement `commit_bet()` instruction
   - Implement `reveal_bet()` instruction
   - Test forfeiture scenarios

3. **Integrate Privy**
   - Sign up at [privy.io](https://privy.io)
   - Install `@privy-io/react-auth`
   - Replace wallet adapter with Privy

4. **Build Concordium RG Layer**
   - Review: [Concordium Docs](https://developer.concordium.software)
   - Create RG registry contract
   - Implement backend relayer

### Full Documentation

- **Technical Design:** `docs/SOLANA_REFACTOR_DESIGN.md`
- **Migration Summary:** `docs/SOLANA_MIGRATION_SUMMARY.md`
- **Implementation Checklist:** `docs/IMPLEMENTATION_CHECKLIST.md`

---

## 🆘 Troubleshooting

### Common Issues

**"solana: command not found"**
```bash
# Add Solana to PATH
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
source ~/.bashrc  # or ~/.zshrc
```

**"Anchor build failed"**
```bash
# Update Rust
rustup update

# Clean and rebuild
anchor clean
anchor build
```

**"Insufficient funds"**
```bash
# Airdrop more SOL
solana airdrop 2

# Check balance
solana balance
```

**"Program ID mismatch"**
```bash
# Get your program ID
solana address -k target/deploy/darkbet_solana-keypair.json

# Update declare_id! in lib.rs
# Rebuild and redeploy
anchor build
anchor deploy --provider.cluster devnet
```

---

## 📚 Resources

### Documentation
- [Solana Docs](https://solana.com/docs)
- [Anchor Book](https://book.anchor-lang.com)
- [Solana Cookbook](https://solanacookbook.com)

### Community
- [Solana Discord](https://discord.gg/solana)
- [Anchor Discord](https://discord.gg/anchorlang)
- [Solana Stack Exchange](https://solana.stackexchange.com)

### Video Tutorials
- [Solana Bytes (Official YouTube)](https://www.youtube.com/@SolanaFndn)
- [Anchor by Example](https://examples.anchor-lang.com)

---

## ✅ Success Checklist

Before moving to production:
- [ ] All tests passing
- [ ] Program deployed on devnet
- [ ] Frontend connected to devnet
- [ ] Wallet connection working
- [ ] Basic transaction flow tested
- [ ] Code reviewed by team
- [ ] Security audit scheduled

---

**Ready to build? Let's go! 🚀**

*Last updated: October 24, 2025*


