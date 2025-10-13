'use client';

import React from 'react';
import { Prediction } from '@/types/prediction';

interface PredictionCardProps {
  prediction: Prediction;
  onBet: (predictionId: string, outcome: 'yes' | 'no') => void;
  userBets?: { [predictionId: string]: { outcome: 'yes' | 'no'; shares: number } };
}

export function PredictionCard({ prediction, onBet, userBets }: PredictionCardProps) {
  return React.createElement('div', { className: 'h-full' }, 
    React.createElement('h2', null, prediction.title),
    React.createElement('p', null, prediction.description)
  );
}