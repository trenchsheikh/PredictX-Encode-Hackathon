export interface IMarket {
  marketId: number; // On-chain market ID
  title: string;
  description: string;
  creator: string;
  createdAt: Date;
  expiresAt: Date;
  category: number;
  totalPool: string; // BNB amount as string
  yesPool: string;
  noPool: string;
  yesShares: string;
  noShares: string;
  participants: number;
  status: MarketStatus;
  outcome?: boolean;
  resolutionReasoning?: string;
  txHash: string;
}

export enum MarketStatus {
  Active = 0,
  Resolving = 1,
  Resolved = 2,
  Cancelled = 3,
}

export interface ICommitment {
  marketId: number;
  user: string;
  commitHash: string;
  amount: string;
  timestamp: Date;
  revealed: boolean;
  txHash: string;
}

export interface IBet {
  marketId: number;
  user: string;
  outcome: boolean;
  shares: string;
  amount: string;
  revealedAt: Date;
  claimed: boolean;
  txHash: string;
}

export interface ContractAddresses {
  PredictionMarket: string;
  Vault: string;
}

export interface BlockchainEvent {
  eventName: string;
  blockNumber: number;
  transactionHash: string;
  args: any;
}
