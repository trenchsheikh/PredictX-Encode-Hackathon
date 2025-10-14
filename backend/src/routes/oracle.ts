import { Router, Request, Response } from 'express';
import { oracleService } from '../services/OracleService';

const router = Router();

/**
 * GET /api/oracle/prices
 * Get all supported cryptocurrency prices
 */
router.get('/prices', async (req: Request, res: Response) => {
  try {
    const prices = await oracleService.getAllPrices();

    res.json({
      success: true,
      data: {
        prices,
        timestamp: Date.now(),
        source: 'CoinGecko API',
      },
    });
  } catch (error: any) {
    console.error('Failed to fetch prices:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch cryptocurrency prices',
    });
  }
});

/**
 * GET /api/oracle/prices/:cryptoId
 * Get price for a specific cryptocurrency
 */
router.get('/prices/:cryptoId', async (req: Request, res: Response) => {
  try {
    const { cryptoId } = req.params;
    const price = await oracleService.getPrice(cryptoId);

    res.json({
      success: true,
      data: price,
    });
  } catch (error: any) {
    console.error(`Failed to fetch price for ${req.params.cryptoId}:`, error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch cryptocurrency price',
    });
  }
});

/**
 * GET /api/oracle/supported
 * Get list of supported cryptocurrencies
 */
router.get('/supported', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      cryptocurrencies: Object.entries(oracleService.SUPPORTED_CRYPTOS).map(
        ([id, info]) => ({
          ...info,
          id,
        })
      ),
    },
  });
});

/**
 * POST /api/oracle/verify
 * Verify a prediction condition
 */
router.post('/verify', async (req: Request, res: Response) => {
  try {
    const { crypto, targetPrice, operator, deadline } = req.body;

    if (!crypto || !targetPrice || !operator) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: crypto, targetPrice, operator',
      });
    }

    const result = await oracleService.verifyPrediction({
      crypto,
      targetPrice: parseFloat(targetPrice),
      operator,
      deadline: deadline || Date.now(),
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Verification failed:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Verification failed',
    });
  }
});

/**
 * POST /api/oracle/verify-market
 * Verify a market by parsing its title
 */
router.post('/verify-market', async (req: Request, res: Response) => {
  try {
    const { title, deadline } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: title',
      });
    }

    const result = await oracleService.verifyMarket(
      title,
      deadline || Date.now()
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Market verification failed:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Market verification failed',
    });
  }
});

/**
 * POST /api/oracle/resolve-manual
 * Admin override for manual resolution
 */
router.post('/resolve-manual', async (req: Request, res: Response) => {
  try {
    const { marketId, outcome, reasoning, adminKey } = req.body;

    // Simple admin key check (in production, use proper authentication)
    if (adminKey !== process.env.ORACLE_ADMIN_KEY) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized: Invalid admin key',
      });
    }

    if (marketId === undefined || outcome === undefined || !reasoning) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: marketId, outcome, reasoning',
      });
    }

    const result = await oracleService.manualResolve(
      parseInt(marketId),
      outcome === true || outcome === 'true',
      reasoning
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Manual resolution failed:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Manual resolution failed',
    });
  }
});

/**
 * POST /api/oracle/compare-market-caps
 * Compare market caps of two cryptocurrencies
 */
router.post('/compare-market-caps', async (req: Request, res: Response) => {
  try {
    const { crypto1, crypto2 } = req.body;

    if (!crypto1 || !crypto2) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: crypto1, crypto2',
      });
    }

    const result = await oracleService.compareMarketCaps(crypto1, crypto2);

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Market cap comparison failed:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Market cap comparison failed',
    });
  }
});

/**
 * POST /api/oracle/parse-prediction
 * Parse a prediction title to extract condition
 */
router.post('/parse-prediction', (req: Request, res: Response) => {
  try {
    const { title, deadline } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: title',
      });
    }

    const condition = oracleService.parsePredictionTitle(
      title,
      deadline || Date.now()
    );

    if (!condition) {
      return res.json({
        success: false,
        error: 'Unable to parse prediction condition from title',
      });
    }

    res.json({
      success: true,
      data: condition,
    });
  } catch (error: any) {
    console.error('Parsing failed:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Parsing failed',
    });
  }
});

export default router;
