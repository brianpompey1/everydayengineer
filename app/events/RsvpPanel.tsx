'use client';

import { useState, useTransition } from 'react';
import { rsvpAction, cancelRsvpAction } from './actions';
import { AGE_21_LABEL, type EventWaiver } from '@/lib/waiver';

const DISCIPLINES = [
  'Civil Engineer', 'Mechanical Engineer', 'Electrical Engineer', 'Computer Engineer',
  'Computer Science', 'Chemical Engineer', 'Industrial Engineer', 'Other',
];
const PROFESSIONAL_STATUS = [
  { value: 'student', label: 'Student' },
  { value: 'graduate', label: 'Graduate / Looking for work' },
  { value: 'professional', label: 'Working Professional' },
];
const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export interface RsvpProfile {
  fullName: string | null;
  phone: string | null;
  companyOrSchool: string | null;
  professionalStatus: string | null;
  discipline: string | null;
  shirtSize: string | null;
  is21Plus: boolean | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  heardAboutUs: string | null;
}

export interface RsvpPanelProps {
  eventId: string;
  eventTitle: string;
  spotsLeft: number | null;
  eventFull: boolean;
  /** Per-event rules, set on the event row. */
  allowSpectators: boolean;
  requires21Plus: boolean;
  waiver: EventWaiver | null;
  rsvp: { attendee_type: string; status: string; attendance_confirmed_at: string | null } | null;
  profile: RsvpProfile;
}

type Step = 'choose' | 'details' | 'waiver' | 'confirm';

const todayISO = () => new Date().toISOString().slice(0, 10);

const profileComplete = (p: { phone: string; companyOrSchool: string; professionalStatus: string; shirtSize: string }) =>
  Boolean(p.phone && p.companyOrSchool && p.professionalStatus && p.shirtSize);

