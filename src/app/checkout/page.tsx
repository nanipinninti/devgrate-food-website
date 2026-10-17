import type { Metadata } from 'next';
import { CheckoutClient } from '@/components/checkout/checkout-client';

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Complete your order with secure delivery and payment details.',
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
