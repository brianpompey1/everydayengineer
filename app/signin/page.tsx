'use client';
import { useState } from 'react';
import { useSignIn } from '@clerk/nextjs/legacy';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import EELogo from '../components/EELogo';
import EEPhoto from '../components/EEPhoto';

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true);
    setError('');
    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.push('/today');
      }
    } catch (err: unknown) {
      const clerkErr = err as { errors?: { message: string }[] };
      setError(clerkErr.errors?.[0]?.message ?? 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: 'var(--ee-navy-950)',
      color: 'var(--ee-paper)',
      position: 'relative',
      overflow: 'hidden',
      minHeight: '100vh',
    }}>
      <EEPhoto tone="court" style={{ position: 'absolute', inset: 0, borderRadius: 0, opacity: 0.18 }} />

      {/* Top strip */}
      <div style={{
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
      }}>
        <Link href="/" style={{ color: '#fff' }}>
          <EELogo />
        </Link>
        <span>Vol. 03 · Issue 04</span>
        <span>Resume Session</span>
      </div>

      <div style={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: '5fr 4fr',
        minHeight: 'calc(100vh - 80px)',
      }}>
        {/* Left — manifesto */}
        <div style={{ padding: '80px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="ee-mono" style={{ color: 'var(--ee-gold)' }}>§ AUTHENTICATE</div>
            <h1 style={{
              fontFamily: 'var(--ee-display)',
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: 'clamp(72px, 10vw, 152px)',
              lineHeight: 0.88,
              letterSpacing: '-0.025em',
              margin: '24px 0 0',
              color: '#fff',
            }}>
              Welcome<br />back.
            </h1>
            <p style={{ fontSize: 19, marginTop: 32, maxWidth: 520, color: 'rgba(255,255,255,0.75)', lineHeight: 1.55 }}>
              Resume where you left off. Events, dispatch, directory, and your kit.
            </p>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 32 }}>
            <p style={{ fontFamily: 'var(--ee-display)', fontStyle: 'italic', fontSize: 28, lineHeight: 1.3, color: 'rgba(255,255,255,0.85)', margin: 0 }}>
              "Joining the Field has been the single best professional decision I've made in five years."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 20 }}>
              <EEPhoto tone="warm" style={{ width: 40, height: 40, borderRadius: '50%' }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>Amara Okonkwo</div>
                <div className="ee-mono" style={{ color: 'rgba(255,255,255,0.5)' }}>STAFF ML ENG · ANTHROPIC</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginTop: 40, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.12)' }}>
              {[['1,247', 'members'], ['14', 'cities'], ['142', 'events / year']].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: 'var(--ee-display)', fontStyle: 'italic', fontSize: 40, color: 'var(--ee-gold)' }}>{n}</div>
                  <div className="ee-mono" style={{ color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>{l.toUpperCase()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — form */}
        <div style={{ background: 'var(--ee-paper)', color: 'var(--ee-ink)', padding: '80px 64px', position: 'relative' }}>
          <div className="ee-mono" style={{ color: 'var(--ee-gold-deep)' }}>CREDENTIALS</div>
          <h2 style={{ fontFamily: 'var(--ee-display)', fontStyle: 'italic', fontSize: 56, fontWeight: 400, margin: '16px 0 32px', letterSpacing: '-0.02em' }}>
            Sign in.
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label className="ee-label">Email</label>
                <input className="ee-input-underline" type="email" placeholder="you@domain.com" required value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="ee-label">Password</label>
                  <Link href="#" className="ee-mono" style={{ color: 'var(--ee-ink-3)', fontSize: 10 }}>Forgot?</Link>
                </div>
                <input className="ee-input-underline" type="password" placeholder="••••••••" required value={password} onChange={e => setPassword(e.target.value)} />
              </div>

              {error && (
                <div style={{ color: '#C0392B', fontSize: 13, padding: '10px 14px', background: 'rgba(192,57,43,0.08)', borderRadius: 4 }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="ee-btn ee-btn-dark"
                disabled={loading}
                style={{ marginTop: 16, padding: '20px', fontSize: 14, fontFamily: 'var(--ee-mono)', letterSpacing: '0.18em', width: '100%', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'SIGNING IN…' : 'SIGN IN →'}
              </button>
            </div>
          </form>

          <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid var(--ee-line)', display: 'flex', justifyContent: 'space-between' }}>
            <Link href="/signup" className="ee-mono" style={{ color: 'var(--ee-ink-2)' }}>← Create account</Link>
            <span className="ee-mono" style={{ color: 'var(--ee-ink-3)' }}>Need help? →</span>
          </div>
        </div>
      </div>
    </div>
  );
}
