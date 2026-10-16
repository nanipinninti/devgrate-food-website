'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { IndianRupee, MapPin, Wallet, ChevronDown } from 'lucide-react';
import { OrnamentDivider } from '@/components/ui/ornament-divider';
import { cn } from '@/lib/utils';
import type { Order } from '@/store/order';

interface OrderDetailsProps {
  order: Order;
}

export function OrderDetails({ order }: OrderDetailsProps) {
  const prefersReduced = useReducedMotion();
  const [expanded, setExpanded] = useState(false);

  const paymentLabel = {
    upi: 'UPI',
    card: 'Card',
    cod: 'Cash on Delivery',
  }[order.paymentMethod];

  const Receipt = () => (
    <div className="p-5 md:p-6">
      <h3 className="font-playfair text-lg font-bold text-ink text-center mb-1">Receipt</h3>
      <p className="font-elite text-[10px] uppercase tracking-wider text-sepia text-center mb-3">
        {new Date(order.placedAt).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </p>
      <OrnamentDivider width="sm" className="mx-auto mb-4" />

      {/* Items */}
      <div className="space-y-2.5 mb-4">
        {order.items.map((item) => (
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
        <ReceiptRow label="Subtotal" value={order.pricing.subtotal} />
        {order.pricing.discount > 0 && (
          <ReceiptRow label="Discount" value={-order.pricing.discount} color="text-forest" />
        )}
        <ReceiptRow
          label="Delivery"
          value={order.pricing.deliveryFee}
          suffix={order.pricing.freeDelivery ? ' Free' : undefined}
        />
        <ReceiptRow label="GST (5%)" value={order.pricing.gst} />
      </div>
      <div className="flex items-center justify-between border-t-2 border-brass/30 pt-3">
        <span className="font-elite text-sm uppercase tracking-wider text-ink">Total</span>
        <span className="flex items-center font-elite text-lg text-oxblood">
          <IndianRupee className="h-4 w-4" />
          {order.pricing.grandTotal}
        </span>
      </div>

      {order.specialInstructions && (
        <div className="mt-4 bg-cream border border-brass/20 p-3">
          <span className="font-elite text-[9px] uppercase tracking-wider text-sepia block mb-1">
            Special Instructions
          </span>
          <p className="font-cormorant text-sm italic text-ink/80">{order.specialInstructions}</p>
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
            {order.address.name}<br />
            {order.address.addressLine}<br />
            {order.address.landmark && `${order.address.landmark}, `}
            {order.address.city} — {order.address.pincode}<br />
            {order.address.phone}
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
  );

  return (
    <div className="relative bg-parchment paper-texture border-2 border-brass/40 shadow-vintage-card">
      {/* Torn paper top edge */}
      <div className="absolute -top-2 left-0 right-0 flex justify-around" aria-hidden="true">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="w-3 h-3 bg-cream rounded-full" style={{ marginTop: '-4px' }} />
        ))}
      </div>

      {/* Mobile: collapsible */}
      <div className="md:hidden">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center justify-between px-5 py-4"
          aria-expanded={expanded}
          aria-label="Toggle order summary"
        >
          <span className="font-elite text-[11px] uppercase tracking-wider text-ink">Order Summary</span>
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="h-4 w-4 text-brass" />
          </motion.div>
        </button>
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <Receipt />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop: always visible */}
      <div className="hidden md:block">
        <Receipt />
      </div>

      {/* Torn paper bottom edge */}
      <div className="absolute -bottom-2 left-0 right-0 flex justify-around" aria-hidden="true">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="w-3 h-3 bg-cream rounded-full" style={{ marginBottom: '-4px' }} />
        ))}
      </div>
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
