import { Link } from 'react-router-dom';
import SafeImage from '../components/SafeImage';
import useDocumentTitle from '../hooks/useDocumentTitle';

const values = [
  { title: 'Made to last', text: 'We choose durable fabrics, honest materials and construction that holds up to daily use.' },
  { title: 'Fairly priced', text: 'We keep the range small and the markups low, so quality does not have to cost a premium.' },
  { title: 'Easy to shop', text: 'Clear product details, simple sizing and returns that do not need an explanation.' },
];

export default function About() {
  useDocumentTitle('About us');
  return (
    <div className="container page">
      <div className="about-intro">
        <div>
          <h1>About VELORA</h1>
          <p className="lead">
            VELORA is a small online store for everyday essentials: clothing, footwear, electronics and accessories
            that look good, feel good and keep working.
          </p>
          <p>
            We started with a simple idea: a wardrobe and a bag of daily tools should be built from fewer, better
            things. Every product in our range is tested by our team before it is added to the shop.
          </p>
          <p className="about-note">
            VELORA is a fictional brand created as a frontend portfolio project. Products, prices and reviews are
            sample data.
          </p>
        </div>
        <div className="about-images">
          <SafeImage src="/images/categories/fashion.jpg" alt="VELORA fashion collection" className="about-images__img" />
          <SafeImage src="/images/categories/accessories.jpg" alt="VELORA accessories collection" className="about-images__img" />
        </div>
      </div>

      <section className="section section--tight" aria-labelledby="values-title">
        <h2 id="values-title">What we care about</h2>
        <div className="values">
          {values.map((value) => (
            <div key={value.title} className="value-card">
              <h3>{value.title}</h3>
              <p>{value.text}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="about-cta">
        <h2>Ready to look around?</h2>
        <Link to="/shop" className="btn btn--primary btn--lg">Shop the collection</Link>
      </div>
    </div>
  );
}
