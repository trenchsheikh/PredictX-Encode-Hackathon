# DarkBet Backend Setup Complete! 🎉

## What Was Created

A standalone Express.js backend has been created in the `backend/` folder with the following structure:

```
backend/
├── src/
│   ├── server.js              # Main Express server
│   ├── routes/                # All API routes
│   │   ├── health.js          # Health check
│   │   ├── markets.js         # Market operations
│   │   ├── oracle.js          # Price oracle
│   │   ├── rg.js             # Responsible gambling (Concordium)
│   │   ├── transactions.js    # Transaction history
│   │   └── users.js           # User data & leaderboard
│   ├── utils/                 # Utilities
│   │   ├── database.js        # MongoDB connection
│   │   └── concordium-service.js  # RG service
│   └── models/                # Database models (empty, for future use)
├── package.json               # Dependencies
├── .env                       # Environment variables (copied from root)
├── .gitignore                 # Git ignore rules
└── README.md                  # Detailed documentation

```

## 🚀 How to Run the Backend

### Option 1: Using the Quick Start Script (Windows)

Double-click: **`START_BACKEND.bat`** in the root folder

OR

### Option 2: Manual Start

```bash
cd backend
npm run dev
```

The backend will start on **http://localhost:3001**

## 📡 Available Endpoints

Once running, you can test:

- **Health Check**: http://localhost:3001/api/health
- **Root**: http://localhost:3001/

### All Endpoints:

- `GET /api/health` - Server health status
- `GET /api/markets` - List markets
- `GET /api/markets/:id` - Get market details
- `POST /api/markets/:id/commit` - Commit prediction
- `POST /api/markets/resolve-market` - Resolve market
- `GET /api/oracle/prices` - Get price data
- `POST /api/rg/link-identity` - Link Concordium identity
- `POST /api/rg/check` - Check if bet allowed
- `GET /api/rg/status` - Get RG status
- `POST /api/rg/record-bet` - Record a bet
- `POST /api/rg/set-limit` - Set betting limits
- `POST /api/rg/self-exclude` - Self-exclude
- `GET /api/transactions/market/:marketId` - Market transactions
- `GET /api/users/:address/bets` - User bets
- `GET /api/users/leaderboard` - Leaderboard

## 🔧 Configuration

The backend uses the same `.env` file as your main project. Key settings:

- `PORT=3001` - Backend server port
- `MONGODB_URI` - Database connection
- `FRONTEND_URL` - For CORS (http://localhost:3000)

## 🧪 Testing the Backend

Open a new terminal and try:

```bash
# Health check
curl http://localhost:3001/api/health

# List endpoints
curl http://localhost:3001/

# Get RG status (example)
curl "http://localhost:3001/api/rg/status?idCommitment=test123"
```

Or use a tool like **Postman** or **Thunder Client** (VS Code extension).

## 🔄 Running Frontend + Backend Together

1. **Terminal 1**: Start the backend

   ```bash
   cd backend
   npm run dev
   ```

2. **Terminal 2**: Start the frontend (from root)
   ```bash
   npm run dev
   ```

Now you have:

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 📝 Next Steps

### For Production Use:

1. **Implement Market Logic**
   - Connect to Solana program in `routes/markets.js`
   - Add transaction signing and submission

2. **Add Database Models**
   - Create Mongoose schemas in `src/models/`
   - Store bets, users, markets in MongoDB

3. **Add Authentication**
   - Verify Privy tokens
   - Add auth middleware to protected routes

4. **Implement Oracle Service**
   - Connect to Pyth Network in `routes/oracle.js`
   - Fetch real-time price data

5. **Add Rate Limiting**
   - Protect against abuse
   - Use express-rate-limit

6. **Deploy**
   - Use PM2 for process management
   - Set up nginx reverse proxy
   - Deploy to VPS or cloud platform

## 📚 Documentation

See `backend/README.md` for detailed documentation including:

- Full API reference
- Development guidelines
- Deployment instructions
- Troubleshooting

## 🎯 Current Status

✅ Backend structure created
✅ All route handlers stubbed
✅ Concordium RG service implemented (mock mode)
✅ Database connection configured
✅ CORS configured for frontend
✅ Dependencies installed

⚠️ **Note**: Most endpoints are stubs and need implementation with actual Solana program interaction and database queries.

## 🐛 Troubleshooting

**Port 3001 already in use?**

- Change `PORT` in `.env`
- Or kill the process: `netstat -ano | findstr :3001`

**MongoDB connection error?**

- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`

**CORS errors?**

- Check `FRONTEND_URL` matches your frontend (http://localhost:3000)

---

**Happy coding! 🚀**

For questions or issues, check the detailed README in the `backend/` folder.
