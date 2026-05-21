'use client';
import { useState } from 'react';
import Link from 'next/link';
import EEMemberNav from '../../components/EEMemberNav';
import EEFooter from '../../components/EEFooter';
import EEStreak from '../../components/EEStreak';

const CHECK = 'M5 12l5 5L20 7';
const DOTS = 'M4 7h16M4 12h16M4 17h16';

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

function ModelBadge({ model }: { model: string }) {
  const m = MODEL_BADGE[model];
  return <span className="ee-tag" style={{ background: m.bg, color: m.color, fontSize: 12, padding: '6px 12px' }}>{m.label.toUpperCase()}</span>;
}

function WeekDots({ days }: { days: number[] }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {days.map((d, i) => <span key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: d ? 'var(--ee-gold)' : 'var(--ee-line)' }} />)}
    </div>
  );
}

// Deterministic heatmap
function Heatmap({ weeks = 26 }: { weeks?: number }) {
  const cells: number[][] = [];
  for (let w = 0; w < weeks; w++) {
    const col: number[] = [];
    for (let d = 0; d < 7; d++) {
      const i = w * 7 + d;
      const seed = (i * 9301 + 49297) % 233280;
      const v = seed / 233280;
      const boost = (w / weeks) * 0.4;
      const level = (v + boost) > 0.95 ? 0 : (v + boost) > 0.6 ? 3 : (v + boost) > 0.4 ? 2 : (v + boost) > 0.25 ? 1 : 0;
      col.push(level);
    }
    cells.push(col);
  }
  return (
    <div style={{ display: 'flex', gap: 3, overflowX: 'auto' }}>
      {cells.map((col, w) => (
        <div key={w} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {col.map((level, d) => (
            <span key={d} style={{
              width: 11, height: 11, borderRadius: 2,
              background: level === 0 ? 'var(--ee-line-soft)' : level === 1 ? 'rgba(232,181,32,0.25)' : level === 2 ? 'rgba(232,181,32,0.55)' : 'var(--ee-gold)',
            }} />
          ))}
        </div>
      ))}
    </div>
  );
}

const GOALS: Record<string, {
  id: string; model: string; title: string; statement?: string; desc: string;
  target: string; progress: number; public: boolean;
  krs?: { t: string; pct: number; current: string; target: string }[];
  milestones?: { t: string; d: string; done: boolean; current?: boolean; progress?: number }[];
  habits: { id: string; name: string; streak: number; weekly?: boolean; days: number[] }[];
}> = {
  'reliability-v2': {
    id: 'reliability-v2', model: 'okr',
    title: 'Ship reliability v2 to GA at Datadog',
    desc: 'Ship the new reliability platform from internal beta to general availability. Reduce p99 latency, drive customer references, complete rollout.',
    target: 'Sep 30, 2026', progress: 0.42, public: false,
    krs: [
      { t: '50% rollout to enterprise customers', pct: 0.70, current: '35%', target: '50%' },
      { t: 'Reduce p99 latency by 30%', pct: 0.73, current: '22%', target: '30%' },
      { t: '10 customer references on record', pct: 0.60, current: '6', target: '10' },
    ],
    habits: [
      { id: 'h1', name: 'Code review focus block · 1hr', streak: 23, days: [1,1,1,1,1,1,1] },
      { id: 'h2', name: 'Friday retro write-up', streak: 5, weekly: true, days: [0,0,0,0,1,0,0] },
    ],
  },
  'read-deeply': {
    id: 'read-deeply', model: 'identity',
    title: 'I am an engineer who reads deeply',
    statement: 'I am an engineer who reads deeply.',
    desc: "I read deeply because the work I want to do requires depth I haven't built yet. Books, papers, and long-form writing — not just docs and tweets.",
    target: 'Ongoing', progress: 0.77, public: true,
    habits: [
      { id: 'h3', name: 'Read · 30 minutes', streak: 23, days: [1,1,1,1,1,1,1] },
      { id: 'h4', name: 'Write a 3-sentence reflection', streak: 12, days: [1,1,1,1,1,1,0] },
    ],
  },
  'half-marathon': {
    id: 'half-marathon', model: 'project',
    title: 'Run a half marathon by Oct 12',
    desc: 'Build up to a half-marathon in time for the Brooklyn Half qualifier. Currently running 5k comfortably; building base aerobic miles + strength.',
    target: 'Oct 12, 2026', progress: 0.38, public: true,
    milestones: [
      { t: 'Run a clean 5k', d: 'Jun 01', done: true },
      { t: 'Run a clean 10k', d: 'Aug 01', done: false, current: true, progress: 0.68 },
      { t: 'Half marathon · race day', d: 'Oct 12', done: false },
    ],
    habits: [
      { id: 'h5', name: 'Run · 4x/week', streak: 8, weekly: true, days: [1,0,1,0,1,0,1] },
      { id: 'h6', name: 'Strength · 2x/week', streak: 6, weekly: true, days: [0,1,0,0,0,1,0] },
    ],
  },
  'be-present': {
    id: 'be-present', model: 'identity',
    title: 'I am present',
    statement: 'I am present in the rooms I am in.',
    desc: "I want to be the kind of person who is fully where they are. Less compulsive phone, more eye contact.",
    target: 'Ongoing', progress: 0.55, public: false,
    habits: [
      { id: 'h7', name: 'No screens before 9am', streak: 14, days: [1,1,1,1,1,1,1] },
      { id: 'h8', name: 'Phone in box at dinner', streak: 8, days: [1,1,0,1,1,1,1] },
    ],
  },
};

