import { CURRENCY } from '../config';

const priceFormatter = new Intl.NumberFormat(CURRENCY.locale, {
  style: 'currency',
  currency: CURRENCY.code,
  maximumFractionDigits: 0,
});

export const formatPrice = (value) => priceFormatter.format(value);

// Turns "/images/products/x.jpg" into a URL that works in development and
// after deployment (including GitHub Pages sub-folders).
export const assetUrl = (path) => {
  if (!path) return '';
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
};

export const getDiscountPercent = (product) =>
  product.originalPrice && product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

export const formatDate = (isoString) =>
  new Date(isoString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
