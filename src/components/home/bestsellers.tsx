'use client';

import { motion } from 'framer-motion';
import { SectionHeading } from '@/components/ui/section-heading';
import { OrnamentDivider } from '@/components/ui/ornament-divider';
import { DishCard } from '@/components/menu/dish-card';
import { menu } from '@/data/menu';

export function Bestsellers() {
  const bestsellers = menu.filter((item) => item.isBestseller);

  return (
    <section className="bg-parchment py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading
          eyebrow="Fan Favourites"
          title="House Bestsellers"
        />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {bestsellers.map((item, i) => (
            <DishCard key={item.id} item={item} index={i} />
          ))}
        </div>

        <OrnamentDivider width="full" className="mt-16" />
      </div>
    </section>
  );
}
