import { Link } from 'react-router-dom';
import { RotateCcw, ShieldCheck, Truck } from 'lucide-react';
import SafeImage from '../components/SafeImage';
import SectionHeader from '../components/SectionHeader';
import ProductGrid from '../components/ProductGrid';
import Newsletter from '../components/Newsletter';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { products } from '../data/products';
import { categoryTiles } from '../data/categories';
import { IMAGES, SHIPPING } from '../config';
import { formatPrice } from '../utils/format';

const trendingProducts = products.filter((product) => product.trending).slice(0, 4);
const newArrivals = [...products].sort((a, b) => b.dateAdded.localeCompare(a.dateAdded)).slice(0, 4);
const bestSellers = products.filter((product) => product.bestSeller).slice(0, 4);

const promises = [
  { icon: Truck, title: 'Free shipping', text: `On orders above ${formatPrice(SHIPPING.freeAbove)}` },
  { icon: RotateCcw, title: 'Easy returns', text: 'Return within 7 days of delivery' },
  { icon: ShieldCheck, title: 'Quality checked', text: 'Every item inspected before dispatch' },
];

export default function Home() {
  useDocumentTitle('');

  return (
    <>
      {/* Hero */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero__inner">
          <div className="hero__text">
            <h1 id="hero-title">Considered essentials for everyday life</h1>
            <p>
              Clothing, footwear, electronics and accessories chosen for quality, comfort and lasting style.
            </p>
            <div className="hero__actions">
              <Link to="/shop" className="btn btn--primary btn--lg">Shop Now</Link>
              <Link to="/shop?sort=newest" className="btn btn--outline btn--lg">New arrivals</Link>
            </div>
          </div>
          <div className="hero__media">
            <SafeImage src={IMAGES.hero} alt="VELORA seasonal collection" className="hero__img" loading="eager" />
          </div>
        </div>
      </section>

      {/* Shop by category */}
      <section className="section" aria-label="Shop by category">
        <div className="container">
          <SectionHeader title="Shop by category" subtitle="Find what you need, quickly." />
          <div className="category-grid">
            {categoryTiles.map((tile) => (
              <Link key={tile.key} to={`/shop?group=${tile.key}`} className="category-tile">
                <SafeImage src={tile.image} alt={`${tile.title} category`} className="category-tile__img" />
                <span className="category-tile__caption">
                  <strong>{tile.title}</strong>
                  <small>{tile.description}</small>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="section section--tight">
        <div className="container">
          <SectionHeader title="Trending now" subtitle="What shoppers are picking this week." linkTo="/shop" linkLabel="View all products" />
          <ProductGrid products={trendingProducts} />
        </div>
      </section>

      {/* New arrivals */}
      <section className="section section--sand">
        <div className="container">
          <SectionHeader title="New arrivals" subtitle="Just added to the collection." linkTo="/shop?sort=newest" linkLabel="See all new arrivals" />
          <ProductGrid products={newArrivals} />
        </div>
      </section>

      {/* Offer banner */}
      <section className="section section--tight">
        <div className="container">
          <div className="offer">
            <div>
              <h2>End-of-season edit</h2>
              <p>Up to 30% off selected clothing, footwear and electronics while stock lasts.</p>
            </div>
            <Link to="/shop?sale=1" className="btn btn--light btn--lg">Shop the sale</Link>
          </div>
        </div>
      </section>

      {/* Best sellers */}
      <section className="section section--tight">
        <div className="container">
          <SectionHeader title="Best sellers" subtitle="Our most loved pieces." linkTo="/shop?sort=popularity" linkLabel="Shop best sellers" />
          <ProductGrid products={bestSellers} />
        </div>
      </section>

      {/* Store promises */}
      <section className="section section--tight" aria-label="Store promises">
        <div className="container promises">
          {promises.map(({ icon: Icon, title, text }) => (
            <div key={title} className="promise">
              <Icon size={24} aria-hidden="true" />
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Newsletter />
    </>
  );
}