const STATS_LABELS = ['Progress', 'Habits', 'Best streak', 'Started'];

export default function GoalDetailPage({ params }: { params: { id: string } }) {
  const g = GOALS[params.id] ?? GOALS['reliability-v2'];
  const [checkedHabits, setCheckedHabits] = useState<Set<string>>(new Set());

  const toggle = (id: string) => setCheckedHabits(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const stats = [
    `${Math.round(g.progress * 100)}%`,
    `${g.habits.length} active`,
    `${Math.max(...g.habits.map(h => h.streak))} days`,
    'Apr 03, 2026',
  ];

  return (
    <div style={{ background: 'var(--ee-paper)', minHeight: '100vh' }}>
      <EEMemberNav />

      {/* Breadcrumb */}
      <section style={{ padding: '32px 56px 0' }}>
        <Link href="/goals" className="ee-mono" style={{ color: 'var(--ee-ink-3)' }}>← Goals</Link>
      </section>

      {/* Header */}
      <section style={{ padding: '24px 56px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <ModelBadge model={g.model} />
              <span className="ee-mono" style={{ color: 'var(--ee-ink-3)' }}>TARGET · {g.target.toUpperCase()}</span>
              {g.public
                ? <span className="ee-tag" style={{ background: 'var(--ee-lavender-2)', fontSize: 10 }}>PUBLIC TO CIRCLE</span>
                : <span className="ee-tag" style={{ background: 'transparent', border: '1px solid var(--ee-line)', fontSize: 10 }}>PRIVATE</span>}
            </div>
            {g.model === 'identity' ? (
              <h1 style={{ fontFamily: 'var(--ee-display)', fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(40px, 6vw, 88px)', lineHeight: 1.05, letterSpacing: '-0.02em', margin: '20px 0 0' }}>
                {g.statement}
              </h1>
            ) : (
              <h1 className="ee-h1" style={{ marginTop: 20, fontSize: 'clamp(36px, 5vw, 64px)' }}>{g.title}</h1>
            )}
            <p className="ee-body" style={{ marginTop: 16, fontSize: 17, maxWidth: 720 }}>{g.desc}</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="ee-btn ee-btn-ghost"><Icon d={DOTS} /></button>
            <button className="ee-btn ee-btn-ghost">Edit goal</button>
          </div>
        </div>

        {/* Stats strip */}
        <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderTop: '1px solid var(--ee-line)', borderBottom: '1px solid var(--ee-line)' }}>
          {STATS_LABELS.map((l, i) => (
            <div key={l} style={{ padding: '24px 20px', borderRight: i < 3 ? '1px solid var(--ee-line)' : 'none' }}>
              <div className="ee-mono" style={{ color: 'var(--ee-ink-3)' }}>{l.toUpperCase()}</div>
              <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', marginTop: 8 }}>{stats[i]}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Body */}
      <section style={{ padding: '32px 56px 96px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 40 }}>
        {/* Main col */}
        <div>
          {/* OKR: Key Results */}
          {g.model === 'okr' && g.krs && (
            <>
              <div className="ee-eyebrow">KEY RESULTS · {g.krs.length}</div>
              <h2 className="ee-h3" style={{ marginTop: 12, marginBottom: 24, fontSize: 26 }}>Measurable outcomes.</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {g.krs.map((kr, i) => (
                  <div key={i} className="ee-card" style={{ padding: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                      <div>
                        <span className="ee-mono" style={{ color: 'var(--ee-gold-deep)' }}>KR · 0{i + 1}</span>
                        <h4 style={{ marginTop: 6, fontSize: 18, fontWeight: 700 }}>{kr.t}</h4>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em' }}>{kr.current}</div>
                        <div className="ee-mono" style={{ color: 'var(--ee-ink-3)' }}>OF {kr.target}</div>
                      </div>
                    </div>
                    <div style={{ marginTop: 18 }}>
                      <div style={{ height: 6, background: 'var(--ee-lavender-2)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${kr.pct * 100}%`, height: '100%', background: 'var(--ee-gold)' }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontFamily: 'var(--ee-mono)', color: 'var(--ee-ink-3)', marginTop: 6 }}>
                        <span>{Math.round(kr.pct * 100)}% of target</span>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontFamily: 'inherit', fontSize: 'inherit' }}>Log update →</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Identity: statement + daily practices */}
          {g.model === 'identity' && (
            <>
              <div className="ee-eyebrow">THE PRACTICE</div>
              <h2 className="ee-h3" style={{ marginTop: 12, marginBottom: 24, fontSize: 26 }}>How I become that.</h2>
              <div style={{ background: 'var(--ee-lavender)', padding: 32, borderRadius: 10, marginBottom: 32 }}>
                <div className="ee-mono" style={{ color: 'var(--ee-gold-deep)' }}>WHY THIS</div>
                <p style={{ fontFamily: 'var(--ee-display)', fontStyle: 'italic', fontWeight: 400, fontSize: 26, lineHeight: 1.35, marginTop: 14, color: 'var(--ee-ink)' }}>
                  "{g.desc}"
                </p>
              </div>
              <div className="ee-mono" style={{ color: 'var(--ee-gold-deep)', marginBottom: 12 }}>DAILY PRACTICES</div>
              {g.habits.map((h, i) => (
                <div key={h.id} onClick={() => toggle(h.id)} style={{ display: 'grid', gridTemplateColumns: '32px 1fr auto auto', gap: 18, padding: '20px 0', borderTop: i === 0 ? 'none' : '1px solid var(--ee-line)', alignItems: 'center', cursor: 'pointer' }}>
                  <span style={{ width: 28, height: 28, borderRadius: '50%', background: checkedHabits.has(h.id) ? 'var(--ee-gold)' : 'var(--ee-lavender-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ee-navy-900)' }}>
                    <Icon d={CHECK} size={13} />
                  </span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>{h.name}</div>
                    <div className="ee-small" style={{ marginTop: 4 }}>Daily · {g.public ? 'Public to circle' : 'Private'}</div>
                  </div>
                  <WeekDots days={h.days} />
                  <EEStreak count={h.streak} size={48} max={30} />
                </div>
              ))}
            </>
          )}

          {/* Project: milestones timeline */}
          {g.model === 'project' && g.milestones && (
            <>
              <div className="ee-eyebrow">MILESTONES · {g.milestones.length}</div>
              <h2 className="ee-h3" style={{ marginTop: 12, marginBottom: 24, fontSize: 26 }}>The route.</h2>
              <div style={{ position: 'relative', paddingLeft: 36 }}>
                <div style={{ position: 'absolute', left: 15, top: 16, bottom: 16, width: 2, background: 'var(--ee-line)' }} />
                {g.milestones.map((m, i) => (
                  <div key={i} style={{ position: 'relative', paddingBottom: 28 }}>
                    <span style={{
                      position: 'absolute', left: -36, top: 8,
                      width: 32, height: 32, borderRadius: '50%',
                      background: m.done ? 'var(--ee-gold)' : 'var(--ee-paper)',
                      border: m.current ? '2px solid var(--ee-gold)' : m.done ? 'none' : '2px solid var(--ee-line)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: m.done ? 'var(--ee-navy-900)' : 'var(--ee-ink-3)',
                    }}>
                      {m.done ? <Icon d={CHECK} size={13} /> : <span style={{ width: 8, height: 8, borderRadius: '50%', background: m.current ? 'var(--ee-gold)' : 'transparent' }} />}
                    </span>
                    <div className="ee-card" style={{ padding: 20, background: m.current ? 'var(--ee-lavender)' : 'var(--ee-paper)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                        <div>
                          <span className="ee-mono" style={{ color: m.done ? 'var(--ee-gold-deep)' : 'var(--ee-ink-3)' }}>
                            {m.done ? '✓ COMPLETED' : m.current ? 'IN PROGRESS' : 'UPCOMING'} · {m.d.toUpperCase()}
                          </span>
                          <h4 style={{ marginTop: 8, fontSize: 17, fontWeight: 700 }}>{m.t}</h4>
                        </div>
                        {m.current && <span className="ee-tag ee-tag-gold">CURRENT</span>}
                      </div>
                      {m.current && m.progress !== undefined && (
                        <div style={{ marginTop: 14 }}>
                          <div style={{ height: 5, background: 'var(--ee-paper-2)', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ width: `${m.progress * 100}%`, height: '100%', background: 'var(--ee-gold)' }} />
                          </div>
                          <div className="ee-mono" style={{ color: 'var(--ee-ink-3)', marginTop: 6 }}>{Math.round(m.progress * 100)}% · 6.8K / 10K</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Supporting habits — for OKR + Project */}
          {g.model !== 'identity' && (
            <div style={{ marginTop: 48 }}>
              <div className="ee-eyebrow">SUPPORTING HABITS</div>
              <h2 className="ee-h3" style={{ marginTop: 12, marginBottom: 20, fontSize: 24 }}>
                What I do every {g.model === 'okr' ? 'day' : 'week'}.
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {g.habits.map((h) => (
                  <div key={h.id} onClick={() => toggle(h.id)} className="ee-card" style={{ display: 'grid', gridTemplateColumns: '48px 1fr 120px auto', gap: 16, padding: '18px 20px', alignItems: 'center', cursor: 'pointer' }}>
                    <span style={{ width: 32, height: 32, borderRadius: '50%', border: `2px solid ${checkedHabits.has(h.id) ? 'var(--ee-gold)' : 'var(--ee-line)'}`, background: checkedHabits.has(h.id) ? 'var(--ee-gold)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ee-navy-900)' }}>
                      {checkedHabits.has(h.id) && <Icon d={CHECK} size={13} />}
                    </span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>{h.name}</div>
                      <div className="ee-small" style={{ marginTop: 3 }}>{h.weekly ? 'Weekly' : 'Daily'} · Last 7: <span style={{ color: 'var(--ee-ink-2)' }}>{h.days.filter(d => d).length} done</span></div>
                    </div>
                    <WeekDots days={h.days} />
                    <EEStreak count={h.streak} size={44} max={30} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right rail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Heatmap */}
          <div className="ee-card" style={{ padding: 20 }}>
            <div className="ee-mono" style={{ color: 'var(--ee-gold-deep)' }}>LAST 26 WEEKS</div>
            <h4 style={{ marginTop: 10, fontSize: 16, fontWeight: 700 }}>Consistency map</h4>
            <div style={{ marginTop: 16 }}><Heatmap weeks={26} /></div>
          </div>

          {/* Privacy */}
          <div className="ee-card" style={{ padding: 20 }}>
            <div className="ee-mono" style={{ color: 'var(--ee-gold-deep)' }}>VISIBILITY</div>
            <h4 style={{ marginTop: 10, fontSize: 16, fontWeight: 700 }}>Who can see this?</h4>
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                ['Goal title', g.public ? 'Circle' : 'Only me'],
                ['Progress', g.public ? 'Circle' : 'Only me'],
                ['Habits', g.public ? 'Circle' : 'Only me'],
                ['Reflections', 'Only me'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span>{k}</span>
                  <span className="ee-small">{v}</span>
                </div>
              ))}
            </div>
            <button className="ee-btn ee-btn-ghost" style={{ width: '100%', marginTop: 16, fontSize: 12 }}>
              {g.public ? 'Make private' : 'Share with circle'}
            </button>
          </div>

          {/* Analytics link */}
          <Link href="/analytics" className="ee-card" style={{ padding: 20, display: 'block', background: 'var(--ee-navy-900)', color: '#fff', borderRadius: 10 }}>
            <div className="ee-mono" style={{ color: 'var(--ee-gold)' }}>DEEP DIVE</div>
            <h4 style={{ marginTop: 10, fontSize: 16, fontWeight: 700, color: '#fff' }}>View habit analytics</h4>
            <p className="ee-small" style={{ color: 'rgba(255,255,255,0.6)', marginTop: 6 }}>26-week heatmap, streaks, and per-habit breakdown.</p>
          </Link>
        </div>
      </section>

      <EEFooter />
    </div>
  );
}
