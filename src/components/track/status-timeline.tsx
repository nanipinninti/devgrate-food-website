'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Receipt,
  ChefHat,
  Flame,
  Package,
  Bike,
  Home,
  Check,
  X,
} from 'lucide-react';
import { OrnamentDivider } from '@/components/ui/ornament-divider';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { OrderStatus } from '@/store/order';
import {
  STATUS_SEQUENCE,
  STATUS_LABELS,
  STATUS_DESCRIPTIONS,
  type OrderProgress,
} from '@/lib/trackingSimulation';

interface StatusTimelineProps {
  progress: OrderProgress;
}

const STAGE_ICONS: Record<OrderStatus, typeof Receipt> = {
  received: Receipt,
  preparing: ChefHat,
  cooking: Flame,
  packed: Package,
  out_for_delivery: Bike,
  delivered: Home,
  cancelled: X,
};

function formatTimestamp(iso: string | null | undefined): string {
  if (!iso) return '';
  return new Date(iso).toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function StatusTimeline({ progress }: StatusTimelineProps) {
  const prefersReduced = useReducedMotion();
  const { toast } = useToast();
  const prevStatusRef = useRef<OrderStatus>(progress.status);

  useEffect(() => {
    const prev = prevStatusRef.current;
    if (prev !== progress.status && progress.status !== 'cancelled') {
      toast({
        title: STATUS_LABELS[progress.status],
        description: STATUS_DESCRIPTIONS[progress.status],
      });
    }
    prevStatusRef.current = progress.status;
  }, [progress.status, toast]);

  if (progress.status === 'cancelled') {
    return (
      <div className="bg-parchment border-2 border-sepia/40 p-6 text-center">
        <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full border-2 border-sepia bg-cream mb-3">
          <X className="h-5 w-5 text-sepia" strokeWidth={1.5} />
        </div>
        <h3 className="font-playfair text-lg font-semibold text-sepia">Order Cancelled</h3>
        <p className="font-cormorant text-sm italic text-sepia/80 mt-1">
          Your order was cancelled within the cancellation window.
        </p>
      </div>
    );
  }

  const currentIndex = STATUS_SEQUENCE.indexOf(progress.status);
  const isHorizontal = typeof window !== 'undefined' && window.innerWidth >= 768;

  return (
    <div className="bg-parchment paper-texture border-2 border-brass/30 shadow-vintage-card p-5 md:p-6">
      <h3 className="font-playfair text-lg font-bold text-ink mb-4">Order Journey</h3>

      {/* Horizontal timeline (desktop) */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Base line */}
          <div className="absolute top-6 left-6 right-6 h-0.5 bg-brass/20" />
          {/* Filled line */}
          <motion.div
            className="absolute top-6 left-6 h-0.5 bg-brass"
            initial={prefersReduced ? { width: 'auto' } : { width: 0 }}
            animate={{ width: `calc((100% - 48px) * ${Math.max(0, currentIndex) / (STATUS_SEQUENCE.length - 1)})` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />

          <div className="relative flex justify-between">
            {STATUS_SEQUENCE.map((stage, i) => {
              const Icon = STAGE_ICONS[stage];
              const isCompleted = i < currentIndex;
              const isCurrent = i === currentIndex;
              const isUpcoming = i > currentIndex;
              const timestamp = progress.stageTimestamps[stage];

              return (
                <div key={stage} className="flex flex-col items-center gap-2" style={{ width: '120px' }}>
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-full border-2 bg-cream z-10">
                    {isCompleted && (
                      <div className="flex h-full w-full items-center justify-center rounded-full border-2 border-brass bg-brass">
                        <Check className="h-5 w-5 text-cream" strokeWidth={2} />
                      </div>
                    )}
                    {isCurrent && (
                      <>
                        <div className="flex h-full w-full items-center justify-center rounded-full border-2 border-brass bg-oxblood">
                          <Icon className="h-5 w-5 text-cream" strokeWidth={1.5} />
                        </div>
                        {!prefersReduced && (
                          <motion.div
                            className="absolute inset-0 rounded-full border-2 border-brass"
                            animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                        )}
                      </>
                    )}
                    {isUpcoming && (
                      <Icon className="h-5 w-5 text-brass/30" strokeWidth={1.5} />
                    )}
                  </div>
                  <div className={cn('text-center', isUpcoming && 'opacity-40')}>
                    <p className={cn(
                      'font-elite text-[9px] uppercase tracking-wider',
                      isCompleted ? 'text-brass' : isCurrent ? 'text-oxblood' : 'text-sepia'
                    )}>
                      {STATUS_LABELS[stage]}
                    </p>
                    <p className="font-cormorant text-[11px] italic text-sepia/70 mt-0.5 leading-tight">
                      {STATUS_DESCRIPTIONS[stage]}
                    </p>
                    {timestamp && (
                      <p className="font-elite text-[9px] text-sepia/60 mt-1">
                        {formatTimestamp(timestamp)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Vertical timeline (mobile) */}
      <div className="md:hidden">
        <div className="relative pl-8">
          <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-brass/20" />
          <motion.div
            className="absolute left-3 top-3 w-0.5 bg-brass"
            initial={prefersReduced ? { height: 'auto' } : { height: 0 }}
            animate={{ height: `calc(100% * ${Math.max(0, currentIndex) / (STATUS_SEQUENCE.length - 1)})` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />

          <div className="space-y-5">
            {STATUS_SEQUENCE.map((stage, i) => {
              const Icon = STAGE_ICONS[stage];
              const isCompleted = i < currentIndex;
              const isCurrent = i === currentIndex;
              const isUpcoming = i > currentIndex;
              const timestamp = progress.stageTimestamps[stage];

              return (
                <div key={stage} className="relative">
                  <div className="absolute -left-8 flex h-6 w-6 items-center justify-center rounded-full border-2 bg-cream z-10">
                    {isCompleted ? (
                      <div className="flex h-full w-full items-center justify-center rounded-full border border-brass bg-brass">
                        <Check className="h-3 w-3 text-cream" strokeWidth={2.5} />
                      </div>
                    ) : isCurrent ? (
                      <>
                        <div className="flex h-full w-full items-center justify-center rounded-full border border-brass bg-oxblood">
                          <Icon className="h-3 w-3 text-cream" strokeWidth={1.5} />
                        </div>
                        {!prefersReduced && (
                          <motion.div
                            className="absolute inset-0 rounded-full border border-brass"
                            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                        )}
                      </>
                    ) : (
                      <Icon className="h-3 w-3 text-brass/30" strokeWidth={1.5} />
                    )}
                  </div>

                  <div className={cn(isUpcoming && 'opacity-40')}>
                    <p className={cn(
                      'font-elite text-[10px] uppercase tracking-wider',
                      isCompleted ? 'text-brass' : isCurrent ? 'text-oxblood' : 'text-sepia'
                    )}>
                      {STATUS_LABELS[stage]}
                    </p>
                    <p className="font-cormorant text-xs italic text-sepia/70 mt-0.5">
                      {STATUS_DESCRIPTIONS[stage]}
                    </p>
                    {timestamp && (
                      <p className="font-elite text-[9px] text-sepia/60 mt-0.5">
                        {formatTimestamp(timestamp)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
