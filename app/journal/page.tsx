'use client';

import { useState } from 'react';
import Link from 'next/link';
import EENav from '../components/EENav';
import EEFooter from '../components/EEFooter';
import EEPhoto from '../components/EEPhoto';

type Tone = 'cool' | 'warm' | 'dark' | 'paper' | 'gold' | 'court';

const ALBUMS = [
  { id: 'hoops', title: 'Society Hoops', meta: 'Wed nights · Brownsville Rec', count: 142, year: '2024–2026', tone: 'court' as Tone },
  { id: 'catskills', title: 'Catskills Retreat', meta: 'Phoenicia, NY · Twice yearly', count: 86, year: '2025', tone: 'paper' as Tone },
  { id: 'dumbo', title: 'Deep-Tech Lab', meta: 'EE Loft · DUMBO', count: 64, year: '2026', tone: 'dark' as Tone },
  { id: 'brunch', title: 'Bed-Stuy Brunches', meta: 'Monthly · Bed-Stuy', count: 38, year: '2025–2026', tone: 'warm' as Tone },
  { id: 'lagos', title: 'Lagos Chapter', meta: 'Yaba, Lagos', count: 24, year: '2026', tone: 'gold' as Tone },
  { id: 'lisbon', title: 'Lisbon Field Trip', meta: 'Across Portugal', count: 52, year: '2025', tone: 'cool' as Tone },
];

const TILES = [
  { c: 7, r: 2, tone: 'court' as Tone, l: '01 · HOOPS · OPENING TIP' },
  { c: 5, r: 2, tone: 'paper' as Tone, l: '02 · CATSKILLS · DAWN HIKE' },
  { c: 4, r: 2, tone: 'dark' as Tone, l: '03 · DUMBO LAB · WHITEBOARD' },
  { c: 5, r: 1, tone: 'warm' as Tone, l: '04 · BRUNCH · BED-STUY' },
  { c: 3, r: 1, tone: 'gold' as Tone, l: '05 · GEAR · FIELD CAP' },
  { c: 6, r: 2, tone: 'cool' as Tone, l: '06 · LISBON · ROOFTOP' },
  { c: 6, r: 2, tone: 'court' as Tone, l: '07 · HOOPS · TIME OUT' },
  { c: 4, r: 1, tone: 'paper' as Tone, l: '08 · CATSKILLS · SAUNA' },
  { c: 4, r: 1, tone: 'warm' as Tone, l: '09 · BRUNCH · COFFEE' },
  { c: 4, r: 2, tone: 'dark' as Tone, l: '10 · LAGOS · MEETUP' },
  { c: 8, r: 2, tone: 'court' as Tone, l: '11 · HOOPS · POSTGAME' },
  { c: 4, r: 1, tone: 'gold' as Tone, l: '12 · JOURNAL · ISSUE 12' },
  { c: 6, r: 1, tone: 'paper' as Tone, l: '13 · CATSKILLS · DIALOGUE' },
  { c: 6, r: 2, tone: 'warm' as Tone, l: '14 · STUDIO · GUITRY' },
];

