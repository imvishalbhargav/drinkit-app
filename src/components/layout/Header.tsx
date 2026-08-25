import { Clock, MapPin, Search, ShoppingCart, ChevronDown, User2 } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PROMISE_MIN } from '../../lib/config';
import { cn } from '../../lib/cn';
import { useAddresses, selectedAddress } from '../../store/addresses';
import { useAuth } from '../../store/auth';
import { cartCount, useCart } from '../../store/cart';
import { useUI } from '../../store/ui';
import { Logo } from '../common/Logo';

export default function Header() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');

  const items = useCart((s) => s.items);
  const count = cartCount(items);

  const list = useAddresses((s) => s.list);
  const selectedId = useAddresses((s) => s.selectedId);
  const addr = selectedAddress(list, selectedId);

  const isLoggedIn = useAuth((s) => s.isLoggedIn);
  const user = useAuth((s) => s.user);

  const openCart = useUI((s) => s.openCart);
  const openAuth = useUI((s) => s.openAuth);
  const openLocation = useUI((s) => s.openLocation);

  const locationText = addr ? `${addr.label} · ${addr.city}` : 'New Delhi · 110001';

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  const SearchBox = (
    <form onSubmit={submitSearch} className="relative w-full">
      <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-fog" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder='Search "whisky", "cold brew", "red wine"…'
        className="hairline h-11 w-full rounded-xl bg-panel2/70 pl-10 pr-4 text-sm text-chalk placeholder:text-fog/70 focus:border-lime/50 focus:outline-none focus:ring-1 focus:ring-lime/30"
      />
    </form>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-hair/70 bg-ink/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4">
        {/* top row */}
        <div className="flex h-16 items-center gap-3 sm:gap-5">
          <Link to="/" className="shrink-0">
            <Logo />
          </Link>

          {/* location pill */}
          <button
            onClick={openLocation}
            className="group flex min-w-0 items-center gap-1.5 rounded-xl px-2 py-1.5 text-left hover:bg-panel2/60"
          >
            <MapPin size={16} className="shrink-0 text-lime" />
            <span className="flex min-w-0 flex-col leading-tight">
              <span className="text-[11px] font-medium text-fog">Delivery in {PROMISE_MIN} min</span>
              <span className="flex items-center gap-1 truncate text-sm font-semibold text-chalk">
                <span className="truncate">{locationText}</span>
                <ChevronDown size={14} className="shrink-0 text-fog transition-transform group-hover:translate-y-0.5" />
              </span>
            </span>
          </button>

          {/* desktop search */}
          <div className="hidden flex-1 md:block">{SearchBox}</div>

          <div className="ml-auto flex items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-full border border-lime/30 bg-lime/10 px-3 py-1.5 text-xs font-semibold text-lime lg:flex">
              <Clock size={13} /> {PROMISE_MIN} min
            </span>

            {isLoggedIn ? (
              <Link
                to="/account"
                className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-sm font-medium text-chalk hover:bg-panel2/60"
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-neon-grape text-xs font-bold text-white">
                  {(user?.name || user?.phone || 'U').slice(0, 1).toUpperCase()}
                </span>
                <span className="hidden max-w-[90px] truncate sm:block">{user?.name || 'Account'}</span>
              </Link>
            ) : (
              <button
                onClick={openAuth}
                className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-chalk hover:bg-panel2/60"
              >
                <User2 size={17} /> <span className="hidden sm:block">Login</span>
              </button>
            )}

            <button
              onClick={openCart}
              className={cn(
                'relative flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition',
                count > 0
                  ? 'bg-neon-lime text-ink shadow-glow-lime'
                  : 'border border-hair text-chalk hover:bg-panel2/60'
              )}
            >
              <ShoppingCart size={18} />
              <span className="hidden sm:block">Cart</span>
              {count > 0 && (
                <span className="grid h-5 min-w-[20px] place-items-center rounded-full bg-ink px-1 text-[11px] font-bold text-lime">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* mobile search row */}
        <div className="pb-3 md:hidden">{SearchBox}</div>
      </div>
    </header>
  );
}
