import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2 } from 'lucide-react';
import SafeImage from '../components/SafeImage';
import QuantitySelector from '../components/QuantitySelector';
import EmptyState from '../components/EmptyState';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { useStore } from '../context/StoreContext';
import { SHIPPING } from '../config';
import { formatPrice } from '../utils/format';

export default function Cart() {
  useDocumentTitle('Cart');
  const navigate = useNavigate();
  const { cartLines, cartCount, subtotal, shipping, total, updateQuantity, removeFromCart, clearCart } = useStore();

  if (cartLines.length === 0) {
    return (
      <div className="container page">
        <EmptyState icon={ShoppingBag} title="Your cart is empty" text="Add something you like and it will show up here.">
          <Link to="/shop" className="btn btn--primary">Start shopping</Link>
        </EmptyState>
      </div>
    );
  }

  const amountToFreeShipping = SHIPPING.freeAbove - subtotal;

  return (
    <div className="container page">
      <div className="page-title">
        <h1>Shopping cart</h1>
        <p>{cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart</p>
      </div>

      <div className="cart-layout">
        <ul className="cart-list">
          {cartLines.map(({ key, product, quantity, size, color }) => (
            <li key={key} className="cart-item">
              <Link to={`/product/${product.id}`} className="cart-item__media">
                <SafeImage src={product.image} alt={product.imageAlt || product.name} className="cart-item__img" />
              </Link>

              <div className="cart-item__info">
                <h2><Link to={`/product/${product.id}`}>{product.name}</Link></h2>
                <p className="cart-item__meta">
                  {[color, size].filter(Boolean).join(' / ') || product.category}
                </p>
                <p className="cart-item__unit">{formatPrice(product.price)} each</p>
              </div>

              <div className="cart-item__qty">
                <QuantitySelector value={quantity} onChange={(next) => updateQuantity(key, next)} label={`Quantity for ${product.name}`} />
              </div>

              <p className="cart-item__total">{formatPrice(product.price * quantity)}</p>

              <button type="button" className="icon-btn cart-item__remove" onClick={() => removeFromCart(key)} aria-label={`Remove ${product.name} from cart`}>
                <Trash2 size={18} />
              </button>
            </li>
          ))}
        </ul>

        <aside className="summary" aria-label="Order summary">
          <h2>Order summary</h2>
          <dl className="summary__rows">
            <div><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
            <div><dt>Estimated shipping</dt><dd>{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd></div>
            <div className="summary__total"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
          </dl>
          {amountToFreeShipping > 0 && (
            <p className="summary__note">Add {formatPrice(amountToFreeShipping)} more to get free shipping.</p>
          )}
          <button type="button" className="btn btn--primary btn--lg btn--block" onClick={() => navigate('/checkout')}>
            Proceed to checkout
          </button>
          <Link to="/shop" className="btn btn--outline btn--block">Continue shopping</Link>
          <button type="button" className="text-btn" onClick={clearCart}>Clear cart</button>
        </aside>
      </div>
    </div>
  );
}
