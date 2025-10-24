# NewsAPI.ai Integration Setup Guide

## 🚀 Quick Start

### 1. Get NewsAPI Key

1. Visit https://newsapi.org/
2. Sign up for a free account
3. Copy your API key from the dashboard

### 2. Configure Backend

Add to your `.env` file (in the root directory):

```bash
# NewsAPI Configuration
NEWSAPI_KEY=your_api_key_here

# Existing config...
MONGODB_URI=mongodb+srv://...
BSC_RPC_URL=https://bsc-dataseed.binance.org/
# ...etc
```

### 3. Restart Backend Server

```bash
cd backend
npm run dev  # or pnpm dev
```

You should see:

```
📰 News monitoring service started
```

### 4. Test the Integration

#### A. Test NewsAPI Connection

```bash
curl http://localhost:3001/api/event-predictions
```

Should return: `{"success":true,"data":[],"pagination":{...}}`

#### B. Create a Test Event Prediction

Use the frontend "Create Event Prediction" button (coming in next step) or via API:

```bash
curl -X POST http://localhost:3001/api/event-predictions \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Will Bitcoin reach $100,000 by December 2025?",
    "description": "This prediction will resolve as YES if Bitcoin (BTC) reaches or exceeds $100,000 USD at any point before the expiration date.",
    "category": "1",
    "expiresAt": "2025-12-31T23:59:59Z",
    "keywords": ["Bitcoin", "BTC", "$100000", "cryptocurrency"],
    "creator": "0xYourAddress",
    "txHash": "0xYourTransactionHash",
    "marketId": 123
  }'
```

#### C. Manually Trigger News Check

```bash
curl -X POST http://localhost:3001/api/event-predictions/123/check
```

## 🎨 Frontend Integration (Next Steps)

### 1. Add Event Predictions Button to Homepage

In `app/page.tsx`, add a tab/toggle system:

```tsx
const [predictionType, setPredictionType] = useState<'crypto' | 'event'>(
  'crypto'
);

// In your markets section:
<div className="mb-6 flex gap-4">
  <Button
    variant={predictionType === 'crypto' ? 'default' : 'outline'}
    onClick={() => setPredictionType('crypto')}
  >
    Crypto Predictions
  </Button>
  <Button
    variant={predictionType === 'event' ? 'default' : 'outline'}
    onClick={() => setPredictionType('event')}
  >
    Event Predictions
  </Button>

  {authenticated && (
    <Button onClick={() => setShowCreateEventModal(true)}>
      Create Event Prediction
    </Button>
  )}
</div>;
```

### 2. Import and Use the Modal

```tsx
import { CreateEventPredictionModal } from '@/components/prediction/create-event-prediction-modal';

// Add state:
const [showCreateEventModal, setShowCreateEventModal] = useState(false);

// Add modal:
<CreateEventPredictionModal
  open={showCreateEventModal}
  onOpenChange={setShowCreateEventModal}
  onConfirm={handleCreateEventPrediction}
/>;
```

### 3. Implement the Handler

```tsx
const handleCreateEventPrediction = async (data: EventPredictionData) => {
  try {
    // Step 1: Create market on blockchain
    const tx = await contract.createMarket(
      data.title,
      data.description,
      parseInt(data.category),
      Math.floor(data.expiresAt.getTime() / 1000),
      ethers.parseEther(data.amount.toString())
    );

    await tx.wait();

    // Step 2: Get market ID from blockchain event
    const marketId = /* extract from tx event */;

    // Step 3: Save event data to backend
    await api.eventPredictions.createEventPrediction({
      ...data,
      creator: user.wallet.address,
      txHash: tx.hash,
      marketId,
    });

    toast.success('Event prediction created!');
  } catch (error) {
    console.error('Failed to create event prediction:', error);
    throw error;
  }
};
```

## 📊 Monitoring & Debugging

### Check Backend Logs

Watch for these messages:

```
🔍 Checking active event predictions...
📊 Found X active event prediction(s) to check
🔎 Checking market 123: "Will Bitcoin reach $100,000..."
📊 Market 123 verification: ✅ VERIFIED (confidence: 85.3%, threshold: 60.0%)
✨ Event VERIFIED for market 123! Triggering resolution...
```

### Check MongoDB

