import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import Logo from './Logo';
import { BRAND } from '../config';
import { categoryNames } from '../data/categories';

const socialLinks = [
  { label: 'Instagram', href: 'https://www.instagram.com', icon: Instagram },
  { label: 'Facebook', href: 'https://www.facebook.com', icon: Facebook },
  { label: 'Twitter', href: 'https://twitter.com', icon: Twitter },
  { label: 'YouTube', href: 'https://www.youtube.com', icon: Youtube },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Logo />
          <p>{BRAND.tagline}. Clothing, footwear, electronics and accessories chosen for quality and lasting style.</p>
          <ul className="footer__social">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`VELORA on ${label}`}>
                  <Icon size={18} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Shop links">
          <h2 className="footer__title">Shop</h2>
          <ul>
            <li><Link to="/shop">All products</Link></li>
            {categoryNames.map((name) => (
              <li key={name}>
                <Link to={`/shop?category=${encodeURIComponent(name)}`}>{name}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Company links">
          <h2 className="footer__title">Company</h2>
          <ul>
            <li><Link to="/about">About us</Link></li>
            <li><Link to="/contact">Contact us</Link></li>
            <li><Link to="/account">Your account</Link></li>
            <li><Link to="/wishlist">Wishlist</Link></li>
            <li><Link to="/cart">Cart</Link></li>
          </ul>
        </nav>

        <div>
          <h2 className="footer__title">Get in touch</h2>
          <ul>
            <li><a href={`mailto:${BRAND.email}`}>{BRAND.email}</a></li>
            <li><a href={`tel:${BRAND.phone.replace(/\s/g, '')}`}>{BRAND.phone}</a></li>
            <li>{BRAND.hours}</li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container">
          <p>
            &copy; {new Date().getFullYear()} VELORA. A frontend portfolio project. Checkout is a demonstration and
            no real payments are taken.
          </p>
        </div>
      </div>
    </footer>
  );
}
