'use client';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import EEMemberNav from '../components/EEMemberNav';
import EEFooter from '../components/EEFooter';
import EEPhoto from '../components/EEPhoto';
import EEStreak from '../components/EEStreak';

const EXT = 'M7 17L17 7M9 7h8v8';
const LINK = 'M10 14a5 5 0 0 1 0-7l3-3a5 5 0 0 1 7 7l-1.5 1.5M14 10a5 5 0 0 1 0 7l-3 3a5 5 0 0 1-7-7l1.5-1.5';

function Icon({ d, size = 14 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const ME = {
  name: 'Marcus Chen',
  role: 'Senior Platform Eng',
  company: 'Datadog',
  city: 'Brooklyn, NY',
  member: '0847',
  since: 'Mar 2025',
  specialty: 'Distributed systems',
  bio: 'Building reliability tooling at Datadog. Born in Brooklyn to a family that taught me to ship and to listen. Off the clock: hoops, Haitian cooking, generative photography, and trying to run a half-marathon before I turn 35.',
  interests: ['Photography', 'Hoops', 'Cooking', 'Long-form writing', 'Generative art'],
  mentorship: true,
  links: { linkedin: 'in/marcuschen', github: '@mchen', personal: 'mc.studio' },
};

const MODEL_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  okr:      { label: 'OKR',      color: 'var(--ee-navy-900)',  bg: 'var(--ee-lavender-2)' },
  identity: { label: 'Identity', color: 'var(--ee-gold-deep)', bg: 'rgba(232,181,32,0.15)' },
  project:  { label: 'Project',  color: '#1F5C3F',             bg: 'rgba(31,92,63,0.12)' },
};

function ModelBadge({ model }: { model: string }) {
  const m = MODEL_BADGE[model];
  return <span className="ee-tag" style={{ background: m.bg, color: m.color, fontSize: 10, padding: '4px 10px' }}>{m.label.toUpperCase()}</span>;
}

function WeekDots({ days }: { days: number[] }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {days.map((d, i) => (
        <span key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: d ? 'var(--ee-gold)' : 'var(--ee-line)' }} />
      ))}
    </div>
  );
}

const PUBLIC_GOALS = [
  { id: 'read-deeply', model: 'identity', title: 'I am an engineer who reads deeply', target: 'Ongoing', progress: 0.77, habits: [{ id: 'r1', streak: 23, days: [1,1,1,1,1,1,1] }, { id: 'r2', streak: 12, days: [1,1,1,1,1,1,0] }] },
  { id: 'half-marathon', model: 'project', title: 'Run a half marathon by Oct 12', target: 'Oct 12, 2026', progress: 0.38, habits: [{ id: 'm1', streak: 8, days: [1,0,1,0,1,0,1] }, { id: 'm2', streak: 6, days: [0,1,0,0,0,1,0] }] },
];

const PUBLIC_HABITS = [
  { id: 'read-30', name: 'Read · 30 minutes', streak: 23, days: [1,1,1,1,1,1,1] },
  { id: 'reflect', name: 'Write a 3-sentence reflection', streak: 12, days: [1,1,1,1,1,1,0] },
  { id: 'run-4x', name: 'Run · 4x/week', streak: 8, days: [1,0,1,0,1,0,1] },
  { id: 'strength', name: 'Strength · 2x/week', streak: 6, days: [0,1,0,0,0,1,0] },
];

const RECENT_EVENTS = [
  { t: 'Society Hoops · W12', tone: 'court' as const, d: 'APR 22' },
  { t: 'Deep-Tech Lab · DBs', tone: 'dark' as const, d: 'APR 17' },
  { t: 'Brunch · Bed-Stuy', tone: 'warm' as const, d: 'APR 04' },
  { t: 'Catskills Retreat', tone: 'paper' as const, d: 'MAR 21' },
];

const STATS = [
  ['14', 'Events attended'],
  ['4', 'Active goals'],
  ['23', 'Best streak (days)'],
  ['28', 'Connections'],
  ["Feb '27", 'Renews · Free'],
];

