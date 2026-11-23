import Link from 'next/link';
import EENav from '../../../components/EENav';
import EEFooter from '../../../components/EEFooter';
import ClearCart from './ClearCart';
import RefreshSoon from '../../../pay/[rsvpId]/RefreshSoon';
import { verifyOrderToken } from '@/lib/confirm';
import { getOrder, syncOrder } from '@/lib/shop';
import { CONTACT_EMAIL } from '@/lib/contact';
import { usd } from '@/lib/shop-types';

export const dynamic = 'force-dynamic';

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ t?: string; paid?: string; try?: string }>;
}) {
  const { orderId } = await params;
  const { t, paid, try: attempt } = await searchParams;
  const valid = verifyOrderToken(orderId, t);

  if (valid && paid) await syncOrder(orderId).catch((err) => console.error('[shop] sync failed:', err));
  const data = valid ? await getOrder(orderId) : null;
  const order = data?.order;
  const confirmed = order && ['paid', 'shipped', 'picked_up'].includes(order.status);
  const finalizing = order?.status === 'pending' && Boolean(paid);

  return (
    <div style={{ background: 'var(--ee-paper)', minHeight: '100vh' }}>
      <EENav />
      <section className="ee-section" style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="ee-card" style={{ width: '100%', maxWidth: 560, padding: 36 }}>
          {!order && (
            <>
              <h1 style={{ fontSize: 28, fontWeight: 800 }}>We couldn&apos;t find that order.</h1>
              <p className="ee-body" style={{ marginTop: 10 }}>
                Check the link in your confirmation email, or email{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} style={{ borderBottom: '1px solid currentColor' }}>{CONTACT_EMAIL}</a>.
              </p>
            </>
          )}

          {finalizing && (
            <>
              <h1 style={{ fontSize: 28, fontWeight: 800 }}>Finalizing your order…</h1>
              <p className="ee-body" style={{ marginTop: 10 }}>Stripe is confirming your payment. This usually takes a few seconds.</p>
              <RefreshSoon attempt={Number(attempt ?? 0)} />
            </>
          )}

          {order && !confirmed && !finalizing && (
            <>
              <h1 style={{ fontSize: 28, fontWeight: 800 }}>This order wasn&apos;t completed.</h1>
              <p className="ee-body" style={{ marginTop: 10 }}>You weren&apos;t charged. Your cart is still saved.</p>
              <Link href="/shop/cart" className="ee-btn ee-btn-dark" style={{ marginTop: 20 }}>Back to cart →</Link>
            </>
          )}

          {order && confirmed && data && (
            <>
              <ClearCart />
              <div className="ee-mono" style={{ color: 'var(--ee-gold-deep)' }}>ORDER #{order.id.slice(0, 8).toUpperCase()}</div>
              <h1 style={{ marginTop: 12, fontSize: 28, fontWeight: 800 }}>
                {order.status === 'shipped' ? 'Your order has shipped.' : order.status === 'picked_up' ? 'Order picked up.' : 'Thanks for your order! ✓'}
              </h1>
              <p className="ee-body" style={{ marginTop: 10 }}>
                {order.fulfillment === 'pickup'
                  ? "You'll pick this up at an upcoming EEC event — we'll email you which one."
                  : "We'll ship it within the US and let you know when it's on the way."}{' '}
                {order.email && <>A receipt is on its way to <strong>{order.email}</strong>.</>}
              </p>

              <div style={{ marginTop: 20, padding: 18, background: 'var(--ee-lavender)', borderRadius: 8, display: 'grid', gap: 8, fontSize: 14 }}>
                {data.items.map((i, n) => (
                  <div key={n} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                    <span>{i.name}{i.detail ? ` (${i.detail})` : ''} × {i.quantity}</span>
                    <span style={{ fontWeight: 600 }}>{usd(i.unit_cents * i.quantity)}</span>
                  </div>
                ))}
                <div style={{ borderTop: '1px solid var(--ee-line)', paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                  <span>Total</span>
                  <span>{usd(order.total_cents ?? order.subtotal_cents)}</span>
                </div>
              </div>

              <p className="ee-small" style={{ marginTop: 18 }}>
                Questions? Email <a href={`mailto:${CONTACT_EMAIL}`} style={{ borderBottom: '1px solid currentColor' }}>{CONTACT_EMAIL}</a> with your order number.
              </p>
            </>
          )}

          <div style={{ marginTop: 28, paddingTop: 18, borderTop: '1px solid var(--ee-line)' }}>
            <Link href="/shop" className="ee-mono" style={{ color: 'var(--ee-ink-2)' }}>← Back to the shop</Link>
          </div>
        </div>
      </section>
      <EEFooter />
    </div>
  );
}
