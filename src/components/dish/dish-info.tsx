'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Star, Clock, IndianRupee, Plus, Minus, Check, Flame, Users, ChefHat, Truck } from 'lucide-react';
import type { MenuItem, AddOn } from '@/data/menu';
import { useCart } from '@/store/cart';
import { useToast } from '@/hooks/use-toast';
import { VintageButton } from '@/components/ui/vintage-button';
import { OrnamentDivider } from '@/components/ui/ornament-divider';
import { cn } from '@/lib/utils';

interface DishInfoProps {
  item: MenuItem;
  addToCartRef?: React.RefObject<HTMLDivElement | null>;
  onTotalChange?: (total: number) => void;
}

const spiceLabels = ['Mild', 'Medium', 'Fiery'];

export function DishInfo({ item, addToCartRef, onTotalChange }: DishInfoProps) {
  const router = useRouter();
  const addItem = useCart((s) => s.addItem);
  const { toast } = useToast();
  const prefersReduced = useReducedMotion();
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);
  const [added, setAdded] = useState(false);
  const [displayTotal, setDisplayTotal] = useState(item.price);

  const addOnTotal = useMemo(
    () => selectedAddOns.reduce((sum, a) => sum + a.price, 0),
    [selectedAddOns]
  );

  const unitPrice = item.price + addOnTotal;
  const total = unitPrice * quantity;

  // Animated total count
  useEffect(() => {
    if (prefersReduced) {
      setDisplayTotal(total);
      return;
    }
    const diff = total - displayTotal;
    if (diff === 0) return;
    let frame: number;
    const start = displayTotal;
    const startTime = performance.now();
    const duration = 300;
    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayTotal(Math.round(start + diff * eased));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  useEffect(() => {
    onTotalChange?.(total);
  }, [total, onTotalChange]);

  const toggleAddOn = (addOn: AddOn) => {
    setSelectedAddOns((prev) =>
      prev.find((a) => a.id === addOn.id)
        ? prev.filter((a) => a.id !== addOn.id)
        : [...prev, addOn]
    );
  };

  const handleAddToCart = () => {
    addItem(item, quantity, selectedAddOns);
    setAdded(true);
    toast({
      title: 'Added to cart',
      description: `${quantity} × ${item.name}${selectedAddOns.length > 0 ? ` + ${selectedAddOns.length} add-on${selectedAddOns.length > 1 ? 's' : ''}` : ''} — ₹${total}`,
    });
    setTimeout(() => setAdded(false), 2000);
  };

  const handleOrderNow = () => {
    addItem(item, quantity, selectedAddOns);
    toast({
      title: 'Added to cart',
      description: `${item.name} — proceeding to cart`,
    });
    router.push('/cart');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <p className="font-elite text-[10px] uppercase tracking-[0.2em] text-sepia">
          {item.category}
        </p>
        <h1 className="font-playfair text-3xl md:text-4xl font-bold text-ink leading-tight mt-1">
          {item.name}
        </h1>
      </div>

      {/* Rating + quick info */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                'h-4 w-4',
                i < Math.floor(item.rating) ? 'fill-brass text-brass' : 'text-brass/30'
              )}
              strokeWidth={1.5}
            />
          ))}
          <span className="font-elite text-sm text-ink ml-1">{item.rating}</span>
          <span className="font-elite text-[10px] uppercase tracking-wider text-sepia ml-2">
            (124 reviews)
          </span>
        </div>
        <div className="flex items-center gap-1 text-sepia">
          <Clock className="h-4 w-4 text-brass" strokeWidth={1.5} />
          <span className="font-elite text-[10px] uppercase tracking-wider">
            {item.prepTime} min
          </span>
        </div>
        <div className="flex items-center gap-1 text-sepia">
          {Array.from({ length: 3 }).map((_, i) => (
            <svg
              key={i}
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill={i < item.spiceLevel ? '#7A1F1F' : '#B08A3E'}
              opacity={i < item.spiceLevel ? 1 : 0.3}
            >
              <path d="M12 2c0 4-4 6-4 10a4 4 0 008 0c0-4-4-6-4-10z" />
            </svg>
          ))}
          <span className="font-elite text-[10px] uppercase tracking-wider ml-1">
            {spiceLabels[item.spiceLevel - 1]}
          </span>
        </div>
        {item.serves && (
          <div className="flex items-center gap-1 text-sepia">
            <Users className="h-4 w-4 text-brass" strokeWidth={1.5} />
            <span className="font-elite text-[10px] uppercase tracking-wider">
              {item.serves}
            </span>
          </div>
        )}
      </div>

      <OrnamentDivider width="sm" className="self-start" />

      {/* Description */}
      <p className="font-lora text-base text-ink/80 leading-relaxed">
        {item.description}
      </p>

      {/* From Our Kitchen note */}
      {item.story && (
        <div className="border-l-2 border-brass pl-4 py-1">
          <p className="font-elite text-[10px] uppercase tracking-[0.2em] text-brass mb-1">
            From Our Kitchen
          </p>
          <p className="font-cormorant text-lg italic text-sepia leading-relaxed">
            {item.story}
          </p>
        </div>
      )}

      {/* Add-ons */}
      {item.addOns && item.addOns.length > 0 && (
        <div>
          <h3 className="font-elite text-[11px] uppercase tracking-[0.2em] text-ink mb-3">
            Add Ons
          </h3>
          <div className="space-y-2">
            {item.addOns.map((addOn) => {
              const isChecked = selectedAddOns.some((a) => a.id === addOn.id);
              return (
                <button
                  key={addOn.id}
                  onClick={() => toggleAddOn(addOn)}
                  className={cn(
                    'flex w-full items-center justify-between px-3 py-2 border transition-colors',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-brass',
                    isChecked
                      ? 'border-brass bg-cream'
                      : 'border-brass/20 bg-parchment hover:border-brass/40'
                  )}
                >
                  <div className="flex items-center gap-3">
                    {/* Custom checkbox */}
                    <div
                      className={cn(
                        'flex h-5 w-5 items-center justify-center border-2 transition-colors',
                        isChecked ? 'border-brass bg-brass' : 'border-brass/40'
                      )}
                    >
                      <AnimatePresence>
                        {isChecked && (
                          <motion.div
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                          >
                            <Check className="h-3 w-3 text-cream" strokeWidth={3} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <span className="font-lora text-sm text-ink">{addOn.name}</span>
                  </div>
                  <span className="flex items-center font-elite text-sm text-oxblood">
                    <IndianRupee className="h-3 w-3" />
                    {addOn.price}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity + Price + Add to Cart */}
      <div ref={addToCartRef as React.RefObject<HTMLDivElement>} className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          {/* Quantity selector */}
          <div className="flex items-center gap-3">
            <span className="font-elite text-[10px] uppercase tracking-wider text-sepia">
              Quantity
            </span>
            <div className="flex items-center border-2 border-brass/40 bg-parchment">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
                className="flex h-8 w-8 items-center justify-center text-ink hover:bg-brass/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-brass"
              >
                <Minus className="h-4 w-4" strokeWidth={1.5} />
              </button>
              <AnimatePresence mode="wait">
                <motion.span
                  key={quantity}
                  initial={prefersReduced ? {} : { y: -15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={prefersReduced ? {} : { y: 15, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex h-8 w-10 items-center justify-center font-elite text-sm text-ink"
                >
                  {quantity}
                </motion.span>
              </AnimatePresence>
              <button
                onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                disabled={quantity >= 10}
                aria-label="Increase quantity"
                className="flex h-8 w-8 items-center justify-center text-ink hover:bg-brass/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-brass"
              >
                <Plus className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* Live total */}
          <div className="flex flex-col items-end">
            <span className="font-elite text-[10px] uppercase tracking-wider text-sepia">
              Total
            </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={displayTotal}
                initial={prefersReduced ? {} : { y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={prefersReduced ? {} : { y: 8, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center font-elite text-2xl text-oxblood"
              >
                <IndianRupee className="h-5 w-5" />
                {displayTotal}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <VintageButton
            size="lg"
            onClick={handleAddToCart}
            className="flex-1"
          >
            {added ? (
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4" strokeWidth={2} />
                Added!
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add to Cart
              </span>
            )}
          </VintageButton>
          <VintageButton
            variant="outline"
            size="lg"
            onClick={handleOrderNow}
            className="flex-1"
          >
            Order Now
          </VintageButton>
        </div>
      </div>

      {/* Trust notes */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2">
        {[
          { icon: ChefHat, label: 'Cooked to order' },
          { icon: Flame, label: 'Delivered hot' },
          { icon: Truck, label: 'Free delivery over ₹499' },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2 text-sepia">
            <Icon className="h-3.5 w-3.5 text-brass" strokeWidth={1.5} />
            <span className="font-elite text-[9px] uppercase tracking-wider">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
