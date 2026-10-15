'use client';

import { useRef, useCallback, useState } from 'react';
import type { MenuItem } from '@/data/menu';
import { useCart } from '@/store/cart';
import { useToast } from '@/hooks/use-toast';
import { Breadcrumb } from './breadcrumb';
import { DishGallery } from './dish-gallery';
import { DishInfo } from './dish-info';
import { DishTabs } from './dish-tabs';
import { DishReviews } from './dish-reviews';
import { StickyAddBar } from './sticky-add-bar';

interface DishDetailClientProps {
  item: MenuItem;
}

export function DishDetailClient({ item }: DishDetailClientProps) {
  const addItem = useCart((s) => s.addItem);
  const { toast } = useToast();
  const addToCartRef = useRef<HTMLDivElement | null>(null);
  const [total, setTotal] = useState(item.price);

  const handleTotalChange = useCallback((newTotal: number) => {
    setTotal(newTotal);
  }, []);

  const handleStickyAdd = () => {
    // The DishInfo manages add-ons internally, but the sticky bar doesn't have that context.
    // For the sticky bar, we add just the base item with quantity 1.
    // The main Add to Cart button in DishInfo handles add-ons properly.
    addItem(item, 1, []);
    toast({
      title: 'Added to cart',
      description: `${item.name} — ₹${item.price}`,
    });
  };

  return (
    <>
      <Breadcrumb dishName={item.name} />

      {/* Two-column layout */}
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: gallery (sticky on desktop) */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <DishGallery item={item} />
          </div>

          {/* Right: info panel */}
          <div className="flex flex-col gap-8">
            <DishInfo
              item={item}
              addToCartRef={addToCartRef}
              onTotalChange={handleTotalChange}
            />

            {/* Details tabs */}
            <div className="border-t border-brass/20 pt-6">
              <DishTabs item={item} />
            </div>

            {/* Reviews */}
            <div className="border-t border-brass/20 pt-6">
              <DishReviews />
            </div>
          </div>
        </div>
      </div>

      <StickyAddBar
        item={item}
        total={total}
        onAdd={handleStickyAdd}
        addToCartRef={addToCartRef}
      />
    </>
  );
}
