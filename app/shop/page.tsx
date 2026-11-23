import EENav from '../components/EENav';
import EEFooter from '../components/EEFooter';
import CartLink from './components/CartLink';
import ProductCard from './components/ProductCard';
import { getCatalog, sweepExpiredOrders } from '@/lib/shop';
import { setAvailable, totalStock } from '@/lib/shop-types';

// Stock changes with every order, so always render fresh.
export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  // Hand back stock from abandoned checkouts before showing what's left.
  await sweepExpiredOrders().catch((err) => console.error('[shop] sweep failed:', err));
  const catalog = await getCatalog();

  const items = catalog
    .map((p) => ({ product: p, available: p.set_parts ? setAvailable(p, catalog) : totalStock(p) > 0 }))
    // In-stock first, keeping the catalog order within each group.
    .sort((a, b) => Number(b.available) - Number(a.available));

  return (
    <div style={{ background: 'var(--ee-paper)' }}>
      <EENav />

      <section className="ee-shop-head">
        <div>
          <div className="ee-eyebrow">THE SHOP</div>
          <h1 className="ee-h1" style={{ marginTop: 16 }}>Wear the<br />movement.</h1>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 14 }}>
          <p className="ee-body" style={{ maxWidth: 360, fontSize: 15 }}>
            Everyday Engineer Club merch, made in small batches. Ships within the US for $8, or pick up free at an
            upcoming EEC event.
          </p>
          <CartLink />
        </div>
      </section>

      <section className="ee-shop-grid-wrap">
        <div className="ee-shop-grid">
          {items.map(({ product, available }) => (
            <ProductCard key={product.id} product={product} available={available} />
          ))}
        </div>
      </section>

      <EEFooter />
    </div>
  );
}
