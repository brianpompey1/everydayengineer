'use client';

import { useState } from 'react';
import Link from 'next/link';
import EENav from '../components/EENav';
import EEFooter from '../components/EEFooter';
import EEPhoto from '../components/EEPhoto';

const TIERS = [
  {
    name: 'Observer',
    sub: 'Free',
    price: '$0',
    cycle: '— always',
    cta: 'Create account',
    highlight: false,
    features: [
      ['Field Journal · digital edition', true],
      ['Public events (3 / quarter)', true],
      ['Newsletter dispatch', true],
      ['Member directory', false],
      ['Private channels', false],
      ['Society Hoops & retreats', false],
      ['Mentorship match', false],
      ['Member-only drops', false],
    ],
  },
  {
    name: 'Field',
    sub: 'Premium',
    price: '$28',
    cycle: '/ month, billed annually',
    cta: 'Apply for the Field',
    highlight: true,
    features: [
      ['Field Journal · print + digital', true],
      ['Public events (unlimited)', true],
      ['Newsletter dispatch', true],
      ['Member directory & DMs', true],
      ['Private channels (all)', true],
      ['Society Hoops & retreats', true],
      ['Mentorship match', true],
      ['Member-only drops', true],
    ],
  },
];

const BENEFITS = [
  { icon: '⊙', t: 'Member Directory', b: 'Search & message 1,247 vetted engineers across 14 cities. Filter by stack, specialty, or city.' },
  { icon: '◻', t: 'Events & RSVPs', b: 'Weekly Society Hoops, monthly DUMBO labs, quarterly retreats. RSVPs members-only.' },
  { icon: '◈', t: 'Deep-Tech Workshops', b: 'Monthly 3-hour labs led by Field members on systems, ML, fintech, and infra. Recordings included.' },
  { icon: '♡', t: 'Wellness Retreats', b: 'Twice-yearly weekends in the Catskills. Sleep, sauna, hike, and dialogue. Members get first refusal.' },
  { icon: '◫', t: 'Private Channels', b: 'Curated rooms by city, stack, and stage. No noise, no firehose, no recruiters.' },
  { icon: '▣', t: 'Field Journal', b: 'Quarterly print magazine + digital archive. Free shipping for Field members.' },
  { icon: '◁', t: 'Member-Only Drops', b: 'First access to all gear, plus member-exclusive seasonal pieces. Free domestic shipping.' },
  { icon: '◯', t: 'Mentorship Match', b: 'Twice-a-year matching to senior or junior members based on goals. Quarterly check-ins included.' },
];

const FAQ = [
  ['Is membership really by application?', 'Yes. Field membership is reviewed quarterly. We look for engineers serious about depth, community, and contribution. Observer accounts open immediately.'],
  ['Where are members located?', 'Brooklyn is home. We have active chapters in NYC, Atlanta, SF, LA, Chicago, Toronto, London, Lisbon, Lagos, Nairobi, Berlin, Mexico City, Paris, and Singapore.'],
  ['Do I need to be in a specific role?', 'No, but you should be hands-on. Senior IC, EM, founder, researcher — all welcome. We are not a recruiter network.'],
  ['What happens after I apply?', "You'll hear back within 14 days. Approved applicants get a welcome packet, an intro call with a Field steward, and a first-month invitation to a city event."],
  ['Can I pause or cancel?', 'Yes. Cancel anytime. Pausing is available for up to 6 months while keeping your directory profile.'],
];

function FAQItem({ q, a, num }: { q: string; a: string; num: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{ borderTop: '1px solid var(--ee-ink)', paddingTop: 20, cursor: 'pointer' }}
      onClick={() => setOpen(!open)}
    >
      <span className="ee-mono" style={{ color: 'var(--ee-gold-deep)' }}>Q · {num}</span>
      <h3
        style={{
          fontFamily: 'var(--ee-display)',
          fontStyle: 'italic',
          fontWeight: 400,
          fontSize: 28,
          margin: '8px 0 0',
          letterSpacing: '-0.01em',
        }}
      >
        {q}
      </h3>
      {open && (
        <p className="ee-body" style={{ fontSize: 15, marginTop: 12 }}>
          {a}
        </p>
      )}
    </div>
  );
}

