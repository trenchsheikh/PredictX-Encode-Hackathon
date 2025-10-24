/**
 * Concordium Service
 * Handles Web3 ID verification and Responsible Gambling smart contract interaction
 * Based on Concordium documentation: https://docs.concordium.com
 */

import { createHash } from 'crypto';
import type {
  ConcordiumWeb3IdProof,
  IdentityCommitment,
  RGStatus,
  RGLimits,
  BetValidationRequest,
  BetValidationResponse,
  DEFAULT_RG_LIMITS,
  MINIMUM_AGE,
  ALLOWED_JURISDICTIONS,
  RGEvent,
} from '@/types/concordium';

// Mock database for development - replace with actual database in production
interface RGDatabase {
  users: Map<string, RGStatus>;
  events: RGEvent[];
}

const rgDatabase: RGDatabase = {
  users: new Map(),
  events: [],
};

/**
 * Generate Blake2b hash for identity commitment
 * Format: Blake2b(privyUserId || solanaPublicKey)
 */
export function generateIdCommitment(privyUserId: string, solanaPublicKey: string): string {
  const data = `${privyUserId}||${solanaPublicKey}`;
  return createHash('blake2b512').update(data).digest('hex');
}

/**
 * Verify Concordium Web3 ID proof
 * This validates the cryptographic proof from Concordium ID provider
 */
export async function verifyWeb3IdProof(proof: ConcordiumWeb3IdProof): Promise<{
  valid: boolean;
  error?: string;
  attributes?: {
    age?: number;
    jurisdiction?: string;
    ageVerified: boolean;
    jurisdictionAllowed: boolean;
  };
}> {
  try {
    // TODO: Implement actual Concordium proof verification using @concordium/web-sdk
    // For now, this is a mock implementation
    
    // Extract attributes from credential
    const { attributes } = proof.credential.credentialSubject;
    
    // Validate age
    if (!attributes.age || attributes.age < MINIMUM_AGE) {
      return {
        valid: false,
        error: `User must be at least ${MINIMUM_AGE} years old`,
      };
    }
    
    // Validate jurisdiction
    if (!attributes.jurisdiction || !ALLOWED_JURISDICTIONS.includes(attributes.jurisdiction as never)) {
      return {
        valid: false,
        error: `Betting is not allowed in jurisdiction: ${attributes.jurisdiction}`,
      };
    }
    
    // Verify proof signature (mock - implement actual verification)
    if (!proof.signature) {
      return {
        valid: false,
        error: 'Invalid proof signature',
      };
    }
    
    return {
      valid: true,
      attributes: {
        age: attributes.age,
        jurisdiction: attributes.jurisdiction,
        ageVerified: true,
        jurisdictionAllowed: true,
      },
    };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Unknown error during verification',
    };
  }
}

/**
 * Register user in RG registry (Concordium smart contract)
 */
export async function registerUser(
  idCommitment: string,
  attributes: {
    ageVerified: boolean;
    jurisdictionAllowed: boolean;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if user already registered
    if (rgDatabase.users.has(idCommitment)) {
      return {
        success: false,
        error: 'User already registered',
      };
    }
    
    // Create RG status with default limits
    const defaultLimits: RGLimits = {
      dailyLimit: 10,
      weeklyLimit: 50,
      monthlyLimit: 200,
      singleBetLimit: 100,
      cooldownPeriod: 0,
    };
    
    const rgStatus: RGStatus = {
      idCommitment,
      limits: defaultLimits,
      currentSpending: {
        daily: 0,
        weekly: 0,
        monthly: 0,
      },
      lastBetTimestamp: 0,
      selfExcluded: false,
      riskLevel: 'low',
      kycStatus: 'verified',
    };
    
    // Store in database
    rgDatabase.users.set(idCommitment, rgStatus);
    
    // Record event
    const event: RGEvent = {
      type: 'USER_REGISTERED',
      idCommitment,
      timestamp: Date.now(),
      data: { attributes },
    };
    rgDatabase.events.push(event);
    
    // TODO: Interact with actual Concordium smart contract
    // const contractClient = await getConcordiumContractClient();
    // await contractClient.registerUser(idCommitment, attributes);
    
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to register user',
    };
  }
}

/**
 * Get user RG status from Concordium smart contract
 */
export async function getUserRGStatus(idCommitment: string): Promise<RGStatus | null> {
  try {
    // Get from database (replace with actual smart contract query)
    const status = rgDatabase.users.get(idCommitment);
    
    if (!status) {
      return null;
    }
    
    // Update current spending based on time windows
    const now = Date.now();
    const dayInMs = 24 * 60 * 60 * 1000;
    const weekInMs = 7 * dayInMs;
    const monthInMs = 30 * dayInMs;
    
    // Reset spending if time windows have passed
    // TODO: Implement proper time-windowed spending tracking
    
    return status;
  } catch (error) {
    console.error('Error fetching RG status:', error);
    return null;
  }
}

/**
 * Validate if bet is allowed based on RG limits
 */
