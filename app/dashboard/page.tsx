'use client';

import { useState } from 'react';
import Link from 'next/link';
import EENav from '../components/EENav';
import EEFooter from '../components/EEFooter';
import EEPhoto from '../components/EEPhoto';

type Tone = 'cool' | 'warm' | 'dark' | 'paper' | 'gold' | 'court';

const EVENTS = [
  { d: 'WED MAY 06', t: 'Society Hoops · Week 14', loc: 'Brownsville Rec · Brooklyn', when: '7:30pm', going: 24, status: 'rsvp' },
  { d: 'THU MAY 07', t: 'Deep-Tech Lab · Distributed Systems', loc: 'EE Loft · DUMBO', when: '6:00pm', going: 18, status: 'going' },
  { d: 'SAT MAY 16', t: 'Community Brunch', loc: 'Bed-Stuy · TBA', when: '11:00am', going: 42, status: 'rsvp' },
  { d: 'FRI MAY 22', t: 'Catskills Wellness Retreat', loc: 'Phoenicia, NY', when: '3 nights', going: 32, status: 'waitlist' },
  { d: 'TUE MAY 26', t: 'Founders Office Hours · Guitry', loc: 'Virtual · Zoom', when: '12:00pm', going: 8, status: 'rsvp' },
];

const MEMBERS = [
  { n: 'Amara Okonkwo', r: 'Staff ML Eng · Anthropic', city: 'Brooklyn', tone: 'warm' as Tone },
  { n: 'Jules Renaud', r: 'CTO · Pétion Labs', city: 'Port-au-Prince', tone: 'paper' as Tone },
  { n: 'Nadia Petrova', r: 'Principal SRE · Stripe', city: 'Berlin', tone: 'cool' as Tone },
  { n: 'David Adeyemi', r: 'Founder · Lagos Data', city: 'Lagos', tone: 'dark' as Tone },
];

const ORDERS = [
  { n: 'EE Signature Hat', sub: 'Midnight Black', d: 'Apr 18, 2026', s: 'Delivered', p: 35, tone: 'dark' as Tone },
  { n: 'Foundation Tee × 2', sub: 'Bone White, M/L', d: 'Mar 22, 2026', s: 'Delivered', p: 90, tone: 'paper' as Tone },
  { n: 'Field Journal No. 11', sub: 'Print Edition', d: 'Feb 14, 2026', s: 'Delivered', p: 18, tone: 'gold' as Tone },
];

const MSGS = [
  { n: 'Amara Okonkwo', m: 'Saw your note on the lab — happy to swap notes on retrieval.', t: '2h', unread: true },
  { n: 'Society Hoops', m: 'Reminder: bring two pairs of socks.', t: '1d', unread: false },
  { n: 'Jules Renaud', m: "I'll be in NYC May 18-22. Coffee?", t: '3d', unread: true },
];

const TAGS = ['Distributed Systems', 'Go', 'Observability', 'Mentor'];

