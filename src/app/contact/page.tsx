import type { Metadata } from 'next';
import { PageTransition } from '@/components/ui/page-transition';
import { ContactClient } from '@/components/contact/contact-client';
import { site } from '@/data/site';

export const metadata: Metadata = {
  title: 'Contact — Hearth & Ember',
  description:
    'Get in touch with Hearth & Ember. Call, email, or write to us. Check if we deliver to your area and find answers to common questions.',
  openGraph: {
    title: 'Contact — Hearth & Ember',
    description:
      'Get in touch with Hearth & Ember. Call, email, or write to us. Check delivery zones and FAQs.',
    type: 'website',
  },
};

const faqs = [
  { q: 'What are your delivery times?', a: 'We deliver from 11:00 AM to 10:30 PM on weekdays, and until 11:30 PM on Fridays and Saturdays. Most orders arrive within 35 to 45 minutes.' },
  { q: 'Is there a minimum order?', a: 'There is no strict minimum, but delivery is free on orders above ₹499. Below that, a flat ₹49 delivery fee applies.' },
  { q: 'Can you accommodate allergies?', a: 'Every dish page lists allergens. If you have a severe allergy, please mention it in the special instructions field.' },
  { q: 'Do you offer catering and bulk orders?', a: 'Yes! We cater for parties, offices, and events. Contact us through the form or call us directly.' },
  { q: 'How do refunds work?', a: 'Contact us within 30 minutes of delivery with your order ID. Approved refunds are processed within 3 to 5 business days.' },
  { q: 'What payment methods do you accept?', a: 'We accept UPI, credit and debit cards, and cash on delivery.' },
  { q: 'Can I schedule an order for later?', a: 'Currently all orders are prepared on demand. We are working on a scheduling feature.' },
  { q: 'How is the food packaged?', a: 'We use heat-retaining, food-grade packaging that keeps your meal warm for up to 45 minutes. All containers are recyclable.' },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: f.a,
    },
  })),
};

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: site.name,
  description: `${site.name} is a vintage-styled cloud kitchen serving fire-cooked Indian cuisine.`,
  telephone: site.phone,
  email: site.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: site.address.line1,
    addressLocality: site.address.city,
    addressRegion: site.address.state,
    postalCode: site.address.pincode,
    addressCountry: 'IN',
  },
  openingHoursSpecification: site.hours.map((h) => {
    const dayMap: Record<string, string> = {
      Monday: 'Mo',
      Tuesday: 'Tu',
      Wednesday: 'We',
      Thursday: 'Th',
      Friday: 'Fr',
      Saturday: 'Sa',
      Sunday: 'Su',
    };
    const timeMatch = h.time.match(/(\d+:\d+\s*[AP]M)\s*[–-]\s*(\d+:\d+\s*[AP]M)/i);
    return {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: dayMap[h.day] || h.day,
      opens: timeMatch ? timeMatch[1].replace(/\s/g, '').toUpperCase() : '11:00',
      closes: timeMatch ? timeMatch[2].replace(/\s/g, '').toUpperCase() : '22:30',
    };
  }),
  servesCuisine: 'Indian',
  priceRange: '₹₹',
  url: 'https://hearthandember.in',
};

export default function ContactPage() {
  return (
    <PageTransition>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <ContactClient />
    </PageTransition>
  );
}
