'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Shield, TrendingUp, AlertTriangle } from 'lucide-react';
import type { RGStatus } from '@/types/concordium';
import { RGLimitsModal } from './rg-limits-modal';

interface RGStatusCardProps {
  idCommitment: string;
}

export function RGStatusCard({ idCommitment }: RGStatusCardProps) {
  const [status, setStatus] = useState<RGStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLimitsModal, setShowLimitsModal] = useState(false);

  const fetchStatus = async () => {
    try {
      const response = await fetch(`/api/rg/status?idCommitment=${idCommitment}`);
      const data = await response.json();

      if (data.success) {
        setStatus(data.data);
      }
    } catch (error) {
      console.error('Error fetching RG status:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (idCommitment) {
      fetchStatus();
    }
  }, [idCommitment]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Responsible Gambling Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (!status) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Responsible Gambling Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Complete identity verification to see your status.
          </p>
        </CardContent>
      </Card>
    );
  }

  const dailyPercent = (status.currentSpending.daily / status.limits.dailyLimit) * 100;
  const weeklyPercent = (status.currentSpending.weekly / status.limits.weeklyLimit) * 100;
  const monthlyPercent = (status.currentSpending.monthly / status.limits.monthlyLimit) * 100;

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Responsible Gambling Status
              </CardTitle>
              <CardDescription>Your current betting limits and spending</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLimitsModal(true)}
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              Adjust Limits
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {status.selfExcluded && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">Self-Excluded</span>
              </div>
              {status.selfExclusionExpiry && (
                <p className="text-xs text-muted-foreground mt-1">
                  Until: {new Date(status.selfExclusionExpiry).toLocaleDateString()}
                </p>
              )}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Daily Spending</span>
                <span className="text-sm text-muted-foreground">
                  {status.currentSpending.daily.toFixed(2)} / {status.limits.dailyLimit} SOL
                </span>
              </div>
              <Progress value={Math.min(dailyPercent, 100)} />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Weekly Spending</span>
                <span className="text-sm text-muted-foreground">
                  {status.currentSpending.weekly.toFixed(2)} / {status.limits.weeklyLimit} SOL
                </span>
              </div>
              <Progress value={Math.min(weeklyPercent, 100)} />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Monthly Spending</span>
                <span className="text-sm text-muted-foreground">
                  {status.currentSpending.monthly.toFixed(2)} / {status.limits.monthlyLimit} SOL
                </span>
              </div>
              <Progress value={Math.min(monthlyPercent, 100)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <p className="text-xs text-muted-foreground">KYC Status</p>
              <p className="text-sm font-medium capitalize">{status.kycStatus}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Risk Level</p>
              <p className="text-sm font-medium capitalize">{status.riskLevel}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <RGLimitsModal
        open={showLimitsModal}
        onOpenChange={setShowLimitsModal}
        idCommitment={idCommitment}
        currentLimits={status.limits}
        onSuccess={fetchStatus}
      />
    </>
  );
}

