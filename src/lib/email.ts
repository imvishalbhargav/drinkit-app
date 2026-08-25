import { CONFIG, isConfigured } from './config';
import type { Order, User } from '../types';
import { inr, formatDate } from './format';

/**
 * Sends the placed order to the store owner's inbox via EmailJS. With no keys
 * it logs a formatted summary to the console (demo mode) and reports success so
 * the order flow always completes.
 */

function formatAddr(o: Order): string {
  const a = o.address;
  return [a.label, a.line1, a.line2, `${a.city} ${a.pincode}`].filter(Boolean).join(', ');
}

function buildSummary(order: Order, user: User): string {
  const lines = order.items
    .map((i) => `  • ${i.name} (${i.volume}) ×${i.qty} — ${inr(i.price * i.qty)}`)
    .join('\n');
  return [
    `New DrinKit order ${order.id}`,
    `Placed: ${formatDate(order.createdAt)}`,
    `Customer: ${user.name || '—'} · ${user.phone}${user.email ? ` · ${user.email}` : ''}`,
    `Deliver to: ${formatAddr(order)}`,
    '',
    'Items:',
    lines,
    '',
    `Subtotal: ${inr(order.subtotal)}`,
    `Delivery: ${order.deliveryFee ? inr(order.deliveryFee) : 'FREE'}`,
    `Total paid: ${inr(order.total)}`,
    `Payment: ${order.paymentMethod}${order.paymentId ? ` (${order.paymentId})` : ''}`,
    `ETA: ${order.etaMinutes} min`,
  ].join('\n');
}

export async function sendOrderEmail(
  order: Order,
  user: User
): Promise<{ ok: boolean; demo: boolean; error?: string }> {
  const summary = buildSummary(order, user);

  if (!isConfigured.email) {
    // eslint-disable-next-line no-console
    console.info(`%c[DrinKit] Order email (demo — not actually sent):`, 'color:#B6FF3C', `\n${summary}`);
    return { ok: true, demo: true };
  }

  try {
    const emailjs = (await import('@emailjs/browser')).default;
    await emailjs.send(
      CONFIG.emailjs.serviceId,
      CONFIG.emailjs.templateId,
      {
        order_id: order.id,
        to_email: CONFIG.orderEmail,
        customer_name: user.name || 'Customer',
        customer_phone: user.phone,
        customer_email: user.email || '',
        address: formatAddr(order),
        items: order.items.map((i) => `${i.name} x${i.qty} — ${inr(i.price * i.qty)}`).join('\n'),
        subtotal: inr(order.subtotal),
        total: inr(order.total),
        payment: `${order.paymentMethod}${order.paymentId ? ` (${order.paymentId})` : ''}`,
        placed_at: formatDate(order.createdAt),
        eta: `${order.etaMinutes} min`,
        summary,
      },
      { publicKey: CONFIG.emailjs.publicKey }
    );
    return { ok: true, demo: false };
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.error('[DrinKit] EmailJS send failed:', e);
    return { ok: false, demo: false, error: e?.message || 'send failed' };
  }
}
