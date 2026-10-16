export interface Rider {
  name: string;
  photo: string;
  rating: number;
  vehicleNumber: string;
  phone: string;
}

export const riders: Rider[] = [
  {
    name: 'Rajesh Kumar',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2f?w=200&h=200&fit=crop&q=80',
    rating: 4.8,
    vehicleNumber: 'KA-05-AB-4471',
    phone: '+91 98456 72100',
  },
  {
    name: 'Suresh Patel',
    photo: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop&q=80',
    rating: 4.9,
    vehicleNumber: 'KA-03-CD-8832',
    phone: '+91 99876 34210',
  },
  {
    name: 'Amit Singh',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&q=80',
    rating: 4.7,
    vehicleNumber: 'KA-01-EF-2299',
    phone: '+91 97400 88521',
  },
  {
    name: 'Vikram Reddy',
    photo: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop&q=80',
    rating: 4.8,
    vehicleNumber: 'KA-02-GH-5567',
    phone: '+91 90123 45678',
  },
];
