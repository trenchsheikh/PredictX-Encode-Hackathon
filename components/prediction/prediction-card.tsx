'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Prediction } from '@/types/prediction';
import { formatBNB, formatTimeRemaining } from '@/lib/utils';
import {
  Clock,
  Users,
  ArrowUp,
  ArrowDown,
  Flame,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/components/providers/i18n-provider';

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
  const [isExpanded, setIsExpanded] = useState(false);
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
        <div className="mb-3 flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
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
            <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-white">
              {prediction.title}
            </h3>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-300">
              {mounted && isInitialized ? t('prediction_card.pool') : 'Pool'}
            </div>
            <div className="text-sm font-bold text-white">
              {formatBNB(prediction.totalPool)}
            </div>
          </div>
        </div>

        <p className="mb-3 line-clamp-2 text-xs text-gray-200">
          {prediction.description}
        </p>

        {/* Expandable Summary Section */}
        {prediction.summary && (
          <div className="mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex w-full items-center justify-between p-2 text-xs text-gray-300"
            >
              <span className="flex items-center gap-1">
                <Info className="h-3 w-3" />
                {mounted && isInitialized
                  ? isExpanded
                    ? t('prediction_card.hide_analysis')
                    : t('prediction_card.view_detailed_analysis')
                  : isExpanded
                    ? 'Hide Analysis'
                    : 'View Detailed Analysis'}
              </span>
              {isExpanded ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </Button>
            {isExpanded && (
              <div className="mt-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3">
                <div className="mb-2 flex items-center gap-1 text-xs font-medium text-yellow-400">
                  <Info className="h-3 w-3" />
                </div>
                <p className="whitespace-pre-wrap text-xs leading-relaxed text-gray-200">
                  {prediction.summary}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Odds Display - Enhanced Betting Style */}
        <div className="mb-3 grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-green-500/30 bg-gradient-to-br from-green-600/90 to-green-700/90 p-3 text-center shadow-lg">
            <div className="mb-1 text-xs font-medium text-green-100">
              {mounted && isInitialized ? t('prediction_card.yes') : 'Yes'}
            </div>
            <div className="text-lg font-bold text-white">
              {prediction.yesPrice.toFixed(3)}
            </div>
            <div className="text-xs text-green-200">
              {formatBNB(prediction.yesPool)}
            </div>
          </div>
          <div className="rounded-lg border border-red-500/30 bg-gradient-to-br from-red-600/90 to-red-700/90 p-3 text-center shadow-lg">
            <div className="mb-1 text-xs font-medium text-red-100">
              {mounted && isInitialized ? t('prediction_card.no') : 'No'}
            </div>
            <div className="text-lg font-bold text-white">
              {prediction.noPrice.toFixed(3)}
            </div>
            <div className="text-xs text-red-200">
              {formatBNB(prediction.noPool)}
            </div>
          </div>
        </div>

        {/* User Bet Status */}
        {userBet && (
          <div className="mb-3 rounded-lg border border-yellow-400/30 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-yellow-400">
                  {mounted && isInitialized
                    ? t('prediction_card.your_bet')
                    : 'Your Bet'}
                </div>
                <div className="text-xs text-yellow-300">
                  {userBet.outcome.toUpperCase()} • {userBet.shares.toFixed(2)}{' '}
                  {mounted && isInitialized
                    ? t('prediction_card.shares')
                    : 'shares'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {prediction.status === 'active' && (
          <div className="mb-3 grid grid-cols-2 gap-2">
            <Button
              size="sm"
              className="bg-gradient-to-r from-green-500 to-green-600 font-semibold text-white shadow-lg hover:from-green-600 hover:to-green-700"
              onClick={() => handleBet('yes')}
              disabled={isLoading}
            >
              <ArrowUp className="mr-1 h-3 w-3" />
              {mounted && isInitialized ? t('prediction_card.yes') : 'Yes'}
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-red-500 to-red-600 font-semibold text-white shadow-lg hover:from-red-600 hover:to-red-700"
              onClick={() => handleBet('no')}
              disabled={isLoading}
            >
              <ArrowDown className="mr-1 h-3 w-3" />
              {mounted && isInitialized ? t('prediction_card.no') : 'No'}
            </Button>
          </div>
        )}

        {/* View History Button for Completed Predictions */}
        {(prediction.status === 'resolved' ||
          prediction.status === 'cancelled') &&
          onViewHistory && (
            <div className="mb-3 mt-auto">
              <Button
                size="sm"
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 font-semibold text-white shadow-lg hover:from-purple-600 hover:to-purple-700"
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
          <div className="mb-3 rounded-lg border border-yellow-400/30 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 p-3">
            <div className="mb-1 text-sm font-medium text-yellow-400">
              {mounted && isInitialized
                ? t('prediction_card.resolved')
                : 'Resolved'}
              : {prediction.resolution.outcome.toUpperCase()}
            </div>
            <div className="text-xs text-yellow-300">
              {prediction.resolution.reasoning}
            </div>
          </div>
        )}

        {/* Market Info */}
        <div className="flex items-center justify-between text-xs text-gray-300">
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
    </Card>
  );
}
