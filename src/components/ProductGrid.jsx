import ProductCard from './ProductCard';

export default function ProductGrid({ products, onRemove, className = '' }) {
  return (
    <div className={`product-grid ${className}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onRemove={onRemove} />
      ))}
    </div>
  );
}
