// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/ReentrancyGuard.sol';

/**
 * @title Vault
 * @dev Holds platform fees and manages withdrawals
 * @notice All fees from prediction markets are sent here
 */
contract Vault is Ownable, ReentrancyGuard {
    // ============ Events ============

    event FeeReceived(address indexed from, uint256 amount, string source);
    event Withdrawal(address indexed to, uint256 amount);
    event EmergencyWithdrawal(address indexed to, uint256 amount);

    // ============ State Variables ============

    uint256 public totalFeesCollected;
    uint256 public totalWithdrawn;

    mapping(address => bool) public authorizedContracts;

    // ============ Constructor ============

    constructor() Ownable(msg.sender) {
        totalFeesCollected = 0;
        totalWithdrawn = 0;
    }

    // ============ Receive Function ============

    /**
     * @notice Receive BNB from prediction market contracts
     */
    receive() external payable {
        totalFeesCollected += msg.value;
        emit FeeReceived(msg.sender, msg.value, 'fee');
    }

    /**
     * @notice Fallback function
     */
    fallback() external payable {
        totalFeesCollected += msg.value;
        emit FeeReceived(msg.sender, msg.value, 'fallback');
    }

    // ============ Core Functions ============

    /**
     * @notice Withdraw specific amount from vault
     * @param amount Amount to withdraw in wei
     */
    function withdraw(uint256 amount) external onlyOwner nonReentrant {
        require(amount > 0, 'Amount must be greater than 0');
        require(amount <= address(this).balance, 'Insufficient balance');

        totalWithdrawn += amount;

        (bool success, ) = payable(owner()).call{ value: amount }('');
        require(success, 'Withdrawal failed');

        emit Withdrawal(owner(), amount);
    }

    /**
     * @notice Withdraw all funds from vault
     */
    function withdrawAll() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, 'No balance to withdraw');

        totalWithdrawn += balance;

        (bool success, ) = payable(owner()).call{ value: balance }('');
        require(success, 'Withdrawal failed');

        emit Withdrawal(owner(), balance);
    }

    /**
     * @notice Emergency withdrawal (bypasses all checks)
     */
    function emergencyWithdraw() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, 'No balance');

        (bool success, ) = payable(owner()).call{ value: balance }('');
        require(success, 'Emergency withdrawal failed');

        emit EmergencyWithdrawal(owner(), balance);
    }

    /**
     * @notice Authorize a contract to send fees
     * @param contractAddress Address of the contract
     */
    function authorizeContract(address contractAddress) external onlyOwner {
        require(contractAddress != address(0), 'Invalid address');
        authorizedContracts[contractAddress] = true;
    }

    /**
     * @notice Revoke contract authorization
     * @param contractAddress Address of the contract
     */
    function revokeContract(address contractAddress) external onlyOwner {
        authorizedContracts[contractAddress] = false;
    }

    // ============ View Functions ============

    /**
     * @notice Get current vault balance
     * @return Current balance in wei
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @notice Get total fees ever collected
     * @return Total fees collected in wei
     */
    function getTotalFeesCollected() external view returns (uint256) {
        return totalFeesCollected;
    }

    /**
     * @notice Get total amount withdrawn
     * @return Total withdrawn in wei
     */
    function getTotalWithdrawn() external view returns (uint256) {
        return totalWithdrawn;
    }

    /**
     * @notice Get available balance (not withdrawn yet)
     * @return Available balance in wei
     */
    function getAvailableBalance() external view returns (uint256) {
        return totalFeesCollected - totalWithdrawn;
    }

    /**
     * @notice Check if contract is authorized
     * @param contractAddress Address to check
     * @return true if authorized
     */
    function isAuthorized(
        address contractAddress
    ) external view returns (bool) {
        return authorizedContracts[contractAddress];
    }
}
