import { useState } from 'react';
import { assetUrl } from '../utils/format';

// Shows a local image. If the file is missing, it shows a neutral placeholder
// that names the missing file, so beginners can spot exactly what to add.
export default function SafeImage({ src, alt, className = '', ...rest }) {
  const [failedSrc, setFailedSrc] = useState(null);

  if (failedSrc === src) {
    const fileName = src ? src.split('/').pop() : 'image';
    return (
      <div className={`img-fallback ${className}`} role="img" aria-label={alt}>
        <span className="img-fallback__brand">VELORA</span>
        <span className="img-fallback__file">Add {fileName}</span>
      </div>
    );
  }

  return (
    <img
      src={assetUrl(src)}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailedSrc(src)}
      {...rest}
    />
  );
}
