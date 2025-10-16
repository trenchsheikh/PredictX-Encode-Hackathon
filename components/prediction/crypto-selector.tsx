'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { logger } from '@/lib/logger';

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
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    fetchCryptoPrices();

    // Refresh prices every 30 seconds for more frequent updates
    const interval = setInterval(fetchCryptoPrices, 30000);
    return () => clearInterval(interval);
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
        <Loader2 className="h-8 w-8 animate-spin text-yellow-400" />
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search cryptocurrencies..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="border-gray-700/50 bg-gray-800/60 pl-10 text-white placeholder:text-gray-400 focus:border-yellow-400/50 focus:ring-yellow-400/20"
        />
      </div>
      {lastUpdated && (
        <div className="text-xs text-gray-400">
          📊 Real-time prices updated: {lastUpdated.toLocaleTimeString()} |
          Source: CoinGecko API
        </div>
      )}

      {/* Crypto Grid */}
      <div className="custom-scrollbar grid max-h-[400px] grid-cols-1 gap-4 overflow-y-auto pr-2 md:grid-cols-2 lg:grid-cols-3">
        {filteredCryptos.map(crypto => (
          <Card
            key={crypto.id}
            className={cn(
              'cursor-pointer border-gray-700/50 bg-gray-800/60 backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-lg',
              value === crypto.id
                ? 'bg-yellow-400/10 ring-2 ring-yellow-400/50'
                : 'hover:bg-gray-800/80 hover:ring-1 hover:ring-yellow-400/30'
            )}
            onClick={() => onChange(crypto)}
          >
            <CardContent className="flex h-full flex-col p-4">
              <div className="mb-3 flex items-center justify-between">
                {/* Crypto Info */}
                <div className="flex flex-1 items-center space-x-2">
                  <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-yellow-400/20">
                    {crypto.image ? (
                      <img
                        src={crypto.image}
                        alt={crypto.name}
                        className="h-6 w-6 rounded-full object-cover"
                        onError={e => {
                          // Fallback to symbol if image fails to load
                          e.currentTarget.style.display = 'none';
                          const fallback = e.currentTarget
                            .nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="flex h-6 w-6 items-center justify-center text-xs font-bold text-yellow-400">
                      {crypto.symbol.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {crypto.name}
                    </div>
                    <div className="text-xs text-gray-400">{crypto.symbol}</div>
                  </div>
                </div>

                {/* Selected Indicator */}
                {value === crypto.id && (
                  <Badge
                    variant="default"
                    className="bg-yellow-400 text-xs text-black"
                  >
                    Selected
                  </Badge>
                )}
              </div>

              {/* Price Info */}
              <div className="flex-grow space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Price</span>
                  <span className="text-sm font-bold text-white">
                    $
                    {crypto.currentPrice.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Market Cap</span>
                  <span className="text-xs font-medium text-gray-300">
                    ${(crypto.marketCap / 1e9).toFixed(2)}B
                  </span>
                </div>

                {/* 24h Change */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">24h Change</span>
                  <div
                    className={cn(
                      'flex items-center gap-1 rounded px-2 py-1 text-xs font-medium',
                      crypto.priceChange24h >= 0
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-red-500/10 text-red-400'
                    )}
                  >
                    {crypto.priceChange24h >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {Math.abs(crypto.priceChange24h).toFixed(2)}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCryptos.length === 0 && (
        <div className="py-8 text-center text-gray-400">
          No cryptocurrencies found matching "{searchQuery}"
        </div>
      )}
    </div>
  );
}
