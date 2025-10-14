# DarkBet Deployment Guide

This guide covers deploying DarkBet to production using Vercel (frontend) and Render (backend).

## 🚀 Prerequisites

- GitHub repository with your code
- MongoDB Atlas account
- Vercel account
- Render account
- BNB Smart Chain Testnet RPC URL
- Privy App ID

## 📋 Pre-Deployment Checklist

- [ ] Smart contracts deployed to BNB Smart Chain Testnet
- [ ] Contract addresses noted
- [ ] MongoDB database created
- [ ] Privy app created and configured
- [ ] Admin private key ready (with BNB for gas fees)

## 🔧 Backend Deployment (Render)

### 1. Connect Repository
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the repository

### 2. Configure Service
- **Name**: `darkbet-backend`
- **Environment**: `Node`
- **Build Command**: `cd backend && npm install && npm run build`
- **Start Command**: `cd backend && npm start`
- **Root Directory**: Leave empty (we'll set it in build command)

### 3. Environment Variables
Add these environment variables in Render:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/darkbet
BSC_TESTNET_RPC_URL=https://data-seed-prefork-1-s1.binance.org:8545
ADMIN_PRIVATE_KEY=your_admin_private_key_here
PREDICTION_CONTRACT_ADDRESS=0x...
VAULT_CONTRACT_ADDRESS=0x...
NODE_ENV=production
PORT=3001
```

### 4. Deploy
1. Click "Create Web Service"
2. Wait for deployment to complete
3. Note the Render URL (e.g., `https://darkbet.onrender.com`)

## 🌐 Frontend Deployment (Vercel)

### 1. Connect Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository

### 2. Configure Project
- **Framework Preset**: Next.js
- **Root Directory**: Leave empty (root)
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

### 3. Environment Variables
Add these environment variables in Vercel:

```env
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id_here
NEXT_PUBLIC_PREDICTION_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_VAULT_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_BACKEND_URL=https://your-render-app.onrender.com
```

### 4. Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. Note the Vercel URL (e.g., `https://darkbet.vercel.app`)

## 🔄 Post-Deployment

### 1. Update CORS Settings
The backend should automatically allow your Vercel domain. If you encounter CORS issues:

1. Go to your Render backend dashboard
2. Check the logs for CORS errors
3. Update the CORS configuration in `backend/src/server.ts` if needed

### 2. Test the Application
1. Visit your Vercel URL
2. Connect a wallet
3. Try creating a prediction market
4. Check that data loads correctly

### 3. Monitor Logs
- **Vercel**: Check function logs in the Vercel dashboard
- **Render**: Check application logs in the Render dashboard

## 🛠️ Troubleshooting

### Common Issues

#### CORS Errors
```
Access to fetch at 'https://darkbet.onrender.com/markets' from origin 'https://darkbet.vercel.app' has been blocked by CORS policy
```

**Solution**: Update CORS configuration in backend to include your Vercel domain.

#### Database Connection Issues
```
MongoServerError: connection timed out
```

**Solution**: 
1. Check MongoDB Atlas IP whitelist
2. Verify connection string
3. Check network connectivity

#### Contract Not Found
```
Error: Contract not found at address 0x...
```

**Solution**:
1. Verify contract addresses are correct
2. Ensure contracts are deployed to the correct network
3. Check that admin private key has access

#### Privy Connection Issues
```
Privy: Invalid app ID
```

**Solution**:
1. Verify Privy App ID is correct
2. Check Privy app configuration
3. Ensure domain is whitelisted in Privy dashboard

### Debug Mode

To enable debug logging:

1. **Backend**: Set `NODE_ENV=development` in Render environment variables
2. **Frontend**: Check browser console for API client debug logs

## 📊 Monitoring

### Health Checks
- **Backend**: `https://your-render-app.onrender.com/health`
- **Frontend**: Check Vercel function logs

### Key Metrics to Monitor
- API response times
- Database connection status
- Smart contract interaction success rates
- User wallet connection success rates

## 🔄 Updates and Maintenance

### Updating the Application
1. Push changes to your GitHub repository
2. Vercel and Render will automatically redeploy
3. Monitor logs for any issues

### Database Maintenance
- Regular backups via MongoDB Atlas
- Monitor connection pool usage
- Check for slow queries

### Smart Contract Updates
- Deploy new contracts to testnet first
- Update contract addresses in both frontend and backend
- Test thoroughly before mainnet deployment

## 🚨 Emergency Procedures

### If Backend is Down
1. Check Render dashboard for service status
2. Review application logs
3. Restart service if necessary
4. Check database connectivity

### If Frontend is Down
1. Check Vercel dashboard for deployment status
2. Review function logs
3. Check environment variables
4. Redeploy if necessary

### If Database is Down
1. Check MongoDB Atlas status
2. Verify connection string
3. Check IP whitelist
4. Contact MongoDB support if needed

## 📞 Support

For deployment issues:
- Check the troubleshooting section above
- Review application logs
- Create an issue in the GitHub repository
- Check Vercel and Render documentation

---

**Remember**: Always test thoroughly in development before deploying to production!