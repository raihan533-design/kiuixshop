import { Product, CustomerReview, CurrencyConfig, Currency, CategoryItem } from '../types';

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  { id: 'all', label: 'All Categories' },
];

export const CURRENCIES: Record<Currency, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', rate: 1 },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92 },
  GBP: { code: 'GBP', symbol: '£', rate: 0.78 },
};

export const PRODUCTS: Product[] = [
  {
    id: 'kiuix-pulse-anc',
    name: 'KIUIX Pulse Pro Wireless ANC',
    tagline: 'Hybrid Active Noise Cancelling Headphone with Studio Fidelity',
    price: 189,
    originalPrice: 249,
    rating: 4.9,
    reviewCount: 168,
    category: 'audio',
    categoryLabel: 'Audio & Sound',
    badge: 'BEST SELLER',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80',
    description: 'Experience pure sonic isolation with the KIUIX Pulse Pro. Featuring custom 40mm beryllium drivers, active hybrid noise cancellation up to 42dB, ultra-soft protein leather ear cushions, and up to 55 hours of playback on a single charge.',
    features: [
      '42dB Hybrid Active Noise Cancellation with Transparency Mode',
      'Custom 40mm Beryllium Acoustic Transducers',
      '55-Hour Long Endurance Battery (Fast Charge 10min = 5hrs)',
      'Multipoint Bluetooth 5.3 + Ultra-Low Latency Gaming Mode',
      'Aircraft-grade anodized aluminum frame & memory foam cushions'
    ],
    specs: {
      'Driver Size': '40mm Dynamic Beryllium',
      'Frequency Response': '15Hz - 40,000Hz (Hi-Res Audio)',
      'Battery Life': '55 hours (ANC Off) / 42 hours (ANC On)',
      'Charging': 'USB-C Fast Charging (1.5 hrs full)',
      'Weight': '248g'
    },
    colors: [
      { name: 'Obsidian Black', hex: '#0a0a0c', inStock: true },
      { name: 'Cobalt Blue', hex: '#1d39f5', inStock: true },
      { name: 'Arctic White', hex: '#f8fafc', inStock: true }
    ],
    inStock: true,
    stockCount: 24
  },
  {
    id: 'kiuix-magflow-dock',
    name: 'KIUIX MagFlow 3-in-1 Charging Station',
    tagline: 'Precision CNC Aluminum Magnetic Wireless Dock for Apple & Android',
    price: 79,
    originalPrice: 99,
    rating: 4.8,
    reviewCount: 114,
    category: 'chargers',
    categoryLabel: 'Power & Charging',
    badge: 'FEATURED',
    image: 'https://images.unsplash.com/photo-1622445262464-84b1456045b6?w=800&auto=format&fit=crop&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&auto=format&fit=crop&q=80',
    description: 'Declutter your desk with the KIUIX MagFlow. Fast-charge your smartphone (15W MagSafe compatible), smartwatch (5W), and wireless earbuds (5W) simultaneously on a solid aerospace-grade aluminum mount.',
    features: [
      '15W Fast Qi2 Magnetic Charging with exact alignment',
      'Simultaneous 3-device smart power allocation',
      'Precision CNC milled aluminum alloy with weighted non-slip base',
      'Built-in thermal safety guard & foreign object detection',
      'Foldable travel-ready design with 45° adjustable viewing angle'
    ],
    specs: {
      'Total Output': '25W Max Distributed',
      'Input': 'USB-C PD 3.0 (30W adapter recommended)',
      'Compatibility': 'iPhone 12-16 Series, AirPods, Apple Watch & Qi-enabled devices',
      'Dimensions': '142 x 78 x 120 mm',
      'Weight': '310g'
    },
    colors: [
      { name: 'Space Black', hex: '#111827', inStock: true },
      { name: 'Electric Blue', hex: '#1d39f5', inStock: true },
      { name: 'Silver Matte', hex: '#e2e8f0', inStock: true }
    ],
    inStock: true,
    stockCount: 42
  },
  {
    id: 'kiuix-stealth-keyboard',
    name: 'KIUIX Stealth 75% Gasket Mechanical Keyboard',
    tagline: 'Custom Sound-Dampened Hot-Swappable Wireless Keyboard',
    price: 139,
    originalPrice: 175,
    rating: 5.0,
    reviewCount: 92,
    category: 'desk',
    categoryLabel: 'Desk Setup',
    badge: 'HOT DEAL',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=80',
    description: 'The pinnacle of typing satisfaction. The KIUIX Stealth features a flex-cut PC plate, poron foam gasket isolation, factory-lubed linear switches, and dye-sublimated PBT keycaps in the signature KIUIX monochrome & electric blue motif.',
    features: [
      'Multi-layer Poron acoustic dampening for deep creamy typing sound',
      'Hot-swappable 5-pin PCB for endless switch customization',
      'Tri-mode connectivity: 2.4GHz wireless, Bluetooth 5.1 & USB-C wired',
      'Custom aluminum CNC volume rotary control knob',
      'South-facing per-key RGB backlighting with dynamic reactive animations'
    ],
    specs: {
      'Layout': '75% Compact (81 Keys + Rotary Knob)',
      'Switch Type': 'Pre-lubed KIUIX Glaze Linear (45g actuation)',
      'Battery': '4,000mAh (Up to 200 hours without RGB)',
      'Keycaps': 'Double-shot PBT Cherry Profile',
      'OS Support': 'Windows, macOS, iOS, Android'
    },
    colors: [
      { name: 'Minimalist Black & Blue', hex: '#090a0f', inStock: true },
      { name: 'Glacier White', hex: '#f8fafc', inStock: true }
    ],
    inStock: true,
    stockCount: 15
  },
  {
    id: 'kiuix-apex-mouse',
    name: 'KIUIX Apex Ultralight Wireless Gaming Mouse',
    tagline: '52-Gram Wireless Mouse with 26,000 DPI PAW3395 Sensor',
    price: 89,
    originalPrice: 109,
    rating: 4.9,
    reviewCount: 78,
    category: 'desk',
    categoryLabel: 'Desk Setup',
    badge: 'NEW',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80',
    description: 'Flawless precision engineered for high-performance esports and productive work. Weighing only 52 grams with solid shell construction, optical micro-switches rated for 90 million clicks, and pure PTFE virgin feet.',
    features: [
      'PixArt PAW3395 Optical Sensor with 26,000 DPI & 650 IPS tracking',
      'Ultralight 52g non-hole shell for structural rigidity',
      'True 4K Hz polling rate wireless dongle included',
      'Lag-free Nordic 52840 MCU low-power wireless transmission',
      'Customized KIUIX companion software for DPI, macros, and debounce'
    ],
    specs: {
      'Weight': '52g ± 2g',
      'Sensor': 'PixArt PAW3395',
      'Battery Life': '90 hours at 1000Hz polling rate',
      'Switches': 'TTC Gold Optical (Zero debounce delay)',
      'Cable': '1.8m Paracord Superflex Type-C'
    },
    colors: [
      { name: 'Deep Black', hex: '#090a0f', inStock: true },
      { name: 'Electric Blue Accent', hex: '#1d39f5', inStock: true },
      { name: 'Pure Chalk', hex: '#ffffff', inStock: true }
    ],
    inStock: true,
    stockCount: 30
  },
  {
    id: 'kiuix-hypercharge-100w',
    name: 'KIUIX HyperCharge 100W GaN III Fast Charger',
    tagline: 'Pocket-Sized 4-Port Fast Charger for Laptops, Phones & Tablets',
    price: 54,
    originalPrice: 69,
    rating: 4.8,
    reviewCount: 135,
    category: 'chargers',
    categoryLabel: 'Power & Charging',
    badge: 'BEST SELLER',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=800&auto=format&fit=crop&q=80',
    description: 'Replace all bulky brick chargers with one sleek device. Powered by cutting-edge Gallium Nitride (GaN III) technology, this 100W powerhouse can fast-charge a 16-inch MacBook Pro to 50% in just 30 minutes while simultaneously powering 3 other devices.',
    features: [
      '100W Single Port Max Output via USB-C Power Delivery 3.0 / PPS',
      '4 Smart Ports: 3x USB-C + 1x USB-A with dynamic load balancing',
      '40% smaller and runs 30% cooler than standard silicon chargers',
      'Foldable plug pins for ultimate pocket travel convenience',
      'Universal voltage 100-240V compatible with worldwide travel plugs'
    ],
    specs: {
      'Total Output': '100W Max',
      'Ports': '3 x USB-C, 1 x USB-A',
      'Protocols': 'PD 3.0, QC 4.0+, PPS, SCP, FCP, AFC, Apple 2.4A',
      'Dimensions': '65 x 65 x 32 mm',
      'Weight': '195g'
    },
    colors: [
      { name: 'Matte Black', hex: '#18181b', inStock: true },
      { name: 'Pure White', hex: '#f8fafc', inStock: true }
    ],
    inStock: true,
    stockCount: 50
  },
  {
    id: 'kiuix-air-wallet',
    name: 'KIUIX Neo Minimalist RFID & AirTag Cardholder',
    tagline: 'Aerospace Aluminum Quick-Draw Cardholder with Cash Clip',
    price: 45,
    originalPrice: 59,
    rating: 4.7,
    reviewCount: 215,
    category: 'accessories',
    categoryLabel: 'Everyday Carry',
    badge: 'FEATURED',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1559563458-527698bf5295?w=800&auto=format&fit=crop&q=80',
    description: 'Slim down your pocket without compromise. The KIUIX Neo ejects up to 6 cards smoothly with one press of the ergonomic trigger. Built-in RFID blocking shield stops wireless electronic pickpocketing.',
    features: [
      'One-click instant tiered card deployment mechanism',
      'Certified RFID / NFC blocking frequency protection',
      'Integrated Apple AirTag compartment (never lose your wallet)',
      'Removable carbon fiber and titanium cash clip included',
      'Ultra-thin 8.5mm profile holds up to 12 cards total'
    ],
    specs: {
      'Material': '6061-T6 Aerospace-Grade Aluminum',
      'Capacity': '6 quick-deploy cards + 6 under cash clip',
      'Thickness': '8.5mm empty',
      'RFID Shield': '13.56 MHz frequency blocker',
      'Weight': '68g'
    },
    colors: [
      { name: 'Anodized Black', hex: '#090a0f', inStock: true },
      { name: 'Electric Blue Band', hex: '#1d39f5', inStock: true },
      { name: 'Gunmetal Silver', hex: '#94a3b8', inStock: true }
    ],
    inStock: true,
    stockCount: 38
  },
  {
    id: 'kiuix-desk-lightbar',
    name: 'KIUIX Horizon Ambient Smart Monitor Lightbar',
    tagline: 'Asymmetric Eye-Care Screen Light with Wireless Desktop Dial',
    price: 79,
    originalPrice: 99,
    rating: 4.9,
    reviewCount: 64,
    category: 'desk',
    categoryLabel: 'Desk Setup',
    badge: 'NEW',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
    description: 'Say goodbye to screen glare and eye strain. The KIUIX Horizon clips neatly onto any curved or flat monitor, illuminating your desk workspace with balanced, high CRI 97 color-accurate light without shining into your eyes.',
    features: [
      'Asymmetric 45° optical path eliminates screen reflection',
      'Stepless brightness (10%-100%) and color temperature (2700K - 6500K)',
      'Independent 2.4GHz wireless rotary dial controller for your desk',
      'Dual backlight mode for immersive bias lighting behind monitor',
      'Patented gravity counterweight pivot clamp fits monitors 5mm to 55mm'
    ],
    specs: {
      'Length': '465 mm (18.3 inches)',
      'Color Rendering Index': 'Ra > 97 (True daylight color)',
      'Power Input': '5V 2A USB-C (powered by monitor or PC port)',
      'Controller Battery': '2x AAA (included, 1 year life)',
      'Weight': '480g'
    },
    colors: [
      { name: 'Matte Stealth Black', hex: '#090a0f', inStock: true },
      { name: 'Moonlight Silver', hex: '#cbd5e1', inStock: true }
    ],
    inStock: true,
    stockCount: 19
  },
  {
    id: 'kiuix-tech-pouch',
    name: 'KIUIX Aero Weatherproof Tech Travel Organizer',
    tagline: 'Water-Resistant Cordura Ballistic Pouch for Cables, Drives & Gear',
    price: 39,
    originalPrice: 49,
    rating: 4.8,
    reviewCount: 95,
    category: 'accessories',
    categoryLabel: 'Everyday Carry',
    badge: 'BEST SELLER',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80',
    description: 'Tangle-free storage for the modern digital nomad. Engineered with waterproof 840D recycled nylon fabric and weather-sealed YKK Aquaguard zippers. Origami-style accordion slots expand to hold chargers, power banks, pens, and memory cards.',
    features: [
      'Origami internal divider layout stands upright on flat surfaces',
      'YKK AquaGuard weather-resistant zipper track with custom pull cords',
      'External passport slip pocket with cable passthrough for phone charging',
      'Elastic loops securely hold cables, stylus, SD cards, and dongles',
      'Reinforced grab handles and dual anchor attachment loops'
    ],
    specs: {
      'Volume': '2.2 Liters',
      'Material': '840D Weatherproof Cordura Ballistic Nylon',
      'Zippers': 'YKK Weatherproof Reversed Zippers',
      'Dimensions': '240 x 150 x 100 mm',
      'Weight': '210g'
    },
    colors: [
      { name: 'Midnight Charcoal', hex: '#18181b', inStock: true },
      { name: 'Electric Blue Lining', hex: '#1d39f5', inStock: true },
      { name: 'Glacier Grey', hex: '#94a3b8', inStock: true }
    ],
    inStock: true,
    stockCount: 45
  }
];

