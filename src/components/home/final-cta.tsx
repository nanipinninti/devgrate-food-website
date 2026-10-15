'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { VintageButton } from '@/components/ui/vintage-button';
import { OrnamentDivider } from '@/components/ui/ornament-divider';
import { site } from '@/data/site';

export function FinalCTA() {
  return (
    <section className="bg-parchment py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative bg-oxblood text-cream py-12 md:py-16 px-6 md:px-12 text-center overflow-hidden"
        >
          {/* Brass ornament border */}
          <div className="absolute inset-2 border border-brass/50 pointer-events-none" aria-hidden="true" />
          <div className="absolute inset-3 border border-brass/30 pointer-events-none" aria-hidden="true" />

          <div className="paper-texture absolute inset-0 opacity-10" aria-hidden="true" />

          <div className="relative flex flex-col items-center gap-5">
            <div className="flex items-center gap-2">
              <Flame className="h-6 w-6 text-brass" strokeWidth={1.5} />
              <span className="font-elite text-xs uppercase tracking-[0.3em] text-brass">
                Hearth &amp; Ember
              </span>
              <Flame className="h-6 w-6 text-brass" strokeWidth={1.5} />
            </div>

            <OrnamentDivider width="md" />

            <h2 className="font-playfair text-3xl md:text-5xl font-bold leading-tight">
              Hungry already?
            </h2>

            <p className="font-cormorant text-lg italic text-cream/80 max-w-md">
              Your table is waiting. Place an order and we will have it at your door before the embers cool.
            </p>

            <Link href="/menu" aria-label="Order now">
              <VintageButton variant="outline" size="lg" className="mt-2">
                Order Now
              </VintageButton>
            </Link>

            <div className="mt-4">
              <p className="font-elite text-[10px] uppercase tracking-wider text-brass mb-2">
                We Deliver To
              </p>
              <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                {site.deliveryZones.map((zone) => (
                  <span
                    key={zone}
                    className="font-elite text-[9px] uppercase tracking-wider text-cream/70 border border-brass/30 px-2 py-0.5"
                  >
                    {zone}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
