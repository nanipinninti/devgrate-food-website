import type { Metadata } from 'next';
import { PageTransition } from '@/components/ui/page-transition';
import { StoryHero } from '@/components/story/story-hero';
import { Timeline } from '@/components/story/timeline';
import { Values } from '@/components/story/values';
import { ChefCards } from '@/components/story/chef-cards';
import { Process } from '@/components/story/process';
import { StoryCTA } from '@/components/story/story-cta';

export const metadata: Metadata = {
  title: 'Our Story — Hearth & Ember',
  description:
    'A century over open flame. From a single tandoor in 1924 to a cloud kitchen serving thousands of families across Bengaluru.',
  openGraph: {
    title: 'Our Story — Hearth & Ember',
    description:
      'From a single tandoor in 1924 to a cloud kitchen serving thousands — the fire has never gone out.',
    type: 'website',
  },
};

export default function OurStoryPage() {
  return (
    <PageTransition>
      <StoryHero />
      <Timeline />
      <Values />
      <ChefCards />
      <Process />
      <StoryCTA />
    </PageTransition>
  );
}
