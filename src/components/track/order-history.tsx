'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { IndianRupee, Clock } from 'lucide-react';
import { useOrderStore, type Order } from '@/store/order';
import { useCart } from '@/store/cart';
import { useUIStore } from '@/store/ui';
import { useToast } from '@/hooks/use-toast';
import { VintageButton } from '@/components/ui/vintage-button';
import { deriveProgress, DEMO_SPEED_MS, STATUS_LABELS } from '@/lib/trackingSimulation';
import { cn } from '@/lib/utils';

interface OrderHistoryProps {
  currentOrderId: string;
  onTrack: (orderId: string) => void;
}

const STATUS_PILL_COLORS: Record<string, string> = {
  delivered: 'bg-forest/10 text-forest border-forest/40',
  cancelled: 'bg-sepia/10 text-sepia border-sepia/40',
  active: 'bg-oxblood/10 text-oxblood border-oxblood/40',
};

export function OrderHistory({ currentOrderId, onTrack }: OrderHistoryProps) {
  const prefersReduced = useReducedMotion();
  const getAllOrders = useOrderStore((s) => s.getAllOrders);
  const hasHydrated = useOrderStore((s) => s.hasHydrated);
  const addItem = useCart((s) => s.addItem);
  const openCart = useUIStore((s) => s.openCart);
  const { toast } = useToast();

  if (!hasHydrated) return null;

  const allOrders = getAllOrders();
  const pastOrders = allOrders.filter((o) => o.id !== currentOrderId);

  if (pastOrders.length === 0) return null;

  const getDerivedStatus = (order: Order): string => {
    if (order.cancelledAt) return 'cancelled';
    const progress = deriveProgress(
      order.placedAt,
      order.estimatedDelivery,
      Date.now(),
      DEMO_SPEED_MS,
      order.cancelledAt
    );
    return progress.status === 'delivered' ? 'delivered' : 'active';
  };

  const summarizeItems = (items: Order['items']): string => {
    const names = items.map((i) => i.name);
    if (names.length <= 2) return names.join(', ');
    return `${names[0]}, ${names[1]} +${names.length - 2} more`;
  };

  return (
    <div className="mt-12">
      <h3 className="font-playfair text-2xl font-bold text-ink mb-1">Past Orders</h3>
      <p className="font-cormorant text-sm italic text-sepia mb-6">A record of your previous suppers</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pastOrders.map((order, i) => {
          const status = getDerivedStatus(order);
          const pillClass = STATUS_PILL_COLORS[status] || STATUS_PILL_COLORS.active;
          const statusLabel = status === 'cancelled' ? 'Cancelled' : status === 'delivered' ? 'Delivered' : STATUS_LABELS[status as keyof typeof STATUS_LABELS] || 'In Progress';

          return (
            <motion.div
              key={order.id}
              initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="bg-parchment paper-texture border-2 border-brass/30 shadow-vintage-card p-4 flex flex-col gap-3"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <span className="font-elite text-[10px] uppercase tracking-wider text-ink">{order.id}</span>
                <span className={cn('px-2 py-0.5 border font-elite text-[8px] uppercase tracking-wider', pillClass)}>
                  {statusLabel}
                </span>
              </div>

              {/* Date */}
              <div className="flex items-center gap-1.5">
                <Clock className="h-3 w-3 text-brass" strokeWidth={1.5} />
                <span className="font-cormorant text-xs italic text-sepia">
                  {new Date(order.placedAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>

              {/* Items summary */}
              <p className="font-lora text-xs text-ink/70 leading-relaxed">
                {summarizeItems(order.items)}
              </p>

              {/* Total */}
              <div className="flex items-center justify-between border-t border-brass/15 pt-2">
                <span className="font-elite text-[9px] uppercase tracking-wider text-sepia">Total</span>
                <span className="flex items-center font-elite text-sm text-oxblood">
                  <IndianRupee className="h-3 w-3" />
                  {order.pricing.grandTotal}
                </span>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 mt-1">
                <button
                  onClick={() => onTrack(order.id)}
                  className="flex-1 font-elite text-[10px] uppercase tracking-wider border border-brass/40 text-oxblood py-2 px-3 hover:bg-brass/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass"
                >
                  Track
                </button>
                <button
                  onClick={() => {
                    order.items.forEach((item) => {
                      addItem(item, item.quantity, item.selectedAddOns);
                    });
                    openCart();
                    toast({
                      title: 'Added to basket',
                      description: 'Items from your previous order have been added.',
                    });
                  }}
                  className="flex-1 font-elite text-[10px] uppercase tracking-wider border border-brass/40 text-sepia py-2 px-3 hover:bg-brass/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass"
                >
                  Reorder
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
