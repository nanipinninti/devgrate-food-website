export interface TimelineMilestone {
  year: string;
  title: string;
  description: string;
}

export const timeline: TimelineMilestone[] = [
  {
    year: '1924',
    title: 'The First Hearth',
    description:
      'A single tandoor, a borrowed room, and a recipes handed down through three generations of the Rathore family.',
  },
  {
    year: '1951',
    title: 'The Recipe Book',
    description:
      'The family recipes were committed to ink in a leather-bound book that still sits in our kitchen today.',
  },
  {
    year: '1978',
    title: 'Second Generation',
    description:
      'Vikas Rathore Sr. took the reins, introducing charcoal-fired cooking techniques from Lucknow.',
  },
  {
    year: '1999',
    title: 'Home Catering Begins',
    description:
      'Word spread. What began as weekend catering for neighbours became a full-time calling.',
  },
  {
    year: '2019',
    title: 'The Cloud Kitchen',
    description:
      'We moved to a dedicated cloud kitchen on MG Road, bringing the hearth to thousands of doors.',
  },
  {
    year: '2025',
    title: '10,000+ Families',
    description:
      'Today we serve over ten thousand families across Bengaluru, still cooking over open flame.',
  },
];

export interface StoryValue {
  icon: string;
  title: string;
  description: string;
}

export const storyValues: StoryValue[] = [
  {
    icon: 'flame',
    title: 'Fire First',
    description:
      'Every dish is cooked over open flame or charcoal. No induction coils, no shortcuts — just heat, smoke, and patience.',
  },
  {
    icon: 'layers',
    title: 'Small Batches',
    description:
      'We cook in small batches throughout the day so your order is always fresh, never sitting under a heat lamp.',
  },
  {
    icon: 'mortar',
    title: 'Honest Spices',
    description:
      'Our spices are hand-ground every morning in a stone mortar. No pre-packaged masala has ever entered our kitchen.',
  },
  {
    icon: 'package',
    title: 'Delivered Hot',
    description:
      'Heat-retaining packaging keeps your food warm for up to 45 minutes. The tandoor heat travels with you.',
  },
];

export interface KitchenStat {
  value: number;
  suffix: string;
  label: string;
}

export const kitchenStats: KitchenStat[] = [
  { value: 12, suffix: ' hrs', label: 'Of slow cooking daily' },
  { value: 40, suffix: '+', label: 'Hand-ground spices' },
  { value: 0, suffix: '', label: 'Reheated dishes, ever' },
];
