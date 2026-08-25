import { ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Price from '../components/common/Price';
import QtyStepper from '../components/common/QtyStepper';
import { FREE_DELIVERY_ABOVE } from '../lib/config';
import { inr } from '../lib/format';
import { cartTotals, useCart } from '../store/cart';

export default function Cart() {
  const navigate = useNavigate();
  const items = useCart((s) => s.items);
  const inc = useCart((s) => s.inc);
  const dec = useCart((s) => s.dec);
  const remove = useCart((s) => s.remove);
  const t = cartTotals(items);

  if (t.count === 0) {
    return (
      <div className="mx-auto grid max-w-md place-items-center px-4 py-24 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-panel2 text-fog">
          <ShoppingBag size={26} />
        </div>
        <p className="mt-4 font-medium text-chalk">Your cart is empty</p>
        <p className="text-sm text-fog">Looks like you haven't added any drinks yet.</p>
        <Link to="/" className="mt-4">
          <Button variant="primary">Browse drinks</Button>
        </Link>
      </div>
    );
  }

  const toFree = Math.max(0, FREE_DELIVERY_ABOVE - t.subtotal);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="mb-5 font-display text-2xl font-bold text-chalk">Your cart · {t.count} items</h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* lines */}
        <div className="space-y-3">
          {t.lines.map((l) => (
            <div key={l.id} className="flex gap-4 rounded-2xl border border-hair bg-panel/50 p-3">
              <Link to={`/product/${l.id}`} className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-panel2">
                <img
                  src={l.image}
                  alt={l.name}
                  className="h-full w-full object-cover"
                  onError={(e) => ((e.target as HTMLImageElement).style.opacity = '0')}
                />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <Link to={`/product/${l.id}`} className="line-clamp-2 text-sm font-medium text-chalk hover:text-lime">
                  {l.name}
                </Link>
                <p className="text-xs text-fog">{l.volume}</p>
                <Price price={l.price} mrp={l.mrp} size="sm" className="mt-1" />
                <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                  <button onClick={() => remove(l.id)} className="text-xs text-fog hover:text-danger">
                    Remove
                  </button>
                  <QtyStepper size="sm" qty={l.qty} onInc={() => inc(l.id)} onDec={() => dec(l.id)} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* bill */}
        <aside className="h-fit rounded-2xl border border-hair bg-panel/50 p-5 lg:sticky lg:top-24">
          <h2 className="font-display text-lg font-bold text-chalk">Bill details</h2>
          {toFree > 0 && (
            <p className="mt-2 rounded-lg bg-panel2 px-3 py-2 text-xs text-fog">
              Add <span className="font-semibold text-lime">{inr(toFree)}</span> more for FREE delivery
            </p>
          )}
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
          <Button block size="lg" variant="primary" className="mt-5" onClick={() => navigate('/checkout')}>
            Proceed to checkout
          </Button>
        </aside>
      </div>
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
