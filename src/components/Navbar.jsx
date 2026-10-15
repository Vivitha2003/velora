import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Heart, Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import Logo from './Logo';
import { useStore } from '../context/StoreContext';
import { categoryNames } from '../data/categories';

const primaryLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const { cartCount, wishlistIds } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Close the mobile menu after moving to another page.
  useEffect(() => setMenuOpen(false), [pathname]);

  // Close the mobile menu with the Escape key.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKeyDown = (event) => event.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  const handleSearch = (event) => {
    event.preventDefault();
    const query = searchText.trim();
    navigate(query ? `/shop?q=${encodeURIComponent(query)}` : '/shop');
    setSearchText('');
    setMenuOpen(false);
  };

  const searchForm = (idSuffix) => (
    <form className="search" role="search" onSubmit={handleSearch}>
      <label htmlFor={`search-${idSuffix}`} className="sr-only">Search products</label>
      <Search size={18} aria-hidden="true" />
      <input
        id={`search-${idSuffix}`}
        type="search"
        placeholder="Search products"
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
      />
      <button type="submit" className="search__submit">Search</button>
    </form>
  );

  return (
    <header className="header">
      <div className="container header__row">
        <button
          type="button"
          className="icon-btn header__menu-btn"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <Logo />

        <nav className="header__nav" aria-label="Main">
          {primaryLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="header__search">{searchForm('desktop')}</div>

        <div className="header__icons">
          <Link to="/account" className="icon-btn" aria-label="Account">
            <User size={22} />
          </Link>
          <Link to="/wishlist" className="icon-btn" aria-label={`Wishlist, ${wishlistIds.length} items`}>
            <Heart size={22} />
            {wishlistIds.length > 0 && <span className="icon-btn__count">{wishlistIds.length}</span>}
          </Link>
          <Link to="/cart" className="icon-btn" aria-label={`Cart, ${cartCount} items`}>
            <ShoppingBag size={22} />
            {cartCount > 0 && <span className="icon-btn__count">{cartCount}</span>}
          </Link>
        </div>
      </div>

      <div className="container header__categories-wrap">
        <nav className="header__categories" aria-label="Categories">
          <Link to="/shop" className="category-link">All products</Link>
          {categoryNames.map((name) => (
            <Link key={name} to={`/shop?category=${encodeURIComponent(name)}`} className="category-link">
              {name}
            </Link>
          ))}
        </nav>
      </div>

      <div id="mobile-menu" className={`mobile-menu ${menuOpen ? 'is-open' : ''}`} hidden={!menuOpen}>
        <div className="container">
          {searchForm('mobile')}
          <nav aria-label="Mobile">
            <ul className="mobile-menu__list">
              {primaryLinks.map((link) => (
                <li key={link.to}>
                  <NavLink to={link.to} end={link.end}>{link.label}</NavLink>
                </li>
              ))}
            </ul>
            <p className="mobile-menu__heading">Shop by category</p>
            <ul className="mobile-menu__list">
              <li><Link to="/shop">All products</Link></li>
              {categoryNames.map((name) => (
                <li key={name}>
                  <Link to={`/shop?category=${encodeURIComponent(name)}`}>{name}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
