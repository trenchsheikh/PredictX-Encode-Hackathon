# CORS Fix for Render Backend

## What was changed:
1. Updated CORS configuration in `backend/src/server.ts` to allow your frontend domain
2. Added proper origin checking with fallback for development
3. Updated frontend API client to use the correct backend URL

## To deploy the fix:

### Option 1: If using Git deployment on Render
1. Commit the changes:
   ```bash
   git add backend/src/server.ts
   git commit -m "Fix CORS configuration for frontend domain"
   git push origin main
   ```

### Option 2: If using manual deployment
1. Build the backend:
   ```bash
   cd backend
   npm run build
   ```

2. Deploy the built files to Render

## Expected result:
- CORS errors should be resolved
- Frontend at `https://www.darkbet.fun` should be able to communicate with backend at `https://darkbet.onrender.com`
- All API endpoints should work properly

## Test the fix:
1. Open browser dev tools
2. Go to your frontend at `https://www.darkbet.fun`
3. Check the Network tab for any CORS errors
4. Try using the app - API calls should work without CORS issues
