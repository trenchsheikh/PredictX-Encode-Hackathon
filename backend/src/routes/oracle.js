const express = require('express');
const router = express.Router();

// GET /api/oracle/prices - Get current prices
router.get('/prices', async (req, res) => {
  try {
    const { symbols } = req.query;

    // TODO: Fetch prices from Pyth or other oracle
    res.json({
      prices: {},
      timestamp: Date.now(),
      message: 'Oracle prices endpoint - implement with Pyth Network',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
