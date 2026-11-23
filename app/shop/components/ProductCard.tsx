import Link from 'next/link';
import EEPhoto from '../../components/EEPhoto';
import { usd, type Product } from '@/lib/shop-types';

export default function ProductCard({ product, available }: { product: Product; available: boolean }) {
  return (
    <Link href={`/shop/${product.slug}`} className="ee-product-tile" style={{ display: 'block', color: 'inherit' }}>
      <div style={{ position: 'relative', marginBottom: 14, overflow: 'hidden', borderRadius: 6 }}>
        <EEPhoto
          tone="paper"
          src={product.images[0]}
          alt={product.name}
          label={product.images[0] ? '' : product.name.toUpperCase()}
          style={{ aspectRatio: '4/5', opacity: available ? 1 : 0.6 }}
          className="ee-product-img"
        />
        {(!available || product.set_parts) && (
          <span
            style={{
              position: 'absolute', top: 12, left: 12, padding: '4px 10px', borderRadius: 4,
              fontFamily: 'var(--ee-mono)', fontSize: 9, letterSpacing: '0.16em',
              background: available ? 'var(--ee-gold)' : 'var(--ee-navy-900)',
              color: available ? 'var(--ee-navy-900)' : '#fff',
            }}
          >
            {available ? 'SAVE $15' : 'SOLD OUT'}
          </span>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
        <div style={{ fontWeight: 600, fontSize: 15 }}>{product.name}</div>
        <div style={{ fontWeight: 700, fontSize: 15 }}>{usd(product.price_cents)}</div>
      </div>
      {!available && <div className="ee-small" style={{ marginTop: 4 }}>Get notified when it&apos;s back</div>}
    </Link>
  );
}
