'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { ArrowRight, Flame } from 'lucide-react';
import { OrnamentDivider } from '@/components/ui/ornament-divider';
import { site } from '@/data/site';

const STORY_IMAGE =
  'https://images.pexels.com/photos/35605016/pexels-photo-35605016.jpeg?auto=compress&cs=tinysrgb&h=600&w=900';

const STATS = [
  { label: 'Years of Heritage', value: 100, suffix: '' },
  { label: 'Dishes Delivered', value: 250000, suffix: '+' },
  { label: 'Happy Families', value: 18000, suffix: '+' },
];

function CountUp({ target, suffix, duration = 2000 }: { target: number; suffix: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const prefersReduced = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    if (prefersReduced) {
      setCount(target);
      return;
    }
    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, target, duration, prefersReduced]);

  return (
    <span ref={ref}>
      {count.toLocaleString('en-IN')}
      {suffix}
    </span>
  );
}

export function StoryTeaser() {
  return (
    <section className="bg-forest text-cream py-20 md:py-28 relative overflow-hidden">
      <div className="paper-texture absolute inset-0 opacity-15" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left: framed photo with caption */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative flex justify-center"
          >
            <div className="relative w-full max-w-md">
              <div className="border-2 border-brass p-2 bg-ink/30 shadow-vintage-lift">
                <img
                  src={STORY_IMAGE}
                  alt="A rustic vintage kitchen with woodfire cooking"
                  className="w-full h-[340px] object-cover sepia-[0.2]"
                />
              </div>
              {/* Rotated caption label */}
              <div className="absolute -bottom-4 -right-4 bg-parchment border border-brass/40 px-4 py-2 shadow-vintage-card rotate-[-4deg]">
                <p className="font-cormorant text-sm italic text-ink">
                  Our first kitchen, 1924
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right: story text + stats */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-brass" strokeWidth={1.5} />
              <span className="font-elite text-xs uppercase tracking-[0.3em] text-brass">
                Our Story
              </span>
            </div>

            <h2 className="font-playfair text-3xl md:text-4xl font-bold leading-tight">
              A Century of Fire-Cooked Flavor
            </h2>

            <OrnamentDivider width="sm" className="self-start" />

            <p className="font-lora text-base text-cream/80 leading-relaxed">
              It began with a single wood-fired stove in 1924, where our grandfather
              slow-cooked biryani for a handful of loyal neighbours. Four generations
              later, the recipes are unchanged — only the kitchen has moved. Today, we
              cook the same way in our cloud kitchen and deliver it warm to your door.
              The fire never went out. It just found a new home.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-2">
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="text-center border-l-2 border-brass/40 pl-3 first:border-l-0 first:pl-0"
                >
                  <p className="font-playfair text-2xl md:text-3xl font-bold text-brass">
                    <CountUp target={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="font-elite text-[8px] uppercase tracking-wider text-cream/60 mt-1">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>

            <Link
              href="/our-story"
              className="group inline-flex items-center gap-2 font-elite text-xs uppercase tracking-[0.2em] text-brass hover:text-cream transition-colors mt-2 self-start focus:outline-none focus-visible:ring-2 focus-visible:ring-brass rounded px-1"
            >
              Read Our Story
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
