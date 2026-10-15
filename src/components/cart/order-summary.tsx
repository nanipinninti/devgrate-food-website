'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { IndianRupee, Tag, Check, X, Truck } from 'lucide-react';
import { useCart } from '@/store/cart';
import { getAllCoupons, FREE_DELIVERY_THRESHOLD, calculatePricing, calculateDiscount, findCoupon } from '@/lib/pricing';
import { VintageButton } from '@/components/ui/vintage-button';
import { Stamp } from '@/components/ui/stamp';
import { cn } from '@/lib/utils';

interface OrderSummaryProps {
  onCheckout?: () => void;
  showCheckoutButton?: boolean;
}

export function OrderSummary({ onCheckout, showCheckoutButton = true }: OrderSummaryProps) {
  const items = useCart((s) => s.items);
  const appliedCoupon = useCart((s) => s.appliedCoupon);
  const applyCoupon = useCart((s) => s.applyCoupon);
  const removeCoupon = useCart((s) => s.removeCoupon);
  const coupons = getAllCoupons();
  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const pricing = calculatePricing(subtotal, appliedCoupon ? calculateDiscount(findCoupon(appliedCoupon)!, subtotal) : 0);
  const [couponInput, setCouponInput] = useState('');
  const [message, setMessage] = useState<{ text: string; success: boolean } | null>(null);
  const [shake, setShake] = useState(false);

  const handleApply = () => {
    const result = applyCoupon(couponInput);
    setMessage({ text: result.message, success: result.success });
    if (!result.success) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
    } else {
      setCouponInput('');
    }
  };

  return (
    <div className="bg-cream border border-brass/30 shadow-vintage-card p-6 space-y-4">
      <h3 className="font-playfair text-lg font-bold text-ink">Order Summary</h3>

      {/* Free delivery bar */}
      <div className="bg-parchment border border-brass/20 p-3">
        {pricing.freeDelivery ? (
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 font-elite text-[10px] uppercase tracking-wider text-forest">
              <Check className="h-3.5 w-3.5" strokeWidth={2} />
              Free delivery unlocked!
            </span>
            <Stamp label="FREE" size="sm" color="forest" className="w-10 h-10 text-[7px]" />
          </div>
        ) : (
          <>
            <p className="font-elite text-[10px] uppercase tracking-wider text-sepia mb-2 flex items-center gap-1">
              <Truck className="h-3 w-3" strokeWidth={1.5} />
              Add ₹{pricing.remainingForFree} more for free delivery
            </p>
            <div className="h-2 bg-brass/15 overflow-hidden">
              <div
                className="h-full bg-brass transition-all duration-500"
                style={{ width: `${Math.min(100, (pricing.subtotal / FREE_DELIVERY_THRESHOLD) * 100)}%` }}
              />
            </div>
          </>
        )}
      </div>

      {/* Coupon */}
      {appliedCoupon ? (
        <div className="flex items-center justify-between border border-forest/40 bg-forest/5 px-3 py-2">
          <div className="flex items-center gap-2">
            <Check className="h-3.5 w-3.5 text-forest" strokeWidth={2} />
            <span className="font-elite text-[10px] uppercase tracking-wider text-forest">
              {appliedCoupon}
            </span>
          </div>
          <button
            onClick={() => { removeCoupon(); setMessage(null); }}
            aria-label="Remove coupon"
            className="text-sepia hover:text-oxblood transition-colors"
          >
            <X className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
        </div>
      ) : (
        <div>
          <div className={cn('flex gap-2', shake && 'animate-[shake_0.4s]')}>
            <input
              type="text"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && handleApply()}
              placeholder="Coupon code"
              aria-label="Coupon code"
              className="flex-1 border border-brass/30 bg-parchment px-3 py-2 font-elite text-[11px] uppercase tracking-wider text-ink placeholder:text-sepia/50 focus:outline-none focus:border-brass"
            />
            <button
              onClick={handleApply}
              className="font-elite text-[10px] uppercase tracking-wider bg-oxblood text-cream px-4 py-2 border border-brass hover:bg-[#6B1A1A] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass"
            >
              Apply
            </button>
          </div>
          {message && (
            <p className={cn(
              'mt-2 font-elite text-[10px] tracking-wider',
              message.success ? 'text-forest' : 'text-oxblood'
            )}>
              {message.text}
            </p>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            {coupons.map((c) => (
              <button
                key={c.offer.couponCode}
                onClick={() => {
                  const result = applyCoupon(c.offer.couponCode);
                  setMessage({ text: result.message, success: result.success });
                }}
                className="border border-dashed border-brass/40 bg-parchment px-2.5 py-1 font-elite text-[9px] uppercase tracking-wider text-sepia hover:border-brass hover:text-ink transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass rounded"
              >
                <Tag className="inline h-2.5 w-2.5 mr-1" strokeWidth={1.5} />
                {c.offer.couponCode}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Pricing rows */}
      <div className="space-y-2 border-t border-brass/20 pt-3">
        <SummaryRow label="Subtotal" value={pricing.subtotal} />
        {pricing.discount > 0 && (
          <SummaryRow label="Discount" value={-pricing.discount} color="text-forest" />
        )}
        <SummaryRow
          label="Delivery Fee"
          value={pricing.deliveryFee}
          suffix={pricing.freeDelivery ? ' Free' : undefined}
        />
        <SummaryRow label="GST (5%)" value={pricing.gst} />
      </div>

      <div className="flex items-center justify-between border-t border-brass/20 pt-3">
        <span className="font-elite text-sm uppercase tracking-wider text-ink">Total</span>
        <span className="flex items-center font-elite text-2xl text-oxblood">
          <IndianRupee className="h-5 w-5" />
          {pricing.grandTotal}
        </span>
      </div>

      {showCheckoutButton && (
        <Link href="/checkout" className="block">
          <VintageButton size="lg" className="w-full">
            Proceed to Checkout
          </VintageButton>
        </Link>
      )}
    </div>
  );
}

function SummaryRow({
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
      <span className="font-elite text-[10px] uppercase tracking-wider text-sepia">{label}</span>
      <span className={cn('flex items-center font-elite text-xs', color)}>
        <IndianRupee className="h-3 w-3" />
        {value}
        {suffix && <span className="ml-1 text-forest">{suffix}</span>}
      </span>
    </div>
  );
}
