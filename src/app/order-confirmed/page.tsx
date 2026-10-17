import type { Metadata } from 'next';
import { OrderConfirmedClient } from '@/components/checkout/order-confirmed-client';

export const metadata: Metadata = {
  title: 'Order Confirmed',
  description: 'Your order has been received and is being prepared.',
  robots: { index: false, follow: false },
};

export default function OrderConfirmedPage() {
  return <OrderConfirmedClient />;
}
