import axios from 'axios';

/**
 * Oracle Service - Temporary CoinGecko Integration
 * Fetches cryptocurrency prices to verify prediction outcomes
 */

export interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  marketCap: number;
  priceChange24h: number;
  timestamp: number;
}

export interface PredictionCondition {
  crypto: string; // 'bitcoin', 'ethereum', etc.
  targetPrice: number;
  operator: 'above' | 'below' | 'equals';
  deadline: number; // Unix timestamp
}

export interface VerificationResult {
  success: boolean;
  outcome: boolean; // true = prediction correct, false = incorrect
  currentPrice: number;
  targetPrice: number;
  timestamp: number;
  reasoning: string;
  data?: any;
}

class OracleService {
  private readonly COINGECKO_API = 'https://api.coingecko.com/api/v3';
  private readonly CACHE_DURATION = 60000; // 1 minute cache
  private priceCache: Map<string, { data: CryptoPrice; timestamp: number }> =
    new Map();

  /**
   * Supported cryptocurrencies
   */
  readonly SUPPORTED_CRYPTOS = {
    bitcoin: { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
    ethereum: { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
    binancecoin: { id: 'binancecoin', symbol: 'BNB', name: 'BNB' },
    solana: { id: 'solana', symbol: 'SOL', name: 'Solana' },
    cardano: { id: 'cardano', symbol: 'ADA', name: 'Cardano' },
    ripple: { id: 'ripple', symbol: 'XRP', name: 'XRP' },
    polkadot: { id: 'polkadot', symbol: 'DOT', name: 'Polkadot' },
    dogecoin: { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin' },
    avalanche: { id: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche' },
    polygon: { id: 'matic-network', symbol: 'MATIC', name: 'Polygon' },
  };

  /**
   * Fetch current price for a cryptocurrency
   */
  async getPrice(cryptoId: string): Promise<CryptoPrice> {
    // Check cache first
    const cached = this.priceCache.get(cryptoId);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      const response = await axios.get(`${this.COINGECKO_API}/simple/price`, {
        params: {
          ids: cryptoId,
          vs_currencies: 'usd',
          include_market_cap: true,
          include_24hr_change: true,
        },
      });

      const data = response.data[cryptoId];
      if (!data) {
        throw new Error(`Price data not found for ${cryptoId}`);
      }

      const cryptoInfo = Object.values(this.SUPPORTED_CRYPTOS).find(
        c => c.id === cryptoId
      );

      const priceData: CryptoPrice = {
        id: cryptoId,
        symbol: cryptoInfo?.symbol || cryptoId.toUpperCase(),
        name: cryptoInfo?.name || cryptoId,
        currentPrice: data.usd,
        marketCap: data.usd_market_cap || 0,
        priceChange24h: data.usd_24h_change || 0,
        timestamp: Date.now(),
      };

      // Update cache
      this.priceCache.set(cryptoId, { data: priceData, timestamp: Date.now() });

      return priceData;
    } catch (error: any) {
      console.error(`Failed to fetch price for ${cryptoId}:`, error.message);
      throw new Error(`Oracle error: Unable to fetch ${cryptoId} price`);
    }
  }

  /**
   * Fetch multiple cryptocurrency prices
   */
  async getPrices(cryptoIds: string[]): Promise<CryptoPrice[]> {
    const prices: CryptoPrice[] = [];

    for (const id of cryptoIds) {
      try {
        const price = await this.getPrice(id);
        prices.push(price);
      } catch (error) {
        console.error(`Failed to get price for ${id}:`, error);
      }
    }

    return prices;
  }

  /**
   * Get all supported cryptocurrency prices
   */
  async getAllPrices(): Promise<CryptoPrice[]> {
    const ids = Object.values(this.SUPPORTED_CRYPTOS).map(c => c.id);
    return this.getPrices(ids);
  }

  /**
   * Verify a prediction outcome
   * @param condition The prediction condition to verify
   * @returns Verification result with outcome (true/false)
   */
  async verifyPrediction(
    condition: PredictionCondition
  ): Promise<VerificationResult> {
    try {
      const priceData = await this.getPrice(condition.crypto);

      let outcome = false;
      let reasoning = '';

      switch (condition.operator) {
        case 'above':
          outcome = priceData.currentPrice > condition.targetPrice;
          reasoning = `${priceData.name} price of $${priceData.currentPrice.toLocaleString()} is ${
            outcome ? 'above' : 'not above'
          } target of $${condition.targetPrice.toLocaleString()}`;
          break;

        case 'below':
          outcome = priceData.currentPrice < condition.targetPrice;
          reasoning = `${priceData.name} price of $${priceData.currentPrice.toLocaleString()} is ${
            outcome ? 'below' : 'not below'
          } target of $${condition.targetPrice.toLocaleString()}`;
          break;

        case 'equals':
          // Allow 1% tolerance for "equals"
          const tolerance = condition.targetPrice * 0.01;
          outcome =
            Math.abs(priceData.currentPrice - condition.targetPrice) <=
            tolerance;
          reasoning = `${priceData.name} price of $${priceData.currentPrice.toLocaleString()} is ${
            outcome ? 'approximately equal to' : 'not equal to'
          } target of $${condition.targetPrice.toLocaleString()}`;
          break;
      }

      return {
        success: true,
        outcome,
        currentPrice: priceData.currentPrice,
        targetPrice: condition.targetPrice,
        timestamp: Date.now(),
        reasoning,
        data: priceData,
      };
    } catch (error: any) {
      return {
        success: false,
        outcome: false,
        currentPrice: 0,
        targetPrice: condition.targetPrice,
        timestamp: Date.now(),
        reasoning: `Oracle verification failed: ${error.message}`,
      };
    }
  }

  /**
   * Parse a prediction title to extract condition
   * Examples:
   * - "Will Bitcoin reach $100,000 by end of 2025?"
   * - "Will Ethereum stay below $5,000?"
   * - "Will BNB exceed $1000?"
   */
  parsePredictionTitle(
    title: string,
    deadline: number
  ): PredictionCondition | null {
    const lowerTitle = title.toLowerCase();

    // Find crypto
    let crypto: string | null = null;
    for (const [id, info] of Object.entries(this.SUPPORTED_CRYPTOS)) {
      if (
        lowerTitle.includes(info.name.toLowerCase()) ||
        lowerTitle.includes(info.symbol.toLowerCase())
      ) {
        crypto = id;
        break;
      }
    }

    if (!crypto) return null;

    // Extract price target (match numbers with optional commas/decimals)
    const priceMatch = title.match(/\$[\d,]+(?:\.\d+)?/);
    if (!priceMatch) return null;

    const targetPrice = parseFloat(priceMatch[0].replace(/[$,]/g, ''));

    // Determine operator
    let operator: 'above' | 'below' | 'equals' = 'above';
    if (
      lowerTitle.includes('below') ||
      lowerTitle.includes('under') ||
      lowerTitle.includes('less than')
    ) {
      operator = 'below';
    } else if (
      lowerTitle.includes('reach') ||
      lowerTitle.includes('exceed') ||
      lowerTitle.includes('above') ||
      lowerTitle.includes('over')
    ) {
      operator = 'above';
    } else if (lowerTitle.includes('equal') || lowerTitle.includes('exactly')) {
      operator = 'equals';
    }

    return {
      crypto,
      targetPrice,
      operator,
      deadline,
    };
  }

  /**
   * Verify a market using its title and deadline
   */
  async verifyMarket(
    title: string,
    deadline: number
  ): Promise<VerificationResult> {
    const condition = this.parsePredictionTitle(title, deadline);

    if (!condition) {
      return {
        success: false,
        outcome: false,
        currentPrice: 0,
        targetPrice: 0,
        timestamp: Date.now(),
        reasoning: 'Unable to parse prediction condition from title',
      };
    }

    return this.verifyPrediction(condition);
  }

  /**
   * Admin override for manual testing
   */
  async manualResolve(
    marketId: number,
    outcome: boolean,
    reasoning: string
  ): Promise<VerificationResult> {
    console.log(
      `🔧 Manual override for market ${marketId}: ${outcome ? 'YES' : 'NO'}`
    );

    return {
      success: true,
      outcome,
      currentPrice: 0,
      targetPrice: 0,
      timestamp: Date.now(),
      reasoning: `Manual resolution: ${reasoning}`,
    };
  }

  /**
   * Get market cap comparison (for "Will ETH flip BTC?" type predictions)
   */
  async compareMarketCaps(
    crypto1: string,
    crypto2: string
  ): Promise<{
    crypto1Higher: boolean;
    crypto1Cap: number;
    crypto2Cap: number;
    reasoning: string;
  }> {
    const [price1, price2] = await Promise.all([
      this.getPrice(crypto1),
      this.getPrice(crypto2),
    ]);

    return {
      crypto1Higher: price1.marketCap > price2.marketCap,
      crypto1Cap: price1.marketCap,
      crypto2Cap: price2.marketCap,
      reasoning: `${price1.name} market cap ($${(price1.marketCap / 1e9).toFixed(2)}B) is ${
        price1.marketCap > price2.marketCap ? 'higher than' : 'lower than'
      } ${price2.name} ($${(price2.marketCap / 1e9).toFixed(2)}B)`,
    };
  }

  /**
   * Clear price cache (for testing)
   */
  clearCache(): void {
    this.priceCache.clear();
  }
}

export const oracleService = new OracleService();
