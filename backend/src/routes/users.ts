import { Router, Request, Response } from 'express';
import { Bet } from '../models/Bet';
import { Commitment } from '../models/Commitment';
import { Market } from '../models/Market';

const router = Router();

/**
 * GET /api/users/:address/bets
 * Fetch all bets (commitments and reveals) for a user
 */
router.get('/:address/bets', async (req: Request, res: Response) => {
  try {
    const userAddress = req.params.address.toLowerCase();

    // Get all commitments for this user
    const commitments = await Commitment.find({
      user: { $regex: new RegExp(`^${userAddress}$`, 'i') },
    }).lean();

    // Get all revealed bets for this user
    const revealedBets = await Bet.find({
      user: { $regex: new RegExp(`^${userAddress}$`, 'i') },
    }).lean();

    // Get market details for each bet
    const marketIds = Array.from(
      new Set([
        ...commitments.map(c => c.marketId),
        ...revealedBets.map(b => b.marketId),
      ])
    );

    const markets = await Market.find({
      marketId: { $in: marketIds },
    }).lean();

    const marketMap = new Map(markets.map(m => [m.marketId, m]));

    // Combine commitments and bets with market info
    const userBets = [
      ...commitments.map(commitment => ({
        type: 'commitment',
        marketId: commitment.marketId,
        market: marketMap.get(commitment.marketId),
        amount: commitment.amount,
        timestamp: commitment.timestamp,
        revealed: commitment.revealed,
        txHash: commitment.txHash,
      })),
      ...revealedBets.map(bet => ({
        type: 'bet',
        marketId: bet.marketId,
        market: marketMap.get(bet.marketId),
        outcome: bet.outcome,
        shares: bet.shares,
        amount: bet.amount,
        revealedAt: bet.revealedAt,
        claimed: bet.claimed,
        txHash: bet.txHash,
      })),
    ];

    // Sort by timestamp/revealedAt (most recent first)
    userBets.sort((a, b) => {
      const timeA =
        'revealedAt' in a
          ? new Date(a.revealedAt).getTime()
          : new Date(a.timestamp).getTime();
      const timeB =
        'revealedAt' in b
          ? new Date(b.revealedAt).getTime()
          : new Date(b.timestamp).getTime();
      return timeB - timeA;
    });

    res.json({
      success: true,
      data: {
        address: userAddress,
        totalBets: userBets.length,
        commitments: commitments.length,
        revealedBets: revealedBets.length,
        bets: userBets,
      },
    });
  } catch (error) {
    console.error('Error fetching user bets:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user bets',
    });
  }
});

/**
 * GET /api/users/:address/stats
 * Get user statistics
 */
router.get('/:address/stats', async (req: Request, res: Response) => {
  try {
    const userAddress = req.params.address.toLowerCase();

    // Get all revealed bets
    const bets = await Bet.find({
      user: { $regex: new RegExp(`^${userAddress}$`, 'i') },
    }).lean();

    // Calculate stats
    const totalBets = bets.length;
    const totalInvested = bets.reduce(
      (sum, bet) => sum + BigInt(bet.amount),
      BigInt(0)
    );
    const totalShares = bets.reduce(
      (sum, bet) => sum + BigInt(bet.shares),
      BigInt(0)
    );
    const claimedBets = bets.filter(b => b.claimed).length;

    res.json({
      success: true,
      data: {
        address: userAddress,
        totalBets,
        totalInvested: totalInvested.toString(),
        totalShares: totalShares.toString(),
        claimedBets,
        activeBets: totalBets - claimedBets,
      },
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user stats',
    });
  }
});

/**
 * GET /api/users/leaderboard
 * Get leaderboard data
 */
router.get('/leaderboard', async (req: Request, res: Response) => {
  try {
    const { timeframe = 'all', limit = 50 } = req.query;

    // Calculate time filter
    let timeFilter = {};
    if (timeframe !== 'all') {
      const now = new Date();
      let startDate: Date;

      switch (timeframe) {
        case '7d':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(0);
      }

      timeFilter = {
        revealedAt: { $gte: startDate },
      };
    }

    // Get all revealed bets with time filter
    const bets = await Bet.find(timeFilter).lean();

    // Group by user and calculate stats
    const userStats = new Map();

    for (const bet of bets) {
      const userAddress = bet.user.toLowerCase();

      if (!userStats.has(userAddress)) {
        userStats.set(userAddress, {
          address: userAddress,
          totalBets: 0,
          totalWinnings: 0,
          totalVolume: 0,
          winCount: 0,
          lastActive: 0,
        });
      }

      const stats = userStats.get(userAddress);
      stats.totalBets++;
      stats.totalVolume += parseFloat(bet.amount);
      stats.lastActive = Math.max(
        stats.lastActive,
        new Date(bet.revealedAt).getTime()
      );

      // Calculate winnings (simplified - would need market resolution data)
      if (bet.claimed) {
        stats.totalWinnings += parseFloat(bet.shares) * 0.1; // Simplified calculation
        stats.winCount++;
      }
    }

    // Convert to array and calculate win rates
    const leaderboard = Array.from(userStats.values()).map(stats => ({
      ...stats,
      winRate: stats.totalBets > 0 ? stats.winCount / stats.totalBets : 0,
      totalWinnings: stats.totalWinnings,
      totalVolume: stats.totalVolume,
    }));

    // Sort by total winnings (descending)
    leaderboard.sort((a, b) => b.totalWinnings - a.totalWinnings);

    // Add ranks and badges
    const rankedLeaderboard = leaderboard
      .slice(0, parseInt(limit as string))
      .map((entry, index) => {
        const badges = [];

        if (entry.winRate >= 0.8) badges.push('Expert');
        if (entry.totalWinnings >= 2) badges.push('High Roller');
        if (entry.winRate >= 0.9) badges.push('Champion');
        if (entry.totalBets >= 20) badges.push('Active Trader');
        if (entry.totalVolume >= 5) badges.push('Whale');

        return {
          rank: index + 1,
          address: entry.address,
          username: `User${entry.address.slice(-4)}`, // Generate username from address
          totalWinnings: entry.totalWinnings,
          totalBets: entry.totalBets,
          winRate: entry.winRate,
          totalVolume: entry.totalVolume,
          badges,
          isVerified: entry.totalBets >= 10, // Simple verification based on activity
          streak: Math.floor(Math.random() * 10), // Placeholder - would need streak calculation
          lastActive: entry.lastActive,
        };
      });

    res.json({
      success: true,
      data: {
        leaderboard: rankedLeaderboard,
        timeframe,
        totalUsers: leaderboard.length,
      },
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch leaderboard',
    });
  }
});

export default router;
