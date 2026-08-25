import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingBag, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { FREE_DELIVERY_ABOVE } from '../../lib/config';
import { inr } from '../../lib/format';
import { cartTotals, useCart } from '../../store/cart';
import { useUI } from '../../store/ui';
import Button from '../common/Button';
import QtyStepper from '../common/QtyStepper';

export default function CartDrawer() {
  const open = useUI((s) => s.cartOpen);
  const close = useUI((s) => s.closeCart);
  const navigate = useNavigate();

  const items = useCart((s) => s.items);
  const inc = useCart((s) => s.inc);
  const dec = useCart((s) => s.dec);
  const t = cartTotals(items);

  const toFree = Math.max(0, FREE_DELIVERY_ABOVE - t.subtotal);

  const goCheckout = () => {
    close();
    navigate('/checkout');
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} />
          <motion.aside
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-hair bg-ink shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
          >
            <div className="flex items-center justify-between border-b border-hair px-5 py-4">
              <h3 className="font-display text-lg font-bold text-chalk">
                Your cart {t.count > 0 && <span className="text-fog">· {t.count}</span>}
              </h3>
              <button onClick={close} className="grid h-9 w-9 place-items-center rounded-full text-fog hover:bg-panel2 hover:text-chalk">
                <X size={18} />
              </button>
            </div>

            {t.count === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-panel2 text-fog">
                  <ShoppingBag size={26} />
                </div>
                <p className="font-medium text-chalk">Your cart is empty</p>
                <p className="text-sm text-fog">Add some drinks to get started.</p>
                <Button variant="primary" onClick={close}>
                  Browse drinks
                </Button>
              </div>
            ) : (
              <>
                {toFree > 0 ? (
                  <p className="border-b border-hair bg-panel/40 px-5 py-2.5 text-xs text-fog">
                    Add <span className="font-semibold text-lime">{inr(toFree)}</span> more for FREE delivery 🚀
                  </p>
                ) : (
                  <p className="border-b border-hair bg-lime/10 px-5 py-2.5 text-xs font-semibold text-lime">
                    You've unlocked FREE delivery 🎉
                  </p>
                )}

                <div className="no-scrollbar flex-1 space-y-3 overflow-y-auto px-5 py-4">
                  {t.lines.map((l) => (
                    <div key={l.id} className="flex gap-3 rounded-2xl border border-hair bg-panel/50 p-2.5">
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-panel2">
                        <img src={l.image} alt={l.name} className="h-full w-full object-cover" onError={(e) => ((e.target as HTMLImageElement).style.opacity = '0')} />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <p className="line-clamp-2 text-sm font-medium text-chalk">{l.name}</p>
                        <p className="text-xs text-fog">{l.volume}</p>
                        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
                          <span className="text-sm font-semibold text-chalk">{inr(l.price * l.qty)}</span>
                          <QtyStepper size="sm" qty={l.qty} onInc={() => inc(l.id)} onDec={() => dec(l.id)} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* bill */}
                <div className="border-t border-hair px-5 py-4">
                  <div className="space-y-1.5 text-sm">
                    <Row label="Item total" value={inr(t.subtotal)} />
                    {t.savings > 0 && <Row label="Savings" value={`- ${inr(t.savings)}`} accent />}
                    <Row label="Delivery" value={t.deliveryFee ? inr(t.deliveryFee) : 'FREE'} />
                    <Row label="Handling" value={inr(t.handling)} />
                    <div className="mt-2 flex items-center justify-between border-t border-hair pt-2 text-base font-bold text-chalk">
                      <span>To pay</span>
                      <span>{inr(t.total)}</span>
                    </div>
                  </div>
                  <Button block size="lg" variant="primary" className="mt-4" onClick={goCheckout}>
                    Proceed to checkout · {inr(t.total)}
                  </Button>
                </div>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
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
