# Operator Integration Guide

> **How to integrate PredictX Responsible Gambling Registry into your gambling platform**

This guide shows gambling platform operators how to integrate PredictX RG Registry in **under 2 hours** to provide cross-platform responsible gambling protection for your users.

---

## 🎯 Why Integrate PredictX?

### For Your Platform

- ✅ **Regulatory Compliance**: Meet responsible gambling requirements
- ✅ **Reduced Liability**: RG protection is cross-platform, shared responsibility
- ✅ **Competitive Advantage**: Market as privacy-preserving RG leader
- ✅ **Lower Costs**: No need to build your own RG infrastructure
- ✅ **Easy Integration**: Just 2 API calls

### For Your Users

- ✅ **True Protection**: Limits follow them across ALL platforms
- ✅ **Privacy-Preserving**: No PII exposed to operators
- ✅ **User Control**: They set their own limits
- ✅ **Self-Exclusion**: Works across your platform and all others

---

## 🚀 Quick Integration (3 Steps)

### Step 1: User Registration (One-Time)

When a user signs up or first attempts to gamble, register them with PredictX:

```typescript
// 1. Generate anonymous identity commitment
import { generateIdCommitment } from '@/lib/concordium-service';

const idCommitment = generateIdCommitment(user.id, user.walletAddress);

// 2. Register user with Concordium Web3 ID verification
const response = await fetch('https://your-predictx-api.com/api/rg/link-identity', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: user.id,
    walletAddress: user.walletAddress,
    concordiumProof: concordiumWeb3IdProof, // From Concordium wallet
  }),
});

const result = await response.json();
if (result.success) {
  // User is registered! Store idCommitment in your database
  await database.users.update(user.id, {
    rgIdCommitment: result.data.idCommitment,
    rgVerified: true,
  });
}
```

### Step 2: Pre-Bet Validation (Every Bet)

**BEFORE accepting a bet**, check with PredictX:

```typescript
// Check if bet is allowed
const validation = await fetch('https://your-predictx-api.com/api/rg/check', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    idCommitment: user.rgIdCommitment,
    betAmount: betAmount,
  }),
});

const result = await validation.json();

if (!result.data.allowed) {
  // Block bet and show reason to user
  return showError(result.data.reason);
  // e.g., "Daily limit exceeded (€50/€100 used)"
}

// Bet is allowed, proceed with your normal bet flow
await processBet(user, betAmount, betDetails);
```

### Step 3: Post-Bet Recording (Every Bet)

**AFTER a successful bet**, notify PredictX:

```typescript
// Record bet in RG system
await fetch('https://your-predictx-api.com/api/rg/record-bet', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    idCommitment: user.rgIdCommitment,
    betAmount: betAmount,
  }),
});

// Note: This is fire-and-forget. Don't block bet completion on this.
```

**That's it!** Your platform now provides cross-platform RG protection.

---

## 📋 Complete Integration Example

Here's a complete example showing integration into a typical betting flow:

```typescript
// components/BettingForm.tsx

import { useState } from 'react';
import { generateIdCommitment } from '@/lib/concordium-service';

export function BettingForm({ user, marketId }) {
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handlePlaceBet() {
    try {
      setLoading(true);
      setError(null);

      // 1. Check if user is RG verified
      if (!user.rgIdCommitment) {
        // First-time user - need to register
        const registered = await registerUserWithRG(user);
        if (!registered) {
          setError('Please complete identity verification to bet');
          return;
        }
      }

      // 2. PRE-BET: Validate with RG system
      const validation = await fetch('/api/rg/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idCommitment: user.rgIdCommitment,
          betAmount: amount,
        }),
      });

      const rgResult = await validation.json();

      if (!rgResult.data.allowed) {
        // Bet blocked by RG limits
        setError(rgResult.data.reason);
        return;
      }

      // 3. PROCESS BET: Your platform's normal bet logic
      const betResult = await fetch('/api/bets/place', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          marketId,
          amount,
        }),
      });

      if (!betResult.ok) {
        setError('Bet processing failed');
        return;
      }

      // 4. POST-BET: Record in RG system (fire-and-forget)
      fetch('/api/rg/record-bet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idCommitment: user.rgIdCommitment,
          betAmount: amount,
        }),
      }).catch(err => console.warn('RG recording failed:', err));

      // 5. Success! Show confirmation
      alert('Bet placed successfully!');
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <input
        type="number"
        value={amount}
        onChange={e => setAmount(Number(e.target.value))}
        placeholder="Bet amount (€)"
      />
      <button onClick={handlePlaceBet} disabled={loading}>
        {loading ? 'Processing...' : 'Place Bet'}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
```

