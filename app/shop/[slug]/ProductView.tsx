'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { addToCart } from '@/lib/cart';
import Stepper from '../components/Stepper';
import { restockAction } from '../actions';
import { setPartOptions, usd, MAX_PER_LINE, type Product } from '@/lib/shop-types';

export default function ProductView({ product, catalog, email }: { product: Product; catalog: Product[]; email: string }) {
  const isSet = Boolean(product.set_parts);
  const [size, setSize] = useState<string | null>(null);
  const [parts, setParts] = useState<(string | null)[]>(() => (product.set_parts ?? []).map(() => null));
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const variant = product.variants.find((v) => v.size === size) ?? null;
  const oneSize = product.variants.length === 1 && product.variants[0].size === 'One size';
  const chosenVariant = oneSize ? product.variants[0] : variant;

  // What's still in stock, to cap quantity.
  const partChoices = (product.set_parts ?? []).map((part, i) => {
    const options = setPartOptions(part, catalog);
    const picked = options.find((o) => `${o.slug}:${o.size}` === parts[i]) ?? null;
    return { part, options, picked };
  });
  const maxQty = Math.min(
    MAX_PER_LINE,
    isSet
      ? Math.min(...partChoices.map((c) => c.picked?.stock ?? 0))
      : chosenVariant?.stock ?? 0
  );
  const ready = isSet ? partChoices.every((c) => c.picked && c.picked.stock > 0) : Boolean(chosenVariant && chosenVariant.stock > 0);
  const soldOutPick = !isSet && chosenVariant && chosenVariant.stock === 0 ? chosenVariant : null;

  function add() {
    if (!ready) return;
    addToCart(
      isSet
        ? { slug: product.slug, parts: partChoices.map((c) => ({ slug: c.picked!.slug, size: c.picked!.size })) }
        : { slug: product.slug, size: chosenVariant!.size },
      Math.max(1, Math.min(qty, maxQty))
    );
    setAdded(true);
  }

  return (
    <div>
      <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{product.name}</h1>
      <div style={{ fontSize: 22, fontWeight: 700, marginTop: 10 }}>{usd(product.price_cents)}</div>
      {product.description && <p className="ee-body" style={{ marginTop: 16, fontSize: 15 }}>{product.description}</p>}

      {/* Regular product: sizes */}
      {!isSet && !oneSize && (
        <div style={{ marginTop: 28 }}>
          <div className="ee-label" style={{ marginBottom: 10 }}>Size</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {product.variants.map((v) => {
              const selected = size === v.size;
              const out = v.stock === 0;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => { setSize(v.size); setAdded(false); setQty(1); }}
                  aria-pressed={selected}
                  style={{
                    minWidth: 56, padding: '12px 14px', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: 14,
                    border: selected ? '1px solid var(--ee-navy-900)' : '1px solid var(--ee-line)',
                    background: selected ? 'var(--ee-navy-900)' : 'var(--ee-paper)',
                    color: selected ? '#fff' : out ? 'var(--ee-ink-3)' : 'var(--ee-ink)',
                    textDecoration: out ? 'line-through' : 'none',
                  }}
                >
                  {v.size}
                </button>
              );
            })}
          </div>
          {chosenVariant && chosenVariant.stock > 0 && chosenVariant.stock <= 3 && (
            <div className="ee-small" style={{ marginTop: 10, color: 'var(--ee-gold-deep)' }}>Only {chosenVariant.stock} left</div>
          )}
        </div>
      )}

      {/* Set: one choice per part */}
      {isSet && (
        <div style={{ marginTop: 28, display: 'grid', gap: 18 }}>
          {partChoices.map(({ part, options }, i) => (
            <div key={part.label}>
              <label className="ee-label" htmlFor={`part-${i}`}>{part.label}</label>
              <select
                id={`part-${i}`}
                className="ee-input"
                value={parts[i] ?? ''}
                onChange={(e) => { setParts((p) => p.map((v, j) => (j === i ? e.target.value || null : v))); setAdded(false); setQty(1); }}
              >
                <option value="">Choose {part.label.toLowerCase()} & size…</option>
                {options.map((o) => (
                  <option key={`${o.slug}:${o.size}`} value={`${o.slug}:${o.size}`} disabled={o.stock === 0}>
                    {part.products.length > 1 ? `${o.productName} — ${o.size}` : o.size}
                    {o.stock === 0 ? ' (sold out)' : ''}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      {/* Sold-out size: notify instead of add */}
      {soldOutPick ? (
        <NotifyForm variantId={soldOutPick.id} label={`${product.name}${oneSize ? '' : ` (${soldOutPick.size})`}`} email={email} />
      ) : (
        <>
          {ready && maxQty > 1 && (
            <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className="ee-label" style={{ margin: 0 }}>Qty</span>
              <Stepper value={qty} max={maxQty} onChange={(n) => { setQty(n); setAdded(false); }} />
            </div>
          )}
          <button
            type="button"
            className="ee-btn ee-btn-dark"
            style={{ marginTop: 24, width: '100%', padding: 16, opacity: ready ? 1 : 0.5 }}
            disabled={!ready}
            onClick={add}
          >
            {ready ? `Add to cart — ${usd(product.price_cents * qty)}` : isSet ? 'Choose your sizes' : 'Choose a size'}
          </button>
          {added && (
            <div style={{ marginTop: 14, padding: '12px 14px', background: 'var(--ee-lavender)', borderRadius: 6, fontSize: 14, display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <span>Added to your cart.</span>
              <Link href="/shop/cart" style={{ fontWeight: 700, borderBottom: '1px solid currentColor' }}>View cart →</Link>
            </div>
          )}
        </>
      )}

      <p className="ee-small" style={{ marginTop: 22, lineHeight: 1.6 }}>
        US shipping $8 per order, or free pickup at an upcoming EEC event — you&apos;ll choose in your cart.
      </p>
    </div>
  );
}

function NotifyForm({ variantId, label, email: initial }: { variantId: string; label: string; email: string }) {
  const [email, setEmail] = useState(initial);
  const [state, setState] = useState<{ done?: boolean; error?: string }>({});
  const [pending, start] = useTransition();

  if (state.done) {
    return (
      <div style={{ marginTop: 24, padding: 16, background: 'var(--ee-lavender)', borderRadius: 8, fontSize: 14, lineHeight: 1.5 }}>
        You&apos;re on the list. We&apos;ll email <strong>{email}</strong> once when the {label} is back.
      </div>
    );
  }
  return (
    <form
      style={{ marginTop: 24, padding: 18, border: '1px solid var(--ee-line)', borderRadius: 8 }}
      onSubmit={(e) => {
        e.preventDefault();
        start(async () => {
          const res = await restockAction(variantId, email);
          setState(res.ok ? { done: true } : { error: res.error ?? 'Something went wrong.' });
        });
      }}
    >
      <div style={{ fontWeight: 700 }}>Sold out</div>
      <p className="ee-small" style={{ marginTop: 4 }}>Get one email when the {label} is back in stock.</p>
      <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
        <input
          className="ee-input"
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ flex: '1 1 200px' }}
        />
        <button type="submit" className="ee-btn ee-btn-dark" disabled={pending}>{pending ? 'Saving…' : 'Notify me'}</button>
      </div>
      {state.error && <div style={{ marginTop: 10, color: '#C0392B', fontSize: 13 }}>{state.error}</div>}
    </form>
  );
}
