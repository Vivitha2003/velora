import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SearchX, SlidersHorizontal, X } from 'lucide-react';
import ProductGrid from '../components/ProductGrid';
import EmptyState from '../components/EmptyState';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { products } from '../data/products';
import { categoryNames, categoryTiles } from '../data/categories';
import { formatPrice } from '../utils/format';

const PRICE_CEILING = Math.ceil(Math.max(...products.map((product) => product.price)) / 1000) * 1000;

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'popularity', label: 'Popularity' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
];

const sorters = {
  featured: (a, b) => Number(b.featured) - Number(a.featured) || a.id - b.id,
  popularity: (a, b) => b.reviews - a.reviews,
  newest: (a, b) => b.dateAdded.localeCompare(a.dateAdded),
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
};

export default function Shop() {
  useDocumentTitle('Shop');
  const [searchParams, setSearchParams] = useSearchParams();
  const [maxPrice, setMaxPrice] = useState(PRICE_CEILING);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Search, category, group, sale and sort live in the URL so links can be shared.
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const groupKey = searchParams.get('group') || '';
  const saleOnly = searchParams.get('sale') === '1';
  const sortParam = searchParams.get('sort') || 'featured';
  const sort = sorters[sortParam] ? sortParam : 'featured';
  const activeGroup = categoryTiles.find((tile) => tile.key === groupKey);

  const updateParams = (changes) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(changes).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    setSearchParams(next, { replace: true });
  };

  const selectCategory = (name) => updateParams({ category: name, group: '' });

  const clearFilters = () => {
    setSearchParams({}, { replace: true });
    setMaxPrice(PRICE_CEILING);
  };

  const visibleProducts = useMemo(() => {
    const text = query.trim().toLowerCase();
    return products
      .filter((product) => {
        if (category && product.category !== category) return false;
        if (!category && activeGroup && !activeGroup.categories.includes(product.category)) return false;
        if (saleOnly && !product.originalPrice) return false;
        if (product.price > maxPrice) return false;
        if (text) {
          const haystack = `${product.name} ${product.category} ${product.description}`.toLowerCase();
          if (!haystack.includes(text)) return false;
        }
        return true;
      })
      .sort(sorters[sort]);
  }, [query, category, activeGroup, saleOnly, maxPrice, sort]);

  const hasFilters = Boolean(query || category || activeGroup || saleOnly || maxPrice < PRICE_CEILING);
  const heading = category || (activeGroup ? activeGroup.title : 'All products');

  return (
    <div className="container page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Shop</span>
      </nav>

      <div className="page-title">
        <h1>{heading}</h1>
        <p>{query ? `Results for "${query}"` : 'Browse the full VELORA collection.'}</p>
      </div>

      <div className="shop-toolbar">
        <div className="field shop-toolbar__search">
          <label htmlFor="shop-search" className="sr-only">Search products by name</label>
          <input
            id="shop-search"
            type="search"
            placeholder="Search products by name"
            value={query}
            onChange={(event) => updateParams({ q: event.target.value })}
          />
        </div>

        <button
          type="button"
          className="btn btn--outline shop-toolbar__filter-btn"
          onClick={() => setFiltersOpen((open) => !open)}
          aria-expanded={filtersOpen}
          aria-controls="shop-filters"
        >
          <SlidersHorizontal size={16} /> Filters
        </button>

        <div className="field shop-toolbar__sort">
          <label htmlFor="shop-sort">Sort by</label>
          <select id="shop-sort" value={sort} onChange={(event) => updateParams({ sort: event.target.value === 'featured' ? '' : event.target.value })}>
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="shop-layout">
        <aside id="shop-filters" className={`filters ${filtersOpen ? 'is-open' : ''}`} aria-label="Product filters">
          <div className="filters__group">
            <h2>Category</h2>
            <ul>
              <li>
                <button type="button" className={`filter-chip ${!category && !activeGroup ? 'is-active' : ''}`} onClick={() => selectCategory('')}>
                  All products
                </button>
              </li>
              {categoryNames.map((name) => (
                <li key={name}>
                  <button type="button" className={`filter-chip ${category === name ? 'is-active' : ''}`} aria-pressed={category === name} onClick={() => selectCategory(name)}>
                    {name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="filters__group">
            <h2>Price</h2>
            <label htmlFor="price-range" className="filters__range-label">
              Up to <strong>{formatPrice(maxPrice)}</strong>
            </label>
            <input
              id="price-range"
              type="range"
              min="500"
              max={PRICE_CEILING}
              step="500"
              value={maxPrice}
              onChange={(event) => setMaxPrice(Number(event.target.value))}
            />
            <div className="filters__range-scale" aria-hidden="true">
              <span>{formatPrice(500)}</span>
              <span>{formatPrice(PRICE_CEILING)}</span>
            </div>
          </div>

          <div className="filters__group">
            <label className="check">
              <input type="checkbox" checked={saleOnly} onChange={(event) => updateParams({ sale: event.target.checked ? '1' : '' })} />
              <span>On sale only</span>
            </label>
          </div>

          {hasFilters && (
            <button type="button" className="btn btn--outline btn--block" onClick={clearFilters}>
              Clear all filters
            </button>
          )}
        </aside>

        <section aria-label="Products" className="shop-results">
          <div className="shop-results__bar">
            <p aria-live="polite">
              Showing <strong>{visibleProducts.length}</strong> of {products.length} products
            </p>
            {activeGroup && !category && (
              <button type="button" className="tag" onClick={() => updateParams({ group: '' })}>
                {activeGroup.title} <X size={14} aria-hidden="true" /> <span className="sr-only">Remove filter</span>
              </button>
            )}
          </div>

          {visibleProducts.length > 0 ? (
            <ProductGrid products={visibleProducts} className="product-grid--shop" />
          ) : (
            <EmptyState icon={SearchX} title="No products found" text="Try a different search term, a wider price range or another category.">
              <button type="button" className="btn btn--primary" onClick={clearFilters}>Clear all filters</button>
            </EmptyState>
          )}
        </section>
      </div>
    </div>
  );
}
