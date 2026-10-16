'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Flame, Layers, Package, Sprout } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { storyValues } from '@/data/story';
import { cn } from '@/lib/utils';

const ICONS: Record<string, typeof Flame> = {
  flame: Flame,
  layers: Layers,
  mortar: Sprout,
  package: Package,
};

export function Values() {
  const prefersReduced = useReducedMotion();

  return (
    <section className="mx-auto max-w-6xl px-4 md:px-8 py-16 md:py-24">
      <SectionHeading eyebrow="What We Stand For" title="The House Rules" className="mb-12" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {storyValues.map((value, i) => {
          const Icon = ICONS[value.icon] || Flame;
          return (
            <motion.div
              key={value.title}
              initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              whileHover={prefersReduced ? {} : { y: -6 }}
              className="group relative bg-parchment paper-texture border border-brass/30 p-6 text-center transition-all duration-300 hover:border-brass hover:shadow-[inset_0_0_0_1px_#B08A3E,inset_0_0_0_3px_#F4EBD9,inset_0_0_0_4px_#B08A3E] hover:shadow-vintage-lift"
            >
              <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-full border-2 border-brass bg-cream mb-4">
                <Icon className="h-6 w-6 text-brass" strokeWidth={1.5} />
              </div>
              <h3 className="font-playfair text-lg font-semibold text-ink mb-2">
                {value.title}
              </h3>
              <p className="font-cormorant text-sm italic text-sepia leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
