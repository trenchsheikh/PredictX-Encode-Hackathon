# NewsAPI Environment Setup

## Quick Setup

### 1. Get NewsAPI Key (2 minutes)

1. Visit https://newsapi.org/
2. Click "Get API Key" or "Sign Up"
3. Create a free account
4. Copy your API key from the dashboard

### 2. Add to Environment File

Open your `.env` file in the root directory and add:

```bash
# NewsAPI Configuration (for event predictions)
NEWSAPI_KEY=your_api_key_here
```

**Example:**

```bash
NEWSAPI_KEY=abc123def456ghi789jkl012mno345pqr
```

### 3. Restart Backend Server

```powershell
# In backend directory
cd backend
npm run dev
```

You should see:

```
📰 News monitoring service started
```

## Verification

### Test Backend is Running

```powershell
curl http://localhost:3001/api/event-predictions
```

Expected response:

```json
{
  "success": true,
  "data": [],
  "pagination": { "total": 0, "limit": 50, "offset": 0 }
}
```

### Test Frontend

1. Go to http://localhost:3000
2. You should see **three buttons** in the hero section:
   - Start Darkpool Betting (orange shimmer)
   - Crypto Darkpool (dark gradient)
   - 📰 News Events (blue gradient) **← NEW!**

3. Click "📰 News Events" button
4. Event prediction modal should open

## Free Tier Limits

- **100 requests per day**
- Each keyword search = 1 request
- With 5 keywords, checking 1 market = 5 requests
- Can monitor ~3-5 active events on free tier

## Upgrade for Production

For production use, consider upgrading:

- Developer Plan: $449/month (250,000 requests)
- Business Plan: Custom pricing

Visit: https://newsapi.org/pricing

## Troubleshooting

### Error: "NewsAPI key not configured"

**Solution**:

- Check `.env` file has `NEWSAPI_KEY=your_key_here`
- No quotes needed
- Restart backend server
- Verify: `echo $env:NEWSAPI_KEY` (PowerShell)

### Error: "Rate limit exceeded"

**Solution**:

- You've hit 100 requests/day limit
- Wait 24 hours
- Or upgrade your NewsAPI plan
- Or increase monitoring interval in backend

### Backend doesn't show "News monitoring service started"

**Solution**:

- Check `.env` file location (should be in root directory)
- Verify backend is loading environment variables
- Check for typos in `NEWSAPI_KEY`
- Ensure no spaces around the equals sign

### Frontend button doesn't appear

**Solution**:

- Clear browser cache
- Restart frontend dev server
- Check browser console for errors
- Verify all files were saved

## Features Unlocked

With NewsAPI configured, you can now:

✅ Create event-based predictions
✅ Automatic news monitoring every 5 minutes
✅ AI-powered event verification (confidence scoring)
✅ Automatic market resolution when verified
✅ News articles stored as evidence
✅ Same payout system as crypto predictions

## Next Steps

1. **Create Your First Event Prediction**
   - Click "📰 News Events" button
   - Fill in event details
   - Add 3-5 relevant keywords
   - Set expiration date
   - Make your bet!

2. **Monitor in Backend Logs**

   ```
   🔍 Checking active event predictions...
   📊 Found X active event prediction(s)
   🔎 Checking market Y: "Your Event Title"
   ```

3. **Watch for Auto-Resolution**
   ```
   ✨ Event VERIFIED for market X!
   🎯 Triggering resolution...
   ✅ Market X resolved successfully!
   ```

## Support

- **NewsAPI Docs**: https://newsapi.org/docs
- **DarkBet Setup Guide**: See `NEWSAPI_SETUP.md`
- **Integration Progress**: See `NEWSAPI_INTEGRATION_PROGRESS.md`

---

**Ready to bet on world events! 🌍📰🎲**