---

## 🔌 API Reference

### Base URL

```
Production: https://predictx-rg-api.vercel.app
Testnet:    https://predictx-rg-testnet.vercel.app
Self-Host:  https://your-domain.com
```

### Authentication

Currently, no authentication required for operators (open API).

In production, you may want to:
- Use API keys for rate limiting
- Implement operator verification
- Track usage metrics

### Endpoints

#### 1. `POST /api/rg/link-identity`

Register user with PredictX RG system.

**Request:**
```json
{
  "userId": "user_12345",
  "walletAddress": "4Ec3LXL...xYjFz",
  "concordiumProof": {
    "credential": { /* Web3 ID proof */ },
    "signature": "..."
  }
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "idCommitment": "blake2b_hash_64_chars...",
    "verified": true,
    "kycStatus": "verified"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Age verification failed"
}
```

#### 2. `POST /api/rg/check`

Validate if bet is allowed.

**Request:**
```json
{
  "idCommitment": "blake2b_hash...",
  "betAmount": 50.00
}
```

**Response (Allowed):**
```json
{
  "success": true,
  "data": {
    "allowed": true,
    "remainingDaily": 50.00,
    "remainingWeekly": 450.00,
    "remainingMonthly": 1950.00
  }
}
```

**Response (Blocked):**
```json
{
  "success": true,
  "data": {
    "allowed": false,
    "reason": "Would exceed daily limit (€50/€100 used)",
    "remainingDaily": 0,
    "currentSpending": {
      "daily": 100,
      "weekly": 250,
      "monthly": 800
    }
  }
}
```

**Response (Self-Excluded):**
```json
{
  "success": true,
  "data": {
    "allowed": false,
    "reason": "Self-excluded for 14 more days",
    "selfExcluded": true,
    "expiryDate": "2025-11-15T00:00:00Z"
  }
}
```

#### 3. `POST /api/rg/record-bet`

Record bet after successful placement.

**Request:**
```json
{
  "idCommitment": "blake2b_hash...",
  "betAmount": 50.00
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "recorded": true,
    "newSpending": {
      "daily": 150,
      "weekly": 300,
      "monthly": 850
    }
  }
}
```

#### 4. `GET /api/rg/status`

Get user's current RG status (optional, for displaying to user).

**Request:**
```
GET /api/rg/status?idCommitment=blake2b_hash...
```

**Response:**
```json
{
  "success": true,
  "data": {
    "idCommitment": "blake2b_hash...",
    "limits": {
      "dailyLimit": 100,
      "weeklyLimit": 500,
      "monthlyLimit": 2000,
      "singleBetLimit": 1000,
      "cooldownPeriod": 0
    },
    "currentSpending": {
      "daily": 50,
      "weekly": 200,
      "monthly": 650
    },
    "selfExcluded": false,
    "kycStatus": "verified",
    "riskLevel": "low"
  }
}
```

#### 5. `POST /api/rg/set-limit`

Allow user to configure their limits (optional UI feature).

**Request:**
```json
{
  "idCommitment": "blake2b_hash...",
  "limits": {
    "dailyLimit": 50,
    "weeklyLimit": 250,
    "monthlyLimit": 1000
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "limitsUpdated": true
  }
}
```

#### 6. `POST /api/rg/self-exclude`

User initiates self-exclusion (optional UI feature).

**Request:**
```json
{
  "idCommitment": "blake2b_hash...",
  "durationDays": 30
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "selfExcluded": true,
    "expiryDate": "2025-12-01T00:00:00Z"
  }
}
```

---

## 🎨 UI Components (Optional)

Provide users with visibility into their RG status:

### 1. RG Status Badge

```tsx
import { useRGStatus } from '@/hooks/use-rg-status';

export function RGStatusBadge({ idCommitment }) {
  const { status, loading } = useRGStatus(idCommitment);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="rg-status">
      <h3>Responsible Gambling</h3>
      <p>Daily: €{status.currentSpending.daily} / €{status.limits.dailyLimit}</p>
      <p>Weekly: €{status.currentSpending.weekly} / €{status.limits.weeklyLimit}</p>
      <p>Monthly: €{status.currentSpending.monthly} / €{status.limits.monthlyLimit}</p>
      {status.selfExcluded && (
        <p className="warning">Self-excluded until {status.expiryDate}</p>
      )}
    </div>
  );
}
```

