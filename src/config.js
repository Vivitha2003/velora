// Central settings. Change store details here instead of editing components.
export const BRAND = {
  name: 'VELORA',
  tagline: 'Considered essentials for everyday life',
  email: 'hello@velora.example',
  phone: '+91 98765 43210',
  address: '24 Market Road, Bengaluru, Karnataka 560001',
  hours: 'Monday to Saturday, 10 am to 6 pm',
};

export const CURRENCY = { locale: 'en-IN', code: 'INR' };

export const SHIPPING = {
  freeAbove: 2999, // orders at or above this subtotal ship free
  flatRate: 99, // otherwise this is charged
};

export const STORAGE_KEYS = {
  cart: 'velora-cart',
  wishlist: 'velora-wishlist',
  orders: 'velora-orders',
};

export const IMAGES = {
  logo: '/images/logo.png',
  hero: '/images/hero-banner.jpg',
};
