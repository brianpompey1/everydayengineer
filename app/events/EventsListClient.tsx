'use client';
import { useState } from 'react';
import Link from 'next/link';
import EEPhoto from '../components/EEPhoto';

const CAL = 'M3 9h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM8 3v4M16 3v4';
const PIN = 'M12 22s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12zM12 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z';
const FILTER = 'M4 5h16M7 12h10M10 19h4';

function Icon({ d, size = 14 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const TONES = ['court', 'dark', 'warm', 'paper', 'cool', 'gold'] as const;

export interface EventListItem {
  id: string;
  title: string;
  category: string | null;
  location: string | null;
  eventDate: string;
  capacity: number | null;
  going: number;
  rsvpStatus: string | null;
}

export default function EventsListClient({ events }: { events: EventListItem[] }) {
  const categories = ['All', ...Array.from(new Set(events.map((e) => e.category).filter(Boolean)))] as string[];
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All' ? events : events.filter((e) => e.category === activeCategory);
  const featured = events[0];

  return (
    <>
      {/* Header */}
      <section className="ee-section" style={{ paddingBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div className="ee-eyebrow">EVENTS</div>
            <h1 className="ee-h2" style={{ marginTop: 14 }}>What's on.</h1>
            <p className="ee-body" style={{ marginTop: 8, maxWidth: 540 }}>
              Hoops, labs, brunches, and retreats. RSVPs are members-only.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button className="ee-btn ee-btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon d={CAL} /> Calendar view
            </button>
          </div>
        </div>
      </section>

      {events.length === 0 ? (
        <section style={{ padding: '0 56px 96px' }}>
          <div style={{ padding: 48, textAlign: 'center', background: 'var(--ee-lavender)', borderRadius: 12 }}>
            <h3 style={{ fontSize: 20, fontWeight: 700 }}>No events yet.</h3>
            <p className="ee-body" style={{ marginTop: 8 }}>Check back soon — events are added regularly.</p>
          </div>
        </section>
      ) : (
        <>
          {/* Filter strip */}
          <section style={{ padding: '16px 56px', borderTop: '1px solid var(--ee-line)', borderBottom: '1px solid var(--ee-line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, position: 'sticky', top: 80, background: 'var(--ee-paper)', zIndex: 10 }}>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {categories.map((c) => (
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
          {activeCategory === 'All' && featured && (
            <section style={{ padding: '40px 56px 24px' }}>
              <div className="ee-mono" style={{ color: 'var(--ee-gold-deep)', marginBottom: 14 }}>FEATURED · UP NEXT</div>
              <Link href={`/events/${featured.id}`} style={{ display: 'grid', gridTemplateColumns: '5fr 4fr', background: 'var(--ee-paper)', border: '1px solid var(--ee-line)', borderRadius: 12, overflow: 'hidden' }} className="ee-card-hover">
                <EEPhoto tone="warm" label={(featured.category ?? '').toUpperCase()} style={{ aspectRatio: '5/3', borderRadius: 0 }} />
                <div style={{ padding: 36, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <span className="ee-tag ee-tag-gold">
                      {new Date(featured.eventDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).toUpperCase()}
                    </span>
                    <h2 style={{ marginTop: 18, fontSize: 30, fontWeight: 800, letterSpacing: '-0.01em' }}>{featured.title}</h2>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, flexWrap: 'wrap', gap: 12 }}>
                    <span className="ee-small">
                      {featured.going} going{featured.capacity ? ` · ${Math.max(featured.capacity - featured.going, 0)} spots left` : ''}
                    </span>
                    <button className="ee-btn ee-btn-dark">
                      {featured.rsvpStatus ? "RSVP'd ✓" : 'RSVP →'}
                    </button>
                  </div>
                </div>
              </Link>
            </section>
          )}

          {/* Event list */}
          <section style={{ padding: '16px 56px 96px' }}>
            <div className="ee-mono" style={{ color: 'var(--ee-gold-deep)', marginBottom: 16 }}>UPCOMING</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filtered.map((e, i) => {
                const date = new Date(e.eventDate);
                const full = e.capacity != null && e.going >= e.capacity;
                const almostFull = e.capacity != null && e.going / e.capacity > 0.85 && !full;
                return (
                  <Link
                    key={e.id}
                    href={`/events/${e.id}`}
                    className="ee-card ee-card-hover"
                    style={{ display: 'grid', gridTemplateColumns: '80px 72px 1fr 160px 110px', gap: 20, padding: '18px 22px', alignItems: 'center' }}
                  >
                    <div style={{ textAlign: 'center', borderRight: '1px solid var(--ee-line)', paddingRight: 14 }}>
                      <div className="ee-mono" style={{ color: 'var(--ee-gold-deep)' }}>{date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}</div>
                      <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>{date.getDate()}</div>
                      <div className="ee-small" style={{ fontSize: 10, marginTop: 4 }}>{date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}</div>
                    </div>
                    <EEPhoto tone={TONES[i % TONES.length]} label="" style={{ aspectRatio: '1/1', borderRadius: 6 }} />
                    <div>
                      {e.category && (
                        <div style={{ marginBottom: 6 }}>
                          <span className="ee-tag" style={{ background: 'var(--ee-lavender-2)', fontSize: 10 }}>{e.category}</span>
                        </div>
                      )}
                      <div style={{ fontWeight: 700, fontSize: 16 }}>{e.title}</div>
                      <div className="ee-small" style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Icon d={PIN} size={11} /> {e.location ?? 'Location TBA'} · {date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </div>
                    </div>
                    <div>
                      {e.capacity != null ? (
                        <>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 6 }}>
                            <span className="ee-mono" style={{ fontSize: 10 }}>{e.going} / {e.capacity}</span>
                            {almostFull && <span className="ee-mono" style={{ color: 'var(--ee-gold-deep)', fontSize: 10 }}>ALMOST FULL</span>}
                            {full && <span className="ee-mono" style={{ color: 'var(--ee-ink-3)', fontSize: 10 }}>FULL</span>}
                          </div>
                          <div style={{ height: 4, background: 'var(--ee-lavender-2)', borderRadius: 2, overflow: 'hidden' }}>
                            <div style={{ width: `${Math.min((e.going / e.capacity) * 100, 100)}%`, height: '100%', background: full ? 'var(--ee-ink-3)' : 'var(--ee-gold)' }} />
                          </div>
                        </>
                      ) : (
                        <span className="ee-small">{e.going} going</span>
                      )}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      {e.rsvpStatus
                        ? <span className="ee-tag ee-tag-gold">RSVP'd ✓</span>
                        : full
                        ? <button className="ee-btn ee-btn-ghost" style={{ padding: '8px 12px', fontSize: 12 }}>Join waitlist</button>
                        : <button className="ee-btn ee-btn-dark" style={{ padding: '8px 16px', fontSize: 12 }}>RSVP</button>}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        </>
      )}
    </>
  );
}