export default function JournalPage() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', ...ALBUMS.map((a) => a.title)];

  return (
    <div style={{ background: 'var(--ee-paper)' }}>
      <EENav />

      {/* Cover masthead */}
      <section style={{ padding: '40px 56px 0' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--ee-ink)',
            paddingBottom: 14,
            fontFamily: 'var(--ee-mono)',
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}
        >
          <span>Field Journal · No. 12</span>
          <span>The Photo Issue · Spring 2026</span>
          <span>Photography by Guitry Germain</span>
        </div>
      </section>

      {/* Hero */}
      <section style={{ padding: '64px 56px 80px' }}>
        <div className="ee-mono" style={{ color: 'var(--ee-gold-deep)', marginBottom: 16 }}>
          § THE FIELD · A VISUAL ARCHIVE
        </div>
        <h1
          style={{
            fontFamily: 'var(--ee-display)',
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: 200,
            lineHeight: 0.88,
            letterSpacing: '-0.03em',
            margin: 0,
          }}
        >
          Moments<br />from the field.
        </h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 56, marginTop: 56 }}>
          <p className="ee-body" style={{ fontSize: 19, lineHeight: 1.55 }}>
            Frames captured between sets, hikes, brunches, and labs — across Brooklyn, the Catskills, Lagos, Lisbon. Documenting the lives that surround the work.
          </p>
          <div style={{ alignSelf: 'flex-end', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {ALBUMS.map((a) => (
              <div
                key={a.id}
                className="ee-mono"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid var(--ee-line)',
                  paddingBottom: 6,
                  color: 'var(--ee-ink-2)',
                }}
              >
                <span>{a.title}</span>
                <span>{a.count} · {a.year}</span>
              </div>
            ))}
          </div>
          <div style={{ alignSelf: 'flex-end', textAlign: 'right' }}>
            <div className="ee-mono" style={{ color: 'var(--ee-ink-3)' }}>
              406 PHOTOGRAPHS · 14 EVENTS · 6 CITIES
            </div>
            <span className="ee-btn-link" style={{ marginTop: 12, display: 'inline-block' }}>
              Submit to journal →
            </span>
          </div>
        </div>
      </section>

      {/* Filter strip — sticky below nav */}
      <section
        style={{
          padding: '20px 56px',
          borderTop: '1px solid var(--ee-ink)',
          borderBottom: '1px solid var(--ee-ink)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 80,
          background: 'var(--ee-paper)',
          zIndex: 40,
        }}
      >
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="ee-mono"
              style={{
                padding: '8px 14px',
                background: activeFilter === f ? 'var(--ee-ink)' : 'transparent',
                color: activeFilter === f ? 'var(--ee-paper)' : 'var(--ee-ink-2)',
                cursor: 'pointer',
                border: 'none',
                transition: 'background 120ms ease, color 120ms ease',
              }}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="ee-mono" style={{ color: 'var(--ee-ink-3)' }}>
          VIEW · MASONRY · CHRONOLOGICAL
        </div>
      </section>

      {/* Masonry grid */}
      <section style={{ padding: '32px 56px 80px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gridAutoRows: '180px',
            gap: 12,
          }}
        >
          {TILES.map((t, i) => (
            <div
              key={i}
              style={{
                gridColumn: `span ${t.c}`,
                gridRow: `span ${t.r}`,
                position: 'relative',
                cursor: 'zoom-in',
              }}
            >
              <EEPhoto
                tone={t.tone}
                label={t.l}
                style={{ position: 'absolute', inset: 0, borderRadius: 0 }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Album sections */}
      <section style={{ padding: '80px 56px', background: 'var(--ee-paper-2)' }}>
        <div className="ee-mono" style={{ color: 'var(--ee-gold-deep)', marginBottom: 16 }}>
          § BY EVENT
        </div>
        <h2
          style={{
            fontFamily: 'var(--ee-display)',
            fontStyle: 'italic',
            fontSize: 88,
            fontWeight: 400,
            margin: 0,
            marginBottom: 56,
            letterSpacing: '-0.02em',
          }}
        >
          The albums.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
          {ALBUMS.map((a, i) => (
            <div key={a.id} style={{ cursor: 'pointer' }}>
              <EEPhoto
                tone={a.tone}
                label={a.title.toUpperCase()}
                style={{ aspectRatio: '4/5' }}
                className="ee-product-img"
              />
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '40px 1fr 60px',
                  gap: 16,
                  paddingTop: 16,
                  borderTop: '1px solid var(--ee-ink)',
                  marginTop: 16,
                  alignItems: 'flex-start',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--ee-display)',
                    fontStyle: 'italic',
                    fontSize: 28,
                    color: 'var(--ee-gold-deep)',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}.
                </span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 20 }}>{a.title}</div>
                  <div className="ee-small" style={{ marginTop: 4 }}>{a.meta}</div>
                  <div className="ee-mono" style={{ marginTop: 6, color: 'var(--ee-ink-3)' }}>
                    {a.count} PHOTOS · {a.year}
                  </div>
                </div>
                <span className="ee-mono" style={{ color: 'var(--ee-gold-deep)', textAlign: 'right' }}>
                  OPEN →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section
        style={{
          padding: '120px 56px',
          textAlign: 'center',
          borderTop: '1px solid var(--ee-line)',
        }}
      >
        <div className="ee-mono" style={{ color: 'var(--ee-gold-deep)' }}>§ FIN · SUBSCRIBE</div>
        <h2
          style={{
            fontFamily: 'var(--ee-display)',
            fontStyle: 'italic',
            fontSize: 80,
            fontWeight: 400,
            margin: '24px auto 16px',
            maxWidth: 900,
            lineHeight: 1,
            letterSpacing: '-0.02em',
          }}
        >
          Get the print edition.
        </h2>
        <p className="ee-body" style={{ maxWidth: 540, margin: '0 auto 32px', fontSize: 17 }}>
          The Field Journal ships quarterly — 96 pages, matte stock, free for Field members.
        </p>
        <Link href="/signup" className="ee-btn ee-btn-dark">
          Create your account →
        </Link>
      </section>

      <EEFooter />
    </div>
  );
}
