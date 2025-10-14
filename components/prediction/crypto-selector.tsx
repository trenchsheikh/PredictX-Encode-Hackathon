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

export function CryptoSelector({ value, onChange, className }: CryptoSelectorProps) {
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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${apiUrl}/oracle/prices`);
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

  const filteredCryptos = cryptos.filter(crypto =>
    crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search cryptocurrencies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Crypto Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto custom-scrollbar">
        {filteredCryptos.map((crypto) => (
          <Card
            key={crypto.id}
            className={cn(
              'cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]',
              value === crypto.id
                ? 'ring-2 ring-purple-500 bg-purple-500/10'
                : 'hover:ring-1 hover:ring-purple-300'
            )}
            onClick={() => onChange(crypto)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                {/* Crypto Info */}
                <div className="flex items-center gap-3">
                  {/* Logo placeholder - in production use actual logos */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                    {crypto.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{crypto.name}</div>
                    <div className="text-xs text-gray-500">{crypto.symbol}</div>
                  </div>
                </div>

                {/* Selected Indicator */}
                {value === crypto.id && (
                  <Badge variant="default" className="bg-purple-500">
                    Selected
                  </Badge>
                )}
              </div>

              {/* Price Info */}
              <div className="mt-3 space-y-1">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-gray-500">Price:</span>
                  <span className="font-bold">
                    ${crypto.currentPrice.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-gray-500">Market Cap:</span>
                  <span className="text-xs font-medium">
                    ${(crypto.marketCap / 1e9).toFixed(2)}B
                  </span>
                </div>

                {/* 24h Change */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">24h Change:</span>
                  <div
                    className={cn(
                      'flex items-center gap-1 text-xs font-medium',
                      crypto.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'
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
        <div className="text-center text-gray-500 py-8">
          No cryptocurrencies found matching "{searchQuery}"
        </div>
      )}
    </div>
  );
}

