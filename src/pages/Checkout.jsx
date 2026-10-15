import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Info, ShoppingBag } from 'lucide-react';
import SafeImage from '../components/SafeImage';
import EmptyState from '../components/EmptyState';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../utils/format';
import { validateEmail, validatePhone, validatePincode, validateRequired } from '../utils/validators';

const initialValues = { fullName: '', email: '', phone: '', address: '', city: '', state: '', pincode: '' };

const validators = {
  fullName: (value) => validateRequired(value, 'full name', 2),
  email: validateEmail,
  phone: validatePhone,
  address: (value) => validateRequired(value, 'street address', 8),
  city: (value) => validateRequired(value, 'city', 2),
  state: (value) => validateRequired(value, 'state', 2),
  pincode: validatePincode,
};

export default function Checkout() {
  useDocumentTitle('Checkout');
  const navigate = useNavigate();
  const { cartLines, subtotal, shipping, total, placeOrder } = useStore();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  if (cartLines.length === 0) {
    return (
      <div className="container page">
        <EmptyState icon={ShoppingBag} title="Nothing to check out" text="Your cart is empty. Add a product first.">
          <Link to="/shop" className="btn btn--primary">Browse products</Link>
        </EmptyState>
      </div>
    );
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
    if (errors[name]) setErrors((previous) => ({ ...previous, [name]: validators[name](value) }));
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    setErrors((previous) => ({ ...previous, [name]: validators[name](value) }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = Object.fromEntries(Object.keys(validators).map((name) => [name, validators[name](values[name])]));
    setErrors(nextErrors);
    const firstInvalid = Object.keys(nextErrors).find((name) => nextErrors[name]);
    if (firstInvalid) {
      document.getElementById(`checkout-${firstInvalid}`)?.focus();
      return;
    }
    const orderId = placeOrder(values);
    navigate(`/order-confirmation/${orderId}`);
  };

  const field = (name, label, props = {}) => (
    <div className={`field ${props.wide ? 'field--wide' : ''}`}>
      <label htmlFor={`checkout-${name}`}>{label}</label>
      <input
        id={`checkout-${name}`}
        name={name}
        value={values[name]}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `checkout-${name}-error` : undefined}
        {...props.input}
      />
      {errors[name] && <p id={`checkout-${name}-error`} className="field__error">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="container page">
      <div className="page-title">
        <h1>Checkout</h1>
      </div>

      <div className="notice" role="note">
        <Info size={18} aria-hidden="true" />
        <p>
          This is a frontend demonstration. No real payment is taken and no order is sent anywhere.
          Use any sample details to try the flow.
        </p>
      </div>

      <div className="cart-layout">
        <form className="checkout-form" onSubmit={handleSubmit} noValidate>
          <h2>Contact and delivery details</h2>
          <div className="form-grid">
            {field('fullName', 'Full name', { wide: true, input: { type: 'text', autoComplete: 'name' } })}
            {field('email', 'Email', { input: { type: 'email', autoComplete: 'email' } })}
            {field('phone', 'Phone number', { input: { type: 'tel', autoComplete: 'tel', inputMode: 'tel' } })}
            {field('address', 'Street address', { wide: true, input: { type: 'text', autoComplete: 'street-address' } })}
            {field('city', 'City', { input: { type: 'text', autoComplete: 'address-level2' } })}
            {field('state', 'State', { input: { type: 'text', autoComplete: 'address-level1' } })}
            {field('pincode', 'PIN code', { input: { type: 'text', inputMode: 'numeric', maxLength: 6, autoComplete: 'postal-code' } })}
          </div>

          <h2>Shipping and payment</h2>
          <div className="info-box">
            <p><strong>Standard delivery</strong>: 3 to 5 working days. {shipping === 0 ? 'Free for this order.' : `${formatPrice(shipping)} for this order.`}</p>
            <p><strong>Payment</strong>: demo only. No card or UPI details are collected.</p>
          </div>

          <button type="submit" className="btn btn--primary btn--lg">Place order (demo)</button>
        </form>

        <aside className="summary" aria-label="Order summary">
          <h2>Order summary</h2>
          <ul className="summary__items">
            {cartLines.map(({ key, product, quantity, size, color }) => (
              <li key={key}>
                <SafeImage src={product.image} alt={product.imageAlt || product.name} className="summary__img" />
                <div>
                  <p className="summary__name">{product.name}</p>
                  <p className="summary__meta">{[color, size].filter(Boolean).join(' / ')} Qty {quantity}</p>
                </div>
                <p>{formatPrice(product.price * quantity)}</p>
              </li>
            ))}
          </ul>
          <dl className="summary__rows">
            <div><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
            <div><dt>Shipping</dt><dd>{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd></div>
            <div className="summary__total"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
          </dl>
          <Link to="/cart" className="text-link">Edit cart</Link>
        </aside>
      </div>
    </div>
  );
}
