'use client';

import { motion } from 'framer-motion';
import { UtensilsCrossed } from 'lucide-react';
import { VintageButton } from '@/components/ui/vintage-button';
import { OrnamentDivider } from '@/components/ui/ornament-divider';

interface EmptyStateProps {
  onClear: () => void;
}

export function EmptyState({ onClear }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center gap-6 py-20 text-center"
    >
      <div className="relative">
        <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-brass bg-cream shadow-vintage-card">
          <UtensilsCrossed className="h-10 w-10 text-sepia" strokeWidth={1} />
        </div>
        <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border border-brass/40 bg-parchment">
          <span className="font-elite text-[8px] uppercase tracking-wider text-sepia">
            Empty
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3">
        <h3 className="font-playfair text-2xl font-semibold text-ink">
          Nothing on the menu matches your taste... yet
        </h3>
        <p className="font-cormorant text-lg italic text-sepia max-w-md">
          Try adjusting your filters or clearing them to see the full bill of fare.
        </p>
      </div>

      <OrnamentDivider width="sm" />

      <VintageButton variant="outline" onClick={onClear}>
        Clear Filters
      </VintageButton>
    </motion.div>
  );
}
