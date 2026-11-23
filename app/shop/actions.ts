'use server';

import { currentUser } from '@clerk/nextjs/server';
import { startOrderCheckout, requestRestockAlert, type CheckoutResult } from '@/lib/shop';
import { getOrCreateMember } from '@/lib/members';
import type { CartLine, Fulfillment } from '@/lib/shop-types';

/** Anyone can check out; a signed-in member's order is linked to their account. */
export async function checkoutAction(cart: CartLine[], fulfillment: Fulfillment): Promise<CheckoutResult> {
  try {
    const user = await currentUser().catch(() => null);
    const email = user?.emailAddresses[0]?.emailAddress ?? null;
    const member = user
      ? await getOrCreateMember({ id: user.id, email: email ?? '', fullName: user.fullName, avatarUrl: user.imageUrl })
      : null;
    return await startOrderCheckout({ cart, fulfillment, memberId: member?.id ?? null, email });
  } catch (err) {
    console.error('[shop] checkout failed:', err);
    return { ok: false, error: "We couldn't start checkout. Please try again in a moment." };
  }
}

export async function restockAction(variantId: string, email: string): Promise<{ ok: boolean; error?: string }> {
  try {
    return await requestRestockAlert(variantId, email);
  } catch (err) {
    console.error('[shop] restock request failed:', err);
    return { ok: false, error: 'Something went wrong. Please try again.' };
  }
}
