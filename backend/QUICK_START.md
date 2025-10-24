# 🚀 Backend Quick Start

## Start the Backend (3 Ways)

### 1️⃣ Double-Click Start (Easiest - Windows)

From the **root folder** (not backend folder), double-click:

```
START_BACKEND.bat
```

### 2️⃣ Command Line (Development)

```bash
cd backend
npm run dev
```

### 3️⃣ Production Mode

```bash
cd backend
npm start
```

## ✅ Verify It's Running

Open in your browser:

- http://localhost:3001
- http://localhost:3001/api/health

You should see JSON responses!

## 🧪 Test Endpoints

```bash
# Health check
curl http://localhost:3001/api/health

# List markets
curl http://localhost:3001/api/markets

# Get RG status (example)
curl "http://localhost:3001/api/rg/status?idCommitment=test123"
```

## 🔧 Common Issues

**Port 3001 already in use?**

- Change `PORT=3002` in `.env`
- Or kill the process using port 3001

**MongoDB error?**

- Server will start anyway!
- Some features won't work until MongoDB is connected

**Can't find modules?**

```bash
cd backend
npm install
```

## 📡 All Endpoints

Once running, these are available:

- `GET /api/health` - Health check
- `GET /api/markets` - Markets list
- `GET /api/markets/:id` - Market details
- `POST /api/markets/:id/commit` - Place bet
- `GET /api/oracle/prices` - Price data
- `POST /api/rg/link-identity` - Link identity
- `POST /api/rg/check` - Check if bet allowed
- `GET /api/rg/status` - Get RG status
- `POST /api/rg/record-bet` - Record bet
- `POST /api/rg/set-limit` - Set limits
- `POST /api/rg/self-exclude` - Self-exclude
- `GET /api/users/:address/bets` - User bets
- `GET /api/users/leaderboard` - Leaderboard

## 🎯 Next Steps

1. ✅ Backend is running
2. Start your frontend: `npm run dev` (from root folder)
3. Frontend at http://localhost:3000
4. Backend at http://localhost:3001

That's it! 🎉

For detailed docs, see: `backend/README.md`
