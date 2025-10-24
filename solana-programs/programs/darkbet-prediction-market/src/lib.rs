use anchor_lang::prelude::*;

// This is a placeholder program ID - will be updated after deployment
declare_id!("11111111111111111111111111111111");

#[program]
pub mod darkbet_prediction_market {
    use super::*;

    /// Initialize a new prediction market
    pub fn initialize_market(
        ctx: Context<InitializeMarket>,
        market_id: u64,
        asset_type: AssetType,
        resolution_time: i64,
        pyth_feed_account: Pubkey,
        threshold_price: i64,
    ) -> Result<()> {
        let market = &mut ctx.accounts.market;
        let clock = Clock::get()?;

        // Validate resolution time is in the future
        require!(
            resolution_time > clock.unix_timestamp,
            ErrorCode::InvalidResolutionTime
        );

        // Initialize market state
        market.authority = ctx.accounts.authority.key();
        market.market_id = market_id;
        market.asset_type = asset_type;
        market.resolution_time = resolution_time;
        market.pyth_feed_account = pyth_feed_account;
        market.threshold_price = threshold_price;
        market.total_long_stake = 0;
        market.total_short_stake = 0;
        market.status = MarketStatus::Open;
        market.settlement_price = None;
        market.created_at = clock.unix_timestamp;
        market.bump = ctx.bumps.market;

        emit!(MarketCreated {
            market_id,
            authority: market.authority,
            asset_type,
            resolution_time,
            threshold_price,
        });

        msg!("Market {} initialized successfully", market_id);
        Ok(())
    }

    /// Commit a bet (commit phase of commit-reveal)
    pub fn commit_bet(
        ctx: Context<CommitBet>,
        stake_amount: u64,
        commitment_hash: [u8; 32],
    ) -> Result<()> {
        let market = &ctx.accounts.market;
        let position = &mut ctx.accounts.position;
        let clock = Clock::get()?;

        // Validate market is open
        require!(
            market.status == MarketStatus::Open,
            ErrorCode::MarketNotOpen
        );

        // Validate market hasn't reached lock time
        require!(
            clock.unix_timestamp < market.resolution_time - 300, // 5 minutes before resolution
            ErrorCode::MarketLocked
        );

        // Validate stake amount
        require!(
            stake_amount >= 10_000_000, // Minimum 0.01 SOL
            ErrorCode::StakeTooLow
        );
        require!(
            stake_amount <= 100_000_000_000, // Maximum 100 SOL
            ErrorCode::StakeTooHigh
        );

        // Initialize position
        position.user = ctx.accounts.user.key();
        position.market = market.key();
        position.stake_amount = stake_amount;
        position.commitment_hash = commitment_hash;
        position.direction = None;
        position.revealed = false;
        position.claimed = false;
        position.committed_at = clock.unix_timestamp;
        position.bump = ctx.bumps.position;

        // Transfer SOL from user to vault (will be implemented with vault program)
        // For now, we'll just track the stake amount

        emit!(BetCommitted {
            user: position.user,
            market: position.market,
            stake_amount,
            commitment_hash,
        });

        msg!("Bet committed by {} for {} lamports", position.user, stake_amount);
        Ok(())
    }

    /// Reveal a bet (reveal phase of commit-reveal)
    pub fn reveal_bet(
        ctx: Context<RevealBet>,
        direction: Direction,
        nonce: String,
    ) -> Result<()> {
        let market = &mut ctx.accounts.market;
        let position = &mut ctx.accounts.position;
        let clock = Clock::get()?;

        // Validate market is locked
        require!(
            market.status == MarketStatus::Locked,
            ErrorCode::MarketNotLocked
        );

        // Validate reveal window (5 minutes after lock)
        let lock_time = market.resolution_time - 300;
        require!(
            clock.unix_timestamp >= lock_time && clock.unix_timestamp < market.resolution_time,
            ErrorCode::RevealWindowClosed
        );

        // Validate not already revealed
        require!(
            !position.revealed,
            ErrorCode::AlreadyRevealed
        );

        // Verify commitment hash
        let computed_hash = hash_commitment(&direction, &nonce, position.committed_at);
        require!(
            computed_hash == position.commitment_hash,
            ErrorCode::InvalidCommitment
        );

        // Update position
        position.direction = Some(direction.clone());
        position.revealed = true;

        // Update market stakes
        match direction {
            Direction::Long => {
                market.total_long_stake = market
                    .total_long_stake
                    .checked_add(position.stake_amount)
                    .ok_or(ErrorCode::MathOverflow)?;
            }
            Direction::Short => {
                market.total_short_stake = market
                    .total_short_stake
                    .checked_add(position.stake_amount)
                    .ok_or(ErrorCode::MathOverflow)?;
            }
        }

        emit!(BetRevealed {
            user: position.user,
            market: position.market,
            direction,
            stake_amount: position.stake_amount,
        });

        msg!("Bet revealed: {:?}", direction);
        Ok(())
    }

    /// Lock the market (stop accepting new bets)
    pub fn lock_market(ctx: Context<LockMarket>) -> Result<()> {
        let market = &mut ctx.accounts.market;
        let clock = Clock::get()?;

        // Validate market is open
        require!(
            market.status == MarketStatus::Open,
            ErrorCode::MarketNotOpen
        );

        // Validate lock time has been reached
        require!(
            clock.unix_timestamp >= market.resolution_time - 300,
            ErrorCode::LockTimeNotReached
        );

        market.status = MarketStatus::Locked;

        emit!(MarketLocked {
            market_id: market.market_id,
            lock_time: clock.unix_timestamp,
        });

        msg!("Market {} locked", market.market_id);
        Ok(())
    }
}

