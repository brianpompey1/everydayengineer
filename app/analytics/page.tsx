'use client';
import Link from 'next/link';
import EEMemberNav from '../components/EEMemberNav';
import EEFooter from '../components/EEFooter';
import EEStreak from '../components/EEStreak';

function WeekDots({ days }: { days: number[] }) {
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {days.map((d, i) => <span key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: d ? 'var(--ee-gold)' : 'var(--ee-line)' }} />)}
    </div>
  );
}

// 26-week GitHub-style heatmap
function Heatmap({ weeks = 26, highlightColor = 'var(--ee-gold)' }: { weeks?: number; highlightColor?: string }) {
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
    <div style={{ display: 'flex', gap: 3 }}>
      {cells.map((col, w) => (
        <div key={w} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {col.map((level, d) => (
            <span key={d} style={{
              width: 12, height: 12, borderRadius: 2,
              background:
                level === 0 ? 'var(--ee-line-soft)' :
                level === 1 ? 'rgba(232,181,32,0.2)' :
                level === 2 ? 'rgba(232,181,32,0.5)' :
                highlightColor,
            }} />
          ))}
        </div>
      ))}
    </div>
  );
}

// Mini bar chart for individual habit
function MiniBar({ weeks = 12, color = 'var(--ee-gold)' }: { weeks?: number; color?: string }) {
  const bars = Array.from({ length: weeks }, (_, i) => {
    const seed = (i * 6271 + 3499) % 7;
    return seed;
  });
  const maxVal = Math.max(...bars);
  return (
    <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', height: 40 }}>
      {bars.map((v, i) => (
        <div key={i} style={{ flex: 1, background: 'var(--ee-lavender-2)', borderRadius: 2, overflow: 'hidden', height: '100%', display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ width: '100%', height: `${(v / maxVal) * 100}%`, background: color, borderRadius: 2, minHeight: 2 }} />
        </div>
      ))}
    </div>
  );
}

const AGGREGATE_STATS = [
  { value: '26', label: 'Weeks tracked' },
  { value: '847', label: 'Total check-ins' },
  { value: '73%', label: 'Completion rate' },
  { value: '23', label: 'Best streak (days)' },
  { value: '5', label: 'Active habits' },
];

const HABITS = [
  { id: 'read-30', name: 'Read · 30 minutes', goal: 'I am an engineer who reads deeply', model: 'identity', streak: 23, rate: 0.96, days: [1,1,1,1,1,1,1] },
  { id: 'no-screen', name: 'No screens before 9am', goal: 'I am present', model: 'identity', streak: 14, rate: 0.88, days: [1,1,1,1,1,1,1] },
  { id: 'reflect', name: 'Write a 3-sentence reflection', goal: 'I am an engineer who reads deeply', model: 'identity', streak: 12, rate: 0.82, days: [1,1,1,1,1,1,0] },
  { id: 'dinner-box', name: 'Phone in box at dinner', goal: 'I am present', model: 'identity', streak: 8, rate: 0.78, days: [1,1,0,1,1,1,1] },
  { id: 'code-review', name: 'Code review focus block · 1hr', goal: 'Ship reliability v2 to GA', model: 'okr', streak: 23, rate: 0.91, days: [1,1,1,1,1,1,1] },
];

const MODEL_BADGE: Record<string, { color: string; bg: string }> = {
  okr:      { color: 'var(--ee-navy-900)',  bg: 'var(--ee-lavender-2)' },
  identity: { color: 'var(--ee-gold-deep)', bg: 'rgba(232,181,32,0.15)' },
  project:  { color: '#1F5C3F',             bg: 'rgba(31,92,63,0.12)' },
};

const MONTHS = ['DEC', 'JAN', 'FEB', 'MAR', 'APR', 'MAY'];

