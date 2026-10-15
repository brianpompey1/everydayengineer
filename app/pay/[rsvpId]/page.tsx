import Link from 'next/link';
import EENav from '../../components/EENav';
import EEFooter from '../../components/EEFooter';
import { verifyPayToken } from '@/lib/confirm';
import { getPayState, syncPayment } from '@/lib/payments';
import { CONTACT_EMAIL } from '@/lib/email';
import { formatUSD } from '@/lib/stripe';
import { formatET, formatTimeRange } from '@/lib/datetime';
import { startCheckoutAction } from './actions';
import RefreshSoon from './RefreshSoon';

// Reached from the link in a paid-event approval email — no login required.
// The signed token in the URL is what authorises paying for this RSVP.
export const dynamic = 'force-dynamic';

export default async function PayPage({
  params,
  searchParams,
}: {
  params: Promise<{ rsvpId: string }>;
  searchParams: Promise<{ t?: string; paid?: string; canceled?: string; error?: string; try?: string }>;
}) {
  const { rsvpId } = await params;
  const { t: token, paid, canceled, error, try: attempt } = await searchParams;

  const valid = verifyPayToken(rsvpId, token);

  // Back from Stripe: don't wait on the webhook if Stripe already has the payment.
  if (valid && paid) {
    try {
      await syncPayment(rsvpId);
    } catch (err) {
      console.error('[pay] sync failed:', err);
    }
  }

  const state = valid ? await getPayState(rsvpId) : ({ kind: 'invalid' } as const);
  const event = state.kind === 'invalid' ? null : state.event;
  const finalizing = Boolean(paid) && state.kind === 'ready';

  return (
    <div style={{ background: 'var(--ee-paper)', minHeight: '100vh' }}>
      <EENav />

      <section className="ee-section" style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="ee-card" style={{ width: '100%', maxWidth: 520, padding: 36 }}>
          {state.kind === 'invalid' && (
            <>
              <Eyebrow>PAYMENT</Eyebrow>
              <Title>This link isn&apos;t valid.</Title>
              <p className="ee-body" style={{ marginTop: 10 }}>
                It may have been copied incompletely. Try the button in your email again, or email <Contact />.
              </p>
            </>
          )}

          {state.kind === 'inactive' && (
            <>
              <Eyebrow>PAYMENT</Eyebrow>
              <Title>There&apos;s nothing to pay right now.</Title>
              <p className="ee-body" style={{ marginTop: 10 }}>
                Your request for {state.event.title} isn&apos;t currently accepted for payment. Check your latest
                email for your status, or email <Contact />.
              </p>
            </>
          )}

          {state.kind === 'sold_out' && (
            <>
              <Eyebrow>PAYMENT</Eyebrow>
              <Title>All spots have been filled.</Title>
              <p className="ee-body" style={{ marginTop: 10 }}>
                Sorry — every spot for {state.event.title} has been paid for, so we can&apos;t take your payment.
                Questions? Email <Contact />.
              </p>
            </>
          )}

          {finalizing && event && (
            <>
              <Eyebrow>PAYMENT</Eyebrow>
              <Title>Finalizing your payment…</Title>
              <p className="ee-body" style={{ marginTop: 10 }}>
                Stripe is confirming your payment for {event.title}. This usually takes a few seconds.
                {Number(attempt ?? 0) >= 10 && (
                  <> It&apos;s taking longer than usual — you&apos;ll get a confirmation email as soon as it
                  goes through. If you don&apos;t hear from us, email <Contact />.</>
                )}
              </p>
              <RefreshSoon attempt={Number(attempt ?? 0)} />
            </>
          )}

          {state.kind === 'ready' && !finalizing && (
            <>
              <Eyebrow>COMPLETE YOUR PAYMENT</Eyebrow>
              <Title>{state.event.title}</Title>

              <Details
                rows={[
                  ['Date', formatET(state.event.event_date, { weekday: 'long', month: 'long', day: 'numeric' })],
                  ['Time', `${formatTimeRange(state.event.event_date, state.event.end_date)} ET`],
                  ['Where', state.event.location ?? 'TBA'],
                  ['Price', formatUSD(state.priceCents)],
                ]}
              />

              {canceled && (
                <Note>Payment wasn&apos;t completed, so you haven&apos;t been charged. You can try again below.</Note>
              )}
              {error && (
                <Note tone="error">We couldn&apos;t open the payment page. Please try again in a moment.</Note>
              )}

              <form action={startCheckoutAction.bind(null, rsvpId, token ?? '')} style={{ marginTop: 24 }}>
                <button type="submit" className="ee-btn ee-btn-dark" style={{ width: '100%', padding: 16 }}>
                  Pay {formatUSD(state.priceCents)} →
                </button>
              </form>
              <p className="ee-small" style={{ marginTop: 12, textAlign: 'center', lineHeight: 1.5 }}>
                Secure checkout by Stripe. Payments are non-refundable.
                <br />
                Can&apos;t make it? Email <Contact />.
              </p>
            </>
          )}

          {state.kind === 'paid' && (
            <>
              <Eyebrow>CONFIRMED</Eyebrow>
              <Title>You&apos;re in. ✓</Title>
              <p className="ee-body" style={{ marginTop: 10 }}>
                {state.rsvp.amount_paid_cents ? `Your ${formatUSD(state.rsvp.amount_paid_cents)} payment` : 'Your payment'} is
                received and your spot is confirmed. We&apos;ve emailed you the details.
              </p>
              <Details
                rows={[
                  ['Event', state.event.title],
                  ['Date', formatET(state.event.event_date, { weekday: 'long', month: 'long', day: 'numeric' })],
                  ['Time', `${formatTimeRange(state.event.event_date, state.event.end_date)} ET`],
                  ['Location', state.event.venue_address ?? state.event.location ?? 'TBA'],
                ]}
              />
              <p className="ee-small" style={{ marginTop: 16, lineHeight: 1.5 }}>
                Please keep the address to yourself — it&apos;s only shared with confirmed attendees.
                Can&apos;t make it? Email <Contact />.
              </p>
            </>
          )}

          <div style={{ marginTop: 28, paddingTop: 18, borderTop: '1px solid var(--ee-line)' }}>
            <Link href="/" className="ee-mono" style={{ color: 'var(--ee-ink-2)' }}>← Everyday Engineer Club</Link>
          </div>
        </div>
      </section>

      <EEFooter />
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="ee-mono" style={{ color: 'var(--ee-gold-deep)' }}>{children}</div>;
}

function Title({ children }: { children: React.ReactNode }) {
  return <h1 style={{ marginTop: 12, fontSize: 28, fontWeight: 800, letterSpacing: '-0.01em' }}>{children}</h1>;
}

function Contact() {
  return <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'inherit', borderBottom: '1px solid currentColor' }}>{CONTACT_EMAIL}</a>;
}

function Details({ rows }: { rows: [string, string][] }) {
  return (
    <div style={{ marginTop: 20, padding: 18, background: 'var(--ee-lavender)', borderRadius: 8, display: 'grid', gap: 8, fontSize: 14 }}>
      {rows.map(([label, value]) => (
        <div key={label} style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 12 }}>
          <span className="ee-mono" style={{ fontSize: 10, paddingTop: 3 }}>{label}</span>
          <span style={{ fontWeight: 600 }}>{value}</span>
        </div>
      ))}
    </div>
  );
}

function Note({ children, tone }: { children: React.ReactNode; tone?: 'error' }) {
  return (
    <div
      style={{
        marginTop: 16, padding: '10px 14px', borderRadius: 4, fontSize: 13, lineHeight: 1.5,
        color: tone === 'error' ? '#C0392B' : 'var(--ee-ink-2)',
        background: tone === 'error' ? 'rgba(192,57,43,0.08)' : 'var(--ee-paper-2)',
      }}
    >
      {children}
    </div>
  );
}
