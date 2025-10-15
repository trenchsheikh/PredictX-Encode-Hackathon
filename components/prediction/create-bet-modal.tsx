'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreatePredictionData, PredictionCategory } from '@/types/prediction';
import { formatBNB } from '@/lib/utils';
import {
  Bot,
  Plus,
  X,
  Calendar,
  DollarSign,
  Target,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/components/providers/i18n-provider';
import {
  getAIService,
  getDefaultAIConfig,
  initializeAI,
} from '@/lib/ai-service';
import { CryptoSelector, CryptoOption } from '@/components/ui/crypto-selector';
import { AnimatedButton } from '@/components/ui/animated-button';

const createPredictionSchema = z.object({
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.enum([
    'sports',
    'crypto',
    'politics',
    'entertainment',
    'weather',
    'finance',
    'technology',
    'custom',
  ]),
  betType: z.enum(['custom', 'auto-verified']),
  resolutionInstructions: z.string().optional(),
  userPrediction: z.enum(['yes', 'no']),
  bnbAmount: z
    .number()
    .min(0.001, 'Minimum bet is 0.001 BNB')
    .max(10, 'Maximum bet is 10 BNB'),
  expiresAt: z
    .number()
    .min(
      Date.now() + 900000,
      'Expiration must be at least 15 minutes from now'
    ),
});

interface CreateBetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreatePredictionData) => void;
}

const getCategories = (
  t: any
): { value: PredictionCategory; label: string; icon: string }[] => [
  { value: 'sports', label: t('categories.sports'), icon: '⚽' },
  { value: 'crypto', label: t('categories.crypto'), icon: '₿' },
  { value: 'politics', label: t('categories.politics'), icon: '🏛️' },
  { value: 'entertainment', label: t('categories.entertainment'), icon: '🎬' },
  { value: 'weather', label: t('categories.weather'), icon: '🌤️' },
  { value: 'finance', label: t('categories.finance'), icon: '💰' },
  { value: 'technology', label: t('categories.technology'), icon: '💻' },
  { value: 'custom', label: t('categories.custom'), icon: '🎯' },
];

// Crypto options will be fetched from API

