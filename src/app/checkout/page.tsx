import type { Metadata } from 'next';
import { PageTransition } from '@/components/ui/page-transition';
import { CheckoutClient } from '@/components/checkout/checkout-client';

export const metadata: Metadata = {
  title: 'Checkout — Hearth & Ember',
  description: 'Complete your order with secure delivery and payment details.',
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <PageTransition>
      <CheckoutClient />
    </PageTransition>
  );
}
