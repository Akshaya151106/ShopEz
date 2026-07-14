export const initialProducts = [
  {
    id: 1,
    name: 'NeoBeats Wireless Headphones',
    category: 'Audio',
    description: 'Immersive sound with long battery life and noise isolation for everyday listening.',
    price: 129.99,
    discount: 20,
    rating: 4.7,
    ratingCount: 38,
    stock: 14,
    tag: 'HOT DEAL',
    image: '/assets/headphones-1.jpg',
    images: ['/assets/headphones-1.jpg', '/assets/headphones-2.jpg']
  },
  {
    id: 2,
    name: 'AeroBuds Pro Wireless Earbuds',
    category: 'Audio',
    description: 'Compact earbuds with rich bass, adaptive ANC, and a comfortable fit for all-day wear.',
    price: 99.99,
    discount: 15,
    rating: 4.4,
    ratingCount: 22,
    stock: 26,
    tag: 'BESTSELLER',
    image: '/assets/earbuds-1.jpg',
    images: ['/assets/earbuds-1.jpg', '/assets/earbuds-2.jpg']
  },
  {
    id: 3,
    name: 'ZenFlow Smart Humidifier',
    category: 'Home',
    description: 'Smart humidifier with whisper-quiet operation and app controls for healthier indoor air.',
    price: 59.99,
    discount: 0,
    rating: 4.2,
    ratingCount: 14,
    stock: 18,
    tag: 'NEW RELEASE',
    image: '/assets/humidifier-1.jpg',
    images: ['/assets/humidifier-1.jpg', '/assets/humidifier-2.jpg']
  },
  {
    id: 4,
    name: 'Lumina Minimalist Desk Lamp',
    category: 'Lifestyle',
    description: 'A sleek desk lamp with touch dimming, color presets, and modern minimalist design.',
    price: 42.5,
    discount: 10,
    rating: 4.6,
    ratingCount: 19,
    stock: 12,
    tag: 'TRENDING',
    image: '/assets/lamp-1.jpg',
    images: ['/assets/lamp-1.jpg', '/assets/lamp-2.jpg']
  }
];

export const initialReviews = [
  {
    id: 101,
    productId: 1,
    author: 'Ava Martinez',
    rating: 5,
    comment: 'These headphones feel premium and the battery lasts all day. Highly recommend!',
    date: '2026-06-12'
  },
  {
    id: 102,
    productId: 2,
    author: 'Noah Patel',
    rating: 4,
    comment: 'Great sound for the price and the noise cancellation is solid.',
    date: '2026-06-08'
  },
  {
    id: 103,
    productId: 4,
    author: 'Mia Johnson',
    rating: 5,
    comment: 'The lamp looks beautiful on my desk and the touch controls are easy to use.',
    date: '2026-05-28'
  }
];

export const initialOrders = [
  {
    orderId: 'ORD-7A9F2C',
    customerName: 'Alex Parker',
    email: 'alex.parker@example.com',
    address: '218 Harbor Street, Metropolis, CA 90210',
    items: [
      { productId: 1, name: 'NeoBeats Wireless Headphones', price: 129.99, quantity: 1 }
    ],
    subtotal: 129.99,
    discountAmount: 25.99,
    total: 104.0,
    date: '2026-06-18T14:22:00.000Z'
  }
];

export const initialUsers = [
  {
    username: 'alex',
    password: 'password123',
    fullName: 'Alex Parker',
    email: 'alex.parker@example.com'
  }
];
