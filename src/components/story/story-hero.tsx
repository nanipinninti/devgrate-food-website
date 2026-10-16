'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1556910103-4c6f5c1c3f5e?w=900&q=80';

const titleWords = ['A', 'Century', 'Over', 'Open', 'Flame'];

export function StoryHero() {
  const ref = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [0, prefersReduced ? 0 : 100]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, prefersReduced ? 0 : 60]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[90vh] items-center overflow-hidden bg-parchment pt-8"
    >
      <div className="paper-texture absolute inset-0 opacity-30" aria-hidden="true" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-4 py-20 md:px-8 lg:grid-cols-2">
        {/* Left: text */}
        <motion.div style={{ y: textY }} className="flex flex-col gap-6">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-elite text-xs uppercase tracking-[0.3em] text-sepia flex items-center gap-2"
          >
            <span className="h-px w-8 bg-brass" />
            Our Story
          </motion.p>

          <h1 className="font-playfair text-4xl font-bold text-ink leading-[1.1] sm:text-5xl lg:text-6xl">
            {titleWords.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block mr-[0.25em]"
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + titleWords.length * 0.12 + 0.1 }}
            className="font-cormorant text-xl italic text-sepia leading-relaxed max-w-md"
          >
            From a single tandoor in 1924 to a cloud kitchen serving thousands — the fire has never gone out.
          </motion.p>
        </motion.div>

        {/* Right: framed photo with parallax */}
        <motion.div
          style={{ y: imageY }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="relative flex justify-center"
        >
          <div className="relative w-full max-w-md">
            {/* Double brass border */}
            <div className="relative border-2 border-brass p-2 shadow-vintage-lift bg-cream">
              <div className="border border-brass/60 overflow-hidden">
                <img
                  src={HERO_IMAGE}
                  alt="A vintage kitchen with open flame cooking"
                  className="h-[400px] w-full object-cover sm:h-[500px]"
                  style={{ filter: 'sepia(0.3) contrast(1.05)' }}
                />
              </div>
            </div>

            {/* Est. stamp */}
            <div className="absolute -bottom-4 -right-4 z-20">
              <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full border-2 border-dashed border-brass bg-parchment/90 font-elite text-sepia">
                <span className="text-[8px] uppercase tracking-wider">Est.</span>
                <span className="text-lg font-bold">1924</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
