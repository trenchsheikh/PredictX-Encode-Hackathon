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
      // Mock AI analysis - in real implementation, this would call your AI API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockAnalysis = {
        title: `Will ${watchedDescription.split(' ').slice(0, 3).join(' ')} happen?`,
        category: watchedCategory,
        expiresAt: Date.now() + 86400000 * 30, // 30 days from now
        resolutionInstructions: `Determine if ${watchedDescription} based on verifiable data sources and official records.`,
      };
      
      setAiGenerated(mockAnalysis);
      setValue('expiresAt', mockAnalysis.expiresAt);
      setValue('resolutionInstructions', mockAnalysis.resolutionInstructions);
    } catch (error) {
      console.error('AI analysis failed:', error);
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
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-primary" />
                <span className="font-medium">{t('wallet_required')}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {t('connect_wallet_to_create')}
              </p>
            </CardContent>
          </Card>

          {/* Bet Type Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('bet_type')} *</label>
            <div className="grid grid-cols-2 gap-4">
              <Card 
                className={cn(
                  "cursor-pointer transition-all",
                  watchedBetType === 'custom' ? "ring-2 ring-primary bg-primary/5" : "hover:bg-muted/50"
                )}
                onClick={() => setValue('betType', 'custom')}
              >
                <CardContent className="p-4">
                  <div className="text-sm font-medium">{t('custom_bet')}</div>
                  <div className="text-xs text-muted-foreground">{t('manual_resolution')}</div>
                </CardContent>
              </Card>
              <Card 
                className={cn(
                  "cursor-pointer transition-all",
                  watchedBetType === 'auto-verified' ? "ring-2 ring-primary bg-primary/5" : "hover:bg-muted/50"
                )}
                onClick={() => setValue('betType', 'auto-verified')}
              >
                <CardContent className="p-4">
                  <div className="text-sm font-medium">{t('auto_verified_outcome')}</div>
                  <div className="text-xs text-muted-foreground">{t('price_oracle')}</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Bet Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('bet_description')} *</label>
            <Textarea
              {...register('description')}
              placeholder={t('describe_prediction')}
              className="min-h-[100px]"
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* AI Analysis */}
          {watchedDescription.length > 10 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">AI Resolution Instructions</label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={analyzeWithAI}
                  disabled={isAnalyzing}
                  className="flex items-center gap-2"
                >
                  <Bot className="h-4 w-4" />
                  {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                </Button>
              </div>
              
              {aiGenerated && (
                <Card className="border-accent/20 bg-accent/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-accent" />
                      AI Generated
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <div className="text-xs text-muted-foreground">Title</div>
                      <div className="text-sm font-medium">{aiGenerated.title}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Resolution Instructions</div>
                      <div className="text-sm">{aiGenerated.resolutionInstructions}</div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <Textarea
                {...register('resolutionInstructions')}
                placeholder="AI will generate resolution instructions automatically based on your bet"
                className="min-h-[80px]"
              />
            </div>
          )}

          {/* Options */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Options * (min 2)</label>
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
                    className="flex-1"
                  />
                  {options.length > 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeOption(index)}
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
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Option
              </Button>
            </div>
          </div>

          {/* Place Initial Bet */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                {t('place_initial_bet')}
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                {t('prevent_spam')}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('your_prediction')} *</label>
                  <Select
                    value={watch('userPrediction')}
                    onValueChange={(value: 'yes' | 'no') => setValue('userPrediction', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">YES</SelectItem>
                      <SelectItem value="no">NO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('bnb_amount')} *</label>
                  <Input
                    type="number"
                    step="0.001"
                    min="0.001"
                    max="10"
                    {...register('bnbAmount', { valueAsNumber: true })}
                  />
                  {errors.bnbAmount && (
                    <p className="text-xs text-destructive">{errors.bnbAmount.message}</p>
                  )}
                </div>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                {t('click_create_will_prompt').replace('{amount}', formatBNB(watch('bnbAmount')))}
              </div>
            </CardContent>
          </Card>

          {/* Dialog Footer */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
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


