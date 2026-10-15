'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Flame } from 'lucide-react';
import type { MenuItem } from '@/data/menu';
import { site } from '@/data/site';
import { OrnamentDivider } from '@/components/ui/ornament-divider';
import { cn } from '@/lib/utils';

type TabKey = 'ingredients' | 'allergens' | 'delivery';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'ingredients', label: 'Ingredients' },
  { key: 'allergens', label: 'Allergens & Nutrition' },
  { key: 'delivery', label: 'Delivery Info' },
];

interface DishTabsProps {
  item: MenuItem;
}

export function DishTabs({ item }: DishTabsProps) {
  const [active, setActive] = useState<TabKey>('ingredients');

  return (
    <div>
      {/* Tab bar */}
      <div className="flex items-center gap-6 border-b border-brass/30">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={cn(
              'relative font-elite text-[11px] uppercase tracking-[0.15em] py-2 transition-colors',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-brass rounded px-1',
              active === tab.key ? 'text-oxblood' : 'text-sepia hover:text-ink'
            )}
          >
            {tab.label}
            {active === tab.key && (
              <motion.span
                layoutId="dish-tab-underline"
                className="absolute left-0 right-0 -bottom-px h-0.5 bg-brass"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="py-6 min-h-[180px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {active === 'ingredients' && (
              <div className="flex flex-wrap gap-2">
                {item.ingredients?.map((ing) => (
                  <span
                    key={ing}
                    className="font-elite text-[10px] uppercase tracking-wider text-ink border border-brass/30 bg-parchment px-3 py-1"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            )}

            {active === 'allergens' && (
              <div className="flex flex-col gap-6">
                <div>
                  <h4 className="font-elite text-[10px] uppercase tracking-[0.2em] text-sepia mb-3">
                    Contains
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {item.allergens?.map((allergen) => (
                      <div
                        key={allergen}
                        className="flex items-center gap-2 border-2 border-dashed border-oxblood/40 bg-oxblood/5 px-3 py-1.5"
                      >
                        <AlertTriangle
                          className="h-3.5 w-3.5 text-oxblood"
                          strokeWidth={1.5}
                        />
                        <span className="font-elite text-[10px] uppercase tracking-wider text-oxblood">
                          {allergen}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {item.calories && (
                  <div>
                    <h4 className="font-elite text-[10px] uppercase tracking-[0.2em] text-sepia mb-3">
                      Nutrition
                    </h4>
                    <div className="inline-flex items-center gap-4 border border-brass/30 bg-cream px-6 py-4">
                      <Flame className="h-8 w-8 text-brass" strokeWidth={1} />
                      <div>
                        <p className="font-playfair text-2xl font-bold text-ink">
                          {item.calories}
                          <span className="font-elite text-xs text-sepia ml-1">kcal</span>
                        </p>
                        <p className="font-elite text-[9px] uppercase tracking-wider text-sepia mt-0.5">
                          Per serving
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {active === 'delivery' && (
              <div className="flex flex-col gap-6">
                <div>
                  <h4 className="font-elite text-[10px] uppercase tracking-[0.2em] text-sepia mb-3">
                    We Deliver To
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {site.deliveryZones.map((zone) => (
                      <span
                        key={zone}
                        className="font-elite text-[10px] uppercase tracking-wider text-ink border border-brass/30 bg-parchment px-3 py-1"
                      >
                        {zone}
                      </span>
                    ))}
                  </div>
                </div>
                <OrnamentDivider width="sm" className="self-start" />
                <div>
                  <h4 className="font-elite text-[10px] uppercase tracking-[0.2em] text-sepia mb-3">
                    Opening Hours
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
                    {site.hours.map((entry) => (
                      <li
                        key={entry.day}
                        className="flex items-center justify-between font-elite text-[10px] uppercase tracking-wider text-ink"
                      >
                        <span className="text-sepia">{entry.day.slice(0, 3)}</span>
                        <span className="text-ink/80 normal-case tracking-normal font-lora text-xs">
                          {entry.time}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
