'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Search, Truck } from 'lucide-react';
import { useOrderStore } from '@/store/order';
import { VintageButton } from '@/components/ui/vintage-button';
import { OrnamentDivider } from '@/components/ui/ornament-divider';
import { cn } from '@/lib/utils';

interface OrderLookupProps {
  onFound: (orderId: string) => void;
}

export function OrderLookup({ onFound }: OrderLookupProps) {
  const router = useRouter();
  const hasHydrated = useOrderStore((s) => s.hasHydrated);
  const getAllOrders = useOrderStore((s) => s.getAllOrders);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const prefersReduced = useReducedMotion();

  const allOrders = hasHydrated ? getAllOrders() : [];

  if (!hasHydrated) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-brass border-t-transparent" />
      </div>
    );
  }

  if (allOrders.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6 py-16 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-brass bg-parchment">
          <Truck className="h-8 w-8 text-sepia" strokeWidth={1} />
        </div>
        <div>
          <h3 className="font-playfair text-xl font-semibold text-ink">
            No orders yet
          </h3>
          <p className="font-cormorant text-base italic text-sepia mt-1">
            The hearth is warm and the kitchen is open.
          </p>
        </div>
        <Link href="/menu">
          <VintageButton variant="outline">Browse the Menu</VintageButton>
        </Link>
      </div>
    );
  }

  const validateAndTrack = () => {
    const trimmed = input.trim().toUpperCase();
    const formatMatch = /^HE-\d{6}$/.test(trimmed);

    if (!formatMatch) {
      setError('Please enter a valid order ID (e.g. HE-123456)');
      triggerShake();
      return;
    }

    const order = allOrders.find((o) => o.id === trimmed);
    if (!order) {
      setError('We couldn’t find that order. Please check your ID.');
      triggerShake();
      return;
    }

    setError('');
    onFound(trimmed);
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  return (
    <div className="mx-auto max-w-md py-8">
      <motion.div
        initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative bg-parchment paper-texture border-2 border-brass/40 shadow-vintage-card p-6 md:p-8"
      >
        {/* Telegram-style header */}
        <div className="text-center mb-4">
          <p className="font-elite text-[10px] uppercase tracking-[0.3em] text-sepia">
            Hearth & Ember Dispatch
          </p>
          <div className="flex items-center justify-center my-2">
            <span className="h-px w-12 bg-brass/40" />
            <span className="mx-2 font-elite text-[8px] text-brass">★</span>
            <span className="h-px w-12 bg-brass/40" />
          </div>
        </div>

        <h2 className="font-playfair text-2xl font-bold text-ink text-center mb-1">
          Where’s My Supper?
        </h2>
        <p className="font-cormorant text-sm italic text-sepia text-center mb-4">
          Enter your order ID below to track your delivery.
        </p>

        <OrnamentDivider width="sm" className="mx-auto mb-5" />

        <motion.div animate={shake ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }} transition={{ duration: 0.4 }}>
          <label htmlFor="order-id-input" className="block font-elite text-[10px] uppercase tracking-wider text-sepia mb-2">
            Order ID
          </label>
          <div className="flex gap-2">
            <input
              id="order-id-input"
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && validateAndTrack()}
              placeholder="HE-123456"
              aria-invalid={!!error}
              aria-describedby={error ? 'order-id-error' : undefined}
              className="checkout-input flex-1"
            />
            <VintageButton size="sm" onClick={validateAndTrack}>
              <Search className="h-4 w-4 mr-1" strokeWidth={1.5} />
              Track
            </VintageButton>
          </div>
          {error && (
            <motion.p
              id="order-id-error"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-cormorant text-sm italic text-oxblood mt-2"
            >
              {error}
            </motion.p>
          )}
        </motion.div>

        <p className="font-cormorant text-xs italic text-sepia/70 text-center mt-4">
          Placed an order? Your latest order loads automatically.
        </p>
      </motion.div>
    </div>
  );
}
