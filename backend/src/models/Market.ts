import mongoose, { Schema, Document } from 'mongoose';
import { IMarket, MarketStatus } from '../types';

interface IMarketDocument extends IMarket, Document {}

const marketSchema = new Schema<IMarketDocument>(
  {
    marketId: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    creator: { type: String, required: true },
    createdAt: { type: Date, required: true },
    expiresAt: { type: Date, required: true },
    category: { type: Number, required: true },
    totalPool: { type: String, default: '0' },
    yesPool: { type: String, default: '0' },
    noPool: { type: String, default: '0' },
    yesShares: { type: String, default: '0' },
    noShares: { type: String, default: '0' },
    participants: { type: Number, default: 0 },
    status: {
      type: Number,
      enum: [
        MarketStatus.Active,
        MarketStatus.Resolving,
        MarketStatus.Resolved,
        MarketStatus.Cancelled,
      ],
      default: MarketStatus.Active,
    },
    outcome: { type: Boolean },
    resolutionReasoning: { type: String },
    txHash: { type: String, required: true },
    // Event prediction fields
    predictionType: {
      type: String,
      enum: ['crypto', 'event'],
      default: 'crypto',
    },
    eventData: {
      type: {
        keywords: [String],
        newsSearchQuery: String,
        verificationThreshold: Number,
        monitoringStartDate: Date,
        lastChecked: Date,
        newsArticles: [
          {
            title: String,
            url: String,
            source: String,
            publishedAt: Date,
          },
        ],
      },
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
marketSchema.index({ status: 1, expiresAt: 1 });
marketSchema.index({ creator: 1, createdAt: -1 });
// Standalone indexes for individual field queries
marketSchema.index({ expiresAt: 1 });
marketSchema.index({ category: 1 });

export const Market = mongoose.model<IMarketDocument>('Market', marketSchema);
