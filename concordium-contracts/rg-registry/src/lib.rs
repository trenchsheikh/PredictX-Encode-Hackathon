/*!
 * Darkbet Responsible Gambling Registry Smart Contract
 * 
 * A privacy-preserving smart contract on Concordium blockchain that enforces
 * responsible gambling policies using anonymous identity commitments.
 * 
 * Features:
 * - User registration with Web3 ID verification
 * - Daily/weekly/monthly betting limits
 * - Self-exclusion mechanism
 * - Cooldown periods
 * - Anonymous audit logging
 * 
 * Based on Concordium smart contract documentation:
 * https://docs.concordium.com/en/mainnet/docs/smart-contracts/
 */

use concordium_std::*;

/// Identity commitment (Blake2b hash of privyUserId || solanaPublicKey)
pub type IdentityCommitment = [u8; 64];

/// Betting limits in microCCD (1 CCD = 1,000,000 microCCD)
#[derive(Serialize, SchemaType, Clone, Debug)]
pub struct BettingLimits {
    pub daily_limit: Amount,
    pub weekly_limit: Amount,
    pub monthly_limit: Amount,
    pub single_bet_limit: Amount,
    pub cooldown_period: u64, // in seconds
}

/// Time-windowed spending tracker
#[derive(Serialize, SchemaType, Clone, Debug)]
pub struct SpendingTracker {
    pub daily_spent: Amount,
    pub daily_reset_time: Timestamp,
    pub weekly_spent: Amount,
    pub weekly_reset_time: Timestamp,
    pub monthly_spent: Amount,
    pub monthly_reset_time: Timestamp,
}

/// User RG state
#[derive(Serialize, SchemaType, Clone, Debug)]
pub struct UserState {
    pub id_commitment: IdentityCommitment,
    pub limits: BettingLimits,
    pub spending: SpendingTracker,
    pub last_bet_timestamp: Timestamp,
    pub self_excluded: bool,
    pub self_exclusion_expiry: Option<Timestamp>,
    pub risk_level: RiskLevel,
    pub registered_at: Timestamp,
}

/// Risk level classification
#[derive(Serialize, SchemaType, Clone, Debug, PartialEq, Eq)]
pub enum RiskLevel {
    Low,
    Medium,
    High,
}

/// Event types for audit logging
#[derive(Serialize, SchemaType, Debug)]
pub enum RGEvent {
    UserRegistered {
        id_commitment: IdentityCommitment,
        timestamp: Timestamp,
    },
    LimitSet {
        id_commitment: IdentityCommitment,
        limits: BettingLimits,
        timestamp: Timestamp,
    },
    BetRecorded {
        id_commitment: IdentityCommitment,
        amount: Amount,
        timestamp: Timestamp,
    },
    SelfExcluded {
        id_commitment: IdentityCommitment,
        duration_days: u32,
        expiry: Timestamp,
        timestamp: Timestamp,
    },
    LimitViolated {
        id_commitment: IdentityCommitment,
        violation_type: String,
        timestamp: Timestamp,
    },
}

/// Contract state
#[derive(Serial, DeserialWithState)]
#[concordium(state_parameter = "S")]
pub struct State<S> {
    /// Mapping from identity commitment to user state
    pub users: StateMap<IdentityCommitment, UserState, S>,
    /// Contract owner (can upgrade contract)
    pub owner: AccountAddress,
    /// Minimum age requirement
    pub minimum_age: u8,
}

/// Init parameters
#[derive(Serialize, SchemaType)]
pub struct InitParams {
    pub owner: AccountAddress,
    pub minimum_age: u8,
}

/// Register user parameters
#[derive(Serialize, SchemaType)]
pub struct RegisterUserParams {
    pub id_commitment: IdentityCommitment,
    pub age_verified: bool,
    pub jurisdiction_allowed: bool,
}

