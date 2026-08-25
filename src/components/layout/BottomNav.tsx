import { motion } from 'framer-motion';
import { Home, LayoutGrid, Receipt, ShoppingCart, User2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/cn';
import { useAuth } from '../../store/auth';
import { cartCount, useCart } from '../../store/cart';
import { useUI } from '../../store/ui';

export default function BottomNav() {
  const { pathname } = useLocation();
  const items = useCart((s) => s.items);
  const count = cartCount(items);
  const openCart = useUI((s) => s.openCart);
  const openAuth = useUI((s) => s.openAuth);
  const isLoggedIn = useAuth((s) => s.isLoggedIn);

  const tabCls = (active: boolean) =>
    cn(
      'relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium transition-colors',
      active ? 'text-lime' : 'text-fog'
    );

  return (
    <nav className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-hair/70 bg-ink/90 backdrop-blur-xl md:hidden">
      <div className="mx-auto flex max-w-lg items-stretch">
        <Link to="/" className={tabCls(pathname === '/')}>
          <Home size={20} />
          Home
        </Link>
        <Link to="/search" className={tabCls(pathname.startsWith('/search'))}>
          <LayoutGrid size={20} />
          Explore
        </Link>
        <button onClick={openCart} className={tabCls(false)}>
          <span className="relative">
            <ShoppingCart size={20} />
            {count > 0 && (
              <span className="absolute -right-2 -top-1.5 grid h-4 min-w-[16px] place-items-center rounded-full bg-neon-lime px-1 text-[10px] font-bold text-ink">
                {count}
              </span>
            )}
          </span>
          Cart
        </button>
        <Link to="/orders" className={tabCls(pathname.startsWith('/orders'))}>
          <Receipt size={20} />
          Orders
        </Link>
        {isLoggedIn ? (
          <Link to="/account" className={tabCls(pathname.startsWith('/account'))}>
            <User2 size={20} />
            Account
          </Link>
        ) : (
          <button onClick={openAuth} className={tabCls(false)}>
            <User2 size={20} />
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
