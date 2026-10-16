'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Search, Plus } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { cn } from '@/lib/utils';

interface FAQItem {
  q: string;
  a: string;
}

const FAQS: FAQItem[] = [
  { q: 'What are your delivery times?', a: 'We deliver from 11:00 AM to 10:30 PM on weekdays, and until 11:30 PM on Fridays and Saturdays. Sundays we start at 12:00 PM. Most orders arrive within 35 to 45 minutes.' },
  { q: 'Is there a minimum order?', a: 'There is no strict minimum, but delivery is free on orders above ₹499. Below that, a flat ₹49 delivery fee applies.' },
  { q: 'Can you accommodate allergies?', a: 'Every dish page lists allergens. If you have a severe allergy, please mention it in the special instructions field and we will prepare your order separately. However, all food is cooked in a shared kitchen.' },
  { q: 'Do you offer catering and bulk orders?', a: 'Yes! We cater for parties, offices, and events. Select "Catering and Bulk Orders" on the contact form, or call us directly. We recommend 48 hours notice for large orders.' },
  { q: 'How do refunds work?', a: 'If something is wrong with your order, contact us within 30 minutes of delivery with your order ID. Approved refunds are processed within 3 to 5 business days to your original payment method.' },
  { q: 'What payment methods do you accept?', a: 'We accept UPI (all major apps), credit and debit cards, and cash on delivery. For bulk catering orders, we also accept bank transfers.' },
  { q: 'Can I schedule an order for later?', a: 'Currently all orders are prepared on demand. We are working on a scheduling feature — watch this space!' },
  { q: 'How is the food packaged?', a: 'We use heat-retaining, food-grade packaging that keeps your meal warm for up to 45 minutes. All containers are recyclable.' },
];

export function FAQ() {
  const prefersReduced = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return FAQS;
    return FAQS.filter(
      (item) =>
        item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <section className="mx-auto max-w-3xl px-4 md:px-8 py-16 md:py-24">
      <SectionHeading eyebrow="Questions, Answered" title="Frequently Asked" className="mb-8" />

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brass pointer-events-none" strokeWidth={1.5} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search questions..."
          aria-label="Search FAQ"
          className="checkout-input pl-10"
        />
      </div>

      {/* Accordion */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="font-cormorant text-base italic text-sepia">
            No matching questions. Try another search or write to us below.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="bg-parchment paper-texture border border-brass/25 overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between px-4 py-3.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brass"
                  aria-expanded={isOpen}
                  aria-controls={`faq-content-${i}`}
                >
                  <span className="font-playfair text-sm font-semibold text-ink pr-4">
                    {item.q}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="shrink-0"
                  >
                    <Plus className="h-4 w-4 text-brass" strokeWidth={2} />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-content-${i}`}
                      initial={prefersReduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={prefersReduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="font-cormorant text-sm italic text-sepia px-4 pb-4 leading-relaxed">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
