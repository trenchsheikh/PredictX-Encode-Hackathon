'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  marketCap: number;
  priceChange24h: number;
  timestamp: number;
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

  useEffect(() => {
    fetchCryptoPrices();

    // Refresh prices every 60 seconds
    const interval = setInterval(fetchCryptoPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  async function fetchCryptoPrices() {
    try {
      const response = await fetch('/api/oracle/prices');
      const data = await response.json();

      if (data.success) {
        setCryptos(data.data.prices);
      }
    } catch (error) {
      console.error('Failed to fetch crypto prices:', error);
    } finally {
      setLoading(false);
    }
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
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white">
                    {crypto.name}
                  </div>
                  <div className="text-xs text-gray-400">{crypto.symbol}</div>
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
