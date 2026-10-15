'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, IndianRupee } from 'lucide-react';
import { useCart } from '@/store/cart';
import { useUIStore } from '@/store/ui';

export function FloatingCartPill() {
  const itemCount = useCart((s) => s.getItemCount());
  const total = useCart((s) => s.getTotal());
  const openCart = useUIStore((s) => s.openCart);

  return (
    <AnimatePresence>
      {itemCount > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 lg:hidden"
        >
          <button
            onClick={openCart}
            aria-label={`View cart: ${itemCount} items, total ₹${total}`}
            className="flex items-center gap-3 bg-oxblood text-cream border border-brass shadow-vintage-lift rounded-full px-5 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-brass"
          >
            <div className="relative">
              <ShoppingBag className="h-5 w-5 text-cream" strokeWidth={1.5} />
              <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-brass text-ink font-elite text-[9px] leading-none">
                {itemCount}
              </span>
            </div>
            <span className="font-elite text-xs uppercase tracking-wider">
              View Cart
            </span>
            <span className="flex items-center font-elite text-sm">
              <IndianRupee className="h-3 w-3" />
              {total}
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
