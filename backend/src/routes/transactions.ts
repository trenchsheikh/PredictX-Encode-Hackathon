import { Router, Request, Response } from 'express';
import { transactionHistoryService } from '../services/TransactionHistoryService';

const router = Router();

/**
 * GET /api/transactions/market/:marketId
 * Get transaction history for a specific market
 */
router.get('/market/:marketId', async (req: Request, res: Response) => {
  try {
    const { marketId } = req.params;
    const history = await transactionHistoryService.getMarketTransactionHistory(
      parseInt(marketId)
    );

    res.json({
      success: true,
      data: history,
    });
  } catch (error: any) {
    console.error(
      `Failed to get transaction history for market ${req.params.marketId}:`,
      error
    );
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get transaction history',
    });
  }
});

/**
 * GET /api/transactions/user/:address
 * Get transaction history for a specific user
 */
router.get('/user/:address', async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;

    const transactions =
      await transactionHistoryService.getUserTransactionHistory(address, limit);

    res.json({
      success: true,
      data: {
        transactions,
        count: transactions.length,
      },
    });
  } catch (error: any) {
    console.error(`Failed to get user transaction history:`, error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get user transaction history',
    });
  }
});

/**
 * GET /api/transactions/recent
 * Get recent transactions across all markets
 */
router.get('/recent', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const transactions =
      await transactionHistoryService.getRecentTransactions(limit);

    res.json({
      success: true,
      data: {
        transactions,
        count: transactions.length,
      },
    });
  } catch (error: any) {
    console.error('Failed to get recent transactions:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get recent transactions',
    });
  }
});

/**
 * GET /api/transactions/summary/:marketId
 * Get transaction summary for a market
 */
router.get('/summary/:marketId', async (req: Request, res: Response) => {
  try {
    const { marketId } = req.params;
    const summary = await transactionHistoryService.getTransactionSummary(
      parseInt(marketId)
    );

    res.json({
      success: true,
      data: {
        marketId: parseInt(marketId),
        summary,
      },
    });
  } catch (error: any) {
    console.error(
      `Failed to get transaction summary for market ${req.params.marketId}:`,
      error
    );
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get transaction summary',
    });
  }
});

/**
 * GET /api/transactions/:txHash
 * Get transaction by hash
 */
router.get('/:txHash', async (req: Request, res: Response) => {
  try {
    const { txHash } = req.params;
    const transaction =
      await transactionHistoryService.getTransactionByHash(txHash);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found',
      });
    }

    res.json({
      success: true,
      data: transaction,
    });
  } catch (error: any) {
    console.error(`Failed to get transaction ${req.params.txHash}:`, error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get transaction',
    });
  }
});

export default router;
