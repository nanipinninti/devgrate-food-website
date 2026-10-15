'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { DishCard } from './dish-card';
import { MenuSkeleton } from './menu-skeleton';
import { EmptyState } from './empty-state';
import { OrnamentDivider } from '@/components/ui/ornament-divider';
import { menu, menuCategories, type MenuCategory, type MenuItem } from '@/data/menu';
import type { FilterState, SortOption } from './filter-bar';

interface MenuGridProps {
  filters: FilterState;
  onClear: () => void;
}

function sortItems(items: MenuItem[], sort: SortOption): MenuItem[] {
  const sorted = [...items];
  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'prep-time':
      return sorted.sort((a, b) => a.prepTime - b.prepTime);
    default:
      // Recommended: bestsellers first, then rating
      return sorted.sort((a, b) => {
        if (a.isBestseller !== b.isBestseller) return a.isBestseller ? -1 : 1;
        return b.rating - a.rating;
      });
  }
}

function filterItems(items: MenuItem[], filters: FilterState): MenuItem[] {
  return items.filter((item) => {
    if (filters.category !== 'All' && item.category !== filters.category) return false;
    if (filters.vegOnly && !item.isVeg) return false;
    if (filters.spiceLevels.length > 0 && !filters.spiceLevels.includes(item.spiceLevel))
      return false;
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      if (
        !item.name.toLowerCase().includes(q) &&
        !item.description.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });
}

export function MenuGrid({ filters, onClear }: MenuGridProps) {
  const prefersReduced = useReducedMotion();
  const [loading, setLoading] = useState(true);

  // Show skeleton briefly on first load and when filters change
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, [filters.category, filters.vegOnly, filters.sort, filters.spiceLevels.join(',')]);

  // Search has its own debounce, so trigger skeleton on search too
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, [filters.search]);

  const filtered = filterItems(menu, filters);
  const sorted = sortItems(filtered, filters.sort);

  // Determine if we should show grouped or flat
  const isGrouped =
    filters.category === 'All' &&
    !filters.search.trim() &&
    !filters.vegOnly &&
    filters.sort === 'recommended' &&
    filters.spiceLevels.length === 0;

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-8">
        <div className="mb-4 h-4 w-48 bg-sepia/10 rounded-sm" />
        <MenuSkeleton />
      </div>
    );
  }

  if (sorted.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-8">
        <EmptyState onClear={onClear} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-8">
      {/* Results count */}
      <p className="mb-6 font-elite text-xs uppercase tracking-wider text-sepia">
        Showing {sorted.length} of {menu.length} dishes
      </p>

      {isGrouped ? (
        <div className="space-y-16">
          {menuCategories.map((category: MenuCategory) => {
            const categoryItems = sorted.filter((item) => item.category === category);
            if (categoryItems.length === 0) return null;
            // Find the top bestseller in this category for Chef's Pick
            const chefPickId = categoryItems.find((i) => i.isBestseller)?.id;
            return (
              <div key={category}>
                <div className="mb-8 flex flex-col items-center gap-2">
                  <h3 className="font-playfair text-2xl md:text-3xl font-bold text-ink">
                    {category}
                  </h3>
                  <div className="flex items-center gap-3">
                    <OrnamentDivider width="sm" />
                    <span className="font-elite text-[10px] uppercase tracking-wider text-sepia">
                      {categoryItems.length} {categoryItems.length === 1 ? 'dish' : 'dishes'}
                    </span>
                    <OrnamentDivider width="sm" />
                  </div>
                </div>
                <motion.div
                  layout={!prefersReduced}
                  className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                >
                  <AnimatePresence mode="popLayout">
                    {categoryItems.map((item, i) => (
                      <motion.div
                        key={item.id}
                        layout={!prefersReduced}
                        initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3, delay: prefersReduced ? 0 : i * 0.05 }}
                      >
                        <DishCard
                          item={item}
                          index={i}
                          showChefPick={item.id === chefPickId}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </div>
            );
          })}
        </div>
      ) : (
        <motion.div
          layout={!prefersReduced}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {sorted.map((item, i) => (
              <motion.div
                key={item.id}
                layout={!prefersReduced}
                initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: prefersReduced ? 0 : i * 0.03 }}
              >
                <DishCard item={item} index={i} showChefPick={false} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
