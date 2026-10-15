'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Leaf, ChevronDown, Check } from 'lucide-react';
import { menuCategories, type MenuCategory, type SpiceLevel } from '@/data/menu';
import { cn } from '@/lib/utils';

export type SortOption = 'recommended' | 'price-asc' | 'price-desc' | 'rating' | 'prep-time';

export const SORT_LABELS: Record<SortOption, string> = {
  'recommended': 'Recommended',
  'price-asc': 'Price: Low to High',
  'price-desc': 'Price: High to Low',
  'rating': 'Rating',
  'prep-time': 'Prep Time',
};

export interface FilterState {
  category: MenuCategory | 'All';
  search: string;
  vegOnly: boolean;
  sort: SortOption;
  spiceLevels: SpiceLevel[];
}

export const DEFAULT_FILTERS: FilterState = {
  category: 'All',
  search: '',
  vegOnly: false,
  sort: 'recommended',
  spiceLevels: [],
};

interface FilterBarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClear: () => void;
}

export function FilterBar({ filters, onFiltersChange, onClear }: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabScrollRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);
  const [sortOpen, setSortOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(filters.search);
  const sortRef = useRef<HTMLDivElement>(null);

  // Sync URL params when filters change (external -> URL)
  const updateURL = useCallback(
    (next: FilterState) => {
      const params = new URLSearchParams();
      if (next.category !== 'All') params.set('category', next.category);
      if (next.search) params.set('q', next.search);
      if (next.vegOnly) params.set('veg', 'true');
      if (next.sort !== 'recommended') params.set('sort', next.sort);
      if (next.spiceLevels.length > 0) params.set('spice', next.spiceLevels.join(','));
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname]
  );

  // Sync from URL on mount
  useEffect(() => {
    const category = searchParams.get('category') as MenuCategory | null;
    const q = searchParams.get('q') || '';
    const veg = searchParams.get('veg') === 'true';
    const sort = (searchParams.get('sort') as SortOption) || 'recommended';
    const spice = searchParams
      .get('spice')
      ?.split(',')
      .map(Number)
      .filter((n): n is SpiceLevel => n >= 1 && n <= 3) || [];

    onFiltersChange({
      category: category && [...menuCategories].includes(category) ? category : 'All',
      search: q,
      vegOnly: veg,
      sort,
      spiceLevels: spice,
    });
    setLocalSearch(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== filters.search) {
        const next = { ...filters, search: localSearch };
        onFiltersChange(next);
        updateURL(next);
      }
    }, 250);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localSearch]);

  // Auto-scroll active tab into view
  useEffect(() => {
    activeTabRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }, [filters.category]);

  // Close sort dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    if (sortOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [sortOpen]);

  const updateFilter = (patch: Partial<FilterState>) => {
    const next = { ...filters, ...patch };
    onFiltersChange(next);
    updateURL(next);
  };

  const toggleSpice = (level: SpiceLevel) => {
    const current = filters.spiceLevels;
    const next = current.includes(level)
      ? current.filter((l) => l !== level)
      : [...current, level].sort();
    updateFilter({ spiceLevels: next });
  };

  const hasActiveFilters =
    filters.category !== 'All' ||
    filters.search !== '' ||
    filters.vegOnly ||
    filters.sort !== 'recommended' ||
    filters.spiceLevels.length > 0;

  const allTabs: (MenuCategory | 'All')[] = ['All', ...menuCategories];

  return (
    <div className="sticky top-0 z-30 bg-cream/95 backdrop-blur-md border-b border-brass/30">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-3">
        {/* Row 1: Category tabs + search */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Category tabs */}
          <div
            ref={tabScrollRef}
            className="flex items-center gap-1 overflow-x-auto scrollbar-hide -mx-1 px-1"
            role="tablist"
            aria-label="Menu categories"
          >
            {allTabs.map((tab) => {
              const isActive = filters.category === tab;
              return (
                <button
                  key={tab}
                  ref={isActive ? activeTabRef : undefined}
                  onClick={() => updateFilter({ category: tab })}
                  role="tab"
                  aria-selected={isActive}
                  className={cn(
                    'relative font-elite text-[11px] uppercase tracking-[0.1em] whitespace-nowrap px-3 py-1.5 transition-colors',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-brass rounded',
                    isActive ? 'text-oxblood' : 'text-sepia hover:text-ink'
                  )}
                >
                  {tab}
                  {isActive && (
                    <motion.span
                      layoutId="filter-tab-underline"
                      className="absolute left-0 right-0 -bottom-0.5 h-0.5 bg-brass"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative flex items-center lg:w-56 shrink-0">
            <Search
              className="absolute left-2 h-4 w-4 text-sepia pointer-events-none"
              strokeWidth={1.5}
            />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search dishes..."
              aria-label="Search dishes"
              className="w-full bg-parchment border border-brass/30 pl-8 pr-8 py-1.5 font-lora text-sm text-ink placeholder:text-sepia/60 focus:outline-none focus:border-brass"
            />
            {localSearch && (
              <button
                onClick={() => {
                  setLocalSearch('');
                  updateFilter({ search: '' });
                }}
                aria-label="Clear search"
                className="absolute right-2 text-sepia hover:text-oxblood transition-colors"
              >
                <X className="h-4 w-4" strokeWidth={1.5} />
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Veg toggle + sort + spice + clear */}
        <div className="mt-3 flex items-center gap-4 flex-wrap">
          {/* Veg-only toggle */}
          <button
            onClick={() => updateFilter({ vegOnly: !filters.vegOnly })}
            aria-pressed={filters.vegOnly}
            aria-label="Toggle veg only"
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass rounded',
              filters.vegOnly
                ? 'border-forest bg-forest/10'
                : 'border-brass/30 bg-parchment'
            )}
          >
            <div
              className={cn(
                'relative flex h-5 w-9 items-center rounded-full transition-colors',
                filters.vegOnly ? 'bg-forest' : 'bg-sepia/30'
              )}
            >
              <motion.div
                layout
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className={cn(
                  'absolute h-4 w-4 rounded-full bg-cream border border-brass/40 flex items-center justify-center',
                  filters.vegOnly ? 'right-0.5' : 'left-0.5'
                )}
              >
                {filters.vegOnly && (
                  <Leaf className="h-2.5 w-2.5 text-forest" strokeWidth={2} />
                )}
              </motion.div>
            </div>
            <span className="font-elite text-[10px] uppercase tracking-wider text-ink">
              Veg Only
            </span>
          </button>

          {/* Spice level filter */}
          <div className="flex items-center gap-1.5">
            <span className="font-elite text-[10px] uppercase tracking-wider text-sepia">
              Spice:
            </span>
            {[1, 2, 3].map((level) => {
              const isActive = filters.spiceLevels.includes(level as SpiceLevel);
              return (
                <button
                  key={level}
                  onClick={() => toggleSpice(level as SpiceLevel)}
                  aria-pressed={isActive}
                  aria-label={`Filter spice level ${level}`}
                  className={cn(
                    'flex items-center gap-0.5 px-2 py-1 border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass rounded',
                    isActive
                      ? 'border-oxblood bg-oxblood/10'
                      : 'border-brass/30 bg-parchment hover:border-brass/50'
                  )}
                >
                  {Array.from({ length: level }).map((_, i) => (
                    <svg
                      key={i}
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill={isActive ? '#7A1F1F' : '#8B6B4A'}
                    >
                      <path d="M12 2c0 4-4 6-4 10a4 4 0 008 0c0-4-4-6-4-10z" />
                    </svg>
                  ))}
                </button>
              );
            })}
          </div>

          {/* Sort dropdown */}
          <div ref={sortRef} className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              aria-label="Sort options"
              aria-expanded={sortOpen}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-brass/30 bg-parchment hover:border-brass/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass rounded"
            >
              <span className="font-elite text-[10px] uppercase tracking-wider text-ink">
                {SORT_LABELS[filters.sort]}
              </span>
              <ChevronDown
                className={cn(
                  'h-3 w-3 text-sepia transition-transform',
                  sortOpen && 'rotate-180'
                )}
                strokeWidth={1.5}
              />
            </button>
            <AnimatePresence>
              {sortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full right-0 mt-1 w-52 bg-cream border border-brass/40 shadow-vintage-lift z-50"
                >
                  {(Object.keys(SORT_LABELS) as SortOption[]).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        updateFilter({ sort: opt });
                        setSortOpen(false);
                      }}
                      className={cn(
                        'flex w-full items-center justify-between px-3 py-2 font-elite text-[10px] uppercase tracking-wider transition-colors hover:bg-parchment',
                        filters.sort === opt ? 'text-oxblood' : 'text-sepia'
                      )}
                    >
                      {SORT_LABELS[opt]}
                      {filters.sort === opt && (
                        <Check className="h-3 w-3" strokeWidth={2} />
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Clear filters */}
          <AnimatePresence>
            {hasActiveFilters && (
              <motion.button
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                onClick={() => {
                  onClear();
                  setLocalSearch('');
                  router.replace(pathname, { scroll: false });
                }}
                className="font-elite text-[10px] uppercase tracking-wider text-oxblood hover:text-ink transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass rounded whitespace-nowrap"
              >
                Clear filters
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
