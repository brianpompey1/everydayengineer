'use client';

import Link from 'next/link';
import { useCart, cartCount } from '@/lib/cart';

export default function CartLink() {
  const count = cartCount(useCart());
  return (
    <Link href="/shop/cart" className="ee-btn ee-btn-ghost" style={{ padding: '10px 18px', gap: 8 }}>
      Cart
      <span
        className="ee-mono"
        style={{
          minWidth: 22, height: 22, borderRadius: 11, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: count ? 'var(--ee-navy-900)' : 'var(--ee-lavender-2)', color: count ? '#fff' : 'var(--ee-ink-3)', fontSize: 11,
        }}
      >
        {count}
      </span>
    </Link>
  );
}