export async function validateBet(request: BetValidationRequest): Promise<BetValidationResponse> {
  try {
    const { idCommitment, betAmount } = request;
    
    // Get user RG status
    const status = await getUserRGStatus(idCommitment);
    
    if (!status) {
      return {
        allowed: false,
        reason: 'User not registered in RG system. Please complete identity verification.',
      };
    }
    
    // Check self-exclusion
    if (status.selfExcluded) {
      if (status.selfExclusionExpiry && Date.now() < status.selfExclusionExpiry) {
        const daysRemaining = Math.ceil((status.selfExclusionExpiry - Date.now()) / (24 * 60 * 60 * 1000));
        return {
          allowed: false,
          reason: `Self-excluded for ${daysRemaining} more days`,
        };
      } else {
        // Self-exclusion expired, remove it
        status.selfExcluded = false;
        status.selfExclusionExpiry = undefined;
      }
    }
    
    // Check cooldown period
    if (status.limits.cooldownPeriod > 0) {
      const timeSinceLastBet = Date.now() - status.lastBetTimestamp;
      const cooldownMs = status.limits.cooldownPeriod * 1000;
      
      if (timeSinceLastBet < cooldownMs) {
        const secondsRemaining = Math.ceil((cooldownMs - timeSinceLastBet) / 1000);
        return {
          allowed: false,
          reason: `Cooldown period active`,
          cooldownRemaining: secondsRemaining,
        };
      }
    }
    
    // Check single bet limit
    if (betAmount > status.limits.singleBetLimit) {
      return {
        allowed: false,
        reason: `Bet amount (${betAmount} SOL) exceeds single bet limit (${status.limits.singleBetLimit} SOL)`,
      };
    }
    
    // Check daily limit
    const dailyRemaining = status.limits.dailyLimit - status.currentSpending.daily;
    if (betAmount > dailyRemaining) {
      return {
        allowed: false,
        reason: `Bet would exceed daily limit`,
        remainingDaily: dailyRemaining,
      };
    }
    
    // Check weekly limit
    const weeklyRemaining = status.limits.weeklyLimit - status.currentSpending.weekly;
    if (betAmount > weeklyRemaining) {
      return {
        allowed: false,
        reason: `Bet would exceed weekly limit`,
        remainingWeekly: weeklyRemaining,
      };
    }
    
    // Check monthly limit
    const monthlyRemaining = status.limits.monthlyLimit - status.currentSpending.monthly;
    if (betAmount > monthlyRemaining) {
      return {
        allowed: false,
        reason: `Bet would exceed monthly limit`,
      };
    }
    
    // All checks passed
    return {
      allowed: true,
      remainingDaily: dailyRemaining - betAmount,
      remainingWeekly: weeklyRemaining - betAmount,
    };
  } catch (error) {
    console.error('Error validating bet:', error);
    return {
      allowed: false,
      reason: 'Error validating bet. Please try again.',
    };
  }
}

/**
 * Record a bet in RG system
 */
export async function recordBet(idCommitment: string, betAmount: number): Promise<{ success: boolean; error?: string }> {
  try {
    const status = await getUserRGStatus(idCommitment);
    
    if (!status) {
      return {
        success: false,
        error: 'User not found',
      };
    }
    
    // Update spending
    status.currentSpending.daily += betAmount;
    status.currentSpending.weekly += betAmount;
    status.currentSpending.monthly += betAmount;
    status.lastBetTimestamp = Date.now();
    
    // Update in database
    rgDatabase.users.set(idCommitment, status);
    
    // Record event
    const event: RGEvent = {
      type: 'BET_RECORDED',
      idCommitment,
      timestamp: Date.now(),
      data: { betAmount },
    };
    rgDatabase.events.push(event);
    
    // TODO: Record on Concordium smart contract
    
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to record bet',
    };
  }
}

/**
 * Set user betting limits
 */
export async function setUserLimits(
  idCommitment: string,
  limits: Partial<RGLimits>
): Promise<{ success: boolean; error?: string }> {
  try {
    const status = await getUserRGStatus(idCommitment);
    
    if (!status) {
      return {
        success: false,
        error: 'User not found',
      };
    }
    
    // Update limits
    status.limits = {
      ...status.limits,
      ...limits,
    };
    
    // Update in database
    rgDatabase.users.set(idCommitment, status);
    
    // Record event
    const event: RGEvent = {
      type: 'LIMIT_SET',
      idCommitment,
      timestamp: Date.now(),
      data: { limits },
    };
    rgDatabase.events.push(event);
    
    // TODO: Update Concordium smart contract
    
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to set limits',
    };
  }
}

/**
 * Self-exclude user from betting
 */
export async function selfExcludeUser(
  idCommitment: string,
  durationDays: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const status = await getUserRGStatus(idCommitment);
    
    if (!status) {
      return {
        success: false,
        error: 'User not found',
      };
    }
    
    // Set self-exclusion
    status.selfExcluded = true;
    status.selfExclusionExpiry = Date.now() + durationDays * 24 * 60 * 60 * 1000;
    
    // Update in database
    rgDatabase.users.set(idCommitment, status);
    
    // Record event
    const event: RGEvent = {
      type: 'SELF_EXCLUDED',
      idCommitment,
      timestamp: Date.now(),
      data: { durationDays, expiryTimestamp: status.selfExclusionExpiry },
    };
    rgDatabase.events.push(event);
    
    // TODO: Update Concordium smart contract
    
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to set self-exclusion',
    };
  }
}

/**
 * Get audit logs (for regulators)
 */
export async function getAuditLogs(
  startDate?: number,
  endDate?: number
): Promise<RGEvent[]> {
  try {
    let logs = rgDatabase.events;
    
    if (startDate) {
      logs = logs.filter(event => event.timestamp >= startDate);
    }
    
    if (endDate) {
      logs = logs.filter(event => event.timestamp <= endDate);
    }
    
    return logs;
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return [];
  }
}

