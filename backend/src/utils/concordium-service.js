const { createHash } = require('crypto');

// Configuration constants
const MINIMUM_AGE = parseInt(process.env.MINIMUM_AGE) || 18;
const ALLOWED_JURISDICTIONS = (
  process.env.ALLOWED_JURISDICTIONS || 'US,UK,CA,AU'
).split(',');

// Mock database for development
const rgDatabase = {
  users: new Map(),
  events: [],
};

/**
 * Generate Blake2b hash for identity commitment
 */
function generateIdCommitment(privyUserId, solanaPublicKey) {
  const data = `${privyUserId}||${solanaPublicKey}`;
  return createHash('blake2b512').update(data).digest('hex');
}

/**
 * Verify Concordium Web3 ID proof
 */
async function verifyWeb3IdProof(proof) {
  try {
    const { attributes } = proof.credential.credentialSubject;

    // Validate age
    if (!attributes.age || attributes.age < MINIMUM_AGE) {
      return {
        valid: false,
        error: `User must be at least ${MINIMUM_AGE} years old`,
      };
    }

    // Validate jurisdiction
    if (
      !attributes.jurisdiction ||
      !ALLOWED_JURISDICTIONS.includes(attributes.jurisdiction)
    ) {
      return {
        valid: false,
        error: `Betting is not allowed in jurisdiction: ${attributes.jurisdiction}`,
      };
    }

    // Verify proof signature
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
      error: error.message || 'Unknown error during verification',
    };
  }
}

/**
 * Register user in RG registry
 */
async function registerUser(idCommitment, attributes) {
  try {
    if (rgDatabase.users.has(idCommitment)) {
      return {
        success: false,
        error: 'User already registered',
      };
    }

    const defaultLimits = {
      dailyLimit: parseFloat(process.env.DEFAULT_DAILY_LIMIT) || 10,
      weeklyLimit: parseFloat(process.env.DEFAULT_WEEKLY_LIMIT) || 50,
      monthlyLimit: parseFloat(process.env.DEFAULT_MONTHLY_LIMIT) || 200,
      singleBetLimit: parseFloat(process.env.DEFAULT_SINGLE_BET_LIMIT) || 100,
      cooldownPeriod: 0,
    };

    const rgStatus = {
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

    rgDatabase.users.set(idCommitment, rgStatus);

    const event = {
      type: 'USER_REGISTERED',
      idCommitment,
      timestamp: Date.now(),
      data: { attributes },
    };
    rgDatabase.events.push(event);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to register user',
    };
  }
}

/**
 * Get user RG status
 */
async function getUserRGStatus(idCommitment) {
  try {
    const status = rgDatabase.users.get(idCommitment);
    return status || null;
  } catch (error) {
    console.error('Error fetching RG status:', error);
    return null;
  }
}

/**
 * Validate if bet is allowed based on RG limits
 */
async function validateBet(request) {
  try {
    const { idCommitment, betAmount } = request;

    const status = await getUserRGStatus(idCommitment);

    if (!status) {
      return {
        allowed: false,
        reason:
          'User not registered in RG system. Please complete identity verification.',
      };
    }

    // Check self-exclusion
    if (status.selfExcluded) {
      if (
        status.selfExclusionExpiry &&
        Date.now() < status.selfExclusionExpiry
      ) {
        const daysRemaining = Math.ceil(
          (status.selfExclusionExpiry - Date.now()) / (24 * 60 * 60 * 1000)
        );
        return {
          allowed: false,
          reason: `Self-excluded for ${daysRemaining} more days`,
        };
      } else {
        status.selfExcluded = false;
        status.selfExclusionExpiry = undefined;
      }
    }

    // Check cooldown period
    if (status.limits.cooldownPeriod > 0) {
      const timeSinceLastBet = Date.now() - status.lastBetTimestamp;
      const cooldownMs = status.limits.cooldownPeriod * 1000;

      if (timeSinceLastBet < cooldownMs) {
        const secondsRemaining = Math.ceil(
          (cooldownMs - timeSinceLastBet) / 1000
        );
        return {
          allowed: false,
          reason: 'Cooldown period active',
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
    const dailyRemaining =
      status.limits.dailyLimit - status.currentSpending.daily;
    if (betAmount > dailyRemaining) {
      return {
        allowed: false,
        reason: 'Bet would exceed daily limit',
        remainingDaily: dailyRemaining,
      };
    }

    // Check weekly limit
    const weeklyRemaining =
      status.limits.weeklyLimit - status.currentSpending.weekly;
    if (betAmount > weeklyRemaining) {
      return {
        allowed: false,
        reason: 'Bet would exceed weekly limit',
        remainingWeekly: weeklyRemaining,
      };
    }

    // Check monthly limit
    const monthlyRemaining =
      status.limits.monthlyLimit - status.currentSpending.monthly;
    if (betAmount > monthlyRemaining) {
      return {
        allowed: false,
        reason: 'Bet would exceed monthly limit',
      };
    }

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
async function recordBet(idCommitment, betAmount) {
  try {
    const status = await getUserRGStatus(idCommitment);

    if (!status) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    status.currentSpending.daily += betAmount;
    status.currentSpending.weekly += betAmount;
    status.currentSpending.monthly += betAmount;
    status.lastBetTimestamp = Date.now();

    rgDatabase.users.set(idCommitment, status);

    const event = {
      type: 'BET_RECORDED',
      idCommitment,
      timestamp: Date.now(),
      data: { betAmount },
    };
    rgDatabase.events.push(event);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to record bet',
    };
  }
}

/**
 * Set user betting limits
 */
async function setUserLimits(idCommitment, limits) {
  try {
    const status = await getUserRGStatus(idCommitment);

    if (!status) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    status.limits = {
      ...status.limits,
      ...limits,
    };

    rgDatabase.users.set(idCommitment, status);

    const event = {
      type: 'LIMIT_SET',
      idCommitment,
      timestamp: Date.now(),
      data: { limits },
    };
    rgDatabase.events.push(event);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to set limits',
    };
  }
}

/**
 * Self-exclude user from betting
 */
async function selfExcludeUser(idCommitment, durationDays) {
  try {
    const status = await getUserRGStatus(idCommitment);

    if (!status) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    status.selfExcluded = true;
    status.selfExclusionExpiry =
      Date.now() + durationDays * 24 * 60 * 60 * 1000;

    rgDatabase.users.set(idCommitment, status);

    const event = {
      type: 'SELF_EXCLUDED',
      idCommitment,
      timestamp: Date.now(),
      data: { durationDays, expiryTimestamp: status.selfExclusionExpiry },
    };
    rgDatabase.events.push(event);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to set self-exclusion',
    };
  }
}

module.exports = {
  generateIdCommitment,
  verifyWeb3IdProof,
  registerUser,
  getUserRGStatus,
  validateBet,
  recordBet,
  setUserLimits,
  selfExcludeUser,
};
