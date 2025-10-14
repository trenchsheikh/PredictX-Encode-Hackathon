import { Transaction, ITransaction } from '../models/Transaction';
import { ethers } from 'ethers';

export interface TransactionHistory {
  marketId: number;
  transactions: ITransaction[];
  summary: {
    totalTransactions: number;
    totalVolume: string;
    userBets: number;
    userClaims: number;
    marketCreator: string;
  };
}

export interface TransactionSummary {
  type: string;
  count: number;
  totalAmount: string;
  totalGasUsed: number;
  successRate: number;
}

class TransactionHistoryService {
  /**
   * Record a new transaction
   */
  async recordTransaction(
    marketId: number,
    userAddress: string,
    type: 'commit' | 'reveal' | 'claim' | 'create' | 'resolve',
    txHash: string,
    blockNumber: number,
    timestamp: number,
    additionalData?: {
      amount?: string;
      outcome?: boolean;
      shares?: string;
      gasUsed?: number;
      gasPrice?: string;
    }
  ): Promise<ITransaction> {
    try {
      const transaction = new Transaction({
        marketId,
        userAddress,
        type,
        txHash,
        blockNumber,
        timestamp,
        status: 'confirmed',
        ...additionalData,
      });

      await transaction.save();
      console.log(`📝 Recorded ${type} transaction: ${txHash}`);

      return transaction;
    } catch (error) {
      console.error('❌ Failed to record transaction:', error);
      throw error;
    }
  }

  /**
   * Get transaction history for a specific market
   */
  async getMarketTransactionHistory(
    marketId: number
  ): Promise<TransactionHistory> {
    try {
      const transactions = (await Transaction.find({ marketId })
        .sort({ timestamp: -1 })
        .lean()) as any[];

      // Calculate summary
      const totalVolume = transactions
        .filter(tx => tx.amount)
        .reduce((sum, tx) => sum + parseFloat(tx.amount || '0'), 0)
        .toString();

      const userBets = transactions.filter(
        tx => tx.type === 'commit' || tx.type === 'reveal'
      ).length;

      const userClaims = transactions.filter(tx => tx.type === 'claim').length;

      const marketCreator =
        transactions.find(tx => tx.type === 'create')?.userAddress || '';

      return {
        marketId,
        transactions,
        summary: {
          totalTransactions: transactions.length,
          totalVolume,
          userBets,
          userClaims,
          marketCreator,
        },
      };
    } catch (error) {
      console.error(
        `❌ Failed to get transaction history for market ${marketId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Get transaction history for a specific user
   */
  async getUserTransactionHistory(
    userAddress: string,
    limit: number = 50
  ): Promise<ITransaction[]> {
    try {
      return (await Transaction.find({ userAddress })
        .sort({ timestamp: -1 })
        .limit(limit)
        .lean()) as any[];
    } catch (error) {
      console.error(`❌ Failed to get user transaction history:`, error);
      throw error;
    }
  }

  /**
   * Get transaction summary statistics
   */
  async getTransactionSummary(marketId: number): Promise<TransactionSummary[]> {
    try {
      const transactions = await Transaction.find({ marketId }).lean();

      const summaryMap = new Map<
        string,
        {
          count: number;
          totalAmount: number;
          totalGasUsed: number;
          successCount: number;
        }
      >();

      transactions.forEach(tx => {
        const key = tx.type;
        if (!summaryMap.has(key)) {
          summaryMap.set(key, {
            count: 0,
            totalAmount: 0,
            totalGasUsed: 0,
            successCount: 0,
          });
        }

        const summary = summaryMap.get(key)!;
        summary.count++;
        summary.totalAmount += parseFloat(tx.amount || '0');
        summary.totalGasUsed += tx.gasUsed || 0;
        if (tx.status === 'confirmed') summary.successCount++;
      });

      return Array.from(summaryMap.entries()).map(([type, data]) => ({
        type,
        count: data.count,
        totalAmount: data.totalAmount.toString(),
        totalGasUsed: data.totalGasUsed,
        successRate:
          data.count > 0 ? (data.successCount / data.count) * 100 : 0,
      }));
    } catch (error) {
      console.error(`❌ Failed to get transaction summary:`, error);
      throw error;
    }
  }

  /**
   * Update transaction status
   */
  async updateTransactionStatus(
    txHash: string,
    status: 'pending' | 'confirmed' | 'failed',
    gasUsed?: number
  ): Promise<void> {
    try {
      await Transaction.updateOne(
        { txHash },
        {
          status,
          ...(gasUsed && { gasUsed }),
        }
      );
    } catch (error) {
      console.error(`❌ Failed to update transaction status:`, error);
      throw error;
    }
  }

  /**
   * Get recent transactions across all markets
   */
  async getRecentTransactions(limit: number = 20): Promise<ITransaction[]> {
    try {
      return (await Transaction.find()
        .sort({ timestamp: -1 })
        .limit(limit)
        .lean()) as any[];
    } catch (error) {
      console.error('❌ Failed to get recent transactions:', error);
      throw error;
    }
  }

  /**
   * Get transaction by hash
   */
  async getTransactionByHash(txHash: string): Promise<ITransaction | null> {
    try {
      return (await Transaction.findOne({ txHash }).lean()) as any;
    } catch (error) {
      console.error('❌ Failed to get transaction by hash:', error);
      throw error;
    }
  }
}

export const transactionHistoryService = new TransactionHistoryService();
