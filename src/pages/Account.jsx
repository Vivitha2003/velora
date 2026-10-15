import { Link } from 'react-router-dom';
import { ReceiptText } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { useStore } from '../context/StoreContext';
import { formatDate, formatPrice } from '../utils/format';

export default function Account() {
  useDocumentTitle('Your account');
  const { orders, resetAllData } = useStore();

  const handleReset = () => {
    if (window.confirm('Clear the saved cart, wishlist and demo orders from this browser?')) resetAllData();
  };

  return (
    <div className="container page page--narrow">
      <div className="page-title">
        <h1>Your account</h1>
        <p>VELORA is a demo store, so there is no sign-in. Your cart, wishlist and demo orders are saved in this browser only.</p>
      </div>

      <div className="account-links">
        <Link to="/wishlist" className="btn btn--outline">Wishlist</Link>
        <Link to="/cart" className="btn btn--outline">Cart</Link>
        <Link to="/shop" className="btn btn--outline">Shop</Link>
      </div>

      <h2 className="account-heading">Demo orders</h2>
      {orders.length === 0 ? (
        <EmptyState icon={ReceiptText} title="No orders yet" text="Orders you place in the checkout demo will appear here.">
          <Link to="/shop" className="btn btn--primary">Start shopping</Link>
        </EmptyState>
      ) : (
        <ul className="order-list">
          {orders.map((order) => (
            <li key={order.id} className="order-row">
              <div>
                <p className="order-row__id">{order.id}</p>
                <p className="order-row__meta">{formatDate(order.placedAt)}, {order.items.length} {order.items.length === 1 ? 'item' : 'items'}</p>
              </div>
              <p className="order-row__total">{formatPrice(order.total)}</p>
              <Link to={`/order-confirmation/${order.id}`} className="text-link">View</Link>
            </li>
          ))}
        </ul>
      )}

      <button type="button" className="text-btn account-reset" onClick={handleReset}>
        Clear saved cart, wishlist and orders
      </button>
    </div>
  );
}
