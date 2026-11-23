import Link from 'next/link';
import EENav from '../../components/EENav';
import EEFooter from '../../components/EEFooter';
import CartView from './CartView';
import { getCatalog, cancelPendingOrder, sweepExpiredOrders } from '@/lib/shop';
import { verifyOrderToken } from '@/lib/confirm';

export const dynamic = 'force-dynamic';

export default async function CartPage({ searchParams }: { searchParams: Promise<{ canceled?: string; t?: string }> }) {
  const { canceled, t } = await searchParams;

  // Back from Stripe without paying: free the held stock straight away.
  if (canceled && verifyOrderToken(canceled, t)) {
    await cancelPendingOrder(canceled).catch((err) => console.error('[shop] cancel failed:', err));
  }
  await sweepExpiredOrders().catch((err) => console.error('[shop] sweep failed:', err));
  const catalog = await getCatalog();

  return (
    <div style={{ background: 'var(--ee-paper)', minHeight: '100vh' }}>
      <EENav />
      <div style={{ padding: '24px 56px 0' }} className="ee-shop-crumbs">
        <Link href="/shop" className="ee-mono" style={{ color: 'var(--ee-ink-2)' }}>← Keep shopping</Link>
      </div>
      <CartView catalog={catalog} canceled={Boolean(canceled)} />
      <EEFooter />
    </div>
  );
}
