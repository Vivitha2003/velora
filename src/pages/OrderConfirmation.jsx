import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, ReceiptText } from 'lucide-react';
import SafeImage from '../components/SafeImage';
import EmptyState from '../components/EmptyState';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { useStore } from '../context/StoreContext';
import { formatDate, formatPrice } from '../utils/format';

export default function OrderConfirmation() {
  useDocumentTitle('Order confirmation');
  const { orderId } = useParams();
  const { orders } = useStore();
  const order = orders.find((item) => item.id === orderId);

  if (!order) {
    return (
      <div className="container page">
        <EmptyState icon={ReceiptText} title="Order not found" text="We could not find this demo order in this browser.">
          <Link to="/shop" className="btn btn--primary">Back to shop</Link>
        </EmptyState>
      </div>
    );
  }

  const { customer } = order;

  return (
    <div className="container page page--narrow">
      <div className="confirmation">
        <CheckCircle2 size={44} aria-hidden="true" />
        <h1>Thank you, {customer.fullName.split(' ')[0]}</h1>
        <p>Your demo order <strong>{order.id}</strong> was placed on {formatDate(order.placedAt)}.</p>
        <p className="confirmation__demo">This is a frontend demonstration. No payment was taken and nothing will be shipped.</p>
      </div>

      <div className="confirmation__grid">
        <section className="summary" aria-labelledby="order-items-title">
          <h2 id="order-items-title">Items</h2>
          <ul className="summary__items">
            {order.items.map((item) => (
              <li key={`${item.productId}-${item.size}-${item.color}`}>
                <SafeImage src={item.image} alt={item.name} className="summary__img" />
                <div>
                  <p className="summary__name">{item.name}</p>
                  <p className="summary__meta">{[item.color, item.size].filter(Boolean).join(' / ')} Qty {item.quantity}</p>
                </div>
                <p>{formatPrice(item.price * item.quantity)}</p>
              </li>
            ))}
          </ul>
          <dl className="summary__rows">
            <div><dt>Subtotal</dt><dd>{formatPrice(order.subtotal)}</dd></div>
            <div><dt>Shipping</dt><dd>{order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</dd></div>
            <div className="summary__total"><dt>Total</dt><dd>{formatPrice(order.total)}</dd></div>
          </dl>
        </section>

        <section className="summary" aria-labelledby="order-ship-title">
          <h2 id="order-ship-title">Delivery details</h2>
          <address className="confirmation__address">
            {customer.fullName}<br />
            {customer.address}<br />
            {customer.city}, {customer.state} {customer.pincode}<br />
            {customer.phone}<br />
            {customer.email}
          </address>
          <p className="summary__note">Standard delivery, 3 to 5 working days.</p>
        </section>
      </div>

      <div className="confirmation__actions">
        <Link to="/shop" className="btn btn--primary">Continue shopping</Link>
        <Link to="/account" className="btn btn--outline">View all demo orders</Link>
      </div>
    </div>
  );
}
