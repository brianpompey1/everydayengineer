import Link from 'next/link';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import EEMemberNav from '../components/EEMemberNav';
import EEFooter from '../components/EEFooter';
import EEPhoto from '../components/EEPhoto';
import { getOrCreateMember, isProfileComplete } from '@/lib/members';
import { getPublishedEvents } from '@/lib/events';

const TONES = ['court', 'dark', 'warm', 'paper', 'cool', 'gold'] as const;

const CAL = 'M3 9h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM8 3v4M16 3v4';
const ARROW = 'M5 12h14M13 6l6 6-6 6';

function Icon({ d, size = 16 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function getDateString() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase();
}

export default async function TodayPage() {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect('/signin');

  const member = await getOrCreateMember({
    id: clerkUser.id,
    email: clerkUser.emailAddresses[0]?.emailAddress ?? '',
    fullName: clerkUser.fullName,
    avatarUrl: clerkUser.imageUrl,
  });

  const firstName = clerkUser.firstName ?? member.full_name?.split(' ')[0] ?? 'there';
  const events = (await getPublishedEvents()).slice(0, 3);
  const showProfilePrompt = !isProfileComplete(member);

  return (
    <div style={{ background: 'var(--ee-paper)', minHeight: '100vh' }}>
      <EEMemberNav />

      {/* Hero greeting */}
      <section className="ee-section" style={{ paddingBottom: 56 }}>
        <div className="ee-mono" style={{ color: 'var(--ee-gold-deep)' }}>{getDateString()}</div>
        <h1 className="ee-h2" style={{ marginTop: 12 }}>{getGreeting()}, {firstName}.</h1>
        <p className="ee-body" style={{ marginTop: 12, fontSize: 17, maxWidth: 560 }}>
          Welcome to the Field. Check what's coming up, RSVP to events, and connect with the community.
        </p>
      </section>

      {/* Upcoming events */}
      <section style={{ padding: '0 56px 96px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
          <div>
            <div className="ee-eyebrow">UPCOMING EVENTS</div>
            <h2 className="ee-h3" style={{ marginTop: 12, fontSize: 26 }}>What's on.</h2>
          </div>
          <Link href="/events" className="ee-btn-link">View all events →</Link>
        </div>

        {events.length === 0 ? (
          <div style={{ padding: 32, background: 'var(--ee-lavender)', borderRadius: 10, textAlign: 'center' }}>
            <p className="ee-body">No events yet. Check back soon.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {events.map((e, i) => {
              const date = new Date(e.event_date);
              return (
                <Link
                  key={e.id}
                  href={`/events/${e.id}`}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '80px 1fr auto',
                    gap: 24,
                    padding: '20px 24px',
                    alignItems: 'center',
                    background: 'var(--ee-paper)',
                    border: '1px solid var(--ee-line)',
                    borderRadius: 10,
                  }}
                  className="ee-card-hover"
                >
                  <EEPhoto tone={TONES[i % TONES.length]} label="" style={{ aspectRatio: '1/1', borderRadius: 6 }} />
                  <div>
                    {e.category && (
                      <span className="ee-tag" style={{ background: 'var(--ee-lavender-2)', fontSize: 10, marginBottom: 8, display: 'inline-flex' }}>{e.category}</span>
                    )}
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{e.title}</div>
                    <div className="ee-small" style={{ marginTop: 4, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Icon d={CAL} size={12} /> {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                      </span>
                      {e.location && <span>{e.location}</span>}
                    </div>
                  </div>
                  <div style={{ color: 'var(--ee-ink-3)' }}>
                    <Icon d={ARROW} size={18} />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Profile prompt — only shown if profile is incomplete */}
      {showProfilePrompt && (
        <section style={{ padding: '0 56px 96px' }}>
          <div style={{ background: 'var(--ee-navy-900)', borderRadius: 12, padding: '40px 48px', display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'center' }}>
            <div>
              <div className="ee-mono" style={{ color: 'var(--ee-gold)' }}>YOUR PROFILE</div>
              <h3 style={{ marginTop: 12, color: '#fff', fontWeight: 700, fontSize: 22 }}>Introduce yourself to the Field.</h3>
              <p style={{ marginTop: 8, color: 'rgba(255,255,255,0.7)', fontSize: 15, lineHeight: 1.55 }}>
                Add your bio, discipline, and links so other members know who you are.
              </p>
            </div>
            <Link href="/profile" className="ee-btn ee-btn-primary" style={{ whiteSpace: 'nowrap' }}>
              View profile →
            </Link>
          </div>
        </section>
      )}

      <EEFooter />
    </div>
  );
}
