'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Clock, IndianRupee, Plus, Flame } from 'lucide-react';
import type { MenuItem } from '@/data/menu';
import { useCart } from '@/store/cart';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface DishCardProps {
  item: MenuItem;
  index?: number;
  showChefPick?: boolean;
}

export function DishCard({ item, index = 0, showChefPick = false }: DishCardProps) {
  const router = useRouter();
  const addItem = useCart((s) => s.addItem);
  const { toast } = useToast();
  const [floatPlus, setFloatPlus] = useState(false);

  const spiceLabels = ['Mild', 'Medium', 'Fiery'];

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(item);
    setFloatPlus(true);
    setTimeout(() => setFloatPlus(false), 1000);
    toast({
      title: 'Added to cart',
      description: `${item.name} — ₹${item.price}`,
    });
  };

  const handleCardClick = () => {
    router.push(`/menu/${item.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4, rotate: -0.5 }}
      onClick={handleCardClick}
      className="group relative cursor-pointer bg-cream border border-brass/30 shadow-vintage-card hover:shadow-vintage-lift transition-shadow duration-300 rounded-sm overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-brass"
      role="article"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover sepia-[0.3] group-hover:sepia-0 group-hover:scale-105 transition-all duration-500"
        />
        {/* Veg/non-veg indicator */}
        <div
          className={cn(
            'absolute top-3 left-3 flex h-5 w-5 items-center justify-center border-2 bg-cream/90',
            item.isVeg ? 'border-forest' : 'border-oxblood'
          )}
        >
          {item.isVeg ? (
            <div className="h-2 w-2 rounded-full bg-forest" />
          ) : (
            <div className="h-2 w-2 rounded-full bg-oxblood" />
          )}
        </div>
        {/* Bestseller badge */}
        {item.isBestseller && (
          <div className="absolute top-3 right-3 bg-oxblood/90 px-2 py-0.5">
            <span className="font-elite text-[8px] uppercase tracking-wider text-cream">
              Bestseller
            </span>
          </div>
        )}

        {/* Chef's Pick ribbon */}
        {showChefPick && item.isBestseller && (
          <div className="absolute top-12 right-0 bg-brass px-2 py-1 shadow-sm">
            <span className="font-elite text-[8px] uppercase tracking-wider text-ink">
              Chef's Pick
            </span>
          </div>
        )}

        {/* Spicy label for spiceLevel 3 */}
        {item.spiceLevel === 3 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-0.5 bg-oxblood/90 px-2 py-0.5">
            <Flame className="h-2.5 w-2.5 text-cream" strokeWidth={2} />
            <span className="font-elite text-[7px] uppercase tracking-wider text-cream">
              Spicy
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-playfair text-lg font-semibold text-ink leading-tight">
            {item.name}
          </h3>
          <div className="flex items-center gap-0.5 shrink-0 mt-1">
            <Star className="h-3 w-3 fill-brass text-brass" />
            <span className="font-elite text-xs text-sepia">{item.rating}</span>
          </div>
        </div>

        <p className="font-lora text-sm text-sepia mt-1 line-clamp-2 leading-snug">
          {item.description}
        </p>

        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center gap-1 text-sepia">
            <Clock className="h-3 w-3" strokeWidth={1.5} />
            <span className="font-elite text-[10px] uppercase tracking-wider">
              {item.prepTime} min
            </span>
          </div>
          <div className="flex items-center gap-1 text-sepia">
            <Flame className="h-3 w-3" strokeWidth={1.5} />
            <span className="font-elite text-[10px] uppercase tracking-wider">
              {spiceLabels[item.spiceLevel - 1]}
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center font-elite text-lg text-oxblood">
            <IndianRupee className="h-4 w-4" />
            {item.price}
          </div>
          <button
            onClick={handleAdd}
            aria-label={`Add ${item.name} to cart`}
            className="relative flex items-center gap-1 bg-oxblood text-cream px-3 py-1.5 font-elite text-[10px] uppercase tracking-wider border border-brass hover:bg-[#6B1A1A] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass"
          >
            <Plus className="h-3 w-3" />
            Add
          </button>
        </div>
      </div>

      {/* Floating +1 animation */}
      <AnimatePresence>
        {floatPlus && (
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -40 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="pointer-events-none absolute right-12 bottom-20 font-elite text-lg text-forest z-10"
          >
            +1
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
