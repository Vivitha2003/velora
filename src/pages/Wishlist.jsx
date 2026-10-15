import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import ProductGrid from '../components/ProductGrid';
import EmptyState from '../components/EmptyState';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { useStore } from '../context/StoreContext';
import { products } from '../data/products';

export default function Wishlist() {
  useDocumentTitle('Wishlist');
  const { wishlistIds, toggleWishlist } = useStore();
  const savedProducts = products.filter((product) => wishlistIds.includes(product.id));

  if (savedProducts.length === 0) {
    return (
      <div className="container page">
        <EmptyState icon={Heart} title="Your wishlist is empty" text="Tap the heart on any product to save it here for later.">
          <Link to="/shop" className="btn btn--primary">Explore products</Link>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="container page">
      <div className="page-title">
        <h1>Wishlist</h1>
        <p>{savedProducts.length} saved {savedProducts.length === 1 ? 'item' : 'items'}</p>
      </div>
      <ProductGrid products={savedProducts} onRemove={toggleWishlist} />
    </div>
  );
}
