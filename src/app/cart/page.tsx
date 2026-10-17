import type { Metadata } from 'next';
import CartClient from '@/components/cart/cart-client';

export const metadata: Metadata = {
  title: 'Your Basket',
  description: 'Review your selected dishes, apply coupons, and proceed to checkout.',
};

export default function CartPage() {
  return <CartClient />;
}
