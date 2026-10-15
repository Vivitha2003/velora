import { useState } from 'react';
import { X } from 'lucide-react';
import { SHIPPING } from '../config';
import { formatPrice } from '../utils/format';

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="announcement">
      <div className="container announcement__inner">
        <p>
          Free shipping on orders above {formatPrice(SHIPPING.freeAbove)}. Easy 7-day returns on every order.
        </p>
        <button type="button" className="announcement__close" onClick={() => setVisible(false)} aria-label="Close announcement">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
