'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CryptoSelector, CryptoData } from './crypto-selector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, Calendar, DollarSign, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CryptoPredictionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CryptoPredictionData) => void;
}

export interface CryptoPredictionData {
  crypto: CryptoData;
  predictionType: 'price_target' | 'market_cap' | 'custom';
  targetPrice?: number;
  operator: 'above' | 'below';
  deadline: number;
  title: string;
  description: string;
  category: number;
}

export function CryptoPredictionModal({ open, onOpenChange, onSubmit }: CryptoPredictionModalProps) {
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoData | null>(null);
  const [predictionType, setPredictionType] = useState<'price_target' | 'market_cap' | 'custom'>('price_target');
  const [targetPrice, setTargetPrice] = useState<string>('');
  const [operator, setOperator] = useState<'above' | 'below'>('above');
  const [deadline, setDeadline] = useState<string>(new Date(Date.now() + 900000).toISOString().slice(0, 16));
  const [customTitle, setCustomTitle] = useState<string>('');
  const [customDescription, setCustomDescription] = useState<string>('');

  const handleReset = () => {
    setSelectedCrypto(null);
    setTargetPrice('');
    setOperator('above');
    setDeadline(new Date(Date.now() + 900000).toISOString().slice(0, 16));
    setCustomTitle('');
    setCustomDescription('');
  };

  const handleSubmitForm = () => {
    if (!selectedCrypto || !deadline) return;

    let title = '';
    let description = '';

    if (predictionType === 'price_target' && targetPrice) {
      const priceNum = parseFloat(targetPrice);
      title = `Will ${selectedCrypto.name} ${operator === 'above' ? 'reach' : 'stay below'} $${priceNum.toLocaleString()}?`;
      description = `This prediction market asks whether ${selectedCrypto.name} (${selectedCrypto.symbol}) will ${
        operator === 'above' ? 'reach or exceed' : 'stay below'
      } $${priceNum.toLocaleString()} by the deadline.\n\nCurrent price: $${selectedCrypto.currentPrice.toLocaleString()}\n24h change: ${selectedCrypto.priceChange24h.toFixed(2)}%\n\nVerification will be done automatically using CoinGecko price data at the resolution time.`;
    } else if (predictionType === 'custom') {
      title = customTitle;
      description = customDescription;
    }

    const data: CryptoPredictionData = {
      crypto: selectedCrypto,
      predictionType,
      targetPrice: targetPrice ? parseFloat(targetPrice) : undefined,
      operator,
      deadline: new Date(deadline).getTime(),
      title,
      description,
      category: 7, // Crypto category
    };

    onSubmit(data);
    handleReset();
    onOpenChange(false);
  };

  const isValid = () => {
    if (!selectedCrypto || !deadline) return false;

    if (predictionType === 'price_target') {
      return !!targetPrice && parseFloat(targetPrice) > 0;
    }

    if (predictionType === 'custom') {
      return !!customTitle && !!customDescription;
    }

    return false;
  };

  // Calculate minimum deadline (15 minutes from now)
  const minDeadline = new Date(Date.now() + 900000).toISOString().slice(0, 16);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900/95 backdrop-blur-md border border-gray-700/50 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white font-heading flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-yellow-400" />
            Create Crypto Prediction Market
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8">
          {/* Step 1: Select Cryptocurrency */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-yellow-400 text-black font-bold flex items-center justify-center text-sm">
                1
              </div>
              <Label className="text-lg font-semibold text-white">
                Select Cryptocurrency
              </Label>
            </div>
            <CryptoSelector
              value={selectedCrypto?.id || null}
              onChange={setSelectedCrypto}
            />
          </div>

          {/* Step 2: Prediction Details */}
          {selectedCrypto && (
            <div className="space-y-6 border-t border-gray-700/50 pt-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-400 text-black font-bold flex items-center justify-center text-sm">
                  2
                </div>
                <Label className="text-lg font-semibold text-white">
                  Prediction Details
                </Label>
              </div>

              <Tabs value={predictionType} onValueChange={(v) => setPredictionType(v as any)}>
                <TabsList className="grid w-full grid-cols-2 bg-gray-800/60 border border-gray-700/50">
                  <TabsTrigger value="price_target" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black text-gray-300">Price Target</TabsTrigger>
                  <TabsTrigger value="custom" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black text-gray-300">Custom Prediction</TabsTrigger>
                </TabsList>

                <TabsContent value="price_target" className="space-y-6 mt-6">
                  {/* Current Price Display */}
                  <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-400">Current {selectedCrypto.name} Price</div>
                        <div className="text-3xl font-bold text-white">${selectedCrypto.currentPrice.toLocaleString()}</div>
                      </div>
                      <div className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-lg',
                        selectedCrypto.priceChange24h >= 0 ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'
                      )}>
                        {selectedCrypto.priceChange24h >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        <span className="font-semibold">{Math.abs(selectedCrypto.priceChange24h).toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Operator Selection */}
                  <div className="space-y-3">
                    <Label htmlFor="operator" className="text-white font-medium">Prediction Type</Label>
                    <Select value={operator} onValueChange={(v) => setOperator(v as any)}>
                      <SelectTrigger id="operator" className="bg-gray-800/60 border-gray-700/50 text-white focus:border-yellow-400/50 focus:ring-yellow-400/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700/50">
                        <SelectItem value="above" className="text-white hover:bg-gray-700/50">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-green-400" />
                            <span>Will reach or exceed</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="below" className="text-white hover:bg-gray-700/50">
                          <div className="flex items-center gap-2">
                            <TrendingDown className="h-4 w-4 text-red-400" />
                            <span>Will stay below</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Target Price */}
                  <div className="space-y-3">
                    <Label htmlFor="targetPrice" className="text-white font-medium">Target Price (USD)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="targetPrice"
                        type="number"
                        placeholder="Enter target price..."
                        value={targetPrice}
                        onChange={(e) => setTargetPrice(e.target.value)}
                        className="pl-10 bg-gray-800/60 border-gray-700/50 text-white placeholder:text-gray-400 focus:border-yellow-400/50 focus:ring-yellow-400/20"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    {targetPrice && (
                      <div className="mt-3 p-3 bg-gray-800/40 rounded-lg border border-gray-700/30">
                        <div className="text-sm text-gray-300">
                          <span className="font-medium text-yellow-400">Prediction:</span> {selectedCrypto.name} will {operator === 'above' ? 'reach or exceed' : 'stay below'} <span className="font-semibold text-white">${parseFloat(targetPrice).toLocaleString()}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="custom" className="space-y-6 mt-6">
                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-200">
                      <strong className="text-blue-100">Custom predictions</strong> can include any question about {selectedCrypto.name}, such as market cap comparisons, trading volume, or other metrics. Make sure your prediction is clear and verifiable.
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="customTitle" className="text-white font-medium">Prediction Title</Label>
                    <Input
                      id="customTitle"
                      placeholder={`e.g., "Will ${selectedCrypto.name} flip Bitcoin in market cap?"`}
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                      className="bg-gray-800/60 border-gray-700/50 text-white placeholder:text-gray-400 focus:border-yellow-400/50 focus:ring-yellow-400/20"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="customDescription" className="text-white font-medium">Description & Resolution Criteria</Label>
                    <textarea
                      id="customDescription"
                      className="w-full min-h-[120px] p-3 bg-gray-800/60 border border-gray-700/50 text-white placeholder:text-gray-400 focus:border-yellow-400/50 focus:ring-yellow-400/20 rounded-lg resize-none"
                      placeholder="Describe the prediction and how it will be resolved..."
                      value={customDescription}
                      onChange={(e) => setCustomDescription(e.target.value)}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              {/* Deadline */}
              <div className="space-y-3">
                <Label htmlFor="deadline" className="text-white font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-yellow-400" />
                  Resolution Deadline
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="deadline"
                    type="datetime-local"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    min={minDeadline}
                    className="pl-10 bg-gray-800/60 border-gray-700/50 text-white focus:border-yellow-400/50 focus:ring-yellow-400/20"
                  />
                </div>
                <div className="text-xs text-gray-400">
                  Minimum: 15 minutes from now
                </div>
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-4 border-t border-gray-700/50 pt-6">
            <Button
              variant="outline"
              onClick={() => {
                handleReset();
                onOpenChange(false);
              }}
              className="flex-1 border-gray-700/50 bg-gray-800/60 text-white hover:bg-gray-800/80 transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitForm}
              disabled={!isValid()}
              className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold shadow-md hover:shadow-lg transition-all duration-200"
            >
              Create Prediction Market
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