export default function RsvpPanel(props: RsvpPanelProps) {
  const { eventId, eventTitle, spotsLeft, eventFull, allowSpectators, requires21Plus, waiver, rsvp, profile } = props;
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    phone: profile.phone ?? '',
    companyOrSchool: profile.companyOrSchool ?? '',
    professionalStatus: profile.professionalStatus ?? '',
    discipline: profile.discipline ?? '',
    shirtSize: profile.shirtSize ?? '',
    heardAboutUs: profile.heardAboutUs ?? '',
    emergencyContactName: profile.emergencyContactName ?? '',
    emergencyContactPhone: profile.emergencyContactPhone ?? '',
    signatureName: profile.fullName ?? '',
    signatureDate: todayISO(),
    agreed: false,
  });
  const set = (k: keyof typeof form, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const [ageAnswer, setAgeAnswer] = useState<boolean | null>(profile.is21Plus);

  // The participant path only includes the steps this member and this event
  // actually need, decided once up front so steps don't vanish mid-flow.
  const [participantSteps] = useState<Step[]>(() => {
    // Also shown when the profile says under 21, so they see why they can't join.
    const needsAge = requires21Plus && profile.is21Plus !== true;
    const steps: Step[] = [];
    if (allowSpectators || needsAge) steps.push('choose');
    if (!profileComplete({
      phone: profile.phone ?? '', companyOrSchool: profile.companyOrSchool ?? '',
      professionalStatus: profile.professionalStatus ?? '', shirtSize: profile.shirtSize ?? '',
    })) steps.push('details');
    if (waiver) steps.push('waiver');
    return steps.length ? steps : ['confirm'];
  });

  const [step, setStep] = useState<Step>(participantSteps[0]);
  // Participant-only events have no choice to make.
  const [attendeeType, setAttendeeType] = useState<'player' | 'spectator' | null>(
    allowSpectators ? null : 'player'
  );

  if (rsvp) {
    return <StatusCard rsvp={rsvp} eventId={eventId} allowSpectators={allowSpectators} hasWaiver={waiver !== null} />;
  }

  const stepIndex = participantSteps.indexOf(step);
  const isLastStep = stepIndex === participantSteps.length - 1;
  const goNext = () => (isLastStep ? submit('player') : setStep(participantSteps[stepIndex + 1]));
  const goBack = () => stepIndex > 0 && setStep(participantSteps[stepIndex - 1]);

  const ageBlocked = requires21Plus && ageAnswer === false;
  const ageUnanswered = requires21Plus && ageAnswer === null;
  const longAgreeLabel = (waiver?.agreeLabel.length ?? 0) > 120;
  const waiverReady =
    form.agreed && form.signatureName.trim() && form.emergencyContactName.trim() && form.emergencyContactPhone.trim();

  function submit(type: 'player' | 'spectator') {
    setError('');
    startTransition(async () => {
      const res = await rsvpAction({
        eventId,
        attendeeType: type,
        is21Plus: ageAnswer,
        profile:
          type === 'player'
            ? {
                phone: form.phone,
                company_or_school: form.companyOrSchool,
                professional_status: form.professionalStatus,
                discipline: form.discipline,
                shirt_size: form.shirtSize,
                heard_about_us: form.heardAboutUs,
                emergency_contact_name: form.emergencyContactName,
                emergency_contact_phone: form.emergencyContactPhone,
                is_21_plus: ageAnswer ?? undefined,
              }
            : undefined,
        waiver:
          type === 'player' && waiver
            ? {
                signatureName: form.signatureName.trim(),
                signatureDate: form.signatureDate,
                emergencyContactName: form.emergencyContactName.trim(),
                emergencyContactPhone: form.emergencyContactPhone.trim(),
              }
            : undefined,
      });
      if (!res.ok) setError(res.error ?? 'Something went wrong.');
    });
  }

  const submitLabel = waiver ? 'Sign & request a spot →' : 'Request a spot →';
  const spotsText = eventFull
    ? 'The event is full — you can still request a spot in case one opens up.'
    : spotsLeft !== null
    ? `${spotsLeft} spot${spotsLeft === 1 ? '' : 's'} left.`
    : '';

  return (
    <div className="ee-card" style={{ padding: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
        <div className="ee-mono" style={{ color: 'var(--ee-gold-deep)' }}>RSVP</div>
        {attendeeType === 'player' && participantSteps.length > 1 && (
          <div className="ee-mono" style={{ color: 'var(--ee-ink-3)', fontSize: 10 }}>
            STEP {stepIndex + 1} OF {participantSteps.length}
          </div>
        )}
      </div>

      {/* ── Choose (or, on participant-only events, just the age check) ── */}
      {step === 'choose' && (
        <>
          <h3 style={{ marginTop: 12, fontSize: 22, fontWeight: 800, letterSpacing: '-0.01em' }}>
            {allowSpectators ? 'How are you joining?' : 'Before you join.'}
          </h3>

          {allowSpectators ? (
            <div className="ee-grid-col2" style={{ gap: 12, marginTop: 20, alignItems: 'stretch' }}>
              <ChoiceCard
                title="Participant"
                body={[spotsText, waiver ? 'Requires a signed waiver.' : ''].filter(Boolean).join(' ')}
                selected={attendeeType === 'player'}
                onClick={() => { setAttendeeType('player'); setError(''); }}
              />
              <ChoiceCard
                title="Spectator"
                body="Come watch and hang out. Confirmed instantly, no waiver needed."
                selected={attendeeType === 'spectator'}
                onClick={() => { setAttendeeType('spectator'); setError(''); }}
              />
            </div>
          ) : (
            <p className="ee-body" style={{ marginTop: 8, fontSize: 14 }}>
              This event is for participants only. {spotsText}
            </p>
          )}

          {attendeeType === 'player' && requires21Plus && profile.is21Plus !== true && (
            <div style={{ marginTop: 20, padding: 16, background: 'var(--ee-lavender)', borderRadius: 8 }}>
              {profile.is21Plus === null && (
                <>
                  <div className="ee-label" style={{ marginBottom: 10 }}>{AGE_21_LABEL}</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <PillButton selected={ageAnswer === true} onClick={() => setAgeAnswer(true)}>I am 21 or older</PillButton>
                    <PillButton selected={ageAnswer === false} onClick={() => setAgeAnswer(false)}>I am not 21 yet</PillButton>
                  </div>
                </>
              )}
              {ageAnswer === false && (
                <p className="ee-small" style={{ marginTop: profile.is21Plus === null ? 12 : 0, lineHeight: 1.5 }}>
                  Participants need to be 21 or older.
                  {allowSpectators && (
                    <>
                      {' '}You&apos;re very welcome to come through as a spectator.{' '}
                      <button
                        type="button"
                        onClick={() => setAttendeeType('spectator')}
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--ee-ink)', borderBottom: '1px solid var(--ee-ink)', fontSize: 13 }}
                      >
                        Switch to spectator
                      </button>
                    </>
                  )}
                </p>
              )}
            </div>
          )}

          {error && <ErrorNote>{error}</ErrorNote>}

          <div style={{ marginTop: 22 }}>
            {attendeeType === 'spectator' ? (
              <button className="ee-btn ee-btn-dark" style={{ width: '100%', padding: 16 }} disabled={pending} onClick={() => submit('spectator')}>
                {pending ? 'Confirming…' : 'Confirm as spectator →'}
              </button>
            ) : (
              <button
                className="ee-btn ee-btn-dark"
                style={{ width: '100%', padding: 16, opacity: attendeeType === 'player' && !ageBlocked && !ageUnanswered ? 1 : 0.5 }}
                disabled={attendeeType !== 'player' || ageBlocked || ageUnanswered || pending}
                onClick={goNext}
              >
                {isLastStep ? (pending ? 'Submitting…' : submitLabel) : 'Continue →'}
              </button>
            )}
          </div>
        </>
      )}

      {/* ── Details (first time only) ── */}
      {step === 'details' && (
        <>
          <h3 style={{ marginTop: 12, fontSize: 22, fontWeight: 800, letterSpacing: '-0.01em' }}>A few details.</h3>
          <p className="ee-body" style={{ marginTop: 8, fontSize: 14 }}>
            We&apos;ll save these to your profile — you won&apos;t be asked again.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 20 }}>
            <Field label="Phone number">
              <input className="ee-input" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="(555) 555-5555" />
            </Field>
            <Field label="School or company">
              <input className="ee-input" value={form.companyOrSchool} onChange={(e) => set('companyOrSchool', e.target.value)} />
            </Field>
            <Field label="You are a">
              <select className="ee-input" value={form.professionalStatus} onChange={(e) => set('professionalStatus', e.target.value)}>
                <option value="">Select…</option>
                {PROFESSIONAL_STATUS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </Field>
            <Field label="Discipline">
              <select className="ee-input" value={form.discipline} onChange={(e) => set('discipline', e.target.value)}>
                <option value="">Select…</option>
                {DISCIPLINES.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </Field>
            <Field label="Shirt size">
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {SIZES.map((s) => (
                  <PillButton key={s} selected={form.shirtSize === s} onClick={() => set('shirtSize', s)}>{s}</PillButton>
                ))}
              </div>
            </Field>
            <Field label="How did you hear about us?">
              <input className="ee-input" value={form.heardAboutUs} onChange={(e) => set('heardAboutUs', e.target.value)} placeholder="Instagram, a friend, an event…" />
            </Field>
          </div>

          {error && <ErrorNote>{error}</ErrorNote>}

          <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
            {stepIndex > 0 && <button className="ee-btn ee-btn-ghost" onClick={goBack}>← Back</button>}
            <button
              className="ee-btn ee-btn-dark"
              style={{ flex: 1, opacity: profileComplete(form) ? 1 : 0.5 }}
              disabled={!profileComplete(form) || pending}
              onClick={goNext}
            >
              {isLastStep ? (pending ? 'Submitting…' : submitLabel) : 'Continue →'}
            </button>
          </div>
        </>
      )}

      {/* ── Waiver (only for events that have one) ── */}
      {step === 'waiver' && waiver && (
        <>
          <h3 style={{ marginTop: 12, fontSize: 22, fontWeight: 800, letterSpacing: '-0.01em' }}>{waiver.title}</h3>
          <p className="ee-body" style={{ marginTop: 8, fontSize: 14 }}>
            Please read and sign before participating in {eventTitle}.
          </p>

          <div
            style={{
              marginTop: 16, maxHeight: 240, overflowY: 'auto',
              padding: 16, background: 'var(--ee-paper-2)',
              border: '1px solid var(--ee-line)', borderRadius: 8,
              fontSize: 13, lineHeight: 1.6, color: 'var(--ee-ink-2)',
            }}
          >
            {waiver.paragraphs.map((p, i) => (
              <p key={i} style={{ margin: i === 0 ? 0 : '12px 0 0', whiteSpace: 'pre-line' }}>{p}</p>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 18 }}>
            <Field label="Emergency contact name">
              <input className="ee-input" value={form.emergencyContactName} onChange={(e) => set('emergencyContactName', e.target.value)} />
            </Field>
            <Field label="Emergency contact phone">
              <input className="ee-input" value={form.emergencyContactPhone} onChange={(e) => set('emergencyContactPhone', e.target.value)} />
            </Field>

            {/* A long consent clause is part of the document, so it gets the
                same small type and box as the waiver body. */}
            <label
              style={{
                display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer',
                color: 'var(--ee-ink-2)',
                ...(longAgreeLabel
                  ? { fontSize: 12.5, lineHeight: 1.55, padding: 14, background: 'var(--ee-paper-2)', border: '1px solid var(--ee-line)', borderRadius: 8 }
                  : { fontSize: 14, lineHeight: 1.5 }),
              }}
            >
              <input type="checkbox" checked={form.agreed} onChange={(e) => set('agreed', e.target.checked)} style={{ marginTop: longAgreeLabel ? 2 : 4, flexShrink: 0 }} />
              <span>{waiver.agreeLabel}</span>
            </label>

            <div className="ee-grid-col2" style={{ gap: 12, alignItems: 'start' }}>
              <Field label="Type your full name to sign">
                <input className="ee-input" value={form.signatureName} onChange={(e) => set('signatureName', e.target.value)} placeholder="Your full name" />
              </Field>
              <Field label="Date of signature">
                <input className="ee-input" type="date" value={form.signatureDate} onChange={(e) => set('signatureDate', e.target.value)} />
              </Field>
            </div>
          </div>

          {error && <ErrorNote>{error}</ErrorNote>}

          <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
            {stepIndex > 0 && <button className="ee-btn ee-btn-ghost" onClick={goBack}>← Back</button>}
            <button
              className="ee-btn ee-btn-dark"
              style={{ flex: 1, opacity: waiverReady ? 1 : 0.5 }}
              disabled={pending || !waiverReady}
              onClick={goNext}
            >
              {pending ? 'Submitting…' : submitLabel}
            </button>
          </div>
        </>
      )}

      {/* ── Nothing left to ask — a single confirm ── */}
      {step === 'confirm' && (
        <>
          <h3 style={{ marginTop: 12, fontSize: 22, fontWeight: 800, letterSpacing: '-0.01em' }}>Join as a participant.</h3>
          <p className="ee-body" style={{ marginTop: 8, fontSize: 14 }}>{spotsText || 'Request your spot below.'}</p>
          {error && <ErrorNote>{error}</ErrorNote>}
          <button className="ee-btn ee-btn-dark" style={{ width: '100%', padding: 16, marginTop: 22 }} disabled={pending} onClick={() => submit('player')}>
            {pending ? 'Submitting…' : submitLabel}
          </button>
        </>
      )}

      {attendeeType === 'player' && (
        <p className="ee-small" style={{ marginTop: 14, fontSize: 12 }}>
          Requesting a spot doesn&apos;t guarantee one — spots are limited and confirmed by an organizer.
        </p>
      )}
    </div>
  );
}

// ── Status card for members who already responded ──────────
function StatusCard({
  rsvp, eventId, allowSpectators, hasWaiver,
}: {
  rsvp: { attendee_type: string; status: string; attendance_confirmed_at: string | null };
  eventId: string;
  allowSpectators: boolean;
  hasWaiver: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const isParticipant = rsvp.attendee_type === 'player';

  const copy = (() => {
    if (rsvp.status === 'approved' && isParticipant)
      return rsvp.attendance_confirmed_at
        ? { tone: 'gold', title: "You're in — and confirmed.", body: 'See you there. Your email has the full details.' }
        : { tone: 'gold', title: "You're in.", body: "Tap “Yes, I'll be there” in your approval email to confirm your spot." };
    if (rsvp.status === 'approved')
      return { tone: 'neutral', title: "You're coming through.", body: 'Confirmed as a spectator — no waiver needed.' };
    if (rsvp.status === 'pending')
      return {
        tone: 'pending',
        title: 'Request received.',
        body: `${hasWaiver ? 'Waiver signed. ' : ''}An organizer will confirm your spot before the event.`,
      };
    if (rsvp.status === 'waitlisted')
      return {
        tone: 'neutral',
        title: 'The event is full.',
        body: allowSpectators
          ? "You didn't get a spot this time, but you're very welcome to come through as a spectator."
          : "You didn't get a spot this time. If one opens up, we'll email you.",
      };
    return { tone: 'neutral', title: 'Not confirmed.', body: 'Reach out to an organizer if you think this is a mistake.' };
  })();

  const bg = copy.tone === 'gold' ? 'rgba(184,140,14,0.14)' : copy.tone === 'pending' ? 'var(--ee-lavender)' : 'var(--ee-paper-2)';
  const border = copy.tone === 'gold' ? '1px solid var(--ee-gold-deep)' : '1px solid var(--ee-line)';

  return (
    <div className="ee-card" style={{ padding: 28 }}>
      <div className="ee-mono" style={{ color: 'var(--ee-gold-deep)' }}>YOUR RSVP</div>
      <div style={{ marginTop: 14, padding: 20, background: bg, border, borderRadius: 8 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10, flexWrap: 'wrap' }}>
          <span className="ee-tag" style={{ background: 'var(--ee-navy-900)', color: 'var(--ee-paper)', fontSize: 10 }}>
            {isParticipant ? 'PARTICIPANT' : 'SPECTATOR'}
          </span>
          <span className="ee-mono" style={{ color: 'var(--ee-ink-3)', fontSize: 10 }}>{rsvp.status.toUpperCase()}</span>
        </div>
        <div style={{ fontWeight: 700, fontSize: 18 }}>{copy.title}</div>
        <p className="ee-body" style={{ marginTop: 6, fontSize: 14 }}>{copy.body}</p>
      </div>

      <button
        className="ee-btn ee-btn-ghost"
        style={{ marginTop: 16, width: '100%' }}
        disabled={pending}
        onClick={() => startTransition(async () => { await cancelRsvpAction(eventId); })}
      >
        {pending ? 'Updating…' : isParticipant && allowSpectators ? 'Cancel or switch to spectator' : isParticipant ? 'Cancel my request' : 'Cancel my RSVP'}
      </button>
    </div>
  );
}

// ── Small building blocks ──────────────────────────────────
function ChoiceCard({ title, body, selected, onClick }: { title: string; body: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        textAlign: 'left', cursor: 'pointer', padding: 18, borderRadius: 10,
        background: selected ? 'var(--ee-navy-900)' : 'var(--ee-paper)',
        color: selected ? '#fff' : 'var(--ee-ink)',
        border: selected ? '1px solid var(--ee-navy-900)' : '1px solid var(--ee-line)',
        transition: 'background 120ms ease, border-color 120ms ease',
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 16 }}>{title}</div>
      <div style={{ fontSize: 13, lineHeight: 1.5, marginTop: 6, color: selected ? 'rgba(255,255,255,0.72)' : 'var(--ee-ink-3)' }}>
        {body}
      </div>
    </button>
  );
}

function PillButton({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="ee-tag"
      style={{
        cursor: 'pointer', border: 'none', padding: '8px 14px',
        background: selected ? 'var(--ee-navy-900)' : 'var(--ee-lavender-2)',
        color: selected ? 'var(--ee-paper)' : 'var(--ee-ink-2)',
      }}
    >
      {children}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="ee-label">{label}</label>
      {children}
    </div>
  );
}

function ErrorNote({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 16, color: '#C0392B', fontSize: 13, padding: '10px 14px', background: 'rgba(192,57,43,0.08)', borderRadius: 4, lineHeight: 1.5 }}>
      {children}
    </div>
  );
}
