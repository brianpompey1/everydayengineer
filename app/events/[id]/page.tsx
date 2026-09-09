import { currentUser } from '@clerk/nextjs/server';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import EEMemberNav from '../../components/EEMemberNav';
import EEFooter from '../../components/EEFooter';
import EEPhoto from '../../components/EEPhoto';
import { getEventById } from '@/lib/events';
import { getOrCreateMember } from '@/lib/members';
import { getRsvp } from '@/lib/rsvps';
import RsvpPanel from '../RsvpPanel';

const CAL = 'M3 9h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM8 3v4M16 3v4';
const PIN = 'M12 22s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12zM12 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z';
const COMPASS = 'M12 2v3M12 19v3M2 12h3M19 12h3M16 8l-3 5-5 3 3-5 5-3z';

function Icon({ d, size = 14, color }: { d: string; size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color ?? 'currentColor'} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const clerkUser = await currentUser();
  if (!clerkUser) redirect('/signin');

  const event = await getEventById(id);
  if (!event) notFound();

  const member = await getOrCreateMember({
    id: clerkUser.id,
    email: clerkUser.emailAddresses[0]?.emailAddress ?? '',
    fullName: clerkUser.fullName,
    avatarUrl: clerkUser.imageUrl,
  });
  const rsvp = await getRsvp(event.id, member.id);

  const date = new Date(event.event_date);
  const going = event.rsvp_count ?? 0;
  const spectators = event.counts?.spectators ?? 0;
  const spotsLeft = event.capacity != null ? Math.max(event.capacity - going, 0) : null;
  const rosterFull = event.capacity != null && going >= event.capacity;

  return (
    <div style={{ background: 'var(--ee-paper)', minHeight: '100vh' }}>
      <EEMemberNav />

      {/* Hero */}
      <section style={{ position: 'relative', height: 420, overflow: 'hidden' }}>
        <EEPhoto tone="warm" label="" style={{ position: 'absolute', inset: 0, borderRadius: 0 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(10,19,37,0.2) 0%, rgba(10,19,37,0.75) 100%)' }} />

        <div style={{ position: 'absolute', top: 28, left: 56 }}>
          <Link href="/events" className="ee-mono" style={{ color: 'rgba(255,255,255,0.85)' }}>← All events</Link>
        </div>

        <div style={{ position: 'absolute', bottom: 48, left: 56, right: 56, color: '#fff' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <span className="ee-tag ee-tag-gold">
              {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).toUpperCase()}
            </span>
            {event.category && (
              <span className="ee-tag" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}>{event.category}</span>
            )}
          </div>
          <h1 className="ee-h1" style={{ color: '#fff', fontSize: 'clamp(40px, 6vw, 72px)' }}>{event.title}</h1>
        </div>
      </section>

      {/* Detail body */}
      <section style={{ padding: '56px 56px 96px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 56 }}>
        {/* Main */}
        <div>
          {/* Quick facts */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', border: '1px solid var(--ee-line)', borderRadius: 10, overflow: 'hidden', marginBottom: 48 }}>
            {[
              { icon: CAL, label: 'When', value: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }), sub: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) },
              { icon: PIN, label: 'Where', value: event.location ?? 'TBA', sub: event.university ?? event.state ?? '' },
              { icon: COMPASS, label: 'Capacity', value: event.capacity != null ? `${going} / ${event.capacity}` : `${going} going`, sub: spotsLeft != null ? `${spotsLeft} spots remaining` : '' },
            ].map(({ icon, label, value, sub }, i) => (
              <div key={label} style={{ padding: '20px 18px', borderRight: i < 2 ? '1px solid var(--ee-line)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <Icon d={icon} size={13} color="var(--ee-gold-deep)" />
                  <span className="ee-mono">{label}</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{value}</div>
                {sub && <div className="ee-small" style={{ fontSize: 12, marginTop: 2 }}>{sub}</div>}
              </div>
            ))}
          </div>

          {/* About */}
          <div className="ee-eyebrow">ABOUT THIS EVENT</div>
          <h2 className="ee-h3" style={{ marginTop: 14, marginBottom: 20, fontSize: 28 }}>{event.title}</h2>
          <div className="ee-body" style={{ fontSize: 16 }}>
            <p>{event.description ?? 'No description yet.'}</p>
          </div>
        </div>

        {/* RSVP */}
        <div>
          <div style={{ position: 'sticky', top: 100, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Roster meter */}
            {event.capacity != null && (
              <div style={{ background: 'var(--ee-navy-900)', color: '#fff', borderRadius: 12, padding: 24 }}>
                <div className="ee-mono" style={{ color: 'var(--ee-gold)' }}>ROSTER</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, margin: '14px 0 8px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>{going} of {event.capacity} players</span>
                  <span style={{ color: rosterFull ? 'var(--ee-gold)' : 'rgba(255,255,255,0.7)' }}>
                    {rosterFull ? 'Roster full' : `${spotsLeft} left`}
                  </span>
                </div>
                <div style={{ height: 5, background: 'rgba(255,255,255,0.15)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min((going / event.capacity) * 100, 100)}%`, height: '100%', background: 'var(--ee-gold)' }} />
                </div>
                {spectators > 0 && (
                  <div className="ee-mono" style={{ color: 'rgba(255,255,255,0.5)', marginTop: 12, fontSize: 10 }}>
                    + {spectators} SPECTATOR{spectators === 1 ? '' : 'S'} COMING
                  </div>
                )}
              </div>
            )}

            <RsvpPanel
              eventId={event.id}
              eventTitle={event.title}
              spotsLeft={spotsLeft}
              rosterFull={rosterFull}
              rsvp={rsvp ? { attendee_type: rsvp.attendee_type, status: rsvp.status } : null}
              profile={{
                fullName: member.full_name,
                phone: member.phone,
                companyOrSchool: member.company_or_school,
                professionalStatus: member.professional_status,
                discipline: member.discipline,
                shirtSize: member.shirt_size,
                is21Plus: member.is_21_plus,
                emergencyContactName: member.emergency_contact_name,
                emergencyContactPhone: member.emergency_contact_phone,
                heardAboutUs: member.heard_about_us,
              }}
            />
          </div>
        </div>
      </section>

      <EEFooter />
    </div>
  );
}
