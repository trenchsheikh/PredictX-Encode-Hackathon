# Vercel Environment Variables Setup

This document outlines all the environment variables needed for deploying DarkBet to Vercel.

## Required Environment Variables

### 1. MongoDB Configuration
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/darkbet?retryWrites=true&w=majority
```

### 2. Privy Wallet Configuration
```
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id_here
```

### 3. AI Service Configuration
```
NEXT_PUBLIC_AI_PROVIDER=gemini
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_GEMINI_MODEL=gemini-1.5-flash
```

### 4. Application Configuration
```
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_API_URL=/api
```

### 5. Blockchain Configuration
```
NEXT_PUBLIC_CHAIN_ID=97
NEXT_PUBLIC_PREDICTION_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_VAULT_CONTRACT_ADDRESS=0x...
```

### 6. Backend Configuration (Render backend)
```
NEXT_PUBLIC_BACKEND_URL=https://your-backend.onrender.com
# OR use NEXT_PUBLIC_API_URL to override
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
```

## Optional Environment Variables

### Oracle/Admin Configuration
```
ORACLE_ADMIN_KEY=your_secure_admin_key
ADMIN_PRIVATE_KEY=your_admin_private_key
```

### Alternative AI Providers
```
# For OpenAI
NEXT_PUBLIC_AI_PROVIDER=openai
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key

# For Anthropic
NEXT_PUBLIC_AI_PROVIDER=anthropic
NEXT_PUBLIC_ANTHROPIC_API_KEY=your_anthropic_api_key

# For Custom Provider
NEXT_PUBLIC_AI_PROVIDER=custom
NEXT_PUBLIC_AI_API_KEY=your_api_key
NEXT_PUBLIC_AI_BASE_URL=https://your-custom-endpoint.com
```

## Vercel Deployment Steps

1. **Connect your repository to Vercel**
2. **Set environment variables in Vercel dashboard:**
   - Go to Project Settings → Environment Variables
   - Add all required variables listed above
   - Make sure to set them for Production, Preview, and Development environments

3. **Deploy:**
   - Vercel will automatically build and deploy your app
   - The build command is already set to `npm run build`
   - The output directory is automatically detected

## Important Notes

- All `NEXT_PUBLIC_` prefixed variables are exposed to the client-side
- Never put sensitive data in `NEXT_PUBLIC_` variables
- Use Vercel's environment variable encryption for sensitive data
- The MongoDB connection is optimized for serverless functions
- API routes are automatically converted to Vercel serverless functions

## Troubleshooting

### Build Failures
- Check that all required environment variables are set
- Ensure MongoDB URI is correct and accessible
- Verify Privy App ID is valid

### Runtime Errors
- Check Vercel function logs in the dashboard
- Ensure MongoDB connection string includes retryWrites=true
- Verify all API endpoints are working

### Performance Issues
- MongoDB connection is cached for serverless functions
- Consider using Vercel's Edge Runtime for better performance
- Monitor function execution times in Vercel dashboard
