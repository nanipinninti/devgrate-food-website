import { Hero } from '@/components/home/hero';
import { Marquee } from '@/components/home/marquee';
import { Bestsellers } from '@/components/home/bestsellers';
import { HowItWorks } from '@/components/home/how-it-works';
import { Offers } from '@/components/home/offers';
import { StoryTeaser } from '@/components/home/story-teaser';
import { Testimonials } from '@/components/home/testimonials';
import { FinalCTA } from '@/components/home/final-cta';
import { OrnamentDivider } from '@/components/ui/ornament-divider';
import { siteConfig } from '@/lib/siteConfig';
import { site } from '@/data/site';

const restaurantJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: siteConfig.name,
  description: siteConfig.description,
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
  servesCuisine: 'Indian',
  priceRange: '₹₹',
  url: siteConfig.url,
  areaServed: site.deliveryZones.map((z) => ({
    '@type': 'Place',
    name: z,
  })),
  openingHoursSpecification: site.hours.map((h) => {
    const dayMap: Record<string, string> = {
      Monday: 'Mo', Tuesday: 'Tu', Wednesday: 'We', Thursday: 'Th',
      Friday: 'Fr', Saturday: 'Sa', Sunday: 'Su',
    };
    const timeMatch = h.time.match(/(\d+):(\d+)\s*(AM|PM)\s*[–-]\s*(\d+):(\d+)\s*(AM|PM)/i);
    const to24 = (hh: string, mm: string, ap: string) => {
      let h = parseInt(hh);
      if (ap.toUpperCase() === 'PM' && h !== 12) h += 12;
      if (ap.toUpperCase() === 'AM' && h === 12) h = 0;
      return `${String(h).padStart(2, '0')}:${mm}`;
    };
    return {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: dayMap[h.day] || h.day,
      opens: timeMatch ? to24(timeMatch[1], timeMatch[2], timeMatch[3]) : '11:00',
      closes: timeMatch ? to24(timeMatch[4], timeMatch[5], timeMatch[6]) : '22:30',
    };
  }),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd) }}
      />
      <Hero />
      <Marquee />
      <Bestsellers />
      <div className="bg-parchment">
        <OrnamentDivider width="full" className="py-4" />
      </div>
      <HowItWorks />
      <Offers />
      <StoryTeaser />
      <Testimonials />
      <FinalCTA />
    </>
  );
}
