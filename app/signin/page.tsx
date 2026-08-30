'use client';
import { useEffect, useState } from 'react';
import { useSignIn } from '@clerk/nextjs/legacy';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import EELogo from '../components/EELogo';
import EEPhoto from '../components/EEPhoto';

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { isSignedIn, isLoaded: userLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (userLoaded && isSignedIn) {
      router.replace('/today');
    }
  }, [userLoaded, isSignedIn, router]);

  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [authBlocked, setAuthBlocked] = useState(false);

  // Two-factor step. Accounts with 2FA enabled return `needs_second_factor`
  // from signIn.create() and must complete a second challenge before the
  // session can be activated.
  const [step, setStep] = useState<'credentials' | 'second-factor'>('credentials');
  const [secondFactorStrategy, setSecondFactorStrategy] =
    useState<'totp' | 'phone_code' | 'backup_code'>('totp');
  const [availableFactors, setAvailableFactors] = useState<string[]>([]);
  const [code, setCode] = useState('');

  // If Clerk's SDK hasn't initialized after a few seconds it is almost always
  // being blocked (ad blocker / privacy extension / network). Surface that
  // instead of leaving the sign-in button silently inert.
  useEffect(() => {
    if (isLoaded) {
      setAuthBlocked(false);
      return;
    }
    const timer = setTimeout(() => setAuthBlocked(true), 8000);
    return () => clearTimeout(timer);
  }, [isLoaded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) {
      setError(
        "Sign-in isn't ready yet. If this keeps happening, an ad blocker or privacy extension is likely blocking it — disable it for this site, or try another browser."
      );
      return;
    }
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
      } else if (result.status === 'needs_second_factor') {
        const supported = result.supportedSecondFactors ?? [];
        const strategies: string[] = supported.map((f) => f.strategy);
        setAvailableFactors(strategies);
        const has = (s: string) => strategies.includes(s);

        if (has('totp')) {
          setSecondFactorStrategy('totp');
        } else if (has('phone_code')) {
          await signIn.prepareSecondFactor({ strategy: 'phone_code' });
          setSecondFactorStrategy('phone_code');
        } else {
          setSecondFactorStrategy('backup_code');
        }
        setStep('second-factor');
      } else {
        setError(`Additional verification is required to finish signing in (${result.status}).`);
      }
    } catch (err: unknown) {
      const clerkErr = err as { errors?: { message: string }[] };
      setError(clerkErr.errors?.[0]?.message ?? 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleSecondFactor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) {
      setError("Sign-in isn't ready yet. Please refresh and try again.");
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await signIn.attemptSecondFactor({
        strategy: secondFactorStrategy,
        code,
      });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.push('/today');
      } else {
        setError(`Could not finish signing in (${result.status}).`);
      }
    } catch (err: unknown) {
      const clerkErr = err as { errors?: { message: string }[] };
      setError(clerkErr.errors?.[0]?.message ?? 'Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const secondFactorCopy: Record<typeof secondFactorStrategy, { title: string; hint: string }> = {
    totp:        { title: 'Two-factor authentication', hint: 'Enter the 6-digit code from your authenticator app.' },
    phone_code:  { title: 'Check your phone',          hint: 'Enter the 6-digit code we just texted you.' },
    backup_code: { title: 'Enter a backup code',       hint: 'Use one of the backup codes you saved when enabling 2FA.' },
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

      <div className="ee-signin-grid" style={{ position: 'relative' }}>
        {/* Left — manifesto */}
        <div className="ee-signin-manifesto" style={{ padding: '80px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
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
        <div className="ee-signin-form" style={{ background: 'var(--ee-paper)', color: 'var(--ee-ink)', padding: '80px 64px', position: 'relative' }}>
          <div className="ee-mono" style={{ color: 'var(--ee-gold-deep)' }}>
            {step === 'second-factor' ? 'VERIFICATION' : 'CREDENTIALS'}
          </div>
          <h2 style={{ fontFamily: 'var(--ee-display)', fontStyle: 'italic', fontSize: 56, fontWeight: 400, margin: '16px 0 32px', letterSpacing: '-0.02em' }}>
            {step === 'second-factor' ? 'Verify.' : 'Sign in.'}
          </h2>

          {authBlocked && step === 'credentials' && (
            <div style={{ marginBottom: 24, padding: '14px 16px', background: 'rgba(184,140,14,0.12)', border: '1px solid var(--ee-gold-deep)', borderRadius: 6, fontSize: 13, lineHeight: 1.5, color: 'var(--ee-ink-2)' }}>
              <strong style={{ color: 'var(--ee-ink)' }}>Sign-in didn&apos;t load.</strong> This is usually an ad blocker or
              privacy extension blocking our authentication provider. Try disabling it for this
              site, using a private window, or a different browser.
            </div>
          )}

          {step === 'credentials' ? (
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
          ) : (
            <form onSubmit={handleSecondFactor}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <p className="ee-body" style={{ fontSize: 15, marginTop: -8 }}>
                  {secondFactorCopy[secondFactorStrategy].hint}
                </p>

                {availableFactors.length === 0 && (
                  <div style={{ padding: '12px 14px', background: 'rgba(184,140,14,0.12)', border: '1px solid var(--ee-gold-deep)', borderRadius: 6, fontSize: 13, lineHeight: 1.5, color: 'var(--ee-ink-2)' }}>
                    This account requires two-factor authentication, but no authenticator app or
                    phone is enrolled — only a backup code will work. If you don&apos;t have one,
                    an admin can reset two-factor for your account.
                  </div>
                )}

                {availableFactors.length > 1 && (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {availableFactors.includes('totp') && (
                      <button type="button" onClick={() => { setSecondFactorStrategy('totp'); setCode(''); setError(''); }}
                        className="ee-tag" style={{ cursor: 'pointer', border: 'none', background: secondFactorStrategy === 'totp' ? 'var(--ee-navy-900)' : 'var(--ee-lavender-2)', color: secondFactorStrategy === 'totp' ? 'var(--ee-paper)' : 'var(--ee-ink-2)' }}>
                        Authenticator app
                      </button>
                    )}
                    {availableFactors.includes('phone_code') && (
                      <button type="button" onClick={async () => { await signIn?.prepareSecondFactor({ strategy: 'phone_code' }); setSecondFactorStrategy('phone_code'); setCode(''); setError(''); }}
                        className="ee-tag" style={{ cursor: 'pointer', border: 'none', background: secondFactorStrategy === 'phone_code' ? 'var(--ee-navy-900)' : 'var(--ee-lavender-2)', color: secondFactorStrategy === 'phone_code' ? 'var(--ee-paper)' : 'var(--ee-ink-2)' }}>
                        Text me a code
                      </button>
                    )}
                  </div>
                )}

                <div>
                  <label className="ee-label">{secondFactorCopy[secondFactorStrategy].title}</label>
                  <input
                    className="ee-input-underline"
                    inputMode={secondFactorStrategy === 'backup_code' ? 'text' : 'numeric'}
                    autoComplete="one-time-code"
                    placeholder={secondFactorStrategy === 'backup_code' ? 'backup code' : '123456'}
                    required
                    autoFocus
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    style={{ fontSize: 22, letterSpacing: '0.2em' }}
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
                  disabled={loading || !code.trim()}
                  style={{ marginTop: 16, padding: '20px', fontSize: 14, fontFamily: 'var(--ee-mono)', letterSpacing: '0.18em', width: '100%', opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? 'VERIFYING…' : 'VERIFY →'}
                </button>

                {secondFactorStrategy !== 'backup_code' && (
                  <button
                    type="button"
                    onClick={() => { setSecondFactorStrategy('backup_code'); setCode(''); setError(''); }}
                    className="ee-mono"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ee-ink-3)', fontSize: 10, padding: 0 }}
                  >
                    Use a backup code instead
                  </button>
                )}
              </div>
            </form>
          )}

          <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid var(--ee-line)', display: 'flex', justifyContent: 'space-between' }}>
            {step === 'second-factor' ? (
              <button
                type="button"
                onClick={() => { setStep('credentials'); setCode(''); setError(''); }}
                className="ee-mono"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ee-ink-2)', padding: 0 }}
              >
                ← Back
              </button>
            ) : (
              <Link href="/signup" className="ee-mono" style={{ color: 'var(--ee-ink-2)' }}>← Create account</Link>
            )}
            <span className="ee-mono" style={{ color: 'var(--ee-ink-3)' }}>Need help? →</span>
          </div>
        </div>
      </div>
    </div>
  );
}
