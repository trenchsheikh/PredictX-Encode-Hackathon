'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreatePredictionData, PredictionCategory } from '@/types/prediction';
import { formatBNB } from '@/lib/utils';
import { Bot, Plus, X, Calendar, DollarSign, Target, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/components/providers/privy-provider';
import { getAIService, getDefaultAIConfig, initializeAI } from '@/lib/ai-service';
import { CryptoSelector, CryptoOption } from '@/components/ui/crypto-selector';
import { AnimatedButton } from '@/components/ui/animated-button';

const createPredictionSchema = z.object({
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.enum(['sports', 'crypto', 'politics', 'entertainment', 'weather', 'finance', 'technology', 'custom']),
  betType: z.enum(['custom', 'auto-verified']),
  resolutionInstructions: z.string().optional(),
  userPrediction: z.enum(['yes', 'no']),
  bnbAmount: z.number().min(0.001, 'Minimum bet is 0.001 BNB').max(10, 'Maximum bet is 10 BNB'),
  expiresAt: z.number().min(Date.now() + 900000, 'Expiration must be at least 15 minutes from now'),
});

interface CreateBetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreatePredictionData) => void;
}

const categories: { value: PredictionCategory; label: string; icon: string }[] = [
  { value: 'sports', label: 'Sports', icon: '⚽' },
  { value: 'crypto', label: 'Crypto', icon: '₿' },
  { value: 'politics', label: 'Politics', icon: '🏛️' },
  { value: 'entertainment', label: 'Entertainment', icon: '🎬' },
  { value: 'weather', label: 'Weather', icon: '🌤️' },
  { value: 'finance', label: 'Finance', icon: '💰' },
  { value: 'technology', label: 'Technology', icon: '💻' },
  { value: 'custom', label: 'Custom', icon: '🎯' },
];

// Crypto options will be fetched from API

