'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CryptoSelector, CryptoData } from './crypto-selector';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  AlertCircle,
  Bot,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDateTimeLocal } from '@/lib/blockchain-utils';
import {
  getAIService,
  getDefaultAIConfig,
  initializeAI,
} from '@/lib/ai-service';

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

export function CryptoPredictionModal({
  open,
  onOpenChange,
  onSubmit,
}: CryptoPredictionModalProps) {
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoData | null>(null);
  const [predictionType, setPredictionType] = useState<
    'price_target' | 'market_cap' | 'custom'
  >('price_target');
  const [targetPrice, setTargetPrice] = useState<string>('');
  const [operator, setOperator] = useState<'above' | 'below'>('above');
  const [deadline, setDeadline] = useState<string>(
    formatDateTimeLocal(Date.now() + 300000)
  );
  const [customTitle, setCustomTitle] = useState<string>('');
  const [customDescription, setCustomDescription] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiGenerated, setAiGenerated] = useState<{
    title: string;
    description: string;
  } | null>(null);
  const [aiError, setAiError] = useState<string>('');

  const handleReset = () => {
    setSelectedCrypto(null);
    setTargetPrice('');
    setOperator('above');
    setDeadline(formatDateTimeLocal(Date.now() + 300000));
    setCustomTitle('');
    setCustomDescription('');
    setAiGenerated(null);
    setAiError('');
  };

  const analyzeWithAI = async () => {
    if (!customTitle.trim() && !customDescription.trim()) return;

    setIsAnalyzing(true);
    setAiError('');
    setAiGenerated(null);

    try {
      // Initialize AI service if not already done
      try {
        getAIService();
      } catch {
        // Initialize with default config from environment variables
        const config = getDefaultAIConfig();
        initializeAI(config);
      }

      const aiService = getAIService();
      // Combine title and description as user suggestion
      const userSuggestion = `${customTitle}${customDescription ? ` - ${customDescription}` : ''}`;
      const analysis = await aiService.analyzePrediction(
        userSuggestion,
        'crypto'
      );

      setAiGenerated({
        title: analysis.title,
        description: analysis.description,
      });

      // Auto-fill the form with AI-generated content
      setCustomTitle(analysis.title);
      setCustomDescription(analysis.description);
    } catch (error) {
      console.error('AI analysis failed:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'AI analysis failed';
      setAiError(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
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

  // Calculate minimum deadline (5 minutes from now)
  const minDeadline = formatDateTimeLocal(Date.now() + 300000);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto border border-white/10 bg-gradient-to-br from-gray-900/95 via-gray-800/90 to-gray-900/95 pr-2 shadow-2xl backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="font-heading flex items-center gap-2 text-2xl font-bold text-white">
            <TrendingUp className="h-6 w-6 text-yellow-400" />
            Create Crypto Prediction Market
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8">
          {/* Step 1: Select Cryptocurrency */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400 text-sm font-bold text-black">
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
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400 text-sm font-bold text-black">
                  2
                </div>
                <Label className="text-lg font-semibold text-white">
                  Prediction Details
                </Label>
              </div>

              {/* Prediction Type Selection */}
              <div className="space-y-3">
                <Label
                  htmlFor="predictionType"
                  className="font-medium text-white"
                >
                  Prediction Type
                </Label>
                <Select
                  value={predictionType}
                  onValueChange={v => {
                    console.log('Prediction type changed to:', v);
                    setPredictionType(v as any);
                  }}
                >
                  <SelectTrigger
                    id="predictionType"
                    className="border-gray-700/50 bg-gray-800/60 text-white focus:border-yellow-400/50 focus:ring-yellow-400/20"
                  >
                    <SelectValue placeholder="Select prediction type..." />
                  </SelectTrigger>
                  <SelectContent className="z-[9999] border-gray-700/50 bg-gray-800">
                    <SelectItem
                      value="price_target"
                      className="cursor-pointer text-white hover:bg-gray-700/50"
                    >
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-yellow-400" />
                        <span>Price Target</span>
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="custom"
                      className="cursor-pointer text-white hover:bg-gray-700/50"
                    >
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4 text-blue-400" />
                        <span>Custom Prediction</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Conditional Content Based on Prediction Type */}
              {predictionType === 'price_target' && (
                <div className="mt-6 space-y-6">
                  {/* Current Price Display */}
                  <div className="rounded-xl border border-white/10 bg-gradient-to-r from-gray-800/60 to-gray-700/40 p-6 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-400">
                          Current {selectedCrypto.name} Price
                        </div>
                        <div className="text-3xl font-bold text-white">
                          ${selectedCrypto.currentPrice.toLocaleString()}
                        </div>
                      </div>
                      <div
                        className={cn(
                          'flex items-center gap-2 rounded-lg px-3 py-2',
                          selectedCrypto.priceChange24h >= 0
                            ? 'bg-green-500/10 text-green-400'
                            : 'bg-red-500/10 text-red-400'
                        )}
                      >
                        {selectedCrypto.priceChange24h >= 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        <span className="font-semibold">
                          {Math.abs(selectedCrypto.priceChange24h).toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Operator Selection */}
                  <div className="space-y-3">
                    <Label
                      htmlFor="operator"
                      className="font-medium text-white"
                    >
                      Direction
                    </Label>
                    <Select
                      value={operator}
                      onValueChange={v => {
                        console.log('Operator changed to:', v);
                        setOperator(v as any);
                      }}
                    >
                      <SelectTrigger
                        id="operator"
                        className="border-gray-700/50 bg-gray-800/60 text-white focus:border-yellow-400/50 focus:ring-yellow-400/20"
                      >
                        <SelectValue placeholder="Select direction..." />
                      </SelectTrigger>
                      <SelectContent className="z-[9999] border-gray-700/50 bg-gray-800">
                        <SelectItem
                          value="above"
                          className="cursor-pointer text-white hover:bg-gray-700/50"
                        >
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-green-400" />
                            <span>Will reach or exceed</span>
                          </div>
                        </SelectItem>
                        <SelectItem
                          value="below"
                          className="cursor-pointer text-white hover:bg-gray-700/50"
                        >
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
                    <Label
                      htmlFor="targetPrice"
                      className="font-medium text-white"
                    >
                      Target Price (USD)
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="targetPrice"
                        type="number"
                        placeholder="Enter target price..."
                        value={targetPrice}
                        onChange={e => setTargetPrice(e.target.value)}
                        className="border-white/10 bg-white/5 pl-10 text-white backdrop-blur-sm transition-all duration-300 placeholder:text-gray-400 focus:border-yellow-400/50 focus:ring-yellow-400/20"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    {targetPrice && (
                      <div className="mt-3 rounded-lg border border-gray-700/30 bg-gray-800/40 p-3">
                        <div className="text-sm text-gray-300">
                          <span className="font-medium text-yellow-400">
                            Prediction:
                          </span>{' '}
                          {selectedCrypto.name} will{' '}
                          {operator === 'above'
                            ? 'reach or exceed'
                            : 'stay below'}{' '}
                          <span className="font-semibold text-white">
                            ${parseFloat(targetPrice).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {predictionType === 'custom' && (
                <div className="mt-6 space-y-6">
                  <div className="flex items-start gap-3 rounded-xl border border-blue-500/20 bg-blue-500/10 p-4">
                    <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-400" />
                    <div className="text-sm text-blue-200">
                      <strong className="text-blue-100">
                        Custom predictions
                      </strong>{' '}
                      can include any question about {selectedCrypto.name}, such
                      as market cap comparisons, trading volume, or other
                      metrics. Make sure your prediction is clear and
                      verifiable.
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="customTitle"
                        className="font-medium text-white"
                      >
                        Prediction Title
                      </Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={analyzeWithAI}
                        disabled={
                          isAnalyzing ||
                          (!customTitle.trim() && !customDescription.trim())
                        }
                        className="flex items-center gap-2 border-blue-500/50 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                      >
                        {isAnalyzing ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                        {isAnalyzing ? 'Analyzing...' : 'AI Generate'}
                      </Button>
                    </div>
                    <Input
                      id="customTitle"
                      placeholder={`e.g., "${selectedCrypto.name} will reach $150,000" or "${selectedCrypto.name} will be popular"`}
                      value={customTitle}
                      onChange={e => setCustomTitle(e.target.value)}
                      className="border-white/10 bg-white/5 text-white backdrop-blur-sm transition-all duration-300 placeholder:text-gray-400 focus:border-yellow-400/50 focus:ring-yellow-400/20"
                    />
                    <p className="text-xs text-gray-400">
                      💡 Enter your prediction idea here. AI will transform it
                      into a verifiable prediction with specific criteria.
                    </p>
                    {aiGenerated && (
                      <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-3">
                        <div className="flex items-center gap-2 text-sm text-green-400">
                          <Bot className="h-4 w-4" />
                          <span className="font-medium">
                            AI Generated Content
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-green-200">
                          Title and description have been optimized for oracle
                          compatibility
                        </p>
                      </div>
                    )}

                    {aiError && (
                      <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3">
                        <div className="flex items-center gap-2 text-sm text-red-400">
                          <AlertCircle className="h-4 w-4" />
                          <span className="font-medium">Validation Error</span>
                        </div>
                        <p className="mt-1 text-xs text-red-200">{aiError}</p>
                        <div className="mt-2 text-xs text-red-300">
                          <strong>Tips for valid predictions:</strong>
                          <ul className="ml-4 mt-1 list-disc space-y-1">
                            <li>
                              Use specific price targets (e.g., "$150,000")
                            </li>
                            <li>
                              Include time frames (e.g., "by end of 2024")
                            </li>
                            <li>
                              Specify data sources (e.g., "using CoinGecko")
                            </li>
                            <li>
                              Avoid subjective terms like "best" or "popular"
                            </li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="customDescription"
                      className="font-medium text-white"
                    >
                      Description & Resolution Criteria
                    </Label>
                    <textarea
                      id="customDescription"
                      className="min-h-[120px] w-full resize-none rounded-lg border border-gray-700/50 bg-gray-800/60 p-3 text-white placeholder:text-gray-400 focus:border-yellow-400/50 focus:ring-yellow-400/20"
                      placeholder="Describe the prediction and how it will be resolved..."
                      value={customDescription}
                      onChange={e => setCustomDescription(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Deadline */}
              <div className="space-y-3">
                <Label
                  htmlFor="deadline"
                  className="flex items-center gap-2 font-medium text-white"
                >
                  <Calendar className="h-4 w-4 text-yellow-400" />
                  Resolution Deadline
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="deadline"
                    type="datetime-local"
                    value={deadline}
                    onChange={e => setDeadline(e.target.value)}
                    min={minDeadline}
                    className="border-gray-700/50 bg-gray-800/60 pl-10 text-white focus:border-yellow-400/50 focus:ring-yellow-400/20"
                  />
                </div>
                <div className="text-xs text-gray-400">
                  Minimum: 5 minutes from now
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
              className="flex-1 border-gray-700/50 bg-gray-800/60 text-white transition-all duration-200 hover:bg-gray-800/80"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitForm}
              disabled={!isValid()}
              className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 font-semibold text-black shadow-md transition-all duration-200 hover:from-yellow-500 hover:to-yellow-700 hover:shadow-lg"
            >
              Create Prediction Market
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
