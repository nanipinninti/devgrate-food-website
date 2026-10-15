'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Clock, Flame, Star, ChevronDown, Truck } from 'lucide-react';
import { VintageButton } from '@/components/ui/vintage-button';
import { Stamp } from '@/components/ui/stamp';

const HERO_IMAGE =
  'https://images.pexels.com/photos/6358976/pexels-photo-6358976.jpeg?auto=compress&cs=tinysrgb&h=900&w=700';

const headlineWords = ['Cooked', 'with', 'fire.', 'Delivered', 'with', 'care.'];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [0, prefersReduced ? 0 : 120]);
  const cardY = useTransform(scrollYProgress, [0, 1], [0, prefersReduced ? 0 : 60]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, prefersReduced ? 0 : 80]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen items-center overflow-hidden bg-parchment"
    >
      <div className="paper-texture absolute inset-0 opacity-30" aria-hidden="true" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-4 py-24 md:px-8 lg:grid-cols-2 lg:gap-12">
        {/* Left: text content */}
        <motion.div style={{ y: textY }} className="flex flex-col gap-6">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-elite text-xs uppercase tracking-[0.3em] text-sepia flex items-center gap-2"
          >
            <span className="h-px w-8 bg-brass" />
            Since 1924 · Now Delivering
          </motion.p>

          <h1 className="font-playfair text-4xl font-bold text-ink leading-[1.1] sm:text-5xl lg:text-6xl">
            {headlineWords.map((word, i) => (
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
            transition={{ delay: 0.3 + headlineWords.length * 0.12 + 0.1 }}
            className="font-lora text-base text-sepia leading-relaxed max-w-md"
          >
            Heritage recipes from a century-old kitchen, now crafted fresh in our cloud kitchen and delivered warm to your door — the same fire, the same care, a new address.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + headlineWords.length * 0.12 + 0.3 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Link href="/menu" aria-label="Order now">
              <VintageButton size="lg">Order Now</VintageButton>
            </Link>
            <Link href="/our-story" aria-label="Read our story">
              <VintageButton variant="outline" size="lg">
                Our Story
              </VintageButton>
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="flex flex-wrap items-center gap-6 mt-2"
          >
            {[
              { icon: Clock, label: '45 min delivery' },
              { icon: Flame, label: 'Freshly cooked' },
              { icon: Star, label: '4.8 rating' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sepia">
                <Icon className="h-4 w-4 text-brass" strokeWidth={1.5} />
                <span className="font-elite text-[10px] uppercase tracking-wider">
                  {label}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right: image frame */}
        <motion.div
          style={{ y: imageY }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="relative flex justify-center"
        >
          <div className="relative w-full max-w-md">
            {/* Arched frame with double brass border */}
            <div className="relative rounded-t-full border-2 border-brass p-1 shadow-vintage-lift overflow-hidden bg-cream">
              <div className="rounded-t-full border border-brass/60 overflow-hidden">
                <motion.img
                  src={HERO_IMAGE}
                  alt="A rustic Indian curry dish"
                  className="h-[420px] w-full rounded-t-full object-cover sm:h-[500px]"
                  animate={
                    prefersReduced
                      ? {}
                      : { scale: [1, 1.08, 1] }
                  }
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </div>
            </div>

            {/* Rotating stamp */}
            <div className="absolute -top-4 -right-4 z-20">
              <motion.div
                animate={prefersReduced ? {} : { rotate: [0, 360] }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              >
                <Stamp
                  label="Fresh"
                  sublabel="Daily"
                  color="oxblood"
                  size="md"
                  className="shadow-vintage-card"
                />
              </motion.div>
            </div>

            {/* Floating card: Today's Special */}
            <motion.div
              style={{ y: cardY }}
              animate={
                prefersReduced
                  ? {}
                  : { y: [0, -10, 0] }
              }
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -left-6 top-20 z-20 bg-cream border border-brass/40 shadow-vintage-card px-4 py-3 rounded-sm"
            >
              <p className="font-elite text-[8px] uppercase tracking-wider text-sepia">
                Today's Special
              </p>
              <p className="font-playfair text-sm font-semibold text-ink mt-0.5">
                Butter Chicken
              </p>
            </motion.div>

            {/* Floating card: Free delivery */}
            <motion.div
              style={{ y: cardY }}
              animate={
                prefersReduced
                  ? {}
                  : { y: [0, 8, 0] }
              }
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="absolute -right-4 bottom-16 z-20 bg-forest text-cream border border-brass/40 shadow-vintage-card px-4 py-3 rounded-sm flex items-center gap-2"
            >
              <Truck className="h-4 w-4 text-brass" strokeWidth={1.5} />
              <div>
                <p className="font-elite text-[8px] uppercase tracking-wider text-brass">
                  Free Delivery
                </p>
                <p className="font-elite text-[10px] uppercase tracking-wider">
                  Over ₹499
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-elite text-[9px] uppercase tracking-[0.3em] text-sepia">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronDown className="h-4 w-4 text-brass" strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </section>
  );
}
