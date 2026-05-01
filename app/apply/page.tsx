'use client';

import { useState } from 'react';
import Link from 'next/link';
import EELogo from '../components/EELogo';
import EEPhoto from '../components/EEPhoto';

export default function ApplyPage() {
  const [tier, setTier] = useState<'observer' | 'field'>('field');

  return (
    <div
      style={{
        background: 'var(--ee-navy-950)',
        color: 'var(--ee-paper)',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100vh',
      }}
    >
      <EEPhoto
        tone="court"
        style={{ position: 'absolute', inset: 0, borderRadius: 0, opacity: 0.18 }}
      />

      {/* Top strip */}
      <div
        style={{
          position: 'relative',
          padding: '32px 56px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          fontFamily: 'var(--ee-mono)',
          fontSize: 11,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.5)',
        }}
      >
        <div style={{ color: '#fff' }}>
          <EELogo />
        </div>
        <span>Vol. 03 · Issue 04</span>
        <span>Application · Members Only</span>
      </div>

      <div
        style={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: '5fr 4fr',
          minHeight: 'calc(100vh - 80px)',
        }}
      >
        {/* Left — manifesto */}
        <div
          style={{
            padding: '80px 56px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div className="ee-mono" style={{ color: 'var(--ee-gold)' }}>§ APPLICATION</div>
            <h1
              style={{
                fontFamily: 'var(--ee-display)',
                fontStyle: 'italic',
                fontWeight: 400,
                fontSize: 152,
                lineHeight: 0.88,
                letterSpacing: '-0.025em',
                margin: '24px 0 0',
                color: '#fff',
              }}
            >
              Enter<br />the field.
            </h1>
            <p
              style={{
                fontSize: 19,
                marginTop: 32,
                maxWidth: 520,
                color: 'rgba(255,255,255,0.75)',
                lineHeight: 1.55,
              }}
            >
              A curated collective of engineers serious about depth, community, and the lives behind the work. Membership is by application. Read before you apply.
            </p>
          </div>

          <div
            style={{
              marginTop: 56,
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 0,
              borderTop: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            {[
              ['I.', 'Apply', 'Tell us about your work and what you bring.'],
              ['II.', 'Review', 'Field stewards review applications quarterly.'],
              ['III.', 'Onboard', 'Welcome packet, intro call, first event invite.'],
            ].map(([n, t, b]) => (
              <div key={n} style={{ padding: '24px 24px 0 0' }}>
                <span
                  style={{
                    fontFamily: 'var(--ee-display)',
                    fontStyle: 'italic',
                    fontSize: 40,
                    color: 'var(--ee-gold)',
                  }}
                >
                  {n}
                </span>
                <h4 className="ee-h4" style={{ color: '#fff', marginTop: 12, fontSize: 18 }}>
                  {t}
                </h4>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', marginTop: 6, lineHeight: 1.5 }}>
                  {b}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — form */}
        <div
          style={{
            background: 'var(--ee-paper)',
            color: 'var(--ee-ink)',
            padding: '80px 64px',
            position: 'relative',
          }}
        >
          <div className="ee-mono" style={{ color: 'var(--ee-gold-deep)' }}>FORM · 01 OF 01</div>
          <h2
            style={{
              fontFamily: 'var(--ee-display)',
              fontStyle: 'italic',
              fontSize: 56,
              fontWeight: 400,
              margin: '16px 0 32px',
              letterSpacing: '-0.02em',
            }}
          >
            Tell us about you.
          </h2>

          <form onSubmit={(e) => e.preventDefault()}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Name */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label className="ee-label">First name</label>
                  <input className="ee-input-underline" placeholder="Marcus" required />
                </div>
                <div>
                  <label className="ee-label">Last name</label>
                  <input className="ee-input-underline" placeholder="Chen" required />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="ee-label">Email</label>
                <input className="ee-input-underline" type="email" placeholder="you@domain.com" required />
              </div>

              {/* City */}
              <div>
                <label className="ee-label">City</label>
                <input className="ee-input-underline" placeholder="Brooklyn, NY" />
              </div>

              {/* What do you build */}
              <div>
                <label className="ee-label">What do you build?</label>
                <textarea
                  className="ee-input-underline"
                  placeholder="Distributed systems · ML infra · ..."
                  style={{ resize: 'vertical', minHeight: 80 }}
                />
              </div>

              {/* How did you hear */}
              <div>
                <label className="ee-label">How did you hear about us?</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
                  {['Friend', 'Newsletter', 'Twitter / X', 'Other'].map((opt) => (
                    <label
                      key={opt}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, cursor: 'pointer' }}
                    >
                      <input type="radio" name="source" value={opt} />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tier */}
              <div>
                <label className="ee-label">Tier</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
                  <button
                    type="button"
                    onClick={() => setTier('observer')}
                    style={{
                      padding: '12px 16px',
                      textAlign: 'center',
                      border: `1px solid ${tier === 'observer' ? 'var(--ee-ink)' : 'var(--ee-line)'}`,
                      background: tier === 'observer' ? 'var(--ee-paper)' : 'transparent',
                      borderRadius: 4,
                      cursor: 'pointer',
                      fontFamily: 'var(--ee-sans)',
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    Observer · Free
                  </button>
                  <button
                    type="button"
                    onClick={() => setTier('field')}
                    style={{
                      padding: '12px 16px',
                      textAlign: 'center',
                      background: tier === 'field' ? 'var(--ee-navy-900)' : 'transparent',
                      border: `1px solid ${tier === 'field' ? 'var(--ee-navy-900)' : 'var(--ee-line)'}`,
                      color: tier === 'field' ? '#fff' : 'var(--ee-ink)',
                      borderRadius: 4,
                      cursor: 'pointer',
                      fontFamily: 'var(--ee-sans)',
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    Field · $28/mo ★
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="ee-btn ee-btn-dark"
                style={{
                  marginTop: 16,
                  padding: '20px',
                  fontSize: 14,
                  fontFamily: 'var(--ee-mono)',
                  letterSpacing: '0.18em',
                  width: '100%',
                }}
              >
                SUBMIT APPLICATION →
              </button>
            </div>
          </form>

          <div
            style={{
              marginTop: 40,
              paddingTop: 24,
              borderTop: '1px solid var(--ee-line)',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Link href="/signin" className="ee-mono" style={{ color: 'var(--ee-ink-2)' }}>
              ← Already a member
            </Link>
            <span className="ee-mono" style={{ color: 'var(--ee-ink-3)' }}>Need help? →</span>
          </div>
        </div>
      </div>
    </div>
  );
}
