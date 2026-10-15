'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { MenuItem } from '@/data/menu';
import { cn } from '@/lib/utils';

interface DishGalleryProps {
  item: MenuItem;
}

export function DishGallery({ item }: DishGalleryProps) {
  const images = item.gallery && item.gallery.length > 0 ? item.gallery : [item.image];
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isZooming, setIsZooming] = useState(false);
  const prefersReduced = useReducedMotion();
  const mainImgRef = useRef<HTMLDivElement>(null);

  // Lightbox keyboard nav
  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') setActiveIdx((p) => (p + 1) % images.length);
      if (e.key === 'ArrowLeft') setActiveIdx((p) => (p - 1 + images.length) % images.length);
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [lightboxOpen, images.length]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (prefersReduced || !mainImgRef.current) return;
    const rect = mainImgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const goNext = useCallback(() => setActiveIdx((p) => (p + 1) % images.length), [images.length]);
  const goPrev = useCallback(() => setActiveIdx((p) => (p - 1 + images.length) % images.length), [images.length]);

  // Touch swipe for lightbox
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

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div
        ref={mainImgRef}
        className="relative border-2 border-brass p-1 bg-cream shadow-vintage-card overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        onClick={() => setLightboxOpen(true)}
        role="button"
        tabIndex={0}
        aria-label="Open image in full screen"
        onKeyDown={(e) => e.key === 'Enter' && setLightboxOpen(true)}
      >
        <div className="relative overflow-hidden border border-brass/40 aspect-[4/3] cursor-zoom-in">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeIdx}
              src={images[activeIdx]}
              alt={item.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 h-full w-full object-cover sepia-[0.2] hover:sepia-0 transition-[filter] duration-500"
              style={
                isZooming && !prefersReduced
                  ? {
                      transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                      transform: 'scale(1.8)',
                    }
                  : undefined
              }
            />
          </AnimatePresence>

          {/* Veg/non-veg indicator */}
          <div
            className={cn(
              'absolute top-3 left-3 flex h-6 w-6 items-center justify-center border-2 bg-cream/90',
              item.isVeg ? 'border-forest' : 'border-oxblood'
            )}
          >
            <div className={cn('h-2.5 w-2.5 rounded-full', item.isVeg ? 'bg-forest' : 'bg-oxblood')} />
          </div>

          {/* Chef's Pick ribbon */}
          {item.isBestseller && (
            <div className="absolute top-3 right-3 bg-brass px-2 py-1 shadow-sm">
              <span className="font-elite text-[8px] uppercase tracking-wider text-ink">
                Chef's Pick
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-3">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIdx(i)}
            aria-label={`View image ${i + 1}`}
            className={cn(
              'relative h-16 w-20 overflow-hidden border-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brass',
              activeIdx === i ? 'border-brass shadow-vintage-card' : 'border-brass/20 opacity-60 hover:opacity-100'
            )}
          >
            <img src={img} alt={`${item.name} thumbnail ${i + 1}`} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[80] bg-ink/90 flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Close button */}
            <button
              onClick={() => setLightboxOpen(false)}
              aria-label="Close lightbox"
              className="absolute top-4 right-4 text-cream/80 hover:text-cream transition-colors z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brass rounded p-2"
            >
              <X className="h-6 w-6" strokeWidth={1.5} />
            </button>

            {/* Prev */}
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              aria-label="Previous image"
              className="absolute left-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-brass text-brass hover:bg-oxblood hover:text-cream hover:border-oxblood transition-colors z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brass"
            >
              <ChevronLeft className="h-6 w-6" strokeWidth={1.5} />
            </button>

            {/* Image */}
            <motion.img
              key={activeIdx}
              src={images[activeIdx]}
              alt={item.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="max-h-[85vh] max-w-[90vw] object-contain border-2 border-brass"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Next */}
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              aria-label="Next image"
              className="absolute right-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-brass text-brass hover:bg-oxblood hover:text-cream hover:border-oxblood transition-colors z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brass"
            >
              <ChevronRight className="h-6 w-6" strokeWidth={1.5} />
            </button>

            {/* Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-elite text-[10px] uppercase tracking-wider text-cream/60">
              {activeIdx + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
