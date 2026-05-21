'use client';
import { useState } from 'react';
import Link from 'next/link';
import EEMemberNav from '../components/EEMemberNav';
import EEFooter from '../components/EEFooter';
import EEPhoto from '../components/EEPhoto';
import EEStreak from '../components/EEStreak';

const SPARK = 'M12 3v6M12 15v6M3 12h6M15 12h6M5.5 5.5l4 4M14.5 14.5l4 4M18.5 5.5l-4 4M9.5 14.5l-4 4';
const PLUS = 'M12 5v14M5 12h14';
const ARROW = 'M5 12h14M13 6l6 6-6 6';

function Icon({ d, size = 14 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const MODEL_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  okr:      { label: 'OKR',      color: 'var(--ee-navy-900)',  bg: 'var(--ee-lavender-2)' },
  identity: { label: 'Identity', color: 'var(--ee-gold-deep)', bg: 'rgba(232,181,32,0.15)' },
  project:  { label: 'Project',  color: '#1F5C3F',             bg: 'rgba(31,92,63,0.12)' },
};

function ModelBadge({ model, size = 'sm' }: { model: string; size?: 'sm' | 'lg' }) {
  const m = MODEL_BADGE[model];
  return (
    <span className="ee-tag" style={{ background: m.bg, color: m.color, fontSize: size === 'lg' ? 12 : 10, padding: size === 'lg' ? '6px 12px' : '4px 10px' }}>
      {m.label.toUpperCase()}
    </span>
  );
}

const GOALS = [
  {
    id: 'reliability-v2',
    model: 'okr' as const,
    title: 'Ship reliability v2 to GA at Datadog',
    desc: 'Ship the new reliability platform from internal beta to general availability. Reduce p99 latency, drive customer references, complete rollout.',
    target: 'Sep 30, 2026',
    progress: 0.42,
    tone: 'dark' as const,
    public: false,
    habits: [{ id: 'h1', streak: 23 }, { id: 'h2', streak: 5 }],
  },
  {
    id: 'read-deeply',
    model: 'identity' as const,
    title: 'I am an engineer who reads deeply',
    desc: "I read deeply because the work I want to do requires depth I haven't built yet.",
    target: 'Ongoing',
    progress: 0.77,
    tone: 'paper' as const,
    public: true,
    habits: [{ id: 'h3', streak: 23 }, { id: 'h4', streak: 12 }],
  },
  {
    id: 'half-marathon',
    model: 'project' as const,
    title: 'Run a half marathon by Oct 12',
    desc: 'Build up to a half-marathon in time for the Brooklyn Half qualifier. Currently running 5k comfortably.',
    target: 'Oct 12, 2026',
    progress: 0.38,
    tone: 'warm' as const,
    public: true,
    habits: [{ id: 'h5', streak: 8 }, { id: 'h6', streak: 6 }],
  },
  {
    id: 'be-present',
    model: 'identity' as const,
    title: 'I am present',
    desc: 'I want to be the kind of person who is fully where they are. Less compulsive phone, more eye contact.',
    target: 'Ongoing',
    progress: 0.55,
    tone: 'cool' as const,
    public: false,
    habits: [{ id: 'h7', streak: 14 }, { id: 'h8', streak: 8 }],
  },
];

const FILTERS = ['Active · 4', 'Archived · 2', 'All'];

export default function GoalsDashboardPage() {
  const [activeFilter, setActiveFilter] = useState(0);

  return (
    <div style={{ background: 'var(--ee-paper)', minHeight: '100vh' }}>
      <EEMemberNav />

      {/* Header */}
      <section className="ee-section" style={{ paddingBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div className="ee-eyebrow">GOALS · 4 ACTIVE</div>
            <h1 className="ee-h2" style={{ marginTop: 12 }}>The work I'm doing.</h1>
            <p className="ee-body" style={{ marginTop: 8, maxWidth: 580 }}>
              Pick a model per goal — OKRs for measurable outcomes, Identity for who you want to become, Project for things with deadlines. Habits hang off each one.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/analytics" className="ee-btn ee-btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon d={SPARK} /> Analytics
            </Link>
            <Link href="/goals/new" className="ee-btn ee-btn-dark" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon d={PLUS} /> New goal
            </Link>
          </div>
        </div>
      </section>

      {/* Filter strip */}
      <section style={{ padding: '16px 56px', borderTop: '1px solid var(--ee-line)', borderBottom: '1px solid var(--ee-line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {FILTERS.map((f, i) => (
            <button key={f} onClick={() => setActiveFilter(i)} className="ee-tag" style={{ background: activeFilter === i ? 'var(--ee-navy-900)' : 'transparent', color: activeFilter === i ? 'var(--ee-paper)' : 'var(--ee-ink-2)', border: activeFilter === i ? 'none' : '1px solid var(--ee-line)', padding: '8px 14px', cursor: 'pointer' }}>
              {f}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {Object.keys(MODEL_BADGE).map(m => <ModelBadge key={m} model={m} />)}
        </div>
      </section>

      {/* Goals grid */}
      <section className="ee-section">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
          {GOALS.map((g) => (
            <Link
              key={g.id}
              href={`/goals/${g.id}`}
              style={{
                background: 'var(--ee-paper)', border: '1px solid var(--ee-line)',
                borderRadius: 12, padding: 32, display: 'flex', flexDirection: 'column',
                gap: 16, minHeight: 300, position: 'relative', overflow: 'hidden',
              }}
              className="ee-card-hover"
            >
              {/* Tone wash */}
              <div style={{ position: 'absolute', top: 0, right: 0, width: 160, height: 160, opacity: 0.07, pointerEvents: 'none' }}>
                <EEPhoto tone={g.tone} label="" style={{ width: '100%', height: '100%', borderRadius: 0 }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <ModelBadge model={g.model} size="lg" />
                  {g.public
                    ? <span className="ee-tag" style={{ background: 'var(--ee-lavender-2)', fontSize: 10 }}>PUBLIC</span>
                    : <span className="ee-tag" style={{ background: 'transparent', border: '1px solid var(--ee-line)', fontSize: 10 }}>PRIVATE</span>}
                </div>
                <span className="ee-mono" style={{ color: 'var(--ee-ink-3)' }}>{g.target.toUpperCase()}</span>
              </div>

              <h3 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.2, position: 'relative' }}>{g.title}</h3>
              <p className="ee-body" style={{ fontSize: 14, flex: 1, position: 'relative' }}>{g.desc}</p>

              {/* Progress */}
              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontFamily: 'var(--ee-mono)', color: 'var(--ee-ink-3)', marginBottom: 6 }}>
                  <span>PROGRESS</span>
                  <span style={{ color: 'var(--ee-ink)' }}>{Math.round(g.progress * 100)}%</span>
                </div>
                <div style={{ height: 6, background: 'var(--ee-lavender-2)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${g.progress * 100}%`, height: '100%', background: 'var(--ee-gold)' }} />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 14, borderTop: '1px solid var(--ee-line)', position: 'relative' }}>
                <div style={{ display: 'flex', gap: 4 }}>
                  {g.habits.map((h) => <EEStreak key={h.id} count={h.streak} size={34} max={30} />)}
                </div>
                <div style={{ flex: 1, fontSize: 12, color: 'var(--ee-ink-3)' }}>
                  {g.habits.length} habits · best streak {Math.max(...g.habits.map(h => h.streak))} days
                </div>
                <Icon d={ARROW} size={16} />
              </div>
            </Link>
          ))}

          {/* New goal card */}
          <Link href="/goals/new" style={{ background: 'transparent', border: '1.5px dashed var(--ee-line)', borderRadius: 12, padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, color: 'var(--ee-ink-3)', transition: 'border-color 150ms ease' }}>
            <span style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--ee-lavender)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ee-ink-2)' }}>
              <Icon d={PLUS} size={20} />
            </span>
            <h3 style={{ marginTop: 16, color: 'var(--ee-ink)', fontWeight: 700, fontSize: 18 }}>Start a new goal</h3>
            <p className="ee-small" style={{ textAlign: 'center', marginTop: 8, maxWidth: 240 }}>
              Pick a model that fits — OKR, Identity, or Project. Add 1–3 habits.
            </p>
          </Link>
        </div>
      </section>

      <EEFooter />
    </div>
  );
}
