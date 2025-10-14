# DarkBet Vercel Deployment Guide

## 🚀 Quick Deployment Steps

### 1. Prepare Your Repository

- [ ] Push your code to GitHub
- [ ] Ensure all dependencies are in `package.json`
- [ ] Test locally with `npm run build`

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings

### 3. Configure Environment Variables

In your Vercel project dashboard, go to Settings > Environment Variables and add:

```
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id_here
NEXT_PUBLIC_VAULT_CONTRACT_ADDRESS=your_contract_address
NEXT_PUBLIC_CHAIN_ID=56
NEXT_PUBLIC_RPC_URL=https://bsc-dataseed.binance.org/
```

### 4. Deploy

- Click "Deploy"
- Wait for build to complete
- Your app will be live at `https://your-project.vercel.app`

## 🔧 Required Environment Variables

| Variable                             | Description               | Example                             |
| ------------------------------------ | ------------------------- | ----------------------------------- |
| `NEXT_PUBLIC_PRIVY_APP_ID`           | Your Privy application ID | `clx1234567890`                     |
| `NEXT_PUBLIC_VAULT_CONTRACT_ADDRESS` | Deployed vault contract   | `0x1234...5678`                     |
| `NEXT_PUBLIC_CHAIN_ID`               | BNB Chain ID              | `56` (mainnet)                      |
| `NEXT_PUBLIC_RPC_URL`                | BNB Chain RPC URL         | `https://bsc-dataseed.binance.org/` |

## 🎯 Getting Your Privy App ID

1. Visit [privy.io](https://privy.io)
2. Create account or login
3. Create new application
4. Copy App ID from dashboard
5. Add to Vercel environment variables

## 📱 Domain Configuration

### Custom Domain (Optional)

1. Go to Project Settings > Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate

### Subdomain

- Default: `your-project.vercel.app`
- Custom: `your-domain.com`

## 🔍 Troubleshooting

### Build Failures

- Check all dependencies are in `package.json`
- Ensure TypeScript errors are resolved
- Verify environment variables are set

### Runtime Errors

- Check browser console for errors
- Verify Privy App ID is correct
- Ensure contract addresses are valid

### Performance Issues

- Enable Vercel Analytics
- Check Core Web Vitals
- Optimize images and assets

## 📊 Post-Deployment Checklist

- [ ] App loads without errors
- [ ] Wallet connection works
- [ ] All pages are accessible
- [ ] Mobile responsive
- [ ] Favicon displays correctly
- [ ] Environment variables working
- [ ] Analytics tracking (if enabled)

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to:

- `main` branch → Production
- Other branches → Preview deployments

## 📈 Monitoring

- **Vercel Analytics**: Built-in performance monitoring
- **Function Logs**: Check serverless function logs
- **Build Logs**: Monitor deployment process

## 🆘 Support

If you encounter issues:

1. Check Vercel deployment logs
2. Verify environment variables
3. Test locally first
4. Contact Vercel support if needed

---

**Your DarkBet app is now ready for production! 🎉**
