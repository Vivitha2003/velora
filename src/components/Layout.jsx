import { Outlet } from 'react-router-dom';
import AnnouncementBar from './AnnouncementBar';
import Navbar from './Navbar';
import Footer from './Footer';
import Toast from './Toast';
import ScrollToTop from './ScrollToTop';

export default function Layout() {
  return (
    <>
      <a href="#main" className="skip-link" onClick={(event) => {
        event.preventDefault();
        document.getElementById('main')?.focus();
      }}>
        Skip to content
      </a>
      <ScrollToTop />
      <AnnouncementBar />
      <Navbar />
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <Toast />
    </>
  );
}
