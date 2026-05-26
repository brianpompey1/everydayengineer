'use client';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import EEMemberNav from '../components/EEMemberNav';
import EEFooter from '../components/EEFooter';
import EEPhoto from '../components/EEPhoto';

const UPCOMING_EVENTS = [
  { id: 'hoops-w14', title: 'Society Hoops · Week 14', category: 'Society Hoops', when: 'Wed, May 27 · 7:30 PM', loc: 'Brownsville Rec', tone: 'court' as const },
  { id: 'lab-distsys', title: 'Deep-Tech Lab · Distributed Systems', category: 'Deep-Tech Lab', when: 'Thu, May 28 · 6:00 PM', loc: 'EE Loft · DUMBO', tone: 'dark' as const },
  { id: 'brunch-may', title: 'Community Brunch', category: 'Brunch', when: 'Sat, Jun 7 · 11:00 AM', loc: 'Bed-Stuy · TBA', tone: 'warm' as const },
];

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

export default function TodayPage() {
  const { user } = useUser();
  const firstName = user?.firstName ?? 'there';

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

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {UPCOMING_EVENTS.map((e) => (
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
                transition: 'transform 120ms ease, box-shadow 120ms ease',
              }}
              className="ee-card-hover"
            >
              <EEPhoto tone={e.tone} label="" style={{ aspectRatio: '1/1', borderRadius: 6 }} />
              <div>
                <span className="ee-tag" style={{ background: 'var(--ee-lavender-2)', fontSize: 10, marginBottom: 8, display: 'inline-flex' }}>{e.category}</span>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{e.title}</div>
                <div className="ee-small" style={{ marginTop: 4, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Icon d={CAL} size={12} /> {e.when}
                  </span>
                  <span>{e.loc}</span>
                </div>
              </div>
              <div style={{ color: 'var(--ee-ink-3)' }}>
                <Icon d={ARROW} size={18} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Profile prompt — only shown if profile is incomplete */}
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
            Set up profile →
          </Link>
        </div>
      </section>

      <EEFooter />
    </div>
  );
}
