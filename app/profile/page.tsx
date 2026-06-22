import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import EEMemberNav from '../components/EEMemberNav';
import EEFooter from '../components/EEFooter';
import EEPhoto from '../components/EEPhoto';
import { getOrCreateMember, isProfileComplete } from '@/lib/members';

const EXT = 'M7 17L17 7M9 7h8v8';
const LINK = 'M10 14a5 5 0 0 1 0-7l3-3a5 5 0 0 1 7 7l-1.5 1.5M14 10a5 5 0 0 1 0 7l-3 3a5 5 0 0 1-7-7l1.5-1.5';

function Icon({ d, size = 14 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

function formatSince(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export default async function ProfilePage() {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect('/signin');

  const email = clerkUser.emailAddresses[0]?.emailAddress ?? '';
  const member = await getOrCreateMember({
    id: clerkUser.id,
    email,
    fullName: clerkUser.fullName,
    avatarUrl: clerkUser.imageUrl,
  });

  const displayName = member.full_name ?? clerkUser.fullName ?? 'New member';
  const avatarUrl = member.avatar_url ?? clerkUser.imageUrl ?? null;
  const complete = isProfileComplete(member);

  const links = [
    member.linkedin_url ? ['LinkedIn', member.linkedin_url] : null,
    member.instagram_url ? ['Instagram', member.instagram_url] : null,
    member.twitter_url ? ['Twitter', member.twitter_url] : null,
  ].filter((x): x is [string, string] => x !== null);

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
                MEMBER · SINCE {formatSince(member.joined_at).toUpperCase()}
              </span>
            </div>
            <h1 className="ee-h1" style={{ marginTop: 8, fontSize: 56 }}>{displayName}</h1>
            <div className="ee-body" style={{ marginTop: 6, fontSize: 16 }}>
              {member.discipline ?? 'No discipline set'}{member.company ? ` · ${member.company}` : ''}
              {member.location && <span style={{ color: 'var(--ee-ink-3)' }}> · {member.location}</span>}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
            <button className="ee-btn ee-btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon d={LINK} /> Share
            </button>
            <button className="ee-btn ee-btn-dark" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
              Edit profile (soon)
            </button>
          </div>
        </div>
      </section>

      {/* 2-col body */}
      <section style={{ padding: '48px 56px 96px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 48 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
          {/* Bio */}
          {complete ? (
            <div>
              <div className="ee-eyebrow">ABOUT</div>
              <p className="ee-body" style={{ marginTop: 14, fontSize: 17, lineHeight: 1.6, color: 'var(--ee-ink)' }}>
                {member.bio}
              </p>
              {member.discipline && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 20 }}>
                  <span className="ee-tag" style={{ background: 'var(--ee-navy-900)', color: '#fff' }}>{member.discipline}</span>
                </div>
              )}
            </div>
          ) : (
            <div style={{ padding: 32, background: 'var(--ee-lavender)', borderRadius: 10, border: '1px dashed var(--ee-line)' }}>
              <div className="ee-eyebrow">COMPLETE YOUR PROFILE</div>
              <h3 style={{ marginTop: 12, fontSize: 20, fontWeight: 700 }}>Tell the Field who you are.</h3>
              <p className="ee-body" style={{ marginTop: 8, fontSize: 15 }}>
                Add a bio and your discipline so other members know who you are. Profile editing is coming soon — for now, this is what your profile looks like to others.
              </p>
            </div>
          )}
        </div>

        {/* Right rail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Links */}
          <div className="ee-card" style={{ padding: 24 }}>
            <div className="ee-mono" style={{ color: 'var(--ee-gold-deep)' }}>ELSEWHERE</div>
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {links.length > 0 ? (
                links.map(([label, val]) => (
                  <a key={label} href={val} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'var(--ee-lavender)', borderRadius: 6, fontSize: 14 }}>
                    <span><strong>{label}</strong></span>
                    <Icon d={EXT} />
                  </a>
                ))
              ) : (
                <p className="ee-small">No links added yet.</p>
              )}
            </div>
          </div>

          {/* Member card */}
          <div style={{ background: 'var(--ee-navy-900)', color: '#fff', borderRadius: 10, padding: 24 }}>
            <div className="ee-mono" style={{ color: 'var(--ee-gold)' }}>EE MEMBER</div>
            <h3 style={{ marginTop: 14, color: '#fff', fontWeight: 700, fontSize: 18 }}>{displayName}</h3>
            <div className="ee-small" style={{ color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>
              Free member · Since {formatSince(member.joined_at)}
            </div>
          </div>
        </div>
      </section>

      <EEFooter />
    </div>
  );
}
