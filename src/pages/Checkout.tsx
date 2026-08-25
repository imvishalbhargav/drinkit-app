import { CheckCircle2, ChevronRight, CreditCard, MapPin, User2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PaymentSheet from '../components/checkout/PaymentSheet';
import Button from '../components/common/Button';
import { STORE } from '../lib/config';
import { sendOrderEmail } from '../lib/email';
import { inr, makeId } from '../lib/format';
import { etaFromKm, haversineKm } from '../lib/geo';
import { selectedAddress, useAddresses } from '../store/addresses';
import { useAuth } from '../store/auth';
import { cartTotals, useCart } from '../store/cart';
import { useOrders } from '../store/orders';
import { useUI } from '../store/ui';
import type { Order } from '../types';

export default function Checkout() {
  const navigate = useNavigate();

  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const t = cartTotals(items);

  const isLoggedIn = useAuth((s) => s.isLoggedIn);
  const user = useAuth((s) => s.user);

  const list = useAddresses((s) => s.list);
  const selectedId = useAddresses((s) => s.selectedId);
  const addr = selectedAddress(list, selectedId);

  const openAuth = useUI((s) => s.openAuth);
  const openLocation = useUI((s) => s.openLocation);
  const showToast = useUI((s) => s.showToast);
  const addOrder = useOrders((s) => s.add);

  const [payOpen, setPayOpen] = useState(false);
  const [placed, setPlaced] = useState(false);

  useEffect(() => {
    if (t.count === 0 && !placed) navigate('/', { replace: true });
  }, [t.count, placed, navigate]);

  const canPay = isLoggedIn && !!addr && t.count > 0;

  const startPay = () => {
    if (!isLoggedIn) return openAuth();
    if (!addr) return openLocation();
    setPayOpen(true);
  };

  const onPaid = async (method: string, paymentId?: string) => {
    if (!addr || !user) return;
    const km = haversineKm(STORE, addr);
    const order: Order = {
      id: makeId('DK'),
      createdAt: Date.now(),
      items: t.lines.map((l) => ({
        id: l.id,
        name: l.name,
        qty: l.qty,
        price: l.price,
        image: l.image,
        volume: l.volume,
      })),
      subtotal: t.subtotal,
      savings: t.savings,
      deliveryFee: t.deliveryFee,
      total: t.total,
      paymentMethod: method,
      paymentId,
      address: addr,
      status: 'confirmed',
      etaMinutes: etaFromKm(km),
    };

    setPlaced(true);
    addOrder(order);
    setPayOpen(false);
    clear();

    const mail = await sendOrderEmail(order, user);
    showToast(mail.demo ? 'Order placed! (email logged in demo)' : 'Order placed — confirmation emailed 🎉');
    navigate(`/orders/${order.id}`, { replace: true });
  };

  if (t.count === 0) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="mb-5 font-display text-2xl font-bold text-chalk">Checkout</h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {/* login */}
          <Section
            icon={<User2 size={18} />}
            title="Account"
            done={isLoggedIn}
            action={!isLoggedIn ? { label: 'Login', onClick: openAuth } : undefined}
          >
            {isLoggedIn ? (
              <p className="text-sm text-fog">
                {user?.name ? `${user.name} · ` : ''}
                {user?.phone}
              </p>
            ) : (
              <p className="text-sm text-fog">Login with your mobile number to place the order.</p>
            )}
          </Section>

          {/* address */}
          <Section
            icon={<MapPin size={18} />}
            title="Delivery address"
            done={!!addr}
            action={{ label: addr ? 'Change' : 'Add address', onClick: openLocation }}
          >
            {addr ? (
              <p className="text-sm text-fog">
                <span className="font-medium text-chalk">{addr.label}</span> · {addr.line1},{' '}
                {addr.line2 ? `${addr.line2}, ` : ''}
                {addr.city} {addr.pincode}
              </p>
            ) : (
              <p className="text-sm text-fog">Add where you'd like your order delivered.</p>
            )}
          </Section>

          {/* items */}
          <Section icon={<CreditCard size={18} />} title={`Order summary · ${t.count} items`} done>
            <div className="space-y-2">
              {t.lines.map((l) => (
                <div key={l.id} className="flex items-center justify-between text-sm">
                  <span className="text-fog">
                    {l.name} <span className="text-fog/70">×{l.qty}</span>
                  </span>
                  <span className="text-chalk">{inr(l.price * l.qty)}</span>
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* bill */}
        <aside className="h-fit rounded-2xl border border-hair bg-panel/50 p-5 lg:sticky lg:top-24">
          <h2 className="font-display text-lg font-bold text-chalk">Bill details</h2>
          <div className="mt-4 space-y-2 text-sm">
            <Row label="Item total" value={inr(t.subtotal)} />
            {t.savings > 0 && <Row label="Savings" value={`- ${inr(t.savings)}`} accent />}
            <Row label="Delivery fee" value={t.deliveryFee ? inr(t.deliveryFee) : 'FREE'} />
            <Row label="Handling fee" value={inr(t.handling)} />
            <div className="mt-2 flex items-center justify-between border-t border-hair pt-3 text-base font-bold text-chalk">
              <span>To pay</span>
              <span>{inr(t.total)}</span>
            </div>
          </div>
          <Button block size="lg" variant="primary" className="mt-5" onClick={startPay}>
            {canPay ? `Proceed to pay · ${inr(t.total)}` : isLoggedIn ? 'Add address' : 'Login to continue'}
          </Button>
        </aside>
      </div>

      {user && addr && (
        <PaymentSheet
          open={payOpen}
          onClose={() => setPayOpen(false)}
          amount={t.total}
          name={user.name || 'Customer'}
          contact={user.phone}
          email={user.email}
          orderId="pending"
          onPaid={onPaid}
        />
      )}
    </div>
  );
}

function Section({
  icon,
  title,
  children,
  done,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  done?: boolean;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <div className="rounded-2xl border border-hair bg-panel/50 p-4">
      <div className="mb-2 flex items-center gap-2">
        <span className={done ? 'text-lime' : 'text-fog'}>{done ? <CheckCircle2 size={18} /> : icon}</span>
        <h3 className="font-semibold text-chalk">{title}</h3>
        {action && (
          <button
            onClick={action.onClick}
            className="ml-auto flex items-center gap-0.5 text-sm font-medium text-lime hover:underline"
          >
            {action.label} <ChevronRight size={14} />
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-fog">{label}</span>
      <span className={accent ? 'font-medium text-lime' : 'text-chalk'}>{value}</span>
    </div>
  );
}
