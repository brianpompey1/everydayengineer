'use client';
import { useState } from 'react';
import Link from 'next/link';
import EEMemberNav from '../../components/EEMemberNav';
import EEFooter from '../../components/EEFooter';
import EEPhoto from '../../components/EEPhoto';

const CAL = 'M3 9h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM8 3v4M16 3v4';
const PIN = 'M12 22s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12zM12 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z';
const USER = 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4.4 3.6-7 8-7s8 2.6 8 7';
const COMPASS = 'M12 2v3M12 19v3M2 12h3M19 12h3M16 8l-3 5-5 3 3-5 5-3z';
const CHECK = 'M5 12l5 5L20 7';

function Icon({ d, size = 14, color }: { d: string; size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color ?? 'currentColor'} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const ATTENDEES = [
  { n: 'Amara Okonkwo', tone: 'warm' as const, city: 'NYC' },
  { n: 'Jules Renaud', tone: 'paper' as const, city: 'NYC' },
  { n: 'Nadia Petrova', tone: 'cool' as const, city: 'NYC' },
  { n: 'David Adeyemi', tone: 'dark' as const, city: 'ATL' },
  { n: 'Sofia Costa', tone: 'gold' as const, city: 'NYC' },
  { n: 'Marcus Chen', tone: 'warm' as const, city: 'NYC' },
  { n: 'Liam Carter', tone: 'paper' as const, city: 'NYC' },
  { n: 'Yuki Tanaka', tone: 'cool' as const, city: 'NYC' },
];

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const [rsvped, setRsvped] = useState(false);
  const [plusOne, setPlusOne] = useState(false);
  const [dietary, setDietary] = useState('');

  const going = 42;
  const cap = 60;

  return (
    <div style={{ background: 'var(--ee-paper)', minHeight: '100vh' }}>
      <EEMemberNav />

      {/* Hero */}
      <section style={{ position: 'relative', height: 520, overflow: 'hidden' }}>
        <EEPhoto tone="warm" label="" style={{ position: 'absolute', inset: 0, borderRadius: 0 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(10,19,37,0.2) 0%, rgba(10,19,37,0.75) 100%)' }} />

        {/* Back link */}
        <div style={{ position: 'absolute', top: 28, left: 56 }}>
          <Link href="/events" className="ee-mono" style={{ color: 'rgba(255,255,255,0.85)' }}>← All events</Link>
        </div>

        {/* Content */}
        <div style={{ position: 'absolute', bottom: 48, left: 56, right: 56, color: '#fff' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <span className="ee-tag ee-tag-gold">SAT · MAY 16 · 11:00AM ET</span>
            <span className="ee-tag" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}>Brunch</span>
          </div>
          <h1 className="ee-h1" style={{ color: '#fff', fontSize: 'clamp(40px, 6vw, 80px)' }}>Community Brunch</h1>
          <p style={{ marginTop: 16, color: 'rgba(255,255,255,0.85)', fontSize: 17, maxWidth: 640 }}>
            The original ritual. Eggs, dialogue, no slides. Bring someone you'd want at the table.
          </p>
        </div>
      </section>

      {/* Detail body */}
      <section style={{ padding: '56px 56px 96px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 56 }}>
        {/* Main */}
        <div>
          {/* Quick facts */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', border: '1px solid var(--ee-line)', borderRadius: 10, overflow: 'hidden', marginBottom: 48 }}>
            {[
              { icon: CAL, label: 'When', value: 'Sat, May 16', sub: '11:00am – 2:00pm ET' },
              { icon: PIN, label: 'Where', value: 'Bed-Stuy, BK', sub: 'Address shared 24h before' },
              { icon: USER, label: 'Hosted by', value: 'Guitry Germain', sub: 'Founder' },
              { icon: COMPASS, label: 'Capacity', value: `${going} / ${cap}`, sub: `${cap - going} spots remaining` },
            ].map(({ icon, label, value, sub }, i) => (
              <div key={label} style={{ padding: '20px 18px', borderRight: i < 3 ? '1px solid var(--ee-line)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <Icon d={icon} size={13} color="var(--ee-gold-deep)" />
                  <span className="ee-mono">{label}</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{value}</div>
                <div className="ee-small" style={{ fontSize: 12, marginTop: 2 }}>{sub}</div>
              </div>
            ))}
          </div>

          {/* About */}
          <div className="ee-eyebrow">ABOUT THIS EVENT</div>
          <h2 className="ee-h3" style={{ marginTop: 14, marginBottom: 20, fontSize: 28 }}>The original ritual.</h2>
          <div className="ee-body" style={{ fontSize: 16 }}>
            <p>Community Brunch started as a Sunday in 2017 with four engineers and a pan of eggs. Six years later, it's the most-loved gathering on the EE calendar — a no-slides, no-pitches, table-only conversation between people who'd rather talk about what they're building (and what they're not).</p>
            <p style={{ marginTop: 16 }}>This month's brunch is hosted by Guitry at his Bed-Stuy place. We'll cap at 60 to keep it intimate. Address shared 24 hours before — please don't post it publicly.</p>
            <p style={{ marginTop: 16 }}><strong>Bring:</strong> one good question, your appetite, and a +1 if you'd like (let us know in your RSVP).</p>
          </div>

          {/* Past photos */}
          <div style={{ marginTop: 48 }}>
            <div className="ee-eyebrow">FROM PAST BRUNCHES</div>
            <h3 className="ee-h3" style={{ marginTop: 14, marginBottom: 20, fontSize: 24 }}>The room you'll walk into.</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridAutoRows: 140, gap: 8 }}>
              <EEPhoto tone="warm" label="MAR '26" style={{ gridColumn: 'span 2', gridRow: 'span 2' }} />
              <EEPhoto tone="paper" label="FEB '26" />
              <EEPhoto tone="cool" label="JAN '26" />
              <EEPhoto tone="gold" label="DEC '25" />
              <EEPhoto tone="dark" label="NOV '25" />
            </div>
          </div>

          {/* Attendees */}
          <div style={{ marginTop: 48 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
              <div>
                <div className="ee-eyebrow">WHO'S COMING</div>
                <h3 className="ee-h3" style={{ marginTop: 14, fontSize: 24 }}>{going} going · {cap - going} spots left</h3>
              </div>
              <button className="ee-btn-link">View all ↗</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {ATTENDEES.map((a) => (
                <div key={a.n} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 12px', background: 'var(--ee-lavender)', borderRadius: 8 }}>
                  <EEPhoto tone={a.tone} label="" style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.n}</div>
                    <div className="ee-small" style={{ fontSize: 11 }}>Field · {a.city}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RSVP card — sticky */}
        <div>
          <div style={{ position: 'sticky', top: 100 }}>
            <div style={{ background: 'var(--ee-navy-900)', color: '#fff', borderRadius: 12, padding: 28 }}>
              <div className="ee-mono" style={{ color: 'var(--ee-gold)' }}>RSVP · CLOSES MAY 15</div>
              <h3 style={{ color: '#fff', marginTop: 14, fontSize: 22, fontWeight: 800 }}>Save your seat</h3>

              {/* Capacity */}
              <div style={{ marginTop: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>{going} going</span>
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>{cap - going} left</span>
                </div>
                <div style={{ height: 5, background: 'rgba(255,255,255,0.15)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${(going / cap) * 100}%`, height: '100%', background: 'var(--ee-gold)' }} />
                </div>
              </div>

              {!rsvped ? (
                <>
                  {/* +1 toggle */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 24, cursor: 'pointer', fontSize: 14, color: 'rgba(255,255,255,0.85)' }}>
                    <input type="checkbox" checked={plusOne} onChange={e => setPlusOne(e.target.checked)} />
                    Bringing a +1 guest
                  </label>

                  {/* Dietary */}
                  <div style={{ marginTop: 16 }}>
                    <label className="ee-label" style={{ color: 'rgba(255,255,255,0.5)' }}>Dietary notes (optional)</label>
                    <input
                      className="ee-input"
                      placeholder="Vegetarian, nut allergy…"
                      value={dietary}
                      onChange={e => setDietary(e.target.value)}
                      style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.15)', color: '#fff', marginTop: 8 }}
                    />
                  </div>

                  <button
                    className="ee-btn ee-btn-primary"
                    onClick={() => setRsvped(true)}
                    style={{ width: '100%', marginTop: 20, padding: '14px' }}
                  >
                    Confirm RSVP →
                  </button>
                </>
              ) : (
                <div style={{ marginTop: 24, padding: 20, background: 'rgba(255,255,255,0.08)', borderRadius: 8, textAlign: 'center' }}>
                  <div style={{ fontSize: 24 }}>✓</div>
                  <div style={{ fontWeight: 700, marginTop: 8 }}>You're going!</div>
                  <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, marginTop: 6 }}>Address shared 24h before the event.</div>
                  <button onClick={() => setRsvped(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 12, cursor: 'pointer', marginTop: 12 }}>
                    Cancel RSVP
                  </button>
                </div>
              )}

              <div className="ee-mono" style={{ color: 'rgba(255,255,255,0.35)', marginTop: 20, fontSize: 10, lineHeight: 1.5 }}>
                Address shared to confirmed RSVPs only, 24 hours before the event.
              </div>
            </div>

            {/* Host card */}
            <div className="ee-card" style={{ marginTop: 16, padding: 20 }}>
              <div className="ee-mono" style={{ color: 'var(--ee-gold-deep)' }}>YOUR HOST</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 14 }}>
                <EEPhoto tone="warm" label="" style={{ width: 48, height: 48, borderRadius: '50%' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>Guitry Germain</div>
                  <div className="ee-small">Founder · Everyday Engineer</div>
                </div>
              </div>
              <p className="ee-small" style={{ marginTop: 14, lineHeight: 1.5 }}>
                Guitry hosts the Community Brunch series and is known for killing the clock at minute 179 so the conversation keeps going.
              </p>
            </div>
          </div>
        </div>
      </section>

      <EEFooter />
    </div>
  );
}
