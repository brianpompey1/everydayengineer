'use client';
import { useState } from 'react';
import Link from 'next/link';
import EEMemberNav from '../components/EEMemberNav';
import EEFooter from '../components/EEFooter';
import EEPhoto from '../components/EEPhoto';

const CAL = 'M3 9h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM8 3v4M16 3v4';
const PLUS = 'M12 5v14M5 12h14';
const PIN = 'M12 22s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12zM12 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z';
const FILTER = 'M4 5h16M7 12h10M10 19h4';

function Icon({ d, size = 14 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const CATEGORIES = ['All', 'Society Hoops', 'Deep-Tech Lab', 'Brunch', 'Retreat', 'Workshop'];

const EVENTS = [
  { id: 'hoops-w14', day: '06', mon: 'MAY', dow: 'WED', title: 'Society Hoops · Week 14', cat: 'Society Hoops', loc: 'Brownsville Rec · Brooklyn', when: '7:30pm · 2hrs', host: 'EE Recreation', going: 24, cap: 30, status: 'going' as const, tone: 'court' as const, desc: 'Weekly run. All levels. Bring two pairs of socks.' },
  { id: 'lab-distsys', day: '07', mon: 'MAY', dow: 'THU', title: 'Deep-Tech Lab · Distributed Systems', cat: 'Deep-Tech Lab', loc: 'EE Loft · DUMBO', when: '6:00pm · 3hrs', host: 'Jules Renaud', going: 18, cap: 24, status: 'rsvp' as const, tone: 'dark' as const, desc: 'A practical session on consensus, partition tolerance, and the systems we choose to live with.' },
  { id: 'brunch-may', day: '16', mon: 'MAY', dow: 'SAT', title: 'Community Brunch', cat: 'Brunch', loc: 'Bed-Stuy · TBA', when: '11:00am · 3hrs', host: 'Guitry Germain', going: 42, cap: 60, status: 'rsvp' as const, tone: 'warm' as const, desc: "The original ritual. Eggs, dialogue, no slides. Bring someone you'd want at the table." },
  { id: 'retreat-catskills', day: '22', mon: 'MAY', dow: 'FRI', title: 'Catskills Wellness Retreat', cat: 'Retreat', loc: 'Phoenicia, NY', when: '3 nights', host: 'EE Wellness', going: 32, cap: 32, status: 'waitlist' as const, tone: 'paper' as const, desc: 'Sleep, sauna, hike, dialogue. Three nights in the Catskills.' },
  { id: 'oh-guitry', day: '26', mon: 'MAY', dow: 'TUE', title: 'Founders Office Hours · Guitry', cat: 'Workshop', loc: 'Virtual · Zoom', when: '12:00pm · 1hr', host: 'Guitry Germain', going: 8, cap: 20, status: 'rsvp' as const, tone: 'cool' as const, desc: 'Open office hours with the founder. Bring one real question.' },
  { id: 'workshop-rust', day: '03', mon: 'JUN', dow: 'WED', title: 'Rust for Systems Engineers', cat: 'Workshop', loc: 'EE Loft · DUMBO', when: '6:30pm · 2hrs', host: 'Nadia Petrova', going: 12, cap: 20, status: 'rsvp' as const, tone: 'gold' as const, desc: 'A hands-on intro to Rust. Bring a laptop. We will write code.' },
];

const ATTENDEES = [
  { tone: 'warm' as const }, { tone: 'paper' as const }, { tone: 'cool' as const }, { tone: 'dark' as const },
];

export default function EventsPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All' ? EVENTS : EVENTS.filter(e => e.cat === activeCategory);
  const featured = EVENTS[2]; // Community Brunch

  return (
    <div style={{ background: 'var(--ee-paper)', minHeight: '100vh' }}>
      <EEMemberNav />

      {/* Header */}
      <section className="ee-section" style={{ paddingBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div className="ee-eyebrow">EVENTS · MAY – JUN 2026</div>
            <h1 className="ee-h2" style={{ marginTop: 14 }}>What's on.</h1>
            <p className="ee-body" style={{ marginTop: 8, maxWidth: 540 }}>
              Hoops, labs, brunches, and retreats. RSVPs are members-only and close 24 hours before each event.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button className="ee-btn ee-btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon d={CAL} /> Calendar view
            </button>
            <button className="ee-btn ee-btn-dark" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon d={PLUS} /> Propose event
            </button>
          </div>
        </div>
      </section>

      {/* Filter strip */}
      <section style={{ padding: '16px 56px', borderTop: '1px solid var(--ee-line)', borderBottom: '1px solid var(--ee-line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, position: 'sticky', top: 80, background: 'var(--ee-paper)', zIndex: 10 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setActiveCategory(c)} className="ee-tag" style={{ background: activeCategory === c ? 'var(--ee-navy-900)' : 'var(--ee-lavender-2)', color: activeCategory === c ? 'var(--ee-paper)' : 'var(--ee-ink-2)', padding: '8px 14px', cursor: 'pointer', border: 'none' }}>
              {c}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <span className="ee-mono">{filtered.length} events</span>
          <span style={{ width: 1, height: 16, background: 'var(--ee-line)' }} />
          <span className="ee-mono" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon d={FILTER} /> New York · Show all
          </span>
        </div>
      </section>

      {/* Featured event */}
      {activeCategory === 'All' && (
        <section style={{ padding: '40px 56px 24px' }}>
          <div className="ee-mono" style={{ color: 'var(--ee-gold-deep)', marginBottom: 14 }}>FEATURED · THIS WEEK</div>
          <Link href={`/events/${featured.id}`} style={{ display: 'grid', gridTemplateColumns: '5fr 4fr', background: 'var(--ee-paper)', border: '1px solid var(--ee-line)', borderRadius: 12, overflow: 'hidden' }} className="ee-card-hover">
            <EEPhoto tone="warm" label="COMMUNITY BRUNCH · BED-STUY" style={{ aspectRatio: '5/3', borderRadius: 0 }} />
            <div style={{ padding: 36, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span className="ee-tag ee-tag-gold">SAT · MAY 16 · 11AM</span>
                <h2 style={{ marginTop: 18, fontSize: 30, fontWeight: 800, letterSpacing: '-0.01em' }}>Community Brunch</h2>
                <p className="ee-body" style={{ marginTop: 12, fontSize: 15 }}>
                  The original ritual. Eggs, dialogue, no slides. Hosted by Guitry. Bring someone you'd want at the table.
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ display: 'flex' }}>
                    {ATTENDEES.map((a, i) => (
                      <EEPhoto key={i} tone={a.tone} label="" style={{ width: 28, height: 28, borderRadius: '50%', marginLeft: i ? -8 : 0, border: '2px solid var(--ee-paper)' }} />
                    ))}
                  </div>
                  <span className="ee-small">42 going · 18 spots left</span>
                </div>
                <button className="ee-btn ee-btn-dark">RSVP →</button>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Event list */}
      <section style={{ padding: '16px 56px 96px' }}>
        <div className="ee-mono" style={{ color: 'var(--ee-gold-deep)', marginBottom: 16 }}>UPCOMING</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map((e) => (
            <Link
              key={e.id}
              href={`/events/${e.id}`}
              className="ee-card ee-card-hover"
              style={{ display: 'grid', gridTemplateColumns: '80px 72px 1fr 160px 140px 110px', gap: 20, padding: '18px 22px', alignItems: 'center' }}
            >
              {/* Date */}
              <div style={{ textAlign: 'center', borderRight: '1px solid var(--ee-line)', paddingRight: 14 }}>
                <div className="ee-mono" style={{ color: 'var(--ee-gold-deep)' }}>{e.mon}</div>
                <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>{e.day}</div>
                <div className="ee-small" style={{ fontSize: 10, marginTop: 4 }}>{e.dow}</div>
              </div>
              {/* Photo */}
              <EEPhoto tone={e.tone} label="" style={{ aspectRatio: '1/1', borderRadius: 6 }} />
              {/* Title */}
              <div>
                <div style={{ marginBottom: 6 }}>
                  <span className="ee-tag" style={{ background: 'var(--ee-lavender-2)', fontSize: 10 }}>{e.cat}</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{e.title}</div>
                <div className="ee-small" style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Icon d={PIN} size={11} /> {e.loc} · {e.when}
                </div>
              </div>
              {/* Host */}
              <div>
                <div className="ee-mono" style={{ color: 'var(--ee-ink-3)', fontSize: 10 }}>HOSTED BY</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>{e.host}</div>
              </div>
              {/* Capacity */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 6 }}>
                  <span className="ee-mono" style={{ fontSize: 10 }}>{e.going} / {e.cap}</span>
                  {e.going / e.cap > 0.85 && <span className="ee-mono" style={{ color: 'var(--ee-gold-deep)', fontSize: 10 }}>ALMOST FULL</span>}
                  {e.going === e.cap && <span className="ee-mono" style={{ color: 'var(--ee-ink-3)', fontSize: 10 }}>FULL</span>}
                </div>
                <div style={{ height: 4, background: 'var(--ee-lavender-2)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: `${(e.going / e.cap) * 100}%`, height: '100%', background: e.going === e.cap ? 'var(--ee-ink-3)' : 'var(--ee-gold)' }} />
                </div>
              </div>
              {/* Action */}
              <div style={{ textAlign: 'right' }}>
                {e.status === 'going'
                  ? <span className="ee-tag ee-tag-gold">RSVP'd ✓</span>
                  : e.status === 'waitlist'
                  ? <button className="ee-btn ee-btn-ghost" style={{ padding: '8px 12px', fontSize: 12 }}>Join waitlist</button>
                  : <button className="ee-btn ee-btn-dark" style={{ padding: '8px 16px', fontSize: 12 }}>RSVP</button>}
              </div>
            </Link>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
          <button className="ee-btn ee-btn-ghost">Load more events</button>
        </div>
      </section>

      <EEFooter />
    </div>
  );
}