export default function ProfilePage() {
  const { user } = useUser();
  const displayName = user?.fullName ?? ME.name;
  const avatarUrl   = user?.imageUrl ?? null;

  return (
    <div style={{ background: 'var(--ee-paper)', minHeight: '100vh' }}>
      <EEMemberNav />

      {/* Banner */}
      <section style={{ position: 'relative', height: 240, overflow: 'hidden', background: 'var(--ee-lavender)' }}>
        <EEPhoto tone="court" label="" style={{ position: 'absolute', inset: 0, borderRadius: 0, opacity: 0.55 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 0%, var(--ee-paper) 100%)' }} />
      </section>

      {/* Profile header */}
      <section style={{ padding: '0 56px', marginTop: -100, position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 32, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt={displayName} style={{ width: 168, height: 168, borderRadius: '50%', border: '6px solid var(--ee-paper)', objectFit: 'cover', flexShrink: 0 }} />
          ) : (
            <EEPhoto tone="warm" label="" style={{ width: 168, height: 168, borderRadius: '50%', border: '6px solid var(--ee-paper)', flexShrink: 0 }} />
          )}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span className="ee-mono" style={{ color: 'var(--ee-gold-deep)' }}>
                MEMBER · No. {ME.member} · Since {ME.since.toUpperCase()}
              </span>
              {ME.mentorship && <span className="ee-tag ee-tag-gold">Open to mentor</span>}
            </div>
            <h1 className="ee-h1" style={{ marginTop: 8, fontSize: 56 }}>{displayName}</h1>
            <div className="ee-body" style={{ marginTop: 6, fontSize: 16 }}>
              {ME.role} · {ME.company} · <span style={{ color: 'var(--ee-ink-3)' }}>{ME.city}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
            <button className="ee-btn ee-btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon d={LINK} /> Share
            </button>
            <button className="ee-btn ee-btn-dark">Edit profile</button>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section style={{ padding: '40px 56px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', borderTop: '1px solid var(--ee-line)', borderBottom: '1px solid var(--ee-line)' }}>
          {STATS.map(([n, l], i) => (
            <div key={l} style={{ padding: '24px 20px', borderRight: i < 4 ? '1px solid var(--ee-line)' : 'none' }}>
              <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>{n}</div>
              <div className="ee-mono" style={{ marginTop: 10 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 2-col body */}
      <section style={{ padding: '48px 56px 96px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 48 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
          {/* Bio */}
          <div>
            <div className="ee-eyebrow">ABOUT</div>
            <p className="ee-body" style={{ marginTop: 14, fontSize: 17, lineHeight: 1.6, color: 'var(--ee-ink)' }}>{ME.bio}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 20 }}>
              <span className="ee-tag" style={{ background: 'var(--ee-navy-900)', color: '#fff' }}>{ME.specialty}</span>
              {ME.interests.map(i => <span key={i} className="ee-tag">{i}</span>)}
            </div>
          </div>

          {/* Active goals */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
              <div>
                <div className="ee-eyebrow">ACTIVE GOALS · {PUBLIC_GOALS.length} PUBLIC</div>
                <h2 className="ee-h3" style={{ marginTop: 12, fontSize: 26 }}>What I'm working on.</h2>
              </div>
              <Link href="/goals" className="ee-btn-link">All goals →</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {PUBLIC_GOALS.map((g) => (
                <Link key={g.id} href={`/goals/${g.id}`} style={{ padding: 20, background: 'var(--ee-paper)', border: '1px solid var(--ee-line)', borderRadius: 10, display: 'block' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <ModelBadge model={g.model} />
                    <span className="ee-mono" style={{ color: 'var(--ee-ink-3)' }}>{g.target.toUpperCase()}</span>
                  </div>
                  <h4 style={{ marginTop: 12, fontSize: 16, fontWeight: 700, lineHeight: 1.3 }}>{g.title}</h4>
                  <div style={{ marginTop: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontFamily: 'var(--ee-mono)', color: 'var(--ee-ink-3)', marginBottom: 6 }}>
                      <span>PROGRESS</span><span>{Math.round(g.progress * 100)}%</span>
                    </div>
                    <div style={{ height: 4, background: 'var(--ee-lavender-2)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: `${g.progress * 100}%`, height: '100%', background: 'var(--ee-gold)' }} />
                    </div>
                  </div>
                  <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
                    {g.habits.map((h) => <EEStreak key={h.id} count={h.streak} size={28} max={30} />)}
                    <span className="ee-small" style={{ marginLeft: 'auto', alignSelf: 'center' }}>{g.habits.length} habits</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Public habit streaks */}
          <div>
            <div className="ee-eyebrow">CURRENT STREAKS · PUBLIC</div>
            <h2 className="ee-h3" style={{ marginTop: 12, fontSize: 26, marginBottom: 20 }}>What I'm building.</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {PUBLIC_HABITS.map((h) => (
                <div key={h.id} style={{ padding: 18, background: 'var(--ee-lavender)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 14 }}>
                  <EEStreak count={h.streak} size={48} max={30} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{h.name}</div>
                    <div className="ee-small" style={{ marginTop: 4 }}>Last 7 days</div>
                    <div style={{ marginTop: 6 }}><WeekDots days={h.days} /></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent events */}
          <div>
            <div className="ee-eyebrow">RECENT EVENTS · 14 ATTENDED</div>
            <h2 className="ee-h3" style={{ marginTop: 12, fontSize: 26, marginBottom: 20 }}>Where I've been.</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {RECENT_EVENTS.map((e) => (
                <div key={e.t}>
                  <EEPhoto tone={e.tone} label="" style={{ aspectRatio: '4/3', borderRadius: 6 }} />
                  <div style={{ marginTop: 10 }}>
                    <div className="ee-mono" style={{ color: 'var(--ee-gold-deep)' }}>{e.d}</div>
                    <div style={{ fontWeight: 600, fontSize: 13, marginTop: 4 }}>{e.t}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right rail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Visibility */}
          <div className="ee-card" style={{ padding: 24 }}>
            <div className="ee-mono" style={{ color: 'var(--ee-gold-deep)' }}>VISIBILITY</div>
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[['Profile basics', 'Public to members'], ['Goals', '2 of 4 public'], ['Habit streaks', 'Public for shared goals'], ['Events attended', 'Members only']].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
                  <span>{k}</span>
                  <span className="ee-small" style={{ fontSize: 11 }}>{v}</span>
                </div>
              ))}
            </div>
            <button className="ee-btn-link" style={{ display: 'inline-block', marginTop: 18, fontSize: 10 }}>Privacy settings →</button>
          </div>

          {/* Links */}
          <div className="ee-card" style={{ padding: 24 }}>
            <div className="ee-mono" style={{ color: 'var(--ee-gold-deep)' }}>ELSEWHERE</div>
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[['LinkedIn', ME.links.linkedin], ['GitHub', ME.links.github], ['Personal', ME.links.personal]].map(([label, val]) => (
                <a key={label} href="#" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'var(--ee-lavender)', borderRadius: 6, fontSize: 14 }}>
                  <span><strong>{label}</strong> · {val}</span>
                  <Icon d={EXT} />
                </a>
              ))}
            </div>
          </div>

          {/* Member card */}
          <div style={{ background: 'var(--ee-navy-900)', color: '#fff', borderRadius: 10, padding: 24 }}>
            <div className="ee-mono" style={{ color: 'var(--ee-gold)' }}>EE MEMBER · {ME.member}</div>
            <h3 style={{ marginTop: 14, color: '#fff', fontWeight: 700, fontSize: 18 }}>{displayName}</h3>
            <div className="ee-small" style={{ color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>Free member · Since {ME.since}</div>
            <div style={{ marginTop: 18, padding: 14, background: 'rgba(255,255,255,0.05)', borderRadius: 6, fontFamily: 'var(--ee-mono)', fontSize: 11, letterSpacing: '0.14em', color: 'var(--ee-gold)' }}>
              EE-FREE-0847-XK29
            </div>
          </div>
        </div>
      </section>

      <EEFooter />
    </div>
  );
}