export function CreateBetModal({
  open,
  onOpenChange,
  onSubmit,
}: CreateBetModalProps) {
  const { t } = useI18n();
  const categories = getCategories(t);
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
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false'
      );
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
      setCryptoOptions(getFallbackCryptoOptions());
    } finally {
      setCryptoLoading(false);
    }
  };

  function getFallbackCryptoOptions(): CryptoOption[] {
    return [
      {
        id: 'bitcoin',
        name: 'Bitcoin',
        symbol: 'BTC',
        icon: '₿',
        price: 111461,
        change: -0.41,
      },
      {
        id: 'ethereum',
        name: 'Ethereum',
        symbol: 'ETH',
        icon: 'Ξ',
        price: 3200,
        change: 2.5,
      },
      {
        id: 'binancecoin',
        name: 'BNB',
        symbol: 'BNB',
        icon: 'B',
        price: 1178.46,
        change: -0.56,
      },
      {
        id: 'cardano',
        name: 'Cardano',
        symbol: 'ADA',
        icon: 'A',
        price: 0.45,
        change: 3.1,
      },
      {
        id: 'solana',
        name: 'Solana',
        symbol: 'SOL',
        icon: 'S',
        price: 95,
        change: -2.3,
      },
      {
        id: 'matic-network',
        name: 'Polygon',
        symbol: 'MATIC',
        icon: 'M',
        price: 0.85,
        change: 1.7,
      },
      {
        id: 'ripple',
        name: 'XRP',
        symbol: 'XRP',
        icon: 'X',
        price: 0.52,
        change: 1.2,
      },
      {
        id: 'polkadot',
        name: 'Polkadot',
        symbol: 'DOT',
        icon: 'D',
        price: 6.8,
        change: -1.5,
      },
      {
        id: 'dogecoin',
        name: 'Dogecoin',
        symbol: 'DOGE',
        icon: 'D',
        price: 0.08,
        change: 5.2,
      },
      {
        id: 'avalanche-2',
        name: 'Avalanche',
        symbol: 'AVAX',
        icon: 'A',
        price: 25.5,
        change: -0.8,
      },
    ];
  }

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
      const analysis = await aiService.analyzePrediction(
        watchedDescription,
        watchedCategory
      );

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
        title: watchedDescription.trim(),
        description: watchedDescription.slice(0, 150),
        summary: `This prediction market allows participants to bet on whether ${watchedDescription}. If YES wins, the stated outcome will have occurred. If NO wins, the stated outcome will not have occurred.`,
        category: watchedCategory,
        expiresAt: Date.now() + 900000, // 15 minutes from now
        resolutionInstructions: `Determine if ${watchedDescription} based on verifiable data sources and official records.`,
      };

      setAiGenerated(fallbackAnalysis);
      setValue('description', fallbackAnalysis.description);
      setValue('expiresAt', fallbackAnalysis.expiresAt);
      setValue(
        'resolutionInstructions',
        fallbackAnalysis.resolutionInstructions
      );
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
      title: aiGenerated?.title || data.description.trim(),
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
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto border border-gray-700/50 bg-gray-900/95 shadow-2xl backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="font-heading flex items-center gap-2 text-white">
            <Target className="h-5 w-5 text-yellow-400" />
            {t('create_prediction.title')}
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            {t('create_prediction.description')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Wallet Requirement Notice */}
          <Card className="border-gray-700/50 bg-gray-800/60 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-yellow-400" />
                <span className="font-medium text-white">
                  {t('create_prediction.wallet_required')}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-300">
                {t('create_prediction.connect_wallet_to_create')}
              </p>
            </CardContent>
          </Card>

          {/* Bet Type Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">
              {t('create_prediction.bet_type')} *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <Card
                className={cn(
                  'cursor-pointer border-gray-700/50 bg-gray-800/60 backdrop-blur-sm transition-all duration-200',
                  watchedBetType === 'custom'
                    ? 'bg-gray-800/80 ring-2 ring-yellow-400/50'
                    : 'hover:bg-gray-800/80'
                )}
                onClick={() => setValue('betType', 'custom')}
              >
                <CardContent className="p-4">
                  <div className="text-sm font-medium text-white">
                    {t('create_prediction.custom_bet')}
                  </div>
                  <div className="text-xs text-gray-300">
                    {t('create_prediction.manual_resolution')}
                  </div>
                </CardContent>
              </Card>
              <Card
                className={cn(
                  'cursor-pointer border-gray-700/50 bg-gray-800/60 backdrop-blur-sm transition-all duration-200',
                  watchedBetType === 'auto-verified'
                    ? 'bg-gray-800/80 ring-2 ring-yellow-400/50'
                    : 'hover:bg-gray-800/80'
                )}
                onClick={() => setValue('betType', 'auto-verified')}
              >
                <CardContent className="p-4">
                  <div className="text-sm font-medium text-white">
                    {t('create_prediction.auto_verified_outcome')}
                  </div>
                  <div className="text-xs text-gray-300">
                    {t('create_prediction.price_oracle')}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Bet Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">
              {t('create_prediction.bet_description')} *
            </label>
            <Textarea
              {...register('description')}
              placeholder={t('create_prediction.describe_prediction')}
              className="min-h-[100px] border-gray-700/50 bg-gray-800/60 text-white placeholder:text-gray-400 focus:border-yellow-400/50 focus:ring-yellow-400/20"
            />
            {errors.description && (
              <p className="text-sm font-medium text-red-400">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">
              {t('create_prediction.category')} *
            </label>
            <Select
              value={watch('category')}
              onValueChange={(value: PredictionCategory) =>
                setValue('category', value)
              }
            >
              <SelectTrigger className="border-gray-700/50 bg-gray-800/60 text-white focus:border-yellow-400/50 focus:ring-yellow-400/20">
                <SelectValue
                  placeholder={t('create_prediction.select_category')}
                />
              </SelectTrigger>
              <SelectContent className="border-gray-700/50 bg-gray-800">
                {categories.map(category => (
                  <SelectItem
                    key={category.value}
                    value={category.value}
                    className="text-white hover:bg-gray-700/50"
                  >
                    <div className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      <span>{category.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm font-medium text-red-400">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Crypto Selection (only show for crypto category) */}
          {watch('category') === 'crypto' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">
                {t('crypto_prediction.select_crypto')}
              </label>
              {cryptoLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="mr-2 h-6 w-6 animate-spin text-yellow-400" />
                  <span className="text-gray-400">
                    {t('crypto_prediction.loading_cryptocurrencies')}
                  </span>
                </div>
              ) : (
                <CryptoSelector
                  options={cryptoOptions}
                  value={selectedCrypto}
                  onValueChange={setSelectedCrypto}
                  placeholder={t('crypto_prediction.choose_crypto_placeholder')}
                />
              )}
            </div>
          )}

          {/* AI Analysis */}
          {watchedDescription.length > 10 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-white">
                  {t('create_prediction.ai_resolution_instructions')}
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={analyzeWithAI}
                  disabled={isAnalyzing}
                  className="flex items-center gap-2 border-gray-700/50 bg-gray-800/60 text-white transition-all duration-200 hover:bg-gray-800/80"
                >
                  <Bot className="h-4 w-4" />
                  {isAnalyzing
                    ? t('create_prediction.analyzing')
                    : t('create_prediction.analyze')}
                </Button>
              </div>

              {/* Generate Analysis Checkbox */}
              <div className="flex items-center gap-2 rounded-lg border border-gray-700/50 bg-gray-800/60 p-3">
                <input
                  type="checkbox"
                  id="generateAnalysis"
                  checked={generateAnalysis}
                  onChange={e => setGenerateAnalysis(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-600/50 bg-gray-700/50 text-yellow-400 focus:ring-yellow-400/20"
                />
                <label
                  htmlFor="generateAnalysis"
                  className="flex-1 cursor-pointer text-sm text-white"
                >
                  {t('create_prediction.generate_analysis_checkbox')}
                </label>
              </div>

              {aiGenerated && (
                <Card className="border-gray-700/50 bg-gray-800/60 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm text-yellow-400">
                      <Sparkles className="h-4 w-4 text-yellow-400" />
                      {t('create_prediction.ai_generated')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="text-xs text-gray-400">
                        {t('create_prediction.title_label')}
                      </div>
                      <div className="text-sm font-medium text-white">
                        {aiGenerated.title}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Description</div>
                      <div className="text-sm text-gray-300">
                        {aiGenerated.description}
                      </div>
                    </div>
                    {generateAnalysis && aiGenerated.summary && (
                      <div>
                        <div className="text-xs text-gray-400">
                          Detailed Analysis
                        </div>
                        <div className="max-h-40 overflow-y-auto whitespace-pre-wrap text-sm text-gray-300">
                          {aiGenerated.summary}
                        </div>
                      </div>
                    )}
                    <div>
                      <div className="text-xs text-gray-400">
                        {t('create_prediction.resolution_instructions')}
                      </div>
                      <div className="text-sm text-gray-300">
                        {aiGenerated.resolutionInstructions}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="border-gray-600/50 text-gray-300"
                      >
                        {aiGenerated.category}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        Expires:{' '}
                        {new Date(aiGenerated.expiresAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Textarea
                {...register('resolutionInstructions')}
                placeholder="AI will generate resolution instructions automatically based on your bet"
                className="min-h-[80px] border-gray-700/50 bg-gray-800/60 text-white placeholder:text-gray-400 focus:border-yellow-400/50 focus:ring-yellow-400/20"
              />
            </div>
          )}

          {/* Options */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">
              {t('create_prediction.options')} * (min 2)
            </label>
            <div className="space-y-2">
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={option}
                    onChange={e => {
                      const newOptions = [...options];
                      newOptions[index] = e.target.value;
                      setOptions(newOptions);
                    }}
                    className="flex-1 border-gray-700/50 bg-gray-800/60 text-white placeholder:text-gray-400 focus:border-yellow-400/50 focus:ring-yellow-400/20"
                  />
                  {options.length > 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeOption(index)}
                      className="border-gray-700/50 bg-gray-800/60 text-white transition-all duration-200 hover:bg-gray-800/80"
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
                className="w-full border-gray-700/50 bg-gray-800/60 text-white transition-all duration-200 hover:bg-gray-800/80"
              >
                <Plus className="mr-2 h-4 w-4" />
                {t('create_prediction.add_option')}
              </Button>
            </div>
          </div>

          {/* Expiration Date */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-white">
              <Calendar className="h-4 w-4 text-yellow-400" />
              {t('create_prediction.bet_expiration_date')} *
            </label>
            <Input
              type="datetime-local"
              {...register('expiresAt', {
                valueAsNumber: false,
                setValueAs: value => new Date(value).getTime(),
              })}
              min={new Date(Date.now() + 900000).toISOString().slice(0, 16)}
              defaultValue={new Date(Date.now() + 900000)
                .toISOString()
                .slice(0, 16)}
              className="border-gray-700/50 bg-gray-800/60 text-white focus:border-yellow-400/50 focus:ring-yellow-400/20"
            />
            {errors.expiresAt && (
              <p className="text-sm font-medium text-red-400">
                {errors.expiresAt.message}
              </p>
            )}
            <p className="text-xs text-gray-400">
              {t('create_prediction.set_expiration_help')}
            </p>
          </div>

          {/* Place Initial Bet */}
          <Card className="border-gray-700/50 bg-gray-800/60 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-yellow-400">
                <Target className="h-4 w-4 text-yellow-400" />
                {t('create_prediction.place_initial_bet')}
              </CardTitle>
              <p className="text-xs text-gray-300">
                {t('create_prediction.prevent_spam')}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">
                    {t('create_prediction.your_prediction')} *
                  </label>
                  <Select
                    value={watch('userPrediction')}
                    onValueChange={(value: 'yes' | 'no') =>
                      setValue('userPrediction', value)
                    }
                  >
                    <SelectTrigger className="border-gray-700/50 bg-gray-800/60 text-white focus:border-yellow-400/50 focus:ring-yellow-400/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-gray-700/50 bg-gray-800">
                      <SelectItem
                        value="yes"
                        className="text-white hover:bg-gray-700/50"
                      >
                        {t('prediction_card.yes')}
                      </SelectItem>
                      <SelectItem
                        value="no"
                        className="text-white hover:bg-gray-700/50"
                      >
                        {t('prediction_card.no')}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">
                    {t('create_prediction.bnb_amount')} *
                  </label>
                  <Input
                    type="number"
                    step="0.001"
                    min="0.001"
                    max="10"
                    {...register('bnbAmount', { valueAsNumber: true })}
                    className="border-gray-700/50 bg-gray-800/60 text-white placeholder:text-gray-400 focus:border-yellow-400/50 focus:ring-yellow-400/20"
                  />
                  {errors.bnbAmount && (
                    <p className="text-xs font-medium text-red-400">
                      {errors.bnbAmount.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-center text-sm text-gray-300">
                {t('create_prediction.click_create_will_prompt').replace(
                  '{amount}',
                  formatBNB(watch('bnbAmount'))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Dialog Footer */}
          <div className="flex justify-end gap-3 border-t border-gray-700/50 pt-4">
            <AnimatedButton
              type="button"
              variant="outline"
              onClick={handleClose}
              className="border-gray-700/50 bg-gray-800/60 text-white transition-all duration-200 hover:bg-gray-800/80"
            >
              {t('create_prediction.cancel')}
            </AnimatedButton>
            <AnimatedButton
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 font-semibold text-black shadow-md transition-all duration-200 hover:from-yellow-500 hover:to-yellow-700 hover:shadow-lg"
            >
              {isSubmitting
                ? t('create_prediction.creating')
                : t('create_prediction.create_bet')}
            </AnimatedButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
