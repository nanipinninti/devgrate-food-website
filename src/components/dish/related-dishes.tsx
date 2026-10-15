'use client';

import { motion } from 'framer-motion';
import { SectionHeading } from '@/components/ui/section-heading';
import { DishCard } from '@/components/menu/dish-card';
import { menu, type MenuItem } from '@/data/menu';

interface RelatedDishesProps {
  currentItem: MenuItem;
}

export function RelatedDishes({ currentItem }: RelatedDishesProps) {
  const sameCategory = menu.filter(
    (item) => item.id !== currentItem.id && item.category === currentItem.category
  );

  let related = sameCategory;
  if (related.length < 4) {
    const others = menu
      .filter(
        (item) =>
          item.id !== currentItem.id &&
          item.category !== currentItem.category
      )
      .sort((a, b) => b.rating - a.rating);
    related = [...related, ...others].slice(0, 4);
  } else {
    related = related.slice(0, 4);
  }

  return (
    <section className="bg-cream py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading
          eyebrow="Pairs Well With"
          title="You May Also Like"
        />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <DishCard item={item} index={i} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