export const REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    author: 'Marcus Vance',
    role: 'Senior Software Engineer, Austin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    date: '3 days ago',
    title: 'The build quality blows big tech brands out of the water',
    comment: 'Ordered the KIUIX Pulse Pro ANC and the Stealth 75% keyboard. The acoustic dampening on the keyboard is heavenly, and the headphones block out all city street noise without any ear pressure. Packaging was Apple-grade.',
    verified: true,
    productName: 'KIUIX Pulse Pro Wireless ANC'
  },
  {
    id: 'rev-2',
    author: 'Elena Rostova',
    role: 'Product Designer, Berlin',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    date: '1 week ago',
    title: 'Cleanest desk setup accessory I own',
    comment: 'The Horizon lightbar with that wireless puck controller transformed my nighttime workspace. No screen reflections whatsoever. Delivery to Europe took only 3 days and the Stripe payment was seamless.',
    verified: true,
    productName: 'KIUIX Horizon Ambient Lightbar'
  },
  {
    id: 'rev-3',
    author: 'David Tan',
    role: 'Creative Director, Singapore',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    date: '2 weeks ago',
    title: 'Customer support answered in 10 minutes!',
    comment: 'Had a question regarding custom international shipping, sent a quick email to kiuixshop@gmail.com and got an immediate personalized response. The 100W GaN charger charges my MacBook Pro and camera simultaneously on shoots.',
    verified: true,
    productName: 'KIUIX HyperCharge 100W GaN'
  }
];

