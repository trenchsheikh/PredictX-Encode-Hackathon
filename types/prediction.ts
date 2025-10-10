export interface Prediction {
  id: string;
  title: string;
  description: string;
  category: PredictionCategory;
  status: PredictionStatus;
  createdAt: number;
  expiresAt: number;
  creator: string;
  totalPool: number;
  yesPool: number;
  noPool: number;
  yesPrice: number;
  noPrice: number;
  totalShares: number;
  yesShares: number;
  noShares: number;
  resolution?: PredictionResolution;
  participants: number;
  isHot: boolean;
}

export type PredictionCategory = 
  | 'sports'
  | 'crypto'
  | 'politics'
  | 'entertainment'
  | 'weather'
  | 'finance'
  | 'technology'
  | 'custom';

export type PredictionStatus = 
  | 'active'
  | 'resolved'
  | 'cancelled'
  | 'expired';

export interface PredictionResolution {
  outcome: 'yes' | 'no';
  resolvedAt: number;
  reasoning: string;
  evidence: string[];
}

export interface UserBet {
  id: string;
  predictionId: string;
  user: string;
  outcome: 'yes' | 'no';
  shares: number;
  amount: number;
  price: number;
  createdAt: number;
  claimed: boolean;
  payout?: number;
}

export interface CreatePredictionData {
  title: string;
  description: string;
  category: PredictionCategory;
  betType: 'custom' | 'auto-verified';
  resolutionInstructions?: string;
  options: string[];
  userPrediction: 'yes' | 'no';
  bnbAmount: number;
  expiresAt: number;
}

export interface FilterOptions {
  status?: PredictionStatus;
  category?: PredictionCategory;
  timeRange?: 'all' | '24h' | '7d' | '30d';
  minPrice?: number;
  maxPrice?: number;
  isHot?: boolean;
}