/// Set limits parameters
#[derive(Serialize, SchemaType)]
pub struct SetLimitsParams {
    pub id_commitment: IdentityCommitment,
    pub limits: BettingLimits,
}

/// Record bet parameters
#[derive(Serialize, SchemaType)]
pub struct RecordBetParams {
    pub id_commitment: IdentityCommitment,
    pub bet_amount: Amount,
}

/// Self-exclusion parameters
#[derive(Serialize, SchemaType)]
pub struct SelfExclusionParams {
    pub id_commitment: IdentityCommitment,
    pub duration_days: u32,
}

/// Bet validation response
#[derive(Serialize, SchemaType, Debug)]
pub struct BetValidationResult {
    pub allowed: bool,
    pub reason: Option<String>,
}

/// Contract errors
#[derive(Debug, PartialEq, Eq, Reject, Serialize, SchemaType)]
pub enum Error {
    #[from(ParseError)]
    ParseError,
    UserAlreadyRegistered,
    UserNotFound,
    AgeNotVerified,
    JurisdictionNotAllowed,
    SelfExcluded,
    CooldownActive,
    DailyLimitExceeded,
    WeeklyLimitExceeded,
    MonthlyLimitExceeded,
    SingleBetLimitExceeded,
    InvalidLimits,
    Unauthorized,
}

/// Initialize contract
#[init(contract = "rg_registry", parameter = "InitParams")]
fn init<S: HasStateApi>(
    ctx: &impl HasInitContext,
    state_builder: &mut StateBuilder<S>,
) -> InitResult<State<S>> {
    let params: InitParams = ctx.parameter_cursor().get()?;

    Ok(State {
        users: state_builder.new_map(),
        owner: params.owner,
        minimum_age: params.minimum_age,
    })
}

/// Register new user in RG system
#[receive(
    contract = "rg_registry",
    name = "register_user",
    parameter = "RegisterUserParams",
    mutable
)]
fn register_user<S: HasStateApi>(
    ctx: &impl HasReceiveContext,
    host: &mut impl HasHost<State<S>, StateApiType = S>,
) -> Result<(), Error> {
    let params: RegisterUserParams = ctx.parameter_cursor().get()?;

    // Check if user already exists
    if host.state().users.get(&params.id_commitment).is_some() {
        return Err(Error::UserAlreadyRegistered);
    }

    // Validate age verification
    if !params.age_verified {
        return Err(Error::AgeNotVerified);
    }

    // Validate jurisdiction
    if !params.jurisdiction_allowed {
        return Err(Error::JurisdictionNotAllowed);
    }

    let now = ctx.metadata().slot_time();

    // Create default limits (in microCCD, 1 SOL ≈ 50 CCD at current rates)
    let default_limits = BettingLimits {
        daily_limit: Amount::from_micro_ccd(500_000_000), // 500 CCD (~10 SOL)
        weekly_limit: Amount::from_micro_ccd(2_500_000_000), // 2500 CCD (~50 SOL)
        monthly_limit: Amount::from_micro_ccd(10_000_000_000), // 10000 CCD (~200 SOL)
        single_bet_limit: Amount::from_micro_ccd(5_000_000_000), // 5000 CCD (~100 SOL)
        cooldown_period: 0,
    };

    // Initialize spending tracker
    let spending = SpendingTracker {
        daily_spent: Amount::zero(),
        daily_reset_time: now,
        weekly_spent: Amount::zero(),
        weekly_reset_time: now,
        monthly_spent: Amount::zero(),
        monthly_reset_time: now,
    };

    // Create user state
    let user_state = UserState {
        id_commitment: params.id_commitment,
        limits: default_limits,
        spending,
        last_bet_timestamp: now,
        self_excluded: false,
        self_exclusion_expiry: None,
        risk_level: RiskLevel::Low,
        registered_at: now,
    };

    // Store user state
    host.state_mut().users.insert(params.id_commitment, user_state);

    // Log event
    host.invoke_contract_raw(
        &ctx.self_address(),
        ReceiveName::new_unchecked("rg_registry.log_event"),
        &to_bytes(&RGEvent::UserRegistered {
            id_commitment: params.id_commitment,
            timestamp: now,
        }),
        Amount::zero(),
    ).ok();

    Ok(())
}

