'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SectionHeading } from '@/components/ui/section-heading';
import { team } from '@/data/team';
import { cn } from '@/lib/utils';

export function ChefCards() {
  const prefersReduced = useReducedMotion();
  const [flipped, setFlipped] = useState<number | null>(null);

  return (
    <section className="mx-auto max-w-6xl px-4 md:px-8 py-16 md:py-24">
      <SectionHeading eyebrow="The Hands Behind the Hearth" title="Meet Our Chefs" className="mb-12" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {team.map((chef, i) => {
          const isFlipped = flipped === i;

          if (prefersReduced) {
            return (
              <motion.div
                key={chef.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.12, duration: 0.4 }}
                className="bg-parchment paper-texture border-2 border-brass/30 shadow-vintage-card p-4"
                onClick={() => setFlipped(isFlipped ? null : i)}
              >
                <ChefFront chef={chef} />
                {isFlipped && <ChefBack chef={chef} />}
              </motion.div>
            );
          }

          return (
            <motion.div
              key={chef.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.12, duration: 0.4 }}
              className="group"
              style={{ perspective: 1000 }}
            >
              <div
                className="relative h-[380px] cursor-pointer"
                style={{ transformStyle: 'preserve-3d' }}
                onClick={() => setFlipped(isFlipped ? null : i)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setFlipped(isFlipped ? null : i);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`${chef.name} — tap to see details`}
              >
                <motion.div
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="relative h-full w-full"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Front */}
                  <div
                    className="absolute inset-0"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <ChefFront chef={chef} />
                  </div>

                  {/* Back */}
                  <div
                    className="absolute inset-0"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                  >
                    <ChefBack chef={chef} />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

function ChefFront({ chef }: { chef: typeof team[0] }) {
  return (
    <div className="flex h-full flex-col items-center bg-parchment paper-texture border-2 border-brass/30 shadow-vintage-card p-4">
      {/* Arched portrait frame */}
      <div className="relative w-full max-w-[200px] mb-4">
        <div className="rounded-t-full border-2 border-brass p-1 bg-cream overflow-hidden">
          <div className="rounded-t-full border border-brass/60 overflow-hidden">
            <img
              src={chef.image}
              alt={chef.name}
              className="h-[200px] w-full rounded-t-full object-cover"
              style={{ filter: 'sepia(0.15)' }}
            />
          </div>
        </div>
      </div>

      {/* Name plate */}
      <h3 className="font-playfair text-lg font-bold text-ink text-center">
        {chef.name}
      </h3>
      <p className="font-elite text-[10px] uppercase tracking-wider text-sepia mt-0.5">
        {chef.title}
      </p>
      <p className="font-cormorant text-sm italic text-sepia/80 text-center mt-2 leading-snug flex-1">
        &ldquo;{chef.quote}&rdquo;
      </p>
      <p className="font-elite text-[9px] uppercase tracking-wider text-brass/60 mt-3">
        Tap to flip
      </p>
    </div>
  );
}

function ChefBack({ chef }: { chef: typeof team[0] }) {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-cream paper-texture border-2 border-brass/30 shadow-vintage-card p-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-brass bg-parchment mb-4">
        <span className="font-elite text-xs text-brass">{chef.yearsExperience}</span>
      </div>
      <p className="font-elite text-[9px] uppercase tracking-wider text-sepia mb-1">
        Years of Experience
      </p>
      <div className="w-12 h-px bg-brass/40 my-4" />
      <p className="font-elite text-[9px] uppercase tracking-wider text-sepia mb-1">
        Specialty
      </p>
      <p className="font-cormorant text-sm italic text-ink mb-4">{chef.specialty}</p>
      <p className="font-elite text-[9px] uppercase tracking-wider text-sepia mb-1">
        Signature Dish
      </p>
      <p className="font-playfair text-sm font-semibold text-oxblood">
        {chef.signatureDish}
      </p>
    </div>
  );
}
