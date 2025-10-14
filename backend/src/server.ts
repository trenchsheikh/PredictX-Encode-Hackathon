import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import { blockchainService } from './services/BlockchainService';
import marketsRouter from './routes/markets';
import usersRouter from './routes/users';

// Load environment variables
dotenv.config({ path: '../.env' });

const app: Application = express();
const PORT = process.env.PORT || 3001;

// ============ Middleware ============

app.use(cors());
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

// API routes
app.use('/api/markets', marketsRouter);
app.use('/api/users', usersRouter);

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
      console.log('\n👂 Listening for blockchain events...');
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

