// Concordium Identity and Responsible Gambling Types

/**
 * Concordium Web3 ID Proof structure
 * Based on Concordium's Web3 ID documentation
 */
export interface ConcordiumWeb3IdProof {
  proof: {
    type: string;
    created: string;
    proofValue: string;
    proofPurpose: string;
    verificationMethod: string;
  };
  credential: {
    id: string;
    type: string[];
    issuer: string;
    issuanceDate: string;
    credentialSubject: {
      id: string;
      attributes: {
        age?: number;
        jurisdiction?: string;
        firstName?: string;
        lastName?: string;
        nationality?: string;
      };
    };
  };
  signature: string;
}

/**
 * User identity commitment stored on-chain
 */
export interface IdentityCommitment {
  commitment: string; // Blake2b hash of (privyUserId || solanaPublicKey)
  createdAt: number;
  verified: boolean;
  attributes: {
    ageVerified: boolean;
    jurisdictionAllowed: boolean;
  };
}

/**
 * Responsible Gambling user limits
 */
export interface RGLimits {
  dailyLimit: number; // in SOL
  weeklyLimit: number; // in SOL
  monthlyLimit: number; // in SOL
  singleBetLimit: number; // in SOL
  cooldownPeriod: number; // in seconds
}

/**
 * User RG status
 */
export interface RGStatus {
  idCommitment: string;
  limits: RGLimits;
  currentSpending: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  lastBetTimestamp: number;
  selfExcluded: boolean;
  selfExclusionExpiry?: number; // Unix timestamp
  riskLevel: 'low' | 'medium' | 'high';
  kycStatus: 'pending' | 'verified' | 'failed';
}

/**
 * Bet validation request
 */
export interface BetValidationRequest {
  userAddress: string;
  betAmount: number; // in SOL
  idCommitment: string;
}

/**
 * Bet validation response
 */
export interface BetValidationResponse {
  allowed: boolean;
  reason?: string;
  remainingDaily?: number;
  remainingWeekly?: number;
  cooldownRemaining?: number;
}

/**
 * Self-exclusion request
 */
export interface SelfExclusionRequest {
  userAddress: string;
  idCommitment: string;
  duration: number; // in days (7, 30, 90, 180, 365)
  reason?: string;
}

/**
 * Concordium smart contract event
 */
export interface RGEvent {
  type: 'USER_REGISTERED' | 'LIMIT_SET' | 'BET_RECORDED' | 'SELF_EXCLUDED' | 'LIMIT_VIOLATED';
  idCommitment: string;
  timestamp: number;
  data: Record<string, unknown>;
}

/**
 * Audit log entry
 */
export interface AuditLogEntry {
  eventId: string;
  type: RGEvent['type'];
  idCommitment: string;
  timestamp: number;
  jurisdiction?: string;
  details: Record<string, unknown>;
}

/**
 * Privy user metadata extension for Concordium
 */
export interface PrivyUserConcordiumMetadata {
  concordiumIdCommitment?: string;
  concordiumProofVerified?: boolean;
  kycStatus?: 'pending' | 'verified' | 'failed';
  riskLevel?: 'low' | 'medium' | 'high';
  verifiedAt?: number;
}

/**
 * Allowed jurisdictions for betting
 */
export const ALLOWED_JURISDICTIONS = [
  'US',
  'UK',
  'CA',
  'AU',
  'NZ',
  'SG',
  'JP',
  'KR',
  'CH',
  'SE',
  'NO',
  'DK',
  'FI',
  'DE',
  'FR',
  'ES',
  'IT',
  'NL',
  'BE',
  'AT',
  'IE',
] as const;

export type AllowedJurisdiction = typeof ALLOWED_JURISDICTIONS[number];

/**
 * Default RG limits (in SOL)
 */
export const DEFAULT_RG_LIMITS: RGLimits = {
  dailyLimit: 10, // 10 SOL per day
  weeklyLimit: 50, // 50 SOL per week
  monthlyLimit: 200, // 200 SOL per month
  singleBetLimit: 100, // 100 SOL per bet
  cooldownPeriod: 0, // No cooldown by default
};

/**
 * Minimum age for betting
 */
export const MINIMUM_AGE = 18;

/**
 * Self-exclusion durations (in days)
 */
export const SELF_EXCLUSION_DURATIONS = [7, 30, 90, 180, 365] as const;
export type SelfExclusionDuration = typeof SELF_EXCLUSION_DURATIONS[number];

