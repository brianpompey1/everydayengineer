import { supabaseAdmin } from './supabase';
import { getEventCounts, type EventCounts } from './rsvps';

export const UNIVERSITIES = [
  'Morgan State University',
  'Auburn University',
  'Canisius University',
  'University at Buffalo',
] as const;

export interface EventRow {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  /** Private street address — email only. Never pass to a client component. */
  venue_address: string | null;
  /** Per-event instructions for confirmed attendees, one per line. */
  attendee_notes: string | null;
  /** False for participant-only events — no spectator option. */
  allow_spectators: boolean;
  /** Participants must confirm they are 21 or older. */
  requires_21_plus: boolean;
  /** Per-event waiver. Empty waiver_text means no waiver for this event. */
  waiver_title: string | null;
  waiver_text: string | null;
  waiver_agree_label: string | null;
  /** Price per participant in cents. Null for free events. */
  price_cents: number | null;
  event_date: string;
  end_date: string | null;
  cover_image: string | null;
  category: string | null;
  capacity: number | null;
  is_published: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  state: string | null;
  university: string | null;
  /** Spots taken: paid participants on paid events, approved ones otherwise. */
  rsvp_count?: number;
  counts?: EventCounts;
}

/** On a paid event, a spot is only taken once it's paid for. */
function spotsTaken(event: { price_cents: number | null }, counts: EventCounts | undefined): number {
  if (!counts) return 0;
  return event.price_cents ? counts.paid : counts.players;
}

/** Midnight this morning, so an event still shows on the day it happens. */
function todayCutoff(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export async function getPublishedEvents(): Promise<EventRow[]> {
  const { data, error } = await supabaseAdmin
    .from('events')
    .select('*')
    .eq('is_published', true)
    .gte('event_date', todayCutoff())
    .order('event_date', { ascending: true });

  if (error) throw error;

  const events = (data ?? []) as EventRow[];
  const counts = await getEventCounts(events.map((e) => e.id));

  return events.map((e) => ({
    ...e,
    counts: counts[e.id],
    rsvp_count: spotsTaken(e, counts[e.id]),
  }));
}

export async function getEventById(id: string): Promise<EventRow | null> {
  const { data, error } = await supabaseAdmin
    .from('events')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const counts = await getEventCounts([id]);
  return {
    ...(data as EventRow),
    counts: counts[id],
    rsvp_count: spotsTaken(data as EventRow, counts[id]),
  };
}

export async function getMemberRsvpStatus(eventId: string, memberId: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin
    .from('rsvps')
    .select('status')
    .eq('event_id', eventId)
    .eq('member_id', memberId)
    .maybeSingle();

  if (error) throw error;
  return data?.status ?? null;
}

export async function getMemberRsvpMap(memberId: string): Promise<Record<string, string>> {
  const { data, error } = await supabaseAdmin
    .from('rsvps')
    .select('event_id, status')
    .eq('member_id', memberId);

  if (error) throw error;

  return Object.fromEntries((data ?? []).map((r) => [r.event_id, r.status]));
}
