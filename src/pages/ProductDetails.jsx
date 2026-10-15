import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Heart, PackageSearch, RotateCcw, ShoppingBag, Truck } from 'lucide-react';
import SafeImage from '../components/SafeImage';
import Rating from '../components/Rating';
import QuantitySelector from '../components/QuantitySelector';
import ProductGrid from '../components/ProductGrid';
import SectionHeader from '../components/SectionHeader';
import EmptyState from '../components/EmptyState';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { useStore } from '../context/StoreContext';
import { getProductById, getRelatedProducts, isInStock } from '../data/products';
import { SHIPPING } from '../config';
import { formatPrice, getDiscountPercent } from '../utils/format';

function ProductView({ product }) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const [size, setSize] = useState('');
  const [color, setColor] = useState(product.colors[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);

  const discount = getDiscountPercent(product);
  const inStock = isInStock(product);
  const saved = isInWishlist(product.id);
  const related = getRelatedProducts(product, 4);

  const handleAdd = () => {
    if (product.sizes.length > 0 && !size) {
      setSizeError(true);
      return;
    }
    addToCart(product, { quantity, size: size || null, color: color || null });
  };

  return (
    <div className="container page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span aria-hidden="true">/</span>
        <Link to="/shop">Shop</Link>
        <span aria-hidden="true">/</span>
        <Link to={`/shop?category=${encodeURIComponent(product.category)}`}>{product.category}</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{product.name}</span>
      </nav>

      <div className="product-detail">
        <div className="product-detail__media">
          <SafeImage src={product.image} alt={product.imageAlt || product.name} className="product-detail__img" loading="eager" />
          {discount > 0 && <span className="badge badge--dark product-detail__badge">{discount}% off</span>}
        </div>

        <div className="product-detail__info">
          <p className="product-detail__category">{product.category}</p>
          <h1>{product.name}</h1>
          <Rating value={product.rating} count={product.reviews} />

          <p className="price price--lg">
            <span className="price__now">{formatPrice(product.price)}</span>
            {product.originalPrice && <s className="price__old">{formatPrice(product.originalPrice)}</s>}
            {discount > 0 && <span className="price__save">Save {formatPrice(product.originalPrice - product.price)}</span>}
          </p>

          <p className={`stock stock--${inStock ? (product.availability === 'Low Stock' ? 'low' : 'in') : 'out'}`}>
            {product.availability}
          </p>

          <p className="product-detail__desc">{product.description}</p>
          <ul className="product-detail__highlights">
            {product.highlights.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>

          {product.colors.length > 0 && (
            <fieldset className="option-group">
              <legend>Colour: <strong>{color}</strong></legend>
              <div className="option-group__list">
                {product.colors.map((item) => (
                  <button key={item} type="button" className={`option ${color === item ? 'is-active' : ''}`} aria-pressed={color === item} onClick={() => setColor(item)}>
                    {item}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          {product.sizes.length > 0 && (
            <fieldset className="option-group">
              <legend>Size{size && <>: <strong>{size}</strong></>}</legend>
              <div className="option-group__list">
                {product.sizes.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`option ${size === item ? 'is-active' : ''}`}
                    aria-pressed={size === item}
                    onClick={() => {
                      setSize(item);
                      setSizeError(false);
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
              {sizeError && <p className="field__error" role="alert">Choose a size before adding to cart.</p>}
            </fieldset>
          )}

          <div className="product-detail__buy">
            <QuantitySelector value={quantity} onChange={setQuantity} />
            <button type="button" className="btn btn--primary btn--lg product-detail__add" onClick={handleAdd} disabled={!inStock}>
              <ShoppingBag size={18} /> {inStock ? 'Add to cart' : 'Out of stock'}
            </button>
            <button
              type="button"
              className={`btn btn--outline btn--lg btn--icon ${saved ? 'is-active' : ''}`}
              onClick={() => toggleWishlist(product)}
              aria-pressed={saved}
              aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart size={18} />
            </button>
          </div>

          <ul className="product-detail__perks">
            <li><Truck size={18} aria-hidden="true" /> Free shipping above {formatPrice(SHIPPING.freeAbove)}</li>
            <li><RotateCcw size={18} aria-hidden="true" /> Easy returns within 7 days</li>
          </ul>
        </div>
      </div>

      <section className="section section--tight" aria-label="Related products">
        <SectionHeader title="You may also like" linkTo="/shop" linkLabel="Continue shopping" />
        <ProductGrid products={related} />
      </section>
    </div>
  );
}

export default function ProductDetails() {
  const { id } = useParams();
  const product = getProductById(id);
  useDocumentTitle(product ? product.name : 'Product not found');

  if (!product) {
    return (
      <div className="container page">
        <EmptyState icon={PackageSearch} title="Product not found" text="This product may have been removed or the link is incorrect.">
          <Link to="/shop" className="btn btn--primary">Browse all products</Link>
        </EmptyState>
      </div>
    );
  }

  // key= resets the size, colour and quantity when moving between products.
  return <ProductView key={product.id} product={product} />;
}
