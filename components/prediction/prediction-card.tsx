'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card3D } from '@/components/ui/3d-card';
import { Magnetic } from '@/components/ui/magnetic';
import { MotionHighlight } from '@/components/ui/motion-highlight';
import { Prediction } from '@/types/prediction';
import { formatBNB, formatTimeRemaining, calculatePayout } from '@/lib/utils';
import { Clock, Users, TrendingUp, TrendingDown, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PredictionCardProps {
  prediction: Prediction;
  onBet: (predictionId: string, outcome: 'yes' | 'no') => void;
  userBets?: { [predictionId: string]: { outcome: 'yes' | 'no'; shares: number } };
}

export function PredictionCard({ prediction, onBet, userBets }: PredictionCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const userBet = userBets?.[prediction.id];

  const handleBet = async (outcome: 'yes' | 'no') => {
    setIsLoading(true);
    try {
      await onBet(prediction.id, outcome);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      sports: 'bg-blue-500',
      crypto: 'bg-yellow-500',
      politics: 'bg-red-500',
      entertainment: 'bg-purple-500',
      weather: 'bg-cyan-500',
      finance: 'bg-green-500',
      technology: 'bg-indigo-500',
      custom: 'bg-gray-500',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'success',
      resolved: 'secondary',
      cancelled: 'destructive',
      expired: 'warning',
    };
    return colors[status as keyof typeof colors] || 'secondary';
  };

  return (
    <Card3D intensity={0.1} className="h-full">
      <MotionHighlight highlightColor="#F0B90B" highlightOpacity={0.1}>
        <Card className={cn(
          "group hover:shadow-lg transition-all duration-300 cursor-pointer h-full",
          prediction.isHot && "ring-2 ring-primary/20 animate-pulse-glow",
          prediction.status !== 'active' && "opacity-75"
        )}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge 
                    variant="outline" 
                    className={cn("text-xs", getCategoryColor(prediction.category))}
                  >
                    {prediction.category}
                  </Badge>
                  <Badge variant={getStatusColor(prediction.status) as any}>
                    {prediction.status}
                  </Badge>
                  {prediction.isHot && (
                    <Badge variant="warning" className="animate-pulse">
                      <Zap className="h-3 w-3 mr-1" />
                      Hot
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg leading-tight line-clamp-2">
                  {prediction.title}
                </CardTitle>
              </div>
            </div>
          </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {prediction.description}
        </p>

        <div className="space-y-3">
          {/* Time and Participants */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatTimeRemaining(prediction.expiresAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{prediction.participants}</span>
            </div>
          </div>

          {/* Price Display */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {prediction.yesPrice.toFixed(4)}
              </div>
              <div className="text-xs text-muted-foreground">YES</div>
              <div className="text-xs text-green-600 dark:text-green-400">
                {formatBNB(prediction.yesPool)}
              </div>
            </div>
            <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-red-950/20">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {prediction.noPrice.toFixed(4)}
              </div>
              <div className="text-xs text-muted-foreground">NO</div>
              <div className="text-xs text-red-600 dark:text-red-400">
                {formatBNB(prediction.noPool)}
              </div>
            </div>
          </div>

          {/* Total Pool */}
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Total Pool</div>
            <div className="text-lg font-semibold text-gradient">
              {formatBNB(prediction.totalPool)}
            </div>
          </div>

          {/* User Bet Status */}
          {userBet && (
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Your Bet</div>
                  <div className="text-xs text-muted-foreground">
                    {userBet.outcome.toUpperCase()} • {userBet.shares.toFixed(2)} shares
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {formatBNB(calculatePayout(userBet.shares, 
                      userBet.outcome === 'yes' ? prediction.yesShares : prediction.noShares, 
                      prediction.totalPool
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground">Potential Payout</div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {prediction.status === 'active' && (
            <div className="grid grid-cols-2 gap-2">
              <Magnetic intensity={0.2} scale={1.05}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBet('yes')}
                  disabled={isLoading}
                  className="border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
                >
                  <TrendingUp className="h-4 w-4 mr-1" />
                  YES
                </Button>
              </Magnetic>
              <Magnetic intensity={0.2} scale={1.05}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBet('no')}
                  disabled={isLoading}
                  className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                >
                  <TrendingDown className="h-4 w-4 mr-1" />
                  NO
                </Button>
              </Magnetic>
            </div>
          )}

          {/* Resolution Info */}
          {prediction.resolution && (
            <div className="p-3 rounded-lg bg-muted">
              <div className="text-sm font-medium mb-1">
                Resolved: {prediction.resolution.outcome.toUpperCase()}
              </div>
              <div className="text-xs text-muted-foreground">
                {prediction.resolution.reasoning}
              </div>
            </div>
          )}
        </div>
      </CardContent>
        </Card>
      </MotionHighlight>
    </Card3D>
  );
}
