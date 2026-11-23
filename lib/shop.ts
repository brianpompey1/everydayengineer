import type Stripe from 'stripe';
import { supabaseAdmin } from './supabase';
import { stripe } from './stripe';
import { orderToken, SITE_URL } from './confirm';
import { sendEmail, orderConfirmed, newOrderAlert } from './email';
import { CONTACT_EMAIL } from './contact';
import {
  MAX_PER_LINE,
  SHIPPING_CENTS,
  usd,
  type CartLine,
  type Fulfillment,
  type Product,
} from './shop-types';

/**
 * The shop. Stock is held the moment someone starts checkout (so the last
 * item can't sell twice) and handed back if they don't pay. Payment is
 * recorded from both the Stripe webhook and the buyer's return to the site,
 * and only the first of those acts.
 */

const HOLD_MINUTES = 30; // Stripe's shortest checkout lifetime.
const SHIPPING_TAX_CODE = 'txcd_92010001';

// ── Catalog ────────────────────────────────────────────────

export async function getCatalog(): Promise<Product[]> {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('id, slug, name, description, price_cents, category, tax_code, images, set_parts, sort_order, product_variants(id, size, stock, sort_order)')
    .eq('is_published', true)
    .order('sort_order');
  if (error) throw error;

  return (data ?? []).map((p) => ({
    ...p,
    images: p.images ?? [],
    variants: [...(p.product_variants ?? [])]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(({ id, size, stock }) => ({ id, size, stock })),
  })) as Product[];
}

// ── Cart → priced lines ────────────────────────────────────

interface PricedLine {
  product: Product;
  name: string;
  detail: string;
  unit_cents: number;
  quantity: number;
  stock: { variant_id: string; quantity: number }[];
}

class CartError extends Error {}

function priceCart(cart: CartLine[], catalog: Product[]): PricedLine[] {
  if (!Array.isArray(cart) || cart.length === 0) throw new CartError('Your cart is empty.');
  if (cart.length > 30) throw new CartError('That cart is too large.');

  return cart.map((line) => {
    const product = catalog.find((p) => p.slug === line.slug);
    if (!product) throw new CartError('Something in your cart is no longer available. Please remove it and try again.');
    const quantity = Math.floor(Number(line.quantity));
    if (!(quantity >= 1 && quantity <= MAX_PER_LINE)) throw new CartError(`You can buy up to ${MAX_PER_LINE} of each item.`);

    if (product.set_parts) {
      const parts = product.set_parts;
      if (!Array.isArray(line.parts) || line.parts.length !== parts.length) {
        throw new CartError(`Please choose all sizes for the ${product.name}.`);
      }
      const chosen = parts.map((part, i) => {
        const choice = line.parts![i];
        if (!part.products.includes(choice?.slug)) throw new CartError(`Please choose all sizes for the ${product.name}.`);
        const partProduct = catalog.find((p) => p.slug === choice.slug);
        const variant = partProduct?.variants.find((v) => v.size === choice.size);
        if (!partProduct || !variant) throw new CartError(`Please choose all sizes for the ${product.name}.`);
        return { partProduct, variant };
      });
      return {
        product,
        name: product.name,
        detail: chosen.map(({ partProduct, variant }) => `${partProduct.name} ${variant.size}`).join(' · '),
        unit_cents: product.price_cents,
        quantity,
        stock: chosen.map(({ variant }) => ({ variant_id: variant.id, quantity })),
      };
    }

    const variant = product.variants.find((v) => v.size === line.size);
    if (!variant) throw new CartError(`Please choose a size for the ${product.name}.`);
    return {
      product,
      name: product.name,
      detail: variant.size === 'One size' ? '' : variant.size,
      unit_cents: product.price_cents,
      quantity,
      stock: [{ variant_id: variant.id, quantity }],
    };
  });
}

const lineLabel = (l: { name: string; detail: string; quantity: number }) =>
  `${l.name}${l.detail ? ` (${l.detail})` : ''} ×${l.quantity}`;

// ── Checkout ───────────────────────────────────────────────

export type CheckoutResult = { ok: true; url: string } | { ok: false; error: string };

