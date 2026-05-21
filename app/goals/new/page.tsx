'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import EEMemberNav from '../../components/EEMemberNav';
import EEFooter from '../../components/EEFooter';

type GoalModel = 'okr' | 'identity' | 'project';

const MODELS: { id: GoalModel; question: string; label: string; desc: string; color: string; bg: string }[] = [
  {
    id: 'okr',
    question: 'I want to hit specific, measurable outcomes',
    label: 'OKR',
    desc: 'Define an objective and 1–3 key results with a measurable target. Best for work goals, fitness milestones, or anything you can quantify.',
    color: 'var(--ee-navy-900)',
    bg: 'var(--ee-lavender-2)',
  },
  {
    id: 'identity',
    question: 'I want to become the kind of person who…',
    label: 'Identity',
    desc: 'Start with a statement of who you are becoming. Daily practices flow naturally from identity. Best for character, mindset, or lifestyle shifts.',
    color: 'var(--ee-gold-deep)',
    bg: 'rgba(232,181,32,0.15)',
  },
  {
    id: 'project',
    question: 'I have a project with milestones and a deadline',
    label: 'Project',
    desc: 'Break a big goal into sequenced milestones with dates. Supporting habits keep the momentum going between milestones.',
    color: '#1F5C3F',
    bg: 'rgba(31,92,63,0.12)',
  },
];

const CADENCES = ['Daily', 'Weekly'];

