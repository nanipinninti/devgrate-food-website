export type SpiceLevel = 1 | 2 | 3;

export type MenuCategory =
  | 'Starters'
  | 'Mains'
  | 'Biryani & Rice'
  | 'Desserts'
  | 'Beverages';

export interface AddOn {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  image: string;
  isVeg: boolean;
  isBestseller: boolean;
  prepTime: number;
  spiceLevel: SpiceLevel;
  rating: number;
  gallery?: string[];
  ingredients?: string[];
  allergens?: string[];
  calories?: number;
  serves?: string;
  story?: string;
  addOns?: AddOn[];
}

export const menuCategories: MenuCategory[] = [
  'Starters',
  'Mains',
  'Biryani & Rice',
  'Desserts',
  'Beverages',
];

export const menu: MenuItem[] = [
  {
    id: 'st-001',
    name: 'Ember-Roasted Paneer Tikka',
    description:
      'Cottage cheese marinated in yogurt and crushed spices, charred over open flame.',
    price: 280,
    category: 'Starters',
    image:
      'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&q=80',
    isVeg: true,
    isBestseller: true,
    prepTime: 20,
    spiceLevel: 2,
    rating: 4.8,
    gallery: [
      'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&q=80',
      'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&q=80',
      'https://images.unsplash.com/photo-1625938145744-533f82c2f9a4?w=800&q=80',
    ],
    ingredients: ['Cottage cheese', 'Yogurt', 'Ginger-garlic paste', 'Red chili powder', 'Garam masala', 'Bell peppers', 'Lemon juice', 'Coriander'],
    allergens: ['Dairy', 'Gluten'],
    calories: 320,
    serves: 'Serves 1-2',
    story: 'Marinated twice for depth, then kissed by real charcoal flame — the way our tandoor master has done it since 1924.',
    addOns: [
      { id: 'addon-st001-1', name: 'Extra mint chutney', price: 30 },
      { id: 'addon-st001-2', name: 'Tandoori roti (2 pcs)', price: 40 },
      { id: 'addon-st001-3', name: 'Pickled onions', price: 20 },
    ],
  },
  {
    id: 'st-002',
    name: 'Smoked Chicken Chaat',
    description:
      'Shredded tandoori chicken tossed with onions, chutneys, and a hint of smoke.',
    price: 220,
    category: 'Starters',
    image:
      'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&q=80',
    isVeg: false,
    isBestseller: false,
    prepTime: 15,
    spiceLevel: 2,
    rating: 4.6,
    gallery: [
      'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&q=80',
      'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&q=80',
      'https://images.unsplash.com/photo-1625938145744-533f82c2f9a4?w=800&q=80',
    ],
    ingredients: ['Chicken', 'Red onion', 'Tamarind chutney', 'Mint chutney', 'Pomegranate seeds', 'Chickpea flour noodles', 'Yogurt', 'Chaat masala'],
    allergens: ['Dairy', 'Gluten'],
    calories: 280,
    serves: 'Serves 1',
    story: 'A street-food classic reimagined — the smoke comes from a real charcoal pipe, not a bottle.',
    addOns: [
      { id: 'addon-st002-1', name: 'Extra sev (crispy noodles)', price: 25 },
      { id: 'addon-st002-2', name: 'Extra yogurt drizzle', price: 20 },
    ],
  },
  {
    id: 'st-003',
    name: 'Crispy Corn Kurkure',
    description:
      'Golden fried corn kernels tossed with bell peppers and crushed garlic.',
    price: 190,
    category: 'Starters',
    image:
      'https://images.unsplash.com/photo-1625938145744-533f82c2f9a4?w=800&q=80',
    isVeg: true,
    isBestseller: false,
    prepTime: 12,
    spiceLevel: 1,
    rating: 4.5,
    gallery: [
      'https://images.unsplash.com/photo-1625938145744-533f82c2f9a4?w=800&q=80',
      'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&q=80',
      'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&q=80',
    ],
    ingredients: ['Sweet corn', 'Bell peppers', 'Garlic', 'Green chili', 'Spring onion', 'Cornflour', 'Salt', 'Black pepper'],
    allergens: ['Gluten'],
    calories: 240,
    serves: 'Serves 1-2',
    story: 'A crunch that echoes through the dining room — fried fresh, never from a freezer.',
    addOns: [
      { id: 'addon-st003-1', name: 'Extra garlic dip', price: 25 },
      { id: 'addon-st003-2', name: 'Chili sauce on side', price: 15 },
    ],
  },
  {
    id: 'mn-001',
    name: 'Hearth-Special Butter Chicken',
    description:
      'Tender chicken simmered in a rich tomato gravy with butter and cream.',
    price: 380,
    category: 'Mains',
    image:
      'https://images.unsplash.com/photo-1588166524941-3bf61a9c81db?w=800&q=80',
    isVeg: false,
    isBestseller: true,
    prepTime: 30,
    spiceLevel: 2,
    rating: 4.9,
    gallery: [
      'https://images.unsplash.com/photo-1588166524941-3bf61a9c81db?w=800&q=80',
      'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80',
      'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&q=80',
    ],
    ingredients: ['Chicken', 'Tomato', 'Butter', 'Cream', 'Ginger-garlic paste', 'Garam masala', 'Red chili powder', 'Cashew paste', 'Fenugreek leaves'],
    allergens: ['Dairy', 'Nuts'],
    calories: 540,
    serves: 'Serves 2-3',
    story: 'Our most ordered dish. The gravy simmers for two hours — patience is the secret ingredient.',
    addOns: [
      { id: 'addon-mn001-1', name: 'Butter naan (2 pcs)', price: 60 },
      { id: 'addon-mn001-2', name: 'Extra gravy', price: 50 },
      { id: 'addon-mn001-3', name: 'Steamed rice', price: 70 },
      { id: 'addon-mn001-4', name: 'Raita', price: 40 },
    ],
  },
  {
    id: 'mn-002',
    name: 'Slow-Cooked Dal Makhani',
    description:
      'Black lentils cooked overnight over charcoal embers with butter and cream.',
    price: 260,
    category: 'Mains',
    image:
      'https://images.unsplash.com/photo-1626500155730-efb2a8c6c5b9?w=800&q=80',
    isVeg: true,
    isBestseller: true,
    prepTime: 25,
    spiceLevel: 1,
    rating: 4.7,
    gallery: [
      'https://images.unsplash.com/photo-1626500155730-efb2a8c6c5b9?w=800&q=80',
      'https://images.unsplash.com/photo-1631452180519-c014fe978146?w=800&q=80',
      'https://images.unsplash.com/photo-1588166524941-3bf61a9c81db?w=800&q=80',
    ],
    ingredients: ['Black urad dal', 'Rajma', 'Butter', 'Cream', 'Tomato', 'Ginger-garlic paste', 'Garam masala', 'Fenugreek leaves'],
    allergens: ['Dairy'],
    calories: 380,
    serves: 'Serves 2',
    story: 'Cooked on charcoal embers overnight — the kind of patience only a century-old kitchen knows.',
    addOns: [
      { id: 'addon-mn002-1', name: 'Butter naan (2 pcs)', price: 60 },
      { id: 'addon-mn002-2', name: 'Steamed rice', price: 70 },
      { id: 'addon-mn002-3', name: 'Jeera rice', price: 80 },
    ],
  },
  {
    id: 'mn-003',
    name: 'Rogan Josh',
    description:
      'Aromatic lamb curry with Kashmiri chilies, cardamom, and bay leaves.',
    price: 420,
    category: 'Mains',
    image:
      'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80',
    isVeg: false,
    isBestseller: false,
    prepTime: 35,
    spiceLevel: 3,
    rating: 4.7,
    gallery: [
      'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80',
      'https://images.unsplash.com/photo-1588166524941-3bf61a9c81db?w=800&q=80',
      'https://images.unsplash.com/photo-1626500155730-efb2a8c6c5b9?w=800&q=80',
    ],
    ingredients: ['Lamb', 'Kashmiri chili', 'Cardamom', 'Cinnamon', 'Bay leaves', 'Yogurt', 'Ginger-garlic paste', 'Fennel powder', 'Garam masala'],
    allergens: ['Dairy'],
    calories: 480,
    serves: 'Serves 2',
    story: 'A recipe walked from Kashmir to Bengaluru in 1947. We have not changed a single spice since.',
    addOns: [
      { id: 'addon-mn003-1', name: 'Saffron rice', price: 90 },
      { id: 'addon-mn003-2', name: 'Tandoori roti (2 pcs)', price: 40 },
      { id: 'addon-mn003-3', name: 'Raita', price: 40 },
    ],
  },
  {
    id: 'mn-004',
    name: 'Kadai Paneer Masala',
    description:
      'Cottage cheese and peppers in a fiery kadai gravy with freshly ground spices.',
    price: 300,
    category: 'Mains',
    image:
      'https://images.unsplash.com/photo-1631452180519-c014fe978146?w=800&q=80',
    isVeg: true,
    isBestseller: false,
    prepTime: 22,
    spiceLevel: 3,
    rating: 4.6,
    gallery: [
      'https://images.unsplash.com/photo-1631452180519-c014fe978146?w=800&q=80',
      'https://images.unsplash.com/photo-1626500155730-efb2a8c6c5b9?w=800&q=80',
      'https://images.unsplash.com/photo-1588166524941-3bf61a9c81db?w=800&q=80',
    ],
    ingredients: ['Cottage cheese', 'Bell peppers', 'Onion', 'Tomato', 'Coriander seeds', 'Red chili', 'Ginger-garlic paste', 'Kadai masala', 'Cream'],
    allergens: ['Dairy'],
    calories: 360,
    serves: 'Serves 2',
    story: 'The kadai is seasoned with years of spice. We grind the masala fresh for every order.',
    addOns: [
      { id: 'addon-mn004-1', name: 'Butter naan (2 pcs)', price: 60 },
      { id: 'addon-mn004-2', name: 'Jeera rice', price: 80 },
      { id: 'addon-mn004-3', name: 'Laccha paratha (2 pcs)', price: 50 },
    ],
  },
  {
    id: 'br-001',
    name: 'Hearth Signature Dum Biryani',
    description:
      'Long-grain basmati layered with marinated chicken, saffron, and mint, sealed and cooked over dum.',
    price: 340,
    category: 'Biryani & Rice',
    image:
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80',
    isVeg: false,
    isBestseller: true,
    prepTime: 40,
    spiceLevel: 2,
    rating: 4.9,
    gallery: [
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80',
      'https://images.unsplash.com/photo-1606491956687-8e76de73a8fd?w=800&q=80',
      'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&q=80',
    ],
    ingredients: ['Basmati rice', 'Chicken', 'Saffron', 'Mint', 'Fried onion', 'Yogurt', 'Ginger-garlic paste', 'Whole spices', 'Ghee'],
    allergens: ['Dairy'],
    calories: 620,
    serves: 'Serves 1-2',
    story: 'Sealed with dough and cooked on dum — the oldest technique in our kitchen, still the best.',
    addOns: [
      { id: 'addon-br001-1', name: 'Extra raita', price: 40 },
      { id: 'addon-br001-2', name: 'Mirchi salan', price: 50 },
      { id: 'addon-br001-3', name: 'Extra gravy', price: 50 },
    ],
  },
  {
    id: 'br-002',
    name: 'Veg Dum Biryani',
    description:
      'Fragrant basmati with seasonal vegetables, fried onions, and biryani masala.',
    price: 260,
    category: 'Biryani & Rice',
    image:
      'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&q=80',
    isVeg: true,
    isBestseller: false,
    prepTime: 35,
    spiceLevel: 2,
    rating: 4.5,
    gallery: [
      'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&q=80',
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80',
      'https://images.unsplash.com/photo-1606491956687-8e76de73a8fd?w=800&q=80',
    ],
    ingredients: ['Basmati rice', 'Mixed vegetables', 'Saffron', 'Mint', 'Fried onion', 'Yogurt', 'Biryani masala', 'Ghee', 'Cashews'],
    allergens: ['Dairy', 'Nuts'],
    calories: 480,
    serves: 'Serves 1-2',
    story: 'Every vegetable is layered separately so each bite carries a different note.',
    addOns: [
      { id: 'addon-br002-1', name: 'Extra raita', price: 40 },
      { id: 'addon-br002-2', name: 'Paneer tikka (4 pcs)', price: 80 },
    ],
  },
  {
    id: 'br-003',
    name: 'Mutton Biryani',
    description:
      'Tender mutton and basmati rice slow-cooked with whole spices and saffron.',
    price: 400,
    category: 'Biryani & Rice',
    image:
      'https://images.unsplash.com/photo-1606491956687-8e76de73a8fd?w=800&q=80',
    isVeg: false,
    isBestseller: false,
    prepTime: 45,
    spiceLevel: 3,
    rating: 4.8,
    gallery: [
      'https://images.unsplash.com/photo-1606491956687-8e76de73a8fd?w=800&q=80',
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80',
      'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&q=80',
    ],
    ingredients: ['Basmati rice', 'Mutton', 'Saffron', 'Mint', 'Fried onion', 'Yogurt', 'Whole spices', 'Ghee', 'Ginger-garlic paste'],
    allergens: ['Dairy'],
    calories: 680,
    serves: 'Serves 1-2',
    story: 'The mutton is marinated for twelve hours. The rice waits for the meat, never the other way around.',
    addOns: [
      { id: 'addon-br003-1', name: 'Extra raita', price: 40 },
      { id: 'addon-br003-2', name: 'Mirchi salan', price: 50 },
      { id: 'addon-br003-3', name: 'Shahi tukda (dessert)', price: 60 },
    ],
  },
  {
    id: 'ds-001',
    name: 'Emmer Phirni',
    description:
      'Coarse rice pudding infused with cardamom and rose, served in earthen cups.',
    price: 160,
    category: 'Desserts',
    image:
      'https://images.unsplash.com/photo-1605197181614-c62a1433eab5?w=800&q=80',
    isVeg: true,
    isBestseller: false,
    prepTime: 10,
    spiceLevel: 1,
    rating: 4.6,
    gallery: [
      'https://images.unsplash.com/photo-1605197181614-c62a1433eab5?w=800&q=80',
      'https://images.unsplash.com/photo-1601303208024-72de3e3f2963?w=800&q=80',
      'https://images.unsplash.com/photo-1559054663-e8e5435f0633?w=800&q=80',
    ],
    ingredients: ['Coarse rice', 'Milk', 'Sugar', 'Cardamom', 'Rose water', 'Almonds', 'Pistachios', 'Saffron'],
    allergens: ['Dairy', 'Nuts'],
    calories: 220,
    serves: 'Serves 1',
    story: 'Ground by hand and set in earthen cups — the cup gives it an earthy breath you cannot replicate in ceramic.',
    addOns: [
      { id: 'addon-ds001-1', name: 'Extra pistachio topping', price: 20 },
      { id: 'addon-ds001-2', name: 'Rose petals garnish', price: 15 },
    ],
  },
  {
    id: 'ds-002',
    name: 'Warm Gulab Jamun',
    description:
      'Golden-fried milk dumplings soaked in saffron syrup, served warm.',
    price: 140,
    category: 'Desserts',
    image:
      'https://images.unsplash.com/photo-1601303208024-72de3e3f2963?w=800&q=80',
    isVeg: true,
    isBestseller: true,
    prepTime: 8,
    spiceLevel: 1,
    rating: 4.9,
    gallery: [
      'https://images.unsplash.com/photo-1601303208024-72de3e3f2963?w=800&q=80',
      'https://images.unsplash.com/photo-1605197181614-c62a1433eab5?w=800&q=80',
      'https://images.unsplash.com/photo-1559054663-e8e5435f0633?w=800&q=80',
    ],
    ingredients: ['Milk solids (khoya)', 'Refined flour', 'Sugar', 'Saffron', 'Cardamom', 'Rose water', 'Ghee'],
    allergens: ['Dairy', 'Gluten'],
    calories: 260,
    serves: 'Serves 1 (2 pieces)',
    story: 'Fried to order, soaked warm — never from a can. The syrup carries a thread of saffron in every drop.',
    addOns: [
      { id: 'addon-ds002-1', name: 'Extra syrup', price: 15 },
      { id: 'addon-ds002-2', name: 'Vanilla ice cream scoop', price: 50 },
    ],
  },
  {
    id: 'ds-003',
    name: 'Saffron Kulfi',
    description:
      'Dense, slow-churned milk ice cream with saffron, pistachios, and rose petals.',
    price: 150,
    category: 'Desserts',
    image:
      'https://images.unsplash.com/photo-1559054663-e8e5435f0633?w=800&q=80',
    isVeg: true,
    isBestseller: false,
    prepTime: 5,
    spiceLevel: 1,
    rating: 4.7,
    gallery: [
      'https://images.unsplash.com/photo-1559054663-e8e5435f0633?w=800&q=80',
      'https://images.unsplash.com/photo-1601303208024-72de3e3f2963?w=800&q=80',
      'https://images.unsplash.com/photo-1605197181614-c62a1433eab5?w=800&q=80',
    ],
    ingredients: ['Milk', 'Cream', 'Sugar', 'Saffron', 'Pistachios', 'Rose petals', 'Cardamom'],
    allergens: ['Dairy', 'Nuts'],
    calories: 200,
    serves: 'Serves 1',
    story: 'Stretched and folded by hand for four hours — no machine can match the texture that patience gives.',
    addOns: [
      { id: 'addon-ds003-1', name: 'Falooda noodles', price: 30 },
      { id: 'addon-ds003-2', name: 'Rose syrup drizzle', price: 20 },
    ],
  },
  {
    id: 'bv-001',
    name: 'Charcoal-Smoked Chai',
    description:
      'Strong Assam tea brewed with milk and a whisper of charcoal smoke.',
    price: 80,
    category: 'Beverages',
    image:
      'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=800&q=80',
    isVeg: true,
    isBestseller: false,
    prepTime: 8,
    spiceLevel: 1,
    rating: 4.5,
    gallery: [
      'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=800&q=80',
      'https://images.unsplash.com/photo-1626078430990-8ca65bd57ffd?w=800&q=80',
      'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80',
    ],
    ingredients: ['Assam tea leaves', 'Milk', 'Sugar', 'Ginger', 'Cardamom', 'Charcoal smoke'],
    allergens: ['Dairy'],
    calories: 120,
    serves: 'Serves 1',
    story: 'The smoke is real — a charcoal ember is dropped into the pot for a second, then lifted out. Just a whisper.',
    addOns: [
      { id: 'addon-bv001-1', name: 'Extra ginger', price: 10 },
      { id: 'addon-bv001-2', name: 'Biscuits (4 pcs)', price: 25 },
    ],
  },
  {
    id: 'bv-002',
    name: 'Rose Lassi',
    description:
      'Thick yogurt blended with rose syrup and crushed ice, topped with dried rose petals.',
    price: 100,
    category: 'Beverages',
    image:
      'https://images.unsplash.com/photo-1626078430990-8ca65bd57ffd?w=800&q=80',
    isVeg: true,
    isBestseller: true,
    prepTime: 5,
    spiceLevel: 1,
    rating: 4.7,
    gallery: [
      'https://images.unsplash.com/photo-1626078430990-8ca65bd57ffd?w=800&q=80',
      'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=800&q=80',
      'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80',
    ],
    ingredients: ['Yogurt', 'Rose syrup', 'Sugar', 'Crushed ice', 'Dried rose petals', 'Milk'],
    allergens: ['Dairy'],
    calories: 180,
    serves: 'Serves 1',
    story: 'Hand-churned in a clay pot — the old way. The rose is from our own syrup, not a bottle.',
    addOns: [
      { id: 'addon-bv002-1', name: 'Extra rose petals', price: 15 },
      { id: 'addon-bv002-2', name: 'Honey instead of sugar', price: 20 },
    ],
  },
  {
    id: 'bv-003',
    name: 'Spiced Cold Coffee',
    description:
      'Slow-brewed coffee with cardamom and cinnamon over crushed ice.',
    price: 120,
    category: 'Beverages',
    image:
      'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80',
    isVeg: true,
    isBestseller: false,
    prepTime: 6,
    spiceLevel: 1,
    rating: 4.4,
    gallery: [
      'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80',
      'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=800&q=80',
      'https://images.unsplash.com/photo-1626078430990-8ca65bd57ffd?w=800&q=80',
    ],
    ingredients: ['Coffee beans', 'Milk', 'Sugar', 'Cardamom', 'Cinnamon', 'Ice', 'Cream'],
    allergens: ['Dairy'],
    calories: 150,
    serves: 'Serves 1',
    story: 'Brewed cold for twelve hours, then spiced at the last moment so the aromatics stay bright.',
    addOns: [
      { id: 'addon-bv003-1', name: 'Extra shot', price: 30 },
      { id: 'addon-bv003-2', name: 'Whipped cream', price: 25 },
    ],
  },
];
