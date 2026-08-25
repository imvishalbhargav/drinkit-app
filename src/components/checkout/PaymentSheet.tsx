import { Banknote, CreditCard, Loader2, Smartphone, Zap } from 'lucide-react';
import { useMemo, useState } from 'react';
import { inr, makeId } from '../../lib/format';
import { openRazorpay, razorpayReady } from '../../lib/razorpay';
import { cn } from '../../lib/cn';
import { useUI } from '../../store/ui';
import Button from '../common/Button';
import Modal from '../common/Modal';

interface Props {
  open: boolean;
  onClose: () => void;
  amount: number;
  name: string;
  contact: string;
  email?: string;
  orderId: string;
  onPaid: (method: string, paymentId?: string) => void;
}

type MethodId = 'razorpay' | 'upi' | 'card' | 'cod';

export default function PaymentSheet({ open, onClose, amount, name, contact, email, orderId, onPaid }: Props) {
  const showToast = useUI((s) => s.showToast);
  const [busy, setBusy] = useState(false);

  const methods = useMemo(() => {
    const base: { id: MethodId; label: string; sub: string; icon: any }[] = [];
    if (razorpayReady())
      base.push({ id: 'razorpay', label: 'Pay online', sub: 'Cards, UPI, wallets · Razorpay', icon: Zap });
    base.push({ id: 'upi', label: 'UPI', sub: 'GPay, PhonePe, Paytm', icon: Smartphone });
    base.push({ id: 'card', label: 'Credit / Debit card', sub: 'Visa, Mastercard, RuPay', icon: CreditCard });
    base.push({ id: 'cod', label: 'Cash on delivery', sub: 'Pay when it arrives', icon: Banknote });
    return base;
  }, []);

  const [selected, setSelected] = useState<MethodId>(methods[0].id);

  const pay = async () => {
    setBusy(true);
    try {
      if (selected === 'razorpay') {
        const res = await openRazorpay({ amount, name, contact, email, orderId });
        onPaid(res.method, res.paymentId);
      } else if (selected === 'cod') {
        await new Promise((r) => setTimeout(r, 500));
        onPaid('Cash on Delivery');
      } else {
        // demo online payment
        await new Promise((r) => setTimeout(r, 1300));
        onPaid(selected === 'upi' ? 'UPI' : 'Card', `DEMO-${makeId('PAY').replace('PAY-', '')}`);
      }
    } catch (e: any) {
      if (e?.message === 'cancelled') showToast('Payment cancelled');
      else showToast(e?.message || 'Payment failed');
      setBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={busy ? () => {} : onClose} title="Choose payment method" size="md" dismissable={!busy}>
      <div className="space-y-2.5">
        {methods.map((m) => (
          <button
            key={m.id}
            disabled={busy}
            onClick={() => setSelected(m.id)}
            className={cn(
              'flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition',
              selected === m.id ? 'border-lime/50 bg-lime/10' : 'border-hair bg-panel/50 hover:border-fog/30'
            )}
          >
            <span
              className={cn(
                'grid h-10 w-10 place-items-center rounded-xl',
                selected === m.id ? 'bg-neon-lime text-ink' : 'bg-panel2 text-fog'
              )}
            >
              <m.icon size={18} />
            </span>
            <span className="flex-1">
              <span className="block text-sm font-semibold text-chalk">{m.label}</span>
              <span className="block text-xs text-fog">{m.sub}</span>
            </span>
            <span
              className={cn(
                'grid h-5 w-5 place-items-center rounded-full border',
                selected === m.id ? 'border-lime bg-lime' : 'border-hair'
              )}
            >
              {selected === m.id && <span className="h-2 w-2 rounded-full bg-ink" />}
            </span>
          </button>
        ))}
      </div>

      {!razorpayReady() && (
        <p className="mt-3 text-center text-[11px] text-fog/80">
          Demo mode — no real money is charged. Add a Razorpay key to go live.
        </p>
      )}

      <Button block size="lg" variant="primary" className="mt-4" onClick={pay} disabled={busy}>
        {busy ? (
          <Loader2 size={18} className="animate-spin" />
        ) : selected === 'cod' ? (
          `Place order · ${inr(amount)}`
        ) : (
          `Pay ${inr(amount)}`
        )}
      </Button>
    </Modal>
  );
}
