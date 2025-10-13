// AI Service for generating prediction market content
// Supports multiple AI providers

export interface AIAnalysisResult {
  title: string;
  category: string;
  expiresAt: number;
  resolutionInstructions: string;
  suggestedOptions?: string[];
}

export interface AIConfig {
  provider: 'openai' | 'anthropic' | 'custom';
  apiKey: string;
  baseUrl?: string;
  model?: string;
}

class AIService {
  private config: AIConfig;

  constructor(config: AIConfig) {
    this.config = config;
  }

  async analyzePrediction(description: string, category: string): Promise<AIAnalysisResult> {
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
    return `You are an expert prediction market analyst. Analyze the following prediction description and generate:

1. A clear, concise title (max 60 characters)
2. The most appropriate category from: sports, crypto, politics, entertainment, weather, finance, technology, custom
3. A reasonable expiration date (in days from now, max 365)
4. Detailed resolution instructions for how to determine the outcome
5. Optional: 2-4 suggested betting options (default: YES/NO)

Prediction Description: "${description}"
Current Category: "${category}"

Please respond in JSON format:
{
  "title": "Will [specific event] happen?",
  "category": "sports",
  "expiresInDays": 7,
  "resolutionInstructions": "Determine the outcome based on [specific criteria]...",
  "suggestedOptions": ["YES", "NO"]
}

Make the title specific, measurable, and time-bound. The resolution instructions should be clear about what data sources to use and how to verify the outcome.`;
  }

  private async callAI(prompt: string): Promise<string> {
    const { provider, apiKey, baseUrl, model } = this.config;

    switch (provider) {
      case 'openai':
        return this.callOpenAI(prompt, apiKey, baseUrl, model);
      case 'anthropic':
        return this.callAnthropic(prompt, apiKey, baseUrl, model);
      case 'custom':
        return this.callCustomAPI(prompt, apiKey, baseUrl);
      default:
        throw new Error(`Unsupported AI provider: ${provider}`);
    }
  }

  private async callOpenAI(prompt: string, apiKey: string, baseUrl?: string, model?: string): Promise<string> {
    const response = await fetch(baseUrl || 'https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  private async callAnthropic(prompt: string, apiKey: string, baseUrl?: string, model?: string): Promise<string> {
    const response = await fetch(baseUrl || 'https://api.anthropic.com/v1/messages', {
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
            content: prompt
          }
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }

  private async callCustomAPI(prompt: string, apiKey: string, baseUrl: string): Promise<string> {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Custom API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.response || data.content || data.text || data.message;
  }

  private parseResponse(response: string): AIAnalysisResult {
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      // Calculate expiration date
      const expiresInDays = parsed.expiresInDays || 7;
      const expiresAt = Date.now() + (expiresInDays * 24 * 60 * 60 * 1000);

      return {
        title: parsed.title || 'AI Generated Prediction',
        category: parsed.category || 'custom',
        expiresAt,
        resolutionInstructions: parsed.resolutionInstructions || 'AI will determine the outcome based on available data.',
        suggestedOptions: parsed.suggestedOptions || ['YES', 'NO'],
      };
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      // Fallback response
      return {
        title: 'AI Generated Prediction',
        category: 'custom',
        expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000),
        resolutionInstructions: 'AI will determine the outcome based on available data.',
        suggestedOptions: ['YES', 'NO'],
      };
    }
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
  const provider = (process.env.NEXT_PUBLIC_AI_PROVIDER as 'openai' | 'anthropic' | 'custom') || 'openai';
  const apiKey = process.env.NEXT_PUBLIC_AI_API_KEY || '';
  const baseUrl = process.env.NEXT_PUBLIC_AI_BASE_URL;
  const model = process.env.NEXT_PUBLIC_AI_MODEL;

  if (!apiKey) {
    throw new Error('AI API key not found. Please set NEXT_PUBLIC_AI_API_KEY environment variable.');
  }

  return {
    provider,
    apiKey,
    baseUrl,
    model,
  };
}
