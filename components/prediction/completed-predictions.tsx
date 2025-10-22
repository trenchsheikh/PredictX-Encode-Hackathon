'use client';

import { useState } from 'react';

import {
  CheckCircle,
  XCircle,
  Clock,
  History,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Calendar,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatBNB } from '@/lib/utils';
import type { Prediction } from '@/types/prediction';

interface CompletedPredictionProps {
  prediction: Prediction;
  onViewHistory: (predictionId: string) => void;
}

interface TransactionHistory {
  marketId: number;
  transactions: Array<{
    type: 'commit' | 'reveal' | 'claim' | 'create' | 'resolve';
    userAddress: string;
    amount?: string;
    outcome?: boolean;
    txHash: string;
    timestamp: number;
    status: 'pending' | 'confirmed' | 'failed';
  }>;
  summary: {
    totalTransactions: number;
    totalVolume: string;
    userBets: number;
    userClaims: number;
    marketCreator: string;
  };
}

export function CompletedPrediction({
  prediction,
  onViewHistory,
}: CompletedPredictionProps) {
  const [transactionHistory, setTransactionHistory] =
    useState<TransactionHistory | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchTransactionHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/transactions/market/${prediction.id}`);
      const data = await response.json();

      if (data.success) {
        setTransactionHistory(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch transaction history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = () => {
    if (prediction.status === 'resolved') {
      return prediction.resolution?.outcome === 'yes' ? (
        <CheckCircle className="h-5 w-5 text-green-500" />
      ) : (
        <XCircle className="h-5 w-5 text-red-500" />
      );
    }
    return <Clock className="h-5 w-5 text-yellow-500" />;
  };

  const getStatusText = () => {
    if (prediction.status === 'resolved') {
      return prediction.resolution?.outcome === 'yes' ? 'YES Won' : 'NO Won';
    }
    return 'Expired';
  };

  const getStatusColor = () => {
    if (prediction.status === 'resolved') {
      return prediction.resolution?.outcome === 'yes'
        ? 'bg-green-500/20 text-green-700 border-green-500/30'
        : 'bg-red-500/20 text-red-700 border-red-500/30';
    }
    return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Use the shared formatBNB function from utils

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="line-clamp-2 text-lg font-semibold">
              {prediction.title}
            </CardTitle>
            <div className="mt-2 flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Market #{prediction.id}
              </Badge>
              <Badge className={getStatusColor()}>
                {getStatusIcon()}
                <span className="ml-1">{getStatusText()}</span>
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Market Stats */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-800/50">
            <DollarSign className="mx-auto mb-1 h-4 w-4 text-gray-500" />
            <div className="text-sm font-medium">
              {formatBNB(prediction.totalPool)} BNB
            </div>
            <div className="text-xs text-gray-500">Total Pool</div>
          </div>

          <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-800/50">
            <Users className="mx-auto mb-1 h-4 w-4 text-gray-500" />
            <div className="text-sm font-medium">{prediction.participants}</div>
            <div className="text-xs text-gray-500">Participants</div>
          </div>

          <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-800/50">
            <TrendingUp className="mx-auto mb-1 h-4 w-4 text-green-500" />
            <div className="text-sm font-medium">
              {formatBNB(prediction.yesPool)} BNB
            </div>
            <div className="text-xs text-gray-500">YES Pool</div>
          </div>

          <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-800/50">
            <TrendingDown className="mx-auto mb-1 h-4 w-4 text-red-500" />
            <div className="text-sm font-medium">
              {formatBNB(prediction.noPool)} BNB
            </div>
            <div className="text-xs text-gray-500">NO Pool</div>
          </div>
        </div>

        {/* Resolution Info */}
        {prediction.status === 'resolved' &&
          prediction.resolution?.reasoning && (
            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
              <div className="mb-2 text-sm font-medium text-blue-900 dark:text-blue-100">
                Resolution Reasoning:
              </div>
              <div className="text-sm text-blue-800 dark:text-blue-200">
                {prediction.resolution.reasoning}
              </div>
            </div>
          )}

        {/* Transaction History Summary */}
        {transactionHistory && (
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
            <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Transaction Summary
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
              <div>
                <div className="text-gray-500">Total Transactions</div>
                <div className="font-medium">
                  {transactionHistory.summary.totalTransactions}
                </div>
              </div>
              <div>
                <div className="text-gray-500">Total Volume</div>
                <div className="font-medium">
                  {formatBNB(transactionHistory.summary.totalVolume)} BNB
                </div>
              </div>
              <div>
                <div className="text-gray-500">User Bets</div>
                <div className="font-medium">
                  {transactionHistory.summary.userBets}
                </div>
              </div>
              <div>
                <div className="text-gray-500">Claims</div>
                <div className="font-medium">
                  {transactionHistory.summary.userClaims}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => onViewHistory(prediction.id)}
            variant="outline"
            className="flex-1"
            disabled={loading}
          >
            <History className="mr-2 h-4 w-4" />
            {loading ? 'Loading...' : 'View History'}
          </Button>
        </div>

        {/* Expiration Info */}
        <div className="text-center text-xs text-gray-500">
          <Calendar className="mr-1 inline h-3 w-3" />
          Expired: {formatDate(prediction.expiresAt)}
        </div>
      </CardContent>
    </Card>
  );
}
