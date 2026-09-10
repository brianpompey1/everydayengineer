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

function heading(text: string): string {
  return `<h1 style="margin:0 0 14px;font-size:22px;font-weight:800;letter-spacing:-0.01em;color:#0F1A2E;">${text}</h1>`;
}

function detailBlock(rows: [string, string][]): string {
  const items = rows
    .filter(([, v]) => Boolean(v))
    .map(
      ([k, v]) => `
      <tr>
        <td style="padding:6px 0;color:#5A6378;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;width:110px;vertical-align:top;">${k}</td>
        <td style="padding:6px 0;color:#0F1A2E;font-size:14px;">${v}</td>
      </tr>`
    )
    .join('');
  return `<table style="width:100%;border-collapse:collapse;margin:18px 0;background:#F1F2F8;border-radius:8px;padding:8px;">
    <tbody style="padding:12px;">${items}</tbody>
  </table>`;
}

export interface EventEmailContext {
  eventTitle: string;
  eventDate: string;       // ISO
  location: string | null;
  venueAddress?: string | null;
  memberName: string | null;
}

function formatWhen(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
    hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York',
  }) + ' ET';
}

const greet = (name: string | null) => `<p style="margin:0 0 14px;">Hey${name ? ` ${name.split(' ')[0]}` : ''},</p>`;

// ── Templates ──────────────────────────────────────────────

export function spectatorConfirmed(ctx: EventEmailContext) {
  return {
    subject: `You're confirmed — ${ctx.eventTitle}`,
    html: shell(`
      ${heading("You're coming through.")}
      ${greet(ctx.memberName)}
      <p style="margin:0 0 14px;">You're confirmed as a <strong>spectator</strong>. No waiver needed — just show up.</p>
      ${detailBlock([['Event', ctx.eventTitle], ['When', formatWhen(ctx.eventDate)], ['Where', ctx.location ?? 'TBA']])}
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
        We've got your request to play, and your waiver is on file. Rosters are capped, so an
        organizer confirms spots before each event — <strong>we'll email you either way</strong>.
      </p>
      ${detailBlock([['Event', ctx.eventTitle], ['When', formatWhen(ctx.eventDate)], ['Where', ctx.location ?? 'TBA']])}
      <p style="margin:14px 0 0;">Requesting a spot doesn't guarantee one, but if the roster's full you're still welcome to come through and watch.</p>
    `),
  };
}

export function playerApproved(ctx: EventEmailContext) {
  return {
    subject: `You're on the roster — ${ctx.eventTitle}`,
    html: shell(`
      ${heading("You're on the roster.")}
      ${greet(ctx.memberName)}
      <p style="margin:0 0 14px;">You've got a playing spot. Come ready to run — bring two pairs of socks.</p>
      ${detailBlock([
        ['Event', ctx.eventTitle],
        ['When', formatWhen(ctx.eventDate)],
        ['Address', ctx.venueAddress ?? ctx.location ?? 'TBA'],
      ])}
      ${ctx.venueAddress ? `<p style="margin:14px 0 0;color:#5A6378;font-size:13px;">Please keep the address to yourself — it's shared with confirmed players only.</p>` : ''}
    `),
  };
}

export function playerWaitlisted(ctx: EventEmailContext) {
  return {
    subject: `Roster's full — come spectate? (${ctx.eventTitle})`,
    html: shell(`
      ${heading('The roster filled up.')}
      ${greet(ctx.memberName)}
      <p style="margin:0 0 14px;">
        We couldn't fit you into a playing spot this time — the roster capped out. That's it, nothing
        more to read into it.
      </p>
      <p style="margin:0 0 14px;">
        <strong>You're still very welcome to come through as a spectator.</strong> Same time, same place,
        and we'll get you on the court next run.
      </p>
      ${detailBlock([['Event', ctx.eventTitle], ['When', formatWhen(ctx.eventDate)], ['Where', ctx.location ?? 'TBA']])}
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
      ${detailBlock([['Event', ctx.eventTitle], ['When', formatWhen(ctx.eventDate)]])}
    `),
  };
}
