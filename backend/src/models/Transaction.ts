import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  marketId: number;
  userAddress: string;
  type: 'commit' | 'reveal' | 'claim' | 'create' | 'resolve';
  amount?: string;
  outcome?: boolean;
  shares?: string;
  txHash: string;
  blockNumber: number;
  timestamp: number;
  gasUsed?: number;
  gasPrice?: string;
  status: 'pending' | 'confirmed' | 'failed';
  createdAt: Date;
}

const TransactionSchema = new Schema<ITransaction>({
  marketId: { type: Number, required: true, index: true },
  userAddress: { type: String, required: true, index: true },
  type: {
    type: String,
    required: true,
    enum: ['commit', 'reveal', 'claim', 'create', 'resolve'],
  },
  amount: { type: String },
  outcome: { type: Boolean },
  shares: { type: String },
  txHash: { type: String, required: true, unique: true, index: true },
  blockNumber: { type: Number, required: true },
  timestamp: { type: Number, required: true },
  gasUsed: { type: Number },
  gasPrice: { type: String },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'failed'],
    default: 'pending',
  },
  createdAt: { type: Date, default: Date.now },
});

// Indexes for efficient querying
TransactionSchema.index({ marketId: 1, userAddress: 1 });
TransactionSchema.index({ txHash: 1 });
TransactionSchema.index({ createdAt: -1 });

export const Transaction = mongoose.model<ITransaction>(
  'Transaction',
  TransactionSchema
);
