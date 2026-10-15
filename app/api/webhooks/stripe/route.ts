import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { markPaid } from '@/lib/payments';

/**
 * Stripe calls this when a Checkout payment completes. The signature check
 * proves the request really came from Stripe, so a payment can't be faked by
 * posting to this URL.
 */
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
  }

  // The signature covers the raw body, so it must be read as text, unparsed.
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') ?? '';

  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(body, signature, secret);
  } catch (err) {
    console.error('[stripe webhook] bad signature:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed':
    case 'checkout.session.async_payment_succeeded':
      try {
        await markPaid(event.data.object);
      } catch (err) {
        // A 500 makes Stripe retry later, which is what we want here.
        console.error('[stripe webhook] markPaid failed:', err);
        return NextResponse.json({ error: 'Failed to record payment' }, { status: 500 });
      }
      break;
  }

  return NextResponse.json({ received: true });
}
