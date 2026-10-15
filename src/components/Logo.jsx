import { useState } from 'react';
import { Link } from 'react-router-dom';
import { assetUrl } from '../utils/format';
import { IMAGES } from '../config';

// Uses public/images/logo.png when it exists, otherwise a text wordmark.
export default function Logo({ className = '' }) {
  const [logoMissing, setLogoMissing] = useState(false);

  return (
    <Link to="/" className={`logo ${className}`} aria-label="VELORA home">
      {logoMissing ? (
        <span className="logo__word">VELORA</span>
      ) : (
        <img
          src={assetUrl(IMAGES.logo)}
          alt="VELORA"
          className="logo__img"
          onError={() => setLogoMissing(true)}
        />
      )}
    </Link>
  );
}
