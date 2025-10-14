'use client';

import { motion, AnimatePresence } from 'framer-motion';
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
  placeholder = "Select cryptocurrency",
  className 
}: CryptoSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedOption = options.find(option => option.id === value);

  return (
    <div className={cn("relative", className)}>
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-900/60 to-gray-800/40",
          "border border-gray-700/50 backdrop-blur-sm text-left",
          "hover:border-yellow-500/30 hover:shadow-lg hover:shadow-yellow-500/10 transition-all duration-300",
          "focus:outline-none focus:ring-2 focus:ring-yellow-500/20"
        )}
      >
        <div className="flex items-center">
          {selectedOption ? (
            <div>
              <div className="text-white font-medium">{selectedOption.name}</div>
              <div className="text-sm text-gray-400">{selectedOption.symbol}</div>
            </div>
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </div>
        
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 z-50"
          >
            <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-2xl overflow-hidden">
              <div className="max-h-64 overflow-y-auto">
                {options.map((option, index) => (
                  <motion.button
                    key={option.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ backgroundColor: 'rgba(255, 193, 7, 0.1)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onValueChange(option.id);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between p-4 text-left transition-colors duration-200",
                      "hover:bg-yellow-500/10",
                      value === option.id ? "bg-yellow-500/20" : ""
                    )}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <div className="text-white font-medium">{option.name}</div>
                        <div className="text-sm text-gray-400">{option.symbol}</div>
                        {option.price && (
                          <div className="text-xs text-gray-500">
                            ${option.price.toLocaleString()}
                            {option.change && (
                              <span className={cn(
                                "ml-1",
                                option.change >= 0 ? "text-green-400" : "text-red-400"
                              )}>
                                {option.change >= 0 ? '+' : ''}{option.change.toFixed(2)}%
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {value === option.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        <Check className="w-5 h-5 text-yellow-400" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
