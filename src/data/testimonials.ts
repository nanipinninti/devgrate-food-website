export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  review: string;
  date: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 't-001',
    name: 'Ananya Sharma',
    location: 'Koramangala, Bengaluru',
    rating: 5,
    review:
      'The butter chicken tasted like it came straight from a grandmothers kitchen. The smoky flavor is unreal. Hearth & Ember has become our Sunday ritual.',
    date: '2024-09-12',
  },
  {
    id: 't-002',
    name: 'Rohan Mehta',
    location: 'Indiranagar, Bengaluru',
    rating: 5,
    review:
      'That signature biryani is worth every rupee. The saffron, the mint, the long grain rice — everything is perfectly balanced. Delivered hot, every single time.',
    date: '2024-09-28',
  },
  {
    id: 't-003',
    name: 'Priya Nair',
    location: 'HSR Layout, Bengaluru',
    rating: 4,
    review:
      'The rose lassi and gulab jamun combo is a match made in heaven. Packaging is beautiful too — feels like receiving a gift rather than a delivery.',
    date: '2024-10-03',
  },
  {
    id: 't-004',
    name: 'Vikram Reddy',
    location: 'Jayanagar, Bengaluru',
    rating: 5,
    review:
      'I ordered the rogan josh for a dinner party and every guest asked for the restaurant name. The lamb was fall-apart tender and the spice level was perfect.',
    date: '2024-10-08',
  },
  {
    id: 't-005',
    name: 'Sneha Kapoor',
    location: 'Whitefield, Bengaluru',
    rating: 5,
    review:
      'As a vegetarian, finding a place that takes veg food this seriously is rare. The dal makhani is the creamiest I have had outside of a fine-dine restaurant.',
    date: '2024-10-11',
  },
  {
    id: 't-006',
    name: 'Arjun Iyer',
    location: 'BTM Layout, Bengaluru',
    rating: 4,
    review:
      'The charcoal-smoked chai is a revelation. I did not know tea could taste this deep. Delivery was on time and the food was still warm. Highly recommend.',
    date: '2024-10-14',
  },
];
