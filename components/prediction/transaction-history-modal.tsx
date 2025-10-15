'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  ExternalLink,
  Copy,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  TrendingUp,
  Hash,
} from 'lucide-react';

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
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (open && predictionId) {
      fetchTransactionHistory();
    }
  }, [open, predictionId]);

  const fetchTransactionHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/transactions/market/${predictionId}`);
      const data = await response.json();

      if (data.success) {
        setHistory(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch transaction history:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'create':
        return <Hash className="h-4 w-4 text-blue-500" />;
      case 'commit':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'reveal':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'claim':
        return <DollarSign className="h-4 w-4 text-purple-500" />;
      case 'resolve':
        return <TrendingUp className="h-4 w-4 text-orange-500" />;
      default:
        return <Hash className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'create':
        return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
      case 'commit':
        return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
      case 'reveal':
        return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'claim':
        return 'bg-purple-500/20 text-purple-700 border-purple-500/30';
      case 'resolve':
        return 'bg-orange-500/20 text-orange-700 border-orange-500/30';
      default:
        return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'failed':
        return <XCircle className="h-3 w-3 text-red-500" />;
      case 'pending':
        return <Clock className="h-3 w-3 text-yellow-500" />;
      default:
        return <Clock className="h-3 w-3 text-gray-500" />;
    }
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

  const formatBNB = (value: string) => {
    const num = parseFloat(value);
    return num.toFixed(6);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto bg-black p-4 text-white sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white sm:text-2xl">
            Transaction History
          </DialogTitle>
          <div className="text-xs text-gray-400 sm:text-sm">
            {predictionTitle}
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Clock className="mx-auto mb-2 h-8 w-8 animate-spin text-white" />
              <div className="text-sm text-gray-500">
                Loading transaction history...
              </div>
            </div>
          </div>
        ) : history ? (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-4">
              <Card className="border-white/10 bg-black/60">
                <CardContent className="p-3 text-center sm:p-4">
                  <div
                    className="truncate text-xl font-bold text-blue-400 sm:text-2xl"
                    title={`${history.summary.totalTransactions}`}
                  >
                    {history.summary.totalTransactions}
                  </div>
                  <div className="text-xs text-gray-400 sm:text-sm">
                    Total Transactions
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-black/60">
                <CardContent className="p-3 text-center sm:p-4">
                  <div
                    className="truncate text-xl font-bold text-green-400 sm:text-2xl"
                    title={`${history.summary.totalVolume}`}
                  >
                    {formatBNB(history.summary.totalVolume)}
                  </div>
                  <div className="text-xs text-gray-400 sm:text-sm">
                    Total Volume (BNB)
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-black/60">
                <CardContent className="p-3 text-center sm:p-4">
                  <div
                    className="truncate text-xl font-bold text-purple-400 sm:text-2xl"
                    title={`${history.summary.userBets}`}
                  >
                    {history.summary.userBets}
                  </div>
                  <div className="text-xs text-gray-400 sm:text-sm">
                    User Bets
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-black/60">
                <CardContent className="p-3 text-center sm:p-4">
                  <div
                    className="truncate text-xl font-bold text-orange-400 sm:text-2xl"
                    title={`${history.summary.userClaims}`}
                  >
                    {history.summary.userClaims}
                  </div>
                  <div className="text-xs text-gray-400 sm:text-sm">Claims</div>
                </CardContent>
              </Card>
            </div>

            {/* Transaction List */}
            <div className="space-y-2 sm:space-y-3">
              <div className="text-base font-semibold text-white sm:text-lg">
                Transaction Details
              </div>
              {history.transactions.map((tx, index) => (
                <Card
                  key={index}
                  className="border-white/10 bg-black/50 transition-shadow hover:shadow-md"
                >
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-center gap-2 sm:gap-3">
                        {getTransactionIcon(tx.type)}
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge className={getTransactionColor(tx.type)}>
                              {tx.type.toUpperCase()}
                            </Badge>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(tx.status)}
                              <span className="text-xs text-gray-400">
                                {tx.status}
                              </span>
                            </div>
                          </div>
                          <div className="mt-1 text-sm text-gray-300">
                            {formatAddress(tx.userAddress)}
                          </div>
                          <div className="text-xs text-gray-400">
                            {formatDate(tx.timestamp)}
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-3 sm:mt-0 sm:text-right">
                        {tx.amount && (
                          <div className="text-sm font-medium">
                            {formatBNB(tx.amount)} BNB
                          </div>
                        )}
                        {tx.outcome !== undefined && (
                          <div className="text-xs text-gray-500">
                            {tx.outcome ? 'YES' : 'NO'}
                          </div>
                        )}
                        {tx.shares && (
                          <div className="text-xs text-gray-500">
                            {formatBNB(tx.shares)} shares
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Transaction Hash */}
                    <div className="mt-3 flex flex-col gap-2 border-t border-white/10 pt-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2">
                        <code className="max-w-[140px] truncate rounded border border-white/10 bg-gray-900 px-2 py-1 text-xs text-gray-200 sm:max-w-none">
                          {tx.txHash.slice(0, 6)}...{tx.txHash.slice(-6)}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(tx.txHash, tx.txHash)}
                          className="h-6 w-6 p-0 text-gray-300 hover:text-white"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        {copied === tx.txHash && (
                          <span className="text-xs text-green-400">
                            Copied!
                          </span>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          window.open(
                            `https://testnet.bscscan.com/tx/${tx.txHash}`,
                            '_blank'
                          )
                        }
                        className="h-6 w-6 p-0 text-gray-300 hover:text-white"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">
            <Clock className="mx-auto mb-2 h-8 w-8 text-gray-400" />
            <div>No transaction history found</div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
