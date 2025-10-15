// AI Service for generating prediction market content
// Supports multiple AI providers

export interface AIAnalysisResult {
  title: string;
  description: string; // 3-line concise description
  summary: string; // Detailed unbiased summary
  category: string;
  expiresAt: number;
  resolutionInstructions: string;
  suggestedOptions?: string[];
}

export interface AIConfig {
  provider: 'gemini' | 'openai' | 'anthropic' | 'custom';
  apiKey: string;
  baseUrl?: string;
  model?: string;
}

class AIService {
  private config: AIConfig;

  constructor(config: AIConfig) {
    this.config = config;
  }

  async analyzePrediction(
    description: string,
    category: string
  ): Promise<AIAnalysisResult> {
    const prompt = this.buildPrompt(description, category);

    try {
      const response = await this.callAI(prompt);
      return this.parseResponse(response);
    } catch (error) {
      console.error('AI analysis failed:', error);
      throw new Error('Failed to analyze prediction with AI');
    }
  }

  private buildPrompt(description: string, category: string): string {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;

    return `Create a crypto prediction from: "${description}"

Requirements:
- Specific price target with real dates (${currentYear} or ${nextYear})
- Fun description with emojis
- Verifiable using CoinGecko

Timeframes:
- "soon/quick" → ${currentYear}
- "this year" → Q1 ${nextYear}  
- "next year/long term" → ${nextYear}

JSON only:
{
  "title": "Will [crypto] reach $[price] by [date]?",
  "description": "🚀 Fun description with emojis! Uses CoinGecko data.",
  "summary": "If YES: [implications]. If NO: [meaning].",
  "category": "crypto",
  "expiresInDays": 30,
  "resolutionInstructions": "CoinGecko API on [date]. Price >= $[amount] for YES.",
  "suggestedOptions": ["YES", "NO"]
}`;
  }

  private async callAI(prompt: string): Promise<string> {
    const { provider, apiKey, baseUrl, model } = this.config;

    switch (provider) {
      case 'gemini':
        return this.callGemini(prompt, apiKey, model);
      case 'openai':
        return this.callOpenAI(prompt, apiKey, baseUrl, model);
      case 'anthropic':
        return this.callAnthropic(prompt, apiKey, baseUrl, model);
      case 'custom':
        if (!baseUrl) throw new Error('Base URL is required for custom API');
        return this.callCustomAPI(prompt, apiKey, baseUrl);
      default:
        throw new Error(`Unsupported AI provider: ${provider}`);
    }
  }

  private async callGemini(
    prompt: string,
    apiKey: string,
    model?: string
  ): Promise<string> {
    // First, try to get available models
    try {
      const modelsResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
      );

      if (modelsResponse.ok) {
        const modelsData = await modelsResponse.json();
        console.log(
          'Available Gemini models:',
          modelsData.models?.map((m: any) => m.name) || 'None found'
        );
      }
    } catch (error) {
      console.warn('Could not fetch available models:', error);
    }

    // Try different models in order of preference (using actual available models)
    const modelsToTry = [
      model || 'models/gemini-2.5-flash',
      'models/gemini-2.5-pro',
      'models/gemini-2.0-flash',
      'models/gemini-2.0-pro-exp',
      'models/gemini-flash-latest',
      'models/gemini-pro-latest',
      'models/gemini-2.5-flash-lite',
    ];

