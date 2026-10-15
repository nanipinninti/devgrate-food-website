import { PageTransition } from '@/components/ui/page-transition';
import { Hero } from '@/components/home/hero';
import { Marquee } from '@/components/home/marquee';
import { Bestsellers } from '@/components/home/bestsellers';
import { HowItWorks } from '@/components/home/how-it-works';
import { Offers } from '@/components/home/offers';
import { StoryTeaser } from '@/components/home/story-teaser';
import { Testimonials } from '@/components/home/testimonials';
import { FinalCTA } from '@/components/home/final-cta';
import { OrnamentDivider } from '@/components/ui/ornament-divider';

export default function Home() {
  return (
    <PageTransition>
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
    </PageTransition>
  );
}
