'use client';

import { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const ITEMS = [
  'Slow-cooked',
  'Hand-ground spices',
  'Wood-fired',
  'Small batches',
  'Delivered hot',
];

function Diamond() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="text-cream/70 shrink-0">
      <path d="M4 0L5 3L8 4L5 5L4 8L3 5L0 4L3 3L4 0Z" fill="currentColor" />
    </svg>
  );
}

export function Marquee() {
  const prefersReduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const content = (
    <div className="flex items-center gap-6 shrink-0">
      {ITEMS.map((item) => (
        <div key={item} className="flex items-center gap-6">
          <span className="font-elite text-xs uppercase tracking-[0.2em] text-cream whitespace-nowrap">
            {item}
          </span>
          <Diamond />
        </div>
      ))}
    </div>
  );

  return (
    <div
      ref={containerRef}
      className="bg-oxblood py-3 overflow-hidden border-y border-brass/40"
      aria-hidden="true"
    >
      <motion.div
        className="flex w-max"
        animate={prefersReduced ? {} : { x: ['0%', '-50%'] }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear',
        }}
        whileHover={prefersReduced ? {} : { animationPlayState: 'paused' }}
      >
        <div className="flex items-center gap-6 pr-6">{content}</div>
        <div className="flex items-center gap-6 pr-6" aria-hidden="true">{content}</div>
      </motion.div>
    </div>
  );
}
