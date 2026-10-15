'use server';

import { redirect } from 'next/navigation';
import { verifyPayToken } from '@/lib/confirm';
import { startCheckout } from '@/lib/payments';

/**
 * Checkout starts on an explicit button press (a POST), never on page load —
 * email scanners follow links automatically and would otherwise open Stripe
 * sessions nobody asked for.
 */
export async function startCheckoutAction(rsvpId: string, token: string): Promise<void> {
  const back = `/pay/${rsvpId}?t=${encodeURIComponent(token)}`;
  if (!verifyPayToken(rsvpId, token)) redirect(back);

  let url: string | null = null;
  try {
    url = await startCheckout(rsvpId);
  } catch (err) {
    console.error('[pay] could not start checkout:', err);
    redirect(`${back}&error=${encodeURIComponent(errorCode(err))}`);
  }
  // No URL means the state changed (already paid, sold out…) — the page shows why.
  redirect(url ?? back);
}

/** A short, non-secret reason shown on the page, so failures can be diagnosed. */
function errorCode(err: unknown): string {
  const e = err as { code?: string; type?: string; message?: string };
  if (e?.message?.includes('STRIPE_SECRET_KEY')) return 'missing_key';
  return e?.code || e?.type || 'unknown';
}