export default function NewGoalPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [model, setModel] = useState<GoalModel | null>(null);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [habits, setHabits] = useState([{ name: '', cadence: 'Daily' }]);

  const addHabit = () => {
    if (habits.length < 3) setHabits([...habits, { name: '', cadence: 'Daily' }]);
  };

  const updateHabit = (i: number, field: 'name' | 'cadence', val: string) => {
    setHabits(habits.map((h, idx) => idx === i ? { ...h, [field]: val } : h));
  };

  const removeHabit = (i: number) => setHabits(habits.filter((_, idx) => idx !== i));

  const selectedModel = MODELS.find(m => m.id === model);

  return (
    <div style={{ background: 'var(--ee-paper)', minHeight: '100vh' }}>
      <EEMemberNav />

      <section className="ee-section" style={{ maxWidth: 720, margin: '0 auto' }}>
        {/* Breadcrumb */}
        <Link href="/goals" className="ee-mono" style={{ color: 'var(--ee-ink-3)' }}>← Goals</Link>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 32, marginBottom: 48 }}>
          {[1, 2, 3].map((s) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                width: 28, height: 28, borderRadius: '50%',
                background: step >= s ? 'var(--ee-navy-900)' : 'var(--ee-lavender-2)',
                color: step >= s ? '#fff' : 'var(--ee-ink-3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700,
              }}>
                {s}
              </span>
              <span className="ee-mono" style={{ color: step === s ? 'var(--ee-ink)' : 'var(--ee-ink-3)' }}>
                {s === 1 ? 'CHOOSE MODEL' : s === 2 ? 'DEFINE GOAL' : 'ADD HABITS'}
              </span>
              {s < 3 && <span style={{ width: 32, height: 1, background: 'var(--ee-line)' }} />}
            </div>
          ))}
        </div>

        {/* ── Step 1: Pick model ── */}
        {step === 1 && (
          <div>
            <div className="ee-eyebrow">STEP 1 OF 3</div>
            <h1 className="ee-h2" style={{ marginTop: 12 }}>What kind of goal is this?</h1>
            <p className="ee-body" style={{ marginTop: 12, marginBottom: 40 }}>
              Pick the frame that fits. You can always change it later — the model affects how you track progress, not what the goal is.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {MODELS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setModel(m.id)}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 20, padding: 24,
                    background: model === m.id ? 'var(--ee-navy-900)' : 'var(--ee-paper)',
                    border: `2px solid ${model === m.id ? 'var(--ee-navy-900)' : 'var(--ee-line)'}`,
                    borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                    transition: 'all 150ms ease',
                  }}
                >
                  <span className="ee-tag" style={{ background: model === m.id ? 'rgba(255,255,255,0.15)' : m.bg, color: model === m.id ? '#fff' : m.color, flexShrink: 0, marginTop: 2 }}>
                    {m.label.toUpperCase()}
                  </span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: model === m.id ? '#fff' : 'var(--ee-ink)' }}>
                      {m.question}
                    </div>
                    <p style={{ marginTop: 6, fontSize: 14, lineHeight: 1.5, color: model === m.id ? 'rgba(255,255,255,0.7)' : 'var(--ee-ink-2)' }}>
                      {m.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 32 }}>
              <button
                className="ee-btn ee-btn-dark"
                disabled={!model}
                onClick={() => setStep(2)}
                style={{ opacity: model ? 1 : 0.4 }}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Define goal ── */}
        {step === 2 && selectedModel && (
          <div>
            <div className="ee-eyebrow">STEP 2 OF 3 · {selectedModel.label.toUpperCase()} GOAL</div>
            <h1 className="ee-h2" style={{ marginTop: 12 }}>
              {model === 'identity' ? 'Complete the sentence.' : 'Name your goal.'}
            </h1>
            <p className="ee-body" style={{ marginTop: 12, marginBottom: 40 }}>
              {model === 'identity'
                ? 'Start with "I am…" — the kind of person you\'re becoming. Be specific enough that you\'d recognize that person.'
                : model === 'okr'
                ? 'One clear objective. You\'ll define the measurable key results after.'
                : 'Name the project. Set a deadline. Milestones come after.'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label className="ee-label">
                  {model === 'identity' ? 'Identity statement' : 'Goal title'}
                </label>
                <input
                  className="ee-input"
                  placeholder={
                    model === 'identity' ? 'I am an engineer who reads deeply.'
                    : model === 'okr' ? 'Ship reliability v2 to GA'
                    : 'Run the Brooklyn Half Marathon'
                  }
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ fontSize: 17 }}
                />
              </div>

              <div>
                <label className="ee-label">Why this goal?</label>
                <textarea
                  className="ee-input"
                  rows={3}
                  placeholder="What's the real reason behind this goal? Be honest with yourself."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  style={{ resize: 'vertical' }}
                />
              </div>

              {model !== 'identity' && (
                <div>
                  <label className="ee-label">Target date</label>
                  <input
                    className="ee-input"
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                  />
                </div>
              )}

              <div style={{ padding: 20, background: 'var(--ee-lavender)', borderRadius: 8 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                  />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>Make this goal public to your circle</div>
                    <div className="ee-small" style={{ marginTop: 2 }}>Members you follow can see your progress and habit streaks.</div>
                  </div>
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
              <button className="ee-btn ee-btn-ghost" onClick={() => setStep(1)}>← Back</button>
              <button
                className="ee-btn ee-btn-dark"
                disabled={!title.trim()}
                onClick={() => setStep(3)}
                style={{ opacity: title.trim() ? 1 : 0.4 }}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Add habits ── */}
        {step === 3 && (
          <div>
            <div className="ee-eyebrow">STEP 3 OF 3</div>
            <h1 className="ee-h2" style={{ marginTop: 12 }}>Add 1–3 supporting habits.</h1>
            <p className="ee-body" style={{ marginTop: 12, marginBottom: 40 }}>
              Habits are the daily or weekly actions that move you toward the goal. Keep them specific and actionable — something you can do in 30 minutes or less.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              {habits.map((h, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 120px auto', gap: 12, alignItems: 'flex-end' }}>
                  <div>
                    <label className="ee-label">Habit {i + 1}</label>
                    <input
                      className="ee-input"
                      placeholder={i === 0 ? 'Read · 30 minutes' : i === 1 ? 'Write a 3-sentence reflection' : 'Morning walk · 20 min'}
                      value={h.name}
                      onChange={(e) => updateHabit(i, 'name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="ee-label">Cadence</label>
                    <select
                      className="ee-input"
                      value={h.cadence}
                      onChange={(e) => updateHabit(i, 'cadence', e.target.value)}
                    >
                      {CADENCES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  {habits.length > 1 && (
                    <button onClick={() => removeHabit(i)} style={{ background: 'none', border: 'none', color: 'var(--ee-ink-3)', cursor: 'pointer', padding: '14px 0', fontSize: 18 }}>×</button>
                  )}
                </div>
              ))}
            </div>

            {habits.length < 3 && (
              <button onClick={addHabit} className="ee-btn ee-btn-ghost" style={{ fontSize: 13 }}>
                + Add another habit
              </button>
            )}

            <div style={{ marginTop: 40, padding: 24, background: 'var(--ee-lavender)', borderRadius: 10 }}>
              <div className="ee-mono" style={{ color: 'var(--ee-gold-deep)' }}>READY TO START</div>
              <h3 style={{ marginTop: 10, fontWeight: 700, fontSize: 18 }}>{title || 'Your goal'}</h3>
              {selectedModel && (
                <span className="ee-tag" style={{ background: selectedModel.bg, color: selectedModel.color, marginTop: 10, display: 'inline-block' }}>
                  {selectedModel.label.toUpperCase()}
                </span>
              )}
              <p className="ee-small" style={{ marginTop: 10 }}>
                {habits.filter(h => h.name).length} habit{habits.filter(h => h.name).length !== 1 ? 's' : ''} · {isPublic ? 'Public to circle' : 'Private'}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
              <button className="ee-btn ee-btn-ghost" onClick={() => setStep(2)}>← Back</button>
              <button
                className="ee-btn ee-btn-primary"
                onClick={() => router.push('/goals')}
              >
                Create goal →
              </button>
            </div>
          </div>
        )}
      </section>

      <EEFooter />
    </div>
  );
}
