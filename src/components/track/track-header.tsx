'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { cn } from '@/lib/utils';
import type { OrderStatus } from '@/store/order';
import { STATUS_LABELS } from '@/lib/trackingSimulation';

interface TrackHeaderProps {
  orderId: string;
  placedAt: string;
  status: OrderStatus;
  isActive: boolean;
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  received: 'bg-oxblood/10 text-oxblood border-oxblood/40',
  preparing: 'bg-oxblood/10 text-oxblood border-oxblood/40',
  cooking: 'bg-oxblood/10 text-oxblood border-oxblood/40',
  packed: 'bg-oxblood/10 text-oxblood border-oxblood/40',
  out_for_delivery: 'bg-oxblood/10 text-oxblood border-oxblood/40',
  delivered: 'bg-forest/10 text-forest border-forest/40',
  cancelled: 'bg-sepia/10 text-sepia border-sepia/40',
};

export function TrackHeader({ orderId, placedAt, status, isActive }: TrackHeaderProps) {
  const prefersReduced = useReducedMotion();

  const placedDate = new Date(placedAt);
  const placedTimeStr = placedDate.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <SectionHeading eyebrow="Dispatch Office" title="Track Your Order" />

      {/* Ticket stub strip */}
      <motion.div
        initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="relative w-full max-w-md bg-parchment paper-texture border-2 border-brass/40 shadow-vintage-card overflow-hidden"
      >
        {/* Notched edges */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-3 rounded-full bg-cream border-r border-brass/40" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 h-6 w-3 rounded-full bg-cream border-l border-brass/40" />

        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex flex-col">
            <span className="font-elite text-[9px] uppercase tracking-wider text-sepia">Order No.</span>
            <span className="font-elite text-base text-ink">{orderId}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-elite text-[9px] uppercase tracking-wider text-sepia">Placed</span>
            <span className="font-cormorant text-sm italic text-ink/80">{placedTimeStr}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-elite text-[9px] uppercase tracking-wider text-sepia mb-1">Status</span>
            <span
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1 border font-elite text-[10px] uppercase tracking-wider',
                STATUS_COLORS[status]
              )}
            >
              {isActive && !prefersReduced && (
                <motion.span
                  className="h-1.5 w-1.5 rounded-full bg-current"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
              {STATUS_LABELS[status]}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