export default function AnalyticsPage() {
  return (
    <div style={{ background: 'var(--ee-paper)', minHeight: '100vh' }}>
      <EEMemberNav />

      {/* Header */}
      <section className="ee-section" style={{ paddingBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div className="ee-eyebrow">HABIT ANALYTICS</div>
            <h1 className="ee-h2" style={{ marginTop: 12 }}>26 weeks of data.</h1>
            <p className="ee-body" style={{ marginTop: 8, maxWidth: 560 }}>
              Your consistency over time — across all goals and habits. The longer you go, the clearer the picture.
            </p>
          </div>
          <Link href="/goals" className="ee-btn ee-btn-ghost">← Goals</Link>
        </div>
      </section>

      {/* Aggregate stats */}
      <section style={{ padding: '0 56px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', borderTop: '1px solid var(--ee-line)', borderBottom: '1px solid var(--ee-line)' }}>
          {AGGREGATE_STATS.map(({ value, label }, i) => (
            <div key={label} style={{ padding: '24px 20px', borderRight: i < 4 ? '1px solid var(--ee-line)' : 'none' }}>
              <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</div>
              <div className="ee-mono" style={{ marginTop: 10 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 26-week heatmap */}
      <section style={{ padding: '0 56px 56px' }}>
        <div className="ee-card" style={{ padding: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div className="ee-eyebrow">ALL HABITS · COMBINED</div>
              <h2 style={{ marginTop: 8, fontSize: 22, fontWeight: 800 }}>Contribution map</h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="ee-small">Less</span>
              {[0,1,2,3].map(l => (
                <span key={l} style={{ width: 12, height: 12, borderRadius: 2, background: l === 0 ? 'var(--ee-line-soft)' : l === 1 ? 'rgba(232,181,32,0.2)' : l === 2 ? 'rgba(232,181,32,0.5)' : 'var(--ee-gold)' }} />
              ))}
              <span className="ee-small">More</span>
            </div>
          </div>

          {/* Month labels */}
          <div style={{ display: 'flex', gap: 0, marginBottom: 6, paddingLeft: 2 }}>
            {MONTHS.map((m, i) => (
              <div key={m} style={{ flex: 1, fontFamily: 'var(--ee-mono)', fontSize: 10, color: 'var(--ee-ink-3)', letterSpacing: '0.1em' }}>{m}</div>
            ))}
          </div>
          <div style={{ overflowX: 'auto' }}>
            <Heatmap weeks={26} />
          </div>
        </div>
      </section>

      {/* Per-habit breakdown */}
      <section style={{ padding: '0 56px 96px' }}>
        <div className="ee-eyebrow">PER-HABIT BREAKDOWN</div>
        <h2 style={{ marginTop: 12, marginBottom: 28, fontSize: 26, fontWeight: 800, letterSpacing: '-0.015em' }}>Each habit, in detail.</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {HABITS.map((h) => {
            const badge = MODEL_BADGE[h.model];
            return (
              <div key={h.id} className="ee-card" style={{ padding: 28 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px 120px 64px', gap: 32, alignItems: 'center' }}>
                  {/* Name + goal */}
                  <div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                      <span className="ee-tag" style={{ background: badge.bg, color: badge.color, fontSize: 10, padding: '3px 8px' }}>{h.model.toUpperCase()}</span>
                      <span className="ee-small" style={{ fontSize: 11 }}>{h.goal}</span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 17 }}>{h.name}</div>
                    <div style={{ marginTop: 12 }}>
                      <WeekDots days={h.days} />
                      <div className="ee-small" style={{ marginTop: 6 }}>Last 7 days</div>
                    </div>
                  </div>

                  {/* Mini bar chart */}
                  <div>
                    <div className="ee-mono" style={{ color: 'var(--ee-ink-3)', fontSize: 10, marginBottom: 8 }}>LAST 12 WEEKS</div>
                    <MiniBar weeks={12} />
                  </div>

                  {/* Completion rate */}
                  <div style={{ textAlign: 'center' }}>
                    <div className="ee-mono" style={{ color: 'var(--ee-ink-3)', fontSize: 10, marginBottom: 8 }}>COMPLETION</div>
                    <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', color: h.rate > 0.85 ? 'var(--ee-gold-deep)' : 'var(--ee-ink)' }}>
                      {Math.round(h.rate * 100)}%
                    </div>
                    <div style={{ height: 4, background: 'var(--ee-lavender-2)', borderRadius: 2, overflow: 'hidden', marginTop: 8 }}>
                      <div style={{ width: `${h.rate * 100}%`, height: '100%', background: 'var(--ee-gold)' }} />
                    </div>
                  </div>

                  {/* Streak ring */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <EEStreak count={h.streak} size={52} max={30} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <EEFooter />
    </div>
  );
}
