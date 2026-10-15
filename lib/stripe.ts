import Stripe from 'stripe';

/**
 * Created on first use rather than at import, so builds and pages that never
 * touch payments don't need STRIPE_SECRET_KEY to be set.
 */
let client: Stripe | null = null;

export function stripe(): Stripe {
  if (!client) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
    client = new Stripe(key);
  }
  return client;
}

export const formatUSD = (cents: number) =>
  `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
