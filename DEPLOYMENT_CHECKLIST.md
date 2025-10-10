# 🚀 DarkBet Vercel Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Code Quality
- [x] **Build Success**: `npm run build` completes without errors
- [x] **TypeScript**: All type errors resolved
- [x] **Linting**: No ESLint errors
- [x] **Dependencies**: All packages properly installed

### 2. Configuration Files
- [x] **package.json**: Updated with correct project name "darkbet"
- [x] **next.config.js**: Optimized for Vercel deployment
- [x] **vercel.json**: Deployment configuration ready
- [x] **README.md**: Updated with deployment instructions

### 3. Environment Variables
- [x] **ENV_SETUP.md**: Environment variable guide created
- [x] **DEPLOYMENT.md**: Step-by-step deployment guide
- [x] **Privy Config**: Fixed embeddedWallets configuration

### 4. Assets & Favicon
- [x] **Logo**: darkbet.jpg in public directory
- [x] **Favicon Setup**: Metadata configured for favicon
- [x] **Manifest**: site.webmanifest created
- [x] **OpenGraph**: Social media preview images configured

## 🎯 Deployment Steps

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### Step 2: Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with GitHub
3. Click "New Project"
4. Import your repository
5. Vercel auto-detects Next.js settings

### Step 3: Configure Environment Variables
In Vercel dashboard → Project Settings → Environment Variables:

```env
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id_here
NEXT_PUBLIC_VAULT_CONTRACT_ADDRESS=your_contract_address
NEXT_PUBLIC_CHAIN_ID=56
NEXT_PUBLIC_RPC_URL=https://bsc-dataseed.binance.org/
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```

### Step 4: Deploy
- Click "Deploy"
- Wait for build completion
- App will be live at `https://your-project.vercel.app`

## 🔧 Required Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_PRIVY_APP_ID` | Privy application ID | ✅ Yes |
| `NEXT_PUBLIC_VAULT_CONTRACT_ADDRESS` | Vault contract address | ✅ Yes |
| `NEXT_PUBLIC_CHAIN_ID` | BNB Chain ID (56 for mainnet) | ✅ Yes |
| `NEXT_PUBLIC_RPC_URL` | BNB Chain RPC URL | ✅ Yes |
| `NEXT_PUBLIC_APP_URL` | Your Vercel app URL | ⚠️ Optional |

## 📱 Post-Deployment Verification

### Functionality Tests
- [ ] App loads without errors
- [ ] Wallet connection works
- [ ] All pages accessible (/, /my-bets, /how-it-works, /leaderboard)
- [ ] Language toggle works (EN/中文)
- [ ] Mobile responsive design
- [ ] Favicon displays in browser tab

### Performance Checks
- [ ] Page load times < 3 seconds
- [ ] Core Web Vitals passing
- [ ] Images optimized
- [ ] No console errors

### SEO & Social
- [ ] Meta tags working
- [ ] OpenGraph images loading
- [ ] Twitter cards working
- [ ] Favicon visible in bookmarks

## 🆘 Troubleshooting

### Build Failures
- Check all dependencies in package.json
- Verify TypeScript errors resolved
- Ensure environment variables set

### Runtime Errors
- Check browser console
- Verify Privy App ID correct
- Confirm contract addresses valid

### Performance Issues
- Enable Vercel Analytics
- Check Core Web Vitals
- Optimize images and assets

## 📊 Monitoring Setup

### Vercel Analytics
1. Go to Project Settings → Analytics
2. Enable Vercel Analytics
3. Monitor Core Web Vitals

### Error Tracking
- Check Function Logs in Vercel dashboard
- Monitor Build Logs for deployment issues
- Set up alerts for critical errors

## 🎉 Success Criteria

Your DarkBet app is successfully deployed when:
- ✅ Build completes without errors
- ✅ App loads at your Vercel URL
- ✅ Wallet connection functional
- ✅ All features working
- ✅ Mobile responsive
- ✅ SEO optimized

---

**🚀 Your DarkBet app is ready for production deployment!**