export function CreateBetModal({ open, onOpenChange, onSubmit }: CreateBetModalProps) {
  const { t } = useI18n();
  const [aiGenerated, setAiGenerated] = useState<{
    title: string;
    description: string;
    summary: string;
    category: PredictionCategory;
    expiresAt: number;
    resolutionInstructions: string;
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [options, setOptions] = useState<string[]>(['YES', 'NO']);
  const [generateAnalysis, setGenerateAnalysis] = useState(true);
  const [selectedCrypto, setSelectedCrypto] = useState<string>('');
  const [cryptoOptions, setCryptoOptions] = useState<CryptoOption[]>([]);
  const [cryptoLoading, setCryptoLoading] = useState(false);

  /**
   * Fetch crypto data from CoinGecko API
   */
  const fetchCryptoData = async () => {
    setCryptoLoading(true);
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false');
      const data = await response.json();
      
      const cryptoData: CryptoOption[] = data.map((coin: any) => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        icon: coin.symbol.charAt(0).toUpperCase(),
        price: coin.current_price,
        change: coin.price_change_percentage_24h,
      }));
      
      setCryptoOptions(cryptoData);
    } catch (error) {
      console.error('Failed to fetch crypto data:', error);
      // Fallback to basic crypto options
      setCryptoOptions([
        { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', icon: '₿', price: 45000, change: 2.5 },
        { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', icon: 'Ξ', price: 3200, change: -1.2 },
        { id: 'binancecoin', name: 'BNB', symbol: 'BNB', icon: 'B', price: 320, change: 5.8 },
        { id: 'cardano', name: 'Cardano', symbol: 'ADA', icon: 'A', price: 0.45, change: 3.1 },
        { id: 'solana', name: 'Solana', symbol: 'SOL', icon: 'S', price: 95, change: -2.3 },
        { id: 'matic-network', name: 'Polygon', symbol: 'MATIC', icon: 'M', price: 0.85, change: 1.7 },
      ]);
    } finally {
      setCryptoLoading(false);
    }
  };

  // Fetch crypto data when component mounts
  useEffect(() => {
    fetchCryptoData();
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreatePredictionData>({
    resolver: zodResolver(createPredictionSchema),
    defaultValues: {
      description: '',
      category: 'custom',
      betType: 'custom',
      userPrediction: 'yes',
      bnbAmount: 0.01,
      expiresAt: Date.now() + 900000, // 15 minutes from now
    },
  });

  const watchedDescription = watch('description');
  const watchedCategory = watch('category');
  const watchedBetType = watch('betType');

  const analyzeWithAI = async () => {
    if (!watchedDescription.trim()) return;
    
    setIsAnalyzing(true);
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
      const analysis = await aiService.analyzePrediction(watchedDescription, watchedCategory);
      
      const aiGeneratedData = {
        title: analysis.title,
        description: analysis.description,
        summary: analysis.summary,
        category: analysis.category as PredictionCategory,
        expiresAt: analysis.expiresAt,
        resolutionInstructions: analysis.resolutionInstructions,
      };
      
      setAiGenerated(aiGeneratedData);
      setValue('description', analysis.description);
      setValue('expiresAt', analysis.expiresAt);
      setValue('resolutionInstructions', analysis.resolutionInstructions);
      setValue('category', analysis.category as PredictionCategory);
      
      // Update options if AI suggests different ones
      if (analysis.suggestedOptions && analysis.suggestedOptions.length >= 2) {
        setOptions(analysis.suggestedOptions);
      }
    } catch (error) {
      console.error('AI analysis failed:', error);
      // Fallback to mock analysis if AI fails
      const fallbackAnalysis = {
        title: `Will ${watchedDescription.split(' ').slice(0, 3).join(' ')} happen?`,
        description: watchedDescription.slice(0, 150),
        summary: `This prediction market allows participants to bet on whether ${watchedDescription}. If YES wins, the stated outcome will have occurred. If NO wins, the stated outcome will not have occurred.`,
        category: watchedCategory,
        expiresAt: Date.now() + 900000, // 15 minutes from now
        resolutionInstructions: `Determine if ${watchedDescription} based on verifiable data sources and official records.`,
      };
      
      setAiGenerated(fallbackAnalysis);
      setValue('description', fallbackAnalysis.description);
      setValue('expiresAt', fallbackAnalysis.expiresAt);
      setValue('resolutionInstructions', fallbackAnalysis.resolutionInstructions);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addOption = () => {
    const newOption = prompt('Enter option text:');
    if (newOption && !options.includes(newOption.toUpperCase())) {
      setOptions([...options, newOption.toUpperCase()]);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const onFormSubmit = (data: CreatePredictionData) => {
    const predictionData: CreatePredictionData = {
      ...data,
      title: aiGenerated?.title || `Will ${data.description.split(' ').slice(0, 3).join(' ')} happen?`,
      summary: generateAnalysis ? aiGenerated?.summary : undefined,
      options,
    };
    onSubmit(predictionData);
    reset();
    setAiGenerated(null);
    setOptions(['YES', 'NO']);
    setGenerateAnalysis(true);
  };

  const handleClose = () => {
    onOpenChange(false);
    reset();
    setAiGenerated(null);
    setOptions(['YES', 'NO']);
    setGenerateAnalysis(true);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900/95 backdrop-blur-md border border-gray-700/50 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white font-heading">
            <Target className="h-5 w-5 text-yellow-400" />
            {t('create_prediction_market')}
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            {t('create_prediction_description')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Wallet Requirement Notice */}
          <Card className="border-gray-700/50 bg-gray-800/60 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-yellow-400" />
                <span className="font-medium text-white">{t('wallet_required')}</span>
              </div>
              <p className="text-xs text-gray-300 mt-1">
                {t('connect_wallet_to_create')}
              </p>
            </CardContent>
          </Card>

          {/* Bet Type Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">{t('bet_type')} *</label>
            <div className="grid grid-cols-2 gap-4">
              <Card 
                className={cn(
                  "cursor-pointer transition-all duration-200 border-gray-700/50 bg-gray-800/60 backdrop-blur-sm",
                  watchedBetType === 'custom' ? "ring-2 ring-yellow-400/50 bg-gray-800/80" : "hover:bg-gray-800/80"
                )}
                onClick={() => setValue('betType', 'custom')}
              >
                <CardContent className="p-4">
                  <div className="text-sm font-medium text-white">{t('custom_bet')}</div>
                  <div className="text-xs text-gray-300">{t('manual_resolution')}</div>
                </CardContent>
              </Card>
              <Card 
                className={cn(
                  "cursor-pointer transition-all duration-200 border-gray-700/50 bg-gray-800/60 backdrop-blur-sm",
                  watchedBetType === 'auto-verified' ? "ring-2 ring-yellow-400/50 bg-gray-800/80" : "hover:bg-gray-800/80"
                )}
                onClick={() => setValue('betType', 'auto-verified')}
              >
                <CardContent className="p-4">
                  <div className="text-sm font-medium text-white">{t('auto_verified_outcome')}</div>
                  <div className="text-xs text-gray-300">{t('price_oracle')}</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Bet Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">{t('bet_description')} *</label>
            <Textarea
              {...register('description')}
              placeholder={t('describe_prediction')}
              className="min-h-[100px] bg-gray-800/60 border-gray-700/50 text-white placeholder:text-gray-400 focus:border-yellow-400/50 focus:ring-yellow-400/20"
            />
            {errors.description && (
              <p className="text-sm text-red-400 font-medium">{errors.description.message}</p>
            )}
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">{t('category')} *</label>
            <Select
              value={watch('category')}
              onValueChange={(value: PredictionCategory) => setValue('category', value)}
            >
              <SelectTrigger className="bg-gray-800/60 border-gray-700/50 text-white focus:border-yellow-400/50 focus:ring-yellow-400/20">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700/50">
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value} className="text-white hover:bg-gray-700/50">
                    <div className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      <span>{category.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-400 font-medium">{errors.category.message}</p>
            )}
          </div>

          {/* Crypto Selection (only show for crypto category) */}
          {watch('category') === 'crypto' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Select Cryptocurrency</label>
              {cryptoLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-6 w-6 animate-spin text-yellow-400 mr-2" />
                  <span className="text-gray-400">Loading cryptocurrencies...</span>
                </div>
              ) : (
                <CryptoSelector
                  options={cryptoOptions}
                  value={selectedCrypto}
                  onValueChange={setSelectedCrypto}
                  placeholder="Choose a cryptocurrency to predict about"
                />
              )}
            </div>
          )}

          {/* AI Analysis */}
          {watchedDescription.length > 10 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-white">{t('ai_resolution_instructions')}</label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={analyzeWithAI}
                  disabled={isAnalyzing}
                  className="flex items-center gap-2 border-gray-700/50 bg-gray-800/60 text-white hover:bg-gray-800/80 transition-all duration-200"
                >
                  <Bot className="h-4 w-4" />
                  {isAnalyzing ? t('analyzing') : t('analyze')}
                </Button>
              </div>
              
              {/* Generate Analysis Checkbox */}
              <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-800/60 border border-gray-700/50">
                <input
                  type="checkbox"
                  id="generateAnalysis"
                  checked={generateAnalysis}
                  onChange={(e) => setGenerateAnalysis(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-600/50 bg-gray-700/50 text-yellow-400 focus:ring-yellow-400/20"
                />
                <label htmlFor="generateAnalysis" className="text-sm text-white cursor-pointer flex-1">
                  Generate detailed analysis (unbiased summary for card)
                </label>
              </div>

              {aiGenerated && (
                <Card className="border-gray-700/50 bg-gray-800/60 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2 text-yellow-400">
                      <Sparkles className="h-4 w-4 text-yellow-400" />
                      {t('ai_generated')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="text-xs text-gray-400">{t('title')}</div>
                      <div className="text-sm font-medium text-white">{aiGenerated.title}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Description</div>
                      <div className="text-sm text-gray-300">{aiGenerated.description}</div>
                    </div>
                    {generateAnalysis && aiGenerated.summary && (
                      <div>
                        <div className="text-xs text-gray-400">Detailed Analysis</div>
                        <div className="text-sm text-gray-300 whitespace-pre-wrap max-h-40 overflow-y-auto">
                          {aiGenerated.summary}
                        </div>
                      </div>
                    )}
                    <div>
                      <div className="text-xs text-gray-400">{t('resolution_instructions')}</div>
                      <div className="text-sm text-gray-300">{aiGenerated.resolutionInstructions}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-gray-600/50 text-gray-300">
                        {aiGenerated.category}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        Expires: {new Date(aiGenerated.expiresAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <Textarea
                {...register('resolutionInstructions')}
                placeholder="AI will generate resolution instructions automatically based on your bet"
                className="min-h-[80px] bg-gray-800/60 border-gray-700/50 text-white placeholder:text-gray-400 focus:border-yellow-400/50 focus:ring-yellow-400/20"
              />
            </div>
          )}

          {/* Options */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">{t('options')} * (min 2)</label>
            <div className="space-y-2">
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...options];
                      newOptions[index] = e.target.value;
                      setOptions(newOptions);
                    }}
                    className="flex-1 bg-gray-800/60 border-gray-700/50 text-white placeholder:text-gray-400 focus:border-yellow-400/50 focus:ring-yellow-400/20"
                  />
                  {options.length > 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeOption(index)}
                      className="border-gray-700/50 bg-gray-800/60 text-white hover:bg-gray-800/80 transition-all duration-200"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOption}
                className="w-full border-gray-700/50 bg-gray-800/60 text-white hover:bg-gray-800/80 transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('add_option')}
              </Button>
            </div>
          </div>

          {/* Expiration Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white flex items-center gap-2">
              <Calendar className="h-4 w-4 text-yellow-400" />
              Bet Expiration Date *
            </label>
            <Input
              type="datetime-local"
              {...register('expiresAt', { 
                valueAsNumber: false,
                setValueAs: (value) => new Date(value).getTime()
              })}
              min={new Date(Date.now() + 900000).toISOString().slice(0, 16)}
              defaultValue={new Date(Date.now() + 900000).toISOString().slice(0, 16)}
              className="bg-gray-800/60 border-gray-700/50 text-white focus:border-yellow-400/50 focus:ring-yellow-400/20"
            />
            {errors.expiresAt && (
              <p className="text-sm text-red-400 font-medium">
                {errors.expiresAt.message}
              </p>
            )}
            <p className="text-xs text-gray-400">
              Set when this prediction market will close and be resolved (minimum 15 minutes)
            </p>
          </div>

          {/* Place Initial Bet */}
          <Card className="border-gray-700/50 bg-gray-800/60 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-yellow-400">
                <Target className="h-4 w-4 text-yellow-400" />
                {t('place_initial_bet')}
              </CardTitle>
              <p className="text-xs text-gray-300">
                {t('prevent_spam')}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">{t('your_prediction')} *</label>
                  <Select
                    value={watch('userPrediction')}
                    onValueChange={(value: 'yes' | 'no') => setValue('userPrediction', value)}
                  >
                    <SelectTrigger className="bg-gray-800/60 border-gray-700/50 text-white focus:border-yellow-400/50 focus:ring-yellow-400/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700/50">
                      <SelectItem value="yes" className="text-white hover:bg-gray-700/50">YES</SelectItem>
                      <SelectItem value="no" className="text-white hover:bg-gray-700/50">NO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">{t('bnb_amount')} *</label>
                  <Input
                    type="number"
                    step="0.001"
                    min="0.001"
                    max="10"
                    {...register('bnbAmount', { valueAsNumber: true })}
                    className="bg-gray-800/60 border-gray-700/50 text-white placeholder:text-gray-400 focus:border-yellow-400/50 focus:ring-yellow-400/20"
                  />
                  {errors.bnbAmount && (
                    <p className="text-xs text-red-400 font-medium">{errors.bnbAmount.message}</p>
                  )}
                </div>
              </div>
              <div className="text-center text-sm text-gray-300">
                {t('click_create_will_prompt').replace('{amount}', formatBNB(watch('bnbAmount')))}
              </div>
            </CardContent>
          </Card>

          {/* Dialog Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-700/50">
            <AnimatedButton
              type="button"
              variant="outline"
              onClick={handleClose}
              className="border-gray-700/50 bg-gray-800/60 text-white hover:bg-gray-800/80 transition-all duration-200"
            >
              {t('cancel')}
            </AnimatedButton>
            <AnimatedButton
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold shadow-md hover:shadow-lg transition-all duration-200"
            >
              {isSubmitting ? t('creating') : t('create_bet')}
            </AnimatedButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}


