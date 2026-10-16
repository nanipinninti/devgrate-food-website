'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { SectionHeading } from '@/components/ui/section-heading';
import { kitchenStats } from '@/data/story';
import { cn } from '@/lib/utils';

const PROCESS_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1604908554007-23ec6c32e4e1?w=600&q=80', aspect: 'aspect-[3/4]', speed: 40 },
  { src: 'https://images.unsplash.com/photo-1594515250098-99c2c0f14a6f?w=600&q=80', aspect: 'aspect-square', speed: 70 },
  { src: 'https://images.unsplash.com/photo-1585945545214-2c4a2d4e5c1a?w=600&q=80', aspect: 'aspect-[4/5]', speed: 50 },
];

export function Process() {
  const ref = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const transforms = PROCESS_IMAGES.map((_, i) =>
    useTransform(scrollYProgress, [0, 1], [0, prefersReduced ? 0 : PROCESS_IMAGES[i].speed])
  );

  return (
    <section ref={ref} className="relative bg-forest text-cream py-16 md:py-24 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: writeup + stats */}
          <div>
            <div className="flex flex-col gap-3 items-start mb-8">
              <p className="font-elite text-xs uppercase tracking-[0.3em] text-brass">
                Behind the Kitchen
              </p>
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-cream leading-tight">
                From Source to Sealed Box
              </h2>
              <div className="flex items-center gap-3 w-48">
                <span className="h-px flex-1 bg-brass" />
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0 text-brass">
                  <path d="M8 1L9.5 5.5L14 7L9.5 8.5L8 13L6.5 8.5L2 7L6.5 5.5L8 1Z" fill="currentColor" opacity="0.9" />
                </svg>
                <span className="h-px flex-1 bg-brass" />
              </div>
            </div>

            <div className="space-y-4 font-lora text-sm text-cream/80 leading-relaxed mb-8">
              <p>
                Every morning at dawn, our kitchen comes alive. Spices are hand-ground in a stone mortar, vegetables are sourced from local farms, and the charcoal pit is lit for the day.
              </p>
              <p>
                We cook in small batches throughout the day — nothing is pre-made and reheated. Each order is prepared fresh, sealed in heat-retaining packaging, and dispatched while still warm from the flame.
              </p>
            </div>

            {/* Count-up stats */}
            <div className="grid grid-cols-3 gap-4">
              {kitchenStats.map((stat, i) => (
                <CountUpStat key={i} stat={stat} prefersReduced={prefersReduced} />
              ))}
            </div>
          </div>

          {/* Right: image mosaic */}
          <div className="grid grid-cols-2 gap-3">
            {PROCESS_IMAGES.map((img, i) => (
              <motion.div
                key={i}
                style={{ y: transforms[i] }}
                className={cn(img.aspect, i === 0 && 'row-span-2', 'overflow-hidden border-2 border-brass/40')}
              >
                <img
                  src={img.src}
                  alt="Kitchen process"
                  className="h-full w-full object-cover"
                  style={{ filter: 'sepia(0.1) contrast(1.05)' }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CountUpStat({
  stat,
  prefersReduced,
}: {
  stat: { value: number; suffix: string; label: string };
  prefersReduced: boolean | null;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (prefersReduced) {
      setCount(stat.value);
      setHasAnimated(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 1500;
          const steps = 40;
          const stepValue = stat.value / steps;
          let current = 0;
          const interval = setInterval(() => {
            current += stepValue;
            if (current >= stat.value) {
              setCount(stat.value);
              clearInterval(interval);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [stat.value, prefersReduced, hasAnimated]);

  return (
    <div ref={ref} className="text-center">
      <p className="font-elite text-2xl md:text-3xl text-brass">
        {count}{stat.suffix}
      </p>
      <p className="font-cormorant text-xs italic text-cream/60 mt-1 leading-tight">
        {stat.label}
      </p>
    </div>
  );
}
