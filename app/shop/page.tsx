'use client';

import { useState } from 'react';
import Link from 'next/link';
import EENav from '../components/EENav';
import EEFooter from '../components/EEFooter';
import EEPhoto from '../components/EEPhoto';

type Tone = 'cool' | 'warm' | 'dark' | 'paper' | 'gold' | 'court';

const ITEMS = [
  { id: 'hat', name: 'EE Signature Hat', sub: 'Midnight Black / Gold', price: 35, tone: 'dark' as Tone, cat: 'Accessories', tag: 'Bestseller' },
  { id: 'tee', name: 'Foundation Tee', sub: 'Engineered Cotton', price: 45, tone: 'paper' as Tone, cat: 'Apparel', tag: null },
  { id: 'hoodie', name: 'System Hoodie', sub: 'Charcoal Gray', price: 85, tone: 'cool' as Tone, cat: 'Apparel', tag: 'New' },
  { id: 'vessel', name: 'Tech Vessel', sub: 'Insulated Steel', price: 40, tone: 'warm' as Tone, cat: 'Accessories', tag: null },
  { id: 'crew', name: 'Practitioner Crewneck', sub: 'Bone White', price: 75, tone: 'paper' as Tone, cat: 'Apparel', tag: null },
  { id: 'cap', name: 'Field Cap', sub: 'Olive Drab', price: 32, tone: 'warm' as Tone, cat: 'Accessories', tag: null },
  { id: 'tote', name: 'Manuscript Tote', sub: 'Heavy Canvas', price: 38, tone: 'paper' as Tone, cat: 'Accessories', tag: null },
  { id: 'jacket', name: 'Operator Coach', sub: 'Black Nylon', price: 145, tone: 'dark' as Tone, cat: 'Outerwear', tag: 'Member drop' },
  { id: 'journal', name: 'Field Journal No. 12', sub: 'Quarterly Print', price: 18, tone: 'gold' as Tone, cat: 'Print', tag: null },
  { id: 'pin', name: 'Compass Pin', sub: 'Brass', price: 14, tone: 'gold' as Tone, cat: 'Accessories', tag: null },
  { id: 'short', name: 'Practice Short', sub: 'Court Black', price: 55, tone: 'dark' as Tone, cat: 'Apparel', tag: null },
  { id: 'socks', name: 'Society Socks', sub: '3-pack', price: 22, tone: 'cool' as Tone, cat: 'Accessories', tag: null },
];

const CATS = ['All', 'Apparel', 'Outerwear', 'Accessories', 'Print'];
const SORTS = ['Featured', 'Newest', 'Price: Low', 'Price: High'];

export default function ShopPage() {
  const [activecat, setActivecat] = useState('All');
  const [sort, setSort] = useState('Featured');

  const filtered = activecat === 'All'
    ? ITEMS
    : ITEMS.filter((i) => i.cat === activecat);

  return (
    <div style={{ background: 'var(--ee-paper)' }}>
      <EENav />

      {/* Page header */}
      <section style={{ padding: '64px 56px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div className="ee-eyebrow">THE SHOP</div>
            <h1 className="ee-h1" style={{ marginTop: 16, fontSize: 80 }}>
              Wear the<br />movement.
            </h1>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
            <p className="ee-body" style={{ maxWidth: 360, fontSize: 15, textAlign: 'right' }}>
              Garments and goods engineered for the everyday practitioner. Designed in Brooklyn. Made small-batch.
            </p>
            <span
              className="ee-tag ee-tag-gold"
              style={{ fontFamily: 'var(--ee-mono)', fontSize: 10, letterSpacing: '0.14em' }}
            >
              MEMBERS · 15% OFF
            </span>
          </div>
        </div>
      </section>

      {/* Filter bar */}
      <section
        style={{
          padding: '20px 56px',
          borderTop: '1px solid var(--ee-line)',
          borderBottom: '1px solid var(--ee-line)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 80,
          background: 'var(--ee-paper)',
          zIndex: 40,
        }}
      >
        <div style={{ display: 'flex', gap: 8 }}>
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => setActivecat(c)}
              className="ee-tag"
              style={{
                background: activecat === c ? 'var(--ee-navy-900)' : 'var(--ee-lavender-2)',
                color: activecat === c ? 'var(--ee-paper)' : 'var(--ee-ink-2)',
                fontSize: 12,
                padding: '8px 14px',
                cursor: 'pointer',
                border: 'none',
              }}
            >
              {c}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <span className="ee-mono">{filtered.length} pieces</span>
          <span style={{ width: 1, height: 16, background: 'var(--ee-line)' }} />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="ee-mono"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--ee-ink-3)',
              outline: 'none',
            }}
          >
            {SORTS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </section>

      {/* Product grid */}
      <section style={{ padding: '40px 56px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
          {filtered.map((p) => (
            <div key={p.id} className="ee-product-tile" style={{ cursor: 'pointer' }}>
              <div style={{ position: 'relative', marginBottom: 14 }}>
                <div style={{ overflow: 'hidden', borderRadius: 6 }}>
                  <EEPhoto
                    tone={p.tone}
                    label={p.name.toUpperCase()}
                    style={{ aspectRatio: '4/5' }}
                    className="ee-product-img"
                  />
                </div>
                {p.tag && (
                  <span
                    style={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      background: p.tag === 'Member drop' ? 'var(--ee-navy-900)' : 'var(--ee-gold)',
                      color: p.tag === 'Member drop' ? '#fff' : 'var(--ee-navy-900)',
                      padding: '4px 10px',
                      borderRadius: 4,
                      fontFamily: 'var(--ee-mono)',
                      fontSize: 9,
                      letterSpacing: '0.16em',
                    }}
                  >
                    {p.tag.toUpperCase()}
                  </span>
                )}
                <button
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.9)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--ee-ink)',
                    cursor: 'pointer',
                    fontSize: 14,
                  }}
                >
                  ♡
                </button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{p.name}</div>
                  <div className="ee-small" style={{ marginTop: 2 }}>{p.sub}</div>
                  <div
                    className="ee-tag ee-tag-gold"
                    style={{ marginTop: 6, fontSize: 10, letterSpacing: '0.12em' }}
                  >
                    Member · ${Math.round(p.price * 0.85)}
                  </div>
                </div>
                <div style={{ color: 'var(--ee-ink)', fontWeight: 700, fontSize: 15 }}>
                  ${p.price}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Member callout */}
      <section style={{ padding: '0 56px 96px' }}>
        <div
          style={{
            background: 'var(--ee-navy-900)',
            color: '#fff',
            borderRadius: 12,
            padding: '48px 56px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 56,
            alignItems: 'center',
          }}
        >
          <div>
            <div className="ee-mono" style={{ color: 'var(--ee-gold)' }}>FIELD MEMBERS</div>
            <h2 className="ee-h2" style={{ color: '#fff', marginTop: 16, fontSize: 44 }}>
              Free shipping. First access.
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: 16, fontSize: 16 }}>
              Field tier members get free domestic shipping on every order, plus first refusal on member-only drops. Save 15% on every purchase.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'flex-end' }}>
            <Link href="/apply" className="ee-btn ee-btn-primary">
              Join the Field
            </Link>
            <Link
              href="/membership"
              className="ee-btn ee-btn-ghost"
              style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}
            >
              See benefits
            </Link>
          </div>
        </div>
      </section>

      <EEFooter />
    </div>
  );
}
