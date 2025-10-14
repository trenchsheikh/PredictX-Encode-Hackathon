import { Router, Request, Response } from 'express';
import { marketResolutionService } from '../services/MarketResolutionService';

const router = Router();

/**
 * GET /api/resolution/pending
 * Get markets pending resolution
 */
router.get('/pending', async (req: Request, res: Response) => {
  try {
    const pendingMarkets =
      await marketResolutionService.getPendingResolutions();

    res.json({
      success: true,
      data: {
        markets: pendingMarkets,
        count: pendingMarkets.length,
      },
    });
  } catch (error: any) {
    console.error('Failed to get pending resolutions:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get pending resolutions',
    });
  }
});

/**
 * GET /api/resolution/history
 * Get resolution history
 */
router.get('/history', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const history = await marketResolutionService.getResolutionHistory(limit);

    res.json({
      success: true,
      data: {
        resolutions: history,
        count: history.length,
      },
    });
  } catch (error: any) {
    console.error('Failed to get resolution history:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get resolution history',
    });
  }
});

/**
 * POST /api/resolution/resolve/:marketId
 * Manually resolve a market
 */
router.post('/resolve/:marketId', async (req: Request, res: Response) => {
  try {
    const { marketId } = req.params;
    const { outcome, reasoning, adminKey } = req.body;

    if (!outcome || !reasoning || !adminKey) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: outcome, reasoning, adminKey',
      });
    }

    const result = await marketResolutionService.manualResolve(
      parseInt(marketId),
      outcome === true || outcome === 'true',
      reasoning,
      adminKey
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error(`Failed to resolve market ${req.params.marketId}:`, error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to resolve market',
    });
  }
});

/**
 * POST /api/resolution/trigger
 * Manually trigger resolution check
 */
router.post('/trigger', async (req: Request, res: Response) => {
  try {
    const { adminKey } = req.body;

    if (adminKey !== process.env.ORACLE_ADMIN_KEY) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized: Invalid admin key',
      });
    }

    // Trigger resolution check
    const pendingMarkets =
      await marketResolutionService.getPendingResolutions();
    const results = [];

    for (const market of pendingMarkets) {
      try {
        const result = await marketResolutionService.resolveMarket(market);
        results.push(result);
      } catch (error: any) {
        results.push({
          marketId: market.marketId,
          success: false,
          error: error.message,
        });
      }
    }

    res.json({
      success: true,
      data: {
        processed: results.length,
        results,
      },
    });
  } catch (error: any) {
    console.error('Failed to trigger resolution:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to trigger resolution',
    });
  }
});

export default router;
