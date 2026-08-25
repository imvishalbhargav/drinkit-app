import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import AgeGate from './components/layout/AgeGate';
import AuthModal from './components/layout/AuthModal';
import BottomNav from './components/layout/BottomNav';
import CartDrawer from './components/layout/CartDrawer';
import Footer from './components/layout/Footer';
import Header from './components/layout/Header';
import Toaster from './components/layout/Toaster';
import LocationPicker from './components/location/LocationPicker';
import Account from './pages/Account';
import Cart from './pages/Cart';
import Category from './pages/Category';
import Checkout from './pages/Checkout';
import Home from './pages/Home';
import OrderTracking from './pages/OrderTracking';
import Orders from './pages/Orders';
import ProductDetail from './pages/ProductDetail';
import Search from './pages/Search';

function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <p className="font-display text-3xl font-bold text-chalk">404</p>
      <p className="mt-2 text-fog">This page slipped off the shelf.</p>
      <Link to="/" className="mt-4 inline-block text-lime hover:underline">
        ← Back to home
      </Link>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/c/:cat" element={<Category />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/search" element={<Search />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderTracking />} />
          <Route path="/account" element={<Account />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-ink">
      <Header />
      <main className="flex-1 pb-24 md:pb-10">
        <AnimatedRoutes />
      </main>
      <Footer />
      <BottomNav />

      {/* overlays */}
      <AgeGate />
      <AuthModal />
      <CartDrawer />
      <LocationPicker />
      <Toaster />
    </div>
  );
}
