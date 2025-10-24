# Google Gemini AI Setup Guide

This guide will help you set up Google Gemini AI for DarkBet's prediction market analysis feature.

## Getting Your Gemini API Key

1. **Visit Google AI Studio**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account

2. **Create API Key**
   - Click "Create API Key" or "Get API Key"
   - Select your Google Cloud project (or create a new one)
   - Copy your API key

3. **Configure DarkBet**
   - Copy `env.example` to `.env.local`:
     ```bash
     cp env.example .env.local
     ```
   - Open `.env.local` and add your API key:
     ```bash
     NEXT_PUBLIC_GEMINI_API_KEY=your_actual_api_key_here
     ```

## Environment Variables

### Required

- `NEXT_PUBLIC_GEMINI_API_KEY` - Your Google Gemini API key

### Optional

- `NEXT_PUBLIC_GEMINI_MODEL` - Model to use (default: `gemini-1.5-flash`)
  - Options: `gemini-1.5-flash`, `gemini-1.5-pro`
- `NEXT_PUBLIC_AI_PROVIDER` - AI provider (default: `gemini`)

## Available Models

### Gemini 1.5 Flash (Recommended)

- **Best for**: Fast, cost-effective responses
- **Use case**: General prediction analysis
- **Token limit**: 1M tokens context
- **Model name**: `gemini-1.5-flash`

### Gemini 1.5 Pro

- **Best for**: Complex, detailed analysis
- **Use case**: Advanced predictions requiring deeper reasoning
- **Token limit**: 2M tokens context
- **Model name**: `gemini-1.5-pro`

## Example Configuration

```bash
# Gemini AI Configuration
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSyD_your_actual_key_here
NEXT_PUBLIC_GEMINI_MODEL=gemini-1.5-flash
NEXT_PUBLIC_AI_PROVIDER=gemini

# Privy Configuration
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Features Powered by Gemini

The Gemini AI service helps with:

1. **Title Generation**: Creates clear, concise prediction titles
2. **Category Classification**: Automatically categorizes predictions
3. **Expiration Suggestions**: Recommends appropriate deadlines
4. **Resolution Instructions**: Generates detailed resolution criteria
5. **Option Suggestions**: Proposes betting options beyond YES/NO

## How It Works

When a user creates a prediction:

1. User enters a description
2. User clicks "Analyze" button
3. DarkBet sends the description to Gemini
4. Gemini analyzes and returns:
   - Optimized title
   - Suggested category
   - Recommended expiration date
   - Clear resolution instructions
   - Optional: Additional betting options

## Pricing

- Gemini 1.5 Flash: Free tier available with rate limits
- Gemini 1.5 Pro: Higher rates for advanced features

Check [Google AI Pricing](https://ai.google.dev/pricing) for current rates.

## Troubleshooting

### API Key Not Working

- Verify the key is correct
- Ensure the key has API access enabled
- Check if you've exceeded rate limits

### Model Not Found

- Verify model name is correct
- Try using `gemini-1.5-flash` instead of pro
- Check Gemini API documentation for available models

### Rate Limiting

- Implement request throttling in your application
- Consider upgrading to paid tier
- Cache AI responses when possible

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for all sensitive data
3. **Rotate keys regularly** for security
4. **Monitor usage** to detect unusual activity
5. **Set up billing alerts** to avoid unexpected charges

## Alternative Providers

If you prefer to use a different AI provider:

### OpenAI

```bash
NEXT_PUBLIC_AI_PROVIDER=openai
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_key
```

### Anthropic Claude

```bash
NEXT_PUBLIC_AI_PROVIDER=anthropic
NEXT_PUBLIC_ANTHROPIC_API_KEY=your_anthropic_key
```

## Support

For issues with:

- **Gemini API**: Visit [Google AI Studio Help](https://ai.google.dev/docs)
- **DarkBet Integration**: Open an issue on GitHub
- **API Limits**: Check [Google Cloud Console](https://console.cloud.google.com)

---

**Ready to start?** Copy `env.example` to `.env.local` and add your Gemini API key!
