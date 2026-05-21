'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import EEMemberNav from '../components/EEMemberNav';
import EEFooter from '../components/EEFooter';
import EEPhoto from '../components/EEPhoto';
import EEStreak from '../components/EEStreak';

const CHECK = 'M5 12l5 5L20 7';
const PLUS = 'M12 5v14M5 12h14';
const CAL = 'M3 9h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM8 3v4M16 3v4';
const DOTS = 'M4 7h16M4 12h16M4 17h16';

function Icon({ d, size = 16 }: { d: string; size?: number }) {
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
  return (
    <span className="ee-tag" style={{ background: m.bg, color: m.color, fontSize: 10, padding: '4px 10px' }}>
      {m.label.toUpperCase()}
    </span>
  );
}

function WeekDots({ days }: { days: number[] }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {days.map((d, i) => (
        <span key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: d ? 'var(--ee-gold)' : 'var(--ee-line)' }} />
      ))}
    </div>
  );
}

const HABITS = [
  { id: 'code-review', name: 'Code review focus block · 1hr', goal: 'Ship reliability v2 to GA', model: 'okr', streak: 23, days: [1,1,1,1,1,1,1] },
  { id: 'read-30', name: 'Read · 30 minutes', goal: 'I am an engineer who reads deeply', model: 'identity', streak: 23, days: [1,1,1,1,1,1,1] },
  { id: 'reflect', name: 'Write a 3-sentence reflection', goal: 'I am an engineer who reads deeply', model: 'identity', streak: 12, days: [1,1,1,1,1,1,0] },
  { id: 'no-am-screen', name: 'No screens before 9am', goal: 'I am present', model: 'identity', streak: 14, days: [1,1,1,1,1,1,1] },
  { id: 'dinner-box', name: 'Phone in box at dinner', goal: 'I am present', model: 'identity', streak: 8, days: [1,1,0,1,1,1,1] },
];

const CIRCLE = [
  { name: 'Amara Okonkwo', habit: 'Read · 30 min', streak: 42, tone: 'warm' as const },
  { name: 'Jules Renaud', habit: 'Run · 4x/week', streak: 14, tone: 'paper' as const },
  { name: 'Nadia Petrova', habit: 'Write daily', streak: 9, tone: 'cool' as const },
];

