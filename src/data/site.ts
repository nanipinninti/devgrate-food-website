export interface SiteInfo {
  name: string;
  tagline: string;
  established: string;
  phone: string;
  email: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    pincode: string;
  };
  hours: {
    day: string;
    time: string;
  }[];
  deliveryZones: string[];
  social: {
    instagram: string;
    facebook: string;
    twitter: string;
    youtube: string;
  };
}

export const site: SiteInfo = {
  name: 'Hearth & Ember',
  tagline: 'Cooked with fire. Delivered with care.',
  established: '1924',
  phone: '+91 80 4567 8910',
  email: 'orders@hearthandember.in',
  address: {
    line1: 'Cloud Kitchen, 14 MG Road',
    line2: 'Ashok Nagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560001',
  },
  hours: [
    { day: 'Monday', time: '11:00 AM – 10:30 PM' },
    { day: 'Tuesday', time: '11:00 AM – 10:30 PM' },
    { day: 'Wednesday', time: '11:00 AM – 10:30 PM' },
    { day: 'Thursday', time: '11:00 AM – 10:30 PM' },
    { day: 'Friday', time: '11:00 AM – 11:30 PM' },
    { day: 'Saturday', time: '11:00 AM – 11:30 PM' },
    { day: 'Sunday', time: '12:00 PM – 10:30 PM' },
  ],
  deliveryZones: [
    'MG Road',
    'Indiranagar',
    'Koramangala',
    'HSR Layout',
    'Whitefield',
    'Jayanagar',
    'BTM Layout',
    'Ashok Nagar',
  ],
  social: {
    instagram: 'https://instagram.com/hearthandember',
    facebook: 'https://facebook.com/hearthandember',
    twitter: 'https://twitter.com/hearthandember',
    youtube: 'https://youtube.com/@hearthandember',
  },
};