export default function MembershipPage() {
  return (
    <div style={{ background: 'var(--ee-paper)' }}>
      <EENav />

      {/* Editorial masthead */}
      <section style={{ padding: '64px 56px 80px', borderBottom: '1px solid var(--ee-ink)' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: 'var(--ee-mono)',
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--ee-ink-3)',
            marginBottom: 48,
          }}
        >
          <span>Membership · A Field Manual</span>
          <span>Two tiers · One door</span>
        </div>
        <h1
          style={{
            fontFamily: 'var(--ee-display)',
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: 200,
            letterSpacing: '-0.03em',
            lineHeight: 0.88,
            margin: 0,
          }}
        >
          What's<br />inside.
        </h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, marginTop: 48 }}>
          <p className="ee-body" style={{ fontSize: 20, lineHeight: 1.55 }}>
            A practical guide to the rooms, rituals, and resources of Emerging Estates membership. Read it like a manual. Apply when ready.
          </p>
          <div style={{ alignSelf: 'flex-end', textAlign: 'right' }}>
            <Link href="/signup" className="ee-btn ee-btn-dark">
              Create your account →
            </Link>
          </div>
        </div>
      </section>

      {/* Tiers — editorial split */}
      <section style={{ borderBottom: '1px solid var(--ee-ink)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          {TIERS.map((t, i) => (
            <div
              key={t.name}
              style={{
                padding: '80px 56px',
                background: t.highlight ? 'var(--ee-navy-900)' : 'var(--ee-paper)',
                color: t.highlight ? '#fff' : 'var(--ee-ink)',
                borderRight: i === 0 ? '1px solid var(--ee-ink)' : 'none',
                position: 'relative',
                minHeight: 560,
              }}
            >
              {t.highlight && (
                <div
                  style={{
                    position: 'absolute',
                    top: 80,
                    right: 56,
                    background: 'var(--ee-gold)',
                    color: 'var(--ee-navy-900)',
                    padding: '4px 12px',
                    borderRadius: 4,
                    fontFamily: 'var(--ee-mono)',
                    fontSize: 10,
                    letterSpacing: '0.16em',
                  }}
                >
                  RECOMMENDED
                </div>
              )}
              <div
                className="ee-mono"
                style={{ color: t.highlight ? 'var(--ee-gold)' : 'var(--ee-gold-deep)' }}
              >
                TIER 0{i + 1} · {t.sub.toUpperCase()}
              </div>
              <h2
                style={{
                  fontFamily: 'var(--ee-display)',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  fontSize: 144,
                  lineHeight: 1,
                  margin: '24px 0 0',
                  color: t.highlight ? '#fff' : 'inherit',
                }}
              >
                {t.name}.
              </h2>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 8,
                  marginTop: 32,
                  fontFamily: 'var(--ee-display)',
                }}
              >
                <span style={{ fontSize: 80, fontStyle: 'italic' }}>{t.price}</span>
                <span
                  style={{
                    fontSize: 14,
                    fontFamily: 'var(--ee-mono)',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    opacity: 0.6,
                  }}
                >
                  {t.cycle}
                </span>
              </div>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: '40px 0 0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                {t.features.map(([f, on]) => (
                  <li
                    key={f as string}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      fontSize: 16,
                      opacity: on ? 1 : 0.35,
                      borderBottom: `1px solid ${t.highlight ? 'rgba(255,255,255,0.12)' : 'var(--ee-line)'}`,
                      paddingBottom: 12,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--ee-mono)',
                        fontSize: 11,
                        letterSpacing: '0.14em',
                        color: t.highlight ? 'var(--ee-gold)' : 'var(--ee-gold-deep)',
                        width: 24,
                      }}
                    >
                      {on ? '✓' : '—'}
                    </span>
                    {f as string}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className={`ee-btn ${t.highlight ? 'ee-btn-primary' : 'ee-btn-dark'}`}
                style={{ marginTop: 40, display: 'inline-flex' }}
              >
                {t.cta} →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits as numbered editorial entries */}
      <section style={{ padding: '120px 56px' }}>
        <div className="ee-mono" style={{ color: 'var(--ee-gold-deep)', marginBottom: 16 }}>
          § INVENTORY · EIGHT ENTRIES
        </div>
        <h2
          style={{
            fontFamily: 'var(--ee-display)',
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: 96,
            margin: 0,
            marginBottom: 56,
            letterSpacing: '-0.02em',
          }}
        >
          What you get,<br />plainly.
        </h2>
        <div style={{ borderTop: '1px solid var(--ee-ink)' }}>
          {BENEFITS.map((b, i) => (
            <div
              key={b.t}
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 60px 3fr 5fr 60px',
                gap: 32,
                padding: '32px 0',
                borderBottom: '1px solid var(--ee-line)',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--ee-display)',
                  fontStyle: 'italic',
                  fontSize: 48,
                  color: 'var(--ee-gold-deep)',
                }}
              >
                0{i + 1}.
              </span>
              <span style={{ fontSize: 24, color: 'var(--ee-ink-2)' }}>{b.icon}</span>
              <h3
                style={{
                  fontFamily: 'var(--ee-sans)',
                  fontWeight: 700,
                  fontSize: 24,
                  letterSpacing: '-0.01em',
                  margin: 0,
                }}
              >
                {b.t}
              </h3>
              <p className="ee-body" style={{ fontSize: 16 }}>{b.b}</p>
              <span style={{ color: 'var(--ee-ink-3)', fontSize: 20 }}>→</span>
            </div>
          ))}
        </div>
      </section>

      {/* Photo slab */}
      <section style={{ padding: '0 56px 120px' }}>
        <EEPhoto
          tone="court"
          label="SOCIETY HOOPS · WEDS · BROOKLYN"
          style={{ aspectRatio: '21/9', borderRadius: 8 }}
        />
      </section>

      {/* FAQ — manuscript style */}
      <section style={{ padding: '120px 56px', background: 'var(--ee-paper-2)' }}>
        <div className="ee-mono" style={{ color: 'var(--ee-gold-deep)', marginBottom: 16 }}>
          § APPENDIX B · COMMON QUERIES
        </div>
        <h2
          style={{
            fontFamily: 'var(--ee-display)',
            fontStyle: 'italic',
            fontSize: 80,
            fontWeight: 400,
            margin: 0,
            marginBottom: 48,
          }}
        >
          You may be wondering.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 40 }}>
          {FAQ.map(([q, a], i) => (
            <FAQItem key={q} q={q} a={a} num={`0${i + 1}`} />
          ))}
        </div>
      </section>

      <EEFooter />
    </div>
  );
}
