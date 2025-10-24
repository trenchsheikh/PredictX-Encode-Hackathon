require('dotenv').config();
const cors = require('cors');
const express = require('express');

// Import routes
const healthRoutes = require('./routes/health');
const marketsRoutes = require('./routes/markets');
const oracleRoutes = require('./routes/oracle');
const rgRoutes = require('./routes/rg');
const transactionsRoutes = require('./routes/transactions');
const usersRoutes = require('./routes/users');
const { connectDatabase } = require('./utils/database');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.use('/api/health', healthRoutes);

// API Routes
app.use('/api/markets', marketsRoutes);
app.use('/api/oracle', oracleRoutes);
app.use('/api/rg', rgRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/users', usersRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'DarkBet Prediction Market API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      markets: '/api/markets',
      oracle: '/api/oracle',
      rg: '/api/rg',
      transactions: '/api/transactions',
      users: '/api/users',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start server
async function startServer() {
  try {
    // Try to connect to database (optional - server will still start if DB unavailable)
    try {
      await connectDatabase();
      console.log('✅ Database connected');
    } catch (dbError) {
      console.warn('⚠️  Database connection failed:', dbError.message);
      console.warn('⚠️  Server will start anyway. Some features may not work.');
    }

    // Start listening
    app.listen(PORT, () => {
      console.log(`🚀 DarkBet Backend API running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(
        `🌐 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`
      );
      console.log(`🔗 API: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

startServer();
