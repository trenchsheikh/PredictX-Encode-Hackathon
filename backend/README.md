# DarkBet Backend API

Standalone Express.js backend for the DarkBet Prediction Market platform.

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Install dependencies:

```bash
cd backend
npm install
```

2. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your actual values
```

3. Start the server:

**Development mode (with auto-reload):**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

The server will start on `http://localhost:3001` (or the PORT you specified in .env)

## 📁 Project Structure

```
backend/
├── src/
│   ├── server.js          # Main Express server
│   ├── routes/            # API route handlers
│   │   ├── health.js      # Health check endpoints
│   │   ├── markets.js     # Market endpoints
│   │   ├── oracle.js      # Price oracle endpoints
│   │   ├── rg.js          # Responsible gambling endpoints
│   │   ├── transactions.js # Transaction endpoints
│   │   └── users.js       # User endpoints
│   ├── utils/             # Utility functions
│   │   ├── database.js    # MongoDB connection
│   │   └── concordium-service.js # Concordium RG service
│   └── models/            # Database models (to be added)
├── package.json
├── .env.example
└── README.md
```

## 🔌 API Endpoints

### Health

- `GET /api/health` - Health check

### Markets

- `GET /api/markets` - List all markets
- `GET /api/markets/:id` - Get market by ID
- `POST /api/markets/:id/commit` - Commit to a prediction
- `POST /api/markets/resolve-market` - Resolve a market
- `POST /api/markets/trigger-resolution` - Trigger market resolution

### Oracle

- `GET /api/oracle/prices` - Get current prices

### Responsible Gambling (RG)

- `POST /api/rg/link-identity` - Link Concordium identity
- `POST /api/rg/check` - Check if bet is allowed
- `GET /api/rg/status` - Get RG status
- `POST /api/rg/record-bet` - Record a bet
- `POST /api/rg/set-limit` - Set betting limits
- `POST /api/rg/self-exclude` - Self-exclude from betting

### Transactions

- `GET /api/transactions/market/:marketId` - Get transactions for a market

### Users

- `GET /api/users/:address/bets` - Get user bets
- `GET /api/users/leaderboard` - Get leaderboard

## 🔧 Configuration

### Environment Variables

See `.env.example` for all available configuration options.

**Required variables:**

- `MONGODB_URI` - MongoDB connection string
- `PORT` - Server port (default: 3001)
- `FRONTEND_URL` - Frontend URL for CORS

**Optional variables:**

- `SOLANA_ADMIN_PRIVATE_KEY` - Admin wallet for Solana operations
- `CONCORDIUM_RG_CONTRACT_ADDRESS` - Concordium RG contract address
- Various RG limit settings

## 🧪 Testing

Test the API with curl:

```bash
# Health check
curl http://localhost:3001/api/health

# Get markets
curl http://localhost:3001/api/markets

# Check RG status
curl "http://localhost:3001/api/rg/status?idCommitment=YOUR_ID_COMMITMENT"
```

## 📝 Development

### Adding New Routes

1. Create a new route file in `src/routes/`
2. Import and use it in `src/server.js`:

```javascript
const newRoutes = require('./routes/new-routes');
app.use('/api/new-endpoint', newRoutes);
```

### Adding Database Models

Create Mongoose models in `src/models/` directory.

## 🐛 Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running locally or your Atlas connection string is correct
- Check firewall settings for MongoDB port (27017)

### Port Already in Use

- Change the `PORT` in .env file
- Or kill the process using the port:

  ```bash
  # Windows
  netstat -ano | findstr :3001
  taskkill /PID <PID> /F

  # Linux/Mac
  lsof -ti:3001 | xargs kill
  ```

### CORS Issues

- Ensure `FRONTEND_URL` in .env matches your frontend URL
- Check that the frontend is running on the specified URL

## 📦 Production Deployment

1. Set `NODE_ENV=production` in your environment
2. Use a process manager like PM2:

```bash
npm install -g pm2
pm2 start src/server.js --name darkbet-api
```

3. Set up a reverse proxy (nginx) for HTTPS
4. Configure environment variables in your hosting platform

## 🔒 Security Notes

- Never commit `.env` file
- Use strong, random values for all secrets
- Enable HTTPS in production
- Implement rate limiting for production
- Add authentication middleware for protected endpoints

## 📚 Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Concordium Documentation](https://docs.concordium.com/)
- [Solana Web3.js Documentation](https://solana-labs.github.io/solana-web3.js/)

## 📄 License

MIT
