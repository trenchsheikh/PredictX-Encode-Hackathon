'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  XCircle,
  ExternalLink,
  Copy
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface PayoutDisplayProps {
  marketId: string;
  title: string;
  outcome: boolean | null; // null = not resolved yet
  userOutcome: 'yes' | 'no';
  userShares: string;
  totalWinningShares: string;
  totalPool: string;
  platformFee: number; // percentage
  userPayout: string;
  claimed: boolean;
  onClaim: () => void;
  txHash?: string;
  className?: string;
}

export function PayoutDisplay({
  marketId,
  title,
  outcome,
  userOutcome,
  userShares,
  totalWinningShares,
  totalPool,
  platformFee,
  userPayout,
  claimed,
  onClaim,
  txHash,
  className
}: PayoutDisplayProps) {
  const [copied, setCopied] = useState(false);

  const isWinner = outcome !== null && (
    (outcome && userOutcome === 'yes') || 
    (!outcome && userOutcome === 'no')
  );

  const formatBNB = (value: string) => {
    const num = parseFloat(value);
    return num.toFixed(6);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getOutcomeIcon = () => {
    if (outcome === null) return <Clock className="h-5 w-5 text-yellow-500" />;
    return outcome ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    );
  };

  const getOutcomeText = () => {
    if (outcome === null) return 'Pending Resolution';
    return outcome ? 'YES Won' : 'NO Won';
  };

  const getOutcomeColor = () => {
    if (outcome === null) return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
    return outcome ? 'bg-green-500/20 text-green-700 border-green-500/30' : 'bg-red-500/20 text-red-700 border-red-500/30';
  };

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold line-clamp-2">
              {title}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                Market #{marketId}
              </Badge>
              <Badge className={getOutcomeColor()}>
                {getOutcomeIcon()}
                <span className="ml-1">{getOutcomeText()}</span>
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Your Bet */}
        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Your Bet
            </span>
            <Badge 
              variant={userOutcome === 'yes' ? 'default' : 'secondary'}
              className={userOutcome === 'yes' ? 'bg-green-500' : 'bg-red-500'}
            >
              {userOutcome === 'yes' ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {userOutcome.toUpperCase()}
            </Badge>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {formatBNB(userShares)} shares
          </div>
        </div>

        {/* Resolution Status */}
        {outcome !== null && (
          <div className="space-y-3">
            {/* Market Outcome */}
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <span className="text-sm font-medium">Market Outcome:</span>
              <div className="flex items-center gap-2">
                {outcome ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className="font-semibold">{outcome ? 'YES' : 'NO'}</span>
              </div>
            </div>

            {/* Payout Calculation */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Payout Calculation
              </div>
              
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Pool:</span>
                  <span>{formatBNB(totalPool)} BNB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Your Shares:</span>
                  <span>{formatBNB(userShares)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Winning Shares:</span>
                  <span>{formatBNB(totalWinningShares)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Platform Fee ({platformFee}%):</span>
                  <span>-{formatBNB((parseFloat(userPayout) * platformFee / 100).toString())} BNB</span>
                </div>
                <div className="border-t pt-1">
                  <div className="flex justify-between font-semibold">
                    <span>Your Payout:</span>
                    <span className="text-green-600 dark:text-green-400">
                      {formatBNB(userPayout)} BNB
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-2">
              {isWinner ? (
                <Button
                  onClick={onClaim}
                  disabled={claimed}
                  className={cn(
                    'w-full',
                    claimed 
                      ? 'bg-gray-500 hover:bg-gray-500' 
                      : 'bg-green-600 hover:bg-green-700'
                  )}
                >
                  {claimed ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Claimed
                    </>
                  ) : (
                    <>
                      <DollarSign className="h-4 w-4 mr-2" />
                      Claim {formatBNB(userPayout)} BNB
                    </>
                  )}
                </Button>
              ) : (
                <div className="text-center py-3 text-gray-500 dark:text-gray-400">
                  <XCircle className="h-8 w-8 mx-auto mb-2 text-red-500" />
                  <div className="text-sm">Your bet did not win</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Transaction Hash */}
        {txHash && (
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Transaction:
              </span>
              <div className="flex items-center gap-2">
                <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {txHash.slice(0, 8)}...{txHash.slice(-8)}
                </code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(txHash)}
                  className="h-6 w-6 p-0"
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => window.open(`https://testnet.bscscan.com/tx/${txHash}`, '_blank')}
                  className="h-6 w-6 p-0"
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Pending Resolution */}
        {outcome === null && (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            <Clock className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
            <div className="text-sm">Waiting for market resolution...</div>
            <div className="text-xs mt-1">
              Resolution will be automatic using oracle data
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
