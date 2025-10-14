import { Router, Request, Response } from 'express';
import { Market } from '../models/Market';
import { Commitment } from '../models/Commitment';
import { Bet } from '../models/Bet';
import { blockchainService } from '../services/BlockchainService';
import { MarketStatus } from '../types';

const router = Router();

/**
 * GET /api/markets
 * List all markets with optional filters
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      status,
      category,
      creator,
      limit = '50',
      offset = '0',
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    // Build query
    const query: any = {};
    if (status !== undefined) query.status = parseInt(status as string);
    if (category !== undefined) query.category = parseInt(category as string);
    if (creator) query.creator = creator;

    // Execute query
    const markets = await Market.find(query)
      .sort({ [sortBy as string]: sortOrder === 'desc' ? -1 : 1 })
      .limit(parseInt(limit as string))
      .skip(parseInt(offset as string))
      .lean();

    const total = await Market.countDocuments(query);

    res.json({
      success: true,
      data: markets,
      pagination: {
        total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      },
    });
  } catch (error) {
    console.error('Error fetching markets:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch markets',
    });
  }
});

/**
 * POST /api/markets/sync
 * Manually trigger blockchain event sync (admin endpoint)
 */
router.post('/sync', async (req: Request, res: Response) => {
  try {
    const { fromBlock } = req.body;
    const startBlock = fromBlock || 0;
    
    console.log(`🔄 Manual sync triggered from block ${startBlock}`);
    await blockchainService.syncHistoricalEvents(startBlock);
    
    res.json({
      success: true,
      message: `Synced events from block ${startBlock}`,
    });
  } catch (error) {
    console.error('Error syncing events:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to sync events',
    });
  }
});

/**
 * GET /api/markets/:id
 * Fetch single market with details
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const marketId = parseInt(req.params.id);

    // Check cache first
    let market: any = await Market.findOne({ marketId }).lean();

    // If not in cache, fetch from blockchain
    if (!market) {
      console.log(`Market ${marketId} not in cache, fetching from blockchain...`);
      const chainData = await blockchainService.getMarketFromChain(marketId);

      market = {
        marketId,
        title: chainData.title,
        description: chainData.description,
        creator: chainData.creator,
        createdAt: new Date(Number(chainData.createdAt) * 1000),
        expiresAt: new Date(Number(chainData.expiresAt) * 1000),
        category: Number(chainData.category),
        totalPool: chainData.totalPool.toString(),
        yesPool: chainData.yesPool.toString(),
        noPool: chainData.noPool.toString(),
        yesShares: chainData.yesShares.toString(),
        noShares: chainData.noShares.toString(),
        participants: Number(chainData.participants),
        status: Number(chainData.status),
        outcome: chainData.outcome,
        resolutionReasoning: chainData.resolutionReasoning,
        txHash: '',
      };
    }

    // Get commitments count
    const commitmentsCount = await Commitment.countDocuments({ marketId });

    // Get bets count
    const betsCount = await Bet.countDocuments({ marketId });

    res.json({
      success: true,
      data: {
        ...market,
        commitmentsCount,
        betsCount,
      },
    });
  } catch (error) {
    console.error('Error fetching market:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch market',
    });
  }
});

/**
 * POST /api/markets
 * Create a new market (admin only - requires blockchain transaction)
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, description, expiresAt, category } = req.body;

    // Validation
    if (!title || !description || !expiresAt || category === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: title, description, expiresAt, category',
      });
    }

    // Validate minimum expiration time (15 minutes)
    const expirationTime = new Date(expiresAt).getTime();
    const minExpirationTime = Date.now() + (15 * 60 * 1000); // 15 minutes from now
    
    if (expirationTime < minExpirationTime) {
      return res.status(400).json({
        success: false,
        error: 'Expiration time must be at least 15 minutes from now',
      });
    }

    // This endpoint is for indexing only
    // Actual market creation must happen on-chain first
    // The blockchain event listener will automatically cache it

    res.json({
      success: true,
      message: 'Market creation must be done via smart contract transaction. Use frontend to create markets.',
      note: 'The backend will automatically index the market when MarketCreated event is emitted.',
    });
  } catch (error) {
    console.error('Error creating market:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create market',
    });
  }
});

/**
 * POST /api/markets/:id/commit
 * Index a committed bet (called after on-chain commit)
 */
