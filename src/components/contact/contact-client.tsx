'use client';

import { useState } from 'react';
import { ContactHeader } from '@/components/contact/contact-header';
import { InfoCards } from '@/components/contact/info-cards';
import { ContactForm } from '@/components/contact/contact-form';
import { ZoneChecker } from '@/components/contact/zone-checker';
import { KitchenMap } from '@/components/contact/kitchen-map';
import { FAQ } from '@/components/contact/faq';
import { MiniNav } from '@/components/contact/mini-nav';
import { OrnamentDivider } from '@/components/ui/ornament-divider';

export function ContactClient() {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  const handleSelectZone = (zone: string) => {
    setSelectedZone(zone);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 md:px-8 pb-16">
      <ContactHeader />
      <MiniNav />

      {/* Info section */}
      <section id="info" className="scroll-mt-32 py-8">
        <InfoCards />
      </section>

      <OrnamentDivider width="lg" className="my-8" />

      {/* Write to Us section */}
      <section id="write" className="scroll-mt-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ContactForm />
          <div className="space-y-6">
            <p className="font-cormorant text-lg italic text-sepia text-center">
              Prefer to write? Fill in the letter on the left and we will get back to you with a reply.
            </p>
            <div className="bg-cream paper-texture border border-brass/20 p-6 text-center">
              <p className="font-elite text-[10px] uppercase tracking-wider text-sepia mb-2">
                Response Time
              </p>
              <p className="font-playfair text-2xl font-bold text-ink">Within 2 hours</p>
              <p className="font-cormorant text-sm italic text-sepia mt-1">
                During operating hours. We reply to every letter.
              </p>
            </div>
          </div>
        </div>
      </section>

      <OrnamentDivider width="lg" className="my-8" />

      {/* Delivery section */}
      <section id="delivery" className="scroll-mt-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ZoneChecker selectedZone={selectedZone} onSelectZone={handleSelectZone} />
          <KitchenMap selectedZone={selectedZone} onSelectZone={handleSelectZone} />
        </div>
      </section>

      <OrnamentDivider width="lg" className="my-8" />

      {/* FAQ section */}
      <section id="faq" className="scroll-mt-32">
        <FAQ />
      </section>
    </div>
  );
}