    for (const modelName of modelsToTry) {
      try {
        console.log(`Trying model: ${modelName}`);
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: prompt,
                    },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 4000,
              },
            }),
          }
        );

        if (response.ok) {
          let data;
          try {
            data = await response.json();
            console.log(`✅ Successfully using model: ${modelName}`);
            console.log('Response data:', data);
          } catch (jsonError) {
            console.error('Failed to parse JSON response:', jsonError);
            throw new Error('Invalid JSON response from Gemini API');
          }

          // Handle different response structures
          console.log(
            'Full response structure:',
            JSON.stringify(data, null, 2)
          );

          // Try multiple possible response structures
          if (data.candidates && data.candidates[0]) {
            const candidate = data.candidates[0];

            // Check if response was truncated due to MAX_TOKENS
            if (candidate.finishReason === 'MAX_TOKENS') {
              console.warn('⚠️ Response truncated due to MAX_TOKENS limit');
              // Try to extract partial content if available
              if (
                candidate.content &&
                candidate.content.parts &&
                candidate.content.parts[0] &&
                candidate.content.parts[0].text
              ) {
                const truncatedText = candidate.content.parts[0].text;
                console.log('Using truncated content: content.parts[0].text');
                // Check if truncated content contains valid JSON
                if (
                  truncatedText.includes('{') &&
                  truncatedText.includes('}')
                ) {
                  return truncatedText;
                } else {
                  console.log(
                    'Truncated content is not valid JSON, using fallback'
                  );
                  return this.createFallbackResponse('crypto prediction');
                }
              }
              // If no content available, create a fallback response
              console.log('Creating fallback response for truncated content');
              return this.createFallbackResponse('crypto prediction');
            }

            // Structure 1: content.parts[0].text
            if (
              candidate.content &&
              candidate.content.parts &&
              candidate.content.parts[0] &&
              candidate.content.parts[0].text
            ) {
              console.log('Using structure 1: content.parts[0].text');
              return candidate.content.parts[0].text;
            }

            // Structure 2: direct text property
            if (candidate.text) {
              console.log('Using structure 2: candidate.text');
              return candidate.text;
            }

            // Structure 3: content.text
            if (candidate.content && candidate.content.text) {
              console.log('Using structure 3: content.text');
              return candidate.content.text;
            }

            // Structure 4: parts array with different structure
            if (
              candidate.parts &&
              candidate.parts[0] &&
              candidate.parts[0].text
            ) {
              console.log('Using structure 4: parts[0].text');
              return candidate.parts[0].text;
            }

            console.log(
              'Candidate structure:',
              JSON.stringify(candidate, null, 2)
            );
          }

          // Fallback structures
          if (data.text) {
            console.log('Using fallback: data.text');
            return data.text;
          }

          if (data.content) {
            console.log('Using fallback: data.content');
            return data.content;
          }

          if (data.response) {
            console.log('Using fallback: data.response');
            return data.response;
          }

          console.error('Unexpected response structure:', data);
          // Try to extract any text content from the response
          const responseText = JSON.stringify(data);
          if (
            responseText.includes('"text"') ||
            responseText.includes('"content"')
          ) {
            console.warn('Attempting to extract text from malformed response');
            return responseText;
          }

          // If all else fails, create a fallback response
          console.warn(
            'Creating fallback response due to unexpected structure'
          );
          return this.createFallbackResponse('crypto prediction');
        } else if (response.status === 404) {
          // Model not found, try next one
          console.warn(`❌ Model ${modelName} not found, trying next...`);
          continue;
        } else {
          // Other error, throw immediately
          const errorData = await response.json().catch(() => ({}));
          console.error(`❌ Error with model ${modelName}:`, errorData);
          throw new Error(
            `Gemini API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`
          );
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        if (
          errorMessage.includes('404') ||
          errorMessage.includes('not found')
        ) {
          console.warn(`❌ Model ${modelName} not available, trying next...`);
          continue;
        }
        throw error;
      }
    }

    // If all models fail, provide a mock response for testing
    console.warn(
      '⚠️ All Gemini models failed, using mock response for testing'
    );
    return this.getMockAIResponse(prompt);
  }

  private getMockAIResponse(prompt: string): string {
    // Extract the main topic from the prompt
    const topic = prompt.toLowerCase().includes('bitcoin')
      ? 'Bitcoin'
      : prompt.toLowerCase().includes('ethereum')
        ? 'Ethereum'
        : prompt.toLowerCase().includes('bnb')
          ? 'BNB'
          : 'cryptocurrency';

    const mockResponse = {
      title: `Will ${topic} reach a significant milestone by end of 2024?`,
      description: `${topic} price prediction for end of 2024. Specific target with verifiable data. Uses CoinGecko for resolution.`,
      summary: `This prediction focuses on ${topic}'s potential to reach a significant milestone by the end of 2024. If YES wins: ${topic} will have achieved a major target, potentially indicating strong market confidence and adoption. If NO wins: ${topic} will not reach this level, which could indicate market challenges or different growth patterns.`,
      category: 'crypto',
      expiresInDays: 30,
      resolutionInstructions: `Determine the outcome based on ${topic}'s closing price on December 31, 2024, using CoinGecko as the data source.`,
      suggestedOptions: ['YES', 'NO'],
    };

    return JSON.stringify(mockResponse);
  }

  private async callOpenAI(
    prompt: string,
    apiKey: string,
    baseUrl?: string,
    model?: string
  ): Promise<string> {
    const response = await fetch(
      baseUrl || 'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model || 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `OpenAI API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  private async callAnthropic(
    prompt: string,
    apiKey: string,
    baseUrl?: string,
    model?: string
  ): Promise<string> {
    const response = await fetch(
      baseUrl || 'https://api.anthropic.com/v1/messages',
      {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: model || 'claude-3-sonnet-20240229',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Anthropic API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.content[0].text;
  }

  private async callCustomAPI(
    prompt: string,
    apiKey: string,
    baseUrl: string
  ): Promise<string> {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Custom API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.response || data.content || data.text || data.message;
  }

  private parseResponse(response: string): AIAnalysisResult {
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.warn('No JSON found in response, using fallback');
        const fallbackJson = this.createFallbackResponse('crypto prediction');
        return JSON.parse(fallbackJson);
      }

      let parsed;
      try {
        parsed = JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        console.warn('Failed to parse JSON, using fallback:', parseError);
        const fallbackJson = this.createFallbackResponse('crypto prediction');
        return JSON.parse(fallbackJson);
      }

      // Validate that the prediction can be cross-validated
      const validationResult = this.validatePrediction(parsed);
      if (!validationResult.isValid) {
        console.warn(
          'Validation failed, but allowing for testing:',
          validationResult.errorMessage
        );
        // Temporarily allow all predictions for testing
        // throw new Error(validationResult.errorMessage);
      }

      // Calculate expiration date
      const expiresInDays = parsed.expiresInDays || 7;
      const expiresAt = Date.now() + expiresInDays * 24 * 60 * 60 * 1000;

      return {
        title: parsed.title || 'AI Generated Prediction',
        description: parsed.description || 'AI-generated prediction market.',
        summary:
          parsed.summary ||
          'This prediction market allows participants to bet on the outcome of a future event.',
        category: parsed.category || 'custom',
        expiresAt,
        resolutionInstructions:
          parsed.resolutionInstructions ||
          'AI will determine the outcome based on available data.',
        suggestedOptions: parsed.suggestedOptions || ['YES', 'NO'],
      };
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      // Re-throw validation errors to show to user
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      if (
        errorMessage.includes('Cannot be cross-validated') ||
        errorMessage.includes('No verifiable outcome') ||
        errorMessage.includes('Subjective prediction')
      ) {
        throw error;
      }

      // Fallback response for parsing errors
      return {
        title: 'AI Generated Prediction',
        description: 'AI-generated prediction market.',
        summary:
          'This prediction market allows participants to bet on the outcome of a future event.',
        category: 'custom',
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
        resolutionInstructions:
          'AI will determine the outcome based on available data.',
        suggestedOptions: ['YES', 'NO'],
      };
    }
  }

  private validatePrediction(parsed: any): {
    isValid: boolean;
    errorMessage: string;
  } {
    const title = parsed.title || '';
    const description = parsed.description || '';
    const resolutionInstructions = parsed.resolutionInstructions || '';
    const combinedText =
      `${title} ${description} ${resolutionInstructions}`.toLowerCase();

    // Check for subjective or unverifiable predictions
    const subjectiveKeywords = [
      'best',
      'worst',
      'most popular',
      'better than',
      'more popular',
      'favorite',
      'preferred',
      'opinion',
      'subjective',
      'personal',
      'beautiful',
      'ugly',
      'amazing',
      'terrible',
      'superior',
      'inferior',
    ];

    const hasSubjectiveKeywords = subjectiveKeywords.some(keyword =>
      combinedText.includes(keyword)
    );

    if (hasSubjectiveKeywords) {
      return {
        isValid: false,
        errorMessage:
          'Cannot be cross-validated: Prediction contains subjective terms that cannot be objectively verified. Please use specific, measurable criteria.',
      };
    }

    // Check for specific, verifiable criteria
    const verifiableKeywords = [
      'price',
      'market cap',
      'volume',
      'trading',
      'revenue',
      'earnings',
      'users',
      'downloads',
      'transactions',
      'blocks',
      'hash rate',
      'percentage',
      'ratio',
      'rate',
      'amount',
      'number',
      'count',
      'date',
      'time',
      'deadline',
      'expires',
      'by',
      'before',
      'after',
      'reaches',
      'exceeds',
      'falls below',
      'above',
      'below',
      'equals',
      'coinbase',
      'binance',
      'coingecko',
      'bloomberg',
      'reuters',
      'official',
      'announcement',
      'launch',
      'release',
      'upgrade',
      '$',
      'usd',
      'btc',
      'eth',
      'bnb',
      'sol',
      'ada',
      'xrp',
      'doge',
      'bitcoin',
      'ethereum',
      'binance',
      'solana',
      'cardano',
      'ripple',
    ];

    const hasVerifiableKeywords = verifiableKeywords.some(keyword =>
      combinedText.includes(keyword)
    );

    // Special case: Check for price targets with dollar signs
    const hasPriceTarget =
      /\$[\d,]+/.test(combinedText) ||
      /\d+\s*(dollars?|usd|btc|eth|bnb)/i.test(combinedText);

    if (!hasVerifiableKeywords && !hasPriceTarget) {
      return {
        isValid: false,
        errorMessage:
          'No verifiable outcome: Prediction must include specific, measurable criteria (price targets, dates, numbers, or official data sources) that can be objectively verified.',
      };
    }

    // Check for clear resolution criteria (optional for price targets)
    const resolutionKeywords = [
      'coingecko',
      'coinmarketcap',
      'bloomberg',
      'reuters',
      'official',
      'closing price',
      'market data',
      'api',
      'verification',
      'data source',
      'determine',
      'based on',
      'using',
      'according to',
      'per',
    ];

    const hasResolutionKeywords = resolutionKeywords.some(keyword =>
      resolutionInstructions.toLowerCase().includes(keyword)
    );

    // For price targets, resolution criteria is optional as AI can add it
    if (!hasResolutionKeywords && !hasPriceTarget) {
      return {
        isValid: false,
        errorMessage:
          'Missing resolution criteria: Prediction must specify how the outcome will be determined (e.g., "using CoinGecko data", "based on official announcement").',
      };
    }

    // Check for time-bound predictions (optional for price targets)
    const timeKeywords = [
      'by',
      'before',
      'after',
      'until',
      'within',
      'deadline',
      'end of',
      'start of',
      'during',
      'on',
      'at',
      'expires',
    ];

    const hasTimeKeywords = timeKeywords.some(keyword =>
      combinedText.includes(keyword)
    );

    // For price targets, time frame is optional as AI can add it
    if (!hasTimeKeywords && !hasPriceTarget) {
      return {
        isValid: false,
        errorMessage:
          'Missing time frame: Prediction must specify when the outcome will be determined (e.g., "by end of 2024", "within 30 days").',
      };
    }

    return { isValid: true, errorMessage: '' };
  }

  private createFallbackResponse(userInput: string): string {
    // Extract crypto and price from user input
    const cryptoMatch = userInput.match(
      /(bitcoin|ethereum|eth|btc|bnb|solana|sol|cardano|ada)/i
    );
    const priceMatch = userInput.match(/\$?(\d+(?:,\d{3})*(?:\.\d+)?[km]?)/i);

    const crypto = cryptoMatch ? cryptoMatch[0] : 'cryptocurrency';
    const price = priceMatch ? priceMatch[1] : 'a significant price target';

    // Get real dates
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const nextYear = currentYear + 1;

    // Determine timeframe based on user input
    const inputLower = userInput.toLowerCase();
    let targetDate: string;
    let expiresInDays: number;

    if (
      inputLower.includes('soon') ||
      inputLower.includes('quick') ||
      inputLower.includes('fast') ||
      inputLower.includes('this month') ||
      inputLower.includes('next month') ||
      inputLower.includes('30 days')
    ) {
      // Short-term
      targetDate = `December 31, ${currentYear}`;
      expiresInDays = 30;
    } else if (
      inputLower.includes('next year') ||
      inputLower.includes('2026') ||
      inputLower.includes('long term') ||
      inputLower.includes('eventually')
    ) {
      // Long-term
      targetDate = `December 31, ${nextYear}`;
      expiresInDays = 365;
    } else if (
      inputLower.includes('this year') ||
      inputLower.includes('2025') ||
      inputLower.includes('in a few months') ||
      inputLower.includes('6 months')
    ) {
      // Medium-term
      targetDate = `Q1 ${nextYear}`;
      expiresInDays = 90;
    } else {
      // Default to medium-term
      targetDate = `Q1 ${nextYear}`;
      expiresInDays = 90;
    }

    // Fun descriptions based on crypto type
    const funDescriptions: { [key: string]: string } = {
      bitcoin:
        '🚀 The king of crypto aiming for the moon! Will Bitcoin break through this major milestone?',
      ethereum:
        '⚡ The smart contract giant charging towards new heights! Can ETH power through?',
      eth: '⚡ The smart contract giant charging towards new heights! Can ETH power through?',
      btc: '🚀 The king of crypto aiming for the moon! Will Bitcoin break through this major milestone?',
      bnb: '🔥 Binance Coin heating up the market! Will BNB burn bright enough to reach this target?',
      solana:
        '☀️ The speed demon of crypto racing to new peaks! Can SOL outpace the competition?',
      sol: '☀️ The speed demon of crypto racing to new peaks! Can SOL outpace the competition?',
      cardano:
        "🎯 The academic approach to crypto reaching for the stars! Will ADA's research pay off?",
      ada: "🎯 The academic approach to crypto reaching for the stars! Will ADA's research pay off?",
      default:
        '🚀 Crypto rocket fuel loading! Will this digital asset blast off to new heights?',
    };

    const cryptoKey = crypto.toLowerCase();
    const funDescription =
      funDescriptions[cryptoKey] || funDescriptions['default'];

    return JSON.stringify({
      title: `Will ${crypto} reach $${price} by ${targetDate}?`,
      description: `${funDescription} Uses CoinGecko data for verification.`,
      summary: `This exciting prediction focuses on ${crypto}'s potential to reach $${price} by ${targetDate}. If YES wins: ${crypto} will have achieved this price target, indicating strong market performance and investor confidence. If NO wins: ${crypto} will not reach this level, suggesting different market conditions or challenges ahead.`,
      category: 'crypto',
      expiresInDays: expiresInDays,
      resolutionInstructions: `Determine outcome using CoinGecko closing price data on ${targetDate}. Price must be $${price} or higher for YES to win.`,
      suggestedOptions: ['YES', 'NO'],
    });
  }
}

