# AI Integration Setup Guide

This guide explains how to set up real AI functionality for the DarkBet prediction market creation process.

## Overview

The AI integration automatically analyzes prediction descriptions and generates:

- **Smart titles** - Clear, concise prediction titles
- **Categories** - Appropriate categorization (sports, crypto, politics, etc.)
- **Expiration dates** - Reasonable timeframes based on the prediction type
- **Resolution instructions** - Detailed criteria for determining outcomes
- **Betting options** - Suggested YES/NO or custom options

## Supported AI Providers

### 1. OpenAI (Recommended)

```bash
NEXT_PUBLIC_AI_PROVIDER=openai
NEXT_PUBLIC_AI_API_KEY=sk-your-openai-api-key
NEXT_PUBLIC_AI_BASE_URL=https://api.openai.com/v1/chat/completions
NEXT_PUBLIC_AI_MODEL=gpt-3.5-turbo
```

### 2. Anthropic Claude

```bash
NEXT_PUBLIC_AI_PROVIDER=anthropic
NEXT_PUBLIC_AI_API_KEY=sk-ant-your-anthropic-api-key
NEXT_PUBLIC_AI_BASE_URL=https://api.anthropic.com/v1/messages
NEXT_PUBLIC_AI_MODEL=claude-3-sonnet-20240229
```

### 3. Custom API

```bash
NEXT_PUBLIC_AI_PROVIDER=custom
NEXT_PUBLIC_AI_API_KEY=your-custom-api-key
NEXT_PUBLIC_AI_BASE_URL=https://your-api.com/analyze
```

## Setup Instructions

### Step 1: Get an API Key

**For OpenAI:**

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-`)

**For Anthropic:**

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-ant-`)

### Step 2: Configure Environment Variables

Create a `.env.local` file in your project root:

```bash
# Copy from env.example and fill in your values
NEXT_PUBLIC_AI_PROVIDER=openai
NEXT_PUBLIC_AI_API_KEY=sk-your-actual-api-key-here
NEXT_PUBLIC_AI_BASE_URL=https://api.openai.com/v1/chat/completions
NEXT_PUBLIC_AI_MODEL=gpt-3.5-turbo
```

### Step 3: Test the Integration

1. Start your development server: `npm run dev`
2. Open the app and click "Create Bet"
3. Enter a prediction description (e.g., "Bitcoin will reach $100,000 by end of 2024")
4. Click the "Analyze" button
5. Watch as AI generates a title, category, and resolution instructions

## How It Works

### AI Analysis Process

1. **User Input**: User describes their prediction in natural language
2. **AI Processing**: The AI service sends the description to your chosen provider
3. **Smart Generation**: AI analyzes and generates:
   - **Title**: "Will Bitcoin reach $100,000 by December 31, 2024?"
   - **Category**: "crypto" (automatically detected)
   - **Expiration**: 30 days (reasonable timeframe for crypto predictions)
   - **Resolution**: "Determine based on Bitcoin's closing price on December 31, 2024 using CoinGecko or CoinMarketCap data"
   - **Options**: ["YES", "NO"] (or custom options for complex predictions)

### Fallback Behavior

If the AI service fails:

- The system falls back to a simple mock analysis
- Users can still create predictions manually
- No functionality is lost

## Customization

### Modifying AI Prompts

Edit `lib/ai-service.ts` to customize the AI analysis prompt:

```typescript
private buildPrompt(description: string, category: string): string {
  return `Your custom prompt here...`;
}
```

### Adding New Categories

Update the category validation in `components/prediction/create-bet-modal.tsx`:

```typescript
const createPredictionSchema = z.object({
  category: z.enum([
    'sports',
    'crypto',
    'politics',
    'entertainment',
    'weather',
    'finance',
    'technology',
    'custom',
    'your-new-category',
  ]),
  // ...
});
```

### Custom API Integration

To integrate with your own AI API:

1. Set `NEXT_PUBLIC_AI_PROVIDER=custom`
2. Provide your API endpoint in `NEXT_PUBLIC_AI_BASE_URL`
3. Ensure your API returns JSON in this format:

```json
{
  "title": "Generated title",
  "category": "sports",
  "expiresInDays": 7,
  "resolutionInstructions": "How to determine the outcome",
  "suggestedOptions": ["YES", "NO"]
}
```

## Security Notes

- **API Keys**: Never commit API keys to version control
- **Rate Limiting**: Consider implementing rate limiting for production
- **Cost Management**: Monitor API usage to avoid unexpected charges
- **Error Handling**: The system gracefully handles API failures

## Troubleshooting

### Common Issues

**"AI service not initialized" error:**

- Check that `NEXT_PUBLIC_AI_API_KEY` is set correctly
- Verify the API key is valid and has sufficient credits

**"Failed to parse AI response" error:**

- The AI response format might be unexpected
- Check the AI service logs for the actual response
- Consider updating the prompt for better JSON formatting

**Slow AI responses:**

- Try using a faster model (e.g., `gpt-3.5-turbo` instead of `gpt-4`)
- Check your internet connection
- Consider implementing a loading state

### Debug Mode

Enable debug logging by adding to your `.env.local`:

```bash
NEXT_PUBLIC_DEBUG_AI=true
```

This will log AI requests and responses to the browser console.

## Production Deployment

### Vercel Deployment

1. Add environment variables in Vercel dashboard:
   - Go to your project settings
   - Navigate to Environment Variables
   - Add all `NEXT_PUBLIC_AI_*` variables

2. Redeploy your application

### Other Platforms

Ensure your hosting platform supports:

- Environment variable configuration
- HTTPS (required for most AI APIs)
- Node.js runtime

## Cost Estimation

### OpenAI Pricing (as of 2024)

- **GPT-3.5-turbo**: ~$0.001 per prediction analysis
- **GPT-4**: ~$0.01 per prediction analysis

### Anthropic Pricing (as of 2024)

- **Claude-3-sonnet**: ~$0.003 per prediction analysis

### Usage Optimization

- Use GPT-3.5-turbo for cost efficiency
- Implement caching for repeated analyses
- Consider rate limiting for high-traffic scenarios

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify your API key and configuration
3. Test with a simple prediction description
4. Check the AI service provider's status page

The AI integration is designed to be robust and will gracefully handle failures while maintaining full functionality.
