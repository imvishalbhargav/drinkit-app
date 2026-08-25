import { LogOut, MapPin, Plus, Receipt, User2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { isConfigured } from '../lib/config';
import { useAddresses } from '../store/addresses';
import { useAuth } from '../store/auth';
import { useOrders } from '../store/orders';
import { useUI } from '../store/ui';

const INTEGRATIONS = [
  { key: 'firebase' as const, label: 'Phone OTP login', live: 'Firebase' },
  { key: 'maps' as const, label: 'Maps & location', live: 'Google Maps' },
  { key: 'razorpay' as const, label: 'Payments', live: 'Razorpay' },
  { key: 'email' as const, label: 'Order emails', live: 'EmailJS' },
];

export default function Account() {
  const isLoggedIn = useAuth((s) => s.isLoggedIn);
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);

  const addresses = useAddresses((s) => s.list);
  const orders = useOrders((s) => s.list);

  const openAuth = useUI((s) => s.openAuth);
  const openLocation = useUI((s) => s.openLocation);
  const showToast = useUI((s) => s.showToast);

  if (!isLoggedIn) {
    return (
      <div className="mx-auto grid max-w-md place-items-center px-4 py-24 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-panel2 text-fog">
          <User2 size={26} />
        </div>
        <p className="mt-4 font-medium text-chalk">You're not logged in</p>
        <p className="text-sm text-fog">Login to see your account, addresses and orders.</p>
        <Button variant="primary" className="mt-4" onClick={openAuth}>
          Login / Sign up
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      {/* profile */}
      <div className="flex items-center gap-4 rounded-2xl border border-hair bg-panel/50 p-5">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-neon-grape text-xl font-bold text-white">
          {(user?.name || user?.phone || 'U').slice(0, 1).toUpperCase()}
        </span>
        <div className="min-w-0">
          <h1 className="truncate font-display text-xl font-bold text-chalk">{user?.name || 'DrinKit user'}</h1>
          <p className="text-sm text-fog">{user?.phone}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto"
          onClick={() => {
            logout();
            showToast('Logged out');
          }}
        >
          <LogOut size={14} /> Logout
        </Button>
      </div>

      {/* quick links */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Link
          to="/orders"
          className="flex items-center gap-3 rounded-2xl border border-hair bg-panel/50 p-4 hover:border-fog/30"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-lime/10 text-lime">
            <Receipt size={18} />
          </span>
          <div>
            <p className="text-sm font-semibold text-chalk">My orders</p>
            <p className="text-xs text-fog">{orders.length} total</p>
          </div>
        </Link>
        <button
          onClick={openLocation}
          className="flex items-center gap-3 rounded-2xl border border-hair bg-panel/50 p-4 text-left hover:border-fog/30"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-lime/10 text-lime">
            <MapPin size={18} />
          </span>
          <div>
            <p className="text-sm font-semibold text-chalk">Addresses</p>
            <p className="text-xs text-fog">{addresses.length} saved</p>
          </div>
        </button>
      </div>

      {/* addresses */}
      <div className="mt-4 rounded-2xl border border-hair bg-panel/50 p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold text-chalk">Saved addresses</h2>
          <Button size="sm" variant="outline" onClick={openLocation}>
            <Plus size={14} /> Add
          </Button>
        </div>
        {addresses.length ? (
          <div className="space-y-2">
            {addresses.map((a) => (
              <div key={a.id} className="flex items-start gap-2 rounded-xl border border-hair bg-panel2/50 p-3 text-sm">
                <MapPin size={15} className="mt-0.5 shrink-0 text-lime" />
                <span>
                  <span className="font-medium text-chalk">{a.label}</span>
                  <span className="block text-fog">
                    {a.line1}, {a.city} {a.pincode}
                  </span>
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-fog">No addresses yet. Add one to speed up checkout.</p>
        )}
      </div>

      {/* integration status */}
      <div className="mt-4 rounded-2xl border border-hair bg-panel/50 p-5">
        <h2 className="mb-3 font-semibold text-chalk">Integrations</h2>
        <div className="space-y-2">
          {INTEGRATIONS.map((it) => {
            const live = isConfigured[it.key];
            return (
              <div key={it.key} className="flex items-center justify-between text-sm">
                <span className="text-fog">{it.label}</span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    live ? 'bg-success/15 text-success' : 'bg-panel2 text-fog'
                  }`}
                >
                  {live ? `Live · ${it.live}` : 'Demo'}
                </span>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-fog/70">
          Demo integrations work fully without setup. Add your API keys (see SETUP.md) to switch any of
          these to live.
        </p>
      </div>
    </div>
  );
}
