"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Eye, Clock, CheckCircle2, Copy, ExternalLink } from 'lucide-react';
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

export function RevealModal({ open, onOpenChange, prediction, commitData, onConfirm }: RevealModalProps) {
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
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reveal-data-market-${prediction.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" />
            Reveal Your Bet
          </DialogTitle>
          <DialogDescription className="text-left pt-2">
            {prediction.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Reveal Deadline */}
          <div className={`flex items-center justify-between p-3 rounded-lg ${
            canRevealNow ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'
          }`}>
            <div className="flex items-center gap-2">
              <Clock className={`w-4 h-4 ${canRevealNow ? 'text-green-500' : 'text-red-500'}`} />
              <span className="text-sm font-medium">
                {canRevealNow ? 'Reveal window open' : 'Reveal window closed'}
              </span>
            </div>
            <span className={`text-sm font-semibold ${canRevealNow ? 'text-green-500' : 'text-red-500'}`}>
              {canRevealNow ? timeRemaining : 'Expired'}
            </span>
          </div>

          {/* Bet Details */}
          <div className="space-y-3 p-4 bg-secondary/30 rounded-lg border border-border">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Your Bet</span>
              <Badge variant={isYes ? "default" : "destructive"} className="text-sm">
                {isYes ? 'YES' : 'NO'}
              </Badge>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-medium">{formatBNB(parseFloat(ethers.formatEther(commitData.amount)))}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Committed</span>
              <span className="font-medium">
                {new Date(commitData.timestamp).toLocaleString()}
              </span>
            </div>
            
            <div className="pt-2 border-t border-border">
              <div className="flex justify-between items-start gap-2 mb-2">
                <span className="text-xs text-muted-foreground">Commit Hash</span>
                <button
                  onClick={() => copyToClipboard(commitData.commitHash)}
                  className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
                >
                  {copied ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <code className="text-xs bg-secondary px-2 py-1 rounded block break-all">
                {commitData.commitHash}
              </code>
            </div>
          </div>

          {/* Market Status */}
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Market Status</span>
              <Badge variant="outline">{prediction.status}</Badge>
            </div>
            {prediction.status === 'resolved' && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Outcome:</span>
                <Badge variant={prediction.resolution?.outcome === 'yes' ? "default" : "destructive"}>
                  {prediction.resolution?.outcome?.toUpperCase()}
                </Badge>
                {prediction.resolution?.outcome === commitData.outcome ? (
                  <span className="text-green-500 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    You won!
                  </span>
                ) : (
                  <span className="text-muted-foreground">You lost</span>
                )}
              </div>
            )}
          </div>

          {/* Warning/Info */}
          {!canRevealNow ? (
            <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-muted-foreground">
                <p className="font-semibold text-foreground mb-1">Reveal window has closed</p>
                <p>You can no longer reveal your bet. If you didn't reveal in time, your bet amount may be eligible for refund depending on the market rules.</p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-muted-foreground space-y-1">
                <p><strong className="text-foreground">What happens when you reveal:</strong></p>
                <ul className="list-disc list-inside space-y-0.5 ml-2">
                  <li>Your bet outcome and amount will be publicly visible</li>
                  <li>Your bet will be verified against your commit hash</li>
                  <li>If the market is resolved and you won, you can claim your winnings</li>
                  <li>You must reveal before the deadline to be eligible for winnings</li>
                </ul>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <span className="text-sm text-destructive">{error}</span>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 flex-col sm:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={exportRevealData}
            className="w-full sm:w-auto"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <div className="flex gap-2 w-full sm:w-auto">
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
              disabled={loading || !canRevealNow}
            >
              {loading ? 'Revealing...' : 'Reveal Bet'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

