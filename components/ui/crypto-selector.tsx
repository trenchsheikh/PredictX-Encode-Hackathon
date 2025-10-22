'use client';

import React from 'react';
import { useState } from 'react';

import { Check, ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface CryptoOption {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  price?: number;
  change?: number;
}

interface CryptoSelectorProps {
  options: CryptoOption[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function CryptoSelector({
  options,
  value,
  onValueChange,
  placeholder = 'Select cryptocurrency',
  className,
}: CryptoSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(option => option.id === value);

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex w-full items-center justify-between rounded-xl bg-gray-900/60 p-4',
          'border border-gray-700/50 text-left backdrop-blur-sm',
          'transition-all duration-300 hover:border-yellow-500/30 hover:shadow-lg hover:shadow-yellow-500/10',
          'focus:outline-none focus:ring-2 focus:ring-yellow-500/20'
        )}
      >
        <div className="flex items-center">
          {selectedOption ? (
            <div>
              <div className="font-medium text-white">
                {selectedOption.name}
              </div>
              <div className="text-sm text-gray-400">
                {selectedOption.symbol}
              </div>
            </div>
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </div>

        <div className={cn('transition-transform', isOpen && 'rotate-180')}>
          <ChevronDown className="h-5 w-5 text-gray-400" />
        </div>
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2">
          <div className="overflow-hidden rounded-xl border border-gray-700/50 bg-gray-900/95 shadow-2xl backdrop-blur-sm">
            <div className="max-h-64 overflow-y-auto">
              {options.map((option, index) => (
                <button
                  key={option.id}
                  onClick={() => {
                    onValueChange(option.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center justify-between p-4 text-left transition-colors duration-200',
                    'hover:bg-yellow-500/10',
                    value === option.id ? 'bg-yellow-500/20' : ''
                  )}
                >
                  <div className="flex w-full items-center justify-between">
                    <div>
                      <div className="font-medium text-white">
                        {option.name}
                      </div>
                      <div className="text-sm text-gray-400">
                        {option.symbol}
                      </div>
                      {option.price && (
                        <div className="text-xs text-gray-500">
                          ${option.price.toLocaleString()}
                          {option.change && (
                            <span
                              className={cn(
                                'ml-1',
                                option.change >= 0
                                  ? 'text-green-400'
                                  : 'text-red-400'
                              )}
                            >
                              {option.change >= 0 ? '+' : ''}
                              {option.change.toFixed(2)}%
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {value === option.id && (
                    <div>
                      <Check className="h-5 w-5 text-yellow-400" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
