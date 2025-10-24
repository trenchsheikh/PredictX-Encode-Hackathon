'use client';

import { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';

import { TrendingUp, TrendingDown, Shield, AlertCircle } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { InlineError } from '@/components/ui/error-display';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatBNB, calculatePayout } from '@/lib/utils';
import type { Prediction } from '@/types/prediction';
import { useRGCheck } from '@/hooks/use-rg-check';
import { generateIdCommitment } from '@/lib/concordium-service';
import { ConcordiumVerifyModal } from '@/components/rg/concordium-verify-modal';

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
  const { user } = usePrivy();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [idCommitment, setIdCommitment] = useState<string | null>(null);

  // Get Solana wallet address
  const solanaAccount = user?.linkedAccounts.find(
    (account) => account.type === 'wallet' && account.chain === 'solana'
  );

  // Generate identity commitment if user is connected
  const userIdCommitment = user && solanaAccount?.address
    ? generateIdCommitment(user.id, solanaAccount.address)
    : null;

  // Initialize RG check hook
  const { checkBet, recordBet, checking } = useRGCheck({
    idCommitment: idCommitment || userIdCommitment || undefined,
    userAddress: solanaAccount?.address,
  });

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
    setError(null);
    return true;
  };

  const handleConfirm = async () => {
    if (!validateAmount()) return;

    setLoading(true);
    setError(null);

    try {
      // Step 1: Check RG limits
      const rgCheck = await checkBet(numAmount);

      if (!rgCheck.allowed) {
        setError(rgCheck.reason || 'Bet not allowed');
        
        // If identity verification is required, show verification modal
        if (rgCheck.reason?.includes('Identity verification')) {
          setShowVerifyModal(true);
        }
        
        return;
      }

      // Step 2: If RG check passed, proceed with bet
      await onConfirm(numAmount);

      // Step 3: Record bet in RG system
      await recordBet(numAmount);

      setAmount('');
      onOpenChange(false);
    } catch (err: unknown) {
      // Store the actual error object so we can display user-friendly message
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleVerified = (newIdCommitment: string) => {
    setIdCommitment(newIdCommitment);
    setShowVerifyModal(false);
    setError(null);
  };

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
    setError(null);
  };

  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border border-border bg-card shadow-2xl backdrop-blur-md sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-heading flex items-center gap-2 text-white">
            {isYes ? (
              <TrendingUp className="h-5 w-5 text-white" />
            ) : (
              <TrendingDown className="h-5 w-5 text-white" />
            )}
            Betting {isYes ? 'YES' : 'NO'}
          </DialogTitle>
          <DialogDescription className="pt-2 text-left text-gray-300">
            {prediction.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {/* Current Odds */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-muted p-3">
            <span className="text-sm text-gray-400">Current Odds</span>
            <div className="flex items-center gap-2">
              <Badge variant="success" className="text-xs">
                {isYes ? 'YES' : 'NO'}
              </Badge>
              <span className="font-semibold text-white">
                {formatBNB(currentPrice)}
              </span>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">
              Bet Amount (BNB)
            </label>
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={e => {
                setAmount(e.target.value);
                setError(null);
              }}
              min={minBet}
              max={maxBet}
              step="0.001"
              disabled={loading}
              className="border-border bg-input text-foreground transition-all duration-300 placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-primary/20"
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
                  className="flex-1 border-border bg-secondary px-2 py-1 text-xs text-secondary-foreground transition-all duration-300 hover:border-primary/50 hover:bg-primary/10"
                >
                  {value} BNB
                </Button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && <InlineError error={error} />}

          {/* Bet Summary */}
          {numAmount > 0 && !error && (
            <div className="space-y-2 rounded-xl border border-border bg-muted p-3">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Bet Summary
              </h4>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-gray-400">Shares</span>
                  <span className="font-mono text-sm font-medium text-white">
                    {estimatedShares.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-gray-400">Amount</span>
                  <span className="font-mono text-sm font-medium text-white">
                    {formatBNB(numAmount)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-gray-400">Price</span>
                  <span className="font-mono text-sm font-medium text-white">
                    {formatBNB(currentPrice)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 border-t border-gray-600/30 pt-2.5">
                  <span className="text-sm font-medium text-gray-300">
                    Profit
                  </span>
                  <span className="font-mono text-sm font-semibold text-white">
                    {formatBNB(potentialPayout)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-gray-400">ROI</span>
                  <span
                    className={`font-mono text-sm font-medium ${roi >= 0 ? 'text-white' : 'text-red-400'}`}
                  >
                    {roi >= 0 ? '+' : ''}
                    {roi.toFixed(1)}%
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 border-t border-gray-600/30 pt-2.5">
                  <span className="text-xs text-gray-500">
                    Platform Fee (1.5%)
                  </span>
                  <span className="font-mono text-xs font-medium text-gray-400">
                    {formatBNB(numAmount * 0.015)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Info Banner */}
          <div className="flex items-start gap-2 rounded-xl border border-white/20 bg-white/10 p-3">
            <div className="space-y-1 text-xs text-gray-300">
              <p>
                Your bet choice will be hidden until you reveal it after market
                expiration. Save your reveal secret! You must reveal within 1
                hour after market expiration to claim winnings.
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
            className="border-border bg-secondary px-2 py-1 text-xs text-secondary-foreground transition-all duration-300 hover:border-border/80 hover:bg-secondary/80"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={loading || !amount || !!error}
            className="bg-white px-2 py-1 text-xs font-semibold text-black shadow-lg transition-all duration-200 hover:bg-white/90 hover:shadow-white/25"
          >
            {loading ? 'Placing Bet...' : `Bet ${formatBNB(numAmount)}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    
    <ConcordiumVerifyModal
      open={showVerifyModal}
      onOpenChange={setShowVerifyModal}
      onVerified={handleVerified}
    />
  </>
  );
}
