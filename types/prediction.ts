export interface Prediction {
  id: string;
  title: string;
  description: string;
  summary?: string; // AI-generated unbiased summary
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
  outcome: 'yes' | 'no' | 'unknown';
  shares: number;
  amount: number;
  price: number;
  createdAt: number;
  claimed: boolean;
  payout?: number;
  revealed?: boolean;
}

export interface CreatePredictionData {
  title: string;
  description: string;
  summary?: string; // AI-generated unbiased summary
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