export async function startOrderCheckout(input: {
  cart: CartLine[];
  fulfillment: Fulfillment;
  memberId?: string | null;
  email?: string | null;
}): Promise<CheckoutResult> {
  await sweepExpiredOrders();

  const fulfillment: Fulfillment = input.fulfillment === 'pickup' ? 'pickup' : 'ship';
  const catalog = await getCatalog();

  let lines: PricedLine[];
  try {
    lines = priceCart(input.cart, catalog);
  } catch (err) {
    if (err instanceof CartError) return { ok: false, error: err.message };
    throw err;
  }

  const subtotal = lines.reduce((n, l) => n + l.unit_cents * l.quantity, 0);
  const shipping = fulfillment === 'ship' ? SHIPPING_CENTS : 0;

  // 1. Record the order and its lines, so a hold can always be handed back.
  const { data: order, error: orderError } = await supabaseAdmin
    .from('orders')
    .insert({
      fulfillment,
      subtotal_cents: subtotal,
      shipping_cents: shipping,
      member_id: input.memberId ?? null,
      email: input.email ?? null,
      summary: lines.map(lineLabel).join(', '),
      expires_at: new Date(Date.now() + HOLD_MINUTES * 60_000).toISOString(),
    })
    .select('id')
    .single();
  if (orderError) throw orderError;

  const { error: itemsError } = await supabaseAdmin.from('order_items').insert(
    lines.map((l) => ({
      order_id: order.id,
      product_id: l.product.id,
      name: l.name,
      detail: l.detail || null,
      unit_cents: l.unit_cents,
      quantity: l.quantity,
      stock: l.stock,
    }))
  );
  if (itemsError) {
    await supabaseAdmin.from('orders').update({ status: 'cancelled' }).eq('id', order.id);
    throw itemsError;
  }

  // 2. Hold the stock — all of it or none.
  const { error: holdError } = await supabaseAdmin.rpc('reserve_stock', { lines: lines.flatMap((l) => l.stock) });
  if (holdError) {
    await supabaseAdmin.from('orders').update({ status: 'cancelled' }).eq('id', order.id);
    const soldOut = /OUT_OF_STOCK:([0-9a-f-]+)/.exec(holdError.message)?.[1];
    if (soldOut) {
      const line = lines.find((l) => l.stock.some((s) => s.variant_id === soldOut));
      return {
        ok: false,
        error: `Sorry — ${line ? lineLabel({ ...line, quantity: 1 }).replace(/ ×1$/, '') : 'an item in your cart'} just sold out or doesn't have enough left. Please update your cart.`,
      };
    }
    throw holdError;
  }

  // 3. Send them to Stripe. If that fails, hand the stock straight back.
  const token = orderToken(order.id);
  const taxOn = process.env.STRIPE_TAX_ENABLED === 'true';
  try {
    const session = await stripe().checkout.sessions.create({
      mode: 'payment',
      managed_payments: { enabled: false },
      line_items: lines.map((l) => ({
        quantity: l.quantity,
        price_data: {
          currency: 'usd',
          unit_amount: l.unit_cents,
          ...(taxOn ? { tax_behavior: 'exclusive' as const } : {}),
          product_data: {
            name: l.name,
            ...(l.detail ? { description: l.detail } : {}),
            tax_code: l.product.tax_code,
          },
        },
      })),
      ...(taxOn ? { automatic_tax: { enabled: true } } : {}),
      ...(fulfillment === 'ship'
        ? {
            shipping_address_collection: { allowed_countries: ['US'] },
            shipping_options: [
              {
                shipping_rate_data: {
                  type: 'fixed_amount' as const,
                  display_name: 'US shipping',
                  fixed_amount: { amount: SHIPPING_CENTS, currency: 'usd' },
                  tax_code: SHIPPING_TAX_CODE,
                  ...(taxOn ? { tax_behavior: 'exclusive' as const } : {}),
                },
              },
            ],
          }
        : {}),
      phone_number_collection: { enabled: true },
      customer_email: input.email || undefined,
      client_reference_id: order.id,
      metadata: { kind: 'shop_order', order_id: order.id },
      payment_intent_data: { description: `EEC shop order ${order.id.slice(0, 8)}`, metadata: { kind: 'shop_order', order_id: order.id } },
      custom_text: {
        submit: {
          message:
            fulfillment === 'pickup'
              ? `Pickup at an upcoming EEC event — we'll email you the details. Questions? ${CONTACT_EMAIL}`
              : `Ships within the US. Questions? ${CONTACT_EMAIL}`,
        },
      },
      expires_at: Math.floor(Date.now() / 1000) + HOLD_MINUTES * 60,
      success_url: `${SITE_URL}/shop/order/${order.id}?t=${token}&paid=1`,
      cancel_url: `${SITE_URL}/shop/cart?canceled=${order.id}&t=${token}`,
    });

    await supabaseAdmin.from('orders').update({ stripe_session_id: session.id }).eq('id', order.id);
    return { ok: true, url: session.url! };
  } catch (err) {
    await supabaseAdmin.rpc('release_order_stock', { p_order_id: order.id, p_status: 'cancelled' });
    throw err;
  }
}

/** The buyer backed out of Stripe's page: close the session and free the stock now. */
export async function cancelPendingOrder(orderId: string): Promise<void> {
  const { data: order } = await supabaseAdmin
    .from('orders')
    .select('status, stripe_session_id')
    .eq('id', orderId)
    .maybeSingle();
  if (!order || order.status !== 'pending') return;

  if (order.stripe_session_id) {
    const session = await stripe().checkout.sessions.retrieve(order.stripe_session_id).catch(() => null);
    if (session && isPaid(session)) {
      await markOrderPaid(session);
      return;
    }
    if (session?.status === 'open') await stripe().checkout.sessions.expire(session.id).catch(() => null);
  }
  await supabaseAdmin.rpc('release_order_stock', { p_order_id: orderId, p_status: 'cancelled' });
}

