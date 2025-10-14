// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title PredictionMarket
 * @dev Darkpool prediction market with commit-reveal betting and FPMM pricing
 * @notice Users commit bets privately, then reveal them. No positions visible until reveal.
 */
contract PredictionMarket is Ownable, ReentrancyGuard, Pausable {
    
    // ============ Constants ============
    
    uint256 public constant PLATFORM_FEE_PERCENT = 10; // 10% fee
    uint256 public constant MIN_BET_AMOUNT = 0.001 ether;
    uint256 public constant MAX_BET_AMOUNT = 100 ether;
    uint256 public constant COMMIT_REVEAL_TIMEOUT = 1 hours; // Reveal deadline after market expires
    uint256 public constant PRICE_PRECISION = 1e18; // For FPMM calculations
    
    // ============ State Variables ============
    
    uint256 public marketIdCounter;
    address public vaultAddress;
    address public resolverAddress;
    
    // ============ Structs ============
    
    struct Market {
        uint256 id;
        string title;
        string description;
        address creator;
        uint256 createdAt;
        uint256 expiresAt;
        uint8 category;
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
        Active,        // Market is active, accepting commits
        Resolving,     // Market expired, revealing bets
        Resolved,      // Market resolved, claims available
        Cancelled      // Market cancelled, refunds available
    }
    
    struct Commitment {
        bytes32 commitHash;
        uint256 amount;
        uint256 timestamp;
        bool revealed;
    }
    
    struct Bet {
        uint256 marketId;
        address user;
        bool outcome; // true = YES, false = NO
        uint256 shares;
        uint256 amount;
        uint256 revealedAt;
        bool claimed;
    }
    
    // ============ Mappings ============
    
    mapping(uint256 => Market) public markets;
    mapping(uint256 => mapping(address => Commitment)) public commitments;
    mapping(uint256 => mapping(address => Bet)) public bets;
    mapping(uint256 => address[]) public marketParticipants;
    mapping(uint256 => uint256) public pendingReveals; // Track unrevealed commitments per market
    
    // ============ Events ============
    
    event MarketCreated(
        uint256 indexed marketId,
        address indexed creator,
        string title,
        uint256 expiresAt,
        uint8 category
    );
    
    event BetCommitted(
        uint256 indexed marketId,
        address indexed user,
        bytes32 commitHash,
        uint256 amount
    );
    
    event BetRevealed(
        uint256 indexed marketId,
        address indexed user,
        bool outcome,
        uint256 amount,
        uint256 shares
    );
    
    event MarketResolved(
        uint256 indexed marketId,
        bool outcome,
        string reasoning
    );
    
    event WinningsClaimed(
        uint256 indexed marketId,
        address indexed user,
        uint256 amount
    );
    
    event MarketCancelled(
        uint256 indexed marketId
    );
    
    // ============ Modifiers ============
    
    modifier onlyResolver() {
        require(msg.sender == resolverAddress, "Only resolver");
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
    
    constructor(address _vaultAddress, address _resolverAddress) Ownable(msg.sender) {
        vaultAddress = _vaultAddress;
        resolverAddress = _resolverAddress;
        marketIdCounter = 0;
    }
    
    // ============ Core Functions ============
    
    /**
     * @notice Create a new prediction market
     * @param title Market title
     * @param description Market description
     * @param expiresAt Unix timestamp when market closes
     * @param category Market category (0-7)
     * @return marketId The ID of created market
     */
    function createMarket(
        string memory title,
        string memory description,
        uint256 expiresAt,
        uint8 category
    ) external whenNotPaused returns (uint256) {
        require(expiresAt > block.timestamp + 15 minutes, "Must expire at least 15 minutes from now");
        require(expiresAt < block.timestamp + 365 days, "Cannot expire more than 1 year from now");
        require(bytes(title).length > 0 && bytes(title).length <= 200, "Invalid title length");
        require(category <= 7, "Invalid category");
        
        marketIdCounter++;
        uint256 marketId = marketIdCounter;
        
        Market storage market = markets[marketId];
        market.id = marketId;
        market.title = title;
        market.description = description;
        market.creator = msg.sender;
        market.createdAt = block.timestamp;
        market.expiresAt = expiresAt;
        market.category = category;
        market.status = MarketStatus.Active;
        
        emit MarketCreated(marketId, msg.sender, title, expiresAt, category);
        
        return marketId;
    }
    
    /**
     * @notice Commit to a bet (darkpool - bet is hidden)
     * @param marketId Market ID
     * @param commitHash keccak256(abi.encodePacked(outcome, salt, msg.sender))
     */
    function commitBet(uint256 marketId, bytes32 commitHash)
        external
        payable
        whenNotPaused
        nonReentrant
        marketExists(marketId)
        marketActive(marketId)
    {
        require(msg.value >= MIN_BET_AMOUNT, "Bet too low");
        require(msg.value <= MAX_BET_AMOUNT, "Bet too high");
        require(commitments[marketId][msg.sender].commitHash == bytes32(0), "Already committed");
        
        commitments[marketId][msg.sender] = Commitment({
            commitHash: commitHash,
            amount: msg.value,
            timestamp: block.timestamp,
            revealed: false
        });
        
        // Track pending reveals
        pendingReveals[marketId]++;
        
        emit BetCommitted(marketId, msg.sender, commitHash, msg.value);
    }
    
    /**
     * @notice Reveal committed bet
     * @param marketId Market ID
     * @param outcome true for YES, false for NO
     * @param salt Random salt used in commit
     */
    function revealBet(uint256 marketId, bool outcome, bytes32 salt)
        external
        nonReentrant
        marketExists(marketId)
    {
        Market storage market = markets[marketId];
        require(
            market.status == MarketStatus.Active || market.status == MarketStatus.Resolving,
            "Cannot reveal in this state"
        );
        
        Commitment storage commitment = commitments[marketId][msg.sender];
        require(commitment.commitHash != bytes32(0), "No commitment found");
        require(!commitment.revealed, "Already revealed");
        
        // Verify commit hash
        bytes32 computedHash = keccak256(abi.encodePacked(outcome, salt, msg.sender));
        require(computedHash == commitment.commitHash, "Invalid reveal");
        
        uint256 amount = commitment.amount;
        uint256 shares;
        
        // Calculate shares using FPMM
        if (market.yesShares == 0 && market.noShares == 0) {
            // First bet: initialize pools
            shares = (amount * PRICE_PRECISION) / 0.01 ether; // 1 share per 0.01 BNB
        } else {
            // FPMM pricing: shares = amount / price
            // Price = outcomePool / totalShares
            uint256 totalShares = market.yesShares + market.noShares;
            uint256 outcomePool = outcome ? market.yesPool : market.noPool;
            uint256 price = (outcomePool * PRICE_PRECISION) / totalShares;
            shares = (amount * PRICE_PRECISION) / price;
        }
        
        // Update market state
        market.totalPool += amount;
        if (outcome) {
            market.yesPool += amount;
            market.yesShares += shares;
        } else {
            market.noPool += amount;
            market.noShares += shares;
        }
        
        // Store bet
        bets[marketId][msg.sender] = Bet({
            marketId: marketId,
            user: msg.sender,
            outcome: outcome,
            shares: shares,
            amount: amount,
            revealedAt: block.timestamp,
            claimed: false
        });
        
        // Mark as revealed
        commitment.revealed = true;
        pendingReveals[marketId]--;
        
        // Track participants
        if (bets[marketId][msg.sender].amount == 0) {
            marketParticipants[marketId].push(msg.sender);
            market.participants++;
        }
        
        emit BetRevealed(marketId, msg.sender, outcome, amount, shares);
    }
    
    /**
     * @notice Resolve a market (only callable by resolver)
     * @param marketId Market ID
     * @param outcome true for YES wins, false for NO wins
     * @param reasoning AI resolution reasoning
     */
    function resolveMarket(
        uint256 marketId,
        bool outcome,
        string memory reasoning
    ) external onlyResolver marketExists(marketId) {
        Market storage market = markets[marketId];
        require(
            market.status == MarketStatus.Active || market.status == MarketStatus.Resolving,
            "Market not in correct state"
        );
        require(block.timestamp >= market.expiresAt, "Market not expired yet");
        
        market.status = MarketStatus.Resolved;
        market.outcome = outcome;
        market.resolutionReasoning = reasoning;
        
        emit MarketResolved(marketId, outcome, reasoning);
    }
    
    /**
     * @notice Claim winnings from resolved market
     * @param marketId Market ID
     */
    function claimWinnings(uint256 marketId)
        external
        nonReentrant
        marketExists(marketId)
    {
        Market storage market = markets[marketId];
        require(market.status == MarketStatus.Resolved, "Market not resolved");
        
        Bet storage bet = bets[marketId][msg.sender];
        require(bet.amount > 0, "No bet found");
        require(!bet.claimed, "Already claimed");
        require(bet.outcome == market.outcome, "Bet did not win");
        
        // Calculate payout: (user shares / total winning shares) * total pool * 0.9
        uint256 totalWinningShares = market.outcome ? market.yesShares : market.noShares;
        require(totalWinningShares > 0, "No winning shares");
        
        uint256 grossPayout = (bet.shares * market.totalPool) / totalWinningShares;
        uint256 fee = (grossPayout * PLATFORM_FEE_PERCENT) / 100;
        uint256 netPayout = grossPayout - fee;
        
        bet.claimed = true;
        
        // Transfer winnings
        (bool success, ) = payable(msg.sender).call{value: netPayout}("");
        require(success, "Transfer failed");
        
        // Transfer fee to vault
        (bool feeSuccess, ) = payable(vaultAddress).call{value: fee}("");
        require(feeSuccess, "Fee transfer failed");
        
        emit WinningsClaimed(marketId, msg.sender, netPayout);
    }
    
    /**
     * @notice Cancel market (only if no revealed bets)
     * @param marketId Market ID
     */
    function cancelMarket(uint256 marketId)
        external
        marketExists(marketId)
    {
        Market storage market = markets[marketId];
        require(msg.sender == market.creator || msg.sender == owner(), "Only creator or owner");
        require(market.status == MarketStatus.Active, "Market not active");
        require(market.totalPool == 0, "Cannot cancel with revealed bets");
        
        market.status = MarketStatus.Cancelled;
        
        emit MarketCancelled(marketId);
    }
    
    /**
     * @notice Refund unrevealed commitment if market is cancelled or expired
     * @param marketId Market ID
     */
    function claimRefund(uint256 marketId)
        external
        nonReentrant
        marketExists(marketId)
    {
        Market storage market = markets[marketId];
        require(
            market.status == MarketStatus.Cancelled ||
            (market.status == MarketStatus.Resolving && block.timestamp > market.expiresAt + COMMIT_REVEAL_TIMEOUT),
            "Refunds not available"
        );
        
        Commitment storage commitment = commitments[marketId][msg.sender];
        require(commitment.commitHash != bytes32(0), "No commitment found");
        require(!commitment.revealed, "Already revealed");
        
        uint256 refundAmount = commitment.amount;
        commitment.revealed = true; // Mark as processed
        
        (bool success, ) = payable(msg.sender).call{value: refundAmount}("");
        require(success, "Refund failed");
    }
    
    // ============ View Functions ============
    
    function getMarket(uint256 marketId) external view returns (Market memory) {
        return markets[marketId];
    }
    
    function getCommitment(uint256 marketId, address user) external view returns (Commitment memory) {
        return commitments[marketId][user];
    }
    
    function getBet(uint256 marketId, address user) external view returns (Bet memory) {
        return bets[marketId][user];
    }
    
    function getMarketCount() external view returns (uint256) {
        return marketIdCounter;
    }
    
    function calculatePayout(uint256 marketId, address user) external view returns (uint256) {
        Market storage market = markets[marketId];
        Bet storage bet = bets[marketId][user];
        
        if (market.status != MarketStatus.Resolved || bet.outcome != market.outcome) {
            return 0;
        }
        
        uint256 totalWinningShares = market.outcome ? market.yesShares : market.noShares;
        if (totalWinningShares == 0) return 0;
        
        uint256 grossPayout = (bet.shares * market.totalPool) / totalWinningShares;
        uint256 fee = (grossPayout * PLATFORM_FEE_PERCENT) / 100;
        return grossPayout - fee;
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
    
    function emergencyWithdraw() external onlyOwner {
        (bool success, ) = payable(owner()).call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }
}

