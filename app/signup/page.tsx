'use client';
import { useState } from 'react';
import { useSignUp } from '@clerk/nextjs/legacy';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import EELogo from '../components/EELogo';
import EEPhoto from '../components/EEPhoto';

const CHECK = 'M5 12l5 5L20 7';
function CheckIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d={CHECK} />
    </svg>
  );
}

const INCLUDED = [
  ['Member directory', '1,247 engineers across 14 cities. Search & message.'],
  ['Events & RSVPs', 'Society Hoops, deep-tech labs, brunches, retreats.'],
  ['Habit tracker', 'Set goals. Build daily habits. Optional accountability.'],
  ['Field Journal', 'Photography & writing from the community.'],
];

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  // 'form' | 'verify'
  const [step, setStep]         = useState<'form' | 'verify'>('form');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [code, setCode]           = useState('');
  const [agreed, setAgreed]       = useState(true);
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);

  // Step 1 — create account
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !agreed) return;
    setLoading(true);
    setError('');
    try {
      await signUp.create({ firstName, lastName, emailAddress: email, password });

      // Trigger email verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setStep('verify');
    } catch (err: unknown) {
      const clerkErr = err as { errors?: { message: string }[] };
      setError(clerkErr.errors?.[0]?.message ?? 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2 — verify email code
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true);
    setError('');
    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.push('/today');
      } else {
        setError('Verification incomplete. Please try again.');
      }
    } catch (err: unknown) {
      const clerkErr = err as { errors?: { message: string }[] };
      setError(clerkErr.errors?.[0]?.message ?? 'Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const rightPanel = (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <EEPhoto tone="court" label="" style={{ position: 'absolute', inset: 0, borderRadius: 0 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(10,19,37,0.45) 0%, rgba(10,19,37,0.88) 100%)' }} />
      <div style={{ position: 'relative', padding: '64px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '100%', color: '#fff' }}>
        <div>
          <div className="ee-mono" style={{ color: 'var(--ee-gold)' }}>WHAT'S INCLUDED · FREE FOREVER</div>
          <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
            {INCLUDED.map(([title, body]) => (
              <div key={title} style={{ display: 'grid', gridTemplateColumns: '32px 1fr', gap: 14 }}>
                <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--ee-gold)', color: 'var(--ee-navy-900)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CheckIcon />
                </span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, marginTop: 2 }}>{body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p style={{ fontFamily: 'var(--ee-display)', fontStyle: 'italic', fontSize: 36, lineHeight: 1.15, color: '#fff', maxWidth: 480, marginBottom: 24 }}>
            "Joining was the best decision I made this year — the directory alone is worth it."
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <EEPhoto tone="warm" label="" style={{ width: 44, height: 44, borderRadius: '50%' }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>Amara Okonkwo</div>
              <div className="ee-mono" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10 }}>STAFF ML ENG · ANTHROPIC</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ── Verify step ──
  if (step === 'verify') {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1.1fr', background: 'var(--ee-paper)' }}>
        <div style={{ padding: '48px 64px', display: 'flex', flexDirection: 'column' }}>
          <Link href="/"><EELogo /></Link>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 460 }}>
            <div className="ee-eyebrow">VERIFY YOUR EMAIL</div>
            <h1 className="ee-h2" style={{ marginTop: 14, fontSize: 44 }}>Check your inbox.</h1>
            <p className="ee-body" style={{ marginTop: 16 }}>
              We sent a 6-digit code to <strong>{email}</strong>. Enter it below to complete your account.
            </p>

            <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 32 }}>
              <div>
                <label className="ee-label">Verification code</label>
                <input
                  className="ee-input"
                  placeholder="123456"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  maxLength={6}
                  style={{ fontSize: 24, letterSpacing: '0.3em', textAlign: 'center' }}
                  required
                  autoFocus
                />
              </div>

              {error && (
                <div style={{ color: '#C0392B', fontSize: 13, padding: '10px 14px', background: 'rgba(192,57,43,0.08)', borderRadius: 4 }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="ee-btn ee-btn-dark"
                disabled={loading || code.length < 6}
                style={{ marginTop: 8, padding: '16px', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Verifying…' : 'Verify & enter →'}
              </button>
            </form>

            <p className="ee-small" style={{ marginTop: 24, textAlign: 'center' }}>
              Didn't get it?{' '}
              <button
                onClick={() => signUp?.prepareEmailAddressVerification({ strategy: 'email_code' })}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ee-ink)', borderBottom: '1px solid var(--ee-ink)', fontSize: 13, padding: 0 }}
              >
                Resend code
              </button>
              {' · '}
              <button onClick={() => setStep('form')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ee-ink-3)', fontSize: 13, padding: 0 }}>
                Back
              </button>
            </p>
          </div>

          <div className="ee-mono" style={{ color: 'var(--ee-ink-3)', display: 'flex', justifyContent: 'space-between' }}>
            <span>© 2026 Everyday Engineer</span>
            <span>New York, NY</span>
          </div>
        </div>
        {rightPanel}
      </div>
    );
  }

  // ── Sign-up form ──
  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1.1fr', background: 'var(--ee-paper)' }}>
      <div style={{ padding: '48px 64px', display: 'flex', flexDirection: 'column' }}>
        <Link href="/"><EELogo /></Link>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 460 }}>
          <div className="ee-eyebrow">CREATE YOUR ACCOUNT · FREE</div>
          <h1 className="ee-h2" style={{ marginTop: 14, fontSize: 52 }}>Join the collective.</h1>
          <p className="ee-body" style={{ marginTop: 16 }}>
            Free, always. Get access to the directory, events, and the habit tracker. Takes about a minute.
          </p>

          <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 32 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label className="ee-label">First name</label>
                <input className="ee-input" placeholder="Marcus" value={firstName} onChange={e => setFirstName(e.target.value)} required />
              </div>
              <div>
                <label className="ee-label">Last name</label>
                <input className="ee-input" placeholder="Chen" value={lastName} onChange={e => setLastName(e.target.value)} required />
              </div>
            </div>
            <div>
              <label className="ee-label">Email</label>
              <input className="ee-input" type="email" placeholder="you@domain.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="ee-label">Password</label>
              <input className="ee-input" type="password" placeholder="At least 8 characters" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>

            <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, color: 'var(--ee-ink-2)', marginTop: 4, cursor: 'pointer' }}>
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: 3 }} />
              <span>
                I agree to the{' '}
                <Link href="#" style={{ borderBottom: '1px solid var(--ee-ink)', color: 'inherit' }}>Code of Conduct</Link>
                {' '}and{' '}
                <Link href="#" style={{ borderBottom: '1px solid var(--ee-ink)', color: 'inherit' }}>Privacy Policy</Link>.
              </span>
            </label>

            {error && (
              <div style={{ color: '#C0392B', fontSize: 13, padding: '10px 14px', background: 'rgba(192,57,43,0.08)', borderRadius: 4 }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="ee-btn ee-btn-dark"
              disabled={loading || !agreed}
              style={{ marginTop: 8, padding: '16px', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Creating account…' : 'Create account →'}
            </button>
          </form>

          <p className="ee-small" style={{ marginTop: 24, textAlign: 'center' }}>
            Already a member?{' '}
            <Link href="/signin" style={{ color: 'var(--ee-ink)', borderBottom: '1px solid var(--ee-ink)' }}>
              Sign in
            </Link>
          </p>
        </div>

        <div className="ee-mono" style={{ color: 'var(--ee-ink-3)', display: 'flex', justifyContent: 'space-between' }}>
          <span>© 2026 Everyday Engineer</span>
          <span>New York, NY</span>
        </div>
      </div>
      {rightPanel}
    </div>
  );
}
