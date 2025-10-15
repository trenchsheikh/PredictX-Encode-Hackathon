import mongoose, { Schema, Document } from 'mongoose';
import { IBet } from '../types';

interface IBetDocument extends IBet, Document {}

const betSchema = new Schema<IBetDocument>(
  {
    marketId: { type: Number, required: true },
    user: { type: String, required: true },
    outcome: { type: Boolean, required: true },
    shares: { type: String, required: true },
    amount: { type: String, required: true },
    revealedAt: { type: Date, required: true },
    claimed: { type: Boolean, default: false },
    txHash: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Compound indexes
betSchema.index({ marketId: 1, user: 1 });
betSchema.index({ user: 1, revealedAt: -1 });

export const Bet = mongoose.model<IBetDocument>('Bet', betSchema);
