'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { testimonials } from '@/data/testimonials';
import { cn } from '@/lib/utils';

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const directionRef = useRef(1);

  const count = testimonials.length;

  const goNext = useCallback(() => {
    directionRef.current = 1;
    setIndex((prev) => (prev + 1) % count);
  }, [count]);

  const goPrev = useCallback(() => {
    directionRef.current = -1;
    setIndex((prev) => (prev - 1 + count) % count);
  }, [count]);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(goNext, 5000);
    return () => clearInterval(timer);
  }, [paused, goNext]);

  // Touch swipe
  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
  };

  const active = testimonials[index];

  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-4 md:px-8">
        <SectionHeading
          eyebrow="Kind Words"
          title="Letters from Our Patrons"
        />

        <div
          className="relative mt-12 min-h-[340px] sm:min-h-[300px]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="wait" custom={directionRef.current}>
            <motion.div
              key={active.id}
              custom={directionRef.current}
              initial={{ opacity: 0, x: directionRef.current * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: directionRef.current * -60 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto max-w-2xl"
            >
              {/* Letter-style card */}
              <div className="relative bg-parchment border border-brass/30 shadow-vintage-card p-8 md:p-12 rounded-sm paper-texture">
                {/* Wax-seal quote icon */}
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-oxblood border-2 border-brass shadow-vintage-card">
                  <Quote className="h-4 w-4 text-cream" strokeWidth={1.5} />
                </div>

                {/* Star rating */}
                <div className="flex justify-center gap-1 mt-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill={i < active.rating ? '#B08A3E' : 'none'}
                      stroke="#B08A3E"
                      strokeWidth="1.5"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>

                <p className="font-cormorant text-lg md:text-xl italic text-ink leading-relaxed text-center mt-6">
                  &ldquo;{active.review}&rdquo;
                </p>

                <div className="mt-6 flex flex-col items-center gap-1">
                  <p className="font-cormorant text-lg italic text-oxblood">
                    {active.name}
                  </p>
                  <p className="font-elite text-[10px] uppercase tracking-wider text-sepia">
                    {active.location}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Prev / Next arrows */}
          <button
            onClick={goPrev}
            aria-label="Previous testimonial"
            className="absolute top-1/2 -translate-y-1/2 -left-2 md:-left-6 flex h-10 w-10 items-center justify-center rounded-full border-2 border-brass bg-parchment text-brass hover:bg-oxblood hover:text-cream transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass z-10"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
          </button>
          <button
            onClick={goNext}
            aria-label="Next testimonial"
            className="absolute top-1/2 -translate-y-1/2 -right-2 md:-right-6 flex h-10 w-10 items-center justify-center rounded-full border-2 border-brass bg-parchment text-brass hover:bg-oxblood hover:text-cream transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass z-10"
          >
            <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Dot indicators */}
        <div className="mt-6 flex justify-center gap-2">
          {testimonials.map((t, i) => (
            <button
              key={t.id}
              onClick={() => {
                directionRef.current = i > index ? 1 : -1;
                setIndex(i);
              }}
              aria-label={`Go to testimonial ${i + 1}`}
              className={cn(
                'h-2 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brass',
                i === index
                  ? 'w-6 bg-oxblood'
                  : 'w-2 bg-brass/40 hover:bg-brass/70'
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
