import { CONFIG, isConfigured } from './config';

/**
 * Razorpay checkout. `checkout.js` is loaded from index.html. When a key is
 * present this opens the real Razorpay sheet; otherwise the caller (PaymentSheet)
 * runs a demo flow instead of calling this.
 */

export interface PayResult {
  ok: boolean;
  paymentId: string;
  method: string;
  demo: boolean;
}

interface PayOpts {
  amount: number; // in ₹
  name: string;
  contact: string;
  email?: string;
  orderId: string;
}

export function razorpayReady(): boolean {
  return isConfigured.razorpay && typeof (window as any).Razorpay !== 'undefined';
}

export function openRazorpay(opts: PayOpts): Promise<PayResult> {
  return new Promise((resolve, reject) => {
    const Razorpay = (window as any).Razorpay;
    if (!Razorpay) return reject(new Error('Razorpay script not loaded'));

    const rzp = new Razorpay({
      key: CONFIG.razorpayKeyId,
      amount: Math.round(opts.amount * 100), // paise
      currency: 'INR',
      name: 'DrinKit',
      description: `Order ${opts.orderId}`,
      image: '/logo.svg',
      prefill: { name: opts.name, contact: opts.contact, email: opts.email || '' },
      theme: { color: '#B6FF3C' },
      handler: (resp: any) =>
        resolve({
          ok: true,
          paymentId: resp.razorpay_payment_id || 'rzp_unknown',
          method: 'Razorpay',
          demo: false,
        }),
      modal: { ondismiss: () => reject(new Error('cancelled')) },
    });
    rzp.open();
  });
}