### 2. Limit Configuration Modal

```tsx
export function LimitConfigModal({ idCommitment, onClose }) {
  const [dailyLimit, setDailyLimit] = useState(100);
  const [weeklyLimit, setWeeklyLimit] = useState(500);
  const [monthlyLimit, setMonthlyLimit] = useState(2000);

  async function handleSave() {
    await fetch('/api/rg/set-limit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        idCommitment,
        limits: { dailyLimit, weeklyLimit, monthlyLimit },
      }),
    });
    onClose();
  }

  return (
    <div className="modal">
      <h2>Set Your Limits</h2>
      <label>
        Daily Limit (€):
        <input
          type="number"
          value={dailyLimit}
          onChange={e => setDailyLimit(Number(e.target.value))}
        />
      </label>
      <label>
        Weekly Limit (€):
        <input
          type="number"
          value={weeklyLimit}
          onChange={e => setWeeklyLimit(Number(e.target.value))}
        />
      </label>
      <label>
        Monthly Limit (€):
        <input
          type="number"
          value={monthlyLimit}
          onChange={e => setMonthlyLimit(Number(e.target.value))}
        />
      </label>
      <button onClick={handleSave}>Save Limits</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}
```

---

## 🔒 Privacy & Security

### What PredictX Knows

- ✅ Anonymous identity commitment (Blake2b hash)
- ✅ Bet amounts and timestamps
- ✅ Limit settings and spending totals

### What PredictX DOES NOT Know

- ❌ User's real name
- ❌ User's email or phone
- ❌ User's home address
- ❌ Which specific platform they're betting on
- ❌ What they're betting on (market details)

### What Operators Learn

- ✅ Whether a bet is allowed (yes/no)
- ✅ Remaining limits (optional)

### What Operators DON'T Learn

- ❌ User's real identity
- ❌ User's bets on other platforms
- ❌ User's total cross-platform spending

---

## 💰 Cost Structure

### Free Tier (Current)

- ✅ Unlimited API calls
- ✅ Full functionality
- ✅ No registration required

### Future Pricing (Post-Hackathon)

Potential models:
- **Pay-per-validation**: €0.01 per RG check
- **Subscription**: €500/month for unlimited checks
- **Revenue share**: 0.1% of bet amounts

---

## 🧪 Testing

### Test Users

Use these test identity commitments for development:

```
Test User 1 (No limits hit):
idCommitment: "test_user_1_commitment_hash_abc123..."

Test User 2 (Daily limit exceeded):
idCommitment: "test_user_2_commitment_hash_def456..."

Test User 3 (Self-excluded):
idCommitment: "test_user_3_commitment_hash_ghi789..."
```

### Test Scenarios

1. **New User Registration**
   - Call `/api/rg/link-identity`
   - Verify successful registration
   - Store `idCommitment`

2. **Normal Bet (Within Limits)**
   - Call `/api/rg/check` with amount = €50
   - Expect: `{ allowed: true }`
   - Process bet
   - Call `/api/rg/record-bet`

3. **Limit Exceeded**
   - Call `/api/rg/check` with amount = €150
   - Expect: `{ allowed: false, reason: "Would exceed daily limit" }`
   - Show error to user

4. **Self-Exclusion**
   - User clicks "Self-Exclude"
   - Call `/api/rg/self-exclude` with `durationDays: 30`
   - Try to place bet
   - Expect: `{ allowed: false, reason: "Self-excluded for 29 more days" }`

---

## 🚨 Error Handling

### Best Practices

```typescript
async function checkRGLimits(idCommitment, amount) {
  try {
    const response = await fetch('/api/rg/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idCommitment, betAmount: amount }),
      // Timeout after 5 seconds
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      // API error - fail safe: allow bet but log warning
      console.error('RG API error:', response.status);
      logToMonitoring('rg_api_error', { status: response.status });
      return { allowed: true, fallback: true };
    }

    const result = await response.json();
    return result.data;
    
  } catch (error) {
    // Network error - fail safe: allow bet but log warning
    console.error('RG API unreachable:', error);
    logToMonitoring('rg_api_unreachable', { error: error.message });
    return { allowed: true, fallback: true };
  }
}
```

