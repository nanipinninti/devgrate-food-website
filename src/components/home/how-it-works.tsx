'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { MousePointerClick, ChefHat, Bike, UtensilsCrossed } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';

const STEPS = [
  { num: '01', icon: MousePointerClick, title: 'Choose', desc: 'Browse our menu and pick your favourites.' },
  { num: '02', icon: ChefHat, title: 'We Cook', desc: 'Fresh ingredients, fire-cooked to order.' },
  { num: '03', icon: Bike, title: 'Rider Picks Up', desc: 'Sealed warm and dispatched in minutes.' },
  { num: '04', icon: UtensilsCrossed, title: 'Enjoy', desc: 'Open the door, set the table, dig in.' },
];

export function HowItWorks() {
  const ref = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 80%', 'end 60%'],
  });
  const pathLength = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  return (
    <section ref={ref} className="bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading
          eyebrow="Simple as Supper"
          title="From Our Hearth to Your Door"
        />

        {/* Desktop: horizontal */}
        <div className="mt-16 hidden md:block">
          <div className="relative">
            {/* Animated dashed line */}
            {!prefersReduced && (
              <svg
                className="absolute top-8 left-[12.5%] right-[12.5%] h-1"
                viewBox="0 0 100 1"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <motion.line
                  x1="0"
                  y1="0.5"
                  x2="100"
                  y2="0.5"
                  stroke="#B08A3E"
                  strokeWidth="0.5"
                  strokeDasharray="2 2"
                  style={{ pathLength }}
                />
              </svg>
            )}
            {prefersReduced && (
              <div className="absolute top-8 left-[12.5%] right-[12.5%] border-t border-dashed border-brass" aria-hidden="true" />
            )}

            <div className="grid grid-cols-4 gap-4">
              {STEPS.map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2, duration: 0.4 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-brass bg-parchment relative z-10">
                    <step.icon className="h-6 w-6 text-oxblood" strokeWidth={1.5} />
                    <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-oxblood text-cream font-elite text-[9px] border border-brass">
                      {step.num}
                    </span>
                  </div>
                  <h3 className="font-playfair text-xl font-semibold text-ink mt-4">
                    {step.title}
                  </h3>
                  <p className="font-lora text-sm text-sepia mt-1 max-w-[180px]">
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: vertical */}
        <div className="mt-12 md:hidden">
          <div className="relative">
            <div className="absolute left-8 top-4 bottom-4 border-l-2 border-dashed border-brass" aria-hidden="true" />
            <div className="space-y-8">
              {STEPS.map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.4 }}
                  className="flex items-start gap-4"
                >
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-brass bg-parchment relative z-10">
                    <step.icon className="h-6 w-6 text-oxblood" strokeWidth={1.5} />
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-oxblood text-cream font-elite text-[8px] border border-brass">
                      {step.num}
                    </span>
                  </div>
                  <div className="pt-3">
                    <h3 className="font-playfair text-lg font-semibold text-ink">
                      {step.title}
                    </h3>
                    <p className="font-lora text-sm text-sepia mt-1">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
