import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import SafeImage from './SafeImage';
import Rating from './Rating';
import { useStore } from '../context/StoreContext';
import { formatPrice, getDiscountPercent } from '../utils/format';
import { isInStock } from '../data/products';

export default function ProductCard({ product, onRemove }) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const saved = isInWishlist(product.id);
  const discount = getDiscountPercent(product);
  const inStock = isInStock(product);
  const needsSize = product.sizes.length > 0;

  const handleQuickAdd = () => addToCart(product, { quantity: 1, color: product.colors[0] || null });

  return (
    <article className="product-card">
      <div className="product-card__media">
        <Link to={`/product/${product.id}`} aria-label={`View ${product.name}`}>
          <SafeImage src={product.image} alt={product.imageAlt || product.name} className="product-card__img" />
        </Link>

        <div className="product-card__badges">
          {discount > 0 && <span className="badge badge--dark">{discount}% off</span>}
          {product.isNew && <span className="badge badge--light">New</span>}
          {!inStock && <span className="badge badge--light">Sold out</span>}
        </div>

        <button
          type="button"
          className={`product-card__wish ${saved ? 'is-active' : ''}`}
          onClick={() => toggleWishlist(product)}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
        >
          <Heart size={18} />
        </button>
      </div>

      <div className="product-card__body">
        <p className="product-card__category">{product.category}</p>
        <h3 className="product-card__name">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <Rating value={product.rating} count={product.reviews} />
        <p className="price">
          <span className="price__now">{formatPrice(product.price)}</span>
          {product.originalPrice && <s className="price__old">{formatPrice(product.originalPrice)}</s>}
        </p>

        <div className="product-card__actions">
          {!inStock ? (
            <Link to={`/product/${product.id}`} className="btn btn--outline btn--sm btn--block">
              View details
            </Link>
          ) : needsSize ? (
            <Link to={`/product/${product.id}`} className="btn btn--outline btn--sm btn--block">
              Select options
            </Link>
          ) : (
            <button type="button" className="btn btn--primary btn--sm btn--block" onClick={handleQuickAdd}>
              <ShoppingBag size={16} /> Add to cart
            </button>
          )}
          {onRemove && (
            <button type="button" className="text-btn" onClick={() => onRemove(product)}>
              Remove
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