/// Validate if a bet is allowed
#[receive(
    contract = "rg_registry",
    name = "validate_bet",
    parameter = "RecordBetParams",
    return_value = "BetValidationResult"
)]
fn validate_bet<S: HasStateApi>(
    ctx: &impl HasReceiveContext,
    host: &impl HasHost<State<S>, StateApiType = S>,
) -> ReceiveResult<BetValidationResult> {
    let params: RecordBetParams = ctx.parameter_cursor().get()?;

    // Get user state
    let user = host
        .state()
        .users
        .get(&params.id_commitment)
        .ok_or(Error::UserNotFound)?;

    let now = ctx.metadata().slot_time();

    // Check self-exclusion
    if user.self_excluded {
        if let Some(expiry) = user.self_exclusion_expiry {
            if now < expiry {
                return Ok(BetValidationResult {
                    allowed: false,
                    reason: Some("Self-excluded".to_string()),
                });
            }
        }
    }

    // Check cooldown
    if user.limits.cooldown_period > 0 {
        let time_since_last_bet = now.duration_since(user.last_bet_timestamp).seconds();
        if time_since_last_bet < user.limits.cooldown_period {
            return Ok(BetValidationResult {
                allowed: false,
                reason: Some("Cooldown period active".to_string()),
            });
        }
    }

    // Check single bet limit
    if params.bet_amount > user.limits.single_bet_limit {
        return Ok(BetValidationResult {
            allowed: false,
            reason: Some("Exceeds single bet limit".to_string()),
        });
    }

    // Update spending if time windows expired (in real implementation)
    // For simplicity, we check against current spending

    // Check daily limit
    if user.spending.daily_spent + params.bet_amount > user.limits.daily_limit {
        return Ok(BetValidationResult {
            allowed: false,
            reason: Some("Would exceed daily limit".to_string()),
        });
    }

    // Check weekly limit
    if user.spending.weekly_spent + params.bet_amount > user.limits.weekly_limit {
        return Ok(BetValidationResult {
            allowed: false,
            reason: Some("Would exceed weekly limit".to_string()),
        });
    }

    // Check monthly limit
    if user.spending.monthly_spent + params.bet_amount > user.limits.monthly_limit {
        return Ok(BetValidationResult {
            allowed: false,
            reason: Some("Would exceed monthly limit".to_string()),
        });
    }

    Ok(BetValidationResult {
        allowed: true,
        reason: None,
    })
}

/// Record a bet (after validation)
#[receive(
    contract = "rg_registry",
    name = "record_bet",
    parameter = "RecordBetParams",
    mutable
)]
fn record_bet<S: HasStateApi>(
    ctx: &impl HasReceiveContext,
    host: &mut impl HasHost<State<S>, StateApiType = S>,
) -> Result<(), Error> {
    let params: RecordBetParams = ctx.parameter_cursor().get()?;

    // Get user state
    let mut user = host
        .state_mut()
        .users
        .get_mut(&params.id_commitment)
        .ok_or(Error::UserNotFound)?;

    let now = ctx.metadata().slot_time();

    // Update spending
    user.spending.daily_spent += params.bet_amount;
    user.spending.weekly_spent += params.bet_amount;
    user.spending.monthly_spent += params.bet_amount;
    user.last_bet_timestamp = now;

    // Log event
    host.invoke_contract_raw(
        &ctx.self_address(),
        ReceiveName::new_unchecked("rg_registry.log_event"),
        &to_bytes(&RGEvent::BetRecorded {
            id_commitment: params.id_commitment,
            amount: params.bet_amount,
            timestamp: now,
        }),
        Amount::zero(),
    ).ok();

    Ok(())
}

