import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function NotFound() {
  useDocumentTitle('Page not found');
  return (
    <div className="container page not-found">
      <p className="not-found__code">404</p>
      <h1>We can't find that page</h1>
      <p>The link may be broken or the page may have moved.</p>
      <div className="not-found__actions">
        <Link to="/" className="btn btn--primary">Go to home</Link>
        <Link to="/shop" className="btn btn--outline">Browse the shop</Link>
      </div>
    </div>
  );
}
