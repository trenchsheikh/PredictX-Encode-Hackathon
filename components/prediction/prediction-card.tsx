'use client';

import { useState, useEffect } from 'react';

import { Clock, Users, ArrowUp, ArrowDown, Flame } from 'lucide-react';

import { useI18n } from '@/components/providers/i18n-provider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatBNB, formatTimeRemaining } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { Prediction } from '@/types/prediction';

interface PredictionCardProps {
  prediction: Prediction;
  onBet: (predictionId: string, outcome: 'yes' | 'no') => void;
  onViewHistory?: (predictionId: string) => void;
  userBets?: {
    [predictionId: string]: { outcome: 'yes' | 'no'; shares: number };
  };
}

export function PredictionCard({
  prediction,
  onBet,
  onViewHistory,
  userBets,
}: PredictionCardProps) {
  const { t, isInitialized } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const [showAnalysisDialog, setShowAnalysisDialog] = useState(false);
  const [mounted, setMounted] = useState(false);
  const userBet = userBets?.[prediction.id];

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleBet = async (outcome: 'yes' | 'no') => {
    setIsLoading(true);
    try {
      await onBet(prediction.id, outcome);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={cn('relative flex h-full flex-col overflow-hidden')}>
      <CardContent className="flex flex-1 flex-col p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {prediction.category.charAt(0).toUpperCase() +
                prediction.category.slice(1)}
            </Badge>
            {prediction.isHot && (
              <Badge variant="hot" className="text-xs">
                <Flame className="mr-1 h-3 w-3" />
                HOT
              </Badge>
            )}
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">
              {mounted && isInitialized ? t('prediction_card.pool') : 'Pool'}{' '}
              {formatBNB(prediction.totalPool)}
            </div>
          </div>
        </div>
        <div className="mb-3">
          <h3
            className="mb-2 line-clamp-2 cursor-pointer text-sm font-semibold text-foreground"
            onClick={() => prediction.summary && setShowAnalysisDialog(true)}
          >
            {prediction.title}
          </h3>
        </div>

        <p
          className="mb-3 min-h-[2.5rem] text-xs text-muted-foreground"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: '1.25rem',
          }}
        >
          {prediction.description}
        </p>

        {/* Single Yes/No Buttons with Info */}
        {prediction.status === 'active' && (
          <div className="mb-3 mt-auto flex flex-col gap-2">
            {/* Yes Button */}
            <button
              className="rounded-lg border-2 border-green-500 bg-transparent p-3 hover:bg-green-500/10"
              onClick={() => handleBet('yes')}
              disabled={isLoading}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ArrowUp className="mr-2 h-4 w-4 text-green-400" />
                  <span className="text-lg font-bold text-green-400">
                    {mounted && isInitialized
                      ? t('prediction_card.yes')
                      : 'Yes'}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-400">
                    {prediction.yesPrice.toFixed(3)}
                  </div>
                  <div className="text-xs text-green-400/80">
                    {formatBNB(prediction.yesPool)}
                  </div>
                </div>
              </div>
            </button>

            {/* No Button */}
            <button
              className="rounded-lg border-2 border-red-500 bg-transparent p-3 hover:bg-red-500/10"
              onClick={() => handleBet('no')}
              disabled={isLoading}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ArrowDown className="mr-2 h-4 w-4 text-red-400" />
                  <span className="text-lg font-bold text-red-400">
                    {mounted && isInitialized ? t('prediction_card.no') : 'No'}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-red-400">
                    {prediction.noPrice.toFixed(3)}
                  </div>
                  <div className="text-xs text-red-400/80">
                    {formatBNB(prediction.noPool)}
                  </div>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* User Bet Status */}
        {userBet && (
          <div className="mb-3 rounded-lg border border-white/30 bg-white/20 p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-white">
                  {mounted && isInitialized
                    ? t('prediction_card.your_bet')
                    : 'Your Bet'}
                </div>
                <div className="text-xs text-white/80">
                  {userBet.outcome.toUpperCase()} • {userBet.shares.toFixed(2)}{' '}
                  {mounted && isInitialized
                    ? t('prediction_card.shares')
                    : 'shares'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View History Button for Completed Predictions */}
        {(prediction.status === 'resolved' ||
          prediction.status === 'cancelled') &&
          onViewHistory && (
            <div className="mb-3">
              <Button
                size="sm"
                className="w-full bg-white font-semibold text-black hover:bg-white/90"
                onClick={() => onViewHistory(prediction.id)}
              >
                {mounted && isInitialized
                  ? t('prediction_card.view_history')
                  : 'View History'}
              </Button>
            </div>
          )}

        {/* Resolution Info */}
        {prediction.resolution && (
          <div className="mb-3 rounded-lg border border-white/30 bg-white/20 p-3">
            <div className="mb-1 text-sm font-medium text-white">
              {mounted && isInitialized
                ? t('prediction_card.resolved')
                : 'Resolved'}
              : {prediction.resolution.outcome.toUpperCase()}
            </div>
            <div className="text-xs text-white/80">
              {prediction.resolution.reasoning}
            </div>
          </div>
        )}

        {/* Market Info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{prediction.participants}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>
              {prediction.status === 'resolved' ||
              prediction.status === 'cancelled'
                ? mounted && isInitialized
                  ? t('prediction_card.expired')
                  : 'Expired'
                : formatTimeRemaining(prediction.expiresAt)}
            </span>
          </div>
        </div>
      </CardContent>

      {/* Detailed Analysis Dialog */}
      <Dialog open={showAnalysisDialog} onOpenChange={setShowAnalysisDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">
              Detailed Description
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-200">
              {prediction.summary}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
