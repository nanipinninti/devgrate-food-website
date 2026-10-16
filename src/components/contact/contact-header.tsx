'use client';

import { SectionHeading } from '@/components/ui/section-heading';

export function ContactHeader() {
  return (
    <div className="mx-auto max-w-3xl px-4 md:px-8 pt-8 pb-4">
      <SectionHeading eyebrow="Write to Us" title="Get in Touch" className="mb-4" />
      <p className="font-cormorant text-lg italic text-sepia text-center">
        We reply faster than a hot tandoor cools.
      </p>
    </div>
  );
}
