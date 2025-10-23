'use client';

import { useState, useEffect } from 'react';

import { Clock, ExternalLink } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatBNB } from '@/lib/utils';

interface TransactionHistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  predictionId: string;
  predictionTitle: string;
}

interface Transaction {
  type: 'commit' | 'reveal' | 'claim' | 'create' | 'resolve';
  userAddress: string;
  amount?: string;
  outcome?: boolean;
  shares?: string;
  txHash: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
  gasUsed?: number;
}

interface TransactionHistory {
  marketId: number;
  transactions: Transaction[];
  summary: {
    totalTransactions: number;
    totalVolume: string;
    userBets: number;
    userClaims: number;
    marketCreator: string;
  };
}

export function TransactionHistoryModal({
  open,
  onOpenChange,
  predictionId,
  predictionTitle,
}: TransactionHistoryModalProps) {
  const [history, setHistory] = useState<TransactionHistory | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && predictionId) {
      fetchTransactionHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, predictionId]);

  const fetchTransactionHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/transactions/market/${predictionId}`);
      const data = await response.json();

      if (data.success && data.data) {
        setHistory(data.data);
      } else {
        console.error(
          'Failed to fetch transaction history:',
          data.error || 'Unknown error'
        );
        setHistory(null);
      }
    } catch (error) {
      console.error('Failed to fetch transaction history:', error);
      setHistory(null);
    } finally {
      setLoading(false);
    }
  };

  const _getTransactionIcon = (_type: string) => {
    return null; // Remove all transaction icons
  };

  const _getTransactionColor = (_type: string) => {
    switch (_type) {
      case 'create':
        return 'bg-white/20 text-white border-white/30';
      case 'commit':
        return 'bg-white/20 text-white border-white/30';
      case 'reveal':
        return 'bg-white/20 text-white border-white/30';
      case 'claim':
        return 'bg-white/20 text-white border-white/30';
      case 'resolve':
        return 'bg-white/20 text-white border-white/30';
      default:
        return 'bg-white/20 text-white border-white/30';
    }
  };

  const _getStatusIcon = (_status: string) => {
    return null; // Remove all status icons
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // Use the shared formatBNB function from utils

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] max-w-4xl overflow-y-auto border border-white/20 bg-card p-4 text-foreground shadow-2xl backdrop-blur-md sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground sm:text-2xl">
            Transaction History
          </DialogTitle>
          <div className="text-xs text-muted-foreground sm:text-sm">
            {predictionTitle}
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Clock className="mx-auto mb-2 h-8 w-8 animate-spin text-foreground" />
              <div className="text-sm text-muted-foreground">
                Loading transaction history...
              </div>
            </div>
          </div>
        ) : history ? (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-4">
              <Card className="border-white/20 bg-card backdrop-blur-sm">
                <CardContent className="p-3 text-center sm:p-4">
                  <div
                    className="truncate text-xl font-bold text-foreground sm:text-2xl"
                    title={`${history.summary?.totalTransactions || 0}`}
                  >
                    {history.summary?.totalTransactions || 0}
                  </div>
                  <div className="text-xs text-muted-foreground sm:text-sm">
                    Total Transactions
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/20 bg-card backdrop-blur-sm">
                <CardContent className="p-3 text-center sm:p-4">
                  <div
                    className="truncate text-xl font-bold text-foreground sm:text-2xl"
                    title={`${history.summary?.totalVolume || '0'}`}
                  >
                    {formatBNB(history.summary?.totalVolume || '0')}
                  </div>
                  <div className="text-xs text-muted-foreground sm:text-sm">
                    Total Volume (BNB)
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/20 bg-card backdrop-blur-sm">
                <CardContent className="p-3 text-center sm:p-4">
                  <div
                    className="truncate text-xl font-bold text-foreground sm:text-2xl"
                    title={`${history.summary?.userBets || 0}`}
                  >
                    {history.summary?.userBets || 0}
                  </div>
                  <div className="text-xs text-muted-foreground sm:text-sm">
                    User Bets
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/20 bg-card backdrop-blur-sm">
                <CardContent className="p-3 text-center sm:p-4">
                  <div
                    className="truncate text-xl font-bold text-foreground sm:text-2xl"
                    title={`${history.summary?.userClaims || 0}`}
                  >
                    {history.summary?.userClaims || 0}
                  </div>
                  <div className="text-xs text-muted-foreground sm:text-sm">
                    Claims
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Transaction List */}
            <div className="space-y-2 sm:space-y-3">
              <div className="text-base font-semibold text-foreground sm:text-lg">
                Transaction Details
              </div>
              {history.transactions?.length > 0 ? (
                history.transactions.map((tx, index) => (
                  <Card
                    key={index}
                    className="border-white/20 bg-card backdrop-blur-sm"
                  >
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-center gap-2 sm:gap-3">
                          {_getTransactionIcon(tx.type)}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-foreground">
                                {tx.type.charAt(0).toUpperCase() +
                                  tx.type.slice(1)}{' '}
                                {tx.status.charAt(0).toUpperCase() +
                                  tx.status.slice(1)}
                              </span>
                            </div>
                            <a
                              href={`https://testnet.bscscan.com/tx/${tx.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-1 flex cursor-pointer items-center gap-1 text-sm text-foreground transition-colors hover:text-white"
                            >
                              <ExternalLink className="h-3 w-3" />
                              {formatAddress(tx.userAddress)}
                            </a>
                            <div className="text-xs text-muted-foreground">
                              {formatDate(tx.timestamp)}
                            </div>
                          </div>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center justify-end gap-3 sm:mt-0 sm:text-right">
                          {tx.amount && (
                            <div className="text-sm font-medium text-foreground">
                              {formatBNB(tx.amount)} BNB
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <div>No transactions found</div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            <Clock className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
            <div>No transaction history found</div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