export default function DashboardPage() {
  const [search, setSearch] = useState('');

  return (
    <div style={{ background: 'var(--ee-paper)', minHeight: '100vh' }}>
      <EENav />

      {/* Welcome bar */}
      <section
        style={{
          padding: '48px 56px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}
      >
        <div>
          <div className="ee-mono" style={{ color: 'var(--ee-gold-deep)' }}>
            WELCOME BACK · MEMBER NO. 0847
          </div>
          <h1
            style={{
              fontFamily: 'var(--ee-display)',
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: 64,
              margin: '12px 0 0',
              letterSpacing: '-0.02em',
            }}
          >
            Hello, Marcus.
          </h1>
          <p className="ee-body" style={{ marginTop: 8, fontSize: 16 }}>
            You have <strong style={{ color: 'var(--ee-ink)' }}>3 events</strong> this week and{' '}
            <strong style={{ color: 'var(--ee-ink)' }}>2 unread messages.</strong>
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="ee-btn ee-btn-ghost" style={{ fontSize: 13 }}>
            ◎ Find members
          </button>
          <button className="ee-btn ee-btn-dark" style={{ fontSize: 13 }}>
            Edit profile
          </button>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '0 56px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            ['14', 'Events attended'],
            ['Field Tier', 'Active · renews Sep'],
            ['$248', 'Lifetime spent'],
            ['28', 'Connections'],
          ].map(([n, l]) => (
            <div
              key={l}
              style={{
                background: 'var(--ee-lavender)',
                borderRadius: 10,
                padding: 24,
              }}
            >
              <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em' }}>{n}</div>
              <div className="ee-small" style={{ marginTop: 6 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Two-column layout */}
      <section
        style={{
          padding: '32px 56px 96px',
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: 24,
        }}
      >
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Events */}
          <div className="ee-card" style={{ padding: 28 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
              }}
            >
              <h2 className="ee-h3" style={{ fontSize: 22 }}>Upcoming events</h2>
              <Link href="#" className="ee-btn-link">View all ↗</Link>
            </div>
            {EVENTS.map((e, i) => (
              <div
                key={i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '90px 1fr 100px 120px',
                  gap: 20,
                  padding: '18px 0',
                  borderTop: i === 0 ? 'none' : '1px solid var(--ee-line)',
                  alignItems: 'center',
                }}
              >
                <div
                  className="ee-mono"
                  style={{ fontSize: 11, letterSpacing: '0.14em', color: 'var(--ee-gold-deep)' }}
                >
                  {e.d}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{e.t}</div>
                  <div className="ee-small" style={{ marginTop: 2 }}>
                    {e.loc} · {e.when}
                  </div>
                </div>
                <div className="ee-small">{e.going} going</div>
                {e.status === 'going' ? (
                  <span className="ee-tag ee-tag-gold" style={{ fontSize: 11 }}>RSVP'd ✓</span>
                ) : e.status === 'waitlist' ? (
                  <span className="ee-tag" style={{ background: 'var(--ee-paper-2)', fontSize: 11 }}>
                    Waitlist
                  </span>
                ) : (
                  <button
                    className="ee-btn ee-btn-ghost"
                    style={{ padding: '8px 14px', fontSize: 12 }}
                  >
                    RSVP
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Profile */}
          <div className="ee-card" style={{ padding: 28 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
              }}
            >
              <h2 className="ee-h3" style={{ fontSize: 22 }}>Your profile</h2>
              <Link href="#" className="ee-btn-link">Edit ↗</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 24 }}>
              <EEPhoto tone="warm" style={{ aspectRatio: '1/1', borderRadius: 60 }} />
              <div>
                <h3 className="ee-h4" style={{ fontSize: 22 }}>Marcus Chen</h3>
                <div className="ee-small">Senior Platform Eng · Datadog · NYC</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
                  {TAGS.map((t) => (
                    <span key={t} className="ee-tag">{t}</span>
                  ))}
                </div>
                <p className="ee-body" style={{ fontSize: 14, marginTop: 14 }}>
                  Building reliability tooling at Datadog. Off the clock: hoops, Haitian food, generative photography. Open to mentorship matches.
                </p>
                <div style={{ display: 'flex', gap: 12, marginTop: 14 }}>
                  <Link href="#" className="ee-mono" style={{ color: 'var(--ee-ink-2)' }}>LinkedIn ↗</Link>
                  <Link href="#" className="ee-mono" style={{ color: 'var(--ee-ink-2)' }}>GitHub ↗</Link>
                  <Link href="#" className="ee-mono" style={{ color: 'var(--ee-ink-2)' }}>Personal ↗</Link>
                </div>
              </div>
            </div>
          </div>

          {/* Orders */}
          <div className="ee-card" style={{ padding: 28 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
              }}
            >
              <h2 className="ee-h3" style={{ fontSize: 22 }}>Recent orders</h2>
              <Link href="#" className="ee-btn-link">All orders ↗</Link>
            </div>
            {ORDERS.map((o, i) => (
              <div
                key={i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '60px 1fr 120px 100px 80px',
                  gap: 16,
                  padding: '14px 0',
                  borderTop: i === 0 ? 'none' : '1px solid var(--ee-line)',
                  alignItems: 'center',
                }}
              >
                <EEPhoto tone={o.tone} style={{ aspectRatio: '1/1', borderRadius: 4 }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{o.n}</div>
                  <div className="ee-small">{o.sub}</div>
                </div>
                <div className="ee-small">{o.d}</div>
                <span className="ee-tag" style={{ background: 'var(--ee-lavender-2)' }}>{o.s}</span>
                <div style={{ fontWeight: 700, fontSize: 14, textAlign: 'right' }}>${o.p}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right rail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Messages */}
          <div className="ee-card" style={{ padding: 24 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <h3 className="ee-h4" style={{ fontSize: 16 }}>Messages</h3>
              <span className="ee-tag ee-tag-gold" style={{ fontSize: 10 }}>2 NEW</span>
            </div>
            {MSGS.map((m, i) => (
              <div
                key={i}
                style={{
                  padding: '14px 0',
                  borderTop: i === 0 ? 'none' : '1px solid var(--ee-line)',
                  display: 'flex',
                  gap: 12,
                }}
              >
                <span
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'var(--ee-lavender-2)',
                    flexShrink: 0,
                    position: 'relative',
                  }}
                >
                  {m.unread && (
                    <span
                      style={{
                        position: 'absolute',
                        top: -2,
                        right: -2,
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: 'var(--ee-gold)',
                        border: '2px solid var(--ee-paper)',
                      }}
                    />
                  )}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{m.n}</span>
                    <span className="ee-small" style={{ fontSize: 11 }}>{m.t}</span>
                  </div>
                  <p
                    className="ee-small"
                    style={{
                      marginTop: 2,
                      fontSize: 13,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {m.m}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Member directory */}
          <div className="ee-card" style={{ padding: 24 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <h3 className="ee-h4" style={{ fontSize: 16 }}>Members to know</h3>
              <Link href="#" className="ee-btn-link" style={{ fontSize: 10 }}>
                DIRECTORY
              </Link>
            </div>
            <div style={{ position: 'relative', marginBottom: 14 }}>
              <input
                className="ee-input"
                placeholder="Search 1,247 members…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: 38, fontSize: 13 }}
              />
              <span
                style={{
                  position: 'absolute',
                  left: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--ee-ink-3)',
                  fontSize: 14,
                }}
              >
                ◎
              </span>
            </div>
            {MEMBERS.map((m, i) => (
              <div
                key={i}
                style={{
                  padding: '12px 0',
                  borderTop: i === 0 ? 'none' : '1px solid var(--ee-line)',
                  display: 'flex',
                  gap: 12,
                  alignItems: 'center',
                }}
              >
                <EEPhoto
                  tone={m.tone}
                  style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0 }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{m.n}</div>
                  <div className="ee-small" style={{ fontSize: 11 }}>
                    {m.r} · {m.city}
                  </div>
                </div>
                <button
                  className="ee-btn ee-btn-ghost"
                  style={{ padding: '6px 10px', fontSize: 11 }}
                >
                  Connect
                </button>
              </div>
            ))}
          </div>

          {/* Membership card */}
          <div
            style={{
              background: 'var(--ee-navy-900)',
              color: '#fff',
              borderRadius: 10,
              padding: 24,
            }}
          >
            <div className="ee-mono" style={{ color: 'var(--ee-gold)' }}>FIELD MEMBER · 0847</div>
            <h3 className="ee-h4" style={{ marginTop: 14, color: '#fff' }}>Marcus Chen</h3>
            <div className="ee-small" style={{ color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>
              Member since Sep 2024 · Renews Sep 2026
            </div>
            <div
              style={{
                marginTop: 16,
                padding: 14,
                background: 'rgba(255,255,255,0.05)',
                borderRadius: 6,
                fontFamily: 'var(--ee-mono)',
                fontSize: 11,
                letterSpacing: '0.14em',
                color: 'var(--ee-gold)',
              }}
            >
              EE-FIELD-0847-XK29
            </div>
          </div>
        </div>
      </section>

      <EEFooter />
    </div>
  );
}