// ============================================================================
// Account Structures
// ============================================================================

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

#[derive(Accounts)]
pub struct CommitBet<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + UserPosition::INIT_SPACE,
        seeds = [b"position", user.key().as_ref(), market.key().as_ref()],
        bump
    )]
    pub position: Account<'info, UserPosition>,

    #[account(mut, seeds = [b"market", market.market_id.to_le_bytes().as_ref()], bump = market.bump)]
    pub market: Account<'info, Market>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RevealBet<'info> {
    #[account(
        mut,
        seeds = [b"position", user.key().as_ref(), market.key().as_ref()],
        bump = position.bump,
        has_one = user,
        has_one = market
    )]
    pub position: Account<'info, UserPosition>,

    #[account(mut, seeds = [b"market", market.market_id.to_le_bytes().as_ref()], bump = market.bump)]
    pub market: Account<'info, Market>,

    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct LockMarket<'info> {
    #[account(mut, seeds = [b"market", market.market_id.to_le_bytes().as_ref()], bump = market.bump)]
    pub market: Account<'info, Market>,

    /// Anyone can call lock_market when the time is reached
    pub caller: Signer<'info>,
}

// ============================================================================
// Account State
// ============================================================================

#[account]
#[derive(InitSpace)]
pub struct Market {
    pub authority: Pubkey,           // 32
    pub market_id: u64,              // 8
    pub asset_type: AssetType,       // 1 + size
    pub resolution_time: i64,        // 8
    pub pyth_feed_account: Pubkey,   // 32
    pub threshold_price: i64,        // 8
    pub total_long_stake: u64,       // 8
    pub total_short_stake: u64,      // 8
    pub status: MarketStatus,        // 1 + size
    pub settlement_price: Option<i64>, // 1 + 8
    pub created_at: i64,             // 8
    pub bump: u8,                    // 1
}

#[account]
#[derive(InitSpace)]
pub struct UserPosition {
    pub user: Pubkey,                // 32
    pub market: Pubkey,              // 32
    pub stake_amount: u64,           // 8
    pub commitment_hash: [u8; 32],   // 32
    pub direction: Option<Direction>, // 1 + 1
    pub revealed: bool,              // 1
    pub claimed: bool,               // 1
    pub committed_at: i64,           // 8
    pub bump: u8,                    // 1
}

// ============================================================================
// Enums
// ============================================================================

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, InitSpace)]
pub enum MarketStatus {
    Open,
    Locked,
    Resolved,
    Cancelled,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, InitSpace, Debug)]
pub enum Direction {
    Long,  // Betting price will be ABOVE threshold
    Short, // Betting price will be BELOW threshold
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, InitSpace)]
pub enum AssetType {
    BTC,
    ETH,
    SOL,
    BNB,
}

// ============================================================================
// Events
// ============================================================================

#[event]
pub struct MarketCreated {
    pub market_id: u64,
    pub authority: Pubkey,
    pub asset_type: AssetType,
    pub resolution_time: i64,
    pub threshold_price: i64,
}

#[event]
pub struct BetCommitted {
    pub user: Pubkey,
    pub market: Pubkey,
    pub stake_amount: u64,
    pub commitment_hash: [u8; 32],
}

#[event]
pub struct BetRevealed {
    pub user: Pubkey,
    pub market: Pubkey,
    pub direction: Direction,
    pub stake_amount: u64,
}

#[event]
pub struct MarketLocked {
    pub market_id: u64,
    pub lock_time: i64,
}

// ============================================================================
// Error Codes
// ============================================================================

#[error_code]
pub enum ErrorCode {
    #[msg("Resolution time must be in the future")]
    InvalidResolutionTime,

    #[msg("Market is not open for betting")]
    MarketNotOpen,

    #[msg("Market is locked, no new bets allowed")]
    MarketLocked,

    #[msg("Stake amount is too low (minimum 0.01 SOL)")]
    StakeTooLow,

    #[msg("Stake amount is too high (maximum 100 SOL)")]
    StakeTooHigh,

    #[msg("Market is not locked yet")]
    MarketNotLocked,

    #[msg("Reveal window is closed")]
    RevealWindowClosed,

    #[msg("Bet already revealed")]
    AlreadyRevealed,

    #[msg("Invalid commitment hash")]
    InvalidCommitment,

    #[msg("Lock time has not been reached")]
    LockTimeNotReached,

    #[msg("Math overflow")]
    MathOverflow,
}

// ============================================================================
// Helper Functions
// ============================================================================

/// Hash the commitment (simplified version - in production use Blake3)
fn hash_commitment(direction: &Direction, nonce: &str, timestamp: i64) -> [u8; 32] {
    use anchor_lang::solana_program::hash::hash;
    
    let mut data = Vec::new();
    data.extend_from_slice(&[match direction {
        Direction::Long => 1u8,
        Direction::Short => 2u8,
    }]);
    data.extend_from_slice(nonce.as_bytes());
    data.extend_from_slice(&timestamp.to_le_bytes());
    
    hash(&data).to_bytes()
}