export const FAQ_ITEMS = [
  {
    q: 'How does KIUIX handle payments and Stripe security?',
    a: 'All transactions on KIUIXSHOP are protected by Stripe with 256-bit AES military-grade SSL encryption. We support all major Credit/Debit Cards (Visa, Mastercard, American Express), Apple Pay, Google Pay, and Link by Stripe. Your credit card information is never stored on our servers.'
  },
  {
    q: 'What is your shipping timeframe and cost?',
    a: 'We provide free expedited worldwide shipping on all orders over $50. Standard orders are dispatched within 24 hours from our fulfillment centers and delivered in 3 to 5 business days with full online door-to-door tracking.'
  },
  {
    q: 'What is the KIUIX 30-Day Guarantee & Warranty?',
    a: 'Every KIUIX product comes with a 30-day "love it or return it" no-questions-asked money-back guarantee, plus an automatic 2-year warranty covering any hardware or technical defects.'
  },
  {
    q: 'How do I contact support or track my package?',
    a: 'Our dedicated customer care team is available 24/7 directly via email at kiuixshop@gmail.com. When you complete an order, you will receive an instant tracking link and receipt.'
  },
  {
    q: 'Are custom discount promo codes supported?',
    a: 'Yes! Use promo code "KIUIX10" at checkout for an instant 10% discount on your entire order. Special VIP subscriber codes are also sent via our newsletter.'
  }
];
