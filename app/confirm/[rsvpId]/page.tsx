import Link from 'next/link';
import EENav from '../../components/EENav';
import EEFooter from '../../components/EEFooter';
import { verifyConfirmToken } from '@/lib/confirm';
import { getRsvpById } from '@/lib/rsvps';
import { getEventById } from '@/lib/events';
import { formatET, formatTimeRange } from '@/lib/datetime';
import { confirmAttendanceAction } from './actions';

// Reached from the link in an approval email — no login required. The signed
// token in the URL is what authorises confirming this specific RSVP.
export const dynamic = 'force-dynamic';

export default async function ConfirmPage({
  params,
  searchParams,
}: {
  params: Promise<{ rsvpId: string }>;
  searchParams: Promise<{ t?: string }>;
}) {
  const { rsvpId } = await params;
  const { t: token } = await searchParams;

  const valid = verifyConfirmToken(rsvpId, token);
  const rsvp = valid ? await getRsvpById(rsvpId) : null;
  const event = rsvp ? await getEventById(rsvp.event_id) : null;

  const state: 'invalid' | 'inactive' | 'confirmed' | 'pending' =
    !valid || !rsvp || !event ? 'invalid'
    : rsvp.attendee_type !== 'player' || rsvp.status !== 'approved' ? 'inactive'
    : rsvp.attendance_confirmed_at ? 'confirmed'
    : 'pending';

  return (
    <div style={{ background: 'var(--ee-paper)', minHeight: '100vh' }}>
      <EENav />

      <section className="ee-section" style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="ee-card" style={{ width: '100%', maxWidth: 520, padding: 36 }}>
          {state === 'invalid' && (
            <>
              <div className="ee-mono" style={{ color: 'var(--ee-gold-deep)' }}>CONFIRMATION</div>
              <h1 style={{ marginTop: 12, fontSize: 28, fontWeight: 800, letterSpacing: '-0.01em' }}>This link isn&apos;t valid.</h1>
              <p className="ee-body" style={{ marginTop: 10 }}>
                It may have been copied incompletely. Try the button in your email again, or reach out to an organizer.
              </p>
            </>
          )}

          {state === 'inactive' && event && (
            <>
              <div className="ee-mono" style={{ color: 'var(--ee-gold-deep)' }}>CONFIRMATION</div>
              <h1 style={{ marginTop: 12, fontSize: 28, fontWeight: 800, letterSpacing: '-0.01em' }}>This spot isn&apos;t active.</h1>
              <p className="ee-body" style={{ marginTop: 10 }}>
                Your RSVP for {event.title} has changed since this email was sent, so there&apos;s nothing to confirm.
                Check your latest email for your current status.
              </p>
            </>
          )}

          {(state === 'pending' || state === 'confirmed') && event && rsvp && (
            <>
              <div className="ee-mono" style={{ color: 'var(--ee-gold-deep)' }}>
                {state === 'confirmed' ? 'CONFIRMED' : 'CONFIRM YOUR SPOT'}
              </div>
              <h1 style={{ marginTop: 12, fontSize: 28, fontWeight: 800, letterSpacing: '-0.01em' }}>
                {state === 'confirmed' ? "You're confirmed. ✓" : event.title}
              </h1>

              <div style={{ marginTop: 20, padding: 18, background: 'var(--ee-lavender)', borderRadius: 8, display: 'grid', gap: 8, fontSize: 14 }}>
                {state === 'confirmed' && <Row label="Event" value={event.title} />}
                <Row label="Date" value={formatET(event.event_date, { weekday: 'long', month: 'long', day: 'numeric' })} />
                <Row label="Time" value={`${formatTimeRange(event.event_date, event.end_date)} ET`} />
                <Row label="Location" value={event.venue_address ?? event.location ?? 'TBA'} />
              </div>

              {state === 'pending' ? (
                <form action={confirmAttendanceAction.bind(null, rsvpId, token ?? '')} style={{ marginTop: 24 }}>
                  <button type="submit" className="ee-btn ee-btn-dark" style={{ width: '100%', padding: 16 }}>
                    Yes, I&apos;ll be there →
                  </button>
                  <p className="ee-small" style={{ marginTop: 12, textAlign: 'center' }}>
                    Can&apos;t make it anymore? Let an organizer know so your spot can go to someone on the waitlist.
                  </p>
                </form>
              ) : (
                <p className="ee-body" style={{ marginTop: 20 }}>
                  See you {formatET(event.event_date, { weekday: 'long' })}! Please keep the address to yourself —
                  it&apos;s only shared with confirmed attendees.
                </p>
              )}
            </>
          )}

          <div style={{ marginTop: 28, paddingTop: 18, borderTop: '1px solid var(--ee-line)' }}>
            <Link href="/" className="ee-mono" style={{ color: 'var(--ee-ink-2)' }}>← Everyday Engineer Club</Link>
          </div>
        </div>
      </section>

      <EEFooter />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 12 }}>
      <span className="ee-mono" style={{ fontSize: 10, paddingTop: 3 }}>{label}</span>
      <span style={{ fontWeight: 600 }}>{value}</span>
    </div>
  );
}
