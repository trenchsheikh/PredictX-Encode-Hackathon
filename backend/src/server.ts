import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import { blockchainService } from './services/BlockchainService';
import { marketResolutionService } from './services/MarketResolutionService';
import marketsRouter from './routes/markets';
import usersRouter from './routes/users';
import oracleRouter from './routes/oracle';
import resolutionRouter from './routes/resolution';
import transactionsRouter from './routes/transactions';

// Load environment variables
dotenv.config({ path: '../.env' });

const app: Application = express();
const PORT = process.env.PORT || 3001;

// ============ Middleware ============

// CORS configuration - Allow all origins for now to fix the issue
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ============ Routes ============

app.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'DarkBet Backend API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      markets: '/api/markets',
      users: '/api/users/:address/bets',
      oracle: '/api/oracle/prices',
      health: '/health',
    },
  });
});

app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// Test endpoint for debugging
app.get('/test', (req: Request, res: Response) => {
  res.json({
    message: 'Backend is working!',
    timestamp: new Date().toISOString(),
    headers: req.headers,
  });
});

// API routes
app.use('/api/markets', marketsRouter);
app.use('/api/users', usersRouter);
app.use('/api/oracle', oracleRouter);
app.use('/api/resolution', resolutionRouter);
app.use('/api/transactions', transactionsRouter);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
});

// ============ Start Server ============

async function startServer() {
  try {
    console.log('🚀 Starting DarkBet Backend API...\n');

    // Connect to database
    await connectDatabase();

    // Start blockchain event listeners
    await blockchainService.startEventListeners();

    // Start market resolution service
    marketResolutionService.startAutoResolution();

    // Optional: Sync historical events on startup
    if (process.env.SYNC_ON_STARTUP === 'true') {
      const fromBlock = parseInt(process.env.SYNC_FROM_BLOCK || '0');
      console.log('🔄 Syncing historical events...');
      await blockchainService.syncHistoricalEvents(fromBlock);
    }

    // Start HTTP server
    app.listen(PORT, () => {
      console.log('\n' + '='.repeat(60));
      console.log('✅ DarkBet Backend API is running!');
      console.log('='.repeat(60));
      console.log(`\n📡 Server: http://localhost:${PORT}`);
      console.log(`📊 Health: http://localhost:${PORT}/health`);
      console.log(`🔗 API:    http://localhost:${PORT}/api/markets`);
      console.log(`🔮 Oracle: http://localhost:${PORT}/api/oracle/prices`);
      console.log('\n👂 Listening for blockchain events...');
      console.log('🔍 Auto-resolution service started...');
      console.log('='.repeat(60) + '\n');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n⏹️  Shutting down gracefully...');
  blockchainService.stopEventListeners();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n⏹️  Shutting down gracefully...');
  blockchainService.stopEventListeners();
  process.exit(0);
});

// Start the server
startServer();

