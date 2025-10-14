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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Create Crypto Prediction Market
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step 1: Select Cryptocurrency */}
          <div>
            <Label className="text-lg font-semibold mb-3 block">
              1. Select Cryptocurrency
            </Label>
            <CryptoSelector
              value={selectedCrypto?.id || null}
              onChange={setSelectedCrypto}
            />
          </div>

          {/* Step 2: Prediction Details */}
          {selectedCrypto && (
            <div className="space-y-4 border-t pt-6">
              <Label className="text-lg font-semibold block">
                2. Prediction Details
              </Label>

              <Tabs value={predictionType} onValueChange={(v) => setPredictionType(v as any)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="price_target">Price Target</TabsTrigger>
                  <TabsTrigger value="custom">Custom Prediction</TabsTrigger>
                </TabsList>

                <TabsContent value="price_target" className="space-y-4 mt-4">
                  {/* Current Price Display */}
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Current {selectedCrypto.name} Price</div>
                        <div className="text-2xl font-bold">${selectedCrypto.currentPrice.toLocaleString()}</div>
                      </div>
                      <div className={cn(
                        'flex items-center gap-1',
                        selectedCrypto.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'
                      )}>
                        {selectedCrypto.priceChange24h >= 0 ? <TrendingUp /> : <TrendingDown />}
                        <span className="font-semibold">{Math.abs(selectedCrypto.priceChange24h).toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Operator Selection */}
                  <div>
                    <Label htmlFor="operator">Prediction Type</Label>
                    <Select value={operator} onValueChange={(v) => setOperator(v as any)}>
                      <SelectTrigger id="operator">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="above">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-green-500" />
                            <span>Will reach or exceed</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="below">
                          <div className="flex items-center gap-2">
                            <TrendingDown className="h-4 w-4 text-red-500" />
                            <span>Will stay below</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Target Price */}
                  <div>
                    <Label htmlFor="targetPrice">Target Price (USD)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="targetPrice"
                        type="number"
                        placeholder="Enter target price..."
                        value={targetPrice}
                        onChange={(e) => setTargetPrice(e.target.value)}
                        className="pl-10"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    {targetPrice && (
                      <div className="mt-2 text-sm text-gray-600">
                        Prediction: {selectedCrypto.name} will {operator === 'above' ? 'reach or exceed' : 'stay below'} ${parseFloat(targetPrice).toLocaleString()}
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="custom" className="space-y-4 mt-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900 dark:text-blue-100">
                      <strong>Custom predictions</strong> can include any question about {selectedCrypto.name}, such as market cap comparisons, trading volume, or other metrics. Make sure your prediction is clear and verifiable.
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="customTitle">Prediction Title</Label>
                    <Input
                      id="customTitle"
                      placeholder={`e.g., "Will ${selectedCrypto.name} flip Bitcoin in market cap?"`}
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="customDescription">Description & Resolution Criteria</Label>
                    <textarea
                      id="customDescription"
                      className="w-full min-h-[120px] p-3 border rounded-md resize-none"
                      placeholder="Describe the prediction and how it will be resolved..."
                      value={customDescription}
                      onChange={(e) => setCustomDescription(e.target.value)}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              {/* Deadline */}
              <div>
                <Label htmlFor="deadline">Resolution Deadline</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="deadline"
                    type="datetime-local"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    min={minDeadline}
                    className="pl-10"
                  />
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  Minimum: 15 minutes from now
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3 border-t pt-4">
            <Button
              variant="outline"
              onClick={() => {
                handleReset();
                onOpenChange(false);
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitForm}
              disabled={!isValid()}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Create Prediction Market
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

