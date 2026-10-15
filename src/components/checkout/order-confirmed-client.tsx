'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { IndianRupee, MapPin, Wallet, Clock, Package } from 'lucide-react';
import { useOrderStore, type Order } from '@/store/order';
import { VintageButton } from '@/components/ui/vintage-button';
import { OrnamentDivider } from '@/components/ui/ornament-divider';
import { Stamp } from '@/components/ui/stamp';
import { cn } from '@/lib/utils';

export function OrderConfirmedClient() {
  const router = useRouter();
  const latestOrder = useOrderStore((s) => s.latestOrder);
  const hasHydrated = useOrderStore((s) => s.hasHydrated);
  const prefersReduced = useReducedMotion();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (hasHydrated && !latestOrder) {
      router.replace('/menu');
    }
  }, [hasHydrated, latestOrder, router]);

  useEffect(() => {
    if (!latestOrder || prefersReduced) return;
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, [latestOrder, prefersReduced]);

  if (!hasHydrated || !latestOrder) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brass border-t-transparent" />
      </div>
    );
  }

  const firstName = latestOrder.address.name.split(' ')[0];
  const deliveryDate = new Date(latestOrder.estimatedDelivery);
  const deliveryTimeStr = deliveryDate.toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const paymentLabel = {
    upi: 'UPI',
    card: 'Card',
    cod: 'Cash on Delivery',
  }[latestOrder.paymentMethod];

  return (
    <div className="relative mx-auto max-w-2xl px-4 md:px-8 py-12">
      {/* Confetti */}
      {showConfetti && !prefersReduced && <Confetti />}

      {/* Animated checkmark */}
      <div className="flex flex-col items-center gap-6">
        <motion.div
          initial={prefersReduced ? { opacity: 0 } : { scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={prefersReduced ? { duration: 0.2 } : { type: 'spring', stiffness: 200, damping: 15 }}
          className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-brass bg-cream shadow-vintage-card"
        >
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <motion.path
              d="M12 24l8 8 16-16"
              stroke="#2F4A3A"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
            />
          </svg>
        </motion.div>

        {/* Stamp */}
        <motion.div
          initial={prefersReduced ? { opacity: 0 } : { scale: 1.6, rotate: -15, opacity: 0 }}
          animate={{ scale: 1, rotate: -8, opacity: 1 }}
          transition={prefersReduced ? { duration: 0.2 } : { type: 'spring', stiffness: 200, damping: 12, delay: 0.6 }}
        >
          <Stamp label="ORDER" sublabel="RECEIVED" size="lg" color="oxblood" />
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.4 }}
          className="flex flex-col items-center gap-2 text-center"
        >
          <h1 className="font-playfair text-3xl md:text-4xl font-bold text-ink">
            Thank you, {firstName}!
          </h1>
          <p className="font-elite text-sm uppercase tracking-wider text-sepia">
            Order {latestOrder.id}
          </p>
          <div className="flex items-center gap-2 text-sepia mt-1">
            <Clock className="h-4 w-4 text-brass" strokeWidth={1.5} />
            <span className="font-elite text-[11px] uppercase tracking-wider">
              Estimated delivery by {deliveryTimeStr}
            </span>
          </div>
        </motion.div>

        <OrnamentDivider width="md" />
      </div>

      {/* Receipt */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.4 }}
        className="mt-8 relative bg-parchment paper-texture border-2 border-brass/40 shadow-vintage-card"
      >
        {/* Torn paper top edge */}
        <div className="absolute -top-2 left-0 right-0 flex justify-around" aria-hidden="true">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="w-3 h-3 bg-cream rounded-full" style={{ marginTop: '-4px' }} />
          ))}
        </div>

        <div className="p-6 md:p-8">
          <h2 className="font-playfair text-xl font-bold text-ink text-center mb-1">Receipt</h2>
          <p className="font-elite text-[10px] uppercase tracking-wider text-sepia text-center mb-4">
            {new Date(latestOrder.placedAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
          <OrnamentDivider width="sm" className="mx-auto mb-4" />

          {/* Items */}
          <div className="space-y-3 mb-4">
            {latestOrder.items.map((item) => (
              <div key={`${item.id}-${item.selectedAddOns.map(a => a.id).join(',')}`} className="border-b border-brass/10 pb-2">
                <div className="flex justify-between font-lora text-sm text-ink">
                  <span>{item.quantity}× {item.name}</span>
                  <span className="flex items-center font-elite text-xs text-oxblood">
                    <IndianRupee className="h-3 w-3" />
                    {item.unitPrice * item.quantity}
                  </span>
                </div>
                {item.selectedAddOns.length > 0 && (
                  <p className="font-cormorant text-xs italic text-sepia mt-0.5 ml-4">
                    + {item.selectedAddOns.map((a) => a.name).join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Pricing */}
          <div className="space-y-1.5 mb-4">
            <ReceiptRow label="Subtotal" value={latestOrder.pricing.subtotal} />
            {latestOrder.pricing.discount > 0 && (
              <ReceiptRow label="Discount" value={-latestOrder.pricing.discount} color="text-forest" />
            )}
            <ReceiptRow
              label="Delivery"
              value={latestOrder.pricing.deliveryFee}
              suffix={latestOrder.pricing.freeDelivery ? ' Free' : undefined}
            />
            <ReceiptRow label="GST (5%)" value={latestOrder.pricing.gst} />
          </div>
          <div className="flex items-center justify-between border-t-2 border-brass/30 pt-3">
            <span className="font-elite text-sm uppercase tracking-wider text-ink">Total Paid</span>
            <span className="flex items-center font-elite text-xl text-oxblood">
              <IndianRupee className="h-4 w-4" />
              {latestOrder.pricing.grandTotal}
            </span>
          </div>

          {latestOrder.specialInstructions && (
            <div className="mt-4 bg-cream border border-brass/20 p-3">
              <span className="font-elite text-[9px] uppercase tracking-wider text-sepia block mb-1">
                Special Instructions
              </span>
              <p className="font-cormorant text-sm italic text-ink/80">
                {latestOrder.specialInstructions}
              </p>
            </div>
          )}

          {/* Address + Payment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="bg-cream border border-brass/20 p-3">
              <span className="flex items-center gap-1.5 font-elite text-[9px] uppercase tracking-wider text-sepia block mb-1">
                <MapPin className="h-3 w-3 text-brass" strokeWidth={1.5} />
                Deliver To
              </span>
              <p className="font-lora text-xs text-ink/80 leading-relaxed">
                {latestOrder.address.name}<br />
                {latestOrder.address.addressLine}<br />
                {latestOrder.address.landmark && `${latestOrder.address.landmark}, `}
                {latestOrder.address.city} — {latestOrder.address.pincode}<br />
                {latestOrder.address.phone}
              </p>
            </div>
            <div className="bg-cream border border-brass/20 p-3">
              <span className="flex items-center gap-1.5 font-elite text-[9px] uppercase tracking-wider text-sepia block mb-1">
                <Wallet className="h-3 w-3 text-brass" strokeWidth={1.5} />
                Payment
              </span>
              <p className="font-lora text-xs text-ink/80">{paymentLabel}</p>
            </div>
          </div>
        </div>

        {/* Torn paper bottom edge */}
        <div className="absolute -bottom-2 left-0 right-0 flex justify-around" aria-hidden="true">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="w-3 h-3 bg-cream rounded-full" style={{ marginBottom: '-4px' }} />
          ))}
        </div>
      </motion.div>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.4 }}
        className="flex flex-col sm:flex-row gap-3 justify-center mt-8"
      >
        <Link href="/track-order">
          <VintageButton size="lg">
            <Package className="inline h-4 w-4 mr-2" strokeWidth={1.5} />
            Track Your Order
          </VintageButton>
        </Link>
        <Link href="/menu">
          <VintageButton variant="outline" size="lg">
            Back to Menu
          </VintageButton>
        </Link>
      </motion.div>
    </div>
  );
}

