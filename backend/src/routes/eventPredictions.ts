import { Router, Request, Response } from 'express';
import { Market } from '../models/Market';
import { MarketStatus } from '../types';
import { newsMonitoringService } from '../services/NewsMonitoringService';

const router = Router();

/**
 * POST /api/event-predictions
 * Create a new event-based prediction
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      category,
      expiresAt,
      keywords,
      newsSearchQuery,
      verificationThreshold,
      creator,
      txHash,
      marketId,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !description ||
      !category ||
      !expiresAt ||
      !keywords ||
      !creator ||
      !txHash ||
      marketId === undefined
    ) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }

    // Validate keywords array
    if (!Array.isArray(keywords) || keywords.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Keywords must be a non-empty array',
      });
    }

    // Check if market already exists
    const existingMarket = await Market.findOne({ marketId });
    if (existingMarket) {
      return res.status(409).json({
        success: false,
        error: 'Market with this ID already exists',
      });
    }

    const now = new Date();
    const expirationDate = new Date(expiresAt);

    // Validate expiration date
    if (expirationDate <= now) {
      return res.status(400).json({
        success: false,
        error: 'Expiration date must be in the future',
      });
    }

    // Create event prediction
    const eventPrediction = new Market({
      marketId,
      title,
      description,
      creator: creator.toLowerCase(),
      createdAt: now,
      expiresAt: expirationDate,
      category,
      totalPool: '0',
      yesPool: '0',
      noPool: '0',
      yesShares: '0',
      noShares: '0',
      participants: 0,
      status: MarketStatus.Active,
      txHash,
      predictionType: 'event',
      eventData: {
        keywords: keywords.map((k: string) => k.trim()),
        newsSearchQuery: newsSearchQuery || keywords.join(' OR '),
        verificationThreshold: verificationThreshold || 0.6,
        monitoringStartDate: now,
        lastChecked: null,
        newsArticles: [],
      },
    });

    await eventPrediction.save();

    console.log(`✅ Created event prediction: ${title} (ID: ${marketId})`);
    console.log(`   Keywords: ${keywords.join(', ')}`);
    console.log(`   Expires: ${expirationDate.toISOString()}`);

    res.status(201).json({
      success: true,
      data: eventPrediction,
      message: 'Event prediction created successfully',
    });
  } catch (error: any) {
    console.error('Error creating event prediction:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create event prediction',
      details: error.message,
    });
  }
});

/**
 * POST /api/event-predictions/:id/check
 * Manually trigger news check for a specific event prediction
 */
router.post('/:id/check', async (req: Request, res: Response) => {
  try {
    const marketId = parseInt(req.params.id);

    if (isNaN(marketId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid market ID',
      });
    }

    const result = await newsMonitoringService.checkMarketManually(marketId);

    if (result) {
      res.json({
        success: true,
        message: `Manual check completed for market ${marketId}`,
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Market not found or not an event prediction',
      });
    }
  } catch (error: any) {
    console.error('Error checking event prediction:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check event prediction',
      details: error.message,
    });
  }
});

/**
 * GET /api/event-predictions
 * Get all event predictions with optional filters
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { status, limit = '50', offset = '0' } = req.query;

    const query: any = { predictionType: 'event' };

    if (status !== undefined) {
      query.status = parseInt(status as string);
    }

    const eventPredictions = await Market.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit as string))
      .skip(parseInt(offset as string))
      .lean();

    const total = await Market.countDocuments(query);

    res.json({
      success: true,
      data: eventPredictions,
      pagination: {
        total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      },
    });
  } catch (error: any) {
    console.error('Error fetching event predictions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch event predictions',
    });
  }
});

export default router;
