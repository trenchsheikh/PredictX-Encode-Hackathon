const express = require('express');

const router = express.Router();
const {
  generateIdCommitment,
  verifyWeb3IdProof,
  registerUser,
  getUserRGStatus,
  validateBet,
  recordBet,
  setUserLimits,
  selfExcludeUser,
} = require('../utils/concordium-service');

// POST /api/rg/link-identity - Link Concordium identity
router.post('/link-identity', async (req, res) => {
  try {
    const { privyUserId, solanaPublicKey, web3IdProof } = req.body;

    if (!privyUserId || !solanaPublicKey || !web3IdProof) {
      return res.status(400).json({
        error:
          'Missing required fields: privyUserId, solanaPublicKey, web3IdProof',
      });
    }

    // Verify Web3 ID proof
    const verificationResult = await verifyWeb3IdProof(web3IdProof);

    if (!verificationResult.valid) {
      return res.status(400).json({
        error: verificationResult.error || 'Invalid Web3 ID proof',
      });
    }

    // Generate identity commitment
    const idCommitment = generateIdCommitment(privyUserId, solanaPublicKey);

    // Register user in RG system
    const registrationResult = await registerUser(
      idCommitment,
      verificationResult.attributes
    );

    if (!registrationResult.success) {
      return res.status(400).json({
        error: registrationResult.error || 'Failed to register user',
      });
    }

    res.json({
      success: true,
      idCommitment,
      attributes: verificationResult.attributes,
    });
  } catch (error) {
    console.error('Error linking identity:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/rg/check - Check if bet is allowed
router.post('/check', async (req, res) => {
  try {
    const { idCommitment, betAmount } = req.body;

    if (!idCommitment || betAmount === undefined) {
      return res.status(400).json({
        error: 'Missing required fields: idCommitment, betAmount',
      });
    }

    const result = await validateBet({ idCommitment, betAmount });

    res.json(result);
  } catch (error) {
    console.error('Error checking bet:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/rg/status - Get RG status
router.get('/status', async (req, res) => {
  try {
    const { idCommitment } = req.query;

    if (!idCommitment) {
      return res.status(400).json({
        error: 'Missing required parameter: idCommitment',
      });
    }

    const status = await getUserRGStatus(idCommitment);

    if (!status) {
      return res.status(404).json({
        error: 'User not found in RG system',
      });
    }

    res.json(status);
  } catch (error) {
    console.error('Error getting RG status:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/rg/record-bet - Record a bet
router.post('/record-bet', async (req, res) => {
  try {
    const { idCommitment, betAmount } = req.body;

    if (!idCommitment || betAmount === undefined) {
      return res.status(400).json({
        error: 'Missing required fields: idCommitment, betAmount',
      });
    }

    const result = await recordBet(idCommitment, betAmount);

    if (!result.success) {
      return res.status(400).json({
        error: result.error || 'Failed to record bet',
      });
    }

    res.json(result);
  } catch (error) {
    console.error('Error recording bet:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/rg/set-limit - Set betting limits
router.post('/set-limit', async (req, res) => {
  try {
    const { idCommitment, limits } = req.body;

    if (!idCommitment || !limits) {
      return res.status(400).json({
        error: 'Missing required fields: idCommitment, limits',
      });
    }

    const result = await setUserLimits(idCommitment, limits);

    if (!result.success) {
      return res.status(400).json({
        error: result.error || 'Failed to set limits',
      });
    }

    res.json(result);
  } catch (error) {
    console.error('Error setting limits:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/rg/self-exclude - Self-exclude from betting
router.post('/self-exclude', async (req, res) => {
  try {
    const { idCommitment, durationDays } = req.body;

    if (!idCommitment || !durationDays) {
      return res.status(400).json({
        error: 'Missing required fields: idCommitment, durationDays',
      });
    }

    const result = await selfExcludeUser(idCommitment, durationDays);

    if (!result.success) {
      return res.status(400).json({
        error: result.error || 'Failed to self-exclude',
      });
    }

    res.json(result);
  } catch (error) {
    console.error('Error self-excluding:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