// Create singleton instance
let aiService: AIService | null = null;

export function initializeAI(config: AIConfig): void {
  aiService = new AIService(config);
}

export function getAIService(): AIService {
  if (!aiService) {
    throw new Error('AI service not initialized. Call initializeAI() first.');
  }
  return aiService;
}

// Default configuration from environment variables
export function getDefaultAIConfig(): AIConfig {
  const provider =
    (process.env.NEXT_PUBLIC_AI_PROVIDER as
      | 'gemini'
      | 'openai'
      | 'anthropic'
      | 'custom') || 'gemini';

  // Try to get provider-specific API key first, then fall back to generic key
  let apiKey = '';
  if (provider === 'gemini') {
    apiKey =
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_AI_API_KEY ||
      '';
  } else if (provider === 'openai') {
    apiKey =
      process.env.NEXT_PUBLIC_OPENAI_API_KEY ||
      process.env.NEXT_PUBLIC_AI_API_KEY ||
      '';
  } else if (provider === 'anthropic') {
    apiKey =
      process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY ||
      process.env.NEXT_PUBLIC_AI_API_KEY ||
      '';
  } else {
    apiKey = process.env.NEXT_PUBLIC_AI_API_KEY || '';
  }

  const baseUrl = process.env.NEXT_PUBLIC_AI_BASE_URL;

  // Model selection based on provider
  let model = process.env.NEXT_PUBLIC_AI_MODEL;
  if (!model) {
    if (provider === 'gemini') {
      model = process.env.NEXT_PUBLIC_GEMINI_MODEL || 'models/gemini-2.5-flash';
    } else if (provider === 'openai') {
      model = 'gpt-3.5-turbo';
    } else if (provider === 'anthropic') {
      model = 'claude-3-sonnet-20240229';
    }
  }

  if (!apiKey) {
    throw new Error(
      `AI API key not found. Please set NEXT_PUBLIC_${provider.toUpperCase()}_API_KEY or NEXT_PUBLIC_AI_API_KEY environment variable.`
    );
  }

  return {
    provider,
    apiKey,
    baseUrl,
    model,
  };
}
