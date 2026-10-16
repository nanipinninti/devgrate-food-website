export interface TeamMember {
  id: string;
  name: string;
  title: string;
  bio: string;
  image: string;
  yearsExperience: number;
  quote: string;
  specialty: string;
  signatureDish: string;
}

export const team: TeamMember[] = [
  {
    id: 'chef-001',
    name: 'Vikas Rathore',
    title: 'Chef de Cuisine',
    bio: 'Trained in the royal kitchens of Rajasthan, Vikas brings 18 years of fire-cooked mastery to every plate. His philosophy is simple: respect the ember, and the ember will reward you.',
    image:
      'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&q=80',
    yearsExperience: 18,
    quote: 'The fire teaches you patience. You cannot rush a flame.',
    specialty: 'Charcoal-fired mains',
    signatureDish: 'Hearth-Special Butter Chicken',
  },
  {
    id: 'chef-002',
    name: 'Meera Kulkarni',
    title: 'Sous Chef',
    bio: 'Meera honed her craft across Mumbai and Pune, specializing in regional Indian desserts. Her phirni has been called the best in the city by more than one food critic.',
    image:
      'https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=600&q=80',
    yearsExperience: 12,
    quote: 'A dessert should feel like a memory you did not know you had.',
    specialty: 'Regional Indian desserts',
    signatureDish: 'Saffron Phirni with Pistachio',
  },
  {
    id: 'chef-003',
    name: 'Imran Qureshi',
    title: 'Tandoor Master',
    bio: 'A third-generation tandoor cook from Lucknow, Imran controls the charcoal pit with an intuition that borders on artistry. His seekh kebabs are the stuff of local legend.',
    image:
      'https://images.unsplash.com/photo-1583394293214-28a5b8b77e1c?w=600&q=80',
    yearsExperience: 22,
    quote: 'The tandoor is not an oven. It is a partner.',
    specialty: 'Tandoor and kebabs',
    signatureDish: 'Ember-Roasted Seekh Kebab',
  },
  {
    id: 'chef-004',
    name: 'Anita Desai',
    title: 'Patisserie Chef',
    bio: 'Anita trained at Le Cordon Bleu before returning to her roots. She bridges European technique with Indian flavor, creating desserts that feel both familiar and revelatory.',
    image:
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
    yearsExperience: 9,
    quote: 'Tradition is the base. Imagination is the garnish.',
    specialty: 'Indo-European fusion desserts',
    signatureDish: 'Cardamom Crème Brûlée',
  },
];
