import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { sendBatch, backInStock } from '@/lib/email';
import { SITE_URL } from '@/lib/confirm';

/**
 * Called by a Supabase Database Webhook when a product_variants row changes.
 * When a size goes from sold out to in stock, everyone waiting on it gets
 * one "it's back" email and is then taken off the list.
 */

interface VariantRow {
  id: string;
  product_id: string;
  size: string;
  stock: number;
}

export async function POST(req: Request) {
  const secret = process.env.RSVP_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
  if (req.headers.get('x-webhook-secret') !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let payload: { type: string; record: VariantRow | null; old_record: VariantRow | null };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const now = payload.record;
  const before = payload.old_record;
  if (payload.type !== 'UPDATE' || !now || !before || !(before.stock <= 0 && now.stock > 0)) {
    return NextResponse.json({ skipped: 'not a restock' });
  }

  const [{ data: waiting, error: waitError }, { data: product, error: productError }] = await Promise.all([
    supabaseAdmin.from('restock_requests').select('id, email').eq('variant_id', now.id).is('notified_at', null),
    supabaseAdmin.from('products').select('name, slug, is_published').eq('id', now.product_id).maybeSingle(),
  ]);
  if (waitError || productError) {
    return NextResponse.json({ error: (waitError ?? productError)?.message }, { status: 500 });
  }
  if (!waiting?.length || !product?.is_published) return NextResponse.json({ skipped: 'nobody waiting' });

  const mail = backInStock({ productName: product.name, size: now.size, url: `${SITE_URL}/shop/${product.slug}` });
  const result = await sendBatch(waiting.map((w) => ({ to: w.email, ...mail })));
  if (!result.ok) {
    console.error('[stock webhook] restock emails failed:', result.error);
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  await supabaseAdmin
    .from('restock_requests')
    .update({ notified_at: new Date().toISOString() })
    .in('id', waiting.map((w) => w.id));

  return NextResponse.json({ notified: waiting.length });
}
