import type { Metadata } from 'next';
import { PageTransition } from '@/components/ui/page-transition';
import CartClient from '@/components/cart/cart-client';

export const metadata: Metadata = {
  title: 'Your Basket — Hearth & Ember',
  description: 'Review your selected dishes, apply coupons, and proceed to checkout.',
};

export default function CartPage() {
  return (
    <PageTransition>
      <CartClient />
    </PageTransition>
  );
}
