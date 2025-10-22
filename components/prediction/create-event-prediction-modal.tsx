'use client';

import { useState } from 'react';

import { Calendar, TrendingUp, X } from 'lucide-react';

import { useI18n } from '@/components/providers/i18n-provider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { InlineError } from '@/components/ui/error-display';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface CreateEventPredictionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: EventPredictionData) => Promise<void>;
}

export interface EventPredictionData {
  title: string;
  description: string;
  category: string;
  expiresAt: Date;
  keywords: string[];
  newsSearchQuery?: string;
  verificationThreshold?: number;
  amount: number;
  outcome: 'yes' | 'no';
}

const categories = [
  { value: '2', label: 'Politics', icon: '🏛️' },
  { value: '6', label: 'Technology', icon: '💻' },
  { value: '5', label: 'Economy', icon: '💰' },
  { value: '0', label: 'Sports', icon: '⚽' },
  { value: '3', label: 'Entertainment', icon: '🎬' },
  { value: '8', label: 'World News', icon: '🌍' },
  { value: '9', label: 'Science', icon: '🔬' },
  { value: '10', label: 'Health', icon: '🏥' },
];

export function CreateEventPredictionModal({
  open,
  onOpenChange,
  onConfirm,
}: CreateEventPredictionModalProps) {
  const { t } = useI18n();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [amount, setAmount] = useState('');
  const [outcome, setOutcome] = useState<'yes' | 'no'>('yes');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const minBet = 0.001;
  const maxBet = 100;

  const addKeyword = () => {
    const keyword = keywordInput.trim();
    if (keyword && !keywords.includes(keyword) && keywords.length < 10) {
      setKeywords([...keywords, keyword]);
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  const validateForm = (): boolean => {
    if (!title.trim()) {
      setError({ message: 'Please enter a title' });
      return false;
    }
    if (!description.trim()) {
      setError({ message: 'Please enter a description' });
      return false;
    }
    if (!category) {
      setError({ message: 'Please select a category' });
      return false;
    }
    if (!expiresAt) {
      setError({ message: 'Please select an expiration date' });
      return false;
    }
    if (new Date(expiresAt) <= new Date()) {
      setError({ message: 'Expiration date must be in the future' });
      return false;
    }
    if (keywords.length === 0) {
      setError({
        message: 'Please add at least one keyword to monitor news',
      });
      return false;
    }
    const numAmount = parseFloat(amount);
    if (!amount || numAmount <= 0) {
      setError({ message: 'Please enter a valid bet amount' });
      return false;
    }
    if (numAmount < minBet) {
      setError({ message: `Minimum bet is ${minBet} BNB` });
      return false;
    }
    if (numAmount > maxBet) {
      setError({ message: `Maximum bet is ${maxBet} BNB` });
      return false;
    }
    setError(null);
    return true;
  };

  const handleConfirm = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      await onConfirm({
        title: title.trim(),
        description: description.trim(),
        category,
        expiresAt: new Date(expiresAt),
        keywords,
        amount: parseFloat(amount),
        outcome,
      });
      // Reset form
      setTitle('');
      setDescription('');
      setCategory('');
      setExpiresAt('');
      setKeywords([]);
      setAmount('');
      setOutcome('yes');
      onOpenChange(false);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] border border-white/20 bg-card shadow-2xl backdrop-blur-md sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="font-heading flex items-center gap-2 text-foreground">
            <TrendingUp className="h-5 w-5 text-white" />
            {t('event_prediction.title')}
          </DialogTitle>
          <DialogDescription className="pt-2 text-left text-muted-foreground">
            {t('event_prediction.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[calc(90vh-200px)] space-y-4 overflow-y-auto py-4">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {t('event_prediction.event_title')}
            </label>
            <Input
              type="text"
              placeholder={t('event_prediction.event_title_placeholder')}
              value={title}
              onChange={e => setTitle(e.target.value)}
              disabled={loading}
              className="border-white/20 bg-card text-foreground placeholder:text-muted-foreground focus:border-white/20 focus:ring-0"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {t('event_prediction.description_label')}
            </label>
            <Textarea
              placeholder={t('event_prediction.description_placeholder')}
              value={description}
              onChange={e => setDescription(e.target.value)}
              disabled={loading}
              rows={4}
              className="border-white/20 bg-card text-foreground placeholder:text-muted-foreground focus:border-white/20 focus:ring-0"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {t('event_prediction.category')}
            </label>
            <Select
              value={category}
              onValueChange={setCategory}
              disabled={loading}
            >
              <SelectTrigger className="border-white/20 bg-card text-foreground focus:border-white/20 focus:ring-0">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="z-[9999] border-white/20 bg-card">
                <SelectItem
                  value="2"
                  className="cursor-pointer text-foreground"
                >
                  🏛️ {t('event_prediction.categories.politics')}
                </SelectItem>
                <SelectItem
                  value="6"
                  className="cursor-pointer text-foreground"
                >
                  💻 {t('event_prediction.categories.technology')}
                </SelectItem>
                <SelectItem
                  value="5"
                  className="cursor-pointer text-foreground"
                >
                  💰 {t('event_prediction.categories.economy')}
                </SelectItem>
                <SelectItem
                  value="0"
                  className="cursor-pointer text-foreground"
                >
                  ⚽ {t('event_prediction.categories.sports')}
                </SelectItem>
                <SelectItem
                  value="3"
                  className="cursor-pointer text-foreground"
                >
                  🎬 {t('event_prediction.categories.entertainment')}
                </SelectItem>
                <SelectItem
                  value="8"
                  className="cursor-pointer text-foreground"
                >
                  🌍 {t('event_prediction.categories.world_news')}
                </SelectItem>
                <SelectItem
                  value="9"
                  className="cursor-pointer text-foreground"
                >
                  🔬 {t('event_prediction.categories.science')}
                </SelectItem>
                <SelectItem
                  value="10"
                  className="cursor-pointer text-foreground"
                >
                  🏥 {t('event_prediction.categories.health')}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Expiration Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              <Calendar className="mr-1 inline h-4 w-4" />
              {t('event_prediction.expiration_date')}
            </label>
            <Input
              type="datetime-local"
              value={expiresAt}
              onChange={e => setExpiresAt(e.target.value)}
              disabled={loading}
              className="border-white/20 bg-card text-foreground focus:border-white/20 focus:ring-0"
            />
          </div>

          {/* Keywords */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {t('event_prediction.news_keywords')}
              <span className="ml-2 text-xs text-muted-foreground">
                {t('event_prediction.news_keywords_help')}
              </span>
            </label>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder={t('event_prediction.keyword_placeholder')}
                value={keywordInput}
                onChange={e => setKeywordInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && addKeyword()}
                disabled={loading || keywords.length >= 10}
                className="flex-1 border-white/20 bg-card text-foreground placeholder:text-muted-foreground focus:border-white/20 focus:ring-0"
              />
              <Button
                type="button"
                onClick={addKeyword}
                disabled={loading || keywords.length >= 10 || !keywordInput}
                className="bg-white text-black"
              >
                {t('event_prediction.add_keyword')}
              </Button>
            </div>
            {keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {keywords.map(keyword => (
                  <Badge
                    key={keyword}
                    variant="secondary"
                    className="bg-white/10 text-white"
                  >
                    {keyword}
                    <button
                      onClick={() => removeKeyword(keyword)}
                      className="ml-2 hover:text-red-400"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              {keywords.length}/10 {t('event_prediction.keywords_count')}
            </p>
          </div>

          {/* Bet Amount & Outcome */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {t('event_prediction.bet_amount')}
              </label>
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                min={minBet}
                max={maxBet}
                step="0.001"
                disabled={loading}
                className="border-white/20 bg-card text-foreground focus:border-white/20 focus:ring-0"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {t('event_prediction.your_prediction')}
              </label>
              <Select
                value={outcome}
                onValueChange={value => setOutcome(value as 'yes' | 'no')}
                disabled={loading}
              >
                <SelectTrigger className="border-white/20 bg-card text-foreground focus:border-white/20 focus:ring-0">
                  <SelectValue
                    placeholder={t('event_prediction.select_prediction')}
                  />
                </SelectTrigger>
                <SelectContent className="z-[9999] border-white/20 bg-card">
                  <SelectItem value="yes" className="cursor-pointer text-white">
                    ✓ {t('event_prediction.yes')}
                  </SelectItem>
                  <SelectItem value="no" className="cursor-pointer text-white">
                    ✗ {t('event_prediction.no')}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Error Message */}
          {error && <InlineError error={error} />}

          {/* Info Banner */}
          <div className="rounded-xl border border-white/20 bg-white/10 p-4">
            <p className="text-xs text-white">
              <strong className="text-white">
                {t('event_prediction.how_it_works')}
              </strong>{' '}
              {t('event_prediction.how_it_works_desc')}
            </p>
          </div>
        </div>

        <DialogFooter className="gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="border-white/20 bg-card text-foreground"
          >
            {t('event_prediction.cancel')}
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="bg-white font-semibold text-black"
          >
            {loading
              ? t('event_prediction.creating')
              : t('event_prediction.create_event_prediction')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
