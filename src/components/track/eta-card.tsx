'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { Stamp } from '@/components/ui/stamp';
import { cn } from '@/lib/utils';
import type { OrderProgress } from '@/lib/trackingSimulation';

interface EtaCardProps {
  progress: OrderProgress;
  estimatedDelivery: string;
}

function formatRemaining(ms: number): string {
  const mins = Math.ceil(ms / 60000);
  if (mins <= 0) return 'Arrived';
  if (mins === 1) return '1 min';
  return `${mins} min`;
}

function formatEta(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function EtaCard({ progress, estimatedDelivery }: EtaCardProps) {
  const prefersReduced = useReducedMotion();
  const remainingText = formatRemaining(progress.remainingMs);
  const [displayMinutes, setDisplayMinutes] = useState(remainingText);
  const prevMinRef = useRef(remainingText);

  useEffect(() => {
    if (remainingText !== prevMinRef.current) {
      prevMinRef.current = remainingText;
      setDisplayMinutes(remainingText);
    }
  }, [remainingText]);

  const isDelivered = progress.status === 'delivered';
  const isCancelled = progress.status === 'cancelled';

  const ringRadius = 52;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const filledLength = (progress.percentComplete / 100) * ringCircumference;

  return (
    <div className="bg-parchment paper-texture border-2 border-brass/30 shadow-vintage-card p-6 flex flex-col items-center">
      {isCancelled ? (
        <div className="py-8 text-center">
          <p className="font-playfair text-lg text-sepia">Order Cancelled</p>
        </div>
      ) : isDelivered ? (
        <div className="flex flex-col items-center gap-4 py-4">
          <Stamp label="DELIVERED" size="md" color="forest" />
          <p className="font-elite text-xs uppercase tracking-wider text-sepia">
            Delivered at {formatEta(estimatedDelivery)}
          </p>
        </div>
      ) : (
        <>
          {/* Circular progress ring */}
          <div className="relative h-32 w-32 mb-4">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r={ringRadius}
                fill="none"
                stroke="#B08A3E"
                strokeOpacity="0.2"
                strokeWidth="6"
              />
              <motion.circle
                cx="60"
                cy="60"
                r={ringRadius}
                fill="none"
                stroke="#B08A3E"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={ringCircumference}
                animate={{ strokeDashoffset: ringCircumference - filledLength }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Clock className="h-4 w-4 text-brass mb-1" strokeWidth={1.5} />
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={displayMinutes}
                  initial={prefersReduced ? { opacity: 0 } : { y: -12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={prefersReduced ? { opacity: 0 } : { y: 12, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <span className="font-elite text-lg text-ink">{displayMinutes}</span>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <p className="font-elite text-[10px] uppercase tracking-wider text-sepia mb-1">
            Arriving in
          </p>
          <p className="font-playfair text-xl font-semibold text-ink">
            {formatEta(estimatedDelivery)}
          </p>
        </>
      )}
    </div>
  );
}
