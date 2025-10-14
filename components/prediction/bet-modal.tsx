'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, TrendingUp, TrendingDown, Info } from 'lucide-react';
import { formatBNB, calculatePayout } from '@/lib/utils';
import { Prediction } from '@/types/prediction';

interface BetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prediction: Prediction;
  outcome: 'yes' | 'no';
  onConfirm: (amount: number) => Promise<void>;
}

export function BetModal({
  open,
  onOpenChange,
  prediction,
  outcome,
  onConfirm,
}: BetModalProps) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const numAmount = parseFloat(amount) || 0;
  const isYes = outcome === 'yes';
  const currentPrice = isYes ? prediction.yesPrice : prediction.noPrice;
  const estimatedShares = numAmount / currentPrice;
  const potentialPayout = calculatePayout(
    estimatedShares,
    isYes ? prediction.yesShares : prediction.noShares,
    prediction.totalPool
  );
  const roi =
    numAmount > 0 ? ((potentialPayout - numAmount) / numAmount) * 100 : 0;

  const minBet = 0.001;
  const maxBet = 100;
  const userBalance = 10; // Would come from wallet in production

  const validateAmount = (): boolean => {
    if (!amount || numAmount <= 0) {
      setError('Please enter a valid amount');
      return false;
    }
    if (numAmount < minBet) {
      setError(`Minimum bet is ${minBet} BNB`);
      return false;
    }
    if (numAmount > maxBet) {
      setError(`Maximum bet is ${maxBet} BNB`);
      return false;
    }
    if (numAmount > userBalance) {
      setError('Insufficient balance');
      return false;
    }
    setError('');
    return true;
  };

  const handleConfirm = async () => {
    if (!validateAmount()) return;

    setLoading(true);
    setError('');

    try {
      await onConfirm(numAmount);
      setAmount('');
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || 'Failed to place bet');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
    setError('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isYes ? (
              <TrendingUp className="h-5 w-5 text-green-500" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-500" />
            )}
            Betting {isYes ? 'YES' : 'NO'}
          </DialogTitle>
          <DialogDescription className="pt-2 text-left">
            {prediction.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Current Odds */}
          <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
            <span className="text-sm text-muted-foreground">Current Odds</span>
            <div className="flex items-center gap-2">
              <Badge variant={isYes ? 'default' : 'destructive'}>
                {isYes ? 'YES' : 'NO'}
              </Badge>
              <span className="font-semibold">{formatBNB(currentPrice)}</span>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Bet Amount (BNB)</label>
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={e => {
                setAmount(e.target.value);
                setError('');
              }}
              min={minBet}
              max={maxBet}
              step="0.001"
              disabled={loading}
            />

            {/* Quick Amount Buttons */}
            <div className="flex gap-2">
              {[0.01, 0.1, 0.5, 1].map(value => (
                <Button
                  key={value}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAmount(value)}
                  disabled={loading}
                  className="flex-1"
                >
                  {value} BNB
                </Button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-destructive/10 border-destructive/20 flex items-center gap-2 rounded-lg border p-3">
              <AlertCircle className="text-destructive h-4 w-4" />
              <span className="text-destructive text-sm">{error}</span>
            </div>
          )}

          {/* Bet Summary */}
          {numAmount > 0 && !error && (
            <div className="space-y-2 rounded-lg border border-border bg-secondary/30 p-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Estimated Shares</span>
                <span className="font-medium">
                  {estimatedShares.toFixed(4)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Potential Payout</span>
                <span className="font-medium text-green-500">
                  {formatBNB(potentialPayout)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Potential ROI</span>
                <span
                  className={`font-medium ${roi >= 0 ? 'text-green-500' : 'text-red-500'}`}
                >
                  {roi >= 0 ? '+' : ''}
                  {roi.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 text-sm">
                <span className="text-muted-foreground">
                  Platform Fee (10%)
                </span>
                <span className="font-medium">
                  {formatBNB(numAmount * 0.1)}
                </span>
              </div>
            </div>
          )}

          {/* Info Banner */}
          <div className="flex items-start gap-2 rounded-lg border border-blue-500/20 bg-blue-500/10 p-3">
            <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-500" />
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>
                <strong className="text-foreground">Darkpool Betting:</strong>{' '}
                Your bet choice will be hidden until you reveal it after market
                expiration.
              </p>
              <p>
                <strong className="text-foreground">Important:</strong> Save
                your reveal secret! You must reveal within 1 hour after market
                expiration to claim winnings.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={loading || !amount || !!error}
            className={
              isYes
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-red-600 hover:bg-red-700'
            }
          >
            {loading ? 'Placing Bet...' : `Bet ${formatBNB(numAmount)}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
