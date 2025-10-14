import { ethers } from 'ethers';

/**
 * Commit-Reveal darkpool betting utilities
 * Handles secret generation, storage, and verification
 */

export interface CommitData {
  commitHash: string;
  salt: string;
  outcome: 'yes' | 'no';
  amount: string;
  timestamp: number;
}

/**
 * Generate a commit hash for darkpool betting
 */
export function generateCommit(
  outcome: 'yes' | 'no',
  userAddress: string
): { commitHash: string; salt: string } {
  // Generate random 32-byte salt
  const salt = ethers.hexlify(ethers.randomBytes(32));

  // Create commit hash: keccak256(abi.encodePacked(outcome, salt, userAddress))
  // Must match contract: keccak256(abi.encodePacked(bool, bytes32, address))
  const commitHash = ethers.solidityPackedKeccak256(
    ['bool', 'bytes32', 'address'],
    [outcome === 'yes', salt, userAddress]
  );

  return { commitHash, salt };
}

/**
 * Verify a commit matches the reveal
 */
export function verifyCommit(
  commitHash: string,
  outcome: 'yes' | 'no',
  salt: string,
  userAddress: string
): boolean {
  const computedHash = ethers.solidityPackedKeccak256(
    ['bool', 'bytes32', 'address'],
    [outcome === 'yes', salt, userAddress]
  );

  return computedHash.toLowerCase() === commitHash.toLowerCase();
}

/**
 * Store commit secret in localStorage (encrypted in production)
 */
export function storeCommitSecret(
  marketId: string,
  commitData: CommitData
): void {
  try {
    const key = `darkbet_commit_${marketId}`;
    const data = JSON.stringify(commitData);

    // In production, encrypt this data before storing
    // For now, store as-is with warning
    localStorage.setItem(key, data);

    // Also store in a master list for tracking all unrevealed bets
    addToUnrevealedList(marketId);
  } catch (error) {
    console.error('Failed to store commit secret:', error);
    throw new Error('Failed to store bet information. Please try again.');
  }
}

/**
 * Get commit secret from localStorage
 */
export function getCommitSecret(marketId: string): CommitData | null {
  try {
    const key = `darkbet_commit_${marketId}`;
    const data = localStorage.getItem(key);

    if (!data) return null;

    return JSON.parse(data) as CommitData;
  } catch (error) {
    console.error('Failed to retrieve commit secret:', error);
    return null;
  }
}

/**
 * Clear commit secret after reveal
 */
export function clearCommitSecret(marketId: string): void {
  try {
    const key = `darkbet_commit_${marketId}`;
    localStorage.removeItem(key);

    // Remove from unrevealed list
    removeFromUnrevealedList(marketId);
  } catch (error) {
    console.error('Failed to clear commit secret:', error);
  }
}

/**
 * Get all unrevealed commitments
 */
export function getAllUnrevealedCommits(): string[] {
  try {
    const list = localStorage.getItem('darkbet_unrevealed_list');
    if (!list) return [];
    return JSON.parse(list) as string[];
  } catch (error) {
    console.error('Failed to get unrevealed list:', error);
    return [];
  }
}

/**
 * Add market to unrevealed list
 */
function addToUnrevealedList(marketId: string): void {
  try {
    const list = getAllUnrevealedCommits();
    if (!list.includes(marketId)) {
      list.push(marketId);
      localStorage.setItem('darkbet_unrevealed_list', JSON.stringify(list));
    }
  } catch (error) {
    console.error('Failed to add to unrevealed list:', error);
  }
}

/**
 * Remove market from unrevealed list
 */
