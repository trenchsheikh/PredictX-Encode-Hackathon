'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FilterOptions, PredictionCategory } from '@/types/prediction';
import { X } from 'lucide-react';

interface FiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  totalCount: number;
}

const categories: { value: PredictionCategory; label: string }[] = [
  { value: 'sports', label: 'Sports' },
  { value: 'crypto', label: 'Crypto' },
  { value: 'politics', label: 'Politics' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'weather', label: 'Weather' },
  { value: 'finance', label: 'Finance' },
  { value: 'technology', label: 'Technology' },
  { value: 'custom', label: 'Custom' },
];

const timeRanges = [
  { value: 'all', label: 'All Time' },
  { value: '24h', label: '24 Hours' },
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
];

export function Filters({
  filters,
  onFiltersChange,
  totalCount,
}: FiltersProps) {
  const updateFilter = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="space-y-4">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-white">Filter Markets</h3>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-black hover:bg-black/10 hover:text-black/80"
            >
              <X className="mr-1 h-4 w-4" />
              Clear all
            </Button>
          )}
        </div>
        <div className="text-sm font-medium text-black">
          {totalCount} markets
        </div>
      </div>

      {/* Filter Options - Always Visible */}
      <div className="grid grid-cols-1 gap-4 rounded-lg border border-black bg-black/90 p-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Status Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Status</label>
          <select
            value={filters.status || 'all'}
            onChange={e =>
              updateFilter(
                'status',
                e.target.value === 'all' ? undefined : e.target.value
              )
            }
            className="w-full rounded-md border border-white/20 bg-black/50 p-2 text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="resolved">Resolved</option>
            <option value="cancelled">Cancelled</option>
            <option value="expired">Expired</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Category</label>
          <select
            value={filters.category || 'all'}
            onChange={e =>
              updateFilter(
                'category',
                e.target.value === 'all' ? undefined : e.target.value
              )
            }
            className="w-full rounded-md border border-white/20 bg-black/50 p-2 text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* Time Range Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Time Range</label>
          <select
            value={filters.timeRange || 'all'}
            onChange={e =>
              updateFilter(
                'timeRange',
                e.target.value === 'all' ? undefined : e.target.value
              )
            }
            className="w-full rounded-md border border-white/20 bg-black/50 p-2 text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
          >
            {timeRanges.map(range => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* Hot Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Popularity</label>
          <select
            value={filters.isHot ? 'hot' : 'all'}
            onChange={e => updateFilter('isHot', e.target.value === 'hot')}
            className="w-full rounded-md border border-white/20 bg-black/50 p-2 text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
          >
            <option value="all">All</option>
            <option value="hot">Hot Only</option>
          </select>
        </div>
      </div>

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.status && (
            <Badge className="flex items-center gap-1 border border-white/20 bg-black/90 text-white">
              Status: {filters.status}
              <button
                onClick={() => updateFilter('status', undefined)}
                className="ml-1 rounded-full p-0.5 hover:bg-white/20"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.category && (
            <Badge className="flex items-center gap-1 border border-white/20 bg-black/90 text-white">
              Category:{' '}
              {categories.find(c => c.value === filters.category)?.label}
              <button
                onClick={() => updateFilter('category', undefined)}
                className="ml-1 rounded-full p-0.5 hover:bg-white/20"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.timeRange && (
            <Badge className="flex items-center gap-1 border border-white/20 bg-black/90 text-white">
              Time: {timeRanges.find(t => t.value === filters.timeRange)?.label}
              <button
                onClick={() => updateFilter('timeRange', undefined)}
                className="ml-1 rounded-full p-0.5 hover:bg-white/20"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.isHot && (
            <Badge className="flex items-center gap-1 border border-yellow-600 bg-yellow-500 text-black">
              Hot Only
              <button
                onClick={() => updateFilter('isHot', undefined)}
                className="ml-1 rounded-full p-0.5 hover:bg-black/20"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
