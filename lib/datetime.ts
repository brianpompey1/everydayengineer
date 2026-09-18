/**
 * Every event happens in New York, so every date and time is shown in New
 * York time — never in the server's timezone (UTC on Netlify) or the viewer's.
 *
 * Formatting without an explicit timeZone made server-rendered pages show UTC
 * while client-rendered pages showed local time, so the same event appeared at
 * different times on different pages. Always format through these helpers.
 */
export const EVENT_TZ = 'America/New_York';

type DateInput = string | Date;

export function formatET(date: DateInput, opts: Intl.DateTimeFormatOptions): string {
  return new Date(date).toLocaleString('en-US', { ...opts, timeZone: EVENT_TZ });
}

/** Calendar date of an instant as seen in New York. Month is 0-based. */
export function etDateParts(date: DateInput): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: EVENT_TZ, year: 'numeric', month: 'numeric', day: 'numeric',
  }).formatToParts(new Date(date));
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return { year: get('year'), month: get('month') - 1, day: get('day') };
}

/** "1:00 PM", or "1:00 PM – 3:00 PM" when an end time is known. */
export function formatTimeRange(start: DateInput, end?: DateInput | null): string {
  const t = (d: DateInput) => formatET(d, { hour: 'numeric', minute: '2-digit' });
  return end ? `${t(start)} – ${t(end)}` : t(start);
}
