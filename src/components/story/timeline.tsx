'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { SectionHeading } from '@/components/ui/section-heading';
import { timeline } from '@/data/story';
import { cn } from '@/lib/utils';

export function Timeline() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start center', 'end center'],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section className="mx-auto max-w-5xl px-4 md:px-8 py-16 md:py-24">
      <SectionHeading eyebrow="Our Journey" title="A Century in the Making" className="mb-12" />

      <div ref={ref} className="relative">
        {/* Mobile: left line, desktop: center line */}
        <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-brass/15" />

        {/* Animated line fill */}
        <motion.div
          className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 w-0.5 bg-brass origin-top"
          style={{ height: prefersReduced ? '100%' : lineHeight }}
        />

        <div className="space-y-12 md:space-y-0">
          {timeline.map((milestone, i) => {
            const isLeft = i % 2 === 0;
            const isDesktopRight = !isLeft;

            return (
              <div
                key={milestone.year}
                className={cn(
                  'relative flex items-center gap-6 md:gap-0',
                  'md:mb-16',
                  isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                )}
              >
                {/* Node */}
                <motion.div
                  initial={prefersReduced ? { opacity: 0 } : { scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="absolute left-4 md:left-1/2 md:-translate-x-1/2 z-10 flex h-5 w-5 items-center justify-center rounded-full border-2 border-brass bg-cream"
                >
                  <div className="h-2 w-2 rounded-full bg-brass" />
                </motion.div>

                {/* Content */}
                <motion.div
                  initial={prefersReduced ? { opacity: 0 } : { opacity: 0, x: isLeft ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className={cn(
                    'ml-12 md:ml-0 md:w-[calc(50%-2rem)]',
                    isDesktopRight ? 'md:pl-12' : 'md:pr-12 md:text-right'
                  )}
                >
                  <span className="font-elite text-3xl md:text-4xl text-brass block mb-1">
                    {milestone.year}
                  </span>
                  <h3 className="font-playfair text-lg font-semibold text-ink mb-1">
                    {milestone.title}
                  </h3>
                  <p className="font-cormorant text-base italic text-sepia leading-snug">
                    {milestone.description}
                  </p>
                </motion.div>

                {/* Spacer for desktop alternating layout */}
                <div className="hidden md:block md:w-[calc(50%-2rem)]" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
