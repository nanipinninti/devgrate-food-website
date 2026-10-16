'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { VintageButton } from '@/components/ui/vintage-button';
import { OrnamentDivider } from '@/components/ui/ornament-divider';

export function StoryCTA() {
  const prefersReduced = useReducedMotion();

  return (
    <section className="mx-auto max-w-4xl px-4 md:px-8 py-16 md:py-24 text-center">
      {/* Wax seal icon */}
      <motion.div
        initial={prefersReduced ? { opacity: 0 } : { scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 200, damping: 12 }}
        className="flex justify-center mb-6"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-brass bg-oxblood/10">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="8" fill="#7A1F1F" opacity="0.3" />
            <path d="M12 6L13.5 10.5L18 12L13.5 13.5L12 18L10.5 13.5L6 12L10.5 10.5L12 6Z" fill="#B08A3E" />
          </svg>
        </div>
      </motion.div>

      {/* Pull quote */}
      <motion.blockquote
        initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="font-cormorant text-2xl md:text-3xl italic text-ink leading-relaxed max-w-2xl mx-auto"
      >
        &ldquo;We did not invent these recipes. We inherited them, tended them like a garden, and passed them on — warmer than we found them.&rdquo;
      </motion.blockquote>

      <p className="font-elite text-[10px] uppercase tracking-wider text-sepia mt-4 mb-8">
        — Vikas Rathore, Founder
      </p>

      <OrnamentDivider width="md" className="mx-auto mb-8" />

      {/* CTA */}
      <motion.div
        initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex flex-col items-center gap-4"
      >
        <h3 className="font-playfair text-2xl font-bold text-ink">
          Taste the heritage
        </h3>
        <Link href="/menu">
          <VintageButton size="lg">
            Explore the Menu
          </VintageButton>
        </Link>
      </motion.div>
    </section>
  );
}
