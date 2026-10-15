'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IndianRupee, Plus } from 'lucide-react';
import type { MenuItem } from '@/data/menu';
import { VintageButton } from '@/components/ui/vintage-button';

interface StickyAddBarProps {
  item: MenuItem;
  total: number;
  onAdd: () => void;
  addToCartRef: React.RefObject<HTMLDivElement | null>;
}

export function StickyAddBar({ item, total, onAdd, addToCartRef }: StickyAddBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = addToCartRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [addToCartRef]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-cream/95 backdrop-blur-md border-t-2 border-brass shadow-vintage-lift lg:hidden"
        >
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="flex flex-col min-w-0">
              <span className="font-playfair text-sm font-semibold text-ink truncate">
                {item.name}
              </span>
              <span className="flex items-center font-elite text-base text-oxblood">
                <IndianRupee className="h-3.5 w-3.5" />
                {total}
              </span>
            </div>
            <VintageButton size="md" onClick={onAdd} className="shrink-0">
              <span className="flex items-center gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                Add to Cart
              </span>
            </VintageButton>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
