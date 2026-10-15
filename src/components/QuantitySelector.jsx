import { Minus, Plus } from 'lucide-react';
import { MAX_QUANTITY } from '../context/StoreContext';

export default function QuantitySelector({ value, onChange, label = 'Quantity' }) {
  return (
    <div className="qty" role="group" aria-label={label}>
      <button
        type="button"
        className="qty__btn"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label="Decrease quantity"
      >
        <Minus size={16} />
      </button>
      <span className="qty__value" aria-live="polite">{value}</span>
      <button
        type="button"
        className="qty__btn"
        onClick={() => onChange(value + 1)}
        disabled={value >= MAX_QUANTITY}
        aria-label="Increase quantity"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
