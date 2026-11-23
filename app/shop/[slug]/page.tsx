import Link from 'next/link';
import { notFound } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import EENav from '../../components/EENav';
import EEFooter from '../../components/EEFooter';
import EEPhoto from '../../components/EEPhoto';
import CartLink from '../components/CartLink';
import ProductView from './ProductView';
import { getCatalog, sweepExpiredOrders } from '@/lib/shop';

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await sweepExpiredOrders().catch((err) => console.error('[shop] sweep failed:', err));
  const catalog = await getCatalog();
  const product = catalog.find((p) => p.slug === slug);
  if (!product) notFound();

  const user = await currentUser().catch(() => null);
  const email = user?.emailAddresses[0]?.emailAddress ?? '';

  return (
    <div style={{ background: 'var(--ee-paper)' }}>
      <EENav />

      <div style={{ padding: '24px 56px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="ee-shop-crumbs">
        <Link href="/shop" className="ee-mono" style={{ color: 'var(--ee-ink-2)' }}>← All products</Link>
        <CartLink />
      </div>

      <section className="ee-product-page">
        <div style={{ display: 'grid', gap: 12 }}>
          <div style={{ overflow: 'hidden', borderRadius: 8 }}>
            <EEPhoto
              tone="paper"
              src={product.images[0]}
              alt={product.name}
              label={product.images[0] ? '' : product.name.toUpperCase()}
              style={{ aspectRatio: '4/5' }}
            />
          </div>
          {product.images.length > 1 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {product.images.slice(1).map((src) => (
                <div key={src} style={{ overflow: 'hidden', borderRadius: 6 }}>
                  <EEPhoto tone="paper" src={src} alt={product.name} style={{ aspectRatio: '1/1' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        <ProductView product={product} catalog={catalog} email={email} />
      </section>

      <EEFooter />
    </div>
  );
}
