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
      <DialogContent className="border border-white/10 bg-gradient-to-br from-gray-900/95 via-gray-800/90 to-gray-900/95 shadow-2xl backdrop-blur-md sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-heading flex items-center gap-2 text-white">
            {isYes ? (
              <TrendingUp className="h-5 w-5 text-green-400" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-400" />
            )}
            Betting {isYes ? 'YES' : 'NO'}
          </DialogTitle>
          <DialogDescription className="pt-2 text-left text-gray-300">
            {prediction.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Current Odds */}
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-gradient-to-r from-gray-800/60 to-gray-700/40 p-4 backdrop-blur-sm">
            <span className="text-sm text-gray-400">Current Odds</span>
            <div className="flex items-center gap-2">
              <Badge
                variant={isYes ? 'success' : 'destructive'}
                className="text-xs"
              >
                {isYes ? 'YES' : 'NO'}
              </Badge>
              <span className="font-semibold text-white">
                {formatBNB(currentPrice)}
              </span>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-white">
              Bet Amount (BNB)
            </label>
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
              className="border-white/10 bg-white/5 text-white backdrop-blur-sm transition-all duration-300 placeholder:text-gray-400 focus:border-yellow-400/50 focus:ring-yellow-400/20"
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
                  className="flex-1 border-white/10 bg-white/5 text-white transition-all duration-300 hover:border-yellow-400/50 hover:bg-yellow-400/10"
                >
                  {value} BNB
                </Button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <span className="text-sm text-red-400">{error}</span>
            </div>
          )}

          {/* Bet Summary */}
          {numAmount > 0 && !error && (
            <div className="space-y-3 rounded-xl border border-white/10 bg-gradient-to-r from-gray-800/60 to-gray-700/40 p-4 backdrop-blur-sm">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Estimated Shares</span>
                <span className="font-medium text-white">
                  {estimatedShares.toFixed(4)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Potential Payout</span>
                <span className="font-medium text-green-400">
                  {formatBNB(potentialPayout)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Potential ROI</span>
                <span
                  className={`font-medium ${roi >= 0 ? 'text-green-400' : 'text-red-400'}`}
                >
                  {roi >= 0 ? '+' : ''}
                  {roi.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-600/50 pt-2 text-sm">
                <span className="text-gray-400">Platform Fee (1.5%)</span>
                <span className="font-medium text-white">
                  {formatBNB(numAmount * 0.015)}
                </span>
              </div>
            </div>
          )}

          {/* Info Banner */}
          <div className="flex items-start gap-2 rounded-xl border border-blue-500/20 bg-blue-500/10 p-4">
            <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-400" />
            <div className="space-y-1 text-xs text-gray-300">
              <p>
                <strong className="text-white">Darkpool Betting:</strong> Your
                bet choice will be hidden until you reveal it after market
                expiration.
              </p>
              <p>
                <strong className="text-white">Important:</strong> Save your
                reveal secret! You must reveal within 1 hour after market
                expiration to claim winnings.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="border-white/10 bg-white/5 text-white transition-all duration-300 hover:border-white/20 hover:bg-white/10"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={loading || !amount || !!error}
            className={`font-semibold transition-all duration-200 ${
              isYes
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:from-green-600 hover:to-green-700 hover:shadow-green-500/25'
                : 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:from-red-600 hover:to-red-700 hover:shadow-red-500/25'
            }`}
          >
            {loading ? 'Placing Bet...' : `Bet ${formatBNB(numAmount)}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
