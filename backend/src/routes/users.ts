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
      user: { $regex: new RegExp(`^${userAddress}$`, 'i') }
    }).lean();

    // Get all revealed bets for this user
    const revealedBets = await Bet.find({ 
      user: { $regex: new RegExp(`^${userAddress}$`, 'i') }
    }).lean();

    // Get market details for each bet
    const marketIds = [
      ...new Set([
        ...commitments.map(c => c.marketId),
        ...revealedBets.map(b => b.marketId)
      ])
    ];

    const markets = await Market.find({ 
      marketId: { $in: marketIds } 
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
      }))
    ];

    // Sort by timestamp/revealedAt (most recent first)
    userBets.sort((a, b) => {
      const timeA = 'revealedAt' in a ? new Date(a.revealedAt).getTime() : new Date(a.timestamp).getTime();
      const timeB = 'revealedAt' in b ? new Date(b.revealedAt).getTime() : new Date(b.timestamp).getTime();
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
      user: { $regex: new RegExp(`^${userAddress}$`, 'i') }
    }).lean();

    // Calculate stats
    const totalBets = bets.length;
    const totalInvested = bets.reduce((sum, bet) => sum + BigInt(bet.amount), BigInt(0));
    const totalShares = bets.reduce((sum, bet) => sum + BigInt(bet.shares), BigInt(0));
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

export default router;

