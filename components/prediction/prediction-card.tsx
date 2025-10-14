'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Prediction } from '@/types/prediction';
import { formatBNB, formatTimeRemaining } from '@/lib/utils';
import { Clock, Users, ArrowUp, ArrowDown, Flame, ChevronDown, ChevronUp, Info, History, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/components/providers/privy-provider';

interface PredictionCardProps {
  prediction: Prediction;
  onBet: (predictionId: string, outcome: 'yes' | 'no') => void;
  onViewHistory?: (predictionId: string) => void;
  userBets?: { [predictionId: string]: { outcome: 'yes' | 'no'; shares: number } };
}

export function PredictionCard({ prediction, onBet, onViewHistory, userBets }: PredictionCardProps) {
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const userBet = userBets?.[prediction.id];

  const handleBet = async (outcome: 'yes' | 'no') => {
    setIsLoading(true);
    try {
      await onBet(prediction.id, outcome);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card 
      className={cn(
        "relative overflow-hidden border-black bg-black/90 hover:bg-black transition-all duration-300 h-full",
        prediction.isHot && "ring-2 ring-yellow-400"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge 
                variant="outline" 
                className="text-xs border-white text-white"
              >
                {prediction.category}
              </Badge>
              {(prediction.status === 'resolved' || prediction.status === 'cancelled') && (
                <Badge 
                  className={cn(
                    "text-xs",
                    prediction.status === 'resolved' 
                      ? "bg-green-500/20 text-green-400 border-green-500/30"
                      : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                  )}
                >
                  {prediction.status === 'resolved' ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Resolved
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3 w-3 mr-1" />
                      Expired
                    </>
                  )}
                </Badge>
              )}
              {prediction.isHot && (
                <Badge variant="warning" className="text-xs animate-pulse">
                  <Flame className="h-3 w-3 mr-1" />
                  HOT
                </Badge>
              )}
              {prediction.status !== 'active' && (
                <Badge variant="secondary" className="text-xs">
                  {prediction.status}
                </Badge>
              )}
            </div>
            <h3 className="text-sm font-semibold text-white line-clamp-2 mb-2">
              {prediction.title}
            </h3>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-300">Pool</div>
            <div className="text-sm font-bold text-white">
              {prediction.totalPool.toFixed(2)} BNB
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-200 mb-3 line-clamp-2">
          {prediction.description}
        </p>

        {/* Expandable Summary Section */}
        {prediction.summary && (
          <div className="mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center justify-between text-xs text-gray-300 hover:text-white hover:bg-white/10 p-2"
            >
              <span className="flex items-center gap-1">
                <Info className="h-3 w-3" />
                {isExpanded ? 'Hide Analysis' : 'View Detailed Analysis'}
              </span>
              {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </Button>
            {isExpanded && (
              <div className="mt-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                <div className="text-xs font-medium text-yellow-400 mb-2 flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  Unbiased Market Analysis
                </div>
                <p className="text-xs text-gray-200 leading-relaxed whitespace-pre-wrap">
                  {prediction.summary}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Odds Display - Betting Style */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-green-600 border border-green-700 rounded-lg p-3 text-center">
            <div className="text-xs text-white mb-1">YES</div>
            <div className="text-lg font-bold text-white">
              {prediction.yesPrice.toFixed(3)}
            </div>
            <div className="text-xs text-gray-200">
              {prediction.yesPool.toFixed(2)} BNB
            </div>
          </div>
          <div className="bg-red-600 border border-red-700 rounded-lg p-3 text-center">
            <div className="text-xs text-white mb-1">NO</div>
            <div className="text-lg font-bold text-white">
              {prediction.noPrice.toFixed(3)}
            </div>
            <div className="text-xs text-gray-200">
              {prediction.noPool.toFixed(2)} BNB
            </div>
          </div>
        </div>

        {/* User Bet Status */}
        {userBet && (
          <div className="p-3 rounded-lg bg-yellow-500 border border-yellow-600 mb-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-black">{t('your_bet')}</div>
                <div className="text-xs text-black">
                  {userBet.outcome.toUpperCase()} • {userBet.shares.toFixed(2)} shares
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {prediction.status === 'active' && (
          <div className="grid grid-cols-2 gap-2 mb-3">
            <Button
              size="sm"
              className="bg-white hover:bg-gray-200 text-black font-semibold"
              onClick={() => handleBet('yes')}
              disabled={isLoading}
            >
              <ArrowUp className="h-3 w-3 mr-1" />
              YES
            </Button>
            <Button
              size="sm"
              className="bg-white hover:bg-gray-200 text-black font-semibold"
              onClick={() => handleBet('no')}
              disabled={isLoading}
            >
              <ArrowDown className="h-3 w-3 mr-1" />
              NO
            </Button>
          </div>
        )}

        {/* View History Button for Completed Predictions */}
        {(prediction.status === 'resolved' || prediction.status === 'cancelled') && onViewHistory && (
          <div className="mb-3">
            <Button
              size="sm"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold"
              onClick={() => onViewHistory(prediction.id)}
            >
              <History className="h-3 w-3 mr-2" />
              View History
            </Button>
          </div>
        )}

        {/* Resolution Info */}
        {prediction.resolution && (
          <div className="p-3 rounded-lg bg-yellow-500 border border-yellow-600 mb-3">
            <div className="text-sm font-medium text-black mb-1">
              {t('resolved')}: {prediction.resolution.outcome.toUpperCase()}
            </div>
            <div className="text-xs text-black">
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
              {(prediction.status === 'resolved' || prediction.status === 'cancelled') 
                ? 'Expired' 
                : formatTimeRemaining(prediction.expiresAt)
              }
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}