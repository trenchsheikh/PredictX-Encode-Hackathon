'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, TrendingUp } from 'lucide-react';
import type { RGLimits } from '@/types/concordium';

interface RGLimitsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  idCommitment: string;
  currentLimits?: RGLimits;
  onSuccess?: () => void;
}

export function RGLimitsModal({
  open,
  onOpenChange,
  idCommitment,
  currentLimits,
  onSuccess,
}: RGLimitsModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limits, setLimits] = useState<Partial<RGLimits>>({
    dailyLimit: currentLimits?.dailyLimit || 10,
    weeklyLimit: currentLimits?.weeklyLimit || 50,
    monthlyLimit: currentLimits?.monthlyLimit || 200,
    singleBetLimit: currentLimits?.singleBetLimit || 100,
    cooldownPeriod: currentLimits?.cooldownPeriod || 0,
  });

  useEffect(() => {
    if (currentLimits) {
      setLimits({
        dailyLimit: currentLimits.dailyLimit,
        weeklyLimit: currentLimits.weeklyLimit,
        monthlyLimit: currentLimits.monthlyLimit,
        singleBetLimit: currentLimits.singleBetLimit,
        cooldownPeriod: currentLimits.cooldownPeriod,
      });
    }
  }, [currentLimits]);

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/rg/set-limit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idCommitment,
          limits,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to update limits');
      }

      if (onSuccess) {
        onSuccess();
      }

      onOpenChange(false);
    } catch (err) {
      console.error('Error updating limits:', err);
      setError(err instanceof Error ? err.message : 'Failed to update limits');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Set Betting Limits
          </DialogTitle>
          <DialogDescription>
            Configure your responsible gambling limits. These limits help you manage your betting activity.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="dailyLimit">Daily Limit (SOL)</Label>
            <Input
              id="dailyLimit"
              type="number"
              min="0"
              step="0.1"
              value={limits.dailyLimit}
              onChange={(e) =>
                setLimits({ ...limits, dailyLimit: parseFloat(e.target.value) })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weeklyLimit">Weekly Limit (SOL)</Label>
            <Input
              id="weeklyLimit"
              type="number"
              min="0"
              step="1"
              value={limits.weeklyLimit}
              onChange={(e) =>
                setLimits({ ...limits, weeklyLimit: parseFloat(e.target.value) })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthlyLimit">Monthly Limit (SOL)</Label>
            <Input
              id="monthlyLimit"
              type="number"
              min="0"
              step="10"
              value={limits.monthlyLimit}
              onChange={(e) =>
                setLimits({ ...limits, monthlyLimit: parseFloat(e.target.value) })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="singleBetLimit">Single Bet Limit (SOL)</Label>
            <Input
              id="singleBetLimit"
              type="number"
              min="0"
              step="1"
              value={limits.singleBetLimit}
              onChange={(e) =>
                setLimits({ ...limits, singleBetLimit: parseFloat(e.target.value) })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cooldownPeriod">Cooldown Between Bets (seconds)</Label>
            <Input
              id="cooldownPeriod"
              type="number"
              min="0"
              step="1"
              value={limits.cooldownPeriod}
              onChange={(e) =>
                setLimits({ ...limits, cooldownPeriod: parseInt(e.target.value) })
              }
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Alert>
            <AlertDescription className="text-xs">
              Note: Daily limit must be ≤ weekly limit ≤ monthly limit
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Limits'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

