'use client';

import { useState, useEffect } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import TetrisLoading from '@/components/ui/tetris-loader';
import { logger } from '@/lib/logger';
import { cn } from '@/lib/utils';

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  marketCap: number;
  priceChange24h: number;
  timestamp: number;
  image?: string;
  totalVolume?: number;
  high24h?: number;
  low24h?: number;
}

interface CryptoSelectorProps {
  value: string | null;
  onChange: (crypto: CryptoData) => void;
  className?: string;
}

export function CryptoSelector({
  value,
  onChange,
  className,
}: CryptoSelectorProps) {
  const [cryptos, setCryptos] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [_lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    fetchCryptoPrices();

    // Refresh prices every 30 seconds for more frequent updates
    const interval = setInterval(fetchCryptoPrices, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchCryptoPrices() {
    try {
      // Add cache busting to ensure fresh data
      const response = await fetch(`/api/oracle/prices?t=${Date.now()}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.data.prices && data.data.prices.length > 0) {
        // Check if we have fresh real-time data from CoinGecko
        const isRealTimeData =
          data.data.source === 'CoinGecko API' && data.data.fresh === true;

        if (isRealTimeData) {
          // Use real-time data from CoinGecko
          setCryptos(data.data.prices);
          setLastUpdated(new Date());
          logger.api(
            `Fetched ${data.data.prices.length} real-time crypto prices from CoinGecko`
          );
        } else if (data.data.source === 'Fallback Data') {
          // Use fallback data but warn user
          setCryptos(data.data.prices);
          setLastUpdated(new Date());
          logger.warn(
            'Using fallback crypto prices - real-time data unavailable'
          );
        } else {
          // Check if prices are recent (within last 15 minutes for more tolerance)
          const now = Date.now();
          const validPrices = data.data.prices.filter((crypto: CryptoData) => {
            const priceAge = now - (crypto.timestamp || 0);
            return priceAge < 15 * 60 * 1000; // 15 minutes tolerance
          });

          if (validPrices.length > 0) {
            setCryptos(validPrices);
            setLastUpdated(new Date());
            logger.api(
              `Using ${validPrices.length} recent crypto prices (${Math.round((now - validPrices[0].timestamp) / 1000)}s old)`
            );
          } else {
            logger.warn('All prices are stale, using fallback data');
            setCryptos(getFallbackCryptoData());
            setLastUpdated(new Date());
          }
        }
      } else {
        // Fallback to hardcoded crypto data if API returns empty or fails
        logger.warn('API returned empty prices, using fallback data');
        setCryptos(getFallbackCryptoData());
      }
    } catch (error) {
      logger.error('Failed to fetch crypto prices:', error);
      // Use fallback data on error
      setCryptos(getFallbackCryptoData());
    } finally {
      setLoading(false);
    }
  }

  function getFallbackCryptoData(): CryptoData[] {
    return [
      {
        id: 'bitcoin',
        symbol: 'BTC',
        name: 'Bitcoin',
        currentPrice: 111461,
        marketCap: 2221407858529,
        priceChange24h: -0.41,
        timestamp: Date.now(),
      },
      {
        id: 'ethereum',
        symbol: 'ETH',
        name: 'Ethereum',
        currentPrice: 3200,
        marketCap: 384000000000,
        priceChange24h: 2.5,
        timestamp: Date.now(),
      },
      {
        id: 'binancecoin',
        symbol: 'BNB',
        name: 'BNB',
        currentPrice: 1178.46,
        marketCap: 164041749103,
        priceChange24h: -0.56,
        timestamp: Date.now(),
      },
      {
        id: 'solana',
        symbol: 'SOL',
        name: 'Solana',
        currentPrice: 95,
        marketCap: 41000000000,
        priceChange24h: -2.3,
        timestamp: Date.now(),
      },
      {
        id: 'cardano',
        symbol: 'ADA',
        name: 'Cardano',
        currentPrice: 0.45,
        marketCap: 16000000000,
        priceChange24h: 3.1,
        timestamp: Date.now(),
      },
      {
        id: 'ripple',
        symbol: 'XRP',
        name: 'XRP',
        currentPrice: 0.52,
        marketCap: 29000000000,
        priceChange24h: 1.2,
        timestamp: Date.now(),
      },
      {
        id: 'polkadot',
        symbol: 'DOT',
        name: 'Polkadot',
        currentPrice: 6.8,
        marketCap: 8500000000,
        priceChange24h: -1.5,
        timestamp: Date.now(),
      },
      {
        id: 'dogecoin',
        symbol: 'DOGE',
        name: 'Dogecoin',
        currentPrice: 0.08,
        marketCap: 11500000000,
        priceChange24h: 5.2,
        timestamp: Date.now(),
      },
      {
        id: 'avalanche-2',
        symbol: 'AVAX',
        name: 'Avalanche',
        currentPrice: 25.5,
        marketCap: 6000000000,
        priceChange24h: -0.8,
        timestamp: Date.now(),
      },
      {
        id: 'matic-network',
        symbol: 'MATIC',
        name: 'Polygon',
        currentPrice: 0.85,
        marketCap: 8000000000,
        priceChange24h: 1.7,
        timestamp: Date.now(),
      },
    ];
  }

  const filteredCryptos = cryptos.filter(
    crypto =>
      crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <TetrisLoading
          size="md"
          speed="normal"
          loadingText="Loading cryptocurrencies..."
        />
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search */}
      <div className="relative">
        <Input
          type="text"
          placeholder="Search cryptocurrencies..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="border-white/20 bg-card text-foreground placeholder:text-muted-foreground focus:border-white/20 focus:ring-0"
        />
      </div>

      {/* Crypto Grid */}
      <div className="custom-scrollbar grid max-h-[400px] grid-cols-1 gap-4 overflow-y-auto md:grid-cols-2 lg:grid-cols-3">
        {filteredCryptos.map(crypto => (
          <Card
            key={crypto.id}
            className={cn(
              'cursor-pointer bg-card',
              value === crypto.id ? 'bg-white/10' : ''
            )}
            onClick={() => onChange(crypto)}
          >
            <CardContent className="flex h-full flex-col p-4">
              <div className="mb-3 flex items-center justify-between">
                {/* Crypto Info */}
                <div className="flex flex-1 items-center space-x-2">
                  <div className="flex h-8 w-8 items-center justify-center">
                    {crypto.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={crypto.image}
                        alt={crypto.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {crypto.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {crypto.symbol}
                    </div>
                  </div>
                </div>

                {/* Selected Indicator */}
              </div>

              {/* Price Info */}
              <div className="flex-grow space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Price</span>
                  <span className="text-sm font-bold text-foreground">
                    $
                    {crypto.currentPrice.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Market Cap
                  </span>
                  <span className="text-xs font-medium text-foreground">
                    ${(crypto.marketCap / 1e9).toFixed(2)}B
                  </span>
                </div>

                {/* 24h Change */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    24h Change
                  </span>
                  <span className="text-xs font-medium text-foreground">
                    {crypto.priceChange24h.toFixed(2)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCryptos.length === 0 && (
        <div className="py-8 text-center text-muted-foreground">
          No cryptocurrencies found matching "{searchQuery}"
        </div>
      )}
    </div>
  );
}