router.post('/:id/commit', async (req: Request, res: Response) => {
  try {
    const marketId = parseInt(req.params.id);
    const { user, commitHash, amount, txHash } = req.body;

    // Validation
    if (!user || !commitHash || !amount || !txHash) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: user, commitHash, amount, txHash',
      });
    }

    // Check if commitment exists
    const existing = await Commitment.findOne({ marketId, user });
    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'Commitment already exists for this user',
      });
    }

    // Verify on blockchain (optional but recommended)
    try {
      const chainCommitment = await blockchainService.getCommitmentFromChain(marketId, user);
      if (chainCommitment.commitHash !== commitHash) {
        return res.status(400).json({
          success: false,
          error: 'Commit hash does not match blockchain',
        });
      }
    } catch (error) {
      console.error('Could not verify commitment on blockchain:', error);
      // Continue anyway - event listener will sync it
    }

    // Create commitment record (if not already indexed by event listener)
    const commitment = new Commitment({
      marketId,
      user,
      commitHash,
      amount,
      timestamp: new Date(),
      revealed: false,
      txHash,
    });

    await commitment.save();

    res.json({
      success: true,
      message: 'Commitment indexed',
      data: commitment,
    });
  } catch (error) {
    console.error('Error indexing commitment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to index commitment',
    });
  }
});

/**
 * POST /api/markets/:id/reveal
 * Verify and index a revealed bet
 */
router.post('/:id/reveal', async (req: Request, res: Response) => {
  try {
    const marketId = parseInt(req.params.id);
    const { user, outcome, shares, amount, txHash } = req.body;

    // Validation
    if (!user || outcome === undefined || !shares || !amount || !txHash) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: user, outcome, shares, amount, txHash',
      });
    }

    // Check if already revealed
    const existingBet = await Bet.findOne({ marketId, user });
    if (existingBet) {
      return res.status(409).json({
        success: false,
        error: 'Bet already revealed for this user',
      });
    }

    // Verify on blockchain
    try {
      const chainBet = await blockchainService.getBetFromChain(marketId, user);
      if (Number(chainBet.amount) === 0) {
        return res.status(400).json({
          success: false,
          error: 'Bet not found on blockchain',
        });
      }
    } catch (error) {
      console.error('Could not verify bet on blockchain:', error);
    }

    // Update commitment to revealed
    await Commitment.updateOne({ marketId, user }, { $set: { revealed: true } });

    // Create bet record
    const bet = new Bet({
      marketId,
      user,
      outcome,
      shares,
      amount,
      revealedAt: new Date(),
      claimed: false,
      txHash,
    });

    await bet.save();

    // Update market pools (fetch from chain)
    const marketData = await blockchainService.getMarketFromChain(marketId);
    await Market.updateOne(
      { marketId },
      {
        $set: {
          totalPool: marketData.totalPool.toString(),
          yesPool: marketData.yesPool.toString(),
          noPool: marketData.noPool.toString(),
          yesShares: marketData.yesShares.toString(),
          noShares: marketData.noShares.toString(),
          participants: Number(marketData.participants),
        },
      }
    );

    res.json({
      success: true,
      message: 'Bet revealed and indexed',
      data: bet,
    });
  } catch (error) {
    console.error('Error indexing reveal:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to index reveal',
    });
  }
});

/**
 * POST /api/markets/:id/resolve
 * Oracle callback to resolve market (after on-chain resolution)
 */
router.post('/:id/resolve', async (req: Request, res: Response) => {
  try {
    const marketId = parseInt(req.params.id);
    const { outcome, reasoning } = req.body;

    // Validation
    if (outcome === undefined || !reasoning) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: outcome, reasoning',
      });
    }

    // Verify market exists
    const market = await Market.findOne({ marketId });
    if (!market) {
      return res.status(404).json({
        success: false,
        error: 'Market not found',
      });
    }

    // Check if already resolved
    if (market.status === MarketStatus.Resolved) {
      return res.status(409).json({
        success: false,
        error: 'Market already resolved',
      });
    }

    // Verify on blockchain
    const chainMarket = await blockchainService.getMarketFromChain(marketId);
    if (Number(chainMarket.status) !== MarketStatus.Resolved) {
      return res.status(400).json({
        success: false,
        error: 'Market not resolved on blockchain yet',
      });
    }

    // Update market
    await Market.updateOne(
      { marketId },
      {
        $set: {
          status: MarketStatus.Resolved,
          outcome: chainMarket.outcome,
          resolutionReasoning: chainMarket.resolutionReasoning,
        },
      }
    );

    res.json({
      success: true,
      message: 'Market resolution indexed',
      data: {
        marketId,
        outcome: chainMarket.outcome,
        reasoning: chainMarket.resolutionReasoning,
      },
    });
  } catch (error) {
    console.error('Error indexing resolution:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to index resolution',
    });
  }
});

export default router;

