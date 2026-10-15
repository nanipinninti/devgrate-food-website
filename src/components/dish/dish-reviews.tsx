'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { OrnamentDivider } from '@/components/ui/ornament-divider';

const MOCK_REVIEWS = [
  {
    name: 'Aarti P.',
    rating: 5,
    date: 'Oct 2024',
    review: 'Absolutely divine. The flavours were layered and deep — tasted like it was cooked by someone who truly cares. Will order again.',
  },
  {
    name: 'Rajesh K.',
    rating: 5,
    date: 'Oct 2024',
    review: 'Delivered piping hot, which is rare. The portion was generous and the taste was restaurant quality. Five stars without hesitation.',
  },
  {
    name: 'Deepa S.',
    rating: 4,
    date: 'Sep 2024',
    review: 'Very good overall. The spice was perfect for me. Would have liked a bit more gravy but the taste was excellent.',
  },
];

const RATING_BREAKDOWN = [
  { stars: 5, count: 89 },
  { stars: 4, count: 22 },
  { stars: 3, count: 9 },
  { stars: 2, count: 3 },
  { stars: 1, count: 1 },
];

const TOTAL_REVIEWS = RATING_BREAKDOWN.reduce((sum, r) => sum + r.count, 0);
const AVG_RATING = (
  RATING_BREAKDOWN.reduce((sum, r) => sum + r.stars * r.count, 0) / TOTAL_REVIEWS
).toFixed(1);

export function DishReviews() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const prefersReduced = useReducedMotion();

  return (
    <div ref={ref} className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-2">
        <h3 className="font-playfair text-2xl font-bold text-ink">
          Patron Reviews
        </h3>
        <OrnamentDivider width="sm" />
      </div>

      {/* Rating summary */}
      <div className="flex flex-col sm:flex-row items-center gap-8 border border-brass/20 bg-cream/50 p-6">
        <div className="flex flex-col items-center gap-1">
          <span className="font-playfair text-4xl font-bold text-oxblood">
            {AVG_RATING}
          </span>
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill={i < Math.round(Number(AVG_RATING)) ? '#B08A3E' : 'none'}
                stroke="#B08A3E"
                strokeWidth="1.5"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
          <span className="font-elite text-[10px] uppercase tracking-wider text-sepia">
            {TOTAL_REVIEWS} reviews
          </span>
        </div>

        {/* Bar breakdown */}
        <div className="flex-1 w-full space-y-1.5">
          {RATING_BREAKDOWN.map((row) => {
            const pct = (row.count / TOTAL_REVIEWS) * 100;
            return (
              <div key={row.stars} className="flex items-center gap-2">
                <span className="font-elite text-[10px] uppercase tracking-wider text-sepia w-8">
                  {row.stars}★
                </span>
                <div className="flex-1 h-2 bg-brass/10 overflow-hidden">
                  <motion.div
                    className="h-full bg-brass"
                    initial={{ width: prefersReduced ? `${pct}%` : 0 }}
                    animate={isInView ? { width: `${pct}%` } : {}}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: row.stars * 0.05 }}
                  />
                </div>
                <span className="font-elite text-[10px] text-sepia w-8 text-right">
                  {row.count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        {MOCK_REVIEWS.map((review, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="relative bg-parchment border border-brass/25 shadow-vintage-card p-6 rounded-sm paper-texture"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-oxblood border border-brass">
                <Quote className="h-3 w-3 text-cream" strokeWidth={1.5} />
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <svg
                    key={j}
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill={j < review.rating ? '#B08A3E' : 'none'}
                    stroke="#B08A3E"
                    strokeWidth="1.5"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
            </div>
            <p className="font-cormorant text-base italic text-ink leading-relaxed">
              &ldquo;{review.review}&rdquo;
            </p>
            <div className="mt-3 flex items-center justify-between">
              <span className="font-cormorant text-sm italic text-oxblood">
                {review.name}
              </span>
              <span className="font-elite text-[9px] uppercase tracking-wider text-sepia">
                {review.date}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
