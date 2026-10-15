import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Signed links in RSVP emails: the "I'll be there" confirm link and the
 * paid-event payment link.
 *
 * These links have to work without logging in, so each carries a signature
 * proving it was issued for that specific RSVP. The token is an HMAC of the
 * RSVP id — stateless, so nothing extra is stored, and it can't be forged or
 * reused for a different RSVP.
 *
 * It's keyed off RSVP_WEBHOOK_SECRET with a purpose prefix, which keeps each
 * use cryptographically separate without another env var to manage — a
 * confirm token can't be used as a payment token. Rotating that secret
 * invalidates any links already sent.
 */
type Purpose = 'rsvp-confirm' | 'rsvp-pay';

function key(): string {
  const secret = process.env.RSVP_WEBHOOK_SECRET;
  if (!secret) throw new Error('RSVP_WEBHOOK_SECRET is not set');
  return secret;
}

function sign(purpose: Purpose, rsvpId: string): Buffer {
  return createHmac('sha256', key()).update(`${purpose}:${rsvpId}`).digest();
}

function verify(purpose: Purpose, rsvpId: string, token: string | undefined | null): boolean {
  if (!token) return false;
  let given: Buffer;
  try {
    given = Buffer.from(token, 'base64url');
  } catch {
    return false;
  }
  const expected = sign(purpose, rsvpId);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export const SITE_URL = process.env.SITE_URL ?? 'https://everydayeng.com';

export function confirmToken(rsvpId: string): string {
  return sign('rsvp-confirm', rsvpId).toString('base64url');
}

export function verifyConfirmToken(rsvpId: string, token: string | undefined | null): boolean {
  return verify('rsvp-confirm', rsvpId, token);
}

export function confirmUrl(rsvpId: string): string {
  return `${SITE_URL}/confirm/${rsvpId}?t=${confirmToken(rsvpId)}`;
}

export function payToken(rsvpId: string): string {
  return sign('rsvp-pay', rsvpId).toString('base64url');
}

export function verifyPayToken(rsvpId: string, token: string | undefined | null): boolean {
  return verify('rsvp-pay', rsvpId, token);
}

export function payUrl(rsvpId: string): string {
  return `${SITE_URL}/pay/${rsvpId}?t=${payToken(rsvpId)}`;
}
