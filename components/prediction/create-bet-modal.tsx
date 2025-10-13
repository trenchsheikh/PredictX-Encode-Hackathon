'use client';

import { useState } from 'react';
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

const createPredictionSchema = z.object({
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.enum(['sports', 'crypto', 'politics', 'entertainment', 'weather', 'finance', 'technology', 'custom']),
  betType: z.enum(['custom', 'auto-verified']),
  resolutionInstructions: z.string().optional(),
  userPrediction: z.enum(['yes', 'no']),
  bnbAmount: z.number().min(0.001, 'Minimum bet is 0.001 BNB').max(10, 'Maximum bet is 10 BNB'),
  expiresAt: z.number().min(Date.now() + 3600000, 'Expiration must be at least 1 hour from now'),
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

export function CreateBetModal({ open, onOpenChange, onSubmit }: CreateBetModalProps) {
  const { t } = useI18n();
  const [aiGenerated, setAiGenerated] = useState<{
    title: string;
    category: PredictionCategory;
    expiresAt: number;
    resolutionInstructions: string;
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [options, setOptions] = useState<string[]>(['YES', 'NO']);

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
      expiresAt: Date.now() + 86400000 * 7, // 7 days from now
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
        category: analysis.category as PredictionCategory,
        expiresAt: analysis.expiresAt,
        resolutionInstructions: analysis.resolutionInstructions,
      };
      
      setAiGenerated(aiGeneratedData);
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
        category: watchedCategory,
        expiresAt: Date.now() + 86400000 * 30, // 30 days from now
        resolutionInstructions: `Determine if ${watchedDescription} based on verifiable data sources and official records.`,
      };
      
      setAiGenerated(fallbackAnalysis);
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
      options,
    };
    onSubmit(predictionData);
    reset();
    setAiGenerated(null);
    setOptions(['YES', 'NO']);
  };

  const handleClose = () => {
    onOpenChange(false);
    reset();
    setAiGenerated(null);
    setOptions(['YES', 'NO']);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            {t('create_prediction_market')}
          </DialogTitle>
          <DialogDescription>
            {t('create_prediction_description')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Wallet Requirement Notice */}
          <Card className="border-yellow-500/20 bg-yellow-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-yellow-400" />
                <span className="font-medium text-yellow-300">{t('wallet_required')}</span>
              </div>
              <p className="text-xs text-yellow-200 mt-1">
                {t('connect_wallet_to_create')}
              </p>
            </CardContent>
          </Card>

          {/* Bet Type Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-yellow-200">{t('bet_type')} *</label>
            <div className="grid grid-cols-2 gap-4">
              <Card 
                className={cn(
                  "cursor-pointer transition-all border-yellow-500/20 bg-black/30",
                  watchedBetType === 'custom' ? "ring-2 ring-yellow-500/50 bg-yellow-500/10" : "hover:bg-yellow-500/5"
                )}
                onClick={() => setValue('betType', 'custom')}
              >
                <CardContent className="p-4">
                  <div className="text-sm font-medium text-yellow-300">{t('custom_bet')}</div>
                  <div className="text-xs text-yellow-200">{t('manual_resolution')}</div>
                </CardContent>
              </Card>
              <Card 
                className={cn(
                  "cursor-pointer transition-all border-yellow-500/20 bg-black/30",
                  watchedBetType === 'auto-verified' ? "ring-2 ring-yellow-500/50 bg-yellow-500/10" : "hover:bg-yellow-500/5"
                )}
                onClick={() => setValue('betType', 'auto-verified')}
              >
                <CardContent className="p-4">
                  <div className="text-sm font-medium text-yellow-300">{t('auto_verified_outcome')}</div>
                  <div className="text-xs text-yellow-200">{t('price_oracle')}</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Bet Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-yellow-200">{t('bet_description')} *</label>
            <Textarea
              {...register('description')}
              placeholder={t('describe_prediction')}
              className="min-h-[100px] bg-black/30 border-yellow-500/20 text-yellow-200 placeholder:text-yellow-200/60"
            />
            {errors.description && (
              <p className="text-sm text-red-400">{errors.description.message}</p>
            )}
          </div>

          {/* AI Analysis */}
          {watchedDescription.length > 10 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-yellow-200">{t('ai_resolution_instructions')}</label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={analyzeWithAI}
                  disabled={isAnalyzing}
                  className="flex items-center gap-2 border-yellow-500/20 text-yellow-200 hover:bg-yellow-500/10"
                >
                  <Bot className="h-4 w-4" />
                  {isAnalyzing ? t('analyzing') : t('analyze')}
                </Button>
              </div>
              
              {aiGenerated && (
                <Card className="border-yellow-500/20 bg-yellow-500/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2 text-yellow-300">
                      <Sparkles className="h-4 w-4 text-yellow-400" />
                      {t('ai_generated')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="text-xs text-yellow-200">{t('title')}</div>
                      <div className="text-sm font-medium text-yellow-300">{aiGenerated.title}</div>
                    </div>
                    <div>
                      <div className="text-xs text-yellow-200">{t('resolution_instructions')}</div>
                      <div className="text-sm text-yellow-200">{aiGenerated.resolutionInstructions}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-yellow-500/20 text-yellow-200">
                        {aiGenerated.category}
                      </Badge>
                      <span className="text-xs text-yellow-200">
                        Expires: {new Date(aiGenerated.expiresAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <Textarea
                {...register('resolutionInstructions')}
                placeholder="AI will generate resolution instructions automatically based on your bet"
                className="min-h-[80px] bg-black/30 border-yellow-500/20 text-yellow-200 placeholder:text-yellow-200/60"
              />
            </div>
          )}

          {/* Options */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-yellow-200">{t('options')} * (min 2)</label>
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
                    className="flex-1 bg-black/30 border-yellow-500/20 text-yellow-200 placeholder:text-yellow-200/60"
                  />
                  {options.length > 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeOption(index)}
                      className="border-yellow-500/20 text-yellow-200 hover:bg-yellow-500/10"
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
                className="w-full border-yellow-500/20 text-yellow-200 hover:bg-yellow-500/10"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('add_option')}
              </Button>
            </div>
          </div>

          {/* Place Initial Bet */}
          <Card className="border-yellow-500/20 bg-yellow-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-yellow-300">
                <Target className="h-4 w-4 text-yellow-400" />
                {t('place_initial_bet')}
              </CardTitle>
              <p className="text-xs text-yellow-200">
                {t('prevent_spam')}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-yellow-200">{t('your_prediction')} *</label>
                  <Select
                    value={watch('userPrediction')}
                    onValueChange={(value: 'yes' | 'no') => setValue('userPrediction', value)}
                  >
                    <SelectTrigger className="bg-black/30 border-yellow-500/20 text-yellow-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-yellow-500/20">
                      <SelectItem value="yes" className="text-yellow-200">YES</SelectItem>
                      <SelectItem value="no" className="text-yellow-200">NO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-yellow-200">{t('bnb_amount')} *</label>
                  <Input
                    type="number"
                    step="0.001"
                    min="0.001"
                    max="10"
                    {...register('bnbAmount', { valueAsNumber: true })}
                    className="bg-black/30 border-yellow-500/20 text-yellow-200 placeholder:text-yellow-200/60"
                  />
                  {errors.bnbAmount && (
                    <p className="text-xs text-red-400">{errors.bnbAmount.message}</p>
                  )}
                </div>
              </div>
              <div className="text-center text-sm text-yellow-200">
                {t('click_create_will_prompt').replace('{amount}', formatBNB(watch('bnbAmount')))}
              </div>
            </CardContent>
          </Card>

          {/* Dialog Footer */}
          <div className="flex justify-end gap-2 pt-4 border-t border-yellow-500/20">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="border-yellow-500/20 text-yellow-200 hover:bg-yellow-500/10"
            >
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
            >
              {isSubmitting ? t('creating') : t('create_bet')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}


