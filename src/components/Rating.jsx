import { Star } from 'lucide-react';

export default function Rating({ value, count, showCount = true }) {
  const filled = Math.round(value);
  return (
    <div className="rating" aria-label={`Rated ${value} out of 5${count ? ` from ${count} reviews` : ''}`}>
      <span className="rating__stars" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} size={14} className={star <= filled ? 'is-filled' : ''} />
        ))}
      </span>
      <span className="rating__value">{value.toFixed(1)}</span>
      {showCount && count != null && <span className="rating__count">({count})</span>}
    </div>
  );
}
