// Categories used by the Shop filters and by the Home page category tiles.
export const categoryNames = [
  "Men's Fashion",
  "Women's Fashion",
  'Footwear',
  'Electronics',
  'Accessories',
  'Beauty',
];

// Each home-page tile covers one or more product categories.
export const categoryTiles = [
  {
    key: 'fashion',
    title: 'Fashion',
    description: 'Clothing and footwear',
    image: '/images/categories/fashion.jpg',
    categories: ["Men's Fashion", "Women's Fashion", 'Footwear'],
  },
  {
    key: 'electronics',
    title: 'Electronics',
    description: 'Watches and audio',
    image: '/images/categories/electronics.jpg',
    categories: ['Electronics'],
  },
  {
    key: 'accessories',
    title: 'Accessories',
    description: 'Bags and eyewear',
    image: '/images/categories/accessories.jpg',
    categories: ['Accessories'],
  },
  {
    key: 'beauty',
    title: 'Beauty',
    description: 'Fragrance and skincare',
    image: '/images/categories/beauty.jpg',
    categories: ['Beauty'],
  },
];
