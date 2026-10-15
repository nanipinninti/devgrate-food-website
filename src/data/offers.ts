export interface Offer {
  id: string;
  title: string;
  description: string;
  couponCode: string;
  discount: string;
  discountType?: {
    type: 'percentage' | 'flat';
    value: number;
    maxCap?: number;
  };
  validUntil: string;
  minOrder: number;
}

export const offers: Offer[] = [
  {
    id: 'offer-001',
    title: 'First Ember',
    description:
      'Light up your first order with 20% off. Because every great fire starts with a single spark.',
    couponCode: 'FIRSTEMBER20',
    discount: '20% OFF',
    discountType: { type: 'percentage', value: 20, maxCap: 150 },
    validUntil: '2024-12-31',
    minOrder: 300,
  },
  {
    id: 'offer-002',
    title: 'Sunday Feast',
    description:
      'Gather the table. Order above Rs. 600 on any Sunday and receive a complimentary Gulab Jamun for everyone.',
    couponCode: 'SUNDAYFEAST',
    discount: 'Free Dessert',
    validUntil: '2024-12-31',
    minOrder: 600,
  },
  {
    id: 'offer-003',
    title: 'Ember Express',
    description:
      'Flat Rs. 75 off on orders above Rs. 450. Quick lunch, slow-cooked flavor, delivered fast.',
    couponCode: 'EMBER75',
    discount: 'Rs. 75 OFF',
    discountType: { type: 'flat', value: 75 },
    validUntil: '2024-11-30',
    minOrder: 450,
  },
  {
    id: 'offer-004',
    title: 'First Bite',
    description: '10% off your first order, no minimum. A small welcome from our kitchen to yours.',
    couponCode: 'FIRSTBITE',
    discount: '10% OFF',
    discountType: { type: 'percentage', value: 10, maxCap: 100 },
    validUntil: '2024-12-31',
    minOrder: 0,
  },
];
