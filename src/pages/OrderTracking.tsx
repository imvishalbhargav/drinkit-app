import { motion } from 'framer-motion';
import { CheckCircle2, ChevronLeft, Clock, MapPin, PackageCheck, ShoppingBag, Truck } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import RiderMap from '../components/tracking/RiderMap';
import { inr, formatDate } from '../lib/format';
import { findOrder, useOrders } from '../store/orders';
import type { OrderStatus } from '../types';

const STEPS: { id: OrderStatus; label: string; icon: any }[] = [
  { id: 'confirmed', label: 'Order confirmed', icon: CheckCircle2 },
  { id: 'packed', label: 'Packed & ready', icon: ShoppingBag },
  { id: 'out_for_delivery', label: 'Out for delivery', icon: Truck },
  { id: 'delivered', label: 'Delivered', icon: PackageCheck },
];

export default function OrderTracking() {
  const { id } = useParams<{ id: string }>();
  const list = useOrders((s) => s.list);
  const updateStatus = useOrders((s) => s.updateStatus);
  const order = id ? findOrder(list, id) : undefined;

  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const { progress, remaining, status } = useMemo(() => {
    if (!order) return { progress: 0, remaining: 0, status: 'confirmed' as OrderStatus };
    const mins = (now - order.createdAt) / 60000;
    const pr = Math.min(1, mins / order.etaMinutes);
    const st: OrderStatus =
      pr >= 1 ? 'delivered' : pr >= 0.3 ? 'out_for_delivery' : pr >= 0.08 ? 'packed' : 'confirmed';
    return { progress: pr, remaining: Math.max(0, Math.ceil(order.etaMinutes - mins)), status: st };
  }, [order, now]);

  useEffect(() => {
    if (order && order.status !== status) updateStatus(order.id, status);
  }, [order, status, updateStatus]);

  if (!order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-lg font-semibold text-chalk">Order not found</p>
        <Link to="/orders" className="mt-3 inline-block text-lime hover:underline">
          ← View all orders
        </Link>
      </div>
    );
  }

  const activeIdx = STEPS.findIndex((s) => s.id === status);
  const delivered = status === 'delivered';

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <Link to="/orders" className="mb-4 inline-flex items-center gap-1 text-sm text-fog hover:text-chalk">
        <ChevronLeft size={16} /> All orders
      </Link>

      {/* status banner */}
      <div className="mb-4 flex items-center justify-between rounded-2xl border border-hair bg-panel/50 p-4">
        <div>
          <p className="text-xs text-fog">Order {order.id}</p>
          <h1 className="font-display text-xl font-bold text-chalk">
            {delivered ? 'Delivered 🎉' : `Arriving in ${remaining} min`}
          </h1>
        </div>
        <span
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
            delivered ? 'bg-success/15 text-success' : 'bg-lime/10 text-lime'
          }`}
        >
          <Clock size={13} /> {delivered ? 'Done' : `${order.etaMinutes} min ETA`}
        </span>
      </div>

      <RiderMap progress={progress} />

      {/* timeline */}
      <div className="mt-5 rounded-2xl border border-hair bg-panel/50 p-5">
        <div className="space-y-4">
          {STEPS.map((step, i) => {
            const done = i < activeIdx;
            const active = i === activeIdx;
            return (
              <div key={step.id} className="flex items-center gap-3">
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${
                    done || active ? 'bg-neon-lime text-ink' : 'bg-panel2 text-fog'
                  }`}
                >
                  <step.icon size={16} />
                </span>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${done || active ? 'text-chalk' : 'text-fog'}`}>
                    {step.label}
                  </p>
                </div>
                {active && !delivered && (
                  <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1.4 }}
                    className="text-xs font-medium text-lime"
                  >
                    In progress
                  </motion.span>
                )}
                {done && <CheckCircle2 size={16} className="text-success" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* address + items */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-hair bg-panel/50 p-4">
          <p className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-chalk">
            <MapPin size={15} className="text-lime" /> Delivering to
          </p>
          <p className="text-sm text-fog">
            <span className="font-medium text-chalk">{order.address.label}</span> · {order.address.line1},{' '}
            {order.address.city} {order.address.pincode}
          </p>
          <p className="mt-2 text-xs text-fog">Placed {formatDate(order.createdAt)}</p>
        </div>
        <div className="rounded-2xl border border-hair bg-panel/50 p-4">
          <p className="mb-2 text-sm font-semibold text-chalk">{order.items.length} items · {inr(order.total)}</p>
          <div className="space-y-1">
            {order.items.map((it) => (
              <div key={it.id} className="flex justify-between text-sm">
                <span className="text-fog">
                  {it.name} ×{it.qty}
                </span>
                <span className="text-chalk">{inr(it.price * it.qty)}</span>
              </div>
            ))}
          </div>
          <p className="mt-2 border-t border-hair pt-2 text-xs text-fog">
            Paid via {order.paymentMethod}
            {order.paymentId ? ` · ${order.paymentId}` : ''}
          </p>
        </div>
      </div>
    </div>
  );
}
