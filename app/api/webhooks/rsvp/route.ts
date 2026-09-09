import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import {
  sendEmail,
  playerApproved,
  playerWaitlisted,
  playerDeclined,
  type EventEmailContext,
} from '@/lib/email';

/**
 * Called by a Supabase Database Webhook whenever a row in `rsvps` changes.
 *
 * Approvals happen in the Supabase dashboard rather than in the app, so this
 * is how a status change turns into an email. Because it is driven by the
 * database rather than our own code, it fires no matter how the status was
 * changed — dashboard, SQL editor, or a future admin UI.
 */

interface RsvpRow {
  id: string;
  event_id: string;
  member_id: string;
  attendee_type: string;
  status: string;
  last_notified_status: string | null;
}

interface WebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  record: RsvpRow | null;
  old_record: RsvpRow | null;
}

const NOTIFIABLE = new Set(['approved', 'waitlisted', 'declined']);

export async function POST(req: Request) {
  const secret = process.env.RSVP_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
  }
  if (req.headers.get('x-webhook-secret') !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let payload: WebhookPayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const record = payload.record;
  if (!record || payload.type === 'DELETE') {
    return NextResponse.json({ skipped: 'no record' });
  }

  // Only players get approve/waitlist/decline mail — spectators were already
  // confirmed at RSVP time.
  if (record.attendee_type !== 'player') {
    return NextResponse.json({ skipped: 'not a player' });
  }
  if (!NOTIFIABLE.has(record.status)) {
    return NextResponse.json({ skipped: `status ${record.status} is not notifiable` });
  }

  // Two guards against duplicate mail: the status must have actually changed,
  // and we must not have already notified for this status. The second also
  // stops our own write-back below from looping.
  const previous = payload.old_record?.status;
  if (previous === record.status) {
    return NextResponse.json({ skipped: 'status unchanged' });
  }
  if (record.last_notified_status === record.status) {
    return NextResponse.json({ skipped: 'already notified' });
  }

  const [{ data: member }, { data: event }] = await Promise.all([
    supabaseAdmin.from('members').select('email, full_name').eq('id', record.member_id).maybeSingle(),
    supabaseAdmin
      .from('events')
      .select('title, event_date, location, venue_address')
      .eq('id', record.event_id)
      .maybeSingle(),
  ]);

  if (!member?.email || !event) {
    return NextResponse.json({ skipped: 'member or event missing' });
  }

  const ctx: EventEmailContext = {
    eventTitle: event.title,
    eventDate: event.event_date,
    location: event.location,
    venueAddress: event.venue_address,
    memberName: member.full_name,
  };

  const mail =
    record.status === 'approved'  ? playerApproved(ctx)  :
    record.status === 'waitlisted' ? playerWaitlisted(ctx) :
                                     playerDeclined(ctx);

  const result = await sendEmail({ to: member.email, ...mail });

  // Record what we sent so a retry or a toggled status can't re-send it.
  if (result.ok) {
    await supabaseAdmin
      .from('rsvps')
      .update({ last_notified_status: record.status })
      .eq('id', record.id);
  }

  return NextResponse.json({ sent: result.ok, status: record.status, error: result.error });
}