function ReceiptRow({
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

function Confetti() {
  const pieces = Array.from({ length: 24 });
  const shapes = ['diamond', 'star'] as const;
  const colors = ['#B08A3E', '#7A1F1F', '#B08A3E', '#B08A3E', '#7A1F1F'];

  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
      {pieces.map((_, i) => {
        const shape = shapes[i % 2];
        const color = colors[i % colors.length];
        const left = Math.random() * 100;
        const delay = Math.random() * 0.5;
        const duration = 2 + Math.random() * 1;
        const size = 8 + Math.random() * 8;

        return (
          <motion.div
            key={i}
            initial={{ y: -50, x: 0, opacity: 1, rotate: 0 }}
            animate={{ y: '110vh', x: (Math.random() - 0.5) * 200, opacity: [1, 1, 0], rotate: Math.random() * 360 }}
            transition={{ duration, delay, ease: 'easeIn' }}
            style={{ left: `${left}%`, position: 'absolute' }}
          >
            {shape === 'diamond' ? (
              <div style={{ width: size, height: size, background: color, transform: 'rotate(45deg)' }} />
            ) : (
              <svg width={size} height={size} viewBox="0 0 16 16" fill={color}>
                <path d="M8 1L9.5 5.5L14 7L9.5 8.5L8 13L6.5 8.5L2 7L6.5 5.5L8 1Z" />
              </svg>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
