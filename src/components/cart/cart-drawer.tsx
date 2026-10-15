'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, IndianRupee, Plus, Minus, Trash2, Tag, Truck, Check } from 'lucide-react';
import { useCart, getItemKey, type CartItem } from '@/store/cart';
import { useUIStore } from '@/store/ui';
import { useToast } from '@/hooks/use-toast';
import { getAllCoupons, FREE_DELIVERY_THRESHOLD, calculatePricing, calculateDiscount, findCoupon } from '@/lib/pricing';
import { VintageButton } from '@/components/ui/vintage-button';
import { OrnamentDivider } from '@/components/ui/ornament-divider';
import { Stamp } from '@/components/ui/stamp';
import { ToastAction } from '@/components/ui/toast';
import { cn } from '@/lib/utils';

export function CartDrawer() {
  const isOpen = useUIStore((s) => s.isCartOpen);
  const closeCart = useUIStore((s) => s.closeCart);
  const items = useCart((s) => s.items);
  const hasHydrated = useCart((s) => s.hasHydrated);
  const removeItem = useCart((s) => s.removeItem);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const restoreItem = useCart((s) => s.restoreItem);
  const applyCoupon = useCart((s) => s.applyCoupon);
  const removeCoupon = useCart((s) => s.removeCoupon);
  const appliedCoupon = useCart((s) => s.appliedCoupon);
  const { toast } = useToast();
  const prefersReduced = useReducedMotion();

  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ text: string; success: boolean } | null>(null);
  const [shake, setShake] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const coupons = getAllCoupons();
  const pricing = calculatePricing(subtotal, appliedCoupon ? calculateDiscount(findCoupon(appliedCoupon)!, subtotal) : 0);

  // Body scroll lock + focus trap
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, closeCart]);

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

  const handleApplyCoupon = () => {
    const result = applyCoupon(couponInput);
    setCouponMessage({ text: result.message, success: result.success });
    if (!result.success) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
    } else {
      setCouponInput('');
    }
  };

  const handleChipClick = (code: string) => {
    const result = applyCoupon(code);
    setCouponMessage({ text: result.message, success: result.success });
    if (!result.success) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
    }
  };

  const freeDeliveryProgress = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);
  const freeDeliveryUnlocked = pricing.freeDelivery;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeCart}
            className="fixed inset-0 z-[90] bg-ink/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Your basket"
            initial={prefersReduced ? { opacity: 0 } : { x: '100%' }}
            animate={prefersReduced ? { opacity: 1 } : { x: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { x: '100%' }}
            transition={prefersReduced ? { duration: 0.2 } : { type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 bottom-0 z-[95] w-full sm:w-[420px] bg-cream flex flex-col shadow-vintage-lift"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-brass/30">
              <div className="flex items-baseline gap-2">
                <h2 className="font-playfair text-xl font-bold text-ink">Your Basket</h2>
                {hasHydrated && itemCount > 0 && (
                  <span className="font-elite text-[10px] uppercase tracking-wider text-sepia">
                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                aria-label="Close basket"
                className="text-ink hover:text-oxblood transition-colors p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-brass rounded"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>
            <div className="px-5 pb-2">
              <OrnamentDivider width="full" />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 py-3">
              {!hasHydrated ? (
                <div className="flex items-center justify-center py-20">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-brass border-t-transparent" />
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center gap-6 py-16 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-brass bg-parchment">
                    <Truck className="h-8 w-8 text-sepia" strokeWidth={1} />
                  </div>
                  <div>
                    <h3 className="font-playfair text-xl font-semibold text-ink">
                      Your basket is empty
                    </h3>
                    <p className="font-cormorant text-base italic text-sepia mt-1">
                      The hearth is warm and the kitchen is open.
                    </p>
                  </div>
                  <Link href="/menu" onClick={closeCart}>
                    <VintageButton variant="outline">Browse the Menu</VintageButton>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {/* Free delivery progress bar */}
                  <div className="bg-parchment border border-brass/30 p-3">
                    {freeDeliveryUnlocked ? (
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 font-elite text-[10px] uppercase tracking-wider text-forest">
                          <Check className="h-3.5 w-3.5" strokeWidth={2} />
                          Free delivery unlocked!
                        </span>
                        <Stamp label="FREE" size="sm" color="forest" className="w-12 h-12 text-[7px]" />
                      </div>
                    ) : (
                      <>
                        <p className="font-elite text-[10px] uppercase tracking-wider text-sepia mb-2">
                          Add ₹{pricing.remainingForFree} more for free delivery
                        </p>
                        <div className="h-2 bg-brass/15 overflow-hidden">
                          <motion.div
                            className={cn(
                              'h-full transition-colors',
                              freeDeliveryUnlocked ? 'bg-forest' : 'bg-brass'
                            )}
                            initial={{ width: 0 }}
                            animate={{ width: `${freeDeliveryProgress}%` }}
                            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Line items */}
                  <AnimatePresence initial={false}>
                    {items.map((item) => {
                      const key = getItemKey(item.id, item.selectedAddOns);
                      return (
                        <motion.div
                          key={key}
                          layout={!prefersReduced}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="flex gap-3 pb-3 border-b border-brass/15">
                            {/* Thumbnail */}
                            <div className="shrink-0 w-16 h-16 border border-brass/40 overflow-hidden">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-playfair text-sm font-semibold text-ink leading-tight truncate">
                                {item.name}
                              </h4>
                              {item.selectedAddOns.length > 0 && (
                                <p className="font-cormorant text-xs italic text-sepia mt-0.5">
                                  {item.selectedAddOns.map((a) => a.name).join(', ')}
                                </p>
                              )}

                              <div className="flex items-center justify-between mt-2">
                                {/* Quantity stepper */}
                                <div className="flex items-center border border-brass/30 bg-parchment">
                                  <button
                                    onClick={() => updateQuantity(key, item.quantity - 1)}
                                    aria-label="Decrease quantity"
                                    className="flex h-6 w-6 items-center justify-center text-ink hover:bg-brass/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass"
                                  >
                                    <Minus className="h-3 w-3" strokeWidth={1.5} />
                                  </button>
                                  <span className="flex h-6 w-7 items-center justify-center font-elite text-xs text-ink">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(key, item.quantity + 1)}
                                    aria-label="Increase quantity"
                                    className="flex h-6 w-6 items-center justify-center text-ink hover:bg-brass/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass"
                                  >
                                    <Plus className="h-3 w-3" strokeWidth={1.5} />
                                  </button>
                                </div>

                                <div className="flex items-center gap-3">
                                  <span className="flex items-center font-elite text-sm text-oxblood">
                                    <IndianRupee className="h-3 w-3" />
                                    {item.unitPrice * item.quantity}
                                  </span>
                                  <button
                                    onClick={() => handleRemove(item)}
                                    aria-label={`Remove ${item.name}`}
                                    className="text-sepia hover:text-oxblood transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass rounded p-0.5"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>

                  {/* Coupon section */}
                  <div className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="h-4 w-4 text-brass" strokeWidth={1.5} />
                      <span className="font-elite text-[10px] uppercase tracking-wider text-ink">
                        Apply Coupon
                      </span>
                    </div>

                    {appliedCoupon ? (
                      <div className="flex items-center justify-between border border-forest/40 bg-forest/5 px-3 py-2">
                        <div className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 text-forest" strokeWidth={2} />
                          <span className="font-elite text-[10px] uppercase tracking-wider text-forest">
                            {appliedCoupon}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            removeCoupon();
                            setCouponMessage(null);
                          }}
                          aria-label="Remove coupon"
                          className="text-sepia hover:text-oxblood transition-colors"
                        >
                          <X className="h-3.5 w-3.5" strokeWidth={1.5} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <motion.div
                          animate={shake ? { x: [0, -8, 8, -6, 6, 0] } : {}}
                          transition={{ duration: 0.4 }}
                          className="flex gap-2"
                        >
                          <input
                            type="text"
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                            onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                            placeholder="Enter code"
                            aria-label="Coupon code"
                            className="flex-1 border border-brass/30 bg-parchment px-3 py-2 font-elite text-[11px] uppercase tracking-wider text-ink placeholder:text-sepia/50 focus:outline-none focus:border-brass"
                          />
                          <button
                            onClick={handleApplyCoupon}
                            className="font-elite text-[10px] uppercase tracking-wider bg-oxblood text-cream px-4 py-2 border border-brass hover:bg-[#6B1A1A] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass"
                          >
                            Apply
                          </button>
                        </motion.div>

                        {couponMessage && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                              'mt-2 font-elite text-[10px] tracking-wider',
                              couponMessage.success ? 'text-forest' : 'text-oxblood'
                            )}
                          >
                            {couponMessage.text}
                          </motion.p>
                        )}

                        {/* Coupon chips */}
                        <div className="flex flex-wrap gap-2 mt-3">
                          {coupons.map((c) => (
                            <button
                              key={c.offer.couponCode}
                              onClick={() => handleChipClick(c.offer.couponCode)}
                              className="border border-dashed border-brass/40 bg-parchment px-2.5 py-1 font-elite text-[9px] uppercase tracking-wider text-sepia hover:border-brass hover:text-ink transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass rounded"
                            >
                              {c.offer.couponCode}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {hasHydrated && items.length > 0 && (
              <div className="border-t-2 border-brass/30 px-5 py-4 bg-parchment/50 space-y-3">
                <PricingRow label="Subtotal" value={pricing.subtotal} />
                {pricing.discount > 0 && (
                  <PricingRow label="Discount" value={-pricing.discount} color="text-forest" />
                )}
                <PricingRow
                  label="Delivery"
                  value={pricing.deliveryFee}
                  suffix={pricing.freeDelivery ? ' (Free)' : undefined}
                />
                <PricingRow label="GST (5%)" value={pricing.gst} />
                <div className="flex items-center justify-between border-t border-brass/20 pt-2">
                  <span className="font-elite text-xs uppercase tracking-wider text-ink">Total</span>
                  <AnimatedPrice value={pricing.grandTotal} />
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  <Link href="/checkout" onClick={closeCart}>
                    <VintageButton size="md" className="w-full">
                      Checkout
                    </VintageButton>
                  </Link>
                  <Link
                    href="/cart"
                    onClick={closeCart}
                    className="text-center font-elite text-[10px] uppercase tracking-wider text-sepia hover:text-oxblood transition-colors"
                  >
                    View full basket
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function PricingRow({
  label,
  value,
  suffix,
  color = 'text-sepia',
}: {
  label: string;
  value: number;
  suffix?: string;
  color?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-elite text-[10px] uppercase tracking-wider text-sepia">
        {label}
      </span>
      <span className={cn('flex items-center font-elite text-xs', color)}>
        <IndianRupee className="h-3 w-3" />
        {value}
        {suffix && <span className="ml-1 text-forest">{suffix}</span>}
      </span>
    </div>
  );
}

function AnimatedPrice({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) {
      setDisplay(value);
      return;
    }
    const start = display;
    const diff = value - start;
    if (diff === 0) return;
    let frame: number;
    const startTime = performance.now();
    const duration = 300;
    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + diff * eased));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <span className="flex items-center font-elite text-lg text-oxblood">
      <IndianRupee className="h-4 w-4" />
      {display}
    </span>
  );
}
