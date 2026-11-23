'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useCart, setQuantity } from '@/lib/cart';
import { checkoutAction } from '../actions';
import Stepper from '../components/Stepper';
import { SHIPPING_CENTS, MAX_PER_LINE, usd, type CartLine, type Fulfillment, type Product } from '@/lib/shop-types';

/** Turns a stored cart line into what to show, using today's prices and stock. */
function describe(line: CartLine, catalog: Product[]) {
  const product = catalog.find((p) => p.slug === line.slug);
  if (!product) return null;
  if (product.set_parts) {
    const picks = (line.parts ?? []).map((pick) => {
      const p = catalog.find((c) => c.slug === pick.slug);
      return { label: `${p?.name ?? pick.slug} ${pick.size}`, stock: p?.variants.find((v) => v.size === pick.size)?.stock ?? 0 };
    });
    return { product, detail: picks.map((p) => p.label).join(' · '), stock: Math.min(...picks.map((p) => p.stock)) };
  }
  const variant = product.variants.find((v) => v.size === line.size);
  return { product, detail: line.size === 'One size' ? '' : line.size ?? '', stock: variant?.stock ?? 0 };
}

export default function CartView({ catalog, canceled }: { catalog: Product[]; canceled: boolean }) {
  const cart = useCart();
  const [fulfillment, setFulfillment] = useState<Fulfillment>('ship');
  const [error, setError] = useState('');
  const [pending, start] = useTransition();

  const rows = cart.map((line) => ({ line, info: describe(line, catalog) }));
  const problems = rows.filter(({ line, info }) => !info || info.stock < line.quantity);
  const subtotal = rows.reduce((n, { line, info }) => n + (info ? info.product.price_cents * line.quantity : 0), 0);
  const shipping = fulfillment === 'ship' ? SHIPPING_CENTS : 0;

  function checkout() {
    setError('');
    start(async () => {
      const res = await checkoutAction(cart, fulfillment);
      if (res.ok) window.location.href = res.url;
      else setError(res.error);
    });
  }

  if (cart.length === 0) {
    return (
      <section style={{ padding: '56px 56px 96px', maxWidth: 640 }} className="ee-cart-empty">
        <h1 style={{ fontSize: 32, fontWeight: 800 }}>Your cart is empty.</h1>
        {canceled && <p className="ee-body" style={{ marginTop: 10 }}>Checkout was cancelled and you weren&apos;t charged.</p>}
        <Link href="/shop" className="ee-btn ee-btn-dark" style={{ marginTop: 24 }}>Browse the shop →</Link>
      </section>
    );
  }

  return (
    <section className="ee-cart-page">
      <div>
        <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.01em' }}>Your cart</h1>
        {canceled && (
          <div style={{ marginTop: 14, padding: '10px 14px', background: 'var(--ee-paper-2)', borderRadius: 6, fontSize: 14 }}>
            Checkout was cancelled and you weren&apos;t charged. Your cart is still here.
          </div>
        )}
        <div style={{ marginTop: 20, borderTop: '1px solid var(--ee-line)' }}>
          {rows.map(({ line, info }) => (
            <div key={line.key} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '18px 0', borderBottom: '1px solid var(--ee-line)', flexWrap: 'wrap' }}>
              <div style={{ minWidth: 0, flex: '1 1 220px' }}>
                <div style={{ fontWeight: 700 }}>{info?.product.name ?? 'No longer available'}</div>
                {info?.detail && <div className="ee-small" style={{ marginTop: 2 }}>{info.detail}</div>}
                {info && info.stock < line.quantity && (
                  <div style={{ marginTop: 6, color: '#C0392B', fontSize: 13 }}>
                    {info.stock === 0 ? 'Sold out — please remove.' : `Only ${info.stock} left — please lower the quantity.`}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setQuantity(line.key, 0)}
                  style={{ marginTop: 8, background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--ee-ink-3)', fontSize: 13, borderBottom: '1px solid currentColor' }}
                >
                  Remove
                </button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                {info && (
                  <Stepper
                    value={line.quantity}
                    max={Math.max(1, Math.min(MAX_PER_LINE, info.stock))}
                    onChange={(n) => setQuantity(line.key, n)}
                  />
                )}
                <div style={{ minWidth: 64, textAlign: 'right', fontWeight: 700 }}>
                  {info ? usd(info.product.price_cents * line.quantity) : '—'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="ee-card" style={{ padding: 24 }}>
        <div className="ee-mono" style={{ color: 'var(--ee-gold-deep)' }}>DELIVERY</div>
        <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
          {([
            ['ship', 'Ship to me', `US only · ${usd(SHIPPING_CENTS)}`],
            ['pickup', 'Pick up at an EEC event', "Free · we'll email you which event"],
          ] as const).map(([value, title, sub]) => (
            <label
              key={value}
              style={{
                display: 'flex', gap: 12, alignItems: 'flex-start', padding: 14, borderRadius: 8, cursor: 'pointer',
                border: fulfillment === value ? '1px solid var(--ee-navy-900)' : '1px solid var(--ee-line)',
                background: fulfillment === value ? 'var(--ee-lavender)' : 'transparent',
              }}
            >
              <input type="radio" name="fulfillment" checked={fulfillment === value} onChange={() => setFulfillment(value)} style={{ marginTop: 3 }} />
              <span>
                <span style={{ fontWeight: 700, display: 'block' }}>{title}</span>
                <span className="ee-small">{sub}</span>
              </span>
            </label>
          ))}
        </div>

        <div style={{ marginTop: 20, display: 'grid', gap: 8, fontSize: 14 }}>
          <Row label="Subtotal" value={usd(subtotal)} />
          <Row label={fulfillment === 'ship' ? 'Shipping' : 'Pickup'} value={shipping ? usd(shipping) : 'Free'} />
          <Row label="Tax" value="Calculated at checkout" muted />
          <div style={{ borderTop: '1px solid var(--ee-line)', paddingTop: 10 }}>
            <Row label="Total before tax" value={usd(subtotal + shipping)} strong />
          </div>
        </div>

        {error && (
          <div style={{ marginTop: 16, color: '#C0392B', fontSize: 13, padding: '10px 14px', background: 'rgba(192,57,43,0.08)', borderRadius: 4, lineHeight: 1.5 }}>
            {error}
          </div>
        )}

        <button
          type="button"
          className="ee-btn ee-btn-dark"
          style={{ marginTop: 20, width: '100%', padding: 16, opacity: problems.length ? 0.5 : 1 }}
          disabled={pending || problems.length > 0}
          onClick={checkout}
        >
          {pending ? 'Opening checkout…' : 'Checkout →'}
        </button>
        <p className="ee-small" style={{ marginTop: 12, textAlign: 'center', lineHeight: 1.5 }}>
          Secure checkout by Stripe. Your items are held for 30 minutes while you pay.
        </p>
      </div>
    </section>
  );
}

function Row({ label, value, strong, muted }: { label: string; value: string; strong?: boolean; muted?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontWeight: strong ? 700 : 400, color: muted ? 'var(--ee-ink-3)' : 'inherit' }}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
