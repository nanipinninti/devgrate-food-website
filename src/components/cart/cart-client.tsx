'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { IndianRupee, Plus, Minus, Trash2, Truck, Bookmark, ArrowLeft } from 'lucide-react';
import { useCart, getItemKey, type CartItem } from '@/store/cart';
import { menu } from '@/data/menu';
import { useToast } from '@/hooks/use-toast';
import { VintageButton } from '@/components/ui/vintage-button';
import { OrnamentDivider } from '@/components/ui/ornament-divider';
import { SectionHeading } from '@/components/ui/section-heading';
import { ToastAction } from '@/components/ui/toast';
import { OrderSummary } from '@/components/cart/order-summary';
import { cn } from '@/lib/utils';

export default function CartClient() {
  const items = useCart((s) => s.items);
  const hasHydrated = useCart((s) => s.hasHydrated);
  const removeItem = useCart((s) => s.removeItem);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const restoreItem = useCart((s) => s.restoreItem);
  const specialInstructions = useCart((s) => s.specialInstructions);
  const setSpecialInstructions = useCart((s) => s.setSpecialInstructions);
  const addItem = useCart((s) => s.addItem);
  const { toast } = useToast();
  const [savedItems, setSavedItems] = useState<CartItem[]>([]);

  const handleRemove = (item: CartItem) => {
    const key = getItemKey(item.id, item.selectedAddOns);
    removeItem(key);
    toast({
      title: 'Removed from basket',
      description: item.name,
      action: (
        <ToastAction
          altText="Undo removal"
          onClick={() => restoreItem(item)}
          className="border-brass text-oxblood hover:bg-brass/10"
        >
          Undo
        </ToastAction>
      ),
    });
  };

  const handleSaveForLater = (item: CartItem) => {
    const key = getItemKey(item.id, item.selectedAddOns);
    removeItem(key);
    setSavedItems((prev) => [...prev, item]);
    toast({ title: 'Saved for later', description: item.name });
  };

  const handleMoveToBasket = (item: CartItem) => {
    setSavedItems((prev) => prev.filter((i) => getItemKey(i.id, i.selectedAddOns) !== getItemKey(item.id, item.selectedAddOns)));
    restoreItem(item);
    toast({ title: 'Moved to basket', description: item.name });
  };

  // Suggested dishes from categories not in cart
  const cartCategories = new Set(items.map((i) => i.category));
  const suggestions = menu
    .filter((m) => !cartCategories.has(m.category))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  if (!hasHydrated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brass border-t-transparent" />
      </div>
    );
  }

  if (items.length === 0 && savedItems.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-12">
        <div className="flex flex-col items-center gap-6 py-20 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-brass bg-parchment">
            <Truck className="h-10 w-10 text-sepia" strokeWidth={1} />
          </div>
          <div>
            <h2 className="font-playfair text-2xl font-bold text-ink">Your basket is empty</h2>
            <p className="font-cormorant text-lg italic text-sepia mt-2">
              The hearth is warm and the kitchen is open.
            </p>
          </div>
          <OrnamentDivider width="sm" />
          <Link href="/menu">
            <VintageButton>Browse the Menu</VintageButton>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sepia">
          <li>
            <Link href="/" className="font-elite text-[10px] uppercase tracking-wider hover:text-oxblood transition-colors">
              Home
            </Link>
          </li>
          <li className="text-brass">/</li>
          <li className="font-elite text-[10px] uppercase tracking-wider text-ink">Basket</li>
        </ol>
      </nav>

      <SectionHeading eyebrow="Review Your Order" title="Your Basket" />

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        {/* Left: items */}
        <div className="flex flex-col gap-6">
          {items.length > 0 && (
            <AnimatePresence initial={false}>
              {items.map((item, i) => {
                const key = getItemKey(item.id, item.selectedAddOns);
                return (
                  <motion.div
                    key={key}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="overflow-hidden"
                  >
                    <div className="flex gap-4 bg-cream border border-brass/30 shadow-vintage-card p-4">
                      {/* Image */}
                      <div className="shrink-0 w-28 h-28 border border-brass/40 overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-playfair text-lg font-semibold text-ink">{item.name}</h3>
                        <p className="font-elite text-[10px] uppercase tracking-wider text-sepia mt-0.5">
                          {item.category}
                        </p>
                        {item.selectedAddOns.length > 0 && (
                          <p className="font-cormorant text-sm italic text-sepia mt-1">
                            Add-ons: {item.selectedAddOns.map((a) => a.name).join(', ')}
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border-2 border-brass/30 bg-parchment">
                            <button
                              onClick={() => updateQuantity(key, item.quantity - 1)}
                              aria-label="Decrease quantity"
                              className="flex h-8 w-8 items-center justify-center text-ink hover:bg-brass/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass"
                            >
                              <Minus className="h-4 w-4" strokeWidth={1.5} />
                            </button>
                            <span className="flex h-8 w-10 items-center justify-center font-elite text-sm text-ink">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(key, item.quantity + 1)}
                              aria-label="Increase quantity"
                              className="flex h-8 w-8 items-center justify-center text-ink hover:bg-brass/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass"
                            >
                              <Plus className="h-4 w-4" strokeWidth={1.5} />
                            </button>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="flex items-center font-elite text-lg text-oxblood">
                              <IndianRupee className="h-4 w-4" />
                              {item.unitPrice * item.quantity}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mt-2">
                          <button
                            onClick={() => handleSaveForLater(item)}
                            className="flex items-center gap-1 font-elite text-[10px] uppercase tracking-wider text-sepia hover:text-oxblood transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass rounded"
                          >
                            <Bookmark className="h-3 w-3" strokeWidth={1.5} />
                            Save for later
                          </button>
                          <button
                            onClick={() => handleRemove(item)}
                            className="flex items-center gap-1 font-elite text-[10px] uppercase tracking-wider text-sepia hover:text-oxblood transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass rounded"
                          >
                            <Trash2 className="h-3 w-3" strokeWidth={1.5} />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}

          {/* Special instructions */}
          {items.length > 0 && (
            <div className="bg-parchment border border-brass/30 p-4">
              <label htmlFor="instructions" className="font-elite text-[10px] uppercase tracking-wider text-ink block mb-2">
                Special Instructions
              </label>
              <textarea
                id="instructions"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Less spicy, no onions, extra napkins..."
                rows={2}
                className="w-full bg-cream border border-brass/30 px-3 py-2 font-lora text-sm text-ink placeholder:text-sepia/50 focus:outline-none focus:border-brass resize-none"
              />
            </div>
          )}

          {/* Complete your meal */}
          {items.length > 0 && suggestions.length > 0 && (
            <div>
              <h3 className="font-playfair text-lg font-semibold text-ink mb-3">Complete your meal</h3>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {suggestions.map((dish) => (
                  <div
                    key={dish.id}
                    className="shrink-0 w-56 bg-cream border border-brass/30 shadow-vintage-card p-3 flex gap-3"
                  >
                    <div className="shrink-0 w-16 h-16 border border-brass/40 overflow-hidden">
                      <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="font-playfair text-sm font-semibold text-ink leading-tight truncate">{dish.name}</h4>
                        <span className="flex items-center font-elite text-sm text-oxblood">
                          <IndianRupee className="h-3 w-3" />
                          {dish.price}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          addItem(dish);
                          toast({ title: 'Added to cart', description: dish.name });
                        }}
                        className="flex items-center gap-1 self-start font-elite text-[9px] uppercase tracking-wider bg-oxblood text-cream px-2 py-1 border border-brass hover:bg-[#6B1A1A] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass"
                      >
                        <Plus className="h-3 w-3" /> Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Saved for later */}
          {savedItems.length > 0 && (
            <div className="mt-6 border-t border-brass/20 pt-6">
              <h3 className="font-elite text-[11px] uppercase tracking-[0.2em] text-sepia mb-4">
                Saved for Later ({savedItems.length})
              </h3>
              <div className="space-y-3">
                {savedItems.map((item) => {
                  const key = getItemKey(item.id, item.selectedAddOns);
                  return (
                    <div key={key} className="flex items-center gap-3 bg-parchment border border-brass/20 p-3">
                      <div className="shrink-0 w-12 h-12 border border-brass/30 overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-playfair text-sm font-semibold text-ink truncate">{item.name}</h4>
                        <span className="flex items-center font-elite text-xs text-oxblood">
                          <IndianRupee className="h-3 w-3" />
                          {item.unitPrice * item.quantity}
                        </span>
                      </div>
                      <button
                        onClick={() => handleMoveToBasket(item)}
                        className="font-elite text-[9px] uppercase tracking-wider text-oxblood hover:text-ink transition-colors border border-brass/30 px-2 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-brass rounded"
                      >
                        <ArrowLeft className="inline h-3 w-3 mr-1" />
                        Move to basket
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right: sticky summary */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}