/**
 * Hands back stock from checkouts that ran out of time. Stripe is asked
 * first, so an order paid at the last second is recorded, never released.
 * Runs whenever someone views the shop or starts checkout — no scheduler.
 */
export async function sweepExpiredOrders(): Promise<void> {
  const { data: stale } = await supabaseAdmin
    .from('orders')
    .select('id, stripe_session_id')
    .eq('status', 'pending')
    .lt('expires_at', new Date().toISOString())
    .limit(10);

  for (const order of stale ?? []) {
    try {
      const session = order.stripe_session_id
        ? await stripe().checkout.sessions.retrieve(order.stripe_session_id)
        : null;
      if (session && isPaid(session)) {
        await markOrderPaid(session);
      } else if (session?.status === 'open') {
        // Not expired on Stripe's side yet (clocks differ) — try next time.
        continue;
      } else {
        await supabaseAdmin.rpc('release_order_stock', { p_order_id: order.id, p_status: 'expired' });
      }
    } catch (err) {
      console.error('[shop] sweep failed for', order.id, err);
    }
  }
}

// ── Payment ────────────────────────────────────────────────

const isPaid = (s: Stripe.Checkout.Session) =>
  s.status === 'complete' && (s.payment_status === 'paid' || s.payment_status === 'no_payment_required');

/** On return from Stripe, record the payment if the webhook hasn't yet. */
export async function syncOrder(orderId: string): Promise<void> {
  const { data: order } = await supabaseAdmin
    .from('orders')
    .select('status, stripe_session_id')
    .eq('id', orderId)
    .maybeSingle();
  if (!order || order.status !== 'pending' || !order.stripe_session_id) return;
  const session = await stripe().checkout.sessions.retrieve(order.stripe_session_id).catch(() => null);
  if (session && isPaid(session)) await markOrderPaid(session);
}

/** Records a completed order and sends the emails — exactly once. */
export async function markOrderPaid(session: Stripe.Checkout.Session): Promise<void> {
  const orderId = session.metadata?.order_id;
  if (!orderId || !isPaid(session)) return;

  const shipping = session.collected_information?.shipping_details ?? null;
  const { data: updated, error } = await supabaseAdmin
    .from('orders')
    .update({
      status: 'paid',
      paid_at: new Date().toISOString(),
      email: session.customer_details?.email ?? null,
      customer_name: shipping?.name ?? session.customer_details?.name ?? null,
      phone: session.customer_details?.phone ?? null,
      shipping_address: shipping?.address ?? null,
      tax_cents: session.total_details?.amount_tax ?? 0,
      shipping_cents: session.total_details?.amount_shipping ?? 0,
      total_cents: session.amount_total,
      stripe_session_id: session.id,
    })
    .eq('id', orderId)
    .eq('status', 'pending')
    .select('*');
  if (error) throw error;
  if (!updated || updated.length === 0) return; // Already recorded.

  const order = updated[0];
  const { data: items } = await supabaseAdmin
    .from('order_items')
    .select('name, detail, unit_cents, quantity')
    .eq('order_id', orderId);

  const ctx = { order, items: items ?? [] };
  if (order.email) {
    const r = await sendEmail({ to: order.email, ...orderConfirmed(ctx) });
    if (!r.ok) console.error('[shop] buyer email failed for', orderId, r.error);
  }
  const r = await sendEmail({ to: CONTACT_EMAIL, ...newOrderAlert(ctx) });
  if (!r.ok) console.error('[shop] order alert failed for', orderId, r.error);
}

// ── Order page ─────────────────────────────────────────────

export async function getOrder(orderId: string) {
  const { data: order } = await supabaseAdmin.from('orders').select('*').eq('id', orderId).maybeSingle();
  if (!order) return null;
  const { data: items } = await supabaseAdmin
    .from('order_items')
    .select('name, detail, unit_cents, quantity')
    .eq('order_id', orderId);
  return { order, items: items ?? [] };
}

// ── Restock alerts ─────────────────────────────────────────

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function requestRestockAlert(variantId: string, email: string): Promise<{ ok: boolean; error?: string }> {
  const clean = email.trim().toLowerCase();
  if (!EMAIL_RE.test(clean) || clean.length > 200) return { ok: false, error: 'Please enter a valid email.' };

  const { data: variant } = await supabaseAdmin.from('product_variants').select('id, stock').eq('id', variantId).maybeSingle();
  if (!variant) return { ok: false, error: 'That item is no longer available.' };
  if (variant.stock > 0) return { ok: false, error: "Good news — it's back in stock. Refresh to buy it." };

  const { error } = await supabaseAdmin.from('restock_requests').insert({ variant_id: variantId, email: clean });
  // Already waiting is fine — the unique index stops duplicates.
  if (error && error.code !== '23505') throw error;
  return { ok: true };
}

export { usd };
