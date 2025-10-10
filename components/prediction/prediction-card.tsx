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
import { useI18n } from '@/components/providers/privy-provider';

interface PredictionCardProps {
  prediction: Prediction;
  onBet: (predictionId: string, outcome: 'yes' | 'no') => void;
  userBets?: { [predictionId: string]: { outcome: 'yes' | 'no'; shares: number } };
}

export function PredictionCard({ prediction, onBet, userBets }: PredictionCardProps) {
  const { t } = useI18n();
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

  const getCategoryColor = (_category: string) => {
    return 'border-yellow-500/30 text-yellow-300 bg-yellow-500/10';
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
      <MotionHighlight highlightColor="#F0B90B" highlightOpacity={0.12}>
        <div className={cn(
          "relative rounded-2xl p-[1px] transition-all duration-300",
          "bg-[radial-gradient(120%_120%_at_0%_0%,rgba(240,185,11,0.35)_0%,transparent_50%),radial-gradient(120%_120%_at_100%_100%,rgba(240,185,11,0.15)_0%,transparent_55%)]",
          prediction.isHot && "shadow-[0_0_30px_rgba(240,185,11,0.15)]",
          prediction.status !== 'active' && "opacity-80"
        )}>
          <Card className="group relative h-full rounded-2xl bg-[#0b0b0b] border border-yellow-500/15 hover:border-yellow-400/25 hover:shadow-[0_0_24px_rgba(240,185,11,0.15)] transition-all">
            {/* Corner accents */}
            <div className="pointer-events-none absolute -top-px right-4 h-px w-24 bg-gradient-to-l from-yellow-500/60 to-transparent" />
            <div className="pointer-events-none absolute -bottom-px left-4 h-px w-24 bg-gradient-to-r from-yellow-500/60 to-transparent" />
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge 
                    variant="outline" 
                    className={cn("text-xs border", getCategoryColor(prediction.category))}
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
            <div className="text-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="text-2xl font-bold text-green-400">
                {prediction.yesPrice.toFixed(4)}
              </div>
                         <div className="text-xs text-muted-foreground">{t('yes')}</div>
              <div className="text-xs text-green-400">
                {formatBNB(prediction.yesPool)}
              </div>
            </div>
            <div className="text-center p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="text-2xl font-bold text-red-400">
                {prediction.noPrice.toFixed(4)}
              </div>
                         <div className="text-xs text-muted-foreground">{t('no')}</div>
              <div className="text-xs text-red-400">
                {formatBNB(prediction.noPool)}
              </div>
            </div>
          </div>

          {/* Total Pool */}
                     <div className="text-center">
                       <div className="text-sm text-muted-foreground">{t('total_pool')}</div>
            <div className="text-lg font-semibold text-gradient">
              {formatBNB(prediction.totalPool)}
            </div>
          </div>

          {/* User Bet Status */}
          {userBet && (
            <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{t('your_bet')}</div>
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
                  <div className="text-xs text-muted-foreground">{t('potential_payout')}</div>
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
                  className="border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/10"
                >
                             <TrendingUp className="h-4 w-4 mr-1" />
                             {t('yes')}
                </Button>
              </Magnetic>
              <Magnetic intensity={0.2} scale={1.05}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBet('no')}
                  disabled={isLoading}
                  className="border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/10"
                >
                             <TrendingDown className="h-4 w-4 mr-1" />
                             {t('no')}
                </Button>
              </Magnetic>
            </div>
          )}

          {/* Resolution Info */}
          {prediction.resolution && (
            <div className="p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/10">
              <div className="text-sm font-medium mb-1">
                {t('resolved')}: {prediction.resolution.outcome.toUpperCase()}
              </div>
              <div className="text-xs text-muted-foreground">
                {prediction.resolution.reasoning}
              </div>
            </div>
          )}
        </div>
      </CardContent>
          </Card>
        </div>
      </MotionHighlight>
    </Card3D>
  );
}
