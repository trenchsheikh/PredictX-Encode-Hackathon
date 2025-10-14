import mongoose, { Schema, Document } from 'mongoose';
import { ICommitment } from '../types';

interface ICommitmentDocument extends ICommitment, Document {}

const commitmentSchema = new Schema<ICommitmentDocument>(
  {
    marketId: { type: Number, required: true, index: true },
    user: { type: String, required: true, index: true },
    commitHash: { type: String, required: true },
    amount: { type: String, required: true },
    timestamp: { type: Date, required: true },
    revealed: { type: Boolean, default: false, index: true },
    txHash: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
commitmentSchema.index({ marketId: 1, user: 1 }, { unique: true });

export const Commitment = mongoose.model<ICommitmentDocument>('Commitment', commitmentSchema);

