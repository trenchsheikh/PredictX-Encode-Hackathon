import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

// CoinGecko API configuration
const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';
const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY; // Optional for higher rate limits

export async function GET(request: NextRequest) {
  try {
    // Add cache busting parameter to ensure fresh data
    const cacheBuster = Date.now();
    const url = `${COINGECKO_API_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h&_t=${cacheBuster}`;

    // Fetch real-time crypto prices from CoinGecko
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
        ...(COINGECKO_API_KEY && { 'x-cg-demo-api-key': COINGECKO_API_KEY }),
      },
      // Ensure no caching
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(
        `CoinGecko API responded with status: ${response.status}`
      );
    }

    const data = await response.json();

    // Transform CoinGecko data to our format
    const prices = data.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      currentPrice: coin.current_price,
      marketCap: coin.market_cap,
      priceChange24h: coin.price_change_percentage_24h || 0,
      timestamp: Date.now(), // Current timestamp for freshness validation
      image: coin.image,
      totalVolume: coin.total_volume,
      high24h: coin.high_24h,
      low24h: coin.low_24h,
    }));

    logger.api(
      `Fetched ${prices.length} real-time crypto prices from CoinGecko`,
      { timestamp: new Date().toISOString() }
    );

    return NextResponse.json({
      success: true,
      data: {
        prices,
        lastUpdated: new Date().toISOString(),
        source: 'CoinGecko API',
        count: prices.length,
        timestamp: Date.now(),
        fresh: true,
      },
    });
  } catch (error: any) {
    logger.error('Error fetching crypto prices from CoinGecko:', error);

    // Fallback to static data if API fails
    const fallbackPrices = [
      {
        id: 'bitcoin',
        symbol: 'BTC',
        name: 'Bitcoin',
        currentPrice: 111461,
        marketCap: 2221407858529,
        priceChange24h: -0.41,
        timestamp: Date.now(),
        image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
        totalVolume: 15000000000,
        high24h: 115000,
        low24h: 110000,
      },
      {
        id: 'ethereum',
        symbol: 'ETH',
        name: 'Ethereum',
        currentPrice: 3200,
        marketCap: 384000000000,
        priceChange24h: 2.5,
        timestamp: Date.now(),
        image:
          'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
        totalVolume: 8000000000,
        high24h: 3250,
        low24h: 3150,
      },
      {
        id: 'binancecoin',
        symbol: 'BNB',
        name: 'BNB',
        currentPrice: 1178.46,
        marketCap: 164041749103,
        priceChange24h: -0.56,
        timestamp: Date.now(),
        image:
          'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
        totalVolume: 2000000000,
        high24h: 1200,
        low24h: 1150,
      },
      {
        id: 'solana',
        symbol: 'SOL',
        name: 'Solana',
        currentPrice: 95,
        marketCap: 41000000000,
        priceChange24h: -2.3,
        timestamp: Date.now(),
        image:
          'https://assets.coingecko.com/coins/images/4128/large/solana.png',
        totalVolume: 1500000000,
        high24h: 98,
        low24h: 92,
      },
      {
        id: 'cardano',
        symbol: 'ADA',
        name: 'Cardano',
        currentPrice: 0.45,
        marketCap: 16000000000,
        priceChange24h: 3.1,
        timestamp: Date.now(),
        image:
          'https://assets.coingecko.com/coins/images/975/large/cardano.png',
        totalVolume: 500000000,
        high24h: 0.47,
        low24h: 0.43,
      },
    ];

    logger.warn('Using fallback crypto prices due to API error');

    return NextResponse.json({
      success: true,
      data: {
        prices: fallbackPrices,
        lastUpdated: new Date().toISOString(),
        source: 'Fallback Data',
        count: fallbackPrices.length,
        warning: 'Using fallback data - real-time prices unavailable',
        timestamp: Date.now(),
        fresh: false,
      },
    });
  }
}
