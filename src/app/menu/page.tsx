import { Suspense } from 'react';
import type { Metadata } from 'next';
import { MenuHeader } from '@/components/menu/menu-header';
import { MenuClient } from '@/components/menu/menu-client';
import { FloatingCartPill } from '@/components/menu/floating-cart-pill';

export const metadata: Metadata = {
  title: 'Menu',
  description:
    'Browse the full bill of fare at Hearth & Ember — starters, mains, biryani, desserts, and beverages. Every dish cooked to order over open fire, never reheated.',
};

function MenuFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <p className="font-cormorant text-xl italic text-sepia">Setting the table...</p>
    </div>
  );
}

export default function MenuPage() {
  return (
    <>
      <MenuHeader />
      <Suspense fallback={<MenuFallback />}>
        <MenuClient />
      </Suspense>
      <FloatingCartPill />
    </>
  );
}
