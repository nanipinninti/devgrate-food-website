'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Copy, Tag } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { offers } from '@/data/offers';

export function Offers() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <section className="bg-parchment py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading
          eyebrow="Save a Pretty Penny"
          title="Offers & Coupons"
        />

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {offers.map((offer, i) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.4 }}
              className="relative"
            >
              {/* Ticket card with scalloped edges */}
              <div className="relative flex flex-col items-center bg-cream border-2 border-brass/40 shadow-vintage-card overflow-hidden">
                {/* Scalloped top edge */}
                <div
                  className="absolute top-0 left-0 right-0 h-2"
                  style={{
                    background:
                      'radial-gradient(circle at 6px 0px, transparent 4px, #FBF6EA 5px)',
                    backgroundSize: '12px 8px',
                    backgroundRepeat: 'repeat-x',
                  }}
                  aria-hidden="true"
                />
                {/* Scalloped bottom edge */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-2 rotate-180"
                  style={{
                    background:
                      'radial-gradient(circle at 6px 0px, transparent 4px, #FBF6EA 5px)',
                    backgroundSize: '12px 8px',
                    backgroundRepeat: 'repeat-x',
                  }}
                  aria-hidden="true"
                />

                {/* Notches on sides */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 h-4 w-4 rounded-full bg-parchment border border-brass/30" aria-hidden="true" />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 h-4 w-4 rounded-full bg-parchment border border-brass/30" aria-hidden="true" />

                <div className="w-full px-6 pt-6 pb-4">
                  <div className="flex items-center justify-center gap-2 text-sepia">
                    <Tag className="h-4 w-4 text-brass" strokeWidth={1.5} />
                    <span className="font-elite text-[10px] uppercase tracking-[0.2em]">
                      {offer.title}
                    </span>
                  </div>
                  <p className="font-cormorant text-base italic text-sepia text-center mt-2 px-2">
                    {offer.description}
                  </p>
                </div>

                {/* Dashed divider */}
                <div className="w-full border-t-2 border-dashed border-brass/30 px-2" />

                <div className="w-full px-6 py-5 flex flex-col items-center gap-3">
                  <p className="font-playfair text-3xl font-bold text-oxblood">
                    {offer.discount}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="font-elite text-[10px] uppercase tracking-wider text-sepia">
                      Code:
                    </span>
                    <span className="font-elite text-sm tracking-wider text-ink border border-brass/40 px-2 py-0.5 bg-parchment">
                      {offer.couponCode}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(offer.couponCode, offer.id)}
                    aria-label={`Copy coupon code ${offer.couponCode}`}
                    className="flex items-center gap-1.5 font-elite text-[10px] uppercase tracking-wider text-oxblood hover:text-forest transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass rounded px-2 py-1"
                  >
                    {copiedId === offer.id ? (
                      <>
                        <Check className="h-3 w-3" strokeWidth={2} />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" strokeWidth={1.5} />
                        Copy code
                      </>
                    )}
                  </button>
                  <p className="font-elite text-[8px] uppercase tracking-wider text-sepia/70">
                    Min order ₹{offer.minOrder} · Valid till {offer.validUntil}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
