import type { Metadata } from 'next';
import { PageTransition } from '@/components/ui/page-transition';
import { OrderConfirmedClient } from '@/components/checkout/order-confirmed-client';

export const metadata: Metadata = {
  title: 'Order Confirmed — Hearth & Ember',
  description: 'Your order has been received and is being prepared.',
  robots: { index: false, follow: false },
};

export default function OrderConfirmedPage() {
  return (
    <PageTransition>
      <OrderConfirmedClient />
    </PageTransition>
  );
}
