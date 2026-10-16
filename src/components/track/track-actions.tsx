'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { XCircle, RefreshCw, ChevronDown, HelpCircle } from 'lucide-react';
import { useOrderStore, type Order } from '@/store/order';
import { useCart } from '@/store/cart';
import { useUIStore } from '@/store/ui';
import { useToast } from '@/hooks/use-toast';
import { VintageButton } from '@/components/ui/vintage-button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  isWithinCancellationWindow,
  getCancellationRemainingMs,
} from '@/lib/trackingSimulation';

interface TrackActionsProps {
  order: Order;
  currentStatus: string;
}

const FAQS = [
  { q: 'My order is late, what should I do?', a: 'Demo orders complete in about 3 minutes. If your order seems stuck, refresh the page — the timer recalculates from when you placed it.' },
  { q: 'I received the wrong item', a: 'We are sorry! Please contact us at orders@hearthandember.in with your order ID and we will make it right.' },
  { q: 'How do I get a refund?', a: 'Refunds for cancelled orders are processed within 3–5 business days to your original payment method.' },
  { q: 'Can I change my delivery address?', a: 'Address changes are only possible within the first 2 minutes after placing your order, before the rider sets off.' },
];

export function TrackActions({ order, currentStatus }: TrackActionsProps) {
  const prefersReduced = useReducedMotion();
  const cancelOrder = useOrderStore((s) => s.cancelOrder);
  const addItem = useCart((s) => s.addItem);
  const openCart = useUIStore((s) => s.openCart);
  const { toast } = useToast();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const canCancel =
    !order.cancelledAt &&
    currentStatus !== 'delivered' &&
    isWithinCancellationWindow(order.placedAt, now);

  const cancelRemaining = getCancellationRemainingMs(order.placedAt, now);
  const cancelSeconds = Math.ceil(cancelRemaining / 1000);

  const handleCancel = () => {
    cancelOrder(order.id);
    setShowCancelDialog(false);
    toast({
      title: 'Order cancelled',
      description: 'Your order has been cancelled.',
    });
  };

  const handleReorder = () => {
    order.items.forEach((item) => {
      addItem(item, item.quantity, item.selectedAddOns);
    });
    openCart();
    toast({
      title: 'Added to basket',
      description: 'All items from your previous order have been added.',
    });
  };

  return (
    <div className="space-y-4">
      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {canCancel && (
          <VintageButton
            variant="outline"
            size="sm"
            onClick={() => setShowCancelDialog(true)}
            className="text-sepia border-sepia/40 hover:bg-sepia/5"
          >
            <XCircle className="h-4 w-4 mr-2" strokeWidth={1.5} />
            Cancel Order
            <span className="ml-2 font-elite text-[10px] text-sepia/70">
              ({cancelSeconds}s)
            </span>
          </VintageButton>
        )}

        <VintageButton variant="outline" size="sm" onClick={handleReorder}>
          <RefreshCw className="h-4 w-4 mr-2" strokeWidth={1.5} />
          Reorder
        </VintageButton>
      </div>

      {/* FAQ accordion */}
      <div className="bg-parchment border border-brass/20 p-4">
        <div className="flex items-center gap-2 mb-3">
          <HelpCircle className="h-4 w-4 text-brass" strokeWidth={1.5} />
          <span className="font-elite text-[10px] uppercase tracking-wider text-ink">Need Help?</span>
        </div>
        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <div key={i} className="border-b border-brass/10 last:border-0">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between py-2 text-left"
                aria-expanded={openFaq === i}
              >
                <span className="font-cormorant text-sm text-ink/90">{faq.q}</span>
                <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="h-4 w-4 text-brass shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence initial={false}>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="font-lora text-xs text-sepia/90 pb-2 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Cancel confirmation dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent className="bg-parchment border-2 border-brass/40">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-playfair text-xl text-ink">Cancel this order?</AlertDialogTitle>
            <AlertDialogDescription className="font-cormorant text-sm italic text-sepia">
              This cannot be undone. Your order will be cancelled immediately and a refund will be processed if applicable.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-elite text-xs uppercase tracking-wider border-brass/40">
              Keep Order
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              className="font-elite text-xs uppercase tracking-wider bg-oxblood text-cream border-2 border-brass hover:bg-[#6B1A1A]"
            >
              Yes, Cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
