import type Stripe from 'stripe';
import { supabaseAdmin } from './supabase';
import { stripe } from './stripe';
import { payToken, SITE_URL } from './confirm';
import { getRsvpById, type Rsvp } from './rsvps';
import { getEventById, type EventRow } from './events';
import { formatET, formatTimeRange } from './datetime';
import { sendEmail, paymentConfirmed, CONTACT_EMAIL } from './email';

/**
 * Paid events: an organizer approves a participant, the approval email links
 * to /pay/<rsvp>, and paying through Stripe Checkout confirms the spot.
 *
 * Payment is recorded from two places — the Stripe webhook and the page the
 * participant returns to — so a spot is confirmed even if one of them is
 * delayed. markPaid only acts once, so the confirmation email goes out once.
 */

export type PayState =
  | { kind: 'invalid' }
  | { kind: 'inactive'; event: EventRow }            // not approved, or not a paid event
  | { kind: 'paid'; event: EventRow; rsvp: Rsvp }
  | { kind: 'sold_out'; event: EventRow }
  | { kind: 'ready'; event: EventRow; rsvp: Rsvp; priceCents: number };

export async function getPayState(rsvpId: string): Promise<PayState> {
  const rsvp = await getRsvpById(rsvpId);
  if (!rsvp) return { kind: 'invalid' };
  const event = await getEventById(rsvp.event_id);
  if (!event) return { kind: 'invalid' };

  if (rsvp.paid_at) return { kind: 'paid', event, rsvp };
  if (!event.price_cents || rsvp.attendee_type !== 'player' || rsvp.status !== 'approved') {
    return { kind: 'inactive', event };
  }
  // rsvp_count is paid participants on a paid event, and this one hasn't paid.
  if (event.capacity != null && (event.rsvp_count ?? 0) >= event.capacity) {
    return { kind: 'sold_out', event };
  }
  return { kind: 'ready', event, rsvp, priceCents: event.price_cents };
}

/**
 * Returns the Stripe Checkout URL to send the participant to. Reuses their
 * open session if they already started one, so tapping the email link twice
 * never produces two live payment pages.
 */
export async function startCheckout(rsvpId: string): Promise<string | null> {
  const state = await getPayState(rsvpId);
  if (state.kind !== 'ready') return null;
  const { event, rsvp, priceCents } = state;

  // A session from the other mode (test vs live) can't be looked up — start fresh.
  const existing = rsvp.stripe_session_id
    ? await stripe().checkout.sessions.retrieve(rsvp.stripe_session_id).catch(() => null)
    : null;
  if (existing) {
    if (existing.status === 'open' && existing.url && existing.amount_total === priceCents) {
      return existing.url;
    }
    if (existing.payment_status === 'paid') {
      await markPaid(existing);
      return null;
    }
  }

  const { data: member } = await supabaseAdmin
    .from('members')
    .select('email, full_name')
    .eq('id', rsvp.member_id)
    .maybeSingle();

  const back = `${SITE_URL}/pay/${rsvp.id}?t=${payToken(rsvp.id)}`;
  const when = `${formatET(event.event_date, { weekday: 'short', month: 'short', day: 'numeric' })} · ${formatTimeRange(event.event_date, event.end_date)} ET`;

  const session = await stripe().checkout.sessions.create(
    {
      mode: 'payment',
      // Managed Payments (Stripe as seller, for digital goods) is on by default
      // for new accounts and rejects these sessions. In-person event tickets
      // are a normal direct sale.
      managed_payments: { enabled: false },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: priceCents,
            product_data: { name: event.title, description: when },
          },
        },
      ],
      customer_email: member?.email || undefined,
      client_reference_id: rsvp.id,
      metadata: { rsvp_id: rsvp.id, event_id: event.id, member_id: rsvp.member_id },
      payment_intent_data: {
        description: `${event.title} — ${member?.full_name ?? member?.email ?? rsvp.member_id}`,
        metadata: { rsvp_id: rsvp.id, event_id: event.id },
      },
      custom_text: {
        submit: { message: `Payments are non-refundable. Can't make it? Email ${CONTACT_EMAIL}.` },
      },
      success_url: `${back}&paid=1`,
      cancel_url: `${back}&canceled=1`,
    },
    // A double-tap within the same minute returns the same session.
    { idempotencyKey: `pay-${rsvp.id}-${Math.floor(Date.now() / 60_000)}` }
  );

  await supabaseAdmin.from('rsvps').update({ stripe_session_id: session.id }).eq('id', rsvp.id);
  return session.url;
}

/**
 * When the participant lands back on our page before Stripe's webhook has
 * arrived, ask Stripe directly so they see "You're in" straight away.
 */
export async function syncPayment(rsvpId: string): Promise<void> {
  const rsvp = await getRsvpById(rsvpId);
  if (!rsvp || rsvp.paid_at || !rsvp.stripe_session_id) return;
  const session = await stripe().checkout.sessions.retrieve(rsvp.stripe_session_id).catch(() => null);
  if (session?.payment_status === 'paid') await markPaid(session);
}

/** Records a completed payment and sends the confirmation — exactly once. */
export async function markPaid(session: Stripe.Checkout.Session): Promise<void> {
  const rsvpId = session.client_reference_id ?? session.metadata?.rsvp_id;
  if (!rsvpId || session.payment_status !== 'paid') return;

  // The `paid_at is null` guard makes this a no-op if the webhook and the
  // return page race, so only one of them sends the email.
  const { data: updated, error } = await supabaseAdmin
    .from('rsvps')
    .update({
      paid_at: new Date().toISOString(),
      amount_paid_cents: session.amount_total,
      stripe_session_id: session.id,
    })
    .eq('id', rsvpId)
    .is('paid_at', null)
    .select('id, member_id, event_id');

  if (error) throw error;
  if (!updated || updated.length === 0) return;

  const row = updated[0];
  const [{ data: member }, event] = await Promise.all([
    supabaseAdmin.from('members').select('email, full_name').eq('id', row.member_id).maybeSingle(),
    getEventById(row.event_id),
  ]);
  if (!member?.email || !event) return;

  const mail = paymentConfirmed({
    eventTitle: event.title,
    eventDate: event.event_date,
    eventEndDate: event.end_date,
    location: event.location,
    venueAddress: event.venue_address,
    attendeeNotes: event.attendee_notes,
    memberName: member.full_name,
    amountPaidCents: session.amount_total ?? event.price_cents ?? undefined,
  });
  const result = await sendEmail({ to: member.email, ...mail });
  if (!result.ok) console.error('[payments] confirmation email failed for', rsvpId, result.error);
}
