import { formatET, formatTimeRange } from './datetime';
import { Resend } from 'resend';

const FROM = 'Everyday Engineer Club <noreply@everydayeng.com>';

function client(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

interface SendArgs {
  to: string;
  subject: string;
  html: string;
}

/**
 * Sends mail if Resend is configured. Notifications are best-effort — a
 * failure here must never break an RSVP, so this reports rather than throws.
 */
export async function sendEmail({ to, subject, html }: SendArgs): Promise<{ ok: boolean; error?: string }> {
  const resend = client();
  if (!resend) {
    console.warn('[email] RESEND_API_KEY not set — skipping send to', to);
    return { ok: false, error: 'Email not configured' };
  }
  if (!to) return { ok: false, error: 'No recipient' };

  try {
    const { error } = await resend.emails.send({ from: FROM, to, subject, html });
    if (error) {
      console.error('[email] send failed:', error);
      return { ok: false, error: String(error) };
    }
    return { ok: true };
  } catch (err) {
    console.error('[email] send threw:', err);
    return { ok: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

// ── Shell ──────────────────────────────────────────────────
function shell(bodyHtml: string): string {
  return `
  <div style="background:#F6F5F1;padding:32px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
    <div style="max-width:540px;margin:0 auto;background:#ffffff;border:1px solid rgba(15,26,46,0.10);border-radius:12px;overflow:hidden;">
      <div style="background:#0F1A2E;padding:22px 28px;">
        <span style="color:#E8B520;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;">
          Everyday Engineer Club
        </span>
      </div>
      <div style="padding:28px;color:#0F1A2E;font-size:15px;line-height:1.6;">
        ${bodyHtml}
      </div>
      <div style="padding:18px 28px;border-top:1px solid rgba(15,26,46,0.10);color:#5A6378;font-size:12px;line-height:1.5;">
        This is an automated message — replies to this address aren't monitored.
      </div>
    </div>
  </div>`;
}

/** Escape anything interpolated into email HTML — names come from signups. */
function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function heading(text: string): string {
  return `<h1 style="margin:0 0 14px;font-size:22px;font-weight:800;letter-spacing:-0.01em;color:#0F1A2E;">${esc(text)}</h1>`;
}

function detailBlock(rows: [string, string][]): string {
  const items = rows
    .filter(([, v]) => Boolean(v))
    .map(
      ([k, v]) => `
      <tr>
        <td style="padding:6px 0;color:#5A6378;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;width:110px;vertical-align:top;">${esc(k)}</td>
        <td style="padding:6px 0;color:#0F1A2E;font-size:14px;">${esc(v)}</td>
      </tr>`
    )
    .join('');
  return `<table style="width:100%;border-collapse:collapse;margin:18px 0;background:#F1F2F8;border-radius:8px;padding:8px;">
    <tbody style="padding:12px;">${items}</tbody>
  </table>`;
}

export interface EventEmailContext {
  eventTitle: string;
  eventDate: string;             // ISO
  eventEndDate?: string | null;  // ISO
  location: string | null;
  venueAddress?: string | null;
  attendeeNotes?: string | null;
  confirmUrl?: string | null;
  /** False for participant-only events. Defaults to true. */
  allowSpectators?: boolean;
  /** Whether the event has a waiver the participant signed. Defaults to true. */
  hasWaiver?: boolean;
  memberName: string | null;
}

const firstName = (name: string | null) => (name ? name.trim().split(/\s+/)[0] : '');

const greet = (name: string | null) =>
  `<p style="margin:0 0 14px;">Hey${firstName(name) ? ` ${esc(firstName(name))}` : ''},</p>`;

const dateLine = (ctx: EventEmailContext) =>
  formatET(ctx.eventDate, { weekday: 'long', month: 'long', day: 'numeric' });
const timeLine = (ctx: EventEmailContext) => `${formatTimeRange(ctx.eventDate, ctx.eventEndDate)} ET`;

/**
 * Details for anyone welcome at the venue (confirmed spectators, approved
 * players, waitlisted players invited to spectate). Includes the private
 * street address when one is set, plus a note to keep it private.
 */
function attendeeDetails(ctx: EventEmailContext, { includeEvent = true } = {}): string {
  const rows: [string, string][] = [
    ...(includeEvent ? ([['Event', ctx.eventTitle]] as [string, string][]) : []),
    ['Date', dateLine(ctx)],
    ['Time', timeLine(ctx)],
    ['Location', ctx.venueAddress ?? ctx.location ?? 'TBA'],
  ];
  return `
    ${detailBlock(rows)}
    ${ctx.venueAddress
      ? `<p style="margin:0 0 14px;color:#5A6378;font-size:13px;">Please keep the address to yourself — it's only shared with confirmed attendees.</p>`
      : ''}`;
}

/** Per-event instructions, entered one per line on the event row. */
function notesBlock(notes: string | null | undefined): string {
  const lines = (notes ?? '')
    .split('\n')
    .map((l) => l.replace(/^\s*[•\-*]\s*/, '').trim())
    .filter(Boolean);
  if (lines.length === 0) return '';
  return `
    <p style="margin:18px 0 6px;font-weight:700;">A couple of notes:</p>
    <ul style="margin:0 0 14px;padding-left:20px;">
      ${lines.map((l) => `<li style="margin:0 0 6px;">${esc(l)}</li>`).join('')}
    </ul>`;
}

function confirmButton(url: string): string {
  const href = esc(url);
  return `
    <table role="presentation" cellspacing="0" cellpadding="0" style="margin:20px 0 8px;">
      <tr><td style="background:#0F1A2E;border-radius:6px;">
        <a href="${href}" style="display:inline-block;padding:14px 26px;color:#ffffff;font-weight:700;font-size:15px;text-decoration:none;">Yes, I'll be there →</a>
      </td></tr>
    </table>
    <p style="margin:0 0 14px;color:#5A6378;font-size:12px;">
      Button not working? Paste this into your browser:<br>
      <a href="${href}" style="color:#5A6378;word-break:break-all;">${href}</a>
    </p>`;
}

// ── Templates ──────────────────────────────────────────────

export function spectatorConfirmed(ctx: EventEmailContext) {
  return {
    subject: `You're confirmed — ${ctx.eventTitle}`,
    html: shell(`
      ${heading("You're coming through.")}
      ${greet(ctx.memberName)}
      <p style="margin:0 0 14px;">You're confirmed as a <strong>spectator</strong>. No waiver needed — just show up.</p>
      ${attendeeDetails(ctx)}
      <p style="margin:14px 0 0;">See you there.</p>
    `),
  };
}

export function playerRequestReceived(ctx: EventEmailContext) {
  return {
    subject: `Request received — ${ctx.eventTitle}`,
    html: shell(`
      ${heading('Request received.')}
      ${greet(ctx.memberName)}
      <p style="margin:0 0 14px;">
        We've got your request to participate${ctx.hasWaiver === false ? '' : ', and your waiver is on file'}.
        Spots are limited, so an organizer confirms participants before each event —
        <strong>we'll email you either way</strong>.
      </p>
      ${detailBlock([['Event', ctx.eventTitle], ['Date', dateLine(ctx)], ['Time', timeLine(ctx)], ['Where', ctx.location ?? 'TBA']])}
      <p style="margin:14px 0 0;">${
        ctx.allowSpectators === false
          ? "Requesting a spot doesn't guarantee one — we'll let you know either way."
          : "Requesting a spot doesn't guarantee one, but if the event fills up you're still welcome to come through and watch."
      }</p>
    `),
  };
}

export function playerApproved(ctx: EventEmailContext) {
  const name = firstName(ctx.memberName);
  const weekday = formatET(ctx.eventDate, { weekday: 'long' });
  return {
    subject: `Confirm your spot — ${ctx.eventTitle}`,
    html: shell(`
      ${heading("You're in.")}
      <p style="margin:0 0 14px;">
        Hey${name ? ` ${esc(name)}` : ' there'}! This is your confirmation for the
        <strong>${esc(ctx.eventTitle)}</strong>.
      </p>
      ${attendeeDetails(ctx, { includeEvent: false })}
      <p style="margin:0 0 4px;">
        If you're able to attend, tap the button below to confirm your spot.
        <strong>Your spot is confirmed once you do.</strong>
      </p>
      ${ctx.confirmUrl ? confirmButton(ctx.confirmUrl) : ''}
      ${notesBlock(ctx.attendeeNotes)}
      <p style="margin:18px 0 0;">Looking forward to seeing you on ${esc(weekday)}! ⚙️</p>
    `),
  };
}

export function playerWaitlisted(ctx: EventEmailContext) {
  const spectatorsWelcome = ctx.allowSpectators !== false;
  return {
    subject: `You're on the waitlist — ${ctx.eventTitle}`,
    html: shell(`
      ${heading("You're on the waitlist.")}
      <p style="margin:0 0 14px;">
        Thank you for signing up for our upcoming <strong>${esc(ctx.eventTitle)}</strong>.
      </p>
      <p style="margin:0 0 14px;">
        The event is currently full, so anyone who has not received participant confirmation has
        been added to the waitlist. If a spot becomes available, we'll contact you directly.
      </p>
      ${spectatorsWelcome
        ? `<p style="margin:0 0 14px;">
             You're still welcome to come by, support the community, and watch as a spectator. If a
             spot opens during the event, we may also be able to add you.
           </p>
           ${attendeeDetails(ctx)}`
        : // Participant-only: they aren't coming, so no private street address.
          detailBlock([['Event', ctx.eventTitle], ['Date', dateLine(ctx)], ['Time', timeLine(ctx)]])}
      <p style="margin:14px 0 0;">Thank you for your interest and understanding. ${
        spectatorsWelcome ? 'We hope to see you there!' : 'We hope to see you at a future event!'
      }</p>
    `),
  };
}

export function playerDeclined(ctx: EventEmailContext) {
  return {
    subject: `About your request — ${ctx.eventTitle}`,
    html: shell(`
      ${heading('About your request.')}
      ${greet(ctx.memberName)}
      <p style="margin:0 0 14px;">
        We weren't able to confirm your spot for this one. If you think that's a mistake, or you'd
        like to join a future run, just reach out to an organizer.
      </p>
      ${detailBlock([['Event', ctx.eventTitle], ['Date', dateLine(ctx)]])}
    `),
  };
}
