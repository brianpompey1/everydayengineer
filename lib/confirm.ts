import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Tokens for the one-click "I'll be there" link in approval emails.
 *
 * The link has to work without logging in, so it carries a signature proving
 * it was issued for that specific RSVP. The token is an HMAC of the RSVP id —
 * stateless, so nothing extra is stored, and it can't be forged or reused for
 * a different RSVP.
 *
 * It's keyed off RSVP_WEBHOOK_SECRET with a purpose prefix, which keeps the
 * two uses cryptographically separate without another env var to manage.
 * Rotating that secret invalidates any confirmation links already sent.
 */
function key(): string {
  const secret = process.env.RSVP_WEBHOOK_SECRET;
  if (!secret) throw new Error('RSVP_WEBHOOK_SECRET is not set');
  return secret;
}

function sign(rsvpId: string): Buffer {
  return createHmac('sha256', key()).update(`rsvp-confirm:${rsvpId}`).digest();
}

export function confirmToken(rsvpId: string): string {
  return sign(rsvpId).toString('base64url');
}

export function verifyConfirmToken(rsvpId: string, token: string | undefined | null): boolean {
  if (!token) return false;
  let given: Buffer;
  try {
    given = Buffer.from(token, 'base64url');
  } catch {
    return false;
  }
  const expected = sign(rsvpId);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

const SITE_URL = process.env.SITE_URL ?? 'https://everydayeng.com';

export function confirmUrl(rsvpId: string): string {
  return `${SITE_URL}/confirm/${rsvpId}?t=${confirmToken(rsvpId)}`;
}
