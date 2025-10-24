# Darkbet Responsible Gambling Registry - Concordium Smart Contract

This smart contract implements a privacy-preserving Responsible Gambling (RG) registry on the Concordium blockchain.

## Features

- **User Registration**: Register users with anonymous identity commitments from Concordium Web3 ID
- **Betting Limits**: Enforce daily/weekly/monthly betting limits
- **Self-Exclusion**: Allow users to self-exclude from betting for specified durations
- **Cooldown Periods**: Configurable cooldown between bets
- **Audit Logging**: Anonymous event logs for regulatory compliance
- **Privacy-Preserving**: Uses identity commitments (Blake2b hashes) instead of real identities

## Building

Requires Rust and `cargo-concordium`:

```bash
# Install cargo-concordium
cargo install cargo-concordium

# Build the contract
cargo concordium build --out rg_registry.wasm.v1 --schema-embed
```

## Testing

```bash
cargo concordium test
```

## Deploying

### Testnet Deployment

```bash
# Deploy module
concordium-client module deploy rg_registry.wasm.v1 \
    --sender <YOUR_ACCOUNT> \
    --grpc-port 10001

# Initialize contract
concordium-client contract init <MODULE_HASH> \
    --contract rg_registry \
    --parameter-json init_params.json \
    --sender <YOUR_ACCOUNT> \
    --energy 10000 \
    --grpc-port 10001
```

Example `init_params.json`:
```json
{
  "owner": "<ACCOUNT_ADDRESS>",
  "minimum_age": 18
}
```

### Mainnet Deployment

Use `--grpc-port 10000` for mainnet.

## Contract Functions

### Initialize
- **Function**: `init`
- **Parameters**: `InitParams { owner, minimum_age }`
- **Description**: Initialize the contract with owner and minimum age

### Register User
- **Function**: `register_user`
- **Parameters**: `RegisterUserParams { id_commitment, age_verified, jurisdiction_allowed }`
- **Description**: Register a new user with identity commitment

### Validate Bet
- **Function**: `validate_bet`
- **Parameters**: `RecordBetParams { id_commitment, bet_amount }`
- **Returns**: `BetValidationResult { allowed, reason }`
- **Description**: Check if bet is allowed without recording it

### Record Bet
- **Function**: `record_bet`
- **Parameters**: `RecordBetParams { id_commitment, bet_amount }`
- **Description**: Record a bet and update spending limits

### Set Limits
- **Function**: `set_limits`
- **Parameters**: `SetLimitsParams { id_commitment, limits }`
- **Description**: Update user betting limits

### Self-Exclude
- **Function**: `self_exclude`
- **Parameters**: `SelfExclusionParams { id_commitment, duration_days }`
- **Description**: Self-exclude user for specified duration

### Get User State
- **Function**: `get_user_state`
- **Parameters**: `IdentityCommitment` (64-byte hash)
- **Returns**: `UserState`
- **Description**: Query user state (read-only)

## Integration with Darkbet

The contract integrates with Darkbet's Solana-based prediction market:

1. User completes Concordium Web3 ID verification
2. Frontend generates identity commitment: `Blake2b(privyUserId || solanaPublicKey)`
3. Backend calls `register_user` with commitment
4. Before each bet, frontend calls `validate_bet`
5. If allowed, user signs Solana transaction
6. Backend calls `record_bet` to update limits

## Privacy Architecture

- **Identity Commitment**: `Blake2b(privyUserId || solanaPublicKey)`
- **On-chain Data**: Only commitment hash, no PII
- **Web3 ID**: User identity stored with Concordium ID provider (off-chain)
- **Selective Disclosure**: Users only reveal age and jurisdiction

## License

MIT