### Fail-Safe Strategy

**If PredictX API is unreachable**:
- ✅ Allow bet to proceed (don't block user)
- ✅ Log error for investigation
- ✅ Show warning to user (optional)
- ✅ Consider implementing local rate limiting as backup

This ensures your platform continues operating even if PredictX has downtime.

---

## 📊 Analytics & Monitoring

### Track These Metrics

1. **RG Check Success Rate**: % of checks that succeed
2. **Blocked Bets**: How many bets blocked by RG
3. **Block Reasons**: Why bets are blocked (limits, self-exclusion, etc.)
4. **API Response Time**: Monitor performance
5. **Fallback Rate**: How often fallback logic triggers

### Example Monitoring

```typescript
async function checkRGWithMetrics(idCommitment, amount) {
  const startTime = Date.now();
  
  try {
    const result = await checkRGLimits(idCommitment, amount);
    
    // Log success
    analytics.track('rg_check_success', {
      responseTime: Date.now() - startTime,
      allowed: result.allowed,
      reason: result.reason,
    });
    
    return result;
  } catch (error) {
    // Log failure
    analytics.track('rg_check_failure', {
      responseTime: Date.now() - startTime,
      error: error.message,
    });
    
    throw error;
  }
}
```

---

## 🎓 Case Study: Integration Example

### Platform: "BetNow Casino"

**Before PredictX**: 
- Users could set limits on BetNow only
- Users who hit limits would just go to competitors
- No cross-platform protection
- Had to build and maintain own RG infrastructure

**After PredictX**:
- 2-hour integration
- Users protected across ALL platforms
- Competitive advantage: "We're part of the cross-platform RG network"
- Reduced development and maintenance costs

**Integration Details**:
- Added `/api/rg/check` before bet processing: 1 line of code
- Added `/api/rg/record-bet` after bet success: 1 line of code
- Added RG status badge to user dashboard: 15 lines of code
- **Total**: 17 lines of code, 2 hours of work

---

## 🆘 Support

### Integration Help

- **GitHub Issues**: [Open an issue](https://github.com/trenchsheikh/PredictX-Encode-Hackathon/issues)
- **GitHub Discussions**: [Ask a question](https://github.com/trenchsheikh/PredictX-Encode-Hackathon/discussions)
- **Email**: support@predictx.io (after hackathon)

### Documentation

- **This Guide**: [OPERATOR_INTEGRATION_GUIDE.md](./OPERATOR_INTEGRATION_GUIDE.md)
- **Technical Docs**: [CONCORDIUM_INTEGRATION.md](./CONCORDIUM_INTEGRATION.md)
- **API Reference**: [API_REFERENCE.md](./API_REFERENCE.md)
- **Video Tutorial**: [Watch on YouTube](YOUR_TUTORIAL_URL)

---

## ✅ Integration Checklist

Use this checklist to track your integration:

### Phase 1: Setup (30 minutes)
- [ ] Read this guide
- [ ] Set up test environment
- [ ] Test API endpoints with Postman/curl
- [ ] Generate test identity commitments

### Phase 2: Backend Integration (1 hour)
- [ ] Add user registration flow (`/api/rg/link-identity`)
- [ ] Add pre-bet validation (`/api/rg/check`)
- [ ] Add post-bet recording (`/api/rg/record-bet`)
- [ ] Implement error handling and fallback logic
- [ ] Add logging and monitoring

### Phase 3: Frontend Integration (30 minutes)
- [ ] Show RG status to users (optional)
- [ ] Add limit configuration UI (optional)
- [ ] Add self-exclusion button (optional)
- [ ] Show blocked bet messages with reasons

### Phase 4: Testing (30 minutes)
- [ ] Test new user registration
- [ ] Test normal bet flow
- [ ] Test limit exceeded scenario
- [ ] Test self-exclusion
- [ ] Test API error handling

### Phase 5: Production (Optional)
- [ ] Deploy to production
- [ ] Monitor metrics
- [ ] Gather user feedback
- [ ] Optimize performance

---

**Need help?** Open an issue on GitHub or join our Discord community!

**Ready to make gambling safer?** Start integrating PredictX today! 🚀

