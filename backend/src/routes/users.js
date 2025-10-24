const express = require('express');
const router = express.Router();

// GET /api/users/:address/bets - Get user bets
router.get('/:address/bets', async (req, res) => {
  try {
    const { address } = req.params;

    // TODO: Fetch user bets from database
    res.json({
      address,
      bets: [],
      message: 'User bets endpoint',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/users/leaderboard - Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    // TODO: Fetch leaderboard data
    res.json({
      leaderboard: [],
      message: 'Leaderboard endpoint',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