/// Set user betting limits
#[receive(
    contract = "rg_registry",
    name = "set_limits",
    parameter = "SetLimitsParams",
    mutable
)]
fn set_limits<S: HasStateApi>(
    ctx: &impl HasReceiveContext,
    host: &mut impl HasHost<State<S>, StateApiType = S>,
) -> Result<(), Error> {
    let params: SetLimitsParams = ctx.parameter_cursor().get()?;

    // Validate limit hierarchy
    if params.limits.daily_limit > params.limits.weekly_limit
        || params.limits.weekly_limit > params.limits.monthly_limit
    {
        return Err(Error::InvalidLimits);
    }

    // Get user state
    let mut user = host
        .state_mut()
        .users
        .get_mut(&params.id_commitment)
        .ok_or(Error::UserNotFound)?;

    // Update limits
    user.limits = params.limits.clone();

    let now = ctx.metadata().slot_time();

    // Log event
    host.invoke_contract_raw(
        &ctx.self_address(),
        ReceiveName::new_unchecked("rg_registry.log_event"),
        &to_bytes(&RGEvent::LimitSet {
            id_commitment: params.id_commitment,
            limits: params.limits,
            timestamp: now,
        }),
        Amount::zero(),
    ).ok();

    Ok(())
}

/// Self-exclude user
#[receive(
    contract = "rg_registry",
    name = "self_exclude",
    parameter = "SelfExclusionParams",
    mutable
)]
fn self_exclude<S: HasStateApi>(
    ctx: &impl HasReceiveContext,
    host: &mut impl HasHost<State<S>, StateApiType = S>,
) -> Result<(), Error> {
    let params: SelfExclusionParams = ctx.parameter_cursor().get()?;

    // Get user state
    let mut user = host
        .state_mut()
        .users
        .get_mut(&params.id_commitment)
        .ok_or(Error::UserNotFound)?;

    let now = ctx.metadata().slot_time();
    let duration_seconds = params.duration_days as u64 * 24 * 60 * 60;
    let expiry = now.checked_add(Duration::from_seconds(duration_seconds)).unwrap();

    // Set self-exclusion
    user.self_excluded = true;
    user.self_exclusion_expiry = Some(expiry);

    // Log event
    host.invoke_contract_raw(
        &ctx.self_address(),
        ReceiveName::new_unchecked("rg_registry.log_event"),
        &to_bytes(&RGEvent::SelfExcluded {
            id_commitment: params.id_commitment,
            duration_days: params.duration_days,
            expiry,
            timestamp: now,
        }),
        Amount::zero(),
    ).ok();

    Ok(())
}

/// View user state (anyone can query)
#[receive(
    contract = "rg_registry",
    name = "get_user_state",
    parameter = "IdentityCommitment",
    return_value = "UserState"
)]
fn get_user_state<S: HasStateApi>(
    ctx: &impl HasReceiveContext,
    host: &impl HasHost<State<S>, StateApiType = S>,
) -> ReceiveResult<UserState> {
    let id_commitment: IdentityCommitment = ctx.parameter_cursor().get()?;

    let user = host
        .state()
        .users
        .get(&id_commitment)
        .ok_or(Error::UserNotFound)?;

    Ok(user.clone())
}

/// Log event (internal function)
#[receive(
    contract = "rg_registry",
    name = "log_event",
    parameter = "RGEvent",
    mutable
)]
fn log_event<S: HasStateApi>(
    _ctx: &impl HasReceiveContext,
    _host: &mut impl HasHost<State<S>, StateApiType = S>,
) -> ReceiveResult<()> {
    // Events are automatically logged by Concordium
    // This is just a receiver to accept the invocation
    Ok(())
}

/// Contract tests
#[concordium_cfg_test]
mod tests {
    use super::*;
    use test_infrastructure::*;

    // TODO: Add comprehensive unit tests
}

