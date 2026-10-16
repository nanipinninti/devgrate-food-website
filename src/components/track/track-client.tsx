'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { Zap, Clock } from 'lucide-react';
import { useOrderStore } from '@/store/order';
import { useOrderProgress, useDemoMode } from '@/hooks/use-order-progress';
import { OrderLookup } from '@/components/track/order-lookup';
import { TrackHeader } from '@/components/track/track-header';
import { StatusTimeline } from '@/components/track/status-timeline';
import { EtaCard } from '@/components/track/eta-card';
import { RouteMap } from '@/components/track/route-map';
import { RiderCard } from '@/components/track/rider-card';
import { OrderDetails } from '@/components/track/order-details';
import { TrackActions } from '@/components/track/track-actions';
import { OrderHistory } from '@/components/track/order-history';
import { OrnamentDivider } from '@/components/ui/ornament-divider';
import { cn } from '@/lib/utils';

export function TrackClient() {
  const prefersReduced = useReducedMotion();
  const searchParams = useSearchParams();
  const hasHydrated = useOrderStore((s) => s.hasHydrated);
  const latestOrder = useOrderStore((s) => s.latestOrder);
  const [demoMode, setDemoMode] = useDemoMode();
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  // Auto-load latest order or query param
  useEffect(() => {
    if (!hasHydrated) return;
    const queryId = searchParams.get('id');
    if (queryId) {
      setActiveOrderId(queryId.toUpperCase());
    } else if (latestOrder) {
      setActiveOrderId(latestOrder.id);
    }
  }, [hasHydrated, latestOrder, searchParams]);

  const { progress, order } = useOrderProgress(activeOrderId);

  const handleTrack = useCallback((orderId: string) => {
    setActiveOrderId(orderId);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  if (!hasHydrated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brass border-t-transparent" />
      </div>
    );
  }

  // No active order — show lookup
  if (!activeOrderId || !order || !progress) {
    return (
      <div className="mx-auto max-w-2xl px-4 md:px-8 py-8">
        <OrderLookup onFound={handleTrack} />
        <OrderHistory currentOrderId={activeOrderId || ''} onTrack={handleTrack} />
      </div>
    );
  }

  const isActive = progress.status !== 'delivered' && progress.status !== 'cancelled';
  const showMap = progress.status === 'out_for_delivery' || progress.status === 'delivered';
  const showRider = progress.status === 'out_for_delivery' && order.rider;

  return (
    <div className="mx-auto max-w-5xl px-4 md:px-8 py-8">
      {/* aria-live region for screen readers */}
      <div aria-live="polite" className="sr-only">
        Order status: {progress.status}
      </div>

      {/* Header */}
      <TrackHeader
        orderId={order.id}
        placedAt={order.placedAt}
        status={progress.status}
        isActive={isActive}
      />

      <OrnamentDivider width="md" className="mx-auto my-6" />

      {/* Simulated notice */}
      <p className="font-cormorant text-xs italic text-sepia text-center mb-6">
        Tracking is simulated for demo purposes. Orders complete in about 3 minutes.
      </p>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: timeline + map + rider */}
        <div className="lg:col-span-2 space-y-6">
          <StatusTimeline progress={progress} />

          <RouteMap riderProgress={progress.riderProgress} showMap={showMap} />

          {showRider && order.rider && <RiderCard rider={order.rider} />}
        </div>

        {/* Right column: ETA + order details + actions */}
        <div className="space-y-6">
          <EtaCard progress={progress} estimatedDelivery={order.estimatedDelivery} />

          <OrderDetails order={order} />

          <TrackActions order={order} currentStatus={progress.status} />
        </div>
      </div>

      {/* Past orders */}
      <OrderHistory currentOrderId={order.id} onTrack={handleTrack} />

      {/* Demo mode toggle */}
      <DemoModeToggle demoMode={demoMode} onToggle={setDemoMode} prefersReduced={prefersReduced} />
    </div>
  );
}

function DemoModeToggle({
  demoMode,
  onToggle,
  prefersReduced,
}: {
  demoMode: boolean;
  onToggle: (val: boolean) => void;
  prefersReduced: boolean | null;
}) {
  return (
    <motion.div
      initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="fixed bottom-4 right-4 z-40 bg-parchment border border-brass/30 shadow-vintage-card px-3 py-2 flex items-center gap-2"
    >
      <Zap className={cn('h-3.5 w-3.5', demoMode ? 'text-oxblood' : 'text-sepia/40')} strokeWidth={1.5} />
      <span className="font-elite text-[9px] uppercase tracking-wider text-sepia">Demo</span>
      <button
        onClick={() => onToggle(!demoMode)}
        className="relative h-5 w-9 rounded-full border border-brass/30 bg-cream transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass"
        aria-label={`Demo mode ${demoMode ? 'on' : 'off'}`}
        role="switch"
        aria-checked={demoMode}
      >
        <motion.div
          className="absolute top-0.5 h-3.5 w-3.5 rounded-full bg-brass"
          animate={{ left: demoMode ? '18px' : '2px' }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        />
      </button>
      <Clock className="h-3.5 w-3.5 text-sepia/40" strokeWidth={1.5} />
      <span className="font-elite text-[9px] uppercase tracking-wider text-sepia/60">Real</span>
    </motion.div>
  );
}
