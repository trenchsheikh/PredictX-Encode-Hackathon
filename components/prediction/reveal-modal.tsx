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
import { Badge } from '@/components/ui/badge';
import {
  AlertCircle,
  Eye,
  Clock,
  CheckCircle2,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { formatBNB, formatTimeRemaining } from '@/lib/utils';
import { Prediction } from '@/types/prediction';
import { CommitData, getRevealDeadline, canReveal } from '@/lib/commit-reveal';
import { ethers } from 'ethers';

interface RevealModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prediction: Prediction;
  commitData: CommitData;
  onConfirm: () => Promise<void>;
}

export function RevealModal({
  open,
  onOpenChange,
  prediction,
  commitData,
  onConfirm,
}: RevealModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const revealDeadline = getRevealDeadline(prediction.expiresAt);
  const canRevealNow = canReveal(prediction.expiresAt);
  const timeRemaining = formatTimeRemaining(revealDeadline - Date.now());
  const isYes = commitData.outcome === 'yes';

  const handleConfirm = async () => {
    if (!canRevealNow) {
      setError('Reveal window has closed');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onConfirm();
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || 'Failed to reveal bet');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportRevealData = () => {
    const data = {
      marketId: prediction.id,
      marketTitle: prediction.title,
      outcome: commitData.outcome,
      amount: ethers.formatEther(commitData.amount),
      salt: commitData.salt,
      commitHash: commitData.commitHash,
      timestamp: new Date(commitData.timestamp).toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reveal-data-market-${prediction.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-white/10 bg-gradient-to-br from-gray-900/95 via-gray-800/90 to-gray-900/95 p-4 shadow-2xl backdrop-blur-md sm:max-w-[550px] sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Eye className="h-5 w-5 text-yellow-500" />
            Reveal Your Bet
          </DialogTitle>
          <DialogDescription className="pt-2 text-left text-gray-300">
            {prediction.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Reveal Deadline */}
          <div
            className={`flex items-center justify-between rounded-lg p-3 ${
              canRevealNow
                ? 'border border-green-500/30 bg-green-500/20'
                : 'border border-red-500/30 bg-red-500/20'
            }`}
          >
            <div className="flex items-center gap-2">
              <Clock
                className={`h-4 w-4 ${canRevealNow ? 'text-green-500' : 'text-red-500'}`}
              />
              <span className="text-sm font-medium text-white">
                {canRevealNow ? 'Reveal window open' : 'Reveal window closed'}
              </span>
            </div>
            <span
              className={`text-sm font-semibold text-white ${
                canRevealNow ? 'bg-green-500/20' : 'bg-red-500/20'
              } rounded px-2 py-1`}
            >
              {canRevealNow ? timeRemaining : 'Expired'}
            </span>
          </div>

          {/* Bet Details */}
          <div className="space-y-2 rounded-lg border border-white/10 bg-gradient-to-r from-gray-800/60 to-gray-700/40 p-3 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Your Bet</span>
              <Badge
                variant={isYes ? 'default' : 'destructive'}
                className="text-xs"
              >
                {isYes ? 'YES' : 'NO'}
              </Badge>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Amount Committed</span>
              <span className="font-medium text-white">
                {formatBNB(parseFloat(ethers.formatEther(commitData.amount)))}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Date and Time</span>
              <span className="font-medium text-white">
                {new Date(commitData.timestamp).toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Market Status</span>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {prediction.status}
                </Badge>
                {prediction.status === 'resolved' && (
                  <>
                    <span className="text-gray-400">Outcome:</span>
                    <Badge
                      variant={
                        prediction.resolution?.outcome === 'yes'
                          ? 'default'
                          : 'destructive'
                      }
                      className="text-xs"
                    >
                      {prediction.resolution?.outcome?.toUpperCase()}
                    </Badge>
                    {prediction.resolution?.outcome === commitData.outcome ? (
                      <span className="flex items-center gap-1 text-green-500">
                        <CheckCircle2 className="h-4 w-4" />
                        Won
                      </span>
                    ) : (
                      <span className="text-gray-400">Lost</span>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="border-t border-gray-700 pt-2">
              <div className="mb-2 flex items-start justify-between gap-2">
                <span className="text-xs text-gray-400">Commit Hash</span>
                <button
                  onClick={() => copyToClipboard(commitData.commitHash)}
                  className="flex items-center gap-1 rounded bg-gray-800 px-2 py-1 text-xs text-gray-400 hover:text-white"
                >
                  {copied ? (
                    <CheckCircle2 className="h-3 w-3" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <code className="block break-all rounded bg-gray-800 px-2 py-1 text-xs text-gray-300">
                {commitData.commitHash}
              </code>
            </div>
          </div>

          {/* Warning/Info */}
          {!canRevealNow ? (
            <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/20 p-3">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
              <div className="space-y-2 text-xs text-gray-300">
                <p className="font-semibold text-white">
                  Reveal window has closed
                </p>
                <p>
                  You can no longer reveal your bet. If you didn't reveal in
                  time, your bet amount may be eligible for refund depending on
                  the market rules.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2 rounded-lg border border-blue-500/30 bg-blue-500/20 p-3">
              <div className="space-y-2 text-xs text-gray-300">
                <p>
                  <strong className="text-white">
                    What happens when you reveal:
                  </strong>
                </p>
                <ul className="ml-2 list-inside list-disc space-y-1">
                  <li>Your bet outcome and amount will be publicly visible</li>
                  <li>Your bet will be verified against your commit hash</li>
                  <li>
                    If the market is resolved and you won, you can claim your
                    winnings
                  </li>
                  <li>
                    You must reveal before the deadline to be eligible for
                    winnings
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/20 p-3">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-500">{error}</span>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={exportRevealData}
            className="w-full border-white/10 bg-white/5 text-white transition-all duration-300 hover:border-white/20 hover:bg-white/10 sm:w-auto"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <div className="flex w-full gap-2 sm:w-auto">
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
              disabled={loading || !canRevealNow}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 font-semibold text-black shadow-lg hover:from-yellow-500 hover:to-yellow-700 hover:shadow-xl disabled:opacity-50"
            >
              {loading ? 'Revealing...' : 'Reveal Bet'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
