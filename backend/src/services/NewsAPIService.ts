/**
 * NewsAPI.ai Service
 * Handles fetching and monitoring news for event-based predictions
 */

import axios from 'axios';

interface NewsArticle {
  title: string;
  description: string;
  source: {
    id: string | null;
    name: string;
  };
  url: string;
  publishedAt: string;
  content: string;
}

interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

export class NewsAPIService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.NEWSAPI_KEY || '';
    this.baseUrl = 'https://newsapi.org/v2';

    if (!this.apiKey) {
      console.warn(
        '⚠️  NewsAPI key not configured. Event predictions will not be monitored.'
      );
    }
  }

  /**
   * Search for news articles matching keywords
   */
  async searchNews(
    query: string,
    options: {
      from?: Date;
      to?: Date;
      language?: string;
      sortBy?: 'relevancy' | 'popularity' | 'publishedAt';
      pageSize?: number;
    } = {}
  ): Promise<NewsArticle[]> {
    if (!this.apiKey) {
      console.warn('NewsAPI key not configured');
      return [];
    }

    try {
      const params: any = {
        q: query,
        apiKey: this.apiKey,
        language: options.language || 'en',
        sortBy: options.sortBy || 'publishedAt',
        pageSize: options.pageSize || 20,
      };

      if (options.from) {
        params.from = options.from.toISOString();
      }
      if (options.to) {
        params.to = options.to.toISOString();
      }

      console.log(`📰 Searching news: "${query}"`);

      const response = await axios.get<NewsAPIResponse>(
        `${this.baseUrl}/everything`,
        {
          params,
          timeout: 10000,
        }
      );

      if (response.data.status === 'ok') {
        console.log(
          `✅ Found ${response.data.articles.length} articles for query: "${query}"`
        );
        return response.data.articles;
      }

      console.warn(`⚠️  NewsAPI returned status: ${response.data.status}`);
      return [];
    } catch (error: any) {
      if (error.response?.status === 429) {
        console.error('❌ NewsAPI rate limit exceeded');
      } else if (error.response?.status === 401) {
        console.error('❌ NewsAPI authentication failed - check API key');
      } else {
        console.error('❌ NewsAPI error:', error.message);
      }
      return [];
    }
  }

  /**
   * Check if an event has occurred based on news articles
   * Returns the confidence level (0-1) and supporting articles
   */
  async verifyEvent(
    eventTitle: string,
    keywords: string[],
    sinceDate: Date
  ): Promise<{
    verified: boolean;
    confidence: number;
    articles: NewsArticle[];
    reasoning: string;
  }> {
    try {
      // Search for each keyword
      const allArticles: NewsArticle[] = [];

      for (const keyword of keywords) {
        const articles = await this.searchNews(keyword, {
          from: sinceDate,
          sortBy: 'relevancy',
          pageSize: 10,
        });
        allArticles.push(...articles);
      }

      // Remove duplicates based on URL
      const uniqueArticles = Array.from(
        new Map(allArticles.map(article => [article.url, article])).values()
      );

      if (uniqueArticles.length === 0) {
        return {
          verified: false,
          confidence: 0,
          articles: [],
          reasoning: 'No relevant news articles found',
        };
      }

      // Calculate confidence based on:
      // 1. Number of matching articles
      // 2. Relevance of titles
      // 3. Source credibility (basic heuristic)
      const relevanceScores = uniqueArticles.map(article => {
        const titleLower = article.title.toLowerCase();
        const descLower = (article.description || '').toLowerCase();
        const eventLower = eventTitle.toLowerCase();

        // Check if title or description contains event-related terms
        let score = 0;
        keywords.forEach(keyword => {
          const keywordLower = keyword.toLowerCase();
          if (titleLower.includes(keywordLower)) score += 0.4;
          if (descLower.includes(keywordLower)) score += 0.2;
        });

        // Bonus for reputable sources
        const reputableSources = [
          'reuters',
          'bbc',
          'cnn',
          'bloomberg',
          'financial times',
          'wall street journal',
          'the guardian',
          'associated press',
          'npr',
        ];
        if (
          reputableSources.some(source =>
            article.source.name.toLowerCase().includes(source)
          )
        ) {
          score += 0.2;
        }

        return Math.min(score, 1);
      });

      const avgConfidence =
        relevanceScores.reduce((sum, score) => sum + score, 0) /
        relevanceScores.length;

      // Require at least 3 relevant articles for verification
      const verified = uniqueArticles.length >= 3 && avgConfidence >= 0.5;

      const topArticles = uniqueArticles
        .map((article, idx) => ({ article, score: relevanceScores[idx] }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map(item => item.article);

      return {
        verified,
        confidence: avgConfidence,
        articles: topArticles,
        reasoning: verified
          ? `Event verified with ${uniqueArticles.length} relevant articles (confidence: ${(avgConfidence * 100).toFixed(1)}%)`
          : `Insufficient evidence: ${uniqueArticles.length} articles found, confidence: ${(avgConfidence * 100).toFixed(1)}%`,
      };
    } catch (error: any) {
      console.error('Error verifying event:', error.message);
      return {
        verified: false,
        confidence: 0,
        articles: [],
        reasoning: `Error checking news: ${error.message}`,
      };
    }
  }

  /**
   * Get trending headlines by category
   */
  async getTopHeadlines(
    category?:
      | 'business'
      | 'entertainment'
      | 'health'
      | 'science'
      | 'sports'
      | 'technology',
    country: string = 'us',
    pageSize: number = 20
  ): Promise<NewsArticle[]> {
    if (!this.apiKey) {
      console.warn('NewsAPI key not configured');
      return [];
    }

    try {
      const params: any = {
        apiKey: this.apiKey,
        country,
        pageSize,
      };

      if (category) {
        params.category = category;
      }

      const response = await axios.get<NewsAPIResponse>(
        `${this.baseUrl}/top-headlines`,
        {
          params,
          timeout: 10000,
        }
      );

      if (response.data.status === 'ok') {
        return response.data.articles;
      }

      return [];
    } catch (error: any) {
      console.error('Error fetching top headlines:', error.message);
      return [];
    }
  }
}

export const newsAPIService = new NewsAPIService();