function removeFromUnrevealedList(marketId: string): void {
  try {
    const list = getAllUnrevealedCommits();
    const filtered = list.filter(id => id !== marketId);
    localStorage.setItem('darkbet_unrevealed_list', JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to remove from unrevealed list:', error);
  }
}

/**
 * Check if user has unrevealed commitment for market
 */
export function hasUnrevealedCommit(marketId: string): boolean {
  return getCommitSecret(marketId) !== null;
}

/**
 * Get time remaining to reveal (market expiration + 1 hour)
 */
export function getRevealDeadline(marketExpiration: number): number {
  const REVEAL_WINDOW = 3600000; // 1 hour in milliseconds
  return marketExpiration + REVEAL_WINDOW;
}

/**
 * Check if reveal window is still open
 */
export function canReveal(marketExpiration: number): boolean {
  const now = Date.now();
  const deadline = getRevealDeadline(marketExpiration);
  return now <= deadline;
}

/**
 * Get all commitments that need revealing (markets expired but reveal window still open)
 */
export function getCommitsNeedingReveal(): Array<{
  marketId: string;
  commitData: CommitData;
  deadline: number;
}> {
  const unrevealed = getAllUnrevealedCommits();
  const needsReveal: Array<{
    marketId: string;
    commitData: CommitData;
    deadline: number;
  }> = [];

  for (const marketId of unrevealed) {
    const commitData = getCommitSecret(marketId);
    if (commitData) {
      // Note: We'd need to fetch market expiration from API/contract here
      // For now, just include all unrevealed commits
      needsReveal.push({
        marketId,
        commitData,
        deadline: 0, // Would calculate from market expiration
      });
    }
  }

  return needsReveal;
}

/**
 * Clean up expired commits (past reveal deadline)
 */
export function cleanupExpiredCommits(
  markets: Array<{ id: string; expiresAt: number }>
): void {
  const now = Date.now();
  const unrevealed = getAllUnrevealedCommits();

  for (const marketId of unrevealed) {
    const market = markets.find(m => m.id === marketId);
    if (market) {
      const deadline = getRevealDeadline(market.expiresAt);
      if (now > deadline) {
        // Reveal window expired, can claim refund
        // For now, just clear the local storage
        clearCommitSecret(marketId);
      }
    }
  }
}

/**
 * Export commit data for backup
 */
export function exportCommitData(): string {
  try {
    const unrevealed = getAllUnrevealedCommits();
    const commits: { [marketId: string]: CommitData } = {};

    for (const marketId of unrevealed) {
      const commitData = getCommitSecret(marketId);
      if (commitData) {
        commits[marketId] = commitData;
      }
    }

    return JSON.stringify(commits, null, 2);
  } catch (error) {
    console.error('Failed to export commit data:', error);
    return '{}';
  }
}

/**
 * Import commit data from backup
 */
export function importCommitData(jsonData: string): {
  success: boolean;
  imported: number;
} {
  try {
    const commits = JSON.parse(jsonData);
    let imported = 0;

    for (const [marketId, commitData] of Object.entries(commits)) {
      storeCommitSecret(marketId, commitData as CommitData);
      imported++;
    }

    return { success: true, imported };
  } catch (error) {
    console.error('Failed to import commit data:', error);
    return { success: false, imported: 0 };
  }
}

/**
 * Generate reveal instructions for user
 */
export function getRevealInstructions(marketId: string): string | null {
  const commitData = getCommitSecret(marketId);
  if (!commitData) return null;

  return `
To reveal your bet on Market #${marketId}:

1. Your secret outcome: ${commitData.outcome.toUpperCase()}
2. Your bet amount: ${ethers.formatEther(commitData.amount)} BNB
3. Do NOT share your reveal information with anyone
4. Make sure to reveal before the market's reveal deadline

Your reveal will be verified against your commit hash on the blockchain.
  `.trim();
}

/**
 * Security warning for users
 */
export const SECURITY_WARNING = `
⚠️ IMPORTANT SECURITY NOTES:

1. Your bet secret is stored locally in your browser
2. If you clear browser data, you will LOSE your reveal ability
3. Backup your commit data using the export function
4. Never share your reveal information before revealing on-chain
5. You have 1 hour after market expiration to reveal your bet

Store your reveal data safely!
`.trim();