export default function TodayPage() {
  const { user } = useUser();
  const firstName = user?.firstName ?? 'there';
  const [checked, setChecked] = useState<Set<string>>(new Set(['code-review', 'read-30']));

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const done = checked.size;
  const total = HABITS.length;

  return (
    <div style={{ background: 'var(--ee-paper)', minHeight: '100vh' }}>
      <EEMemberNav />

      {/* Header */}
      <section className="ee-section" style={{ paddingBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div className="ee-mono" style={{ color: 'var(--ee-gold-deep)' }}>WEDNESDAY · MAY 21, 2026 · 8:42 AM</div>
            <h1 className="ee-h2" style={{ marginTop: 12 }}>Good morning, {firstName}.</h1>
            <p className="ee-body" style={{ marginTop: 8, fontSize: 17 }}>
              <strong style={{ color: 'var(--ee-ink)' }}>{done} of {total}</strong> habits done.{' '}
              <strong style={{ color: 'var(--ee-ink)' }}>1 event</strong> on your calendar.{' '}
              Best streak this week: <strong style={{ color: 'var(--ee-gold-deep)' }}>23 days</strong>.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button className="ee-btn ee-btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon d={CAL} /> Yesterday
            </button>
            <button className="ee-btn ee-btn-dark" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon d={PLUS} /> Add habit
            </button>
          </div>
        </div>
      </section>

      {/* Progress bar */}
      <section style={{ padding: '0 56px 32px' }}>
        <div className="ee-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div className="ee-mono" style={{ color: 'var(--ee-ink-3)' }}>TODAY'S PROGRESS</div>
              <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', marginTop: 4 }}>
                {done} / {total}{' '}
                <span style={{ color: 'var(--ee-ink-3)', fontSize: 18, fontWeight: 400 }}>habits complete</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {HABITS.map((h) => (
                <span key={h.id} style={{ width: 48, height: 6, borderRadius: 3, background: checked.has(h.id) ? 'var(--ee-gold)' : 'var(--ee-lavender-2)' }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2-col body */}
      <section style={{ padding: '0 56px 96px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* Habits */}
        <div>
          <div className="ee-eyebrow">HABITS · DUE TODAY</div>
          <h2 className="ee-h3" style={{ marginTop: 12, marginBottom: 20, fontSize: 24 }}>Check in.</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {HABITS.map((h) => {
              const done = checked.has(h.id);
              return (
                <div
                  key={h.id}
                  onClick={() => toggle(h.id)}
                  className="ee-card"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '52px 1fr auto auto auto',
                    gap: 16,
                    padding: '18px 20px',
                    alignItems: 'center',
                    background: done ? 'var(--ee-lavender)' : 'var(--ee-paper)',
                    opacity: done ? 0.75 : 1,
                    cursor: 'pointer',
                    transition: 'opacity 150ms ease, background 150ms ease',
                  }}
                >
                  {/* Checkbox */}
                  <span style={{
                    width: 32, height: 32, borderRadius: '50%',
                    border: `2px solid ${done ? 'var(--ee-gold)' : 'var(--ee-line)'}`,
                    background: done ? 'var(--ee-gold)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: done ? 'var(--ee-navy-900)' : 'transparent',
                    flexShrink: 0,
                    transition: 'all 150ms ease',
                  }}>
                    <Icon d={CHECK} size={15} />
                  </span>

                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 15, textDecoration: done ? 'line-through' : 'none' }}>{h.name}</div>
                    <div className="ee-small" style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <ModelBadge model={h.model} />
                      <span>{h.goal}</span>
                    </div>
                  </div>

                  <div style={{ display: 'none', flexDirection: 'column', gap: 4 }} className="ee-habit-dots">
                    <div className="ee-mono" style={{ color: 'var(--ee-ink-3)', fontSize: 9 }}>LAST 7</div>
                    <WeekDots days={h.days} />
                  </div>

                  <EEStreak count={h.streak} size={44} max={30} />

                  <button
                    onClick={(e) => e.stopPropagation()}
                    style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--ee-lavender-2)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ee-ink-3)', cursor: 'pointer' }}
                  >
                    <Icon d={DOTS} size={13} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Evening reflection */}
          <div style={{ marginTop: 40, background: 'var(--ee-paper-2)', borderRadius: 10, padding: 28, border: '1px solid var(--ee-line-soft)' }}>
            <div className="ee-mono" style={{ color: 'var(--ee-gold-deep)' }}>EVENING REFLECTION · OPTIONAL</div>
            <h3 style={{ marginTop: 12, fontSize: 18, fontFamily: 'var(--ee-display)', fontStyle: 'italic', fontWeight: 400 }}>
              What worked today? What didn't?
            </h3>
            <textarea
              className="ee-input"
              placeholder="Three sentences max. Press enter to log."
              rows={3}
              style={{ marginTop: 14, background: 'var(--ee-paper)', resize: 'vertical', minHeight: 80 }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, flexWrap: 'wrap', gap: 10 }}>
              <span className="ee-small">Visible to you only · or share to your circle</span>
              <button className="ee-btn ee-btn-ghost" style={{ padding: '8px 16px', fontSize: 12 }}>Save reflection</button>
            </div>
          </div>
        </div>

        {/* Right rail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Today's event */}
          <div className="ee-card" style={{ padding: 24 }}>
            <div className="ee-mono" style={{ color: 'var(--ee-gold-deep)' }}>ON YOUR CALENDAR</div>
            <h3 style={{ marginTop: 12, fontSize: 16, fontWeight: 700 }}>This evening</h3>
            <div style={{ marginTop: 16, padding: 16, background: 'var(--ee-lavender)', borderRadius: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span className="ee-tag ee-tag-gold">7:30 PM</span>
                <span className="ee-mono" style={{ color: 'var(--ee-gold-deep)' }}>GOING ✓</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 15, marginTop: 12 }}>Society Hoops · Week 14</div>
              <div className="ee-small" style={{ marginTop: 4 }}>Brownsville Rec · 24 going</div>
              <Link href="/events/hoops-w14" className="ee-btn-link" style={{ display: 'inline-block', marginTop: 14, fontSize: 10 }}>
                Event details →
              </Link>
            </div>
          </div>

          {/* Circle activity */}
          <div className="ee-card" style={{ padding: 24 }}>
            <div className="ee-mono" style={{ color: 'var(--ee-gold-deep)' }}>FROM YOUR CIRCLE</div>
            <h3 style={{ marginTop: 12, fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Habits in motion</h3>
            {CIRCLE.map(({ name, habit, streak, tone }) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderTop: '1px solid var(--ee-line)' }}>
                <EEPhoto tone={tone} label="" style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{name}</div>
                  <div className="ee-small" style={{ fontSize: 11 }}>{habit}</div>
                </div>
                <span className="ee-mono" style={{ color: 'var(--ee-gold-deep)' }}>{streak}d</span>
              </div>
            ))}
            <button className="ee-btn-link" style={{ marginTop: 14, fontSize: 10 }}>Manage circle →</button>
          </div>

          {/* Quick log */}
          <div style={{ background: 'var(--ee-navy-900)', color: '#fff', borderRadius: 10, padding: 24 }}>
            <div className="ee-mono" style={{ color: 'var(--ee-gold)' }}>QUICK LOG</div>
            <h3 style={{ marginTop: 12, color: '#fff', fontWeight: 700, fontSize: 16 }}>Log something not on the list</h3>
            <p className="ee-small" style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>
              Read a paper, attended a meetup, slept 8 hours — log it without committing to a habit.
            </p>
            <button className="ee-btn ee-btn-primary" style={{ marginTop: 18, width: '100%' }}>+ Log moment</button>
          </div>
        </div>
      </section>

      <EEFooter />
    </div>
  );
}