```javascript
// In MongoDB Compass or shell:
db.markets.find({ predictionType: 'event' });
```

Should show your event predictions with `eventData` field populated.

### Monitor NewsAPI Usage

Free tier: 100 requests/day

- Each keyword search = 1 request
- With 5 keywords, checking 1 market = 5 requests
- Monitoring service checks every 5 minutes
- Can monitor ~3-4 active events continuously on free tier

For production, consider upgrading to a paid plan.

## 🧪 Testing Scenarios

### Scenario 1: Fast Event (Testing)

```json
{
  "title": "Did Elon Musk post on Twitter today?",
  "keywords": ["Elon Musk", "Twitter", "X"],
  "expiresAt": "2025-10-19T23:59:59Z"
}
```

Should resolve quickly as news about Elon is frequent.

### Scenario 2: Specific Event

```json
{
  "title": "Will Tesla announce new Model 3 by Q4 2025?",
  "keywords": ["Tesla", "Model 3", "announcement", "2025"],
  "expiresAt": "2025-12-31T23:59:59Z"
}
```

### Scenario 3: Political Event

```json
{
  "title": "Will Trump win the 2024 US Presidential Election?",
  "keywords": ["Trump", "election", "president", "2024", "winner"],
  "expiresAt": "2024-11-10T00:00:00Z"
}
```

## 🔒 Security Best Practices

1. **Never commit API keys** - Use environment variables
2. **Rate limit frontend requests** - Prevent API abuse
3. **Validate keywords** - Prevent injection attacks
4. **Monitor costs** - Track NewsAPI usage
5. **Set reasonable thresholds** - Default 60% confidence is safe

## 📈 Performance Tips

1. **Limit active events** - Monitor 5-10 events max on free tier
2. **Use specific keywords** - Reduces false positives
3. **Increase check interval** - Default 5min is aggressive
4. **Cache news results** - Reduce API calls

## 🐛 Troubleshooting

### Error: "NewsAPI key not configured"

- Check `.env` file has `NEWSAPI_KEY`
- Restart backend server
- Verify environment variable is loaded: `console.log(process.env.NEWSAPI_KEY)`

### Error: "Rate limit exceeded"

- You've hit NewsAPI's daily limit (100 requests)
- Wait 24 hours or upgrade plan
- Reduce number of keywords per event
- Increase monitoring interval

### Event never resolves

- Check keywords are specific enough
- Verify event is actually newsworthy
- Lower verification threshold (default 0.6)
- Check backend logs for errors

### Frontend can't connect to backend

- Verify backend is running on port 3001
- Check CORS settings allow frontend origin
- Verify `NEXT_PUBLIC_BACKEND_URL` in frontend `.env`

## 🎉 Success Checklist

- [ ] NewsAPI key obtained and configured
- [ ] Backend starts with "📰 News monitoring service started"
- [ ] Can create event predictions via API
- [ ] Events appear in MongoDB with `eventData`
- [ ] Backend logs show monitoring checks every 5 minutes
- [ ] Frontend modal renders correctly
- [ ] Can create event prediction from UI
- [ ] Event appears in "Event Predictions" section
- [ ] News articles displayed when event is verified
- [ ] Smart contract resolves correctly
- [ ] Payouts distributed to winners

## 📚 Resources

- **NewsAPI Docs**: https://newsapi.org/docs
- **MongoDB Compass**: Visualize event predictions
- **Backend Logs**: Check `backend/logs/` for detailed monitoring
- **Frontend Console**: Browser DevTools for debugging

## 🚨 Production Deployment

Before going live:

1. **Upgrade NewsAPI Plan** - Free tier insufficient for production
2. **Add Error Monitoring** - Sentry, LogRocket, etc.
3. **Set up Alerts** - Monitor resolution failures
4. **Database Backups** - Regular MongoDB backups
5. **Load Testing** - Test with 50+ concurrent events
6. **Rate Limiting** - Protect backend endpoints
7. **Caching Layer** - Redis for news results
8. **Redundancy** - Multiple news API providers

## 💡 Next Features

- **Manual override** - Admin can force resolution
- **Evidence voting** - Community verifies news articles
- **Multiple sources** - Support more news APIs
- **Confidence history** - Track verification over time
- **Notification system** - Alert users when resolved
- **Advanced filters** - Sort by confidence, category, etc.
