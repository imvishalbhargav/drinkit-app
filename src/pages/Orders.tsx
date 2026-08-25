import { ChevronRight, Clock, PackageCheck, Receipt, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { inr, timeAgo } from '../lib/format';
import { useCart } from '../store/cart';
import { useOrders } from '../store/orders';
import { useUI } from '../store/ui';
import type { OrderStatus } from '../types';

const STATUS_LABEL: Record<OrderStatus, string> = {
  confirmed: 'Confirmed',
  packed: 'Packed',
  out_for_delivery: 'On the way',
  delivered: 'Delivered',
};

export default function Orders() {
  const orders = useOrders((s) => s.list);
  const add = useCart((s) => s.add);
  const openCart = useUI((s) => s.openCart);
  const showToast = useUI((s) => s.showToast);

  const reorder = (items: { id: string; qty: number }[]) => {
    items.forEach((it) => {
      for (let i = 0; i < it.qty; i++) add(it.id);
    });
    showToast('Items added to cart 🛒');
    openCart();
  };

  if (orders.length === 0) {
    return (
      <div className="mx-auto grid max-w-md place-items-center px-4 py-24 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-panel2 text-fog">
          <Receipt size={26} />
        </div>
        <p className="mt-4 font-medium text-chalk">No orders yet</p>
        <p className="text-sm text-fog">Your past orders will show up here.</p>
        <Link to="/" className="mt-4">
          <Button variant="primary">Start shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="mb-5 font-display text-2xl font-bold text-chalk">Your orders</h1>
      <div className="space-y-3">
        {orders.map((o) => {
          const delivered = o.status === 'delivered';
          return (
            <div key={o.id} className="rounded-2xl border border-hair bg-panel/50 p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-chalk">{o.id}</p>
                  <p className="text-xs text-fog">
                    {o.items.length} items · {timeAgo(o.createdAt)}
                  </p>
                </div>
                <span
                  className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    delivered ? 'bg-success/15 text-success' : 'bg-lime/10 text-lime'
                  }`}
                >
                  {delivered ? <PackageCheck size={12} /> : <Clock size={12} />}
                  {STATUS_LABEL[o.status]}
                </span>
              </div>

              <p className="mt-2 line-clamp-1 text-sm text-fog">
                {o.items.map((i) => `${i.name} ×${i.qty}`).join(', ')}
              </p>

              <div className="mt-3 flex items-center justify-between">
                <span className="font-semibold text-chalk">{inr(o.total)}</span>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => reorder(o.items.map((i) => ({ id: i.id, qty: i.qty })))}
                  >
                    <RotateCcw size={14} /> Reorder
                  </Button>
                  <Link to={`/orders/${o.id}`}>
                    <Button size="sm" variant="dark">
                      {delivered ? 'View' : 'Track'} <ChevronRight size={14} />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
